import type { MetricObservation } from "@/lib/types";
import { createAvailableObservation, observationFailure, parseFiniteNumber, parseIsoDate, parseUsDate, parseXml, parseXmlWithAttributes } from "@/lib/market-data/parsers";
import {
  cachedFetchOptions,
  fetchedAtFrom,
  type AdapterOptions,
  type CoreObservationSeriesResult,
  type CoreSourceObservation,
} from "@/lib/market-data/types";

const source = "U.S. Department of Labor, ETA weekly claims";
const sourceUrl = "https://oui.doleta.gov/unemploy/weeklyRedirect.php";
const releaseTitle = "Seasonally Adjusted US Weekly UI Claims (in thousands)";

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
  const series = await fetchDolCoreClaims({ ...options, now });
  if (series.state !== "AVAILABLE" || series.observations.length === 0) {
    return observationFailure(
      "joblessClaims", "Initial claims (SA)", "thousand claims", source, sourceUrl, fetchedAt, "Weekly",
      series.reason ?? "The DOL weekly claims release did not contain eligible observations.",
    );
  }
  const history = series.observations.map(({ observedAt, value }) => ({ date: observedAt, value }));
  const latest = history.at(-1)!;
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
    detail: "Seasonally adjusted national initial claims; current weekly release, subject to revision.",
    history,
  });
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

const weekdayPattern = "Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday";
const longDatePattern = "(?:January|February|March|April|May|June|July|August|September|October|November|December)";
const releaseHeader = "UNEMPLOYMENT INSURANCE WEEKLY CLAIMS";
const seasonalHeader = "SEASONALLY ADJUSTED DATA";
const expectedClaimsHeaderRows = [
  "change change",
  "from from",
  "initial prior 4-week insured prior 4-week",
  "week ending claims week average unemployment week average iur",
];

function parseDolLongDate(value: string): string | null {
  const match = new RegExp(`^(${longDatePattern})\\s+(\\d{1,2}),\\s*(\\d{4})$`).exec(value.trim());
  if (!match) return null;
  const month = new Map([
    ["January", 1], ["February", 2], ["March", 3], ["April", 4], ["May", 5], ["June", 6],
    ["July", 7], ["August", 8], ["September", 9], ["October", 10], ["November", 11], ["December", 12],
  ]).get(match[1]);
  if (!month) return null;
  const date = new Date(Date.UTC(Number(match[3]), month - 1, Number(match[2])));
  const iso = date.toISOString().slice(0, 10);
  return parseIsoDate(iso) && date.getUTCMonth() === month - 1 && date.getUTCDate() === Number(match[2]) ? iso : null;
}

function unavailableReleaseClaims(
  retrievedAt: string | null,
  state: CoreObservationSeriesResult["state"],
  reason: string,
): CoreObservationSeriesResult {
  return {
    ...unavailableCoreClaims(retrievedAt, state, reason),
    identifier: coreIdentifier,
  };
}

