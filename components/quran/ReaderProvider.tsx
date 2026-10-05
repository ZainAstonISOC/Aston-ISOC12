"use client";
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { useRecitation, type Track } from "./useRecitation";
import { LAST_READ_KEY, usePref, writePref } from "./prefs";
import TafsirDrawer from "./TafsirDrawer";

export const RECITER_OPTIONS = [
  { key: "alafasy", name: "Mishari al-Afasy" },
  { key: "husary", name: "Mahmoud al-Husary" },
  { key: "sudais", name: "Abdur-Rahman as-Sudais" },
  { key: "abdulbaset", name: "AbdulBaset AbdulSamad" },
] as const;
type Reciter = (typeof RECITER_OPTIONS)[number]["key"];
const RECITER_KEYS = RECITER_OPTIONS.map((r) => r.key);

export const TRANSLATION_OPTIONS = [
  { key: "sahih", name: "Saheeh International" },
  { key: "haleem", name: "Abdel Haleem" },
  { key: "both", name: "Both" },
  { key: "none", name: "Arabic only" },
] as const;
type Translation = (typeof TRANSLATION_OPTIONS)[number]["key"];
const TRANSLATION_KEYS = TRANSLATION_OPTIONS.map((t) => t.key);

interface ReaderContext {
  surah: number;
  surahName: string;
  current: string | null;
  status: ReturnType<typeof useRecitation>["status"];
  playFrom: (key: string) => void;
  stop: () => void;
  openTafsir: (key: string) => void;
}

const Ctx = createContext<ReaderContext | null>(null);

export function useReader() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useReader outside ReaderProvider");
  return ctx;
}

/**
 * Wraps a server-rendered surah. Owns playback (one queue for the page), the
 * reciter and translation choices, the tafsir panel and "last read". Verses
 * themselves stay server-rendered; this only toggles attributes on them.
 */
