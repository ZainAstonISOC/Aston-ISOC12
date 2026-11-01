import { revalidatePath, revalidateTag } from "next/cache";
import { CAREERS_TAG, refreshBoard } from "@/lib/careers";

/**
 * Daily careers refresh (vercel.json → crons). Vercel sends
 * "Authorization: Bearer $CRON_SECRET" when CRON_SECRET is set in the
 * project; without that variable this route refuses every caller, and the
 * page falls back to building its own board every six hours.
 */
// Workday is read politely (see providers/employers.ts), which takes a minute or two.
export const maxDuration = 300;
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret || request.headers.get("authorization") !== `Bearer ${secret}`) {
    return new Response("Unauthorized", { status: 401 });
  }
  const started = Date.now();
  const board = await refreshBoard();
  revalidateTag(CAREERS_TAG, "max");
  revalidatePath("/careers");
  return Response.json({
    listings: board.opportunities.length,
    sources: board.sources,
    seconds: Math.round((Date.now() - started) / 1000),
  });
}
