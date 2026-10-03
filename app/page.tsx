import { RegimeDashboard } from "@/components/dashboard/regime-dashboard";
import { getDashboardPayload } from "@/lib/market-data";

export default async function DashboardPage() {
  const payload = await getDashboardPayload();
  return <RegimeDashboard payload={payload} />;
}
