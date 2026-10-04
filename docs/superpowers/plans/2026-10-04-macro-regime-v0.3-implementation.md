# Macro Regime v0.3 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement the approved v0.3 classifier contract and expose only supported, source-backed dashboard assessments.

**Architecture:** Keep the current public-feed indicator cards as clearly labeled monitoring proxies. Add a pure six-factor regime evaluator with fixed missing bounds, deterministic rules, reason-based MIXED support, sensitivity, and separate quality/clarity. Current adapters do not establish the six factor families, so the service will mark those inputs unavailable and publish no invented regime or research implications.

**Tech Stack:** Next.js 15 App Router, TypeScript, Tailwind, React, Vitest, existing server-only public-source adapters.

**Spec:** `docs/superpowers/specs/2026-10-04-macro-regime-methodology-v0.3.md`, inheriting unchanged definitions from `docs/superpowers/specs/2026-10-03-macro-regime-methodology-revised.md`.

## Global Constraints

- Keep overlays outside the U.S. core classifier and preserve source statuses/provenance.
- The classifier requires the six registered factors: Inflation, Growth, Labor, Policy/Rates, Credit Conditions, and System Liquidity Proxy.
- Missing inputs produce unresolved/provisional or insufficient status, never economic MIXED.
- Keep fixed missing-contribution bounds; never renormalize them for a gate.
- Use enum `INFLATIONARY_EXPANSION`; the UI label is “Inflationary Expansion / Reflation.”
- Report content is deterministic and rules-generated, not an OpenAI call.
- Research Implications contain questions, counter-signals, uncertainties, and guardrails; no favor/reduce or trading directions.
- Keep the exact disclaimer: “Educational research tool, not financial advice.”
- Preserve the five public monitoring cards while explicitly keeping them outside the regime factor contract until source mapping is approved.

## Review Focus

- Six-factor inputs absent from the current feed catalog must withhold the regime with clear missing-factor reasons.
- HOT severe joint weakness stays STAGFLATIONARY with a contraction-level qualifier.
- Moderate single-dimension weakness such as I75/G56/L49 stays MIXED.
- Robust and fragile MIXED fixtures separate clarity from Data Quality and honor 34-case caps.
- Overlays and existing public proxy scores cannot change the core classifier result.

---

### Task 1: Pure Regime Engine

**Files:** Create `lib/regime.ts`, `lib/regime.test.ts`; modify `lib/types.ts`, `lib/scoring.ts`, `lib/scoring.test.ts`.

**Interfaces:**
- `RegimeFactorKey = inflation | growth | labor | policyRates | creditConditions | liquidityProxy`.
- Each factor carries `bounds: { lower, upper } | null`, coverage, eligible-family count, history years, and release quality.
- `RegimeInputs` contains all six factors plus native `deltaPi`, `realPolicyRate`, `deltaR`, `deltaTarget`, `deltaP`, and `worseningMomenta`, each nullable.
- `evaluateRegime(inputs): RegimeAssessment` returns assessment status, nullable enum, nullable clarity, Data Quality, candidates, reason codes, gate diagnostics, support, and sensitivity.

- [x] Write tests for full-input B fixtures A–G, the renamed regime, severe HOT severity, robust/fragile MIXED arithmetic, unresolved missing-data candidates, non-overlap, and Data Quality monotonicity.
- [x] Run the focused test and confirm failure because `lib/regime.ts` is not implemented.
- [x] Implement fixed score bounds and three-valued gates. MIXED is emitted only when required decisions are resolved and every named gate is false.
- [x] Implement Option B, 34 score perturbations, native-guard identity fragility, reason-based MIXED support, residual-X clarity, and label-independent sensitivity caps.
- [x] Re-run focused tests; verify Data Quality and Regime Clarity are separate outputs.

### Task 2: Source Contract and API

**Files:** Modify `lib/market-data/index.ts`, `lib/market-data/index.test.ts`, `app/api/market-data/route.test.ts`, `app/api/ai-report/route.ts`, `app/api/ai-report/route.test.ts`, `lib/playbook.ts`.

**Interfaces:**
- `DashboardPayload.regime` is always a `RegimeAssessment`; `regime.regime` remains nullable.
- `researchImplications` is null unless a regime is resolved.
- Service maps no existing proxy signal into a core factor without a registered two-family source contract; currently all six regime factors are ineligible and named in reason codes.
- Replace `getPlaybook` with `getResearchImplications(regime)`.

- [x] Add tests that current public feeds stay available as monitoring signals while regime is INSUFFICIENT_DATA/null and its clarity is null.
- [x] Add tests for each new regime's research-only copy and the no-regime coverage brief.
- [x] Update the service, types, report, and API fixtures; assert no legacy enum or favor/reduce fields escape.

### Task 3: Dashboard and Methodology Copy

**Files:** Modify `components/dashboard/regime-dashboard.tsx`, `components/dashboard/regime-dashboard.test.tsx`, `README.md`.

- [x] Update the hero to show assessment status, nullable regime, Data Quality, and Regime Clarity without confidence wording.
- [x] Label the five existing cards as monitoring indicators; render missing core factors and source coverage distinctly.
- [x] Replace Asset Playbook copy with Research Implications and suppress it for unresolved/provisional-null states.
- [x] Update the Methodology view and README taxonomy, Option B, missing-data rules, source readiness, and API contract.
- [x] Run focused component/API checks and confirm disclaimer/proxy labels persist.

### Task 4: Final Verification and Delivery

**Files:** All task-scoped edits above; preserve the approved v0.3 specification and evidence files.

- [ ] Run `npm test`, `npm run lint`, `npx tsc --noEmit`, and `npm run build`; fix failures within task scope.
- [ ] Review the full Git diff for secrets, stale enums, mock feeds, data-source leakage, and unrelated changes.
- [ ] Commit the task and push `main` to the user-specified origin.
- [ ] Verify the connected Netlify deployment and both API routes; report any source-dependent limitations explicitly.
