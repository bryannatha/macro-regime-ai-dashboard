import type {
  GateResult,
  FactorReadiness,
  InflationDirectionAssessment,
  LeadingDirectionAssessment,
  MacroDirection,
  QualitySlotInput,
  Regime,
  RegimeAssessment,
  RegimeFactorInput,
  RegimeInputs,
  RegimeNativeInputs,
  RegimeSensitivity,
  RegimeTension,
  RuleDiagnostic,
  SourceMomentumInputs,
  TransitionRiskAssessment,
} from "@/lib/types";
import { REGIMES } from "@/lib/types";

export { REGIMES };

export const REGIME_LABELS: Record<Regime, string> = {
  GOLDILOCKS: "Goldilocks",
  INFLATIONARY_EXPANSION: "Inflationary Expansion / Reflation",
  STAGFLATIONARY: "Stagflationary",
  CONTRACTION_RECESSIONARY: "Contraction / Recessionary",
  DISINFLATIONARY_SLOWDOWN: "Disinflationary Slowdown",
  MIXED: "Mixed",
};

const CORE = REGIMES.filter((regime) => regime !== "MIXED") as Exclude<Regime, "MIXED">[];
const ANCHORS = ["inflation", "growth", "labor", "policyRates"] as const;
const FACTOR_KEYS = ["inflation", "growth", "labor", "policyRates", "creditConditions", "liquidityProxy"] as const;
const BASE_THRESHOLDS = {
  iContained: 45,
  iHot: 60,
  iAccelFloor: 50,
  gRes: 45,
  lRes: 50,
  aWeak: 55,
  gSlow: 50,
  lSlow: 55,
  pMax: 55,
  cBenign: 50,
  qBenign: 55,
  cVeto: 65,
  qVeto: 70,
  extreme: 80,
  aSevere: 65,
  lContract: 60,
} as const;
type Thresholds = Record<keyof typeof BASE_THRESHOLDS, number>;

type NativeGuardThresholds = {
  realPolicyRate: number;
  deltaR: number;
  deltaTarget: number;
  deltaPi: number;
};

const NATIVE_BASE: NativeGuardThresholds = {
  realPolicyRate: 1.5,
  deltaR: 0.5,
  deltaTarget: 0.5,
  deltaPi: 0.3,
} as const;

type RuleOutcomes = Record<Exclude<Regime, "MIXED">, GateResult>;
type Interval = { lower: number; upper: number } | null;

function clamp(value: number, min = 0, max = 100): number {
  return Math.max(min, Math.min(max, value));
}

function validBounds(bounds: Interval): bounds is { lower: number; upper: number } {
  return bounds !== null && Number.isFinite(bounds.lower) && Number.isFinite(bounds.upper) &&
    bounds.lower >= 0 && bounds.upper <= 100 && bounds.lower <= bounds.upper;
}

function factorBounds(factor: RegimeFactorInput): Interval {
  return validBounds(factor.bounds) ? factor.bounds : null;
}

function ge(value: Interval | number | null, threshold: number): GateResult {
  if (typeof value === "number") return Number.isFinite(value) ? (value >= threshold ? "TRUE" : "FALSE") : "UNKNOWN";
  if (!validBounds(value)) return "UNKNOWN";
  if (value.lower >= threshold) return "TRUE";
  if (value.upper < threshold) return "FALSE";
  return "UNKNOWN";
}

function gt(value: Interval | number | null, threshold: number): GateResult {
  if (typeof value === "number") return Number.isFinite(value) ? (value > threshold ? "TRUE" : "FALSE") : "UNKNOWN";
  if (!validBounds(value)) return "UNKNOWN";
  if (value.lower > threshold) return "TRUE";
  if (value.upper <= threshold) return "FALSE";
  return "UNKNOWN";
}

function lt(value: Interval | number | null, threshold: number): GateResult {
  if (typeof value === "number") return Number.isFinite(value) ? (value < threshold ? "TRUE" : "FALSE") : "UNKNOWN";
  if (!validBounds(value)) return "UNKNOWN";
  if (value.upper < threshold) return "TRUE";
  if (value.lower >= threshold) return "FALSE";
  return "UNKNOWN";
}

function le(value: Interval | number | null, threshold: number): GateResult {
  if (typeof value === "number") return Number.isFinite(value) ? (value <= threshold ? "TRUE" : "FALSE") : "UNKNOWN";
  if (!validBounds(value)) return "UNKNOWN";
  if (value.upper <= threshold) return "TRUE";
  if (value.lower > threshold) return "FALSE";
  return "UNKNOWN";
}

function and(...values: GateResult[]): GateResult {
  if (values.includes("FALSE")) return "FALSE";
  return values.includes("UNKNOWN") ? "UNKNOWN" : "TRUE";
}

function or(...values: GateResult[]): GateResult {
  if (values.includes("TRUE")) return "TRUE";
  return values.includes("UNKNOWN") ? "UNKNOWN" : "FALSE";
}

function not(value: GateResult): GateResult {
  return value === "TRUE" ? "FALSE" : value === "FALSE" ? "TRUE" : "UNKNOWN";
}

