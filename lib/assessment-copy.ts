import type { RegimeAssessment, RegimeFactorKey } from "@/lib/types";

const anchors = ["inflation", "growth", "labor", "policyRates"] as const;
const supporting = ["creditConditions", "liquidityProxy"] as const;
const labels: Partial<Record<RegimeFactorKey, string>> = {
  inflation: "Inflation", growth: "Growth", labor: "Labor", policyRates: "Policy / Rates",
};

export function withheldRegimeExplanation(assessment: RegimeAssessment): string {
  const readiness = assessment.factorReadiness;
  const anchorCount = anchors.filter((key) => readiness[key].classifiable).length;
  const supportingCount = supporting.filter((key) => readiness[key].classifiable).length;
  const coverage = `${anchorCount}/4 mandatory anchors and ${supportingCount}/2 supporting factors are classifiable.`;
  if (assessment.assessmentStatus !== "INSUFFICIENT_DATA") {
    return `No regime could be established from the admissible evidence. ${coverage}`;
  }
  const missing = anchors.filter((key) => !readiness[key].classifiable).map((key) => {
    const factor = readiness[key];
    return `${labels[key]} (${Math.round(factor.coverage * 1000) / 10}% coverage, ${factor.eligibleFamilies}/${factor.configuredFamilies} eligible families)`;
  });
  return `Assessment evidence requirements are not met; no regime is assigned. ${coverage}${missing.length ? ` Unclassifiable anchors: ${missing.join("; ")}.` : ""}`;
}
