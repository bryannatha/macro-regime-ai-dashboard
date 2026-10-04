import type {
  CoreSourceCadence,
  SourceRegistryEntry,
  SourceState,
} from "@/lib/types";
import type {
  FreshnessWindow,
  QualitySlotMetadata,
  ResolveSourceObservationOptions,
  ResolvedQualitySlot,
  ResolvedSourceObservation,
  CoreSourceObservation,
} from "./types";

export { SOURCE_STATES } from "@/lib/types";

const BLS_TERMS = "https://www.bls.gov/developers/termsOfService.htm";
const BEA_REUSE = "https://www.bea.gov/help/faq/147";
const FEDERAL_RESERVE_TERMS = "https://www.federalreserve.gov/disclaimer.htm";
const DOL_REUSE = "https://www.dol.gov/general/aboutdol/copyright";
const TREASURY_FEED = "https://home.treasury.gov/treasury-daily-interest-rate-xml-feed";

export const SOURCE_REGISTRY: readonly SourceRegistryEntry[] = [
  {
    id: "bls-cpi",
    name: "Consumer Price Index",
    owner: "U.S. Bureau of Labor Statistics",
    endpoint: "https://api.bls.gov/publicAPI/v1/timeseries/data/",
    identifiers: ["CUUR0000SA0", "CUUR0000SA0L1E", "CUSR0000SA0", "CUSR0000SA0L1E"],
    accessMethod: "BLS Public Data API",
    reuseStatus: "CLEARED",
    reuseEvidenceUrl: BLS_TERMS,
    reuseReviewUrl: BLS_TERMS,
    attribution: "Cite U.S. Bureau of Labor Statistics, the retrieval date, and the BLS post-retrieval caveat; do not use the BLS logo.",
    cadence: "monthly",
    firstUsablePeriod: "2015-01 (adapter history window)",
    units: ["index (1982-84=100)"],
    seasonalBases: ["NSA", "SA"],
    expectedReleaseSchedule: "Monthly CPI release calendar; preserve the actual publication date separately from the index month.",
    releaseDateQuality: 0.8,
    sourceHealth: "MISSING",
    parserStatus: "PARTIAL",
    historyStatus: "PARTIAL",
    verifiedAt: "2026-10-04",
    familyAllocations: [{ factor: "inflation", family: "cpi", weight: 0.5 }],
  },
  {
    id: "bea-gdp",
    name: "National Income and Product Accounts: GDP",
    owner: "U.S. Bureau of Economic Analysis",
    endpoint: "https://apps.bea.gov/national/Release/XLS/Survey/Section1All_xls.xlsx",
    identifiers: ["T10101-Q / A191RL", "T10106-Q / A191RX"],
    accessMethod: "Official Section 1 XLSX release workbook",
    reuseStatus: "CLEARED",
    reuseEvidenceUrl: BEA_REUSE,
    reuseReviewUrl: BEA_REUSE,
    attribution: "Source: U.S. Bureau of Economic Analysis; identify the workbook as revised history, not original release vintages.",
    cadence: "quarterly",
    firstUsablePeriod: "A191RL: 1947Q2; A191RX: 1947Q1",
    units: ["percent SAAR", "millions of chained (2017) dollars (SAAR)"],
    seasonalBases: ["SAAR"],
    expectedReleaseSchedule: "Quarterly advance, second, and third estimates; the current workbook contains revisions.",
    releaseDateQuality: 0.25,
    sourceHealth: "MISSING",
    parserStatus: "VERIFIED",
    historyStatus: "VERIFIED",
    verifiedAt: "2026-10-04",
    familyAllocations: [{ factor: "growth", family: "gdp", weight: 0.25 }],
  },
  {
    id: "bea-pce-income",
    name: "National Income and Product Accounts: PCE and disposable income",
    owner: "U.S. Bureau of Economic Analysis",
    endpoint: "https://apps.bea.gov/national/Release/XLS/Survey/Section2All_xls.xlsx",
    identifiers: ["T20804-M / DPCERG", "T20806-M / DPCERX", "T20600-M / A067RX"],
    accessMethod: "Official Section 2 XLSX release workbook",
    reuseStatus: "CLEARED",
    reuseEvidenceUrl: BEA_REUSE,
    reuseReviewUrl: BEA_REUSE,
    attribution: "Source: U.S. Bureau of Economic Analysis; identify the workbook as revised history, not original release vintages.",
    cadence: "monthly",
    firstUsablePeriod: "DPCERG: 1959M01; DPCERX: 2007M01; A067RX: 1959M01",
    units: ["index (2017=100)", "millions of chained (2017) dollars (SAAR)"],
    seasonalBases: ["SA", "SAAR"],
    expectedReleaseSchedule: "Monthly PCE/income releases; do not infer historical cell release dates from workbook metadata.",
    releaseDateQuality: 0.25,
    sourceHealth: "MISSING",
    parserStatus: "VERIFIED",
    historyStatus: "VERIFIED",
    verifiedAt: "2026-10-04",
    familyAllocations: [
      { factor: "inflation", family: "pce", weight: 0.5 },
      { factor: "growth", family: "realPce", weight: 0.25 },
      { factor: "growth", family: "realDisposableIncome", weight: 0.125 },
    ],
  },
  {
    id: "bls-labor",
    name: "Employment Situation: payroll and unemployment",
    owner: "U.S. Bureau of Labor Statistics",
    endpoint: "https://api.bls.gov/publicAPI/v1/timeseries/data/",
    identifiers: ["CES0000000001", "LNS14000000"],
    accessMethod: "BLS Public Data API",
    reuseStatus: "CLEARED",
    reuseEvidenceUrl: BLS_TERMS,
    reuseReviewUrl: BLS_TERMS,
    attribution: "Cite U.S. Bureau of Labor Statistics, the retrieval date, and the BLS post-retrieval caveat; do not use the BLS logo.",
    cadence: "monthly",
    firstUsablePeriod: "2015-01 (adapter history window)",
    units: ["thousand persons", "percent"],
    seasonalBases: ["SA"],
    expectedReleaseSchedule: "Monthly Employment Situation release; publication date is distinct from reference month.",
    releaseDateQuality: 0.8,
    sourceHealth: "MISSING",
    parserStatus: "VERIFIED",
    historyStatus: "VERIFIED",
    verifiedAt: "2026-10-04",
    familyAllocations: [
      { factor: "labor", family: "payroll", weight: 0.4 },
      { factor: "labor", family: "householdLabor", weight: 0.35 },
    ],
  },
  {
    id: "dol-initial-claims",
    name: "Weekly initial unemployment-insurance claims",
    owner: "U.S. Department of Labor, Employment and Training Administration",
    endpoint: "https://oui.doleta.gov/unemploy/wkclaims/report.asp",
    identifiers: ["U.S. initial claims, seasonally adjusted (InitialClaims.SA)"],
    accessMethod: "Official ETA weekly-claims XML report",
    reuseStatus: "CLEARED",
    reuseEvidenceUrl: DOL_REUSE,
    reuseReviewUrl: DOL_REUSE,
    attribution: "Credit U.S. Department of Labor; do not imply DOL affiliation or endorsement.",
    cadence: "weekly",
    firstUsablePeriod: "2015-01-03 (adapter history window)",
    units: ["thousand claims"],
    seasonalBases: ["SA"],
    expectedReleaseSchedule: "Weekly claims release; week-ending observation and publication dates must remain distinct.",
    releaseDateQuality: 0.25,
    sourceHealth: "MISSING",
    parserStatus: "VERIFIED",
    historyStatus: "PARTIAL",
    verifiedAt: "2026-10-04",
    familyAllocations: [{ factor: "labor", family: "claims", weight: 0.25 }],
  },
  {
    id: "federal-reserve-g17-ip",
    name: "Industrial Production: total index",
    owner: "Board of Governors of the Federal Reserve System",
    endpoint: "https://www.federalreserve.gov/releases/g17/Current/ipdisk/ip_sa.txt",
    identifiers: ["B50001"],
    accessMethod: "Official G.17 download",
    reuseStatus: "CLEARED",
    reuseEvidenceUrl: FEDERAL_RESERVE_TERMS,
    reuseReviewUrl: FEDERAL_RESERVE_TERMS,
    attribution: "Cite the Board of Governors of the Federal Reserve System; do not use Board insignia or third-party content.",
    cadence: "monthly",
    firstUsablePeriod: null,
    units: ["index (G.17 total, release-defined base)"],
    seasonalBases: ["SA"],
    expectedReleaseSchedule: "Monthly G.17 release; observations are reference months and release dates remain null unless explicitly supplied.",
    releaseDateQuality: 0.25,
    sourceHealth: "MISSING",
    parserStatus: "VERIFIED",
    historyStatus: "VERIFIED",
    verifiedAt: "2026-10-04",
    familyAllocations: [{ factor: "growth", family: "production", weight: 0.25 }],
  },
  {
    id: "federal-reserve-policy-actions",
    name: "Federal Reserve target actions",
    owner: "Board of Governors of the Federal Reserve System",
    endpoint: "https://www.federalreserve.gov/monetarypolicy/openmarket.htm",
    identifiers: ["FOMC target range/action history"],
    accessMethod: "Official Board policy-action archive",
    reuseStatus: "CLEARED",
    reuseEvidenceUrl: FEDERAL_RESERVE_TERMS,
    reuseReviewUrl: FEDERAL_RESERVE_TERMS,
    attribution: "Cite the Board of Governors of the Federal Reserve System; do not use Board insignia or third-party content.",
    cadence: "quarterly",
    firstUsablePeriod: "2003 (history inspected; action dates require parsing)",
    units: ["percent"],
    seasonalBases: ["Not seasonally adjusted"],
    expectedReleaseSchedule: "Irregular FOMC actions; action/effective dates are observed dates, and the announcement publication date is not supplied by this table.",
    releaseDateQuality: 0,
    sourceHealth: "MISSING",
    parserStatus: "VERIFIED",
    historyStatus: "VERIFIED",
    verifiedAt: "2026-10-04",
    familyAllocations: [{ factor: "policyRates", family: "realPolicyStance", weight: 0.5 }],
  },
  {
    id: "treasury-real-yield",
    name: "Daily Treasury 10-year real par yield",
    owner: "U.S. Department of the Treasury",
    endpoint: `${TREASURY_FEED} (XML endpoint: /resource-center/data-chart-center/interest-rates/pages/xml)`,
    identifiers: ["daily_treasury_real_yield_curve", "TC_10YEAR"],
    accessMethod: "Official Treasury daily-interest-rate XML feed",
    reuseStatus: "UNRESOLVED",
    reuseEvidenceUrl: null,
    reuseReviewUrl: TREASURY_FEED,
    attribution: "The feed-specific documentation does not state reuse/display terms; attribution alone does not clear redistribution.",
    cadence: "daily",
    firstUsablePeriod: "2003",
    units: ["percent"],
    seasonalBases: ["Not seasonally adjusted"],
    expectedReleaseSchedule: "Business-day rate based on indicative bid-side quotes around 3:30 PM ET; feed documentation does not establish an exact publication timestamp.",
    releaseDateQuality: 0,
    sourceHealth: "REDISTRIBUTION_BLOCKED",
    parserStatus: "PARTIAL",
    historyStatus: "PARTIAL",
    verifiedAt: "2026-10-04",
    familyAllocations: [{ factor: "policyRates", family: "realFinancing", weight: 0.5 }],
  },
];

