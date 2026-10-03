import type { MetricObservation, ObservationPoint } from "@/lib/types";
import { createAvailableObservation, observationFailure, parseFiniteNumber, parseIsoDate } from "@/lib/market-data/parsers";
import { cachedFetchOptions, fetchedAtFrom, type AdapterOptions } from "@/lib/market-data/types";

const source = "Frankfurter, filtered to ECB reference rates";
const sourceUrl = "https://frankfurter.dev/";
const endpoint = "https://api.frankfurter.dev/v2/providers/ecb/rates";

export function parseFrankfurterUsdIdr(payload: unknown, fetchedAt: string): MetricObservation {
  const rows = Array.isArray(payload) ? payload as Array<Record<string, unknown>> : [];
  const eurUsd = new Map<string, number>();
  const eurIdr = new Map<string, number>();
  for (const row of rows) {
    const date = parseIsoDate(row.date);
    const rate = parseFiniteNumber(row.rate);
    if (!date || rate === null || rate <= 0 || row.base !== "EUR") continue;
    if (row.quote === "USD") eurUsd.set(date, rate);
    if (row.quote === "IDR") eurIdr.set(date, rate);
  }

  const history: ObservationPoint[] = [];
  eurIdr.forEach((idr, date) => {
    const usd = eurUsd.get(date);
    if (usd === undefined) return;
    const value = idr / usd;
    if (Number.isFinite(value) && value > 0) history.push({ date, value });
  });
  history.sort((a, b) => a.date.localeCompare(b.date));
  const latest = history.at(-1);
  if (!latest) {
    return observationFailure("usdidr", "USD / IDR (ECB cross)", "IDR per USD", source, sourceUrl, fetchedAt, "Daily", "Matching same-date ECB EUR/IDR and EUR/USD reference rates are unavailable.");
  }

  return createAvailableObservation({
    key: "usdidr",
    label: "USD / IDR (ECB cross)",
    value: latest.value,
    unit: "IDR per USD",
    source,
    sourceUrl,
    observedAt: latest.date,
    fetchedAt,
    cadence: "Daily",
    detail: "EUR/IDR divided by EUR/USD; not BI JISDOR or tradable spot FX.",
    history,
  });
}

export async function fetchFrankfurterUsdIdr(options: AdapterOptions = {}): Promise<MetricObservation> {
  const now = options.now ?? new Date();
  const fetchedAt = fetchedAtFrom(now);
  const start = new Date(now);
  start.setUTCDate(start.getUTCDate() - 120);
  const url = new URL(endpoint);
  url.searchParams.set("quotes", "USD,IDR");
  url.searchParams.set("from", start.toISOString().slice(0, 10));

  try {
    const response = await (options.fetchImpl ?? fetch)(url, cachedFetchOptions(21600));
    if (!response.ok) {
      return observationFailure("usdidr", "USD / IDR (ECB cross)", "IDR per USD", source, sourceUrl, fetchedAt, "Daily", "The ECB reference-rate source returned an unsuccessful response.");
    }
    return parseFrankfurterUsdIdr(await response.json(), fetchedAt);
  } catch {
    return observationFailure("usdidr", "USD / IDR (ECB cross)", "IDR per USD", source, sourceUrl, fetchedAt, "Daily", "The ECB reference-rate source is temporarily unavailable.");
  }
}
