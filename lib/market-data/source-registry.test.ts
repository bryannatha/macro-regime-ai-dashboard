import { describe, expect, it } from "vitest";
import { calculateDataQuality } from "@/lib/regime";

const modulePath: string = "./source-registry";

async function loadRegistryModule() {
  try {
    return await import(modulePath);
  } catch {
    return null;
  }
}

function testSource(overrides: Record<string, unknown> = {}) {
  return {
    id: "test-source",
    owner: "Test agency",
    endpoint: "https://example.gov/data",
    identifiers: ["TEST.SA"],
    accessMethod: "Public API",
    reuseStatus: "CLEARED",
    reuseEvidenceUrl: "https://example.gov/terms",
    attribution: "Source: Test agency",
    cadence: "monthly",
    firstUsablePeriod: "2020-01",
    units: ["index"],
    seasonalBases: ["SA"],
    expectedReleaseSchedule: "Monthly; tested fixture schedule",
    releaseQuality: 0.25,
    sourceHealth: "MISSING",
    parserStatus: "VERIFIED",
    historyStatus: "VERIFIED",
    verifiedAt: "2026-10-04",
    familyAllocations: [{ factor: "growth", family: "test", weight: 1 }],
    ...overrides,
  };
}

function observation(overrides: Record<string, unknown> = {}) {
  return {
    sourceId: "test-source",
    identifier: "TEST.SA",
    value: 101.2,
    unit: "index",
    seasonalBasis: "SA",
    observedAt: "2026-10-01T00:00:00.000Z",
    releasedAt: null,
    retrievedAt: "2026-10-02T08:30:00.000Z",
    firstSeenAt: "2026-10-02T08:31:00.000Z",
    releaseDateQuality: 0.25,
    version: "2026-10-02-release",
    vintage: "2026-10",
    ...overrides,
  };
}

const freshWindow = {
  expectedPublicationAt: "2026-10-05T00:00:00.000Z",
  overdueGraceEndsAt: "2026-10-12T00:00:00.000Z",
  fallbackAgeCeilingDays: 70,
};

