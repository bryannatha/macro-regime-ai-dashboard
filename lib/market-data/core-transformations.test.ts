import { describe, expect, it } from "vitest";
import type { CoreObservationSeriesResult, CoreSourceObservation, SeriesExpectation } from "./types";
import {
  CORE_SCORE_ANCHORS,
  interpolateStress,
  transformAnnualized3m,
  transformClaimsIntensity,
  transformG3,
  transformLatestLevel,
  transformPublishedGDP,
  transformUnemploymentGap,
  transformYoY,
} from "./core-transformations";

const retrievedAt = "2026-09-30T12:00:00.000Z";

function monthlyDates(count: number, startYear = 2025, startMonth = 1): string[] {
  return Array.from({ length: count }, (_, index) => {
    const serial = startYear * 12 + startMonth - 1 + index;
    return `${Math.floor(serial / 12)}-${String((serial % 12) + 1).padStart(2, "0")}-01`;
  });
}

function weeklyDates(count: number, start = "2026-08-01"): string[] {
  const startMs = Date.parse(start);
  return Array.from({ length: count }, (_, index) => new Date(startMs + index * 7 * 86_400_000).toISOString().slice(0, 10));
}

function series(
  sourceId: string,
  identifier: string,
  values: number[],
  dates: string[],
  unit: string,
  seasonalBasis: string,
): CoreObservationSeriesResult {
  const observations: CoreSourceObservation[] = values.map((value, index) => ({
    sourceId,
    identifier,
    value,
    unit,
    seasonalBasis,
    observedAt: dates[index],
    releasedAt: null,
    retrievedAt,
    firstSeenAt: null,
    releaseDateQuality: 0,
    version: null,
    vintage: null,
  }));
  return {
    sourceId,
    identifier,
    state: "AVAILABLE",
    observations,
    parserStatus: "VERIFIED",
    historyStatus: "VERIFIED",
    retrievedAt,
    reason: null,
  };
}

const monthlyIndex: SeriesExpectation = {
  sourceId: "test-index",
  identifier: "IDX",
  unit: "index",
  seasonalBasis: "NSA",
  cadence: "monthly",
};

