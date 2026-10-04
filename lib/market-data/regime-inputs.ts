import type { RegimeFactorInput, RegimeFactorKey, RegimeInputs } from "@/lib/types";
import type { CoreFactorsResult } from "./types";
import { toQualitySlots, toRegimeFactorInputs } from "./core-factors";

export const TREASURY_POLICY_BLOCKER = "POLICY_RATES_WITHHELD — TREASURY_REUSE_UNRESOLVED";

const factorKeys: RegimeFactorKey[] = [
  "inflation",
  "growth",
  "labor",
  "policyRates",
  "creditConditions",
  "liquidityProxy",
];

function unavailableFactor(): RegimeFactorInput {
  return {
    bounds: null,
    coverage: 0,
    eligibleFamilies: 0,
    historyYears: null,
    releaseQuality: null,
  };
}

export function createUnconfiguredRegimeInputs(sourceBlockers: string[] = []): RegimeInputs {
  return {
    factors: Object.fromEntries(factorKeys.map((key) => [key, unavailableFactor()])) as RegimeInputs["factors"],
    native: {
      deltaPi: null,
      realPolicyRate: null,
      deltaR: null,
      deltaTarget: null,
      deltaP: null,
      worseningMomenta: null,
      coreYoYChange: null,
      creditStressChange: null,
      liquidityStressChange: null,
      creditStandards: null,
      creditVolume: null,
    },
    qualitySlots: factorKeys.map(() => ({
      weight: 1 / factorKeys.length,
      eligible: false,
      freshness: 0,
      history: 0,
      release: 0,
      fetchHealth: 0,
    })),
    sourceMomentum: null,
    priorTensionComparison: null,
    sourceBlockers: [...sourceBlockers],
  };
}

export function createRegimeInputsFromCoreFactors(core: CoreFactorsResult): RegimeInputs {
  const treasuryReuseBlocked = core.factors.policyRates.families
    .filter((item) => item.key === "realFinancing")
    .flatMap((item) => item.slots)
    .some((item) => item.sourceIds.includes("treasury-real-yield") &&
      item.reason?.toLowerCase().includes("redistribution is blocked"));
  return {
    factors: toRegimeFactorInputs(core.factors),
    native: core.native,
    qualitySlots: toQualitySlots(core.factors),
    sourceMomentum: null,
    priorTensionComparison: null,
    sourceBlockers: treasuryReuseBlocked ? [TREASURY_POLICY_BLOCKER] : [],
  };
}
