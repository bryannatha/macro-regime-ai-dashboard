export const SOURCE_STATES = [
  "AVAILABLE",
  "STALE",
  "MISSING",
  "FAILED",
  "REDISTRIBUTION_BLOCKED",
] as const;

export const TREASURY_POLICY_BLOCKER = "POLICY_RATES_WITHHELD — TREASURY_REUSE_UNRESOLVED";

export type SourceState = (typeof SOURCE_STATES)[number];
export type SourceReuseStatus = "CLEARED" | "CONDITIONAL" | "UNRESOLVED" | "BLOCKED";
export type SourceParserStatus = "UNVERIFIED" | "PARTIAL" | "VERIFIED" | "FAILED";
export type SourceHistoryStatus = "UNVERIFIED" | "PARTIAL" | "VERIFIED" | "FAILED";
export type CoreSourceCadence = "daily" | "weekly" | "monthly" | "quarterly";
export type CoreReadinessStatus = "READY" | "ADEQUATE" | "LIMITED" | "WITHHELD";

export interface SourceFamilyAllocation {
  factor: RegimeFactorKey;
  family: string;
  weight: number;
}

export interface SourceRegistryEntry {
  id: string;
  name: string;
  owner: string;
  endpoint: string;
  identifiers: string[];
  accessMethod: string;
  reuseStatus: SourceReuseStatus;
  reuseEvidenceUrl: string | null;
  reuseReviewUrl: string;
  attribution: string;
  cadence: CoreSourceCadence;
  firstUsablePeriod: string | null;
  units: string[];
  seasonalBases: string[];
  expectedReleaseSchedule: string;
  releaseDateQuality: number | null;
  sourceHealth: SourceState;
  parserStatus: SourceParserStatus;
  historyStatus: SourceHistoryStatus;
  verifiedAt: string | null;
  familyAllocations: SourceFamilyAllocation[];
  observedAt?: string | null;
  releasedAt?: string | null;
  retrievedAt?: string | null;
  healthReason?: string | null;
}

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

export type ScoreLabel =
  | "Inflation pressure"
  | "Growth stress"
  | "Legacy Liquidity Monitor"
  | "Bitcoin Blockspace Activity"
  | "Indonesia risk";

export type ScoreOrientation = "risk" | "support" | "demand";

export interface CategoryScore {
  key: ScoreKey;
  label: ScoreLabel;
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
export type MacroDirection =
  | "STRONGLY_IMPROVING"
  | "IMPROVING"
  | "NEUTRAL"
  | "DETERIORATING"
  | "STRONGLY_DETERIORATING"
  | "UNKNOWN";
export type TransitionRiskLevel = "LOW" | "MODERATE" | "ELEVATED" | "UNKNOWN";

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

export interface DirectionScoreRange {
  lower: number;
  upper: number;
}

export interface RegimeFactorInput {
  bounds: ScoreBounds | null;
  coverage: number;
  eligibleFamilies: number;
  configuredFamilies?: number;
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

export interface FactorMomentumInput {
  scoreChange: number | null;
  commonEligibleWeight: number;
  commonEligibleFamilies: number;
}

export interface SourceMomentumInputs {
  growth: FactorMomentumInput | null;
  labor: FactorMomentumInput | null;
  credit: FactorMomentumInput | null;
}

export interface LeadingDirectionAssessment {
  direction: MacroDirection;
  weightedScore: number | null;
  scoreRange: DirectionScoreRange | null;
  dispersion: number | null;
  votes: {
    growth: MacroDirection;
    labor: MacroDirection;
    credit: MacroDirection;
  };
  reason: string | null;
}

export interface InflationDirectionAssessment {
  direction: MacroDirection;
  deltaPi: number | null;
}

export interface TransitionRiskAssessment {
  level: TransitionRiskLevel;
  reasonCodes: string[];
}

export interface PriorTensionComparison {
  comparable: boolean;
  tensions: RegimeTension[];
}

export interface RegimeInputs {
  factors: Record<RegimeFactorKey, RegimeFactorInput>;
  native: RegimeNativeInputs;
  qualitySlots: QualitySlotInput[];
  sourceMomentum?: SourceMomentumInputs | null;
  priorTensionComparison?: PriorTensionComparison | null;
  sourceBlockers?: string[];
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
  differentResolvedRegime: boolean;
  differentNamedRegime: boolean;
}

export interface FactorReadiness {
  coverage: number;
  eligibleFamilies: number;
  configuredFamilies: number;
  classifiable: boolean;
  status: CoreReadinessStatus;
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
  leadingDirection: LeadingDirectionAssessment;
  inflationDirection: InflationDirectionAssessment;
  transitionRisk: TransitionRiskAssessment;
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
  sourceRegistry: SourceRegistryEntry[];
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
  leadingDirection: LeadingDirectionAssessment;
  inflationDirection: InflationDirectionAssessment;
  transitionRisk: TransitionRiskAssessment;
  executiveSummary: string;
  signals: string[];
  watchlist: string[];
  researchImplications: ResearchImplications | null;
  riskNote: string;
  source: "rules-based";
}
