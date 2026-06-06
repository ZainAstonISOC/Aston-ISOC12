import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/layout/PageShell";

export const metadata: Metadata = {
  title: "Thank You — Donation Confirmed",
  description: "JazakAllah khayran. Your donation to Aston ISOC has been received.",
};

const PF = "'Playfair Display', Georgia, serif";
const DM = "'DM Sans', sans-serif";

export default function DonationSuccessPage() {
  return (
    <PageShell>
      <section style={{ minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ maxWidth: "560px", margin: "0 auto", textAlign: "center", padding: "4rem 2rem" }}>

          <div className="status-icon-wrap status-icon-success">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none"
              stroke="#34d399" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>

          <p style={{ fontFamily: PF, fontSize: "1.3rem", color: "var(--gold)", marginBottom: "0.5rem", direction: "rtl" }}>
            جَزَاكَ اللَّهُ خَيْرًا
          </p>

          <h1 style={{ fontFamily: PF, fontSize: "clamp(1.8rem, 4vw, 2.6rem)", color: "var(--white)", marginBottom: "1rem" }}>
            JazakAllah Khayran
          </h1>

          <span className="gold-rule" style={{ margin: "0 auto 1.75rem" }} />

          <p style={{ fontFamily: DM, color: "var(--text-muted)", lineHeight: 1.8, marginBottom: "0.75rem" }}>
            Your donation has been received and will go directly towards supporting the Aston ISOC community.
            May Allah accept it from you and multiply its reward.
          </p>
          <p style={{ fontFamily: DM, fontSize: "0.85rem", color: "var(--text-dim)", marginBottom: "2.5rem" }}>
            A confirmation receipt has been sent to your email address.
          </p>

          <div style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius-lg)",
            padding: "1.5rem 2rem",
            marginBottom: "2.5rem",
          }}>
            <p style={{ fontFamily: PF, fontStyle: "italic", color: "var(--gold-pale)", lineHeight: 1.7, fontSize: "0.95rem" }}>
              &ldquo;Charity does not decrease wealth.&rdquo;
            </p>
            <p style={{ fontFamily: DM, fontSize: "0.72rem", color: "var(--text-dim)", marginTop: "0.5rem", letterSpacing: "0.08em" }}>
              — Prophet Muhammad ﷺ · Sahih Muslim
            </p>
          </div>

          <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/" className="btn-gold">Return Home</Link>
            <Link href="/donate" className="btn-outline-gold">Give Again</Link>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
