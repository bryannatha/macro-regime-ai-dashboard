import type { RegimeFactorKey, RegimeNativeInputs, ScoreBounds } from "@/lib/types";
import type {
  CoreFactorAssessment,
  CoreFactorSlot,
  CoreFactorsResult,
  CoreMeasurementFamily,
  CoreObservationSeriesResult,
  CoreReadinessStatus,
  CoreTransformResult,
  SeriesExpectation,
} from "./types";
import {
  CORE_SCORE_ANCHORS,
  interpolateStress,
  transformAnnualized3m,
  transformClaimsIntensity,
  transformCreditStandards,
  transformCreditVolume,
  transformG3,
  transformLiquidityProxy,
  transformLatestLevel,
  transformPublishedGDP,
  transformRealM2,
  transformUnemploymentGap,
  transformYoY,
} from "./core-transformations";

const CPI_HEADLINE_NSA: SeriesExpectation = { sourceId: "bls-cpi", identifier: "CUUR0000SA0", unit: "index (1982-84=100)", seasonalBasis: "NSA", cadence: "monthly" };
const CPI_CORE_NSA: SeriesExpectation = { ...CPI_HEADLINE_NSA, identifier: "CUUR0000SA0L1E" };
const CPI_HEADLINE_SA: SeriesExpectation = { ...CPI_HEADLINE_NSA, identifier: "CUSR0000SA0", seasonalBasis: "SA" };
const CPI_CORE_SA: SeriesExpectation = { ...CPI_HEADLINE_SA, identifier: "CUSR0000SA0L1E" };
const PCE_HEADLINE: SeriesExpectation = { sourceId: "bea-pce-income", identifier: "T20804-M / DPCERG", unit: "index (2017=100)", seasonalBasis: "SA", cadence: "monthly" };
const PCE_CORE: SeriesExpectation = { ...PCE_HEADLINE, identifier: "T20804-M / DPCCRG" };
const GDP: SeriesExpectation = { sourceId: "bea-gdp", identifier: "T10101-Q / A191RL", unit: "percent SAAR", seasonalBasis: "SAAR", cadence: "quarterly" };
const INDUSTRIAL_PRODUCTION: SeriesExpectation = { sourceId: "federal-reserve-g17-ip", identifier: "B50001", unit: "index (G.17 total, release-defined base)", seasonalBasis: "SA", cadence: "monthly" };
const REAL_PCE: SeriesExpectation = { sourceId: "bea-pce-income", identifier: "T20806-M / DPCERX", unit: "millions of chained (2017) dollars (SAAR)", seasonalBasis: "SAAR", cadence: "monthly" };
const REAL_DISPOSABLE_INCOME: SeriesExpectation = { sourceId: "bea-pce-income", identifier: "T20600-M / A067RX", unit: "millions of chained (2017) dollars (SAAR)", seasonalBasis: "SAAR", cadence: "monthly" };
const PAYROLL: SeriesExpectation = { sourceId: "bls-labor", identifier: "CES0000000001", unit: "thousand persons", seasonalBasis: "SA", cadence: "monthly" };
const UNEMPLOYMENT: SeriesExpectation = { sourceId: "bls-labor", identifier: "LNS14000000", unit: "percent", seasonalBasis: "SA", cadence: "monthly" };
const CLAIMS: SeriesExpectation = { sourceId: "dol-initial-claims", identifier: "U.S. initial claims, seasonally adjusted (InitialClaims.SA)", unit: "thousand claims", seasonalBasis: "SA", cadence: "weekly" };
const POLICY: SeriesExpectation = { sourceId: "federal-reserve-policy-actions", identifier: "FOMC target range/action history", unit: "percent", seasonalBasis: "Not seasonally adjusted", cadence: "daily" };
const TREASURY_REAL: SeriesExpectation = { sourceId: "treasury-real-yield", identifier: "TC_10YEAR", unit: "percent", seasonalBasis: "Not seasonally adjusted", cadence: "daily" };
const H41_ASSETS: SeriesExpectation = { sourceId: "federal-reserve-h41-liquidity", identifier: "H.4.1 Table 1 / Total assets / weekly average", unit: "millions USD", seasonalBasis: "weekly average", cadence: "weekly" };
const H41_TGA: SeriesExpectation = { sourceId: "federal-reserve-h41-liquidity", identifier: "H.4.1 Table 1 / U.S. Treasury, General Account / weekly average", unit: "millions USD", seasonalBasis: "weekly average", cadence: "weekly" };
const H41_RRP_OTHERS: SeriesExpectation = { sourceId: "federal-reserve-h41-liquidity", identifier: "H.4.1 Table 1 / Reverse repurchase agreements: Others / weekly average", unit: "millions USD", seasonalBasis: "weekly average", cadence: "weekly" };
const H6_M2: SeriesExpectation = { sourceId: "federal-reserve-h6-m2", identifier: "M2.M", unit: "billions USD", seasonalBasis: "SA", cadence: "monthly" };
const SLOOS_LARGE_MEDIUM = "Figure 1 Panel 1 / Large and medium";
const SLOOS_SMALL = "Figure 1 Panel 1 / Small";
const H8_LOANS: SeriesExpectation = { sourceId: "federal-reserve-h8", identifier: "H.8 Table 2 line 9 / Loans and leases in bank credit", unit: "billions USD", seasonalBasis: "SA", cadence: "weekly" };
const DELINQUENCY: SeriesExpectation = { sourceId: "federal-reserve-credit-performance", identifier: "STFBQD%STFBAIL_XEOP_MA.Q", unit: "percent", seasonalBasis: "SA", cadence: "quarterly" };
const CHARGE_OFF: SeriesExpectation = { sourceId: "federal-reserve-credit-performance", identifier: "STFBQC%STFBAIL_MA.Q", unit: "percent", seasonalBasis: "SA", cadence: "quarterly" };

