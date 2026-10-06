import type { CoreObservationSeriesResult, CoreSourceObservation, CoreTransformResult, SeriesExpectation } from "./types";

export type StressAnchors = readonly (readonly [number, number])[];

export const CORE_SCORE_ANCHORS = {
  inflation: [[0, 0], [1, 10], [2, 25], [3, 50], [4, 70], [6, 90], [8, 100]],
  realActivity: [[-4, 100], [-2, 85], [0, 65], [1, 50], [2, 30], [3, 15], [4, 5], [5, 0]],
  payroll: [[-3, 100], [-1, 85], [0, 65], [1, 40], [2, 20], [3, 5], [4, 0]],
  unemploymentLevel: [[3, 0], [4, 25], [5, 50], [6, 70], [8, 90], [10, 100]],
  unemploymentGap: [[-.2, 0], [0, 20], [.25, 45], [.5, 70], [1, 90], [2, 100]],
  claimsIntensity: [[.8, 5], [1.2, 20], [1.8, 45], [2.5, 70], [3.5, 90], [5, 100]],
  realPolicy: [[-2, 0], [0, 25], [1, 50], [2, 75], [3, 90], [4, 100]],
  realFinancing: [[-1, 0], [0, 25], [1, 50], [2, 75], [3, 100]],
  liquidityBalance: [[-10, 100], [-5, 85], [-2, 65], [0, 45], [2, 25], [5, 10], [10, 0]],
  realM2: [[-10, 100], [-5, 85], [0, 55], [3, 35], [6, 15], [10, 0]],
  creditStandards: [[-40, 0], [-20, 15], [0, 35], [20, 60], [40, 80], [60, 95], [80, 100]],
  creditVolume: [[-5, 90], [0, 65], [4, 35], [8, 10], [12, 0]],
  delinquency: [[1, 10], [2, 35], [3, 60], [5, 85], [8, 100]],
  chargeOff: [[.2, 10], [.5, 35], [1, 60], [2, 85], [4, 100]],
} satisfies Record<string, StressAnchors>;

type ValidatedSeries = { observations: CoreSourceObservation[]; points: number[] };

const REAL_M2_EXPECTATION: SeriesExpectation = {
  sourceId: "federal-reserve-h6-m2",
  identifier: "M2.M",
  unit: "billions USD",
  seasonalBasis: "SA",
  cadence: "monthly",
};
const HEADLINE_PCE_EXPECTATION: SeriesExpectation = {
  sourceId: "bea-pce-income",
  identifier: "T20804-M / DPCERG",
  unit: "index (2017=100)",
  seasonalBasis: "SA",
  cadence: "monthly",
};

function unavailable(reason: string, unit = ""): CoreTransformResult {
  return {
    value: null,
    score: null,
    unit,
    observedAt: null,
    sourceIds: [],
    identifiers: [],
    dependencyIds: [],
    observations: [],
    historyPoints: 0,
    historyYears: null,
    releaseQuality: null,
    reason,
  };
}

function periodIndex(observation: CoreSourceObservation, cadence: SeriesExpectation["cadence"]): number | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(observation.observedAt);
  if (!match) return null;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const timestamp = Date.parse(`${observation.observedAt}T00:00:00.000Z`);
  if (!Number.isFinite(timestamp) || new Date(timestamp).toISOString().slice(0, 10) !== observation.observedAt) return null;
  if (cadence === "weekly") return timestamp / 86_400_000;
  if (cadence === "daily") return timestamp / 86_400_000;
  if (day !== 1) return null;
  if (cadence === "quarterly" && ![1, 4, 7, 10].includes(month)) return null;
  return year * 12 + month;
}

