"use client";
/* eslint-disable @next/next/no-img-element -- intentional: stacked raw <img> layers power the chromatic-aberration / slice glitch effect */

/* ════════════════════════════════════════════════════════════
   Aston ISOC Intro Loading Screen
   Old emblem glitches / fractures and re-forms into the new mark.
   Deep-purple #130d28 backdrop matching the site background.
   Plays once per browser session.
   ════════════════════════════════════════════════════════════ */

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const OLD = "/loader-old.png";
const NEW = "/loader-new.png";

// Timeline (ms)
const GLITCH_START = 1550;   // calm old logo lingers → begin fracturing
const SWAP         = 2550;   // peak chaos: flash + reveal new mark
const RESOLVE      = 3550;   // glitch decays → new mark settles
const FADE_OUT     = 4450;   // whole screen begins to lift

type Logo = "old" | "new";

export default function LoadingScreen() {
  // Rendered immediately (SSR) so the loader is the FIRST thing painted -
  // it covers the page before any website content can flash through.
  const [show, setShow]               = useState(true);
  const [logo, setLogo]               = useState<Logo>("old");
  const [glitch, setGlitch]           = useState(false);
  const [flash, setFlash]             = useState(false);
  const [reduced, setReduced]         = useState(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    // Returning this session → drop the loader instantly (CSS in <head> already hid it).
    let alreadyLoaded = false;
    try { alreadyLoaded = !!sessionStorage.getItem("isoc_loaded"); } catch { /* no storage */ }
    if (alreadyLoaded) { setShow(false); return; }

    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    setReduced(!!prefersReduced);

    const push = (fn: () => void, ms: number) => timers.current.push(setTimeout(fn, ms));

    if (prefersReduced) {
      // Calm cross-fade no glitch.
      push(() => setLogo("new"), 1700);
      push(() => { setShow(false); markLoaded(); }, 3400);
    } else {
      push(() => setGlitch(true), GLITCH_START);
      push(() => { setLogo("new"); setFlash(true); }, SWAP);
      push(() => setFlash(false), SWAP + 180);
      push(() => setGlitch(false), RESOLVE);
      push(() => { setShow(false); markLoaded(); }, FADE_OUT);
    }

    return () => { timers.current.forEach(clearTimeout); timers.current = []; };
  }, []);

  const markLoaded = () => { try { sessionStorage.setItem("isoc_loaded", "1"); } catch { /* ok */ } };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <AnimatePresence>
        {show && (
          <motion.div
            key="isoc-loader"
            className="isoc-loader"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }}
          >
            {/* Ambient glow */}
            <div className="isoc-loader__glow" />

            {/* Stage */}
            <div className="isoc-stage">
              {/* OLD mark */}
              <Mark
                src={OLD}
                visible={logo === "old"}
                glitching={glitch && logo === "old" && !reduced}
              />
              {/* NEW mark */}
              <Mark
                src={NEW}
                visible={logo === "new"}
                glitching={glitch && logo === "new" && !reduced}
                settle={logo === "new" && !glitch}
              />

              {/* Scanlines + flash overlays, only during glitch */}
              {!reduced && glitch && <div className="isoc-scan" />}
              {!reduced && flash && <div className="isoc-flash" />}
            </div>

            {/* Wordmark / loading cue */}
            <motion.div
              className="isoc-cue"
              initial={{ opacity: 0 }}
              animate={{ opacity: logo === "new" && !glitch ? 1 : 0 }}
              transition={{ duration: 0.5 }}
            >
              <span>ASTON&nbsp;ISLAMIC&nbsp;SOCIETY</span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

/* ── A single logo "mark" with stacked glitch layers ── */
function Mark({
  src, visible, glitching, settle = false,
}: { src: string; visible: boolean; glitching: boolean; settle?: boolean }) {
  return (
    <div
      className={[
        "isoc-mark",
        visible ? "is-visible" : "",
        glitching ? "is-glitch" : "",
        settle ? "is-settle" : "",
      ].join(" ")}
    >
      {/* base */}
      <img src={src} alt="" className="isoc-img isoc-img--base" draggable={false} />
      {/* chromatic aberration ghost */}
      <img src={src} alt="" className="isoc-img isoc-img--ca" aria-hidden="true" draggable={false} />
      {/* fractured slices */}
      <img src={src} alt="" className="isoc-img isoc-img--s1" aria-hidden="true" draggable={false} />
      <img src={src} alt="" className="isoc-img isoc-img--s2" aria-hidden="true" draggable={false} />
    </div>
  );
}

