/**
 * Runs before every build (npm "prebuild"), locally and on Vercel.
 *
 * Stops the build when a setting is present but malformed, with a message
 * that names the variable — never its value. A typo in a hand-typed setting
 * once failed every build deep inside next.config.ts while production stayed
 * silently on the last good deploy; this makes the cause the first line of
 * the log instead.
 *
 * Missing optional settings only warn: the site is built to work without them.
 */
const env = process.env;
const errors = [];
const warnings = [];
const isProd = env.VERCEL_ENV === "production";

const has = (k) => typeof env[k] === "string" && env[k].trim() !== "";
const httpsUrl = (v) => { try { return new URL(v).protocol === "https:"; } catch { return false; } };

if (has("NEXT_PUBLIC_SITE_URL")) {
  const v = env.NEXT_PUBLIC_SITE_URL.trim();
  const withScheme = /^https?:\/\//i.test(v) ? v : `https://${v}`;
  if (!httpsUrl(withScheme)) errors.push("NEXT_PUBLIC_SITE_URL is not a valid https address (expected like https://www.astonisoc.com).");
}

// Storage: the pair must come together, from either naming scheme.
for (const [url, token] of [["KV_REST_API_URL", "KV_REST_API_TOKEN"], ["UPSTASH_REDIS_REST_URL", "UPSTASH_REDIS_REST_TOKEN"]]) {
  if (has(url) !== has(token)) errors.push(`${has(url) ? token : url} is missing: ${url} and ${token} must both be set, or neither.`);
  if (has(url) && !httpsUrl(env[url].trim())) errors.push(`${url} is not an https address.`);
}
const storage = (has("KV_REST_API_URL") && has("KV_REST_API_TOKEN")) || (has("UPSTASH_REDIS_REST_URL") && has("UPSTASH_REDIS_REST_TOKEN"));
if (isProd && !storage) warnings.push("No Upstash storage connected: the admin panel can't save events or content.");

if (has("ADMIN_PASSWORD")) {
  if (!has("ADMIN_SESSION_SECRET")) errors.push("ADMIN_SESSION_SECRET is missing (ADMIN_PASSWORD is set). Generate one with: openssl rand -hex 32");
  else if (env.ADMIN_SESSION_SECRET.length < 32) errors.push(`ADMIN_SESSION_SECRET is ${env.ADMIN_SESSION_SECRET.length} characters; it needs at least 32.`);
} else if (isProd) {
  warnings.push("ADMIN_PASSWORD is not set: /admin is unavailable.");
}

if (has("ADZUNA_APP_ID") !== has("ADZUNA_APP_KEY")) errors.push("ADZUNA_APP_ID and ADZUNA_APP_KEY must both be set, or neither.");
if (has("QURAN_CLIENT_ID") !== has("QURAN_CLIENT_SECRET")) errors.push("QURAN_CLIENT_ID and QURAN_CLIENT_SECRET must both be set, or neither.");

for (const w of warnings) console.warn(`⚠ env: ${w}`);
if (errors.length) {
  for (const e of errors) console.error(`✖ env: ${e}`);
  console.error("Fix these in Vercel → Settings → Environment Variables (or .env.local), then build again.");
  process.exit(1);
}
console.log(`✓ env: settings look right${warnings.length ? " (see warnings above)" : ""}.`);
