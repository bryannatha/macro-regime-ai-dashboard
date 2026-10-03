import { readFileSync } from "node:fs";
import { describe, expect, it, vi } from "vitest";
import { parseBlsCpi, fetchBlsCpi } from "./bls";
import { parseEiaBrent, fetchEiaBrent } from "./eia";
import { parseTreasuryYields, fetchTreasuryYields } from "./treasury";
import { parseDolClaims, fetchDolClaims } from "./dol";
import { parseFedBroadDollar, fetchFedBroadDollar } from "./fed";
import { parseMempoolDemand, fetchMempoolDemand } from "./mempool";
import { parseFrankfurterUsdIdr, fetchFrankfurterUsdIdr } from "./frankfurter";

const fetchedAt = "2026-10-03T00:00:00.000Z";
const now = new Date(fetchedAt);
const fixture = (name: string) =>
  readFileSync(new URL(`../fixtures/${name}`, import.meta.url), "utf8");
const jsonFixture = (name: string) => JSON.parse(fixture(name)) as unknown;
const failedFetch = vi.fn<typeof fetch>().mockResolvedValue(
  new Response("upstream error", { status: 503 }),
);

function expectAvailable(observation: { status: string; value: number | null; observedAt: string | null }, value: number, date: string) {
  expect(observation.status).toBe("available");
  expect(observation.value).toBeCloseTo(value, 4);
  expect(observation.observedAt).toBe(date);
}

describe("BLS provider", () => {
  it("converts the same unadjusted month to CPI and core CPI year-over-year", () => {
    const result = parseBlsCpi(jsonFixture("bls.json"), fetchedAt);

    expectAvailable(result.cpi, ((324.8 / 319.2) - 1) * 100, "2026-08-01");
    expectAvailable(result.coreCpi, ((330.5 / 323.7) - 1) * 100, "2026-08-01");
    expect(result.cpi.source).toContain("Bureau of Labor Statistics");
    expect(result.cpi.cadence).toBe("Monthly");
    expect(result.cpi.fetchedAt).toBe(fetchedAt);
  });

  it("does not invent inflation when the matching month a year earlier is absent", () => {
    const payload = jsonFixture("bls.json") as { Results: { series: Array<{ data: unknown[] }> } };
    payload.Results.series[0].data.pop();

    expect(parseBlsCpi(payload, fetchedAt).cpi).toMatchObject({ status: "unavailable", value: null });
  });

  it("returns unavailable observations when the API responds unsuccessfully", async () => {
    const result = await fetchBlsCpi({ fetchImpl: failedFetch, now });

    expect(result.cpi).toMatchObject({ status: "unavailable", value: null });
    expect(result.coreCpi).toMatchObject({ status: "unavailable", value: null });
  });
});

describe("EIA provider", () => {
  it("parses Brent values and rejects invalid numeric data", () => {
    const result = parseEiaBrent(jsonFixture("eia.json"), fetchedAt);
    expectAvailable(result, 77.12, "2026-10-02");
    expect(result.source).toContain("Energy Information Administration");

    const invalid = parseEiaBrent({ response: { data: [{ period: "2026-10-02", value: "N/A" }] } }, fetchedAt);
    expect(invalid).toMatchObject({ status: "unavailable", value: null });
  });

  it("does not request EIA without its server key", async () => {
    const fetchImpl = vi.fn<typeof fetch>();
    const result = await fetchEiaBrent({ apiKey: "", fetchImpl, now });

    expect(fetchImpl).not.toHaveBeenCalled();
    expect(result).toMatchObject({ status: "unavailable", value: null });
  });

  it("isolates an upstream error and never returns the configured key", async () => {
    const apiKey = "fixture-secret-not-real";
    const fetchImpl = vi.fn<typeof fetch>().mockResolvedValue(new Response("error", { status: 503 }));
    const result = await fetchEiaBrent({ apiKey, fetchImpl, now });

    expect(result).toMatchObject({ status: "unavailable", value: null });
    expect(JSON.stringify(result)).not.toContain(apiKey);
  });
});

describe("Treasury provider", () => {
  it("uses the latest valid nominal 2Y and real 10Y observations", () => {
    const result = parseTreasuryYields(
      fixture("treasury-yield.xml"),
      fixture("treasury-real-yield.xml"),
      fetchedAt,
    );

    expectAvailable(result.twoYearYield, 3.58, "2026-10-02");
    expectAvailable(result.tenYearRealYield, 1.79, "2026-10-02");
    expect(result.twoYearYield.cadence).toBe("Daily");
  });

  it("marks malformed feeds unavailable rather than as zero", () => {
    const result = parseTreasuryYields("<feed />", "<feed />", fetchedAt);
    expect(result.twoYearYield).toMatchObject({ status: "unavailable", value: null });
    expect(result.tenYearRealYield).toMatchObject({ status: "unavailable", value: null });
  });

  it("isolates an unsuccessful Treasury response", async () => {
    const result = await fetchTreasuryYields({ fetchImpl: failedFetch, now });
    expect(result.twoYearYield).toMatchObject({ status: "unavailable", value: null });
    expect(result.tenYearRealYield).toMatchObject({ status: "unavailable", value: null });
  });
});

