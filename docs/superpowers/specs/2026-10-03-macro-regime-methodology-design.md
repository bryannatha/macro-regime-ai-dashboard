# Macro Regime Methodology and Data Architecture Design

## Status

Superseded by [Macro Regime Methodology and Data Architecture Design - Revised](2026-10-03-macro-regime-methodology-revised.md), version `US-MACRO-0.2-review`. Retained as the original design/review record; do not implement its old rules. The revised document preserves the server-only provider architecture, provenance, public-source constraint and Netlify target while replacing the methodology choices below.

## Goal

Upgrade the existing public dashboard into a transparent, rules-based macro monitor that distinguishes observed conditions from transition signals, reports uncertainty honestly, and never treats missing evidence as positive evidence.

## User Intent and Constraints

- Preserve the current visual identity, navigation, read-only posture, and Netlify deployment; do not redesign from scratch.
- Use only free, public, technically accessible sources whose display and redistribution terms have been reviewed. Do not use paid feeds or sources with unresolved redistribution rights.
- Do not hard-code a desired current regime or tune to another model's output.
- Do not add trade execution, brokerage integration, or a live OpenAI call.
- Keep the educational disclaimer exactly: "Educational research tool, not financial advice."
- Keep the product name if desired, but explain that the score engine and report are deterministic rules, not a trained or calibrated AI model.

## Architecture Decision

Use a modular, rules-first engine with six first-class global factors, separate regional/market overlays, explicit positive gates for all non-neutral regimes, and a genuine Mixed / Transition outcome. Candidate factor and regime thresholds live in configuration and pure TypeScript modules rather than React components. The existing Next.js server-side market-data service remains the only source-data boundary.

The classifier does not calculate one opaque aggregate macro score. It evaluates explicit factor conditions, reports rule support and conflicts, and selects a named regime only when a positive rule has adequate support and a meaningful lead over competing rules.

## Factor and Overlay Model

### Core global factors

1. **Inflation**: consumer-price level and momentum. Keep energy supply shocks as a separate overlay so oil is not counted as an independent inflation input when it is already embedded in headline CPI.
2. **Growth**: broad production and consumption/activity measures.
3. **Labor**: payroll/employment, unemployment, and claims measures, with household and establishment survey families identified separately.
4. **Policy / Rates**: published policy target/range and Treasury nominal/real yields or curve measures with explicit transformations.
5. **Credit / Financial Conditions**: bank lending/supply and other directly sourced financial-condition indicators; avoid proprietary ICE/BofA spread series.
6. **Liquidity**: a documented public balance-sheet/liquidity composite, with its components and algebra shown rather than counted as independent confirmations.

Market / Risk Conditions may be displayed as an optional context factor, but it is not required for the global regime decision.

### Separate overlays

- **Indonesia** informs IDR/local commentary only; it cannot change the global regime.
- **Energy / Supply Shock** provides independent energy context and can add a tension note; it cannot trigger a global regime by itself.
- **Crypto / Blockchain** describes on-chain activity only; it cannot materially determine the global regime and must not be presented as price, investor flows, or buying demand.

### Candidate source map

This is a conservative candidate map, not a statement that every listed adapter is already approved. An input is enabled only after its endpoint works in server-side tests and the source's display/reuse conditions are documented. If eligibility or endpoint stability is unresolved, the input is marked missing or redistribution-blocked and contributes no score.

