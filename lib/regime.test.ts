import { describe, expect, it } from "vitest";
import {
  calculateDataQuality,
  evaluateRegime,
  REGIMES,
  REGIME_LABELS,
} from "@/lib/regime";
import type { PriorTensionComparison, RegimeInputs, SourceMomentumInputs } from "@/lib/types";

const family = (score: number | null, options: Partial<RegimeInputs["factors"]["inflation"]> = {}) => ({
  bounds: score === null ? null : { lower: score, upper: score },
  coverage: score === null ? 0 : 1,
  eligibleFamilies: score === null ? 0 : 2,
  historyYears: score === null ? null : 10,
  releaseQuality: score === null ? null : 1,
  ...options,
});

function inputs(
  scores: Partial<Record<keyof RegimeInputs["factors"], number | null>> = {},
  native: Partial<RegimeInputs["native"]> = {},
): RegimeInputs {
  const full = {
    inflation: 30,
    growth: 25,
    labor: 30,
    policyRates: 30,
    creditConditions: 25,
    liquidityProxy: 35,
  };
  const values = { ...full, ...scores };
  return {
    factors: {
      inflation: family(values.inflation),
      growth: family(values.growth),
      labor: family(values.labor),
      policyRates: family(values.policyRates),
      creditConditions: family(values.creditConditions),
      liquidityProxy: family(values.liquidityProxy),
    },
    native: {
      deltaPi: 0,
      realPolicyRate: 1,
      deltaR: 0,
      deltaTarget: 0,
      deltaP: 0,
      worseningMomenta: 0,
      ...native,
    },
    qualitySlots: Array.from({ length: 6 }, () => ({
      weight: 1 / 6,
      eligible: true,
      freshness: 1,
      history: 0.55,
      release: 1,
      fetchHealth: 1,
    })),
  };
}

function momentum(
  scoreChange: number | null,
  commonEligibleWeight = 1,
  commonEligibleFamilies = 3,
) {
  return { scoreChange, commonEligibleWeight, commonEligibleFamilies };
}

function withMomentum(
  input: RegimeInputs,
  sourceMomentum: SourceMomentumInputs,
  priorTensionComparison: PriorTensionComparison | null = null,
): RegimeInputs {
  return { ...input, sourceMomentum, priorTensionComparison };
}

