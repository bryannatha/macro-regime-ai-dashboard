import type {
  CategoryScore,
  MarketSnapshot,
  RegimeAssessment,
  ScoreKey,
  ScoreOrientation,
} from "@/lib/types";
import type { MetricKey } from "@/lib/types";

type ScoringInput = MetricKey | "btcMomentum" | "stablecoinMomentum";
type ScoringComponent = {
  input: ScoringInput;
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

export const SCORING_MODEL = {
  inflationPressure: {
    label: "Inflation pressure",
    orientation: "risk",
    description: "Higher readings indicate stronger price pressure.",
    components: [
      { input: "cpi", weight: 0.4, low: 1.5, high: 5, direction: "higher" },
      { input: "coreCpi", weight: 0.35, low: 1.5, high: 4.5, direction: "higher" },
      { input: "oil", weight: 0.25, low: 55, high: 115, direction: "higher" },
    ],
  },
  growthStress: {
    label: "Growth stress",
    orientation: "risk",
    description: "Higher readings indicate tighter credit and weaker labor conditions.",
    components: [
      { input: "hySpread", weight: 0.45, low: 250, high: 700, direction: "higher" },
      { input: "joblessClaims", weight: 0.35, low: 195, high: 360, direction: "higher" },
      { input: "twoYearYield", weight: 0.2, low: 2.5, high: 5.5, direction: "higher" },
    ],
  },
  liquidity: {
    label: "Liquidity",
    orientation: "support",
    description: "Higher readings indicate easier dollar funding and expanding tokenized cash supply.",
    components: [
      { input: "dxy", weight: 0.25, low: 95, high: 110, direction: "lower" },
      { input: "tenYearRealYield", weight: 0.25, low: 0.5, high: 2.5, direction: "lower" },
      { input: "stablecoinMarketCap", weight: 0.3, low: 160, high: 260, direction: "higher" },
      { input: "stablecoinMomentum", weight: 0.2, low: -3, high: 8, direction: "higher" },
    ],
  },
  cryptoDemand: {
    label: "Crypto demand",
    orientation: "demand",
    description: "Higher readings indicate stronger BTC price and stablecoin expansion.",
    components: [
      { input: "btcPrice", weight: 0.45, low: 40000, high: 140000, direction: "higher" },
      { input: "stablecoinMarketCap", weight: 0.35, low: 160, high: 260, direction: "higher" },
      { input: "btcMomentum", weight: 0.2, low: -15, high: 20, direction: "higher" },
    ],
  },
  indonesiaRisk: {
    label: "Indonesia risk",
    orientation: "risk",
    description: "Higher readings indicate more external FX pressure; this is not a probability of crisis.",
    components: [
      { input: "usdidr", weight: 0.5, low: 14500, high: 17500, direction: "higher" },
      { input: "dxy", weight: 0.25, low: 95, high: 112, direction: "higher" },
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

function changePercent(current: number, previous: number): number {
  return previous === 0 ? 0 : ((current - previous) / previous) * 100;
}

function readingFor(orientation: ScoreOrientation, score: number): string {
  if (orientation === "risk") {
    return score >= 65 ? "Elevated" : score >= 40 ? "Watch" : "Contained";
  }

  if (orientation === "support") {
    return score >= 65 ? "Strong" : score >= 40 ? "Constructive" : "Soft";
  }

  return score >= 65 ? "High demand" : score >= 40 ? "Building" : "Muted";
}

function valuesFor(current: MarketSnapshot, previous: MarketSnapshot): Record<ScoringInput, number> {
  return {
    ...current.metrics,
    btcMomentum: changePercent(current.metrics.btcPrice, previous.metrics.btcPrice),
    stablecoinMomentum: changePercent(
      current.metrics.stablecoinMarketCap,
      previous.metrics.stablecoinMarketCap,
    ),
  };
}

export function calculateScores(
  current: MarketSnapshot,
  previous: MarketSnapshot,
): CategoryScore[] {
  const inputs = valuesFor(current, previous);
  const scores = (Object.keys(SCORING_MODEL) as ScoreKey[]).map((key) => {
    const definition = SCORING_MODEL[key];
    const score = clamp(
      definition.components.reduce(
        (total, component) => total + normalize(inputs[component.input], component) * component.weight,
        0,
      ),
    );

    return {
      key,
      label: definition.label,
      score,
      orientation: definition.orientation,
      reading: readingFor(definition.orientation, score),
      summary: definition.description,
    };
  });

  const stablecoinMomentum = changePercent(
    current.metrics.stablecoinMarketCap,
    previous.metrics.stablecoinMarketCap,
  );
  const btcMomentum = changePercent(current.metrics.btcPrice, previous.metrics.btcPrice);
  const summaries: Partial<Record<ScoreKey, string>> = {
    inflationPressure: `CPI ${current.metrics.cpi.toFixed(1)}% YoY; Brent $${current.metrics.oil.toFixed(1)} per barrel.`,
    growthStress: `High-yield spreads ${current.metrics.hySpread} bps; initial claims ${current.metrics.joblessClaims}k.`,
    liquidity: `Stablecoin supply ${stablecoinMomentum >= 0 ? "+" : ""}${stablecoinMomentum.toFixed(1)}% versus prior sample; real yield ${current.metrics.tenYearRealYield.toFixed(2)}%.`,
    cryptoDemand: `BTC ${btcMomentum >= 0 ? "+" : ""}${btcMomentum.toFixed(1)}% versus prior sample; stablecoin supply $${current.metrics.stablecoinMarketCap.toFixed(1)}bn.`,
    indonesiaRisk: `USD/IDR ${current.metrics.usdidr.toLocaleString("en-US")} with DXY ${current.metrics.dxy.toFixed(1)}.`,
  };

  return scores.map((score) => ({
    ...score,
    summary: summaries[score.key] ?? score.summary,
  }));
}

function scoreOf(scores: CategoryScore[], key: ScoreKey): number {
  return scores.find((score) => score.key === key)?.score ?? 0;
}

export function classifyRegime(
  snapshot: MarketSnapshot,
  scores: CategoryScore[],
): RegimeAssessment {
  const inflation = scoreOf(scores, "inflationPressure");
  const growth = scoreOf(scores, "growthStress");
  const liquidity = scoreOf(scores, "liquidity");
  const crypto = scoreOf(scores, "cryptoDemand");
  const { oil, goldPrice } = snapshot.metrics;

  if (growth >= 68 && liquidity < 42 && inflation < 62) {
    return {
      regime: "Hard Landing",
      confidence: clamp(62 + (growth - liquidity) * 0.35),
      rationale: [
        "Growth stress is acute while liquidity support is weak.",
        "Defensive positioning matters more than inflation hedging.",
      ],
    };
  }

  if (inflation >= 62 && growth >= 55) {
    return {
      regime: "Stagflation",
      confidence: clamp(55 + (inflation + growth) / 5),
      rationale: [
        "Inflation pressure and growth stress are elevated together.",
        "The mix challenges both duration and cyclical risk assets.",
      ],
    };
  }

  if (inflation >= 60 && oil >= 85) {
    return {
      regime: "Commodity Inflation",
      confidence: clamp(54 + inflation * 0.35),
      rationale: [
        "Oil-driven pricing pressure is dominating the macro signal.",
        "Import-sensitive currencies warrant closer monitoring.",
      ],
    };
  }

  if (liquidity >= 64 && crypto >= 63 && goldPrice >= 2850) {
    return {
      regime: "Fiat Debasement",
      confidence: clamp(54 + (liquidity + crypto) / 6),
      rationale: [
        "Liquidity, crypto demand, and gold are strengthening together.",
        "Market behavior favors monetary-scarcity assets.",
      ],
    };
  }

  if (liquidity >= 52 && crypto >= 54) {
    return {
      regime: "Liquidity Reflation",
      confidence: clamp(54 + (liquidity + crypto) / 6),
      rationale: [
        "Liquidity is constructive and digital-asset demand is firm.",
        "Growth stress remains contained enough for selective risk exposure.",
      ],
    };
  }

  return {
    regime: "Goldilocks",
    confidence: clamp(72 - inflation * 0.25 - growth * 0.2 + liquidity * 0.2),
    rationale: [
      "No stronger regime trigger crossed its fixed threshold in this sample.",
      "Goldilocks is the ruleset's residual classification, not a forecast.",
    ],
  };
}
