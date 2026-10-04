import { describe, expect, it } from "vitest";
import { getResearchImplications } from "@/lib/playbook";
import { REGIMES } from "@/lib/types";

describe("regime research implications", () => {
  it("provides research questions and guardrails for every v0.3 regime", () => {
    for (const regime of REGIMES) {
      const implications = getResearchImplications(regime);

      expect(implications.regime).toBe(regime);
      expect(implications.researchThemes.length).toBeGreaterThan(0);
      expect(implications.guardrails.length).toBeGreaterThan(0);
      expect(implications).not.toHaveProperty("favor");
      expect(implications).not.toHaveProperty("reduce");
      expect(JSON.stringify(implications)).not.toMatch(/\b(buy|sell|favor|reduce)\b/i);
    }
  });

  it("qualifies Inflationary Expansion without assigning demand causation", () => {
    const implications = getResearchImplications("INFLATIONARY_EXPANSION");

    expect(implications.thesis).toContain("alongside");
    expect(implications.counterSignals.join(" ")).toMatch(/supply or demand/i);
  });
});
