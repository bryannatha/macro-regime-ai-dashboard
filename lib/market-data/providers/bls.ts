import type { MetricObservation } from "@/lib/types";
import { createAvailableObservation, observationFailure, parseFiniteNumber, parseIsoDate } from "@/lib/market-data/parsers";
import {
  cachedFetchOptions,
  fetchedAtFrom,
  type AdapterOptions,
  type CoreObservationSeriesResult,
  type CoreSourceObservation,
} from "@/lib/market-data/types";

const endpoint = "https://api.bls.gov/publicAPI/v1/timeseries/data/";
const source = "U.S. Bureau of Labor Statistics";
const sourceUrl = "https://www.bls.gov/cpi/data.htm";
const seriesIds = { cpi: "CUUR0000SA0", coreCpi: "CUUR0000SA0L1E" } as const;
type BlsKey = keyof typeof seriesIds;
type BlsResult = Record<BlsKey, MetricObservation>;

function unavailableBls(fetchedAt: string, detail: string): BlsResult {
  return {
    cpi: observationFailure("cpi", "CPI", "% YoY", source, sourceUrl, fetchedAt, "Monthly", detail),
    coreCpi: observationFailure("coreCpi", "Core CPI", "% YoY", source, sourceUrl, fetchedAt, "Monthly", detail),
  };
}

export function parseBlsCpi(payload: unknown, fetchedAt: string): BlsResult {
  try {
    const body = payload as {
      status?: string;
      Results?: { series?: Array<{ seriesID?: string; data?: Array<{ year?: string; period?: string; value?: string }> }> };
    };
    if (body.status !== "REQUEST_SUCCEEDED" || !Array.isArray(body.Results?.series)) {
      return unavailableBls(fetchedAt, "BLS did not return a successful CPI response.");
    }

    const bySeries = new Map(body.Results.series.map((item) => [item.seriesID, item.data ?? []]));
    const parseSeries = (key: BlsKey): MetricObservation => {
      const rows = bySeries.get(seriesIds[key]);
      if (!rows) {
        return observationFailure(key, key === "cpi" ? "CPI" : "Core CPI", "% YoY", source, sourceUrl, fetchedAt, "Monthly", "The requested CPI series was absent.");
      }

      const monthly = rows.flatMap((row) => {
        if (!/^M(?:0[1-9]|1[0-2])$/.test(row.period ?? "") || !/^\d{4}$/.test(row.year ?? "")) return [];
        const value = parseFiniteNumber(row.value);
        if (value === null || value <= 0) return [];
        return [{ year: Number(row.year), month: Number(row.period!.slice(1)), value }];
      });
      const index = new Map(monthly.map((row) => [`${row.year}-${row.month}`, row.value]));
      const history = monthly.flatMap((row) => {
        const prior = index.get(`${row.year - 1}-${row.month}`);
        if (prior === undefined || prior <= 0) return [];
        const date = `${row.year}-${String(row.month).padStart(2, "0")}-01`;
        const value = ((row.value / prior) - 1) * 100;
        return parseIsoDate(date) && Number.isFinite(value) ? [{ date, value }] : [];
      }).sort((a, b) => a.date.localeCompare(b.date));
      const latest = history.at(-1);
      if (!latest) {
        return observationFailure(key, key === "cpi" ? "CPI" : "Core CPI", "% YoY", source, sourceUrl, fetchedAt, "Monthly", "A matching month one year earlier is not available.");
      }

      return createAvailableObservation({
        key,
        label: key === "cpi" ? "CPI" : "Core CPI",
        value: latest.value,
        unit: "% YoY",
        source,
        sourceUrl,
        observedAt: latest.date,
        fetchedAt,
        cadence: "Monthly",
        detail: "Year-over-year change in the unadjusted CPI index.",
        history,
      });
    };

    return { cpi: parseSeries("cpi"), coreCpi: parseSeries("coreCpi") };
  } catch {
    return unavailableBls(fetchedAt, "The BLS response could not be parsed.");
  }
}

export async function fetchBlsCpi(options: AdapterOptions = {}): Promise<BlsResult> {
  const now = options.now ?? new Date();
  const fetchedAt = fetchedAtFrom(now);
  const fetchImpl = options.fetchImpl ?? fetch;

  try {
    const response = await fetchImpl(endpoint, cachedFetchOptions(21600, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        seriesid: Object.values(seriesIds),
        startyear: String(now.getUTCFullYear() - 1),
        endyear: String(now.getUTCFullYear()),
      }),
    }));
    if (!response.ok) return unavailableBls(fetchedAt, "The BLS source returned an unsuccessful response.");
    return parseBlsCpi(await response.json(), fetchedAt);
  } catch {
    return unavailableBls(fetchedAt, "The BLS source is temporarily unavailable.");
  }
}

