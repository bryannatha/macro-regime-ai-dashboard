import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { describe, expect, it, vi } from "vitest";
import type { ObservationKey } from "@/lib/types";
import { createDashboardSnapshot } from "@/lib/dashboard-snapshot";
import type { CoreObservationSeriesResult, CoreSourceObservation } from "./types";
import { getDashboardPayload } from "./index";
import { fetchDolCoreClaims } from "./providers/dol";

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
      const year = url.searchParams.get("field_tdr_date_value");
      if (year && year !== "2026") return new Response("<feed />");
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
  it.each([
    {
      failed: false,
      priorDigest: "9266e1b695072ec600fad37a6211f7f7544ceba3e98a664474f53119d73a1ba8",
      digest: "9f7659d3c039800ace9c15d7d53c39f37a5eb87ee74b219261cc9950c36327f1",
    },
    {
      failed: true,
      priorDigest: "f84ea10f35793c5b3762d6c1d721aa111fce01f13ba007f74d2a781ebdd760d7",
      digest: "d45b810265195430af868268aa157297e8701c05a864c6b102e009f59b110d42",
    },
  ])("preserves the full dashboard and brief snapshot after release-grade correction (DOL failed=$failed)", async ({ failed, priorDigest, digest }) => {
    const fetchImpl = fixtureFetch((url) => failed && url.hostname === "oui.doleta.gov");
    const monthly = (sourceId: string, identifier: string, unit: string, seasonalBasis: string, base = 100) => {
      const result = inflationCoreSeries(sourceId, identifier, unit, seasonalBasis);
      result.observations = result.observations.map((item, index) => ({ ...item, value: base + index }));
      return result;
    };
    const quarterly = (sourceId: string, identifier: string, unit: string, seasonalBasis: string, value: number) => {
      const result = monthly(sourceId, identifier, unit, seasonalBasis);
      result.observations = Array.from({ length: 6 }, (_, index) => ({
        ...result.observations[0], value,
        observedAt: new Date(Date.UTC(2025, index * 3, 1)).toISOString().slice(0, 10),
      }));
      return result;
    };
    const treasury = monthly("treasury-real-yield", "TC_10YEAR", "percent", "Not seasonally adjusted");
    treasury.observations = Array.from({ length: 40 }, (_, index) => new Date(Date.UTC(2026, 8, 1 + index)))
      .filter((date) => date <= now && date.getUTCDay() !== 0 && date.getUTCDay() !== 6)
      .map((date) => ({ ...treasury.observations[0], observedAt: date.toISOString().slice(0, 10), value: 1 }));
    const policy = monthly("federal-reserve-policy-actions", "FOMC target range/action history", "percent", "Not seasonally adjusted");
    policy.observations = [{ ...policy.observations[0], observedAt: "2026-09-17", value: 3.875 }];

    let currentSources: CoreObservationSeriesResult[] = [];
    const payload = await getDashboardPayload({
      fetchImpl, now,
      loadCoreSources: async () => (currentSources = [
        monthly("bls-cpi", "CUUR0000SA0L1E", "index (1982-84=100)", "NSA"),
        monthly("bls-cpi", "CUUR0000SA0", "index (1982-84=100)", "NSA"),
        monthly("bea-pce-income", "T20804-M / DPCCRG", "index (2017=100)", "SA"),
        monthly("bea-pce-income", "T20804-M / DPCERG", "index (2017=100)", "SA"),
        quarterly("bea-gdp", "T10101-Q / A191RL", "percent SAAR", "SAAR", 2.1),
        monthly("federal-reserve-g17-ip", "B50001", "index (G.17 total, release-defined base)", "SA", 1000),
        monthly("bea-pce-income", "T20806-M / DPCERX", "millions of chained (2017) dollars (SAAR)", "SAAR", 1000),
        monthly("bea-pce-income", "T20600-M / A067RX", "millions of chained (2017) dollars (SAAR)", "SAAR", 1000),
        monthly("bls-labor", "CES0000000001", "thousand persons", "SA", 160000),
        await fetchDolCoreClaims({ fetchImpl, now }), policy, treasury,
        quarterly("federal-reserve-sloos", "Figure 1 Panel 1 / Large and medium", "percent net", "Not seasonally adjusted", 0),
        quarterly("federal-reserve-sloos", "Figure 1 Panel 1 / Small", "percent net", "Not seasonally adjusted", 0),
        quarterly("federal-reserve-credit-performance", "STFBQD%STFBAIL_XEOP_MA.Q", "percent", "SA", 2),
        quarterly("federal-reserve-credit-performance", "STFBQC%STFBAIL_MA.Q", "percent", "SA", 0.5),
        monthly("federal-reserve-h6-m2", "M2.M", "billions USD", "SA", 10000),
      ]),
    });
    const priorReleaseGrades = await getDashboardPayload({
      fetchImpl: fixtureFetch((url) => failed && url.hostname === "oui.doleta.gov"), now,
      loadCoreSources: async () => currentSources.map((series) => series.sourceId === "dol-initial-claims" ? {
        ...series,
        observations: series.observations.map((observation) => ({ ...observation, releaseDateQuality: 1 })),
      } : series),
    });
    expect(payload.observations).toEqual(priorReleaseGrades.observations);
    expect(payload.scores).toEqual(priorReleaseGrades.scores);
    expect(payload.regime).toEqual(priorReleaseGrades.regime);
    expect([priorReleaseGrades.regime.dataQuality, payload.regime.dataQuality]).toEqual(failed ? [58, 58] : [61, 61]);
    expect(payload.sourceRegistry.find((entry) => entry.id === "dol-initial-claims")?.releaseDateQuality).toBe(0.8);
    const snapshot = createDashboardSnapshot(payload);
    const priorSnapshot = createDashboardSnapshot({
      ...priorReleaseGrades,
      sourceRegistry: priorReleaseGrades.sourceRegistry.map((entry) => entry.id === "dol-initial-claims"
        ? { ...entry, releaseDateQuality: 1 }
        : entry),
    });
    expect(createHash("sha256").update(JSON.stringify(priorSnapshot)).digest("hex")).toBe(priorDigest);
    expect({
      ...snapshot,
      payload: {
        ...snapshot.payload,
        sourceRegistry: snapshot.payload.sourceRegistry.map((entry) => entry.id === "dol-initial-claims"
          ? { ...entry, releaseDateQuality: 1 }
          : entry),
      },
    }).toEqual(priorSnapshot);
    expect(snapshot.report).toEqual(priorSnapshot.report);
    expect(snapshot.report).toMatchObject({
      regime: payload.regime.regime, assessmentStatus: payload.regime.assessmentStatus,
      dataQuality: payload.regime.dataQuality, regimeClarity: payload.regime.regimeClarity,
      generatedAt: payload.generatedAt,
    });
    expect(payload.regime.factorReadiness.labor.coverage).toBe(failed ? 0.4 : 0.65);
    expect(payload.regime.assessmentStatus).toBe(failed ? "INSUFFICIENT_DATA" : "PROVISIONAL");
    // Includes the complete public payload and brief after correcting date-only release grades.
    expect(createHash("sha256").update(JSON.stringify(snapshot)).digest("hex")).toBe(digest);
  });

  it("normalizes all public sources with generated and provider fetch timestamps", async () => {
    const payload = await getDashboardPayload({
      fetchImpl: fixtureFetch(),
      now,
      eiaApiKey: "fixture-secret-not-real",
    });

    expect(payload.generatedAt).toBe(generatedAt);
    expect(payload.dataAsOf).toBe("2026-10-03");
    expect(Object.values(payload.observations).filter((item) => item.status === "available")).toHaveLength(10);
    expect(payload.observations.tenYearRealYield).toMatchObject({ status: "available", value: 1.79, observedAt: "2026-10-02" });
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
    expect(payload.regime.reasonCodes).not.toContain("POLICY_RATES_WITHHELD — TREASURY_REUSE_UNRESOLVED");
    expect(payload.regime.leadingDirection.direction).toBe("UNKNOWN");
    expect(payload.regime.inflationDirection.direction).toBe("UNKNOWN");
    expect(payload.regime.transitionRisk.level).toBe("UNKNOWN");
    expect(payload.researchImplications).toBeNull();
    expect(Object.values(payload.regime.factorReadiness).every((factor) => !factor.classifiable)).toBe(true);
    expect(payload.sourceRegistry.find((entry) => entry.id === "treasury-real-yield")?.reuseStatus).toBe("CLEARED");
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
    expect(payload.regime.reasonCodes).not.toContain("POLICY_RATES_WITHHELD — TREASURY_REUSE_UNRESOLVED");
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
    expect(payload.observations.tenYearRealYield).toMatchObject({ status: "available", value: 1.79 });
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