/* ════════════════════════════════════════════════════════════ */
const CSS = `
/* Returning visitor (flagged before paint in <head>) → never show the loader */
html[data-isoc-loaded="1"] .isoc-loader{ display:none !important; }

.isoc-loader{
  position:fixed; inset:0; z-index:9999;
  background:#130d28;
  display:flex; flex-direction:column; align-items:center; justify-content:center;
  overflow:hidden;
}
.isoc-loader__glow{
  position:absolute; width:540px; height:540px; border-radius:50%;
  background:radial-gradient(circle, rgba(216,175,114,0.10) 0%, rgba(110,70,200,0.07) 42%, transparent 70%);
  pointer-events:none; filter:blur(6px);
}

.isoc-stage{
  position:relative; width:min(76vw,340px); height:min(76vw,340px);
}

.isoc-mark{
  position:absolute; inset:0;
  opacity:0; transform:scale(.94);
  transition:opacity .22s ease, transform .22s ease;
}
.isoc-mark.is-visible{ opacity:1; transform:scale(1); }

/* gentle entrance for the very first (old) paint */
@keyframes isocIn{ from{opacity:0; transform:scale(.84)} to{opacity:1; transform:scale(1)} }
.isoc-mark.is-visible:not(.is-glitch):not(.is-settle){ animation:isocIn 1.05s cubic-bezier(.16,1,.3,1) both; }

/* settle: new mark lands with a soft bloom */
.isoc-mark.is-settle .isoc-img--base{ animation:isocSettle 1.2s cubic-bezier(.16,1,.3,1) both; }
@keyframes isocSettle{
  0%{ transform:scale(1.05); filter:drop-shadow(0 0 0 rgba(216,175,114,0)); }
  45%{ filter:drop-shadow(0 0 26px rgba(216,175,114,.5)); }
  100%{ transform:scale(1); filter:drop-shadow(0 0 14px rgba(216,175,114,.22)); }
}

.isoc-img{
  position:absolute; inset:0; width:100%; height:100%;
  object-fit:contain; user-select:none; -webkit-user-drag:none;
}
.isoc-img--ca,.isoc-img--s1,.isoc-img--s2{ opacity:0; }

/* ── Glitch active ── */
.isoc-mark.is-glitch .isoc-img--base{ animation:isocFlick .42s steps(1,end) infinite; }
.isoc-mark.is-glitch .isoc-img--ca{
  opacity:1; mix-blend-mode:screen;
  animation:isocCA .26s steps(1,end) infinite, isocJit .5s steps(1,end) infinite;
}
.isoc-mark.is-glitch .isoc-img--s1{
  opacity:1;
  animation:isocSlice1 .3s steps(1,end) infinite;
}
.isoc-mark.is-glitch .isoc-img--s2{
  opacity:1;
  animation:isocSlice2 .24s steps(1,end) infinite;
}

@keyframes isocFlick{
  0%,100%{opacity:1} 22%{opacity:.55} 26%{opacity:1}
  54%{opacity:.35} 58%{opacity:.9} 82%{opacity:.7}
}
/* chromatic aberration via offset coloured ghosts */
@keyframes isocCA{
  0%  {filter:drop-shadow(2px 0 rgba(255,45,85,.65)) drop-shadow(-2px 0 rgba(0,229,255,.65))}
  25% {filter:drop-shadow(-5px 0 rgba(255,45,85,.8)) drop-shadow(5px 0 rgba(0,229,255,.8))}
  50% {filter:drop-shadow(4px 1px rgba(255,45,85,.7)) drop-shadow(-3px -1px rgba(0,229,255,.7))}
  75% {filter:drop-shadow(-3px 0 rgba(255,45,85,.75)) drop-shadow(6px 0 rgba(0,229,255,.75))}
  100%{filter:drop-shadow(2px 0 rgba(255,45,85,.6)) drop-shadow(-2px 0 rgba(0,229,255,.6))}
}
@keyframes isocJit{
  0%,100%{transform:translate(0,0)}
  12%{transform:translate(-4px,1px)} 24%{transform:translate(5px,-1px)}
  37%{transform:translate(-2px,0)}   49%{transform:translate(3px,2px)}
  61%{transform:translate(-5px,-1px)}74%{transform:translate(2px,1px)}
  88%{transform:translate(-1px,0)}
}
@keyframes isocSlice1{
  0%,100%{clip-path:inset(8% 0 78% 0); transform:translateX(0)}
  33%{clip-path:inset(30% 0 52% 0); transform:translateX(-16px)}
  66%{clip-path:inset(58% 0 28% 0); transform:translateX(14px)}
}
@keyframes isocSlice2{
  0%,100%{clip-path:inset(70% 0 14% 0); transform:translateX(10px)}
  40%{clip-path:inset(44% 0 40% 0); transform:translateX(-18px)}
  80%{clip-path:inset(20% 0 66% 0); transform:translateX(8px)}
}

/* ── Scanlines + flash ── */
.isoc-scan{
  position:absolute; inset:-10%; pointer-events:none; z-index:3;
  background:repeating-linear-gradient(0deg,
    rgba(255,255,255,0.04) 0px, rgba(255,255,255,0.04) 1px,
    transparent 2px, transparent 4px);
  mix-blend-mode:overlay; opacity:.6;
  animation:isocScanMove .6s steps(2,end) infinite;
}
@keyframes isocScanMove{ from{background-position:0 0} to{background-position:0 8px} }

.isoc-flash{
  position:absolute; inset:-40%; pointer-events:none; z-index:4;
  background:radial-gradient(circle, rgba(255,250,240,0.9) 0%, rgba(216,175,114,0.5) 30%, transparent 65%);
  animation:isocFlash .25s ease-out both;
}
@keyframes isocFlash{ 0%{opacity:0; transform:scale(.6)} 35%{opacity:1} 100%{opacity:0; transform:scale(1.25)} }

/* ── Wordmark cue ── */
.isoc-cue{
  position:absolute; bottom:clamp(2.5rem,9vh,5rem);
  font-family:'DM Sans',sans-serif; font-size:.68rem; font-weight:600;
  letter-spacing:.42em; text-transform:uppercase; color:#d8af72;
  text-indent:.42em;
}

@media (prefers-reduced-motion: reduce){
  .isoc-mark{ transition:opacity .5s ease; transform:none; }
  .isoc-mark.is-visible{ transform:none; }
}
`;
