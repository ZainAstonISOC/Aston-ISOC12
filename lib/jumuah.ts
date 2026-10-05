import { unstable_cache } from "next/cache";
import { getSetting } from "@/lib/events/store";

/**
 * JUMU'AH
 * ---------------------------------------------------------------
 * The one source for Friday prayer details across the site: homepage, prayer
 * page, contact, Start Here, the events list and the calendar feed. The
 * committee edits it at /admin/jumuah; until something is saved there, the
 * defaults below apply.
 */
export interface JumuahSettings {
  /** Start time of each jamaat, "HH:MM", earliest first. One to three. */
  jamaats: string[];
  location: string;
  sisters: string;
  /** Optional notice, e.g. a week it moves or is cancelled. Empty when none. */
  note: string;
  updatedAt?: string;
}

export const JUMUAH_DEFAULTS: JumuahSettings = {
  jamaats: ["13:30", "14:30"],
  location: "Aston Students' Union Hall (SU Hall)",
  sisters: "Dedicated sisters' section, through the side entrance",
  note: "",
};

export const JUMUAH_TAG = "jumuah";
export const MAX_JAMAATS = 3;

const TIME = /^([01]\d|2[0-3]):[0-5]\d$/;

/** Accepts only a well-formed stored value; anything else falls back to the defaults. */
export function parseJumuah(raw: string | null): JumuahSettings {
  if (!raw) return JUMUAH_DEFAULTS;
  try {
    const v = JSON.parse(raw) as Partial<JumuahSettings>;
    const jamaats = Array.isArray(v.jamaats) ? v.jamaats.filter((t) => typeof t === "string" && TIME.test(t)) : [];
    if (!jamaats.length || typeof v.location !== "string" || !v.location.trim()) return JUMUAH_DEFAULTS;
    return {
      jamaats: [...new Set(jamaats)].sort().slice(0, MAX_JAMAATS),
      location: v.location,
      sisters: typeof v.sisters === "string" ? v.sisters : "",
      note: typeof v.note === "string" ? v.note : "",
      updatedAt: typeof v.updatedAt === "string" ? v.updatedAt : undefined,
    };
  } catch {
    return JUMUAH_DEFAULTS;
  }
}

/** Cached; /admin/jumuah saves call updateTag(JUMUAH_TAG). Storage trouble never breaks a page. */
export const getJumuah = unstable_cache(
  async (): Promise<JumuahSettings> => {
    try {
      return parseJumuah(await getSetting("jumuah"));
    } catch (err) {
      console.error("[jumuah] storage read failed, using defaults:", err);
      return JUMUAH_DEFAULTS;
    }
  },
  ["jumuah-v1"],
  { tags: [JUMUAH_TAG], revalidate: 3600 },
);

/** ["13:30", "14:30"] → "13:30 and 14:30"; three → "12:30, 13:30 and 14:30". */
export function jamaatList(jamaats: string[]): string {
  if (jamaats.length <= 1) return jamaats[0] ?? "";
  return `${jamaats.slice(0, -1).join(", ")} and ${jamaats[jamaats.length - 1]}`;
}

/** "Two jamaats, 13:30 and 14:30" / "13:30" — for one-line mentions. */
export function jamaatSummary(j: JumuahSettings): string {
  const n = j.jamaats.length;
  if (n === 1) return j.jamaats[0];
  const words = ["", "", "Two", "Three"];
  return `${words[n] ?? n} jamaats, ${jamaatList(j.jamaats)}`;
}
