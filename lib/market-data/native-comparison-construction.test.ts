import { describe, expect, it } from "vitest";
import { evaluateRegime } from "@/lib/regime";
import type { RegimeFactorKey, RegimeInputs } from "@/lib/types";
import {
  comparisonCutoffs,
  compareStressSlots,
  constructPolicyComparison,
  countWorseningMomenta,
  selectReferencePair,
  subtractScoreBounds,
  type ComparisonIdentity,
  type ComparisonSeries,
  type ComparisonSlot,
  type StressComparison,
} from "./native-comparison-construction";

// Synthetic verified-evidence fixtures, not reconstructed official release vintages.
const C1 = "2026-10-18T12:00:00.000Z";
const C0 = "2026-07-18T12:00:00.000Z";
const monthly: ComparisonIdentity = {
  sourceId: "bls-labor", identifier: "CES0000000001", unit: "thousand persons",
  seasonalBasis: "SA", cadence: "monthly", transformId: "payroll-g3-stress", outputUnit: "stress points",
};
const target: ComparisonIdentity = {
  sourceId: "federal-reserve-policy-actions", identifier: "FOMC target range/action history",
  unit: "percent", seasonalBasis: "Not seasonally adjusted", cadence: "daily", transformId: "target-midpoint", outputUnit: "percent",
};
const pce: ComparisonIdentity = {
  sourceId: "bea-pce-income", identifier: "T20804-M / DPCCRG", unit: "index (2017=100)",
  seasonalBasis: "SA", cadence: "monthly", transformId: "index-level", outputUnit: "index (2017=100)",
};

function series(identity = monthly, points: Array<[string, number]> = [["2026-08-01", 55]], knownAt = C1): ComparisonSeries {
  return {
    identity: { ...identity }, eligible: true,
    observations: points.map(([observedAt, value]) => ({
      observedAt, value,
      evidence: {
        versionId: `synthetic:${knownAt}`, provenanceId: "synthetic-verified-record",
        availability: { kind: "ARCHIVED_RETRIEVAL", earliest: knownAt, latest: knownAt },
        dependencyIds: [`${identity.sourceId}:${identity.identifier}:${observedAt}`],
      },
    })),
  };
}

function slot(key: string, family: string, weight: number, current = 55, prior = 30): ComparisonSlot {
  const expected = { ...monthly, identifier: `synthetic-slot:${key}` };
  return {
    key, family, weight, expected,
    current: series(expected, [["2026-08-01", current]]),
    prior: series(expected, [["2026-05-01", prior], ["2026-06-01", 60]], C0),
  };
}

function policyEndpoints(): { current: { target: ComparisonSeries | null; pce: ComparisonSeries | null }; prior: { target: ComparisonSeries | null; pce: ComparisonSeries | null } } {
  return {
    current: { target: series(target, [["2026-09-17", 4]]), pce: series(pce, [["2025-08-01", 100], ["2026-08-01", 102]]) },
    prior: { target: series(target, [["2026-06-17", 4.5]], C0), pce: series(pce, [["2025-05-01", 100], ["2026-05-01", 103.3]], C0) },
  };
}

const factors: RegimeFactorKey[] = ["inflation", "growth", "labor", "policyRates", "creditConditions", "liquidityProxy"];
function comparison(lower: number, upper = lower): StressComparison {
  return {
    scoreChange: lower === upper ? lower : null, bounds: { lower, upper },
    commonEligibleWeight: 1, commonEligibleFamilies: 2, slots: [], reason: null,
    cutoffs: { current: C1, prior: C0 },
  };
}
function allComparisons(change = 0): Record<RegimeFactorKey, StressComparison | null> {
  return Object.fromEntries(factors.map((factor) => [factor, comparison(change)])) as Record<RegimeFactorKey, StressComparison | null>;
}

