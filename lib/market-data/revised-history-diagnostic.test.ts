import { describe, expect, it } from "vitest";
import { evaluateRegime } from "@/lib/regime";
import type { Regime, RegimeAssessment, RegimeFactorKey, RegimeSensitivity } from "@/lib/types";
import { buildCoreFactors } from "./core-factors";
import { createRegimeInputsFromCoreFactors } from "./regime-inputs";
import { getSourceRegistry } from "./source-registry";
import type { CoreFactorsResult, CoreObservationSeriesResult } from "./types";
import {
  buildDiagnosticCalendar,
  comparePriorTensions,
  createDiagnosticSnapshot,
  executeCurrentRevisedHistoryDiagnostic,
  getDiagnosticInspectionWindow,
  renderDiagnosticMarkdown,
  runCurrentRevisedHistoryDiagnostic,
  summarizeRegimeHistory,
} from "./revised-history-diagnostic";

function mark(
  period: string,
  regime: Regime | null,
  options: { status?: "NORMAL" | "PROVISIONAL" | "INSUFFICIENT_DATA"; sensitivity?: RegimeSensitivity | null } = {},
) {
  return {
    period,
    regime,
    assessmentStatus: options.status ?? "NORMAL",
    sensitivity: options.sensitivity ?? null,
  };
}

const fragileSensitivity: RegimeSensitivity = {
  classification: "FRAGILE",
  same: 32,
  total: 34,
  singleAgreement: 1,
  coherentAgreement: 0.5,
  agreement: 50,
  nativeGuardChanged: false,
  differentResolvedRegime: true,
  differentNamedRegime: true,
};

const factorKeys: RegimeFactorKey[] = [
  "inflation", "growth", "labor", "policyRates", "creditConditions", "liquidityProxy",
];

function classifiableCore(growthFamilyOffset = 0): CoreFactorsResult {
  const core = buildCoreFactors([], "2020-01-31T23:59:59.999Z", { mode: "current-revised-history" });
  for (const key of factorKeys) {
    const factor = core.factors[key];
    const offset = key === "growth" ? growthFamilyOffset : 0;
    const eligibleKeys = new Set(factor.families.slice(offset, offset + 2).map(({ key: familyKey }) => familyKey));
    factor.coverage = 0.8;
    factor.eligibleFamilies = 2;
    factor.bounds = { lower: 20, upper: 60 };
    factor.families = factor.families.map((family) => ({ ...family, eligible: eligibleKeys.has(family.key) }));
  }
  return core;
}

function cpiHistoryWithOctoberGap(): CoreObservationSeriesResult {
  const months = Array.from({ length: 14 }, (_, index) => {
    const serial = 2024 * 12 + 10 + index;
    const year = Math.floor((serial - 1) / 12);
    const month = serial - year * 12;
    return `${year}-${String(month).padStart(2, "0")}-01`;
  }).filter((period) => period !== "2025-10-01");
  return {
    sourceId: "bls-cpi",
    identifier: "CUUR0000SA0L1E",
    state: "AVAILABLE",
    observations: months.map((observedAt, index) => ({
      sourceId: "bls-cpi",
      identifier: "CUUR0000SA0L1E",
      value: 300 + index,
      unit: "index (1982-84=100)",
      seasonalBasis: "NSA",
      observedAt,
      releasedAt: null,
      retrievedAt: "2026-10-04T12:00:00.000Z",
      firstSeenAt: null,
      releaseDateQuality: 0,
      version: null,
      vintage: null,
    })),
    parserStatus: "VERIFIED",
    historyStatus: "PARTIAL",
    retrievedAt: "2026-10-04T12:00:00.000Z",
    reason: null,
    missingPeriods: ["2025-10-01"],
  };
}

function classifiableAssessment(status: RegimeAssessment["assessmentStatus"] = "NORMAL"): Pick<
  RegimeAssessment,
  "assessmentStatus" | "factorReadiness" | "tensions"
> {
  return {
    assessmentStatus: status,
    factorReadiness: Object.fromEntries(factorKeys.map((key) => [key, {
      coverage: 0.8,
      eligibleFamilies: 2,
      configuredFamilies: 2,
      classifiable: true,
      status: "READY",
    }])) as RegimeAssessment["factorReadiness"],
    tensions: [{
      code: "activity_labor_divergence",
      severity: 40,
      scope: "core",
      clarityRole: "RESIDUAL_TENSION",
    }],
  };
}