const coreSeries = [
  { sourceId: "bls-cpi", identifier: "CUUR0000SA0", unit: "index (1982-84=100)", seasonalBasis: "NSA", positive: true },
  { sourceId: "bls-cpi", identifier: "CUUR0000SA0L1E", unit: "index (1982-84=100)", seasonalBasis: "NSA", positive: true },
  { sourceId: "bls-cpi", identifier: "CUSR0000SA0", unit: "index (1982-84=100)", seasonalBasis: "SA", positive: true },
  { sourceId: "bls-cpi", identifier: "CUSR0000SA0L1E", unit: "index (1982-84=100)", seasonalBasis: "SA", positive: true },
  { sourceId: "bls-labor", identifier: "CES0000000001", unit: "thousand persons", seasonalBasis: "SA", positive: true },
  { sourceId: "bls-labor", identifier: "LNS14000000", unit: "percent", seasonalBasis: "SA", positive: false },
] as const;

function coreResult(
  sourceId: string,
  identifier: string,
  retrievedAt: string | null,
  state: CoreObservationSeriesResult["state"],
  parserStatus: CoreObservationSeriesResult["parserStatus"],
  historyStatus: CoreObservationSeriesResult["historyStatus"],
  observations: CoreSourceObservation[] = [],
  reason: string | null = null,
  missingPeriods: string[] = [],
): CoreObservationSeriesResult {
  return { sourceId, identifier, retrievedAt, state, parserStatus, historyStatus, observations, reason, missingPeriods };
}

function blsCoreFailures(
  retrievedAt: string | null,
  state: CoreObservationSeriesResult["state"],
  reason: string,
): CoreObservationSeriesResult[] {
  return coreSeries.map(({ sourceId, identifier }) => coreResult(
    sourceId,
    identifier,
    retrievedAt,
    state,
    state === "FAILED" ? "FAILED" : "PARTIAL",
    "PARTIAL",
    [],
    reason,
  ));
}

export function parseBlsCoreSources(
  payload: unknown,
  retrievedAt: string,
): CoreObservationSeriesResult[] {
  const verifiedRetrievedAt = parseIsoDate(retrievedAt.slice(0, 10)) ? retrievedAt : null;
  try {
    const body = payload as {
      status?: string;
      Results?: { series?: Array<{ seriesID?: string; data?: Array<{ year?: string; period?: string; value?: string }> }> };
    };
    if (body.status !== "REQUEST_SUCCEEDED" || !Array.isArray(body.Results?.series) || !verifiedRetrievedAt) {
      return blsCoreFailures(verifiedRetrievedAt, "FAILED", "BLS returned an invalid or unsuccessful response.");
    }

    const byId = new Map<string, Array<{ year?: string; period?: string; value?: string }>>();
    for (const series of body.Results.series) {
      if (!series.seriesID || byId.has(series.seriesID)) {
        if (series.seriesID && coreSeries.some((definition) => definition.identifier === series.seriesID)) {
          return blsCoreFailures(retrievedAt, "FAILED", "BLS returned a duplicate registered series identifier.");
        }
        continue;
      }
      byId.set(series.seriesID, series.data ?? []);
    }

    return coreSeries.map((definition) => {
      const rows = byId.get(definition.identifier);
      if (!rows) {
        return coreResult(definition.sourceId, definition.identifier, retrievedAt, "MISSING", "PARTIAL", "PARTIAL", [], "The registered BLS series was absent.");
      }

      const byMonth = new Map<string, number | null>();
      for (const row of rows) {
        const yearToken = row.year;
        const periodToken = row.period;
        if (periodToken === "M13") continue;
        if (!/^\d{4}$/.test(yearToken ?? "") || !/^M(?:0[1-9]|1[0-2])$/.test(periodToken ?? "")) {
          return coreResult(definition.sourceId, definition.identifier, retrievedAt, "FAILED", "FAILED", "FAILED", [], "BLS returned an invalid monthly period.");
        }
        const missingValue = row.value?.trim() === "-";
        const value = missingValue ? null : parseFiniteNumber(row.value);
        if (!missingValue && (value === null || (definition.positive && value <= 0) || (!definition.positive && (value < 0 || value > 100)))) {
          return coreResult(definition.sourceId, definition.identifier, retrievedAt, "FAILED", "FAILED", "FAILED", [], "BLS returned a non-finite or out-of-range value.");
        }
        const period = `${yearToken}-${periodToken!.slice(1)}`;
        if (byMonth.has(period)) {
          return coreResult(definition.sourceId, definition.identifier, retrievedAt, "FAILED", "FAILED", "FAILED", [], "BLS returned a duplicate monthly observation.");
        }
        byMonth.set(period, value);
      }

      const periods = Array.from(byMonth.keys()).sort();
      const serial = (period: string) => {
        const [year, month] = period.split("-").map(Number);
        return year * 12 + month;
      };
      const fromSerial = (value: number) => {
        const year = Math.floor((value - 1) / 12);
        const month = value - year * 12;
        return `${year}-${String(month).padStart(2, "0")}`;
      };
      const expectedPeriods = periods.length
        ? Array.from({ length: serial(periods.at(-1)!) - serial(periods[0]) + 1 }, (_, index) => fromSerial(serial(periods[0]) + index))
        : [];
      const missingPeriods = expectedPeriods
        .filter((period) => !byMonth.has(period) || byMonth.get(period) === null)
        .map((period) => `${period}-01`);
      const validPeriods = periods.filter((period) => byMonth.get(period) !== null);
      if (validPeriods.length === 0) {
        return coreResult(definition.sourceId, definition.identifier, retrievedAt, "MISSING", "PARTIAL", "PARTIAL", [], "BLS returned no valid monthly observations.", missingPeriods);
      }

      const validPeriodSet = new Set(validPeriods);
      const historyPairCount = validPeriods.filter((period) => {
        const [year, month] = period.split("-").map(Number);
        return validPeriodSet.has(`${year - 1}-${String(month).padStart(2, "0")}`);
      }).length;
      const observations = validPeriods.map((period): CoreSourceObservation => ({
        sourceId: definition.sourceId,
        identifier: definition.identifier,
        value: byMonth.get(period)!,
        unit: definition.unit,
        seasonalBasis: definition.seasonalBasis,
        observedAt: `${period}-01`,
        releasedAt: null,
        retrievedAt,
        firstSeenAt: null,
        releaseDateQuality: 0,
        version: null,
        vintage: null,
      }));
      const incompleteHistory = missingPeriods.length > 0 || historyPairCount < 120;
      return coreResult(
        definition.sourceId,
        definition.identifier,
        retrievedAt,
        "AVAILABLE",
        "VERIFIED",
        incompleteHistory ? "PARTIAL" : "VERIFIED",
        observations,
        incompleteHistory
          ? `BLS history has ${historyPairCount} valid YoY pairs against the 120-month reference-history target${missingPeriods.length ? `; ${missingPeriods.length} month(s) are explicitly unavailable` : ""}.`
          : null,
        missingPeriods,
      );
    });
  } catch {
    return blsCoreFailures(retrievedAt, "FAILED", "The BLS core response could not be parsed.");
  }
}