describe("US macro regime v0.3", () => {
  it.each([
    [-20, "STRONGLY_IMPROVING"],
    [-8, "IMPROVING"],
    [-7.99, "NEUTRAL"],
    [7.99, "NEUTRAL"],
    [8, "DETERIORATING"],
    [20, "STRONGLY_DETERIORATING"],
  ])("maps source stress-score change %i to its approved direction band", (change, direction) => {
    const result = evaluateRegime(withMomentum(inputs(), {
      growth: momentum(change), labor: momentum(change), credit: momentum(change),
    }));

    expect(result.leadingDirection.votes.growth).toBe(direction);
  });

  it("requires 60% common eligible weight and two families for a factor direction", () => {
    const result = evaluateRegime(withMomentum(inputs(), {
      growth: momentum(20, 0.59, 3),
      labor: momentum(0, 1, 1),
      credit: momentum(0),
    }));

    expect(result.leadingDirection.votes.growth).toBe("UNKNOWN");
    expect(result.leadingDirection.votes.labor).toBe("UNKNOWN");
    expect(result.leadingDirection.direction).toBe("UNKNOWN");
  });

  it("applies deterioration breadth before the weighted mean", () => {
    const result = evaluateRegime(withMomentum(inputs(), {
      growth: momentum(8), labor: momentum(8), credit: momentum(-20),
    }));

    expect(result.leadingDirection.weightedScore).toBeCloseTo(0.4, 8);
    expect(result.leadingDirection.direction).toBe("DETERIORATING");
  });

  it("uses two strong deteriorating factor votes to override a milder weighted mean", () => {
    const result = evaluateRegime(withMomentum(inputs(), {
      growth: momentum(20), labor: momentum(20), credit: momentum(-20),
    }));

    expect(result.leadingDirection.weightedScore).toBeCloseTo(1.2, 8);
    expect(result.leadingDirection.direction).toBe("STRONGLY_DETERIORATING");
  });

  it("does not apply symmetric improvement breadth when a deteriorating vote is observed", () => {
    const result = evaluateRegime(withMomentum(inputs(), {
      growth: momentum(-8), labor: momentum(-8), credit: momentum(20),
    }));

    expect(result.leadingDirection.direction).toBe("NEUTRAL");
  });

  it("keeps an unknown credit vote across its full range instead of imputing neutral", () => {
    const result = evaluateRegime(withMomentum(inputs(), {
      growth: momentum(8), labor: momentum(0), credit: null,
    }));

    expect(result.leadingDirection.votes.credit).toBe("UNKNOWN");
    expect(result.leadingDirection.scoreRange).toEqual({ lower: 0, upper: 0.8 });
    expect(result.leadingDirection.weightedScore).toBeNull();
    expect(result.leadingDirection.direction).toBe("UNKNOWN");
  });

  it("resolves a missing credit vote when Growth and Labor make the direction invariant", () => {
    const result = evaluateRegime(withMomentum(inputs(), {
      growth: momentum(20), labor: momentum(20), credit: null,
    }));

    expect(result.leadingDirection.direction).toBe("STRONGLY_DETERIORATING");
    expect(result.leadingDirection.weightedScore).toBeNull();
    expect(result.leadingDirection.scoreRange).toEqual({ lower: 1.2, upper: 2 });
  });

  it("exposes dispersion across the qualified factor votes", () => {
    const result = evaluateRegime(withMomentum(inputs(), {
      growth: momentum(-20), labor: momentum(0), credit: momentum(20),
    }));

    expect(result.leadingDirection.votes).toEqual({
      growth: "STRONGLY_IMPROVING",
      labor: "NEUTRAL",
      credit: "STRONGLY_DETERIORATING",
    });
    expect(result.leadingDirection.dispersion).toBe(4);
  });

  it.each([
    [-1, "STRONGLY_IMPROVING"],
    [-0.3, "IMPROVING"],
    [0.299, "NEUTRAL"],
    [0.3, "DETERIORATING"],
    [1, "STRONGLY_DETERIORATING"],
  ])("maps core inflation pace change %s pp to %s", (deltaPi, direction) => {
    expect(evaluateRegime(inputs({}, { deltaPi })).inflationDirection.direction).toBe(direction);
  });

  it("proves Elevated transition risk from three deteriorating source directions despite other missing comparisons", () => {
    const result = evaluateRegime(withMomentum(inputs({}, { deltaR: null, deltaTarget: null }), {
      growth: momentum(8), labor: momentum(8), credit: momentum(8),
    }));

    expect(result.transitionRisk).toMatchObject({ level: "ELEVATED", reasonCodes: ["three_deteriorating_factors"] });
  });

  it("proves Elevated transition risk from two strongly deteriorating directions", () => {
    const result = evaluateRegime(withMomentum(inputs({}, { deltaR: null, deltaTarget: null }), {
      growth: momentum(20), labor: momentum(20), credit: momentum(0),
    }));

    expect(result.transitionRisk.level).toBe("ELEVATED");
    expect(result.transitionRisk.reasonCodes).toContain("two_strongly_deteriorating_factors");
  });

  it("proves Elevated transition risk from a one-point real-rate move and one deteriorating factor", () => {
    const result = evaluateRegime(withMomentum(inputs({}, { deltaR: -1, deltaTarget: null }), {
      growth: momentum(8), labor: momentum(0), credit: momentum(0),
    }));

    expect(result.transitionRisk).toMatchObject({ level: "ELEVATED", reasonCodes: ["rate_shock_with_deterioration"] });
  });

  it("reports Moderate transition risk for two deteriorating factors when comparisons are complete", () => {
    const result = evaluateRegime(withMomentum(inputs(), {
      growth: momentum(8), labor: momentum(8), credit: momentum(0),
    }, { comparable: true, tensions: [] }));

    expect(result.transitionRisk).toMatchObject({ level: "MODERATE", reasonCodes: ["two_deteriorating_factors"] });
  });

  it("reports Moderate transition risk for a half-point target move with one deteriorating factor", () => {
    const result = evaluateRegime(withMomentum(inputs({}, { deltaTarget: -0.5 }), {
      growth: momentum(8), labor: momentum(0), credit: momentum(0),
    }, { comparable: true, tensions: [] }));

    expect(result.transitionRisk).toMatchObject({
      level: "MODERATE",
      reasonCodes: ["rate_or_target_change_with_deterioration"],
    });
  });

  it("reports a new core tension as Moderate, but a static tension alone does not raise risk", () => {
    const base = inputs({}, { creditStandards: 60, creditVolume: 35 });
    const sources = { growth: momentum(0), labor: momentum(0), credit: momentum(0) };
    const newTension = evaluateRegime(withMomentum(base, sources, { comparable: true, tensions: [] }));
    const sameTension = evaluateRegime(withMomentum(base, sources, {
      comparable: true,
      tensions: [{ code: "supply_volume_tension", severity: 40, scope: "core", clarityRole: "RESIDUAL_TENSION" }],
    }));
    const worsenedTension = evaluateRegime(withMomentum(base, sources, {
      comparable: true,
      tensions: [{ code: "supply_volume_tension", severity: 15, scope: "core", clarityRole: "RESIDUAL_TENSION" }],
    }));

    expect(newTension.transitionRisk).toMatchObject({ level: "MODERATE", reasonCodes: ["core_tension_new_or_worsened"] });
    expect(sameTension.transitionRisk).toMatchObject({ level: "LOW", reasonCodes: [] });
    expect(worsenedTension.transitionRisk).toMatchObject({ level: "MODERATE", reasonCodes: ["core_tension_new_or_worsened"] });
  });

  it("marks a different resolved sensitivity label as Moderate without changing the base regime", () => {
    const result = evaluateRegime(withMomentum(inputs({
      inflation: 75, growth: 45, labor: 50,
    }, { deltaPi: 0.8 }), {
      growth: momentum(0), labor: momentum(0), credit: momentum(0),
    }, { comparable: true, tensions: [] }));

    expect(result.regime).toBe("INFLATIONARY_EXPANSION");
    expect(result.sensitivity?.differentResolvedRegime).toBe(true);
    expect(result.transitionRisk).toMatchObject({
      level: "MODERATE",
      reasonCodes: ["sensitivity_resolved_label_change"],
    });
  });

  it("keeps Transition Risk unknown when comparisons are unavailable unless Elevated is proved", () => {
    const incomplete = evaluateRegime(withMomentum(inputs({}, { deltaR: 0.7, deltaTarget: 0 }), {
      growth: momentum(8), labor: momentum(8), credit: momentum(0),
    }));
    const elevated = evaluateRegime(withMomentum(inputs({}, { deltaR: null, deltaTarget: null }), {
      growth: momentum(20), labor: momentum(20), credit: momentum(0),
    }));

    expect(incomplete.transitionRisk.level).toBe("UNKNOWN");
    expect(incomplete.transitionRisk.reasonCodes).toContain("transition_comparison_unavailable");
    expect(elevated.transitionRisk.level).toBe("ELEVATED");
  });

  it("surfaces the Treasury reuse blocker without assigning a regime", () => {
    const input = inputs();
    input.factors.policyRates = family(null);
    (input as RegimeInputs & { sourceBlockers: string[] }).sourceBlockers = ["POLICY_RATES_WITHHELD — TREASURY_REUSE_UNRESOLVED"];
    const result = evaluateRegime(input);

    expect(result.assessmentStatus).toBe("INSUFFICIENT_DATA");
    expect(result.regime).toBeNull();
    expect(result.reasonCodes).toContain("POLICY_RATES_WITHHELD — TREASURY_REUSE_UNRESOLVED");
    expect(result.reasonCodes).toContain("anchor_unavailable:policyRates");
  });

  it("uses the approved enum taxonomy and descriptive expansion label", () => {
    expect(REGIMES).toEqual([
      "GOLDILOCKS",
      "INFLATIONARY_EXPANSION",
      "STAGFLATIONARY",
      "CONTRACTION_RECESSIONARY",
      "DISINFLATIONARY_SLOWDOWN",
      "MIXED",
    ]);
    expect(REGIME_LABELS.INFLATIONARY_EXPANSION).toBe("Inflationary Expansion / Reflation");
  });

  it.each([
    { name: "A", scores: { inflation: 75, growth: 56, labor: 49 }, regime: "MIXED", reason: "no_positive_envelope" },
    { name: "B", scores: { inflation: 75, growth: 56, labor: 56 }, regime: "STAGFLATIONARY", reason: null },
    { name: "C", scores: { inflation: 75, growth: 70, labor: 45 }, regime: "MIXED", reason: "activity_labor_divergence" },
    { name: "D", scores: { inflation: 75, growth: 45, labor: 70 }, regime: "MIXED", reason: "activity_labor_divergence" },
    { name: "E", scores: { inflation: 85, growth: 70, labor: 65 }, regime: "STAGFLATIONARY", reason: null },
    { name: "F", scores: { inflation: 65, growth: 52, labor: 52 }, regime: "MIXED", reason: "no_positive_envelope" },
    { name: "G", scores: { inflation: 75, growth: 45, labor: 70 }, regime: "MIXED", reason: "activity_labor_divergence" },
  ])("applies Stagflationary Option B to control $name", ({ scores, regime, reason }) => {
    const result = evaluateRegime(inputs(scores));

    expect(result.regime).toBe(regime);
    if (reason) expect(result.reasonCodes).toContain(reason);
    else expect(result.reasonCodes).toEqual([]);
    if (regime === "STAGFLATIONARY" && scores.growth >= 65 && scores.labor >= 60) {
      expect(result.activitySeverity).toBe("CONTRACTION_LEVEL");
    }
  });

  it("assigns Goldilocks only with compatible policy and a benign financing measure", () => {
    expect(evaluateRegime(inputs()).regime).toBe("GOLDILOCKS");
    expect(evaluateRegime(inputs({ creditConditions: 79 })).regime).toBe("MIXED");
    expect(evaluateRegime(inputs({}, { realPolicyRate: 3 })).regime).toBe("MIXED");
  });

  it("classifies high inflation with resilient activity before policy stress", () => {
    const result = evaluateRegime(inputs({
      inflation: 75, growth: 25, labor: 25, policyRates: 20,
      creditConditions: 20, liquidityProxy: 20,
    }, { deltaPi: 0.8 }));

    expect(result.regime).toBe("INFLATIONARY_EXPANSION");
    expect(result.assessmentStatus).toBe("NORMAL");
  });

  it("keeps mild one-sided weakness Mixed under Option B", () => {
    const result = evaluateRegime(inputs({
      inflation: 75, growth: 56, labor: 49,
    }));

    expect(result.regime).toBe("MIXED");
    expect(result.reasonCodes).toContain("no_positive_envelope");
    expect(result.ruleDiagnostics.STAGFLATIONARY.result).toBe("FALSE");
  });

  it.each([
    [70, 46],
    [46, 70],
  ])("recognizes severe one-sided weakness at G=%i, L=%i", (growth, labor) => {
    const result = evaluateRegime(inputs({
      inflation: 75, growth, labor,
    }));

    expect(result.regime).toBe("STAGFLATIONARY");
    expect(result.activitySeverity).toBe("STANDARD");
  });

  it("keeps hot inflation with severe joint weakness Stagflationary and adds its qualifier", () => {
    const result = evaluateRegime(inputs({
      inflation: 85, growth: 70, labor: 65,
    }, { deltaPi: -1.2 }));

    expect(result.regime).toBe("STAGFLATIONARY");
    expect(result.activitySeverity).toBe("CONTRACTION_LEVEL");
    expect(result.ruleDiagnostics.CONTRACTION_RECESSIONARY.result).toBe("FALSE");
  });

  it("gives robust activity/labor Mixed high clarity without counting its defining tension twice", () => {
    const result = evaluateRegime(inputs({
      inflation: 75, growth: 25, labor: 70, policyRates: 50,
      creditConditions: 40, liquidityProxy: 40,
    }, { deltaPi: 0.8 }));

    expect(result.regime).toBe("MIXED");
    expect(result.dataQuality).toBe(91);
    expect(result.sensitivity).toMatchObject({
      classification: "ROBUST",
      same: 34,
      total: 34,
      agreement: 100,
      differentResolvedRegime: false,
      differentNamedRegime: false,
    });
    expect(result.regimeClarity).toBe(98);
    expect(result.ruleDiagnostics.MIXED.support).toBe(96);
    expect(result.tensions.find((tension) => tension.code === "activity_labor_divergence")?.clarityRole)
      .toBe("DEFINING_EVIDENCE");
  });

  it("scores a stable no-positive-envelope Mixed reason independently of Data Quality", () => {
    const result = evaluateRegime(inputs({ creditConditions: 79 }));

    expect(result.regime).toBe("MIXED");
    expect(result.reasonCodes).toContain("no_positive_envelope");
    expect(result.dataQuality).toBe(91);
    expect(result.sensitivity).toMatchObject({ classification: "ROBUST", same: 34, total: 34 });
    expect(result.ruleDiagnostics.MIXED.support).toBe(50);
    expect(result.regimeClarity).toBe(78);
  });

  it("caps threshold-fragile Mixed at 49 even when Data Quality is high", () => {
    const result = evaluateRegime(inputs({
      inflation: 75, growth: 54, labor: 49,
    }));

    expect(result.regime).toBe("MIXED");
    expect(result.dataQuality).toBe(91);
    expect(result.sensitivity).toMatchObject({
      classification: "FRAGILE",
      same: 33,
      total: 34,
      agreement: 50,
    });
    expect(result.regimeClarity).toBe(49);
  });

  it("returns provisional null with candidates when bounded missing scores make identity ambiguous", () => {
    const input = inputs({ inflation: 75, growth: 50 });
    input.factors.growth = {
      ...input.factors.growth,
      bounds: { lower: 45, upper: 60 },
    };
    const result = evaluateRegime(input);

    expect(result.assessmentStatus).toBe("PROVISIONAL");
    expect(result.regime).toBeNull();
    expect(result.regimeClarity).toBeNull();
    expect(result.reasonCodes).toContain("missing_data_ambiguity");
    expect(result.candidates).toContain("INFLATIONARY_EXPANSION");
    expect(result.candidates).toContain("MIXED");
  });

  it("returns insufficient data with null regime and clarity when an anchor has no eligible families", () => {
    const input = inputs();
    input.factors.growth = family(null);
    const result = evaluateRegime(input);

    expect(result.assessmentStatus).toBe("INSUFFICIENT_DATA");
    expect(result.regime).toBeNull();
    expect(result.regimeClarity).toBeNull();
    expect(result.reasonCodes).toContain("anchor_unavailable:growth");
  });

  it("keeps Policy/Rates unclassifiable with one eligible family even when its partial bound is informative", () => {
    const input = inputs();
    input.factors.policyRates = family(72, {
      bounds: { lower: 36, upper: 86 },
      coverage: 0.5,
      eligibleFamilies: 1,
    });
    const result = evaluateRegime(input);

    expect(result.assessmentStatus).toBe("INSUFFICIENT_DATA");
    expect(result.regime).toBeNull();
    expect(result.factorReadiness.policyRates).toMatchObject({ coverage: 0.5, eligibleFamilies: 1, classifiable: false });
    expect(result.reasonCodes).toContain("anchor_unavailable:policyRates");
  });

  it("keeps the fixed quality denominator when a slot is removed", () => {
    const slots = inputs().qualitySlots;
    const full = calculateDataQuality(slots);
    const removed = calculateDataQuality(slots.map((slot, index) =>
      index === 0 ? { ...slot, eligible: false } : slot,
    ));

    expect(full).toBe(91);
    expect(removed).toBe(76);
    expect(() => calculateDataQuality(slots.slice(1))).toThrow(/weights must sum to 1/i);
  });

  it("does not let overlay fields alter the core classifier", () => {
    const core = inputs({ inflation: 75, growth: 25, labor: 25 }, { deltaPi: 0.8 });
    const baseline = evaluateRegime(core);
    const withOverlay = evaluateRegime({
      ...core,
      overlays: { indonesiaRisk: 100, energyPressure: 100, cryptoDemand: 100 },
    } as RegimeInputs);

    expect(withOverlay.regime).toBe(baseline.regime);
    expect(withOverlay.regimeClarity).toBe(baseline.regimeClarity);
    expect(withOverlay.dataQuality).toBe(baseline.dataQuality);
  });
});
