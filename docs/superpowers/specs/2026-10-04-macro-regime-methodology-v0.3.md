# Macro Regime Methodology and Data Architecture Design - Revised v0.3

**Version:** `US-MACRO-0.3-review`

**Review date:** 2026-10-04

**Scope:** three methodology patches and one bounded analytical review. No application code, source enablement, deployment or live AI integration is authorized by this document.

## 1. Executive Verdict

**APPROVE FOR IMPLEMENTATION of the specification.** All eleven patch acceptance criteria in section 14 are satisfied within the disclosed logical/synthetic review. This is not approval for public activation of unverified feeds, historical-validation claims or predictive claims. The previously agreed source, history, runtime-test and deployment acceptance conditions remain in force.

This is a normative patch to the [approved v0.2 baseline](2026-10-03-macro-regime-methodology-revised.md), not a replacement architecture. Read both as the implementation specification, with this document taking precedence on changed definitions. Baseline factor architecture, transformations, weights, coverage, fixed missing-contribution bounds, Data Quality, source governance, overlays, directions, transition triggers, history/vintage controls and deployment target remain unchanged.

## 2. Patch Summary and Authority

| Changed baseline sections | v0.3 replacement |
| --- | --- |
| 11, 14, 16-17 | Meaningful reason-specific MIXED support; clarity measures assigned-label support/stability; defining evidence is not also a clarity penalty. Transition triggers themselves are unchanged. |
| 11, 20 | Sensitivity-based caps apply to every label, with no blanket MIXED cap. |
| 12-14, 19, 21, 23-24, 26 | Primary enum/copy becomes INFLATIONARY_EXPANSION / Inflationary Expansion / Reflation. Old outputs remain historical review records, not current contracts. |
| 13-14, 20-21 | Select Stagflationary Option B; align its support and shared severe-activity threshold sensitivity. |
| 21, 24, 26 | Replace affected fixture/clarity results and patch readiness with the bounded evidence below. |

No other baseline rules are reopened. In particular: six U.S. factors; public/free reuse-cleared sources; System Liquidity Proxy; fixed missing-data possibility bounds; positive policy-compatible Goldilocks with financial vetoes; supporting-outage handling; overlay isolation; separate Leading Direction, Inflation Direction and Transition Risk; deterministic rules-generated reporting; Research Implications rather than trading instructions. Preserve the clean layout and exactly: "Educational research tool, not financial advice."

## 3. Revised Taxonomy

| API enum | Primary UI label / interpretation |
| --- | --- |
| GOLDILOCKS | Goldilocks: contained inflation, resilient activity/labor, compatible policy and observed benign financing. |
| INFLATIONARY_EXPANSION | Inflationary Expansion / Reflation: elevated or accelerating inflation alongside resilient real activity and/or labor. |
| STAGFLATIONARY | Stagflationary: hot inflation with moderate weakness in both real-economy dimensions, or severe weakness in one without clear activity/labor divergence. |
| CONTRACTION_RECESSIONARY | Contraction / Recessionary: severe joint activity/labor weakness outside HOT inflation; not official recession dating. |
| DISINFLATIONARY_SLOWDOWN | Disinflationary Slowdown: contained/non-accelerating inflation and non-severe observed activity weakness. |
| MIXED | Mixed: resolved economic divergence or a configuration outside the positive regime envelopes. Not missing-data ambiguity. |

Assessment status remains NORMAL, PROVISIONAL or INSUFFICIENT_DATA. A resolved MIXED can have high clarity and Low Transition Risk. HOT severe joint weakness is STAGFLATIONARY plus `activitySeverity=CONTRACTION_LEVEL`, never a competition with Contraction.

## 4. Revised Regime Clarity

Definition: **How stable, well-supported, and unambiguous is the assigned regime classification, including MIXED?**

`ClarityRaw = .45*W + .35*B + .20*(100-X)`

- W: conservative diagnostic support for the assigned named rule or the proved MIXED reason in section 5.
- B: 100 times the smaller single-cutoff/coherent-cutoff label agreement; baseline section 20 and section 6 below.
- X: maximum severity of residual core tensions that complicate the assigned interpretation. A tension constituting the selected MIXED support witness is recorded but not penalized again. Overlay tensions are excluded.
- Clip raw to [0,100], round to an integer, then apply section 6 caps.
- Null/unresolved or INSUFFICIENT_DATA => clarity null. Provisional but invariant classifications can have clarity; Data Quality/status disclose their limitations separately.

