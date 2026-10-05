"use client";
import { useEffect, useRef, useState } from "react";

const DM = "'DM Sans', sans-serif";
const PF = "'Playfair Display', Georgia, serif";

type State =
  | { kind: "loading" }
  | { kind: "ready"; html: string; verseKeys: string[] }
  | { kind: "error" };

/**
 * Ibn Kathir (abridged) for one ayah, in a modal panel. The HTML comes from
 * /api/quran/tafsir, which strips it to plain text tags before it gets here.
 */
export default function TafsirDrawer({ verseKey, onClose }: { verseKey: string | null; onClose: () => void }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  // Loaded passages for render; the ref mirrors the keys so the fetch effect
  // can skip work without depending on (and re-running for) the state.
  const [loaded, setLoaded] = useState<Record<string, { html: string; verseKeys: string[] }>>({});
  const loadedKeys = useRef(new Set<string>());
  const [failed, setFailed] = useState<string | null>(null);

  useEffect(() => {
    const d = dialogRef.current;
    if (!d) return;
    if (verseKey && !d.open) d.showModal();
    if (!verseKey && d.open) d.close();
  }, [verseKey]);

  useEffect(() => {
    if (!verseKey) return;
    if (loadedKeys.current.has(verseKey)) return;
    const ctrl = new AbortController();
    const [s, a] = verseKey.split(":");
    fetch(`/api/quran/tafsir/${s}/${a}`, { signal: ctrl.signal })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
      .then((body: { html: string; verseKeys: string[] }) => {
        loadedKeys.current.add(verseKey);
        setLoaded((prev) => ({ ...prev, [verseKey]: body }));
      })
      .catch((err: Error) => {
        if (err.name !== "AbortError") setFailed(verseKey);
      });
    return () => ctrl.abort();
  }, [verseKey]);

  const hit = verseKey ? loaded[verseKey] : undefined;
  const state: State = hit ? { kind: "ready", ...hit } : failed === verseKey ? { kind: "error" } : { kind: "loading" };

  // Forget a failure on close, so reopening the same ayah retries cleanly.
  const close = () => {
    setFailed(null);
    onClose();
  };

  const covers =
    state.kind === "ready" && state.verseKeys.length > 1
      ? `${state.verseKeys[0]}–${state.verseKeys[state.verseKeys.length - 1].split(":")[1]}`
      : verseKey;

  return (
    <dialog
      ref={dialogRef}
      className="tafsir-drawer"
      onClose={close}
      onClick={(e) => {
        if (e.target === e.currentTarget) close();
      }}
      aria-labelledby="tafsir-title"
    >
      <div className="tafsir-drawer__inner">
        <header className="tafsir-drawer__head">
          <div>
            <p className="eyebrow" style={{ marginBottom: "0.2rem" }}>Tafsir Ibn Kathir (abridged)</p>
            <h2 id="tafsir-title" style={{ fontFamily: PF, fontSize: "1.4rem" }}>Qur&apos;an {covers}</h2>
          </div>
          <button type="button" className="btn btn-ghost" onClick={close} aria-label="Close tafsir">
            Close
          </button>
        </header>
        <div className="tafsir-body" style={{ fontFamily: DM }}>
          {state.kind === "loading" && <p style={{ color: "var(--muted-2)" }}>Loading tafsir…</p>}
          {state.kind === "error" && (
            <p style={{ color: "var(--muted-2)" }}>The tafsir couldn&apos;t load. Check your connection and try again.</p>
          )}
          {state.kind === "ready" && <div dangerouslySetInnerHTML={{ __html: state.html }} />}
        </div>
        <p style={{ fontFamily: DM, fontSize: "0.76rem", color: "var(--muted-2)", marginTop: "1.5rem" }}>
          From quran.com. Ibn Kathir often explains several ayat together, so a passage may cover the ayat around this one.
        </p>
      </div>
    </dialog>
  );
}