describe("current/revised-history diagnostic", () => {
  it("compares prior tensions only when all factors and eligible-family sets are comparable", () => {
    const previousCore = classifiableCore();
    const currentCore = classifiableCore();
    const assessment = classifiableAssessment();
    expect(comparePriorTensions(previousCore, assessment, currentCore)).toEqual({
      comparable: true,
      tensions: assessment.tensions,
    });
    expect(comparePriorTensions(previousCore, assessment, classifiableCore(1))).toEqual({ comparable: false, tensions: [] });
    expect(comparePriorTensions(previousCore, classifiableAssessment("INSUFFICIENT_DATA"), currentCore))
      .toEqual({ comparable: false, tensions: [] });

    const unclassifiableAssessment = classifiableAssessment();
    unclassifiableAssessment.factorReadiness.growth.classifiable = false;
    expect(comparePriorTensions(previousCore, unclassifiableAssessment, currentCore)).toEqual({ comparable: false, tensions: [] });

    const unclassifiableCurrent = classifiableCore();
    unclassifiableCurrent.factors.growth.coverage = 0.59;
    expect(comparePriorTensions(previousCore, assessment, unclassifiableCurrent)).toEqual({ comparable: false, tensions: [] });
  });

  it("includes the required pre-period warm-up without shifting snapshot boundaries", () => {
    const calendar = buildDiagnosticCalendar("2015-01", "2015-02", 14);

    expect(calendar.warmupMonths).toHaveLength(14);
    expect(calendar.warmupMonths[0]).toBe("2013-11");
    expect(calendar.warmupMonths.at(-1)).toBe("2014-12");
    expect(calendar.snapshotMonths).toEqual(["2015-01", "2015-02"]);
  });

  it("assigns the approved historical inspection windows on exact inclusive boundaries", () => {
    expect(getDiagnosticInspectionWindow("2017-01")?.id).toBe("2017-2019");
    expect(getDiagnosticInspectionWindow("2019-12")?.id).toBe("2017-2019");
    expect(getDiagnosticInspectionWindow("2020-01")?.id).toBe("2020");
    expect(getDiagnosticInspectionWindow("2024-12")?.id).toBe("2023-2024");
    expect(getDiagnosticInspectionWindow("2025-01")?.id).toBe("2025");
    expect(getDiagnosticInspectionWindow("2026-01")).toBeNull();
  });

  it("flags short named episodes, excessive annual changes, prolonged MIXED, and threshold sensitivity", () => {
    const history = [
      mark("2020-01", "GOLDILOCKS"),
      mark("2020-02", "INFLATIONARY_EXPANSION"),
      mark("2020-03", "GOLDILOCKS"),
      mark("2020-04", "INFLATIONARY_EXPANSION"),
      mark("2020-05", "GOLDILOCKS"),
      mark("2020-06", "INFLATIONARY_EXPANSION"),
      mark("2020-07", "MIXED"),
      mark("2020-08", "MIXED"),
      mark("2020-09", "MIXED"),
      mark("2020-10", "MIXED"),
      mark("2020-11", "MIXED"),
      mark("2020-12", "MIXED", { sensitivity: fragileSensitivity }),
    ];

    const summary = summarizeRegimeHistory(history);

    expect(summary.namedChangesByYear["2020"]).toBe(5);
    expect(summary.flags).toEqual(expect.arrayContaining([
      expect.objectContaining({ code: "SHORT_NAMED_DURATION", periodStart: "2020-01", durationMonths: 1 }),
      expect.objectContaining({ code: "HIGH_NAMED_CHANGES", periodStart: "2020-01", periodEnd: "2020-12" }),
      expect.objectContaining({ code: "PROLONGED_MIXED_NO_ENVELOPE", periodStart: "2020-07", durationMonths: 6 }),
      expect.objectContaining({ code: "THRESHOLD_SENSITIVE", periodStart: "2020-12", severity: "FRAGILE" }),
    ]));
  });

  it("does not count a data-withheld month as an economic regime flip", () => {
    const summary = summarizeRegimeHistory([
      mark("2020-01", "GOLDILOCKS"),
      mark("2020-02", null, { status: "INSUFFICIENT_DATA" }),
      mark("2020-03", "INFLATIONARY_EXPANSION"),
    ]);

    expect(summary.namedChangesByYear["2020"] ?? 0).toBe(0);
  });

  it("retains factor bounds, readiness, rule diagnostics, tensions, directions, risk, sensitivity, and source gaps", () => {
    const core = buildCoreFactors([], "2020-01-31T23:59:59.999Z", { mode: "current-revised-history" });
    const assessment = evaluateRegime(createRegimeInputsFromCoreFactors(core));
    const staleMixedAssessment = {
      ...assessment,
      assessmentStatus: "PROVISIONAL" as const,
      regime: "MIXED" as const,
      ruleDiagnostics: {
        ...assessment.ruleDiagnostics,
        MIXED: { ...assessment.ruleDiagnostics.MIXED, result: "TRUE" as const },
      },
    };
    const snapshot = createDiagnosticSnapshot("2020-01", core, staleMixedAssessment, ["CPI endpoint unavailable"], {
      status: "NOT_EVALUATED",
      reason: "The CPI YoY endpoint was missing.",
    });

    expect(snapshot).toMatchObject({
      period: "2020-01",
      evaluationStatus: "NOT_EVALUATED",
      assessmentStatus: "INSUFFICIENT_DATA",
      regime: null,
      evaluationReason: "The CPI YoY endpoint was missing.",
      ruleDiagnostics: { MIXED: { result: "UNKNOWN" } },
      factors: {
        growth: { score: null, coverage: 0, eligibleFamilies: 0, configuredFamilies: 5, status: "WITHHELD" },
      },
      dataQuality: assessment.dataQuality,
      regimeClarity: assessment.regimeClarity,
      tensions: assessment.tensions,
      leadingDirection: assessment.leadingDirection,
      inflationDirection: assessment.inflationDirection,
      transitionRisk: assessment.transitionRisk,
      thresholdSensitivity: assessment.sensitivity,
      sourceGaps: ["CPI endpoint unavailable"],
    });
  });

  it("returns NOT RUN with zero snapshots when Treasury reuse is unresolved", () => {
    const sourceRegistry = getSourceRegistry().map((source) => source.id === "treasury-real-yield"
      ? { ...source, sourceHealth: "REDISTRIBUTION_BLOCKED" as const, reuseStatus: "UNRESOLVED" as const }
      : source);
    const result = runCurrentRevisedHistoryDiagnostic({
      sourceRegistry,
      series: [],
      startMonth: "2015-01",
      endMonth: "2015-01",
    });
    const markdown = renderDiagnosticMarkdown(result);

    expect(result.status).toBe("NOT_RUN");
    expect(result.snapshots).toEqual([]);
    expect(result.blockers.join(" ")).toContain("treasury-real-yield");
    expect(result.blockers.join(" ")).toContain("POLICY_RATES_WITHHELD");
    expect(result.sourceGaps.join(" ")).toContain("growth.housing");
    expect(result.sourceGaps.join(" ")).toContain("housing source family has not been implemented");
    expect(result.vintageDisclaimer.toLowerCase()).toContain("not point-in-time");
    expect(markdown).toContain("CURRENT / REVISED-HISTORY DIAGNOSTIC");
    expect(markdown).toContain("NOT RUN");
    expect(markdown).toContain("No monthly snapshots were generated");
  });

  it("marks data-insufficient months NOT EVALUATED and continues the diagnostic calendar", () => {
    const sourceRegistry = getSourceRegistry().map((source) => source.id === "treasury-real-yield"
      ? { ...source, sourceHealth: "AVAILABLE" as const, reuseStatus: "CLEARED" as const }
      : source);
    const result = runCurrentRevisedHistoryDiagnostic({
      sourceRegistry,
      series: [],
      startMonth: "2015-01",
      endMonth: "2015-02",
    });

    expect(result.status).toBe("COMPLETE");
    expect(result.blockers).toEqual([]);
    expect(result.snapshots).toHaveLength(2);
    expect(result.snapshots.map(({ evaluationStatus }) => evaluationStatus)).toEqual(["NOT_EVALUATED", "NOT_EVALUATED"]);
    expect(result.snapshots.every(({ assessmentStatus, regime }) => assessmentStatus === "INSUFFICIENT_DATA" && regime === null)).toBe(true);
    expect(result.snapshots.some(({ sourceGaps }) => sourceGaps.some((gap) => gap.includes("2015-01") && gap.includes("CPI")))).toBe(true);
    expect(result.summary.episodes).toEqual([]);
  });

  it("marks only the CPI-gap window with its missing endpoint and continues to later snapshots", () => {
    const sourceRegistry = getSourceRegistry().map((source) => source.id === "treasury-real-yield"
      ? { ...source, sourceHealth: "AVAILABLE" as const, reuseStatus: "CLEARED" as const }
      : source);
    const result = runCurrentRevisedHistoryDiagnostic({
      sourceRegistry,
      series: [cpiHistoryWithOctoberGap()],
      startMonth: "2025-10",
      endMonth: "2025-11",
    });
    const october = result.snapshots[0];
    const november = result.snapshots[1];

    expect(result.status).toBe("COMPLETE");
    expect(result.snapshots).toHaveLength(2);
    expect(october.evaluationStatus).toBe("NOT_EVALUATED");
    expect(october.evaluationReason).toContain("exact index endpoint(s) unavailable: 2025-10-01");
    expect(november.evaluationReason).not.toContain("CPI core YoY window is NOT EVALUATED");
    expect(october.regime).toBeNull();
    expect(november.regime).toBeNull();
    expect(result.summary.episodes).toEqual([]);
  });

  it("does not invoke external source fetches before an unresolved source gate", async () => {
    let loaded = false;
    const result = await executeCurrentRevisedHistoryDiagnostic({
      sourceRegistry: getSourceRegistry().map((source) => source.id === "treasury-real-yield"
        ? { ...source, sourceHealth: "REDISTRIBUTION_BLOCKED" as const, reuseStatus: "UNRESOLVED" as const }
        : source),
      loadSeries: async () => {
        loaded = true;
        return [];
      },
      startMonth: "2015-01",
      endMonth: "2015-01",
    });

    expect(loaded).toBe(false);
    expect(result.status).toBe("NOT_RUN");
    expect(result.snapshots).toEqual([]);
  });
});