This remains an uncalibrated diagnostic, not a probability or forecast score. Data Quality does not enter W, B or X. Do not advertise 98 clarity as "98% confidence."

Retain all baseline tension triggers/severities and transition tests. Add a per-flag clarity role: defining evidence or residual tension. Activity/labor divergence is defining evidence when it is the selected MIXED witness. Other tensions remain residual unless a registered reason's proof actually uses that same contradiction; do not blanket-exclude all tensions for MIXED. In this patch, no other existing tension is automatically exempted.

Thus robust divergence can be clear even though its two dimensions disagree. Additional inflation-pace or credit tensions can still reduce clarity. Static tension does not automatically increase Transition Risk; changes and momentum retain the baseline rules.

## 5. Explicit MIXED Support

Use baseline helpers `low(x,T)=clip(60+2*(T-x),0,100)`, `high(x,T)=clip(60+2*(x-T),0,100)`. Support weights/slopes are disclosed heuristic diagnostics, not statistically independent evidence or calibrated probabilities.

Compute support only for **proved economic reasons after the label is invariant across missing-data completions**. Emit every proved reason and its support. Select W as the largest eligible reason support; break exact ties by canonical reason-code order. Record the selected support witness. This does not select between regime names. Robustness enters B, not W again.

### Activity / Labor Divergence

Proof: `min(G,L)<=45 AND max(G,L)>=55`.

Let a=min(G,L), z=max(G,L), gap=z-a.

`W_divergence = .40*low(a,45) + .40*high(z,55) + .20*clip(60+2*(gap-10),0,100)`

Support increases with resilience depth, weakness depth and gap size. B separately measures threshold robustness. The same divergence flag remains visible but is defining evidence, not X, when this is the selected witness.

### Restrictive Expansion

Proof: all Goldilocks **non-policy** gates hold, no other positive regime holds, and at least one policy compatibility gate is demonstrably violated. This ensures policy is the actual reason for the classification, not a convenient explanation for another failed gate.

Violations: P>55, r>1.50pp, deltaR>.50pp, deltaTarget>=.50pp, or deltaP>=8. Take the maximum support across **proved violations only**:

| Violation | Support |
| --- | --- |
| P>55 | high(P,55) |
| r>1.50 | clip(60+40*(r-1.50),0,100) |
| deltaR>.50 | clip(60+80*(deltaR-.50),0,100) |
| deltaTarget>=.50 | clip(60+80*(deltaTarget-.50),0,100) |
| deltaP>=8 | high(deltaP,8) |

`W_restrictive = .25*low(I,45) + .35*resilientSupport + .40*policyIncompatibilitySupport`

resilientSupport is the unchanged baseline max/min helper. Unknown policy values cannot prove incompatibility. Ancillary transmission tensions remain visible/residual; policy disagreement with resilient activity is the reason itself, not an additional automatic penalty.

### Intermediate Inflation / No Positive Envelope

For proved `I>45 AND NOT HOT`, let U=50 if deltaPi>=.30pp, otherwise U=60. Require the relevant native comparison to be known, or prove the same branch/result conservatively across completions.

`W_intermediate = 40 + 20*clip(2*min(I-45,U-I)/(U-45),0,1)`

Support ranges 40-60, peaking away from the bounding inflation gates. Do not assign this reason if another named positive rule is valid.

For a resolved configuration with no named envelope and no more specific proved reason, `W_no_positive_envelope=50`. This moderate support acknowledges a stable taxonomic gap without inventing a new regime. A robust gap can have clarity 78: that means the MIXED assignment is stable, not that the economy has a positive macro outlook.

### Multiple Proved Regimes / Configuration Conflict

A genuine economic overlap, if validated against the exact approved gates, has diagnostic `W_overlap=min(support of all proved rules)`; sensitivity B and residual X still apply. Contradictory rule identities alone are not low-quality data.

However, the **current v0.3 positive envelopes are mutually exclusive** (section 11). Genuine multiple-rule support is therefore unreachable in the valid configuration. A multiple-proved result in this version is an invariant/configuration defect, not evidence of a well-supported mixed economy. Preserve the existing diagnostic reason `rule_configuration_conflict`, force assigned W=0 even if another MIXED reason is present, record residual integrity severity100, and block publication until repaired. Even perfect threshold agreement then gives at most35 clarity, not a well-supported economic classification. Do not create a new overlapping regime or an overlap auction in this patch.

