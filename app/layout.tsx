import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  metadataBase: new URL("https://astonisoc.com"),
  title: { default: "Aston ISOC", template: "%s | Aston ISOC" },
  description: "Aston University Islamic Society — Faith, Community, Purpose. Serving Muslim students at Aston University, Birmingham.",
  keywords: ["Aston ISOC", "Islamic Society", "Aston University", "Muslim students", "Birmingham", "prayer times", "halal"],
  authors: [{ name: "Aston ISOC" }],
  openGraph: {
    type: "website",
    locale: "en_GB",
    siteName: "Aston ISOC",
  },
  twitter: { card: "summary_large_image", site: "@astonisoc" },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ background: "#0D1025" }}>
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
