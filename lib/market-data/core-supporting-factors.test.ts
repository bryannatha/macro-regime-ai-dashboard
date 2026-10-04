import { describe, expect, it } from "vitest";
import type { CoreObservationSeriesResult, CoreSourceObservation } from "./types";
import {
  parseFederalReserveCreditPerformanceXml,
  parseFederalReserveH41Liquidity,
  parseFederalReserveH6M2Xml,
  parseFederalReserveH8Loans,
  parseFederalReserveSloosChartData,
} from "./providers/federal-reserve-core";
import {
  transformCreditStandards,
  transformCreditVolume,
  transformLiquidityProxy,
  transformRealM2,
} from "./core-transformations";
import { buildCoreFactors } from "./core-factors";
import { getSourceRegistry } from "./source-registry";
import { FEDERAL_RESERVE_SUPPORT_IDENTIFIERS as identifiers } from "./providers/federal-reserve-core";

const retrievedAt = "2026-10-04T12:00:00.000Z";
const weeklySource = "federal-reserve-h41-liquidity";
const h8Source = "federal-reserve-h8";
const monthlySource = "federal-reserve-h6-m2";
const sloosSource = "federal-reserve-sloos";
const pceSource = "bea-pce-income";

function dates(start: string, count: number, stepDays: number): string[] {
  const first = Date.parse(`${start}T00:00:00.000Z`);
  return Array.from({ length: count }, (_, index) => new Date(first + index * stepDays * 86_400_000).toISOString().slice(0, 10));
}

function monthlyDates(count: number, startYear = 2026, startMonth = 1): string[] {
  return Array.from({ length: count }, (_, index) => {
    const monthSerial = startYear * 12 + startMonth - 1 + index;
    return `${Math.floor(monthSerial / 12)}-${String((monthSerial % 12) + 1).padStart(2, "0")}-01`;
  });
}

function quarterlyDates(count: number, startYear = 2016, startQuarter = 3): string[] {
  return Array.from({ length: count }, (_, index) => {
    const serial = startYear * 4 + startQuarter - 1 + index;
    return `${Math.floor(serial / 4)}-${String((serial % 4) * 3 + 1).padStart(2, "0")}-01`;
  });
}

