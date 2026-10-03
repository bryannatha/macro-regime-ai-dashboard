import type { MetricObservation } from "@/lib/types";
import { createAvailableObservation, observationFailure, parseFiniteNumber, parseUsDate, parseXml } from "@/lib/market-data/parsers";
import { cachedFetchOptions, fetchedAtFrom, type AdapterOptions } from "@/lib/market-data/types";

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
