// Captures the real astonisoc.com screens and UI pieces the film is built from.
// Usage: node film/capture.mjs  (needs Playwright; see film/README.md)
import { chromium } from 'playwright';
import { mkdir, writeFile, rm } from 'node:fs/promises';

const SITE = process.env.FILM_SITE ?? 'https://www.astonisoc.com';
const OUT = new URL('./screens/', import.meta.url).pathname;
await rm(OUT, { recursive: true, force: true });
await mkdir(OUT, { recursive: true });

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true, reducedMotion: 'reduce' });
// Skip the intro loader and the consent banner so the screens show the site itself.
await ctx.addInitScript(() => { try { sessionStorage.setItem('isoc_loaded', '1'); localStorage.setItem('isoc-consent', 'dismissed'); } catch {} });
const page = await ctx.newPage();

async function open(path) {
  await page.goto(SITE + path, { waitUntil: 'networkidle' });
  await page.addStyleTag({ content: '.reveal{opacity:1!important;transform:none!important} *,*::before,*::after{transition:none!important} *{animation-play-state:paused!important;caret-color:transparent!important}' });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(800);
}

// Full-height strips the phone scrolls through (JPEG: they sit on an opaque screen).
async function strip(path, name, height) {
  await open(path);
  await page.screenshot({ path: `${OUT}${name}.jpg`, type: 'jpeg', quality: 90, clip: { x: 0, y: 0, width: 390, height }, fullPage: true });
}

// UI pieces that fly out of the screen: transparent PNGs, with the card surface
// made opaque (it is a translucent tint on the page) so it reads on its own.
async function pieces(path, selector, prefix, bg) {
  await open(path);
  await page.addStyleTag({ content: `html,body{background:transparent!important} body::before,body::after{display:none!important} ${selector}{background:${bg}!important}` });
  const els = await page.$$(selector);
  const rects = [];
  for (const [i, el] of els.entries()) {
    await el.scrollIntoViewIfNeeded();
    await el.screenshot({ path: `${OUT}${prefix}-${i}.png`, omitBackground: true });
    rects.push(await el.evaluate(e => { const b = e.getBoundingClientRect(); return { x: b.x, y: b.y + scrollY, w: b.width, h: b.height }; }));
  }
  return rects;
}

// Everything the film shows comes from the homepage, so piece positions line up
// with the strip the phone scrolls through.
await strip('/', 'home', 4520);
const layout = {
  prayer: await pieces('/', '.prayer-cell', 'prayer-cell', '#211846'),
  ayah: await pieces('/', '.ayah-card', 'ayah-card', '#1f1645'),
  offer: await pieces('/', 'article.card.feature', 'offer', '#1c1440'),
};
await writeFile(`${OUT}layout.json`, JSON.stringify(layout, null, 2));
console.log(Object.fromEntries(Object.entries(layout).map(([k, v]) => [k, v.length])));
await browser.close();
