import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { evaluateRegime } from "@/lib/regime";
import { buildRulesReport } from "@/lib/rules-report";
import { createDashboardSnapshot, createSnapshotRefresher } from "@/lib/dashboard-snapshot";
import type { DashboardPayload, MetricObservation, ObservationKey, RegimeInputs, RegimeSensitivity } from "@/lib/types";
import { RegimeDashboard } from "./regime-dashboard";

function inputs(): RegimeInputs {
  const factor = (score: number) => ({
    bounds: { lower: score, upper: score }, coverage: 1, eligibleFamilies: 2,
    configuredFamilies: 2, historyYears: 10, releaseQuality: 1,
  });
  return {
    factors: {
      inflation: factor(30), growth: factor(25), labor: factor(30),
      policyRates: factor(30), creditConditions: factor(25), liquidityProxy: factor(35),
    },
    native: { deltaPi: 0, realPolicyRate: 1, deltaR: 0, deltaTarget: 0, deltaP: 0, worseningMomenta: 0 },
    qualitySlots: [{ weight: 1, eligible: true, freshness: 1, history: 1, release: 1, fetchHealth: 1 }],
  };
}

function payload(source = inputs(), generatedAt = "2026-10-10T13:00:00Z"): DashboardPayload {
  const keys: ObservationKey[] = [
    "cpi", "coreCpi", "oil", "broadDollarIndex", "twoYearYield", "tenYearRealYield",
    "joblessClaims", "mempoolVsize", "mempoolMedianFeeRate", "usdidr", "btcPrice",
    "hySpread", "goldPrice", "stablecoinMarketCap",
  ];
  return {
    generatedAt, dataAsOf: "2026-10-09", sourceRegistry: [],
    observations: Object.fromEntries(keys.map((key): [ObservationKey, MetricObservation] => [key, {
      key, label: key, value: null, unit: "test units", source: "Test source", sourceUrl: null,
      observedAt: null, fetchedAt: generatedAt, cadence: "Daily", status: "unavailable",
      detail: "Monitoring is separate from core assessment inputs.", history: [],
    }])) as DashboardPayload["observations"], scores: [],
    regime: evaluateRegime(source), researchImplications: null,
  };
}

function mixedInputs(): RegimeInputs {
  const source = inputs();
  source.factors.inflation.bounds = { lower: 55, upper: 55 };
  source.factors.labor = { ...source.factors.labor, coverage: 0.65, configuredFamilies: 3 };
  source.factors.creditConditions = { ...source.factors.creditConditions, coverage: 0.7, configuredFamilies: 3 };
  source.factors.liquidityProxy = { ...source.factors.liquidityProxy, bounds: null, coverage: 0.5, eligibleFamilies: 1 };
  return source;
}

function explanation(data: DashboardPayload): string {
  const markup = renderToStaticMarkup(<RegimeDashboard payload={data} />);
  const section = markup.match(/<section aria-labelledby="assessment-explanation-title"[^>]*>[\s\S]*?<\/section>/)?.[0];
  expect(section, "The displayed snapshot needs its own assessment explanation").toBeDefined();
  return section!;
}

const fragile: RegimeSensitivity = {
  classification: "FRAGILE", same: 30, total: 34, singleAgreement: 93.75,
  coherentAgreement: 0, agreement: 0, nativeGuardChanged: false,
  differentResolvedRegime: false, differentNamedRegime: false,
};

