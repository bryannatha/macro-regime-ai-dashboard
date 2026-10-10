import React from "react";
import { Badge } from "@/components/ui/badge";
import { withheldRegimeExplanation } from "@/lib/assessment-copy";
import { REGIME_LABELS } from "@/lib/regime";
import { REGIMES } from "@/lib/types";
import type { DashboardPayload, RegimeAssessment, RegimeFactorKey } from "@/lib/types";

const anchors = ["inflation", "growth", "labor", "policyRates"] as const;
const supporting = ["creditConditions", "liquidityProxy"] as const;
const namedRegimes = REGIMES.filter((regime) => regime !== "MIXED");
const disclosureClass = "mt-3 border-t border-slate-100 pt-3 text-xs leading-5 text-slate-600";
const summaryClass = "cursor-pointer rounded text-xs font-medium text-teal-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-teal-600";

type FactorLabels = Record<RegimeFactorKey, string>;

function percent(value: number): string {
  return `${new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 }).format(value * 100)}%`;
}

function regimeSummary(assessment: RegimeAssessment): string {
  if (!assessment.regime) return withheldRegimeExplanation(assessment);
  if (assessment.regime === "MIXED") {
    const allFalse = namedRegimes.every((key) => assessment.ruleDiagnostics[key]?.result === "FALSE");
    return allFalse
      ? "The evaluated evidence falls outside every named regime's positive envelope. MIXED is a resolved economic configuration, not a missing-data fallback or proof of economic agreement."
      : "Mixed is the reported regime. Some named-rule evidence is UNKNOWN or unavailable; a complete gate-by-gate explanation cannot be established from this snapshot.";
  }
  const label = REGIME_LABELS[assessment.regime];
  return assessment.ruleDiagnostics[assessment.regime]?.result === "TRUE"
    ? `${label} is assigned: its positive rule is proven TRUE in this snapshot. This is descriptive, not predictive.`
    : `${label} is the reported regime; its positive rule is not confirmed TRUE by the available diagnostics. Detailed attribution is unavailable.`;
}

function coverageLimits(assessment: RegimeAssessment, labels: FactorLabels): string[] {
  const readiness = assessment.factorReadiness;
  const limits = anchors.filter((key) => readiness[key].coverage < 0.8).map((key) =>
    `${labels[key]}: ${percent(readiness[key].coverage)} coverage, below the 80% NORMAL requirement.`);
  if (supporting.every((key) => readiness[key].coverage < 0.8)) {
    limits.push(`Neither supporting factor reaches 80% coverage (${supporting.map((key) => `${labels[key]} ${percent(readiness[key].coverage)}`).join("; ")}).`);
  } else if (!supporting.some((key) => readiness[key].classifiable && readiness[key].coverage >= 0.8)) {
    limits.push("No supporting factor meets both classifiability and 80% coverage requirements.");
  }
  if (assessment.inflationDirection.deltaPi === null) {
    limits.push("The native inflation-change comparison is unavailable.");
  } else if (assessment.reasonCodes.includes("required_native_comparison_unavailable")) {
    limits.push("The evaluator records an unavailable required native comparison; individual attribution is unavailable.");
  }
  return limits;
}

function RecordedEvidence({ assessment }: { assessment: RegimeAssessment }) {
  return (
    <>
      <div className="mt-3 font-medium text-slate-700">Recorded reason codes</div>
      {assessment.reasonCodes.length ? (
        <ul className="mt-1 space-y-1">
          {assessment.reasonCodes.map((reason) => <li className="break-words font-mono text-[11px]" key={reason}>{reason}</li>)}
        </ul>
      ) : <p className="mt-1">No recorded reason codes.</p>}
      <div className="mt-3 font-medium text-slate-700">Recorded tensions / opposing evidence</div>
      {assessment.tensions.length ? (
        <ul className="mt-1 space-y-2">
          {assessment.tensions.map((tension) => (
            <li className="break-words" key={`${tension.scope}:${tension.code}`}>
              <span className="font-mono text-[11px]">{tension.code}</span>: severity {tension.severity}/100; {tension.scope}; {tension.clarityRole}.
            </li>
          ))}
        </ul>
      ) : <p className="mt-1">No tensions recorded; this does not prove economic agreement.</p>}
    </>
  );
}

