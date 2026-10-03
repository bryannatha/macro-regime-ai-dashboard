import { describe, expect, it } from "vitest";
import type { MetricObservation, ObservationKey, ObservationMap, Regime } from "@/lib/types";
import { calculateScores, classifyRegime } from "@/lib/scoring";

const observationKeys: ObservationKey[] = [
  "cpi", "coreCpi", "oil", "broadDollarIndex", "twoYearYield", "tenYearRealYield",
  "joblessClaims", "mempoolVsize", "mempoolMedianFeeRate", "usdidr", "btcPrice",
  "hySpread", "goldPrice", "stablecoinMarketCap",
];

const defaults: Record<ObservationKey, number> = {
  cpi: 3,
  coreCpi: 3.1,
  oil: 78.3,
  broadDollarIndex: 117.8,
  twoYearYield: 3.79,
  tenYearRealYield: 1.79,
  joblessClaims: 225,
  mempoolVsize: 4_200_000,
  mempoolMedianFeeRate: 12.5,
  usdidr: 16_275,
  btcPrice: 0,
  hySpread: 0,
  goldPrice: 0,
  stablecoinMarketCap: 0,
};

const excludedKeys: ObservationKey[] = ["btcPrice", "hySpread", "goldPrice", "stablecoinMarketCap"];
const labels: Record<ObservationKey, string> = Object.fromEntries(
  observationKeys.map((key) => [key, key]),
) as Record<ObservationKey, string>;

function observations(
  values: Partial<Record<ObservationKey, number>> = {},
  unavailable: ObservationKey[] = [],
): ObservationMap {
  const entries = observationKeys.map((key) => {
    const excluded = excludedKeys.includes(key) && values[key] === undefined;
    const status = unavailable.includes(key) ? "unavailable" : excluded ? "excluded" : "available";
    const value = status === "available" ? (values[key] ?? defaults[key]) : null;
    const date = status === "available" ? "2026-10-02" : null;
    const item: MetricObservation = {
      key,
      label: labels[key],
      value,
      unit: "test units",
      source: "Deterministic test fixture",
      sourceUrl: null,
      observedAt: date,
      fetchedAt: "2026-10-03T00:00:00.000Z",
      cadence: "Daily",
      status,
      detail: "Test-only observation.",
      history: status === "available" ? [{ date: date!, value: value! }] : [],
    };
    return [key, item] as const;
  });
  return Object.fromEntries(entries) as ObservationMap;
}

function scoreFor(scores: ReturnType<typeof calculateScores>, key: string) {
  const score = scores.find((item) => item.key === key);
  if (!score) throw new Error(`Missing score ${key}`);
  return score;
}

describe("public-data score engine", () => {
  it("returns five bounded scores with explicit coverage", () => {
    const scores = calculateScores(observations());

    expect(scores).toHaveLength(5);
    scores.forEach((item) => {
      expect(item.score).not.toBeNull();
      expect(item.score).toBeGreaterThanOrEqual(0);
      expect(item.score).toBeLessThanOrEqual(100);
      expect(item.coverage).toBe(1);
    });
  });

  it("renormalizes the available weights instead of treating missing oil as zero", () => {
    const input = observations({ cpi: 3.25, coreCpi: 3 }, ["oil"]);
    const inflation = scoreFor(calculateScores(input), "inflationPressure");

    expect(inflation.coverage).toBe(0.75);
    expect(inflation.score).toBe(50);
  });

  it("withholds a score below 60 percent input-weight coverage", () => {
    const input = observations({}, ["coreCpi", "oil"]);
    const inflation = scoreFor(calculateScores(input), "inflationPressure");

    expect(inflation.coverage).toBe(0.4);
    expect(inflation.score).toBeNull();
    expect(inflation.reading).toBe("Unavailable");
    expect(inflation.explanation).toContain("60%");
  });

  it("accepts exactly 60 percent coverage and reports the exact fraction", () => {
    const input = observations({ coreCpi: 3, oil: 85 }, ["cpi"]);
    const inflation = scoreFor(calculateScores(input), "inflationPressure");

    expect(inflation.coverage).toBe(0.6);
    expect(inflation.score).toBe(50);
  });

  it("withholds the regime when any required core category lacks coverage", () => {
    const cases: ObservationKey[][] = [
      ["cpi", "coreCpi", "oil"],
      ["joblessClaims", "twoYearYield"],
      ["broadDollarIndex", "tenYearRealYield"],
      ["mempoolVsize", "mempoolMedianFeeRate"],
    ];

    for (const missing of cases) {
      const input = observations({}, missing);
      expect(classifyRegime(input, calculateScores(input))).toBeNull();
    }
  });

  it("cannot classify Commodity Inflation without an observed oil price", () => {
    const input = observations({ cpi: 4.8, coreCpi: 4.3 }, ["oil"]);
    const regime = classifyRegime(input, calculateScores(input));

    expect(regime?.regime).not.toBe("Commodity Inflation");
  });

  it("cannot classify Fiat Debasement while gold is excluded", () => {
    const input = observations({
      broadDollarIndex: 110,
      tenYearRealYield: 0.5,
      mempoolVsize: 4_000_000,
      mempoolMedianFeeRate: 40,
    });

    expect(classifyRegime(input, calculateScores(input))?.regime).not.toBe("Fiat Debasement");
  });

  it.each([
    ["Hard Landing", { cpi: 2.5, coreCpi: 2.6, oil: 78, joblessClaims: 350, twoYearYield: 5.2, broadDollarIndex: 130, tenYearRealYield: 2.5, mempoolVsize: 1_000_000, mempoolMedianFeeRate: 5 }],
    ["Stagflation", { cpi: 4.8, coreCpi: 4.3, oil: 108, joblessClaims: 350, twoYearYield: 5.2 }],
    ["Commodity Inflation", { cpi: 4.5, coreCpi: 4, oil: 100 }],
    ["Liquidity Reflation", { broadDollarIndex: 115, tenYearRealYield: 1.4, mempoolVsize: 4_000_000, mempoolMedianFeeRate: 40 }],
    ["Goldilocks", { cpi: 2, coreCpi: 2, oil: 60, joblessClaims: 200, twoYearYield: 3, broadDollarIndex: 125, tenYearRealYield: 2, mempoolVsize: 1_000_000, mempoolMedianFeeRate: 5 }],
  ] as Array<[Regime, Partial<Record<ObservationKey, number>>]>)
  ("classifies adequate observations as %s", (expected, values) => {
    const input = observations(values);
    expect(classifyRegime(input, calculateScores(input))?.regime).toBe(expected);
  });

  it("classifies Fiat Debasement only when an actual gold observation is available", () => {
    const input = observations({
      broadDollarIndex: 110,
      tenYearRealYield: 0.5,
      mempoolVsize: 4_000_000,
      mempoolMedianFeeRate: 40,
      goldPrice: 3_000,
    });

    expect(classifyRegime(input, calculateScores(input))?.regime).toBe("Fiat Debasement");
  });
});