### Missing Evidence Guard

Fixed original-weight bounds and shared-input dependencies from baseline section 9 remain mandatory. Use conservative support over admissible completions: the minimum assigned-label support, and the maximum residual tension severity, not normalized display estimates. If label ambiguity exists, currentRegime=null and clarity=null before calculating MIXED support. Missing anchors still produce INSUFFICIENT_DATA.

A "no positive envelope" reason requires resolved negative gates; unknown is not false. The label must remain invariant, including when different completions establish different MIXED reasons. Never let support manufacture that proof.

## 6. Sensitivity and Caps

Keep the 16-cutoff / 34-case matrix: each score cutoff +/-5 (32 cases), then all +/-5 (2 cases). Shared thresholds shift together within each scenario.

The former contraction-Growth65 cutoff is now explicitly named **severe activity65** (`aSevere`). It controls both one-sided Stagflationary branches and the Growth component of joint contraction severity. Labor's joint contraction60 cutoff stays distinct. This is a shared severity band, not a seventeenth independently tuned parameter.

All other baseline cutoffs are unchanged. Divergence shares resilient-first45 / weak55; moderate joint Stagflationary weakness shares weak55 for G and L. Baseline B and robustness definitions remain unchanged:

| Classification sensitivity | Clarity cap, all regime labels |
| --- | --- |
| ROBUST: all 34 preserve identity | No automatic cap |
| MODERATELY SENSITIVE: min agreement>=.80, some differ, no named-to-different-named switch | 69 |
| FRAGILE: otherwise | 49 |

A 33/34 result can be FRAGILE: one changed coherent case means coherent agreement .50 and B50. MIXED-to-named changes count, unresolved outcomes count as different, and no scenario is dropped.

Retain native-policy/inflation guard sensitivity and family-removal diagnostics. Any tested native guard identity change makes the overall classification FRAGILE/capped49, regardless of label. Support-slope changes are support diagnostics, not label selection or threshold fitting.

## 7. Inflationary Expansion Definition

**"Elevated or accelerating inflation alongside resilient real activity and/or labor."**

Operational gate, unchanged except name: `HOT AND RESILIENT AND NOT ACTIVITY_DIVERGENCE`.

HOT=`I>=60 OR (I>=50 AND deltaPi>=.30pp)`.
RESILIENT=`(G<=45 AND L<=50) OR (L<=45 AND G<=50)`.

This does not prove an output gap, demand overheating, excess aggregate demand or unsustainable capacity utilization. A supply-related price shock can coexist with resilient activity; this classifier does not identify its cause. "Reflation" is descriptive here, not proof of a particular demand mechanism. Low-level accelerating inflation below the HOT floor remains an Inflation Direction qualifier, not automatically this regime.

No policy, credit or liquidity stress prerequisite is added. High but cooling inflation can still qualify through the level gate. Diagnostic support stays `.50*hotSupport+.50*resilientSupport`, with the baseline helpers. Research/report wording must describe the observed configuration and relevant counter-signals, not assert a causal overheating story. No new demand-overheating module.

## 8. Selected Stagflationary Gate

**Select Option B.**

`HOT AND ((G>=55 AND L>=55) OR G>=65 OR L>=65) AND NOT ACTIVITY_DIVERGENCE`

Meaning: moderate weakness must be broad; severe weakness in either major real-economy dimension is sufficient unless the other is clearly resilient, in which case the divergence is genuinely MIXED.

Align support:

`weaknessSupport = max(min(high(G,55),high(L,55)), high(G,65), high(L,65))`

`W_stagflationary = .50*hotSupport + .50*weaknessSupport`

Support cannot override failed gates. No finance prerequisite. Joint `G>=65 AND L>=60` gives activitySeverity=CONTRACTION_LEVEL. Contraction remains that joint gate **AND NOT HOT**. Severe one-sided weakness alone does not imply the joint contraction qualifier.

All Goldilocks, Contraction and Disinflationary Slowdown gates otherwise remain exactly as baseline section 13.

## 9. Alternatives Comparison

Option A is the prior HOT + (G>=55 OR L>=55) + no divergence rule. Option C was tested as the simple equal-weight `(G+L)/2>=60` + HOT + no divergence rule; it is a comparison only, not a seventh factor.

