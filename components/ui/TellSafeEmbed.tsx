"use client";
import { useEffect, useRef, useState } from "react";
import { TELLSAFE } from "@/lib/social";

const DM = "'DM Sans', sans-serif";
const PF = "'Playfair Display', Georgia, serif";

/**
 * Embeds the TellSafe form inline. The iframe is only requested once the user
 * scrolls near it, so it never costs anything on first paint. If TellSafe is
 * slow or refuses to frame, we swap in a plain link rather than leaving a
 * blank rectangle.
 */
export default function TellSafeEmbed() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const [state, setState] = useState<"idle" | "ready" | "failed">("idle");

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.unobserve(el);
        }
      },
      { rootMargin: "300px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Cross-origin frames give us no error event, so treat "never loaded" as failed.
  useEffect(() => {
    if (!inView || state !== "idle") return;
    const timer = setTimeout(() => setState(s => (s === "idle" ? "failed" : s)), 12000);
    return () => clearTimeout(timer);
  }, [inView, state]);

  return (
    <div ref={wrapRef}>
      <div
        style={{
          position: "relative",
          borderRadius: "var(--radius)",
          border: "1px solid var(--line)",
          background: "linear-gradient(160deg, rgba(31,21,71,0.55), rgba(19,13,40,0.35))",
          overflow: "hidden",
          boxShadow: "var(--shadow)",
        }}
      >
        {/* Chrome bar so the embed reads as part of the page, not a bolted-on widget */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "1rem",
            flexWrap: "wrap",
            padding: "0.9rem 1.25rem",
            borderBottom: "1px solid var(--line-soft)",
            background: "rgba(255,255,255,0.02)",
          }}
        >
          <span
            style={{
              fontFamily: DM,
              fontSize: "0.72rem",
              fontWeight: 600,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "var(--muted-2)",
            }}
          >
            Secure form · TellSafe
          </span>
          <a
            href={TELLSAFE.url}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontFamily: DM,
              fontSize: "0.76rem",
              fontWeight: 600,
              color: "var(--gold)",
            }}
          >
            Open in a new tab ↗
          </a>
        </div>

        {state !== "failed" && (
          <div style={{ position: "relative" }}>
            {inView ? (
              <iframe
                src={TELLSAFE.url}
                title="Share feedback with Aston ISOC via TellSafe"
                loading="lazy"
                onLoad={() => setState("ready")}
                style={{
                  display: "block",
                  width: "100%",
                  height: "clamp(560px, 78vh, 820px)",
                  border: 0,
                  background: "transparent",
                }}
              />
            ) : (
              <div style={{ height: "clamp(560px, 78vh, 820px)" }} />
            )}

            {state === "idle" && (
              <div
                aria-hidden="true"
                style={{
                  position: "absolute",
                  inset: 0,
                  display: "grid",
                  placeItems: "center",
                  background: "rgba(19,13,40,0.6)",
                  pointerEvents: "none",
                }}
              >
                <p style={{ fontFamily: DM, fontSize: "0.85rem", color: "var(--muted-2)" }}>
                  Loading secure form…
                </p>
              </div>
            )}
          </div>
        )}

        {state === "failed" && (
          <div style={{ padding: "clamp(2rem, 5vw, 3.25rem)", textAlign: "center" }}>
            <h3 style={{ fontFamily: PF, color: "#fff", fontSize: "1.35rem", marginBottom: "0.75rem" }}>
              The form could not load here
            </h3>
            <p
              style={{
                fontFamily: DM,
                fontSize: "0.95rem",
                color: "var(--muted)",
                maxWidth: "46ch",
                margin: "0 auto 1.75rem",
                lineHeight: 1.75,
              }}
            >
              Your browser or network blocked the embedded form. It works exactly the same on
              TellSafe directly — your submission still reaches the committee.
            </p>
            <a href={TELLSAFE.url} target="_blank" rel="noopener noreferrer" className="btn btn-gold btn-lg">
              Open TellSafe
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
