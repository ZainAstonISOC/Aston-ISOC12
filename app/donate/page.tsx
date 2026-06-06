import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/layout/PageShell";
import Breadcrumb from "@/components/ui/Breadcrumb";
import { PageHeader } from "@/components/ui/Cards";
import Reveal from "@/components/ui/Reveal";
import DonationWidget from "@/components/ui/DonationWidget";
import { getActiveCampaigns } from "@/data/donations";
import { SOCIAL, DONATIONS } from "@/lib/social";

export const metadata: Metadata = {
  title: "Donate",
  description: "Support Aston ISOC — one-time, weekly Jumu'ah giving, or monthly supporter programme. 100% transparent.",
};

const PF = "'Playfair Display', Georgia, serif";
const DM = "'DM Sans', sans-serif";

const JUMMAH_TIERS = [
  { amount: "£1", period: "/week", label: "Small & Consistent", sub: "£52/yr — consistent barakah every Jumu'ah" },
  { amount: "£3", period: "/week", label: "Community Builder",  sub: "£156/yr — funds the weekly halaqa sessions" },
  { amount: "£5", period: "/week", label: "Major Supporter",    sub: "£260/yr — sustains a full lecture series" },
];

const MONTHLY_TIERS = [
  { amount: "£5",  period: "/mo", label: "Sustainer",       sub: "£60/yr — covers event admin & printing",    popular: false },
  { amount: "£10", period: "/mo", label: "Contributor",     sub: "£120/yr — supports charity campaigns",       popular: false },
  { amount: "£20", period: "/mo", label: "Patron",          sub: "£240/yr — funds a major community event",   popular: true  },
  { amount: "£50", period: "/mo", label: "Founding Patron", sub: "£600/yr — sustains ISOC's full programme",  popular: false },
];

const OTHER_WAYS = [
  { title: "Zakat & Sadaqah",  desc: "We work with NZF to ensure correct Zakat distribution." },
  { title: "Gift Aid",         desc: "UK taxpayers can increase their donation by 25% at no extra cost." },
  { title: "Sponsor an Event", desc: "Partner with ISOC by sponsoring a specific event or initiative." },
  { title: "Legacy Giving",    desc: "Consider including Aston ISOC in charitable giving plans." },
];