function resilient(f: RegimeInputs["factors"], t: Thresholds): GateResult {
  const g = factorBounds(f.growth);
  const l = factorBounds(f.labor);
  return or(
    and(le(g, t.gRes), le(l, t.lRes)),
    and(le(l, t.gRes), le(g, t.lRes)),
  );
}

function divergence(f: RegimeInputs["factors"], t: Thresholds): GateResult {
  const g = factorBounds(f.growth);
  const l = factorBounds(f.labor);
  return and(or(le(g, t.gRes), le(l, t.gRes)), or(ge(g, t.aWeak), ge(l, t.aWeak)));
}

function hot(f: RegimeInputs["factors"], n: RegimeNativeInputs, t: Thresholds, native: typeof NATIVE_BASE): GateResult {
  const i = factorBounds(f.inflation);
  return or(ge(i, t.iHot), and(ge(i, t.iAccelFloor), ge(n.deltaPi, native.deltaPi)));
}

function nonPolicyGold(f: RegimeInputs["factors"], n: RegimeNativeInputs, t: Thresholds): GateResult {
  const allFactorsBelowExtreme = FACTOR_KEYS.map((key) => lt(factorBounds(f[key]), t.extreme));
  return and(
    le(factorBounds(f.inflation), t.iContained),
    le(factorBounds(f.growth), t.gRes),
    le(factorBounds(f.labor), t.lRes),
    or(le(factorBounds(f.creditConditions), t.cBenign), le(factorBounds(f.liquidityProxy), t.qBenign)),
    lt(factorBounds(f.creditConditions), t.cVeto),
    lt(factorBounds(f.liquidityProxy), t.qVeto),
    ...allFactorsBelowExtreme,
    lt(n.deltaPi, NATIVE_BASE.deltaPi),
    n.worseningMomenta === null ? "UNKNOWN" : (n.worseningMomenta < 3 ? "TRUE" : "FALSE"),
    not(divergence(f, t)),
  );
}

function policyCompatible(f: RegimeInputs["factors"], n: RegimeNativeInputs, t: Thresholds, native: typeof NATIVE_BASE): GateResult {
  return and(
    le(factorBounds(f.policyRates), t.pMax),
    le(n.realPolicyRate, native.realPolicyRate),
    le(n.deltaR, native.deltaR),
    lt(n.deltaTarget, native.deltaTarget),
    lt(n.deltaP, 8),
  );
}

function evaluateRules(inputs: RegimeInputs, t: Thresholds, native: typeof NATIVE_BASE): RuleOutcomes {
  const f = inputs.factors;
  const n = inputs.native;
  const isHot = hot(f, n, t, native);
  const isResilient = resilient(f, t);
  const isDivergent = divergence(f, t);
  const severeWeakness = and(ge(factorBounds(f.growth), t.aSevere), ge(factorBounds(f.labor), t.lContract));
  const moderateOrSevereWeakness = or(
    and(ge(factorBounds(f.growth), t.aWeak), ge(factorBounds(f.labor), t.aWeak)),
    ge(factorBounds(f.growth), t.aSevere),
    ge(factorBounds(f.labor), t.aSevere),
  );
  const piCooling = lt(n.deltaPi, native.deltaPi);
  const slowActivity = or(ge(factorBounds(f.growth), t.gSlow), ge(factorBounds(f.labor), t.lSlow));
  const gold = and(nonPolicyGold(f, n, t), policyCompatible(f, n, t, native), lt(factorBounds(f.policyRates), t.extreme));

  return {
    GOLDILOCKS: gold,
    INFLATIONARY_EXPANSION: and(isHot, isResilient, not(isDivergent)),
    STAGFLATIONARY: and(isHot, moderateOrSevereWeakness, not(isDivergent)),
    CONTRACTION_RECESSIONARY: and(severeWeakness, not(isHot)),
    DISINFLATIONARY_SLOWDOWN: and(
      le(factorBounds(f.inflation), t.iContained), piCooling, slowActivity,
      not(isResilient), not(severeWeakness), not(isDivergent),
    ),
  };
}

function isClassifiable(factor: RegimeFactorInput): boolean {
  return validBounds(factor.bounds) && factor.coverage >= 0.6 && factor.eligibleFamilies >= 2;
}

function low(value: Interval, threshold: number): number {
  return validBounds(value) ? clamp(60 + 2 * (threshold - value.upper)) : 0;
}

function high(value: Interval, threshold: number): number {
  return validBounds(value) ? clamp(60 + 2 * (value.lower - threshold)) : 0;
}

function clipLinear(value: number): number {
  return clamp(value);
}

function hotSupport(inputs: RegimeInputs, t: Thresholds, native: typeof NATIVE_BASE): number {
  const i = factorBounds(inputs.factors.inflation);
  const levelSupport = high(i, t.iHot);
  const acceleration = inputs.native.deltaPi === null ? 0
    : clipLinear(60 + 40 * (inputs.native.deltaPi - native.deltaPi));
  return Math.max(levelSupport, Math.min(high(i, t.iAccelFloor), acceleration));
}

