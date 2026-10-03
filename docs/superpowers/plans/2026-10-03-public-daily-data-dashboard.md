# Public Daily Data Dashboard Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace production mock observations with a clearly attributed public daily macro dashboard, partial-coverage scores, and a deterministic rules brief.
**Architecture:** Server-only source adapters normalize independently fetched observations into one `DashboardPayload`; the page and both API routes consume that service. Client UI renders provenance, freshness, unavailable/excluded states, and only real provider histories.
**Tech Stack:** Next.js 15 App Router, TypeScript, Tailwind CSS, Recharts, Vitest, `fast-xml-parser`, `csv-parse`.
**Spec:** `docs/superpowers/specs/2026-10-03-public-daily-data-design.md`

## Global Constraints

- Keep the dashboard public, daily, read-only, and educational. No trading, brokerage integration, paid provider contract, Supabase, scheduled ingestion, or live AI call.
- Use Federal Reserve Nominal Broad Dollar Index instead of ICE DXY; label it exactly as a Broad Dollar Index substitute.
- Use an ECB-derived USD/IDR reference cross, calculated from EUR/IDR divided by EUR/USD; never label it JISDOR or tradable spot FX.
- Exclude BTC spot, high-yield spreads, gold, and stablecoin market capitalization until public display/redistribution rights are confirmed. Represent exclusions as `excluded`, never as zero or mock data.
- Keep the five score cards and six regime names. Add observation provenance: source, observation date, fetch date, cadence, status, and source URL where useful.
- Mock fixtures are test/development-only and must not be a production fallback.
- Use cadence-appropriate Next.js server-fetch caching. Provider failures are isolated and surfaced, not allowed to take down the whole dashboard.
- Score 0-100 with per-category available-weight coverage; below 60% coverage the score is unavailable. Missing inputs are not zero. Withheld core coverage means no regime classification.
- Commodity Inflation requires observed oil. Fiat Debasement requires observed gold, which is excluded in this tier, so it must not trigger.
- Describe crypto score only as on-chain blockspace demand, not BTC price, buying pressure, investor flows, or aggregate crypto demand.
- Scores and regime thresholds are provisional heuristics, not backtested. Preserve the exact disclaimer: "Educational research tool, not financial advice."
- Never expose provider secrets or silently include them in logs, client data, or response URLs. EIA uses server-only `EIA_API_KEY`; missing key is visible as unavailable.

## Review Focus

1. Missing or malformed source data cannot become a numeric zero or a fabricated fallback; parser and adapter tests cover empty feeds, invalid dates/numbers, provider errors, and missing EIA key.
2. Partial scores renormalize only available configured weights; tests cover 59% unavailable, exactly 60% available, and source failure within otherwise sufficient coverage.
3. The classifier cannot emit Goldilocks when core coverage is inadequate, Commodity Inflation without oil, or Fiat Debasement without gold; each gate has a focused test.
4. Both API routes and the server-rendered page use the same normalized service; route tests assert truthful source labels, no secret leakage, and isolated provider failure.
5. The UI presents source, as-of/fetch dates, cadence, stale/unavailable/excluded states, proxy limitations, heuristic status, and the educational disclaimer without charts that imply synthetic history.

---

## Task 1: Define Observation Contracts and Source Adapters

**Files:** `lib/types.ts`, `lib/market-data/types.ts`, `lib/market-data/providers/{bls,eia,treasury,dol,fed,mempool,frankfurter}.ts`, `lib/market-data/parsers.ts`, `lib/market-data/providers/*.test.ts`, `lib/market-data/fixtures/*`, `package.json`, lockfile.