function series(
  sourceId: string,
  identifier: string,
  values: number[],
  observedAt: string[],
  unit: string,
  seasonalBasis: string,
): CoreObservationSeriesResult {
  const observations: CoreSourceObservation[] = values.map((value, index) => ({
    sourceId,
    identifier,
    value,
    unit,
    seasonalBasis,
    observedAt: observedAt[index],
    releasedAt: null,
    retrievedAt,
    firstSeenAt: retrievedAt,
    releaseDateQuality: 0.25,
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

function sdmxSeries(seriesName: string, dimensions: string, observations: string): string {
  return `<generic:Series><generic:SeriesKey>${dimensions}</generic:SeriesKey>${observations}</generic:Series>`;
}

function sdmxDimension(id: string, value: string): string {
  return `<generic:Value id="${id}" value="${value}"/>`;
}

function sdmxObservations(periods: string[], values: number[]): string {
  return periods.map((period, index) => `<generic:Obs><generic:ObsDimension value="${period}"/><generic:ObsValue value="${values[index]}"/></generic:Obs>`).join("");
}

const sloosHtml = `<h3>Figure 1: Measures of Supply and Demand for C&amp;I Loans by Size of Firm Seeking Loans</h3>
<table><thead>
<tr><th>Period</th><th colspan="2">Panel 1: Net Percentage of Domestic Respondents Tightening Standards for C&amp;I Loans</th><th colspan="2">Panel 2: Other measure</th></tr>
<tr><th></th><th>Large and medium</th><th>Small</th><th>Large and medium</th><th>Small</th></tr>
</thead><tbody>
<tr><td>2025:4</td><td>-20.0</td><td>-10.0</td><td>0</td><td>0</td></tr>
<tr><td>2026:1</td><td>-10.0</td><td>0.0</td><td>0</td><td>0</td></tr>
<tr><td>2026:2</td><td>0.0</td><td>10.0</td><td>0</td><td>0</td></tr>
<tr><td>2026:3</td><td>20.0</td><td>30.0</td><td>0</td><td>0</td></tr>
</tbody></table>`;

describe("approved supporting source parsers", () => {
  it("keeps H.4.1 Wednesday total assets separate from weekly-average factors", () => {
    const html = `<h2>H.4.1</h2><h3>1. Factors Affecting Reserve Balances</h3>
      <p>Millions of dollars</p><p>Averages of daily figures Week ended September 30, 2026 Wednesday September 30, 2026</p>
      <table><tr><td>Reserve Bank credit</td><td>6692033</td><td>6696087</td></tr>
      <tr><td>Reverse repurchase agreements</td></tr><tr><td>Others</td><td>172</td><td>1200</td></tr>
      <tr><td>U.S. Treasury, General Account</td><td>600000</td><td>610000</td></tr>
      <tr><td>Reserve balances with Federal Reserve Banks</td><td>3000000</td><td>3010000</td></tr></table>
      <h3>5. Consolidated Statement of Condition</h3><table><tr><td>Total assets</td><td>6753000</td></tr></table>`;
    const parsed = parseFederalReserveH41Liquidity(html, retrievedAt);
    const averageAssets = parsed.find(({ identifier }) => identifier === "H.4.1 Table 1 / Total assets / weekly average");
    const wednesdayAssets = parsed.find(({ identifier }) => identifier === "H.4.1 Table 5 / Total assets / Wednesday");
    const tga = parsed.find(({ identifier }) => identifier === "H.4.1 Table 1 / U.S. Treasury, General Account / weekly average");

    expect(averageAssets).toMatchObject({ state: "MISSING", observations: [] });
    expect(wednesdayAssets?.observations[0]).toMatchObject({ value: 6_753_000, unit: "millions USD", seasonalBasis: "Wednesday" });
    expect(tga?.observations[0]).toMatchObject({ value: 600_000, unit: "millions USD", seasonalBasis: "weekly average" });
    expect(parsed.find(({ identifier }) => identifier.includes("Reserve Bank credit"))?.observations[0]?.value).toBe(6_692_033);
  });

  it("requires exact H.6 M2 dimensions and preserves the published billions scale", () => {
    const periods = ["2026M03", "2026M04", "2026M05", "2026M06", "2026M07", "2026M08"];
    const keys = [
      sdmxDimension("SERIES_NAME", "M2.M"),
      sdmxDimension("ADJUSTED", "SA"),
      sdmxDimension("FREQ", "129"),
      sdmxDimension("UNIT", "Currency"),
      sdmxDimension("UNIT_MULT", "1e+09"),
    ].join("");
    const wrongSeason = sdmxSeries("M2.M", keys.replace('value="SA"', 'value="NSA"'), sdmxObservations(periods, [22_000, 22_100, 22_200, 22_300, 22_400, 22_500]));
    const xml = `<message:GenericData><message:DataSet>${
      sdmxSeries("M2.M", keys, sdmxObservations(periods, [22_000, 22_100, 22_200, 22_300, 22_400, 22_500])) + wrongSeason
    }</message:DataSet></message:GenericData>`;

    const parsed = parseFederalReserveH6M2Xml(xml, retrievedAt);
    expect(parsed).toMatchObject({ sourceId: monthlySource, identifier: "M2.M", state: "AVAILABLE", parserStatus: "VERIFIED" });
    expect(parsed.observations).toHaveLength(6);
    expect(parsed.observations.at(-1)).toMatchObject({ value: 22_500, unit: "billions USD", seasonalBasis: "SA", observedAt: "2026-08-01" });
  });

  it("parses SLOOS standards into distinct large/middle-market and small-business slots", () => {
    const parsed = parseFederalReserveSloosChartData(sloosHtml, retrievedAt);
    expect(parsed.map(({ identifier, state }) => ({ identifier, state }))).toEqual([
      { identifier: "Figure 1 Panel 1 / Large and medium", state: "AVAILABLE" },
      { identifier: "Figure 1 Panel 1 / Small", state: "AVAILABLE" },
    ]);
    expect(parsed[0].observations.at(-1)).toMatchObject({ value: 20, unit: "percent net", seasonalBasis: "Not seasonally adjusted", observedAt: "2026-07-01" });
    expect(parsed[1].observations.at(-1)?.value).toBe(30);
  });

  it("does not treat a four-week H.8 page as sufficient for a 17-week volume transform", () => {
    const dates = ["2026-09-02", "2026-09-09", "2026-09-16", "2026-09-23"];
    const html = `<h3>Table 2. Assets and Liabilities of Commercial Banks</h3><p>Seasonally adjusted, billions of dollars.</p>
      <table><tr><th>Account</th>${dates.map((date) => `<th>Week ending ${date}</th>`).join("")}</tr>
      <tr><td>9</td><td>Loans and leases in bank credit</td>${[14_000, 14_010, 14_020, 14_030].map((value) => `<td>${value}</td>`).join("")}</tr></table>`;
    const parsed = parseFederalReserveH8Loans(html, retrievedAt);
    expect(parsed).toMatchObject({ sourceId: h8Source, identifier: "H.8 Table 2 line 9 / Loans and leases in bank credit", state: "MISSING", observations: [] });
    expect(parsed.reason).toContain("17 consecutive weekly observations");
  });

  it("rejects missing or ambiguous credit-performance series instead of guessing the rate", () => {
    const keys = [
      ["STFBQD%STFBAIL_XEOP_MA.Q", "128", "SA"],
      ["STFBQC%STFBAIL_MA.Q", "128", "SA"],
    ].map(([name, frequency, adjusted]) => sdmxSeries(name,
      [sdmxDimension("SERIES_NAME", name), sdmxDimension("FREQ", frequency), sdmxDimension("ADJUSTED", adjusted), sdmxDimension("UNIT", "Percentage"), sdmxDimension("UNIT_MULT", "1")].join(""),
      sdmxObservations(["2025Q3", "2025Q4", "2026Q1", "2026Q2"], [2, 2.5, 3, 3.5]))).join("");
    const parsed = parseFederalReserveCreditPerformanceXml(`<message:GenericData><message:DataSet>${keys}</message:DataSet></message:GenericData>`, retrievedAt);
    expect(parsed).toHaveLength(2);
    expect(parsed.map(({ state, observations }) => ({ state, count: observations.length }))).toEqual([
      { state: "AVAILABLE", count: 4 },
      { state: "AVAILABLE", count: 4 },
    ]);
    expect(parseFederalReserveCreditPerformanceXml("<html>not an SDMX release</html>", retrievedAt).every(({ state }) => state === "FAILED")).toBe(true);
  });
});

describe("approved supporting transforms", () => {
  it("scores each SLOOS slot as 60% current and 40% four-survey mean", () => {
    const surveyDates = ["2025-07-01", "2025-10-01", "2026-01-01", "2026-04-01"];
    const large = series(sloosSource, "Figure 1 Panel 1 / Large and medium", [-20, -10, 0, 20], surveyDates, "percent net", "Not seasonally adjusted");
    const small = series(sloosSource, "Figure 1 Panel 1 / Small", [-20, -10, 0, 20], surveyDates, "percent net", "Not seasonally adjusted");
    const metric = transformCreditStandards(large, "Figure 1 Panel 1 / Large and medium");

    expect(metric).toMatchObject({ value: 20, unit: "percent net", historyPoints: 4 });
    expect(metric.score).toBeCloseTo(49, 8);
    expect(transformCreditStandards(small, "Figure 1 Panel 1 / Small").score).toBeCloseTo(metric.score!, 8);
  });

  it("annualizes the change between four-week H.8 means 13 weeks apart", () => {
    const points = [100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 102, 102, 102, 102];
    const data = series(h8Source, "H.8 Table 2 line 9 / Loans and leases in bank credit", points, dates("2026-06-03", 17, 7), "billions USD", "SA");
    const metric = transformCreditVolume(data);

    expect(metric.value).toBeCloseTo((1.02 ** 4 - 1) * 100, 8);
    expect(metric.score).toBeCloseTo(9.392, 2);
    expect(transformCreditVolume(series(h8Source, data.identifier, points.slice(1), dates("2026-06-10", 16, 7), "billions USD", "SA")).value).toBeNull();
  });

  it("computes real-M2 g3 only from six matched SA months", () => {
    const periods = monthlyDates(6);
    const m2 = series(monthlySource, "M2.M", [100, 100, 100, 110, 110, 110], periods, "billions USD", "SA");
    const pce = series(pceSource, "T20804-M / DPCERG", [100, 100, 100, 100, 100, 100], periods, "index (2017=100)", "SA");
    const metric = transformRealM2(m2, pce);

    expect(metric.value).toBeCloseTo((1.1 ** 4 - 1) * 100, 8);
    expect(metric.unit).toBe("percent annualized");
    expect(metric.dependencyIds).toEqual(["bea-pce-income:T20804-M / DPCERG", "federal-reserve-h6-m2:M2.M"]);

    const misaligned = series(pceSource, "T20804-M / DPCERG", [100, 100, 100, 100, 100, 100], monthlyDates(6, 2026, 2), "index (2017=100)", "SA");
    expect(transformRealM2(m2, misaligned).value).toBeNull();
  });

  it("joins H.4.1 LP components by exact week and refuses mixed Wednesday basis", () => {
    const weeks = dates("2026-01-07", 14, 7);
    const assets = series(weeklySource, "H.4.1 Table 1 / Total assets / weekly average", Array(14).fill(6_000_000), weeks, "millions USD", "weekly average");
    const tgaValues = Array(14).fill(500_000);
    tgaValues[13] = 600_000;
    const tga = series(weeklySource, "H.4.1 Table 1 / U.S. Treasury, General Account / weekly average", tgaValues, weeks, "millions USD", "weekly average");
    const rrp = series(weeklySource, "H.4.1 Table 1 / Reverse repurchase agreements: Others / weekly average", Array(14).fill(300_000), weeks, "millions USD", "weekly average");
    const metric = transformLiquidityProxy(assets, tga, rrp);

    expect(metric.value).toBeCloseTo(100 * (5_100_000 / 5_200_000 - 1), 8);
    expect(metric.score).toBeCloseTo(64.230769, 5);
    expect(transformLiquidityProxy(assets, series(weeklySource, tga.identifier, Array(14).fill(500_000), weeks.slice(1).concat("2026-04-08"), "millions USD", "weekly average"), rrp).value).toBeNull();

    const wednesdayAssets = series(weeklySource, "H.4.1 Table 5 / Total assets / Wednesday", Array(14).fill(6_000_000), weeks, "millions USD", "Wednesday");
    expect(transformLiquidityProxy(wednesdayAssets, tga, rrp).value).toBeNull();
  });
});

describe("supporting factor assembly", () => {
  function supportingSources(includeH8: boolean): CoreObservationSeriesResult[] {
    const surveyDates = ["2025-07-01", "2025-10-01", "2026-01-01", "2026-04-01"];
    const sources = [
      series(sloosSource, identifiers.sloosLargeMedium, [-10, 0, 10, 20], surveyDates, "percent net", "Not seasonally adjusted"),
      series(sloosSource, identifiers.sloosSmall, [-5, 5, 15, 25], surveyDates, "percent net", "Not seasonally adjusted"),
      series(monthlySource, identifiers.h6M2, [100, 101, 102, 103, 104, 105], monthlyDates(6), "billions USD", "SA"),
      series(pceSource, "T20804-M / DPCERG", [100, 100, 100, 100, 100, 100], monthlyDates(6), "index (2017=100)", "SA"),
      series("federal-reserve-credit-performance", identifiers.delinquency, Array(40).fill(2.5), quarterlyDates(40), "percent", "SA"),
      series("federal-reserve-credit-performance", identifiers.chargeOff, Array(40).fill(0.7), quarterlyDates(40), "percent", "SA"),
    ];
    if (includeH8) sources.push(series(h8Source, identifiers.h8Loans, Array(17).fill(100), dates("2026-06-03", 17, 7), "billions USD", "SA"));
    return sources;
  }

  it("keeps fixed credit and liquidity weights when H.8 history and H.4.1 average assets are unavailable", () => {
    const factors = buildCoreFactors(supportingSources(false), retrievedAt).factors;
    expect(factors.creditConditions).toMatchObject({ coverage: 0.7, eligibleFamilies: 2, configuredFamilies: 3, status: "LIMITED" });
    expect(factors.creditConditions.bounds.upper - factors.creditConditions.bounds.lower).toBeCloseTo(30, 8);
    expect(factors.creditConditions.families.find(({ key }) => key === "bankVolume")).toMatchObject({ eligible: false, weight: 0.3 });
    expect(factors.liquidityProxy).toMatchObject({ coverage: 0.5, eligibleFamilies: 1, configuredFamilies: 2, score: null, status: "WITHHELD" });
    expect(factors.liquidityProxy.bounds.upper - factors.liquidityProxy.bounds.lower).toBeCloseTo(50, 8);
    expect(factors.liquidityProxy.families.find(({ key }) => key === "balanceSheetProxy")).toMatchObject({ eligible: false, weight: 0.5 });
  });

  it("uses the registered H.8 family when the full 17-week SA history is present", () => {
    const result = buildCoreFactors(supportingSources(true), retrievedAt).factors.creditConditions;
    expect(result).toMatchObject({ coverage: 1, eligibleFamilies: 3, configuredFamilies: 3, status: "READY" });
    expect(result.families.map(({ key, weight }) => [key, weight])).toEqual([
      ["standards", 0.4], ["bankVolume", 0.3], ["performance", 0.3],
    ]);
  });

  it("registers the five approved Federal Reserve supporting feeds with fixed family allocations", () => {
    const sources = getSourceRegistry().filter(({ id }) => id.startsWith("federal-reserve-h" ) || id.startsWith("federal-reserve-sloos") || id === "federal-reserve-credit-performance");
    expect(sources.map(({ id }) => id).sort()).toEqual([
      "federal-reserve-credit-performance",
      "federal-reserve-h41-liquidity",
      "federal-reserve-h6-m2",
      "federal-reserve-h8",
      "federal-reserve-sloos",
    ]);
    const allocations = sources.flatMap(({ familyAllocations }) => familyAllocations).map(({ factor, family, weight }) => [factor, family, weight]);
    expect(allocations).toEqual(expect.arrayContaining([
      ["liquidityProxy", "balanceSheetProxy", 0.5],
      ["liquidityProxy", "realM2", 0.5],
      ["creditConditions", "standards", 0.4],
      ["creditConditions", "bankVolume", 0.3],
      ["creditConditions", "performance", 0.3],
    ]));
  });
});