function RegimeExplanation({ assessment }: { assessment: RegimeAssessment }) {
  const verdicts = namedRegimes.map((key) => assessment.ruleDiagnostics[key]?.result);
  return (
    <div className="min-w-0 rounded-lg border border-slate-200 bg-white p-4">
      <h4 className="text-sm font-semibold text-slate-900">Why this regime?</h4>
      <p className="mt-2 text-xs leading-5 text-slate-600">{regimeSummary(assessment)}</p>
      <p className="mt-2 text-[11px] text-slate-500">
        Named gates: {verdicts.filter((value) => value === "TRUE").length} TRUE / {verdicts.filter((value) => value === "FALSE").length} FALSE / {verdicts.filter((value) => value === "UNKNOWN").length} UNKNOWN
        {verdicts.some((value) => !value) && ` / ${verdicts.filter((value) => !value).length} unavailable`}.
      </p>
      <details className={disclosureClass}>
        <summary className={summaryClass}>Rule evidence and caveats</summary>
        <dl className="mt-3 space-y-3">
          {namedRegimes.map((key) => {
            const rule = assessment.ruleDiagnostics[key];
            return (
              <div data-rule={key} key={key}>
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <dt className="max-w-[75%] font-medium text-slate-700">{REGIME_LABELS[key]}</dt>
                  <dd><Badge variant={rule?.result === "TRUE" ? "positive" : rule?.result === "FALSE" ? "outline" : "caution"} className="text-[10px]">{rule?.result ?? "Unavailable"}</Badge></dd>
                </div>
                {rule && <dd className="mt-1 break-words text-[11px]">Diagnostic support: {new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 }).format(rule.support)}/100{rule.failedOrUnknownGates.length ? `; ${rule.failedOrUnknownGates.join(", ")}` : ""}.</dd>}
              </div>
            );
          })}
        </dl>
        <p className="mt-3">FALSE disproves the top-level positive envelope. UNKNOWN means it is not established, not false. Individual predicate attribution is unavailable; these verdicts do not identify a specific failed predicate. Support is not a probability.</p>
        <RecordedEvidence assessment={assessment} />
      </details>
    </div>
  );
}

function QualityExplanation({ assessment, labels }: { assessment: RegimeAssessment; labels: FactorLabels }) {
  const readiness = assessment.factorReadiness;
  const anchorCount = anchors.filter((key) => readiness[key].classifiable).length;
  const supportCount = supporting.filter((key) => readiness[key].classifiable).length;
  const totalCount = Object.values(readiness).filter((factor) => factor.classifiable).length;
  const provisional = assessment.assessmentStatus === "PROVISIONAL";
  const limits = provisional ? coverageLimits(assessment, labels) : [];
  return (
    <div className="min-w-0 rounded-lg border border-slate-200 bg-white p-4">
      <h4 className="text-sm font-semibold text-slate-900">Why this assessment status?</h4>
      <p className="mt-2 text-xs leading-5 text-slate-600">
        {assessment.assessmentStatus === "NORMAL"
          ? "The evaluator reports NORMAL quality for the required evidence set. This is separate from the economic regime and threshold sensitivity."
          : provisional
            ? "Provisional describes assessment quality, not economic disagreement. Visible limitations are not an exhaustive account of every unmet NORMAL requirement."
            : "Mandatory evidence requirements are not met or the evaluator reports a rule-configuration conflict. No regime is assigned."}
      </p>
      {limits.length > 0 && <ul className="mt-2 space-y-1.5 text-xs leading-5 text-slate-700">{limits.map((limit) => <li key={limit}>{limit}</li>)}</ul>}
      {provisional && <p className="mt-2 text-[11px] leading-4 text-slate-500">Factor-level history and release-quality diagnostics are unavailable in this payload.</p>}
      <details className={disclosureClass}>
        <summary className={summaryClass}>Required evidence and quality limits</summary>
        <p className="mt-3">{anchorCount}/4 mandatory anchors and {supportCount}/2 supporting factors are classifiable; {totalCount}/6 total.</p>
        <ul className="mt-2 space-y-1.5">
          {[...anchors, ...supporting].map((key) => (
            <li key={key}>{labels[key]} ({anchors.some((anchor) => anchor === key) ? "mandatory anchor" : "supporting factor"}): {readiness[key].status}, {percent(readiness[key].coverage)} coverage, {readiness[key].eligibleFamilies}/{readiness[key].configuredFamilies} eligible families; {readiness[key].classifiable ? "classifiable" : "not classifiable"}.</li>
          ))}
        </ul>
        <p className="mt-3">NORMAL requires all four anchors and at least one supporting factor, at least five total classifiable factors, and at least 80% coverage for the required factors. Required history and release metadata must meet the 5-year reference history and release quality of at least 0.8 requirements. Required native comparisons must be known and the label invariant across admissible missing contributions.</p>
        <p className="mt-3">Source availability, factor classifiability and NORMAL-quality eligibility are distinct. An unused supporting-factor outage alone need not block NORMAL. Factor-level history and release-quality diagnostics and most individual native comparisons are unavailable here; coverage alone cannot prove NORMAL eligibility. Missing-input invariance is separate from threshold sensitivity.</p>
      </details>
    </div>
  );
}