function validateSeries(
  series: CoreObservationSeriesResult | null | undefined,
  expectation: SeriesExpectation,
  requireContinuity = true,
): ValidatedSeries | null {
  if (!series || series.state !== "AVAILABLE" || series.parserStatus !== "VERIFIED" ||
      series.historyStatus === "UNVERIFIED" || series.historyStatus === "FAILED" ||
      series.sourceId !== expectation.sourceId || series.identifier !== expectation.identifier ||
      series.observations.length === 0 || !Number.isFinite(Date.parse(series.retrievedAt ?? ""))) return null;
  const observations = series.observations;
  const indexes = observations.map((observation) => periodIndex(observation, expectation.cadence));
  if (indexes.some((index) => index === null) || observations.some((observation) =>
    observation.sourceId !== expectation.sourceId || observation.identifier !== expectation.identifier ||
    observation.unit !== expectation.unit || observation.seasonalBasis !== expectation.seasonalBasis ||
    !Number.isFinite(observation.value) || !Number.isFinite(Date.parse(observation.retrievedAt)) ||
    !Number.isFinite(observation.releaseDateQuality) || observation.releaseDateQuality < 0 || observation.releaseDateQuality > 1 ||
    (observation.releasedAt !== null && (!Number.isFinite(Date.parse(observation.releasedAt)) || observation.releasedAt > observation.retrievedAt.slice(0, 10)))
  )) return null;
  const numericIndexes = indexes as number[];
  for (let index = 1; index < numericIndexes.length; index += 1) {
    const step = expectation.cadence === "weekly" ? 7 : expectation.cadence === "quarterly" ? 3 : 1;
    const distance = numericIndexes[index] - numericIndexes[index - 1];
    if (distance <= 0 || (requireContinuity && distance !== step)) return null;
  }
  return { observations, points: observations.map(({ value }) => value) };
}

export function interpolateStress(value: number, anchors: StressAnchors): number | null {
  if (!Number.isFinite(value) || anchors.length < 2 || anchors.some(([x, y], index) =>
    !Number.isFinite(x) || !Number.isFinite(y) || y < 0 || y > 100 || (index > 0 && x <= anchors[index - 1][0]))) return null;
  if (value <= anchors[0][0]) return anchors[0][1];
  if (value >= anchors.at(-1)![0]) return anchors.at(-1)![1];
  for (let index = 1; index < anchors.length; index += 1) {
    const [x1, y1] = anchors[index];
    const [x0, y0] = anchors[index - 1];
    if (value <= x1) return y0 + ((value - x0) / (x1 - x0)) * (y1 - y0);
  }
  return null;
}

function result(
  value: number,
  anchors: StressAnchors,
  unit: string,
  observations: CoreSourceObservation[],
  historyPoints: number,
  historyYears: number,
): CoreTransformResult {
  const ids = Array.from(new Set(observations.map(({ sourceId }) => sourceId))).sort();
  const identifiers = Array.from(new Set(observations.map(({ identifier }) => identifier))).sort();
  const releaseQuality = observations.length ? Math.min(...observations.map(({ releaseDateQuality }) => releaseDateQuality)) : null;
  return {
    value,
    score: interpolateStress(value, anchors),
    unit,
    observedAt: observations.map(({ observedAt }) => observedAt).sort().at(-1) ?? null,
    sourceIds: ids,
    identifiers,
    dependencyIds: observations.map(({ sourceId, identifier }) => `${sourceId}:${identifier}`).filter((value, index, all) => all.indexOf(value) === index).sort(),
    observations,
    historyPoints,
    historyYears,
    releaseQuality,
    reason: null,
  };
}

function missingHistory(unit: string): CoreTransformResult {
  return unavailable("The source does not contain enough continuous history for this transformation.", unit);
}

