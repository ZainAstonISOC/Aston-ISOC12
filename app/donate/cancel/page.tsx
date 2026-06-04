import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/layout/PageShell";

export const metadata: Metadata = { title: "Donation Cancelled" };

const PF = "'Playfair Display', Georgia, serif";
const DM = "'DM Sans', sans-serif";

export default function DonationCancelPage() {
  return (
    <PageShell>
      <div className="max-w-lg mx-auto text-center py-10">
        <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center rounded-full"
          style={{ background: "rgba(201,162,39,0.08)", border: "1px solid rgba(201,162,39,0.2)" }}>
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <path d="M14 3C8.477 3 4 7.477 4 13s4.477 10 10 10c1.43 0 2.795-.3 4.03-.84C15.72 23.42 13.19 24 10.5 24 5.253 24 1 19.747 1 14.5S5.253 5 10.5 5c.92 0 1.81.12 2.66.35A9.95 9.95 0 0014 3z" fill="#C9A227" opacity="0.7"/>
          </svg>
        </div>
        <p className="label mb-3">No problem</p>
        <h1 style={{ fontFamily: PF, fontSize: "2.5rem", fontWeight: 500, color: "#fff", marginBottom: "1rem" }}>
          Donation Cancelled
        </h1>
        <p className="text-sm leading-relaxed mb-8" style={{ color: "#A8A8B3", fontFamily: DM }}>
          No payment was taken. Whenever you&apos;re ready, we&apos;re here — even the smallest sadaqah carries great reward.
        </p>
        <div className="flex gap-3 justify-center flex-wrap">
          <Link href="/donate" className="btn-gold" style={{ fontSize: "0.72rem" }}>Try Again</Link>
          <Link href="/" className="btn-ghost" style={{ fontSize: "0.72rem" }}>Return Home</Link>
        </div>
      </div>
    </PageShell>
  );
}
