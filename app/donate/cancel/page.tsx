import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/layout/PageShell";

export const metadata: Metadata = {
  title: "Donation Cancelled",
  description: "Your donation was not completed. No payment was taken.",
};

const PF = "'Playfair Display', Georgia, serif";
const DM = "'DM Sans', sans-serif";

export default function DonationCancelPage() {
  return (
    <PageShell>
      <section style={{ minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ maxWidth: "560px", margin: "0 auto", textAlign: "center", padding: "4rem 2rem" }}>

          <div className="status-icon-wrap status-icon-cancel">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none"
              stroke="var(--gold)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </div>

          <h1 style={{ fontFamily: PF, fontSize: "clamp(1.8rem, 4vw, 2.6rem)", color: "var(--white)", marginBottom: "1rem" }}>
            No Payment Taken
          </h1>

          <span className="gold-rule" style={{ margin: "0 auto 1.75rem" }} />

          <p style={{ fontFamily: DM, color: "var(--text-muted)", lineHeight: 1.8, marginBottom: "0.75rem" }}>
            Your donation was not completed and no payment has been taken.
            If you encountered an issue or changed your mind, that is completely fine.
          </p>
          <p style={{ fontFamily: DM, fontSize: "0.85rem", color: "var(--text-dim)", marginBottom: "2.5rem" }}>
            Whenever you&apos;re ready, we&apos;d be honoured to receive your support.
          </p>

          <div style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius-lg)",
            padding: "1.5rem 2rem",
            marginBottom: "2.5rem",
          }}>
            <p style={{ fontFamily: PF, fontStyle: "italic", color: "var(--gold-pale)", lineHeight: 1.7, fontSize: "0.95rem" }}>
              &ldquo;The best of people are those most beneficial to people.&rdquo;
            </p>
            <p style={{ fontFamily: DM, fontSize: "0.72rem", color: "var(--text-dim)", marginTop: "0.5rem", letterSpacing: "0.08em" }}>
              — Prophet Muhammad ﷺ
            </p>
          </div>

          <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/donate" className="btn-gold">Try Again</Link>
            <Link href="/" className="btn-outline-gold">Return Home</Link>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