export function transformYoY(
  series: CoreObservationSeriesResult | null | undefined,
  expectation: SeriesExpectation,
  anchors: StressAnchors,
): CoreTransformResult {
  const validated = validateSeries(series, expectation, false);
  if (!validated) return unavailable("The source, identifier, units, seasonal basis, or period continuity did not match the approved series.", "percent YoY");
  const { observations, points } = validated;
  if (expectation.cadence !== "monthly" || points.some((value) => value <= 0)) return missingHistory("percent YoY");

  const observationIndexes = observations.map((observation) => periodIndex(observation, "monthly"));
  if (observationIndexes.some((index) => index === null)) return unavailable("The approved monthly observation periods are invalid.", "percent YoY");
  const observedByMonth = new Map((observationIndexes as number[]).map((index, position) => [index, observations[position]]));
  const missingPeriods = series?.missingPeriods ?? [];
  const missingIndexes = missingPeriods.map((period) => {
    const match = /^(\d{4})-(\d{2})-01$/.exec(period);
    if (!match) return null;
    const year = Number(match[1]);
    const month = Number(match[2]);
    const date = new Date(Date.UTC(year, month - 1, 1)).toISOString().slice(0, 10);
    return date === period && month >= 1 && month <= 12 ? year * 12 + month : null;
  });
  if (missingIndexes.some((index) => index === null) || new Set(missingIndexes).size !== missingIndexes.length ||
      missingIndexes.some((index) => observedByMonth.has(index!))) {
    return unavailable("The source contains invalid or conflicting missing-month metadata.", "percent YoY");
  }

  const targetIndex = Math.max(...(observationIndexes as number[]), ...(missingIndexes as number[]));
  const current = observedByMonth.get(targetIndex);
  const prior = observedByMonth.get(targetIndex - 12);
  if (!current || !prior || current.value <= 0 || prior.value <= 0) {
    return unavailable("The exact current-month or year-earlier observation required for YoY is missing.", "percent YoY");
  }

  const validPairCount = (observationIndexes as number[]).reduce((count, index) =>
    count + (observedByMonth.has(index - 12) ? 1 : 0), 0);
  const value = 100 * (current.value / prior.value - 1);
  return result(value, anchors, "percent YoY", [prior, current], validPairCount, validPairCount / 12);
}

export function transformAnnualized3m(
  series: CoreObservationSeriesResult | null | undefined,
  expectation: SeriesExpectation,
  anchors: StressAnchors,
): CoreTransformResult {
  const validated = validateSeries(series, expectation);
  if (!validated) return unavailable("The source, identifier, units, seasonal basis, or period continuity did not match the approved series.", "percent annualized");
  const { observations, points } = validated;
  if (expectation.cadence !== "monthly" || points.length < 4 || points.some((value) => value <= 0)) return missingHistory("percent annualized");
  const latest = points.length - 1;
  const prior = latest - 3;
  const value = 100 * ((points[latest] / points[prior]) ** 4 - 1);
  return result(value, anchors, "percent annualized", observations.slice(prior), points.length - 3, (points.length - 3) / 12);
}

export function transformG3(
  series: CoreObservationSeriesResult | null | undefined,
  expectation: SeriesExpectation,
  anchors: StressAnchors,
): CoreTransformResult {
  const validated = validateSeries(series, expectation);
  if (!validated) return unavailable("The source, identifier, units, seasonal basis, or period continuity did not match the approved series.", "percent annualized");
  const { observations, points } = validated;
  if (expectation.cadence !== "monthly" || points.length < 6 || points.some((value) => value <= 0)) return missingHistory("percent annualized");
  const latest = points.length - 1;
  const currentMean = points.slice(latest - 2, latest + 1).reduce((sum, value) => sum + value, 0) / 3;
  const priorMean = points.slice(latest - 5, latest - 2).reduce((sum, value) => sum + value, 0) / 3;
  const value = 100 * ((currentMean / priorMean) ** 4 - 1);
  return result(value, anchors, "percent annualized", observations.slice(-6), points.length - 5, (points.length - 5) / 12);
}

