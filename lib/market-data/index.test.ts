import { readFileSync } from "node:fs";
import { describe, expect, it, vi } from "vitest";
import type { ObservationKey } from "@/lib/types";
import type { CoreObservationSeriesResult, CoreSourceObservation } from "./types";
import { getDashboardPayload } from "./index";

const generatedAt = "2026-10-03T12:00:00.000Z";
const now = new Date(generatedAt);
const fixture = (name: string) => readFileSync(new URL(`./fixtures/${name}`, import.meta.url), "utf8");
const jsonFixture = (name: string) => JSON.parse(fixture(name)) as unknown;
const excludedKeys: ObservationKey[] = ["btcPrice", "hySpread", "goldPrice", "stablecoinMarketCap"];

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

function dolReleaseFixture(): string {
  const last = Date.parse("2026-09-26T00:00:00.000Z");
  const rows = Array.from({ length: 54 }, (_, index) => {
    const date = new Date(last - (53 - index) * 7 * 86_400_000).toLocaleDateString("en-US", {
      month: "long", day: "numeric", year: "numeric", timeZone: "UTC",
    });
    return `${date} ${index === 53 ? 197 : 200} 0 200.00 1,700 -10 1,720.00 1.1`;
  });
  return [
    "UNEMPLOYMENT INSURANCE WEEKLY CLAIMS",
    "SEASONALLY ADJUSTED DATA",
    "8:30 A.M. (Eastern) Thursday, October 1, 2026",
    "Seasonally Adjusted US Weekly UI Claims (in thousands)",
    "Change Change",
    "from from",
    "Initial Prior 4-Week Insured Prior 4-Week",
    "Week Ending Claims Week Average Unemployment Week Average IUR",
    ...rows,
  ].join("\n");
}

function fixtureFetch(fail?: (url: URL) => boolean): typeof fetch {
  return vi.fn<typeof fetch>(async (input) => {
    const url = new URL(input instanceof Request ? input.url : String(input));
    if (fail?.(url)) return new Response("temporary source error", { status: 503 });

    if (url.hostname === "api.bls.gov") return Response.json(jsonFixture("bls.json"));
    if (url.hostname === "api.eia.gov") return Response.json(jsonFixture("eia.json"));
    if (url.hostname === "home.treasury.gov") {
      const real = url.searchParams.get("data") === "daily_treasury_real_yield_curve";
      return new Response(fixture(real ? "treasury-real-yield.xml" : "treasury-yield.xml"));
    }
    if (url.hostname === "oui.doleta.gov") return new Response(dolReleaseFixture());
    if (url.hostname === "fred.stlouisfed.org") return new Response(fixture("fed-broad-dollar.csv"));
    if (url.hostname === "mempool.space") {
      return Response.json(url.pathname.endsWith("/mempool")
        ? jsonFixture("mempool.json")
        : jsonFixture("mempool-blocks.json"));
    }
    if (url.hostname === "api.frankfurter.dev") return Response.json(jsonFixture("frankfurter.json"));
    return new Response("unexpected fixture URL", { status: 404 });
  }) as typeof fetch;
}

