import type { Event, EventCategory } from "@/types";
import { CATEGORY_LABELS } from "@/lib/events/categories";

export type EventFormValues = Record<
  "title" | "date" | "time" | "endTime" | "location" | "category" | "description" | "registrationUrl" | "isFeatured",
  string
>;

export type FieldErrors = Partial<Record<keyof EventFormValues, string>>;

const CATEGORIES = Object.keys(CATEGORY_LABELS) as EventCategory[];

export function readEventForm(form: FormData): EventFormValues {
  const get = (k: string) => String(form.get(k) ?? "").trim();
  return {
    title: get("title"),
    date: get("date"),
    time: get("time"),
    endTime: get("endTime"),
    location: get("location"),
    category: get("category"),
    // Browsers submit textarea line breaks as CRLF; store plain newlines.
    description: get("description").replace(/\r\n?/g, "\n"),
    registrationUrl: get("registrationUrl"),
    isFeatured: form.get("isFeatured") ? "on" : "",
  };
}

function validDate(s: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(s)) return false;
  const [y, m, d] = s.split("-").map(Number);
  const t = new Date(Date.UTC(y, m - 1, d));
  return t.getUTCFullYear() === y && t.getUTCMonth() === m - 1 && t.getUTCDate() === d;
}

const validTime = (s: string) => /^([01]\d|2[0-3]):[0-5]\d$/.test(s);

/**
 * Returns field errors, or an empty object when the event is valid. The
 * registration link must be http(s) — anything else (javascript:, data:) would
 * become a clickable link on the public site.
 */
export function validateEvent(v: EventFormValues): FieldErrors {
  const errors: FieldErrors = {};

  if (v.title.length < 3) errors.title = "Give the event a title (at least 3 characters).";
  else if (v.title.length > 120) errors.title = "Keep the title under 120 characters.";

  if (!validDate(v.date)) errors.date = "Pick a date.";

  if (!validTime(v.time)) errors.time = "Pick a start time.";
  if (v.endTime) {
    if (!validTime(v.endTime)) errors.endTime = "That end time isn't valid.";
    else if (validTime(v.time) && v.endTime <= v.time) errors.endTime = "End time must be after the start time.";
  }

  if (v.location.length < 2) errors.location = "Where is it?";
  else if (v.location.length > 160) errors.location = "Keep the location under 160 characters.";

  if (!CATEGORIES.includes(v.category as EventCategory)) errors.category = "Choose who the event is for.";

  if (v.description.length < 10) errors.description = "Add a short description (at least 10 characters).";
  else if (v.description.length > 2000) errors.description = "Keep the description under 2,000 characters.";

  if (v.registrationUrl) {
    try {
      const u = new URL(v.registrationUrl);
      if (u.protocol !== "https:" && u.protocol !== "http:") throw new Error();
    } catch {
      errors.registrationUrl = "Use a full link starting with https://";
    }
  }

  return errors;
}

export function slugify(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60)
    .replace(/-+$/g, "");
}

export function toEvent(id: string, v: EventFormValues): Event {
  return {
    id,
    title: v.title,
    date: v.date,
    time: v.time,
    ...(v.endTime ? { endTime: v.endTime } : {}),
    location: v.location,
    category: v.category as EventCategory,
    description: v.description,
    ...(v.registrationUrl ? { registrationUrl: v.registrationUrl } : {}),
    isFeatured: v.isFeatured === "on",
    source: "admin",
  };
}

export function toFormValues(e: Event): EventFormValues {
  return {
    title: e.title,
    date: e.date,
    time: e.time,
    endTime: e.endTime ?? "",
    location: e.location,
    category: e.category,
    description: e.description,
    registrationUrl: e.registrationUrl ?? "",
    isFeatured: e.isFeatured ? "on" : "",
  };
}