export function transformPublishedGDP(
  series: CoreObservationSeriesResult | null | undefined,
  expectation: SeriesExpectation,
): CoreTransformResult {
  const validated = validateSeries(series, expectation);
  if (!validated) return unavailable("The source, identifier, units, seasonal basis, or period continuity did not match the approved GDP series.", "percent SAAR");
  const { observations, points } = validated;
  if (expectation.cadence !== "quarterly" || expectation.unit !== "percent SAAR" || expectation.seasonalBasis !== "SAAR" || points.length < 2) return missingHistory("percent SAAR");
  const latest = observations.length - 1;
  return result(points[latest], CORE_SCORE_ANCHORS.realActivity, "percent SAAR", [observations[latest]], points.length, points.length / 4);
}

export function transformLatestLevel(
  series: CoreObservationSeriesResult | null | undefined,
  expectation: SeriesExpectation,
  anchors: StressAnchors,
): CoreTransformResult {
  const validated = validateSeries(series, expectation);
  if (!validated) return unavailable("The source, identifier, units, seasonal basis, or period continuity did not match the approved level series.", expectation.unit);
  const { observations, points } = validated;
  if (points.length === 0) return missingHistory(expectation.unit);
  const latest = observations.at(-1)!;
  const historyYears = expectation.cadence === "monthly" ? points.length / 12
    : expectation.cadence === "quarterly" ? points.length / 4 : points.length / 52;
  return result(latest.value, anchors, expectation.unit, [latest], points.length, historyYears);
}

export function transformUnemploymentGap(
  series: CoreObservationSeriesResult | null | undefined,
  expectation: SeriesExpectation,
  anchors: StressAnchors,
): CoreTransformResult {
  const validated = validateSeries(series, expectation);
  if (!validated) return unavailable("The source, identifier, units, seasonal basis, or period continuity did not match the approved unemployment series.", "percentage points");
  const { observations, points } = validated;
  if (expectation.cadence !== "monthly" || points.length < 14) return missingHistory("percentage points");
  const mean3 = (end: number) => (points[end - 2] + points[end - 1] + points[end]) / 3;
  const latestMean = mean3(points.length - 1);
  const trailingMeans = Array.from({ length: 12 }, (_, index) => mean3(points.length - 12 + index));
  const value = latestMean - Math.min(...trailingMeans);
  return result(value, anchors, "percentage points", observations.slice(-14), points.length - 13, (points.length - 13) / 12);
}

export function transformClaimsIntensity(
  claims: CoreObservationSeriesResult | null | undefined,
  payroll: CoreObservationSeriesResult | null | undefined,
  claimsExpectation: SeriesExpectation,
  payrollExpectation: SeriesExpectation,
  anchors: StressAnchors,
): CoreTransformResult {
  const claimsData = validateSeries(claims, claimsExpectation);
  const payrollData = validateSeries(payroll, payrollExpectation);
  if (!claimsData || !payrollData || claimsExpectation.cadence !== "weekly" || payrollExpectation.cadence !== "monthly" ||
      claimsExpectation.unit !== "thousand claims" || payrollExpectation.unit !== "thousand persons" ||
      claimsExpectation.seasonalBasis !== "SA" || payrollExpectation.seasonalBasis !== "SA") {
    return unavailable("Initial claims or payroll employment did not match the approved seasonal basis and units.", "claims per 1,000 employed");
  }
  if (claimsData.points.length < 4 || payrollData.points.length < 1) return missingHistory("claims per 1,000 employed");
  const latestClaims = claimsData.observations.slice(-4);
  const latestPayroll = payrollData.observations.at(-1)!;
  if (latestPayroll.value <= 0 || latestPayroll.observedAt > latestClaims.at(-1)!.observedAt) {
    return unavailable("A valid latest payroll employment denominator was not available for the claims window.", "claims per 1,000 employed");
  }
  const meanClaims = latestClaims.reduce((sum, observation) => sum + observation.value, 0) / 4;
  const value = (meanClaims / latestPayroll.value) * 1000;
  const historyPoints = Math.min(claimsData.points.length, payrollData.points.length * 4);
  return result(value, anchors, "claims per 1,000 employed", [...latestClaims, latestPayroll], historyPoints, historyPoints / 52);
}