export function parseDolCoreClaimsReleaseText(lines: string[], retrievedAt: string): CoreObservationSeriesResult {
  try {
    if (!Array.isArray(lines) || !parseIsoDate(retrievedAt.slice(0, 10)) || !Number.isFinite(Date.parse(retrievedAt))) {
      return unavailableReleaseClaims(null, "FAILED", "The DOL weekly release response was invalid.");
    }
    const normalizedLines = lines.map((line) => line.trim()).filter(Boolean);
    const releaseDatePattern = new RegExp(`\\b(?:${weekdayPattern})\\s*,?\\s+(${longDatePattern}\\s+\\d{1,2},\\s+\\d{4})\\b`);
    const publishedLine = normalizedLines.find((line) => line.startsWith("8:30 A.M. (Eastern) ") && releaseDatePattern.test(line));
    const publishedMatch = publishedLine && releaseDatePattern.exec(publishedLine);
    const releasedAt = publishedMatch ? parseDolLongDate(publishedMatch[1]) : null;
    const titleIndex = normalizedLines.indexOf(releaseTitle);
    const tableHeaderRows = normalizedLines.slice(titleIndex + 1, titleIndex + 5).map((line) =>
      line.toLowerCase().replace(/\s*-\s*/g, "-").replace(/\s+/g, " ").trim(),
    );
    const hasExpectedColumns = expectedClaimsHeaderRows.every((header, index) => tableHeaderRows[index] === header);
    if (!releasedAt || !normalizedLines.includes(releaseHeader) || !normalizedLines.includes(seasonalHeader) ||
        titleIndex < 0 || !hasExpectedColumns) {
      return unavailableReleaseClaims(retrievedAt, "FAILED", "The DOL PDF release, seasonality, or national SA claims table headers did not match the verified layout.");
    }

    const rowPattern = new RegExp(`^(${longDatePattern}\\s+\\d{1,2},\\s+\\d{4})\\s+(\\d{1,3}(?:,\\d{3})?)(?:\\s|$)`);
    const rows = normalizedLines.slice(titleIndex + 5).flatMap((line) => {
      const match = rowPattern.exec(line.trim());
      const date = match ? parseDolLongDate(match[1]) : null;
      const value = match ? Number(match[2].replaceAll(",", "")) : NaN;
      return date && Number.isFinite(value) && value >= 0 && value <= 10_000_000 ? [{ date, value }] : [];
    }).sort((a, b) => a.date.localeCompare(b.date));

    if (rows.length < 4) {
      return unavailableReleaseClaims(retrievedAt, "MISSING", "The DOL national release did not contain the required four-week SA claims window.");
    }
    if (new Set(rows.map(({ date }) => date)).size !== rows.length) {
      return unavailableReleaseClaims(retrievedAt, "FAILED", "The DOL national release contained duplicate week-ending observations.");
    }
    const latestFour = rows.slice(-4);
    if (latestFour.some((row, index) => index > 0 && Date.parse(row.date) - Date.parse(latestFour[index - 1].date) !== 7 * 86_400_000)) {
      return unavailableReleaseClaims(retrievedAt, "MISSING", "The DOL national release did not contain four contiguous weekly SA claims observations.");
    }
    if (rows.at(-1)!.date > releasedAt) {
      return unavailableReleaseClaims(retrievedAt, "FAILED", "The DOL release date predates its latest claims observation.");
    }

    const retrievalDate = Date.parse(`${retrievedAt.slice(0, 10)}T00:00:00.000Z`);
    const latestDate = Date.parse(`${rows.at(-1)!.date}T00:00:00.000Z`);
    const ageDays = (retrievalDate - latestDate) / 86_400_000;
    if (!Number.isFinite(ageDays) || ageDays < 0 || ageDays > 21 || releasedAt > retrievedAt.slice(0, 10)) {
      return {
        ...unavailableReleaseClaims(retrievedAt, "STALE", "The latest DOL weekly claims observation is older than the weekly freshness window."),
        parserStatus: "VERIFIED",
      };
    }

    const observations = rows.map(({ date, value }): CoreSourceObservation => ({
      sourceId: "dol-initial-claims",
      identifier: coreIdentifier,
      value,
      unit: "thousand claims",
      seasonalBasis: "SA",
      observedAt: date,
      releasedAt,
      retrievedAt,
      firstSeenAt: null,
      releaseDateQuality: 1,
      version: `release:${releasedAt}`,
      vintage: null,
    }));
    const historyIsContiguous = rows.every((row, index) => index === 0 ||
      Date.parse(row.date) - Date.parse(rows[index - 1].date) === 7 * 86_400_000);
    const hasLongHistory = observations.length >= 520 && observations[0].observedAt <= "2015-01-10" && historyIsContiguous;
    return {
      sourceId: "dol-initial-claims",
      identifier: coreIdentifier,
      state: "AVAILABLE",
      observations,
      parserStatus: "VERIFIED",
      historyStatus: hasLongHistory ? "VERIFIED" : "PARTIAL",
      retrievedAt,
      reason: hasLongHistory
        ? "DOL national SA weekly claims history is contiguous."
        : `The DOL weekly release supplies ${observations.length} current observations; longer history remains unavailable in the publication.`,
    };
  } catch {
    return unavailableReleaseClaims(retrievedAt, "FAILED", "The DOL weekly claims PDF could not be parsed.");
  }
}

async function dolPdfLines(data: Uint8Array): Promise<string[]> {
  const { getDocument } = await import("pdfjs-dist/legacy/build/pdf.mjs");
  const document = await getDocument({ data }).promise;
  try {
    const lines: string[] = [];
    for (let pageNumber = 1; pageNumber <= document.numPages; pageNumber += 1) {
      const page = await document.getPage(pageNumber);
      const content = await page.getTextContent();
      const items = content.items.flatMap((item) => {
        if (!("str" in item) || !("transform" in item)) return [];
        return [{ str: item.str, x: item.transform[4], y: item.transform[5] }];
      }).sort((a, b) => b.y - a.y || a.x - b.x);
      const pageRows: Array<{ y: number; fragments: Array<{ x: number; str: string }> }> = [];
      for (const item of items) {
        const current = pageRows.at(-1);
        if (current && Math.abs(current.y - item.y) < 1) current.fragments.push(item);
        else pageRows.push({ y: item.y, fragments: [item] });
      }
      lines.push(...pageRows.map(({ fragments }) => fragments.map(({ str }) => str).join(" ").trim()).filter(Boolean));
    }
    return lines;
  } finally {
    await document.destroy();
  }
}

export async function fetchDolCoreClaims(options: AdapterOptions = {}): Promise<CoreObservationSeriesResult> {
  const now = options.now ?? new Date();
  const retrievedAt = fetchedAtFrom(now);
  try {
    const response = await (options.fetchImpl ?? fetch)(sourceUrl, cachedFetchOptions(3600));
    if (!response.ok) return unavailableCoreClaims(null, "FAILED", "The DOL source returned an unsuccessful response.");
    const lines = await dolPdfLines(new Uint8Array(await response.arrayBuffer()));
    return parseDolCoreClaimsReleaseText(lines, retrievedAt);
  } catch {
    return unavailableCoreClaims(null, "FAILED", "The official DOL weekly claims release is temporarily unavailable or invalid.");
  }
}
