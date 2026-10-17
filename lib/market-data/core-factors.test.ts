import { readFileSync } from "node:fs";
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

function businessDayDates(count: number, endDate: string): string[] {
  const dates: string[] = [];
  let timestamp = Date.parse(`${endDate}T00:00:00.000Z`);
  while (dates.length < count) {
    const day = new Date(timestamp).getUTCDay();
    if (day !== 0 && day !== 6) dates.push(new Date(timestamp).toISOString().slice(0, 10));
    timestamp -= 86_400_000;
  }
  return dates.reverse();
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

function sloosFixture(count = 146): CoreObservationSeriesResult[] {
  const evidence = JSON.parse(readFileSync(new URL("./fixtures/sloos-202607-standards.json", import.meta.url), "utf8")) as {
    identifiers: string[];
    rows: Array<[string, number, number]>;
  };
  const rows = evidence.rows.slice(-count);
  return evidence.identifiers.map((identifier, index) => makeSeries("federal-reserve-sloos", identifier,
    rows.map((row) => row[index + 1] as number), rows.map(([date]) => date), "percent net", "Not seasonally adjusted"));
}

describe("SLOOS transformed reference quality", () => {
  it.each([4, 5, 23, 43, 146])("uses the frozen 40-quarter target for %i valid surveys", (count) => {
    const result = buildCoreFactors(sloosFixture(count), asOf);
    const standards = result.factors.creditConditions.families.find(({ key }) => key === "standards")!;
    expect(standards).toMatchObject({ coverage: 1, eligible: true, weight: 0.4 });
    for (const slot of standards.slots) {
      expect(slot).toMatchObject({ eligible: true, historyPoints: count - 3, historyYears: (count - 3) / 4 });
      expect(slot.quality.history).toBe(Math.min(1, (count - 3) / 40));
      expect(slot.quality.release).toBe(0.8);
    }
  });

  it.each(["1991-01-01", "1991-04-01", "1995-10-01"])("counts only transformed endpoints through the evaluated %s cutoff", (cutoff) => {
    const sources = sloosFixture();
    const expectedCount = sources[0].observations.filter(({ observedAt }) => observedAt <= cutoff).length - 3;
    const result = buildCoreFactors(sources, `${cutoff}T23:59:59.999Z`, { mode: "current-revised-history" });
    for (const metric of [result.momentum.creditStandardsLarge, result.momentum.creditStandardsSmall]) {
      expect(metric.historyPoints).toBe(expectedCount);
      expect(metric.historyYears).toBe(expectedCount / 4);
      expect(metric.observations.every(({ observedAt }) => observedAt <= cutoff)).toBe(true);
    }
    expect(buildCoreFactors(sources, `${cutoff}T23:59:59.999Z`).factors.creditConditions.coverage).toBe(0);
  });

  it("propagates only corrected SLOOS reference metadata into the frozen quality formula", () => {
    const surveys = sloosFixture();
    const performance = [
      makeSeries("federal-reserve-credit-performance", "STFBQD%STFBAIL_XEOP_MA.Q", Array(44).fill(2.5), quarterlyDates(44), "percent", "SA"),
      makeSeries("federal-reserve-credit-performance", "STFBQC%STFBAIL_MA.Q", Array(44).fill(0.7), quarterlyDates(44), "percent", "SA"),
    ];
    const anchors = sourceFixture().filter(({ sourceId }) => sourceId !== "treasury-real-yield").map((source) => {
      if (source.identifier === "LNS14000000") return {
        ...source,
        observations: source.observations.filter(({ observedAt }) => observedAt !== "2025-10-01"),
        missingPeriods: ["2025-10-01"],
        historyStatus: "PARTIAL" as const,
      };
      if (source.sourceId === "dol-initial-claims") return { ...source, observations: source.observations.slice(-54), historyStatus: "PARTIAL" as const };
      return source;
    });
    const financing = makeSeries("treasury-real-yield", "TC_10YEAR", Array(2520).fill(1.5),
      businessDayDates(2520, "2026-10-02"), "percent", "Not seasonally adjusted");
    const m2 = makeSeries("federal-reserve-h6-m2", "M2.M", Array(140).fill(20000), monthlyDates(140), "billions USD", "SA");
    const sources = [...anchors, financing, m2, ...surveys, ...performance];
    const sourceCopy = structuredClone(sources);
    const result = buildCoreFactors(sources, asOf);
    const recentOnly = buildCoreFactors([...anchors, financing, m2, ...sloosFixture(4), ...performance], asOf);
    const credit = result.factors.creditConditions;
    const standards = credit.families.find(({ key }) => key === "standards")!;
    expect(credit).toMatchObject({ coverage: 0.7, eligibleFamilies: 2, status: "LIMITED", historyYears: 11 });
    expect(Object.values(result.factors).map(({ coverage }) => coverage)).toEqual([1, 0.875, 0.65, 1, 0.7, 0.5]);
    expect(standards.slots.map(({ historyPoints, historyYears, quality }) => [historyPoints, historyYears, quality.history]))
      .toEqual([[143, 35.75, 1], [143, 35.75, 1]]);
    for (const key of ["inflation", "growth", "labor", "policyRates", "liquidityProxy"] as const) {
      expect(result.factors[key]).toEqual(recentOnly.factors[key]);
    }
    expect(result.native).toEqual(recentOnly.native);
    expect(credit.score).toBe(recentOnly.factors.creditConditions.score);
    expect(credit.bounds).toEqual(recentOnly.factors.creditConditions.bounds);
    for (const key of ["creditStandardsLarge", "creditStandardsSmall"] as const) {
      const { historyPoints, historyYears, ...metric } = result.momentum[key];
      const { historyPoints: recentPoints, historyYears: recentYears, ...recent } = recentOnly.momentum[key];
      expect(metric).toEqual(recent);
      expect([historyPoints, historyYears, recentPoints, recentYears]).toEqual([143, 35.75, 1, 0.25]);
    }

    const afterInputs = createRegimeInputsFromCoreFactors(result);
    // Reconstruct only the accepted pre-fix bookkeeping, not another transform.
    const beforeInputs = structuredClone(afterInputs);
    beforeInputs.factors.creditConditions.historyYears = 1;
    const offsets = Object.values(result.factors).flatMap((factor) => factor.families.flatMap((family) =>
      family.slots.map(() => factor.key === "creditConditions" && family.key === "standards")));
    beforeInputs.qualitySlots.forEach((slot, index) => { if (offsets[index]) slot.history = 4 / 40; });
    const unroundedQuality = (inputs: typeof afterInputs) => 100 * inputs.qualitySlots.reduce((sum, slot) =>
      sum + slot.weight * Number(slot.eligible) * slot.fetchHealth *
      (0.4 + 0.2 * slot.freshness + 0.2 * slot.history + 0.2 * slot.release), 0);
    expect(unroundedQuality(afterInputs) - unroundedQuality(beforeInputs)).toBeCloseTo(1.2, 10);
    const before = evaluateRegime(beforeInputs);
    const after = evaluateRegime(afterInputs);
    expect([before.dataQuality, after.dataQuality]).toEqual([74, 75]);
    expect(after.dataQuality).toBe(Math.round(unroundedQuality(afterInputs)));
    expect(before.dataQuality).toBe(Math.round(unroundedQuality(beforeInputs)));
    expect({ ...after, dataQuality: before.dataQuality }).toEqual(before);
    expect(sources).toEqual(sourceCopy);
  });
});

function realM2Fixture(count = 812): CoreObservationSeriesResult[] {
  const evidence = JSON.parse(readFileSync(new URL("./fixtures/real-m2-202608-matched.json", import.meta.url), "utf8")) as {
    sources: Array<{ sourceId: string; identifier: string; unit: string; seasonalBasis: string }>;
    rows: Array<[string, number, number]>;
  };
  const rows = evidence.rows.slice(-count);
  return evidence.sources.map((source, index) => ({
    ...makeSeries(source.sourceId, source.identifier, rows.map((row) => row[index + 1] as number),
      rows.map(([date]) => date), source.unit, source.seasonalBasis),
    observations: rows.map((row) => ({
      sourceId: source.sourceId, identifier: source.identifier, value: row[index + 1] as number,
      unit: source.unit, seasonalBasis: source.seasonalBasis, observedAt: row[0],
      releasedAt: null, retrievedAt, firstSeenAt: null, releaseDateQuality: 0, version: null, vintage: null,
    })),
  }));
}

describe("real-M2 transformed reference quality", () => {
  it.each([[6, 1], [7, 2], [65, 60], [125, 120], [812, 807]])("uses the frozen monthly target for %i inputs / %i endpoints", (count, endpoints) => {
    const result = buildCoreFactors(realM2Fixture(count), asOf);
    const liquidity = result.factors.liquidityProxy;
    expect(liquidity).toMatchObject({ coverage: 0.5, eligibleFamilies: 1, status: "WITHHELD" });
    const family = liquidity.families.find(({ key }) => key === "realM2")!;
    expect(family).toMatchObject({ eligible: true, weight: 0.5, coverage: 1 });
    expect(family.slots[0]).toMatchObject({
      eligible: true, historyPoints: endpoints, historyYears: endpoints / 12, releaseQuality: 0,
      quality: { history: Math.min(1, endpoints / 120), release: 0 },
    });
  });

  it.each([["1959-05-01", 0], ["1959-06-01", 1], ["1959-07-01", 2], ["1964-05-01", 60]] as const)("respects the evaluated %s cutoff without backdating vintages", (cutoff, endpoints) => {
    const sources = realM2Fixture();
    const original = structuredClone(sources);
    const result = buildCoreFactors(sources, `${cutoff}T23:59:59.999Z`, { mode: "current-revised-history" });
    expect(result.momentum.realM2.historyPoints).toBe(endpoints);
    expect(result.momentum.realM2.historyYears).toBe(endpoints ? endpoints / 12 : null);
    expect(result.momentum.realM2.observations.every((item) => item.observedAt <= cutoff &&
      item.retrievedAt === retrievedAt && item.releasedAt === null && item.vintage === null)).toBe(true);
    expect(buildCoreFactors(sources, `${cutoff}T23:59:59.999Z`).factors.liquidityProxy.coverage).toBe(0);
    expect(sources).toEqual(original);
  });

  it("propagates only real-M2 reference metadata through the unchanged quality formula", () => {
    const money = realM2Fixture();
    const anchors = sourceFixture().filter(({ identifier }) => !["T20804-M / DPCERG", "TC_10YEAR"].includes(identifier)).map((source) => {
      if (source.identifier === "LNS14000000") return {
        ...source, observations: source.observations.filter(({ observedAt }) => observedAt !== "2025-10-01"),
        missingPeriods: ["2025-10-01"], historyStatus: "PARTIAL" as const,
      };
      if (source.sourceId === "dol-initial-claims") return { ...source, observations: source.observations.slice(-54), historyStatus: "PARTIAL" as const };
      return source;
    });
    const financing = makeSeries("treasury-real-yield", "TC_10YEAR", Array(2520).fill(1.5),
      businessDayDates(2520, "2026-10-02"), "percent", "Not seasonally adjusted");
    const performance = [
      makeSeries("federal-reserve-credit-performance", "STFBQD%STFBAIL_XEOP_MA.Q", Array(44).fill(2.5), quarterlyDates(44), "percent", "SA"),
      makeSeries("federal-reserve-credit-performance", "STFBQC%STFBAIL_MA.Q", Array(44).fill(0.7), quarterlyDates(44), "percent", "SA"),
    ];
    const sources = [...anchors, financing, ...money, ...sloosFixture(), ...performance];
    const original = structuredClone(sources);
    const result = buildCoreFactors(sources, asOf);
    const { historyPoints, historyYears, ...economic } = result.momentum.realM2;
    expect([historyPoints, historyYears]).toEqual([807, 67.25]);
    const recentOnly = buildCoreFactors([...sources.filter(({ sourceId }) => sourceId !== "federal-reserve-h6-m2"),
      { ...money[0], observations: money[0].observations.slice(-6) }], asOf);
    const { historyPoints: recentPoints, historyYears: recentYears, ...recent } = recentOnly.momentum.realM2;
    expect(economic).toEqual(recent);
    expect([recentPoints, recentYears]).toEqual([1, 1 / 12]);
    for (const key of ["inflation", "growth", "labor", "policyRates", "creditConditions"] as const) {
      expect(result.factors[key]).toEqual(recentOnly.factors[key]);
    }
    expect(result.native).toEqual(recentOnly.native);
    expect(result.factors.creditConditions).toMatchObject({ coverage: 0.7, status: "LIMITED" });
    expect(result.factors.liquidityProxy).toMatchObject({ coverage: 0.5, status: "WITHHELD", historyYears: 67.25 });
    const slot = result.factors.liquidityProxy.families.find(({ key }) => key === "realM2")!.slots[0];
    expect(slot).toMatchObject({ eligible: true, historyPoints: 807, historyYears: 67.25, quality: { history: 1, release: 0 } });

    const afterInputs = createRegimeInputsFromCoreFactors(result);
    const beforeInputs = structuredClone(afterInputs);
    beforeInputs.factors.liquidityProxy.historyYears = 0.5;
    const offsets = Object.values(result.factors).flatMap((factor) => factor.families.flatMap((family) =>
      family.slots.map(() => factor.key === "liquidityProxy" && family.key === "realM2")));
    beforeInputs.qualitySlots.forEach((item, index) => { if (offsets[index]) item.history = 6 / 120; });
    const unroundedQuality = (inputs: typeof afterInputs) => 100 * inputs.qualitySlots.reduce((sum, item) =>
      sum + item.weight * Number(item.eligible) * item.fetchHealth *
      (0.4 + 0.2 * item.freshness + 0.2 * item.history + 0.2 * item.release), 0);
    expect(unroundedQuality(afterInputs) - unroundedQuality(beforeInputs)).toBeCloseTo(1.5833333333333333, 10);
    const before = evaluateRegime(beforeInputs);
    const after = evaluateRegime(afterInputs);
    expect([before.dataQuality, after.dataQuality]).toEqual([72, 73]);
    expect(before.dataQuality).toBe(Math.round(unroundedQuality(beforeInputs)));
    expect(after.dataQuality).toBe(Math.round(unroundedQuality(afterInputs)));
    expect({ ...after, dataQuality: before.dataQuality }).toEqual(before);
    expect(sources).toEqual(original);
  });
});

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

  it("keeps CPI current eligibility separate from partial transformed-history quality", () => {
    const completeSources = sourceFixture();
    const incompleteCpiHistory = completeSources.map((source) => {
      if (source.sourceId !== "bls-cpi" || !["CUUR0000SA0L1E", "CUUR0000SA0"].includes(source.identifier)) return source;
      return {
        ...source,
        observations: source.observations.filter(({ observedAt }) => observedAt !== "2025-10-01"),
        missingPeriods: ["2025-10-01"],
        historyStatus: "PARTIAL" as const,
      };
    });
    const full = buildCoreFactors(completeSources, asOf);
    const partial = buildCoreFactors(incompleteCpiHistory, asOf);
    const cpiFamily = partial.factors.inflation.families.find(({ key }) => key === "cpi")!;
    const cpiCore = cpiFamily.slots.find(({ key }) => key === "coreYoY")!;

    expect(cpiCore).toMatchObject({ eligible: true, observedAt: "2026-08-01" });
    expect(cpiCore.historyPoints).toBe(127);
    expect(cpiFamily).toMatchObject({ eligible: true, coverage: 1 });
    expect(partial.factors.inflation).toMatchObject({ coverage: 1, eligibleFamilies: 2 });

    const shortPartialCpi = incompleteCpiHistory.map((source) => {
      if (source.sourceId !== "bls-cpi" || !["CUUR0000SA0L1E", "CUUR0000SA0"].includes(source.identifier)) return source;
      return { ...source, observations: source.observations.slice(-24) };
    });
    const shortPartial = buildCoreFactors(shortPartialCpi, asOf);
    const shortCoreSlot = shortPartial.factors.inflation.families.find(({ key }) => key === "cpi")!.slots.find(({ key }) => key === "coreYoY")!;
    expect(shortCoreSlot).toMatchObject({ eligible: true, historyPoints: 12 });
    expect(shortCoreSlot.quality.history).toBeCloseTo(12 / 120, 10);
    expect(evaluateRegime(createRegimeInputsFromCoreFactors(shortPartial)).dataQuality)
      .toBeLessThan(evaluateRegime(createRegimeInputsFromCoreFactors(full)).dataQuality!);
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

  it("scores Treasury real financing from the frozen 20-business-observation median", () => {
    const values = Array.from({ length: 2520 }, () => 1.5);
    values.splice(2500, 20, ...Array.from({ length: 20 }, (_, index) => index / 10));
    const dates = businessDayDates(2521, "2026-10-02").filter((_, index) => index !== 100);
    const treasury = makeSeries(
      "treasury-real-yield",
      "TC_10YEAR",
      values,
      dates,
      "percent",
      "Not seasonally adjusted",
    );
    treasury.historyStatus = "PARTIAL";
    const result = buildCoreFactors([
      ...sourceFixture().filter(({ sourceId }) => sourceId !== "treasury-real-yield"),
      treasury,
    ], asOf).factors.policyRates;
    const financing = result.families.find(({ key }) => key === "realFinancing")!;
    const slot = financing.slots[0];

    expect(financing).toMatchObject({ eligible: true, coverage: 1, weight: 0.5 });
    expect(slot.value).toBeCloseTo(0.95, 10);
    expect(slot.score).toBeCloseTo(48.75, 10);
    expect(slot.historyPoints).toBe(2520);
    expect(slot.historyYears).toBe(10);
    expect(slot.observedAt).toBe("2026-10-02");
    expect(result).toMatchObject({ coverage: 1, eligibleFamilies: 2 });
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