| Required case (I/G/L) | Option A | Option B, selected | Option C |
| --- | --- | --- | --- |
| A: 75/56/49 | Stagflationary | MIXED: mild one-sided weakness | MIXED |
| B: 75/56/56 | Stagflationary | Stagflationary: moderate joint weakness | MIXED |
| C: 75/70/45 | MIXED: divergence | MIXED: divergence | MIXED: divergence |
| D: 75/45/70 | MIXED: divergence | MIXED: divergence | MIXED: divergence |
| E: 85/70/65 | Stagflationary + contraction-level | Stagflationary + contraction-level | Stagflationary + contraction-level |
| F: 65/52/52 | MIXED: intermediate activity | MIXED: intermediate activity | MIXED |
| G: D repeated, divergence active | MIXED | MIXED | MIXED |

D and G are intentionally identical controls; the divergence guard was active for every option, never temporarily disabled. None of these seven cases has sufficiently resilient activity for Inflationary Expansion. The existing 75/25/25 fixture does.

A is too permissive for the requested semantics at56/49. B excludes that case while accepting56/56. C60 masks both moderate joint weakness and severe one-sided deterioration:70/46 and46/70 are Stagflationary under B, but MIXED under C (mean58). Lowering C to55 accepts56/56, but also admits62/48 (mean55), where neither broad moderate weakness nor one severe dimension is proved; B correctly keeps that case MIXED. This is an averaging trade-off, not the requested explicit broad-moderate/severe-one-sided distinction. Do not tune a new weighted threshold.

Sensitivity (assigned-label agreement, not probability):

| Case | A / 34 | B / 34 | C / 36 |
| --- | --- | --- | --- |
| A | 31, FRAGILE | 34, ROBUST | 36, ROBUST |
| B | 32, FRAGILE | 32, FRAGILE | 34, FRAGILE |
| C / D / G, each | 32, FRAGILE | 32, FRAGILE | 35, FRAGILE |
| E | 34, ROBUST | 34, ROBUST | 36, ROBUST |
| F | 32, FRAGILE | 32, FRAGILE | 36, ROBUST |

C adds its comparison-only weighted threshold +/-5, giving34 single cases plus2 coherent cases; its coherent shifts include that threshold. Do not compare these counts as calibrated accuracy. Joint weakness at56/56 and divergence exactly at45 remain boundary-sensitive under B, correctly disclosed rather than smoothed away.

Selection is based on the requested semantics, transparent branches, synthetic separation and edge cases, **not an October 2026 answer**. A full revised-history comparison was unavailable and not run. No historical superiority or predictive performance is claimed. Retain the already approved pre-activation historical diagnostic; source episode spot checks cannot decide this gate comparison.

## 10. Updated Synthetic Fixtures

All 18 fixtures and exact perturbation results are in [v0.3 review evidence](2026-10-04-macro-regime-v0.3-evidence.json). Inputs are synthetic scores, not market observations. Defaults: deltaPi/deltaP/deltaR/deltaTarget=0, r=1pp, fewer than3 worsening momenta, other core tensions absent. P/C/Q as shown. Complete/fresh/reuse-cleared, runtime-sufficient evidence with >=5-year reference history is assumed; f=r(metadata)=health=e=1 and history completeness h=.55 gives Data Quality91 for every fixture.

