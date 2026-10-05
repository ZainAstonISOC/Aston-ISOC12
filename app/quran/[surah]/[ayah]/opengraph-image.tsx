import { ImageResponse } from "next/og";
import { loadChapter, loadSurah, parseAyahRange, parseSurah } from "@/lib/quran/reader";
import { formatRef } from "@/lib/quran/format";
import { OG_COLORS, OG_SIZE, loadOgAssets, ogFooterHost } from "@/lib/og";

/**
 * Share card for an ayah: the Saheeh International translation and the
 * reference. English only — the card renderer (Satori) cannot shape Arabic.
 */
export const alt = "An ayah of the Qur'an, shared from Aston ISOC";
export const size = OG_SIZE;
export const contentType = "image/png";

const { bg, bg3, gold, goldSoft, text, muted } = OG_COLORS;
const LIMIT = 260;

function quoteSize(len: number): number {
  if (len > 200) return 38;
  if (len > 120) return 46;
  return 56;
}

export default async function AyahImage({ params }: { params: Promise<{ surah: string; ayah: string }> }) {
  const p = await params;
  const [{ markSrc, fonts }, surah] = await Promise.all([loadOgAssets(), Promise.resolve(parseSurah(p.surah))]);

  let quote = "Read the Qur'an with translation, recitation and tafsir.";
  let ref = "The Qur'an";
  let surahName = "Aston ISOC";
  if (surah) {
    const chapter = await loadChapter(surah);
    const range = parseAyahRange(p.ayah, chapter.verses_count);
    if (range) {
      const { verses } = await loadSurah(surah);
      const full = verses.slice(range[0] - 1, range[1]).map((v) => v.sahih).join(" ");
      quote = full.length > LIMIT ? `${full.slice(0, LIMIT).replace(/\s+\S*$/, "")}…` : full;
      ref = formatRef(`${surah}:${range[0]}${range[1] > range[0] ? `-${range[1]}` : ""}`);
      surahName = `Surah ${chapter.name_simple}`;
    }
  }

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", position: "relative", background: `linear-gradient(150deg, ${bg3} 0%, ${bg} 62%)`, fontFamily: "DM Sans", color: text }}>
        <div style={{ position: "absolute", top: 28, right: 28, bottom: 28, left: 28, borderRadius: 26, border: "1px solid rgba(216,175,114,0.28)" }} />
        <div style={{ display: "flex", flexDirection: "column", flex: 1, padding: "80px 96px 130px", justifyContent: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 30 }}>
            <div style={{ width: 44, height: 2, background: gold }} />
            <div style={{ fontSize: 22, letterSpacing: 6, color: gold, textTransform: "uppercase" }}>{surahName}</div>
          </div>
          <div style={{ display: "flex", fontFamily: "Playfair Display Italic", fontStyle: "italic", fontSize: quoteSize(quote.length), lineHeight: 1.3, color: "#fff", maxWidth: 960 }}>
            &ldquo;{quote}&rdquo;
          </div>
          <div style={{ display: "flex", fontSize: 30, color: goldSoft, marginTop: 30 }}>{ref}</div>
        </div>
        <div style={{ position: "absolute", left: 96, right: 96, bottom: 62, display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: 24, color: muted }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <img src={markSrc} width={40} height={40} alt="" />
            <span>{ogFooterHost() ?? "Aston ISOC"}</span>
          </div>
          <span style={{ color: goldSoft }}>Translation: Saheeh International</span>
        </div>
      </div>
    ),
    { ...size, fonts },
  );
}
