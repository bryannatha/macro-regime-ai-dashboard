import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import type {
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
import { getResearchImplications } from "@/lib/playbook";
import { observationFreshness, ObservationTable, RegimeDashboard } from "./regime-dashboard";

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
  ["liquidity", "Liquidity", 64, "support"],
  ["cryptoDemand", "Crypto demand", 58, "demand"],
  ["indonesiaRisk", "Indonesia risk", 51, "risk"],
].map(([key, label, score, orientation]) => ({
  key: key as ScoreKey,
  label: label as string,
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

  it("shows research implications only when a regime is resolved", () => {
    const data = payload();
    expect(renderToStaticMarkup(<RegimeDashboard payload={data} />)).toContain("Withheld until a core regime is resolved");

    data.regime = evaluateRegime(resolvedInputs());
    data.researchImplications = getResearchImplications("GOLDILOCKS");
    const markup = renderToStaticMarkup(<RegimeDashboard payload={data} />);

    expect(markup).toContain("Goldilocks");
    expect(markup).toContain("Research themes");
    expect(markup).toContain("Counter-signals");
    expect(markup).not.toContain("Asset playbook");
    expect(markup).not.toContain("Research areas to favor");
    expect(markup).not.toContain("Research areas to reduce");
  });

  it("shows a score's coverage and uses N/A rather than zero when withheld", () => {
    const markup = renderToStaticMarkup(<RegimeDashboard payload={payload()} />);

    expect(markup).toContain("35% indicator coverage");
    expect(markup).toContain("N/A");
    expect(markup).not.toContain("0 / 100");
  });
});
