export type ObservationKey =
  | "cpi"
  | "coreCpi"
  | "oil"
  | "broadDollarIndex"
  | "twoYearYield"
  | "tenYearRealYield"
  | "joblessClaims"
  | "mempoolVsize"
  | "mempoolMedianFeeRate"
  | "usdidr"
  | "btcPrice"
  | "hySpread"
  | "goldPrice"
  | "stablecoinMarketCap";

export type ObservationStatus = "available" | "unavailable" | "excluded";

export interface ObservationPoint {
  date: string;
  value: number;
}

export interface MetricObservation {
  key: ObservationKey;
  label: string;
  value: number | null;
  unit: string;
  source: string;
  sourceUrl: string | null;
  observedAt: string | null;
  fetchedAt: string;
  cadence: "Current" | "Daily" | "Weekly" | "Monthly";
  status: ObservationStatus;
  detail: string;
  history: ObservationPoint[];
}

export type ObservationMap = Record<ObservationKey, MetricObservation>;

export type ScoreKey =
  | "inflationPressure"
  | "growthStress"
  | "liquidity"
  | "cryptoDemand"
  | "indonesiaRisk";

export type ScoreOrientation = "risk" | "support" | "demand";

export interface CategoryScore {
  key: ScoreKey;
  label: string;
  score: number | null;
  coverage: number;
  coveragePercent: number;
  orientation: ScoreOrientation;
  reading: string;
  summary: string;
  explanation: string;
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

export interface DashboardPayload {
  generatedAt: string;
  dataAsOf: string | null;
  observations: ObservationMap;
  scores: CategoryScore[];
  regime: RegimeAssessment | null;
  playbook: AssetPlaybook | null;
}

export interface AIReport {
  generatedAt: string;
  dataAsOf: string | null;
  title: string;
  regime: Regime | null;
  executiveSummary: string;
  signals: string[];
  watchlist: string[];
  riskNote: string;
  source: "rules-based";
}
