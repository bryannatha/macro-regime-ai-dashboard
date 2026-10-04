import type {
  DashboardPayload,
  MetricObservation,
  ObservationKey,
  ObservationMap,
} from "@/lib/types";
import { getResearchImplications } from "@/lib/playbook";
import { evaluateRegime } from "@/lib/regime";
import { calculateScores } from "@/lib/scoring";
import { createUnavailableObservation } from "./parsers";
import type { AdapterOptions } from "./types";
import { getSourceRegistry } from "./source-registry";
import { fetchBlsCpi } from "./providers/bls";
import { fetchDolClaims } from "./providers/dol";
import { fetchEiaBrent } from "./providers/eia";
import { fetchFedBroadDollar } from "./providers/fed";
import { fetchFrankfurterUsdIdr } from "./providers/frankfurter";
import { fetchMempoolDemand } from "./providers/mempool";
import { fetchTreasuryYields } from "./providers/treasury";
import { createUnconfiguredRegimeInputs } from "./regime-inputs";

export interface DashboardOptions extends AdapterOptions {
  eiaApiKey?: string;
}

const sources = {
  bls: {
    name: "U.S. Bureau of Labor Statistics",
    url: "https://www.bls.gov/cpi/data.htm",
  },
  eia: {
    name: "U.S. Energy Information Administration",
    url: "https://www.eia.gov/opendata/browser/petroleum/pri/spt",
  },
  treasury: {
    name: "U.S. Department of the Treasury",
    url: "https://home.treasury.gov/treasury-daily-interest-rate-xml-feed",
  },
  dol: {
    name: "U.S. Department of Labor, ETA weekly claims",
    url: "https://oui.doleta.gov/unemploy/claims.asp",
  },
  fed: {
    name: "Federal Reserve Board H.10 via FRED",
    url: "https://fred.stlouisfed.org/series/DTWEXBGS",
  },
  mempool: {
    name: "Mempool.space public Bitcoin API",
    url: "https://mempool.space/docs/api/rest",
  },
  frankfurter: {
    name: "Frankfurter, filtered to ECB reference rates",
    url: "https://frankfurter.dev/",
  },
} as const;

function unavailable(
  key: ObservationKey,
  label: string,
  unit: string,
  source: string,
  sourceUrl: string,
  fetchedAt: string,
  cadence: MetricObservation["cadence"],
): MetricObservation {
  return createUnavailableObservation({
    key,
    label,
    unit,
    source,
    sourceUrl,
    fetchedAt,
    cadence,
    detail: "The public source is temporarily unavailable.",
  });
}

function excluded(
  key: ObservationKey,
  label: string,
  unit: string,
  fetchedAt: string,
  detail: string,
): MetricObservation {
  return {
    key,
    label,
    value: null,
    unit,
    source: "Not sourced in the public-data tier",
    sourceUrl: null,
    observedAt: null,
    fetchedAt,
    cadence: "Daily",
    status: "excluded",
    detail,
    history: [],
  };
}

async function isolateFailure<T>(promise: Promise<T>, fallback: T): Promise<T> {
  try {
    return await promise;
  } catch {
    return fallback;
  }
}

export async function getDashboardPayload(options: DashboardOptions = {}): Promise<DashboardPayload> {
  const now = options.now ?? new Date();
  const generatedAt = now.toISOString();
  const adapterOptions = { fetchImpl: options.fetchImpl, now };

  const [bls, oil, treasury, claims, dollar, mempool, usdidr] = await Promise.all([
    isolateFailure(
      fetchBlsCpi(adapterOptions),
      {
        cpi: unavailable("cpi", "CPI", "% YoY", sources.bls.name, sources.bls.url, generatedAt, "Monthly"),
        coreCpi: unavailable("coreCpi", "Core CPI", "% YoY", sources.bls.name, sources.bls.url, generatedAt, "Monthly"),
      },
    ),
    isolateFailure(
      fetchEiaBrent({ ...adapterOptions, apiKey: options.eiaApiKey }),
      unavailable("oil", "Brent crude", "USD / barrel", sources.eia.name, sources.eia.url, generatedAt, "Daily"),
    ),
    isolateFailure(
      fetchTreasuryYields(adapterOptions),
      {
        twoYearYield: unavailable("twoYearYield", "U.S. 2-year Treasury yield", "%", sources.treasury.name, sources.treasury.url, generatedAt, "Daily"),
        tenYearRealYield: unavailable("tenYearRealYield", "U.S. 10-year real Treasury yield", "%", sources.treasury.name, sources.treasury.url, generatedAt, "Daily"),
      },
    ),
    isolateFailure(
      fetchDolClaims(adapterOptions),
      unavailable("joblessClaims", "Initial claims (SA)", "thousand claims", sources.dol.name, sources.dol.url, generatedAt, "Weekly"),
    ),
    isolateFailure(
      fetchFedBroadDollar(adapterOptions),
      unavailable("broadDollarIndex", "Broad Dollar Index", "Index (Jan 2006=100)", sources.fed.name, sources.fed.url, generatedAt, "Daily"),
    ),
    isolateFailure(
      fetchMempoolDemand(adapterOptions),
      {
        mempoolVsize: unavailable("mempoolVsize", "Bitcoin mempool backlog", "vB", sources.mempool.name, sources.mempool.url, generatedAt, "Current"),
        mempoolMedianFeeRate: unavailable("mempoolMedianFeeRate", "Projected block median fee", "sat/vB", sources.mempool.name, sources.mempool.url, generatedAt, "Current"),
      },
    ),
    isolateFailure(
      fetchFrankfurterUsdIdr(adapterOptions),
      unavailable("usdidr", "USD / IDR (ECB cross)", "IDR per USD", sources.frankfurter.name, sources.frankfurter.url, generatedAt, "Daily"),
    ),
  ]);

  const observations: ObservationMap = {
    ...bls,
    oil,
    ...treasury,
    joblessClaims: claims,
    broadDollarIndex: dollar,
    ...mempool,
    usdidr,
    btcPrice: excluded(
      "btcPrice",
      "BTC spot price",
      "USD",
      generatedAt,
      "Excluded until a public source with confirmed display and redistribution rights is approved.",
    ),
    hySpread: excluded(
      "hySpread",
      "High-yield spread",
      "bps",
      generatedAt,
      "Excluded until a public source with confirmed display and redistribution rights is approved.",
    ),
    goldPrice: excluded(
      "goldPrice",
      "Gold spot price",
      "USD / troy oz",
      generatedAt,
      "Excluded until a public source with confirmed display and redistribution rights is approved.",
    ),
    stablecoinMarketCap: excluded(
      "stablecoinMarketCap",
      "Stablecoin market capitalization",
      "USD billions",
      generatedAt,
      "Excluded until a public source with confirmed display and redistribution rights is approved.",
    ),
  };
  const dates = Object.values(observations).flatMap((observation) =>
    observation.status === "available" && observation.observedAt ? [observation.observedAt] : [],
  );
  const scores = calculateScores(observations);
  // Current public feeds are monitoring proxies, not the registered two-family core-factor inputs.
  const regime = evaluateRegime(createUnconfiguredRegimeInputs());

  return {
    generatedAt,
    dataAsOf: dates.sort().at(-1) ?? null,
    sourceRegistry: getSourceRegistry(),
    observations,
    scores,
    regime,
    researchImplications: regime.regime ? getResearchImplications(regime.regime) : null,
  };
}
