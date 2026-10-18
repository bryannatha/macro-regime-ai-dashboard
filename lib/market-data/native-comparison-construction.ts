import type { GateResult, RegimeFactorKey, ScoreBounds } from "@/lib/types";
import type { SeriesExpectation } from "./types";

export interface ComparisonIdentity extends SeriesExpectation {
  transformId: string;
  outputUnit: string;
}

export interface ComparisonObservation {
  observedAt: string;
  value: number;
  evidence: {
    versionId: string | null;
    provenanceId: string | null;
    availability: {
      kind: "ARCHIVED_RETRIEVAL" | "PUBLICATION_INTERVAL";
      earliest: string;
      latest: string;
      initialRelease?: boolean;
    } | null;
    dependencyIds: string[];
  };
}

export interface ComparisonSeries {
  identity: ComparisonIdentity;
  eligible: boolean;
  observations: ComparisonObservation[];
}

export interface ComparisonSlot {
  key: string;
  family: string;
  weight: number;
  expected: ComparisonIdentity;
  current: ComparisonSeries | null;
  prior: ComparisonSeries | null;
}

export interface SlotComparisonEvidence {
  key: string;
  family: string;
  weight: number;
  expected: ComparisonIdentity;
  current: ComparisonObservation | null;
  prior: ComparisonObservation | null;
}

export interface StressComparison {
  scoreChange: number | null;
  bounds: ScoreBounds | null;
  commonEligibleWeight: number;
  commonEligibleFamilies: number;
  slots: SlotComparisonEvidence[];
  reason: string | null;
  cutoffs: { current: string; prior: string } | null;
}

export interface PolicyEndpoint {
  target: ComparisonSeries | null;
  pce: ComparisonSeries | null;
}

const FACTORS: readonly RegimeFactorKey[] = ["inflation", "growth", "labor", "policyRates", "creditConditions", "liquidityProxy"];
const IDENTITY_KEYS = ["sourceId", "identifier", "unit", "seasonalBasis", "cadence", "transformId", "outputUnit"] as const;
const TARGET: ComparisonIdentity = {
  sourceId: "federal-reserve-policy-actions", identifier: "FOMC target range/action history",
  unit: "percent", seasonalBasis: "Not seasonally adjusted", cadence: "daily", transformId: "target-midpoint", outputUnit: "percent",
};
const CORE_PCE: ComparisonIdentity = {
  sourceId: "bea-pce-income", identifier: "T20804-M / DPCCRG", unit: "index (2017=100)",
  seasonalBasis: "SA", cadence: "monthly", transformId: "index-level", outputUnit: "index (2017=100)",
};

function dateLabel(value: string): number | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const time = Date.parse(`${value}T00:00:00.000Z`);
  return Number.isFinite(time) && new Date(time).toISOString().slice(0, 10) === value ? time : null;
}

function instant(value: string): number | null {
  if (!/^\d{4}-\d{2}-\d{2}T(?:[01]\d|2[0-3]):[0-5]\d:[0-5]\d(?:\.\d{1,3})?(?:Z|[+-](?:[01]\d|2[0-3]):[0-5]\d)$/.test(value) ||
      dateLabel(value.slice(0, 10)) === null) return null;
  const time = Date.parse(value);
  return Number.isFinite(time) ? time : null;
}

export function comparisonCutoffs(current: string): { current: string; prior: string } | null {
  const time = instant(current);
  if (time === null) return null;
  const prior = new Date(time);
  const day = prior.getUTCDate();
  prior.setUTCDate(1);
  prior.setUTCMonth(prior.getUTCMonth() - 3);
  const lastDay = new Date(prior);
  lastDay.setUTCMonth(lastDay.getUTCMonth() + 1, 0);
  prior.setUTCDate(Math.min(day, lastDay.getUTCDate()));
  if (prior.getUTCFullYear() < 0 || prior.getUTCFullYear() > 9999) return null;
  return { current: new Date(time).toISOString(), prior: prior.toISOString() };
}

