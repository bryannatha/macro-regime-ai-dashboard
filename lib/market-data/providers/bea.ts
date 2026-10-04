import readXlsxFile, { type Sheet } from "read-excel-file/node";
import { parseFiniteNumber, parseIsoDate } from "@/lib/market-data/parsers";
import {
  fetchedAtFrom,
  type AdapterOptions,
  type CoreObservationSeriesResult,
  type CoreSourceObservation,
} from "@/lib/market-data/types";

const section1Endpoint = "https://apps.bea.gov/national/Release/XLS/Survey/Section1All_xls.xlsx";
const section2Endpoint = "https://apps.bea.gov/national/Release/XLS/Survey/Section2All_xls.xlsx";
const minimumQuarterlyHistory = 40;
const minimumMonthlyHistory = 120;

type BeaSheet = Pick<Sheet, "sheet" | "data">;

type BeaSeriesDefinition = {
  sheet: string;
  tablePrefix: string;
  line: string;
  description: RegExp;
  code: string;
  sourceId: string;
  identifier: string;
  unit: string;
  seasonalBasis: "SA" | "SAAR";
  periodKind: "monthly" | "quarterly";
  unitHeader: RegExp;
};

const section1Series: BeaSeriesDefinition[] = [
  {
    sheet: "T10101-Q",
    tablePrefix: "Table 1.1.1.",
    line: "1",
    description: /^Gross domestic product$/i,
    code: "A191RL",
    sourceId: "bea-gdp",
    identifier: "T10101-Q / A191RL",
    unit: "percent SAAR",
    seasonalBasis: "SAAR",
    periodKind: "quarterly",
    unitHeader: /^\[Percent\].*seasonally adjusted at annual rates$/i,
  },
  {
    sheet: "T10106-Q",
    tablePrefix: "Table 1.1.6.",
    line: "1",
    description: /^Gross domestic product$/i,
    code: "A191RX",
    sourceId: "bea-gdp",
    identifier: "T10106-Q / A191RX",
    unit: "millions of chained (2017) dollars (SAAR)",
    seasonalBasis: "SAAR",
    periodKind: "quarterly",
    unitHeader: /^\[Millions of chained \(2017\) dollars\].*seasonally adjusted at annual rates$/i,
  },
];

const section2Series: BeaSeriesDefinition[] = [
  {
    sheet: "T20804-M",
    tablePrefix: "Table 2.8.4.",
    line: "1",
    description: /^Personal consumption expenditures \(PCE\)$/i,
    code: "DPCERG",
    sourceId: "bea-pce-income",
    identifier: "T20804-M / DPCERG",
    unit: "index (2017=100)",
    seasonalBasis: "SA",
    periodKind: "monthly",
    unitHeader: /^\[Index numbers,\s*2017=100;\s*seasonally adjusted\]$/i,
  },
  {
    sheet: "T20804-M",
    tablePrefix: "Table 2.8.4.",
    line: "25",
    description: /^PCE excluding food and energy\b/i,
    code: "DPCCRG",
    sourceId: "bea-pce-income",
    identifier: "T20804-M / DPCCRG",
    unit: "index (2017=100)",
    seasonalBasis: "SA",
    periodKind: "monthly",
    unitHeader: /^\[Index numbers,\s*2017=100;\s*seasonally adjusted\]$/i,
  },
  {
    sheet: "T20806-M",
    tablePrefix: "Table 2.8.6.",
    line: "1",
    description: /^Personal consumption expenditures \(PCE\)$/i,
    code: "DPCERX",
    sourceId: "bea-pce-income",
    identifier: "T20806-M / DPCERX",
    unit: "millions of chained (2017) dollars (SAAR)",
    seasonalBasis: "SAAR",
    periodKind: "monthly",
    unitHeader: /^\[Millions of chained \(2017\) dollars;\s*seasonally adjusted at annual rates\]$/i,
  },
  {
    sheet: "T20600-M",
    tablePrefix: "Table 2.6.",
    line: "37",
    description: /^Total, Millions of chained \(2017\) dollars/i,
    code: "A067RX",
    sourceId: "bea-pce-income",
    identifier: "T20600-M / A067RX",
    unit: "millions of chained (2017) dollars (SAAR)",
    seasonalBasis: "SAAR",
    periodKind: "monthly",
    unitHeader: /^\[Millions of dollars;\s*months are seasonally adjusted at annual rates\]$/i,
  },
];

function textCell(value: unknown): string {
  return typeof value === "string" || typeof value === "number" ? String(value).trim() : "";
}

