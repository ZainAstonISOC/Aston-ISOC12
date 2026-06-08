import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  metadataBase: new URL("https://astonisoc.com"),
  title: { default: "Aston ISOC", template: "%s | Aston ISOC" },
  description: "Aston University Islamic Society Faith, Community, Excellence. Serving Muslim students at Aston University, Birmingham.",
  keywords: ["Aston ISOC", "Islamic Society", "Aston University", "Muslim students", "Birmingham"],
  authors: [{ name: "Aston ISOC" }],
  openGraph: { type: "website", locale: "en_GB", siteName: "Aston ISOC" },
  twitter: { card: "summary_large_image", site: "@astonisoc" },
  robots: { index: true, follow: true },
  icons: { icon: "/favicon.svg" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,300&family=Noto+Naskh+Arabic:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