function resilientSupport(inputs: RegimeInputs, t: Thresholds): number {
  const g = factorBounds(inputs.factors.growth);
  const l = factorBounds(inputs.factors.labor);
  return Math.max(Math.min(low(g, t.gRes), low(l, t.lRes)), Math.min(low(l, t.gRes), low(g, t.lRes)));
}

function supports(inputs: RegimeInputs, t: Thresholds, native: typeof NATIVE_BASE): Record<Exclude<Regime, "MIXED">, number> {
  const f = inputs.factors;
  const lowI = low(factorBounds(f.inflation), t.iContained);
  const lowG = low(factorBounds(f.growth), t.gRes);
  const lowL = low(factorBounds(f.labor), t.lRes);
  const weak = Math.max(
    Math.min(high(factorBounds(f.growth), t.aWeak), high(factorBounds(f.labor), t.aWeak)),
    high(factorBounds(f.growth), t.aSevere),
    high(factorBounds(f.labor), t.aSevere),
  );
  return {
    GOLDILOCKS: .25 * lowI + .20 * lowG + .15 * lowL + .25 * low(factorBounds(f.policyRates), t.pMax) +
      .15 * Math.max(low(factorBounds(f.creditConditions), t.cBenign), low(factorBounds(f.liquidityProxy), t.qBenign)),
    INFLATIONARY_EXPANSION: .5 * hotSupport(inputs, t, native) + .5 * resilientSupport(inputs, t),
    STAGFLATIONARY: .5 * hotSupport(inputs, t, native) + .5 * weak,
    CONTRACTION_RECESSIONARY: .5 * high(factorBounds(f.growth), t.aSevere) + .5 * high(factorBounds(f.labor), t.lContract),
    DISINFLATIONARY_SLOWDOWN: .5 * lowI + .5 * Math.max(high(factorBounds(f.growth), t.gSlow), high(factorBounds(f.labor), t.lSlow)),
  };
}

function restrictiveSupport(inputs: RegimeInputs, t: Thresholds, native: typeof NATIVE_BASE): number {
  const { factors: f, native: n } = inputs;
  const violations: number[] = [];
  if (gt(factorBounds(f.policyRates), t.pMax) === "TRUE") violations.push(high(factorBounds(f.policyRates), t.pMax));
  if (n.realPolicyRate !== null && n.realPolicyRate > native.realPolicyRate) violations.push(clipLinear(60 + 40 * (n.realPolicyRate - native.realPolicyRate)));
  if (n.deltaR !== null && n.deltaR > native.deltaR) violations.push(clipLinear(60 + 80 * (n.deltaR - native.deltaR)));
  if (n.deltaTarget !== null && n.deltaTarget >= native.deltaTarget) violations.push(clipLinear(60 + 80 * (n.deltaTarget - native.deltaTarget)));
  if (n.deltaP !== null && n.deltaP >= 8) violations.push(clamp(60 + 2 * (n.deltaP - 8)));
  return .25 * low(factorBounds(f.inflation), t.iContained) + .35 * resilientSupport(inputs, t) +
    .40 * (violations.length ? Math.max(...violations) : 0);
}

function intermediateSupport(inputs: RegimeInputs, t: Thresholds, native: typeof NATIVE_BASE): number {
  const i = factorBounds(inputs.factors.inflation);
  const U = inputs.native.deltaPi !== null && inputs.native.deltaPi >= native.deltaPi ? t.iAccelFloor : t.iHot;
  if (!validBounds(i)) return 0;
  const distance = Math.min(i.lower - t.iContained, U - i.upper);
  return 40 + 20 * clamp(2 * distance / (U - t.iContained), 0, 1);
}

function mixedSupports(inputs: RegimeInputs, t: Thresholds, native: typeof NATIVE_BASE, outcomes: RuleOutcomes): Map<string, number> {
  const result = new Map<string, number>();
  const { factors: f, native: n } = inputs;
  if (divergence(f, t) === "TRUE") {
    const g = factorBounds(f.growth)!;
    const l = factorBounds(f.labor)!;
    const minimum = Math.min(g.lower, l.lower);
    const maximum = Math.max(g.upper, l.upper);
    const gap = Math.max(Math.abs(g.lower - l.upper), Math.abs(g.upper - l.lower));
    result.set("activity_labor_divergence", .4 * low({ lower: minimum, upper: minimum }, t.gRes) +
      .4 * high({ lower: maximum, upper: maximum }, t.aWeak) + .2 * clamp(60 + 2 * (gap - (t.aWeak - t.gRes))));
  }

  const isNonPolicyGold = nonPolicyGold(f, n, t) === "TRUE";
  const otherRulesFalse = (CORE.filter((regime) => regime !== "GOLDILOCKS") as Exclude<Regime, "MIXED" | "GOLDILOCKS">[])
    .every((regime) => outcomes[regime] === "FALSE");
  if (isNonPolicyGold && policyCompatible(f, n, t, native) === "FALSE" && otherRulesFalse) {
    result.set("restrictive_expansion", restrictiveSupport(inputs, t, native));
  }

  const i = factorBounds(f.inflation);
  if (validBounds(i) && i.lower > t.iContained && hot(f, n, t, native) === "FALSE") {
    const namedRulesFalse = CORE.every((regime) => outcomes[regime] === "FALSE");
    if (namedRulesFalse) result.set("inflation_intermediate", intermediateSupport(inputs, t, native));
  }

  if (CORE.every((regime) => outcomes[regime] === "FALSE")) result.set("no_positive_envelope", 50);
  return result;
}

