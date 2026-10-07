import type {
  CoreSourceCadence,
  SourceRegistryEntry,
  SourceParserStatus,
  SourceState,
} from "@/lib/types";
import type {
  FreshnessWindow,
  QualitySlotMetadata,
  ResolveSourceObservationOptions,
  ResolvedQualitySlot,
  ResolvedSourceObservation,
  CoreSourceObservation,
  CoreObservationSeriesResult,
} from "./types";

export { SOURCE_STATES } from "@/lib/types";

const BLS_TERMS = "https://www.bls.gov/developers/termsOfService.htm";
const BEA_REUSE = "https://www.bea.gov/help/faq/147";
const FEDERAL_RESERVE_TERMS = "https://www.federalreserve.gov/disclaimer.htm";
const DOL_REUSE = "https://www.dol.gov/general/aboutdol/copyright";
const TREASURY_FEED = "https://home.treasury.gov/treasury-daily-interest-rate-xml-feed";
const TREASURY_REAL_YIELD_REUSE = "https://catalog.data.gov/dataset/daily-treasury-real-yield-curve-rates";

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
    firstUsablePeriod: "2013-01 (diagnostic warm-up; dashboard adapter defaults to 2015-01)",
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
    identifiers: ["T20804-M / DPCERG", "T20804-M / DPCCRG", "T20806-M / DPCERX", "T20600-M / A067RX"],
    accessMethod: "Official Section 2 XLSX release workbook",
    reuseStatus: "CLEARED",
    reuseEvidenceUrl: BEA_REUSE,
    reuseReviewUrl: BEA_REUSE,
    attribution: "Source: U.S. Bureau of Economic Analysis; identify the workbook as revised history, not original release vintages.",
    cadence: "monthly",
    firstUsablePeriod: "DPCERG: 1959M01; DPCCRG: 1959M01; DPCERX: 2007M01; A067RX: 1959M01",
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
    firstUsablePeriod: "2013-01 (diagnostic warm-up; dashboard adapter defaults to 2015-01)",
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
    endpoint: "https://oui.doleta.gov/unemploy/weeklyRedirect.php",
    identifiers: ["U.S. initial claims, seasonally adjusted (InitialClaims.SA)"],
    accessMethod: "Official ETA national seasonally adjusted weekly claims release (PDF redirect)",
    reuseStatus: "CLEARED",
    reuseEvidenceUrl: DOL_REUSE,
    reuseReviewUrl: DOL_REUSE,
    attribution: "Credit U.S. Department of Labor; do not imply DOL affiliation or endorsement.",
    cadence: "weekly",
    firstUsablePeriod: "Rolling one-year table in current weekly release; longer history unavailable",
    units: ["thousand claims"],
    seasonalBases: ["SA"],
    expectedReleaseSchedule: "Thursday 8:30 a.m. Eastern release; week-ending observation and release dates remain distinct.",
    releaseDateQuality: 1,
    sourceHealth: "AVAILABLE",
    parserStatus: "VERIFIED",
    historyStatus: "PARTIAL",
    verifiedAt: "2026-10-05",
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
    endpoint: "https://home.treasury.gov/resource-center/data-chart-center/interest-rates/pages/xml?data=daily_treasury_real_yield_curve&field_tdr_date_value=YYYY",
    identifiers: ["TC_10YEAR"],
    accessMethod: "Official Treasury daily-interest-rate XML feed",
    reuseStatus: "CLEARED",
    reuseEvidenceUrl: TREASURY_REAL_YIELD_REUSE,
    reuseReviewUrl: TREASURY_FEED,
    attribution: "Source: U.S. Treasury, Daily Treasury Par Real Yield Curve Rates (10-year R-CMT, TC_10YEAR). Treasury derives this series from indicative market quotations obtained by FRBNY. Macro Regime AI Dashboard calculations; not Treasury/FRBNY affiliated or endorsed.",
    cadence: "daily",
    firstUsablePeriod: "2003",
    units: ["percent"],
    seasonalBases: ["Not seasonally adjusted"],
    expectedReleaseSchedule: "Daily business-day series available since 2003 through the documented XML feed; the observation date is not an asserted publication timestamp. Published Treasury values reflect indicative market quotations obtained by FRBNY.",
    releaseDateQuality: 0,
    sourceHealth: "MISSING",
    parserStatus: "VERIFIED",
    historyStatus: "PARTIAL",
    verifiedAt: "2026-10-06",
    familyAllocations: [{ factor: "policyRates", family: "realFinancing", weight: 0.5 }],
  },
  {
    id: "federal-reserve-h41-liquidity",
    name: "Federal Reserve balance sheet and reserve factors: H.4.1",
    owner: "Board of Governors of the Federal Reserve System",
    endpoint: "https://www.federalreserve.gov/releases/h41/current/",
    identifiers: [
      "H.4.1 Table 1 / Reserve Bank credit / weekly average",
      "H.4.1 Table 1 / U.S. Treasury, General Account / weekly average",
      "H.4.1 Table 1 / Reverse repurchase agreements: Others / weekly average",
      "H.4.1 Table 1 / Reserve balances with Federal Reserve Banks / weekly average",
      "H.4.1 Table 5 / Total assets / Wednesday",
    ],
    accessMethod: "Official H.4.1 release HTML tables",
    reuseStatus: "CLEARED",
    reuseEvidenceUrl: FEDERAL_RESERVE_TERMS,
    reuseReviewUrl: FEDERAL_RESERVE_TERMS,
    attribution: "Cite the Board of Governors of the Federal Reserve System; do not use Board insignia or third-party content.",
    cadence: "weekly",
    firstUsablePeriod: null,
    units: ["millions USD"],
    seasonalBases: ["weekly average", "Wednesday"],
    expectedReleaseSchedule: "Weekly; Table 1 values are averages of daily figures, while Table 5 balance-sheet stocks are Wednesday-only. The release does not publish total assets as a weekly average, so the LP equation remains unavailable.",
    releaseDateQuality: 0,
    sourceHealth: "MISSING",
    parserStatus: "VERIFIED",
    historyStatus: "PARTIAL",
    verifiedAt: "2026-10-04",
    familyAllocations: [{ factor: "liquidityProxy", family: "balanceSheetProxy", weight: 0.5 }],
  },
  {
    id: "federal-reserve-h6-m2",
    name: "H.6 monthly seasonally adjusted M2",
    owner: "Board of Governors of the Federal Reserve System",
    endpoint: "https://www.federalreserve.gov/releases/h6/data/FRB_h6_xml.zip",
    identifiers: ["M2.M"],
    accessMethod: "Official H.6 release-hosted SDMX/XML ZIP archive",
    reuseStatus: "CLEARED",
    reuseEvidenceUrl: FEDERAL_RESERVE_TERMS,
    reuseReviewUrl: FEDERAL_RESERVE_TERMS,
    attribution: "Cite the Board of Governors of the Federal Reserve System; identify H.6 M2 as seasonally adjusted billions of dollars and do not use Board insignia.",
    cadence: "monthly",
    firstUsablePeriod: "1959-01",
    units: ["billions USD"],
    seasonalBases: ["SA"],
    expectedReleaseSchedule: "Monthly H.6 release; the archive Prepared field is not an economic release timestamp. Monthly M2 must be matched to the same-month BEA headline-PCE index.",
    releaseDateQuality: 0,
    sourceHealth: "MISSING",
    parserStatus: "VERIFIED",
    historyStatus: "VERIFIED",
    verifiedAt: "2026-10-04",
    familyAllocations: [{ factor: "liquidityProxy", family: "realM2", weight: 0.5 }],
  },
  {
    id: "federal-reserve-sloos",
    name: "Senior Loan Officer Opinion Survey: domestic C&I lending standards",
    owner: "Board of Governors of the Federal Reserve System",
    endpoint: "https://www.federalreserve.gov/data/sloos.htm",
    identifiers: ["Figure 1 Panel 1 / Large and medium", "Figure 1 Panel 1 / Small"],
    accessMethod: "Official SLOOS release index and current Figure 1 chart-data page",
    reuseStatus: "CLEARED",
    reuseEvidenceUrl: FEDERAL_RESERVE_TERMS,
    reuseReviewUrl: FEDERAL_RESERVE_TERMS,
    attribution: "Cite the Board of Governors of the Federal Reserve System; identify these as domestic net-percentage C&I lending-standard survey responses.",
    cadence: "quarterly",
    firstUsablePeriod: "1990Q2",
    units: ["percent net"],
    seasonalBases: ["Not seasonally adjusted"],
    expectedReleaseSchedule: "Generally quarterly with occasional additional surveys. Survey periods and release dates differ; the chart history does not provide historical release timestamps.",
    releaseDateQuality: 0,
    sourceHealth: "MISSING",
    parserStatus: "VERIFIED",
    historyStatus: "VERIFIED",
    verifiedAt: "2026-10-04",
    familyAllocations: [{ factor: "creditConditions", family: "standards", weight: 0.4 }],
  },
  {
    id: "federal-reserve-h8",
    name: "Assets and Liabilities of Commercial Banks: H.8",
    owner: "Board of Governors of the Federal Reserve System",
    endpoint: "https://www.federalreserve.gov/datadownload/choose.aspx?rel=H8",
    identifiers: ["H8/H8/B1020NCBA"],
    accessMethod: "Official H.8 current release notes and dynamically selected Data Download Program all-bank SA weekly CSV",
    reuseStatus: "CLEARED",
    reuseEvidenceUrl: FEDERAL_RESERVE_TERMS,
    reuseReviewUrl: FEDERAL_RESERVE_TERMS,
    attribution: "Cite the Board of Governors of the Federal Reserve System; identify H.8 loans as nominal, seasonally adjusted billions of dollars.",
    cadence: "weekly",
    firstUsablePeriod: "1973-01-03",
    units: ["billions USD"],
    seasonalBases: ["SA"],
    expectedReleaseSchedule: "Weekly. Current/revised H.8 history is not original point-in-time vintages. The registered 13-week comparison requires 17 consecutive weekly levels; disclosed reclassification breaks inside the window block the factor.",
    releaseDateQuality: 0.25,
    sourceHealth: "AVAILABLE",
    parserStatus: "VERIFIED",
    historyStatus: "VERIFIED",
    verifiedAt: "2026-10-05",
    familyAllocations: [{ factor: "creditConditions", family: "bankVolume", weight: 0.3 }],
  },
  {
    id: "federal-reserve-credit-performance",
    name: "Charge-off and Delinquency Rates on Loans and Leases at Commercial Banks",
    owner: "Board of Governors of the Federal Reserve System",
    endpoint: "https://www.federalreserve.gov/releases/chargeoff/data/FRB_CHGDEL_xml.zip",
    identifiers: ["STFBQD%STFBAIL_XEOP_MA.Q", "STFBQC%STFBAIL_MA.Q"],
    accessMethod: "Official release-hosted CHGDEL SDMX/XML ZIP archive",
    reuseStatus: "CLEARED",
    reuseEvidenceUrl: FEDERAL_RESERVE_TERMS,
    reuseReviewUrl: FEDERAL_RESERVE_TERMS,
    attribution: "Cite the Board of Governors of the Federal Reserve System; delinquency is a quarterly rate and net charge-offs are annualized, net of recoveries.",
    cadence: "quarterly",
    firstUsablePeriod: "1985Q1",
    units: ["percent"],
    seasonalBases: ["SA"],
    expectedReleaseSchedule: "Quarterly with a publication lag; preserve unknown historical release timestamps instead of inferring them from the observation quarter.",
    releaseDateQuality: 0,
    sourceHealth: "MISSING",
    parserStatus: "VERIFIED",
    historyStatus: "VERIFIED",
    verifiedAt: "2026-10-04",
    familyAllocations: [{ factor: "creditConditions", family: "performance", weight: 0.3 }],
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

function periodEndMillis(observedAt: string, cadence: CoreSourceCadence): number | null {
  const date = new Date(observedAt + "T00:00:00.000Z");
  if (!Number.isFinite(date.getTime())) return null;
  const year = date.getUTCFullYear();
  const month = date.getUTCMonth();
  if (cadence === "monthly") return Date.UTC(year, month + 1, 0);
  if (cadence === "quarterly") return Date.UTC(year, (Math.floor(month / 3) + 1) * 3, 0);
  return date.getTime();
}

function prepareCoreSeries(
  series: CoreObservationSeriesResult,
  source: SourceRegistryEntry | undefined,
  now: Date,
): CoreObservationSeriesResult {
  if (!source) {
    return {
      ...series,
      state: "MISSING",
      observations: [],
      reason: "The source is not registered; its observations were not admitted.",
    };
  }
  if (source.reuseStatus !== "CLEARED" || source.sourceHealth === "REDISTRIBUTION_BLOCKED") {
    return {
      ...series,
      state: "REDISTRIBUTION_BLOCKED",
      observations: [],
      reason: source.healthReason ?? "Source-specific reuse/display clearance is unresolved.",
    };
  }
  if (series.state !== "AVAILABLE" || !series.observations.length) return series;

  const asOfDate = now.toISOString().slice(0, 10);
  const latest = series.observations
    .filter(({ observedAt }) => observedAt <= asOfDate)
    .sort((a, b) => a.observedAt.localeCompare(b.observedAt))
    .at(-1);
  if (!latest) {
    return {
      ...series,
      state: "MISSING",
      observations: [],
      reason: "No registered observation period is available at or before the current as-of date.",
    };
  }
  // An effective policy action remains current until the next action is published.
  if (source.id === "federal-reserve-policy-actions") return series;

  const periodEnd = periodEndMillis(latest.observedAt, source.cadence);
  const ageDays = periodEnd === null ? Infinity : (now.getTime() - periodEnd) / 86_400_000;
  const ceiling = freshnessAgeCeilingDays(source.cadence);
  if (!Number.isFinite(ageDays) || ageDays < 0 || ageDays > ceiling) {
    return {
      ...series,
      state: "STALE",
      reason: "Latest observation period is outside the " + ceiling + "-day " + source.cadence + " freshness window.",
    };
  }
  return series;
}

function aggregateSeriesStatus(
  source: SourceRegistryEntry,
  series: CoreObservationSeriesResult[],
  field: "parserStatus" | "historyStatus",
): SourceParserStatus {
  const values = series.map((item) => item[field]);
  if (values.includes("FAILED")) return "FAILED";
  const complete = source.identifiers.every((identifier) =>
    series.some((item) => item.identifier === identifier && item[field] === "VERIFIED"));
  if (complete) return "VERIFIED";
  if (values.some((value) => value === "PARTIAL" || value === "VERIFIED")) return "PARTIAL";
  return "UNVERIFIED";
}

function withCurrentSourceHealth(
  source: SourceRegistryEntry,
  series: CoreObservationSeriesResult[],
  now: Date,
): SourceRegistryEntry {
  if (source.reuseStatus !== "CLEARED" || source.sourceHealth === "REDISTRIBUTION_BLOCKED") return source;
  const matching = series.filter(({ sourceId }) => sourceId === source.id);
  if (!matching.length) {
    return {
      ...source,
      sourceHealth: "MISSING",
      observedAt: null,
      releasedAt: null,
      retrievedAt: null,
      healthReason: "No current adapter result is attached to this registered source.",
    };
  }

  const usable = new Set(matching
    .filter(({ state, observations }) => state === "AVAILABLE" && observations.length > 0)
    .map(({ identifier }) => identifier));
  const availableCount = source.identifiers.filter((identifier) => usable.has(identifier)).length;
  const sourceHealth: SourceState = availableCount > 0
    ? "AVAILABLE"
    : matching.some(({ state }) => state === "STALE")
      ? "STALE"
      : matching.some(({ state }) => state === "FAILED")
        ? "FAILED"
        : matching.some(({ state }) => state === "REDISTRIBUTION_BLOCKED")
          ? "REDISTRIBUTION_BLOCKED"
          : "MISSING";
  const unresolved = source.identifiers.filter((identifier) => !usable.has(identifier));
  const healthReason = sourceHealth === "AVAILABLE" && unresolved.length
    ? availableCount + " of " + source.identifiers.length + " registered series are available; remaining series: " + unresolved.join(", ") + "."
    : sourceHealth === "AVAILABLE"
      ? null
      : matching.find(({ reason }) => reason)?.reason ?? "No eligible current observation is available.";
  const observations = matching.flatMap(({ observations: values }) => values)
    .filter(({ observedAt }) => observedAt <= now.toISOString().slice(0, 10))
    .sort((a, b) => a.observedAt.localeCompare(b.observedAt));
  const latest = observations.at(-1);

  return {
    ...source,
    sourceHealth,
    parserStatus: aggregateSeriesStatus(source, matching, "parserStatus"),
    historyStatus: aggregateSeriesStatus(source, matching, "historyStatus"),
    observedAt: latest?.observedAt ?? null,
    releasedAt: latest?.releasedAt ?? null,
    retrievedAt: latest?.retrievedAt ?? null,
    healthReason,
  };
}

export function prepareCurrentCoreSources(
  sourceRegistry: SourceRegistryEntry[],
  series: CoreObservationSeriesResult[],
  now: Date,
): { sourceRegistry: SourceRegistryEntry[]; series: CoreObservationSeriesResult[] } {
  const sourceById = new Map(sourceRegistry.map((source) => [source.id, source]));
  const preparedSeries = series.map((item) => prepareCoreSeries(item, sourceById.get(item.sourceId), now));
  return {
    sourceRegistry: sourceRegistry.map((source) => withCurrentSourceHealth(source, preparedSeries, now)),
    series: preparedSeries,
  };
}
