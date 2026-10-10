import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import type {
  AIReport,
  CategoryScore,
  DashboardPayload,
  MetricObservation,
  ObservationKey,
  RegimeInputs,
  RegimeFactorKey,
  ScoreKey,
} from "@/lib/types";
import { evaluateRegime } from "@/lib/regime";
import { createUnconfiguredRegimeInputs } from "@/lib/market-data/regime-inputs";
import { getSourceRegistry } from "@/lib/market-data/source-registry";
import { getResearchImplications } from "@/lib/playbook";
import { chartDateTicks, CoreFactorReadiness, CoreSourceRegistry, formatChartDate, observationFreshness, ObservationTable, RegimeDashboard, ReportCard } from "./regime-dashboard";

const keys: ObservationKey[] = [
  "cpi", "coreCpi", "oil", "broadDollarIndex", "twoYearYield", "tenYearRealYield",
  "joblessClaims", "mempoolVsize", "mempoolMedianFeeRate", "usdidr", "btcPrice",
  "hySpread", "goldPrice", "stablecoinMarketCap",
];
const excludedKeys: ObservationKey[] = ["btcPrice", "hySpread", "goldPrice", "stablecoinMarketCap"];
const labels: Record<ObservationKey, string> = {
  cpi: "CPI",
  coreCpi: "Core CPI",
  oil: "Brent crude",
  broadDollarIndex: "Broad Dollar Index",
  twoYearYield: "2-year Treasury yield",
  tenYearRealYield: "10-year real yield",
  joblessClaims: "Initial claims (SA)",
  mempoolVsize: "Bitcoin mempool backlog",
  mempoolMedianFeeRate: "Projected block median fee",
  usdidr: "USD / IDR (ECB cross)",
  btcPrice: "BTC spot price",
  hySpread: "High-yield spread",
  goldPrice: "Gold spot price",
  stablecoinMarketCap: "Stablecoin market capitalization",
};
const scores: CategoryScore[] = [
  ["inflationPressure", "Inflation pressure", 48, "risk"],
  ["growthStress", "Growth stress", null, "risk"],
  ["liquidity", "Legacy Liquidity Monitor", 64, "support"],
  ["cryptoDemand", "Bitcoin Blockspace Activity", 58, "demand"],
  ["indonesiaRisk", "Indonesia risk", 51, "risk"],
].map(([key, label, score, orientation]) => ({
  key: key as ScoreKey,
  label: label as CategoryScore["label"],
  score: score as number | null,
  coverage: score === null ? 0.35 : 1,
  coveragePercent: score === null ? 35 : 100,
  orientation: orientation as CategoryScore["orientation"],
  reading: score === null ? "Unavailable" : "Watch",
  summary: "Rules-based input summary.",
  explanation: score === null
    ? "Unavailable: 35% of configured input weight is observed; at least 60% is required."
    : "Based on all configured input weight.",
}));

function makeObservation(key: ObservationKey): MetricObservation {
  const excluded = excludedKeys.includes(key);
  const observedAt = key === "twoYearYield" ? "2026-09-20" : "2026-10-02";
  const available = !excluded && key !== "oil";
  return {
    key,
    label: labels[key],
    value: available ? 3 : null,
    unit: key === "cpi" || key === "coreCpi" ? "% YoY" : "test units",
    source: excluded ? "Not sourced in the public-data tier" : "Public test source",
    sourceUrl: null,
    observedAt: available ? observedAt : null,
    fetchedAt: "2026-10-03T12:00:00.000Z",
    cadence: key === "cpi" ? "Monthly" : key === "joblessClaims" ? "Weekly" : key.startsWith("mempool") ? "Current" : "Daily",
    status: excluded ? "excluded" : available ? "available" : "unavailable",
    detail: excluded
      ? "Excluded until redistribution rights are confirmed."
      : key === "broadDollarIndex"
        ? "Federal Reserve H.10 index; not ICE DXY."
        : key === "usdidr"
          ? "ECB-derived cross; not BI JISDOR or tradable spot FX."
          : "Test provider detail.",
    history: available && ["cpi", "coreCpi", "twoYearYield", "tenYearRealYield", "usdidr"].includes(key)
      ? [{ date: "2026-09-01", value: 2.8 }, { date: "2026-10-02", value: 3 }]
      : [],
  };
}