| Factor / overlay | Candidate source families | Important constraint |
| --- | --- | --- |
| Inflation | BLS CPI headline/core; BEA PCE headline/core | Prefer official API or downloadable tables. BEA API access requires registration and agreement to its terms; keep the API key server-only if used. Average correlated measures into CPI/PCE families before factor scoring. |
| Growth | Federal Reserve G.17 industrial production; BEA real GDP/PCE or another verified official activity series | Use official release files. The Federal Reserve has announced removal of the G.17 DDP package builder during the week of November 9, 2026; do not build a new dependency on that builder or FRED mirrors. |
| Labor | BLS payroll/employment and unemployment series; DOL initial and continuing claims | Keep observation period and actual publication/revision dates distinct. |
| Policy / Rates | FOMC-published target range/action; U.S. Treasury nominal and real yield feeds | Do not label a Treasury yield or derived proxy as a policy decision. State transformations, including curve calculations. |
| Credit / Financial Conditions | Federal Reserve H.8 commercial-bank credit and SLOOS lending standards | Validate stable machine-readable release access and release-date metadata. Exclude Chicago Fed indices absent redistribution permission. |
| Liquidity | Federal Reserve H.4.1 public release components: reserve balances, Treasury General Account, and reverse-repo liabilities, where published | Define one net-liquidity proxy from components; publish its equation, signs, and limitations. Do not count related accounting components as independent votes. |
| Energy | EIA crude/oil series | EIA identifies its government information products as public domain with acknowledgment; its API requires a free key, while bulk download does not. Never hide a missing key or failed feed. |
| Indonesia | Bank Indonesia JISDOR if an official machine-readable endpoint and reuse terms are verified; otherwise an explicitly labeled ECB-derived USD/IDR reference cross | A cross-rate is neither BI JISDOR nor tradable spot. ECB statistics permit reuse with attribution and explicit disclosure of user transformations. |
| Crypto / Blockchain | Public Bitcoin network/blockspace measurements | Keep outside the global classifier. Mempool.space documents public endpoints and rate limits, but its source-data reuse terms must be recorded before this provider is treated as redistribution-cleared. |
| Market / Risk | None required for v1 | Do not add DXY, ICE/BofA spreads, BTC spot, gold spot, or stablecoin capitalization unless an eligible source is documented. |

All deployed inputs must have a source record containing source name and URL, terms/reuse review reference, observation frequency, transformation, economic rationale, factor/overlay assignment, direction, known historical span, and release-date availability. API keys are server-only and are never returned in JSON, rendered HTML, or logs.

## Observation and Source-Health Contract

Each normalized observation carries:

- a stable metric key, numeric value or null, unit, and transformation identifier;
- observation period/date, which describes what period the value measures;
- release timestamp/date, nullable and never inferred when unavailable;
- retrieval timestamp in UTC;
- source name, source URL, cadence, and a short provenance/limitation note;
- health status and optional reason code.

Source health states are `available`, `stale`, `missing`, `failed`, and `redistribution_blocked`.

- `available` values may contribute to scoring.
- `stale` values may remain visible with their original dates but do not count toward current score coverage.
- `missing`, `failed`, and `redistribution_blocked` values are null and never treated as zero or silently replaced with unrelated data.
- Missing credentials map to a visible `missing` state with a reason such as `not_configured`; upstream and parse errors map to `failed`.
- Staleness uses source-specific expected cadence/grace configuration and the best available publication timestamp. If publication time is unavailable, the UI identifies the timestamp used for freshness rather than implying it is the release time.

The API and UI separately show data as-of (latest observation period), last refresh/retrieval, and latest known release date. One timestamp must not stand in for the others.

## Factor Scoring and Missing Data

All factor scores use one direction: **0 = supportive / low stress; 100 = adverse / high stress**. A higher score always means more stress, regardless of factor name.

- The factor score describes current level; momentum/direction is a separate field and must not be blended into or substituted for current state.
- Transform each indicator into an adverse-direction 0-100 historical percentile using a documented observation transform and the trailing 10 calendar years ending at that observation. Use no observations dated after the value being scored. Use source history available at the run date and label it as current/revised history, not a point-in-time vintage. A minimum five-year sample is required: at least 1,250 daily, 260 weekly, 60 monthly, or 20 quarterly observations. Below the minimum, the input is unavailable for the factor score; when only 5-10 years are available, mark the factor provisional for short reference history.
- First combine strongly related series into one named indicator family (for example, headline/core CPI within a CPI family). Give independent families fixed configured weights summing to 1.0; no family may carry more than 50% weight. Do not let a single surviving indicator represent a factor.
- Factor coverage is the sum of configured weights with fresh, valid observations. At `>=80%`, the factor is adequate; `60%-79%`, it is provisional; `<60%`, it is insufficient. A factor's score uses only configured weights present, renormalized only when coverage meets the applicable floor, and the exact coverage and missing families are disclosed. No missing or blocked observation is imputed as zero.
- Every core factor must have at least 60% eligible coverage for classification. With no family weighted above 50%, this requires at least two eligible indicator families. If any core factor is below that floor, the dashboard reports **Insufficient Data**, not a macro regime. If any core factor is in the 60-79% band or has only 5-10 years of reference history, an otherwise classifiable result is visibly provisional and its Evidence Strength is reduced.
- Factor-level momentum compares the current adverse stress score with the corresponding score approximately three months earlier (13 weeks for weekly series). The direction bands are fixed: change of `>=+20` = strongly deteriorating; `+8` to `+19` = deteriorating; `-7` to `+7` = neutral; `-19` to `-8` = improving; `<=-20` = strongly improving. Positive change always means worsening stress. Insufficient history yields `unknown`, not neutral.

