import type { Event } from "@/types";
import { SITE_URL } from "@/lib/site";
import { EVENT_TZ, addDays, londonNow } from "./time";

/**
 * CALENDAR EXPORT (RFC 5545)
 * ---------------------------------------------------------------
 * Times are written as local wall-clock times with TZID=Europe/London and a
 * matching VTIMEZONE block. Converting to UTC instead would be wrong for the
 * weekly Jumu'ah: a UTC recurrence rule keeps the same UTC time all year, so
 * 13:30 would drift to 12:30 or 14:30 when the clocks change.
 */

// UIDs must never change, or subscribed calendars show duplicates. They are
// pinned to the society's domain rather than whatever URL the site is on.
const UID_DOMAIN = "astonisoc.com";

const VTIMEZONE = [
  "BEGIN:VTIMEZONE",
  `TZID:${EVENT_TZ}`,
  "BEGIN:DAYLIGHT",
  "TZOFFSETFROM:+0000",
  "TZOFFSETTO:+0100",
  "TZNAME:BST",
  "DTSTART:19700329T010000",
  "RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=-1SU",
  "END:DAYLIGHT",
  "BEGIN:STANDARD",
  "TZOFFSETFROM:+0100",
  "TZOFFSETTO:+0000",
  "TZNAME:GMT",
  "DTSTART:19701025T020000",
  "RRULE:FREQ=YEARLY;BYMONTH=10;BYDAY=-1SU",
  "END:STANDARD",
  "END:VTIMEZONE",
];

/** RFC 5545 §3.3.11 — backslash, semicolon, comma and newlines must be escaped. */
function escapeText(s: string): string {
  return s.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\r?\n/g, "\\n");
}

/**
 * RFC 5545 §3.1 — lines longer than 75 OCTETS are folded with CRLF + space.
 * Counting characters instead of bytes breaks on curly apostrophes and Arabic,
 * which are multi-byte in UTF-8.
 */
function fold(line: string): string {
  const out: string[] = [];
  let current = "";
  let bytes = 0;
  for (const ch of line) {
    const b = Buffer.byteLength(ch, "utf8");
    const limit = out.length === 0 ? 75 : 74; // continuation lines start with a space
    if (bytes + b > limit) {
      out.push(current);
      current = ch;
      bytes = b;
    } else {
      current += ch;
      bytes += b;
    }
  }
  out.push(current);
  return out.join("\r\n ");
}

function localStamp(date: string, time: string): string {
  return `${date.replace(/-/g, "")}T${time.replace(":", "")}00`;
}

function utcStamp(d: Date): string {
  return d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
}

/** End date/time. Missing or non-positive durations default to one hour. */
export function eventEnd(e: Event): { date: string; time: string } {
  const [sh, sm] = e.time.split(":").map(Number);
  const start = sh * 60 + sm;
  let end = start + 60;
  if (e.endTime) {
    const [eh, em] = e.endTime.split(":").map(Number);
    const parsed = eh * 60 + em;
    if (parsed > start) end = parsed;
  }
  const dayShift = Math.floor(end / 1440);
  const mins = end % 1440;
  const time = `${String(Math.floor(mins / 60)).padStart(2, "0")}:${String(mins % 60).padStart(2, "0")}`;
  return { date: dayShift ? addDays(e.date, dayShift) : e.date, time };
}

/** Recurring events stop at the end of the academic year (1 July). */
function academicYearEnd(): string {
  const now = londonNow();
  const year = Number(now.date.slice(0, 4)) + (Number(now.date.slice(5, 7)) >= 7 ? 1 : 0);
  return `${year}0701T000000Z`;
}

const WEEKDAY_CODES = ["SU", "MO", "TU", "WE", "TH", "FR", "SA"];

function weekdayCode(date: string): string {
  const [y, m, d] = date.split("-").map(Number);
  return WEEKDAY_CODES[new Date(Date.UTC(y, m - 1, d, 12)).getUTCDay()];
}

export function eventUrl(e: Event): string {
  return `${SITE_URL}/events/${e.id}`;
}

function vevent(e: Event, stamp: string): string[] {
  const end = eventEnd(e);
  const details = [e.description, e.recurringNote, `Details: ${eventUrl(e)}`].filter(Boolean).join("\n\n");
  const lines = [
    "BEGIN:VEVENT",
    `UID:${e.id}@${UID_DOMAIN}`,
    `DTSTAMP:${stamp}`,
    `DTSTART;TZID=${EVENT_TZ}:${localStamp(e.date, e.time)}`,
    `DTEND;TZID=${EVENT_TZ}:${localStamp(end.date, end.time)}`,
    `SUMMARY:${escapeText(e.title)}`,
    `LOCATION:${escapeText(e.location)}`,
    `DESCRIPTION:${escapeText(details)}`,
    `URL:${eventUrl(e)}`,
  ];
  if (e.isRecurring) {
    lines.push(`RRULE:FREQ=WEEKLY;BYDAY=${weekdayCode(e.date)};UNTIL=${academicYearEnd()}`);
  }
  lines.push("END:VEVENT");
  return lines;
}

function calendar(events: Event[], name: string): string {
  const stamp = utcStamp(new Date());
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Aston ISOC//Events//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    `X-WR-CALNAME:${escapeText(name)}`,
    `X-WR-TIMEZONE:${EVENT_TZ}`,
    // Hints for subscribed calendars to check back hourly.
    "REFRESH-INTERVAL;VALUE=DURATION:PT1H",
    "X-PUBLISHED-TTL:PT1H",
    ...VTIMEZONE,
    ...events.flatMap(e => vevent(e, stamp)),
    "END:VCALENDAR",
  ];
  return lines.map(fold).join("\r\n") + "\r\n";
}

export function eventIcs(e: Event): string {
  return calendar([e], e.title);
}

export function feedIcs(events: Event[]): string {
  return calendar(events, "Aston ISOC Events");
}

/** Pre-filled "add event" link for Google Calendar. */
export function googleCalendarUrl(e: Event): string {
  const end = eventEnd(e);
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: e.title,
    dates: `${localStamp(e.date, e.time)}/${localStamp(end.date, end.time)}`,
    ctz: EVENT_TZ,
    location: e.location,
    details: [e.description, `Details: ${eventUrl(e)}`].join("\n\n"),
  });
  if (e.isRecurring) params.set("recur", `RRULE:FREQ=WEEKLY;BYDAY=${weekdayCode(e.date)};UNTIL=${academicYearEnd()}`);
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

/* ── Subscription links (the whole feed, kept up to date by the calendar app) ── */

export const FEED_PATH = "/events/calendar.ics";

export function feedHttpsUrl(): string {
  return `${SITE_URL}${FEED_PATH}`;
}

export function feedWebcalUrl(): string {
  return feedHttpsUrl().replace(/^https?:/, "webcal:");
}

export function googleSubscribeUrl(): string {
  return `https://calendar.google.com/calendar/r?cid=${encodeURIComponent(feedWebcalUrl())}`;
}
