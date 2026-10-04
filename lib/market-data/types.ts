import type {
  QualitySlotInput,
  RegimeFactorKey,
  RegimeNativeInputs,
  ScoreBounds,
  SourceHistoryStatus,
  SourceParserStatus,
  SourceState,
} from "@/lib/types";

export type { SourceRegistryEntry, SourceState } from "@/lib/types";

export interface AdapterOptions {
  fetchImpl?: typeof fetch;
  now?: Date;
}

export interface EiaAdapterOptions extends AdapterOptions {
  apiKey?: string;
}

export function fetchedAtFrom(now = new Date()): string {
  return now.toISOString();
}

export function cachedFetchOptions(revalidate: number, init: RequestInit = {}): RequestInit {
  return {
    ...init,
    next: { revalidate },
  } as RequestInit;
}

export interface CoreSourceObservation {
  sourceId: string;
  identifier: string;
  value: number;
  unit: string;
  seasonalBasis: string;
  observedAt: string;
  releasedAt: string | null;
  retrievedAt: string;
  firstSeenAt: string | null;
  releaseDateQuality: number;
  version: string | null;
  vintage: string | null;
}

export interface CoreObservationSeriesResult {
  sourceId: string;
  identifier: string;
  state: SourceState;
  observations: CoreSourceObservation[];
  parserStatus: SourceParserStatus;
  historyStatus: SourceHistoryStatus;
  retrievedAt: string | null;
  reason: string | null;
}

export interface SeriesExpectation {
  sourceId: string;
  identifier: string;
  unit: string;
  seasonalBasis: string;
  cadence: "daily" | "monthly" | "quarterly" | "weekly";
}

export interface CoreTransformResult {
  value: number | null;
  score: number | null;
  unit: string;
  observedAt: string | null;
  sourceIds: string[];
  identifiers: string[];
  dependencyIds: string[];
  observations: CoreSourceObservation[];
  historyPoints: number;
  historyYears: number | null;
  releaseQuality: number | null;
  reason: string | null;
}

export type CoreReadinessStatus = "READY" | "ADEQUATE" | "LIMITED" | "WITHHELD";

export interface CoreSlotQuality {
  eligible: boolean;
  freshness: number;
  history: number;
  release: number;
  fetchHealth: number;
}

export interface CoreFactorSlot {
  key: string;
  weight: number;
  value: number | null;
  score: number | null;
  unit: string;
  eligible: boolean;
  observedAt: string | null;
  sourceIds: string[];
  identifiers: string[];
  dependencyIds: string[];
  historyPoints: number;
  historyYears: number | null;
  releaseQuality: number | null;
  quality: CoreSlotQuality;
  reason: string | null;
}

export interface CoreMeasurementFamily {
  key: string;
  factor: RegimeFactorKey;
  weight: number;
  score: number | null;
  coverage: number;
  bounds: ScoreBounds;
  eligible: boolean;
  status: CoreReadinessStatus;
  slots: CoreFactorSlot[];
  sourceIds: string[];
  identifiers: string[];
  dependencyIds: string[];
  reason: string | null;
}

export interface CoreFactorAssessment {
  key: RegimeFactorKey;
  score: number | null;
  coverage: number;
  bounds: ScoreBounds;
  eligibleFamilies: number;
  configuredFamilies: number;
  historyYears: number | null;
  releaseQuality: number;
  status: CoreReadinessStatus;
  families: CoreMeasurementFamily[];
}

export interface CoreFactorsResult {
  factors: Record<RegimeFactorKey, CoreFactorAssessment>;
  native: RegimeNativeInputs;
  momentum: Record<string, CoreTransformResult>;
}

export interface ValidatedObservationCacheEntry {
  observation: CoreSourceObservation;
  validatedAt: string;
  validationVersion: string;
}

export type SourceFetchAttempt =
  | { status: "SUCCEEDED"; attemptedAt: string; observation: CoreSourceObservation }
  | { status: "FAILED"; attemptedAt: string; error: string }
  | { status: "NOT_ATTEMPTED"; attemptedAt: null };

export interface FreshnessWindow {
  expectedPublicationAt: string | null;
  overdueGraceEndsAt: string | null;
  fallbackAgeCeilingDays: number;
}

export interface SourceHealthMetadata {
  sourceId: string;
  state: SourceState;
  lastFetchAttemptAt: string | null;
  lastSuccessfulFetchAt: string | null;
  lastFetchError: string | null;
}

export interface ResolvedSourceObservation {
  state: SourceState;
  eligible: boolean;
  observation: CoreSourceObservation | null;
  fetchHealth: number;
  freshness: number;
  lastFetchAttemptAt: string | null;
  lastFetchError: string | null;
  health: SourceHealthMetadata;
  reason: string | null;
}

export interface ResolveSourceObservationOptions {
  now: Date;
  fetchAttempt: SourceFetchAttempt;
  cache: ValidatedObservationCacheEntry | null;
  freshnessWindow: FreshnessWindow;
}

export interface QualitySlotMetadata {
  weight: number;
  history: number;
  release?: number;
}

export type ResolvedQualitySlot = QualitySlotInput;
