import type {
  CategoryScore,
  MetricObservation,
  ObservationKey,
  ObservationMap,
  ScoreKey,
  ScoreOrientation,
} from "@/lib/types";

type ScoringComponent = {
  input: ObservationKey;
  weight: number;
  low: number;
  high: number;
  direction: "higher" | "lower";
};

type ScoringDefinition = {
  label: string;
  orientation: ScoreOrientation;
  description: string;
  components: ScoringComponent[];
};

const MINIMUM_COVERAGE = 0.6;

export const SCORING_MODEL = {
  inflationPressure: {
    label: "Inflation pressure",
    orientation: "risk",
    description: "Higher readings indicate stronger consumer and energy price pressure.",
    components: [
      { input: "cpi", weight: 0.4, low: 1.5, high: 5, direction: "higher" },
      { input: "coreCpi", weight: 0.35, low: 1.5, high: 4.5, direction: "higher" },
      { input: "oil", weight: 0.25, low: 55, high: 115, direction: "higher" },
    ],
  },
  growthStress: {
    label: "Growth stress",
    orientation: "risk",
    description: "Higher readings indicate more labor-market stress and tighter short-term rates.",
    components: [
      { input: "joblessClaims", weight: 0.65, low: 195, high: 360, direction: "higher" },
      { input: "twoYearYield", weight: 0.35, low: 2.5, high: 5.5, direction: "higher" },
    ],
  },
  liquidity: {
    label: "Liquidity",
    orientation: "support",
    description: "Higher readings indicate a softer broad dollar and lower long-term real yields.",
    components: [
      { input: "broadDollarIndex", weight: 0.5, low: 110, high: 130, direction: "lower" },
      { input: "tenYearRealYield", weight: 0.5, low: 0.5, high: 2.5, direction: "lower" },
    ],
  },
  cryptoDemand: {
    label: "Crypto demand",
    orientation: "demand",
    description: "On-chain blockspace demand proxy; it is not BTC price, buying pressure, or investor flows.",
    components: [
      { input: "mempoolVsize", weight: 0.5, low: 0, high: 5_000_000, direction: "higher" },
      { input: "mempoolMedianFeeRate", weight: 0.5, low: 0, high: 50, direction: "higher" },
    ],
  },
  indonesiaRisk: {
    label: "Indonesia risk",
    orientation: "risk",
    description: "Higher readings indicate more external FX and energy-cost pressure; not a crisis probability.",
    components: [
      { input: "usdidr", weight: 0.5, low: 14_500, high: 17_500, direction: "higher" },
      { input: "broadDollarIndex", weight: 0.25, low: 110, high: 130, direction: "higher" },
      { input: "oil", weight: 0.25, low: 55, high: 115, direction: "higher" },
    ],
  },
} satisfies Record<ScoreKey, ScoringDefinition>;

function clamp(value: number): number {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function normalize(value: number, component: ScoringComponent): number {
  const position = (value - component.low) / (component.high - component.low);
  const score = component.direction === "higher" ? position : 1 - position;
  return clamp(score * 100);
}

function availableValue(observation: MetricObservation): number | null {
  return observation.status === "available" &&
    observation.value !== null &&
    Number.isFinite(observation.value)
    ? observation.value
    : null;
}

function readingFor(orientation: ScoreOrientation, score: number | null): string {
  if (score === null) return "Unavailable";

  if (orientation === "risk") {
    return score >= 65 ? "Elevated" : score >= 40 ? "Watch" : "Contained";
  }

  if (orientation === "support") {
    return score >= 65 ? "Strong" : score >= 40 ? "Constructive" : "Soft";
  }

  return score >= 65 ? "High demand" : score >= 40 ? "Building" : "Muted";
}

export function calculateScores(observations: ObservationMap): CategoryScore[] {
  return (Object.keys(SCORING_MODEL) as ScoreKey[]).map((key) => {
    const definition = SCORING_MODEL[key];
    const availableComponents = definition.components.flatMap((component) => {
      const value = availableValue(observations[component.input]);
      return value === null ? [] : [{ component, value }];
    });
    const coverage = availableComponents.reduce((total, { component }) => total + component.weight, 0);
    const score = coverage < MINIMUM_COVERAGE
      ? null
      : clamp(
          availableComponents.reduce(
            (total, { component, value }) => total + normalize(value, component) * component.weight,
            0,
          ) / coverage,
        );
    const coveragePercent = Math.round(coverage * 10_000) / 100;
    const includedLabels = availableComponents.map(({ component }) => observations[component.input].label);
    const explanation = score === null
      ? `Unavailable: ${coveragePercent}% of configured input weight is observed; at least 60% is required. Missing and excluded inputs are not treated as zero.`
      : `Based on ${coveragePercent}% of configured input weight (${includedLabels.join(", ")}). Missing and excluded inputs are omitted, and available weights are renormalized.`;

    return {
      key,
      label: definition.label,
      score,
      coverage,
      coveragePercent,
      orientation: definition.orientation,
      reading: readingFor(definition.orientation, score),
      summary: definition.description,
      explanation,
    };
  });
}
