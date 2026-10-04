import { strFromU8, unzipSync } from "fflate";
import { parseFiniteNumber, parseIsoDate, parseXmlWithAttributes } from "@/lib/market-data/parsers";
import {
  cachedFetchOptions,
  fetchedAtFrom,
  type AdapterOptions,
  type CoreObservationSeriesResult,
  type CoreSourceObservation,
} from "@/lib/market-data/types";

const h41Endpoint = "https://www.federalreserve.gov/releases/h41/current/";
const h6ArchiveEndpoint = "https://www.federalreserve.gov/releases/h6/data/FRB_h6_xml.zip";
const sloosIndexEndpoint = "https://www.federalreserve.gov/data/sloos.htm";
const h8Endpoint = "https://www.federalreserve.gov/releases/h8/current/default.htm";
const creditPerformanceArchiveEndpoint = "https://www.federalreserve.gov/releases/chargeoff/data/FRB_CHGDEL_xml.zip";

const sourceIds = {
  h41: "federal-reserve-h41-liquidity",
  h6: "federal-reserve-h6-m2",
  sloos: "federal-reserve-sloos",
  h8: "federal-reserve-h8",
  creditPerformance: "federal-reserve-credit-performance",
} as const;

export const FEDERAL_RESERVE_SUPPORT_IDENTIFIERS = {
  h41AverageAssets: "H.4.1 Table 1 / Total assets / weekly average",
  h41WednesdayAssets: "H.4.1 Table 5 / Total assets / Wednesday",
  h41ReserveBankCredit: "H.4.1 Table 1 / Reserve Bank credit / weekly average",
  h41Tga: "H.4.1 Table 1 / U.S. Treasury, General Account / weekly average",
  h41RrpOthers: "H.4.1 Table 1 / Reverse repurchase agreements: Others / weekly average",
  h41Reserves: "H.4.1 Table 1 / Reserve balances with Federal Reserve Banks / weekly average",
  h6M2: "M2.M",
  sloosLargeMedium: "Figure 1 Panel 1 / Large and medium",
  sloosSmall: "Figure 1 Panel 1 / Small",
  h8Loans: "H.8 Table 2 line 9 / Loans and leases in bank credit",
  delinquency: "STFBQD%STFBAIL_XEOP_MA.Q",
  chargeOff: "STFBQC%STFBAIL_MA.Q",
} as const;

type SeriesSpec = { sourceId: string; identifier: string };

function unavailable(
  spec: SeriesSpec,
  retrievedAt: string | null,
  state: CoreObservationSeriesResult["state"],
  reason: string,
): CoreObservationSeriesResult {
  return {
    ...spec,
    state,
    observations: [],
    parserStatus: state === "FAILED" ? "FAILED" : "PARTIAL",
    historyStatus: "PARTIAL",
    retrievedAt,
    reason,
  };
}

function validRetrievedAt(value: string): boolean {
  return typeof value === "string" && Number.isFinite(Date.parse(value)) && parseIsoDate(value.slice(0, 10)) !== null;
}

function observation(
  sourceId: string,
  identifier: string,
  value: number,
  unit: string,
  seasonalBasis: string,
  observedAt: string,
  retrievedAt: string,
  releasedAt: string | null = null,
): CoreSourceObservation {
  return {
    sourceId,
    identifier,
    value,
    unit,
    seasonalBasis,
    observedAt,
    releasedAt,
    retrievedAt,
    firstSeenAt: null,
    releaseDateQuality: 0,
    version: null,
    vintage: null,
  };
}

function available(
  spec: SeriesSpec,
  observations: CoreSourceObservation[],
  retrievedAt: string,
  reason: string | null = null,
): CoreObservationSeriesResult {
  return {
    ...spec,
    state: "AVAILABLE",
    observations,
    parserStatus: "VERIFIED",
    historyStatus: "VERIFIED",
    retrievedAt,
    reason,
  };
}