export default function ReaderProvider({
  surah,
  surahName,
  verseKeys,
  defaultAudio,
  children,
}: {
  surah: number;
  surahName: string;
  verseKeys: string[];
  defaultAudio: string[];
  children: ReactNode;
}) {
  const recitation = useRecitation();
  const { play, stop, current, status } = recitation;
  const [reciter, setReciter] = usePref<Reciter>("isoc-quran-reciter", "alafasy", RECITER_KEYS);
  const [translation, setTranslation] = usePref<Translation>("isoc-quran-translation", "sahih", TRANSLATION_KEYS);
  const [tafsirKey, setTafsirKey] = useState<string | null>(null);
  const [audioError, setAudioError] = useState(false);
  const audioLists = useRef(new Map<string, string[]>([["alafasy", defaultAudio]]));

  const tracksFor = useCallback(
    async (r: Reciter): Promise<string[]> => {
      const hit = audioLists.current.get(r);
      if (hit) return hit;
      const res = await fetch(`/api/quran/audio/${r}/${surah}`);
      if (!res.ok) throw new Error(String(res.status));
      const files = (await res.json()) as { verse_key: string; url: string }[];
      const byKey = new Map(files.map((f) => [f.verse_key, f.url]));
      const list = verseKeys.map((k) => byKey.get(k) ?? "");
      audioLists.current.set(r, list);
      return list;
    },
    [surah, verseKeys],
  );

  const playFrom = useCallback(
    (key: string) => {
      setAudioError(false);
      const start = Math.max(0, verseKeys.indexOf(key));
      const build = (urls: string[]): Track[] =>
        verseKeys.slice(start).map((k, i) => ({ key: k, url: urls[start + i] })).filter((t) => t.url);
      const cached = audioLists.current.get(reciter);
      // Start synchronously when the list is already here, so the tap that
      // asked for audio is still the one that starts it (iOS requires that).
      if (cached) {
        play(build(cached));
        return;
      }
      tracksFor(reciter)
        .then((urls) => play(build(urls)))
        .catch(() => setAudioError(true));
    },
    [play, reciter, tracksFor, verseKeys],
  );

  // Fetch a chosen reciter's file list ahead of the tap, so playback can
  // start inside the tap itself.
  useEffect(() => {
    tracksFor(reciter).catch(() => {});
  }, [reciter, tracksFor]);

  // Changing reciter mid-recitation would mix voices; stop instead.
  const chooseReciter = (r: Reciter) => {
    stop();
    setReciter(r);
  };

  // Highlight and follow the ayah being recited.
  useEffect(() => {
    document.querySelectorAll(".verse[data-playing]").forEach((el) => el.removeAttribute("data-playing"));
    if (!current) return;
    const el = document.getElementById(`ayah-${current.split(":")[1]}`);
    if (!el) return;
    el.setAttribute("data-playing", "");
    const r = el.getBoundingClientRect();
    if (r.top < 90 || r.bottom > window.innerHeight - 90) {
      const smooth = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      el.scrollIntoView({ block: "center", behavior: smooth ? "smooth" : "instant" });
    }
  }, [current]);

  // Remember the ayah the reader reached, for "Continue reading" on /quran.
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined;
    const io = new IntersectionObserver(
      (entries) => {
        const hit = entries.find((e) => e.isIntersecting);
        if (!hit) return;
        const ayah = Number((hit.target as HTMLElement).dataset.ayah);
        clearTimeout(timer);
        timer = setTimeout(() => writePref(LAST_READ_KEY, JSON.stringify({ surah, ayah, name: surahName })), 800);
      },
      { rootMargin: "-25% 0px -65% 0px" },
    );
    document.querySelectorAll<HTMLElement>(".verse[data-ayah]").forEach((el) => io.observe(el));
    return () => {
      clearTimeout(timer);
      io.disconnect();
    };
  }, [surah, surahName]);

  const ctx = useMemo<ReaderContext>(
    () => ({ surah, surahName, current, status, playFrom, stop, openTafsir: setTafsirKey }),
    [surah, surahName, current, status, playFrom, stop],
  );

  const playing = status === "playing" || status === "loading";

  return (
    <Ctx.Provider value={ctx}>
      <div className="reader-toolbar">
        <button
          type="button"
          className="btn btn-gold"
          onClick={() => (playing ? stop() : playFrom(verseKeys[0]))}
          style={{ padding: "0.7rem 1.3rem", fontSize: "0.85rem" }}
        >
          {playing ? "Stop" : "Play surah"}
        </button>
        <label className="reader-select">
          <span>Translation</span>
          <select value={translation} onChange={(e) => setTranslation(e.target.value as Translation)}>
            {TRANSLATION_OPTIONS.map((t) => (
              <option key={t.key} value={t.key}>{t.name}</option>
            ))}
          </select>
        </label>
        <label className="reader-select">
          <span>Reciter</span>
          <select value={reciter} onChange={(e) => chooseReciter(e.target.value as Reciter)}>
            {RECITER_OPTIONS.map((r) => (
              <option key={r.key} value={r.key}>{r.name}</option>
            ))}
          </select>
        </label>
      </div>

      <div className="reader" data-translation={translation}>
        {children}
      </div>

      {(playing || status === "error" || audioError) && (
        <div className="now-playing" role="status">
          {playing ? (
            <>
              <span>
                {status === "loading" ? "Loading" : "Playing"} {surahName} · ayah {current?.split(":")[1]}
              </span>
              <button type="button" className="btn btn-ghost" onClick={stop}>Stop</button>
            </>
          ) : (
            <>
              <span>The recitation couldn&apos;t load. Check your connection and try again.</span>
              <button type="button" className="btn btn-ghost" onClick={() => { stop(); setAudioError(false); }}>
                Dismiss
              </button>
            </>
          )}
        </div>
      )}

      <TafsirDrawer verseKey={tafsirKey} onClose={() => setTafsirKey(null)} />
    </Ctx.Provider>
  );
}
