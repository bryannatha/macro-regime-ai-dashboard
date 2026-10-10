import { buildRulesReport } from "@/lib/rules-report";
import type { AIReport, DashboardPayload } from "@/lib/types";

export interface DashboardSnapshot {
  id: string;
  payload: DashboardPayload;
  report: AIReport;
}

export function createDashboardSnapshot(payload: DashboardPayload): DashboardSnapshot {
  if (!Number.isFinite(Date.parse(payload.generatedAt))) throw new Error("Invalid assessment cutoff");
  return { id: payload.generatedAt, payload, report: buildRulesReport(payload) };
}

export function createSnapshotRefresher(
  initial: DashboardSnapshot,
  load: () => Promise<DashboardPayload>,
  commit: (snapshot: DashboardSnapshot) => void,
): () => Promise<DashboardSnapshot> {
  let latest = initial;
  let pending: Promise<DashboardSnapshot> | null = null;
  return () => {
    // Both controls share one evaluation; no independent brief response can race the overview.
    if (pending) return pending;
    pending = (async () => {
      const next = createDashboardSnapshot(await load());
      const difference = Date.parse(next.id) - Date.parse(latest.id);
      if (difference < 0) throw new Error("Older assessment snapshot rejected");
      if (difference === 0) {
        if (JSON.stringify(next.payload) !== JSON.stringify(latest.payload)) throw new Error("Assessment cutoff reused for different inputs");
        return latest;
      }
      latest = next;
      commit(next);
      return next;
    })().finally(() => { pending = null; });
    return pending;
  };
}