type SlotDefinition = { key: string; weight: number; targetHistory: number; metric: CoreTransformResult };

function unavailableMetric(reason: string, unit = "", sourceIds: string[] = [], identifiers: string[] = []): CoreTransformResult {
  return {
    value: null,
    score: null,
    unit,
    observedAt: null,
    sourceIds,
    identifiers,
    dependencyIds: sourceIds.map((sourceId, index) => `${sourceId}:${identifiers[index] ?? "unknown"}`),
    observations: [],
    historyPoints: 0,
    historyYears: null,
    releaseQuality: null,
    reason,
  };
}

function validAtAsOf(series: CoreObservationSeriesResult | null, asOf: string): CoreObservationSeriesResult | null {
  if (!series || series.state !== "AVAILABLE" || series.parserStatus !== "VERIFIED" ||
      series.historyStatus === "UNVERIFIED" || series.historyStatus === "FAILED" ||
      !Number.isFinite(Date.parse(series.retrievedAt ?? "")) || series.retrievedAt! > asOf) return null;
  if (series.observations.some((observation) =>
    observation.sourceId !== series.sourceId || observation.identifier !== series.identifier ||
    !Number.isFinite(observation.value) || !Number.isFinite(observation.releaseDateQuality) ||
    observation.releaseDateQuality < 0 || observation.releaseDateQuality > 1 ||
    !/^\d{4}-\d{2}-\d{2}$/.test(observation.observedAt) || !Number.isFinite(Date.parse(observation.observedAt)) ||
    !Number.isFinite(Date.parse(observation.retrievedAt)) || observation.retrievedAt > asOf ||
    (observation.releasedAt !== null && (!Number.isFinite(Date.parse(observation.releasedAt)) || observation.releasedAt > asOf.slice(0, 10)))
  )) return null;
  return series;
}

function sourceSeries(sources: CoreObservationSeriesResult[], expected: SeriesExpectation, asOf: string): CoreObservationSeriesResult | null {
  const matches = sources.filter(({ sourceId, identifier }) => sourceId === expected.sourceId && identifier === expected.identifier);
  if (matches.length !== 1) return null;
  const candidate = validAtAsOf(matches[0], asOf);
  if (!candidate || candidate.observations.some((observation) =>
    observation.unit !== expected.unit || observation.seasonalBasis !== expected.seasonalBasis)) return null;
  return candidate;
}

function slot(definition: SlotDefinition): CoreFactorSlot {
  const metric = definition.metric;
  const available = metric.score !== null && Number.isFinite(metric.score);
  const history = Math.max(0, Math.min(1, metric.historyPoints / definition.targetHistory));
  return {
    key: definition.key,
    weight: definition.weight,
    value: metric.value,
    score: metric.score,
    unit: metric.unit,
    eligible: available,
    observedAt: metric.observedAt,
    sourceIds: [...metric.sourceIds],
    identifiers: [...metric.identifiers],
    dependencyIds: [...metric.dependencyIds],
    historyPoints: metric.historyPoints,
    historyYears: metric.historyYears,
    releaseQuality: metric.releaseQuality,
    quality: {
      eligible: available,
      freshness: available ? 1 : 0,
      history,
      release: metric.releaseQuality ?? 0,
      fetchHealth: available ? 1 : 0,
    },
    reason: metric.reason,
  };
}

