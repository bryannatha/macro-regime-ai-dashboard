import type { MetricObservation } from "@/lib/types";
import { createAvailableObservation, observationFailure, parseFiniteNumber, parseIsoDate, parseUsDate, parseXml, parseXmlWithAttributes } from "@/lib/market-data/parsers";
import {
  cachedFetchOptions,
  fetchedAtFrom,
  type AdapterOptions,
  type CoreObservationSeriesResult,
  type CoreSourceObservation,
} from "@/lib/market-data/types";

const endpoint = "https://oui.doleta.gov/unemploy/wkclaims/report.asp";
const source = "U.S. Department of Labor, ETA weekly claims";
const sourceUrl = "https://oui.doleta.gov/unemploy/claims.asp";

export function parseDolClaims(xml: string, fetchedAt: string): MetricObservation {
  try {
    const root = parseXml(xml).r539cyNational as Record<string, unknown> | undefined;
    const rawWeeks = root?.week;
    if (!Array.isArray(rawWeeks)) throw new Error("No weeks");
    const history = rawWeeks.flatMap((rawWeek) => {
      const week = rawWeek as Record<string, unknown>;
      const date = parseUsDate(week.weekEnded);
      const claims = week.InitialClaims as Record<string, unknown> | undefined;
      const seasonallyAdjusted = parseFiniteNumber(claims?.SA);
      return date && seasonallyAdjusted !== null && seasonallyAdjusted >= 0
        ? [{ date, value: seasonallyAdjusted / 1000 }]
        : [];
    }).sort((a, b) => a.date.localeCompare(b.date));
    const latest = history.at(-1);
    if (!latest) {
      return observationFailure("joblessClaims", "Initial claims (SA)", "thousand claims", source, sourceUrl, fetchedAt, "Weekly", "No valid seasonally adjusted U.S. claims observations were returned.");
    }

    return createAvailableObservation({
      key: "joblessClaims",
      label: "Initial claims (SA)",
      value: latest.value,
      unit: "thousand claims",
      source,
      sourceUrl,
      observedAt: latest.date,
      fetchedAt,
      cadence: "Weekly",
      detail: "Seasonally adjusted U.S. initial claims; subject to revision.",
      history,
    });
  } catch {
    return observationFailure("joblessClaims", "Initial claims (SA)", "thousand claims", source, sourceUrl, fetchedAt, "Weekly", "The DOL weekly-claims XML could not be parsed.");
  }
}

export async function fetchDolClaims(options: AdapterOptions = {}): Promise<MetricObservation> {
  const now = options.now ?? new Date();
  const fetchedAt = fetchedAtFrom(now);
  const year = now.getUTCFullYear();
  const form = new URLSearchParams({
    level: "us",
    strtdate: String(year - 1),
    enddate: String(year),
    filetype: "xml",
    final_yr: String(year + 1),
  });

  try {
    const response = await (options.fetchImpl ?? fetch)(endpoint, cachedFetchOptions(3600, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: form.toString(),
    }));
    if (!response.ok) {
      return observationFailure("joblessClaims", "Initial claims (SA)", "thousand claims", source, sourceUrl, fetchedAt, "Weekly", "The DOL source returned an unsuccessful response.");
    }
    return parseDolClaims(await response.text(), fetchedAt);
  } catch {
    return observationFailure("joblessClaims", "Initial claims (SA)", "thousand claims", source, sourceUrl, fetchedAt, "Weekly", "The DOL source is temporarily unavailable.");
  }
}

const coreIdentifier = "U.S. initial claims, seasonally adjusted (InitialClaims.SA)";

function unavailableCoreClaims(
  retrievedAt: string | null,
  state: CoreObservationSeriesResult["state"],
  reason: string,
): CoreObservationSeriesResult {
  return {
    sourceId: "dol-initial-claims",
    identifier: coreIdentifier,
    state,
    observations: [],
    parserStatus: state === "FAILED" ? "FAILED" : "PARTIAL",
    historyStatus: "PARTIAL",
    retrievedAt,
    reason,
  };
}

