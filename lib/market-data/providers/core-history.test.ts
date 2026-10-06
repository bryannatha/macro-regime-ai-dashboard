import { describe, expect, it, vi } from "vitest";
import { readFileSync } from "node:fs";
import { fetchCoreHistorySources } from "./core-history";

const fixture = (name: string) => readFileSync(new URL(`../fixtures/${name}`, import.meta.url), "utf8");

describe("registered core history loader", () => {
  it("keeps source failures isolated while requesting the admitted Treasury real-yield feed", async () => {
    const requestedUrls: string[] = [];
    const fetchImpl = vi.fn<typeof fetch>(async (input) => {
      requestedUrls.push(String(input instanceof Request ? input.url : input));
      return new Response("temporary upstream failure", { status: 503 });
    });

    const series = await fetchCoreHistorySources({
      now: new Date("2026-10-05T12:00:00.000Z"),
      fetchImpl,
      historyStartYear: 2026,
    });

    expect(series.some(({ sourceId }) => sourceId === "bls-cpi")).toBe(true);
    expect(series.some(({ sourceId }) => sourceId === "bea-gdp")).toBe(true);
    expect(series.some(({ sourceId, state }) => sourceId === "treasury-real-yield" && state === "FAILED")).toBe(true);
    expect(requestedUrls.some((url) => url.includes("daily_treasury_real_yield_curve"))).toBe(true);
    expect(requestedUrls.some((url) => url.startsWith("https://apps.bea.gov/"))).toBe(true);
  });

  it("loads and maps the Treasury real-yield history through the core-source contract", async () => {
    const fetchImpl = vi.fn<typeof fetch>(async (input) => {
      const url = new URL(input instanceof Request ? input.url : String(input));
      if (url.searchParams.get("data") === "daily_treasury_real_yield_curve") {
        return new Response(fixture("treasury-real-yield.xml"));
      }
      return new Response("temporary upstream failure", { status: 503 });
    });

    const series = await fetchCoreHistorySources({
      now: new Date("2026-10-05T12:00:00.000Z"),
      fetchImpl,
      historyStartYear: 2026,
    });
    const treasury = series.find(({ sourceId }) => sourceId === "treasury-real-yield");

    expect(treasury).toMatchObject({
      sourceId: "treasury-real-yield",
      identifier: "TC_10YEAR",
      state: "AVAILABLE",
      parserStatus: "VERIFIED",
      historyStatus: "PARTIAL",
      observations: [
        { value: 1.82, observedAt: "2026-10-01" },
        { value: 1.79, observedAt: "2026-10-02" },
      ],
    });
  });
});
