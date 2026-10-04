import { describe, expect, it, vi } from "vitest";
import { fetchCoreHistorySources } from "./core-history";

describe("registered core history loader", () => {
  it("keeps registered source failures isolated and never requests the blocked Treasury real-yield feed", async () => {
    const requestedUrls: string[] = [];
    const fetchImpl = vi.fn<typeof fetch>(async (input) => {
      requestedUrls.push(String(input instanceof Request ? input.url : input));
      return new Response("temporary upstream failure", { status: 503 });
    });

    const series = await fetchCoreHistorySources({
      now: new Date("2026-10-05T12:00:00.000Z"),
      fetchImpl,
    });

    expect(series.some(({ sourceId }) => sourceId === "bls-cpi")).toBe(true);
    expect(series.some(({ sourceId }) => sourceId === "bea-gdp")).toBe(true);
    expect(series.some(({ sourceId }) => sourceId === "treasury-real-yield")).toBe(false);
    expect(requestedUrls.some((url) => url.includes("daily_treasury_real_yield_curve"))).toBe(false);
    expect(requestedUrls.some((url) => url.startsWith("https://apps.bea.gov/"))).toBe(true);
  });
});
