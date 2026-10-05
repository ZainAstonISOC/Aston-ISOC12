import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { SITE_URL } from "@/lib/site";

/**
 * The card shown whenever a link to the site is shared — WhatsApp, Instagram
 * DMs, iMessage, LinkedIn, X. Before this existed the site had no og:image at
 * all, so every shared link previewed as bare text.
 *
 * Generated once at build time. Fonts are vendored in assets/fonts because the
 * renderer (Satori) cannot use the Google Fonts CSS the pages load.
 */

export const alt = "Aston ISOC — the Islamic Society at Aston University, Birmingham";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const BG = "#130d28";
const BG_3 = "#1f1547";
const GOLD = "#d8af72";
const GOLD_SOFT = "#ecd3a6";
const TEXT = "#f5f2ea";
const MUTED = "#b7b0c9";

export default async function OpengraphImage() {
  const [playfair, playfairItalic, dmSans, mark] = await Promise.all([
    readFile(join(process.cwd(), "assets/fonts/PlayfairDisplay-SemiBold.ttf")),
    readFile(join(process.cwd(), "assets/fonts/PlayfairDisplay-MediumItalic.ttf")),
    readFile(join(process.cwd(), "assets/fonts/DMSans-Medium.ttf")),
    readFile(join(process.cwd(), "public/isoc-mark.png")),
  ]);
  const markSrc = `data:image/png;base64,${mark.toString("base64")}`;

  // Only print a domain once the site is actually served from one; the
  // vercel.app fallback is not something to put on a share card.
  const host = new URL(SITE_URL).host;
  const footerLeft = host.endsWith(".vercel.app") ? "Aston University · Birmingham" : host;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          background: `linear-gradient(150deg, ${BG_3} 0%, ${BG} 62%)`,
          fontFamily: "DM Sans",
          color: TEXT,
        }}
      >
        {/* Gold glow behind the mark */}
        <div
          style={{
            position: "absolute",
            right: -120,
            top: -60,
            width: 720,
            height: 720,
            borderRadius: 720,
            background: "radial-gradient(circle, rgba(216,175,114,0.22) 0%, rgba(216,175,114,0) 65%)",
          }}
        />
        {/* Hairline frame */}
        <div
          style={{
            // Satori ignores the `inset` shorthand, so each edge is explicit.
            position: "absolute",
            top: 28,
            right: 28,
            bottom: 28,
            left: 28,
            borderRadius: 26,
            border: "1px solid rgba(216,175,114,0.28)",
          }}
        />

        <div style={{ display: "flex", flex: 1, padding: "84px 96px", alignItems: "center" }}>
          {/* Left — words */}
          <div style={{ display: "flex", flexDirection: "column", flex: 1, paddingRight: 40 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 30 }}>
              <div style={{ width: 44, height: 2, background: GOLD }} />
              <div style={{ fontSize: 22, letterSpacing: 6, color: GOLD, textTransform: "uppercase" }}>
                Islamic Society
              </div>
            </div>

            <div style={{ fontFamily: "Playfair Display", fontSize: 104, lineHeight: 1, color: "#fff" }}>
              Aston ISOC
            </div>

            {/* Two fixed lines: Satori wraps span-by-span, which orphaned "for". */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                fontFamily: "Playfair Display",
                fontSize: 42,
                lineHeight: 1.25,
                color: TEXT,
                marginTop: 34,
              }}
            >
              <span>A home away from home for</span>
              <div style={{ display: "flex" }}>
                <span style={{ fontFamily: "Playfair Display Italic", color: GOLD }}>every</span>
                <span>&nbsp;Muslim student.</span>
              </div>
            </div>

          </div>

          {/* Right — the mark */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 360, height: 360 }}>
            <img src={markSrc} width={360} height={360} alt="" />
          </div>
        </div>

        {/* Footer — pinned to the frame's bottom edge rather than the text block */}
        <div
          style={{
            position: "absolute",
            left: 96,
            right: 96,
            bottom: 66,
            display: "flex",
            justifyContent: "space-between",
            fontSize: 24,
            color: MUTED,
          }}
        >
          <span>{footerLeft}</span>
          <span style={{ color: GOLD_SOFT }}>@astonisoc</span>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Playfair Display", data: playfair, style: "normal", weight: 600 },
        { name: "Playfair Display Italic", data: playfairItalic, style: "italic", weight: 500 },
        { name: "DM Sans", data: dmSans, style: "normal", weight: 500 },
      ],
    }
  );
}
