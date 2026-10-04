import type { Regime, ResearchImplications } from "@/lib/types";

const implications: Record<Regime, Omit<ResearchImplications, "regime">> = {
  GOLDILOCKS: {
    thesis: "Contained inflation, resilient activity, and compatible policy align with the Goldilocks rule set.",
    researchThemes: [
      "Check whether growth and labor resilience spans multiple registered families.",
      "Compare the real-policy proxy and observed credit conditions with the inflation outlook.",
    ],
    counterSignals: [
      "Credit or liquidity vetoes can invalidate a benign-financing interpretation.",
      "Policy compatibility does not establish a causal growth forecast.",
    ],
    overlayContext: [
      "Indonesia FX sensitivity, energy price pressure, and crypto blockspace remain separate overlays.",
    ],
    uncertainties: [
      "Neutral policy rates and the source weights are uncertain.",
      "Historical observations may be revised.",
    ],
    guardrails: [
      "This label is a descriptive rules classification, not a portfolio position.",
    ],
  },
  INFLATIONARY_EXPANSION: {
    thesis: "Elevated or accelerating inflation is present alongside resilient real activity and/or labor.",
    researchThemes: [
      "Compare headline and core inflation breadth with activity and labor resilience.",
      "Track the real-policy and financing response as new observations arrive.",
    ],
    counterSignals: [
      "The classifier does not identify whether inflation arose from supply or demand.",
      "A later policy response can change the surrounding conditions.",
    ],
    overlayContext: [
      "Energy price changes are contextual and do not add a second core inflation vote.",
    ],
    uncertainties: [
      "No output gap, capacity-utilization, or excess-demand measure is included.",
    ],
    guardrails: [
      "Do not describe this regime as proof of demand overheating.",
      "This label is not a portfolio position or return forecast.",
    ],
  },
  STAGFLATIONARY: {
    thesis: "Hot inflation coincides with moderate weakness across both activity dimensions or severe weakness in one.",
    researchThemes: [
      "Check whether weak activity or labor evidence appears across independent measurement families.",
      "Compare inflation pace with current and prior real-economy readings.",
    ],
    counterSignals: [
      "Clear activity/labor divergence is classified Mixed.",
      "Financial conditions do not determine the regime identity.",
    ],
    overlayContext: [
      "Energy, Indonesia FX, and crypto observations remain outside the U.S. core classification.",
    ],
    uncertainties: [
      "Recent macro releases can be revised and source histories may not be point-in-time.",
    ],
    guardrails: [
      "Contraction-level severity is a factor qualifier, not an official recession date.",
      "This classification is not a trade instruction.",
    ],
  },
  CONTRACTION_RECESSIONARY: {
    thesis: "Severe joint growth and labor stress is present outside the hot-inflation state.",
    researchThemes: [
      "Check the breadth, persistence, and revisions of real activity and labor weakness.",
      "Compare bank-credit supply, volume, and performance as separate signals.",
    ],
    counterSignals: [
      "This ruleset does not date recessions.",
      "One severe dimension alone is not the joint contraction rule.",
    ],
    overlayContext: [
      "Indonesia, energy, and crypto signals do not change the U.S. regime.",
    ],
    uncertainties: [
      "Data vintages and publication lags can change the historical picture.",
    ],
    guardrails: [
      "This classification is not a forecast or trade instruction.",
    ],
  },
  DISINFLATIONARY_SLOWDOWN: {
    thesis: "Inflation is contained and observed activity weakness is non-severe.",
    researchThemes: [
      "Compare falling inflation with independent activity and labor measures.",
      "Check whether the slowdown conditions broaden or remain limited to one family.",
    ],
    counterSignals: [
      "The label does not identify whether disinflation is supply-led or demand-led.",
      "Momentum alone cannot overwrite resilient observed activity.",
    ],
    overlayContext: [
      "Energy price changes remain context and do not determine U.S. inflation identity.",
    ],
    uncertainties: [
      "Coverage bounds and revised releases limit historical comparisons.",
    ],
    guardrails: [
      "The label does not imply a forecast of easing policy or asset returns.",
    ],
  },
  MIXED: {
    thesis: "Resolved U.S. macro evidence is economically divergent or outside the positive regime envelopes.",
    researchThemes: [
      "Inspect the specific MIXED reason and the factor evidence that supports it.",
      "Compare each tension with its own source history rather than averaging dimensions together.",
    ],
    counterSignals: [
      "MIXED can be robust or threshold-fragile; inspect Regime Clarity separately from Data Quality.",
      "Missing-data ambiguity is Provisional or Insufficient, never an economic MIXED regime.",
    ],
    overlayContext: [
      "Indonesia FX, energy, and crypto context remain separate from the U.S. core classifier.",
    ],
    uncertainties: [
      "Taxonomic gaps can yield a stable MIXED label without a positive regime envelope.",
    ],
    guardrails: [
      "MIXED is descriptive and does not imply a neutral portfolio position.",
    ],
  },
};

export function getResearchImplications(regime: Regime): ResearchImplications {
  const detail = implications[regime];
  return {
    regime,
    thesis: detail.thesis,
    researchThemes: [...detail.researchThemes],
    counterSignals: [...detail.counterSignals],
    overlayContext: [...detail.overlayContext],
    uncertainties: [...detail.uncertainties],
    guardrails: [...detail.guardrails],
  };
}