function addTension(tensions: RegimeTension[], code: string, severity: number, defining = false): void {
  tensions.push({
    code,
    severity,
    scope: "core",
    clarityRole: defining ? "DEFINING_EVIDENCE" : "RESIDUAL_TENSION",
  });
}

function collectTensions(inputs: RegimeInputs, witness: string | null, outcomes: RuleOutcomes): RegimeTension[] {
  const tensions: RegimeTension[] = [];
  const { factors: f, native: n } = inputs;
  if (divergence(f, BASE_THRESHOLDS) === "TRUE") {
    const g = factorBounds(f.growth)!;
    const l = factorBounds(f.labor)!;
    const gap = Math.abs((g.lower + g.upper) / 2 - (l.lower + l.upper) / 2);
    addTension(tensions, "activity_labor_divergence", gap >= 25 ? 70 : 40, witness === "activity_labor_divergence");
  }
  if (n.coreYoYChange !== null && n.coreYoYChange !== undefined && n.coreYoYChange <= -.3 && n.deltaPi !== null && n.deltaPi >= .3) {
    addTension(tensions, "inflation_pace_divergence", 40);
  }
  if ((n.deltaP !== null && n.deltaP >= 8 || n.deltaR !== null && n.deltaR >= .5) &&
      typeof n.liquidityStressChange === "number" && n.liquidityStressChange <= -8) {
    addTension(tensions, "policy_liquidity_tension", 40);
  }
  if (factorBounds(f.growth) && factorBounds(f.growth)!.upper <= 45 &&
      typeof n.creditStressChange === "number" && n.creditStressChange >= 8) {
    addTension(tensions, "activity_credit_tension", 55);
  }
  if (typeof n.creditStandards === "number" && typeof n.creditVolume === "number" &&
      ((n.creditStandards >= 60 && n.creditVolume <= 35) || (n.creditVolume >= 60 && n.creditStandards <= 35))) {
    addTension(tensions, "supply_volume_tension", 40);
  }
  if (CORE.filter((regime) => outcomes[regime] === "TRUE").length > 1) addTension(tensions, "rule_configuration_conflict", 100);
  return tensions;
}

function resultFor(outcomes: RuleOutcomes): { regime: Regime | null; candidates: Regime[]; ambiguous: boolean; conflict: boolean } {
  const proven = CORE.filter((regime) => outcomes[regime] === "TRUE");
  const unresolved = CORE.filter((regime) => outcomes[regime] === "UNKNOWN");
  if (proven.length > 1) return { regime: null, candidates: ["MIXED"], ambiguous: false, conflict: true };
  if (unresolved.length > 0) {
    return { regime: null, candidates: Array.from(new Set<Regime>([...proven, ...unresolved, "MIXED"])), ambiguous: true, conflict: false };
  }
  if (proven.length === 1) return { regime: proven[0], candidates: [], ambiguous: false, conflict: false };
  return { regime: "MIXED", candidates: ["MIXED"], ambiguous: false, conflict: false };
}

function allNativeKnown(native: RegimeNativeInputs): boolean {
  return [native.deltaPi, native.realPolicyRate, native.deltaR, native.deltaTarget, native.deltaP, native.worseningMomenta]
    .every((value) => typeof value === "number" && Number.isFinite(value));
}

function factorNormal(factor: RegimeFactorInput): boolean {
  return isClassifiable(factor) && factor.coverage >= .8 && factor.historyYears !== null && factor.historyYears >= 5 &&
    factor.releaseQuality !== null && factor.releaseQuality >= .8;
}

export function calculateDataQuality(slots: QualitySlotInput[]): number | null {
  if (slots.length === 0) return null;
  const weightTotal = slots.reduce((total, slot) => total + slot.weight, 0);
  if (Math.abs(weightTotal - 1) > 1e-9) throw new Error("Data Quality fixed weights must sum to 1");
  const quality = slots.reduce((total, slot) => {
    if (!Number.isFinite(slot.weight) || slot.weight < 0) throw new Error("Data Quality slot weight is invalid");
    const usable = slot.eligible ? 1 : 0;
    const health = clamp(slot.fetchHealth, 0, 1);
    const freshness = clamp(slot.freshness, 0, 1);
    const history = clamp(slot.history, 0, 1);
    const release = clamp(slot.release, 0, 1);
    return total + slot.weight * usable * health * (.4 + .2 * freshness + .2 * history + .2 * release);
  }, 0);
  return Math.round(100 * quality);
}

function thresholdsFor(changes: Partial<Thresholds> = {}): Thresholds {
  return { ...BASE_THRESHOLDS, ...changes };
}

