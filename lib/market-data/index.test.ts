import { readFileSync } from "node:fs";
import { describe, expect, it, vi } from "vitest";
import type { ObservationKey } from "@/lib/types";
import { getDashboardPayload } from "./index";

const generatedAt = "2026-10-03T12:00:00.000Z";
const now = new Date(generatedAt);
const fixture = (name: string) => readFileSync(new URL(`./fixtures/${name}`, import.meta.url), "utf8");
const jsonFixture = (name: string) => JSON.parse(fixture(name)) as unknown;
const excludedKeys: ObservationKey[] = ["btcPrice", "hySpread", "goldPrice", "stablecoinMarketCap"];

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
    if (url.hostname === "oui.doleta.gov") return new Response(fixture("dol-claims.xml"));
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

describe("getDashboardPayload", () => {
  it("normalizes all public sources with generated and provider fetch timestamps", async () => {
    const payload = await getDashboardPayload({
      fetchImpl: fixtureFetch(),
      now,
      eiaApiKey: "fixture-secret-not-real",
    });

    expect(payload.generatedAt).toBe(generatedAt);
    expect(payload.dataAsOf).toBe("2026-10-03");
    expect(Object.values(payload.observations).filter((item) => item.status === "available")).toHaveLength(10);
    expect(Object.values(payload.observations).every((item) => item.fetchedAt === generatedAt)).toBe(true);
    expect(Object.values(payload.observations).filter((item) => item.status === "excluded").map((item) => item.key).sort())
      .toEqual([...excludedKeys].sort());
    expect(payload.observations.broadDollarIndex.label).toBe("Broad Dollar Index");
    expect(payload.observations.usdidr.detail).toContain("not BI JISDOR or tradable spot FX");
    expect(payload.observations.mempoolVsize.detail).toContain("blockspace demand proxy");
    expect(payload.scores).toHaveLength(5);
    expect(payload.regime).not.toBeNull();
    expect(payload.playbook).not.toBeNull();
    expect(JSON.stringify(payload)).not.toContain("fixture-secret-not-real");
  });

  it("keeps other observations available when one Treasury feed fails", async () => {
    const payload = await getDashboardPayload({
      fetchImpl: fixtureFetch((url) => url.searchParams.get("data") === "daily_treasury_yield_curve"),
      now,
      eiaApiKey: "fixture-secret-not-real",
    });

    expect(payload.observations.twoYearYield).toMatchObject({ status: "unavailable", value: null });
    expect(payload.observations.tenYearRealYield.status).toBe("available");
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