export function transformCreditStandards(
  series: CoreObservationSeriesResult | null | undefined,
  identifier: string,
): CoreTransformResult {
  const expectation: SeriesExpectation = {
    sourceId: "federal-reserve-sloos",
    identifier,
    unit: "percent net",
    seasonalBasis: "Not seasonally adjusted",
    cadence: "quarterly",
  };
  const validated = validateSeries(series, expectation);
  if (!validated) return unavailable("The SLOOS series, borrower size, units, basis, or survey-period continuity did not match.", "percent net");
  const { observations, points } = validated;
  if (points.length < 4 || points.some((value) => value < -100 || value > 100)) return missingHistory("percent net");
  const latest = points.at(-1)!;
  const mean4 = points.slice(-4).reduce((sum, value) => sum + value, 0) / 4;
  const latestScore = interpolateStress(latest, CORE_SCORE_ANCHORS.creditStandards);
  const meanScore = interpolateStress(mean4, CORE_SCORE_ANCHORS.creditStandards);
  if (latestScore === null || meanScore === null) return unavailable("SLOOS values could not be interpolated against the approved anchors.", "percent net");
  const metric = result(latest, CORE_SCORE_ANCHORS.creditStandards, "percent net", observations.slice(-4), 4, 1);
  return { ...metric, score: 0.6 * latestScore + 0.4 * meanScore };
}

export function transformCreditVolume(
  series: CoreObservationSeriesResult | null | undefined,
): CoreTransformResult {
  const expectation: SeriesExpectation = {
    sourceId: "federal-reserve-h8",
    identifier: "H8/H8/B1020NCBA",
    unit: "billions USD",
    seasonalBasis: "SA",
    cadence: "weekly",
  };
  if (series?.eligibilityBlockReason) return unavailable(series.eligibilityBlockReason, "percent annualized");
  const validated = validateSeries(series, expectation);
  if (!validated) return unavailable("The H.8 series, units, seasonal basis, or weekly continuity did not match.", "percent annualized");
  const { observations, points } = validated;
  if (points.length < 17 || points.some((value) => value <= 0)) return missingHistory("percent annualized");
  const currentMean = points.slice(-4).reduce((sum, value) => sum + value, 0) / 4;
  const priorMean = points.slice(-17, -13).reduce((sum, value) => sum + value, 0) / 4;
  if (priorMean <= 0) return unavailable("The H.8 comparison-period loan balance was not positive.", "percent annualized");
  const value = 100 * ((currentMean / priorMean) ** 4 - 1);
  return result(value, CORE_SCORE_ANCHORS.creditVolume, "percent annualized", observations.slice(-17), 17, 17 / 52);
}

