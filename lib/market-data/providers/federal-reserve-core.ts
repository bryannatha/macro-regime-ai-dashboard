import { parseFiniteNumber, parseIsoDate } from "@/lib/market-data/parsers";
import {
  cachedFetchOptions,
  fetchedAtFrom,
  type AdapterOptions,
  type CoreObservationSeriesResult,
  type CoreSourceObservation,
} from "@/lib/market-data/types";

const industrialProductionEndpoint = "https://www.federalreserve.gov/releases/g17/Current/ipdisk/ip_sa.txt";
const policyActionsEndpoint = "https://www.federalreserve.gov/monetarypolicy/openmarket.htm";
const policyIdentifier = "FOMC target range/action history";

function unavailable(
  sourceId: string,
  identifier: string,
  retrievedAt: string | null,
  state: CoreObservationSeriesResult["state"],
  reason: string,
): CoreObservationSeriesResult {
  return {
    sourceId,
    identifier,
    state,
    observations: [],
    parserStatus: state === "FAILED" ? "FAILED" : "PARTIAL",
    historyStatus: "PARTIAL",
    retrievedAt,
    reason,
  };
}

function observation(
  sourceId: string,
  identifier: string,
  value: number,
  unit: string,
  seasonalBasis: string,
  observedAt: string,
  retrievedAt: string,
): CoreSourceObservation {
  return {
    sourceId,
    identifier,
    value,
    unit,
    seasonalBasis,
    observedAt,
    releasedAt: null,
    retrievedAt,
    firstSeenAt: null,
    releaseDateQuality: 0,
    version: null,
    vintage: null,
  };
}

export function parseFederalReserveIndustrialProduction(
  input: string,
  retrievedAt: string,
): CoreObservationSeriesResult {
  const sourceId = "federal-reserve-g17-ip";
  const identifier = "B50001";
  try {
    if (typeof input !== "string" || /<\s*html\b/i.test(input) || !parseIsoDate(retrievedAt.slice(0, 10))) {
      return unavailable(sourceId, identifier, null, "FAILED", "The G.17 response was not a valid data file.");
    }
    const lines = input.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
    if (!lines.some((line) => /^"B50001:\s*Total index"$/i.test(line))) {
      return unavailable(sourceId, identifier, retrievedAt, "MISSING", "The G.17 total-index identifier was not present.");
    }

    const valuesByPeriod = new Map<string, number>();
    const seenYears = new Set<number>();
    for (const line of lines) {
      const match = /^"([A-Z]\d{5})"\s+(\d{4})\s+(.+)$/.exec(line);
      if (!match || match[1] !== identifier) continue;
      const year = Number(match[2]);
      if (seenYears.has(year)) {
        return unavailable(sourceId, identifier, retrievedAt, "FAILED", "The G.17 file repeated a registered year.");
      }
      seenYears.add(year);
      const months = match[3].trim().split(/\s+/);
      if (months.length === 0 || months.length > 12) {
        return unavailable(sourceId, identifier, retrievedAt, "FAILED", "A G.17 annual row contained an invalid number of monthly cells.");
      }
      months.forEach((rawValue, index) => {
        if (rawValue === ".") return;
        const value = parseFiniteNumber(rawValue);
        if (value === null || value <= 0) throw new Error("Invalid G.17 value");
        valuesByPeriod.set(`${year}-${String(index + 1).padStart(2, "0")}`, value);
      });
    }

    const periods = Array.from(valuesByPeriod.keys()).sort();
    if (periods.length < 84) {
      return unavailable(sourceId, identifier, retrievedAt, "MISSING", "The G.17 total-index history is shorter than the registered minimum.");
    }
    const contiguous = periods.every((period, index) => {
      if (index === 0) return true;
      const [previousYear, previousMonth] = periods[index - 1].split("-").map(Number);
      const [year, month] = period.split("-").map(Number);
      return year * 12 + month === previousYear * 12 + previousMonth + 1;
    });
    if (!contiguous) {
      return unavailable(sourceId, identifier, retrievedAt, "FAILED", "The G.17 total-index history contains a missing month.");
    }

    return {
      sourceId,
      identifier,
      state: "AVAILABLE",
      observations: periods.map((period) => observation(
        sourceId,
        identifier,
        valuesByPeriod.get(period)!,
        "index (G.17 total, release-defined base)",
        "SA",
        `${period}-01`,
        retrievedAt,
      )),
      parserStatus: "VERIFIED",
      historyStatus: "VERIFIED",
      retrievedAt,
      reason: null,
    };
  } catch {
    return unavailable(sourceId, identifier, retrievedAt, "FAILED", "The G.17 industrial-production file could not be parsed.");
  }
}

