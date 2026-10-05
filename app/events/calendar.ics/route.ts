import { getAllEvents } from "@/lib/events";
import { feedIcs } from "@/lib/events/calendar";
import { addDays, londonNow } from "@/lib/events/time";

/**
 * The subscription feed. Calendar apps poll this, so adding, changing or
 * cancelling an event in /admin updates every subscriber's calendar.
 *
 * Events from the last 60 days stay in the feed so they don't vanish from
 * people's calendars the moment they finish; anything older is dropped.
 */
export async function GET() {
  const since = addDays(londonNow().date, -60);
  const events = (await getAllEvents()).filter(e => e.isRecurring || e.date >= since);

  return new Response(feedIcs(events), {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": 'inline; filename="aston-isoc-events.ics"',
      "Cache-Control": "public, max-age=0, s-maxage=900, stale-while-revalidate=3600",
    },
  });
}
