/**
 * CANONICAL SITE URL
 * ---------------------------------------------------------------
 * Single source for the public origin, used by metadata, the sitemap and
 * robots.txt.
 *
 * astonisoc.com is NOT registered yet. Pointing canonical URLs, Open Graph
 * tags and the sitemap at a domain that does not resolve means search engines
 * cannot index the site and shared links preview against nothing — so the
 * default is the live Vercel origin.
 *
 * When the domain is bought and attached in Vercel, set NEXT_PUBLIC_SITE_URL
 * to "https://astonisoc.com" in the project's environment variables. Nothing
 * else needs to change.
 */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
  "https://aston-isoc-12.vercel.app";