- [x] Add Vitest fixture-driven tests before implementation for each provider: successful values and observation dates; empty/malformed payloads; non-2xx responses; invalid or non-finite numbers; and correct source/cadence metadata. Include the Frankfurter cross-rate calculation and Mempool virtual-size/median-fee parsing.
- [x] Add focused BLS tests for unadjusted CPI and core CPI index series converted to year-over-year percentages using the same month a year earlier; assert no output when that comparison month is absent.
- [x] Add EIA tests proving the API key is server-only, absent-key yields unavailable without requesting the provider, and an upstream error does not populate oil with a fixture.
- [x] Run `npm test -- lib/market-data` and confirm the new tests fail for the missing contracts/adapters (the current sandbox has previously denied Vitest access to its config; if it recurs, resolve test-command access before changing product configuration).
- [x] Define observation keys for CPI, Core CPI, Brent, Broad Dollar Index, 2Y yield, 10Y real yield, initial claims, mempool virtual size, mempool projected block median fee rate, and ECB-derived USD/IDR. Define explicit `available | unavailable | excluded` status, nullable value and observation date, fetched date, cadence, source label/URL, explanatory detail, and dated provider history.
- [x] Add typed source adapters with injectable fetch and strict response validation. Isolate failures per feed and return unavailable observations without throwing into the whole payload. Include excluded observation entries for BTC price, HY spread, gold, and stablecoin cap.
- [x] Use `fast-xml-parser` for Treasury XML and the DOL national weekly-report XML (`level=us`, `filetype=xml`); use `csv-parse` for the Federal Reserve H.10 series as published by FRED. The H.10 delivery is the daily Nominal Broad U.S. Dollar Index series `DTWEXBGS` (index Jan 2006=100), sourced from the Board of Governors and accessed through FRED rather than the DDP package builder scheduled for retirement. Check in small deterministic fixtures, not copied production histories. Keep request/cache policy with each adapter: short conservative caching for Mempool, hourly-or-longer daily feeds, and longer caching for monthly CPI.
- [x] Re-run the focused tests and `npx tsc --noEmit`; verify each adapter's unavailable path never sets `value` to zero and no test fixture is imported by production adapters.
- [x] Commit as `feat: add public market data source adapters`.

## Task 2: Make Scores Coverage-Aware and Gate Regimes

**Files:** `lib/types.ts`, `lib/scoring.ts`, `lib/scoring.test.ts`.

- [x] Add score tests first for all-five score keys, bounded values, input coverage, partial-weight renormalization, unavailable below 60%, and no implicit zero for missing values. Run the focused scoring test and confirm these new cases fail.
- [x] Replace complete `MarketSnapshot` scoring inputs with normalized observations. Return a nullable score, exact coverage fraction/percent, orientation, summary, and a user-facing explanation for unavailable scores.
- [x] Publish provisional normalizers in `SCORING_MODEL`: inflation CPI 0.40 (1.5-5% higher), core CPI 0.35 (1.5-4.5% higher), Brent 0.25 ($55-115 higher); growth claims 0.65 (195-360k higher), 2Y yield 0.35 (2.5-5.5% higher); liquidity Broad Dollar 0.50 (110-130 lower is more supportive), 10Y real yield 0.50 (0.5-2.5% lower is more supportive); crypto mempool virtual size 0.50 (0-5,000,000 vB higher), projected median fee 0.50 (0-50 sat/vB higher); Indonesia USD/IDR 0.50 (14,500-17,500 higher), Broad Dollar 0.25 (110-130 higher), Brent 0.25 ($55-115 higher). Clamp normalized component values to 0-100 and disclose these bounds as heuristic, not calibrated forecasts.
- [x] Implement score availability with `< 0.60` unavailable; otherwise divide the weighted sum by the sum of available configured weights. Coverage equals that available configured weight, with an exact test at 0.60.
- [x] Add regime tests first for missing core category, missing oil, excluded gold, and each existing threshold branch supported by adequate coverage. Then update `classifyRegime` to return `RegimeAssessment | null` when inflation, growth, liquidity, or crypto coverage is below 60%; keep Commodity Inflation oil-gated and Fiat Debasement gold-gated; retain six named labels and the existing heuristic thresholds where applicable.
- [x] Re-run `npm test -- lib/scoring.test.ts`; assert the existing mock-regime assertions are removed or explicitly demoted to fixture-only checks rather than production acceptance tests.
- [x] Commit as `feat: score public inputs with coverage gates`.

## Task 3: Build One Normalized Service for the Page and APIs

Implementation note: Tasks 3 and 4 are committed atomically because the page's `DashboardPayload`
contract and the client dashboard props change together; splitting them would leave an unbuildable
intermediate state.

**Files:** `lib/market-data/index.ts`, `lib/market-data/index.test.ts`, `app/page.tsx`, `app/api/market-data/route.ts`, `app/api/market-data/route.test.ts`, `app/api/ai-report/route.ts`, `app/api/ai-report/route.test.ts`, `lib/types.ts`.

