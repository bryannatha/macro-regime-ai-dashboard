import { describe, expect, it } from "vitest";
import { evaluateRegime } from "@/lib/regime";
import type { CoreObservationSeriesResult, CoreSourceObservation } from "./types";
import { buildCoreFactors } from "./core-factors";
import { createRegimeInputsFromCoreFactors } from "./regime-inputs";

const retrievedAt = "2026-10-04T12:00:00.000Z";
const asOf = retrievedAt;

function monthlyDates(count: number, startYear = 2015, startMonth = 1): string[] {
  return Array.from({ length: count }, (_, index) => {
    const serial = startYear * 12 + startMonth - 1 + index;
    return `${Math.floor(serial / 12)}-${String((serial % 12) + 1).padStart(2, "0")}-01`;
  });
}

function quarterlyDates(count: number): string[] {
  return Array.from({ length: count }, (_, index) => {
    const serial = 2015 * 4 + index;
    return `${Math.floor(serial / 4)}-${String((serial % 4) * 3 + 1).padStart(2, "0")}-01`;
  });
}

function weeklyDates(count: number): string[] {
  const first = Date.parse("2015-01-03T00:00:00.000Z");
  return Array.from({ length: count }, (_, index) => new Date(first + index * 7 * 86_400_000).toISOString().slice(0, 10));
}

function makeSeries(
  sourceId: string,
  identifier: string,
  values: number[],
  dates: string[],
  unit: string,
  seasonalBasis: string,
  state: CoreObservationSeriesResult["state"] = "AVAILABLE",
): CoreObservationSeriesResult {
  const observations: CoreSourceObservation[] = values.map((value, index) => ({
    sourceId,
    identifier,
    value,
    unit,
    seasonalBasis,
    observedAt: dates[index],
    releasedAt: "2026-10-01",
    retrievedAt,
    firstSeenAt: null,
    releaseDateQuality: 0.8,
    version: null,
    vintage: null,
  }));
  return {
    sourceId,
    identifier,
    state,
    observations: state === "REDISTRIBUTION_BLOCKED" ? [] : observations,
    parserStatus: state === "AVAILABLE" ? "VERIFIED" : "PARTIAL",
    historyStatus: state === "AVAILABLE" ? "VERIFIED" : "PARTIAL",
    retrievedAt,
    reason: state === "REDISTRIBUTION_BLOCKED" ? "Source-specific reuse has not been established." : null,
  };
}

function levels(sourceId: string, identifier: string, count: number, unit: string, seasonalBasis: string, rate: number) {
  const values = Array.from({ length: count }, (_, index) => 100 + index * 0.1);
  const previousYearIndex = count - 13;
  values[previousYearIndex] = 100;
  values[count - 1] = 100 * (1 + rate / 100);
  return makeSeries(sourceId, identifier, values, monthlyDates(count), unit, seasonalBasis);
}