function scoreScenarios(): Array<{ id: string; thresholds: Thresholds }> {
  const scenarios = Object.keys(BASE_THRESHOLDS).flatMap((key) => [-5, 5].map((change) => ({
    id: `${key}:${change}`,
    thresholds: thresholdsFor({ [key]: BASE_THRESHOLDS[key as keyof typeof BASE_THRESHOLDS] + change }),
  })));
  return [...scenarios, ...[-5, 5].map((change) => ({
    id: `all:${change}`,
    thresholds: thresholdsFor(Object.fromEntries(Object.entries(BASE_THRESHOLDS).map(([key, value]) => [key, value + change]))),
  }))];
}

function namedResult(outcomes: RuleOutcomes): Regime | null {
  return resultFor(outcomes).regime;
}

function sensitivityFor(inputs: RegimeInputs, baseResult: Regime): RegimeSensitivity {
  const scenarios = scoreScenarios();
  const results = scenarios.map((scenario) => namedResult(evaluateRules(inputs, scenario.thresholds, NATIVE_BASE)));
  const same = results.filter((result) => result === baseResult).length;
  const singleCount = 32;
  const singleAgreement = 100 * results.slice(0, singleCount).filter((result) => result === baseResult).length / singleCount;
  const coherentAgreement = 100 * results.slice(singleCount).filter((result) => result === baseResult).length / 2;
  const agreement = Math.min(singleAgreement, coherentAgreement);
  const namedSwitch = baseResult !== "MIXED" && results.some((result) => result !== null && result !== "MIXED" && result !== baseResult);
  const differentResolvedRegime = results.some((result) => result !== null && result !== baseResult);
  const differentNamedRegime = results.some((result) => result !== null && result !== "MIXED" && result !== baseResult);
  const nativeVariants: Array<Partial<NativeGuardThresholds>> = [
    { realPolicyRate: 1.25 }, { realPolicyRate: 1.75 },
    { deltaR: .25 }, { deltaR: .75 },
    { deltaTarget: .25 }, { deltaTarget: .75 },
    { deltaPi: .2 }, { deltaPi: .4 },
  ];
  const nativeGuardChanged = nativeVariants.some((variant) => {
    const native = { ...NATIVE_BASE, ...variant };
    const result = namedResult(evaluateRules(inputs, thresholdsFor(), native));
    return result !== baseResult;
  });
  const classification = nativeGuardChanged || agreement < 80 || namedSwitch ? "FRAGILE"
    : same === scenarios.length ? "ROBUST" : "MODERATELY_SENSITIVE";
  return {
    classification,
    same,
    total: scenarios.length,
    singleAgreement,
    coherentAgreement,
    agreement,
    nativeGuardChanged,
    differentResolvedRegime,
    differentNamedRegime,
  };
}

function diagnostics(outcomes: RuleOutcomes, ruleSupport: Record<Exclude<Regime, "MIXED">, number>, mixedSupport: number): Record<Regime, RuleDiagnostic> {
  const result = {} as Record<Regime, RuleDiagnostic>;
  for (const regime of CORE) {
    result[regime] = {
      result: outcomes[regime],
      support: ruleSupport[regime],
      failedOrUnknownGates: outcomes[regime] === "FALSE" ? ["mandatory_gate_false"]
        : outcomes[regime] === "UNKNOWN" ? ["mandatory_gate_unknown"] : [],
    };
  }
  result.MIXED = { result: "UNKNOWN", support: mixedSupport, failedOrUnknownGates: [] };
  return result;
}

function unknownDiagnostics(): Record<Regime, RuleDiagnostic> {
  const unknown = Object.fromEntries(REGIMES.map((regime) => [regime, {
    result: "UNKNOWN" as const,
    support: 0,
    failedOrUnknownGates: ["required_anchor_unavailable"],
  }])) as Record<Regime, RuleDiagnostic>;
  return unknown;
}

function factorReadiness(inputs: RegimeInputs): Record<RegimeInputs["factors"] extends Record<infer K, RegimeFactorInput> ? K : never, FactorReadiness> {
  return Object.fromEntries(FACTOR_KEYS.map((key) => [key, {
    coverage: inputs.factors[key].coverage,
    eligibleFamilies: inputs.factors[key].eligibleFamilies,
    classifiable: isClassifiable(inputs.factors[key]),
  }])) as Record<RegimeInputs["factors"] extends Record<infer K, RegimeFactorInput> ? K : never, FactorReadiness>;
}

const DIRECTION_VALUE: Record<Exclude<MacroDirection, "UNKNOWN">, number> = {
  STRONGLY_IMPROVING: -2,
  IMPROVING: -1,
  NEUTRAL: 0,
  DETERIORATING: 1,
  STRONGLY_DETERIORATING: 2,
};

const LEADING_WEIGHTS = { growth: 0.4, labor: 0.4, credit: 0.2 } as const;
const POSSIBLE_VOTES = [-2, -1, 0, 1, 2] as const;

function roundedDirectionValue(value: number): number {
  const rounded = Math.round(value * 1e8) / 1e8;
  return Math.abs(rounded) < 1e-8 ? 0 : rounded;
}

function stressDirection(change: number | null | undefined): MacroDirection {
  if (typeof change !== "number" || !Number.isFinite(change)) return "UNKNOWN";
  if (change <= -20) return "STRONGLY_IMPROVING";
  if (change <= -8) return "IMPROVING";
  if (change < 8) return "NEUTRAL";
  if (change < 20) return "DETERIORATING";
  return "STRONGLY_DETERIORATING";
}