function unavailable(
  definition: BeaSeriesDefinition,
  retrievedAt: string | null,
  state: CoreObservationSeriesResult["state"],
  reason: string,
): CoreObservationSeriesResult {
  return {
    sourceId: definition.sourceId,
    identifier: definition.identifier,
    state,
    observations: [],
    parserStatus: state === "FAILED" ? "FAILED" : "PARTIAL",
    historyStatus: "PARTIAL",
    retrievedAt,
    reason,
  };
}

function periodStart(period: string, kind: BeaSeriesDefinition["periodKind"]): string | null {
  if (kind === "quarterly") {
    const match = /^(\d{4})Q([1-4])$/.exec(period);
    if (!match) return null;
    return `${match[1]}-${String((Number(match[2]) - 1) * 3 + 1).padStart(2, "0")}-01`;
  }
  const match = /^(\d{4})M(0[1-9]|1[0-2])$/.exec(period);
  return match ? `${match[1]}-${match[2]}-01` : null;
}

function periodSerial(period: string, kind: BeaSeriesDefinition["periodKind"]): number | null {
  if (kind === "quarterly") {
    const match = /^(\d{4})Q([1-4])$/.exec(period);
    return match ? Number(match[1]) * 4 + Number(match[2]) : null;
  }
  const match = /^(\d{4})M(0[1-9]|1[0-2])$/.exec(period);
  return match ? Number(match[1]) * 12 + Number(match[2]) : null;
}

function publishedDate(sheet: BeaSheet): string | null {
  const matches = new Set<string>();
  for (const row of sheet.data.slice(0, 7)) {
    const value = textCell(row[0]);
    const match = /^Data published ([A-Za-z]+) (\d{1,2}), (\d{4})$/i.exec(value);
    if (!match) continue;
    const monthNames = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"];
    const monthIndex = monthNames.indexOf(match[1].toLowerCase());
    if (monthIndex < 0) continue;
    const date = `${match[3]}-${String(monthIndex + 1).padStart(2, "0")}-${match[2].padStart(2, "0")}`;
    if (parseIsoDate(date)) matches.add(date);
  }
  return matches.size === 1 ? Array.from(matches)[0] : null;
}

function parseSeries(
  definition: BeaSeriesDefinition,
  sheets: BeaSheet[],
  retrievedAt: string,
): CoreObservationSeriesResult {
  const sheetMatches = sheets.filter((sheet) => sheet.sheet === definition.sheet);
  if (sheetMatches.length === 0) {
    return unavailable(definition, retrievedAt, "MISSING", "The required BEA workbook sheet was absent.");
  }
  if (sheetMatches.length !== 1) {
    return unavailable(definition, retrievedAt, "FAILED", "The BEA workbook contained an ambiguous sheet identity.");
  }

  const sheet = sheetMatches[0];
  const workbookPublishedAt = publishedDate(sheet);
  const title = textCell(sheet.data[0]?.[0]);
  const units = textCell(sheet.data[1]?.[0]);
  if (!title.startsWith(definition.tablePrefix) || !definition.unitHeader.test(units)) {
    return unavailable(definition, retrievedAt, "FAILED", "The BEA table title or declared unit/seasonal basis changed.");
  }

  const headerRows = sheet.data.filter((row) => textCell(row[0]) === "Line");
  if (headerRows.length !== 1) {
    return unavailable(definition, retrievedAt, "FAILED", "The BEA period header is missing or ambiguous.");
  }
  const periods = headerRows[0].slice(3).map(textCell);
  const serials = periods.map((period) => periodSerial(period, definition.periodKind));
  if (periods.length === 0 || serials.some((serial) => serial === null) ||
      serials.some((serial, index) => index > 0 && serial !== (serials[index - 1] as number) + 1)) {
    return unavailable(definition, retrievedAt, "FAILED", "The BEA workbook periods are invalid, duplicated, or discontinuous.");
  }

  const matchingRows = sheet.data.filter((row) => textCell(row[2]) === definition.code);
  if (matchingRows.length === 0) {
    return unavailable(definition, retrievedAt, "MISSING", "The registered BEA row code was absent.");
  }
  if (matchingRows.length !== 1) {
    return unavailable(definition, retrievedAt, "FAILED", "The registered BEA row code appeared more than once.");
  }
  const row = matchingRows[0];
  if (textCell(row[0]) !== definition.line || !definition.description.test(textCell(row[1]))) {
    return unavailable(definition, retrievedAt, "FAILED", "The BEA line number or description did not match the registered series.");
  }
  if (row.length - 3 !== periods.length) {
    return unavailable(definition, retrievedAt, "FAILED", "The BEA series row and period header have different lengths.");
  }

  const minimumHistory = definition.periodKind === "quarterly" ? minimumQuarterlyHistory : minimumMonthlyHistory;
  if (periods.length < minimumHistory) {
    return unavailable(definition, retrievedAt, "MISSING", "The BEA series history is shorter than the registered minimum.");
  }

  const values = row.slice(3).map(parseFiniteNumber);
  if (values.some((value) => value === null)) {
    return unavailable(definition, retrievedAt, "FAILED", "The BEA registered series contains a missing or non-numeric value.");
  }

  const lastObservedAt = periodStart(periods.at(-1)!, definition.periodKind);
  if (!lastObservedAt) {
    return unavailable(definition, retrievedAt, "FAILED", "The latest BEA period could not be converted to an observation date.");
  }
  if (workbookPublishedAt && workbookPublishedAt < lastObservedAt) {
    return unavailable(definition, retrievedAt, "FAILED", "The workbook publication date predates its latest observation.");
  }

  const observations = periods.map((period, index): CoreSourceObservation => {
    const observedAt = periodStart(period, definition.periodKind)!;
    const releasedAt = index === periods.length - 1 ? workbookPublishedAt : null;
    return {
      sourceId: definition.sourceId,
      identifier: definition.identifier,
      value: values[index] as number,
      unit: definition.unit,
      seasonalBasis: definition.seasonalBasis,
      observedAt,
      releasedAt,
      retrievedAt,
      firstSeenAt: null,
      releaseDateQuality: releasedAt ? 1 : 0,
      version: null,
      vintage: null,
    };
  });

  return {
    sourceId: definition.sourceId,
    identifier: definition.identifier,
    state: "AVAILABLE",
    observations,
    parserStatus: "VERIFIED",
    historyStatus: "VERIFIED",
    retrievedAt,
    reason: "Current workbook values are revised history; historical release vintages are unavailable.",
  };
}

