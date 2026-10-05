import { NextResponse } from "next/server";
import { RECITERS, getChapterAudio, type ReciterKey } from "@/lib/quran/client";
import { parseSurah } from "@/lib/quran/reader";

/**
 * GET /api/quran/audio/husary/2 → per-ayah recitation files for a surah.
 * Used when a reader switches away from the default reciter. CDN-cached.
 */
export async function GET(_req: Request, ctx: RouteContext<"/api/quran/audio/[reciter]/[surah]">) {
  const { reciter, surah: s } = await ctx.params;
  const surah = parseSurah(s);
  if (!surah || !(reciter in RECITERS)) return NextResponse.json({ error: "Not found" }, { status: 404 });

  try {
    const files = await getChapterAudio(surah, RECITERS[reciter as ReciterKey].id);
    return NextResponse.json(files, {
      headers: { "Cache-Control": "public, s-maxage=31536000, stale-while-revalidate=86400" },
    });
  } catch {
    return NextResponse.json({ error: "Audio list unavailable" }, { status: 502 });
  }
}