describe("approved pure knowledge and reference endpoints", () => {
  it.each([
    [C1, C0], ["2026-05-31T12:34:56.123Z", "2026-02-28T12:34:56.123Z"],
    ["2024-05-31T12:34:56.123Z", "2024-02-29T12:34:56.123Z"],
    ["2026-01-31T12:00:00.000Z", "2025-10-31T12:00:00.000Z"],
    ["2026-10-18T19:00:00+07:00", C0],
  ])("uses exact UTC calendar subtraction for %s", (current, prior) => {
    expect(comparisonCutoffs(current)).toEqual({ current: new Date(current).toISOString(), prior });
  });

  it.each(["2026-10-18", "2026-02-30T12:00:00Z", "not-a-time", "2026-10-18T12:00:00"]) (
    "does not invent an instant for %s", (cutoff) => expect(comparisonCutoffs(cutoff)).toBeNull(),
  );

  it("uses August/May, not preceding June, for a lagged monthly slot", () => {
    const pair = selectReferencePair(slot("payroll", "payroll", 1), C1);
    expect(pair?.current.observedAt).toBe("2026-08-01");
    expect(pair?.prior.observedAt).toBe("2026-05-01");
    expect(pair?.prior.value).toBe(30);
  });

  it.each([
    ["weekly", "2026-10-03", "2026-07-04", "2026-07-11"],
    ["quarterly", "2026-07-01", "2026-04-01", "2026-01-01"],
  ] as const)("selects the frozen %s horizon", (cadence, current, prior, distractor) => {
    const expected = { ...monthly, cadence };
    const input = { ...slot("x", "x", 1), expected, current: series(expected, [[current, 55]]), prior: series(expected, [[prior, 30], [distractor, 60]].sort(([a], [b]) => String(a).localeCompare(String(b))) as Array<[string, number]>, C0) };
    expect(selectReferencePair(input, C1)?.prior.observedAt).toBe(prior);
  });

  it("does not skip a missing exact October 2025 endpoint", () => {
    const input = slot("x", "x", 1);
    input.current = series(input.expected, [["2026-01-01", 55]], "2026-02-18T12:00:00Z");
    input.prior = series(input.expected, [["2025-09-01", 30], ["2025-11-01", 40]], "2025-11-18T12:00:00Z");
    expect(selectReferencePair(input, "2026-02-18T12:00:00Z")).toBeNull();
  });

  it("does not reject an unrelated gap between already verified transformed endpoints", () => {
    const input = slot("x", "x", 1);
    input.current = series(input.expected, [["2026-01-01", 10], ["2026-03-01", 55]], "2026-04-18T12:00:00Z");
    input.prior = series(input.expected, [["2025-12-01", 30]], "2026-01-18T12:00:00Z");
    expect(selectReferencePair(input, "2026-04-18T12:00:00Z")?.prior.value).toBe(30);
  });

  it.each(["late", "date-only", "missing-provenance", "missing-version", "reversed-interval", "identity", "unit", "duplicate", "out-of-order", "nonfinite", "withdrawn"])(
    "withholds %s endpoint evidence", (failure) => {
      const input = slot("x", "x", 1);
      const point = input.prior!.observations[0];
      if (failure === "late") point.evidence.availability = { kind: "ARCHIVED_RETRIEVAL", earliest: C1, latest: C1 };
      if (failure === "date-only") point.evidence.availability = { kind: "PUBLICATION_INTERVAL", earliest: "2026-07-18", latest: "2026-07-18" };
      if (failure === "missing-provenance") point.evidence.provenanceId = null;
      if (failure === "missing-version") point.evidence.versionId = null;
      if (failure === "reversed-interval") point.evidence.availability = { kind: "PUBLICATION_INTERVAL", earliest: C1, latest: C0 };
      if (failure === "identity") input.prior!.identity.identifier = "wrong-series";
      if (failure === "unit") input.prior!.identity.unit = "persons";
      if (failure === "duplicate") input.prior!.observations.push(structuredClone(point));
      if (failure === "out-of-order") input.prior!.observations.reverse();
      if (failure === "nonfinite") point.value = NaN;
      if (failure === "withdrawn") input.prior!.eligible = false;
      expect(selectReferencePair(input, C1)).toBeNull();
    },
  );

  it("accepts a verified publication interval only when its upper bound is by C0", () => {
    const input = slot("x", "x", 1);
    const proof = input.prior!.observations[0].evidence;
    proof.availability = { kind: "PUBLICATION_INTERVAL", earliest: "2026-07-17T04:00:00Z", latest: C0 };
    expect(selectReferencePair(input, C1)?.prior.value).toBe(30);
    proof.availability.latest = "2026-07-18T12:00:00.001Z";
    expect(selectReferencePair(input, C1)).toBeNull();
  });

  it("does not treat later-retrieved revised values as the version known at C0", () => {
    const old = slot("x", "x", 1);
    const revised = structuredClone(old);
    revised.prior!.observations[0].value = 80;
    revised.prior!.observations[0].evidence.versionId = "new-revision";
    revised.prior!.observations[0].evidence.availability = { kind: "ARCHIVED_RETRIEVAL", earliest: C1, latest: C1 };
    expect(selectReferencePair(old, C1)?.prior.value).toBe(30);
    expect(selectReferencePair(revised, C1)).toBeNull();
  });

  it("selects the latest known monthly endpoint when a newer initial release is proved future", () => {
    const input = slot("x", "one", 1);
    const later = series(input.expected, [["2026-09-01", 80]], "2026-11-01T12:00:00Z").observations[0];
    Object.assign(later.evidence.availability!, { kind: "PUBLICATION_INTERVAL", initialRelease: true });
    input.current!.observations.push(later);
    expect(selectReferencePair(input, C1)?.current.observedAt).toBe("2026-08-01");
    expect(selectReferencePair(input, C1)?.prior.observedAt).toBe("2026-05-01");
    Object.assign(later.evidence.availability!, { initialRelease: false });
    expect(selectReferencePair(input, C1)).toBeNull();
  });
});

