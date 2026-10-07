import { beforeEach, describe, expect, it, vi } from "vitest";
import type { DashboardPayload, MetricObservation, ObservationKey } from "@/lib/types";
import { evaluateRegime } from "@/lib/regime";
import { createUnconfiguredRegimeInputs } from "@/lib/market-data/regime-inputs";

vi.mock("@/lib/market-data", () => ({ getDashboardPayload: vi.fn() }));

import { getDashboardPayload } from "@/lib/market-data";
import { GET } from "./route";

const observationKeys: ObservationKey[] = [
  "cpi", "coreCpi", "oil", "broadDollarIndex", "twoYearYield", "tenYearRealYield",
  "joblessClaims", "mempoolVsize", "mempoolMedianFeeRate", "usdidr", "btcPrice",
  "hySpread", "goldPrice", "stablecoinMarketCap",
];

function observation(key: ObservationKey): MetricObservation {
  const excluded = ["btcPrice", "hySpread", "goldPrice", "stablecoinMarketCap"].includes(key);
  const label = key === "broadDollarIndex"
    ? "Broad Dollar Index"
    : key === "usdidr"
      ? "USD / IDR (ECB cross)"
      : key;
  return {
    key,
    label,
    value: key === "oil" || excluded ? null : 1,
    unit: "test units",
    source: excluded ? "Not sourced in the public-data tier" : "Public source",
    sourceUrl: null,
    observedAt: key === "oil" || excluded ? null : "2026-10-02",
    fetchedAt: "2026-10-03T12:00:00.000Z",
    cadence: "Daily",
    status: excluded ? "excluded" : key === "oil" ? "unavailable" : "available",
    detail: key === "oil" ? "EIA_API_KEY is not configured on the server." : "Test observation.",
    history: [],
  };
}

const payload: DashboardPayload = {
  generatedAt: "2026-10-03T12:00:00.000Z",
  dataAsOf: "2026-10-02",
  sourceRegistry: [],
  observations: Object.fromEntries(observationKeys.map((key) => [key, observation(key)])) as DashboardPayload["observations"],
  scores: [],
  regime: evaluateRegime(createUnconfiguredRegimeInputs()),
  researchImplications: null,
};

describe("GET /api/market-data", () => {
  beforeEach(() => vi.clearAllMocks());

  it("returns the normalized payload with substitute, unavailable, and excluded statuses", async () => {
    vi.mocked(getDashboardPayload).mockResolvedValue(payload);
    const response = await GET();
    const body = await response.json() as DashboardPayload;

    expect(response.status).toBe(200);
    expect(body.observations.broadDollarIndex.label).toBe("Broad Dollar Index");
    expect(body.observations.usdidr.label).toBe("USD / IDR (ECB cross)");
    expect(body.observations.oil).toMatchObject({ status: "unavailable", value: null });
    expect(body.observations.btcPrice).toMatchObject({ status: "excluded", value: null });
    expect(body.regime).toMatchObject({
      assessmentStatus: "INSUFFICIENT_DATA",
      regime: null,
      dataQuality: 0,
      regimeClarity: null,
    });
    expect(body.researchImplications).toBeNull();
    expect(JSON.stringify(body)).not.toContain("api_key");
    expect(JSON.stringify(body)).not.toContain("synthetic");
  });

  it("serializes unknown directions and the unresolved Treasury blocker without assigning a regime", async () => {
    const blocker = "POLICY_RATES_WITHHELD — TREASURY_REUSE_UNRESOLVED";
    const blockedPayload: DashboardPayload = {
      ...payload,
      regime: evaluateRegime(createUnconfiguredRegimeInputs([blocker])),
    };
    vi.mocked(getDashboardPayload).mockResolvedValue(blockedPayload);

    const first = await (await GET()).json() as DashboardPayload;
    const second = await (await GET()).json() as DashboardPayload;

    expect(JSON.stringify(first)).toBe(JSON.stringify(second));
    expect(first.regime).toMatchObject({
      assessmentStatus: "INSUFFICIENT_DATA",
      regime: null,
      regimeClarity: null,
      reasonCodes: expect.arrayContaining([blocker, "anchor_unavailable:inflation", "anchor_unavailable:growth"]),
      leadingDirection: { direction: "UNKNOWN" },
      inflationDirection: { direction: "UNKNOWN" },
      transitionRisk: { level: "UNKNOWN" },
    });
  });
});
