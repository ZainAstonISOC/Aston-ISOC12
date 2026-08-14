import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Security headers — applied to all routes
  async headers() {
    return [
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
              "connect-src 'self' https://api.aladhan.com",
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
