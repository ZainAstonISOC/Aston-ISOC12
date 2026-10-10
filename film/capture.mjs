// Captures the real astonisoc.com screens and UI pieces the film is built from.
//
//   node capture.mjs                → every page
//   node capture.mjs event zakat    → only those pages (layout.json is merged)
//
// Needs Playwright; see README.md.
import { chromium } from 'playwright';
import { mkdir, writeFile, readFile } from 'node:fs/promises';

const SITE = process.env.FILM_SITE ?? 'https://www.astonisoc.com';
const OUT = new URL('./screens/', import.meta.url).pathname;
await mkdir(OUT, { recursive: true });

// The event the Events chapter shows. Pick an upcoming one with a calendar block.
const EVENT = process.env.FILM_EVENT ?? '/events/roots-workshop-external-attendees-seerah-series-2026-10-13';
// Illustrative amounts typed into the Zakat calculator: £6,000 net → £150.00 due.
const ZAKAT_INPUTS = { cash: '4800', investments: '1200' };

const browser = await chromium.launch({ channel: 'chromium' });
const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true, reducedMotion: 'reduce' });
// Skip the intro loader and the consent banner so the screens show the site itself.
await ctx.addInitScript(() => { try { sessionStorage.setItem('isoc_loaded', '1'); localStorage.setItem('isoc-consent', 'dismissed'); } catch {} });
const page = await ctx.newPage();

async function open(path, prepare) {
  await page.goto(SITE + path, { waitUntil: 'networkidle' });
  await page.addStyleTag({ content: '.reveal{opacity:1!important;transform:none!important} *,*::before,*::after{transition:none!important} *{animation-play-state:paused!important;caret-color:transparent!important}' });
  if (prepare) await prepare();
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(800);
}

// Full-height strips the phone scrolls through (JPEG: they sit on an opaque screen).
async function strip(path, name, height, prepare) {
  await open(path, prepare);
  await page.screenshot({ path: `${OUT}${name}.jpg`, type: 'jpeg', quality: 90, clip: { x: 0, y: 0, width: 390, height }, fullPage: true });
}

// UI pieces that fly out of the screen: transparent PNGs. `style` makes a piece
// read on its own (an opaque surface where the page has a translucent tint).
async function pieces(path, selector, prefix, style, prepare) {
  await open(path, prepare);
  await page.addStyleTag({ content: `html,body{background:transparent!important} body::before,body::after{display:none!important} ${selector}{${style}}` });
  const els = await page.$$(selector);
  const rects = [];
  for (const [i, el] of els.entries()) {
    await el.scrollIntoViewIfNeeded();
    await el.screenshot({ path: `${OUT}${prefix}-${i}.png`, omitBackground: true });
    rects.push(await el.evaluate(e => { const b = e.getBoundingClientRect(); return { x: b.x, y: b.y + scrollY, w: b.width, h: b.height }; }));
  }
  return rects;
}

// A card surface added without moving the content: the padding is cancelled by
// an equal negative margin.
const lift = (bg, pad = '14px 18px') => `background:${bg}!important;padding:${pad}!important;margin:${pad.split(' ').map(v => '-' + v).join(' ')}!important;border-radius:16px;border:1px solid rgba(216,175,114,0.22)`;

const fillZakat = async () => {
  for (const [id, v] of Object.entries(ZAKAT_INPUTS)) await page.fill(`#${id}`, v);
  await page.evaluate(() => {
    for (const id of ['cash', 'gold', 'silver', 'investments', 'business']) document.getElementById(id).parentElement.parentElement.dataset.film = 'zfield';
    const due = [...document.querySelectorAll('p')].find(p => /Zakat Due/.test(p.textContent)).parentElement;
    due.dataset.film = 'zdue';
  });
};
const tagEvent = () => page.evaluate(() => {
  const date = document.querySelector('.max-w-2xl > .flex.items-baseline');
  date.dataset.film = 'evdate';
  // The badges sit inside the card's padding; keep them out of the cut-out.
  date.nextElementSibling.style.visibility = 'hidden';
});

const PAGES = {
  async home(layout) {
    await strip('/', 'home', 4520);
    layout.prayer = await pieces('/', '.prayer-cell', 'prayer-cell', 'background:#211846!important');
    layout.ayah = await pieces('/', '.ayah-card', 'ayah-card', 'background:#1f1645!important');
    layout.offer = await pieces('/', 'article.card.feature', 'offer', 'background:#1c1440!important');
  },
  async event(layout) {
    await strip(EVENT, 'event', 1700);
    layout.evdate = await pieces(EVENT, '[data-film=evdate]', 'evdate', `${lift('#1f1645', '10px 14px')};width:fit-content`, tagEvent);
    layout.cal = await pieces(EVENT, 'a.btn.btn-outline-gold', 'cal', 'background:#1a1238!important');
  },
  async zakat(layout) {
    await strip('/zakat', 'zakat', 2100, fillZakat);
    layout.zfield = await pieces('/zakat', '[data-film=zfield]', 'zfield', lift('#1f1645', '12px 16px'), fillZakat);
    // The due box is captured with its figure hidden; the film counts it up.
    layout.zdue = await pieces('/zakat', '[data-film=zdue]', 'zdue', 'background:#36293f!important', async () => {
      await fillZakat();
      layout.zdueFigure = await page.evaluate(() => {
        const box = document.querySelector('[data-film=zdue]'), fig = box.lastElementChild;
        const b = box.getBoundingClientRect(), f = fig.getBoundingClientRect();
        const value = fig.textContent;
        fig.style.color = 'transparent';
        return { x: f.x - b.x, y: f.y - b.y, w: f.width, h: f.height, value, fontSize: parseFloat(getComputedStyle(fig).fontSize) };
      });
    });
  },
};

const wanted = process.argv.slice(2).length ? process.argv.slice(2) : Object.keys(PAGES);
const layout = JSON.parse(await readFile(`${OUT}layout.json`, 'utf8').catch(() => '{}'));
for (const name of wanted) await PAGES[name](layout);
await writeFile(`${OUT}layout.json`, JSON.stringify(layout, null, 2));
console.log(Object.fromEntries(Object.entries(layout).map(([k, v]) => [k, Array.isArray(v) ? v.length : v])));
await browser.close();
