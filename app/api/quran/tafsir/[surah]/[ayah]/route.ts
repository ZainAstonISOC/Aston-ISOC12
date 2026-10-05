import { NextResponse } from "next/server";
import { loadChapter, loadTafsir, parseAyahRange, parseSurah } from "@/lib/quran/reader";

/**
 * GET /api/quran/tafsir/2/255 → Ibn Kathir for that ayah, sanitised.
 * Tafsir never changes, so Vercel's CDN keeps each answer for a year and the
 * function runs about once per ayah.
 */
export async function GET(_req: Request, ctx: RouteContext<"/api/quran/tafsir/[surah]/[ayah]">) {
  const { surah: s, ayah: a } = await ctx.params;
  const surah = parseSurah(s);
  if (!surah) return NextResponse.json({ error: "Unknown surah" }, { status: 404 });
  const chapter = await loadChapter(surah);
  const range = parseAyahRange(a, chapter.verses_count);
  if (!range || range[0] !== range[1]) return NextResponse.json({ error: "Unknown ayah" }, { status: 404 });

  try {
    const [passage] = await loadTafsir(surah, range[0], range[0]);
    return NextResponse.json(passage, {
      headers: { "Cache-Control": "public, s-maxage=31536000, stale-while-revalidate=86400" },
    });
  } catch {
    return NextResponse.json({ error: "Tafsir unavailable" }, { status: 502 });
  }
}
