import { unstable_cache } from "next/cache";
import type { Event } from "@/types";
import { getBuiltinEvents } from "@/data/events";
import { listStoredEvents } from "./store";
import { londonNow } from "./time";

export const EVENTS_TAG = "events";

export { CATEGORY_LABELS } from "./categories";

/**
 * Stored events, cached across requests. The admin actions call
 * updateTag(EVENTS_TAG), so a change shows up on the very next page load;
 * the one-hour revalidate is only a safety net. If storage is down, the site
 * keeps rendering with the built-in events rather than erroring.
 */
const getCachedStoredEvents = unstable_cache(
  async (): Promise<Event[]> => {
    try {
      return await listStoredEvents();
    } catch (err) {
      console.error("[events] storage read failed, falling back to built-in events:", err);
      return [];
    }
  },
  ["stored-events-v1"],
  { tags: [EVENTS_TAG], revalidate: 3600 }
);

function byDateTime(a: Event, b: Event): number {
  return `${a.date}T${a.time}`.localeCompare(`${b.date}T${b.time}`);
}

/** Built-in + committee-added events, past and future, oldest first. */
export async function getAllEvents(): Promise<Event[]> {
  const stored = await getCachedStoredEvents();
  return [...getBuiltinEvents(), ...stored.map(e => ({ ...e, source: "admin" as const }))].sort(byDateTime);
}

/**
 * Today's and future events. "Today" is the London date, so an evening event
 * stays listed for the rest of its day.
 */
export async function getUpcomingEvents(count?: number): Promise<Event[]> {
  const today = londonNow().date;
  const upcoming = (await getAllEvents()).filter(e => e.isRecurring || e.date >= today);
  return count ? upcoming.slice(0, count) : upcoming;
}

export async function getPastEvents(): Promise<Event[]> {
  const today = londonNow().date;
  return (await getAllEvents()).filter(e => !e.isRecurring && e.date < today).reverse();
}

/** Past events still resolve, so links already shared in group chats keep working. */
export async function getEventById(id: string): Promise<Event | undefined> {
  return (await getAllEvents()).find(e => e.id === id);
}

export async function getFeaturedEvents(count = 3): Promise<Event[]> {
  const upcoming = await getUpcomingEvents();
  const featured = upcoming.filter(e => e.isFeatured);
  // Pad with the soonest non-featured events so the homepage row is never thin.
  const rest = upcoming.filter(e => !e.isFeatured);
  return [...featured, ...rest].slice(0, count);
}

export async function getSisterEvents(count?: number): Promise<Event[]> {
  const list = (await getUpcomingEvents()).filter(e => e.category === "sisters" || e.category === "all");
  return count ? list.slice(0, count) : list;
}

export async function getBrotherEvents(count?: number): Promise<Event[]> {
  const list = (await getUpcomingEvents()).filter(e => ["brothers", "sports", "all"].includes(e.category));
  return count ? list.slice(0, count) : list;
}
