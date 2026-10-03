import { getDashboardPayload } from "@/lib/market-data";
import type { AIReport, CategoryScore, ScoreKey } from "@/lib/types";

export const dynamic = "force-dynamic";

const requiredCore: ScoreKey[] = [
  "inflationPressure",
  "growthStress",
  "liquidity",
  "cryptoDemand",
];

function coverageLine(scores: CategoryScore[]): string {
  return requiredCore.map((key) => {
    const score = scores.find((item) => item.key === key);
    return `${score?.label ?? key}: ${score?.coveragePercent ?? 0}% coverage${score?.score === null || score?.score === undefined ? " (score withheld)" : ""}`;
  }).join("; ");
}

export async function GET() {
  const payload = await getDashboardPayload();
  const availableSignals = payload.scores
    .filter((score) => score.score !== null)
    .sort((left, right) => (right.score ?? 0) - (left.score ?? 0))
    .slice(0, 3);
  const signals = availableSignals.map(
    (signal) => `${signal.label}: ${signal.score}/100 (${signal.reading}; ${signal.coveragePercent}% coverage). ${signal.summary}`,
  );
  const coverage = coverageLine(payload.scores);
  const regime = payload.regime?.regime ?? null;
  const summary = payload.regime && payload.playbook
    ? `${payload.regime.rationale.join(" ")} ${payload.playbook.thesis} The regime is a deterministic rules classification with provisional, unbacktested thresholds. ${coverage}.`
    : `Regime withheld because one or more required core categories has less than 60% input coverage. ${coverage}. Missing inputs are not treated as zero.`;
  const unavailable = Object.values(payload.observations)
    .filter((observation) => observation.status === "unavailable")
    .map((observation) => `${observation.label}: unavailable; check the source status and cadence.`);
  const watchlist = [
    ...unavailable.slice(0, 4),
    "Brent above $85 is a provisional ruleset watch level, not a forecast or trade trigger.",
    "The USD/IDR value is an ECB-derived reference cross, not BI JISDOR or tradable spot FX.",
  ];
  const report: AIReport = {
    generatedAt: payload.generatedAt,
    dataAsOf: payload.dataAsOf,
    title: regime ? `Rules Brief: ${regime}` : "Coverage Brief: regime withheld",
    regime,
    executiveSummary: summary,
    signals,
    watchlist,
    riskNote: "Rules-generated, not AI-generated. Scores and thresholds are provisional and not backtested. The crypto score is an on-chain blockspace proxy, not BTC price, buying pressure, or investor flows. The Broad Dollar Index is not ICE DXY. Public observations may be delayed or revised. Educational research tool, not financial advice.",
    source: "rules-based",
  };

  return Response.json(report);
}
