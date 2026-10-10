import { describe, expect, it } from "vitest";
import type { CoreObservationSeriesResult, CoreSourceObservation } from "./types";
import {
  parseFederalReserveCreditPerformanceXml,
  parseFederalReserveH41Liquidity,
  parseFederalReserveH8DdpCsv,
  parseFederalReserveH6M2Xml,
  parseFederalReserveH8Loans,
  parseFederalReserveSloosChartData,
  fetchFederalReserveH8Loans,
  fetchFederalReserveSloos,
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

function h8DdpCsv(periods = dates("2026-01-07", 17, 7)): string {
  const rows = [
    ["Series Description", "Bank credit, all commercial banks, seasonally adjusted", "Loans and leases in bank credit, all commercial banks, seasonally adjusted"],
    ["Unit:", "Currency", "Currency"],
    ["Multiplier:", "1000000", "1000000"],
    ["Currency:", "USD", "USD"],
    ["Unique Identifier:", "H8/H8/B1001NCBA", "H8/H8/B1020NCBA"],
    ["Time Period", "B1001NCBA", "B1020NCBA"],
    ...periods.map((date, index) => [date, String(19_000_000 + index * 1000), String(14_000_000 + index * 1000)]),
  ];
  return rows.map((row) => row.map((cell) => `"${cell}"`).join(",")).join("\r\n");
}

const h8DdpChooser = `<select><option value="rel=H8&amp;series=17951c643555bee48d63bb6957a4a92e&amp;lastobs=&amp;from=&amp;to=&amp;filetype=csv&amp;label=include&amp;layout=seriescolumn&amp;type=package">All Commercial Banks, SA (Weekly) [csv, All Observations, 757.0 KB]</option></select>`;
const h8ReleaseWithBreak = `<h2>Release Date: October 2, 2026</h2><p>As of the week ending July 1, 2026, foreign-related institutions reclassified $6.1 billion.</p>`;
const h8NotesEndpoint = "https://www.federalreserve.gov/releases/h8/h8notes.htm";
const h8RetrievedAt = "2026-10-10T12:00:00Z";
const h8PreservedNotes = `<title>Assets and Liabilities of Commercial Banks in the United States - H.8</title>
  <a href="#notes_20260701">July 1, 2026</a><a href="#notes_20260107">January 7, 2026</a>
  <div class="datanote"><h3><a name="notes_20260701">July 1, 2026</a></h3>
  <p>As of the week ending July 1, 2026, foreign-related institutions reclassified $6.1 billion.</p></div>
  <div class="datanote"><h3><a name="notes_20260107">January 7, 2026</a></h3><p>A thrift converted to a commercial bank.</p></div>
  <div id="lastUpdate">Last Update: October 9, 2026</div>`;

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

const sloosIndexHtml = `<a href="/data/sloos/sloos-202607.htm">July 2026</a><a href="/data/sloos/sloos-202604.htm">April 2026</a>`;
const sloosReleaseHtml = `<a href="sloos-202607-chart-data.htm">Chart data</a>`;

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

  it("parses the Board compact-SDMX H.6 archive layout", () => {
    const observations = ["2026-03", "2026-04", "2026-05", "2026-06", "2026-07", "2026-08"]
      .map((period, index) => `<frb:Obs OBS_STATUS="A" OBS_VALUE="${22_000 + index * 100}" TIME_PERIOD="${period}" />`)
      .join("");
    const xml = `<message:MessageGroup xmlns:message="urn:message" xmlns:kf="urn:h6" xmlns:frb="urn:frb">
      <message:DataSet id="H6_M2"><kf:Series ADJUSTED="SA" CURRENCY="USD" FREQ="129" SERIES_NAME="M2.M" UNIT="Currency" UNIT_MULT="1e+09">${observations}</kf:Series></message:DataSet>
    </message:MessageGroup>`;

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

  it("discovers the chart-data page through the latest SLOOS release page", async () => {
    const requests: string[] = [];
    const result = await fetchFederalReserveSloos({
      now: new Date(retrievedAt),
      fetchImpl: async (input) => {
        const url = String(input);
        requests.push(url);
        if (url === "https://www.federalreserve.gov/data/sloos.htm") return new Response(sloosIndexHtml, { status: 200 });
        if (url === "https://www.federalreserve.gov/data/sloos/sloos-202607.htm") return new Response(sloosReleaseHtml, { status: 200 });
        if (url === "https://www.federalreserve.gov/data/sloos/sloos-202607-chart-data.htm") return new Response(sloosHtml, { status: 200 });
        return new Response("not found", { status: 404 });
      },
    });

    expect(requests).toEqual([
      "https://www.federalreserve.gov/data/sloos.htm",
      "https://www.federalreserve.gov/data/sloos/sloos-202607.htm",
      "https://www.federalreserve.gov/data/sloos/sloos-202607-chart-data.htm",
    ]);
    expect(result.map(({ state }) => state)).toEqual(["AVAILABLE", "AVAILABLE"]);
  });

  it("does not treat a four-week H.8 page as sufficient for a 17-week volume transform", () => {
    const dates = ["2026-09-02", "2026-09-09", "2026-09-16", "2026-09-23"];
    const html = `<h3>Table 2. Assets and Liabilities of Commercial Banks</h3><p>Seasonally adjusted, billions of dollars.</p>
      <table><tr><th>Account</th>${dates.map((date) => `<th>Week ending ${date}</th>`).join("")}</tr>
      <tr><td>9</td><td>Loans and leases in bank credit</td>${[14_000, 14_010, 14_020, 14_030].map((value) => `<td>${value}</td>`).join("")}</tr></table>`;
    const parsed = parseFederalReserveH8Loans(html, retrievedAt);
    expect(parsed).toMatchObject({ sourceId: h8Source, identifier: identifiers.h8Loans, state: "MISSING", observations: [] });
    expect(parsed.reason).toContain("17 consecutive weekly observations");
  });

  it("parses the exact H.8 DDP weekly SA series and normalizes millions to billions", () => {
    const parsed = parseFederalReserveH8DdpCsv(h8DdpCsv(), retrievedAt);

    expect(parsed).toMatchObject({ sourceId: h8Source, identifier: "H8/H8/B1020NCBA", state: "AVAILABLE", parserStatus: "VERIFIED" });
    expect(parsed.observations).toHaveLength(17);
    expect(parsed.observations.at(-1)).toMatchObject({ value: 14_016, unit: "billions USD", seasonalBasis: "SA", observedAt: "2026-04-29" });
  });

  it("rejects H.8 DDP files without the exact source series or USD million metadata", () => {
    const csv = h8DdpCsv();

    expect(parseFederalReserveH8DdpCsv(csv.replace("H8/H8/B1020NCBA", "H8/H8/B1020NCBD"), retrievedAt).state).toBe("FAILED");
    expect(parseFederalReserveH8DdpCsv(csv.replace('"Multiplier:","1000000","1000000"', '"Multiplier:","1000000","1000"'), retrievedAt).state).toBe("FAILED");
  });

  it("discovers the official H.8 DDP package but withholds a window crossing its disclosed break", async () => {
    const requests: string[] = [];
    const result = await fetchFederalReserveH8Loans({
      now: new Date(retrievedAt),
      fetchImpl: async (input) => {
        const url = String(input);
        requests.push(url);
        if (url.includes("/releases/h8/current/default.htm")) return new Response(h8ReleaseWithBreak, { status: 200 });
        if (url === h8NotesEndpoint) return new Response(h8PreservedNotes);
        if (url.includes("/datadownload/choose.aspx?rel=H8")) return new Response(h8DdpChooser, { status: 200 });
        return new Response(h8DdpCsv(dates("2026-06-03", 17, 7)), { status: 200 });
      },
    });

    expect(requests).toHaveLength(4);
    expect(requests[3]).toContain("Output.aspx?rel=H8&series=17951c643555bee48d63bb6957a4a92e");
    expect(result).toMatchObject({ identifier: "H8/H8/B1020NCBA", state: "AVAILABLE", observations: expect.any(Array) });
    expect(result.observations).toHaveLength(17);
    expect(result.eligibilityBlockReason).toContain("reclassification break");
    expect(transformCreditVolume(result)).toMatchObject({ value: null, reason: expect.stringContaining("reclassification break") });
  });

  it("retains the official H.8 break after it disappears from current-release notes", async () => {
    const csv = h8DdpCsv(dates("2026-06-10", 17, 7));
    const requests: string[] = [];
    const result = await fetchFederalReserveH8Loans({
      now: new Date(h8RetrievedAt),
      fetchImpl: async (input) => {
        const url = String(input);
        requests.push(url);
        if (url === h8NotesEndpoint) return new Response(h8PreservedNotes);
        if (url.includes("/current/")) return new Response("<h2>Release Date: October 2, 2026</h2><p>No current reclassification notice.</p>");
        if (url.includes("choose.aspx")) return new Response(h8DdpChooser);
        return new Response(csv);
      },
    });
    expect(requests).toContain(h8NotesEndpoint);
    expect(result).toMatchObject({ state: "AVAILABLE", parserStatus: "VERIFIED", historyStatus: "VERIFIED" });
    expect(result.observations).toEqual(parseFederalReserveH8DdpCsv(csv, new Date(h8RetrievedAt).toISOString()).observations);
    expect(transformCreditVolume(result)).toMatchObject({ value: null, reason: expect.stringContaining("reclassification break") });
    expect(result.reason).toContain(h8NotesEndpoint);
  });

  it("withholds the same CSV with preserved break metadata without changing observations", () => {
    const csv = h8DdpCsv(dates("2026-06-10", 17, 7));
    const result = parseFederalReserveH8DdpCsv(csv, h8RetrievedAt, "", h8PreservedNotes);
    expect(result.observations).toEqual(parseFederalReserveH8DdpCsv(csv, h8RetrievedAt).observations);
    expect(transformCreditVolume(result).value).toBeNull();
  });

  it("allows a comparison window wholly after the verified break", () => {
    const csv = h8DdpCsv(dates("2026-07-08", 17, 7));
    const result = parseFederalReserveH8DdpCsv(csv, "2026-11-07T12:00:00Z", "", h8PreservedNotes.replace("October 9, 2026", "November 6, 2026"));
    expect(result.eligibilityBlockReason).toBeNull();
    expect(transformCreditVolume(result).value).not.toBeNull();
  });

  it.each(["", "<html>Access denied</html>", h8PreservedNotes.replace('name="notes_20260701"', 'name="notes_20260702"'), h8PreservedNotes.replace("October 9, 2026", "May 1, 2026")])(
    "fails closed for missing, invalid, truncated, or out-of-date preserved H.8 metadata (%#)", (notes) => {
      const result = parseFederalReserveH8DdpCsv(h8DdpCsv(dates("2026-06-10", 17, 7)), h8RetrievedAt, "", notes);
      expect(result.observations).toHaveLength(17);
      expect(transformCreditVolume(result)).toMatchObject({ value: null, reason: expect.stringContaining("break metadata") });
    },
  );

  it("preserves H.8 observations but blocks eligibility when the official notes request fails", async () => {
    const result = await fetchFederalReserveH8Loans({
      now: new Date(retrievedAt),
      fetchImpl: async (input) => {
        const url = String(input);
        if (url === h8NotesEndpoint) return new Response("unavailable", { status: 503 });
        if (url.includes("/current/")) return new Response("<h2>Release Date: October 2, 2026</h2>");
        if (url.includes("choose.aspx")) return new Response(h8DdpChooser);
        return new Response(h8DdpCsv(dates("2026-06-10", 17, 7)));
      },
    });
    expect(result.state).toBe("AVAILABLE");
    expect(result.observations).toHaveLength(17);
    expect(transformCreditVolume(result).value).toBeNull();
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

  it("parses compact-SDMX quarterly credit series with quarter-end observation dates", () => {
    const observations = [
      ["2025-09-30", 2], ["2025-12-31", 2.5], ["2026-03-31", 3], ["2026-06-30", 3.5],
    ].map(([period, value]) => `<frb:Obs OBS_STATUS="A" OBS_VALUE="${value}" TIME_PERIOD="${period}" />`).join("");
    const xml = `<message:MessageGroup xmlns:message="urn:message" xmlns:kf="urn:chgdel" xmlns:frb="urn:frb">
      <message:DataSet id="CHGDEL">
        <kf:Series CHGDEL="DEL" COMPONENT="RATIO" FREQ="162" LOANTYPE="TOTAL" SA="SA" SERIES_NAME="STFBQD%STFBAIL_XEOP_MA.Q" SIZE="ALL" UNIT="Percentage" UNIT_MULT="1">${observations}</kf:Series>
        <kf:Series CHGDEL="CHG" COMPONENT="RATIO" FREQ="162" LOANTYPE="TOTAL" SA="SA" SERIES_NAME="STFBQC%STFBAIL_MA.Q" SIZE="ALL" UNIT="Percentage" UNIT_MULT="1">${observations}</kf:Series>
      </message:DataSet>
    </message:MessageGroup>`;

    const parsed = parseFederalReserveCreditPerformanceXml(xml, retrievedAt);

    expect(parsed.map(({ state, observations: points }) => ({ state, count: points.length }))).toEqual([
      { state: "AVAILABLE", count: 4 },
      { state: "AVAILABLE", count: 4 },
    ]);
    expect(parsed[0].observations.at(-1)).toMatchObject({ value: 3.5, unit: "percent", seasonalBasis: "SA", observedAt: "2026-04-01" });
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
    const data = series(h8Source, identifiers.h8Loans, points, dates("2026-06-03", 17, 7), "billions USD", "SA");
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

  it("changes only the bank-volume family when preserved H.8 evidence blocks its window", () => {
    const sources = supportingSources(false);
    const csv = h8DdpCsv(dates("2026-06-10", 17, 7));
    const before = buildCoreFactors([...sources, series(h8Source, identifiers.h8Loans, Array(17).fill(100), dates("2026-06-10", 17, 7), "billions USD", "SA")], h8RetrievedAt).factors;
    const after = buildCoreFactors([...sources, parseFederalReserveH8DdpCsv(csv, h8RetrievedAt, "", h8PreservedNotes)], h8RetrievedAt).factors;
    expect(after.creditConditions).toMatchObject({ coverage: 0.7, eligibleFamilies: 2, status: "LIMITED" });
    expect(after.creditConditions.families.filter(({ key }) => key !== "bankVolume")).toEqual(before.creditConditions.families.filter(({ key }) => key !== "bankVolume"));
    for (const key of ["inflation", "growth", "labor", "policyRates", "liquidityProxy"] as const) expect(after[key]).toEqual(before[key]);
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