function availabilityAt(point: ComparisonObservation, cutoff: string): "KNOWN" | "NOT_YET_RELEASED" | "UNKNOWN" {
  const { evidence } = point;
  if (!evidence?.versionId?.trim() || !evidence.provenanceId?.trim() ||
      !evidence.dependencyIds?.length || evidence.dependencyIds.some((id) => !id.trim()) ||
      new Set(evidence.dependencyIds).size !== evidence.dependencyIds.length || !evidence.availability) return "UNKNOWN";
  const { kind, earliest, latest } = evidence.availability;
  const start = instant(earliest);
  const end = instant(latest);
  const limit = instant(cutoff);
  if (start === null || end === null || limit === null || start > end ||
      !(kind === "PUBLICATION_INTERVAL" || kind === "ARCHIVED_RETRIEVAL" && start === end)) return "UNKNOWN";
  if (end <= limit) return "KNOWN";
  // A late retrieval/revision does not establish that the reference period itself was unreleased.
  return kind === "PUBLICATION_INTERVAL" && evidence.availability.initialRelease === true && start > limit
    ? "NOT_YET_RELEASED" : "UNKNOWN";
}

function knownBy(point: ComparisonObservation, cutoff: string): boolean {
  return availabilityAt(point, cutoff) === "KNOWN";
}

function observations(series: ComparisonSeries | null, expected: ComparisonIdentity): ComparisonObservation[] | null {
  if (!series?.eligible || !series.observations.length ||
      IDENTITY_KEYS.some((key) => !expected[key]?.trim() || series.identity[key] !== expected[key])) return null;
  let previous = -Infinity;
  for (const point of series.observations) {
    const time = dateLabel(point.observedAt);
    const month = Number(point.observedAt.slice(5, 7));
    if (time === null || time <= previous || !Number.isFinite(point.value) ||
        (expected.cadence === "monthly" || expected.cadence === "quarterly") && !point.observedAt.endsWith("-01") ||
        expected.cadence === "quarterly" && ![1, 4, 7, 10].includes(month)) return null;
    previous = time;
  }
  return series.observations;
}

function latestKnown(rows: ComparisonObservation[] | null, cutoff: string): ComparisonObservation | null {
  if (!rows) return null;
  for (let index = rows.length - 1; index >= 0; index -= 1) {
    const point = rows[index];
    if (point.observedAt > cutoff.slice(0, 10)) continue;
    const availability = availabilityAt(point, cutoff);
    if (availability === "KNOWN") return point;
    if (availability === "UNKNOWN") return null;
  }
  return null;
}

function priorReference(observedAt: string, cadence: ComparisonIdentity["cadence"]): string | null {
  const time = dateLabel(observedAt);
  if (time === null || cadence === "daily") return null;
  const date = new Date(time);
  if (cadence === "weekly") date.setUTCDate(date.getUTCDate() - 91);
  else if (cadence === "monthly" || cadence === "quarterly") date.setUTCMonth(date.getUTCMonth() - 3);
  else return null;
  return date.toISOString().slice(0, 10);
}

function slotEndpoints(slot: ComparisonSlot, cutoffs: { current: string; prior: string }): SlotComparisonEvidence {
  const currentRows = observations(slot.current, slot.expected);
  const current = latestKnown(currentRows, cutoffs.current);
  const reference = current ? priorReference(current.observedAt, slot.expected.cadence) : null;
  const priorRows = observations(slot.prior, slot.expected);
  const previous = reference ? priorRows?.find((point) => point.observedAt === reference) : null;
  const prior = previous && previous.observedAt <= cutoffs.prior.slice(0, 10) && knownBy(previous, cutoffs.prior) ? previous : null;
  return { key: slot.key, family: slot.family, weight: slot.weight, expected: { ...slot.expected }, current, prior };
}