function qualifiedVote(momentum: SourceMomentumInputs["growth"]): MacroDirection {
  if (!momentum || !Number.isFinite(momentum.commonEligibleWeight) ||
      momentum.commonEligibleWeight < 0.6 || momentum.commonEligibleWeight > 1 ||
      !Number.isInteger(momentum.commonEligibleFamilies) || momentum.commonEligibleFamilies < 2) return "UNKNOWN";
  return stressDirection(momentum.scoreChange);
}

function leadingBand(score: number): Exclude<MacroDirection, "UNKNOWN"> {
  if (score <= -1.25) return "STRONGLY_IMPROVING";
  if (score <= -0.5) return "IMPROVING";
  if (score < 0.5) return "NEUTRAL";
  if (score < 1.25) return "DETERIORATING";
  return "STRONGLY_DETERIORATING";
}

function breadthAdjustedBand(score: number, values: number[]): Exclude<MacroDirection, "UNKNOWN"> {
  const deteriorating = values.filter((value) => value > 0);
  const improving = values.filter((value) => value < 0);
  if (deteriorating.length >= 2) {
    return deteriorating.filter((value) => value === 2).length >= 2
      ? "STRONGLY_DETERIORATING"
      : DIRECTION_VALUE[leadingBand(score)] >= 1 ? leadingBand(score) : "DETERIORATING";
  }
  if (deteriorating.length === 0 && improving.length >= 2) {
    return improving.filter((value) => value === -2).length >= 2
      ? "STRONGLY_IMPROVING"
      : DIRECTION_VALUE[leadingBand(score)] <= -1 ? leadingBand(score) : "IMPROVING";
  }
  return leadingBand(score);
}

function scoreCompletions(votes: Record<"growth" | "labor" | "credit", MacroDirection>): number[][] {
  const keys = ["growth", "labor", "credit"] as const;
  const completions: number[][] = [];
  const visit = (index: number, values: number[]) => {
    if (index === keys.length) {
      completions.push(values);
      return;
    }
    const key = keys[index];
    if (votes[key] === "UNKNOWN") {
      for (const value of POSSIBLE_VOTES) visit(index + 1, [...values, value]);
      return;
    }
    visit(index + 1, [...values, DIRECTION_VALUE[votes[key] as Exclude<MacroDirection, "UNKNOWN">]]);
  };
  visit(0, []);
  return completions;
}

function assessLeadingDirection(momentum: SourceMomentumInputs | null | undefined): LeadingDirectionAssessment {
  const votes = {
    growth: qualifiedVote(momentum?.growth ?? null),
    labor: qualifiedVote(momentum?.labor ?? null),
    credit: qualifiedVote(momentum?.credit ?? null),
  };
  const weights = LEADING_WEIGHTS;
  const knownKeys = (Object.keys(weights) as Array<keyof typeof weights>).filter((key) => votes[key] !== "UNKNOWN");
  const knownWeight = knownKeys.reduce((total, key) => total + weights[key], 0);
  const knownValues = knownKeys.map((key) => DIRECTION_VALUE[votes[key] as Exclude<MacroDirection, "UNKNOWN">]);
  const knownScore = knownKeys.reduce((total, key) => total + weights[key] * DIRECTION_VALUE[votes[key] as Exclude<MacroDirection, "UNKNOWN">], 0);
  const unknownWeight = 1 - knownWeight;
  const scoreRange = knownKeys.length > 0
    ? {
        lower: roundedDirectionValue(knownScore - 2 * unknownWeight),
        upper: roundedDirectionValue(knownScore + 2 * unknownWeight),
      }
    : null;
  const weightedScore = knownWeight === 1 ? roundedDirectionValue(knownScore) : null;
  const dispersion = knownValues.length >= 2 ? Math.max(...knownValues) - Math.min(...knownValues) : null;
  const canAssessActivity = votes.growth !== "UNKNOWN" && votes.labor !== "UNKNOWN" && knownWeight >= 0.8;
  const completions = canAssessActivity ? scoreCompletions(votes) : [];
  const possibleDirections = completions.map((values) => {
    const score = values[0] * weights.growth + values[1] * weights.labor + values[2] * weights.credit;
    return breadthAdjustedBand(score, values);
  });
  const uniqueDirections = Array.from(new Set(possibleDirections));
  const direction = canAssessActivity && uniqueDirections.length === 1 ? uniqueDirections[0] : "UNKNOWN";
  return {
    direction,
    weightedScore,
    scoreRange,
    dispersion,
    votes,
    reason: direction === "UNKNOWN" ? "momentum_comparisons_insufficient_or_non_invariant" : null,
  };
}

function assessInflationDirection(deltaPi: number | null): InflationDirectionAssessment {
  const direction: MacroDirection = typeof deltaPi !== "number" || !Number.isFinite(deltaPi) ? "UNKNOWN"
    : deltaPi <= -1 ? "STRONGLY_IMPROVING"
      : deltaPi <= -0.3 ? "IMPROVING"
        : deltaPi < 0.3 ? "NEUTRAL"
          : deltaPi < 1 ? "DETERIORATING" : "STRONGLY_DETERIORATING";
  return { direction, deltaPi: typeof deltaPi === "number" && Number.isFinite(deltaPi) ? deltaPi : null };
}

