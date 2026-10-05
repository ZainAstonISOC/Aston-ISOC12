"use client";
import { useState } from "react";
import { useReader } from "./ReaderProvider";

/** Play-from-here, tafsir and share for one ayah of the surah reader. */
export default function VerseActions({ verseKey }: { verseKey: string }) {
  const { current, status, playFrom, stop, openTafsir, surahName } = useReader();
  const [copied, setCopied] = useState(false);
  const isCurrent = current === verseKey && (status === "playing" || status === "loading");
  const [s, a] = verseKey.split(":");

  const share = async (e: React.MouseEvent<HTMLButtonElement>) => {
    const url = `${location.origin}/quran/${s}/${a}`;
    // Read the translation from the page rather than shipping a second copy
    // of every ayah's text to the browser as a prop.
    const text = e.currentTarget.closest(".verse")?.querySelector(".verse-tr--sahih")?.lastChild?.textContent ?? "";
    try {
      if (navigator.share) {
        await navigator.share({ title: `${surahName} ${verseKey}`, text: `${text}\nQur’an ${verseKey}`, url });
        return;
      }
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Share sheet dismissed.
    }
  };

  return (
    <div className="verse-actions">
      <span className="verse-num" aria-hidden="true">{verseKey}</span>
      <button
        type="button"
        className="verse-btn"
        onClick={() => (isCurrent ? stop() : playFrom(verseKey))}
        aria-label={isCurrent ? `Stop recitation` : `Play from ayah ${a}`}
      >
        {isCurrent ? (
          <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><rect x="6.5" y="6.5" width="11" height="11" rx="1.5" /></svg>
        ) : (
          <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5.5v13a1 1 0 0 0 1.5.86l10.5-6.5a1 1 0 0 0 0-1.72L9.5 4.64A1 1 0 0 0 8 5.5Z" /></svg>
        )}
      </button>
      <button type="button" className="verse-btn verse-btn--text" onClick={() => openTafsir(verseKey)}>
        Tafsir
      </button>
      <button type="button" className="verse-btn" onClick={share} aria-label={`Share ayah ${verseKey}`}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M12 15V3M7.5 7.5 12 3l4.5 4.5" />
          <path d="M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-7" />
        </svg>
      </button>
      {copied && <span className="verse-copied" role="status">Link copied</span>}
    </div>
  );
}
