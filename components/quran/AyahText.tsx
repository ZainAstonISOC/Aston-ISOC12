import { quranFont } from "@/lib/quran/font";
import { arabicNumber } from "@/lib/quran/format";

/**
 * Uthmani text with the ayah-end mark (U+06DD) after each verse. Amiri Quran
 * draws the mark around the Arabic-Indic number that follows it.
 */
export default function AyahText({
  verses,
  size = "clamp(1.7rem, 4.5vw, 2.6rem)",
  align = "center",
}: {
  verses: { key: string; ar: string }[];
  size?: string;
  align?: "center" | "right";
}) {
  return (
    <p
      lang="ar"
      dir="rtl"
      className={`quran-ar ${quranFont.className}`}
      style={{ fontSize: size, textAlign: align }}
    >
      {verses.map((v, i) => (
        <span key={v.key}>
          {v.ar}
          <span className="ayah-mark" aria-label={`ayah ${v.key.split(":")[1]}`}>
            {"۝"}
            {arabicNumber(Number(v.key.split(":")[1]))}
          </span>
          {i < verses.length - 1 ? " " : ""}
        </span>
      ))}
    </p>
  );
}
