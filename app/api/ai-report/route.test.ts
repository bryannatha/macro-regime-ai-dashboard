import { beforeEach, describe, expect, it, vi } from "vitest";
import type { CategoryScore, DashboardPayload, RegimeAssessment } from "@/lib/types";

vi.mock("@/lib/market-data", () => ({ getDashboardPayload: vi.fn() }));

import { getDashboardPayload } from "@/lib/market-data";
import { getResearchImplications } from "@/lib/playbook";
import { evaluateRegime } from "@/lib/regime";
import { createUnconfiguredRegimeInputs } from "@/lib/market-data/regime-inputs";
import { GET } from "./route";

const scores: CategoryScore[] = [
  { key: "inflationPressure", label: "Inflation pressure indicator", score: 42, coverage: 1, coveragePercent: 100, orientation: "risk", reading: "Watch", summary: "CPI monitoring proxy.", explanation: "Indicator only." },
  { key: "growthStress", label: "Growth stress indicator", score: 38, coverage: 0.65, coveragePercent: 65, orientation: "risk", reading: "Contained", summary: "Claims monitoring proxy.", explanation: "Indicator only." },
  { key: "liquidity", label: "Liquidity indicator", score: 66, coverage: 1, coveragePercent: 100, orientation: "support", reading: "Strong", summary: "Broad dollar and real yield monitoring proxy.", explanation: "Indicator only." },
  { key: "cryptoDemand", label: "Crypto blockspace indicator", score: 59, coverage: 1, coveragePercent: 100, orientation: "demand", reading: "Building", summary: "Blockspace proxy, not buying pressure.", explanation: "Indicator only." },
  { key: "indonesiaRisk", label: "Indonesia FX risk indicator", score: 54, coverage: 0.75, coveragePercent: 75, orientation: "risk", reading: "Watch", summary: "ECB-derived USD/IDR cross.", explanation: "Indicator only." },
];

const emptyRegime = evaluateRegime(createUnconfiguredRegimeInputs());
const normalRegime: RegimeAssessment = {
  ...emptyRegime,
  assessmentStatus: "NORMAL",
  regime: "INFLATIONARY_EXPANSION",
  dataQuality: 91,
  regimeClarity: 88,
  candidates: [],
  reasonCodes: [],
};

function dashboard(regime: RegimeAssessment = emptyRegime): DashboardPayload {
  return {
    generatedAt: "2026-10-03T12:00:00.000Z",
    dataAsOf: "2026-10-02",
    sourceRegistry: [],
    observations: {
      cpi: { value: 3, status: "available", label: "CPI", observedAt: "2026-09-01", source: "BLS", detail: "", unit: "% YoY", key: "cpi", sourceUrl: null, fetchedAt: "2026-10-03T12:00:00.000Z", cadence: "Monthly", history: [] },
      oil: { value: null, status: "unavailable", label: "Brent crude", observedAt: null, source: "EIA", detail: "EIA_API_KEY is not configured", unit: "USD / barrel", key: "oil", sourceUrl: null, fetchedAt: "2026-10-03T12:00:00.000Z", cadence: "Daily", history: [] },
    } as unknown as DashboardPayload["observations"],
    scores,
    regime,
    researchImplications: regime.regime ? getResearchImplications(regime.regime) : null,
  };
}

describe("GET /api/ai-report", () => {
  beforeEach(() => vi.clearAllMocks());

  it("returns a coverage brief when the six-factor regime inputs are unavailable", async () => {
    vi.mocked(getDashboardPayload).mockResolvedValue(dashboard());
    const response = await GET();
    const report = await response.json();

    expect(response.status).toBe(200);
    expect(report).toMatchObject({
      regime: null,
      assessmentStatus: "INSUFFICIENT_DATA",
      dataQuality: 0,
      regimeClarity: null,
      source: "rules-based",
    });
    expect(report.title).toContain("Coverage");
    expect(report.executiveSummary).toContain("monitoring indicators");
    expect(report.executiveSummary).toMatch(/missing inputs/i);
    expect(report.researchImplications).toBeNull();
    expect(report.riskNote).toContain("Educational research tool, not financial advice.");
    expect(JSON.stringify(report)).not.toContain("EIA_API_KEY");
    expect(JSON.stringify(report)).not.toMatch(/\b(favor|reduce)\b/i);
  });

  it("returns descriptive regime implications without causal demand language", async () => {
    vi.mocked(getDashboardPayload).mockResolvedValue(dashboard(normalRegime));
    const response = await GET();
    const report = await response.json();

    expect(response.status).toBe(200);
    expect(report).toMatchObject({
      regime: "INFLATIONARY_EXPANSION",
      assessmentStatus: "NORMAL",
      dataQuality: 91,
      regimeClarity: 88,
      source: "rules-based",
    });
    expect(report.title).toContain("Inflationary Expansion");
    expect(report.executiveSummary).toContain("alongside");
    expect(report.researchImplications.counterSignals.join(" ")).toMatch(/supply or demand/i);
    expect(JSON.stringify(report)).not.toMatch(/\b(favor|reduce)\b/i);
  });
});
