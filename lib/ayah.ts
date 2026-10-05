import { AYAT_REFS } from "@/data/ayat";
import generated from "@/data/ayat.generated.json";
import { dailyIndex } from "@/lib/quran/format";

/**
 * DAILY AYAH
 * ---------------------------------------------------------------
 * The committee's list (data/ayat.ts) joined to the text fetched from quran.com
 * (data/ayat.generated.json). Pure data and date maths — safe on the server and
 * in the browser, so the page can re-pick "today" offline.
 */

export interface AyahVerse {
  key: string;
  ar: string;
  en: string;
  audio: string;
}

export interface Ayah {
  ref: string;
  surah: string;
  surahArabic: string;
  verses: AyahVerse[];
}

const byRef = new Map(generated.ayat.map((a) => [a.ref, a as Ayah]));
const missing = AYAT_REFS.filter((r) => !byRef.has(r));
if (missing.length) {
  // Fails the build rather than quietly dropping an ayah the committee chose.
  throw new Error(
    `Daily Ayah: ${missing.join(", ")} not in data/ayat.generated.json. Run \`npm run ayat:refresh\` and commit it.`,
  );
}

export const AYAT: Ayah[] = AYAT_REFS.map((r) => byRef.get(r)!);
export const AYAT_SOURCE = generated.source;

export function todaysAyah(date: string): { ayah: Ayah; index: number } {
  const index = dailyIndex(date, AYAT.length);
  return { ayah: AYAT[index], index };
}
