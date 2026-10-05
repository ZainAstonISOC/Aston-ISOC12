"use client";

const DM = "'DM Sans', sans-serif";
const PF = "'Playfair Display', Georgia, serif";

export default function QuranError({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="container" style={{ paddingTop: "clamp(7rem, 13vw, 9.5rem)", paddingBottom: "6rem", maxWidth: 640 }}>
      <h1 style={{ fontFamily: PF, fontSize: "clamp(1.8rem,4vw,2.4rem)" }}>The Qur&apos;an text couldn&apos;t load</h1>
      <p style={{ fontFamily: DM, color: "var(--muted)", marginTop: "1rem", lineHeight: 1.7 }}>
        The text comes from quran.com and didn&apos;t arrive this time. It is usually back within a minute.
      </p>
      <div style={{ display: "flex", gap: "0.75rem", marginTop: "1.5rem", flexWrap: "wrap" }}>
        <button type="button" className="btn btn-gold" onClick={reset}>Try again</button>
        <a href="https://quran.com" className="btn btn-ghost" target="_blank" rel="noopener noreferrer">Open quran.com</a>
      </div>
    </div>
  );
}