/** Inputs are supplied validated transforms; this does not validate raw transform windows or admit sources. */
export function selectReferencePair(slot: ComparisonSlot, current: string): { current: ComparisonObservation; prior: ComparisonObservation } | null {
  const cutoffs = comparisonCutoffs(current);
  if (!cutoffs || slot.expected.cadence === "daily") return null;
  const pair = slotEndpoints(slot, cutoffs);
  return pair.current && pair.prior ? { current: pair.current, prior: pair.prior } : null;
}

function policyEndpoint(endpoint: PolicyEndpoint, cutoff: string) {
  const actionRows = observations(endpoint.target, TARGET);
  const action = latestKnown(actionRows, cutoff);
  const target = action && knownBy(action, cutoff) && action.value >= 0 && action.value <= 25 ? action : null;
  const pceRows = observations(endpoint.pce, CORE_PCE);
  const latest = latestKnown(pceRows, cutoff);
  const yearEarlier = latest ? `${Number(latest.observedAt.slice(0, 4)) - 1}-${latest.observedAt.slice(5)}` : null;
  const earlier = pceRows?.find((point) => point.observedAt === yearEarlier);
  const pceValid = pceRows && pceRows.every((point) => point.value > 0) && latest && earlier &&
    knownBy(latest, cutoff) && knownBy(earlier, cutoff);
  const realPolicyRate = target && pceValid ? target.value - 100 * (latest.value / earlier.value - 1) : null;
  return {
    target, pceCurrent: pceValid ? latest : null, pceYearEarlier: pceValid ? earlier : null,
    realPolicyRate: realPolicyRate !== null && Number.isFinite(realPolicyRate) ? realPolicyRate : null,
  };
}

export function constructPolicyComparison(endpoints: { current: PolicyEndpoint; prior: PolicyEndpoint }, current: string) {
  const cutoffs = comparisonCutoffs(current);
  const currentEvidence = cutoffs ? policyEndpoint(endpoints.current, cutoffs.current) : null;
  const priorEvidence = cutoffs ? policyEndpoint(endpoints.prior, cutoffs.prior) : null;
  const realPolicyRate = currentEvidence?.realPolicyRate ?? null;
  const priorRealPolicyRate = priorEvidence?.realPolicyRate ?? null;
  return {
    realPolicyRate, priorRealPolicyRate,
    deltaR: realPolicyRate !== null && priorRealPolicyRate !== null ? realPolicyRate - priorRealPolicyRate : null,
    deltaTarget: currentEvidence?.target && priorEvidence?.target ? currentEvidence.target.value - priorEvidence.target.value : null,
    cutoffs, currentEvidence, priorEvidence,
  };
}

function validBounds(bounds: ScoreBounds | null, lower: number, upper: number): bounds is ScoreBounds {
  return !!bounds && Number.isFinite(bounds.lower) && Number.isFinite(bounds.upper) &&
    bounds.lower >= lower && bounds.upper <= upper && bounds.lower <= bounds.upper;
}

export function subtractScoreBounds(current: ScoreBounds, prior: ScoreBounds): ScoreBounds | null {
  return validBounds(current, 0, 100) && validBounds(prior, 0, 100)
    ? { lower: current.lower - prior.upper, upper: current.upper - prior.lower } : null;
}

