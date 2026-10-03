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
    dataAsOf: latestSnapshot.date,
    title: `Rules Brief: ${assessment.regime}`,
    regime: assessment.regime,
    executiveSummary: `${assessment.rationale[0]} ${playbook.thesis} This narrative is generated from mock observations and deterministic scoring rules.`,
    signals: highestSignals.map(
      (signal) => `${signal.label}: ${signal.score}/100 (${signal.reading}) - ${signal.summary}`,
    ),
    watchlist: [
      `Review USD/IDR if it moves materially above the ${latestSnapshot.metrics.usdidr.toLocaleString("en-US")} demo reference.`,
      `Compare stablecoin supply with the $${latestSnapshot.metrics.stablecoinMarketCap.toFixed(1)}bn demo reference before treating liquidity as confirmed.`,
      "Brent above $85 is a ruleset watch level, not a forecast or trade trigger.",
    ],
    riskNote:
      "Synthetic sample data; the report is rules-generated, not AI-generated. Research context only, not investment advice.",
    source: "mock",
  };

  return Response.json(report);
}