export default function DonatePage() {
  const active = getActiveCampaigns();

  return (
    <PageShell>
      <Breadcrumb crumbs={[{ label: "Donate" }]} />
      <PageHeader
        label="Support Aston ISOC"
        title="Give with Intention"
        subtitle="Every contribution — however small — helps sustain a thriving Muslim community at Aston University."
      />

      {/* ── ONE-TIME WIDGET ─────────────────────────────────────────────── */}
      <section className="section-wrap">
        <div className="container">
          <Reveal>
            <DonationWidget />
          </Reveal>
        </div>
      </section>

      <div className="section-divider" />

      {/* ── WEEKLY JUMMAH GIVING ────────────────────────────────────────── */}
      <section className="section-wrap">
        <div className="container">
          <Reveal>
            <div style={{ maxWidth: 760 }}>
              <p className="label">Weekly Jumu&apos;ah Giving</p>
              <h2 style={{ fontFamily: PF, fontWeight: 500, color: "#fff", marginBottom: "0.75rem" }}>
                Give Every Jumu&apos;ah
              </h2>
              <span className="gold-rule" />
              <p style={{ fontFamily: DM, color: "var(--text-muted)", lineHeight: 1.8, marginBottom: "2.5rem", maxWidth: 560 }}>
                Every Friday is an opportunity for barakah. Set up a small voluntary weekly contribution to help
                Aston ISOC sustain its community programmes, events, and Islamic education throughout the year.
              </p>
            </div>
          </Reveal>

          <Reveal delay={80}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1.25rem", marginBottom: "2rem" }}>
              {JUMMAH_TIERS.map((t) => (
                <a key={t.label} href={DONATIONS.ramadanFundraiser} target="_blank" rel="noopener noreferrer"
                  className="donation-card"
                  style={{ textAlign: "center", textDecoration: "none", display: "block" }}>
                  <div style={{ fontFamily: PF, fontSize: "2.2rem", fontWeight: 500, color: "var(--gold)", lineHeight: 1, marginBottom: "0.5rem" }}>
                    {t.amount}
                    <span style={{ fontSize: "0.9rem", color: "var(--text-dim)", fontFamily: DM, fontWeight: 400 }}>{t.period}</span>
                  </div>
                  <p style={{ fontFamily: DM, fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--text-primary)", marginBottom: "0.5rem" }}>
                    {t.label}
                  </p>
                  <p style={{ fontFamily: DM, fontSize: "0.75rem", color: "var(--text-dim)", lineHeight: 1.5 }}>
                    {t.sub}
                  </p>
                </a>
              ))}
            </div>
            <p style={{ fontFamily: DM, fontSize: "0.75rem", color: "var(--text-dim)" }}>
              Voluntary — cancel at any time. All contributions go to the ISOC general community fund.
            </p>
          </Reveal>
        </div>
      </section>

      <div className="section-divider" />

      {/* ── MONTHLY SUPPORTER ───────────────────────────────────────────── */}
      <section className="section-wrap">
        <div className="container">
          <Reveal>
            <div style={{ maxWidth: 760 }}>
              <p className="label">Monthly Supporter Programme</p>
              <h2 style={{ fontFamily: PF, fontWeight: 500, color: "#fff", marginBottom: "0.75rem" }}>
                Become a Monthly Supporter
              </h2>
              <span className="gold-rule" />
              <p style={{ fontFamily: DM, color: "var(--text-muted)", lineHeight: 1.8, marginBottom: "2.5rem", maxWidth: 560 }}>
                Monthly supporters are the backbone of ISOC. Your consistent giving means we can plan ahead,
                run better events, and serve more students throughout the year.
              </p>
            </div>
          </Reveal>

          <Reveal delay={80}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1.25rem", marginBottom: "2rem" }}>
              {MONTHLY_TIERS.map((t) => (
                <a key={t.label} href={DONATIONS.ramadanFundraiser} target="_blank" rel="noopener noreferrer"
                  className="donation-card"
                  style={{ textAlign: "center", textDecoration: "none", display: "block", position: "relative" }}>
                  {t.popular && (
                    <div style={{
                      position: "absolute", top: "-1px", left: "50%", transform: "translateX(-50%)",
                      background: "var(--gold)", color: "var(--bg-deep)",
                      fontFamily: DM, fontSize: "0.58rem", fontWeight: 700,
                      letterSpacing: "0.12em", textTransform: "uppercase",
                      padding: "0.25rem 0.85rem", borderRadius: "0 0 var(--radius-sm) var(--radius-sm)",
                      whiteSpace: "nowrap",
                    }}>
                      Most Popular
                    </div>
                  )}
                  <div style={{
                    fontFamily: PF, fontSize: "2.2rem", fontWeight: 500,
                    color: t.popular ? "var(--gold)" : "var(--text-primary)",
                    lineHeight: 1, marginBottom: "0.5rem",
                    marginTop: t.popular ? "1.25rem" : "0",
                  }}>
                    {t.amount}
                    <span style={{ fontSize: "0.9rem", color: "var(--text-dim)", fontFamily: DM, fontWeight: 400 }}>{t.period}</span>
                  </div>
                  <p style={{ fontFamily: DM, fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--text-primary)", marginBottom: "0.5rem" }}>
                    {t.label}
                  </p>
                  <p style={{ fontFamily: DM, fontSize: "0.75rem", color: "var(--text-dim)", lineHeight: 1.5 }}>
                    {t.sub}
                  </p>
                </a>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <div className="section-divider" />

      {/* ── ACTIVE CAMPAIGNS ────────────────────────────────────────────── */}
      {active.length > 0 && (
        <section className="section-wrap">
          <div className="container">
            <Reveal>
              <p className="label">Active Campaigns</p>
              <h2 style={{ fontFamily: PF, fontWeight: 500, color: "#fff", marginBottom: "0.75rem" }}>
                Current Fundraisers
              </h2>
              <span className="gold-rule" />
            </Reveal>
            <Reveal delay={80}>
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                {active.map((c) => (
                  <div key={c.id} className="donation-card"
                    style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1.5rem", flexWrap: "wrap" }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      {c.isFeatured && <span className="badge badge-gold" style={{ marginBottom: "0.75rem", display: "inline-block" }}>Featured</span>}
                      <h3 style={{ fontFamily: PF, fontSize: "1.2rem", fontWeight: 500, color: "#fff", marginBottom: "0.5rem" }}>{c.name}</h3>
                      <p style={{ fontFamily: DM, fontSize: "0.85rem", color: "var(--text-muted)", lineHeight: 1.7 }}>{c.description}</p>
                      {c.organisation && <p style={{ fontFamily: DM, fontSize: "0.72rem", color: "var(--text-dim)", marginTop: "0.5rem" }}>Via {c.organisation}</p>}
                    </div>
                    <a href={c.donationUrl} target="_blank" rel="noopener noreferrer" className="btn-gold" style={{ flexShrink: 0 }}>
                      Donate →
                    </a>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </section>
      )}

      <div className="section-divider" />

      {/* ── OTHER WAYS ──────────────────────────────────────────────────── */}
      <section className="section-wrap">
        <div className="container">
          <Reveal>
            <p className="label">Other Ways to Give</p>
            <h2 style={{ fontFamily: PF, fontWeight: 500, color: "#fff", marginBottom: "0.75rem" }}>
              More Ways to Support
            </h2>
            <span className="gold-rule" />
          </Reveal>
          <Reveal delay={80}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1.25rem", marginBottom: "2rem" }}>
              {OTHER_WAYS.map((item) => (
                <div key={item.title}
                  style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", padding: "1.75rem" }}>
                  <p style={{ fontFamily: DM, fontWeight: 600, color: "var(--text-primary)", marginBottom: "0.5rem" }}>{item.title}</p>
                  <p style={{ fontFamily: DM, fontSize: "0.83rem", color: "var(--text-dim)", lineHeight: 1.7 }}>{item.desc}</p>
                </div>
              ))}
            </div>
            <p style={{ fontFamily: DM, fontSize: "0.78rem", color: "var(--text-dim)", textAlign: "center" }}>
              Questions?{" "}
              <a href={SOCIAL.instagram} target="_blank" rel="noopener noreferrer"
                style={{ color: "var(--gold)" }}>Message @astonisoc on Instagram</a>
            </p>
          </Reveal>
        </div>
      </section>
    </PageShell>
  );
}