function unique(values: string[]): string[] {
  return Array.from(new Set(values)).sort();
}

function readiness(coverage: number, eligible: boolean, complete: boolean): CoreReadinessStatus {
  if (!eligible) return "WITHHELD";
  if (complete && coverage >= 1 - 1e-10) return "READY";
  if (coverage >= 0.8) return "ADEQUATE";
  return "LIMITED";
}

function family(
  factor: RegimeFactorKey,
  key: string,
  weight: number,
  definitions: SlotDefinition[],
  essential: string[],
  additionalDependencies: string[] = [],
): CoreMeasurementFamily {
  const sumWeights = definitions.reduce((sum, item) => sum + item.weight, 0);
  if (Math.abs(sumWeights - 1) > 1e-9) throw new Error(`Core family slot weights must sum to 1: ${factor}.${key}`);
  const rawCoverage = definitions.reduce((sum, item) => sum + item.weight * (item.metric.score === null ? 0 : 1), 0);
  const essentialPresent = essential.every((slotKey) => definitions.some((item) => item.key === slotKey && item.metric.score !== null));
  const eligible = essentialPresent && rawCoverage >= 0.6;
  const coverage = eligible ? rawCoverage : 0;
  const partialScore = eligible ? definitions.reduce((sum, item) => sum + (item.metric.score === null ? 0 : item.weight * item.metric.score), 0) : 0;
  const score = eligible ? partialScore / rawCoverage : null;
  const lower = 100 * partialScore;
  const bounds = { lower, upper: lower + 100 * (1 - coverage) };
  const slots = definitions.map((item) => {
    const result = slot(item);
    if (eligible) return result;
    return { ...result, eligible: false, quality: { ...result.quality, eligible: false } };
  });
  const dependencyIds = unique([...slots.flatMap((item) => item.dependencyIds), ...additionalDependencies]);
  const sourceIds = unique(slots.flatMap((item) => item.sourceIds));
  const identifiers = unique(slots.flatMap((item) => item.identifiers));
  return {
    key,
    factor,
    weight,
    score,
    coverage,
    bounds,
    eligible,
    status: readiness(coverage, eligible, rawCoverage >= 1 - 1e-10),
    slots,
    sourceIds,
    identifiers,
    dependencyIds,
    reason: eligible ? null : essentialPresent ? "Eligible primary-slot coverage is below the 60% family floor." : "A required family input is unavailable or invalid.",
  };
}

function factor(key: RegimeFactorKey, families: CoreMeasurementFamily[]): CoreFactorAssessment {
  const familyWeight = families.reduce((sum, item) => sum + item.weight, 0);
  if (Math.abs(familyWeight - 1) > 1e-9) throw new Error(`Core family weights must sum to 1: ${key}`);
  const coverage = families.reduce((sum, item) => sum + item.weight * item.coverage, 0);
  const scoreMass = families.reduce((sum, item) => sum + (item.score === null ? 0 : item.weight * item.coverage * item.score), 0);
  const eligibleFamilies = families.filter((item) => item.eligible).length;
  const eligible = coverage >= 0.6 && eligibleFamilies >= 2;
  const bounds: ScoreBounds = { lower: scoreMass, upper: scoreMass + 100 * (1 - coverage) };
  const slots = families.flatMap((item) => item.slots);
  const years = slots.filter((item) => item.eligible && item.historyYears !== null).map((item) => item.historyYears!);
  const releaseQuality = families.reduce((sum, item) => sum + item.weight * item.slots.reduce((slotSum, current) =>
    slotSum + current.weight * (item.eligible ? current.releaseQuality ?? 0 : 0), 0), 0);
  return {
    key,
    score: eligible && coverage > 0 ? scoreMass / coverage : null,
    coverage,
    bounds,
    eligibleFamilies,
    configuredFamilies: families.length,
    historyYears: years.length ? Math.min(...years) : null,
    releaseQuality,
    status: readiness(coverage, eligible, eligibleFamilies === families.length),
    families,
  };
}

function bySource(sources: CoreObservationSeriesResult[], expected: SeriesExpectation, asOf: string): CoreObservationSeriesResult | null {
  return sourceSeries(sources, expected, asOf);
}

