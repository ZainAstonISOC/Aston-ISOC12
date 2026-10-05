import type { Event } from "@/types";
import { nextFridayLondon } from "@/lib/events/time";

/**
 * BUILT-IN EVENTS
 * ---------------------------------------------------------------
 * Recurring fixtures that never need to be added by hand. One-off events are
 * managed by the committee at /admin and stored outside the codebase — do not
 * add them here.
 *
 * This is a function, not a constant, so the "next Friday" date is worked out
 * when the page renders rather than frozen at whatever moment the server
 * process happened to start.
 */
export function getBuiltinEvents(): Event[] {
  return [
    {
      id: "jummah-weekly",
      title: "Jumu'ah Prayer",
      date: nextFridayLondon("14:30"),
      time: "13:30",
      endTime: "14:30",
      location: "Aston Students' Union Hall (SU Hall)",
      category: "jummah",
      description:
        "Weekly Friday congregational prayer on campus. Khutbah begins at 13:30, Salah at approximately 14:00. Open to all. A dedicated sisters' section is available. Confirm any changes via our Instagram @astonisoc.",
      isRecurring: true,
      recurringNote: "Every Friday during term time",
      isFeatured: true,
      source: "builtin",
    },
  ];
}