/** Fixed registered definitions must be supplied by the caller, never inferred from surviving data. */
export function compareStressSlots(slots: readonly ComparisonSlot[], current: string): StressComparison {
  const cutoffs = comparisonCutoffs(current);
  const empty = (reason: string): StressComparison => ({
    scoreChange: null, bounds: null, commonEligibleWeight: 0, commonEligibleFamilies: 0, slots: [], reason, cutoffs,
  });
  if (!cutoffs) return empty("INVALID_KNOWLEDGE_CUTOFF");
  if (!slots.length || slots.some((slot) => !slot.key.trim() || !slot.family.trim() ||
      !Number.isFinite(slot.weight) || slot.weight <= 0 || slot.expected.outputUnit !== "stress points" ||
      !["monthly", "weekly", "quarterly"].includes(slot.expected.cadence)) ||
      new Set(slots.map(({ key }) => key)).size !== slots.length ||
      new Set(slots.map(({ expected }) => IDENTITY_KEYS.map((key) => expected[key]).join("\0"))).size !== slots.length ||
      Math.abs(slots.reduce((sum, slot) => sum + slot.weight, 0) - 1) > 1e-12) return empty("INVALID_FIXED_SLOT_UNIVERSE");

  let commonEligibleWeight = 0;
  const families = new Set<string>();
  const currentBounds = { lower: 0, upper: 0 };
  const priorBounds = { lower: 0, upper: 0 };
  const evidence = slots.map((slot) => {
    const pair = slotEndpoints(slot, cutoffs);
    const usable = (point: ComparisonObservation | null) => point && point.value >= 0 && point.value <= 100 ? point : null;
    pair.current = usable(pair.current);
    pair.prior = usable(pair.prior);
    for (const [point, bounds] of [[pair.current, currentBounds], [pair.prior, priorBounds]] as const) {
      bounds.lower += slot.weight * (point?.value ?? 0);
      bounds.upper += slot.weight * (point?.value ?? 100);
    }
    if (pair.current && pair.prior) {
      commonEligibleWeight += slot.weight;
      families.add(slot.family);
    }
    return pair;
  });
  const qualified = commonEligibleWeight >= 0.6 && families.size >= 2;
  // Bounds remain an outer enclosure; dependency IDs are retained, not assumed independent or solved away.
  for (const bound of [currentBounds, priorBounds]) {
    bound.lower = Math.min(100, Math.max(0, bound.lower));
    bound.upper = Math.min(100, Math.max(0, bound.upper));
  }
  const bounds = qualified ? subtractScoreBounds(currentBounds, priorBounds) : null;
  return {
    scoreChange: bounds && bounds.lower === bounds.upper ? bounds.lower : null,
    bounds, commonEligibleWeight, commonEligibleFamilies: families.size, slots: evidence, cutoffs,
    reason: qualified ? null : "INSUFFICIENT_COMMON_SLOT_EVIDENCE",
  };
}

export function countWorseningMomenta(comparisons: Partial<Record<RegimeFactorKey, StressComparison | null>>, current: string) {
  const cutoffs = comparisonCutoffs(current);
  const predicates = Object.fromEntries(FACTORS.map((key) => {
    const comparison = comparisons[key];
    const bounds = comparison?.bounds ?? null;
    let verdict: GateResult = "UNKNOWN";
    if (cutoffs && comparison?.cutoffs?.current === cutoffs.current && comparison.cutoffs.prior === cutoffs.prior &&
        comparison.reason === null && Number.isFinite(comparison.commonEligibleWeight) &&
        comparison.commonEligibleWeight >= 0.6 && comparison.commonEligibleWeight <= 1 &&
        Number.isInteger(comparison.commonEligibleFamilies) && comparison.commonEligibleFamilies >= 2 &&
        validBounds(bounds, -100, 100) && (comparison.scoreChange === null ||
          bounds.lower === bounds.upper && comparison.scoreChange === bounds.lower)) {
      verdict = bounds.lower >= 8 ? "TRUE" : bounds.upper < 8 ? "FALSE" : "UNKNOWN";
    }
    return [key, verdict];
  })) as Record<RegimeFactorKey, GateResult>;
  const values = Object.values(predicates);
  const lower = values.filter((value) => value === "TRUE").length;
  const upper = lower + values.filter((value) => value === "UNKNOWN").length;
  return {
    worseningMomenta: lower === upper ? lower : null,
    bounds: { lower, upper }, predicates, cutoffs,
    fewerThanThree: (upper < 3 ? "TRUE" : lower >= 3 ? "FALSE" : "UNKNOWN") as GateResult,
  };
}
