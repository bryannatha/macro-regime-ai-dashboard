# Macro Regime AI Dashboard

A read-only Next.js 15 dashboard for daily public macro observations across inflation, growth
stress, liquidity, Bitcoin blockspace demand, and Indonesia FX risk. The five dashboard scores
are monitoring indicators; they do not feed the separate U.S. macro regime classifier. The report
endpoint is deterministic and is not connected to an AI model. There is no trading or brokerage
integration.

**Educational research tool, not financial advice.** Scores and regimes are provisional heuristics,
not calibrated forecasts or backtests. Public observations may be delayed, revised, or unavailable.

## Data Sources

| Dashboard series | Public source and treatment |
| --- | --- |
| CPI and Core CPI | BLS unadjusted CPI indices converted to same-month year-over-year changes |
| Brent crude | EIA daily spot series; requires server-only `EIA_API_KEY` |
| 2Y and 10Y real yields | U.S. Treasury daily XML feeds |
| Initial claims | DOL national seasonally adjusted weekly claims report |
| Broad Dollar Index | Federal Reserve H.10 `DTWEXBGS`, delivered through FRED; index base Jan 2006=100, not ICE DXY |
| Crypto demand | Mempool.space backlog virtual size and projected block median fee; Bitcoin blockspace proxy, not price, buying pressure, or investor flows |
| USD/IDR | Frankfurter ECB reference cross: EUR/IDR divided by EUR/USD; not BI JISDOR or tradable spot FX |

BTC spot, high-yield spreads, gold, and stablecoin market capitalization are excluded until a public
provider's display and redistribution rights are confirmed. Excluded and unavailable observations
are `null`, never zero or mock fallbacks. Per-feed history charts are shown only when the provider
returns at least two dated observations.

Observation statuses are `available`, `unavailable`, and `excluded`. Available observations include
source, source URL where provided, observation date, retrieval timestamp, cadence, units, and notes.
The UI marks observations stale after 3 days for daily feeds, 14 days for weekly feeds and the
Broad Dollar series, and 50 days for monthly CPI. Current mempool values use a 1-day freshness
window.

## Monitoring Indicators

Components are linearly normalized and clamped to 0–100. Higher scores mean more inflation or
growth risk, more liquidity support, stronger blockspace activity, or more Indonesia external
pressure, depending on the card. Available configured weights are renormalized only when indicator
coverage is at least 60%; below that threshold the score is withheld. Missing inputs are never
treated as zero. These indicators do not substitute for classifier factors.

| Category | Inputs, weights, normalization bounds |
| --- | --- |
| Inflation pressure | CPI 40% (1.5–5% higher), Core CPI 35% (1.5–4.5% higher), Brent 25% ($55–115 higher) |
| Growth stress | Initial claims 65% (195–360k higher), 2Y yield 35% (2.5–5.5% higher) |
| Liquidity | Broad Dollar 50% (110–130 lower is more supportive), 10Y real yield 50% (0.5–2.5% lower is more supportive) |
| Crypto demand | Mempool virtual size 50% (0–5,000,000 vB higher), projected median fee 50% (0–50 sat/vB higher) |
| Indonesia risk | USD/IDR 50% (14,500–17,500 higher), Broad Dollar 25% (110–130 higher), Brent 25% ($55–115 higher) |

## U.S. Regime Framework

The classifier has six distinct U.S. core factors: Inflation, Growth, Labor, Policy / Rates, Credit
Conditions, and System Liquidity Proxy. Registered official-source adapters now feed the factor
engine on the server. Current observations are checked against source admission and cadence-based
freshness rules before scoring. The five monitoring indicators above and the Indonesia, energy, and
crypto context feeds remain isolated from these factors.

The regime stays withheld unless the registered coverage, source-quality, and native-comparison gates
pass. Under the approved US-MACRO-0.3.1 source amendment, Treasury `TC_10YEAR` is admitted and Policy /
Rates is classifiable. The current assessment is `PROVISIONAL / MIXED`. The completed
[2015–2025 CURRENT / REVISED-HISTORY DIAGNOSTIC](docs/diagnostics/2026-10-04-current-revised-history-2015-2025.md)
contains 132 monthly snapshots. October 2025 is `NOT_EVALUATED` because the exact CPI endpoint is
missing. This is revised-history analysis only, not point-in-time/vintage backtesting.

The six labels are Goldilocks, Inflationary Expansion / Reflation, Stagflationary, Contraction /
Recessionary, Disinflationary Slowdown, and Mixed. Rules are evaluated as an unordered set; missing
data ambiguity is provisional or insufficient, never Mixed. Stagflationary Option B requires hot
inflation plus broad moderate weakness in both growth and labor, or severe weakness in either, unless
growth and labor diverge. Inflationary Expansion / Reflation requires hot inflation with resilient
activity and no divergence; it does not claim demand overheating or identify the cause of inflation.

Data Quality describes input-source quality using a fixed denominator. Regime Clarity describes
classification support and sensitivity. Neither is a probability, confidence estimate, forecast, or
backtest result. The daily report is a deterministic rules brief, not AI-generated.

## Local Setup

Use Node.js 20 LTS or newer.

```bash
npm install
npm run dev
```

Open `http://localhost:3000`. Without an EIA key, oil is visibly unavailable while the rest of the
dashboard continues to load. To enable Brent locally, create an ignored `.env.local` file:

```bash
EIA_API_KEY=your-eia-key
```

Never commit `.env.local` or expose the key to client code. Provider fetches are server-side and use
cadence-aware Next.js caching: Mempool 300 seconds, daily feeds at least 3600 seconds, and BLS CPI
21600 seconds.

## API

- `GET /api/market-data` returns normalized observations and provenance, the five monitoring scores,
  a structured `regime` assessment (status, nullable label/clarity, Data Quality, factor readiness,
  rule diagnostics and sensitivity), and nullable `researchImplications`.
- `GET /api/ai-report` returns a deterministic rules brief from the same service, including status,
  Data Quality, Regime Clarity, monitoring signals, and a coverage brief when the regime is withheld.

## Deploy On Netlify

The repository is connected to the existing Netlify site at
[macro-regime-ai-dashboard.netlify.app](https://macro-regime-ai-dashboard.netlify.app). Keep the
production branch set to `main` and the build command set to `npm run build`; use Netlify's Next.js
runtime integration rather than configuring a static export. To populate Brent, add `EIA_API_KEY`
in the site's environment-variable settings for the production deploy context, then trigger a new
deploy. If the key is absent, the dashboard remains deployable and labels oil unavailable.

After deploy, verify the homepage, `/api/market-data`, and `/api/ai-report`. Check source statuses,
the substitute labels, and that no credential appears in either API response.

Do not promote this core-integration branch to production while the source/method gate is unresolved
or the required revised-history diagnostic remains NOT RUN.

## Checks

```bash
npm test
npm run lint
npx tsc --noEmit
npm run build
```
