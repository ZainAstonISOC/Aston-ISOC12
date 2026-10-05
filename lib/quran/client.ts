/**
 * QURAN CONTENT CLIENT
 * ---------------------------------------------------------------
 * Every word of Qur'an, translation and tafsir on the site comes through here,
 * from the Quran Foundation (the team behind quran.com). Nothing is typed by
 * hand and nothing is AI-written.
 *
 * Two backends, same endpoints and response shapes:
 *  - Quran Foundation Content API — used when QURAN_CLIENT_ID and
 *    QURAN_CLIENT_SECRET are set. OAuth2 client credentials, token kept in
 *    memory until shortly before it expires (they last an hour).
 *    QURAN_API_ENV=prelive while the app is still on pre-live keys.
 *  - api.quran.com/api/v4 — the older open endpoint. Deprecated but still
 *    serving; used when no keys are set, and as a fallback if the keyed API
 *    errors, so a credentials problem degrades rather than takes pages down.
 *
 * Self-contained (no imports) on purpose: scripts/refresh-ayat.mjs imports it
 * straight from Node, outside the Next.js build.
 */

// ── Resource ids (stable on both backends) ───────────────────────────────
export const TRANSLATIONS = {
  sahih: { id: 20, name: "Saheeh International" },
  haleem: { id: 85, name: "M.A.S. Abdel Haleem" },
} as const;
export type TranslationKey = keyof typeof TRANSLATIONS;

export const TAFSIRS = {
  ibnKathir: { id: 169, name: "Ibn Kathir (Abridged)" },
} as const;

export const RECITERS = {
  alafasy: { id: 7, name: "Mishari Rashid al-Afasy" },
  husary: { id: 6, name: "Mahmoud Khalil Al-Husary" },
  sudais: { id: 3, name: "Abdur-Rahman as-Sudais" },
  abdulbaset: { id: 2, name: "AbdulBaset AbdulSamad" },
} as const;
export type ReciterKey = keyof typeof RECITERS;

/** Relative audio paths in API responses resolve against this CDN. */
export const AUDIO_BASE = "https://verses.quran.com/";

// ── Types (only the fields the site uses) ────────────────────────────────
export interface Chapter {
  id: number;
  name_simple: string;
  name_arabic: string;
  translated_name: { name: string };
  verses_count: number;
  revelation_place: "makkah" | "madinah";
  bismillah_pre: boolean;
}

export interface Verse {
  verse_key: string;
  verse_number: number;
  text_uthmani: string;
  juz_number: number;
  page_number: number;
  translations?: { resource_id: number; text: string }[];
  audio?: { url: string; segments?: number[][] };
}

export interface AudioFile {
  verse_key: string;
  url: string;
}

// ── Backend selection + auth ─────────────────────────────────────────────
const LEGACY_BASE = "https://api.quran.com/api/v4";

function keyedConfig() {
  const clientId = process.env.QURAN_CLIENT_ID?.trim();
  const clientSecret = process.env.QURAN_CLIENT_SECRET?.trim();
  if (!clientId || !clientSecret) return null;
  const prelive = process.env.QURAN_API_ENV?.trim().toLowerCase() === "prelive";
  return {
    clientId,
    clientSecret,
    authBase: prelive ? "https://prelive-oauth2.quran.foundation" : "https://oauth2.quran.foundation",
    apiBase: prelive
      ? "https://apis-prelive.quran.foundation/content/api/v4"
      : "https://apis.quran.foundation/content/api/v4",
  };
}

let token: { value: string; expiresAt: number } | null = null;

async function accessToken(cfg: NonNullable<ReturnType<typeof keyedConfig>>): Promise<string> {
  if (token && Date.now() < token.expiresAt) return token.value;
  const res = await fetch(`${cfg.authBase}/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${btoa(`${cfg.clientId}:${cfg.clientSecret}`)}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials&scope=content",
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Quran Foundation token request failed: ${res.status}`);
  const body = (await res.json()) as { access_token: string; expires_in?: number };
  // Refresh five minutes early so a request never goes out on a dying token.
  token = { value: body.access_token, expiresAt: Date.now() + ((body.expires_in ?? 3600) - 300) * 1000 };
  return token.value;
}

/**
 * Qur'an text never changes, so responses are cached indefinitely in the
 * Next.js data cache (ignored when run from plain Node). One upstream call per
 * resource per deployment, however many people read it.
 */
const CACHE_FOREVER: RequestInit = { cache: "force-cache", next: { revalidate: false, tags: ["quran"] } };

