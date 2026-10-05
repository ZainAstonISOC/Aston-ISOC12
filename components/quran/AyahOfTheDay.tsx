import Link from "next/link";
import AyahText from "./AyahText";
import { todaysAyah } from "@/lib/ayah";
import { formatRef, londonDate } from "@/lib/quran/format";

const DM = "'DM Sans', sans-serif";

/** Homepage teaser for /ayah. Rendered on the server with the page's hourly revalidate. */
export default function AyahOfTheDay() {
  const { ayah } = todaysAyah(londonDate());
  return (
    <div className="ayah-card" style={{ maxWidth: 860, margin: "0 auto" }}>
      <AyahText verses={ayah.verses} size="clamp(1.4rem, 3.6vw, 2.1rem)" />
      <p className="ayah-translation" style={{ textAlign: "center", marginTop: "1.2rem" }}>
        {ayah.verses.map((v) => v.en).join(" ")}
      </p>
      <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "center", gap: "1rem", marginTop: "1.4rem" }}>
        <p style={{ fontFamily: DM, fontSize: "0.82rem", color: "var(--muted-2)" }}>
          <span style={{ color: "var(--gold)", fontWeight: 600 }}>{formatRef(ayah.ref)}</span> · Surah {ayah.surah}
        </p>
        <Link href="/ayah" className="btn btn-outline-gold" style={{ fontSize: "0.82rem", padding: "0.7rem 1.3rem" }}>
          Listen to today&apos;s ayah
        </Link>
      </div>
    </div>
  );
}
