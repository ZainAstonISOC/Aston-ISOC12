import { getEventById } from "@/lib/events";
import { eventIcs } from "@/lib/events/calendar";

/** One event as an .ics file — opens straight into Apple Calendar or Outlook. */
export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const event = await getEventById(id);
  if (!event) return new Response("Event not found", { status: 404 });

  return new Response(eventIcs(event), {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": `attachment; filename="${event.id}.ics"`,
      "Cache-Control": "public, max-age=0, s-maxage=900, stale-while-revalidate=3600",
    },
  });
}
