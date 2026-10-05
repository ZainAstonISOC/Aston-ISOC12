import { cache } from "react";
import {
  RECITERS,
  TAFSIRS,
  TRANSLATIONS,
  cleanTranslation,
  getChapter,
  getChapterAudio,
  getChapterVerses,
  getChapters,
  getTafsir,
  getVerse,
  type Chapter,
} from "./client";

/**
 * Server-side shapes for the /quran reader, built on lib/quran/client.ts.
 * Every fetch underneath is cached indefinitely, and React's cache() dedupes
 * the metadata and page renders of one request.
 */

export const SURAH_COUNT = 114;
export const MAX_PASSAGE = 10;

export interface ReaderVerse {
  key: string;
  number: number;
  ar: string;
  sahih: string;
  haleem: string;
}

export interface SurahData {
  chapter: Chapter;
  verses: ReaderVerse[];
  /** Default reciter's file for each verse, same order as `verses`. */
  audio: string[];
  /** Uthmani text of 1:1, shown above every surah that opens with it. */
  bismillah: string | null;
}

/** "2" → 2; anything that is not a whole surah number → null. */
export function parseSurah(param: string): number | null {
  if (!/^\d{1,3}$/.test(param)) return null;
  const n = Number(param);
  return n >= 1 && n <= SURAH_COUNT ? n : null;
}

/** "255" → [255, 255]; "5-6" → [5, 6]; validated against the surah length. */
export function parseAyahRange(param: string, versesCount: number): [number, number] | null {
  const m = /^(\d{1,3})(?:-(\d{1,3}))?$/.exec(param);
  if (!m) return null;
  const from = Number(m[1]);
  const to = m[2] ? Number(m[2]) : from;
  if (from < 1 || to < from || to > versesCount || to - from + 1 > MAX_PASSAGE) return null;
  return [from, to];
}

export const listChapters = cache(getChapters);
export const loadChapter = cache(getChapter);

const loadBismillah = cache(async () => (await getVerse("1:1")).text_uthmani);

function toReaderVerse(v: Awaited<ReturnType<typeof getChapterVerses>>[number]): ReaderVerse {
  const tr = (id: number) => cleanTranslation(v.translations?.find((t) => t.resource_id === id)?.text ?? "");
  return {
    key: v.verse_key,
    number: v.verse_number,
    ar: v.text_uthmani,
    sahih: tr(TRANSLATIONS.sahih.id),
    haleem: tr(TRANSLATIONS.haleem.id),
  };
}

export const loadSurah = cache(async (n: number): Promise<SurahData> => {
  const [chapter, verses, audio] = await Promise.all([
    getChapter(n),
    getChapterVerses(n, { translations: [TRANSLATIONS.sahih.id, TRANSLATIONS.haleem.id] }),
    getChapterAudio(n, RECITERS.alafasy.id),
  ]);
  const byKey = new Map(audio.map((a) => [a.verse_key, a.url]));
  return {
    chapter,
    verses: verses.map(toReaderVerse),
    audio: verses.map((v) => byKey.get(v.verse_key) ?? ""),
    bismillah: chapter.bismillah_pre ? await loadBismillah() : null,
  };
});

export interface TafsirPassage {
  html: string;
  verseKeys: string[];
}

/**
 * Tafsir for a run of ayat. Ibn Kathir often comments on several ayat at once,
 * so each passage is fetched once and the ayat it covers are skipped.
 */
export const loadTafsir = cache(async (surah: number, from: number, to: number): Promise<TafsirPassage[]> => {
  const out: TafsirPassage[] = [];
  const covered = new Set<string>();
  for (let a = from; a <= to; a++) {
    const key = `${surah}:${a}`;
    if (covered.has(key)) continue;
    const t = await getTafsir(TAFSIRS.ibnKathir.id, key);
    const keys = t.verseKeys.length ? t.verseKeys : [key];
    keys.forEach((k) => covered.add(k));
    out.push({ html: sanitizeTafsir(t.html), verseKeys: keys });
  }
  return out;
});

const ALLOWED_TAGS = new Set(["p", "h2", "h3", "h4", "br", "em", "strong", "b", "i", "ul", "ol", "li", "blockquote"]);

/**
 * The publisher's HTML is reduced to a short list of text tags with every
 * attribute removed, so nothing it contains can run script, load anything or
 * restyle the page. Upstream currently uses only <h2> and <p>.
 */
export function sanitizeTafsir(html: string): string {
  // Allowed tags are swapped for numbered placeholders, every other < and >
  // is escaped, then the placeholders become bare tags again — so a stray or
  // unclosed "<" in the source can never open an element.
  const kept: string[] = [];
  const text = html
    .replace(/\u0000/g, "")
    .replace(/<(script|style|iframe|object|embed|template)[\s\S]*?<\/\1\s*>/gi, "")
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/<\/?([a-zA-Z0-9]+)\b[^>]*>/g, (tag, name: string) => {
      const n = name.toLowerCase();
      if (!ALLOWED_TAGS.has(n)) return "";
      kept.push(tag.startsWith("</") ? `</${n}>` : `<${n}>`);
      return `\u0000${kept.length - 1}\u0000`;
    })
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
  return text.replace(/\u0000(\d+)\u0000/g, (_, i: string) => kept[Number(i)]);
}

/** "makkah" → "Makki", "madinah" → "Madani" */
export function revelationLabel(place: Chapter["revelation_place"]): string {
  return place === "makkah" ? "Makki" : "Madani";
}