async function get<T>(path: string): Promise<T> {
  const cfg = keyedConfig();
  if (cfg) {
    try {
      const res = await fetch(`${cfg.apiBase}${path}`, {
        ...CACHE_FOREVER,
        headers: { "x-auth-token": await accessToken(cfg), "x-client-id": cfg.clientId },
      });
      if (res.ok) return (await res.json()) as T;
      if (res.status === 401 || res.status === 403) token = null;
      console.error(`[quran] Quran Foundation API ${res.status} for ${path}; falling back to api.quran.com`);
    } catch (err) {
      console.error(`[quran] Quran Foundation API failed for ${path}; falling back to api.quran.com`, err);
    }
  }
  const res = await fetch(`${LEGACY_BASE}${path}`, CACHE_FOREVER);
  if (!res.ok) throw new Error(`Quran API ${res.status} for ${path}`);
  return (await res.json()) as T;
}

// ── Helpers ──────────────────────────────────────────────────────────────
/**
 * Translations arrive as HTML with footnote markers
 * (`<sup foot_note=…>1</sup>`). The site shows them as plain text.
 */
export function cleanTranslation(html: string): string {
  return html
    .replace(/<sup[^>]*>.*?<\/sup>/gi, "")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+([,.;:])/g, "$1")
    .replace(/\s{2,}/g, " ")
    .trim();
}

/**
 * Most reciters come back as paths on verses.quran.com; some (al-Husary) as
 * protocol-relative URLs on mirrors.quranicaudio.com. Both hosts are in the CSP.
 */
export function audioUrl(path: string): string {
  if (/^https?:\/\//.test(path)) return path;
  if (path.startsWith("//")) return `https:${path}`;
  return `${AUDIO_BASE}${path.replace(/^\/+/, "")}`;
}

// ── Endpoints ────────────────────────────────────────────────────────────
export async function getChapters(): Promise<Chapter[]> {
  const body = await get<{ chapters: Chapter[] }>("/chapters?language=en");
  return body.chapters;
}

export async function getChapter(id: number): Promise<Chapter> {
  const body = await get<{ chapter: Chapter }>(`/chapters/${id}?language=en`);
  return body.chapter;
}

const VERSE_FIELDS = "fields=text_uthmani";

/** One verse with the given translations and one reciter's audio. */
export async function getVerse(
  key: string,
  opts: { translations?: number[]; reciter?: number } = {},
): Promise<Verse> {
  const q = [VERSE_FIELDS];
  if (opts.translations?.length) q.push(`translations=${opts.translations.join(",")}`);
  if (opts.reciter) q.push(`audio=${opts.reciter}`);
  const body = await get<{ verse: Verse }>(`/verses/by_key/${key}?${q.join("&")}`);
  return body.verse;
}

/** Every verse of a surah, following pagination (50 per page upstream). */
export async function getChapterVerses(
  chapter: number,
  opts: { translations?: number[] } = {},
): Promise<Verse[]> {
  const verses: Verse[] = [];
  for (let page = 1; ; page++) {
    const q = [VERSE_FIELDS, "per_page=50", `page=${page}`];
    if (opts.translations?.length) q.push(`translations=${opts.translations.join(",")}`);
    const body = await get<{ verses: Verse[]; pagination: { next_page: number | null } }>(
      `/verses/by_chapter/${chapter}?${q.join("&")}`,
    );
    verses.push(...body.verses);
    if (!body.pagination?.next_page) break;
  }
  return verses;
}

/** Per-ayah audio files for one reciter across a whole surah. */
export async function getChapterAudio(chapter: number, reciter: number): Promise<AudioFile[]> {
  const body = await get<{ audio_files: AudioFile[] }>(
    `/recitations/${reciter}/by_chapter/${chapter}?per_page=300`,
  );
  return body.audio_files.map((f) => ({ verse_key: f.verse_key, url: audioUrl(f.url) }));
}

export interface Tafsir {
  /** Sanitised-on-render HTML from the publisher. */
  html: string;
  /** Verse keys this passage covers — Ibn Kathir often groups several ayat. */
  verseKeys: string[];
}

export async function getTafsir(tafsirId: number, key: string): Promise<Tafsir> {
  const body = await get<{ tafsir: { text: string; verses: Record<string, unknown> } }>(
    `/tafsirs/${tafsirId}/by_ayah/${key}`,
  );
  return { html: body.tafsir.text, verseKeys: Object.keys(body.tafsir.verses ?? {}) };
}