function parseBeaSection(
  definitions: BeaSeriesDefinition[],
  input: unknown,
  retrievedAt: string,
): CoreObservationSeriesResult[] {
  if (!Array.isArray(input) || !parseIsoDate(retrievedAt.slice(0, 10))) {
    return definitions.map((definition) => unavailable(definition, null, "FAILED", "The BEA workbook parser received invalid input."));
  }
  const sheets = input as BeaSheet[];
  return definitions.map((definition) => parseSeries(definition, sheets, retrievedAt));
}

export function parseBeaSection1Sheets(input: unknown, retrievedAt: string): CoreObservationSeriesResult[] {
  return parseBeaSection(section1Series, input, retrievedAt);
}

export function parseBeaSection2Sheets(input: unknown, retrievedAt: string): CoreObservationSeriesResult[] {
  return parseBeaSection(section2Series, input, retrievedAt);
}

function failedBeaSection(definitions: BeaSeriesDefinition[], reason: string): CoreObservationSeriesResult[] {
  return definitions.map((definition) => unavailable(definition, null, "FAILED", reason));
}

async function fetchWorkbook(
  endpoint: string,
  fetchImpl: typeof fetch,
): Promise<BeaSheet[]> {
  const response = await fetchImpl(endpoint, { cache: "no-store" });
  if (!response.ok) throw new Error("BEA workbook request failed");
  const bytes = Buffer.from(await response.arrayBuffer());
  return await readXlsxFile(bytes);
}

export async function fetchBeaCoreSources(options: AdapterOptions = {}): Promise<CoreObservationSeriesResult[]> {
  const fetchImpl = options.fetchImpl ?? fetch;
  const [section1, section2] = await Promise.allSettled([
    fetchWorkbook(section1Endpoint, fetchImpl),
    fetchWorkbook(section2Endpoint, fetchImpl),
  ]);
  const retrievedAt = fetchedAtFrom(options.now ?? new Date());
  const section1Results = section1.status === "fulfilled"
    ? parseBeaSection1Sheets(section1.value, retrievedAt)
    : failedBeaSection(section1Series, "The official BEA Section 1 workbook was unavailable or unreadable.");
  const section2Results = section2.status === "fulfilled"
    ? parseBeaSection2Sheets(section2.value, retrievedAt)
    : failedBeaSection(section2Series, "The official BEA Section 2 workbook was unavailable or unreadable.");
  return [...section1Results, ...section2Results];
}
