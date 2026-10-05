"use client";
import Link from "next/link";
import { useMemo, useState } from "react";
import { quranFont } from "@/lib/quran/font";
import { useLastRead } from "./prefs";

export interface SurahSummary {
  id: number;
  name: string;
  arabic: string;
  meaning: string;
  verses: number;
  place: string;
}

const DM = "'DM Sans', sans-serif";

/** Folds "Al-Baqarah" / "al baqara" / "Baqarah" together for search. */
function fold(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "")
    .replace(/^(al|an|ar|as|at|ad|adh|az|ash)/, "");
}

export default function SurahIndex({ surahs }: { surahs: SurahSummary[] }) {
  const [q, setQ] = useState("");
  const last = useLastRead();
  const shown = useMemo(() => {
    const t = q.trim();
    if (!t) return surahs;
    if (/^\d+$/.test(t)) return surahs.filter((s) => String(s.id).startsWith(t));
    const f = fold(t);
    return surahs.filter((s) => fold(s.name).includes(f) || s.meaning.toLowerCase().includes(t.toLowerCase()));
  }, [q, surahs]);

  return (
    <div>
      {last && (
        <Link href={`/quran/${last.surah}#ayah-${last.ayah}`} className="card" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1rem", marginBottom: "1.5rem", textDecoration: "none", flexWrap: "wrap" }}>
          <span style={{ fontFamily: DM }}>
            <span className="eyebrow" style={{ display: "block", marginBottom: "0.2rem" }}>Continue reading</span>
            <span style={{ color: "var(--text)", fontWeight: 600 }}>Surah {last.name}</span>
            <span style={{ color: "var(--muted-2)" }}> · ayah {last.ayah}</span>
          </span>
          <span className="btn btn-outline-gold" style={{ fontSize: "0.8rem", padding: "0.6rem 1.1rem" }}>Carry on</span>
        </Link>
      )}

      <label htmlFor="surah-search" className="sr-only">Search surahs</label>
      <input
        id="surah-search"
        type="search"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search by name, meaning or number"
        autoComplete="off"
        style={{ width: "100%", minHeight: 52, padding: "0 1.1rem", marginBottom: "1.5rem", borderRadius: "var(--radius)", border: "1px solid var(--line)", background: "var(--surface)", color: "var(--text)", fontFamily: DM, fontSize: "1rem" }}
      />

      {shown.length === 0 ? (
        <p style={{ fontFamily: DM, color: "var(--muted-2)" }}>No surah matches &ldquo;{q}&rdquo;.</p>
      ) : (
        <ul className="surah-grid" style={{ listStyle: "none", padding: 0 }}>
          {shown.map((s) => (
            <li key={s.id}>
              <Link href={`/quran/${s.id}`} className="surah-card">
                <span className="surah-card__num"><span>{s.id}</span></span>
                <span style={{ fontFamily: DM, minWidth: 0 }}>
                  <span style={{ display: "block", fontWeight: 600 }}>{s.name}</span>
                  <span style={{ display: "block", fontSize: "0.8rem", color: "var(--muted-2)" }}>
                    {s.meaning} · {s.verses} ayat · {s.place}
                  </span>
                </span>
                <span lang="ar" dir="rtl" className={`surah-card__ar ${quranFont.className}`}>{s.arabic}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
