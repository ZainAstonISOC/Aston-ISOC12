/**
 * Fetches the Arabic (Uthmani), Saheeh International translation and
 * al-Afasy's per-ayah recitation for every reference in data/ayat.ts and
 * writes data/ayat.generated.json. Run after editing the list:
 *
 *   npm run ayat:refresh
 *
 * Uses the same client as the site (lib/quran/client.ts), so QURAN_CLIENT_ID /
 * QURAN_CLIENT_SECRET are used if present in the environment; otherwise the
 * open api.quran.com endpoint.
 */
import { writeFile } from "node:fs/promises";
import { AYAT_REFS } from "../data/ayat.ts";
import { getChapters, getVerse, cleanTranslation, audioUrl, TRANSLATIONS, RECITERS } from "../lib/quran/client.ts";

const OUT = new URL("../data/ayat.generated.json", import.meta.url);

function expand(ref) {
  const m = /^(\d{1,3}):(\d{1,3})(?:-(\d{1,3}))?$/.exec(ref);
  if (!m) throw new Error(`Bad reference "${ref}" — use "2:255" or "94:5-6"`);
  const [, s, a, b] = m.map(Number);
  const last = b || a;
  if (last < a) throw new Error(`Bad range "${ref}"`);
  return Array.from({ length: last - a + 1 }, (_, i) => `${s}:${a + i}`);
}

const chapters = new Map((await getChapters()).map((c) => [c.id, c]));
const out = [];
for (const ref of AYAT_REFS) {
  const keys = expand(ref);
  const chapter = chapters.get(Number(ref.split(":")[0]));
  if (!chapter) throw new Error(`No surah for "${ref}"`);
  if (keys.some((k) => Number(k.split(":")[1]) > chapter.verses_count)) {
    throw new Error(`"${ref}" runs past the end of ${chapter.name_simple} (${chapter.verses_count} ayat)`);
  }
  const verses = [];
  for (const key of keys) {
    const v = await getVerse(key, { translations: [TRANSLATIONS.sahih.id], reciter: RECITERS.alafasy.id });
    const en = v.translations?.find((t) => t.resource_id === TRANSLATIONS.sahih.id)?.text;
    if (!v.text_uthmani || !en || !v.audio?.url) throw new Error(`Incomplete data for ${key}`);
    verses.push({ key, ar: v.text_uthmani, en: cleanTranslation(en), audio: audioUrl(v.audio.url) });
  }
  out.push({ ref, surah: chapter.name_simple, surahArabic: chapter.name_arabic, verses });
  console.log(`${ref.padEnd(10)} ${chapter.name_simple}`);
}

const doc = {
  source: "quran.com (Quran Foundation): Uthmani text, Saheeh International, recitation by Mishari Rashid al-Afasy",
  fetched: new Date().toISOString().slice(0, 10),
  ayat: out,
};
await writeFile(OUT, JSON.stringify(doc, null, 2) + "\n");
console.log(`\nWrote ${out.length} entries to data/ayat.generated.json`);