function levelMetric(series: CoreObservationSeriesResult | null, expectation: SeriesExpectation, anchors: readonly (readonly [number, number])[]) {
  return transformLatestLevel(series, expectation, anchors);
}

function policyRateMetric(sources: CoreObservationSeriesResult[], asOf: string, corePceYoY: CoreTransformResult): CoreTransformResult {
  const actions = bySource(sources, POLICY, asOf);
  if (!actions || corePceYoY.value === null) {
    return unavailableMetric("The current target action or eligible core-PCE inflation rate is unavailable.", "percentage points");
  }
  const action = actions.observations.filter((observation) => observation.observedAt <= asOf.slice(0, 10)).at(-1);
  if (!action || action.value < 0 || action.value > 25) {
    return unavailableMetric("The latest valid Federal Reserve target midpoint was unavailable.", "percentage points");
  }
  const value = action.value - corePceYoY.value;
  const observations = [...corePceYoY.observations, action];
  return {
    value,
    score: interpolateStress(value, CORE_SCORE_ANCHORS.realPolicy),
    unit: "percentage points",
    observedAt: action.observedAt,
    sourceIds: unique(observations.map(({ sourceId }) => sourceId)),
    identifiers: unique(observations.map(({ identifier }) => identifier)),
    dependencyIds: unique([...corePceYoY.dependencyIds, `${action.sourceId}:${action.identifier}`]),
    observations,
    historyPoints: corePceYoY.historyPoints,
    historyYears: corePceYoY.historyYears,
    releaseQuality: Math.min(action.releaseDateQuality, corePceYoY.releaseQuality ?? 0),
    reason: null,
  };
}

function scoreFamily(
  factorKey: RegimeFactorKey,
  familyKey: string,
  weight: number,
  metric: CoreTransformResult,
  targetHistory: number,
  extraDependencies: string[] = [],
): CoreMeasurementFamily {
  return family(factorKey, familyKey, weight, [slotDefinition(familyKey, 1, metric, targetHistory)], [familyKey], extraDependencies);
}

function slotDefinition(key: string, weight: number, metric: CoreTransformResult, targetHistory: number): SlotDefinition {
  return { key, weight, metric, targetHistory };
}

function unavailableFamily(factorKey: RegimeFactorKey, key: string, weight: number, slots: Array<[string, number, number]>, reason: string): CoreMeasurementFamily {
  return family(factorKey, key, weight, slots.map(([slotKey, slotWeight, target]) =>
    slotDefinition(slotKey, slotWeight, unavailableMetric(reason), target)), []);
}

function validAsOf(asOf: string): boolean {
  return /^\d{4}-\d{2}-\d{2}T/.test(asOf) && Number.isFinite(Date.parse(asOf));
}