function deterioratingVotes(leading: LeadingDirectionAssessment): MacroDirection[] {
  return [leading.votes.growth, leading.votes.labor, leading.votes.credit]
    .filter((direction) => direction === "DETERIORATING" || direction === "STRONGLY_DETERIORATING");
}

function hasNewOrWorsenedCoreTension(current: RegimeTension[], previous: RegimeTension[]): boolean {
  const priorByCode = new Map(previous.filter((item) => item.scope === "core").map((item) => [item.code, item.severity]));
  return current.some((item) => item.scope === "core" &&
    (!priorByCode.has(item.code) || item.severity - (priorByCode.get(item.code) ?? item.severity) >= 25));
}

function assessTransitionRisk(
  inputs: RegimeInputs,
  leading: LeadingDirectionAssessment,
  sensitivity: RegimeSensitivity | null,
  tensions: RegimeTension[],
): TransitionRiskAssessment {
  const directions = [leading.votes.growth, leading.votes.labor, leading.votes.credit];
  const deteriorating = deterioratingVotes(leading);
  const stronglyDeteriorating = deteriorating.filter((direction) => direction === "STRONGLY_DETERIORATING");
  const elevatedReasons: string[] = [];
  if (directions.every((direction) => direction === "DETERIORATING" || direction === "STRONGLY_DETERIORATING")) {
    elevatedReasons.push("three_deteriorating_factors");
  }
  if (stronglyDeteriorating.length >= 2) elevatedReasons.push("two_strongly_deteriorating_factors");
  if (sensitivity?.differentNamedRegime && deteriorating.length >= 2) {
    elevatedReasons.push("sensitivity_switch_with_deterioration");
  }
  if (typeof inputs.native.deltaR === "number" && Number.isFinite(inputs.native.deltaR) &&
      Math.abs(inputs.native.deltaR) >= 1 && deteriorating.length >= 1) {
    elevatedReasons.push("rate_shock_with_deterioration");
  }
  if (elevatedReasons.length) return { level: "ELEVATED", reasonCodes: elevatedReasons };

  const prior = inputs.priorTensionComparison;
  const deltaR = inputs.native.deltaR;
  const deltaTarget = inputs.native.deltaTarget;
  if (directions.some((direction) => direction === "UNKNOWN") ||
      typeof deltaR !== "number" || !Number.isFinite(deltaR) ||
      typeof deltaTarget !== "number" || !Number.isFinite(deltaTarget) ||
      sensitivity === null || prior?.comparable !== true) {
    return { level: "UNKNOWN", reasonCodes: ["transition_comparison_unavailable"] };
  }

  const moderateReasons: string[] = [];
  if (deteriorating.length >= 2) moderateReasons.push("two_deteriorating_factors");
  if (sensitivity.differentResolvedRegime) moderateReasons.push("sensitivity_resolved_label_change");
  if (hasNewOrWorsenedCoreTension(tensions, prior.tensions)) moderateReasons.push("core_tension_new_or_worsened");
  if ((Math.abs(deltaR) >= 0.5 || Math.abs(deltaTarget) >= 0.5) && deteriorating.length >= 1) {
    moderateReasons.push("rate_or_target_change_with_deterioration");
  }
  return moderateReasons.length
    ? { level: "MODERATE", reasonCodes: moderateReasons }
    : { level: "LOW", reasonCodes: [] };
}

