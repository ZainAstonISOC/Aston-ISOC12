/**
 * CANONICAL SITE URL
 * ---------------------------------------------------------------
 * Single source for the public origin, used by metadata, the share card,
 * the sitemap, robots.txt and the Stripe return URLs.
 *
 * astonisoc.com was registered on 2026-10-05 but is not yet attached in
 * Vercel. Until it is, the default stays on the working vercel.app origin —
 * pointing canonical URLs at a domain that does not serve the site yet stops
 * search engines indexing it and breaks shared-link previews.
 *
 * GOING LIVE is one switch, done LAST (after the domain loads the site):
 *   Vercel → Settings → Environment Variables →
 *   NEXT_PUBLIC_SITE_URL = https://astonisoc.com   (Production)  → Redeploy
 *
 * That single variable moves every canonical URL and the share card onto the
 * domain, and turns on the redirect in next.config.ts that sends visitors of
 * the old vercel.app address to astonisoc.com.
 */
export const VERCEL_PRODUCTION_HOST = "aston-isoc-12.vercel.app";

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
  `https://${VERCEL_PRODUCTION_HOST}`;