function sourceFixture(): CoreObservationSeriesResult[] {
  const monthlyCount = 140;
  const series = [
    levels("bls-cpi", "CUUR0000SA0L1E", monthlyCount, "index (1982-84=100)", "NSA", 3),
    levels("bls-cpi", "CUUR0000SA0", monthlyCount, "index (1982-84=100)", "NSA", 2),
    levels("bls-cpi", "CUSR0000SA0L1E", monthlyCount, "index (1982-84=100)", "SA", 30),
    levels("bls-cpi", "CUSR0000SA0", monthlyCount, "index (1982-84=100)", "SA", 20),
    levels("bea-pce-income", "T20804-M / DPCCRG", monthlyCount, "index (2017=100)", "SA", 2),
    levels("bea-pce-income", "T20804-M / DPCERG", monthlyCount, "index (2017=100)", "SA", 1),
    makeSeries("bea-gdp", "T10101-Q / A191RL", Array(44).fill(2.1), quarterlyDates(44), "percent SAAR", "SAAR"),
    makeSeries("federal-reserve-g17-ip", "B50001", Array.from({ length: monthlyCount }, (_, index) => 100 + index * 0.1), monthlyDates(monthlyCount), "index (G.17 total, release-defined base)", "SA"),
    makeSeries("bea-pce-income", "T20806-M / DPCERX", Array.from({ length: monthlyCount }, (_, index) => 1_000 + index * 10), monthlyDates(monthlyCount), "millions of chained (2017) dollars (SAAR)", "SAAR"),
    makeSeries("bea-pce-income", "T20600-M / A067RX", Array.from({ length: monthlyCount }, (_, index) => 2_000_000 + index * 2_000), monthlyDates(monthlyCount), "millions of chained (2017) dollars (SAAR)", "SAAR"),
    makeSeries("bls-labor", "CES0000000001", Array.from({ length: monthlyCount }, (_, index) => 160_000 + index * 100), monthlyDates(monthlyCount), "thousand persons", "SA"),
    makeSeries("bls-labor", "LNS14000000", Array.from({ length: monthlyCount }, (_, index) => index < 130 ? 4.5 : 4.5 + index * 0.001), monthlyDates(monthlyCount), "percent", "SA"),
    makeSeries("dol-initial-claims", "U.S. initial claims, seasonally adjusted (InitialClaims.SA)", Array(613).fill(200), weeklyDates(613), "thousand claims", "SA"),
    makeSeries("federal-reserve-policy-actions", "FOMC target range/action history", [3.875], ["2026-09-17"], "percent", "Not seasonally adjusted"),
    makeSeries("treasury-real-yield", "TC_10YEAR", [], [], "percent", "Not seasonally adjusted", "REDISTRIBUTION_BLOCKED"),
  ];
  return series;
}