describe("real-policy comparison, not Treasury financing momentum", () => {
  it("finds rising real restriction despite a nominal cut and an unchanged financing yield", () => {
    const endpoints = policyEndpoints();
    const result = constructPolicyComparison(endpoints, C1);
    expect(result.deltaR).toBeCloseTo(0.8, 10);
    expect(result.realPolicyRate).toBeCloseTo(2, 10);
    expect(result.priorRealPolicyRate).toBeCloseTo(1.2, 10);
    expect(result.deltaTarget).toBe(-0.5);
  });

  it("does not accept Treasury TC_10YEAR as real-policy evidence", () => {
    const input = policyEndpoints();
    input.prior.target = series({ ...target, sourceId: "treasury-real-yield", identifier: "TC_10YEAR" }, [["2026-06-17", 4.5]], C0);
    expect(constructPolicyComparison(input, C1).deltaR).toBeNull();
  });

  it("keeps nominal deltaTarget independent of missing CPI/PCE", () => {
    const input = policyEndpoints();
    input.prior.pce = null;
    expect(constructPolicyComparison(input, C1)).toMatchObject({ deltaR: null, deltaTarget: -0.5 });
  });

  it("ignores a future effective action rather than using the last array row", () => {
    const input = policyEndpoints();
    input.prior.target!.observations.push(...series(target, [["2026-07-20", 3]], C0).observations);
    expect(constructPolicyComparison(input, C1).deltaTarget).toBe(-0.5);
  });

  it("keeps May as the latest eligible prior PCE when June's initial release is July 30", () => {
    const input = policyEndpoints();
    const june = series(pce, [["2026-06-01", 104]], "2026-07-30T12:00:00Z").observations[0];
    Object.assign(june.evidence.availability!, { kind: "PUBLICATION_INTERVAL", initialRelease: true });
    input.prior.pce!.observations.push(june);
    expect(constructPolicyComparison(input, C1).deltaR).toBeCloseTo(0.8, 10);
    expect(constructPolicyComparison(input, C1).priorEvidence?.pceCurrent?.observedAt).toBe("2026-05-01");
  });

  it.each(["ambiguous", "retrieval-only", "revision"])("does not skip a newer PCE period with %s evidence", (kind) => {
    const input = policyEndpoints();
    const june = series(pce, [["2026-06-01", 104]], "2026-07-30T12:00:00Z").observations[0];
    if (kind === "ambiguous") Object.assign(june.evidence.availability!, { kind: "PUBLICATION_INTERVAL", earliest: "2026-07-17T12:00:00Z", initialRelease: true });
    if (kind === "revision") Object.assign(june.evidence.availability!, { kind: "PUBLICATION_INTERVAL", initialRelease: false });
    input.prior.pce!.observations.push(june);
    expect(constructPolicyComparison(input, C1).deltaR).toBeNull();
  });

  it.each(["missing-year-endpoint", "nonpositive-index", "late-target", "late-pce", "wrong-basis"])(
    "withholds real-policy change for %s", (failure) => {
      const input = policyEndpoints();
      if (failure === "missing-year-endpoint") input.prior.pce!.observations.shift();
      if (failure === "nonpositive-index") input.prior.pce!.observations[0].value = 0;
      if (failure === "late-target") input.prior.target!.observations[0].evidence.availability = { kind: "ARCHIVED_RETRIEVAL", earliest: C1, latest: C1 };
      if (failure === "late-pce") input.prior.pce!.observations[0].evidence.availability = null;
      if (failure === "wrong-basis") input.prior.pce!.identity.seasonalBasis = "NSA";
      expect(constructPolicyComparison(input, C1).deltaR).toBeNull();
    },
  );
});