export function transformLiquidityProxy(
  fedAssets: CoreObservationSeriesResult | null | undefined,
  treasuryAccount: CoreObservationSeriesResult | null | undefined,
  reverseRepoOthers: CoreObservationSeriesResult | null | undefined,
): CoreTransformResult {
  const specs: SeriesExpectation[] = [
    { sourceId: "federal-reserve-h41-liquidity", identifier: "H.4.1 Table 1 / Total assets / weekly average", unit: "millions USD", seasonalBasis: "weekly average", cadence: "weekly" },
    { sourceId: "federal-reserve-h41-liquidity", identifier: "H.4.1 Table 1 / U.S. Treasury, General Account / weekly average", unit: "millions USD", seasonalBasis: "weekly average", cadence: "weekly" },
    { sourceId: "federal-reserve-h41-liquidity", identifier: "H.4.1 Table 1 / Reverse repurchase agreements: Others / weekly average", unit: "millions USD", seasonalBasis: "weekly average", cadence: "weekly" },
  ];
  const inputs = [fedAssets, treasuryAccount, reverseRepoOthers];
  const validated = inputs.map((input, index) => validateSeries(input, specs[index]));
  if (validated.some((item) => item === null)) return unavailable("H.4.1 total assets, TGA, and RRP Others must be available with the same weekly-average basis.", "percent change over 13 weeks");
  const [assets, tga, rrp] = validated as [ValidatedSeries, ValidatedSeries, ValidatedSeries];
  if (assets.observations.length < 14 || assets.observations.length !== tga.observations.length || assets.observations.length !== rrp.observations.length) {
    return missingHistory("percent change over 13 weeks");
  }
  const sameWeeks = assets.observations.every((item, index) =>
    item.observedAt === tga.observations[index].observedAt && item.observedAt === rrp.observations[index].observedAt);
  if (!sameWeeks) return unavailable("H.4.1 weekly-average components did not share the exact same observation weeks.", "percent change over 13 weeks");
  const liquidity = assets.points.map((value, index) => value - tga.points[index] - rrp.points[index]);
  const latest = liquidity.at(-1)!;
  const prior = liquidity.at(-14)!;
  if (liquidity.some((value) => value <= 0) || prior <= 0) return unavailable("The H.4.1 balance-sheet proxy or its 13-week comparison was not positive.", "percent change over 13 weeks");
  const change = 100 * (latest / prior - 1);
  return result(change, CORE_SCORE_ANCHORS.liquidityBalance, "percent change over 13 weeks", [
    ...assets.observations.slice(-14), ...tga.observations.slice(-14), ...rrp.observations.slice(-14),
  ], 14, 14 / 52);
}

export function transformRealM2(
  m2: CoreObservationSeriesResult | null | undefined,
  headlinePce: CoreObservationSeriesResult | null | undefined,
): CoreTransformResult {
  const m2Data = validateSeries(m2, REAL_M2_EXPECTATION);
  const pceData = validateSeries(headlinePce, HEADLINE_PCE_EXPECTATION);
  if (!m2Data || !pceData) return unavailable("Real M2 requires the approved monthly SA M2.M and matched BEA headline-PCE index series.", "percent annualized");

  const pceByMonth = new Map(pceData.observations.map((item) => [item.observedAt, item]));
  const matched = m2Data.observations.flatMap((m2Observation) => {
    const pceObservation = pceByMonth.get(m2Observation.observedAt);
    return pceObservation ? [{ m2Observation, pceObservation, ratio: m2Observation.value / pceObservation.value }] : [];
  });
  if (matched.length < 6 || matched.slice(-6).some(({ m2Observation, pceObservation }) =>
    m2Observation.value <= 0 || pceObservation.value <= 0)) return missingHistory("percent annualized");
  const lastSix = matched.slice(-6);
  const monthSerial = (date: string) => Number(date.slice(0, 4)) * 12 + Number(date.slice(5, 7));
  if (lastSix.some((item, index) => index > 0 && monthSerial(item.m2Observation.observedAt) !== monthSerial(lastSix[index - 1].m2Observation.observedAt) + 1)) {
    return unavailable("Real-M2 inputs did not contain six matched consecutive months.", "percent annualized");
  }
  const mean = (start: number) => lastSix.slice(start, start + 3).reduce((sum, item) => sum + item.ratio, 0) / 3;
  const priorMean = mean(0);
  const currentMean = mean(3);
  if (priorMean <= 0) return unavailable("The matched real-M2 comparison period was not positive.", "percent annualized");
  const value = 100 * ((currentMean / priorMean) ** 4 - 1);
  const sourceObservations = lastSix.flatMap(({ m2Observation, pceObservation }) => [m2Observation, pceObservation]);
  return result(value, CORE_SCORE_ANCHORS.realM2, "percent annualized", sourceObservations, 6, 0.5);
}
