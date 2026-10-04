import type { MetricObservation } from "@/lib/types";
import { createAvailableObservation, observationFailure, parseFiniteNumber, parseIsoDate, parseXml } from "@/lib/market-data/parsers";
import {
  cachedFetchOptions,
  fetchedAtFrom,
  type AdapterOptions,
  type CoreObservationSeriesResult,
} from "@/lib/market-data/types";

const source = "U.S. Department of the Treasury";
const sourceUrl = "https://home.treasury.gov/treasury-daily-interest-rate-xml-feed";
const endpoint = "https://home.treasury.gov/resource-center/data-chart-center/interest-rates/pages/xml";
type YieldKey = "twoYearYield" | "tenYearRealYield";
type YieldResult = Record<YieldKey, MetricObservation>;

function parseEntries(xml: string): Array<Record<string, unknown>> {
  const root = parseXml(xml).feed as Record<string, unknown> | undefined;
  const rawEntries = root?.entry;
  if (!Array.isArray(rawEntries)) return [];
  return rawEntries.flatMap((entry) => {
    const content = (entry as Record<string, unknown>).content as Record<string, unknown> | undefined;
    const properties = content?.properties as Record<string, unknown> | undefined;
    return properties ? [properties] : [];
  });
}

function parseYield(
  xml: string,
  field: string,
  key: YieldKey,
  label: string,
  fetchedAt: string,
): MetricObservation {
  try {
    const history = parseEntries(xml).flatMap((row) => {
      const dateValue = row.NEW_DATE;
      const date = typeof dateValue === "string" ? parseIsoDate(dateValue.slice(0, 10)) : null;
      const value = parseFiniteNumber(row[field]);
      return date && value !== null ? [{ date, value }] : [];
    }).sort((a, b) => a.date.localeCompare(b.date));
    const latest = history.at(-1);
    if (!latest) {
      return observationFailure(key, label, "%", source, sourceUrl, fetchedAt, "Daily", "No valid yield observations were returned.");
    }
    return createAvailableObservation({
      key,
      label,
      value: latest.value,
      unit: "%",
      source,
      sourceUrl,
      observedAt: latest.date,
      fetchedAt,
      cadence: "Daily",
      detail: "Daily Treasury business-day curve observation.",
      history,
    });
  } catch {
    return observationFailure(key, label, "%", source, sourceUrl, fetchedAt, "Daily", "The Treasury XML could not be parsed.");
  }
}

export function parseTreasuryYields(nominalXml: string, realXml: string, fetchedAt: string): YieldResult {
  void realXml;
  return {
    twoYearYield: parseYield(nominalXml, "BC_2YEAR", "twoYearYield", "U.S. 2-year Treasury yield", fetchedAt),
    tenYearRealYield: observationFailure(
      "tenYearRealYield",
      "U.S. 10-year real Treasury yield",
      "%",
      source,
      sourceUrl,
      fetchedAt,
      "Daily",
      "Treasury real-yield data are withheld until source-specific reuse/display terms are cleared.",
    ),
  };
}

export async function fetchTreasuryYields(options: AdapterOptions = {}): Promise<YieldResult> {
  const now = options.now ?? new Date();
  const fetchedAt = fetchedAtFrom(now);
  const fetchImpl = options.fetchImpl ?? fetch;
  const year = now.getUTCFullYear();
  const makeUrl = (data: string) => {
    const url = new URL(endpoint);
    url.searchParams.set("data", data);
    url.searchParams.set("field_tdr_date_value", String(year));
    return url;
  };

  let nominalResult = "<feed />";
  try {
    const response = await fetchImpl(makeUrl("daily_treasury_yield_curve"), cachedFetchOptions(3600));
    if (response.ok) nominalResult = await response.text();
  } catch {
    nominalResult = "<feed />";
  }
  return parseTreasuryYields(nominalResult, "", fetchedAt);
}

export function parseTreasuryRealYieldCore(
  _xml: string,
  _retrievedAt: string,
): CoreObservationSeriesResult {
  void _xml;
  void _retrievedAt;
  return {
    sourceId: "treasury-real-yield",
    identifier: "TC_10YEAR",
    state: "REDISTRIBUTION_BLOCKED",
    observations: [],
    parserStatus: "PARTIAL",
    historyStatus: "PARTIAL",
    retrievedAt: null,
    reason: "Treasury daily real-yield reuse/display terms have not been cleared for this source.",
  };
}
