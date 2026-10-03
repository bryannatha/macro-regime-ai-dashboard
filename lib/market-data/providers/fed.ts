import { parse } from "csv-parse/sync";
import type { MetricObservation } from "@/lib/types";
import { createAvailableObservation, observationFailure, parseFiniteNumber, parseIsoDate } from "@/lib/market-data/parsers";
import { cachedFetchOptions, fetchedAtFrom, type AdapterOptions } from "@/lib/market-data/types";

const source = "Federal Reserve Board H.10 via Federal Reserve Bank of St. Louis (FRED)";
const sourceUrl = "https://fred.stlouisfed.org/series/DTWEXBGS";
const endpoint = "https://fred.stlouisfed.org/graph/fredgraph.csv";

export function parseFedBroadDollar(csv: string, fetchedAt: string): MetricObservation {
  try {
    const rows = parse(csv, {
      bom: true,
      columns: true,
      skip_empty_lines: true,
      trim: true,
    }) as Array<Record<string, string>>;
    const history = rows.flatMap((row) => {
      const date = parseIsoDate(row.observation_date);
      const value = parseFiniteNumber(row.DTWEXBGS);
      return date && value !== null && value > 0 ? [{ date, value }] : [];
    }).sort((a, b) => a.date.localeCompare(b.date));
    const latest = history.at(-1);
    if (!latest) {
      return observationFailure("broadDollarIndex", "Broad Dollar Index", "Index (Jan 2006=100)", source, sourceUrl, fetchedAt, "Daily", "No valid H.10 Broad Dollar observations were returned.");
    }
    return createAvailableObservation({
      key: "broadDollarIndex",
      label: "Broad Dollar Index",
      value: latest.value,
      unit: "Index (Jan 2006=100)",
      source,
      sourceUrl,
      observedAt: latest.date,
      fetchedAt,
      cadence: "Daily",
      detail: "Federal Reserve H.10 Nominal Broad U.S. Dollar Index, delivered by FRED; not ICE DXY.",
      history,
    });
  } catch {
    return observationFailure("broadDollarIndex", "Broad Dollar Index", "Index (Jan 2006=100)", source, sourceUrl, fetchedAt, "Daily", "The FRED CSV could not be parsed.");
  }
}

export async function fetchFedBroadDollar(options: AdapterOptions = {}): Promise<MetricObservation> {
  const now = options.now ?? new Date();
  const fetchedAt = fetchedAtFrom(now);
  const start = new Date(now);
  start.setUTCDate(start.getUTCDate() - 365);
  const url = new URL(endpoint);
  url.searchParams.set("id", "DTWEXBGS");
  url.searchParams.set("cosd", start.toISOString().slice(0, 10));

  try {
    const response = await (options.fetchImpl ?? fetch)(url, cachedFetchOptions(3600));
    if (!response.ok) {
      return observationFailure("broadDollarIndex", "Broad Dollar Index", "Index (Jan 2006=100)", source, sourceUrl, fetchedAt, "Daily", "The Federal Reserve/FRED source returned an unsuccessful response.");
    }
    return parseFedBroadDollar(await response.text(), fetchedAt);
  } catch {
    return observationFailure("broadDollarIndex", "Broad Dollar Index", "Index (Jan 2006=100)", source, sourceUrl, fetchedAt, "Daily", "The Federal Reserve/FRED source is temporarily unavailable.");
  }
}
