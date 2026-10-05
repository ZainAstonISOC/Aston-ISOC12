import type { Metadata, Viewport } from "next";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import LoadingScreen from "@/components/ui/LoadingScreen";
import { SITE_URL } from "@/lib/site";
import { SOCIAL } from "@/lib/social";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: "Aston ISOC", template: "%s | Aston ISOC" },
  description: "Aston University Islamic Society Faith, Community, Excellence. Serving Muslim students at Aston University, Birmingham.",
  keywords: ["Aston ISOC", "Islamic Society", "Aston University", "Muslim students", "Birmingham"],
  authors: [{ name: "Aston ISOC" }],
  openGraph: { type: "website", locale: "en_GB", siteName: "Aston ISOC" },
  // No `site` handle: @astonisoc on X is not a confirmed society account, and
  // attributing every shared link to a stranger's profile is worse than none.
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true },
};

// Colours the browser chrome / status bar on mobile to match the site.
export const viewport: Viewport = {
  themeColor: "#130d28",
};

// Tells Google who the society is, so the domain can earn a knowledge panel
// with the logo and the official social profiles.
const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Aston University Islamic Society",
  alternateName: "Aston ISOC",
  url: SITE_URL,
  logo: `${SITE_URL}/icon.png`,
  sameAs: [SOCIAL.instagram, SOCIAL.linkedin, SOCIAL.linktree],
  address: {
    "@type": "PostalAddress",
    streetAddress: "Aston Triangle",
    addressLocality: "Birmingham",
    postalCode: "B4 7ET",
    addressCountry: "GB",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // `suppressHydrationWarning`: the head script below stamps data-isoc-loaded
    // on <html> before React hydrates, which is a deliberate mismatch.
    // `data-scroll-behavior`: opts smooth scrolling out of route transitions.
    <html lang="en" data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        {/* Flag returning-this-session visitors before paint so the intro loader is hidden instantly (no flash) */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try{if(sessionStorage.getItem('isoc_loaded'))document.documentElement.dataset.isocLoaded='1'}catch(e){}`,
          }}
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,300&family=Noto+Naskh+Arabic:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd).replace(/</g, "\\u003c") }}
        />
        <LoadingScreen />
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
