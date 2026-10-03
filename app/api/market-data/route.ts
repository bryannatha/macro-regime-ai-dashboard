import { getDashboardPayload } from "@/lib/market-data";

export const dynamic = "force-dynamic";

export async function GET() {
  return Response.json(await getDashboardPayload());
}