export function getSourceRegistry(): SourceRegistryEntry[] {
  return SOURCE_REGISTRY.map((source) => ({
    ...source,
    identifiers: [...source.identifiers],
    units: [...source.units],
    seasonalBases: [...source.seasonalBases],
    familyAllocations: source.familyAllocations.map((allocation) => ({ ...allocation })),
  }));
}

function validDate(value: string | null): boolean {
  return value === null || (typeof value === "string" && Number.isFinite(Date.parse(value)));
}

function validObservation(source: SourceRegistryEntry, observation: CoreSourceObservation): boolean {
  const maximumReleaseQuality = observation.releasedAt !== null
    ? 1
    : observation.firstSeenAt !== null
      ? 0.25
      : 0;
  return observation.sourceId === source.id &&
    source.identifiers.includes(observation.identifier) &&
    Number.isFinite(observation.value) &&
    source.units.includes(observation.unit) &&
    source.seasonalBases.includes(observation.seasonalBasis) &&
    validDate(observation.observedAt) && observation.observedAt !== null &&
    validDate(observation.releasedAt) &&
    validDate(observation.retrievedAt) && observation.retrievedAt !== null &&
    validDate(observation.firstSeenAt) &&
    Number.isFinite(observation.releaseDateQuality) &&
    observation.releaseDateQuality >= 0 && observation.releaseDateQuality <= maximumReleaseQuality;
}

