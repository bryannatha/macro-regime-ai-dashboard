import type { MetricObservation } from "@/lib/types";
import { createAvailableObservation, observationFailure, parseFiniteNumber } from "@/lib/market-data/parsers";
import { cachedFetchOptions, fetchedAtFrom, type AdapterOptions } from "@/lib/market-data/types";

const source = "Mempool.space public Bitcoin API";
const sourceUrl = "https://mempool.space/docs/api/rest";
const base = "https://mempool.space/api";
type MempoolResult = { mempoolVsize: MetricObservation; mempoolMedianFeeRate: MetricObservation };

export function parseMempoolDemand(mempool: unknown, blocks: unknown, fetchedAt: string): MempoolResult {
  const date = fetchedAt.slice(0, 10);
  const detail = "On-chain blockspace demand proxy; not BTC price or market buying demand.";
  const pool = mempool as { vsize?: unknown } | null;
  const projectedBlocks = Array.isArray(blocks) ? blocks as Array<{ medianFee?: unknown }> : [];
  const vsize = parseFiniteNumber(pool?.vsize);
  const fee = parseFiniteNumber(projectedBlocks[0]?.medianFee);
  const vsizeObservation = vsize !== null && vsize >= 0
    ? createAvailableObservation({
      key: "mempoolVsize", label: "Bitcoin mempool backlog", value: vsize, unit: "vB", source, sourceUrl,
      observedAt: date, fetchedAt, cadence: "Current", detail, history: [{ date, value: vsize }],
    })
    : observationFailure("mempoolVsize", "Bitcoin mempool backlog", "vB", source, sourceUrl, fetchedAt, "Current", "Mempool did not return a valid virtual-size backlog.");
  const feeObservation = fee !== null && fee >= 0
    ? createAvailableObservation({
      key: "mempoolMedianFeeRate", label: "Projected block median fee", value: fee, unit: "sat/vB", source, sourceUrl,
      observedAt: date, fetchedAt, cadence: "Current", detail, history: [{ date, value: fee }],
    })
    : observationFailure("mempoolMedianFeeRate", "Projected block median fee", "sat/vB", source, sourceUrl, fetchedAt, "Current", "Mempool did not return a valid projected-block median fee.");
  return { mempoolVsize: vsizeObservation, mempoolMedianFeeRate: feeObservation };
}

export async function fetchMempoolDemand(options: AdapterOptions = {}): Promise<MempoolResult> {
  const fetchedAt = fetchedAtFrom(options.now);
  const fetchImpl = options.fetchImpl ?? fetch;
  const loadJson = async (url: string): Promise<unknown | null> => {
    try {
      const response = await fetchImpl(url, cachedFetchOptions(300));
      return response.ok ? await response.json() : null;
    } catch {
      return null;
    }
  };
  const [mempool, blocks] = await Promise.all([
    loadJson(`${base}/mempool`),
    loadJson(`${base}/v1/fees/mempool-blocks`),
  ]);
  return parseMempoolDemand(mempool, blocks, fetchedAt);
}