function payload(): DashboardPayload {
  return {
    generatedAt: "2026-10-03T12:00:00.000Z",
    dataAsOf: "2026-10-02",
    sourceRegistry: [],
    observations: Object.fromEntries(keys.map((key) => [key, makeObservation(key)])) as DashboardPayload["observations"],
    scores,
    regime: evaluateRegime(createUnconfiguredRegimeInputs()),
    researchImplications: null,
  };
}

function resolvedInputs(): RegimeInputs {
  const factor = (score: number) => ({
    bounds: { lower: score, upper: score },
    coverage: 1,
    eligibleFamilies: 2,
    historyYears: 10,
    releaseQuality: 1,
  });
  const factors: Record<RegimeFactorKey, ReturnType<typeof factor>> = {
    inflation: factor(30),
    growth: factor(25),
    labor: factor(30),
    policyRates: factor(30),
    creditConditions: factor(25),
    liquidityProxy: factor(35),
  };
  return {
    factors,
    native: {
      deltaPi: 0,
      realPolicyRate: 1,
      deltaR: 0,
      deltaTarget: 0,
      deltaP: 0,
      worseningMomenta: 0,
    },
    qualitySlots: Array.from({ length: 6 }, () => ({
      weight: 1 / 6,
      eligible: true,
      freshness: 1,
      history: 0.55,
      release: 1,
      fetchHealth: 1,
    })),
  };
}

