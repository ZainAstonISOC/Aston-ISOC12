import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/layout/PageShell";
import Breadcrumb from "@/components/ui/Breadcrumb";
import Reveal from "@/components/ui/Reveal";
import { MEMBERSHIP, WHATSAPP, SOCIAL } from "@/lib/social";

export const metadata: Metadata = { title: "Join ISOC", description: "Join Aston ISOC for £5 full year membership." };

const BENEFITS = [
  "Access to all ISOC events throughout the year",
  "Brothers' and Sisters' dedicated programmes",
  "Free freshers welcome pack",
  "ISOC membership discount card",
  "Weekly halaqa circles and lectures",
  "Access to all charity campaigns",
  "Careers and networking events",
  "WhatsApp community groups",
  "Buddy system for freshers",
  "Voting rights in committee elections",
  "Priority booking for sold-out events",
  "Islamic resources library access",
];

const STEPS = [
  { n: "01", title: "Buy Your Membership", desc: "Go to Aston SU and purchase ISOC membership for £5. This is how you officially join without it you are not yet a member.", href: MEMBERSHIP.join, cta: "Buy Membership on Aston SU →", external: true },
  { n: "02", title: "Join the WhatsApp", desc: "Join your brothers' or sisters' freshers group to stay updated.", href: WHATSAPP.community, cta: "Join WhatsApp →", external: true },
  { n: "03", title: "Follow Instagram", desc: "Follow @astonisoc all events, announcements, and community.", href: SOCIAL.instagram, cta: "Follow @astonisoc →", external: true },
];

export default function JoinPage() {
  return (
    <PageShell>
      <Breadcrumb crumbs={[{ label: "Join ISOC" }]} />
      <Reveal>
        <div className="relative overflow-hidden p-12 text-center mb-20"
          style={{ background: "linear-gradient(135deg, rgba(216,175,114,0.08) 0%, rgba(13,30,48,0.95) 100%)", border: "1px solid rgba(216,175,114,0.2)", borderRadius: "1.5rem" }}>
          <div className="absolute inset-0 geo-pattern opacity-20" />
          <div className="relative z-10">
            <p className="eyebrow mb-4">How to Join</p>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(4rem,10vw,7rem)", fontWeight: 300, color: "#d8af72", lineHeight: 1 }}>£5</div>
            <p className="mt-2 mb-2 text-sm tracking-widest uppercase" style={{ color: "var(--muted-2)", fontFamily: "'DM Sans', sans-serif" }}>Full Academic Year</p><p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.9rem", color: "var(--muted)", marginBottom: "1.5rem", maxWidth: "36ch", margin: "0.5rem auto 1.5rem" }}>Registration is just £5 through Aston SU — a one-off admin fee that covers the whole year.</p>
            <p className="mb-6 text-sm" style={{ color: "var(--muted)", fontFamily: "'DM Sans', sans-serif", maxWidth: "34ch", margin: "0 auto 1.5rem" }}>Membership is purchased through Aston SU. Buying your membership is how you officially join ISOC.</p>
            <a href={MEMBERSHIP.join} target="_blank" rel="noopener noreferrer" className="btn btn-gold">Buy Membership Join ISOC →</a>
          </div>
        </div>
      </Reveal>

      <Reveal delay={100}>
        <div className="mb-20">
          <p className="eyebrow mb-6">What&apos;s Included</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {BENEFITS.map(b => (
              <div key={b} className="flex items-start gap-3 p-4 card">
                <span style={{ color: "#d8af72", flexShrink: 0, marginTop: 2 }}>✦</span>
                <span className="text-sm" style={{ color: "var(--muted)", fontFamily: "'DM Sans', sans-serif" }}>{b}</span>
              </div>
            ))}
          </div>
        </div>
      </Reveal>

      <Reveal delay={120}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 p-7 mb-20"
          style={{ background: "rgba(216,175,114,0.05)", border: "1px solid rgba(216,175,114,0.2)", borderRadius: "1.25rem" }}>
          <div>
            <p className="eyebrow mb-1">Exclusive Perk</p>
            <p className="font-medium" style={{ color: "#fff", fontFamily: "'DM Sans', sans-serif" }}>ISOC Discount Card 2025/26</p>
            <p className="text-sm mt-1" style={{ color: "var(--muted)", fontFamily: "'DM Sans', sans-serif" }}>Exclusive discounts for members across Birmingham and online.</p>
          </div>
          <a href={MEMBERSHIP.discountCard} target="_blank" rel="noopener noreferrer" className="btn btn-outline-gold shrink-0">View Discounts →</a>
        </div>
      </Reveal>

      <Reveal delay={140}>
        <p className="eyebrow mb-8">How to Join</p>
        <div className="space-y-4 mb-20">
          {STEPS.map(s => (
            <div key={s.n} className="flex items-start gap-6 p-6 card">
              <span style={{ fontFamily: "'Playfair Display', serif", fontSize: "2.5rem", fontWeight: 300, color: "rgba(216,175,114,0.25)", lineHeight: 1, flexShrink: 0, minWidth: 50 }}>{s.n}</span>
              <div className="flex-1">
                <p className="font-medium mb-1" style={{ color: "#fff", fontFamily: "'DM Sans', sans-serif" }}>{s.title}</p>
                <p className="text-sm" style={{ color: "var(--muted)", fontFamily: "'DM Sans', sans-serif" }}>{s.desc}</p>
              </div>
              <a href={s.href} target="_blank" rel="noopener noreferrer" className="text-xs font-semibold tracking-widest uppercase shrink-0" style={{ color: "#d8af72", fontFamily: "'DM Sans', sans-serif" }}>{s.cta}</a>
            </div>
          ))}
        </div>
      </Reveal>

      <Reveal>
        <div className="p-7 card">
          <p className="eyebrow mb-3">Already a Member?</p>
          <p className="text-sm mb-5" style={{ color: "var(--muted)", fontFamily: "'DM Sans', sans-serif" }}>Join our WhatsApp community or get in touch on Instagram.</p>
          <div className="flex gap-3 flex-wrap">
            <a href={WHATSAPP.brothersFreshers} target="_blank" rel="noopener noreferrer" className="btn btn-outline-gold" style={{ borderColor: "rgba(165,180,252,0.3)", color: "#a5b4fc" }}>Brothers WhatsApp</a>
            <a href={WHATSAPP.sistersFreshers} target="_blank" rel="noopener noreferrer" className="btn btn-outline-gold" style={{ borderColor: "rgba(249,168,212,0.3)", color: "#f9a8d4" }}>Sisters WhatsApp</a>
            <a href={SOCIAL.instagram} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">Instagram</a>
          </div>
        </div>
      </Reveal>
    </PageShell>
  );
}