describe("common primary slots and fixed missing-contribution bounds", () => {
  it("uses the three-month endpoint rather than a previous-month -5 shortcut", () => {
    const result = compareStressSlots([slot("a", "one", 0.5), slot("b", "two", 0.5)], C1);
    expect(result.scoreChange).toBe(25);
    expect(result.bounds).toEqual({ lower: 25, upper: 25 });
    expect(result.commonEligibleFamilies).toBe(2);
  });

  it("retains fixed missing contributions without a manufactured scalar", () => {
    const result = compareStressSlots([slot("a", "one", 0.4, 50, 40), slot("b", "two", 0.3, 50, 40), { ...slot("c", "three", 0.3), current: null, prior: null }], C1);
    expect(result.commonEligibleWeight).toBeCloseTo(0.7);
    expect(result.bounds?.lower).toBeCloseTo(-23);
    expect(result.bounds?.upper).toBeCloseTo(37);
    expect(result.scoreChange).toBeNull();
  });

  it("counts primary-slot overlap rather than an entire matching family", () => {
    const result = compareStressSlots([slot("a", "one", 0.3), { ...slot("b", "one", 0.3), prior: null }, slot("c", "two", 0.4)], C1);
    expect(result.commonEligibleWeight).toBeCloseTo(0.7);
    expect(result.commonEligibleFamilies).toBe(2);
    expect(result.scoreChange).toBeNull();
  });

  it.each([[0.5999, false], [0.6, true]] as const)("enforces the common-weight floor at %s", (weight, usable) => {
    const result = compareStressSlots([slot("a", "one", weight / 2), slot("b", "two", weight / 2), { ...slot("c", "three", 1 - weight), current: null, prior: null }], C1);
    expect(result.bounds !== null).toBe(usable);
  });

  it("does not qualify one common family or silently reweight an incomplete definition", () => {
    expect(compareStressSlots([slot("a", "one", 1)], C1).bounds).toBeNull();
    expect(compareStressSlots([slot("a", "one", 0.3), slot("b", "two", 0.3)], C1).bounds).toBeNull();
  });

  it("does not turn source withdrawal into definite improvement", () => {
    const result = compareStressSlots([slot("a", "one", 0.4, 30, 30), slot("b", "two", 0.3, 30, 30), { ...slot("c", "three", 0.3, 90, 90), current: null }], C1);
    expect(result.scoreChange).toBeNull();
    expect(result.bounds!.lower).toBeLessThanOrEqual(0);
    expect(result.bounds!.upper).toBeGreaterThanOrEqual(0);
  });

  it("preserves dependency identities and does not mutate supplied evidence", () => {
    const input = [slot("a", "one", 0.5), slot("b", "two", 0.5)];
    const before = structuredClone(input);
    const result = compareStressSlots(input, C1);
    expect(result.slots[0].current?.evidence.dependencyIds).toEqual(input[0].current!.observations[0].evidence.dependencyIds);
    expect(input).toEqual(before);
  });

  it("retains the comparison clock and fixed slot definitions in the evidence manifest", () => {
    const result = compareStressSlots([slot("a", "one", 0.5), slot("b", "two", 0.5)], C1);
    expect(result).toMatchObject({ cutoffs: { current: C1, prior: C0 }, slots: [
      { key: "a", family: "one", weight: 0.5, expected: { identifier: "synthetic-slot:a", transformId: "payroll-g3-stress" } },
      { key: "b", family: "two", weight: 0.5 },
    ] });
  });

  it("computes the frozen outer bound difference, not a midpoint or a native pp value", () => {
    expect(subtractScoreBounds({ lower: 5, upper: 25 }, { lower: 10, upper: 30 })).toEqual({ lower: -25, upper: 15 });
    expect(subtractScoreBounds({ lower: 30, upper: 10 }, { lower: 0, upper: 10 })).toBeNull();
  });
});

