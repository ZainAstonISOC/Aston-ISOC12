"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

export interface SearchEntry {
  title: string;
  href: string;
  kind: string;
  text: string;
  external?: boolean;
}

const DM = "'DM Sans', sans-serif";
const PF = "'Playfair Display', Georgia, serif";

/** Lowercase, accents, apostrophes and hyphens dropped, so "quran" finds "Qur'an" and "yasin" finds "Ya-Sin". */
const fold = (s: string) => s.toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f'\u2019\u02bf\u02be-]/g, "");

function score(e: SearchEntry, words: string[]): number {
  const title = fold(e.title);
  const all = `${title} ${fold(e.kind)} ${fold(e.text)}`;
  let total = 0;
  for (const w of words) {
    if (!all.includes(w)) return 0;
    total += title.startsWith(w) ? 4 : title.includes(w) ? 2 : 1;
  }
  return total + (e.kind === "Page" ? 1 : 0);
}

export default function SiteSearch({ entries }: { entries: SearchEntry[] }) {
  const [q, setQ] = useState("");

  // Supports links like /search?q=zakat. Read after mount so the page can stay static.
  useEffect(() => {
    const initial = new URLSearchParams(window.location.search).get("q");
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (initial) setQ(initial);
  }, []);

  const results = useMemo(() => {
    const words = fold(q).split(/\s+/).filter(Boolean);
    if (!words.length) return [];
    return entries
      .map(e => ({ e, s: score(e, words) }))
      .filter(r => r.s > 0)
      .sort((a, b) => b.s - a.s)
      .slice(0, 30)
      .map(r => r.e);
  }, [q, entries]);

  return (
    <div style={{ maxWidth: 760 }}>
      <label htmlFor="site-search" className="sr-only">Search the site</label>
      <input
        id="site-search"
        type="search"
        value={q}
        onChange={e => setQ(e.target.value)}
        placeholder="Try “jumuah”, “zakat”, “Yasin” or a committee name"
        autoFocus
        autoComplete="off"
        style={{ width: "100%", fontSize: "1.05rem", padding: "0.9rem 1.2rem" }}
      />
      <p role="status" style={{ fontFamily: DM, fontSize: "0.8rem", color: "var(--muted-2)", margin: "0.75rem 0 1.25rem" }}>
        {q.trim() ? `${results.length === 30 ? "30+" : results.length} result${results.length === 1 ? "" : "s"}` : ""}
      </p>
      <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        {results.map(r => {
          const body = (
            <>
              <span style={{ fontFamily: DM, fontSize: "0.68rem", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--gold)" }}>{r.kind}</span>
              <span style={{ display: "block", fontFamily: PF, color: "#fff", fontSize: "1.05rem", marginTop: "0.15rem" }}>{r.title}</span>
            </>
          );
          return (
            <li key={`${r.kind}:${r.href}:${r.title}`}>
              {r.external
                ? <a href={r.href} target="_blank" rel="noopener noreferrer" className="card link" style={{ display: "block", padding: "0.85rem 1.1rem" }}>{body}</a>
                : <Link href={r.href} className="card link" style={{ display: "block", padding: "0.85rem 1.1rem" }}>{body}</Link>}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
