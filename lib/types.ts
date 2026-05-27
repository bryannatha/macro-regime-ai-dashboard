export type MetricKey =
  | "cpi"
  | "coreCpi"
  | "oil"
  | "dxy"
  | "twoYearYield"
  | "tenYearRealYield"
  | "hySpread"
  | "joblessClaims"
  | "btcPrice"
  | "stablecoinMarketCap"
  | "usdidr"
  | "goldPrice";

export type MetricSet = Record<MetricKey, number>;

export interface MarketSnapshot {
  date: string;
  metrics: MetricSet;
}

export type ScoreKey =
  | "inflationPressure"
  | "growthStress"
  | "liquidity"
  | "cryptoDemand"
  | "indonesiaRisk";

export interface CategoryScore {
  key: ScoreKey;
  label: string;
  score: number;
  reading: string;
  summary: string;
}

export type Regime =
  | "Goldilocks"
  | "Liquidity Reflation"
  | "Commodity Inflation"
  | "Stagflation"
  | "Hard Landing"
  | "Fiat Debasement";

export interface RegimeAssessment {
  regime: Regime;
  confidence: number;
  rationale: string[];
}

export interface AssetPlaybook {
  regime: Regime;
  thesis: string;
  favor: string[];
  reduce: string[];
  neutral: string[];
}

export interface AIReport {
  generatedAt: string;
  title: string;
  regime: Regime;
  executiveSummary: string;
  signals: string[];
  watchlist: string[];
  riskNote: string;
  source: "mock";
}
