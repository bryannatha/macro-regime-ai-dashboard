import { readFileSync } from "node:fs";
import { describe, expect, it, vi } from "vitest";
import { fetchBlsCoreSources, parseBlsCoreSources } from "./bls";
import { CORE_SCORE_ANCHORS, transformAnnualized3m, transformUnemploymentGap, transformYoY } from "../core-transformations";
import { fetchBeaCoreSources, parseBeaSection1Sheets, parseBeaSection2Sheets } from "./bea";
import { fetchDolCoreClaims, parseDolCoreClaims, parseDolCoreClaimsReleaseText } from "./dol";
import { fetchFederalReserveIndustrialProduction, parseFederalReserveH41Liquidity, parseFederalReserveIndustrialProduction, parseFederalReservePolicyActions } from "./federal-reserve-core";
import { parseTreasuryRealYieldCore } from "./treasury";
import { getSourceRegistry } from "@/lib/market-data/source-registry";
import type { CoreObservationSeriesResult } from "@/lib/market-data/types";

const retrievedAt = "2026-10-04T12:00:00.000Z";
const fixture = (name: string) => readFileSync(new URL(`../fixtures/${name}`, import.meta.url), "utf8");

vi.mock("pdfjs-dist/legacy/build/pdf.mjs", () => ({
  getDocument: ({ data }: { data: Uint8Array }) => {
    const lines = new TextDecoder().decode(data).split("\n");
    return {
      promise: Promise.resolve({
        numPages: 1,
        getPage: async () => ({
          getTextContent: async () => ({
            items: lines.map((str, index) => ({ str, transform: [1, 0, 0, 1, 0, 800 - index * 12] })),
          }),
        }),
        destroy: async () => undefined,
      }),
    };
  },
}));

type SeriesResult = CoreObservationSeriesResult;

function byId(results: SeriesResult[], identifier: string): SeriesResult {
  const result = results.find((item) => item.identifier === identifier);
  if (!result) throw new Error(`Missing source result ${identifier}`);
  return result;
}

function monthPeriods(startYear: number, startMonth: number, count: number): string[] {
  return Array.from({ length: count }, (_, index) => {
    const serial = startYear * 12 + startMonth - 1 + index;
    const year = Math.floor(serial / 12);
    const month = (serial % 12) + 1;
    return `${year}M${String(month).padStart(2, "0")}`;
  });
}

function beaSheet(
  sheet: string,
  title: string,
  unit: string,
  periods: string[],
  rows: Array<[string, string, string, number[]]>,
): { sheet: string; data: Array<Array<string | number | null>> } {
  const periodLabel = periods[0].includes("M") ? "Monthly" : "Quarterly";
  return {
    sheet,
    data: [
      [title],
      [unit],
      [`${periodLabel} data from ${periods[0]} to ${periods.at(-1)}`],
      ["Bureau of Economic Analysis"],
      ["Data published September 30, 2026"],
      ["File created Sep 28 2026"],
      [null],
      ["Line", null, null, ...periods],
      ...rows.map(([line, description, code, values]) => [line, description, code, ...values]),
    ],
  };
}

function makeBeaSection1() {
  const periods = Array.from({ length: 42 }, (_, index) => {
    const serial = 2016 * 4 + index;
    return `${Math.floor(serial / 4)}Q${(serial % 4) + 1}`;
  });
  const values = periods.map((_, index) => 1 + index / 10);
  return [
    beaSheet(
      "T10101-Q",
      "Table 1.1.1. Percent Change From Preceding Period in Real Gross Domestic Product",
      "[Percent] Seasonally adjusted at annual rates",
      periods,
      [["1", "Gross domestic product", "A191RL", values]],
    ),
    beaSheet(
      "T10106-Q",
      "Table 1.1.6. Real Gross Domestic Product, Chained Dollars",
      "[Millions of chained (2017) dollars] Seasonally adjusted at annual rates",
      periods,
      [["1", "Gross domestic product", "A191RX", values.map((value) => 20_000_000 + value)]],
    ),
  ];
}

function makeBeaSection2() {
  const periods = monthPeriods(2015, 1, 140);
  const values = periods.map((_, index) => 100 + index / 10);
  return [
    beaSheet(
      "T20804-M",
      "Table 2.8.4. Price Indexes for Personal Consumption Expenditures by Major Type of Product, Monthly",
      "[Index numbers, 2017=100; seasonally adjusted]",
      periods,
      [
        ["1", "Personal consumption expenditures (PCE)", "DPCERG", values],
        ["25", "PCE excluding food and energy", "DPCCRG", values.map((value) => value + 5)],
      ],
    ),
    beaSheet(
      "T20806-M",
      "Table 2.8.6. Real Personal Consumption Expenditures by Major Type of Product, Monthly, Chained Dollars",
      "[Millions of chained (2017) dollars; seasonally adjusted at annual rates]",
      periods,
      [["1", "Personal consumption expenditures (PCE)", "DPCERX", values.map((value) => value * 1000)]],
    ),
    beaSheet(
      "T20600-M",
      "Table 2.6. Personal Income and Its Disposition, Monthly",
      "[Millions of dollars; months are seasonally adjusted at annual rates]",
      periods,
      [
        ["37", "Total, Millions of chained (2017) dollars", "A067RX", values.map((_, index) => 2_000_000 + index)],
        ["41", "Disposable personal income, current dollars", "A067RCM", values.map((value) => value * 500)],
        ["43", "Disposable personal income, chained (2017) dollars", "A067RM", values],
      ],
    ),
  ];
}

