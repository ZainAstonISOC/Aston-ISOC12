# The Aston ISOC film

A short film of the society's own website on a phone. It plays as the
homepage hero on a loop and is also cut as an Instagram Reel. It is not part of the
Next.js build: nothing in this folder ships except the files `render.mjs` writes
to `public/hero/`.

## The idea

The creative reference was Bristol ISoc's website launch reel (by Darb Creative):
a phone floating on a plain stage, cards lifting out of its screen, Arabic greetings
written around it, motion-blurred push-ins and whip-pans. This film uses the same
techniques in Aston ISOC's colours (deep purple, gold, Playfair Display and DM
Sans).

Its footage is **astonisoc.com itself**, captured by script, so nothing in it is
staged or invented. It follows three chapters, each built from real content on the
homepage:

| Chapter   | What you see |
|-----------|-------------|
| Opening   | Macro on the Bismillah at the top of the homepage; the light crosses the glass and the camera pulls back. *As-salāmu ʿalaykum*, *Ahlan wa sahlan* and *Marḥaban bikum* are written in around the phone (Aref Ruqaa). |
| Faith     | A push into the live prayer board. The six prayer cells lift out of the screen. |
| Community | A whip-pan to "What we offer". The six cards slide out into a column. |
| Growth    | The Daily Ayah card rises towards the camera while the phone sinks into shadow. |
| Close     | A whip back to the top of the site, then the society lockup with *Faith · Community · Growth* and astonisoc.com. |

The hero cut (16 s, 4:5) has the same beats without typography, because the page
already has a headline. It is a seamless loop: the last frame is the first.

## Files

| File | Purpose |
|------|---------|
| `capture.mjs` | Screenshots the live homepage at iPhone size (390×844 @3x) into `screens/`: one tall strip, plus each prayer cell, offer card and the ayah card as a transparent PNG, with their positions in `layout.json`. |
| `film.html` | The film. A deterministic timeline: `renderAt(seconds)` sets every transform, so any frame can be re-rendered exactly. Both cuts live here (`CUTS.reel`, `CUTS.hero`). |
| `render.mjs` | Steps through the timeline in Chromium, averaging 6 sub-frames over a 180° shutter wherever something moves (real motion blur), then encodes with `encode.swift`. |
| `encode.swift` | H.264 MP4 encoder using macOS AVFoundation, with the moov atom first for streaming. No ffmpeg needed. |

## Re-rendering (when the site changes)

On a Mac with Xcode command-line tools:

```bash
cd film
npm install                 # Playwright + sharp, local to this folder
npx playwright install chromium
npm run capture             # re-shoot astonisoc.com
node render.mjs hero        # → public/hero/isoc-film-{1080,720}.mp4 + poster (~16 min)
node render.mjs reel        # → film/out/aston-isoc-reel.mp4 (~25 min)
```

To look at a moment before committing to a full render:

```bash
node render.mjs reel --stills 3,8.6,16.5   # → film/out/stills/
```

You can also scrub the timeline live. Serve the repo root (for example with
`python3 -m http.server -d ..`) and open `/film/film.html?cut=reel&scrub`.

The capture is a snapshot of one moment. The prayer times, the next-prayer
countdown and the Daily Ayah in the film are whatever the site showed when
`capture.mjs` ran. Re-capture when the homepage design changes.

## Swapping in real footage later

If the committee films on campus, the film can carry it without a rebuild:

- A clip or photo can be another "piece". Add an `<img>` or `<video>` to
  `#pieces`, then place it with `placePiece()` and a `{ wx, wy, z }` target (a
  point in the frame).
- Instagram cards would work like the reference's "of us and counting" beat. Drop
  exported posts into `screens/` and add a group like `offer`.

Use only footage the society owns or has consent for, and keep people who did not
agree to be filmed out of frame.

## Sound

The website film is silent on purpose: browsers block autoplaying sound, and a
hero should never make noise. For the Reel, add audio inside Instagram:

- Use a nasheed or a voice-only track from Instagram's library, or a
  sound-design bed: room tone, soft whooshes on the whips (≈6.5 s, 10.2 s,
  19.2 s), a low swell under the ayah (15–18.5 s) and a single resolving tone on
  the lockup (21.8 s).
- If the committee's position is no instruments, use voice only. Check before
  posting.
- Do not use commercial music outside Instagram's licensed library.
