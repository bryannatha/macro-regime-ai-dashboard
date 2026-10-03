# Macro Regime AI Dashboard

A Next.js 15 App Router research dashboard that scores macro signals across inflation, growth
stress, liquidity, crypto demand, and Indonesia FX risk. The current deployment is a static demo;
it does not connect to live market feeds.

This project is an educational research dashboard only. It is not financial advice, investment
advice, trading advice, or a recommendation to buy, sell, hold, or short any asset.

## Included

- Local mock time-series data for CPI, Core CPI, Oil, DXY, yields, spreads, claims, BTC,
  stablecoins, USDIDR, and gold.
- Deterministic category scoring in `lib/scoring.ts`, with weights, scaling ranges, and score direction exposed to the UI.
- Six-state regime classification, with heuristic confidence explicitly labeled as uncalibrated.
- Asset playbook mapping in `lib/playbook.ts`.
- Rules-generated sample brief endpoint at `GET /api/ai-report`.
- Responsive monitoring workspace with Overview, Signals & Data, and Methodology views.
- Sample cadence labels and explicit sample observation date.

## Project Links

- Live Netlify deployment: `https://macro-regime-ai-dashboard.netlify.app`
- GitHub repository: `https://github.com/bryannatha/macro-regime-ai-dashboard`

Netlify is currently used for hosting. Vercel deployment is postponed because of an
account/workspace issue.

## Current Status

This project is an MVP. The dashboard uses mock market data, and `GET /api/ai-report` returns a
mock AI report instead of calling a live model or external data providers.

## Run Locally

Install dependencies:

```bash
npm install
```

Start the Next.js development server:

```bash
npm run dev
```

Open the app at `http://localhost:3000`.

The dashboard currently uses local mock observations from `data/mock-metrics.ts`. No external data
provider keys are required for local development today.

## Validate Changes

Available project checks:

```bash
npm run test
npm run lint
npm run build
```

Netlify validation may run these checks automatically during deploy or review. Avoid committing
generated build output.

## Macro Scores

Scores are calculated in `lib/scoring.ts` on a 0-100 scale. Higher values do not always mean
"better"; each category has its own interpretation.

### Inflation Pressure

Measures whether price pressure is becoming more elevated. It blends:

- Headline CPI, weighted 40%
- Core CPI, weighted 35%
- Brent oil price, weighted 25%

Higher scores mean inflation pressure is more elevated. Lower scores mean inflation pressure is
more contained.

### Growth Stress

Measures whether credit and labor-market stress are rising. It blends:

- High-yield credit spreads, weighted 45%
- Jobless claims, weighted 35%
- 2-year Treasury yield, weighted 20%

Higher scores mean growth or credit stress is more elevated. Lower scores mean stress is more
contained.

### Liquidity

Measures whether financial liquidity is supportive for risk assets. It blends:

- Lower DXY, weighted 25%
- Lower 10-year real yield, weighted 25%
- Stablecoin market cap level, weighted 30%
- Month-on-month stablecoin market cap momentum, weighted 20%

Higher scores mean liquidity is more constructive. Lower scores mean liquidity is softer or more
restrictive.

### Crypto Demand

Measures whether digital-asset demand is strengthening. It blends:

- BTC price level, weighted 45%
- Stablecoin market cap level, weighted 35%
- Month-on-month BTC price momentum, weighted 20%

Higher scores mean crypto demand is stronger. Lower scores mean crypto demand is softer.

### Indonesia Risk

Measures external pressure relevant to Indonesia-facing macro risk. It blends:

- USDIDR, weighted 50%
- DXY, weighted 25%
- Brent oil price, weighted 25%

Higher scores mean Indonesia external or FX risk is more elevated. Lower scores mean those
pressures are more contained.

## Six-Regime Classifier

The classifier in `lib/scoring.ts` evaluates the scores in a fixed order and returns the first
matching regime. This means the order matters: a snapshot that satisfies an earlier rule will not
fall through to later rules.

1. **Hard Landing**: Growth stress is at least 68, liquidity is below 42, and inflation pressure is
   below 62. This captures acute growth stress without enough liquidity support.
2. **Stagflation**: Inflation pressure is at least 62 and growth stress is at least 55. This
   captures the difficult mix of sticky inflation and slowing activity.
3. **Commodity Inflation**: Inflation pressure is at least 60 and oil is at least 85. This captures
   an oil-driven inflation impulse.
4. **Fiat Debasement**: Liquidity is at least 64, crypto demand is at least 63, and gold is at least
   2850. This captures simultaneous strength in liquidity, digital assets, and gold.
5. **Liquidity Reflation**: Liquidity is at least 52 and crypto demand is at least 54. This captures
   a constructive liquidity and risk-appetite backdrop.
6. **Goldilocks**: The fallback regime when no higher-priority stress, inflation, debasement, or
   reflation condition is met. This captures a more balanced macro backdrop.

Each regime also receives a deterministic confidence score based on the same inputs. The confidence
score is a rules-based signal strength indicator, not a probability forecast.

## Asset Playbook

The asset playbook in `lib/playbook.ts` maps the detected regime to a research thesis and three
asset lists:

- **Favor**: Assets or exposures that the ruleset considers most aligned with the detected regime.
- **Neutral**: Assets or exposures that the ruleset treats as mixed, secondary, or less directly
  expressed by the regime.
- **Reduce**: Assets or exposures that the ruleset considers less aligned with the detected regime.

The playbook is descriptive and educational. It does not create trade orders, position sizes, risk
limits, portfolio allocations, or personalized recommendations.

## Mock AI Report

`GET /api/ai-report` returns a mocked structured daily report using the latest local snapshot, the
calculated scores, the detected regime, and the asset playbook. The endpoint does not call OpenAI
yet and does not require an API key today.

## Phase 2 Roadmap

Phase 2 will replace the MVP mocks with live integrations for:

- FRED macro data
- CoinGecko crypto market data
- Alpha Vantage market data
- EIA energy data
- Supabase persistence or synchronization, if still needed
- OpenAI-powered report generation

## Future Environment Variables

The app is currently mock-data driven. Later integrations will need environment variables for data
providers, persistence, and AI generation. Use provider-specific names that match the final
integration code; the names below are the expected placeholders.

```bash
# FRED macro data
FRED_API_KEY=

# CoinGecko crypto market data
COINGECKO_API_KEY=

# Alpha Vantage market data
ALPHA_VANTAGE_API_KEY=

# EIA energy data
EIA_API_KEY=

# Supabase, if used for external data storage or sync jobs
SUPABASE_URL=
SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# OpenAI, if the mocked report endpoint is upgraded to live generation
OPENAI_API_KEY=
OPENAI_MODEL=
```

Do not expose secret values in client components, logs, browser-visible responses, or committed
files. Server-only keys should stay in Netlify environment variables or another secure deployment
secret store.

## Important Disclaimer

This dashboard is for education, research, and scenario analysis. It uses simplified scoring rules
and mock data, so outputs can be incomplete, stale, or wrong. Nothing in the UI, API responses,
README, scores, regimes, or playbooks should be interpreted as financial advice or as a
recommendation for any investment decision. Consult qualified professionals and independent data
sources before making financial decisions.