function makeBlsPayload(monthCount = 140, startYear = 2015): unknown {
  const periods = monthPeriods(startYear, 1, monthCount).reverse();
  const ids = [
    "CUUR0000SA0",
    "CUUR0000SA0L1E",
    "CUSR0000SA0",
    "CUSR0000SA0L1E",
    "CES0000000001",
    "LNS14000000",
  ];
  return {
    status: "REQUEST_SUCCEEDED",
    Results: {
      series: ids.map((seriesID, seriesIndex) => ({
        seriesID,
        data: [
          ...periods.map((period, index) => ({
            year: period.slice(0, 4),
            period: `M${period.slice(5)}`,
            value: String(seriesIndex === 4 ? 150_000 + index : seriesIndex === 5 ? 4 + index / 100 : 200 + index / 10),
          })),
          { year: "2025", period: "M13", value: "annual average" },
        ],
      })),
    },
  };
}

function claimsHistoryXml(missingIndex?: number): string {
  const firstWeek = Date.parse("2015-01-03T00:00:00.000Z");
  const lastWeek = Date.parse("2026-09-26T00:00:00.000Z");
  const count = (lastWeek - firstWeek) / (7 * 86_400_000) + 1;
  const weeks = Array.from({ length: count }, (_, index) => {
    if (index === missingIndex) return "";
    const date = new Date(firstWeek + index * 7 * 86_400_000).toISOString().slice(0, 10);
    const [year, month, day] = date.split("-");
    return `<week><weekEnded>${month}/${day}/${year}</weekEnded><InitialClaims><SA>${190_000 + index}</SA></InitialClaims></week>`;
  }).join("");
  return `<r539cyNational rundate="10/03/2026">${weeks}</r539cyNational>`;
}

function dolReleaseText(lastDate = "2026-09-26", releaseDate = "October 1, 2026"): string[] {
  const last = Date.parse(`${lastDate}T00:00:00.000Z`);
  const first = last - 53 * 7 * 86_400_000;
  const rows = Array.from({ length: 54 }, (_, index) => {
    const date = new Date(first + index * 7 * 86_400_000).toLocaleDateString("en-US", {
      month: "long", day: "numeric", year: "numeric", timeZone: "UTC",
    });
    return `${date} ${index === 53 ? 197 : 200} 0 200.00 1,700 -10 1,720.00 1.1`;
  });
  return [
    "TRANSMISSION OF MATERIALS IN THIS RELEASE IS EMBARGOED UNTIL",
    "UNEMPLOYMENT INSURANCE WEEKLY CLAIMS",
    "SEASONALLY ADJUSTED DATA",
    `8:30 A.M. (Eastern) Thursday, ${releaseDate}`,
    "Seasonally Adjusted US Weekly UI Claims (in thousands)",
    "Change Change",
    "from from",
    "Initial Prior 4-Week Insured Prior 4-Week",
    "Week Ending Claims Week Average Unemployment Week Average IUR",
    ...rows,
  ];
}

describe("H.4.1 liquidity source adapter", () => {
  it("parses official abbreviated weekly dates and nonbreaking-space values without substituting Wednesday assets", () => {
    const html = `<html><body><h1>Factors Affecting Reserve Balances</h1>
      <table>
        <tr><td>Averages of daily figures</td><td>Wednesday Sep 30, 2026</td></tr>
        <tr><td>Week ended Sep 30, 2026</td></tr>
        <tr><td>Reserve Bank credit</td><td>&#xa0; 6,692,033</td></tr>
        <tr><td>Reverse repurchase agreements 12</td><td>&#xa0; 329,260</td></tr>
        <tr><td>Others</td><td>&#xa0; 3,742</td></tr>
        <tr><td>U.S. Treasury, General Account</td><td>&#xa0; 948,674</td></tr>
        <tr><td>Reserve balances with Federal Reserve Banks</td><td>&#xa0; 2,948,090</td></tr>
      </table>
      <table><tr><td>Total assets</td><td>(0)</td><td>6,743,031</td><td>- 4,673</td><td>+ 155,912</td></tr></table>
      </body></html>`;
    const results = parseFederalReserveH41Liquidity(html, retrievedAt);
    const result = (identifier: string) => results.find((item) => item.identifier === identifier);

    expect(result("H.4.1 Table 1 / Total assets / weekly average")).toMatchObject({ state: "MISSING", observations: [] });
    expect(result("H.4.1 Table 1 / U.S. Treasury, General Account / weekly average")).toMatchObject({
      state: "AVAILABLE",
      observations: [{ value: 948674, observedAt: "2026-09-30", unit: "millions USD", seasonalBasis: "weekly average" }],
    });
    expect(result("H.4.1 Table 1 / Reverse repurchase agreements: Others / weekly average")).toMatchObject({
      state: "AVAILABLE",
      observations: [{ value: 3742, observedAt: "2026-09-30", seasonalBasis: "weekly average" }],
    });
    expect(result("H.4.1 Table 1 / Reserve balances with Federal Reserve Banks / weekly average")).toMatchObject({
      state: "AVAILABLE",
      observations: [{ value: 2948090, observedAt: "2026-09-30", seasonalBasis: "weekly average" }],
    });
    expect(result("H.4.1 Table 1 / Reserve Bank credit / weekly average")).toMatchObject({
      state: "AVAILABLE",
      observations: [{ value: 6692033, observedAt: "2026-09-30", seasonalBasis: "weekly average" }],
    });
    expect(result("H.4.1 Table 5 / Total assets / Wednesday")).toMatchObject({
      state: "AVAILABLE",
      observations: [{ value: 6743031, observedAt: "2026-09-30", seasonalBasis: "Wednesday" }],
    });
  });
});

