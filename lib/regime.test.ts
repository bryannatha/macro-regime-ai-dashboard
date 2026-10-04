import { describe, expect, it } from "vitest";
import {
  calculateDataQuality,
  evaluateRegime,
  REGIMES,
  REGIME_LABELS,
} from "@/lib/regime";
import type { RegimeInputs } from "@/lib/types";

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

describe("US macro regime v0.3", () => {
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
