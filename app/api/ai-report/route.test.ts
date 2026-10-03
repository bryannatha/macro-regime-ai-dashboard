import { beforeEach, describe, expect, it, vi } from "vitest";
import type { CategoryScore, DashboardPayload, RegimeAssessment } from "@/lib/types";

vi.mock("@/lib/market-data", () => ({ getDashboardPayload: vi.fn() }));

import { getDashboardPayload } from "@/lib/market-data";
import { GET } from "./route";

const scores: CategoryScore[] = [
  { key: "inflationPressure", label: "Inflation pressure", score: 42, coverage: 1, coveragePercent: 100, orientation: "risk", reading: "Watch", summary: "CPI and Brent inputs.", explanation: "All inputs available." },
  { key: "growthStress", label: "Growth stress", score: 38, coverage: 1, coveragePercent: 100, orientation: "risk", reading: "Contained", summary: "Claims and rates.", explanation: "All inputs available." },
  { key: "liquidity", label: "Liquidity", score: 66, coverage: 1, coveragePercent: 100, orientation: "support", reading: "Strong", summary: "Broad Dollar Index and real yield.", explanation: "All inputs available." },
  { key: "cryptoDemand", label: "Crypto demand", score: 59, coverage: 1, coveragePercent: 100, orientation: "demand", reading: "Building", summary: "On-chain blockspace demand proxy, not BTC buying pressure.", explanation: "All inputs available." },
  { key: "indonesiaRisk", label: "Indonesia risk", score: 54, coverage: 1, coveragePercent: 100, orientation: "risk", reading: "Watch", summary: "ECB-derived USD/IDR cross.", explanation: "All inputs available." },
];

const assessment: RegimeAssessment = {
  regime: "Liquidity Reflation",
  confidence: 68,
  rationale: ["Liquidity inputs are supportive.", "This classification is a provisional heuristic."],
};

function dashboard(regime: DashboardPayload["regime"]): DashboardPayload {
  return {
    generatedAt: "2026-10-03T12:00:00.000Z",
    dataAsOf: "2026-10-02",
    observations: {
      cpi: { value: 3, status: "available", label: "CPI", observedAt: "2026-09-01", source: "BLS", detail: "", unit: "% YoY", key: "cpi", sourceUrl: null, fetchedAt: "2026-10-03T12:00:00.000Z", cadence: "Monthly", history: [] },
      oil: { value: null, status: "unavailable", label: "Brent crude", observedAt: null, source: "EIA", detail: "EIA_API_KEY is not configured", unit: "USD / barrel", key: "oil", sourceUrl: null, fetchedAt: "2026-10-03T12:00:00.000Z", cadence: "Daily", history: [] },
    } as unknown as DashboardPayload["observations"],
    scores,
    regime,
    playbook: regime ? { regime: regime.regime, thesis: "Selective risk support.", favor: ["Quality equities"], reduce: ["Excess leverage"], neutral: ["Oil"] } : null,
  };
}

describe("GET /api/ai-report", () => {
  beforeEach(() => vi.clearAllMocks());

  it("returns a source-aware rules brief without claiming AI authorship", async () => {
    vi.mocked(getDashboardPayload).mockResolvedValue(dashboard(assessment));
    const response = await GET();
    const report = await response.json();

    expect(response.status).toBe(200);
    expect(report).toMatchObject({
      regime: "Liquidity Reflation",
      source: "rules-based",
      dataAsOf: "2026-10-02",
    });
    expect(report.title).toContain("Liquidity Reflation");
    expect(report.executiveSummary).toContain("provisional");
    expect(report.signals.join(" ")).toContain("coverage");
    expect(report.riskNote).toContain("not AI-generated");
    expect(JSON.stringify(report)).not.toContain("EIA_API_KEY");
    expect(JSON.stringify(report)).not.toContain("mock-metrics");
  });

  it("returns a coverage brief instead of inventing a regime when core coverage is withheld", async () => {
    vi.mocked(getDashboardPayload).mockResolvedValue(dashboard(null));
    const report = await (await GET()).json();

    expect(report.regime).toBeNull();
    expect(report.title).toContain("Coverage");
    expect(report.executiveSummary).toContain("withheld");
    expect(report.source).toBe("rules-based");
  });
});
