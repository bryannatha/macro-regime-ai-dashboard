# Public Daily Data Dashboard Design

## Goal

Replace the synthetic-only dashboard with a public daily macro monitor using clearly attributed public feeds and explicit substitutes. Preserve a clean, read-only research dashboard; do not add trading, brokerage, paid data contracts, or a live AI call.

## User Decision and Product Constraints

- Use the Federal Reserve nominal Broad Dollar Index instead of ICE DXY and label it as the Broad Dollar Index.
- Use an ECB-derived USD/IDR reference cross instead of presenting it as BI JISDOR or tradable spot FX.
- Do not ingest or score ICE high-yield spreads, LBMA gold, or third-party stablecoin market-cap data in the public tier. Show these as excluded, not as zero and not as mock values.
- Keep the existing five score cards and six named regimes where the required observations exist.
- Keep the disclaimer: "Educational research tool, not financial advice."
- No Supabase or scheduled ingestion in this first daily version. Fetch provider data on the server with cadence-appropriate Next.js caching; display histories supplied by the source, not synthetic score history.

## Data Sources and Labels

| Dashboard input | Source and transformation | Display cadence / constraints |
| --- | --- | --- |
| CPI and Core CPI | BLS public API v1; convert the unadjusted index to year-over-year percent change using the same month one year earlier | Monthly; last published month and retrieval time are distinct |
| Brent crude | EIA API; server-only `EIA_API_KEY` | Daily; if the key is absent or the source fails, mark unavailable |
| 2-year and 10-year real yields | U.S. Treasury daily XML feeds | Daily business-day observations |
| Initial claims | U.S. DOL ETA 539 non-embargoed data; use seasonally adjusted U.S. initial claims | Weekly observations; revisions are possible |
| Broad Dollar Index | Federal Reserve H.10 Nominal Broad Dollar Index, not DXY | Released on the H.10 schedule; identify the index and as-of date |
| Crypto-demand proxy | Mempool.space public Bitcoin API; current mempool virtual size and projected block median fee rate | Current on-chain blockspace demand, not BTC price or market buying; cache conservatively and label the proxy |
| USD/IDR | Frankfurter filtered to ECB reference rates; calculate IDR per USD as EUR/IDR divided by EUR/USD | Daily ECB-derived cross; explicitly not JISDOR or tradable spot |
| BTC spot price, high-yield spread, gold, stablecoin market cap | No public-tier provider with confirmed display/redistribution rights | Excluded until a redistribution-cleared source is approved |

No provider key or source failure may silently activate mock values in production. Mock fixtures remain test/development-only. Every returned observation carries its source label, observation date, fetch date, cadence, and availability state. The API response never contains provider secrets.

## Data and Route Architecture

- Add a server-only market-data layer with one adapter per source and a shared normalizer. Adapters validate response status, schema, numeric values, units, and source dates; source failures are isolated so one feed does not take down the dashboard.
- `app/page.tsx` obtains a normalized dashboard payload from the shared service. Add `GET /api/market-data` for the same public normalized payload. Existing `GET /api/ai-report` uses that same payload and remains a rules-generated brief; it must not call an AI model or imply that it did.
- Use Next.js server fetch caching with a documented cadence per feed. Never fetch providers from a client component. Expose source status and last observation in the existing dashboard views.
- Replace synthetic score-history charts with actual provider histories where available. Do not claim a historical regime or score backtest without persisted, point-in-time snapshots.

## Scores and Regime Rules

- Keep scores on a 0-100 scale and publish each category's available-weight coverage next to the score.
- Reweight only the public-tier inputs: growth stress uses claims and the 2-year yield; liquidity uses the Broad Dollar Index and 10-year real yield; the Crypto Demand card uses mempool backlog and fee pressure as a Bitcoin blockspace proxy; Indonesia risk uses the ECB-derived USD/IDR cross, Broad Dollar Index, and Brent. Inflation retains CPI, Core CPI, and Brent.
- Do not describe the on-chain proxy as BTC price performance, aggregate crypto demand, investor flows, or buying pressure. The UI and rules brief name the proxy and its limitation wherever its score is shown.
- A category score is unavailable below 60% of its configured input weight. For an available partial score, renormalize over present inputs and show the exact coverage; never treat a missing input as zero.
- A regime is withheld if inflation, growth, liquidity, or crypto-demand coverage is below 60%. Oil-dependent Commodity Inflation and gold-dependent Fiat Debasement rules cannot trigger without the corresponding observation. Goldilocks remains a residual ruleset state only after the required core categories have adequate coverage.
- Scores and regime thresholds remain heuristic, provisional, and not backtested. The UI and brief must say so.

## UI and Failure Behavior

- Keep the uncluttered monitoring layout: current regime and update state first, five scores next, then concise trend charts and a source-aware observations table.
- Show `Unavailable`, `Excluded`, or the provider error state for unavailable inputs; show per-observation as-of dates and use stale labels based on cadence. Never display an old fixture as if it were live.
- If required core inputs cannot support a regime, show a data-coverage state rather than defaulting to Goldilocks.
- Preserve the existing educational disclaimer and rules-brief language.

## Acceptance Criteria

1. Production dashboard and both API routes consume the normalized public-data service rather than `data/mock-metrics.ts`.
2. Provider parsing, missing-key/source failure, provenance, partial-score coverage, and regime-gating behavior have automated tests using deterministic fixtures.
3. Tests and `npm run build` pass; the source table identifies substitute indices and excluded sources.
4. No real data secret is committed or returned to the client. Netlify receives `EIA_API_KEY` only through its environment settings; absence is handled visibly.
5. The already configured Netlify site can deploy from the repository's `main` branch. If a required credential is unavailable, deployment must still be honest about which inputs are unavailable.

## Source References

- [BLS public API](https://www.bls.gov/developers/home.htm)
- [U.S. Treasury daily interest rate XML feed](https://home.treasury.gov/treasury-daily-interest-rate-xml-feed)
- [DOL ETA 539 data downloads](https://oui.doleta.gov/unemploy/DataDownloads.asp)
- [Federal Reserve H.10](https://www.federalreserve.gov/Releases/h10/default.htm)
- [Frankfurter API](https://frankfurter.dev/)
- [EIA Open Data API](https://www.eia.gov/opendata/documentation.php)
- [EIA API terms and reuse policy](https://www.eia.gov/opendata/terms-of-service.php)
- [Mempool.space REST API](https://mempool.space/docs/api/rest)
- [Coinbase market data terms](https://www.coinbase.com/en-au/legal/market_data) (reason the public tier does not expose Coinbase prices)
- [Netlify Next.js support](https://docs.netlify.com/build/frameworks/framework-setup-guides/nextjs/overview/)