function freshnessAt(
  observation: CoreSourceObservation,
  now: Date,
  window: FreshnessWindow,
): number {
  const observedAt = Date.parse(observation.observedAt);
  const nowMs = now.getTime();
  const ageDays = (nowMs - observedAt) / 86_400_000;
  if (!Number.isFinite(ageDays) || ageDays < 0 ||
      !Number.isFinite(window.fallbackAgeCeilingDays) || window.fallbackAgeCeilingDays < 0 ||
      ageDays > window.fallbackAgeCeilingDays) return 0;

  if ((window.expectedPublicationAt === null) !== (window.overdueGraceEndsAt === null)) return 0;

  if (window.expectedPublicationAt !== null && window.overdueGraceEndsAt !== null) {
    const dueAt = Date.parse(window.expectedPublicationAt);
    const graceEndsAt = Date.parse(window.overdueGraceEndsAt);
    if (!Number.isFinite(dueAt) || !Number.isFinite(graceEndsAt) || graceEndsAt <= dueAt) return 0;
    if (nowMs <= dueAt) return 1;
    if (nowMs >= graceEndsAt) return 0;
    return (graceEndsAt - nowMs) / (graceEndsAt - dueAt);
  }

  return 1;
}

function result(
  source: SourceRegistryEntry,
  options: ResolveSourceObservationOptions,
  state: SourceState,
  observation: CoreSourceObservation | null,
  fetchHealth: number,
  freshness: number,
  reason: string | null,
): ResolvedSourceObservation {
  const lastFetchAttemptAt = options.fetchAttempt.attemptedAt;
  const lastFetchError = options.fetchAttempt.status === "FAILED" ? options.fetchAttempt.error : null;
  const lastSuccessfulFetchAt = options.fetchAttempt.status === "SUCCEEDED"
    ? options.fetchAttempt.observation.retrievedAt
    : observation?.retrievedAt ?? null;

  return {
    state,
    eligible: state === "AVAILABLE",
    observation,
    fetchHealth,
    freshness,
    lastFetchAttemptAt,
    lastFetchError,
    health: { sourceId: source.id, state, lastFetchAttemptAt, lastSuccessfulFetchAt, lastFetchError },
    reason,
  };
}

