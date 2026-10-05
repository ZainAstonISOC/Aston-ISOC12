import type { Event } from "@/types";
import { nextFridayLondon } from "@/lib/events/time";
import { jamaatList, type JumuahSettings } from "@/lib/jumuah";

/**
 * BUILT-IN EVENTS
 * ---------------------------------------------------------------
 * Recurring fixtures that never need to be added by hand. One-off events are
 * managed by the committee at /admin and stored outside the codebase — do not
 * add them here.
 *
 * Jumu'ah comes from the Jumu'ah settings (/admin/jumuah): one weekly event
 * per jamaat. The first keeps the id "jummah-weekly" so links and calendar
 * subscriptions made before there were two jamaats still point at it.
 *
 * This is a function, not a constant, so the "next Friday" date is worked out
 * when the page renders rather than frozen at whatever moment the server
 * process happened to start.
 */
const ORDINALS = ["1st", "2nd", "3rd"];

function toMinutes(t: string): number {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
}

function fromMinutes(n: number): string {
  return `${String(Math.floor(n / 60) % 24).padStart(2, "0")}:${String(n % 60).padStart(2, "0")}`;
}

export function getBuiltinEvents(jumuah: JumuahSettings): Event[] {
  const { jamaats, location, sisters, note } = jumuah;
  const many = jamaats.length > 1;
  return jamaats.map((time, i) => {
    // An hour each, but never overlapping the next jamaat.
    const next = jamaats[i + 1];
    const end = fromMinutes(Math.min(toMinutes(time) + 60, next ? toMinutes(next) : Infinity));
    const description = [
      many
        ? `Weekly Friday prayer on campus, with ${jamaats.length} jamaats: ${jamaatList(jamaats)}. This is the ${ORDINALS[i]}.`
        : "Weekly Friday congregational prayer on campus.",
      "Open to all.",
      sisters ? `${sisters}.` : "",
      note,
      "Confirm any changes via our Instagram @astonisoc.",
    ]
      .filter(Boolean)
      .join(" ")
      .replace(/\.\./g, ".");
    return {
      id: i === 0 ? "jummah-weekly" : `jummah-weekly-${i + 1}`,
      title: many ? `Jumu'ah Prayer (${ORDINALS[i]} jamaat)` : "Jumu'ah Prayer",
      date: nextFridayLondon(end),
      time,
      endTime: end,
      location,
      category: "jummah",
      description,
      isRecurring: true,
      recurringNote: "Every Friday during term time",
      // Only the first is featured, so Jumu'ah takes one homepage slot, not two.
      isFeatured: i === 0,
      source: "builtin",
    };
  });
}