describe("six-factor worsening counts and threshold proofs", () => {
  it.each([[7.999, "FALSE"], [8, "TRUE"], [8.001, "TRUE"]] as const)("does not round the adverse threshold %s", (value, verdict) => {
    const input = allComparisons();
    input.growth = comparison(value);
    expect(countWorseningMomenta(input, C1).predicates.growth).toBe(verdict);
  });

  it("proves fewer than three with a non-exact [0,2] count, without a numeric substitute", () => {
    const input = allComparisons();
    input.creditConditions = null;
    input.liquidityProxy = null;
    expect(countWorseningMomenta(input, C1)).toMatchObject({ worseningMomenta: null, bounds: { lower: 0, upper: 2 }, fewerThanThree: "TRUE" });
  });

  it("keeps [2,3] UNKNOWN and proves [3,5] false", () => {
    const input = allComparisons();
    input.inflation = comparison(8); input.growth = comparison(20); input.labor = comparison(7, 9);
    expect(countWorseningMomenta(input, C1)).toMatchObject({ worseningMomenta: null, bounds: { lower: 2, upper: 3 }, fewerThanThree: "UNKNOWN" });
    input.labor = comparison(8); input.creditConditions = null; input.liquidityProxy = null;
    expect(countWorseningMomenta(input, C1)).toMatchObject({ worseningMomenta: null, bounds: { lower: 3, upper: 5 }, fewerThanThree: "FALSE" });
  });

  it("returns an exact integer only for a fully determined count", () => {
    const input = allComparisons();
    input.inflation = comparison(8); input.growth = comparison(20);
    expect(countWorseningMomenta(input, C1).worseningMomenta).toBe(2);
    input.labor = comparison(8);
    expect(countWorseningMomenta(input, C1).fewerThanThree).toBe("FALSE");
  });

  it("does not treat missing, invalid or ineligible factor evidence as zero", () => {
    expect(countWorseningMomenta({}, C1)).toMatchObject({ worseningMomenta: null, bounds: { lower: 0, upper: 6 }, fewerThanThree: "UNKNOWN" });
    const input = allComparisons();
    input.labor!.commonEligibleFamilies = 1;
    input.creditConditions!.bounds = { lower: NaN, upper: 0 };
    expect(countWorseningMomenta(input, C1).bounds).toEqual({ lower: 0, upper: 2 });
  });

  it("does not combine factor evidence from different evaluated cutoffs", () => {
    const input = allComparisons();
    Object.assign(input.growth!, { cutoffs: { current: "2026-11-18T12:00:00.000Z", prior: "2026-08-18T12:00:00.000Z" } });
    expect(countWorseningMomenta(input, C1)).toMatchObject({ worseningMomenta: null, bounds: { lower: 0, upper: 1 } });
    Object.assign(input.labor!, { cutoffs: null });
    expect(countWorseningMomenta(input, C1).bounds).toEqual({ lower: 0, upper: 2 });
  });
});

it("leaves complete frozen economic/regime inputs unchanged; no live adapter is activated", () => {
  const inputs: RegimeInputs = {
    factors: Object.fromEntries(factors.map((key) => [key, { bounds: { lower: 30, upper: 30 }, coverage: 1, eligibleFamilies: 2, historyYears: 10, releaseQuality: 1 }])) as RegimeInputs["factors"],
    native: { deltaPi: 0, realPolicyRate: 1, deltaR: 0, deltaTarget: 0, deltaP: 0, worseningMomenta: 0 },
    qualitySlots: [{ weight: 1, eligible: true, freshness: 1, history: 1, release: 1, fetchHealth: 1 }],
  };
  const before = structuredClone(inputs);
  const assessment = evaluateRegime(inputs);
  constructPolicyComparison(policyEndpoints(), C1);
  compareStressSlots([slot("a", "one", 0.5), slot("b", "two", 0.5)], C1);
  countWorseningMomenta(allComparisons(), C1);
  expect(inputs).toEqual(before);
  expect(evaluateRegime(inputs)).toEqual(assessment);
  expect(assessment).toMatchObject({ assessmentStatus: "NORMAL", regime: "GOLDILOCKS", dataQuality: 100 });
});
