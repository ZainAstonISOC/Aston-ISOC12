import type { NextConfig } from "next";
import { SITE_URL, VERCEL_PRODUCTION_HOST } from "./lib/site";

const nextConfig: NextConfig = {
  // Once NEXT_PUBLIC_SITE_URL points at the custom domain, anyone landing on the
  // old vercel.app production address is sent to the same path on the domain.
  // Matches the production host exactly, so preview deployments are untouched.
  // 307 rather than 308 on purpose: browsers cache a 308 forever, so if the
  // domain ever had a problem, returning visitors would be stuck. Switch to
  // permanent once the domain has been stable for a few weeks.
  async redirects() {
    const siteHost = new URL(SITE_URL).host;
    if (siteHost === VERCEL_PRODUCTION_HOST) return [];
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: VERCEL_PRODUCTION_HOST }],
        destination: `${SITE_URL}/:path*`,
        permanent: false,
      },
    ];
  },

  // Security headers — applied to all routes
  async headers() {
    return [
      {
        // The Daily Ayah service worker must never be served stale.
        source: "/sw.js",
        headers: [{ key: "Cache-Control", value: "no-cache, no-store, must-revalidate" }],
      },
      {
        // The homepage film is a few MB and rarely changes. A day fresh, then a
        // week of serving the cached copy while a re-render is fetched.
        source: "/hero/:file*",
        headers: [{ key: "Cache-Control", value: "public, max-age=86400, stale-while-revalidate=604800" }],
      },
      {
        source: "/:path*",
        headers: [
          // Prevent clickjacking
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          // Prevent MIME-type sniffing
          { key: "X-Content-Type-Options", value: "nosniff" },
          // Control referrer information
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          // Restrict browser features
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), interest-cohort=()" },
          // Enforce HTTPS
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
          // Content Security Policy — allows self, Google Fonts, YouTube thumbnails, Stripe, Aladhan API
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com",
              // Instagram media is served from Meta's CDNs
              "img-src 'self' data: https://i.ytimg.com https://*.ytimg.com https://*.cdninstagram.com https://*.fbcdn.net",
              // Recitation audio comes from quran.com's CDN (and its quranicaudio
              // mirror for some reciters) and is kept for offline use
              "connect-src 'self' https://api.aladhan.com https://verses.quran.com https://mirrors.quranicaudio.com",
              "media-src 'self' blob: data: https://verses.quran.com https://mirrors.quranicaudio.com",
              "worker-src 'self'",
              // TellSafe hosts the embedded community feedback form
              "frame-src https://www.youtube.com https://buy.stripe.com https://www.tellsafe.app",
              "form-action 'self' https://buy.stripe.com",
              "frame-ancestors 'self'",
              "base-uri 'self'",
              "object-src 'none'",
            ].join("; "),
          },
        ],
      },
    ];
  },
};

export default nextConfig;