function inflationCoreSeries(
  sourceId: string,
  identifier: string,
  unit: string,
  seasonalBasis: string,
  startYear = 2025,
  startMonth = 8,
  retrievedAt = generatedAt,
): CoreObservationSeriesResult {
  const observations: CoreSourceObservation[] = Array.from({ length: 14 }, (_, index) => {
    const serial = startYear * 12 + startMonth - 1 + index;
    const year = Math.floor(serial / 12);
    const month = (serial % 12) + 1;
    return {
      sourceId,
      identifier,
      value: 100 + index,
      unit,
      seasonalBasis,
      observedAt: String(year) + "-" + String(month).padStart(2, "0") + "-01",
      releasedAt: "2026-10-01",
      retrievedAt,
      firstSeenAt: null,
      releaseDateQuality: 0.8,
      version: null,
      vintage: null,
    };
  });
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

describe("getDashboardPayload", () => {
  it("normalizes all public sources with generated and provider fetch timestamps", async () => {
    const payload = await getDashboardPayload({
      fetchImpl: fixtureFetch(),
      now,
      eiaApiKey: "fixture-secret-not-real",
    });

    expect(payload.generatedAt).toBe(generatedAt);
    expect(payload.dataAsOf).toBe("2026-10-03");
    expect(Object.values(payload.observations).filter((item) => item.status === "available")).toHaveLength(9);
    expect(payload.observations.tenYearRealYield).toMatchObject({ status: "unavailable", value: null });
    expect(Object.values(payload.observations).every((item) => item.fetchedAt === generatedAt)).toBe(true);
    expect(Object.values(payload.observations).filter((item) => item.status === "excluded").map((item) => item.key).sort())
      .toEqual([...excludedKeys].sort());
    expect(payload.observations.broadDollarIndex.label).toBe("Broad Dollar Index");
    expect(payload.observations.usdidr.detail).toContain("not BI JISDOR or tradable spot FX");
    expect(payload.observations.mempoolVsize.detail).toContain("blockspace demand proxy");
    expect(payload.scores).toHaveLength(5);
    expect(payload.regime).toMatchObject({
      assessmentStatus: "INSUFFICIENT_DATA",
      regime: null,
      dataQuality: 0,
      regimeClarity: null,
    });
    expect(payload.regime.reasonCodes).toContain("POLICY_RATES_WITHHELD — TREASURY_REUSE_UNRESOLVED");
    expect(payload.regime.leadingDirection.direction).toBe("UNKNOWN");
    expect(payload.regime.inflationDirection.direction).toBe("UNKNOWN");
    expect(payload.regime.transitionRisk.level).toBe("UNKNOWN");
    expect(payload.researchImplications).toBeNull();
    expect(Object.values(payload.regime.factorReadiness).every((factor) => !factor.classifiable)).toBe(true);
    expect(payload.sourceRegistry.find((entry) => entry.id === "treasury-real-yield")).toMatchObject({
      sourceHealth: "REDISTRIBUTION_BLOCKED",
      reuseStatus: "UNRESOLVED",
    });
    expect(JSON.stringify(payload)).not.toContain("fixture-secret-not-real");
  });

  it("feeds registered core history to factor readiness without promoting monitoring proxies into the classifier", async () => {
    let coreLoadCount = 0;
    const payload = await getDashboardPayload({
      fetchImpl: fixtureFetch(),
      now,
      loadCoreSources: async () => {
        coreLoadCount += 1;
        return [
          inflationCoreSeries("bls-cpi", "CUUR0000SA0L1E", "index (1982-84=100)", "NSA"),
          inflationCoreSeries("bea-pce-income", "T20804-M / DPCCRG", "index (2017=100)", "SA"),
        ];
      },
    });

    expect(coreLoadCount).toBe(1);
    expect(payload.regime.factorReadiness.inflation).toMatchObject({
      coverage: 0.7,
      eligibleFamilies: 2,
      classifiable: true,
    });
    expect(payload.regime.factorReadiness.growth.classifiable).toBe(false);
    expect(payload.regime).toMatchObject({ assessmentStatus: "INSUFFICIENT_DATA", regime: null });
    expect(payload.regime.reasonCodes).toContain("POLICY_RATES_WITHHELD — TREASURY_REUSE_UNRESOLVED");
    expect(payload.scores).toHaveLength(5);
    expect(payload.sourceRegistry.find((source) => source.id === "bls-cpi")).toMatchObject({
      sourceHealth: "AVAILABLE",
      parserStatus: "PARTIAL",
      observedAt: "2026-09-01",
      releasedAt: "2026-10-01",
      retrievedAt: generatedAt,
    });
    expect(payload.sourceRegistry.find((source) => source.id === "bls-cpi")?.healthReason).toContain("1 of 4");
  });

  it("uses a completion-time as-of so fresh sources retrieved during the request are not future-dated", async () => {
    const payload = await getDashboardPayload({
      fetchImpl: fixtureFetch(),
      loadCoreSources: async () => {
        await new Promise((resolve) => setTimeout(resolve, 10));
        const retrievedAt = new Date().toISOString();
        return [
          inflationCoreSeries("bls-cpi", "CUUR0000SA0L1E", "index (1982-84=100)", "NSA", 2025, 8, retrievedAt),
          inflationCoreSeries("bea-pce-income", "T20804-M / DPCCRG", "index (2017=100)", "SA", 2025, 8, retrievedAt),
        ];
      },
    });

    expect(payload.regime.factorReadiness.inflation).toMatchObject({
      eligibleFamilies: 2,
      classifiable: true,
    });
    const retrievedAt = payload.sourceRegistry.find((source) => source.id === "bls-cpi")?.retrievedAt;
    expect(retrievedAt).not.toBeNull();
    expect(Date.parse(retrievedAt!)).toBeLessThanOrEqual(Date.parse(payload.generatedAt));
  });

  it("loads the registered core adapters on the default dashboard service path", async () => {
    const fetchImpl = fixtureFetch();
    await getDashboardPayload({ fetchImpl, now, eiaApiKey: "" });
    const requestedUrls = vi.mocked(fetchImpl).mock.calls.map(([input]) => String(input));

    expect(requestedUrls.some((url) => url.startsWith("https://apps.bea.gov/"))).toBe(true);
  });

  it("does not treat recently retrieved but old reference periods as fresh core inputs", async () => {
    const payload = await getDashboardPayload({
      fetchImpl: fixtureFetch(),
      now,
      loadCoreSources: async () => [
        inflationCoreSeries("bls-cpi", "CUUR0000SA0L1E", "index (1982-84=100)", "NSA", 2024, 1),
        inflationCoreSeries("bea-pce-income", "T20804-M / DPCCRG", "index (2017=100)", "SA", 2024, 1),
      ],
    });

    expect(payload.regime.factorReadiness.inflation).toMatchObject({
      coverage: 0,
      eligibleFamilies: 0,
      classifiable: false,
      status: "WITHHELD",
    });
    expect(payload.sourceRegistry.find((source) => source.id === "bls-cpi")).toMatchObject({
      sourceHealth: "STALE",
      observedAt: "2025-02-01",
    });
  });

  it("does not present a failed fetch attempt as a successful retrieval date", async () => {
    const payload = await getDashboardPayload({
      fetchImpl: fixtureFetch(),
      now,
      loadCoreSources: async () => [{
        sourceId: "bls-cpi",
        identifier: "CUUR0000SA0L1E",
        state: "FAILED",
        observations: [],
        parserStatus: "FAILED",
        historyStatus: "FAILED",
        retrievedAt: generatedAt,
        reason: "The source request failed.",
      }],
    });

    expect(payload.sourceRegistry.find((source) => source.id === "bls-cpi")).toMatchObject({
      sourceHealth: "FAILED",
      observedAt: null,
      releasedAt: null,
      retrievedAt: null,
    });
  });

  it("measures quarterly freshness from the end of the reference quarter", async () => {
    const retrievedAt = generatedAt;
    const payload = await getDashboardPayload({
      fetchImpl: fixtureFetch(),
      now,
      loadCoreSources: async () => [{
        sourceId: "bea-gdp",
        identifier: "T10101-Q / A191RL",
        state: "AVAILABLE",
        observations: [{
          sourceId: "bea-gdp",
          identifier: "T10101-Q / A191RL",
          value: 2.1,
          unit: "percent SAAR",
          seasonalBasis: "SAAR",
          observedAt: "2026-04-01",
          releasedAt: "2026-09-25",
          retrievedAt,
          firstSeenAt: null,
          releaseDateQuality: 0.8,
          version: null,
          vintage: null,
        }],
        parserStatus: "VERIFIED",
        historyStatus: "VERIFIED",
        retrievedAt,
        reason: null,
      }],
    });

    expect(payload.sourceRegistry.find((source) => source.id === "bea-gdp")).toMatchObject({
      sourceHealth: "AVAILABLE",
      observedAt: "2026-04-01",
    });
  });

  it("keeps the latest Federal Reserve policy action current until a new action supersedes it", async () => {
    const retrievedAt = generatedAt;
    const payload = await getDashboardPayload({
      fetchImpl: fixtureFetch(),
      now,
      loadCoreSources: async () => [{
        sourceId: "federal-reserve-policy-actions",
        identifier: "FOMC target range/action history",
        state: "AVAILABLE",
        observations: [{
          sourceId: "federal-reserve-policy-actions",
          identifier: "FOMC target range/action history",
          value: 3.875,
          unit: "percent",
          seasonalBasis: "Not seasonally adjusted",
          observedAt: "2026-08-01",
          releasedAt: null,
          retrievedAt,
          firstSeenAt: null,
          releaseDateQuality: 0,
          version: null,
          vintage: null,
        }],
        parserStatus: "VERIFIED",
        historyStatus: "VERIFIED",
        retrievedAt,
        reason: null,
      }],
    });

    expect(payload.sourceRegistry.find((source) => source.id === "federal-reserve-policy-actions")).toMatchObject({
      sourceHealth: "AVAILABLE",
      observedAt: "2026-08-01",
      releasedAt: null,
      retrievedAt,
    });
  });

  it("keeps other observations available when one Treasury feed fails", async () => {
    const payload = await getDashboardPayload({
      fetchImpl: fixtureFetch((url) => url.searchParams.get("data") === "daily_treasury_yield_curve"),
      now,
      eiaApiKey: "fixture-secret-not-real",
    });

    expect(payload.observations.twoYearYield).toMatchObject({ status: "unavailable", value: null });
    expect(payload.observations.tenYearRealYield).toMatchObject({ status: "unavailable", value: null });
    expect(payload.observations.cpi.status).toBe("available");
  });

  it("marks Brent unavailable without an EIA key and never calls EIA", async () => {
    const fetchImpl = fixtureFetch();
    const payload = await getDashboardPayload({ fetchImpl, now, eiaApiKey: "" });
    const requestedUrls = vi.mocked(fetchImpl).mock.calls.map(([input]) => String(input));

    expect(payload.observations.oil).toMatchObject({ status: "unavailable", value: null });
    expect(payload.observations.oil.detail).toContain("EIA_API_KEY");
    expect(requestedUrls.some((url) => url.includes("api.eia.gov"))).toBe(false);
    expect(JSON.stringify(payload)).not.toContain("api_key");
  });
});
