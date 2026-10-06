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
const realYieldSourceUrl = "https://home.treasury.gov/resource-center/data-chart-center/interest-rates/TextView?type=daily_treasury_real_yield_curve";
const endpoint = "https://home.treasury.gov/resource-center/data-chart-center/interest-rates/pages/xml";
const realYieldDataset = "daily_treasury_real_yield_curve";
const firstRealYieldYear = 2003;
type YieldKey = "twoYearYield" | "tenYearRealYield";
type YieldResult = Record<YieldKey, MetricObservation>;

export interface TreasuryRealYieldOptions extends AdapterOptions {
  historyStartYear?: number;
}

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
  seriesUrl = sourceUrl,
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
      return observationFailure(key, label, "%", source, seriesUrl, fetchedAt, "Daily", "No valid yield observations were returned.");
    }
    return createAvailableObservation({
      key,
      label,
      value: latest.value,
      unit: "%",
      source,
      sourceUrl: seriesUrl,
      observedAt: latest.date,
      fetchedAt,
      cadence: "Daily",
      detail: key === "tenYearRealYield"
        ? "U.S. Treasury Daily Treasury Par Real Yield Curve Rates, native field TC_10YEAR; Treasury-derived value based on indicative market quotations obtained by FRBNY."
        : "Daily Treasury business-day curve observation.",
      history,
    });
  } catch {
    return observationFailure(key, label, "%", source, seriesUrl, fetchedAt, "Daily", "The Treasury XML could not be parsed.");
  }
}

