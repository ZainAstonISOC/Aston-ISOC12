/**
 * Opens every link on /links (data/links.ts) and reports any that fail.
 * Only when all of them work does it move the "checked" date shown on the
 * page (data/links-checked.json) to today.
 *
 *   npm run links:check                 # site links checked on production
 *   SITE=http://localhost:3000 npm run links:check
 *
 * Instagram and LinkedIn sometimes refuse automated requests (429 / 999).
 * Those are reported as "open by hand" and do not block the date, so open
 * them yourself before trusting it.
 */
import { readFile, writeFile } from "node:fs/promises";

const SITE = (process.env.SITE ?? "https://www.astonisoc.com").replace(/\/$/, "");
const UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140 Safari/537.36";
const BOT_WALLED = [/(^|\.)instagram\.com$/, /(^|\.)linkedin\.com$/];

// data/links.ts imports lib/social.ts through the "@/" alias, which Node
// cannot resolve — so read the values straight from the two source files.
const social = await readFile(new URL("../lib/social.ts", import.meta.url), "utf8");
const links = await readFile(new URL("../data/links.ts", import.meta.url), "utf8");
const constants = Object.fromEntries(
  [...social.matchAll(/export const (\w+) = \{([\s\S]*?)\} as const;/g)].map(([, name, body]) => [
    name,
    Object.fromEntries([...body.matchAll(/(\w+):\s*"([^"]*)"/g)].map(([, k, v]) => [k, v])),
  ]),
);
const items = [...links.matchAll(/label: "([^"]+)",[^}]*href: ([^ }]+)/g)].map(([, label, ref]) => {
  let href = ref.trim().replace(/,$/, "");
  if (href.startsWith('"')) href = JSON.parse(href);
  else {
    const [obj, key] = href.split(".");
    href = constants[obj]?.[key];
    if (!href) throw new Error(`Cannot resolve ${ref} for "${label}"`);
  }
  return { label, href };
});

const failed = [];
const manual = [];
for (const { label, href } of items) {
  const url = href.startsWith("/") ? `${SITE}${href}` : href;
  let status = 0;
  try {
    const res = await fetch(url, { redirect: "follow", headers: { "User-Agent": UA }, signal: AbortSignal.timeout(20_000) });
    status = res.status;
  } catch {
    status = 0; // timeout, DNS or TLS failure
  }
  const host = new URL(url).hostname;
  const ok = status >= 200 && status < 400;
  if (ok) console.log(`ok    ${status}  ${label}`);
  else if (BOT_WALLED.some((re) => re.test(host))) {
    manual.push(`${label}  ${url}`);
    console.log(`hand  ${status || "ERR"}  ${label}`);
  } else {
    failed.push(`${label}  ${url}  (${status || "no response"})`);
    console.log(`FAIL  ${status || "ERR"}  ${label}`);
  }
}

console.log(`\n${items.length} links, ${failed.length} failed, ${manual.length} to open by hand.`);
if (manual.length) console.log(`Open by hand:\n  ${manual.join("\n  ")}`);
if (failed.length) {
  console.log(`Fix these, then run again:\n  ${failed.join("\n  ")}`);
  process.exit(1);
}
const today = new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/London" }).format(new Date());
await writeFile(new URL("../data/links-checked.json", import.meta.url), JSON.stringify({ checked: today }, null, 2) + "\n");
console.log(`All working. data/links-checked.json → ${today}`);
