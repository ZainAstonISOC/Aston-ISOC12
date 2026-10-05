import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { SITE_URL } from "@/lib/site";

/**
 * Shared pieces for generated share cards (app/opengraph-image.tsx and
 * app/events/[id]/opengraph-image.tsx). Fonts are vendored because Satori, the
 * renderer behind next/og, cannot use the Google Fonts stylesheet.
 */

export const OG_SIZE = { width: 1200, height: 630 };

export const OG_COLORS = {
  bg: "#130d28",
  bg3: "#1f1547",
  gold: "#d8af72",
  goldSoft: "#ecd3a6",
  text: "#f5f2ea",
  muted: "#b7b0c9",
};

export async function loadOgAssets() {
  const [playfair, playfairItalic, dmSans, mark] = await Promise.all([
    readFile(join(process.cwd(), "assets/fonts/PlayfairDisplay-SemiBold.ttf")),
    readFile(join(process.cwd(), "assets/fonts/PlayfairDisplay-MediumItalic.ttf")),
    readFile(join(process.cwd(), "assets/fonts/DMSans-Medium.ttf")),
    readFile(join(process.cwd(), "public/isoc-mark.png")),
  ]);
  return {
    markSrc: `data:image/png;base64,${mark.toString("base64")}`,
    fonts: [
      { name: "Playfair Display", data: playfair, style: "normal" as const, weight: 600 as const },
      { name: "Playfair Display Italic", data: playfairItalic, style: "italic" as const, weight: 500 as const },
      { name: "DM Sans", data: dmSans, style: "normal" as const, weight: 500 as const },
    ],
  };
}

/** The domain once the site is served from one; never the vercel.app fallback. */
export function ogFooterHost(): string | null {
  const host = new URL(SITE_URL).host;
  return host.endsWith(".vercel.app") ? null : host;
}
