/**
 * Opens key pages in a real browser, at phone and desktop widths, and reports
 * layout problems that look fine in the HTML: sideways scrolling, content
 * stuck invisible behind a scroll-reveal, broken images, console errors and
 * failed requests.
 *
 *   npm run audit:prod                          # https://www.astonisoc.com
 *   SITE=http://localhost:3000 npm run audit:prod
 *
 * Uses the Playwright copy installed for film/ (cd film && npm install), so
 * the website itself carries no browser dependency. Exits 1 on any problem.
 */
import { createRequire } from "node:module";

const SITE = (process.env.SITE ?? "https://www.astonisoc.com").replace(/\/$/, "");
const PAGES = [
  "/", "/events", "/prayer-times", "/quran", "/quran/36", "/ayah", "/committee", "/about", "/join",
  "/freshers", "/halal-food", "/volunteer", "/charity", "/donate", "/sponsors", "/zakat", "/search", "/start-here",
];
const VIEWPORTS = [{ name: "phone", width: 390, height: 844 }, { name: "desktop", width: 1440, height: 900 }];

const require = createRequire(new URL("../film/package.json", import.meta.url));
let chromium;
try {
  ({ chromium } = require("playwright"));
} catch {
  console.error("Playwright isn't installed. Run: cd film && npm install");
  process.exit(2);
}

const browser = await chromium.launch({ channel: "chromium" });
let problems = 0;

for (const vp of VIEWPORTS) {
  for (const path of PAGES) {
    const page = await browser.newPage({ viewport: { width: vp.width, height: vp.height } });
    // Skip the once-per-session intro loader.
    await page.addInitScript(() => { try { sessionStorage.setItem("isoc_loaded", "1"); } catch {} });
    const issues = [];
    page.on("console", m => { if (m.type() === "error") issues.push(`console: ${m.text().slice(0, 140)}`); });
    page.on("requestfailed", r => { if (!r.url().includes("/_vercel/")) issues.push(`request failed: ${r.url().slice(0, 120)}`); });

    // "load", not "networkidle": the looping hero video keeps the network busy forever.
    const res = await page.goto(SITE + path, { waitUntil: "load", timeout: 45000 }).catch(e => (issues.push(`load: ${e.message}`), null));
    await page.waitForTimeout(800);
    if (res && res.status() >= 400) issues.push(`HTTP ${res.status()}`);

    // Scroll through so every scroll-reveal gets its chance to fire.
    await page.evaluate(async () => {
      for (let y = 0; y < document.body.scrollHeight; y += innerHeight / 2) { scrollTo(0, y); await new Promise(r => setTimeout(r, 120)); }
      scrollTo(0, document.body.scrollHeight); await new Promise(r => setTimeout(r, 600));
    });

    const found = await page.evaluate(() => {
      const out = [];
      if (document.documentElement.scrollWidth > innerWidth + 1) out.push(`scrolls sideways (${document.documentElement.scrollWidth}px wide)`);
      if (document.querySelectorAll("h1").length !== 1) out.push(`${document.querySelectorAll("h1").length} h1 elements`);
      for (const img of document.images) if (img.complete && img.naturalWidth === 0 && img.getAttribute("src")) out.push(`broken image ${img.getAttribute("src").slice(0, 80)}`);
      const hidden = [...document.querySelectorAll(".reveal")].filter(el => {
        const r = el.getBoundingClientRect();
        return r.height > 0 && Number(getComputedStyle(el).opacity) < 0.5;
      });
      if (hidden.length) out.push(`${hidden.length} scroll-reveal block(s) still invisible after scrolling`);
      return out;
    });
    issues.push(...found);

    if (issues.length) {
      problems += issues.length;
      console.log(`✖ ${vp.name} ${path}`);
      for (const i of [...new Set(issues)]) console.log(`    ${i}`);
    } else {
      console.log(`✓ ${vp.name} ${path}`);
    }
    await page.close();
  }
}
await browser.close();
console.log(problems ? `\n${problems} problem(s) on ${SITE}` : `\nAll clear on ${SITE}`);
process.exit(problems ? 1 : 0);
