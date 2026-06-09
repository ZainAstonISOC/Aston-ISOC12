import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/layout/PageShell";

export const metadata: Metadata = { title: "Donation Cancelled" };
const PF = "'Playfair Display', Georgia, serif";
const DM = "'DM Sans', sans-serif";

export default function DonationCancelPage() {
  return (
    <PageShell>
      <section style={{ minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ maxWidth: "560px", margin: "0 auto", textAlign: "center", padding: "4rem 2rem" }}>
          <div className="status-icon-wrap status-icon-cancel">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </div>
          <h1 style={{ fontFamily: PF, fontSize: "clamp(1.8rem,4vw,2.6rem)", color: "#fff", marginBottom: "1rem" }}>No Payment Taken</h1>
          <span className="gold-rule" style={{ margin: "0 auto 1.75rem" }} />
          <p style={{ fontFamily: DM, color: "var(--muted)", lineHeight: 1.8, marginBottom: "0.75rem" }}>Your donation was not completed and no payment has been taken. If you encountered an issue or changed your mind, that is completely fine.</p>
          <p style={{ fontFamily: DM, fontSize: "0.85rem", color: "var(--muted-2)", marginBottom: "2.5rem" }}>Whenever you&apos;re ready, we&apos;d be honoured to receive your support.</p>
          <div className="card" style={{ padding: "1.5rem 2rem", marginBottom: "2.5rem" }}>
            <p style={{ fontFamily: PF, fontStyle: "italic", color: "#d8af72", lineHeight: 1.7, fontSize: "0.95rem" }}>&ldquo;The best of people are those most beneficial to people.&rdquo;</p>
            <p style={{ fontFamily: DM, fontSize: "0.72rem", color: "var(--muted-2)", marginTop: "0.5rem" }}>Prophet Muhammad ﷺ</p>
          </div>
          <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/donate" className="btn btn-gold">Try Again</Link>
            <Link href="/" className="btn btn-outline-gold">Return Home</Link>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
