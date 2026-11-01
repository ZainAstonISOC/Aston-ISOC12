"use client";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";

// The homepage film: the society's own site on a phone, rendered from film/
// (see film/README.md). Silent, so it never needs a user gesture to play.
//
// Playback is started from script rather than the autoplay attribute, so the
// poster is all that loads for visitors who asked for reduced motion or less
// data, and for anyone without JavaScript.
const REDUCE = "(prefers-reduced-motion: reduce)";
function subscribe(onChange: () => void) {
  const mq = window.matchMedia(REDUCE);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}
function motionAllowed() {
  const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;
  return !window.matchMedia(REDUCE).matches && !saveData;
}

export default function HeroFilm() {
  const video = useRef<HTMLVideoElement>(null);
  const userPaused = useRef(false);
  // False on the server and for visitors who asked for less motion or data.
  const canPlay = useSyncExternalStore(subscribe, motionAllowed, () => false);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const v = video.current;
    if (!v) return;
    if (!canPlay) { v.pause(); return; }

    v.muted = true; // React sets `muted` as a property only; be explicit before play()

    // iOS Low Power Mode (and some data savers) refuse autoplay without saying
    // so; the poster just sits there. Try again on the visitor's first touch.
    const retry = () => { if (!userPaused.current && v.paused) v.play().catch(() => {}); };
    const gestures = ["pointerdown", "touchend", "keydown"] as const;
    const armRetry = () => gestures.forEach(g => window.addEventListener(g, retry, { once: true, passive: true }));
    const play = () => { if (!userPaused.current) v.play().catch(armRetry); };
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    v.addEventListener("play", onPlay);
    v.addEventListener("pause", onPause);

    // Only decode while it is on screen.
    let observer: IntersectionObserver | undefined;
    if (typeof IntersectionObserver === "undefined") play();
    else {
      observer = new IntersectionObserver(([e]) => (e.isIntersecting ? play() : v.pause()), { threshold: 0.15 });
      observer.observe(v);
    }

    return () => {
      observer?.disconnect();
      gestures.forEach(g => window.removeEventListener(g, retry));
      v.removeEventListener("play", onPlay);
      v.removeEventListener("pause", onPause);
    };
  }, [canPlay]);

  const toggle = () => {
    const v = video.current;
    if (!v) return;
    if (v.paused) { userPaused.current = false; v.play().catch(() => {}); }
    else { userPaused.current = true; v.pause(); }
  };

  return (
    <div className="hero-film">
      <video
        ref={video}
        className="hero-film__video"
        poster="/hero/isoc-film-poster.webp"
        muted
        loop
        playsInline
        preload="none"
        disablePictureInPicture
        disableRemotePlayback
        aria-hidden="true"
        tabIndex={-1}
        width={1080}
        height={1350}
      >
        <source src="/hero/isoc-film-720.mp4" type="video/mp4" media="(max-width: 767px)" />
        <source src="/hero/isoc-film-1080.mp4" type="video/mp4" />
      </video>
      {canPlay && (
        <button type="button" className="hero-film__toggle" onClick={toggle} aria-label={playing ? "Pause the film" : "Play the film"}>
          {playing ? (
            <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><rect x="6.5" y="5" width="3.6" height="14" rx="1"/><rect x="13.9" y="5" width="3.6" height="14" rx="1"/></svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5.6v12.8a1 1 0 0 0 1.5.86l10.2-6.4a1 1 0 0 0 0-1.72L9.5 4.74A1 1 0 0 0 8 5.6Z"/></svg>
          )}
        </button>
      )}
    </div>
  );
}
