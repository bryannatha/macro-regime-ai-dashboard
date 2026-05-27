import { RegimeDashboard } from "@/components/dashboard/regime-dashboard";
import {
  latestSnapshot,
  mockMarketHistory,
  previousSnapshot,
} from "@/data/mock-metrics";
import { getPlaybook } from "@/lib/playbook";
import { calculateScores, classifyRegime } from "@/lib/scoring";

export default function DashboardPage() {
  const scores = calculateScores(latestSnapshot, previousSnapshot);
  const assessment = classifyRegime(latestSnapshot, scores);
  const playbook = getPlaybook(assessment.regime);

  return (
    <RegimeDashboard
      assessment={assessment}
      current={latestSnapshot}
      history={mockMarketHistory}
      playbook={playbook}
      previous={previousSnapshot}
      scores={scores}
    />
  );
}