describe("approved anchor family aggregation", () => {
  it("uses CPI and PCE core/headline slots at fixed weights; SA momentum is not a level vote", () => {
    const sources = sourceFixture();
    const base = buildCoreFactors(sources, asOf);
    const inflation = base.factors.inflation;
    expect(inflation).toMatchObject({ coverage: 1, eligibleFamilies: 2, configuredFamilies: 2, status: "READY" });
    expect(inflation.families.find(({ key }) => key === "cpi")?.score).toBeCloseTo(42.5, 5);
    expect(inflation.families.find(({ key }) => key === "pce")?.score).toBeCloseTo(20.5, 5);
    expect(inflation.score).toBeCloseTo(31.5, 5);

    const alteredSaMomentum = sources.map((item) => item.identifier === "CUSR0000SA0L1E"
      ? { ...item, observations: item.observations.map((point, index) => index === item.observations.length - 1 ? { ...point, value: point.value * 2 } : point) }
      : item);
    const altered = buildCoreFactors(alteredSaMomentum, asOf);
    expect(altered.factors.inflation.score).toBeCloseTo(inflation.score!, 5);
    expect(altered.momentum.cpiCoreAnnualized3m.value).not.toBe(base.momentum.cpiCoreAnnualized3m.value);
  });

  it("keeps the four valid Growth families and the missing housing weight in the bounds", () => {
    const result = buildCoreFactors(sourceFixture(), asOf).factors.growth;
    expect(result).toMatchObject({ coverage: 0.875, eligibleFamilies: 4, configuredFamilies: 5, status: "ADEQUATE" });
    expect(result.bounds.upper - result.bounds.lower).toBeCloseTo(12.5, 8);
    expect(result.families.find(({ key }) => key === "housing")).toMatchObject({ eligible: false, weight: 0.125 });

    const realPce = result.families.find(({ key }) => key === "realPce")!;
    const income = result.families.find(({ key }) => key === "realDisposableIncome")!;
    expect(realPce.dependencyIds).toContain("bea-pce-income:section2-revisions");
    expect(income.dependencyIds).toContain("bea-pce-income:section2-revisions");
  });

  it("uses revised historical observations without backdating their release or retrieval timestamps", () => {
    const result = buildCoreFactors(sourceFixture(), "2020-01-31T23:59:59.999Z", {
      mode: "current-revised-history",
    });
    const cpi = result.momentum.cpiCoreAnnualized3m;
    const latest = cpi.observations.at(-1);

    expect(result.factors.inflation.coverage).toBe(1);
    expect(latest).toMatchObject({
      observedAt: "2020-01-01",
      releasedAt: "2026-10-01",
      retrievedAt: "2026-10-04T12:00:00.000Z",
    });
    expect(cpi.observations.every(({ observedAt }) => observedAt <= "2020-01-31")).toBe(true);
    expect(buildCoreFactors(sourceFixture(), "2020-01-31T23:59:59.999Z").factors.inflation.coverage).toBe(0);
  });

  it("retains 100% Labor coverage with claims and exactly 75% when claims alone are absent", () => {
    const sources = sourceFixture();
    const complete = buildCoreFactors(sources, asOf).factors.labor;
    const withoutClaims = buildCoreFactors(sources.filter(({ sourceId }) => sourceId !== "dol-initial-claims"), asOf).factors.labor;
    expect(complete).toMatchObject({ coverage: 1, eligibleFamilies: 3, configuredFamilies: 3, status: "READY" });
    expect(withoutClaims).toMatchObject({ coverage: 0.75, eligibleFamilies: 2, configuredFamilies: 3, status: "LIMITED" });
  });

  it("withholds Policy/Rates when Treasury financing reuse is blocked and never substitutes another source", () => {
    const result = buildCoreFactors(sourceFixture(), asOf);
    const policy = result.factors.policyRates;
    expect(policy).toMatchObject({ coverage: 0.5, eligibleFamilies: 1, configuredFamilies: 2, score: null, status: "WITHHELD" });
    expect(policy.families.find(({ key }) => key === "realFinancing")).toMatchObject({
      eligible: false,
      weight: 0.5,
      sourceIds: ["treasury-real-yield"],
      identifiers: ["TC_10YEAR"],
    });
    expect(result.native.realPolicyRate).toBeCloseTo(3.875 - 2, 8);

    const inputs = createRegimeInputsFromCoreFactors(result);
    expect(inputs.factors.policyRates).toMatchObject({ coverage: 0.5, eligibleFamilies: 1 });
    expect(inputs.factors.policyRates.bounds?.lower).toBeCloseTo(35.9375, 6);
    expect(inputs.factors.policyRates.bounds?.upper).toBeCloseTo(85.9375, 6);
    expect(inputs.qualitySlots.reduce((sum, slot) => sum + slot.weight, 0)).toBeCloseTo(1, 10);
    const assessment = evaluateRegime(inputs);
    expect(assessment).toMatchObject({ assessmentStatus: "INSUFFICIENT_DATA", regime: null });
    expect(assessment.reasonCodes).toContain("POLICY_RATES_WITHHELD — TREASURY_REUSE_UNRESOLVED");
    expect(assessment.leadingDirection.direction).toBe("UNKNOWN");
  });

  it("does not substitute headline PCE when the registered core-PCE series is missing", () => {
    const completeSources = sourceFixture();
    const complete = buildCoreFactors(completeSources, asOf);
    const sources = completeSources.filter(({ identifier }) => identifier !== "T20804-M / DPCCRG");
    const incomplete = buildCoreFactors(sources, asOf);
    const result = incomplete.factors.inflation;
    expect(result).toMatchObject({ coverage: 0.5, eligibleFamilies: 1, score: null, status: "WITHHELD" });
    expect(result.families.find(({ key }) => key === "pce")).toMatchObject({ eligible: false, coverage: 0 });

    const completeInputs = createRegimeInputsFromCoreFactors(complete);
    const incompleteInputs = createRegimeInputsFromCoreFactors(incomplete);
    const completeAssessment = evaluateRegime(completeInputs);
    const incompleteAssessment = evaluateRegime(incompleteInputs);
    expect(incompleteAssessment.dataQuality).toBeLessThan(completeAssessment.dataQuality!);
    expect(incompleteAssessment.regime).toBeNull();
    expect(incompleteAssessment.candidates).toEqual([]);
  });

  it("does not use an AVAILABLE but parser-unverified target-action series", () => {
    const sources = sourceFixture().map((source) => source.sourceId === "federal-reserve-policy-actions"
      ? { ...source, parserStatus: "PARTIAL" as const }
      : source);
    const result = buildCoreFactors(sources, asOf);
    expect(result.native.realPolicyRate).toBeNull();
    expect(result.factors.policyRates.families.find(({ key }) => key === "realPolicyStance")).toMatchObject({ eligible: false, coverage: 0 });
  });
});
