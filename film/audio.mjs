// Original sound design for the Reel, synthesised from nothing: no samples, no
// library music, nothing to license. Every cue sits on the film's own timeline
// (film.html, CUTS.reel).
//
//   node audio.mjs              → out/aston-isoc-reel-audio.wav     (pad + sound design)
//   node audio.mjs --no-music   → out/aston-isoc-reel-sfx.wav       (sound design only: no pad, no chords)
//
// The second mix is for anyone who would rather the Reel carried no musical
// tones at all; it keeps the whooshes, impacts, taps and ticks.
import { writeFile, mkdir } from 'node:fs/promises';

const MUSIC = !process.argv.includes('--no-music');
const SR = 48000, DUR = 32.9, N = Math.ceil(SR*DUR);
const L = new Float32Array(N), R = new Float32Array(N);
const TAU = Math.PI*2;
const hz = (midi) => 440*Math.pow(2, (midi - 69)/12);
const clamp01 = v => Math.max(0, Math.min(1, v));
const smooth = (a, b, t) => { const x = clamp01((t - a)/(b - a)); return x*x*(3 - 2*x); };
let seed = 11; const rnd = () => { seed = (seed*1664525 + 1013904223) >>> 0; return seed/4294967296; };
function add(i, l, r = l) { if (i >= 0 && i < N) { L[i] += l; R[i] += r; } }

// ── Pad: detuned sines through a soft low-pass, one chord per chapter (D major). ──
const CHORDS = [
  [0.0,   [50, 57, 62, 64]],          // D add9: the opening
  [6.5,   [43, 50, 55, 59, 62]],      // G maj7: faith
  [10.2,  [40, 47, 54, 55, 62]],      // E min9: community
  [13.78, [45, 52, 57, 59, 64]],      // A sus2: events
  [17.95, [47, 54, 57, 62]],          // B min7: zakat
  [22.8,  [43, 50, 57, 59]],          // G add9: the ayah, quieter
  [27.7,  [38, 50, 57, 62, 66, 69]],  // D major add9: home
];
if (MUSIC) {
  let lp = 0, lpR = 0;
  const phases = new Map();
  for (let i = 0; i < N; i++) {
    const t = i/SR;
    let sumL = 0, sumR = 0;
    for (let k = 0; k < CHORDS.length; k++) {
      const [t0, notes] = CHORDS[k];
      const t1 = CHORDS[k + 1]?.[0] ?? 99;
      const g = smooth(t0 - 0.35, t0 + 0.35, t)*(1 - smooth(t1 - 0.35, t1 + 0.35, t));
      if (g <= 0) continue;
      notes.forEach((m, j) => {
        for (const det of [-0.07, 0.07]) {
          const key = `${k}-${j}-${det}`;
          const ph = (phases.get(key) ?? rnd()) + hz(m + det)/SR; phases.set(key, ph % 1);
          const v = Math.sin(TAU*ph)*g*(m < 48 ? 0.9 : 0.55);
          if (det < 0) sumL += v; else sumR += v;
        }
      });
    }
    // Quiet under the macro, opens with the pull-back, dips for the ayah, swells home.
    const env = 0.008 + 0.022*smooth(2.2, 3.4, t) - 0.010*smooth(23.0, 24.0, t) + 0.006*smooth(26.8, 27.7, t) + 0.012*smooth(29.6, 30.6, t);
    const fade = 1 - smooth(31.4, 32.9, t);
    const cutoff = 0.02 + 0.05*smooth(2.2, 3.6, t) - 0.02*smooth(23.0, 24.0, t) + 0.06*smooth(29.6, 30.8, t);
    lp += (sumL - lp)*cutoff; lpR += (sumR - lpR)*cutoff;
    add(i, lp*env*fade*1.6, lpR*env*fade*1.6);
  }
}

// ── Sub: a low floor the impacts sit on. ──
for (let i = 0; i < N; i++) {
  const t = i/SR;
  const g = (0.04*smooth(0, 1.5, t) + 0.04*smooth(2.4, 3.3, t))*(1 - smooth(27.4, 28.8, t)) + 0.05*smooth(29.9, 30.4, t)*(1 - smooth(31.2, 32.9, t));
  add(i, Math.sin(TAU*hz(26)*t)*g);
}

