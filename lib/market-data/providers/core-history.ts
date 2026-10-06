import { unstable_cache } from "next/cache";
import { getSourceRegistry } from "../source-registry";
import type { AdapterOptions, CoreObservationSeriesResult } from "../types";
import { fetchBeaCoreSources } from "./bea";
import { fetchBlsCoreSources } from "./bls";
import { fetchDolCoreClaims } from "./dol";
import {
  fetchFederalReserveIndustrialProduction,
  fetchFederalReservePolicyActions,
} from "./federal-reserve-core";
import {
  fetchFederalReserveCreditPerformance,
  fetchFederalReserveH41Liquidity,
  fetchFederalReserveH6M2,
  fetchFederalReserveH8Loans,
  fetchFederalReserveSloos,
} from "./federal-reserve-support";

export interface CoreHistoryOptions extends AdapterOptions {
  historyStartYear?: number;
}

class UncacheableCoreSourceResults extends Error {
  constructor(readonly results: CoreObservationSeriesResult[]) {
    super("Unavailable or empty core source results cannot be cached.");
  }
}

function requireCacheableSources<T extends CoreObservationSeriesResult | CoreObservationSeriesResult[]>(result: T): T {
  const sources: CoreObservationSeriesResult[] = Array.isArray(result)
    ? result as CoreObservationSeriesResult[]
    : [result as CoreObservationSeriesResult];
  if (sources.length === 0 || sources.some(({ state, observations }) => state !== "AVAILABLE" || observations.length === 0)) {
    throw new UncacheableCoreSourceResults(sources);
  }
  return result;
}

const fetchCachedIndustrialProduction = unstable_cache(
  async () => requireCacheableSources(await fetchFederalReserveIndustrialProduction()),
  ["macro-regime-federal-reserve-g17-ip-v1"],
  { revalidate: 21600 },
);

const fetchCachedBeaSources = unstable_cache(
  async () => requireCacheableSources(await fetchBeaCoreSources()),
  ["macro-regime-bea-core-series-v1"],
  { revalidate: 86400 },
);

function failedSeries(sourceIds: string[], retrievedAt: string): CoreObservationSeriesResult[] {
  return getSourceRegistry()
    .filter(({ id }) => sourceIds.includes(id))
    .flatMap((source) => source.identifiers.map((identifier) => ({
      sourceId: source.id,
      identifier,
      state: "FAILED" as const,
      observations: [],
      parserStatus: "FAILED" as const,
      historyStatus: "FAILED" as const,
      retrievedAt,
      reason: "The core source adapter failed unexpectedly.",
    })));
}

async function isolateProvider(
  sourceIds: string[],
  operation: Promise<CoreObservationSeriesResult[] | CoreObservationSeriesResult>,
  retrievedAt: string,
): Promise<CoreObservationSeriesResult[]> {
  try {
    const result = await operation;
    return Array.isArray(result) ? result : [result];
  } catch (error) {
    if (error instanceof UncacheableCoreSourceResults) return error.results;
    return failedSeries(sourceIds, retrievedAt);
  }
}

export async function fetchCoreHistorySources(options: CoreHistoryOptions = {}): Promise<CoreObservationSeriesResult[]> {
  const retrievedAt = (options.now ?? new Date()).toISOString();
  const bypassCache = options.fetchImpl !== undefined || options.historyStartYear !== undefined;
  const [bls, bea, claims, production, policy, h41, h6, sloos, h8, credit] = await Promise.all([
    isolateProvider(["bls-cpi", "bls-labor"], fetchBlsCoreSources(options), retrievedAt),
    isolateProvider(["bea-gdp", "bea-pce-income"], bypassCache
      ? fetchBeaCoreSources(options)
      : fetchCachedBeaSources(), retrievedAt),
    isolateProvider(["dol-initial-claims"], fetchDolCoreClaims(options), retrievedAt),
    isolateProvider(["federal-reserve-g17-ip"], bypassCache
      ? fetchFederalReserveIndustrialProduction(options)
      : fetchCachedIndustrialProduction(), retrievedAt),
    isolateProvider(["federal-reserve-policy-actions"], fetchFederalReservePolicyActions(options), retrievedAt),
    isolateProvider(["federal-reserve-h41-liquidity"], fetchFederalReserveH41Liquidity(options), retrievedAt),
    isolateProvider(["federal-reserve-h6-m2"], fetchFederalReserveH6M2(options), retrievedAt),
    isolateProvider(["federal-reserve-sloos"], fetchFederalReserveSloos(options), retrievedAt),
    isolateProvider(["federal-reserve-h8"], fetchFederalReserveH8Loans(options), retrievedAt),
    isolateProvider(["federal-reserve-credit-performance"], fetchFederalReserveCreditPerformance(options), retrievedAt),
  ]);

  return [
    ...bls,
    ...bea,
    ...claims,
    ...production,
    ...policy,
    ...h41,
    ...h6,
    ...sloos,
    ...h8,
    ...credit,
  ];
}
