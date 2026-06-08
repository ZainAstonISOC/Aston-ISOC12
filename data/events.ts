import { Event } from "@/types";

/**
 * Returns the date string (YYYY-MM-DD) for the next upcoming Friday.
 * If today IS Friday and it's before 14:30, returns today.
 * Otherwise returns the next Friday.
 * This runs at build time (ISR revalidates hourly) so the date stays current.
 */
function nextFriday(): string {
  const now = new Date();
  // Convert to UK time offset (UTC+0 or UTC+1 BST)
  const day = now.getDay(); // 0=Sun, 5=Fri
  const hour = now.getHours();
  const minute = now.getMinutes();

  // Days until next Friday
  let daysAhead = (5 - day + 7) % 7;

  // If today is Friday but Jumu'ah (14:00) has already passed, jump to next Friday
  if (daysAhead === 0 && (hour > 14 || (hour === 14 && minute > 30))) {
    daysAhead = 7;
  }

  const next = new Date(now);
  next.setDate(now.getDate() + daysAhead);
  return next.toISOString().split("T")[0];
}

export const events: Event[] = [
  {
    id: "jummah-weekly",
    title: "Jumu'ah Prayer",
    date: nextFriday(),          // auto-updates every build/revalidation
    time: "13:30",
    location: "Aston Students' Union Hall (SU Hall)",
    category: "jummah",
    description:
      "Weekly Friday congregational prayer on campus. Khutbah begins at 13:30, Salah at approximately 14:00. Open to all. A dedicated sisters' section is available. Confirm any changes via our Instagram @astonisoc.",
    isRecurring: true,
    recurringNote: "Every Friday during term time",
    isFeatured: true,
  },
  // ── ADD FUTURE EVENTS HERE ────────────────────────────────────────────────
  // {
  //   id: "your-event-id",
  //   title: "Event Title",
  //   date: "2026-09-20",
  //   time: "19:00",
  //   location: "Aston Students' Union Hall",
  //   category: "all",
  //   description: "Event description here.",
  //   isFeatured: true,
  // },
];

export const getEventById        = (id: string) => events.find(e => e.id === id);
export const getFeaturedEvents   = () => events.filter(e => e.isFeatured);
export const getEventsByCategory = (cat: Event["category"]) =>
  events.filter(e => e.category === cat || e.category === "all");
export const getUpcomingEvents   = (count?: number) => {
  const sorted = [...events].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  return count ? sorted.slice(0, count) : sorted;
};
export const getSisterEvents  = () => events.filter(e => e.category === "sisters" || e.category === "all");
export const getBrotherEvents = () => events.filter(e => ["brothers","sports","all"].includes(e.category));