| I/G/L/P/C/Q | Result under v0.3 | Sensitivity / clarity |
| --- | --- | --- |
| 30/25/30/30/25/35 | GOLDILOCKS | ROBUST34/34;99 |
| 75/25/25/20/20/20, deltaPi=.8 | INFLATIONARY_EXPANSION, before policy response | ROBUST34/34;98 |
| 85/25/30/30/25/25, deltaPi=-1.2 | INFLATIONARY_EXPANSION, still-high cooling inflation | ROBUST34/34;100 |
| 75/65/65/20/20/20 | STAGFLATIONARY + contraction-level, calm finance | ROBUST34/34;93 |
| 85/70/65/30/25/25, deltaPi=-1.2 | STAGFLATIONARY + contraction-level | ROBUST34/34;96 |
| 30/85/80/30/20/20 | CONTRACTION_RECESSIONARY | ROBUST34/34;100 |
| 30/58/52/50/45/45, deltaPi=-.5 | DISINFLATIONARY_SLOWDOWN | ROBUST34/34;92 |
| 75/25/70/50/40/40, deltaPi=.8 | MIXED: strong activity/labor divergence | ROBUST34/34;98 |
| 30/25/30/75/25/25, r=3 | MIXED: restrictive expansion | ROBUST34/34;99 |
| 30/25/30/50/25/25, r=3 | MIXED: native restriction despite diluted score | ROBUST34/34;99 |
| 30/25/30/50/25/25, r=1.2, deltaR=.8 | MIXED: real tightening | ROBUST34/34;96 |
| 30/25/30/30/79/25 | MIXED: financial veto/no positive envelope | ROBUST34/34;78 |
| 45/45/50/55/50/55 | GOLDILOCKS at boundaries | FRAGILE28/34;49 |
| 52/25/30/20/20/20, deltaPi=.8 | INFLATIONARY_EXPANSION at inflation floor | FRAGILE32/34;49 |
| 25/25/30/20/20/20, deltaPi=.8 | MIXED with reflation direction, below HOT floor | ROBUST34/34;78 |
| 75/54/49/30/25/25 | MIXED: near resilient envelope | FRAGILE33/34;49 |
| 75/70/46/30/25/25 | STAGFLATIONARY: severe growth weakness | FRAGILE32/34;49 |
| 75/46/70/30/25/25 | STAGFLATIONARY: severe labor weakness | FRAGILE32/34;49 |

Explicit robust MIXED arithmetic: W=.4*100+.4*90+.2*100=96; B100; divergence is defining, X0; raw98.2 =>98. Data Quality91. All120 rule permutations preserve the classification.

Explicit fragile MIXED: W50; single agreement32/32, coherent1/2; B50; raw60 =>cap49. The all+5 scenario changes to INFLATIONARY_EXPANSION. Data Quality remains91; all120 rule permutations preserve its **baseline** MIXED label. Order independence is not threshold robustness.

Add an unrelated residual inflation-pace tension40 to the robust MIXED: clarity falls to90, while Data Quality stays91. Support slopes1.5/2/2.5 give robust MIXED clarity95/98/100 and fragile MIXED49/49/49. High clarity is a property of the assigned label, not evidence that all economic signals agree.

## 11. Bounded Red-Team Findings

One targeted in-memory worksheet was run; no application module was created.

- 18 fixtures x34 score cases =612 evaluations.
- Seven required cases across A/B/C =728 score sensitivity evaluations (34+34+36 per case).
- 120 permutations per fixture and per required-case/option =4,680 evaluations; zero differences in label, reasons, proved-rule diagnostics or severity.
- A disclosed17,640-case I/G/L/inflation-momentum grid under the selected rule had zero simultaneous positive regimes and zero HOT severe-joint failures.
- Eight native-guard perturbations per main fixture =144 evaluations; none changed these fixture identities. These inputs do not exhaust native-boundary behavior.
- Two missing-Credit sweeps,21 completions each. Inflationary Expansion is invariant; contained/resilient has both GOLDILOCKS and MIXED candidates, so currentRegime=null, status PROVISIONAL, clarity=null.
- The original .40/.30/.30 missing-weight counterexample remains: removal yields bounds[12,52], not proof of score<=45.
- Fixed-denominator quality calculation rerun:64 masks /192 deletion edges; zero increases. This is not an exhaustive slot-level production test.

| Targeted concern | Finding / disposition |
| --- | --- |
| Robust MIXED automatically unclear | Fixed: divergence evidence supports W96 and clarity98, with Data Quality91. |
| Fragile MIXED mislabeled high clarity | Fixed: coherent identity change produces B50 and cap49 despite Data Quality91. |
| Missing evidence treated as economic MIXED | Not permitted: candidate disagreement returns Provisional/null before support; fixed possibility bounds remain authoritative. |
| Causal overheating overclaim | Removed from primary enum/copy and research interpretation; measured configuration only. |
| Calm finance blocks inflationary expansion | No: 75/25/25 before policy response remains INFLATIONARY_EXPANSION. |
| Mild single weakness becomes stagflation | B rejects56/49; multiple moderate dimensions or one severe dimension are required. |
| Severe one-sided weakness lost | B admits70/46 and46/70; neither receives joint contraction severity. |
| Clearly resilient versus severe weak dimension | Still MIXED at70/45 or45/70; small divergence-boundary changes are surfaced as fragility. |
| Inflationary Expansion / Stagflationary overlap | Impossible at base gates: RESILIENT has one<=45 and other<=50; B requires both>=55 or one>=65. |
| HOT Stagflationary / Contraction overlap | Impossible: Contraction requires NOT HOT; HOT joint severe weakness satisfies B and receives the qualifier. |
| Multiple proved rules gain spurious clarity | Current mutually exclusive gates make this an integrity failure; no support auction or order dependence. |
| Defining tension hidden entirely | No: still recorded and used in transition/commentary; only its duplicate clarity penalty is removed. Residual tension test still lowers clarity. |

