import type {
  CategoryScore,
  MarketSnapshot,
  RegimeAssessment,
  ScoreKey,
} from "@/lib/types";

function clamp(value: number): number {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function highScore(value: number, low: number, high: number): number {
  return clamp(((value - low) / (high - low)) * 100);
}

function lowScore(value: number, low: number, high: number): number {
  return clamp(((high - value) / (high - low)) * 100);
}

function changePercent(current: number, previous: number): number {
  return ((current - previous) / previous) * 100;
}

function average(parts: Array<[number, number]>): number {
  return clamp(parts.reduce((total, [score, weight]) => total + score * weight, 0));
}

function readingFor(key: ScoreKey, score: number): string {
  const favorable = key === "liquidity" || key === "cryptoDemand";

  if (score >= 65) {
    return favorable ? "Strong" : "Elevated";
  }

  if (score >= 40) {
    return favorable ? "Constructive" : "Watch";
  }

  return favorable ? "Soft" : "Contained";
}

export function calculateScores(
  current: MarketSnapshot,
  previous: MarketSnapshot,
): CategoryScore[] {
  const values = current.metrics;
  const prior = previous.metrics;
  const btcMomentum = changePercent(values.btcPrice, prior.btcPrice);
  const stablecoinMomentum = changePercent(
    values.stablecoinMarketCap,
    prior.stablecoinMarketCap,
  );

  const scoreValues: Record<ScoreKey, number> = {
    inflationPressure: average([
      [highScore(values.cpi, 1.5, 5), 0.4],
      [highScore(values.coreCpi, 1.5, 4.5), 0.35],
      [highScore(values.oil, 55, 115), 0.25],
    ]),
    growthStress: average([
      [highScore(values.hySpread, 250, 700), 0.45],
      [highScore(values.joblessClaims, 195, 360), 0.35],
      [highScore(values.twoYearYield, 2.5, 5.5), 0.2],
    ]),
    liquidity: average([
      [lowScore(values.dxy, 95, 110), 0.25],
      [lowScore(values.tenYearRealYield, 0.5, 2.5), 0.25],
      [highScore(values.stablecoinMarketCap, 160, 260), 0.3],
      [highScore(stablecoinMomentum, -3, 8), 0.2],
    ]),
    cryptoDemand: average([
      [highScore(values.btcPrice, 40000, 140000), 0.45],
      [highScore(values.stablecoinMarketCap, 160, 260), 0.35],
      [highScore(btcMomentum, -15, 20), 0.2],
    ]),
    indonesiaRisk: average([
      [highScore(values.usdidr, 14500, 17500), 0.5],
      [highScore(values.dxy, 95, 112), 0.25],
      [highScore(values.oil, 55, 115), 0.25],
    ]),
  };

  const summaries: Record<ScoreKey, string> = {
    inflationPressure: `Headline CPI ${values.cpi.toFixed(1)}% and Brent $${values.oil.toFixed(1)} keep pricing pressure moderate.`,
    growthStress: `HY spreads at ${values.hySpread} bps and claims at ${values.joblessClaims}k indicate limited credit stress.`,
    liquidity: `Stablecoin supply is up ${stablecoinMomentum.toFixed(1)}% month-on-month while real yields sit at ${values.tenYearRealYield.toFixed(2)}%.`,
    cryptoDemand: `BTC is up ${btcMomentum.toFixed(1)}% month-on-month with stablecoin capacity at $${values.stablecoinMarketCap.toFixed(1)}bn.`,
    indonesiaRisk: `USDIDR at ${values.usdidr.toLocaleString("en-US")} and DXY at ${values.dxy.toFixed(1)} define external FX pressure.`,
  };

  const labels: Record<ScoreKey, string> = {
    inflationPressure: "Inflation Pressure",
    growthStress: "Growth Stress",
    liquidity: "Liquidity",
    cryptoDemand: "Crypto Demand",
    indonesiaRisk: "Indonesia Risk",
  };

  return (Object.keys(scoreValues) as ScoreKey[]).map((key) => ({
    key,
    label: labels[key],
    score: scoreValues[key],
    reading: readingFor(key, scoreValues[key]),
    summary: summaries[key],
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
      "Inflation and growth stress lack an extreme directional signal.",
      "A balanced risk allocation remains supported by the ruleset.",
    ],
  };
}