// ── Voices ──
function thump(t0, gain) { // a soft low impact: pitch falls 110 → 42 Hz
  const n = Math.floor(SR*0.9), i0 = Math.floor(t0*SR); let ph = 0;
  for (let k = 0; k < n; k++) {
    const tt = k/SR, f = 42 + 68*Math.exp(-tt/0.06);
    ph += f/SR; add(i0 + k, Math.sin(TAU*ph)*Math.min(1, tt/0.004)*Math.exp(-tt/0.32)*gain);
  }
}
function air(t0, t1, gain, f0, f1, pan0 = 0, pan1 = 0) { // band-passed noise, swept: whooshes
  const i0 = Math.floor(t0*SR), i1 = Math.floor(t1*SR);
  let b1 = 0, b2 = 0, a1 = 0, a2 = 0;
  for (let i = i0; i < i1; i++) {
    const p = (i - i0)/(i1 - i0);
    const env = Math.pow(Math.sin(Math.PI*Math.pow(p, 0.8)), 2);
    const f = f0*Math.pow(f1/f0, p), q = 1.2;
    const w = TAU*f/SR, al = Math.sin(w)/(2*q), c = Math.cos(w);
    const x = rnd()*2 - 1;
    const y = (al*x - al*b2 + 2*c*a1 - (1 - al)*a2)/(1 + al);
    b2 = b1; b1 = x; a2 = a1; a1 = y;
    const pan = pan0 + (pan1 - pan0)*p;
    add(i, y*env*gain*(1 - pan), y*env*gain*(1 + pan));
  }
}
function glass(t0, f, gain, pan) { // a short inharmonic ping: a card settling
  const n = Math.floor(SR*1.2), i0 = Math.floor(t0*SR);
  for (let k = 0; k < n; k++) {
    const tt = k/SR, e = Math.min(1, tt/0.002);
    const v = (Math.sin(TAU*f*tt)*Math.exp(-tt/0.35) + 0.4*Math.sin(TAU*f*2.76*tt)*Math.exp(-tt/0.12) + 0.2*Math.sin(TAU*f*5.4*tt)*Math.exp(-tt/0.05))*e*gain;
    add(i0 + k, v*(1 - pan), v*(1 + pan));
  }
}
function tick(t0, gain, pan = 0, f = 3200) { // a dry click: the tap, the counter
  const n = Math.floor(SR*0.05), i0 = Math.floor(t0*SR);
  let hp = 0, prev = 0;
  for (let k = 0; k < n; k++) {
    const tt = k/SR, x = (rnd()*2 - 1)*Math.exp(-tt/0.004) + Math.sin(TAU*f*tt)*Math.exp(-tt/0.008)*0.6;
    hp = 0.85*(hp + x - prev); prev = x;
    add(i0 + k, hp*gain*(1 - pan), hp*gain*(1 + pan));
  }
}
function bell(t0, notes, gain, len = 3.6) { // a soft additive bell chord
  const n = Math.floor(SR*len), i0 = Math.floor(t0*SR);
  for (const [j, m] of notes.entries()) {
    const f = hz(m), pan = notes.length > 1 ? (j/(notes.length - 1) - 0.5)*0.6 : 0;
    for (let k = 0; k < n; k++) {
      const tt = k/SR, e = Math.min(1, tt/0.004);
      const v = (Math.sin(TAU*f*tt)*Math.exp(-tt/1.6) + 0.3*Math.sin(TAU*f*2*tt)*Math.exp(-tt/0.6) + 0.12*Math.sin(TAU*f*3.01*tt)*Math.exp(-tt/0.25))*e*gain;
      add(i0 + k, v*(1 - pan), v*(1 + pan));
    }
  }
}
// In the music-free mix, the pings become pitchless clicks.
const ping = (t, m, g, pan) => MUSIC ? glass(t, hz(m), g, pan) : tick(t, g*4, pan, 2400);

// ── Opening: light crossing the glass, then the pull-back. ──
air(0.0, 2.6, 0.05, 180, 900, -0.3, 0.3);
air(0.6, 2.3, 0.035, 3000, 9000, -0.6, 0.6);     // the sweep's shimmer
air(2.0, 3.0, 0.15, 300, 2600, 0.3, 0);
thump(2.7, 0.5);
// The three greetings, written in.
[[2.75, 74, 0], [3.15, 78, 0.4], [3.5, 81, -0.4]].forEach(([t, m, pan]) => { ping(t + 0.05, m, 0.045, pan); air(t, t + 1.0, 0.03, 2000, 6000, pan, pan); });

