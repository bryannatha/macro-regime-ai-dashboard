import { getDashboardPayload } from "@/lib/market-data";
import { buildRulesReport } from "@/lib/rules-report";

export const dynamic = "force-dynamic";

export async function GET() {
  return Response.json(buildRulesReport(await getDashboardPayload()));
}