export function buildCoreFactors(sources: CoreObservationSeriesResult[], asOf: string): CoreFactorsResult {
  const timestamp = validAsOf(asOf) ? asOf : "1970-01-01T00:00:00.000Z";

  const cpiCoreYoY = transformYoY(bySource(sources, CPI_CORE_NSA, timestamp), CPI_CORE_NSA, CORE_SCORE_ANCHORS.inflation);
  const cpiHeadlineYoY = transformYoY(bySource(sources, CPI_HEADLINE_NSA, timestamp), CPI_HEADLINE_NSA, CORE_SCORE_ANCHORS.inflation);
  const pceCoreYoY = transformYoY(bySource(sources, PCE_CORE, timestamp), PCE_CORE, CORE_SCORE_ANCHORS.inflation);
  const pceHeadlineYoY = transformYoY(bySource(sources, PCE_HEADLINE, timestamp), PCE_HEADLINE, CORE_SCORE_ANCHORS.inflation);
  const cpiCoreMomentum = transformAnnualized3m(bySource(sources, CPI_CORE_SA, timestamp), CPI_CORE_SA, CORE_SCORE_ANCHORS.inflation);
  const pceCoreMomentum = transformAnnualized3m(bySource(sources, PCE_CORE, timestamp), PCE_CORE, CORE_SCORE_ANCHORS.inflation);

  const inflationFamilies = [
    family("inflation", "cpi", 0.5, [
      slotDefinition("coreYoY", 0.7, cpiCoreYoY, 120),
      slotDefinition("headlineYoY", 0.3, cpiHeadlineYoY, 120),
    ], ["coreYoY"]),
    family("inflation", "pce", 0.5, [
      slotDefinition("coreYoY", 0.7, pceCoreYoY, 120),
      slotDefinition("headlineYoY", 0.3, pceHeadlineYoY, 120),
    ], ["coreYoY"]),
  ];

  const gdp = transformPublishedGDP(bySource(sources, GDP, timestamp), GDP);
  const production = transformG3(bySource(sources, INDUSTRIAL_PRODUCTION, timestamp), INDUSTRIAL_PRODUCTION, CORE_SCORE_ANCHORS.realActivity);
  const realPce = transformG3(bySource(sources, REAL_PCE, timestamp), REAL_PCE, CORE_SCORE_ANCHORS.realActivity);
  const realIncome = transformG3(bySource(sources, REAL_DISPOSABLE_INCOME, timestamp), REAL_DISPOSABLE_INCOME, CORE_SCORE_ANCHORS.realActivity);
  const growthFamilies = [
    scoreFamily("growth", "gdp", 0.25, gdp, 40),
    scoreFamily("growth", "production", 0.25, production, 120),
    scoreFamily("growth", "realPce", 0.25, realPce, 120, ["bea-pce-income:section2-revisions"]),
    scoreFamily("growth", "realDisposableIncome", 0.125, realIncome, 120, ["bea-pce-income:section2-revisions"]),
    unavailableFamily("growth", "housing", 0.125, [["housingStartsAndPermits", 1, 120]], "The approved housing source family has not been implemented.")
  ];

  const payrollGrowth = transformG3(bySource(sources, PAYROLL, timestamp), PAYROLL, CORE_SCORE_ANCHORS.payroll);
  const unemploymentLevel = levelMetric(bySource(sources, UNEMPLOYMENT, timestamp), UNEMPLOYMENT, CORE_SCORE_ANCHORS.unemploymentLevel);
  const unemploymentGap = transformUnemploymentGap(bySource(sources, UNEMPLOYMENT, timestamp), UNEMPLOYMENT, CORE_SCORE_ANCHORS.unemploymentGap);
  const claimsIntensity = transformClaimsIntensity(
    bySource(sources, CLAIMS, timestamp),
    bySource(sources, PAYROLL, timestamp),
    CLAIMS,
    PAYROLL,
    CORE_SCORE_ANCHORS.claimsIntensity,
  );
  const laborFamilies = [
    scoreFamily("labor", "payroll", 0.4, payrollGrowth, 120),
    family("labor", "householdLabor", 0.35, [
      slotDefinition("unemploymentLevel", 0.5, unemploymentLevel, 120),
      slotDefinition("unemploymentGap", 0.5, unemploymentGap, 120),
    ], ["unemploymentLevel"]),
    scoreFamily("labor", "claims", 0.25, claimsIntensity, 520),
  ];

  const realPolicy = policyRateMetric(sources, timestamp, pceCoreYoY);
  const treasury = bySource(sources, TREASURY_REAL, timestamp) ?? sources.find(({ sourceId }) => sourceId === TREASURY_REAL.sourceId) ?? null;
  const realFinancing = treasury?.state === "REDISTRIBUTION_BLOCKED"
    ? unavailableMetric("Treasury real-yield redistribution is blocked pending source-specific clearance.", "percent", [TREASURY_REAL.sourceId], [TREASURY_REAL.identifier])
    : unavailableMetric("No eligible Treasury 10-year real par-yield history was supplied.", "percent", [TREASURY_REAL.sourceId], [TREASURY_REAL.identifier]);
  const policyFamilies = [
    scoreFamily("policyRates", "realPolicyStance", 0.5, realPolicy, 120),
    scoreFamily("policyRates", "realFinancing", 0.5, realFinancing, 2520),
  ];

  const creditStandardsLarge = transformCreditStandards(bySource(sources, { sourceId: "federal-reserve-sloos", identifier: SLOOS_LARGE_MEDIUM, unit: "percent net", seasonalBasis: "Not seasonally adjusted", cadence: "quarterly" }, timestamp), SLOOS_LARGE_MEDIUM);
  const creditStandardsSmall = transformCreditStandards(bySource(sources, { sourceId: "federal-reserve-sloos", identifier: SLOOS_SMALL, unit: "percent net", seasonalBasis: "Not seasonally adjusted", cadence: "quarterly" }, timestamp), SLOOS_SMALL);
  const creditVolume = transformCreditVolume(bySource(sources, H8_LOANS, timestamp));
  const delinquency = levelMetric(bySource(sources, DELINQUENCY, timestamp), DELINQUENCY, CORE_SCORE_ANCHORS.delinquency);
  const chargeOff = levelMetric(bySource(sources, CHARGE_OFF, timestamp), CHARGE_OFF, CORE_SCORE_ANCHORS.chargeOff);
  const creditFamilies = [
    family("creditConditions", "standards", 0.4, [
      slotDefinition("largeAndMedium", 0.5, creditStandardsLarge, 40),
      slotDefinition("small", 0.5, creditStandardsSmall, 40),
    ], []),
    scoreFamily("creditConditions", "bankVolume", 0.3, creditVolume, 520),
    family("creditConditions", "performance", 0.3, [
      slotDefinition("delinquency", 0.5, delinquency, 40),
      slotDefinition("netChargeOff", 0.5, chargeOff, 40),
    ], []),
  ];
  const balanceSheetProxy = transformLiquidityProxy(
    bySource(sources, H41_ASSETS, timestamp),
    bySource(sources, H41_TGA, timestamp),
    bySource(sources, H41_RRP_OTHERS, timestamp),
  );
  if (balanceSheetProxy.score === null) {
    balanceSheetProxy.sourceIds = [H41_ASSETS.sourceId];
    balanceSheetProxy.identifiers = [H41_ASSETS.identifier, H41_TGA.identifier, H41_RRP_OTHERS.identifier];
    balanceSheetProxy.dependencyIds = [H41_ASSETS, H41_TGA, H41_RRP_OTHERS].map(({ sourceId, identifier }) => `${sourceId}:${identifier}`);
    balanceSheetProxy.reason = "H.4.1 does not publish total assets on the weekly-average basis required by the approved LP equation.";
  }
  const realM2 = transformRealM2(bySource(sources, H6_M2, timestamp), bySource(sources, PCE_HEADLINE, timestamp));
  const liquidityFamilies = [
    scoreFamily("liquidityProxy", "balanceSheetProxy", 0.5, balanceSheetProxy, 520),
    scoreFamily("liquidityProxy", "realM2", 0.5, realM2, 120),
  ];

  const factors: Record<RegimeFactorKey, CoreFactorAssessment> = {
    inflation: factor("inflation", inflationFamilies),
    growth: factor("growth", growthFamilies),
    labor: factor("labor", laborFamilies),
    policyRates: factor("policyRates", policyFamilies),
    creditConditions: factor("creditConditions", creditFamilies),
    liquidityProxy: factor("liquidityProxy", liquidityFamilies),
  };
  const native: RegimeNativeInputs = {
    deltaPi: null,
    realPolicyRate: realPolicy.value,
    deltaR: null,
    deltaTarget: null,
    deltaP: null,
    worseningMomenta: null,
    coreYoYChange: null,
    creditStressChange: null,
    liquidityStressChange: null,
    creditStandards: null,
    creditVolume: null,
  };

  return {
    factors,
    native,
    momentum: {
      cpiCoreAnnualized3m: cpiCoreMomentum,
      pceCoreAnnualized3m: pceCoreMomentum,
      productionG3: production,
      realPceG3: realPce,
      realDisposableIncomeG3: realIncome,
      payrollG3: payrollGrowth,
      unemploymentGap,
      claimsIntensity,
      realM2,
      balanceSheetProxy,
      creditStandardsLarge,
      creditStandardsSmall,
      creditVolume,
      delinquency,
      chargeOff,
    },
  };
}

export function toRegimeFactorInputs(factors: CoreFactorsResult["factors"]): Record<RegimeFactorKey, {
  bounds: ScoreBounds;
  coverage: number;
  eligibleFamilies: number;
  historyYears: number | null;
  releaseQuality: number | null;
}> {
  return Object.fromEntries(Object.entries(factors).map(([key, value]) => [key, {
    bounds: value.bounds,
    coverage: value.coverage,
    eligibleFamilies: value.eligibleFamilies,
    historyYears: value.historyYears,
    releaseQuality: value.releaseQuality,
  }])) as Record<RegimeFactorKey, {
    bounds: ScoreBounds;
    coverage: number;
    eligibleFamilies: number;
    historyYears: number | null;
    releaseQuality: number | null;
  }>;
}

export function toQualitySlots(factors: CoreFactorsResult["factors"]): Array<{
  weight: number;
  eligible: boolean;
  freshness: number;
  history: number;
  release: number;
  fetchHealth: number;
}> {
  const factorWeight = 1 / 6;
  return Object.values(factors).flatMap((assessment) => assessment.families.flatMap((measurement) => measurement.slots.map((item) => ({
    weight: factorWeight * measurement.weight * item.weight,
    ...item.quality,
  }))));
}