function isBlankClaimsValue(value: unknown): boolean {
  if (typeof value !== "string") return false;
  const trimmed = value.trim();
  return trimmed === "" || /^(?:&#0*160;|&#x0*a0;|&nbsp;)$/i.test(trimmed);
}

export function parseDolCoreClaims(xml: string, retrievedAt: string): CoreObservationSeriesResult {
  try {
    if (typeof xml !== "string" || !parseIsoDate(retrievedAt.slice(0, 10))) {
      return unavailableCoreClaims(null, "FAILED", "The DOL weekly-claims response was invalid.");
    }
    const root = parseXmlWithAttributes(xml).r539cyNational as Record<string, unknown> | undefined;
    const rawWeeks = root?.week;
    if (!Array.isArray(rawWeeks)) {
      return unavailableCoreClaims(retrievedAt, "MISSING", "The official DOL report contained no weekly claims rows.");
    }

    const rows: Array<{ date: string; value: number }> = [];
    const periodDates: string[] = [];
    let hasMissingHistoricalPeriod = false;
    const retrievalDate = Date.parse(`${retrievedAt.slice(0, 10)}T00:00:00.000Z`);
    const reportRunDate = parseUsDate(root?.["@_rundate"]);
    const version = reportRunDate ? `report-run:${reportRunDate}` : null;
    for (const rawWeek of rawWeeks) {
      const week = rawWeek as Record<string, unknown>;
      const date = parseUsDate(week.weekEnded);
      const claims = week.InitialClaims as Record<string, unknown> | undefined;
      const rawValue = claims?.SA;
      if (!date) {
        return unavailableCoreClaims(retrievedAt, "FAILED", "A DOL row lacked a valid week-ending date or SA claims value.");
      }
      periodDates.push(date);
      if (isBlankClaimsValue(rawValue)) {
        if (Date.parse(`${date}T00:00:00.000Z`) <= retrievalDate) hasMissingHistoricalPeriod = true;
        continue;
      }
      const value = parseFiniteNumber(rawValue);
      if (value === null || value < 0 || value > 10_000_000) {
        return unavailableCoreClaims(retrievedAt, "FAILED", "A DOL row lacked a valid week-ending date or SA claims value.");
      }
      rows.push({ date, value: value / 1000 });
    }
    rows.sort((a, b) => a.date.localeCompare(b.date));
    if (new Set(periodDates).size !== periodDates.length) {
      return unavailableCoreClaims(retrievedAt, "FAILED", "The DOL report contained duplicate week-ending observations.");
    }
    if (rows.length < 4) {
      return unavailableCoreClaims(retrievedAt, "MISSING", "The DOL report did not contain the required four-week window.");
    }
    const recent = rows.slice(-4);
    if (recent.some((row, index) => index > 0 && Date.parse(row.date) - Date.parse(recent[index - 1].date) !== 7 * 86_400_000)) {
      return unavailableCoreClaims(retrievedAt, "MISSING", "The DOL report did not contain four contiguous weekly observations.");
    }

    const latestDate = Date.parse(`${recent.at(-1)!.date}T00:00:00.000Z`);
    const ageDays = (retrievalDate - latestDate) / 86_400_000;
    if (!Number.isFinite(ageDays) || ageDays < 0 || ageDays > 21) {
      return {
        ...unavailableCoreClaims(retrievedAt, "STALE", "The latest DOL claims observation is older than the weekly freshness window."),
        parserStatus: "VERIFIED",
      };
    }

    const observations = rows.map((row): CoreSourceObservation => ({
      sourceId: "dol-initial-claims",
      identifier: coreIdentifier,
      value: row.value,
      unit: "thousand claims",
      seasonalBasis: "SA",
      observedAt: row.date,
      releasedAt: null,
      retrievedAt,
      firstSeenAt: null,
      releaseDateQuality: 0,
      version,
      vintage: null,
    }));
    const historyIsContiguous = !hasMissingHistoricalPeriod && rows.every((row, index) => index === 0 ||
      Date.parse(row.date) - Date.parse(rows[index - 1].date) === 7 * 86_400_000);
    const hasLongHistory = observations.length >= 520 &&
      observations[0].observedAt <= "2015-01-10" && historyIsContiguous;
    return {
      sourceId: "dol-initial-claims",
      identifier: coreIdentifier,
      state: "AVAILABLE",
      observations,
      parserStatus: "VERIFIED",
      historyStatus: hasLongHistory ? "VERIFIED" : "PARTIAL",
      retrievedAt,
      reason: "Week-ending dates are observations; the report run date is not treated as a release date or vintage.",
    };
  } catch {
    return unavailableCoreClaims(retrievedAt, "FAILED", "The DOL core weekly-claims XML could not be parsed.");
  }
}

export async function fetchDolCoreClaims(options: AdapterOptions = {}): Promise<CoreObservationSeriesResult> {
  const now = options.now ?? new Date();
  const retrievedAt = fetchedAtFrom(now);
  const year = now.getUTCFullYear();
  const form = new URLSearchParams({
    level: "us",
    strtdate: "2015",
    enddate: String(year),
    filetype: "xml",
    final_yr: String(year + 1),
  });

  try {
    const response = await (options.fetchImpl ?? fetch)(endpoint, cachedFetchOptions(3600, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: form.toString(),
    }));
    if (!response.ok) return unavailableCoreClaims(null, "FAILED", "The DOL source returned an unsuccessful response.");
    return parseDolCoreClaims(await response.text(), retrievedAt);
  } catch {
    return unavailableCoreClaims(null, "FAILED", "The DOL source is temporarily unavailable.");
  }
}
