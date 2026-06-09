import type { Metadata } from "next";
import PageShell from "@/components/layout/PageShell";
import Breadcrumb from "@/components/ui/Breadcrumb";
import { PageHeader } from "@/components/ui/Cards";
import Reveal from "@/components/ui/Reveal";
import { sponsors } from "@/data/sponsors";
import { SOCIAL } from "@/lib/social";

export const metadata: Metadata = { title: "Sponsorships & Partners" };

const TIERS = ["gold","silver","bronze","community"] as const;
const TIER_LABELS = { gold: "Gold Partners", silver: "Silver Partners", bronze: "Bronze Partners", community: "Community Partners" };

export default function SponsorsPage() {
  return (
    <PageShell>
      <Breadcrumb crumbs={[{ label: "About", href: "/about" }, { label: "Sponsors & Partners" }]} />
      <PageHeader label="Partners" title="Sponsorships & Partners"
        subtitle="We work with organisations that share our values of community, service, and positive impact." />

      {TIERS.map((tier, si) => {
        const list = sponsors.filter(s => s.tier === tier);
        if (!list.length) return null;
        return (
          <section key={tier} className="mb-14">
            <Reveal delay={si * 50}>
              <div className="mb-5" style={{ borderBottom: "1px solid rgba(216,175,114,0.08)", paddingBottom: "0.75rem" }}>
                <p className="eyebrow">{TIER_LABELS[tier]}</p>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {list.map(s => (
                  <a key={s.id} href={s.website} target="_blank" rel="noopener noreferrer" className="card link block p-6">
                    <p className="font-medium mb-1.5" style={{ color: "#fff", fontFamily: "'DM Sans', sans-serif" }}>{s.name}</p>
                    <p className="text-xs leading-relaxed" style={{ color: "var(--muted-2)", fontFamily: "'DM Sans', sans-serif" }}>{s.description}</p>
                  </a>
                ))}
              </div>
            </Reveal>
          </section>
        );
      })}

      {/* Partner With Us matching design system, no coloured tier boxes */}
      <Reveal>
        <div className="card p-8">
          <p className="eyebrow mb-3">Partner With Us</p>
          <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "1.8rem", fontWeight: 300, color: "#fff", marginBottom: "0.75rem" }}>
            Become a Sponsor
          </h3>
          <p className="text-sm leading-relaxed mb-8 max-w-lg" style={{ color: "var(--muted)", fontFamily: "'DM Sans', sans-serif" }}>
            Reach 1,000+ engaged Muslim students at Aston University. Partner with us for events, digital reach, and community impact.
          </p>
          <div className="grid sm:grid-cols-3 gap-4 mb-8">
            {[
              { tier: "Gold £500+/yr",   perks: ["All marketing materials", "Event naming rights", "Website feature", "Social media mentions"] },
              { tier: "Silver £250+/yr", perks: ["Website listing", "Event mentions", "Social shoutout"] },
              { tier: "Bronze £100+/yr", perks: ["Website listing", "Social mention"] },
            ].map(t => (
              <div key={t.tier} className="p-5" style={{ background: "rgba(216,175,114,0.04)", border: "1px solid rgba(216,175,114,0.12)", borderRadius: "var(--radius-sm)" }}>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.78rem", fontWeight: 700, letterSpacing: "0.06em", color: "#d8af72", marginBottom: "1rem" }}>{t.tier}</p>
                {t.perks.map(p => (
                  <p key={p} className="text-xs mb-1.5 flex gap-2" style={{ color: "var(--muted)", fontFamily: "'DM Sans', sans-serif" }}>
                    <span style={{ color: "#d8af72", flexShrink: 0 }}>✓</span>{p}
                  </p>
                ))}
              </div>
            ))}
          </div>
          <a href={SOCIAL.instagram} target="_blank" rel="noopener noreferrer" className="btn btn-outline-gold">
            Enquire via Instagram →
          </a>
        </div>
      </Reveal>
    </PageShell>
  );
}
