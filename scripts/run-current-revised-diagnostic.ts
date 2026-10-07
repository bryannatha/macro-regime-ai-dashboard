import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fetchCoreHistorySources } from "../lib/market-data/providers/core-history";
import { getSourceRegistry } from "../lib/market-data/source-registry";
import {
  executeCurrentRevisedHistoryDiagnostic,
  renderDiagnosticMarkdown,
} from "../lib/market-data/revised-history-diagnostic";

const reportPath = resolve(
  process.cwd(),
  "docs/diagnostics/2026-10-04-current-revised-history-2015-2025.md",
);

const loadCoreHistory = () => fetchCoreHistorySources({
  now: new Date(),
  historyStartYear: 2013,
});

async function main() {
  const diagnostic = await executeCurrentRevisedHistoryDiagnostic({
    sourceRegistry: getSourceRegistry(),
    loadSeries: loadCoreHistory,
  });
  await mkdir(dirname(reportPath), { recursive: true });
  await writeFile(reportPath, renderDiagnosticMarkdown(diagnostic), "utf8");
  process.stdout.write(`${JSON.stringify({
    status: diagnostic.status,
    reportPath,
    snapshotCount: diagnostic.snapshots.length,
    blockers: diagnostic.blockers,
    sourceGaps: diagnostic.sourceGaps,
  }, null, 2)}\n`);
}

main().catch((error: unknown) => {
  process.stderr.write(`${error instanceof Error ? error.stack ?? error.message : String(error)}\n`);
  process.exitCode = 1;
});