// ── Faith ──
air(5.2, 6.45, 0.14, 500, 4200);                 // push in
thump(6.6, 0.4);
for (let i = 0; i < 6; i++) ping(7.0 + 1.4*(0.09*i + 0.385), [74, 76, 78, 81, 83, 86][i], 0.04, i % 2 ? 0.45 : -0.45);
air(9.9, 10.3, 0.24, 900, 5200, 0.7, -0.7);      // whip left
thump(10.9, 0.4);

// ── Community ──
for (let i = 0; i < 6; i++) ping(10.85 + 1.5*(0.1*i + 0.25), [71, 74, 76, 78, 81, 83][i], 0.033, 0.3);
air(13.4, 13.85, 0.24, 900, 5200, -0.7, 0.7);    // whip right
thump(14.45, 0.38);

// ── Events ──
air(14.5, 15.05, 0.05, 2400, 900);               // the page scrolls
tick(15.15, 0.35, -0.35);                        // the tap on "Apple / Outlook"
air(15.3, 16.0, 0.09, 600, 3200, 0.6, 0.2);      // the calendar arrives
ping(15.95, 76, 0.03, 0.3);
air(15.75, 16.25, 0.05, 900, 3800, -0.2, 0);     // the date card lifts
air(16.3, 16.7, 0.06, 3800, 700, 0, 0.4);        // …and drops
if (MUSIC) bell(16.68, [81, 88], 0.045, 2.4); else tick(16.68, 0.4, 0.4, 1800);
thump(16.68, 0.22);

// ── Zakat ──
air(17.3, 17.95, 0.16, 500, 4200);               // push through the screen
thump(18.75, 0.38);
ping(19.0, 74, 0.04, -0.4); ping(19.3, 78, 0.04, -0.4);
air(19.95, 20.7, 0.08, 500, 2600, 0.2, 0);       // the due card comes forward
// The count: ticks that slow as the number settles (same easing as the film).
{ const out = p => 1 - Math.pow(1 - p, 3); let last = -1;
  for (let f = 0; f <= 35; f++) { const tf = 20.3 + f/30, v = Math.floor(out(clamp01((tf - 20.3)/1.15))*30); if (v !== last) { tick(tf, 0.12*(1 - f/50), 0.1); last = v; } } }
if (MUSIC) bell(21.45, [86], 0.04, 1.8); else tick(21.45, 0.35, 0, 1800);

// ── Growth ──
air(21.8, 22.8, 0.12, 4200, 600, 0, 0);          // back to the homepage
air(23.3, 24.6, 0.04, 400, 1600);                 // the ayah rises
if (MUSIC) bell(24.1, [62, 69], 0.02, 3.2);
// ── Close ──
air(26.95, 27.65, 0.16, 600, 4800);              // whip back to the top
thump(29.0, 0.35);
air(29.6, 30.25, 0.06, 2400, 300);               // the phone falls away
if (MUSIC) bell(30.2, [62, 66, 69, 74, 76], 0.05);
thump(30.2, 0.32);

// ── Master: gentle saturation, normalise to −1 dBFS, 16-bit WAV. ──
let peak = 0;
for (let i = 0; i < N; i++) { L[i] = Math.tanh(L[i]*1.4)/1.4; R[i] = Math.tanh(R[i]*1.4)/1.4; peak = Math.max(peak, Math.abs(L[i]), Math.abs(R[i])); }
const g = Math.pow(10, -1/20)/peak;
const buf = Buffer.alloc(44 + N*4);
buf.write('RIFF', 0); buf.writeUInt32LE(36 + N*4, 4); buf.write('WAVE', 8);
buf.write('fmt ', 12); buf.writeUInt32LE(16, 16); buf.writeUInt16LE(1, 20); buf.writeUInt16LE(2, 22);
buf.writeUInt32LE(SR, 24); buf.writeUInt32LE(SR*4, 28); buf.writeUInt16LE(4, 32); buf.writeUInt16LE(16, 34);
buf.write('data', 36); buf.writeUInt32LE(N*4, 40);
for (let i = 0; i < N; i++) {
  buf.writeInt16LE(Math.round(Math.max(-1, Math.min(1, L[i]*g))*32767), 44 + i*4);
  buf.writeInt16LE(Math.round(Math.max(-1, Math.min(1, R[i]*g))*32767), 46 + i*4);
}
const name = MUSIC ? 'aston-isoc-reel-audio.wav' : 'aston-isoc-reel-sfx.wav';
await mkdir(new URL('./out/', import.meta.url), { recursive: true });
await writeFile(new URL(`./out/${name}`, import.meta.url), buf);
console.log(`wrote out/${name}`, { peakBeforeNormalise: peak.toFixed(3) });
