import { describe, expect, it, vi } from "vitest";
import type { CoreObservationSeriesResult } from "../types";

const mocks = vi.hoisted(() => ({
  bea: vi.fn(),
  bls: vi.fn(async () => []),
  dol: vi.fn(async () => []),
  industrialProduction: vi.fn(),
  policyActions: vi.fn(async () => []),
  creditPerformance: vi.fn(async () => []),
  h41: vi.fn(async () => []),
  h6: vi.fn(async () => []),
  h8: vi.fn(async () => []),
  sloos: vi.fn(async () => []),
}));

vi.mock("next/cache", () => ({
  unstable_cache: (operation: () => Promise<unknown>) => {
    let cached = false;
    let value: unknown;
    return async () => {
      if (cached) return value;
      const result = await operation();
      cached = true;
      value = result;
      return result;
    };
  },
}));

vi.mock("./bea", () => ({ fetchBeaCoreSources: mocks.bea }));
vi.mock("./bls", () => ({ fetchBlsCoreSources: mocks.bls }));
vi.mock("./dol", () => ({ fetchDolCoreClaims: mocks.dol }));
vi.mock("./federal-reserve-core", () => ({
  fetchFederalReserveIndustrialProduction: mocks.industrialProduction,
  fetchFederalReservePolicyActions: mocks.policyActions,
}));
vi.mock("./federal-reserve-support", () => ({
  fetchFederalReserveCreditPerformance: mocks.creditPerformance,
  fetchFederalReserveH41Liquidity: mocks.h41,
  fetchFederalReserveH6M2: mocks.h6,
  fetchFederalReserveH8Loans: mocks.h8,
  fetchFederalReserveSloos: mocks.sloos,
}));

import { fetchCoreHistorySources } from "./core-history";

function sourceSeries(
  sourceId: string,
  identifier: string,
  state: "AVAILABLE" | "FAILED",
  retrievedAt = "2026-10-05T12:00:00.000Z",
): CoreObservationSeriesResult {
  return {
    sourceId,
    identifier,
    state,
    observations: state === "AVAILABLE" ? [{
      sourceId,
      identifier,
      value: 100,
      unit: "test",
      seasonalBasis: "SA",
      observedAt: "2026-09-01",
      releasedAt: null,
      retrievedAt,
      firstSeenAt: null,
      releaseDateQuality: 1,
      version: null,
      vintage: null,
    }] : [],
    parserStatus: state === "AVAILABLE" ? "VERIFIED" : "FAILED",
    historyStatus: "PARTIAL",
    retrievedAt,
    reason: state === "FAILED" ? "temporary upstream failure" : null,
  };
}

describe("core source cache", () => {
  it("does not cache failed BEA or industrial-production results", async () => {
    const beaFailure = sourceSeries("bea-gdp", "T10101-Q / A191RL", "FAILED");
    const pceFailure = sourceSeries("bea-pce-income", "T20804-M / DPCCRG", "FAILED");
    const beaSuccess = sourceSeries("bea-gdp", "T10101-Q / A191RL", "AVAILABLE");
    const pceSuccess = sourceSeries("bea-pce-income", "T20804-M / DPCCRG", "AVAILABLE");
    const productionFailure = sourceSeries("federal-reserve-g17-ip", "B50001", "FAILED");
    const productionSuccess = sourceSeries("federal-reserve-g17-ip", "B50001", "AVAILABLE");
    mocks.bea
      .mockResolvedValueOnce([beaFailure, pceFailure])
      .mockResolvedValueOnce([beaSuccess, pceFailure])
      .mockResolvedValueOnce([beaSuccess, pceSuccess]);
    mocks.industrialProduction
      .mockResolvedValueOnce(productionFailure)
      .mockResolvedValueOnce(productionSuccess);

    const first = await fetchCoreHistorySources({ now: new Date("2026-10-05T12:00:00.000Z") });
    const second = await fetchCoreHistorySources({ now: new Date("2026-10-05T12:05:00.000Z") });
    const third = await fetchCoreHistorySources({ now: new Date("2026-10-05T12:10:00.000Z") });

    expect(first.find(({ sourceId }) => sourceId === "bea-gdp")?.state).toBe("FAILED");
    expect(first.find(({ sourceId }) => sourceId === "bea-pce-income")?.state).toBe("FAILED");
    expect(first.find(({ sourceId }) => sourceId === "federal-reserve-g17-ip")?.state).toBe("FAILED");
    expect(second.find(({ sourceId }) => sourceId === "bea-gdp")?.state).toBe("AVAILABLE");
    expect(second.find(({ sourceId }) => sourceId === "bea-pce-income")?.state).toBe("FAILED");
    expect(third.find(({ sourceId }) => sourceId === "bea-gdp")?.state).toBe("AVAILABLE");
    expect(third.find(({ sourceId }) => sourceId === "bea-pce-income")?.state).toBe("AVAILABLE");
    expect(second.find(({ sourceId }) => sourceId === "federal-reserve-g17-ip")?.state).toBe("AVAILABLE");
    expect(mocks.bea).toHaveBeenCalledTimes(3);
    expect(mocks.industrialProduction).toHaveBeenCalledTimes(2);
  });
});