function htmlText(value: string): string {
  return value.replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;|&#160;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&ndash;|&#8211;/gi, "-")
    .replace(/&mdash;|&#8212;/gi, "-")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function htmlRows(input: string): string[][] {
  return Array.from(input.matchAll(/<tr\b[^>]*>([\s\S]*?)<\/tr>/gi), (row) =>
    Array.from(row[1].matchAll(/<t[dh]\b[^>]*>([\s\S]*?)<\/t[dh]>/gi), (cell) => htmlText(cell[1]))
  ).filter((cells) => cells.length > 0);
}

function numberCells(cells: string[]): number[] {
  return cells.map(parseFiniteNumber).filter((value): value is number => value !== null);
}

function longDate(input: string): string | null {
  const match = /^(January|February|March|April|May|June|July|August|September|October|November|December)\s+(\d{1,2}),?\s+(\d{4})$/i.exec(input.trim());
  if (!match) return null;
  const months = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"];
  const month = months.indexOf(match[1].toLowerCase()) + 1;
  return parseIsoDate(`${match[3]}-${String(month).padStart(2, "0")}-${match[2].padStart(2, "0")}`);
}

function asResult(
  sourceId: string,
  identifier: string,
  row: string[] | undefined,
  observedAt: string | null,
  retrievedAt: string,
  options: { valueIndex?: number; unit: string; basis: string; missingReason: string },
): CoreObservationSeriesResult {
  const spec = { sourceId, identifier };
  if (!row || !observedAt) return unavailable(spec, retrievedAt, "MISSING", options.missingReason);
  const values = numberCells(row.slice(1));
  const value = options.valueIndex === undefined ? values[0] : values.at(options.valueIndex);
  if (value === undefined) return unavailable(spec, retrievedAt, "MISSING", options.missingReason);
  return available(spec, [observation(sourceId, identifier, value, options.unit, options.basis, observedAt, retrievedAt)], retrievedAt);
}

export function parseFederalReserveH41Liquidity(html: string, retrievedAt: string): CoreObservationSeriesResult[] {
  const identifiers = FEDERAL_RESERVE_SUPPORT_IDENTIFIERS;
  const specs = [
    { sourceId: sourceIds.h41, identifier: identifiers.h41AverageAssets },
    { sourceId: sourceIds.h41, identifier: identifiers.h41Tga },
    { sourceId: sourceIds.h41, identifier: identifiers.h41RrpOthers },
    { sourceId: sourceIds.h41, identifier: identifiers.h41Reserves },
    { sourceId: sourceIds.h41, identifier: identifiers.h41ReserveBankCredit },
    { sourceId: sourceIds.h41, identifier: identifiers.h41WednesdayAssets },
  ];
  if (typeof html !== "string" || !/<table\b/i.test(html) || !validRetrievedAt(retrievedAt)) {
    return specs.map((spec) => unavailable(spec, null, "FAILED", "The H.4.1 release was not valid HTML data."));
  }

  const plain = htmlText(html);
  const weekMatch = /Week ended\s+([A-Za-z]+\s+\d{1,2},?\s+\d{4})/i.exec(plain);
  const averageDate = weekMatch ? longDate(weekMatch[1]) : null;
  const rows = htmlRows(html);
  const byLabel = (label: string) => rows.filter((row) => row[0].replace(/\s+/g, " ").trim().toLowerCase() === label.toLowerCase());
  const reserveBankCredit = byLabel("Reserve Bank credit");
  const tga = byLabel("U.S. Treasury, General Account");
  const reserveBalances = byLabel("Reserve balances with Federal Reserve Banks");
  const allRows = rows;
  const rrpParentIndex = allRows.findIndex((row) => /^Reverse repurchase agreements$/i.test(row[0]));
  const rrpOthersRow = rrpParentIndex >= 0
    ? allRows.slice(rrpParentIndex + 1).find((row) => /^Others$/i.test(row[0]))
    : undefined;
  const totalAssetsRow = byLabel("Total assets")[0];
  const weeklyAverageAssets = unavailable(
    { sourceId: sourceIds.h41, identifier: identifiers.h41AverageAssets },
    retrievedAt,
    "MISSING",
    "H.4.1 publishes the total-assets row as a Wednesday stock, not as a weekly average.",
  );
  const weeklyRows = [
    asResult(sourceIds.h41, identifiers.h41Tga, tga[0], averageDate, retrievedAt, {
      unit: "millions USD", basis: "weekly average", missingReason: "The H.4.1 weekly-average TGA row was absent or invalid.",
    }),
    asResult(sourceIds.h41, identifiers.h41RrpOthers, rrpOthersRow, averageDate, retrievedAt, {
      unit: "millions USD", basis: "weekly average", missingReason: "The H.4.1 weekly-average RRP Others row was absent or invalid.",
    }),
    asResult(sourceIds.h41, identifiers.h41Reserves, reserveBalances[0], averageDate, retrievedAt, {
      unit: "millions USD", basis: "weekly average", missingReason: "The H.4.1 weekly-average reserve-balance row was absent or invalid.",
    }),
    asResult(sourceIds.h41, identifiers.h41ReserveBankCredit, reserveBankCredit[0], averageDate, retrievedAt, {
      unit: "millions USD", basis: "weekly average", missingReason: "The H.4.1 weekly-average Reserve Bank credit row was absent or invalid.",
    }),
  ];
  const wednesdayDateMatch = /Wednesday\s+([A-Za-z]+\s+\d{1,2},?\s+\d{4})/i.exec(plain);
  const wednesdayDate = wednesdayDateMatch ? longDate(wednesdayDateMatch[1]) : null;
  const wednesdayAssets = asResult(sourceIds.h41, identifiers.h41WednesdayAssets, totalAssetsRow, wednesdayDate, retrievedAt, {
    valueIndex: -1,
    unit: "millions USD",
    basis: "Wednesday",
    missingReason: "The H.4.1 Wednesday total-assets row was absent or invalid.",
  });
  if (/<\s*html\b/i.test(html) && !/Factors Affecting Reserve Balances/i.test(plain)) {
    return specs.map((spec) => unavailable(spec, retrievedAt, "FAILED", "The H.4.1 document identity did not match the registered release."));
  }
  return [weeklyAverageAssets, ...weeklyRows, wednesdayAssets];
}

type XmlRecord = Record<string, unknown>;

function asArray(value: unknown): unknown[] {
  return value === undefined || value === null ? [] : Array.isArray(value) ? value : [value];
}

function record(value: unknown): XmlRecord | null {
  return value !== null && typeof value === "object" && !Array.isArray(value) ? value as XmlRecord : null;
}

function attribute(value: unknown): string | null {
  return typeof value === "string" ? value : null;
}

function seriesDimensions(series: XmlRecord): Map<string, string> {
  const key = record(series.SeriesKey);
  const dimensions = new Map<string, string>();
  for (const raw of asArray(key?.Value)) {
    const item = record(raw);
    const id = attribute(item?.["@_id"]);
    const value = attribute(item?.["@_value"]);
    if (id && value) dimensions.set(id, value);
  }
  return dimensions;
}

function periodDate(input: string, cadence: "monthly" | "quarterly"): string | null {
  if (cadence === "monthly") {
    const match = /^(\d{4})M(0[1-9]|1[0-2])$/.exec(input);
    return match ? `${match[1]}-${match[2]}-01` : null;
  }
  const match = /^(\d{4})Q([1-4])$/.exec(input);
  return match ? `${match[1]}-${String((Number(match[2]) - 1) * 3 + 1).padStart(2, "0")}-01` : null;
}

function orderedObservations(input: unknown, cadence: "monthly" | "quarterly"): Array<{ date: string; value: number }> | null {
  const parsed = asArray(input).map((raw) => {
    const item = record(raw);
    const dimension = record(item?.ObsDimension);
    const value = record(item?.ObsValue);
    const date = periodDate(attribute(dimension?.["@_value"]) ?? "", cadence);
    const numeric = parseFiniteNumber(attribute(value?.["@_value"]));
    return date && numeric !== null ? { date, value: numeric } : null;
  });
  if (parsed.length === 0 || parsed.some((item) => item === null)) return null;
  const observations = parsed as Array<{ date: string; value: number }>;
  observations.sort((a, b) => a.date.localeCompare(b.date));
  const monthIndex = (date: string) => Number(date.slice(0, 4)) * 12 + Number(date.slice(5, 7));
  const step = cadence === "monthly" ? 1 : 3;
  if (observations.some((item, index) => index > 0 && monthIndex(item.date) - monthIndex(observations[index - 1].date) !== step)) return null;
  return observations;
}

function datasetSeries(xml: string): XmlRecord[] | null {
  if (typeof xml !== "string" || /<\s*html\b/i.test(xml)) return null;
  try {
    const root = record(parseXmlWithAttributes(xml));
    const genericData = record(root?.GenericData);
    const dataSet = record(genericData?.DataSet);
    const series = asArray(dataSet?.Series).map(record).filter((item): item is XmlRecord => item !== null);
    return series.length ? series : null;
  } catch {
    return null;
  }
}

function sdmxValues(raw: XmlRecord, cadence: "monthly" | "quarterly"): Array<{ date: string; value: number }> | null {
  return orderedObservations(raw.Obs, cadence);
}

export function parseFederalReserveH6M2Xml(xml: string, retrievedAt: string): CoreObservationSeriesResult {
  const spec = { sourceId: sourceIds.h6, identifier: FEDERAL_RESERVE_SUPPORT_IDENTIFIERS.h6M2 };
  const series = datasetSeries(xml);
  if (!validRetrievedAt(retrievedAt) || !series) return unavailable(spec, null, "FAILED", "The H.6 archive did not contain a valid SDMX data set.");
  const candidates = series.filter((item) => seriesDimensions(item).get("SERIES_NAME") === "M2.M");
  const match = candidates.filter((item) => {
    const dims = seriesDimensions(item);
    return dims.get("SERIES_NAME") === "M2.M" && dims.get("ADJUSTED") === "SA" &&
      dims.get("FREQ") === "129" && dims.get("UNIT_MULT") === "1e+09" && dims.get("UNIT") === "Currency";
  });
  if (match.length !== 1) {
    return unavailable(spec, retrievedAt, candidates.length ? "FAILED" : "MISSING", "The H.6 M2 series did not have one exact monthly, SA, currency, 1e+09-multiplier match.");
  }
  const points = sdmxValues(match[0], "monthly");
  if (!points || points.length < 6 || points.some(({ value }) => value <= 0)) {
    return unavailable(spec, retrievedAt, "FAILED", "The H.6 M2 observations were invalid or had fewer than six continuous positive months.");
  }
  return available(spec, points.map(({ date, value }) => observation(spec.sourceId, spec.identifier, value, "billions USD", "SA", date, retrievedAt)), retrievedAt,
    "The H.6 XML Prepared field is not treated as an economic release timestamp.");
}

export function parseFederalReserveSloosChartData(html: string, retrievedAt: string): CoreObservationSeriesResult[] {
  const identifiers = FEDERAL_RESERVE_SUPPORT_IDENTIFIERS;
  const specs = [
    { sourceId: sourceIds.sloos, identifier: identifiers.sloosLargeMedium },
    { sourceId: sourceIds.sloos, identifier: identifiers.sloosSmall },
  ];
  if (typeof html !== "string" || !validRetrievedAt(retrievedAt) || !/Figure 1/i.test(html) || !/Net Percentage of Domestic Respondents Tightening Standards for C/i.test(htmlText(html))) {
    return specs.map((spec) => unavailable(spec, null, "FAILED", "The SLOOS chart-data response did not match Figure 1, Panel 1."));
  }
  const tables = Array.from(html.matchAll(/<table\b[^>]*>([\s\S]*?)<\/table>/gi), (table) => table[1]);
  const matchingTables = tables.filter((table) => /Net Percentage of Domestic Respondents Tightening Standards for C/i.test(htmlText(table)) && /Large and medium/i.test(htmlText(table)) && /Small/i.test(htmlText(table)));
  if (matchingTables.length !== 1) return specs.map((spec) => unavailable(spec, retrievedAt, "FAILED", "The SLOOS C&I standards table was missing or ambiguous."));

  const rows = htmlRows(matchingTables[0]);
  const points = [[], []] as Array<Array<{ date: string; value: number }>>;
  for (const row of rows) {
    const period = /^(\d{4}):([1-4])$/.exec(row[0]);
    if (!period) continue;
    if (row.length < 3) return specs.map((spec) => unavailable(spec, retrievedAt, "FAILED", "A SLOOS observation row was truncated."));
    const date = `${period[1]}-${String((Number(period[2]) - 1) * 3 + 1).padStart(2, "0")}-01`;
    const large = parseFiniteNumber(row[1]);
    const small = parseFiniteNumber(row[2]);
    if (large === null || small === null) continue;
    points[0].push({ date, value: large });
    points[1].push({ date, value: small });
  }
  if (points.some((items) => items.length < 4 || items.some((item, index) => index > 0 && item.date <= items[index - 1].date))) {
    return specs.map((spec) => unavailable(spec, retrievedAt, "MISSING", "SLOOS has fewer than four valid or strictly increasing observations."));
  }
  return specs.map((spec, index) => available(spec, points[index].map(({ date, value }) => observation(
    spec.sourceId, spec.identifier, value, "percent net", "Not seasonally adjusted", date, retrievedAt,
  )), retrievedAt, "Historical survey observations are revised-history chart data; original release timestamps are not supplied here."));
}

function inferReleaseDate(html: string): string | null {
  const text = htmlText(html);
  const match = /Release Date:\s*([A-Za-z]+\s+\d{1,2},?\s+\d{4})/i.exec(text);
  return match ? longDate(match[1]) : null;
}

function parseH8Date(label: string, releaseDate: string): string | null {
  const iso = parseIsoDate(label);
  if (iso) return iso;
  const explicit = /Week ending\s+(\d{4}-\d{2}-\d{2})/i.exec(label);
  if (explicit) return parseIsoDate(explicit[1]);
  const match = /^(January|February|March|April|May|June|July|August|September|October|November|December|Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\.?\s+(\d{1,2})$/i.exec(label.trim());
  if (!match) return null;
  const monthNames = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];
  const month = monthNames.indexOf(match[1].slice(0, 3).toLowerCase()) + 1;
  const releaseYear = Number(releaseDate.slice(0, 4));
  const releaseMonth = Number(releaseDate.slice(5, 7));
  const year = releaseMonth === 1 && month === 12 ? releaseYear - 1 : releaseYear;
  return parseIsoDate(`${year}-${String(month).padStart(2, "0")}-${match[2].padStart(2, "0")}`);
}

function extractH8Points(html: string, retrievedAt: string): Array<{ date: string; value: number }> | null {
  const releaseDate = inferReleaseDate(html) ?? retrievedAt.slice(0, 10);
  if (!/Table 2\. Assets and Liabilities of Commercial Banks/i.test(htmlText(html)) || !/Seasonally adjusted, billions of dollars/i.test(htmlText(html))) return null;
  const tables = Array.from(html.matchAll(/<table\b[^>]*>([\s\S]*?)<\/table>/gi), (table) => table[1]);
  const matching = tables.filter((table) => /Loans and leases in bank credit/i.test(htmlText(table)) && /Week ending/i.test(htmlText(table)));
  if (matching.length !== 1) return null;
  const rows = htmlRows(matching[0]);
  const targetRows = rows.filter((row) => row.some((cell) => /^Loans and leases in bank credit$/i.test(cell.trim())));
  if (targetRows.length !== 1) return null;
  const headerIndex = rows.findIndex((row) => row.some((cell) => /Week ending/i.test(cell)));
  if (headerIndex < 0) return null;
  const dateLabels = rows.slice(headerIndex, headerIndex + 3).flat().map((cell) => {
    const text = cell.replace(/^Week ending\s*/i, "").trim();
    return parseH8Date(text, releaseDate);
  }).filter((date): date is string => date !== null);
  const values = numberCells(targetRows[0].slice(2));
  if (dateLabels.length === 0 || values.length < dateLabels.length) return null;
  const points = dateLabels.map((date, index) => ({ date, value: values[values.length - dateLabels.length + index] }));
  if (points.some(({ value }) => !Number.isFinite(value) || value <= 0)) return null;
  return points.sort((a, b) => a.date.localeCompare(b.date));
}

function recentReclassificationBreak(html: string, firstDate: string, lastDate: string): boolean {
  const text = htmlText(html);
  const matches = Array.from(text.matchAll(/as of the week ending\s+([A-Za-z]+\s+\d{1,2},?\s+\d{4})[^.]{0,500}(?:reclassif|definitional clarification)/gi));
  return matches.some((match) => {
    const date = longDate(match[1]);
    return date !== null && date >= firstDate && date <= lastDate;
  });
}

export function parseFederalReserveH8Loans(html: string, retrievedAt: string): CoreObservationSeriesResult {
  const spec = { sourceId: sourceIds.h8, identifier: FEDERAL_RESERVE_SUPPORT_IDENTIFIERS.h8Loans };
  if (typeof html !== "string" || !validRetrievedAt(retrievedAt) || /<\s*html\b/i.test(html) && !/<table\b/i.test(html)) {
    return unavailable(spec, null, "FAILED", "The H.8 release was not valid HTML data.");
  }
  const points = extractH8Points(html, retrievedAt);
  if (!points) return unavailable(spec, retrievedAt, "FAILED", "The H.8 Table 2 line, seasonal basis, units, or weekly headers did not match the approved series.");
  if (points.length < 17) return unavailable(spec, retrievedAt, "MISSING", "The H.8 release supplied fewer than 17 consecutive weekly observations.");
  const last17 = points.slice(-17);
  if (last17.some((item, index) => index > 0 && Date.parse(item.date) - Date.parse(last17[index - 1].date) !== 7 * 86_400_000)) {
    return unavailable(spec, retrievedAt, "MISSING", "The H.8 loan history did not contain 17 consecutive weekly observations.");
  }
  if (recentReclassificationBreak(html, last17[0].date, last17.at(-1)!.date)) {
    return unavailable(spec, retrievedAt, "MISSING", "The H.8 credit-volume window crosses a disclosed reclassification break.");
  }
  const releasedAt = inferReleaseDate(html);
  return available(spec, last17.map(({ date, value }) => observation(spec.sourceId, spec.identifier, value, "billions USD", "SA", date, retrievedAt, releasedAt)), retrievedAt);
}

const creditSeries = [
  { identifier: FEDERAL_RESERVE_SUPPORT_IDENTIFIERS.delinquency, label: "delinquency", unit: "percent" },
  { identifier: FEDERAL_RESERVE_SUPPORT_IDENTIFIERS.chargeOff, label: "net charge-offs", unit: "percent" },
] as const;

export function parseFederalReserveCreditPerformanceXml(xml: string, retrievedAt: string): CoreObservationSeriesResult[] {
  const specs = creditSeries.map(({ identifier }) => ({ sourceId: sourceIds.creditPerformance, identifier }));
  const allSeries = datasetSeries(xml);
  if (!validRetrievedAt(retrievedAt) || !allSeries) return specs.map((spec) => unavailable(spec, null, "FAILED", "The credit-performance archive did not contain a valid SDMX data set."));
  return creditSeries.map(({ identifier, label }) => {
    const candidates = allSeries.filter((item) => seriesDimensions(item).get("SERIES_NAME") === identifier);
    const exact = candidates.filter((item) => {
      const dims = seriesDimensions(item);
      return dims.get("SERIES_NAME") === identifier && dims.get("FREQ") === "128" && dims.get("ADJUSTED") === "SA" &&
        dims.get("UNIT") === "Percentage" && dims.get("UNIT_MULT") === "1";
    });
    const spec = { sourceId: sourceIds.creditPerformance, identifier };
    if (exact.length !== 1) return unavailable(spec, retrievedAt, candidates.length ? "FAILED" : "MISSING", `The approved quarterly SA ${label} identifier or unit metadata was absent or ambiguous.`);
    const points = sdmxValues(exact[0], "quarterly");
    if (!points || points.length < 4 || points.some(({ value }) => value < 0)) return unavailable(spec, retrievedAt, "FAILED", `The approved ${label} rate history was invalid or too short.`);
    return available(spec, points.map(({ date, value }) => observation(spec.sourceId, identifier, value, "percent", "SA", date, retrievedAt)), retrievedAt,
      label === "net charge-offs" ? "The Federal Reserve reports this rate annualized and net of recoveries." : null);
  });
}

function archiveXml(bytes: Uint8Array, preferredName: RegExp): string | null {
  try {
    const files = unzipSync(bytes);
    const paths = Object.keys(files);
    const preferred = paths.filter((path) => preferredName.test(path.split(/[\\/]/).at(-1) ?? ""));
    const xmlPaths = preferred.length ? preferred : paths.filter((path) => /\.xml$/i.test(path));
    if (xmlPaths.length !== 1) return null;
    return strFromU8(files[xmlPaths[0]]);
  } catch {
    return null;
  }
}

async function responseText(url: string, options: AdapterOptions, cacheSeconds: number): Promise<string> {
  const response = await (options.fetchImpl ?? fetch)(url, cachedFetchOptions(cacheSeconds));
  if (!response.ok) throw new Error("Federal Reserve source request failed");
  return response.text();
}

async function responseXml(url: string, options: AdapterOptions, cacheSeconds: number, preferredName: RegExp): Promise<string> {
  const response = await (options.fetchImpl ?? fetch)(url, cachedFetchOptions(cacheSeconds));
  if (!response.ok) throw new Error("Federal Reserve archive request failed");
  const xml = archiveXml(new Uint8Array(await response.arrayBuffer()), preferredName);
  if (!xml) throw new Error("Federal Reserve archive did not contain the registered XML file");
  return xml;
}

export async function fetchFederalReserveH41Liquidity(options: AdapterOptions = {}): Promise<CoreObservationSeriesResult[]> {
  const retrievedAt = fetchedAtFrom(options.now ?? new Date());
  try {
    return parseFederalReserveH41Liquidity(await responseText(h41Endpoint, options, 21_600), retrievedAt);
  } catch {
    return parseFederalReserveH41Liquidity("", retrievedAt);
  }
}

export async function fetchFederalReserveH6M2(options: AdapterOptions = {}): Promise<CoreObservationSeriesResult> {
  const spec = { sourceId: sourceIds.h6, identifier: FEDERAL_RESERVE_SUPPORT_IDENTIFIERS.h6M2 };
  const retrievedAt = fetchedAtFrom(options.now ?? new Date());
  try {
    const xml = await responseXml(h6ArchiveEndpoint, options, 86_400, /^H6_data\.xml$/i);
    return parseFederalReserveH6M2Xml(xml, retrievedAt);
  } catch {
    return unavailable(spec, null, "FAILED", "The official H.6 XML archive was unavailable or unreadable.");
  }
}

function latestSloosChartUrl(indexHtml: string): string | null {
  const matches = Array.from(indexHtml.matchAll(/href=["']([^"']*sloos-(\d{6})-chart-data\.htm)["']/gi));
  const latest = matches.sort((a, b) => b[2].localeCompare(a[2]))[0];
  if (!latest) return null;
  try {
    return new URL(latest[1], sloosIndexEndpoint).toString();
  } catch {
    return null;
  }
}

export async function fetchFederalReserveSloos(options: AdapterOptions = {}): Promise<CoreObservationSeriesResult[]> {
  const retrievedAt = fetchedAtFrom(options.now ?? new Date());
  const specs = [
    { sourceId: sourceIds.sloos, identifier: FEDERAL_RESERVE_SUPPORT_IDENTIFIERS.sloosLargeMedium },
    { sourceId: sourceIds.sloos, identifier: FEDERAL_RESERVE_SUPPORT_IDENTIFIERS.sloosSmall },
  ];
  try {
    const indexHtml = await responseText(sloosIndexEndpoint, options, 21_600);
    const chartUrl = latestSloosChartUrl(indexHtml);
    if (!chartUrl) return specs.map((spec) => unavailable(spec, retrievedAt, "MISSING", "The SLOOS index did not identify a current chart-data release."));
    return parseFederalReserveSloosChartData(await responseText(chartUrl, options, 21_600), retrievedAt);
  } catch {
    return specs.map((spec) => unavailable(spec, null, "FAILED", "The official SLOOS chart-data source was unavailable."));
  }
}

export async function fetchFederalReserveH8Loans(options: AdapterOptions = {}): Promise<CoreObservationSeriesResult> {
  const spec = { sourceId: sourceIds.h8, identifier: FEDERAL_RESERVE_SUPPORT_IDENTIFIERS.h8Loans };
  const retrievedAt = fetchedAtFrom(options.now ?? new Date());
  try {
    return parseFederalReserveH8Loans(await responseText(h8Endpoint, options, 21_600), retrievedAt);
  } catch {
    return unavailable(spec, null, "FAILED", "The official H.8 release was unavailable.");
  }
}

export async function fetchFederalReserveCreditPerformance(options: AdapterOptions = {}): Promise<CoreObservationSeriesResult[]> {
  const specs = creditSeries.map(({ identifier }) => ({ sourceId: sourceIds.creditPerformance, identifier }));
  const retrievedAt = fetchedAtFrom(options.now ?? new Date());
  try {
    const xml = await responseXml(creditPerformanceArchiveEndpoint, options, 86_400, /(?:CHGDEL|chargeoff).*data\.xml$/i);
    return parseFederalReserveCreditPerformanceXml(xml, retrievedAt);
  } catch {
    return specs.map((spec) => unavailable(spec, null, "FAILED", "The official credit-performance XML archive was unavailable or unreadable."));
  }
}