describe("DOL provider", () => {
  it("reads seasonally adjusted U.S. initial claims in thousands", () => {
    const result = parseDolClaims(fixture("dol-claims.xml"), fetchedAt);
    expectAvailable(result, 197, "2026-09-26");
    expect(result.unit).toBe("thousand claims");
    expect(result.source).toContain("Department of Labor");
    expect(result.history).toHaveLength(2);
  });

  it("does not use NSA values when the SA value is missing", () => {
    const result = parseDolClaims(
      "<r539cyNational><week><weekEnded>09/26/2026</weekEnded><InitialClaims><NSA>250,000</NSA></InitialClaims></week></r539cyNational>",
      fetchedAt,
    );
    expect(result).toMatchObject({ status: "unavailable", value: null });
  });

  it("isolates an unsuccessful weekly report response", async () => {
    expect(await fetchDolClaims({ fetchImpl: failedFetch, now })).toMatchObject({ status: "unavailable", value: null });
  });
});

describe("Federal Reserve provider", () => {
  it("parses the latest FRED-published H.10 Broad Dollar observation", () => {
    const result = parseFedBroadDollar(fixture("fed-broad-dollar.csv"), fetchedAt);
    expectAvailable(result, 117.8, "2026-10-02");
    expect(result.unit).toContain("Jan 2006=100");
    expect(result.source).toContain("Federal Reserve");
  });

  it("treats FRED's missing-value marker as unavailable", () => {
    expect(parseFedBroadDollar("observation_date,DTWEXBGS\n2026-10-02,.\n", fetchedAt)).toMatchObject({ status: "unavailable", value: null });
  });

  it("isolates a failed public CSV request", async () => {
    expect(await fetchFedBroadDollar({ fetchImpl: failedFetch, now })).toMatchObject({ status: "unavailable", value: null });
  });
});

describe("Mempool provider", () => {
  it("returns backlog and projected median fee as separate blockspace observations", () => {
    const result = parseMempoolDemand(
      jsonFixture("mempool.json"),
      jsonFixture("mempool-blocks.json"),
      fetchedAt,
    );

    expectAvailable(result.mempoolVsize, 4_200_000, "2026-10-03");
    expectAvailable(result.mempoolMedianFeeRate, 12.5, "2026-10-03");
    expect(result.mempoolMedianFeeRate.unit).toBe("sat/vB");
    expect(result.mempoolVsize.detail).toContain("not BTC price");
  });

  it("rejects missing backlog or fee fields", () => {
    const result = parseMempoolDemand({ vsize: "bad" }, [], fetchedAt);
    expect(result.mempoolVsize).toMatchObject({ status: "unavailable", value: null });
    expect(result.mempoolMedianFeeRate).toMatchObject({ status: "unavailable", value: null });
  });

  it("isolates a failed mempool request", async () => {
    const result = await fetchMempoolDemand({ fetchImpl: failedFetch, now });
    expect(result.mempoolVsize).toMatchObject({ status: "unavailable", value: null });
    expect(result.mempoolMedianFeeRate).toMatchObject({ status: "unavailable", value: null });
  });
});

describe("Frankfurter provider", () => {
  it("derives IDR per USD from same-date ECB EUR cross rates", () => {
    const result = parseFrankfurterUsdIdr(jsonFixture("frankfurter.json"), fetchedAt);
    expectAvailable(result, 20149.32 / 1.1225, "2026-10-02");
    expect(result.history).toHaveLength(2);
    expect(result.detail).toContain("JISDOR or tradable spot FX");
  });

  it("does not derive FX from unmatched dates or invalid rates", () => {
    const unmatched = [{ date: "2026-10-02", base: "EUR", quote: "IDR", rate: 20149.32 }];
    expect(parseFrankfurterUsdIdr(unmatched, fetchedAt)).toMatchObject({ status: "unavailable", value: null });
  });

  it("isolates a failed ECB reference-rate request", async () => {
    expect(await fetchFrankfurterUsdIdr({ fetchImpl: failedFetch, now })).toMatchObject({ status: "unavailable", value: null });
  });
});
