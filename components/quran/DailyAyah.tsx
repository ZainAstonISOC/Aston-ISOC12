"use client";
import { useEffect, useState } from "react";
import AyahText from "./AyahText";
import { useRecitation } from "./useRecitation";
import { dailyIndex, formatRef, londonDate } from "@/lib/quran/format";
import type { Ayah } from "@/lib/ayah";

const DM = "'DM Sans', sans-serif";

/**
 * The Daily Ayah card. The server picks today's ayah; the browser re-picks on
 * load, because this page can be served from the offline cache days later.
 */
export default function DailyAyah({
  ayat,
  initialIndex,
  serverDate,
}: {
  ayat: Ayah[];
  initialIndex: number;
  serverDate: string;
}) {
  const [today, setToday] = useState(initialIndex);
  const [index, setIndex] = useState(initialIndex);
  const [shared, setShared] = useState<string | null>(null);
  const recitation = useRecitation();
  const { stop } = recitation;
  const ayah = ayat[index];

  useEffect(() => {
    const date = londonDate();
    if (date === serverDate) return;
    const i = dailyIndex(date, ayat.length);
    // Correcting a cached page to the visitor's actual day is the point here.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setToday(i);
    setIndex(i);
  }, [ayat.length, serverDate]);

  useEffect(() => {
    // Only in production: a service worker in dev would cache hot-reload chunks.
    if (process.env.NODE_ENV !== "production" || !("serviceWorker" in navigator)) return;
    navigator.serviceWorker
      .register("/sw.js", { scope: "/ayah", updateViaCache: "none" })
      .then(() => navigator.serviceWorker.ready)
      .then((reg) => {
        // Files this page already loaded before the worker existed — hand the
        // list over so the first visit is enough to work offline.
        const urls = performance
          .getEntriesByType("resource")
          .map((e) => e.name)
          .filter((u) => u.startsWith(location.origin));
        reg.active?.postMessage({ type: "precache", urls: [location.pathname, ...urls] });
      })
      .catch(() => {});
  }, []);

  const pick = (i: number) => {
    stop();
    setShared(null);
    setIndex(i);
  };

  const another = () => {
    if (ayat.length < 2) return;
    let i = index;
    while (i === index) i = Math.floor(Math.random() * ayat.length);
    pick(i);
  };

  const share = async () => {
    const text = `${ayah.verses.map((v) => v.en).join(" ")}\n${formatRef(ayah.ref)} · Surah ${ayah.surah}`;
    const url = `${location.origin}/ayah`;
    try {
      if (navigator.share) {
        await navigator.share({ title: "Daily Ayah · Aston ISOC", text, url });
        return;
      }
      await navigator.clipboard.writeText(`${text}\n${url}`);
      setShared("Copied to clipboard");
    } catch {
      // Share sheet dismissed — nothing to report.
    }
  };

  const playing = recitation.status === "playing" || recitation.status === "loading";
  const tracks = ayah.verses.map((v) => ({ key: v.key, url: v.audio }));

  return (
    <div>
      <article className="ayah-card" aria-live="polite">
        <AyahText verses={ayah.verses} />
        <div style={{ marginTop: "1.6rem", textAlign: "center" }}>
          <p className="ayah-translation">
            {ayah.verses.map((v) => v.en).join(" ")}
          </p>
          <p style={{ fontFamily: DM, fontSize: "0.82rem", marginTop: "1.1rem", color: "var(--muted-2)" }}>
            <span style={{ color: "var(--gold)", fontWeight: 600 }}>{formatRef(ayah.ref)}</span>
            {" · "}Surah {ayah.surah}
            {index !== today && <span> · not today&apos;s</span>}
          </p>
        </div>
      </article>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem", justifyContent: "center", marginTop: "1.5rem" }}>
        <button
          type="button"
          className="btn btn-gold listen-btn"
          onClick={() => (playing ? recitation.stop() : recitation.play(tracks))}
          aria-pressed={playing}
        >
          <span
            className="listen-btn__fill"
            aria-hidden="true"
            style={{ transform: `scaleX(${recitation.progress})` }}
          />
          {playing ? <StopIcon /> : <PlayIcon />}
          {recitation.status === "loading" ? "Loading…" : playing ? "Stop" : "Listen"}
        </button>
        <button type="button" className="btn btn-ghost" onClick={another}>
          Show me another
        </button>
        {index !== today && (
          <button type="button" className="btn btn-ghost" onClick={() => pick(today)}>
            Back to today
          </button>
        )}
        <button type="button" className="btn btn-ghost" onClick={share}>
          Share
        </button>
      </div>

      <p
        role="status"
        style={{ fontFamily: DM, fontSize: "0.82rem", color: "var(--muted-2)", textAlign: "center", marginTop: "0.9rem", minHeight: "1.3em" }}
      >
        {recitation.status === "error"
          ? "The recitation couldn't load. It needs a connection the first time you play it."
          : shared}
      </p>
    </div>
  );
}

function PlayIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M8 5.5v13a1 1 0 0 0 1.5.86l10.5-6.5a1 1 0 0 0 0-1.72L9.5 4.64A1 1 0 0 0 8 5.5Z" />
    </svg>
  );
}

function StopIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <rect x="6.5" y="6.5" width="11" height="11" rx="1.5" />
    </svg>
  );
}