function cellText(raw: string): string {
  return raw.replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;|&#160;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&ndash;|&#8211;/gi, "-")
    .replace(/&mdash;|&#8212;/gi, "-")
    .replace(/\s+/g, " ")
    .trim();
}

function parseActionDate(value: string, year: number): string | null {
  const normalized = value.replace(/\s*\*+$/, "").trim();
  const match = /^([A-Za-z]+)\s+(\d{1,2})$/.exec(normalized);
  if (!match) return null;
  const monthNames = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"];
  const month = monthNames.indexOf(match[1].toLowerCase());
  if (month < 0) return null;
  const date = `${year}-${String(month + 1).padStart(2, "0")}-${match[2].padStart(2, "0")}`;
  return parseIsoDate(date);
}

function parseTargetLevel(value: string): number | null {
  const normalized = value.replace(/%/g, "").trim();
  const range = /^([+-]?(?:\d+(?:\.\d*)?|\.\d+))\s*(?:-|to)\s*([+-]?(?:\d+(?:\.\d*)?|\.\d+))$/i.exec(normalized);
  if (range) {
    const lower = parseFiniteNumber(range[1]);
    const upper = parseFiniteNumber(range[2]);
    if (lower === null || upper === null || lower > upper) return null;
    return (lower + upper) / 2;
  }
  return parseFiniteNumber(normalized);
}

function validActionChange(value: string): boolean {
  if (value === "...") return true;
  const range = /^(\d+(?:\.\d+)?)\s*-\s*(\d+(?:\.\d+)?)$/.exec(value);
  if (range) {
    const lower = parseFiniteNumber(range[1]);
    const upper = parseFiniteNumber(range[2]);
    return lower !== null && upper !== null && lower <= upper;
  }
  const numeric = parseFiniteNumber(value);
  return numeric !== null && numeric >= 0;
}

export function parseFederalReservePolicyActions(
  html: string,
  retrievedAt: string,
): CoreObservationSeriesResult {
  const sourceId = "federal-reserve-policy-actions";
  try {
    if (typeof html !== "string" || !/<table\b/i.test(html) || !parseIsoDate(retrievedAt.slice(0, 10))) {
      return unavailable(sourceId, policyIdentifier, null, "FAILED", "The Federal Reserve policy-action page was not valid HTML data.");
    }

    const events: CoreSourceObservation[] = [];
    let currentYear: number | null = null;
    const tokens = /<h[1-6]\b[^>]*>([\s\S]*?)<\/h[1-6]>|<tr\b[^>]*>([\s\S]*?)<\/tr>/gi;
    for (const token of Array.from(html.matchAll(tokens))) {
      if (token[1] !== undefined) {
        const yearText = cellText(token[1]);
        currentYear = /^\d{4}$/.test(yearText) ? Number(yearText) : null;
        continue;
      }
      if (currentYear === null || token[2] === undefined) continue;
      const cells = Array.from(token[2].matchAll(/<td\b[^>]*>([\s\S]*?)<\/td>/gi)).map((cell) => cellText(cell[1]));
      if (cells.length === 0) continue;
      if (cells.length !== 4) {
        return unavailable(sourceId, policyIdentifier, retrievedAt, "FAILED", "A Federal Reserve policy-action row had an unexpected shape.");
      }
      const observedAt = parseActionDate(cells[0], currentYear);
      const changesValid = validActionChange(cells[1]) && validActionChange(cells[2]);
      const level = parseTargetLevel(cells[3]);
      if (!observedAt || !changesValid || level === null || level < 0 || level > 25) {
        return unavailable(sourceId, policyIdentifier, retrievedAt, "FAILED", "A Federal Reserve policy-action row contained invalid values.");
      }
      events.push(observation(sourceId, policyIdentifier, level, "percent", "Not seasonally adjusted", observedAt, retrievedAt));
    }

    events.sort((a, b) => a.observedAt.localeCompare(b.observedAt));
    if (events.length < 4 || events[0].observedAt.slice(0, 4) !== "2003" ||
        new Set(events.map((event) => event.observedAt)).size !== events.length) {
      return unavailable(sourceId, policyIdentifier, retrievedAt, "MISSING", "The Federal Reserve target-action history is incomplete or duplicated.");
    }

    return {
      sourceId,
      identifier: policyIdentifier,
      state: "AVAILABLE",
      observations: events,
      parserStatus: "VERIFIED",
      historyStatus: "VERIFIED",
      retrievedAt,
      reason: "Action dates are effective/observed dates; announcement publication dates are not supplied by this table.",
    };
  } catch {
    return unavailable(sourceId, policyIdentifier, retrievedAt, "FAILED", "The Federal Reserve policy-action history could not be parsed.");
  }
}

export async function fetchFederalReserveIndustrialProduction(options: AdapterOptions = {}): Promise<CoreObservationSeriesResult> {
  const retrievedAt = fetchedAtFrom(options.now ?? new Date());
  try {
    const response = await (options.fetchImpl ?? fetch)(industrialProductionEndpoint, cachedFetchOptions(21600));
    if (!response.ok) return unavailable("federal-reserve-g17-ip", "B50001", null, "FAILED", "The G.17 source returned an unsuccessful response.");
    return parseFederalReserveIndustrialProduction(await response.text(), retrievedAt);
  } catch {
    return unavailable("federal-reserve-g17-ip", "B50001", null, "FAILED", "The G.17 source is temporarily unavailable.");
  }
}

export async function fetchFederalReservePolicyActions(options: AdapterOptions = {}): Promise<CoreObservationSeriesResult> {
  const retrievedAt = fetchedAtFrom(options.now ?? new Date());
  try {
    const response = await (options.fetchImpl ?? fetch)(policyActionsEndpoint, cachedFetchOptions(86400));
    if (!response.ok) return unavailable("federal-reserve-policy-actions", policyIdentifier, null, "FAILED", "The Federal Reserve policy-action source returned an unsuccessful response.");
    return parseFederalReservePolicyActions(await response.text(), retrievedAt);
  } catch {
    return unavailable("federal-reserve-policy-actions", policyIdentifier, null, "FAILED", "The Federal Reserve policy-action source is temporarily unavailable.");
  }
}
