import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/layout/PageShell";
import Breadcrumb from "@/components/ui/Breadcrumb";
import { PageHeader } from "@/components/ui/Cards";
import Reveal from "@/components/ui/Reveal";
import DonationWidget from "@/components/ui/DonationWidget";
import { getActiveCampaigns, getFeaturedCampaign } from "@/data/donations";
import { SOCIAL } from "@/lib/social";

export const metadata: Metadata = {
  title: "Donate",
  description: "Support Aston ISOC — one-time, weekly, or monthly giving. 100% transparent.",
};

const PF = "var(--font-playfair), var(--font-playfair), 'Playfair Display', Georgia, serif";
const DM = "var(--font-dm), var(--font-dm), 'DM Sans', sans-serif";

export default function DonatePage() {
  const active = getActiveCampaigns();
  const featured = getFeaturedCampaign();

  return (
    <PageShell>
      <Breadcrumb crumbs={[{ label: "Charity", href: "/charity" }, { label: "Donate" }]} />
      <PageHeader label="Sadaqah" title="Make a Donation"
        subtitle="Every contribution goes directly to active campaigns. 100% transparent. JazakAllah khayran." />

      {/* ── INTERACTIVE DONATION WIDGET ─────────────────────────────────── */}
      <Reveal>
        <DonationWidget />
      </Reveal>

      {/* ── WEEKLY JUMMAH GIVING ────────────────────────────────────────── */}
      <Reveal delay={80}>
        <div className="my-20 p-10 relative overflow-hidden"
          style={{
            background: "linear-gradient(135deg, rgba(201,162,39,0.07) 0%, rgba(21,25,55,0.95) 100%)",
            border: "1px solid rgba(201,162,39,0.22)",
            borderRadius: "1.5rem",
          }}>
          <div className="absolute inset-0 geo-pattern opacity-20" />
          <div className="relative z-10 max-w-xl">
            <p className="label mb-3">Ongoing Support</p>
            <h2 style={{ fontFamily: PF, fontSize: "clamp(1.8rem,3vw,2.4rem)", fontWeight: 500, color: "#fff", marginBottom: "0.75rem" }}>
              Weekly Jumu&apos;ah Giving
            </h2>
            <span className="gold-rule" />
            <p className="text-sm leading-relaxed mb-6" style={{ color: "#A8A8B3", fontFamily: DM }}>
              Every Jumu&apos;ah is an opportunity for barakah. Set up a small weekly voluntary contribution to help Aston ISOC sustain its community programmes, events, and Islamic education — consistently, throughout the year.
            </p>
            <div className="grid sm:grid-cols-3 gap-3 mb-8">
              {[
                { amount: "£1", period: "/week", label: "Small & Consistent", sub: "£52/year — funds one community event" },
                { amount: "£3", period: "/week", label: "Community Builder", sub: "£156/year — supports weekly halaqa costs" },
                { amount: "£5", period: "/week", label: "Major Supporter", sub: "£260/year — covers full lecture series" },
              ].map((t) => (
                <a
                  key={t.amount}
                  href={featured?.donationUrl ?? "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block p-5 text-center volunteer-card"
                  style={{
                    background: "rgba(19,22,41,0.8)",
                    border: "1px solid rgba(201,162,39,0.2)",
                    borderRadius: "1rem",
                    textDecoration: "none",
                  }}
                >
                  <p style={{ fontFamily: PF, fontSize: "2rem", fontWeight: 500, color: "#C9A227", lineHeight: 1 }}>
                    {t.amount}<span style={{ fontSize: "0.8rem", color: "#6B6B80", fontFamily: DM }}>{t.period}</span>
                  </p>
                  <p className="text-xs font-semibold tracking-widest uppercase mt-2 mb-1" style={{ color: "#EAEAEA", fontFamily: DM }}>{t.label}</p>
                  <p className="text-xs" style={{ color: "#6B6B80", fontFamily: DM }}>{t.sub}</p>
                </a>
              ))}
            </div>
            <p className="text-xs" style={{ color: "#4B4B60", fontFamily: DM }}>
              Voluntary — stop at any time. All contributions go to the ISOC general community fund managed by our Treasurer.
            </p>
          </div>
        </div>
      </Reveal>

      {/* ── ACTIVE CAMPAIGNS ────────────────────────────────────────────── */}
      {active.length > 0 && (
        <Reveal delay={100}>
          <p className="label mb-6">Active Campaigns</p>
          <div className="space-y-4 mb-16">
            {active.map((c) => (
              <div key={c.id} className="flex items-center justify-between gap-6 p-7 hover-l3"
                style={{
                  background: "linear-gradient(135deg, rgba(201,162,39,0.05) 0%, rgba(19,22,41,0.9) 100%)",
                  border: "1px solid rgba(201,162,39,0.18)",
                  borderRadius: "1.125rem",
                }}>
                <div className="flex-1">
                  {c.isFeatured && <span className="badge badge-gold mb-3 inline-block">Featured Campaign</span>}
                  <h3 style={{ fontFamily: PF, fontSize: "1.3rem", fontWeight: 500, color: "#fff", marginBottom: "0.5rem" }}>{c.name}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: "#A8A8B3", fontFamily: DM }}>{c.description}</p>
                  {c.organisation && <p className="text-xs mt-2" style={{ color: "#4B4B60", fontFamily: DM }}>Via {c.organisation}</p>}
                </div>
                <a href={c.donationUrl} target="_blank" rel="noopener noreferrer" className="btn-gold shrink-0" style={{ fontSize: "0.72rem" }}>
                  Donate →
                </a>
              </div>
            ))}
          </div>
        </Reveal>
      )}

      {/* ── OTHER WAYS ──────────────────────────────────────────────────── */}
      <Reveal delay={120}>
        <div className="p-8" style={{ background: "#131629", border: "1px solid rgba(201,162,39,0.1)", borderRadius: "1.5rem" }}>
          <p className="label mb-5">Other Ways to Give</p>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { title: "Zakat & Sadaqah", desc: "We work with NZF to ensure correct Zakat distribution." },
              { title: "Gift Aid", desc: "UK taxpayers can increase their donation by 25% at no extra cost." },
              { title: "Sponsor an Event", desc: "Partner with ISOC by sponsoring a specific event or initiative." },
              { title: "Legacy Giving", desc: "Consider including Aston ISOC in charitable giving plans." },
            ].map((item) => (
              <div key={item.title} className="p-4"
                style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(201,162,39,0.08)", borderRadius: "0.75rem" }}>
                <p className="text-sm font-medium mb-1" style={{ color: "#EAEAEA", fontFamily: DM }}>{item.title}</p>
                <p className="text-xs leading-relaxed" style={{ color: "#6B6B80", fontFamily: DM }}>{item.desc}</p>
              </div>
            ))}
          </div>
          <p className="mt-6 text-xs text-center" style={{ color: "#4B4B60", fontFamily: DM }}>
            Questions?{" "}
            <a href={SOCIAL.instagram} target="_blank" rel="noopener noreferrer" style={{ color: "#C9A227" }}>
              Message @astonisoc on Instagram
            </a>
          </p>
        </div>
      </Reveal>
    </PageShell>
  );
}
