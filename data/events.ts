/**
 * EVENTS DATA
 * ─────────────────────────────────────────────────────
 * Currently displaying Jummah only.
 * To add future events: add a new object to the events array below.
 * All pages update automatically no redesign needed.
 *
 * Event categories: "all" | "sisters" | "brothers" | "jummah" |
 *   "charity" | "sports" | "speaker" | "freshers" | "social"
 */

import { Event } from "@/types";

export const events: Event[] = [
  {
    id: "jummah-weekly",
    title: "Jumu'ah Prayer",
    date: "2026-06-06",
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
  //   date: "2026-09-20",   // YYYY-MM-DD
  //   time: "19:00",
  //   location: "Aston Students' Union Hall",
  //   category: "all",
  //   description: "Event description here.",
  //   isFeatured: true,
  // },
];

export const getEventById = (id: string) => events.find((e) => e.id === id);
export const getFeaturedEvents = () => events.filter((e) => e.isFeatured);
export const getEventsByCategory = (cat: Event["category"]) =>
  events.filter((e) => e.category === cat || e.category === "all");
export const getUpcomingEvents = (count?: number) => {
  const sorted = [...events].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );
  return count ? sorted.slice(0, count) : sorted;
};
export const getSisterEvents = () =>
  events.filter((e) => e.category === "sisters" || e.category === "all");
export const getBrotherEvents = () =>
  events.filter((e) => ["brothers", "sports", "all"].includes(e.category));
