import { Amiri_Quran } from "next/font/google";

/**
 * Amiri Quran (SIL Open Font License) — drawn for Uthmani script, including
 * the ayah-end mark. Self-hosted by next/font at build time, so it is served
 * from our own origin and the Daily Ayah service worker can keep it offline.
 */
export const quranFont = Amiri_Quran({
  weight: "400",
  subsets: ["arabic"],
  display: "swap",
});