function SensitivityExplanation({ assessment }: { assessment: RegimeAssessment }) {
  const sensitivity = assessment.sensitivity;
  const label = sensitivity?.classification.replaceAll("_", " ");
  return (
    <div className="min-w-0 rounded-lg border border-slate-200 bg-white p-4">
      <h4 className="text-sm font-semibold text-slate-900">What makes the result sensitive?</h4>
      <p className="mt-2 text-xs leading-5 text-slate-600">
        {sensitivity
          ? `${label}: the evaluator reports ${sensitivity.same}/${sensitivity.total} score-cutoff checks retaining the current label. These are deterministic checks, not probabilities, confidence or predictive accuracy.`
          : "Sensitivity evidence is unavailable for this assessment; no threshold cause can be attributed."}
      </p>
      {sensitivity && <div className="mt-2 space-y-1 text-xs text-slate-700">
        <p>Individual-cutoff agreement: {percent(sensitivity.singleAgreement / 100)}</p>
        <p>Coherent-shift agreement: {percent(sensitivity.coherentAgreement / 100)}</p>
      </div>}
      <details className={disclosureClass}>
        <summary className={summaryClass}>Sensitivity checks and attribution limits</summary>
        <p className="mt-3">The frozen checks vary 16 score cutoffs individually by +/-5 (32 checks), then shift all cutoffs together by +/-5 (2 checks). Separate native-guard variants are tested. An unresolved result counts as disagreement, not a different resolved regime.</p>
        {sensitivity && <ul className="mt-3 space-y-1">
          <li>Native guard changed the result: {sensitivity.nativeGuardChanged ? "Yes" : "No"}</li>
          <li>Another resolved regime appeared: {sensitivity.differentResolvedRegime ? "Yes" : "No"}</li>
          <li>Another named regime appeared: {sensitivity.differentNamedRegime ? "Yes" : "No"}</li>
          <li>Conservative agreement (smaller of the two score-cutoff summaries): {percent(sensitivity.agreement / 100)}</li>
        </ul>}
        <p className="mt-3">FRAGILE indicates a native-guard change, score-cutoff agreement below 80%, or a switch from one named regime to another. ROBUST retains the label across all score-cutoff checks without those fragility triggers; other results are MODERATELY SENSITIVE.</p>
        <p className="mt-3">Factor-specific sensitivity attribution is unavailable. The payload does not identify individual changed rules, factor intervals, threshold distances or the candidate for each perturbation; none are inferred here.</p>
      </details>
    </div>
  );
}

export function AssessmentExplanation({ payload, factorLabels }: { payload: DashboardPayload; factorLabels: FactorLabels }) {
  return (
    <section aria-labelledby="assessment-explanation-title" className="space-y-3" data-snapshot-id={payload.generatedAt} data-assessment-status={payload.regime.assessmentStatus} data-regime={payload.regime.regime ?? ""}>
      <div>
        <h3 id="assessment-explanation-title" className="text-sm font-semibold text-slate-800">Understand this assessment</h3>
        <p className="mt-1 text-[11px] text-slate-500">Read-only explanations from the same evaluated snapshot as the overview and Daily Rules Brief.</p>
      </div>
      <div className="grid items-start gap-3 md:grid-cols-2 lg:grid-cols-3">
        <RegimeExplanation assessment={payload.regime} />
        <QualityExplanation assessment={payload.regime} labels={factorLabels} />
        <SensitivityExplanation assessment={payload.regime} />
      </div>
    </section>
  );
}