describe("approved core transforms", () => {
  it("interpolates and clips native values at their score anchors", () => {
    expect(interpolateStress(1.5, [[0, 0], [3, 60]])).toBe(30);
    expect(interpolateStress(-1, [[0, 0], [3, 60]])).toBe(0);
    expect(interpolateStress(4, [[0, 0], [3, 60]])).toBe(60);
    expect(interpolateStress(Number.NaN, [[0, 0], [3, 60]])).toBeNull();
    expect(interpolateStress(1, [[2, 0], [1, 100]])).toBeNull();
  });

  it("rejects an AVAILABLE series whose parser is not verified", () => {
    const input = series("test-index", "IDX", [100, ...Array(11).fill(100), 103], monthlyDates(13), "index", "NSA");
    input.parserStatus = "PARTIAL";
    expect(transformYoY(input, monthlyIndex, CORE_SCORE_ANCHORS.inflation).value).toBeNull();
  });

  it("rejects unverified history while leaving runtime-sufficient partial history eligible", () => {
    const input = series("test-index", "IDX", [100, ...Array(11).fill(100), 103], monthlyDates(13), "index", "NSA");
    input.historyStatus = "UNVERIFIED";
    expect(transformYoY(input, monthlyIndex, CORE_SCORE_ANCHORS.inflation).value).toBeNull();

    input.historyStatus = "PARTIAL";
    expect(transformYoY(input, monthlyIndex, CORE_SCORE_ANCHORS.inflation).value).not.toBeNull();
  });

  it("rejects out-of-range release-quality metadata instead of clipping or trusting it", () => {
    const input = series("test-index", "IDX", [100, ...Array(11).fill(100), 103], monthlyDates(13), "index", "NSA");
    input.observations[0].releaseDateQuality = 1.1;
    expect(transformYoY(input, monthlyIndex, CORE_SCORE_ANCHORS.inflation).value).toBeNull();
  });

  it("keeps YoY inflation distinct from seasonally adjusted three-month annualized momentum", () => {
    const yoySeries = series("test-index", "IDX", [100, ...Array(11).fill(100), 103], monthlyDates(13), "index", "NSA");
    const yoy = transformYoY(yoySeries, monthlyIndex, CORE_SCORE_ANCHORS.inflation);
    expect(yoy.observedAt).toBe("2026-01-01");
    expect(yoy.value).toBeCloseTo(3, 10);
    expect(yoy.score).toBeCloseTo(50, 10);

    const saSeries = series("test-index", "IDX", [100, 100, 100, 101], monthlyDates(4), "index", "SA");
    const momentum = transformAnnualized3m(saSeries, { ...monthlyIndex, seasonalBasis: "SA" }, CORE_SCORE_ANCHORS.inflation);
    expect(momentum.value).toBeCloseTo(4.0604, 3);
    expect(momentum.observedAt).toBe("2025-04-01");
    expect(transformYoY(saSeries, monthlyIndex, CORE_SCORE_ANCHORS.inflation).value).toBeNull();
  });

  it("uses six consecutive monthly levels for g3 of adjacent three-month means", () => {
    const input = series("test-index", "IDX", [100, 100, 100, 110, 110, 110], monthlyDates(6), "index", "SA");
    const result = transformG3(input, { ...monthlyIndex, seasonalBasis: "SA" }, [[-4, 100], [0, 65], [2, 30], [5, 0]]);
    expect(result.value).toBeCloseTo(46.41, 2);
    expect(result.historyPoints).toBe(1);

    const gap = series("test-index", "IDX", [100, 100, 100, 110, 110, 110], ["2025-01-01", "2025-02-01", "2025-03-01", "2025-05-01", "2025-06-01", "2025-07-01"], "index", "SA");
    expect(transformG3(gap, { ...monthlyIndex, seasonalBasis: "SA" }, CORE_SCORE_ANCHORS.realActivity).value).toBeNull();
  });

  it("scores published GDP SAAR directly without annualizing it again", () => {
    const input = series("bea-gdp", "T10101-Q / A191RL", [2.1, 3.4], ["2026-01-01", "2026-04-01"], "percent SAAR", "SAAR");
    const result = transformPublishedGDP(input, {
      sourceId: "bea-gdp",
      identifier: "T10101-Q / A191RL",
      unit: "percent SAAR",
      seasonalBasis: "SAAR",
      cadence: "quarterly",
    });
    expect(result).toMatchObject({ value: 3.4, score: 11, observedAt: "2026-04-01" });
  });

  it("uses a 14-month unemployment history for the latest three-month mean minus the trailing minimum", () => {
    const values = [3, 3, ...Array(12).fill(5)];
    const input = series("bls-labor", "LNS14000000", values, monthlyDates(14), "percent", "SA");
    const result = transformUnemploymentGap(input, {
      sourceId: "bls-labor",
      identifier: "LNS14000000",
      unit: "percent",
      seasonalBasis: "SA",
      cadence: "monthly",
    }, CORE_SCORE_ANCHORS.unemploymentGap);
    expect(result.value).toBeCloseTo(4 / 3, 5);
    expect(result.observedAt).toBe("2026-02-01");
    expect(transformUnemploymentGap(series("bls-labor", "LNS14000000", values.slice(1), monthlyDates(13).slice(1), "percent", "SA"), {
      sourceId: "bls-labor",
      identifier: "LNS14000000",
      unit: "percent",
      seasonalBasis: "SA",
      cadence: "monthly",
    }, CORE_SCORE_ANCHORS.unemploymentGap).value).toBeNull();
  });

  it("scores the latest native unemployment level without rewriting its unit", () => {
    const input = series("bls-labor", "LNS14000000", [4, 4.2, 4.5], monthlyDates(3), "percent", "SA");
    const result = transformLatestLevel(input, {
      sourceId: "bls-labor",
      identifier: "LNS14000000",
      unit: "percent",
      seasonalBasis: "SA",
      cadence: "monthly",
    }, CORE_SCORE_ANCHORS.unemploymentLevel);
    expect(result).toMatchObject({ value: 4.5, score: 37.5, unit: "percent", observedAt: "2025-03-01" });
  });

  it("requires four sequential SA claims weeks and a matching thousand-person payroll denominator", () => {
    const claims = series("dol-initial-claims", "InitialClaims.SA", [200, 200, 200, 200], weeklyDates(4), "thousand claims", "SA");
    const payroll = series("bls-labor", "CES0000000001", [160_000], ["2026-07-01"], "thousand persons", "SA");
    const result = transformClaimsIntensity(claims, payroll, {
      sourceId: "dol-initial-claims",
      identifier: "InitialClaims.SA",
      unit: "thousand claims",
      seasonalBasis: "SA",
      cadence: "weekly",
    }, {
      sourceId: "bls-labor",
      identifier: "CES0000000001",
      unit: "thousand persons",
      seasonalBasis: "SA",
      cadence: "monthly",
    }, CORE_SCORE_ANCHORS.claimsIntensity);
    expect(result).toMatchObject({ value: 1.25, observedAt: "2026-08-22" });
    expect(result.score).toBeCloseTo(22.0833, 3);

    const claimsExpected: SeriesExpectation = {
      sourceId: "dol-initial-claims", identifier: "InitialClaims.SA", unit: "thousand claims", seasonalBasis: "SA", cadence: "weekly",
    };
    const payrollExpected: SeriesExpectation = {
      sourceId: "bls-labor", identifier: "CES0000000001", unit: "thousand persons", seasonalBasis: "SA", cadence: "monthly",
    };
    expect(transformClaimsIntensity(series("dol-initial-claims", "InitialClaims.SA", [200, 200, 200], weeklyDates(3), "thousand claims", "SA"), payroll, claimsExpected, payrollExpected, CORE_SCORE_ANCHORS.claimsIntensity).value).toBeNull();
    expect(transformClaimsIntensity(series("dol-initial-claims", "InitialClaims.SA", [200, 200, 200, 200], weeklyDates(4), "thousand claims", "NSA"), payroll, claimsExpected, payrollExpected, CORE_SCORE_ANCHORS.claimsIntensity).value).toBeNull();
    expect(transformClaimsIntensity(claims, series("bls-labor", "CES0000000001", [160_000], ["2026-07-01"], "persons", "SA"), claimsExpected, payrollExpected, CORE_SCORE_ANCHORS.claimsIntensity).value).toBeNull();
    expect(transformClaimsIntensity(claims, null, {
      sourceId: "dol-initial-claims", identifier: "InitialClaims.SA", unit: "thousand claims", seasonalBasis: "SA", cadence: "weekly",
    }, {
      sourceId: "bls-labor", identifier: "CES0000000001", unit: "thousand persons", seasonalBasis: "SA", cadence: "monthly",
    }, CORE_SCORE_ANCHORS.claimsIntensity).value).toBeNull();
  });
});