export function evaluateRegime(inputs: RegimeInputs): RegimeAssessment {
  const dataQuality = calculateDataQuality(inputs.qualitySlots);
  const leadingDirection = assessLeadingDirection(inputs.sourceMomentum);
  const inflationDirection = assessInflationDirection(inputs.native.deltaPi);
  const unavailableAnchors = ANCHORS.filter((key) => !isClassifiable(inputs.factors[key]));
  const classifiableCount = FACTOR_KEYS.filter((key) => isClassifiable(inputs.factors[key])).length;
  if (unavailableAnchors.length > 0 || classifiableCount < 4) {
    return {
      assessmentStatus: "INSUFFICIENT_DATA",
      regime: null,
      dataQuality,
      regimeClarity: null,
      candidates: [],
      reasonCodes: Array.from(new Set([
        ...unavailableAnchors.map((key) => `anchor_unavailable:${key}`),
        ...(inputs.sourceBlockers ?? []),
      ])),
      activitySeverity: null,
      sensitivity: null,
      factorReadiness: factorReadiness(inputs),
      ruleDiagnostics: unknownDiagnostics(),
      tensions: [],
      leadingDirection,
      inflationDirection,
      transitionRisk: assessTransitionRisk(inputs, leadingDirection, null, []),
    };
  }

  const outcomes = evaluateRules(inputs, thresholdsFor(), NATIVE_BASE);
  const selected = resultFor(outcomes);
  const baseSupport = supports(inputs, thresholdsFor(), NATIVE_BASE);
  const mixedByReason = selected.regime === "MIXED" && !selected.conflict
    ? mixedSupports(inputs, thresholdsFor(), NATIVE_BASE, outcomes)
    : new Map<string, number>();
  const witnesses = Array.from(mixedByReason.entries()).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
  const selectedSupportReason = witnesses[0]?.[0] ?? null;
  const computedSupport = selected.conflict ? 0 : selected.regime === "MIXED" ? (witnesses[0]?.[1] ?? 0) :
    selected.regime ? baseSupport[selected.regime] : 0;
  const tensions = collectTensions(inputs, selectedSupportReason, outcomes);
  const coreTension = selected.conflict ? 100 : Math.max(0, ...tensions
    .filter((tension) => tension.scope === "core" && tension.clarityRole === "RESIDUAL_TENSION")
    .map((tension) => tension.severity));

  if (selected.ambiguous || selected.conflict || selected.regime === null) {
    return {
      assessmentStatus: selected.conflict ? "INSUFFICIENT_DATA" : "PROVISIONAL",
      regime: null,
      dataQuality,
      regimeClarity: null,
      candidates: selected.candidates,
      reasonCodes: selected.conflict ? ["rule_configuration_conflict"] : ["missing_data_ambiguity"],
      activitySeverity: null,
      sensitivity: null,
      factorReadiness: factorReadiness(inputs),
      ruleDiagnostics: diagnostics(outcomes, baseSupport, computedSupport),
      tensions,
      leadingDirection,
      inflationDirection,
      transitionRisk: assessTransitionRisk(inputs, leadingDirection, null, tensions),
    };
  }

  const sensitivity = sensitivityFor(inputs, selected.regime);
  const otherSupports = mixedByReason;
  if (selected.regime === "MIXED" && witnesses.length === 0) otherSupports.set("no_positive_envelope", 50);
  const reasonCodes = selected.regime === "MIXED"
    ? Array.from(otherSupports.keys()).sort((a, b) => {
        const aValue = otherSupports.get(a) ?? 0;
        const bValue = otherSupports.get(b) ?? 0;
        return bValue - aValue || a.localeCompare(b);
      })
    : [];
  const support = selected.regime === "MIXED" ? computedSupport : baseSupport[selected.regime];
  const rawClarity = .45 * support + .35 * sensitivity.agreement + .20 * (100 - coreTension);
  const cap = sensitivity.classification === "FRAGILE" ? 49
    : sensitivity.classification === "MODERATELY_SENSITIVE" ? 69 : 100;
  const regimeClarity = Math.min(cap, Math.round(clamp(rawClarity)));
  const supportingCount = FACTOR_KEYS.filter((key) => !ANCHORS.includes(key as (typeof ANCHORS)[number]) && isClassifiable(inputs.factors[key])).length;
  const normal = classifiableCount >= 5 && supportingCount >= 1 && FACTOR_KEYS.every((key) => factorNormal(inputs.factors[key])) &&
    allNativeKnown(inputs.native);
  const assessmentStatus = normal ? "NORMAL" : "PROVISIONAL";
  const requiredHistories = FACTOR_KEYS.filter((key) => isClassifiable(inputs.factors[key]));
  const insufficiencyReasons = requiredHistories.flatMap((key) => {
    const factor = inputs.factors[key];
    return [
      ...(factor.coverage < .8 ? [`limited_coverage:${key}`] : []),
      ...(factor.historyYears === null || factor.historyYears < 5 ? [`limited_history:${key}`] : []),
      ...(factor.releaseQuality === null || factor.releaseQuality < .8 ? [`limited_release_metadata:${key}`] : []),
    ];
  });
  if (!allNativeKnown(inputs.native)) insufficiencyReasons.push("required_native_comparison_unavailable");
  if (supportingCount === 0) insufficiencyReasons.push("supporting_factor_unavailable");
  const ruleDiagnosticsResult = diagnostics(outcomes, baseSupport, selected.regime === "MIXED" ? support : 0);
  ruleDiagnosticsResult.MIXED.result = selected.regime === "MIXED" ? "TRUE" : "FALSE";
  ruleDiagnosticsResult.MIXED.failedOrUnknownGates = selected.regime === "MIXED" ? [] : ["named_regime_proven"];
  const candidates: Regime[] = assessmentStatus === "NORMAL" ? [] : [selected.regime];
  return {
    assessmentStatus,
    regime: selected.regime,
    dataQuality,
    regimeClarity,
    candidates,
    reasonCodes: reasonCodes.length ? reasonCodes : insufficiencyReasons,
    activitySeverity: outcomes.STAGFLATIONARY === "TRUE" &&
      and(ge(factorBounds(inputs.factors.growth), BASE_THRESHOLDS.aSevere), ge(factorBounds(inputs.factors.labor), BASE_THRESHOLDS.lContract)) === "TRUE"
      ? "CONTRACTION_LEVEL" : selected.regime === "STAGFLATIONARY" ? "STANDARD" : null,
    sensitivity,
    factorReadiness: factorReadiness(inputs),
    ruleDiagnostics: ruleDiagnosticsResult,
    tensions,
    leadingDirection,
    inflationDirection,
    transitionRisk: assessTransitionRisk(inputs, leadingDirection, sensitivity, tensions),
  };
}
