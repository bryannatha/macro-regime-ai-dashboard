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

export const REGIMES = [
  "GOLDILOCKS",
  "INFLATIONARY_EXPANSION",
  "STAGFLATIONARY",
  "CONTRACTION_RECESSIONARY",
  "DISINFLATIONARY_SLOWDOWN",
  "MIXED",
] as const;

export type Regime = (typeof REGIMES)[number];
export type AssessmentStatus = "NORMAL" | "PROVISIONAL" | "INSUFFICIENT_DATA";
export type SensitivityClass = "ROBUST" | "MODERATELY_SENSITIVE" | "FRAGILE";
export type GateResult = "TRUE" | "FALSE" | "UNKNOWN";
export type ActivitySeverity = "STANDARD" | "CONTRACTION_LEVEL";

export type RegimeFactorKey =
  | "inflation"
  | "growth"
  | "labor"
  | "policyRates"
  | "creditConditions"
  | "liquidityProxy";

export type RegimeAnchors = Exclude<RegimeFactorKey, "creditConditions" | "liquidityProxy">;

export interface ScoreBounds {
  lower: number;
  upper: number;
}

export interface RegimeFactorInput {
  bounds: ScoreBounds | null;
  coverage: number;
  eligibleFamilies: number;
  historyYears: number | null;
  releaseQuality: number | null;
}

export interface QualitySlotInput {
  weight: number;
  eligible: boolean;
  freshness: number;
  history: number;
  release: number;
  fetchHealth: number;
}

export interface RegimeNativeInputs {
  deltaPi: number | null;
  realPolicyRate: number | null;
  deltaR: number | null;
  deltaTarget: number | null;
  deltaP: number | null;
  worseningMomenta: number | null;
  coreYoYChange?: number | null;
  creditStressChange?: number | null;
  liquidityStressChange?: number | null;
  creditStandards?: number | null;
  creditVolume?: number | null;
}

export interface RegimeInputs {
  factors: Record<RegimeFactorKey, RegimeFactorInput>;
  native: RegimeNativeInputs;
  qualitySlots: QualitySlotInput[];
}

export interface RuleDiagnostic {
  result: GateResult;
  support: number;
  failedOrUnknownGates: string[];
}

export interface RegimeTension {
  code: string;
  severity: number;
  scope: "core" | "overlay";
  clarityRole: "DEFINING_EVIDENCE" | "RESIDUAL_TENSION";
}

export interface RegimeSensitivity {
  classification: SensitivityClass;
  same: number;
  total: number;
  singleAgreement: number;
  coherentAgreement: number;
  agreement: number;
  nativeGuardChanged: boolean;
}

export interface FactorReadiness {
  coverage: number;
  eligibleFamilies: number;
  classifiable: boolean;
}

export interface RegimeAssessment {
  assessmentStatus: AssessmentStatus;
  regime: Regime | null;
  dataQuality: number | null;
  regimeClarity: number | null;
  candidates: Regime[];
  reasonCodes: string[];
  activitySeverity: ActivitySeverity | null;
  sensitivity: RegimeSensitivity | null;
  factorReadiness: Record<RegimeFactorKey, FactorReadiness>;
  ruleDiagnostics: Record<Regime, RuleDiagnostic>;
  tensions: RegimeTension[];
}

export interface ResearchImplications {
  regime: Regime;
  thesis: string;
  researchThemes: string[];
  counterSignals: string[];
  overlayContext: string[];
  uncertainties: string[];
  guardrails: string[];
}

export interface DashboardPayload {
  generatedAt: string;
  dataAsOf: string | null;
  observations: ObservationMap;
  scores: CategoryScore[];
  regime: RegimeAssessment;
  researchImplications: ResearchImplications | null;
}

export interface AIReport {
  generatedAt: string;
  dataAsOf: string | null;
  title: string;
  regime: Regime | null;
  assessmentStatus: AssessmentStatus;
  dataQuality: number | null;
  regimeClarity: number | null;
  executiveSummary: string;
  signals: string[];
  watchlist: string[];
  researchImplications: ResearchImplications | null;
  riskNote: string;
  source: "rules-based";
}
