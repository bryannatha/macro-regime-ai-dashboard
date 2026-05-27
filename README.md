# Macro Regime AI Dashboard

A Next.js 15 App Router research dashboard that scores macro signals across inflation, growth
stress, liquidity, crypto demand, and Indonesia FX risk.

## Included

- Local mock time-series data for CPI, Core CPI, Oil, DXY, yields, spreads, claims, BTC,
  stablecoins, USDIDR, and gold.
- Deterministic category scoring in `lib/scoring.ts` and six-state regime classification.
- Asset playbook mapping in `lib/playbook.ts`.
- Mock structured daily report endpoint at `GET /api/ai-report`.
- Responsive shadcn-style card/table UI and Recharts visualizations.

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Validate

```bash
npm run test
npm run lint
npm run build
```

## Future integrations

The local mock dataset can later be replaced with Supabase-backed observations. The AI report
route is intentionally mocked and can later be upgraded to an OpenAI API call without adding
trading execution or brokerage integration.