export function resolveSourceObservation(
  source: SourceRegistryEntry,
  options: ResolveSourceObservationOptions,
): ResolvedSourceObservation {
  if (source.sourceHealth === "REDISTRIBUTION_BLOCKED" || source.reuseStatus !== "CLEARED") {
    return result(source, options, "REDISTRIBUTION_BLOCKED", null, 0, 0, "SOURCE_REUSE_NOT_CLEARED");
  }

  if (source.parserStatus !== "VERIFIED") {
    return result(source, options, "MISSING", null, 0, 0, "SOURCE_PARSER_NOT_VERIFIED");
  }

  if (options.fetchAttempt.status !== "SUCCEEDED" && options.cache !== null) {
    const cacheValidationAt = Date.parse(options.cache.validatedAt);
    if (typeof options.cache.validationVersion !== "string" || !options.cache.validationVersion.trim() ||
        !Number.isFinite(cacheValidationAt) || cacheValidationAt > options.now.getTime()) {
      return result(source, options, "FAILED", null, 0, 0, "CACHE_VALIDATION_METADATA_INVALID");
    }
  }

  const candidate = options.fetchAttempt.status === "SUCCEEDED"
    ? options.fetchAttempt.observation
    : options.cache?.observation ?? null;
  if (candidate === null) {
    const state = options.fetchAttempt.status === "FAILED" || options.fetchAttempt.status === "SUCCEEDED"
      ? "FAILED"
      : "MISSING";
    return result(source, options, state, null, 0, 0, state === "FAILED" ? "NO_USABLE_OBSERVATION" : "NO_OBSERVATION");
  }

  if (!validObservation(source, candidate)) {
    return result(source, options, "FAILED", null, 0, 0, "OBSERVATION_VALIDATION_FAILED");
  }

  const freshness = freshnessAt(candidate, options.now, options.freshnessWindow);
  if (freshness <= 0) {
    return result(source, options, "STALE", candidate, 0, 0, "OBSERVATION_STALE");
  }

  return result(
    source,
    options,
    "AVAILABLE",
    candidate,
    options.fetchAttempt.status === "FAILED" ? 0.8 : 1,
    freshness,
    options.fetchAttempt.status === "FAILED" ? "FRESH_CACHE_AFTER_FAILED_FETCH" : null,
  );
}

export function toQualitySlot(
  resolved: ResolvedSourceObservation,
  metadata: QualitySlotMetadata,
): ResolvedQualitySlot {
  return {
    weight: metadata.weight,
    eligible: resolved.eligible,
    freshness: resolved.freshness,
    history: metadata.history,
    release: metadata.release ?? resolved.observation?.releaseDateQuality ?? 0,
    fetchHealth: resolved.fetchHealth,
  };
}

export function freshnessAgeCeilingDays(cadence: CoreSourceCadence): number {
  const ageCeilings: Record<CoreSourceCadence, number> = {
    daily: 7,
    weekly: 21,
    monthly: 70,
    quarterly: 160,
  };
  return ageCeilings[cadence];
}
