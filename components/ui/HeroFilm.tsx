"use client";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";

// The homepage film: the society's own site on a phone, rendered from film/
// (see film/README.md). Silent, so it never needs a user gesture to play.
//
// Playback is started from script rather than the autoplay attribute, so the
// poster is all that loads for visitors who asked for reduced motion or less
// data, and for anyone without JavaScript.
const REDUCE = "(prefers-reduced-motion: reduce)";
const POSTER = "/hero/isoc-film-poster.webp";
function subscribe(onChange: () => void) {
  const mq = window.matchMedia(REDUCE);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}
function motionAllowed() {
  const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;
  return !window.matchMedia(REDUCE).matches && !saveData;
}

/*
 * ONE video element for the whole visit.
 * Leaving the homepage unmounts this component; coming back used to build a
 * brand-new <video> that had to load, restart the film and get Safari to set
 * up drawing again, and Safari often showed an empty or frozen box for a long
 * while. Instead the element is made once, kept (paused) while the visitor is
 * elsewhere, and put back where it left off. React never renders it, so it
 * never tries to remove or replace it.
 */
let film: HTMLVideoElement | null = null;
let pausedByVisitor = false;

function filmVideo(): HTMLVideoElement {
  if (film) return film;
  const v = document.createElement("video");
  v.className = "hero-film__video";
  v.poster = POSTER;
  v.muted = true;
  v.defaultMuted = true;
  v.loop = true;
  v.playsInline = true;
  v.preload = "none";
  v.tabIndex = -1;
  v.width = 1080;
  v.height = 1350;
  for (const name of ["muted", "playsinline", "disablepictureinpicture", "disableremoteplayback"]) v.setAttribute(name, "");
  v.setAttribute("aria-hidden", "true");
  for (const [src, media] of [["/hero/isoc-film-720.mp4", "(max-width: 767px)"], ["/hero/isoc-film-1080.mp4", ""]]) {
    const s = document.createElement("source");
    s.src = src;
    s.type = "video/mp4";
    if (media) s.media = media;
    v.appendChild(s);
  }
  return (film = v);
}

export default function HeroFilm() {
  const stage = useRef<HTMLDivElement>(null);
  // False on the server and for visitors who asked for less motion or data.
  const canPlay = useSyncExternalStore(subscribe, motionAllowed, () => false);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const host = stage.current;
    if (!host || !canPlay) return;
    const v = filmVideo();
    host.appendChild(v);

    // iOS Low Power Mode (and some data savers) refuse autoplay without saying
    // so; the poster just sits there. Try again on the visitor's first touch.
    const retry = () => { if (!pausedByVisitor && v.paused) v.play().catch(() => {}); };
    const gestures = ["pointerdown", "touchend", "keydown"] as const;
    const armRetry = () => gestures.forEach(g => window.addEventListener(g, retry, { once: true, passive: true }));
    const play = () => { if (!pausedByVisitor) v.play().catch(armRetry); };
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    v.addEventListener("play", onPlay);
    v.addEventListener("pause", onPause);

    // Only decode while it is on screen.
    let inView = typeof IntersectionObserver === "undefined";
    let observer: IntersectionObserver | undefined;
    if (inView) play();
    else {
      observer = new IntersectionObserver(([e]) => {
        inView = e.isIntersecting;
        if (inView) play(); else v.pause();
      }, { threshold: 0.15 });
      observer.observe(v);
    }

    // Self-healing. Safari pauses or starves media on its own (many tabs,
    // other media playing, power), and a stalled first download leaves the
    // poster frozen. While the film is on screen and the visitor hasn't
    // paused it, keep it playing.
    let stalledTicks = 0;
    const heal = () => {
      if (!inView || pausedByVisitor || document.visibilityState !== "visible") { stalledTicks = 0; return; }
      if (v.paused) { play(); return; }
      stalledTicks = v.readyState < 3 ? stalledTicks + 1 : 0;
      if (stalledTicks >= 2) { stalledTicks = 0; v.load(); play(); }
    };
    const watchdog = window.setInterval(heal, 2000);
    document.addEventListener("visibilitychange", heal);

    return () => {
      observer?.disconnect();
      window.clearInterval(watchdog);
      document.removeEventListener("visibilitychange", heal);
      gestures.forEach(g => window.removeEventListener(g, retry));
      v.removeEventListener("play", onPlay);
      v.removeEventListener("pause", onPause);
      // Kept, not destroyed: paused and taken out of the page until Home is shown again.
      v.pause();
      v.remove();
    };
  }, [canPlay]);

  const toggle = () => {
    const v = film;
    if (!v) return;
    if (v.paused) { pausedByVisitor = false; v.play().catch(() => {}); }
    else { pausedByVisitor = true; v.pause(); }
  };

  return (
    <div className="hero-film">
      <div ref={stage} className="hero-film__stage">
        {/* The film's first frame, always underneath the video: what shows
            before it plays, without JavaScript, for reduced motion, and if a
            browser is ever slow to draw the video itself. */}
        {/* eslint-disable-next-line @next/next/no-img-element -- must be the exact poster pixels, unresized */}
        <img src={POSTER} alt="" aria-hidden="true" className="hero-film__video" width={1080} height={1350} fetchPriority="high" />
      </div>
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
