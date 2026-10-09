// Renders film.html frame by frame and encodes it with macOS AVFoundation.
//
//   node render.mjs reel                 → out/aston-isoc-reel.mp4 (1080×1920)
//   node render.mjs hero                 → public/hero/*.mp4 + poster (the website loop)
//   node render.mjs reel --stills 3,7.5  → out/stills/reel-3.png … (quick look, no video)
//
// Motion blur is real: each frame averages several sub-frame renders across a
// 180° shutter, so whips and fast pushes smear the way a camera would.
import { chromium } from 'playwright';
import sharp from 'sharp';
import http from 'node:http';
import { readFile, mkdir, rm, writeFile } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import path from 'node:path';

const HERE = path.dirname(new URL(import.meta.url).pathname);
const ROOT = path.resolve(HERE, '..');
const cutName = process.argv[2] ?? 'reel';
const stillsArg = process.argv.indexOf('--stills');
const stills = stillsArg > 0 ? process.argv[stillsArg + 1].split(',').map(Number) : null;
const FPS = 30;
const SUBFRAMES = 6;   // samples per frame when something is moving
const SHUTTER = 0.5;   // fraction of the frame interval the shutter is open

// Serve the repo root so film.html can reach ../public and fetch its JSON.
const TYPES = { '.html': 'text/html', '.png': 'image/png', '.jpg': 'image/jpeg', '.json': 'application/json', '.js': 'text/javascript' };
const server = http.createServer(async (req, res) => {
  const p = path.join(ROOT, decodeURIComponent(new URL(req.url, 'http://x').pathname));
  if (!p.startsWith(ROOT)) { res.writeHead(403).end(); return; }
  let body;
  try { body = await readFile(p); } catch { res.writeHead(404).end(); return; }
  res.writeHead(200, { 'content-type': TYPES[path.extname(p)] ?? 'application/octet-stream' }).end(body);
}).listen(0);
const port = server.address().port;

const browser = await chromium.launch({ channel: 'chromium', args: ['--use-angle=metal', '--enable-gpu-rasterization', '--ignore-gpu-blocklist'] });
const page = await browser.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 });
page.on('pageerror', e => console.error('page error:', e.message));
await page.goto(`http://127.0.0.1:${port}/film/film.html?cut=${cutName}`);
const info = await page.evaluate(() => window.filmReady);
await page.setViewportSize({ width: info.W, height: info.H });

async function shot(t, frame) {
  await page.evaluate(([t, f]) => window.renderAt(t, f), [t, frame]);
  return page.screenshot({ type: 'png', clip: { x: 0, y: 0, width: info.W, height: info.H } });
}

// Average sub-frames. Frames with no motion are rendered once.
async function frameAt(frame) {
  const t = frame/FPS;
  const first = await shot(t, frame);
  const raws = [await sharp(first).removeAlpha().raw().toBuffer()];
  const probe = await sharp(await shot(t + SHUTTER/FPS*0.5, frame)).removeAlpha().raw().toBuffer();
  if (Buffer.compare(raws[0], probe) === 0) return first;
  for (let k = 0; k < SUBFRAMES; k++) {
    const dt = ((k + 0.5)/SUBFRAMES - 0.5)*SHUTTER/FPS;
    raws.push(await sharp(await shot(t + dt, frame)).removeAlpha().raw().toBuffer());
  }
  raws.shift(); // the centre sample is already represented
  const acc = new Uint32Array(raws[0].length);
  for (const r of raws) for (let i = 0; i < r.length; i++) acc[i] += r[i];
  const out = Buffer.alloc(acc.length);
  for (let i = 0; i < acc.length; i++) out[i] = Math.round(acc[i]/raws.length);
  return sharp(out, { raw: { width: info.W, height: info.H, channels: 3 } }).png().toBuffer();
}

if (stills) {
  const dir = path.join(HERE, 'out', 'stills');
  await mkdir(dir, { recursive: true });
  for (const t of stills) {
    const buf = await frameAt(Math.round(t*FPS));
    await writeFile(path.join(dir, `${cutName}-${t}.png`), buf);
  }
  console.log('stills →', dir);
} else {
  const frames = path.join(HERE, 'out', `frames-${cutName}`);
  await rm(frames, { recursive: true, force: true });
  await mkdir(frames, { recursive: true });
  const total = Math.round(info.duration*FPS);
  const started = Date.now();
  for (let f = 0; f < total; f++) {
    const buf = await frameAt(f);
    await sharp(buf).jpeg({ quality: 95, chromaSubsampling: '4:4:4' }).toFile(path.join(frames, `${String(f).padStart(5, '0')}.jpg`));
    if (f % 30 === 0) console.log(`${cutName} ${f}/${total}  ${((Date.now() - started)/1000).toFixed(0)}s`);
  }
  const encode = (out, w, h, kbps) => {
    execFileSync('swift', [path.join(HERE, 'encode.swift'), frames, out, String(FPS), String(w), String(h), String(kbps*1000)], { stdio: 'inherit' });
    console.log('wrote', path.relative(ROOT, out));
  };
  if (cutName === 'reel') {
    await mkdir(path.join(HERE, 'out'), { recursive: true });
    encode(path.join(HERE, 'out', 'aston-isoc-reel.mp4'), 1080, 1920, 12000);
  } else {
    const pub = path.join(ROOT, 'public', 'hero');
    await mkdir(pub, { recursive: true });
    encode(path.join(pub, 'isoc-film-1080.mp4'), 1080, 1350, 2600);
    encode(path.join(pub, 'isoc-film-720.mp4'), 720, 900, 1300);
    // Poster: the loop's first frame, which is also its last.
    const first = path.join(frames, '00000.jpg');
    await sharp(first).resize(1080).webp({ quality: 80 }).toFile(path.join(pub, 'isoc-film-poster.webp'));
    console.log('wrote poster');
  }
}

await browser.close();
server.close();
