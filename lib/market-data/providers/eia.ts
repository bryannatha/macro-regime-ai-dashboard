import type { MetricObservation } from "@/lib/types";
import { createAvailableObservation, observationFailure, parseFiniteNumber, parseIsoDate } from "@/lib/market-data/parsers";
import { cachedFetchOptions, fetchedAtFrom, type EiaAdapterOptions } from "@/lib/market-data/types";

const endpoint = "https://api.eia.gov/v2/petroleum/pri/spt/data/";
const source = "U.S. Energy Information Administration";
const sourceUrl = "https://www.eia.gov/opendata/browser/petroleum/pri/spt";

export function parseEiaBrent(payload: unknown, fetchedAt: string): MetricObservation {
  const rows = (payload as { response?: { data?: Array<Record<string, unknown>> } })?.response?.data;
  const history = (Array.isArray(rows) ? rows : []).flatMap((row) => {
    const date = parseIsoDate(row.period);
    const value = parseFiniteNumber(row.value);
    return date && row.series === "RBRTE" && value !== null && value > 0
      ? [{ date, value }]
      : [];
  }).sort((a, b) => a.date.localeCompare(b.date));
  const latest = history.at(-1);
  if (!latest) {
    return observationFailure("oil", "Brent crude", "USD / barrel", source, sourceUrl, fetchedAt, "Daily", "No valid Brent spot-price observations were returned.");
  }

  return createAvailableObservation({
    key: "oil",
    label: "Brent crude",
    value: latest.value,
    unit: "USD / barrel",
    source,
    sourceUrl,
    observedAt: latest.date,
    fetchedAt,
    cadence: "Daily",
    detail: "Europe Brent spot price FOB; the feed may be revised.",
    history,
  });
}

export async function fetchEiaBrent(options: EiaAdapterOptions = {}): Promise<MetricObservation> {
  const now = options.now ?? new Date();
  const fetchedAt = fetchedAtFrom(now);
  const apiKey = options.apiKey ?? process.env.EIA_API_KEY;
  if (!apiKey?.trim()) {
    return observationFailure("oil", "Brent crude", "USD / barrel", source, sourceUrl, fetchedAt, "Daily", "EIA_API_KEY is not configured on the server.");
  }

  const fetchImpl = options.fetchImpl ?? fetch;
  const url = new URL(endpoint);
  url.searchParams.set("api_key", apiKey);
  url.searchParams.set("frequency", "daily");
  url.searchParams.append("data[0]", "value");
  url.searchParams.append("facets[series][]", "RBRTE");
  url.searchParams.set("sort[0][column]", "period");
  url.searchParams.set("sort[0][direction]", "desc");
  url.searchParams.set("length", "400");

  try {
    const response = await fetchImpl(url, cachedFetchOptions(3600));
    if (!response.ok) {
      return observationFailure("oil", "Brent crude", "USD / barrel", source, sourceUrl, fetchedAt, "Daily", "The EIA source returned an unsuccessful response.");
    }
    return parseEiaBrent(await response.json(), fetchedAt);
  } catch {
    return observationFailure("oil", "Brent crude", "USD / barrel", source, sourceUrl, fetchedAt, "Daily", "The EIA source is temporarily unavailable.");
  }
}
