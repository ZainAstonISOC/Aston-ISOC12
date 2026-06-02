import type { Metadata } from "next";
import PageShell from "@/components/layout/PageShell";
import Breadcrumb from "@/components/ui/Breadcrumb";
import { PageHeader } from "@/components/ui/Cards";
import Reveal from "@/components/ui/Reveal";
import { sponsors } from "@/data/sponsors";
import { SOCIAL } from "@/lib/social";

export const metadata: Metadata = { title: "Sponsorships & Partners" };
const TIERS = ["gold","silver","bronze","community"] as const;
const TIER_LABELS = { gold:"Gold Partners", silver:"Silver Partners", bronze:"Bronze Partners", community:"Community Partners" };
const TIER_COLOR = { gold:"rgba(201,162,39,0.08)", silver:"rgba(156,163,175,0.06)", bronze:"rgba(251,146,60,0.06)", community:"rgba(99,102,241,0.06)" };
const TIER_BORDER = { gold:"rgba(201,162,39,0.25)", silver:"rgba(156,163,175,0.2)", bronze:"rgba(251,146,60,0.2)", community:"rgba(99,102,241,0.2)" };

export default function SponsorsPage() {
  return (
    <PageShell>
      <Breadcrumb crumbs={[{ label: "About", href: "/about" }, { label: "Sponsors & Partners" }]} />
      <PageHeader label="Partners" title="Sponsorships & Partners" subtitle="We work with organisations that share our values of community, service, and positive impact." />

      {TIERS.map((tier, si) => {
        const list = sponsors.filter((s) => s.tier === tier);
        if (!list.length) return null;
        return (
          <section key={tier} className="mb-14">
            <Reveal delay={si * 50}>
              <div className="mb-5" style={{ borderBottom: "1px solid rgba(201,162,39,0.08)", paddingBottom: "0.75rem" }}>
                <p className="label">{TIER_LABELS[tier]}</p>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {list.map((s) => (
                  <a
                    key={s.id}
                    href={s.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block p-6 transition-all duration-200"
                    style={{ background: TIER_COLOR[tier], border: `1px solid ${TIER_BORDER[tier]}`, borderRadius: "1rem" }}
                  >
                    <p className="font-medium mb-1.5" style={{ color: "#fff", fontFamily: "var(--font-dm), var(--font-dm), 'DM Sans', sans-serif" }}>{s.name}</p>
                    <p className="text-xs leading-relaxed" style={{ color: "#6B7280", fontFamily: "var(--font-dm), var(--font-dm), 'DM Sans', sans-serif" }}>{s.description}</p>
                  </a>
                ))}
              </div>
            </Reveal>
          </section>
        );
      })}

      <Reveal>
        <div className="p-8" style={{ background: "#131629", border: "1px solid rgba(201,162,39,0.15)", borderRadius: "1.5rem" }}>
          <p className="label mb-3">Partner With Us</p>
          <h3 style={{ fontFamily: "var(--font-playfair), var(--font-playfair), 'Playfair Display', Georgia, serif", fontSize: "1.8rem", fontWeight: 300, color: "#fff", marginBottom: "0.75rem" }}>
            Become a Sponsor
          </h3>
          <p className="text-sm leading-relaxed mb-6 max-w-lg" style={{ color: "#9CA3AF", fontFamily: "var(--font-dm), var(--font-dm), 'DM Sans', sans-serif" }}>
            Reach 500+ engaged Muslim students at Aston University. Partner with us for events, digital reach, and community impact.
          </p>
          <div className="grid sm:grid-cols-3 gap-4 mb-6">
            {[
              { tier:"Gold — £500+/yr", perks:["All marketing materials","Event naming rights","Website feature","Social mentions"] },
              { tier:"Silver — £250+/yr", perks:["Website listing","Event mentions","Social shoutout"] },
              { tier:"Bronze — £100+/yr", perks:["Website listing","Social mention"] },
            ].map((t) => (
              <div key={t.tier} className="p-4" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(201,162,39,0.08)", borderRadius: "0.75rem" }}>
                <p className="text-xs font-semibold mb-3" style={{ color: "#C9A227", fontFamily: "var(--font-dm), var(--font-dm), 'DM Sans', sans-serif" }}>{t.tier}</p>
                {t.perks.map((p) => (
                  <p key={p} className="text-xs mb-1.5 flex gap-2" style={{ color: "#6B7280", fontFamily: "var(--font-dm), var(--font-dm), 'DM Sans', sans-serif" }}>
                    <span style={{ color: "#C9A227" }}>✓</span>{p}
                  </p>
                ))}
              </div>
            ))}
          </div>
          <a href={SOCIAL.instagram} target="_blank" rel="noopener noreferrer" className="btn-outline-gold" style={{ fontSize: "0.7rem" }}>
            Enquire via Instagram →
          </a>
        </div>
      </Reveal>
    </PageShell>
  );
}
