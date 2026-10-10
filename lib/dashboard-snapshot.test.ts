import { describe, expect, it, vi } from "vitest";
import { createDashboardSnapshot, createSnapshotRefresher } from "./dashboard-snapshot";
import { evaluateRegime } from "./regime";
import { createUnconfiguredRegimeInputs } from "./market-data/regime-inputs";
import type { DashboardPayload } from "./types";

function payload(healthy: boolean, generatedAt: string): DashboardPayload {
  const inputs = createUnconfiguredRegimeInputs();
  for (const key of ["inflation", "growth", "labor", "policyRates", "creditConditions"] as const) {
    inputs.factors[key] = { bounds: { lower: 45, upper: 45 }, coverage: 1, eligibleFamilies: 2, configuredFamilies: 2, historyYears: 3, releaseQuality: 0.25 };
  }
  inputs.native = { deltaPi: 0, realPolicyRate: 1, deltaR: 0, deltaTarget: 0, deltaP: 0, worseningMomenta: 0 };
  if (!healthy) inputs.factors.labor = { ...inputs.factors.labor, bounds: null, coverage: 0.4, eligibleFamilies: 1 };
  return { generatedAt, dataAsOf: "2026-10-03", observations: {} as DashboardPayload["observations"], scores: [], sourceRegistry: [], regime: evaluateRegime(inputs), researchImplications: null };
}

function deferred<T>() {
  let resolve!: (value: T) => void;
  let reject!: (error: Error) => void;
  const promise = new Promise<T>((yes, no) => { resolve = yes; reject = no; });
  return { promise, resolve, reject };
}

describe("coherent dashboard snapshots", () => {
  it.each([true, false])("derives every brief field from the exact input snapshot (healthy=%s)", (healthy) => {
    const data = payload(healthy, "2026-10-10T07:00:00Z");
    const before = JSON.stringify(data);
    const snapshot = createDashboardSnapshot(data);
    expect(snapshot.id).toBe(data.generatedAt);
    expect(snapshot.payload).toBe(data);
    expect(snapshot.report).toMatchObject({ generatedAt: data.generatedAt, dataAsOf: data.dataAsOf, ...Object.fromEntries(["regime", "assessmentStatus", "dataQuality", "regimeClarity", "leadingDirection", "inflationDirection", "transitionRisk"].map((key) => [key, data.regime[key as keyof typeof data.regime]])) });
    expect(JSON.stringify(data)).toBe(before);
    expect(healthy ? data.regime.assessmentStatus : snapshot.report.regime).toBe(healthy ? "PROVISIONAL" : null);
  });

  it.each([[true, false], [false, true]])("atomically refreshes a healthy/failure transition (%s -> %s)", async (beforeHealthy, afterHealthy) => {
    const before = createDashboardSnapshot(payload(beforeHealthy, "2026-10-10T07:00:00Z"));
    const next = payload(afterHealthy, "2026-10-10T07:10:00Z");
    const commit = vi.fn();
    const pending = deferred<DashboardPayload>();
    const refresh = createSnapshotRefresher(before, () => pending.promise, commit);
    const request = refresh();
    expect(commit).not.toHaveBeenCalled();
    pending.resolve(next);
    await request;
    expect(commit).toHaveBeenCalledTimes(1);
    expect(commit.mock.calls[0][0]).toEqual(createDashboardSnapshot(next));
    expect(commit.mock.calls[0][0].report.assessmentStatus).toBe(next.regime.assessmentStatus);
    expect(commit.mock.calls[0][0].report.regime).toBe(next.regime.regime);
    if (!afterHealthy) expect(commit.mock.calls[0][0].report).toMatchObject({ assessmentStatus: "INSUFFICIENT_DATA", regime: null });
  });

  it.each(["brief first", "dashboard first"])("coalesces both refresh controls into one source evaluation (%s)", async () => {
    const pending = deferred<DashboardPayload>();
    const load = vi.fn(() => pending.promise);
    const commit = vi.fn();
    const refresh = createSnapshotRefresher(createDashboardSnapshot(payload(false, "2026-10-10T07:00:00Z")), load, commit);
    const first = refresh();
    const second = refresh();
    expect(first).toBe(second);
    expect(load).toHaveBeenCalledTimes(1);
    pending.resolve(payload(true, "2026-10-10T07:10:00Z"));
    await second;
    expect(commit).toHaveBeenCalledTimes(1);
  });

  it("updates an old cached page coherently and never relabels its original cutoff", async () => {
    const old = createDashboardSnapshot(payload(false, "2026-10-10T06:52:00Z"));
    const fresh = payload(true, "2026-10-10T07:12:00Z");
    const commit = vi.fn();
    const result = await createSnapshotRefresher(old, async () => fresh, commit)();
    expect(old.payload.generatedAt).toBe("2026-10-10T06:52:00Z");
    expect(result.report.generatedAt).toBe(fresh.generatedAt);
    expect(result.payload.regime).toEqual(fresh.regime);
  });

  it("coalesces rapid refreshes and refuses an older response after a newer coherent snapshot", async () => {
    const pending = deferred<DashboardPayload>();
    const load = vi.fn().mockReturnValueOnce(pending.promise).mockResolvedValueOnce(payload(false, "2026-10-10T07:05:00Z"));
    const commit = vi.fn();
    const refresh = createSnapshotRefresher(createDashboardSnapshot(payload(false, "2026-10-10T07:00:00Z")), load, commit);
    const requests = Array.from({ length: 20 }, () => refresh());
    expect(load).toHaveBeenCalledTimes(1);
    pending.resolve(payload(true, "2026-10-10T07:10:00Z"));
    await Promise.all(requests);
    await expect(refresh()).rejects.toThrow(/older/i);
    expect(commit).toHaveBeenCalledTimes(1);
  });

  it("retains both sides of the last snapshot on transport failure and allows a subsequent recovery", async () => {
    const load = vi.fn().mockRejectedValueOnce(new Error("HTTP 503")).mockResolvedValueOnce(payload(false, "2026-10-10T07:10:00Z"));
    const commit = vi.fn();
    const refresh = createSnapshotRefresher(createDashboardSnapshot(payload(true, "2026-10-10T07:00:00Z")), load, commit);
    await expect(refresh()).rejects.toThrow("HTTP 503");
    expect(commit).not.toHaveBeenCalled();
    await refresh();
    expect(commit.mock.calls[0][0].report).toMatchObject({ assessmentStatus: "INSUFFICIENT_DATA", regime: null });
  });

  it("rejects different inputs reusing the same evaluated cutoff", async () => {
    const commit = vi.fn();
    const refresh = createSnapshotRefresher(createDashboardSnapshot(payload(true, "2026-10-10T07:00:00Z")), async () => payload(false, "2026-10-10T07:00:00Z"), commit);
    await expect(refresh()).rejects.toThrow(/cutoff/i);
    expect(commit).not.toHaveBeenCalled();
  });
});
