/**
 * CANONICAL SITE URL
 * ---------------------------------------------------------------
 * Single source for the public origin, used by metadata, the share card,
 * the sitemap, robots.txt, the vercel.app -> domain redirect in
 * next.config.ts, and the Stripe return URLs.
 *
 * Set in Vercel -> Settings -> Environment Variables (Production):
 *   NEXT_PUBLIC_SITE_URL = https://www.astonisoc.com
 * Use whichever host Vercel shows as primary for the domain (currently www).
 *
 * The value is normalised because it is typed by hand: "www.astonisoc.com"
 * without a scheme once failed every build (new URL() threw inside
 * next.config.ts). A missing scheme gets https://; anything still unparseable
 * stops the build with a message that names the variable.
 */
export const VERCEL_PRODUCTION_HOST = "aston-isoc-12.vercel.app";

export function normaliseSiteUrl(raw: string | undefined): string {
  const value = raw?.trim();
  if (!value) return `https://${VERCEL_PRODUCTION_HOST}`;
  const withScheme = /^https?:\/\//i.test(value) ? value : `https://${value}`;
  let url: URL;
  try {
    url = new URL(withScheme);
  } catch {
    throw new Error(
      `NEXT_PUBLIC_SITE_URL is not a valid URL: "${value}". Expected something like https://www.astonisoc.com`,
    );
  }
  return url.origin;
}

export const SITE_URL = normaliseSiteUrl(process.env.NEXT_PUBLIC_SITE_URL);
