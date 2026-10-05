/**
 * Everything about events is in UK local time. Vercel runs in UTC, so "today"
 * and "next Friday" have to be worked out in Europe/London explicitly —
 * otherwise they are an hour out for half the year (BST).
 */

export const EVENT_TZ = "Europe/London";

const partsFmt = new Intl.DateTimeFormat("en-GB", {
  timeZone: EVENT_TZ,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  weekday: "short",
  hourCycle: "h23",
});

export interface LondonNow {
  /** YYYY-MM-DD */
  date: string;
  hour: number;
  minute: number;
  /** 0 = Sunday … 6 = Saturday */
  weekday: number;
}

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function londonNow(at: Date = new Date()): LondonNow {
  const p = Object.fromEntries(partsFmt.formatToParts(at).map(x => [x.type, x.value]));
  return {
    date: `${p.year}-${p.month}-${p.day}`,
    hour: Number(p.hour),
    minute: Number(p.minute),
    weekday: WEEKDAYS.indexOf(p.weekday),
  };
}

/** Adds whole days to a YYYY-MM-DD string without any timezone drift. */
export function addDays(date: string, days: number): string {
  const [y, m, d] = date.split("-").map(Number);
  const t = new Date(Date.UTC(y, m - 1, d + days));
  return t.toISOString().slice(0, 10);
}

/**
 * The next Friday on or after today in London. If it is Friday and already
 * past `cutoff` (HH:MM), it rolls to the following week.
 */
export function nextFridayLondon(cutoff = "14:30", at: Date = new Date()): string {
  const now = londonNow(at);
  let ahead = (5 - now.weekday + 7) % 7;
  if (ahead === 0) {
    const [ch, cm] = cutoff.split(":").map(Number);
    if (now.hour > ch || (now.hour === ch && now.minute > cm)) ahead = 7;
  }
  return addDays(now.date, ahead);
}

/** "Friday 16 October" — formatted for display, never shifted by the server's zone. */
export function formatEventDate(date: string, opts: Intl.DateTimeFormatOptions = { weekday: "long", day: "numeric", month: "long" }): string {
  const [y, m, d] = date.split("-").map(Number);
  // Noon UTC can never cross a date line when shown in London.
  return new Date(Date.UTC(y, m - 1, d, 12)).toLocaleDateString("en-GB", { timeZone: EVENT_TZ, ...opts });
}