describe("snapshot-backed assessment explanations", () => {
  it("places compact explanations immediately after the hero, before the six-factor grid", () => {
    const markup = renderToStaticMarkup(<RegimeDashboard payload={payload()} />);
    const panel = explanation(payload());
    expect(markup.indexOf('aria-labelledby="assessment-explanation-title"')).toBeGreaterThan(markup.indexOf('aria-label="U.S. macro regime"'));
    expect(markup.indexOf('aria-labelledby="assessment-explanation-title"')).toBeLessThan(markup.indexOf('aria-labelledby="core-data-coverage-title"'));
    expect(panel).toContain("Why this regime?");
    expect(panel).toContain("Why this assessment status?");
    expect(panel).toContain("What makes the result sensitive?");
    expect(panel.match(/<details/g)).toHaveLength(3);
    expect(panel).not.toContain(" open=");
  });

  it("explains a NORMAL named regime from its proven positive rule without claiming individual predicates", () => {
    const data = payload();
    expect(data.regime).toMatchObject({ assessmentStatus: "NORMAL", regime: "GOLDILOCKS" });
    const panel = explanation(data);
    expect(panel).toContain("Goldilocks");
    expect(panel).toContain("positive rule is proven TRUE");
    expect(panel).toContain("The evaluator reports NORMAL quality");
    expect(panel).toContain("Individual predicate attribution is unavailable");
    expect(panel).not.toContain("Labor is the cause");
    expect(panel).not.toContain("Confirmed NORMAL-quality blockers");
  });

  it("explains PROVISIONAL / MIXED as resolved outside positive envelopes, not a missing-data fallback", () => {
    const data = payload(mixedInputs());
    expect(data.regime).toMatchObject({ assessmentStatus: "PROVISIONAL", regime: "MIXED" });
    const panel = explanation(data);
    expect(panel).toContain("outside every named regime");
    expect(panel).toContain("not a missing-data fallback");
    expect(panel).toContain("Labor: 65% coverage");
    expect(panel).toContain("Neither supporting factor reaches 80% coverage");
    expect(panel).toContain("Credit Conditions 70%");
    expect(panel).toContain("System Liquidity Proxy 50%");
    expect(panel).not.toContain("No regime is assigned");
  });

  it("retains an assigned named regime under PROVISIONAL and displays only recorded opposing evidence", () => {
    const source = inputs();
    source.factors.labor.historyYears = 3;
    const data = payload(source);
    data.regime.tensions = [{ code: "activity_credit_tension", severity: 25, scope: "core", clarityRole: "RESIDUAL_TENSION" }];
    expect(data.regime).toMatchObject({ assessmentStatus: "PROVISIONAL", regime: "GOLDILOCKS" });
    const panel = explanation(data);
    expect(panel).toContain("positive rule is proven TRUE");
    expect(panel).toContain("activity_credit_tension");
    expect(panel).toContain("25");
    expect(panel).toContain("limited_history:labor");
    expect(panel).toContain("not an exhaustive account");
    expect(panel).not.toContain("Labor: 100% coverage, below");
  });

  it("leaves a PROVISIONAL null regime unresolved when admissible evidence is ambiguous", () => {
    const source = inputs();
    source.native.deltaPi = null;
    const data = payload(source);
    expect(data.regime).toMatchObject({ assessmentStatus: "PROVISIONAL", regime: null });
    const panel = explanation(data);
    expect(panel).toContain("No regime could be established from the admissible evidence");
    expect(panel).toContain("missing_data_ambiguity");
    expect(panel).toContain("UNKNOWN");
    expect(panel).not.toContain("outside every named regime");
    expect(panel).not.toContain("Mixed is assigned");
  });

  it("explains an INSUFFICIENT_DATA anchor failure without calling it economic disagreement", () => {
    const source = mixedInputs();
    source.factors.labor = { ...source.factors.labor, bounds: null, coverage: 0.4, eligibleFamilies: 1 };
    const data = payload(source);
    expect(data.regime).toMatchObject({ assessmentStatus: "INSUFFICIENT_DATA", regime: null });
    const panel = explanation(data);
    expect(panel).toContain("Mandatory evidence requirements are not met");
    expect(panel).toContain("Labor");
    expect(panel).toContain("3/4 mandatory anchors");
    expect(panel).toContain("UNKNOWN");
    expect(panel).toContain("Sensitivity evidence is unavailable");
    expect(panel).not.toContain("Provisional describes");
    expect(panel).not.toContain("outside every named regime");
  });

  it("keeps a FALSE top-level gate distinct from UNKNOWN without fabricating the failing predicate", () => {
    const data = payload(mixedInputs());
    data.regime.regime = null;
    data.regime.ruleDiagnostics.GOLDILOCKS = { result: "UNKNOWN", support: 20, failedOrUnknownGates: ["mandatory_gate_unknown"] };
    const panel = explanation(data);
    expect(panel).toMatch(/data-rule="GOLDILOCKS"[\s\S]*?UNKNOWN/);
    expect(panel).toMatch(/data-rule="STAGFLATIONARY"[\s\S]*?FALSE/);
    expect(panel).toContain("mandatory_gate_unknown");
    expect(panel).toContain("mandatory_gate_false");
    expect(panel).not.toContain("HOT is false");
    expect(panel).not.toContain("RESILIENT is false");
    expect(panel).not.toContain("outside every named regime");
  });

  it("does not claim every named envelope is false when diagnostics are missing", () => {
    const data = payload(mixedInputs());
    delete (data.regime.ruleDiagnostics as Partial<typeof data.regime.ruleDiagnostics>).GOLDILOCKS;
    const panel = explanation(data);
    expect(panel).toContain("unavailable");
    expect(panel).not.toContain("outside every named regime");
    const goldilocks = panel.split('data-rule="GOLDILOCKS"')[1].split("data-rule=")[0];
    expect(goldilocks).toContain("Unavailable");
    expect(goldilocks).not.toContain(">FALSE<");
  });

  it("reports a rule-configuration conflict rather than assuming every insufficient state has an anchor outage", () => {
    const data = payload();
    data.regime = { ...data.regime, assessmentStatus: "INSUFFICIENT_DATA", regime: null, reasonCodes: ["rule_configuration_conflict"], sensitivity: null };
    const panel = explanation(data);
    expect(panel).toContain("rule_configuration_conflict");
    expect(panel).not.toContain("Unclassifiable anchors: Inflation");
    expect(panel).not.toContain("outside every named regime");
  });

  it("separates proven coverage/native limits from unavailable factor-level history and release-quality diagnostics", () => {
    const source = mixedInputs();
    source.native.deltaPi = null;
    const panel = explanation(payload(source));
    expect(panel).toContain("native inflation-change comparison is unavailable");
    expect(panel).toContain("Factor-level history and release-quality diagnostics are unavailable");
    expect(panel).toContain("not an exhaustive account");
    expect(panel).toContain("5-year reference history");
    expect(panel).toContain("release quality of at least 0.8");
    expect(panel).toContain("Source availability, factor classifiability and NORMAL-quality eligibility are distinct");
    expect(panel).not.toContain("Labor has fewer than five years");
  });

  it.each(["creditConditions", "liquidityProxy"] as const)("does not blame an unused supporting outage when %s can meet NORMAL quality", (support) => {
    const source = inputs();
    const other = support === "creditConditions" ? "liquidityProxy" : "creditConditions";
    source.factors.inflation.bounds = { lower: 70, upper: 70 };
    source.factors[other] = { ...source.factors[other], bounds: null, coverage: 0.5, eligibleFamilies: 1 };
    const data = payload(source);
    expect(data.regime.assessmentStatus).toBe("NORMAL");
    const panel = explanation(data);
    expect(panel).toContain("at least one supporting factor");
    expect(panel).not.toContain("Neither supporting factor reaches");
    expect(panel).not.toContain("Both supporting factors must");
  });

  it.each([
    [fragile, "FRAGILE", "93.75%", "0%"],
    [{ ...fragile, classification: "MODERATELY_SENSITIVE", same: 32, singleAgreement: 93.75, coherentAgreement: 100, agreement: 93.75 }, "MODERATELY SENSITIVE", "93.75%", "100%"],
    [{ ...fragile, classification: "ROBUST", same: 34, singleAgreement: 100, coherentAgreement: 100, agreement: 100 }, "ROBUST", "100%", "100%"],
  ] as const)("preserves %s sensitivity evidence without inventing a threshold cause", (sensitivity, label, single, coherent) => {
    const data = payload(mixedInputs());
    data.regime.sensitivity = sensitivity;
    const panel = explanation(data);
    expect(panel).toContain(label);
    expect(panel).toContain(`${sensitivity.same}/${sensitivity.total}`);
    expect(panel).toContain(`Individual-cutoff agreement: ${single}`);
    expect(panel).toContain(`Coherent-shift agreement: ${coherent}`);
    expect(panel).toContain("deterministic checks, not probabilities");
    expect(panel).toContain("Factor-specific sensitivity attribution is unavailable");
    expect(panel).toContain("unresolved result counts as disagreement");
    expect(panel).not.toContain("Labor is near its threshold");
  });

  it.each([true, false])("preserves the evaluated native-guard change flag (%s)", (changed) => {
    const data = payload(mixedInputs());
    data.regime.sensitivity = { ...fragile, nativeGuardChanged: changed };
    const panel = explanation(data);
    expect(panel).toContain(`Native guard changed the result: ${changed ? "Yes" : "No"}`);
    expect(panel).toContain("Another resolved regime appeared: No");
    expect(panel).toContain("Another named regime appeared: No");
    expect(panel).not.toContain("changed to Goldilocks");
  });

  it("does not reconstruct sensitivity attribution or history failures from missing evidence", () => {
    const data = payload(mixedInputs());
    data.regime.sensitivity = null;
    data.regime.reasonCodes = [];
    const panel = explanation(data);
    expect(panel).toContain("Sensitivity evidence is unavailable");
    expect(panel).toContain("No recorded reason codes");
    expect(panel).toContain("Individual predicate attribution is unavailable");
    expect(panel).not.toContain("Individual-cutoff agreement: 0%");
  });

  it("leaves identical model inputs, economic output and deterministic brief unchanged after rendering", () => {
    const source = mixedInputs();
    const data = payload(source);
    const before = JSON.stringify({ source, data, report: buildRulesReport(data) });
    Object.freeze(data.regime);
    explanation(data);
    expect(evaluateRegime(source)).toEqual(data.regime);
    expect(JSON.stringify({ source, data, report: buildRulesReport(data) })).toBe(before);
  });

  it("keeps explanations, overview and brief atomic through healthy, pending failure, and recovery snapshots", async () => {
    const healthy = payload(mixedInputs());
    const failureInputs = mixedInputs();
    failureInputs.factors.labor = { ...failureInputs.factors.labor, bounds: null, coverage: 0.4, eligibleFamilies: 1 };
    const failed = payload(failureInputs, "2026-10-10T13:10:00Z");
    const recovered = payload(mixedInputs(), "2026-10-10T13:20:00Z");
    let current = createDashboardSnapshot(healthy);
    let resolve!: (data: DashboardPayload) => void;
    let loads = 0;
    const refresh = createSnapshotRefresher(current, () => {
      loads += 1;
      return new Promise<DashboardPayload>((done) => { resolve = done; });
    }, (next) => { current = next; });
    const check = (status: string, regime: string | null, asOf: string) => {
      const panel = explanation(current.payload);
      expect(panel).toContain(`data-snapshot-id="${asOf}"`);
      expect(panel).toContain(`data-assessment-status="${status}"`);
      expect(panel).toContain(`data-regime="${regime ?? ""}"`);
      expect(current.report).toMatchObject({ generatedAt: asOf, assessmentStatus: status, regime });
    };
    check("PROVISIONAL", "MIXED", healthy.generatedAt);
    const first = refresh();
    expect(refresh()).toBe(first);
    expect(loads).toBe(1);
    check("PROVISIONAL", "MIXED", healthy.generatedAt);
    resolve(failed);
    await first;
    check("INSUFFICIENT_DATA", null, failed.generatedAt);
    const recovery = refresh();
    check("INSUFFICIENT_DATA", null, failed.generatedAt);
    resolve(recovered);
    await recovery;
    check("PROVISIONAL", "MIXED", recovered.generatedAt);
    const stale = refresh();
    resolve(failed);
    await expect(stale).rejects.toThrow(/older/i);
    check("PROVISIONAL", "MIXED", recovered.generatedAt);
  });
});