The five-year minimum, family weights, indicator transforms, freshness windows, and regime thresholds are configuration, are covered by tests, and are fully listed in Methodology. Any later threshold change requires a methodology/version update; do not optimize thresholds against the current date or a desired external answer.

## Regime Taxonomy and Rules

The public regime set is:

- `GOLDILOCKS`
- `OVERHEATING / REFLATION`
- `STAGFLATIONARY`
- `CONTRACTION / RECESSIONARY`
- `DISINFLATIONARY SLOWDOWN`
- `MIXED / TRANSITION`

`INSUFFICIENT DATA` is an assessment/data state, not a seventh macro regime.

Factor stress bands used as initial rule thresholds are `0-39 supportive/contained`, `40-59 mixed`, and `60-100 adverse/stressed`. The initial positive gates are:

- **Goldilocks** requires Inflation `<=45`, Growth `<=45`, and Labor `<=50`; at least two of Policy `<=55`, Credit `<=50`, and Liquidity `<=55`; no factor `>=80`; inflation momentum must not be deteriorating; and fewer than three core factors may be deteriorating. This is positive evidence across at least five of six factors, never a residual state.
- **Overheating / Reflation** requires Inflation `>=60` with deteriorating/strongly deteriorating inflation momentum; at least one of Growth `<=45` or Labor `<=40` (resilient demand/labor); and at least one of Policy or Credit `>=55`. Energy can corroborate commentary but cannot qualify or trigger the global regime.
- **Stagflationary** requires Inflation `>=60` with momentum not improving; at least one of Growth or Labor `>=55`; and at least one of Policy, Credit, or Liquidity `>=55`.
- **Contraction / Recessionary** requires Growth `>=65` and Labor `>=60`, plus either Credit `>=60`, both Policy and Liquidity `>=60`, or deteriorating momentum in at least two of Growth, Labor, and Credit. Cooling inflation does not prevent this classification.
- **Disinflationary Slowdown** requires Inflation `<=45` with improving/strongly improving/neutral momentum; at least one of Growth or Labor `>=50` or both their momentum directions deteriorating; and failure to meet the Contraction gate.
- **Mixed / Transition** is the genuine fallback when adequate data exist but no positive regime gate is met, candidate rules are tied/too close, or conflicts are material.

Each positive-regime rule emits a 0-100 support score from fixed, documented gate weights that sum to 1.0 per rule; failing any mandatory gate makes that rule ineligible and caps its score at 49. An eligible rule must score at least 75. When multiple rules are eligible, select the highest only if it leads the runner-up by at least 10 points; otherwise return Mixed / Transition and expose competing drivers. Rule support is categorical evidence, not a probability. The bands, mandatory gates, support weights, and point thresholds are versioned testable configuration, not UI conditionals.

## Leading Direction, Transition Risk, and Conflicts

The leading overlay is a separate 0-3 month **transition signal**, not a forecast and never an overwrite of the current regime.

