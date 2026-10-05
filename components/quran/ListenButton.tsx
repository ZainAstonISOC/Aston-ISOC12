"use client";
import { useRecitation, type Track } from "./useRecitation";

const DM = "'DM Sans', sans-serif";

/** A self-contained Listen button that fills as a short passage is recited. */
export default function ListenButton({ tracks }: { tracks: Track[] }) {
  const r = useRecitation();
  const playing = r.status === "playing" || r.status === "loading";
  return (
    <div style={{ display: "inline-flex", flexDirection: "column", alignItems: "center", gap: "0.5rem" }}>
      <button type="button" className="btn btn-gold listen-btn" onClick={() => (playing ? r.stop() : r.play(tracks))} aria-pressed={playing}>
        <span className="listen-btn__fill" aria-hidden="true" style={{ transform: `scaleX(${r.progress})` }} />
        {r.status === "loading" ? "Loading…" : playing ? "Stop" : "Listen"}
      </button>
      {r.status === "error" && (
        <span role="status" style={{ fontFamily: DM, fontSize: "0.8rem", color: "var(--muted-2)" }}>
          The recitation couldn&apos;t load. Check your connection.
        </span>
      )}
    </div>
  );
}