export function parseTreasuryYields(nominalXml: string, realXml: string, fetchedAt: string): YieldResult {
  return {
    twoYearYield: parseYield(nominalXml, "BC_2YEAR", "twoYearYield", "U.S. 2-year Treasury yield", fetchedAt),
    tenYearRealYield: parseYield(realXml, "TC_10YEAR", "tenYearRealYield", "U.S. 10-year real Treasury yield", fetchedAt, realYieldSourceUrl),
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
  const fetchFeed = async (dataset: string): Promise<string> => {
    try {
      const response = await fetchImpl(makeUrl(dataset), cachedFetchOptions(3600));
      return response.ok ? await response.text() : "<feed />";
    } catch {
      return "<feed />";
    }
  };
  const [nominalXml, realXml] = await Promise.all([
    fetchFeed("daily_treasury_yield_curve"),
    fetchFeed(realYieldDataset),
  ]);
  return parseTreasuryYields(nominalXml, realXml, fetchedAt);
}

export function parseTreasuryRealYieldCore(
  xml: string,
  retrievedAt: string,
  expectedYear?: number,
): CoreObservationSeriesResult {
  const failure = (reason: string): CoreObservationSeriesResult => ({
    sourceId: "treasury-real-yield",
    identifier: "TC_10YEAR",
    state: "FAILED",
    observations: [],
    parserStatus: "FAILED",
    historyStatus: "PARTIAL",
    retrievedAt,
    reason,
  });
  try {
    const feed = parseXml(xml).feed as Record<string, unknown> | undefined;
    if (!feed) return failure("Treasury real-yield XML did not contain a feed root.");
    const entries = feed.entry;
    if (entries === undefined) {
      return {
        sourceId: "treasury-real-yield",
        identifier: "TC_10YEAR",
        state: "MISSING",
        observations: [],
        parserStatus: "VERIFIED",
        historyStatus: "PARTIAL",
        retrievedAt,
        reason: "The official Treasury feed contained no observations for this year.",
      };
    }
    if (!Array.isArray(entries)) return failure("Treasury real-yield XML entries had an unexpected shape.");

    const observations: CoreObservationSeriesResult["observations"] = [];
    for (const rawEntry of entries) {
      const entry = rawEntry as Record<string, unknown>;
      const content = entry.content as Record<string, unknown> | undefined;
      const properties = content?.properties as Record<string, unknown> | undefined;
      if (!properties) return failure("A Treasury real-yield XML entry omitted its properties block.");
      const dateText = properties.NEW_DATE;
      const date = typeof dateText === "string" ? parseIsoDate(dateText.slice(0, 10)) : null;
      const value = parseFiniteNumber(properties.TC_10YEAR);
      if (!date || value === null || value < -10 || value > 30 ||
          (expectedYear !== undefined && Number(date.slice(0, 4)) !== expectedYear)) {
        return failure("A Treasury real-yield XML row had an invalid date, TC_10YEAR value, or requested year.");
      }
      observations.push({
        sourceId: "treasury-real-yield",
        identifier: "TC_10YEAR",
        value,
        unit: "percent",
        seasonalBasis: "Not seasonally adjusted",
        observedAt: date,
        releasedAt: null,
        retrievedAt,
        firstSeenAt: null,
        releaseDateQuality: 0,
        version: null,
        vintage: null,
      });
    }

    observations.sort((left, right) => left.observedAt.localeCompare(right.observedAt));
    if (observations.some((observation, index) => index > 0 && observation.observedAt === observations[index - 1].observedAt)) {
      return failure("Treasury real-yield XML contained duplicate observation dates.");
    }
    return {
      sourceId: "treasury-real-yield",
      identifier: "TC_10YEAR",
      state: "AVAILABLE",
      observations,
      parserStatus: "VERIFIED",
      historyStatus: "PARTIAL",
      retrievedAt,
      reason: null,
    };
  } catch {
    return failure("The Treasury real-yield XML could not be parsed.");
  }
}

export async function fetchTreasuryRealYieldCore(options: TreasuryRealYieldOptions = {}): Promise<CoreObservationSeriesResult> {
  const now = options.now ?? new Date();
  const retrievedAt = fetchedAtFrom(now);
  const startYear = options.historyStartYear ?? firstRealYieldYear;
  const endYear = now.getUTCFullYear();
  const failed = (reason: string): CoreObservationSeriesResult => ({
    sourceId: "treasury-real-yield",
    identifier: "TC_10YEAR",
    state: "FAILED",
    observations: [],
    parserStatus: "FAILED",
    historyStatus: "FAILED",
    retrievedAt,
    reason,
  });
  if (!Number.isInteger(startYear) || startYear < firstRealYieldYear || startYear > endYear) {
    return failed("The Treasury real-yield history start year is outside the supported range.");
  }

  const fetchImpl = options.fetchImpl ?? fetch;
  const years = Array.from({ length: endYear - startYear + 1 }, (_, index) => startYear + index);
  const annualResults = await Promise.all(years.map(async (year) => {
    const url = new URL(endpoint);
    url.searchParams.set("data", realYieldDataset);
    url.searchParams.set("field_tdr_date_value", String(year));
    try {
      const response = await fetchImpl(url, cachedFetchOptions(86400));
      if (!response.ok) return { year, result: null };
      return { year, result: parseTreasuryRealYieldCore(await response.text(), retrievedAt, year) };
    } catch {
      return { year, result: null };
    }
  }));

  if (annualResults.some(({ result }) => result?.state === "FAILED")) {
    return failed("At least one Treasury annual real-yield response failed strict XML validation.");
  }
  const observations = annualResults.flatMap(({ result }) => result?.observations ?? [])
    .sort((left, right) => left.observedAt.localeCompare(right.observedAt));
  if (!observations.length) return failed("No valid Treasury TC_10YEAR observations were returned.");
  if (observations.some((observation, index) => index > 0 && observation.observedAt === observations[index - 1].observedAt)) {
    return failed("Treasury annual feeds contained duplicate TC_10YEAR observation dates.");
  }

  const missingYears = annualResults.filter(({ result }) => !result || result.observations.length === 0).map(({ year }) => year);
  const historyStatus = missingYears.length || startYear > firstRealYieldYear ? "PARTIAL" : "VERIFIED";
  return {
    sourceId: "treasury-real-yield",
    identifier: "TC_10YEAR",
    state: "AVAILABLE",
    observations,
    parserStatus: "VERIFIED",
    historyStatus,
    retrievedAt,
    reason: missingYears.length ? `Treasury history is partial; no usable observations were returned for ${missingYears.join(", ")}.` : null,
  };
}