describe("official anchor source adapters", () => {
  it("keeps adapter identities aligned with the admitted official registry", () => {
    const sources = getSourceRegistry();
    const source = (id: string) => sources.find((entry) => entry.id === id);

    expect(source("bls-cpi")).toMatchObject({
      endpoint: "https://api.bls.gov/publicAPI/v1/timeseries/data/",
      identifiers: ["CUUR0000SA0", "CUUR0000SA0L1E", "CUSR0000SA0", "CUSR0000SA0L1E"],
      firstUsablePeriod: "2013-01 (diagnostic warm-up; dashboard adapter defaults to 2015-01)",
      reuseStatus: "CLEARED",
    });
    expect(source("bls-labor")).toMatchObject({
      endpoint: "https://api.bls.gov/publicAPI/v1/timeseries/data/",
      firstUsablePeriod: "2013-01 (diagnostic warm-up; dashboard adapter defaults to 2015-01)",
    });
    expect(source("dol-initial-claims")).toMatchObject({
      endpoint: "https://oui.doleta.gov/unemploy/weeklyRedirect.php",
      firstUsablePeriod: "Rolling one-year table in current weekly release; longer history unavailable",
      releaseDateQuality: 1,
      sourceHealth: "AVAILABLE",
    });
    expect(source("bea-gdp")).toMatchObject({
      identifiers: ["T10101-Q / A191RL", "T10106-Q / A191RX"],
      firstUsablePeriod: "A191RL: 1947Q2; A191RX: 1947Q1",
    });
    expect(source("bea-pce-income")?.identifiers).toEqual([
      "T20804-M / DPCERG",
      "T20804-M / DPCCRG",
      "T20806-M / DPCERX",
      "T20600-M / A067RX",
    ]);
    expect(source("bea-pce-income")?.firstUsablePeriod)
      .toBe("DPCERG: 1959M01; DPCCRG: 1959M01; DPCERX: 2007M01; A067RX: 1959M01");
    expect(source("federal-reserve-g17-ip")?.identifiers).toEqual(["B50001"]);
    expect(source("dol-initial-claims")?.attribution).toContain("U.S. Department of Labor");
    expect(source("treasury-real-yield")).toMatchObject({ sourceHealth: "REDISTRIBUTION_BLOCKED", reuseStatus: "UNRESOLVED" });
  });

  it("documents the BLS warm-up period separately from the dashboard adapter's default start", () => {
    const sources = getSourceRegistry();
    expect(sources.find(({ id }) => id === "bls-cpi")?.firstUsablePeriod)
      .toBe("2013-01 (diagnostic warm-up; dashboard adapter defaults to 2015-01)");
    expect(sources.find(({ id }) => id === "bls-labor")?.firstUsablePeriod)
      .toBe("2013-01 (diagnostic warm-up; dashboard adapter defaults to 2015-01)");
  });

  it("parses all registered BLS CPI and labor series with identifier, unit, basis, and independent timestamps", () => {
    const results = parseBlsCoreSources(makeBlsPayload(), retrievedAt) as SeriesResult[];
    const headline = byId(results, "CUUR0000SA0");
    const saCore = byId(results, "CUSR0000SA0L1E");
    const payroll = byId(results, "CES0000000001");
    const unemployment = byId(results, "LNS14000000");

    expect(results).toHaveLength(6);
    expect(headline).toMatchObject({ state: "AVAILABLE", parserStatus: "VERIFIED", historyStatus: "VERIFIED" });
    expect(headline.observations).toHaveLength(140);
    expect(headline.observations.at(-1)).toMatchObject({
      sourceId: "bls-cpi",
      identifier: "CUUR0000SA0",
      unit: "index (1982-84=100)",
      seasonalBasis: "NSA",
      observedAt: "2026-08-01",
      releasedAt: null,
      retrievedAt,
      firstSeenAt: null,
      releaseDateQuality: 0,
      version: null,
      vintage: null,
    });
    expect(saCore.observations.at(-1)?.seasonalBasis).toBe("SA");
    expect(payroll.observations.at(-1)).toMatchObject({ unit: "thousand persons", seasonalBasis: "SA" });
    expect(unemployment.observations.at(-1)).toMatchObject({ unit: "percent", seasonalBasis: "SA" });
  });

  it("withholds BLS data on wrong identifiers and duplicate months while allowing partial history", () => {
    const wrongId = makeBlsPayload() as { Results: { series: Array<{ seriesID: string }> } };
    wrongId.Results.series[0].seriesID = "CUUR0000SA1";
    const wrongResult = parseBlsCoreSources(wrongId, retrievedAt) as SeriesResult[];
    expect(byId(wrongResult, "CUUR0000SA0")).toMatchObject({ state: "MISSING", observations: [] });

    const duplicate = makeBlsPayload() as { Results: { series: Array<{ data: unknown[] }> } };
    duplicate.Results.series[0].data.push(duplicate.Results.series[0].data[0]);
    expect(byId(parseBlsCoreSources(duplicate, retrievedAt) as SeriesResult[], "CUUR0000SA0")).toMatchObject({
      state: "FAILED",
      observations: [],
    });

    const shorterHistory = parseBlsCoreSources(makeBlsPayload(30), retrievedAt) as SeriesResult[];
    const shortCpi = byId(shorterHistory, "CUUR0000SA0L1E");
    expect(shortCpi).toMatchObject({ state: "AVAILABLE", parserStatus: "VERIFIED", historyStatus: "PARTIAL" });
    expect(shortCpi.observations).toHaveLength(30);
    expect(transformYoY(shortCpi, {
      sourceId: "bls-cpi",
      identifier: "CUUR0000SA0L1E",
      unit: "index (1982-84=100)",
      seasonalBasis: "NSA",
      cadence: "monthly",
    }, CORE_SCORE_ANCHORS.inflation).historyPoints).toBe(18);

    expect(parseBlsCoreSources("<html>rate limited</html>", retrievedAt)[0]).toMatchObject({
      state: "FAILED",
      retrievedAt,
      observations: [],
    });
  });

  it("preserves both sides of an explicit BLS CPI gap without interpolation", () => {
    const payload = makeBlsPayload() as { Results: { series: Array<{ data: Array<{ year: string; period: string; value: string }> }> } };
    for (const series of payload.Results.series) {
      const unavailableMonth = series.data.find((row) => row.year === "2025" && row.period === "M10");
      if (unavailableMonth) unavailableMonth.value = "-";
    }

    const results = parseBlsCoreSources(payload, retrievedAt) as SeriesResult[];
    const coreCpi = byId(results, "CUUR0000SA0L1E");
    const unemployment = byId(results, "LNS14000000");

    expect(coreCpi).toMatchObject({
      state: "AVAILABLE",
      parserStatus: "VERIFIED",
      historyStatus: "PARTIAL",
      missingPeriods: ["2025-10-01"],
    });
    expect(coreCpi.observations[0].observedAt).toBe("2015-01-01");
    expect(coreCpi.observations).toHaveLength(139);
    expect(coreCpi.observations.some(({ observedAt }) => observedAt === "2025-10-01")).toBe(false);
    expect(coreCpi.observations.some(({ observedAt }) => observedAt === "2025-09-01")).toBe(true);
    expect(coreCpi.observations.some(({ observedAt }) => observedAt === "2025-11-01")).toBe(true);
    expect(unemployment).toMatchObject({ state: "AVAILABLE", parserStatus: "VERIFIED", historyStatus: "PARTIAL" });
    expect(unemployment.observations[0].observedAt).toBe("2015-01-01");

    const cpiExpectation = { sourceId: "bls-cpi", identifier: "CUUR0000SA0L1E", unit: "index (1982-84=100)", seasonalBasis: "NSA", cadence: "monthly" } as const;
    const cpiYoY = transformYoY(coreCpi, cpiExpectation, CORE_SCORE_ANCHORS.inflation);
    expect(cpiYoY.score).not.toBeNull();
    expect(cpiYoY.observedAt).toBe("2026-08-01");
    expect(cpiYoY.historyPoints).toBe(127);
    expect(cpiYoY.observations.map(({ observedAt }) => observedAt)).toEqual(["2025-08-01", "2026-08-01"]);
    const saCore = byId(results, "CUSR0000SA0L1E");
    expect(transformAnnualized3m(saCore, { ...cpiExpectation, identifier: "CUSR0000SA0L1E", seasonalBasis: "SA" }, CORE_SCORE_ANCHORS.inflation).score).toBeNull();
    expect(transformUnemploymentGap(unemployment, {
      sourceId: "bls-labor",
      identifier: "LNS14000000",
      unit: "percent",
      seasonalBasis: "SA",
      cadence: "monthly",
    }, CORE_SCORE_ANCHORS.unemploymentGap).score).toBeNull();
  });

  it("retains valid pre-gap BLS observations in diagnostic history without filling the gap", () => {
    const payload = makeBlsPayload() as { Results: { series: Array<{ data: Array<{ year: string; period: string; value: string }> }> } };
    for (const series of payload.Results.series) {
      const unavailableMonth = series.data.find((row) => row.year === "2025" && row.period === "M10");
      if (unavailableMonth) unavailableMonth.value = "-";
    }

    const results = parseBlsCoreSources(payload, retrievedAt) as SeriesResult[];
    const coreCpi = byId(results, "CUUR0000SA0L1E");

    expect(coreCpi).toMatchObject({ state: "AVAILABLE", parserStatus: "VERIFIED", historyStatus: "PARTIAL" });
    expect(coreCpi.observations).toHaveLength(139);
    expect(coreCpi.observations[0].observedAt).toBe("2015-01-01");
    expect(coreCpi.observations.at(-1)?.observedAt).toBe("2026-08-01");
    expect(coreCpi.missingPeriods).toEqual(["2025-10-01"]);
    expect(coreCpi.observations.some(({ observedAt }) => observedAt === "2025-10-01")).toBe(false);
  });

  it("fetches BLS history in public v1 windows without requiring a registration key", async () => {
    const requests: Array<{ url: string; body: Record<string, unknown> }> = [];
    const results = await fetchBlsCoreSources({
      now: new Date(retrievedAt),
      fetchImpl: async (input, init) => {
        const body = JSON.parse(String(init?.body)) as { startyear: string; endyear: string };
        requests.push({ url: String(input), body });
        const payload = makeBlsPayload() as { Results: { series: Array<{ data: Array<{ year: string }> }> } };
        for (const series of payload.Results.series) {
          series.data = series.data.filter((row) => Number(row.year) >= Number(body.startyear) && Number(row.year) <= Number(body.endyear));
        }
        return new Response(JSON.stringify({ status: "REQUEST_SUCCEEDED", Results: payload.Results }), { status: 200 });
      },
    });

    expect(requests).toHaveLength(2);
    expect(requests.map(({ url, body }) => [url, body.startyear, body.endyear])).toEqual([
      ["https://api.bls.gov/publicAPI/v1/timeseries/data/", "2015", "2024"],
      ["https://api.bls.gov/publicAPI/v1/timeseries/data/", "2025", "2026"],
    ]);
    expect(requests.every(({ body }) => !("registrationkey" in body))).toBe(true);
    expect(byId(results as SeriesResult[], "CUUR0000SA0").observations).toHaveLength(140);
  });

  it("loads BLS warm-up history from the requested year in ten-year public v1 windows", async () => {
    const requests: Array<{ startyear: string; endyear: string }> = [];
    const results = await fetchBlsCoreSources({
      now: new Date(retrievedAt),
      historyStartYear: 2013,
      fetchImpl: async (_input, init) => {
        const body = JSON.parse(String(init?.body)) as { startyear: string; endyear: string };
        requests.push(body);
        const payload = makeBlsPayload(167, 2013) as { Results: { series: Array<{ data: Array<{ year: string }> }> } };
        for (const series of payload.Results.series) {
          series.data = series.data.filter((row) => Number(row.year) >= Number(body.startyear) && Number(row.year) <= Number(body.endyear));
        }
        return new Response(JSON.stringify({ status: "REQUEST_SUCCEEDED", Results: payload.Results }), { status: 200 });
      },
    });

    expect(requests.map(({ startyear, endyear }) => [startyear, endyear])).toEqual([
      ["2013", "2022"],
      ["2023", "2026"],
    ]);
    expect(byId(results as SeriesResult[], "CUUR0000SA0").observations[0].observedAt).toBe("2013-01-01");
  });

  it("parses BEA GDP only from the exact SAAR GDP rows and retains current-workbook vintage limits", () => {
    const results = parseBeaSection1Sheets(makeBeaSection1(), retrievedAt) as SeriesResult[];
    const growth = byId(results, "T10101-Q / A191RL");
    const level = byId(results, "T10106-Q / A191RX");

    expect(growth).toMatchObject({ state: "AVAILABLE", parserStatus: "VERIFIED", historyStatus: "VERIFIED" });
    expect(growth.observations.at(-1)).toMatchObject({
      unit: "percent SAAR",
      seasonalBasis: "SAAR",
      observedAt: "2026-04-01",
      releasedAt: "2026-09-30",
      retrievedAt,
      vintage: null,
    });
    expect(level.observations.at(-1)?.unit).toBe("millions of chained (2017) dollars (SAAR)");
    expect(growth.observations.at(-2)).toMatchObject({ releasedAt: null, vintage: null });
  });

  it("selects BEA core PCE and real disposable income from exact rows, not headline PCE or nominal income", () => {
    const results = parseBeaSection2Sheets(makeBeaSection2(), retrievedAt) as SeriesResult[];
    const income = byId(results, "T20600-M / A067RX");
    const pcePrice = byId(results, "T20804-M / DPCERG");
    const corePce = byId(results, "T20804-M / DPCCRG");
    const realPce = byId(results, "T20806-M / DPCERX");

    expect(income).toMatchObject({ state: "AVAILABLE", parserStatus: "VERIFIED", historyStatus: "VERIFIED" });
    expect(income.observations.at(-1)).toMatchObject({
      unit: "millions of chained (2017) dollars (SAAR)",
      seasonalBasis: "SAAR",
      value: 2_000_139,
      observedAt: "2026-08-01",
      releasedAt: "2026-09-30",
    });
    expect(pcePrice.observations.at(-1)).toMatchObject({ unit: "index (2017=100)", seasonalBasis: "SA" });
    expect(corePce).toMatchObject({ state: "AVAILABLE", parserStatus: "VERIFIED", historyStatus: "VERIFIED" });
    expect(corePce.observations.at(-1)).toMatchObject({
      value: 118.9,
      identifier: "T20804-M / DPCCRG",
      unit: "index (2017=100)",
      seasonalBasis: "SA",
    });
    expect(realPce.observations.at(-1)).toMatchObject({ unit: "millions of chained (2017) dollars (SAAR)", seasonalBasis: "SAAR" });

    const noCorePce = makeBeaSection2();
    const pceSheet = noCorePce.find((sheet) => sheet.sheet === "T20804-M")!;
    pceSheet.data = pceSheet.data.filter((row) => row[2] !== "DPCCRG");
    expect(byId(parseBeaSection2Sheets(noCorePce, retrievedAt) as SeriesResult[], "T20804-M / DPCCRG")).toMatchObject({
      state: "MISSING",
      observations: [],
    });

    const nominalOnly = makeBeaSection2();
    const incomeSheet = nominalOnly.find((sheet) => sheet.sheet === "T20600-M")!;
    incomeSheet.data = incomeSheet.data.filter((row) => row[2] !== "A067RX");
    expect(byId(parseBeaSection2Sheets(nominalOnly, retrievedAt) as SeriesResult[], "T20600-M / A067RX")).toMatchObject({
      state: "MISSING",
      observations: [],
    });
  });

  it("does not put the oversized raw BEA workbooks in Next's fetch cache", async () => {
    const requests: Array<{ url: string; cache: RequestCache | undefined }> = [];
    const fetchImpl = vi.fn<typeof fetch>(async (input, init) => {
      requests.push({ url: String(input), cache: init?.cache });
      return new Response(new Uint8Array(), { status: 200 });
    });

    await fetchBeaCoreSources({ fetchImpl, now: new Date(retrievedAt) });

    expect(requests.map(({ url }) => url).sort()).toEqual([
      "https://apps.bea.gov/national/Release/XLS/Survey/Section1All_xls.xlsx",
      "https://apps.bea.gov/national/Release/XLS/Survey/Section2All_xls.xlsx",
    ].sort());
    expect(requests.every(({ cache }) => cache === "no-store")).toBe(true);
  });

  it("uses only the selected BEA table's publication date", () => {
    const sheets = makeBeaSection2();
    sheets.push({
      sheet: "T99999-M",
      data: [
        ["Table 2.99. Unrelated published table"],
        ["[Millions of dollars]"],
        ["Monthly data"],
        ["Bureau of Economic Analysis"],
        ["Data published June 16, 2026"],
      ],
    });

    const result = byId(parseBeaSection2Sheets(sheets, retrievedAt), "T20804-M / DPCERG");
    expect(result.observations.at(-1)?.releasedAt).toBe("2026-09-30");
  });

  it("rejects ambiguous and truncated BEA rows instead of silently selecting partial history", () => {
    const ambiguous = makeBeaSection2();
    const pceSheet = ambiguous.find((sheet) => sheet.sheet === "T20804-M")!;
    pceSheet.data.push([...pceSheet.data[8]]);
    expect(byId(parseBeaSection2Sheets(ambiguous, retrievedAt) as SeriesResult[], "T20804-M / DPCERG")).toMatchObject({
      state: "FAILED",
      observations: [],
    });

    const truncated = makeBeaSection2().map((sheet) => ({
      ...sheet,
      data: sheet.data.map((row) => row.slice(0, 20)),
    }));
    expect(byId(parseBeaSection2Sheets(truncated, retrievedAt) as SeriesResult[], "T20804-M / DPCERG")).toMatchObject({
      state: "MISSING",
      historyStatus: "PARTIAL",
      observations: [],
    });

    const wrongBasis = makeBeaSection1();
    wrongBasis[0].data[1][0] = "[Percent] Seasonally adjusted";
    expect(byId(parseBeaSection1Sheets(wrongBasis, retrievedAt) as SeriesResult[], "T10101-Q / A191RL")).toMatchObject({
      state: "FAILED",
      observations: [],
    });
  });

  it("parses DOL SA claims in thousands while keeping observation, release, and retrieval dates separate", () => {
    const result = parseDolCoreClaims(fixture("dol-claims-core.xml"), retrievedAt) as SeriesResult;

    expect(result).toMatchObject({
      sourceId: "dol-initial-claims",
      identifier: "U.S. initial claims, seasonally adjusted (InitialClaims.SA)",
      state: "AVAILABLE",
      parserStatus: "VERIFIED",
    });
    expect(result.observations).toHaveLength(4);
    expect(result.observations.at(-1)).toMatchObject({
      value: 193,
      unit: "thousand claims",
      seasonalBasis: "SA",
      observedAt: "2026-09-26",
      releasedAt: null,
      retrievedAt,
      firstSeenAt: null,
      releaseDateQuality: 0,
      vintage: null,
    });
  });

  it("parses the current DOL national SA weekly release without inventing long history", () => {
    const result = parseDolCoreClaimsReleaseText(dolReleaseText(), "2026-10-05T15:00:00.000Z");

    expect(result).toMatchObject({
      sourceId: "dol-initial-claims",
      identifier: "U.S. initial claims, seasonally adjusted (InitialClaims.SA)",
      state: "AVAILABLE",
      parserStatus: "VERIFIED",
      historyStatus: "PARTIAL",
      retrievedAt: "2026-10-05T15:00:00.000Z",
    });
    expect(result.observations).toHaveLength(54);
    expect(result.observations.at(-1)).toMatchObject({
      value: 197,
      unit: "thousand claims",
      seasonalBasis: "SA",
      observedAt: "2026-09-26",
      releasedAt: "2026-10-01",
      retrievedAt: "2026-10-05T15:00:00.000Z",
      releaseDateQuality: 1,
      version: "release:2026-10-01",
      vintage: null,
    });
    expect(result.reason).toContain("longer history remains unavailable");
  });

  it("uses the latest observation rather than a fresh retrieval to determine DOL claims freshness", () => {
    const rows = ["2026-08-22", "2026-08-29", "2026-09-05", "2026-09-12"].map((isoDate) => {
      const [year, month, day] = isoDate.split("-").map(Number);
      const date = new Date(Date.UTC(year, month - 1, day)).toLocaleDateString("en-US", {
        month: "long", day: "numeric", year: "numeric", timeZone: "UTC",
      });
      return `${date} 196 0 200.00 1,700 -10 1,720.00 1.1`;
    });
    const result = parseDolCoreClaimsReleaseText([
      "UNEMPLOYMENT INSURANCE WEEKLY CLAIMS",
      "SEASONALLY ADJUSTED DATA",
      "8:30 A.M. (Eastern) Thursday, September 17, 2026",
      "Seasonally Adjusted US Weekly UI Claims (in thousands)",
      "Change Change",
      "from from",
      "Initial Prior 4-Week Insured Prior 4-Week",
      "Week Ending Claims Week Average Unemployment Week Average IUR",
      ...rows,
    ], "2026-10-05T15:00:00.000Z");

    expect(result).toMatchObject({
      state: "STALE",
      parserStatus: "VERIFIED",
      observations: [],
      reason: "The latest DOL weekly claims observation is older than the weekly freshness window.",
    });
  });

  it("fails closed when the official DOL release or SA table headers change", () => {
    const validRelease = dolReleaseText();
    const invalidReleases = [
      validRelease.filter((line) => line !== "UNEMPLOYMENT INSURANCE WEEKLY CLAIMS"),
      validRelease.filter((line) => line !== "SEASONALLY ADJUSTED DATA"),
      validRelease.map((line) => line.replace("Seasonally Adjusted US Weekly UI Claims (in thousands)", "US Weekly UI Claims (in thousands)")),
      validRelease.filter((line) => line !== "Week Ending Claims Week Average Unemployment Week Average IUR"),
    ];

    for (const lines of invalidReleases) {
      expect(parseDolCoreClaimsReleaseText(lines, "2026-10-05T15:00:00.000Z")).toMatchObject({
        state: "FAILED",
        parserStatus: "FAILED",
        historyStatus: "PARTIAL",
        observations: [],
      });
    }
  });

  it("fails closed when the DOL claims and change columns are reordered", () => {
    const reordered = dolReleaseText().map((line) => {
      if (line === "Initial Prior 4-Week Insured Prior 4-Week") {
        return "Prior Initial 4-Week Insured Prior 4-Week";
      }
      if (line === "Week Ending Claims Week Average Unemployment Week Average IUR") {
        return "Week Ending Week Claims Average Unemployment Week Average IUR";
      }
      return line;
    });

    expect(parseDolCoreClaimsReleaseText(reordered, "2026-10-05T15:00:00.000Z")).toMatchObject({
      state: "FAILED",
      parserStatus: "FAILED",
      historyStatus: "PARTIAL",
      observations: [],
    });
  });

  it("fetches DOL claims from the official weekly release redirect", async () => {
    let requestUrl = "";
    const result = await fetchDolCoreClaims({
      now: new Date("2026-10-05T15:00:00.000Z"),
      fetchImpl: async (input) => {
        requestUrl = String(input);
        return new Response(dolReleaseText().join("\n"), { status: 200 });
      },
    });

    expect(requestUrl).toBe("https://oui.doleta.gov/unemploy/weeklyRedirect.php");
    expect(result).toMatchObject({ state: "AVAILABLE", historyStatus: "PARTIAL" });
    expect(result.observations.at(-1)).toMatchObject({ value: 197, observedAt: "2026-09-26" });
  });

  it("does not infer a DOL publication date from report run date or substitute NSA claims", () => {
    const withNoRunDate = fixture("dol-claims-core.xml").replace(' rundate="10/03/2026"', "");
    const result = parseDolCoreClaims(withNoRunDate, retrievedAt) as SeriesResult;
    expect(result.observations.at(-1)?.releasedAt).toBeNull();
    expect(result.observations.at(-1)?.version).toBeNull();

    const nsaOnly = fixture("dol-claims-core.xml").replace(/<SA>[^<]*<\/SA>/g, "");
    expect(parseDolCoreClaims(nsaOnly, retrievedAt)).toMatchObject({ state: "FAILED", observations: [] });
  });

  it("retains DOL report revisions as version metadata without assigning release or vintage dates", () => {
    const original = parseDolCoreClaims(fixture("dol-claims-core.xml"), retrievedAt);
    const revisedXml = fixture("dol-claims-core.xml")
      .replace('rundate="10/03/2026"', 'rundate="10/04/2026"')
      .replace("<SA>193,000</SA>", "<SA>194,000</SA>");
    const revised = parseDolCoreClaims(revisedXml, retrievedAt);

    expect(original.observations.at(-1)).toMatchObject({
      value: 193,
      releasedAt: null,
      version: "report-run:2026-10-03",
      vintage: null,
    });
    expect(revised.observations.at(-1)).toMatchObject({
      value: 194,
      releasedAt: null,
      version: "report-run:2026-10-04",
      vintage: null,
    });
  });

  it("withholds DOL claims when the required contiguous four-week window is incomplete or duplicated", () => {
    const incomplete = fixture("dol-claims-core.xml").replace(
      /  <week><weekEnded>09\/19\/2026<\/weekEnded>[\s\S]*?<\/week>\r?\n/,
      "",
    );
    expect(parseDolCoreClaims(incomplete, retrievedAt)).toMatchObject({ state: "MISSING", observations: [] });

    const duplicate = fixture("dol-claims-core.xml").replace(
      "</r539cyNational>",
      "<week><weekEnded>09/26/2026</weekEnded><InitialClaims><SA>193,000</SA></InitialClaims></week></r539cyNational>",
    );
    expect(parseDolCoreClaims(duplicate, retrievedAt)).toMatchObject({ state: "FAILED", observations: [] });
  });

  it("keeps blank DOL SA cells missing without failing or bridging historical claims", () => {
    const complete = parseDolCoreClaims(claimsHistoryXml(), retrievedAt);
    const withMissingWeek = claimsHistoryXml().replace(
      "<week><weekEnded>10/03/2020</weekEnded><InitialClaims><SA>190300</SA></InitialClaims></week>",
      "<week><weekEnded>10/03/2020</weekEnded><InitialClaims><SA>\u00a0</SA></InitialClaims></week>",
    );
    const result = parseDolCoreClaims(withMissingWeek, retrievedAt);

    expect(result).toMatchObject({ state: "AVAILABLE", parserStatus: "VERIFIED", historyStatus: "PARTIAL" });
    expect(result.observations).toHaveLength(complete.observations.length - 1);
    expect(result.observations.some(({ observedAt }) => observedAt === "2020-10-03")).toBe(false);
  });

  it("treats DOL's escaped nonbreaking-space marker as a missing SA value", () => {
    const withMissingWeek = claimsHistoryXml().replace(
      "<week><weekEnded>10/03/2020</weekEnded><InitialClaims><SA>190300</SA></InitialClaims></week>",
      "<week><weekEnded>10/03/2020</weekEnded><InitialClaims><SA>&amp;#160;</SA></InitialClaims></week>",
    );
    const result = parseDolCoreClaims(withMissingWeek, retrievedAt);

    expect(result).toMatchObject({ state: "AVAILABLE", parserStatus: "VERIFIED", historyStatus: "PARTIAL" });
    expect(result.observations.some(({ observedAt }) => observedAt === "2020-10-03")).toBe(false);
  });

  it("preserves valid seven-digit DOL claims counts from the pandemic history", () => {
    const xml = `<r539cyNational rundate="10/03/2026">
      <week><weekEnded>03/21/2020</weekEnded><InitialClaims><SA>2914000</SA></InitialClaims></week>
      <week><weekEnded>09/05/2026</weekEnded><InitialClaims><SA>190000</SA></InitialClaims></week>
      <week><weekEnded>09/12/2026</weekEnded><InitialClaims><SA>200000</SA></InitialClaims></week>
      <week><weekEnded>09/19/2026</weekEnded><InitialClaims><SA>210000</SA></InitialClaims></week>
      <week><weekEnded>09/26/2026</weekEnded><InitialClaims><SA>220000</SA></InitialClaims></week>
    </r539cyNational>`;
    const result = parseDolCoreClaims(xml, retrievedAt);

    expect(result).toMatchObject({ state: "AVAILABLE", parserStatus: "VERIFIED" });
    expect(result.observations.find(({ observedAt }) => observedAt === "2020-03-21")).toMatchObject({ value: 2914, unit: "thousand claims" });
  });

  it("ignores blank DOL rows dated after retrieval without creating observations", () => {
    const xml = fixture("dol-claims-core.xml").replace(
      "</r539cyNational>",
      "<week><weekEnded>10/10/2026</weekEnded><InitialClaims><SA>\u00a0</SA></InitialClaims></week></r539cyNational>",
    );
    const result = parseDolCoreClaims(xml, retrievedAt);

    expect(result).toMatchObject({ state: "AVAILABLE", parserStatus: "VERIFIED" });
    expect(result.observations).toHaveLength(4);
    expect(result.observations.some(({ observedAt }) => observedAt === "2026-10-10")).toBe(false);
  });

  it("marks DOL observations stale without treating report run date as publication date", () => {
    const oldClaims = fixture("dol-claims-core.xml")
      .replaceAll("09/05/2026", "07/04/2026")
      .replaceAll("09/12/2026", "07/11/2026")
      .replaceAll("09/19/2026", "07/18/2026")
      .replaceAll("09/26/2026", "07/25/2026");
    expect(parseDolCoreClaims(oldClaims, retrievedAt)).toMatchObject({ state: "STALE", observations: [] });
  });

  it("requests the official national DOL weekly release for current claims", async () => {
    let requestUrl = "";
    const result = await fetchDolCoreClaims({
      now: new Date(retrievedAt),
      fetchImpl: async (input) => {
        requestUrl = String(input);
        return new Response(dolReleaseText().join("\n"), { status: 200 });
      },
    });

    expect(requestUrl).toBe("https://oui.doleta.gov/unemploy/weeklyRedirect.php");
    expect(result).toMatchObject({ state: "AVAILABLE", historyStatus: "PARTIAL" });
    expect(result.observations.at(-1)).toMatchObject({ value: 197, observedAt: "2026-09-26" });
  });

  it("marks long DOL history verified only when all weekly periods are contiguous", () => {
    expect(parseDolCoreClaims(claimsHistoryXml(), retrievedAt)).toMatchObject({
      state: "AVAILABLE",
      historyStatus: "VERIFIED",
    });
    expect(parseDolCoreClaims(claimsHistoryXml(300), retrievedAt)).toMatchObject({
      state: "AVAILABLE",
      historyStatus: "PARTIAL",
    });
  });

  it("parses the official G.17 B50001 seasonally adjusted total index and rejects bad or short files", () => {
    const result = parseFederalReserveIndustrialProduction(fixture("federal-reserve-g17-ip-sa.txt"), retrievedAt) as SeriesResult;
    expect(result).toMatchObject({
      sourceId: "federal-reserve-g17-ip",
      identifier: "B50001",
      state: "AVAILABLE",
      parserStatus: "VERIFIED",
      historyStatus: "VERIFIED",
    });
    expect(result.observations.at(-1)).toMatchObject({
      value: 118.2,
      unit: "index (G.17 total, release-defined base)",
      seasonalBasis: "SA",
      observedAt: "2026-08-01",
      releasedAt: null,
      retrievedAt,
    });
    expect(parseFederalReserveIndustrialProduction("<html>not a data file</html>", retrievedAt)).toMatchObject({
      state: "FAILED",
      observations: [],
    });
    expect(parseFederalReserveIndustrialProduction('"OTHER" 2026 1 2 3', retrievedAt)).toMatchObject({
      state: "MISSING",
      observations: [],
    });

    const duplicateYear = fixture("federal-reserve-g17-ip-sa.txt").replace(
      '"B50001" 2019 100.0 100.2 100.4 100.6 100.8 101.0 101.2 101.4 101.6 101.8 102.0 102.2',
      '"B50001" 2019 100.0 100.2 100.4 100.6 100.8 101.0 101.2 101.4 101.6 101.8 102.0 102.2\n"B50001" 2019 100.0 100.2 100.4 100.6 100.8 101.0 101.2 101.4 101.6 101.8 102.0 102.2',
    );
    expect(parseFederalReserveIndustrialProduction(duplicateYear, retrievedAt)).toMatchObject({ state: "FAILED", observations: [] });

    const shortenedHistoricalYear = fixture("federal-reserve-g17-ip-sa.txt").replace(
      '"B50001" 2019 100.0 100.2 100.4 100.6 100.8 101.0 101.2 101.4 101.6 101.8 102.0 102.2',
      '"B50001" 2019 100.0 100.2 100.4 100.6 100.8 101.0 101.2 101.4 101.6 101.8 102.0',
    );
    expect(parseFederalReserveIndustrialProduction(shortenedHistoricalYear, retrievedAt)).toMatchObject({ state: "FAILED", observations: [] });
  });

  it("does not put the oversized raw G.17 file in Next's fetch cache", async () => {
    let requestCache: RequestCache | undefined;
    const fetchImpl = vi.fn<typeof fetch>(async (_input, init) => {
      requestCache = init?.cache;
      return new Response(fixture("federal-reserve-g17-ip-sa.txt"), { status: 200 });
    });

    const result = await fetchFederalReserveIndustrialProduction({ fetchImpl, now: new Date(retrievedAt) });

    expect(result.state).toBe("AVAILABLE");
    expect(requestCache).toBe("no-store");
  });

  it("parses official target action dates and range midpoints without inventing announcement dates", () => {
    const result = parseFederalReservePolicyActions(fixture("federal-reserve-policy-actions.html"), retrievedAt) as SeriesResult;

    expect(result).toMatchObject({
      sourceId: "federal-reserve-policy-actions",
      state: "AVAILABLE",
      parserStatus: "VERIFIED",
    });
    expect(result.observations).toHaveLength(5);
    expect(result.observations).toContainEqual(expect.objectContaining({
      value: 1.125,
      observedAt: "2020-03-04",
      releasedAt: null,
    }));
    expect(result.observations.at(-1)).toMatchObject({
      value: 3.875,
      unit: "percent",
      seasonalBasis: "Not seasonally adjusted",
      observedAt: "2026-09-17",
      releasedAt: null,
      retrievedAt,
      releaseDateQuality: 0,
    });
    expect(parseFederalReservePolicyActions("<html>unrelated content</html>", retrievedAt)).toMatchObject({
      state: "FAILED",
      observations: [],
    });
  });

  it("keeps Treasury real yields redistribution-blocked even when a valid-looking feed is supplied", () => {
    const result = parseTreasuryRealYieldCore(fixture("treasury-real-yield.xml"), retrievedAt);
    expect(result).toMatchObject({
      sourceId: "treasury-real-yield",
      state: "REDISTRIBUTION_BLOCKED",
      observations: [],
    });
  });
});