- Build its direction from current momentum in Inflation, Growth, Labor, and Credit / Financial Conditions, giving each factor one vote regardless of its number of underlying series.
- Map direction labels to `-2 strongly improving`, `-1 improving`, `0 neutral`, `+1 deteriorating`, `+2 strongly deteriorating`. Mean vote `<=-1.25` is strongly improving; `>-1.25 to <=-0.5` improving; `>-0.5 to <0.5` neutral; `>=0.5 to <1.25` deteriorating; and `>=1.25` strongly deteriorating. Missing factor momentum lowers overlay coverage and can make its direction unknown.
- Transition risk is `low`, `moderate`, or `elevated`, determined from the count/severity of worsening core factors, rule proximity, and unresolved conflicts: low means at most one of Growth/Labor/Credit is deteriorating, no high-severity conflict, and rule margin at least 20; moderate means two are deteriorating, margin below 20, or one high-severity conflict; elevated means at least three are deteriorating or any conflict severity is 70 or higher. It describes how unsettled the current mix is, not the probability of a specific future event.
- Conflicts are deterministic named checks, including inflation level vs momentum, growth vs labor direction, liquidity vs policy direction, and overlay risk vs research implication. Each item includes the input evidence and severity; conflicts reduce Evidence Strength and can make Mixed / Transition more likely.

## Evidence Strength

Replace `confidence %` with **Evidence Strength: N/100**. It is explicitly not the probability that the label is correct.

For a classifiable result, compute and round:

`Evidence Strength = 0.35*C + 0.20*A + 0.15*F + 0.20*M + 0.10*(100-X)`

where:

- `C` is the mean configured-weight coverage of the six core factors (0-100);
- `A` is independent-family agreement: `100 - 2 * mean absolute deviation` of available family stress scores from their factor's family median, clamped to 0-100;
- `F` is the mean freshness score of core inputs, where each input scores 100 through its configured cadence threshold and declines linearly to 0 at twice that threshold;
- `M` is the winning eligible regime-rule support margin over the runner-up, scaled as `min(100, 5 * pointMargin)`; if the result is Mixed / Transition because no rule is eligible, `M=0`;
- `X` is the sum of named conflict severities, capped at 100.

For insufficient data, do not emit a regime or Evidence Strength. For provisional classification, cap Evidence Strength at 59/100 and display the missing/provisional factors. Methodology must show this formula and state that it is a transparent rules-quality index, not a calibrated statistical measure.

## Research Implications and Guardrails

Rename **Asset Playbook** to **Research Implications**. Items are hypotheses to examine, not portfolio instructions. The output is derived from current regime plus transition direction, conflicts, and overlays. Use `researchThemes`, `counterSignals`, and `guardrails`; do not output unqualified buy/sell/favor/reduce commands.

Required guardrails include:

- High Indonesia risk flags any IDR-related thesis and prevents an unqualified carry implication.
- Elevated inflation with tightening policy blocks an unqualified Goldilocks interpretation.
- Resilient growth alongside weakening labor and credit displays a transition warning.
- Insufficient or provisional core coverage suppresses directional asset implications.
- Conflicting overlays must be stated next to the relevant theme; one overlay never changes the global regime.

## Historical Diagnostic and Vintage Limitations

There is no durable observation/vintage store in the current deployment. The first release therefore must not claim point-in-time backtesting or predictive validation.

- For a point-in-time replay, include an observation at replay date `t` only when its recorded `releasedAt <= t`; if release time is unavailable, omit it from that replay rather than backdating it. Where official real-time/release vintages exist and reuse conditions permit, use them; otherwise use current revised series with observation dates and known release lags and label the output **revised-history diagnostic, not point-in-time validation**.
- Inspect pre-COVID expansion, the 2020 COVID shock, 2021 reflation, 2022 tightening/inflation, and available disinflation/soft-landing episodes. Report regime duration/flips, rule support, factor contributions, and periods where vintage/release data are absent.
- Use stylized fixtures for the six regimes to test deterministic rule behavior; fixtures are not historical validation results.
- Do not fit to October 2026 or another dashboard. Explain the limited number of macro episodes, source revisions, cadence gaps, and any look-ahead limitations of revised histories.
- Retain `observedAt`, `releasedAt`, and `retrievedAt` per current payload. `releasedAt` may be null where the official source does not expose it; do not invent one. Durable future snapshots require a separately approved persistent store and are outside this deployment-neutral first pass.

## UI and Product Language