describe("core source registry and observation provenance", () => {
  it("exposes exactly the five governed source states", async () => {
    const registry = await loadRegistryModule();
    expect(registry).not.toBeNull();
    if (!registry) return;

    expect(registry.SOURCE_STATES).toEqual([
      "AVAILABLE",
      "STALE",
      "MISSING",
      "FAILED",
      "REDISTRIBUTION_BLOCKED",
    ]);
  });

  it("registers source ownership, terms, attribution, cadence, parser and history metadata", async () => {
    const registry = await loadRegistryModule();
    expect(registry).not.toBeNull();
    if (!registry) return;

    expect(registry.SOURCE_REGISTRY.length).toBeGreaterThan(0);
    for (const entry of registry.SOURCE_REGISTRY) {
      expect(entry).toMatchObject({
        owner: expect.any(String),
        endpoint: expect.any(String),
        identifiers: expect.arrayContaining([expect.any(String)]),
        accessMethod: expect.any(String),
        reuseReviewUrl: expect.any(String),
        attribution: expect.any(String),
        cadence: expect.any(String),
        units: expect.arrayContaining([expect.any(String)]),
        seasonalBases: expect.arrayContaining([expect.any(String)]),
        expectedReleaseSchedule: expect.any(String),
        releaseDateQuality: expect.anything(),
        sourceHealth: expect.any(String),
        parserStatus: expect.any(String),
        historyStatus: expect.any(String),
      });
      expect(typeof entry.reuseEvidenceUrl === "string" || entry.reuseEvidenceUrl === null).toBe(true);
    }

    const treasury = registry.SOURCE_REGISTRY.find((entry: { id: string }) => entry.id === "treasury-real-yield");
    expect(treasury).toMatchObject({
      identifiers: ["TC_10YEAR"],
      sourceHealth: "MISSING",
      reuseStatus: "CLEARED",
      reuseEvidenceUrl: "https://catalog.data.gov/dataset/daily-treasury-real-yield-curve-rates",
      familyAllocations: [{ factor: "policyRates", family: "realFinancing", weight: 0.5 }],
    });
  });

  it("keeps observation, release, retrieval, first-seen and vintage timestamps distinct", async () => {
    const registry = await loadRegistryModule();
    expect(registry).not.toBeNull();
    if (!registry) return;

    const resolved = registry.resolveSourceObservation(testSource(), {
      now: new Date("2026-10-03T12:00:00.000Z"),
      fetchAttempt: { status: "SUCCEEDED", attemptedAt: "2026-10-03T12:00:00.000Z", observation: observation() },
      cache: null,
      freshnessWindow: freshWindow,
    });

    expect(resolved).toMatchObject({
      state: "AVAILABLE",
      eligible: true,
      fetchHealth: 1,
      lastFetchAttemptAt: "2026-10-03T12:00:00.000Z",
      observation: {
        observedAt: "2026-10-01T00:00:00.000Z",
        releasedAt: null,
        retrievedAt: "2026-10-02T08:30:00.000Z",
        firstSeenAt: "2026-10-02T08:31:00.000Z",
        vintage: "2026-10",
      },
    });
  });

  it("rejects release quality above first-seen evidence when releasedAt is unknown", async () => {
    const registry = await loadRegistryModule();
    expect(registry).not.toBeNull();
    if (!registry) return;

    const resolved = registry.resolveSourceObservation(testSource(), {
      now: new Date("2026-10-03T12:00:00.000Z"),
      fetchAttempt: {
        status: "SUCCEEDED",
        attemptedAt: "2026-10-03T12:00:00.000Z",
        observation: observation({ firstSeenAt: null, releaseDateQuality: 0.25 }),
      },
      cache: null,
      freshnessWindow: freshWindow,
    });

    expect(resolved).toMatchObject({ state: "FAILED", eligible: false, reason: "OBSERVATION_VALIDATION_FAILED" });
  });

  it("reuses a fresh validated cache after a failed fetch without refreshing observation dates", async () => {
    const registry = await loadRegistryModule();
    expect(registry).not.toBeNull();
    if (!registry) return;
    const cachedObservation = observation();

    const resolved = registry.resolveSourceObservation(testSource(), {
      now: new Date("2026-10-04T12:00:00.000Z"),
      fetchAttempt: { status: "FAILED", attemptedAt: "2026-10-04T12:00:00.000Z", error: "upstream unavailable" },
      cache: { observation: cachedObservation, validatedAt: "2026-10-02T08:31:00.000Z", validationVersion: "fixture-v1" },
      freshnessWindow: freshWindow,
    });

    expect(resolved).toMatchObject({
      state: "AVAILABLE",
      eligible: true,
      fetchHealth: 0.8,
      lastFetchAttemptAt: "2026-10-04T12:00:00.000Z",
      lastFetchError: "upstream unavailable",
      observation: cachedObservation,
    });
    expect(resolved.observation.retrievedAt).not.toBe(resolved.lastFetchAttemptAt);
  });

  it("rejects cache metadata that claims validation in the future", async () => {
    const registry = await loadRegistryModule();
    expect(registry).not.toBeNull();
    if (!registry) return;

    const resolved = registry.resolveSourceObservation(testSource(), {
      now: new Date("2026-10-04T12:00:00.000Z"),
      fetchAttempt: { status: "FAILED", attemptedAt: "2026-10-04T12:00:00.000Z", error: "upstream unavailable" },
      cache: {
        observation: observation(),
        validatedAt: "2026-10-08T00:00:00.000Z",
        validationVersion: "fixture-v1",
      },
      freshnessWindow: freshWindow,
    });

    expect(resolved).toMatchObject({ state: "FAILED", eligible: false, fetchHealth: 0 });
  });

  it("marks a failed fetch with a stale cache ineligible and gives it zero contribution", async () => {
    const registry = await loadRegistryModule();
    expect(registry).not.toBeNull();
    if (!registry) return;

    const resolved = registry.resolveSourceObservation(testSource(), {
      now: new Date("2026-10-04T12:00:00.000Z"),
      fetchAttempt: { status: "FAILED", attemptedAt: "2026-10-04T12:00:00.000Z", error: "upstream unavailable" },
      cache: { observation: observation(), validatedAt: "2026-10-02T08:31:00.000Z", validationVersion: "fixture-v1" },
      freshnessWindow: {
        expectedPublicationAt: "2026-09-01T00:00:00.000Z",
        overdueGraceEndsAt: "2026-09-08T00:00:00.000Z",
        fallbackAgeCeilingDays: 70,
      },
    });

    expect(resolved).toMatchObject({ state: "STALE", eligible: false, fetchHealth: 0, freshness: 0 });
    expect(calculateDataQuality([registry.toQualitySlot(resolved, { weight: 1, history: 1, release: 1 })])).toBe(0);
  });

  it("keeps configured family weights unchanged when Treasury reuse is cleared", async () => {
    const registry = await loadRegistryModule();
    expect(registry).not.toBeNull();
    if (!registry) return;

    const treasury = registry.SOURCE_REGISTRY.find((entry: { id: string }) => entry.id === "treasury-real-yield");
    expect(treasury.familyAllocations).toEqual([
      { factor: "policyRates", family: "realFinancing", weight: 0.5 },
    ]);
    expect(registry.resolveSourceObservation({ ...treasury, sourceHealth: "AVAILABLE" }, {
      now: new Date("2026-10-04T12:00:00.000Z"),
      fetchAttempt: { status: "NOT_ATTEMPTED", attemptedAt: null },
      cache: { observation: observation({
        sourceId: treasury.id,
        identifier: "TC_10YEAR",
        unit: "percent",
        seasonalBasis: "Not seasonally adjusted",
        observedAt: "2026-10-02",
        releaseDateQuality: 0,
      }), validatedAt: "2026-10-02T08:31:00.000Z", validationVersion: "fixture-v1" },
      freshnessWindow: freshWindow,
    })).toMatchObject({ state: "AVAILABLE", eligible: true });
  });

  it("cannot increase Data Quality as a failed-fetch cache ages", async () => {
    const registry = await loadRegistryModule();
    expect(registry).not.toBeNull();
    if (!registry) return;

    const source = testSource();
    const cache = { observation: observation(), validatedAt: "2026-10-02T08:31:00.000Z", validationVersion: "fixture-v1" };
    const fetchAttempt = { status: "FAILED", attemptedAt: "2026-10-04T12:00:00.000Z", error: "upstream unavailable" };
    const early = registry.resolveSourceObservation(source, {
      now: new Date("2026-10-04T12:00:00.000Z"), fetchAttempt, cache, freshnessWindow: freshWindow,
    });
    const later = registry.resolveSourceObservation(source, {
      now: new Date("2026-10-08T12:00:00.000Z"), fetchAttempt, cache, freshnessWindow: freshWindow,
    });
    const quality = (resolved: unknown): number => {
      const value = calculateDataQuality([
        registry.toQualitySlot(resolved, { weight: 1, history: 0.5, release: 0.25 }),
      ]);
      if (value === null) throw new Error("Expected a configured Data Quality slot");
      return value;
    };

    expect(later.freshness).toBeLessThan(early.freshness);
    expect(quality(later)).toBeLessThanOrEqual(quality(early));
  });
});