- [x] Write orchestration tests first with mocked fetch responses: all-source success, one source failing while others remain available, missing EIA key, generated/fetched timestamps, and JSON serialization without credentials. Confirm red before implementation.
- [x] Implement `getDashboardPayload()` to fetch providers independently, normalize observations, calculate scores/regime/conditional playbook, and return one typed payload with generated time and source statuses. Do not import `data/mock-metrics.ts` from production service or routes.
- [x] Add `GET /api/market-data` returning the shared payload. Use per-feed Next.js fetch revalidation (Mempool 300 seconds; daily feeds at least 3600 seconds; BLS monthly at least 21600 seconds) and isolate provider errors at adapter boundaries.
- [x] Change `app/page.tsx` to await the shared service and pass that payload to the dashboard server/client boundary.
- [x] Rewrite `GET /api/ai-report` to consume the same payload, generate a deterministic rules brief only, and state source/coverage/heuristic limitations. If regime is withheld, return a coverage brief without inventing a regime. Change `AIReport.source` from `mock` to an explicit rules-based source.
- [x] Add route assertions for statuses, substitute labels, no API key in JSON, no mocked observations, and no implied AI authorship. Re-run service and route tests plus `npx tsc --noEmit`.
- [x] Commit service, API, page, and dashboard payload integration atomically with Task 4 as `feat: serve normalized public macro data`.

## Task 4: Replace Synthetic Dashboard States with Source-Aware Monitoring UI

**Files:** `components/dashboard/regime-dashboard.tsx`, `data/mock-metrics.ts` (remove production use; keep only if useful for development fixtures), `README.md`, `app/globals.css` only if needed.

- [x] Add focused render/formatting tests for available, stale, unavailable, excluded, score-under-coverage, regime-withheld, and disclaimer states. Use deterministic payload fixtures; confirm they fail against the current mock-only props.
- [x] Refactor dashboard props to consume `DashboardPayload`; display current regime or clear coverage state first, then five score cards with coverage and honest unavailable states, concise provider-history charts, and a provenance-rich observation table.
- [x] Remove computed mock score-history charts and any text describing synthetic samples as current. Only chart dated histories supplied by providers; omit a chart when a provider does not supply enough real observations.
- [x] Show substitute/excluded sources explicitly, including Broad Dollar vs ICE DXY, ECB-derived cross vs JISDOR/spot, excluded BTC/HY/gold/stablecoins, and crypto blockspace proxy limitations. Show provider observation time, fetch time, cadence, and stale labels (daily >3 days, weekly >14 days, monthly >50 days; H.10 >14 days).
- [x] Keep playbook conditional on a classified regime. Keep the rules brief visibly rules-generated, include coverage and provisional/not-backtested language, and make no AI-generation claim.
- [x] Preserve the exact educational disclaimer and make unavailable values visibly distinct from zero. Update README with source notes, score methodology/bounds, local setup, `EIA_API_KEY` configuration, and Netlify deployment steps.
- [x] Run render tests, `npm run lint` (repair the script if Next 15 reports `next lint` unsupported), and `npx tsc --noEmit`; manually inspect the responsive dashboard in browser at desktop and mobile widths.
- [x] Included in the atomic Task 3 integration commit above.

## Task 5: Full Verification and Public Deployment

**Files:** `package.json`, lockfile, `README.md`, any narrowly scoped fixes from verification.

- [x] Run `npm test`, `npm run lint`, `npx tsc --noEmit`, and `npm run build`; all pass (44 tests). `npm audit --omit=dev` reports zero vulnerabilities with Next.js 15.5.27 and the PostCSS 8.5.28 override.
- [x] Inspect production build output and confirm no client bundle contains credential markers, API responses contain no credential field, and no production imports remain from `data/mock-metrics.ts`.
- [x] Run locally without `EIA_API_KEY`; page and both routes render, oil is unavailable with a null value, and there is no sample fallback. No valid EIA key was available to verify populated Brent; do not commit or print credentials.
- [x] Verify the deployed Netlify production URL after pushing `main`: homepage and both API routes return 200; market data contains 14 observations, labels the Broad Dollar Index and ECB-derived USD/IDR cross correctly, and returns oil as unavailable/null; the AI report is rules-based. The dashboard reports 9/10 feeds available. No EIA credential was available, so oil remains visibly unavailable and no key was configured.
- [x] Review the final diff and status, commit the task-scoped changes, and push `main` to the specified `origin`. Report build/test/deployment results and the unavailable EIA credential explicitly.
