import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/layout/PageShell";

export const metadata: Metadata = { title: "Donation Received — JazakAllah Khayran" };

const PF = "'Playfair Display', Georgia, serif";
const DM = "'DM Sans', sans-serif";

export default function DonationSuccessPage() {
  return (
    <PageShell>
      <div className="max-w-lg mx-auto text-center py-10">
        <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center rounded-full"
          style={{ background: "rgba(52,211,153,0.12)", border: "1px solid rgba(52,211,153,0.3)" }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
            <path d="M5 13l4 4L19 7" stroke="#6ee7b7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <p className="label mb-3">Donation Received</p>
        <h1 style={{ fontFamily: PF, fontSize: "2.5rem", fontWeight: 500, color: "#fff", marginBottom: "1rem" }}>
          JazakAllah Khayran
        </h1>
        <p className="text-sm leading-relaxed mb-3" style={{ color: "#A8A8B3", fontFamily: DM }}>
          Your donation has been received. May Allah accept it from you and multiply its reward.
        </p>
        <p className="italic mb-8 text-sm" style={{ color: "#C9A227", fontFamily: PF }}>
          &ldquo;The believer&apos;s shade on the Day of Resurrection will be their charity.&rdquo;
          <span className="block mt-1 text-xs not-italic tracking-widest uppercase" style={{ color: "#6B6B80", fontFamily: DM }}>
            Prophet Muhammad ﷺ · Tirmidhi
          </span>
        </p>
        <div className="flex gap-3 justify-center flex-wrap">
          <Link href="/" className="btn-gold" style={{ fontSize: "0.72rem" }}>Return Home</Link>
          <Link href="/charity" className="btn-outline-gold" style={{ fontSize: "0.72rem" }}>View Campaigns</Link>
        </div>
      </div>
    </PageShell>
  );
}
