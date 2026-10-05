"use server";

import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath, updateTag } from "next/cache";
import {
  SESSION_COOKIE,
  adminConfigProblem,
  createSessionToken,
  passwordMatches,
  requireAdmin,
} from "@/lib/admin/auth";
import { readEventForm, slugify, toEvent, validateEvent, type EventFormValues, type FieldErrors } from "@/lib/admin/validate";
import {
  StorageUnavailableError,
  clearCounter,
  deleteStoredEvent,
  getStoredEvent,
  hitCounter,
  saveStoredEvent,
} from "@/lib/events/store";
import { EVENTS_TAG } from "@/lib/events";
import { getBuiltinEvents } from "@/data/events";
import { JUMUAH_TAG, MAX_JAMAATS, getJumuah } from "@/lib/jumuah";
import { saveSetting } from "@/lib/events/store";

/* ── Login / logout ───────────────────────────────────────────────────── */

export interface LoginState {
  error?: string;
}

const MAX_ATTEMPTS = 8;
const WINDOW_SECONDS = 15 * 60;

async function clientIp(): Promise<string> {
  const h = await headers();
  return h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || "unknown";
}

export async function login(_prev: LoginState, form: FormData): Promise<LoginState> {
  const configProblem = adminConfigProblem();
  if (configProblem) return { error: configProblem };

  const key = `login:${await clientIp()}`;
  const attempts = await hitCounter(key, WINDOW_SECONDS);
  if (attempts > MAX_ATTEMPTS) {
    return { error: "Too many attempts. Wait 15 minutes and try again." };
  }

  if (!passwordMatches(String(form.get("password") ?? ""))) {
    return { error: "That password isn't right." };
  }

  await clearCounter(key);
  const { token, maxAge } = createSessionToken();
  (await cookies()).set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge,
  });
  redirect("/admin");
}

export async function logout(): Promise<void> {
  (await cookies()).delete(SESSION_COOKIE);
  redirect("/admin/login");
}

/* ── Events ───────────────────────────────────────────────────────────── */

export interface EventFormState {
  error?: string;
  fieldErrors?: FieldErrors;
  values?: EventFormValues;
}

/** Every page that lists events, plus their share cards and the calendar feed. */
function refreshEventPages(): void {
  updateTag(EVENTS_TAG);
  revalidatePath("/", "layout");
}

/**
 * Reads storage directly, not the cached list — a stale cache could hand out
 * an id that already exists, and saving would silently overwrite that event.
 */
async function uniqueId(base: string): Promise<string> {
  const builtin = new Set(getBuiltinEvents(await getJumuah()).map(e => e.id));
  const taken = async (id: string) => builtin.has(id) || (await getStoredEvent(id)) !== null;
  if (!(await taken(base))) return base;
  for (let n = 2; ; n++) if (!(await taken(`${base}-${n}`))) return `${base}-${n}`;
}

export async function saveEvent(_prev: EventFormState, form: FormData): Promise<EventFormState> {
  await requireAdmin();

  const values = readEventForm(form);
  const fieldErrors = validateEvent(values);
  if (Object.keys(fieldErrors).length) {
    return { error: "Some details need fixing.", fieldErrors, values };
  }

  const editingId = String(form.get("id") ?? "").trim();
  let id: string;
  if (editingId) {
    // Only committee-added events can be edited; built-in ones live in code.
    if (!(await getStoredEvent(editingId))) return { error: "That event no longer exists.", values };
    id = editingId;
  } else {
    id = await uniqueId(`${slugify(values.title) || "event"}-${values.date}`);
  }

  try {
    await saveStoredEvent(toEvent(id, values));
  } catch (err) {
    if (err instanceof StorageUnavailableError) return { error: err.message, values };
    console.error("[admin] save failed:", err);
    return { error: "Saving failed — nothing was changed. Try again in a moment.", values };
  }

  refreshEventPages();
  redirect(`/admin?saved=${encodeURIComponent(id)}`);
}

export async function deleteEvent(form: FormData): Promise<void> {
  await requireAdmin();
  const id = String(form.get("id") ?? "").trim();
  if (!id || !(await getStoredEvent(id))) redirect("/admin");

  try {
    await deleteStoredEvent(id);
  } catch (err) {
    console.error("[admin] delete failed:", err);
    redirect("/admin?error=delete");
  }

  refreshEventPages();
  redirect("/admin?deleted=1");
}

/* ── Jumu'ah ──────────────────────────────────────────────────────────── */

export interface JumuahFormValues {
  jamaats: string[];
  location: string;
  sisters: string;
  note: string;
}

export interface JumuahFormState {
  error?: string;
  fieldErrors?: Partial<Record<"jamaats" | "location" | "sisters" | "note", string>>;
  values?: JumuahFormValues;
}

const HHMM = /^([01]\d|2[0-3]):[0-5]\d$/;

export async function saveJumuah(_prev: JumuahFormState, form: FormData): Promise<JumuahFormState> {
  await requireAdmin();

  const values: JumuahFormValues = {
    jamaats: form.getAll("jamaat").map(v => String(v).trim()).slice(0, MAX_JAMAATS),
    location: String(form.get("location") ?? "").trim(),
    sisters: String(form.get("sisters") ?? "").trim(),
    note: String(form.get("note") ?? "").trim(),
  };
  const times = values.jamaats.filter(Boolean);
  const fieldErrors: JumuahFormState["fieldErrors"] = {};

  if (!times.length) fieldErrors.jamaats = "Add at least one jamaat time.";
  else if (times.some(t => !HHMM.test(t))) fieldErrors.jamaats = "Use 24-hour times, like 13:30.";
  else if (new Set(times).size !== times.length) fieldErrors.jamaats = "Two jamaats have the same time.";
  else if (times.some(t => t < "11:00" || t > "17:00")) fieldErrors.jamaats = "Jumu'ah times should be between 11:00 and 17:00.";
  if (values.location.length < 3 || values.location.length > 120) fieldErrors.location = "Give a location (up to 120 characters).";
  if (values.sisters.length > 160) fieldErrors.sisters = "Keep this under 160 characters.";
  if (values.note.length > 240) fieldErrors.note = "Keep the notice under 240 characters.";

  if (Object.keys(fieldErrors).length) return { error: "Some details need fixing.", fieldErrors, values };

  const settings = {
    jamaats: [...times].sort(),
    location: values.location,
    sisters: values.sisters.replace(/\.$/, ""),
    note: values.note,
    updatedAt: new Date().toISOString(),
  };

  try {
    await saveSetting("jumuah", JSON.stringify(settings));
  } catch (err) {
    if (err instanceof StorageUnavailableError) return { error: err.message, values };
    console.error("[admin] jumuah save failed:", err);
    return { error: "Saving failed — nothing was changed. Try again in a moment.", values };
  }

  updateTag(JUMUAH_TAG);
  refreshEventPages();
  redirect("/admin?jumuah=saved");
}