The grid and sweeps are bounded synthetic examples, not a full continuous-domain/dependency solver. Structural separation proves the stated base-gate exclusions; production still must test shared missing-input identities and conservative support over completions. Overlays are absent from the core worksheet inputs; full UI/API overlay-isolation tests remain unchanged required work.

## 12. API / Schema Migration

Preserve planned schemaVersion2; methodologyVersion becomes `US-MACRO-0.3`. No application schema or handler is changed in this pass.

- Migrate legacy `OVERHEATING_REFLATION -> INFLATIONARY_EXPANSION` at the read/migration boundary for stored records. Preserve original methodology/version/raw record for audit; do not pretend recomputed history.
- Emit only the new enum/UI label for new v0.3 assessments, fixtures, rule diagnostics, API responses, reports, Research Implications and historical diagnostic exports.
- Add MIXED reason support and selected support witness to ruleDiagnostics. Named regimes have no selected MIXED witness. Retain failed/unknown gates; no support-driven regime selection.
- Record defining/residual clarity role alongside existing tension evidence/scope/severity. Record W/B/X, raw/capped clarity and sensitivity classification in diagnostic output.
- Keep currentRegime/regimeClarity nullable. Do not fill null with MIXED or0. Keep Data Quality, status, directions, transition, overlays and timestamps separate.
- Use shared `aSevere=65` in v0.3 diagnostic configuration, replacing the old worksheet alias gContract while retaining distinct lContract60. Explicitly state this shared band in sensitivity exports.
- When later implementing, update lib/types.ts, lib/scoring.ts, lib/playbook.ts/research semantics, server evaluator, both API/report paths, UI copy, tests/fixtures and README together. Page/API must share the same core assessment.

Frozen v0.2 documents/evidence retain their old strings/numbers as dated records. They must not feed new outputs. This patch supersedes their MIXED91/41 example and old primary label; no broad historical recalculation has been performed.

## 13. Remaining Conditions

No methodological design question is reopened by this patch. Preserve the existing acceptance work:

1. Verify exact source identifiers/contracts, BEA/Census/Fed historical ingestion, native units/seasonality, release metadata and Treasury reuse evidence before enabling sources. Leave unresolved optional overlays blocked.
2. Run the full CURRENT / REVISED-HISTORY diagnostic, including A/B comparison, duration/flips, contributions, gaps, sensitivity and prolonged MIXED. Latest revised values are not point-in-time vintages. Material implausibility requires a disclosed version change, not fitting to today's desired label.
3. Reproduce all patched fixtures and baseline missing/derived-data, quality-monotonicity, overlay-isolation, source parser and vintage invariants in application tests. Generic normalization must never replace fixed missing bounds.
4. Run tests, lint, TypeScript checking and build after actual application implementation; verify the existing Netlify deployment before activation. None was needed or run for this documentation-only patch.

True point-in-time storage/validation remains later scoped work. No predictive/backtest claim, real trade execution, brokerage integration, paid feed or live OpenAI call is introduced.

## 14. Final Recommendation

**APPROVE FOR IMPLEMENTATION.** The minor methodology inconsistencies are resolved. Production activation remains conditional on section 13; this recommendation does not claim empirical validation or authorize application edits in this pass.

- [x] MIXED no longer automatically low-clarity.
- [x] High-quality robust MIXED produces high clarity.
- [x] Data ambiguity cannot masquerade as economic MIXED.
- [x] Regime Clarity remains separate from Data Quality.
- [x] Causal overheating language removed from the primary label.
- [x] Inflationary Expansion detectable before policy/credit stress.
- [x] Mild one-sided weakness is insufficient for Stagflationary.
- [x] Severe one-sided weakness is coherently handled, with divergence preserved.
- [x] Inflationary Expansion, Stagflationary and Contraction remain mutually interpretable.
- [x] No rule-order dependence introduced.
- [x] Approved coverage, fixed missing bounds, source, overlay and vintage controls retained.

**No application implementation code was written.**