Keep the current visual identity, main layout, and Overview / Data & Sources / Methodology navigation. Update the hero to show Current Regime, Evidence Strength, Leading Direction, Transition Risk, coverage/provisional state, and data timestamps. Show six core factor cards and secondary Indonesia, Energy, and Crypto overlays. Each card shows stress score/state, momentum, coverage, last refresh, and source health.

Put detailed transformations, sources, weights, score bands, missing-data behavior, rules, evidence formula, source reuse notes, and historical limitations in Data & Sources / Methodology rather than crowding the overview. Preserve the disclaimer exactly. The AI report endpoint remains deterministic and clearly labeled rules-generated; no external model is called.

## Engineering and API Boundaries

- Keep source adapters separate from factors, regime rules, leading overlay, validation, configuration, and UI.
- Extend the normalized server payload without moving provider fetching into the browser. The page and API routes consume the same result.
- Keep `/api/market-data` and `/api/ai-report` server-only. API output includes public provenance and no credentials.
- Retain Netlify deployment compatibility and local deterministic fixtures. Do not require Supabase or provider secrets for the app to start; missing configured sources remain visible and reduce coverage.
- Do not add dependencies unless a source format requires one and the existing toolchain cannot safely parse it.

## Acceptance Criteria

1. No regime is a residual/default positive label; all non-neutral regimes have explicit positive gates and Mixed / Transition is a real outcome.
2. Insufficient core coverage returns an explicit Insufficient Data state; provisional coverage is labeled and reduces evidence quality.
3. Six core factors are independent of Indonesia, Crypto, and Energy overlays; one score direction is used throughout.
4. Factor level and momentum are separate; leading direction/transition risk never overwrite the current regime.
5. Fresh, valid, eligible indicators alone contribute to coverage. Stale, missing, failed, and redistribution-blocked values are never zeros or silent substitutes.
6. Evidence Strength implements the published deterministic formula and is never described as a probability.
7. Conflicts are detectable and reduce evidence strength; research implications apply all listed guardrails.
8. Source reuse review and attribution are present for every enabled provider. Ambiguous sources remain disabled/blocked.
9. Historical output is labeled according to actual vintage quality; no predictive or point-in-time-validation claim is made without evidence.
10. Tests cover all six stylized fixtures, no Goldilocks fallback, each positive gate, missing/stale/failed/blocked feeds, partial coverage, overlays, conflicts, deterministic repeatability, and evidence strength.
11. Existing responsive UI identity and exact educational disclaimer are preserved; no trading or brokerage capability is added.
12. `npm test`, `npm run lint`, TypeScript checking, and `npm run build` pass; the Netlify deployment remains functional.

## Source References

- [BLS API terms](https://www.bls.gov/developers/termsOfService.htm)
- [BLS API overview](https://www.bls.gov/developers/home.htm)
- [BEA open data](https://www.bea.gov/open-data)
- [BEA API registration and terms](https://apps.bea.gov/api/signup/)
- [Federal Reserve G.17 downloads](https://www.federalreserve.gov/releases/g17/download.htm)
- [Federal Reserve H.4.1 releases](https://www.federalreserve.gov/releases/h41/)
- [Federal Reserve H.8 source and documentation](https://www.federalreserve.gov/releases/h8/about.htm)
- [U.S. Treasury daily interest-rate XML feed](https://home.treasury.gov/treasury-daily-interest-rate-xml-feed)
- [EIA public-domain reuse](https://www.eia.gov/about/copyrights_reuse.php)
- [EIA API registration and terms](https://www.eia.gov/opendata/register.php)
- [Chicago Fed legal notice](https://www.chicagofed.org/utilities/legal-notices)
- [ECB statistics reuse policy](https://www.ecb.europa.eu/stats/ecb_statistics/governance_and_quality_framework/html/usage_policy.ga.html)
- [Bank Indonesia JISDOR](https://www.bi.go.id/id/statistik/informasi-kurs/jisdor/Default.aspx)
- [Mempool.space REST API](https://mempool.space/docs/api/rest)
- [Netlify Next.js support](https://docs.netlify.com/build/frameworks/framework-setup-guides/nextjs/overview/)