describe("source-aware regime dashboard", () => {
  it("renders the overview and brief from the same initial cached snapshot without an independent request", () => {
    const data = payload();
    data.regime = { ...evaluateRegime(resolvedInputs()), assessmentStatus: "PROVISIONAL", regime: "MIXED", dataQuality: 60, regimeClarity: 43 };
    const markup = renderToStaticMarkup(<RegimeDashboard payload={data} />);
    expect(markup).toContain("U.S. Macro Regime Brief: Mixed");
    expect(markup).toContain(`data-snapshot-id="${data.generatedAt}"`);
    expect(markup).not.toContain("Loading the current coverage-aware brief");
    expect(markup).toContain("Core Model Data Quality 60/100");
    expect(markup).toContain("Regime Clarity 43/100");
  });

  it("keeps the prior coherent brief visible during refresh and transport failure", () => {
    const data = payload();
    const assessment = data.regime;
    const report: AIReport = {
      generatedAt: data.generatedAt, dataAsOf: data.dataAsOf, title: "Previous coherent coverage brief", regime: assessment.regime,
      assessmentStatus: assessment.assessmentStatus, dataQuality: assessment.dataQuality, regimeClarity: assessment.regimeClarity,
      leadingDirection: assessment.leadingDirection, inflationDirection: assessment.inflationDirection, transitionRisk: assessment.transitionRisk,
      executiveSummary: "Previous complete narrative", signals: ["Previous reading"], watchlist: ["Previous watchlist"],
      researchImplications: null, riskNote: "Previous limitations", source: "rules-based",
    };
    for (const state of [{ loading: true, error: null }, { loading: false, error: "Refresh failed; previous snapshot retained." }]) {
      const markup = renderToStaticMarkup(<ReportCard report={report} {...state} onRefresh={() => {}} />);
      expect(markup).toContain(report.title);
      expect(markup).toContain(report.signals[0]);
      expect(markup).toContain(report.watchlist[0]);
    }
  });
  it("keeps the regime hero independent of factor coverage and research independent of charts", () => {
    const data = payload();
    data.regime = { ...evaluateRegime(resolvedInputs()), assessmentStatus: "PROVISIONAL", regime: "MIXED", dataQuality: 60, regimeClarity: 43 };
    const markup = renderToStaticMarkup(<RegimeDashboard payload={data} />);
    const hero = markup.match(/<section aria-label="U.S. macro regime"[^>]*>([\s\S]*?)<\/section>/)?.[1];
    const implications = markup.match(/<section aria-label="Research implications"[^>]*>([\s\S]*?)<\/section>/)?.[1];

    expect(hero).toBeDefined();
    expect(hero).toContain("Mixed");
    expect(hero).toContain("Provisional");
    expect(hero).toContain("Core Model Data Quality");
    expect(hero).toContain("Regime Clarity");
    expect(hero).toContain("Sensitivity");
    expect(hero).toContain("02 Oct 2026");
    expect(hero).not.toContain("families eligible");
    expect(implications).toContain("Mixed is the current provisional macro regime.");
    expect(implications).not.toContain("Provider history");
    expect(markup.indexOf("Core data coverage")).toBeGreaterThan(markup.indexOf("As of"));
  });

  it("presents six individually named factor cards without changing readings or withholding", () => {
    const data = payload();
    const inputs = resolvedInputs();
    inputs.factors.growth = { ...inputs.factors.growth, coverage: 0.875, eligibleFamilies: 4, configuredFamilies: 5 };
    inputs.factors.liquidityProxy = { ...inputs.factors.liquidityProxy, bounds: null, coverage: 0.5, eligibleFamilies: 1 };
    data.regime = evaluateRegime(inputs);
    const before = JSON.stringify(data);
    const markup = renderToStaticMarkup(<RegimeDashboard payload={data} />);
    const factors = Array.from(markup.matchAll(/<article aria-label="([^"]+)"[^>]*>([\s\S]*?)<\/article>/g));

    expect(factors).toHaveLength(6);
    expect(factors.find((match) => match[1] === "Growth")?.[2]).toContain("87.5%");
    expect(factors.find((match) => match[1] === "Growth")?.[2]).toContain("4/5 families eligible");
    expect(factors.find((match) => match[1] === "System Liquidity Proxy")?.[2]).toContain("WITHHELD");
    expect(factors.find((match) => match[1] === "System Liquidity Proxy")?.[2]).toContain("50%");
    expect(markup).toContain("NORMAL assessment quality");
    expect(JSON.stringify(data)).toBe(before);
  });

  it("keeps brief essentials and limitations visible while retaining the complete narrative in a disclosure", () => {
    expect(ReportCard).toBeTypeOf("function");
    const assessment = evaluateRegime(resolvedInputs());
    const report: AIReport = {
      generatedAt: "2026-10-03T12:00:00Z", dataAsOf: "2026-10-02", title: "U.S. Macro Regime Brief: Mixed",
      regime: "MIXED", assessmentStatus: "PROVISIONAL", dataQuality: 60, regimeClarity: 43,
      leadingDirection: assessment.leadingDirection, inflationDirection: assessment.inflationDirection,
      transitionRisk: assessment.transitionRisk, executiveSummary: "Complete technical narrative; exact original output.",
      signals: ["Key reading: inflation 48/100."], watchlist: ["Watch the missing source release."],
      researchImplications: null, riskNote: "Public observations may be delayed or revised. Educational research tool, not financial advice.", source: "rules-based",
    };
    const before = JSON.stringify(report);
    const markup = renderToStaticMarkup(<ReportCard report={report} loading={false} error={null} onRefresh={() => {}} />);
    const disclosure = markup.match(/<details[^>]*>[\s\S]*?<\/details>/)?.[0];
    const visible = markup.replace(/<details[^>]*>[\s\S]*?<\/details>/g, "");

    expect(disclosure).toContain("<summary");
    expect(disclosure).toContain(report.executiveSummary);
    expect(disclosure).not.toContain(" open=");
    expect(visible).toContain("Mixed");
    expect(visible).toContain("Provisional");
    expect(visible).toContain(report.signals[0]);
    expect(visible).toContain(report.watchlist[0]);
    expect(visible).toContain("Data limitations");
    expect(visible).toContain(report.riskNote);
    expect(JSON.stringify(report)).toBe(before);
  });

  it.each([
    ["2026-08-03", "Daily", "03 Aug 26"],
    ["2026-08-24", "Daily", "24 Aug 26"],
    ["2026-08-01", "Monthly", "Aug 26"],
    ["2025-12-27", "Weekly", "27 Dec 25"],
    ["2026-01-03T00:00:00+14:00", "Weekly", "03 Jan 26"],
  ] as const)("uses accurate calendar chart labels for %s (%s)", (date, cadence, expected) => {
    expect(formatChartDate).toBeTypeOf("function");
    expect(formatChartDate(date, cadence)).toBe(expected);
  });

  it("selects legible ticks only from actual dated points without filling gaps or mutating history", () => {
    expect(chartDateTicks).toBeTypeOf("function");
    const history = ["2025-08-01", "2025-09-01", "2025-11-01", "2025-12-01", "2026-01-01", "2026-02-01", "2026-03-01"]
      .map((date, index) => ({ date, value: index + 2 }));
    const before = JSON.stringify(history);
    expect(chartDateTicks(history)).toEqual(["2025-08-01", "2025-11-01", "2026-01-01", "2026-03-01"]);
    expect(chartDateTicks([])).toEqual([]);
    expect(chartDateTicks(history.slice(0, 2))).toEqual(["2025-08-01", "2025-09-01"]);
    expect(JSON.stringify(history)).toBe(before);
  });

  it("separates monitoring availability from the six-factor U.S. core model", () => {
    const markup = renderToStaticMarkup(<RegimeDashboard payload={payload()} />);

    expect(markup).toContain("Monitoring indicators 9/10 available");
    expect(markup).toContain("Core factors 0/6 classifiable");
    expect(markup).toContain("Core data coverage");
    expect(markup).toContain("Inflation");
    expect(markup).toContain("Growth");
    expect(markup).toContain("0/5 families eligible");
    expect(markup).toContain("Labor");
    expect(markup).toContain("Policy / Rates");
    expect(markup).toContain("Credit Conditions");
    expect(markup).toContain("System Liquidity Proxy");
    expect(markup).toContain("Supplementary Monitoring — Not classifier inputs");
    expect(markup).toContain("U.S. data do not represent the world.");
    expect(markup).toContain("Core Model Data Quality");
    expect(markup).toContain("Bitcoin Blockspace Activity");
    expect(markup).toContain("Legacy Liquidity Monitor");
    expect(markup).not.toContain("Crypto demand");
  });

  it("renders withheld regimes, unavailable and excluded observations, proxy notes, and the disclaimer", () => {
    const data = payload();
    const markup = renderToStaticMarkup(<RegimeDashboard payload={data} />);
    const sources = renderToStaticMarkup(<ObservationTable payload={data} />);

    expect(markup).toContain("Regime withheld");
    expect(markup).toContain("Insufficient data");
    expect(markup).toContain("Data Quality");
    expect(markup).toContain("Regime Clarity");
    expect(markup).toContain("System Liquidity Proxy");
    expect(markup).toContain("monitoring indicator");
    expect(markup).toContain("Educational research tool, not financial advice.");
    expect(markup).not.toContain("Synthetic fixture");
    expect(markup).not.toContain("Stablecoins USD bn");
    expect(sources).toContain("Unavailable");
    expect(sources).toContain("Excluded");
    expect(sources).toContain("Available");
    expect(sources).toContain("Stale");
    expect(sources).toContain("Broad Dollar Index");
    expect(sources).toContain("not ICE DXY");
    expect(sources).toContain("not BI JISDOR");
  });

  it("marks daily observations stale beyond three days and uses a longer H.10 allowance", () => {
    const twoYear = makeObservation("twoYearYield");
    const broadDollar = { ...makeObservation("broadDollarIndex"), observedAt: "2026-09-19" };
    const weeklyClaims = { ...makeObservation("joblessClaims"), observedAt: "2026-09-18" };
    const monthlyCpi = { ...makeObservation("cpi"), observedAt: "2026-08-01" };
    const reference = "2026-10-03T12:00:00.000Z";

    expect(observationFreshness(twoYear, reference)).toBe("stale");
    expect(observationFreshness(broadDollar, reference)).toBe("current");
    expect(observationFreshness(weeklyClaims, reference)).toBe("stale");
    expect(observationFreshness(monthlyCpi, reference)).toBe("stale");
    expect(observationFreshness(makeObservation("usdidr"), reference)).toBe("current");
    expect(observationFreshness(makeObservation("oil"), reference)).toBe("unavailable");
    expect(observationFreshness(makeObservation("goldPrice"), reference)).toBe("excluded");
  });

  it.each([
    ["PROVISIONAL", "MIXED", "Mixed is the current provisional macro regime.", "Research implications are withheld because the assessment does not meet NORMAL-quality requirements."],
    ["PROVISIONAL", null, "No regime could be established from the admissible evidence.", "Research implications remain withheld while the assessment is provisional."],
    ["INSUFFICIENT_DATA", null, "Mandatory evidence requirements are not met and no regime is assigned.", "Research implications are withheld until the required evidence is available."],
  ] as const)("explains withheld research implications for %s / %s", (assessmentStatus, regime, description, reason) => {
    const data = payload();
    data.regime = { ...data.regime, assessmentStatus, regime };
    const before = JSON.stringify(data);
    const markup = renderToStaticMarkup(<RegimeDashboard payload={data} />);

    expect(markup).toContain(description);
    expect(markup).toContain(reason);
    expect(markup).not.toContain("No regime is assigned from the available feeds.");
    expect(markup).not.toContain("Research themes");
    expect(JSON.stringify(data)).toBe(before);
  });

  it("preserves research implications for NORMAL with an assigned regime", () => {
    const data = payload();
    data.regime = evaluateRegime(resolvedInputs());
    data.researchImplications = getResearchImplications("GOLDILOCKS");
    const before = JSON.stringify(data);
    const markup = renderToStaticMarkup(<RegimeDashboard payload={data} />);

    expect(data.regime.assessmentStatus).toBe("NORMAL");
    expect(markup).toContain("Goldilocks");
    expect(markup).toContain(data.researchImplications!.thesis);
    expect(markup).toContain("Research themes");
    expect(markup).toContain("Counter-signals");
    expect(markup).not.toContain("Asset playbook");
    expect(markup).not.toContain("Research areas to favor");
    expect(markup).not.toContain("Research areas to reduce");
    expect(JSON.stringify(data)).toBe(before);
  });

  it("shows a score's coverage and uses N/A rather than zero when withheld", () => {
    const markup = renderToStaticMarkup(<RegimeDashboard payload={payload()} />);

    expect(markup).toContain("35% indicator coverage");
    expect(markup).toContain("N/A");
    expect(markup).not.toContain("0 / 100");
  });

  it("shows factor family coverage and readiness separately from monitoring availability", () => {
    const data = payload();
    const inputs = resolvedInputs();
    inputs.factors.growth = {
      ...inputs.factors.growth,
      coverage: 0.875,
      eligibleFamilies: 4,
      configuredFamilies: 5,
    };
    data.sourceRegistry = getSourceRegistry();
    data.regime = evaluateRegime(inputs);

    const markup = renderToStaticMarkup(<RegimeDashboard payload={data} />);

    expect(markup).toContain("87.5%");
    expect(markup).toContain("4/5 families eligible");
    expect(markup).toContain("ADEQUATE");
    expect(markup).toContain("Registry health");
    expect(markup).toContain("Core factors 6/6 classifiable");
    expect(markup).toContain("Supplementary Monitoring — Not classifier inputs");
  });

  it("lists source identifiers, terms, attribution, distinct dates, and unavailable reasons", () => {
    const source = getSourceRegistry()[0];
    const sources = [
      { ...source, sourceHealth: "AVAILABLE" as const, observedAt: "2026-10-01", releasedAt: "2026-10-02T13:30:00Z", retrievedAt: "2026-10-03T12:00:00Z" },
      ...(["STALE", "MISSING", "FAILED", "REDISTRIBUTION_BLOCKED"] as const).map((sourceHealth) => ({
        ...source,
        id: `fixture-${sourceHealth.toLowerCase()}`,
        sourceHealth,
      })),
      getSourceRegistry().find(({ id }) => id === "treasury-real-yield")!,
    ];

    const markup = renderToStaticMarkup(<CoreSourceRegistry sources={sources} />);

    expect(markup).toContain("Source ID");
    expect(markup).toContain("Endpoint");
    expect(markup).toContain("Reuse evidence");
    expect(markup).toContain("Attribution");
    expect(markup).toContain("Observation date");
    expect(markup).toContain("Release date");
    expect(markup).toContain("Retrieval date");
    expect(markup).toContain("Units");
    expect(markup).toContain("Seasonal basis");
    expect(markup).toContain("Parser");
    expect(markup).toContain("History");
    expect(markup).toContain("Verified");
    expect(markup).toContain("Cadence");
    expect(markup).toContain("2026");
    expect(markup).toContain("Not available");
    expect(markup).toContain("AVAILABLE");
    expect(markup).toContain("STALE");
    expect(markup).toContain("MISSING");
    expect(markup).toContain("FAILED");
    expect(markup).toContain("REDISTRIBUTION_BLOCKED");
    expect(markup).toContain("https://catalog.data.gov/dataset/daily-treasury-real-yield-curve-rates");
    expect(markup).toContain("TC_10YEAR");
  });

  it("identifies configured factor families without an admitted source", () => {
    const data = payload();
    data.sourceRegistry = getSourceRegistry();

    const markup = renderToStaticMarkup(<CoreFactorReadiness payload={data} />);

    expect(markup).toContain("1 configured family has no admitted source");
    expect(markup).toContain("Registry health");
  });

  it.each([
    "2026-10-01",
    "2026-10-01T00:00:00.000Z",
    "2026-10-01T00:00:00+14:00",
    "2026-10-01T23:30:00-12:00",
  ])("preserves the reference calendar date for %s", (observedAt) => {
    const source = { ...getSourceRegistry()[0], observedAt, releasedAt: null, retrievedAt: null, verifiedAt: null };
    const before = JSON.stringify(source);
    const markup = renderToStaticMarkup(<CoreSourceRegistry sources={[source]} />);

    expect(markup).toContain("01 Oct 2026");
    expect(markup).not.toContain("30 Sept 2026");
    expect(markup).not.toContain("02 Oct 2026");
    expect(markup).not.toContain("07:00");
    expect(JSON.stringify(source)).toBe(before);
  });

  it("does not invent a clock time for a date-only release", () => {
    const source = { ...getSourceRegistry()[0], observedAt: null, releasedAt: "2026-10-08", retrievedAt: null, verifiedAt: null };
    const markup = renderToStaticMarkup(<CoreSourceRegistry sources={[source]} />);

    expect(markup).toContain("08 Oct 2026");
    expect(markup).not.toContain("07:00");
    expect(markup).not.toContain("WIB");
  });

  it.each([
    ["2026-10-02T13:30:00Z", "02 Oct 2026, 20:30 WIB"],
    ["2026-10-02T00:00:00Z", "02 Oct 2026, 07:00 WIB"],
    ["2026-10-02T23:30:00Z", "03 Oct 2026, 06:30 WIB"],
    ["2026-10-02T13:30:00+07:00", "02 Oct 2026, 13:30 WIB"],
  ])("preserves and labels the release instant %s", (releasedAt, expected) => {
    const source = { ...getSourceRegistry()[0], observedAt: null, releasedAt, retrievedAt: null, verifiedAt: null };
    const markup = renderToStaticMarkup(<CoreSourceRegistry sources={[source]} />);

    expect(markup).toContain(expected);
  });

  it("keeps the genuine retrieval timestamp and its WIB conversion", () => {
    const source = { ...getSourceRegistry()[0], observedAt: null, releasedAt: null, retrievedAt: "2026-10-03T12:00:00Z", verifiedAt: null };
    const markup = renderToStaticMarkup(<CoreSourceRegistry sources={[source]} />);

    expect(markup).toContain("03 Oct 2026, 19:00 WIB");
  });

  it("shows the actual time for Current monitoring observations", () => {
    const data = payload();
    data.observations.mempoolVsize.observedAt = "2026-10-02T23:30:00Z";
    const markup = renderToStaticMarkup(<ObservationTable payload={data} />);

    expect(markup).toContain("03 Oct 2026, 06:30 WIB");
  });
});
