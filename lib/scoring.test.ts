import { describe, expect, it } from "vitest";
import { latestSnapshot, previousSnapshot } from "@/data/mock-metrics";
import { calculateScores, classifyRegime } from "@/lib/scoring";

describe("macro score engine", () => {
  it("keeps category scores normalized between 0 and 100", () => {
    const scores = calculateScores(latestSnapshot, previousSnapshot);

    expect(scores).toHaveLength(5);
    scores.forEach((score) => {
      expect(score.score).toBeGreaterThanOrEqual(0);
      expect(score.score).toBeLessThanOrEqual(100);
    });
  });

  it("classifies the latest mock snapshot as liquidity reflation", () => {
    const scores = calculateScores(latestSnapshot, previousSnapshot);

    expect(classifyRegime(latestSnapshot, scores).regime).toBe(
      "Liquidity Reflation",
    );
  });

  it("identifies concurrent inflation and growth stress as stagflation", () => {
    const stressed = {
      ...latestSnapshot,
      metrics: {
        ...latestSnapshot.metrics,
        cpi: 4.8,
        coreCpi: 4.3,
        oil: 108,
        hySpread: 610,
        joblessClaims: 335,
      },
    };
    const scores = calculateScores(stressed, previousSnapshot);

    expect(classifyRegime(stressed, scores).regime).toBe("Stagflation");
  });
});