export async function fetchBlsCoreSources(options: AdapterOptions & {
  historyStartYear?: number;
} = {}): Promise<CoreObservationSeriesResult[]> {
  const fetchImpl = options.fetchImpl ?? fetch;
  const currentYear = (options.now ?? new Date()).getUTCFullYear();
  const historyStartYear = options.historyStartYear ?? 2015;
  const retrievedAt = fetchedAtFrom(options.now ?? new Date());
  const seriesById = new Map<string, Array<{ year?: string; period?: string; value?: string }>>();

  if (!Number.isInteger(historyStartYear) || historyStartYear < 1913 || historyStartYear > currentYear) {
    return blsCoreFailures(null, "FAILED", "The requested BLS history start year was invalid.");
  }

  try {
    for (let startYear = historyStartYear; startYear <= currentYear; startYear += 10) {
      const endYear = Math.min(startYear + 9, currentYear);
      const response = await fetchImpl(endpoint, cachedFetchOptions(21600, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          seriesid: coreSeries.map((definition) => definition.identifier),
          startyear: String(startYear),
          endyear: String(endYear),
        }),
      }));
      if (!response.ok) return blsCoreFailures(null, "FAILED", "The BLS source returned an unsuccessful response.");
      const payload = await response.json() as {
        status?: string;
        Results?: { series?: Array<{ seriesID?: string; data?: Array<{ year?: string; period?: string; value?: string }> }> };
      };
      if (payload.status !== "REQUEST_SUCCEEDED" || !Array.isArray(payload.Results?.series)) {
        return blsCoreFailures(retrievedAt, "FAILED", "BLS rejected a bounded history request.");
      }
      for (const series of payload.Results.series) {
        if (!series.seriesID) continue;
        const existing = seriesById.get(series.seriesID) ?? [];
        existing.push(...(series.data ?? []));
        seriesById.set(series.seriesID, existing);
      }
    }

    return parseBlsCoreSources({
      status: "REQUEST_SUCCEEDED",
      Results: { series: Array.from(seriesById.entries()).map(([seriesID, data]) => ({ seriesID, data })) },
    }, retrievedAt);
  } catch {
    return blsCoreFailures(null, "FAILED", "The BLS core history is temporarily unavailable.");
  }
}
