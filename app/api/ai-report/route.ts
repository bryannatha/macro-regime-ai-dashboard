import { getDashboardPayload } from "@/lib/market-data";
import { REGIME_LABELS } from "@/lib/regime";
import type { AIReport, CategoryScore, RegimeAssessment, RegimeFactorKey } from "@/lib/types";

export const dynamic = "force-dynamic";

const factorLabels: Record<RegimeFactorKey, string> = {
  inflation: "Inflation",
  growth: "Growth",
  labor: "Labor",
  policyRates: "Policy / Rates",
  creditConditions: "Credit Conditions",
  liquidityProxy: "System Liquidity Proxy",
};

function coverageLine(assessment: RegimeAssessment): string {
  return (Object.keys(factorLabels) as RegimeFactorKey[]).map((key) => {
    const factor = assessment.factorReadiness[key];
    return `${factorLabels[key]}: ${Math.round(factor.coverage * 100)}% coverage, ${factor.eligibleFamilies} eligible families`;
  }).join("; ");
}

function summaryFor(
  assessment: RegimeAssessment,
  signals: CategoryScore[],
  coverage: string,
  researchThemes: string[],
): string {
  if (assessment.regime) {
    return [
      assessment.regime === "INFLATIONARY_EXPANSION"
        ? "Elevated or accelerating inflation is present alongside resilient real activity and/or labor."
        : "A deterministic U.S. macro classification is resolved.",
      ...researchThemes,
      `Assessment status: ${assessment.assessmentStatus}. Data Quality: ${assessment.dataQuality ?? "not calculated"}/100; Regime Clarity: ${assessment.regimeClarity ?? "not calculated"}/100.`,
      `Core factor evidence: ${coverage}.`,
    ].join(" ");
  }
  const unavailable = assessment.reasonCodes.length
    ? assessment.reasonCodes.join(", ")
    : "required core inputs are unavailable";
  const signalBrief = signals.map((signal) => `${signal.label} ${signal.score}/100`).join(", ");
  return `Regime withheld (${assessment.assessmentStatus}) because the six-factor core input contract is not met. ${unavailable}. Core factors: ${coverage}. The five dashboard scores are monitoring indicators and are not substitutes for these regime inputs. Missing inputs are not treated as zero. Available monitoring indicators: ${signalBrief || "none"}.`;
}

export async function GET() {
  const payload = await getDashboardPayload();
  const availableSignals = payload.scores
    .filter((score) => score.score !== null)
    .sort((left, right) => (right.score ?? 0) - (left.score ?? 0))
    .slice(0, 3);
  const signals = availableSignals.map(
    (signal) => `${signal.label}: ${signal.score}/100 (${signal.reading}; ${signal.coveragePercent}% indicator coverage). ${signal.summary}`,
  );
  const coverage = coverageLine(payload.regime);
  const regime = payload.regime.regime;
  const researchImplications = payload.researchImplications;
  const executiveSummary = summaryFor(
    payload.regime,
    availableSignals,
    coverage,
    researchImplications?.researchThemes ?? [],
  );
  const unavailable = Object.values(payload.observations)
    .filter((observation) => observation.status === "unavailable")
    .map((observation) => `${observation.label}: unavailable; check source status and cadence.`);
  const watchlist = [
    ...unavailable.slice(0, 4),
    ...(regime ? researchImplications?.counterSignals ?? [] : ["Core factor source mapping and release-history coverage are required before a regime can be assigned."]),
    "The USD/IDR value is an ECB-derived reference cross, not BI JISDOR or tradable spot FX.",
  ];
  const report: AIReport = {
    generatedAt: payload.generatedAt,
    dataAsOf: payload.dataAsOf,
    title: regime ? `U.S. Macro Regime Brief: ${REGIME_LABELS[regime]}` : "Coverage Brief: U.S. regime withheld",
    regime,
    assessmentStatus: payload.regime.assessmentStatus,
    dataQuality: payload.regime.dataQuality,
    regimeClarity: payload.regime.regimeClarity,
    executiveSummary,
    signals,
    watchlist,
    researchImplications,
    riskNote: "Deterministic rules-generated research, not AI-generated. The factor thresholds are transparent policy choices, not calibrated forecasts. Data Quality and Regime Clarity are separate measures. Public observations may be delayed or revised. Educational research tool, not financial advice.",
    source: "rules-based",
  };

  return Response.json(report);
}
