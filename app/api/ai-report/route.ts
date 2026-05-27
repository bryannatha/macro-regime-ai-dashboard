import { latestSnapshot, previousSnapshot } from "@/data/mock-metrics";
import { getPlaybook } from "@/lib/playbook";
import { calculateScores, classifyRegime } from "@/lib/scoring";
import type { AIReport } from "@/lib/types";

export const dynamic = "force-dynamic";

export function GET() {
  const scores = calculateScores(latestSnapshot, previousSnapshot);
  const assessment = classifyRegime(latestSnapshot, scores);
  const playbook = getPlaybook(assessment.regime);
  const highestSignals = [...scores].sort((a, b) => b.score - a.score).slice(0, 3);

  const report: AIReport = {
    generatedAt: new Date().toISOString(),
    title: `Daily Regime Brief: ${assessment.regime}`,
    regime: assessment.regime,
    executiveSummary: `${assessment.rationale[0]} ${playbook.thesis} This narrative is generated from mock observations and deterministic scoring rules.`,
    signals: highestSignals.map(
      (signal) => `${signal.label}: ${signal.score}/100 (${signal.reading}) - ${signal.summary}`,
    ),
    watchlist: [
      `Monitor USDIDR above ${latestSnapshot.metrics.usdidr.toLocaleString("en-US")} for renewed Indonesia FX pressure.`,
      `Watch stablecoin market cap near $${latestSnapshot.metrics.stablecoinMarketCap.toFixed(1)}bn as a liquidity confirmation signal.`,
      `Track Brent oil above $85 as a trigger for commodity-inflation risk.`,
    ],
    riskNote:
      "This mocked AI report is a research summary only. It does not provide investment recommendations or trade execution.",
    source: "mock",
  };

  return Response.json(report);
}
