import type { MetricObservation } from "@/lib/types";
import { createAvailableObservation, observationFailure, parseFiniteNumber, parseIsoDate } from "@/lib/market-data/parsers";
import { cachedFetchOptions, fetchedAtFrom, type AdapterOptions } from "@/lib/market-data/types";

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
