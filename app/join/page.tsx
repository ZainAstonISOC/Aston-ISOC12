import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/layout/PageShell";
import Breadcrumb from "@/components/ui/Breadcrumb";
import Reveal from "@/components/ui/Reveal";
import { MEMBERSHIP, WHATSAPP, SOCIAL } from "@/lib/social";

export const metadata: Metadata = { title: "Join ISOC", description: "Join Aston ISOC for £5 — full year membership. Access all events, WhatsApp groups, and your community." };

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
  { n: "01", title: "Purchase Membership", desc: "Visit Aston SU and search 'Islamic Society' — membership is £5.", href: MEMBERSHIP.join, cta: "Join on Aston SU →", external: true },
  { n: "02", title: "Join the WhatsApp", desc: "Join your brothers' or sisters' freshers group to stay updated.", href: WHATSAPP.community, cta: "Join WhatsApp →", external: true },
  { n: "03", title: "Follow Instagram", desc: "Follow @astonisoc — all events, announcements, and community.", href: SOCIAL.instagram, cta: "Follow @astonisoc →", external: true },
];

export default function JoinPage() {
  return (
    <PageShell>
      <Breadcrumb crumbs={[{ label: "Join ISOC" }]} />

      {/* Hero price */}
      <Reveal>
        <div
          className="relative overflow-hidden p-12 text-center mb-20"
          style={{
            background: "linear-gradient(135deg, rgba(201,162,39,0.08) 0%, rgba(13,30,48,0.95) 100%)",
            border: "1px solid rgba(201,162,39,0.2)",
            borderRadius: "1.5rem",
          }}
        >
          <div className="absolute inset-0 geo-pattern opacity-20" />
          <div className="relative z-10">
            <p className="label mb-4">Membership 2025/26</p>
            <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(4rem,10vw,7rem)", fontWeight: 300, color: "#C9A227", lineHeight: 1 }}>
              £5
            </div>
            <p className="mt-2 mb-6 text-sm tracking-widest uppercase" style={{ color: "#6B7280", fontFamily: "'DM Sans', sans-serif" }}>
              Full Academic Year
            </p>
            <a href={MEMBERSHIP.join} target="_blank" rel="noopener noreferrer" className="btn-gold" style={{ fontSize: "0.78rem" }}>
              Join via Aston SU →
            </a>
          </div>
        </div>
      </Reveal>

      {/* Benefits */}
      <Reveal delay={100}>
        <div className="mb-20">
          <p className="label mb-6">What&apos;s Included</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {BENEFITS.map((b) => (
              <div
                key={b}
                className="flex items-start gap-3 p-4"
                style={{ background: "#131629", border: "1px solid rgba(201,162,39,0.08)", borderRadius: "0.75rem" }}
              >
                <span style={{ color: "#C9A227", flexShrink: 0, marginTop: 2 }}>✦</span>
                <span className="text-sm" style={{ color: "#9CA3AF", fontFamily: "'DM Sans', sans-serif" }}>{b}</span>
              </div>
            ))}
          </div>
        </div>
      </Reveal>

      {/* Discount card */}
      <Reveal delay={120}>
        <div
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 p-7 mb-20"
          style={{ background: "rgba(201,162,39,0.05)", border: "1px solid rgba(201,162,39,0.2)", borderRadius: "1.25rem" }}
        >
          <div>
            <p className="label mb-1">Exclusive Perk</p>
            <p className="font-medium" style={{ color: "#fff", fontFamily: "'DM Sans', sans-serif" }}>ISOC Discount Card 2025/26</p>
            <p className="text-sm mt-1" style={{ color: "#9CA3AF", fontFamily: "'DM Sans', sans-serif" }}>
              Exclusive discounts for members across Birmingham and online.
            </p>
          </div>
          <a
            href={MEMBERSHIP.discountCard}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-outline-gold shrink-0"
            style={{ fontSize: "0.7rem" }}
          >
            View Discounts →
          </a>
        </div>
      </Reveal>

      {/* Steps */}
      <Reveal delay={140}>
        <p className="label mb-8">How to Join</p>
        <div className="space-y-4 mb-20">
          {STEPS.map((s) => (
            <div
              key={s.n}
              className="flex items-start gap-6 p-6"
              style={{ background: "#131629", border: "1px solid rgba(201,162,39,0.1)", borderRadius: "1rem" }}
            >
              <span
                style={{
                  fontFamily: "'Playfair Display', Georgia, serif",
                  fontSize: "2.5rem",
                  fontWeight: 300,
                  color: "rgba(201,162,39,0.25)",
                  lineHeight: 1,
                  flexShrink: 0,
                  minWidth: 50,
                }}
              >
                {s.n}
              </span>
              <div className="flex-1">
                <p className="font-medium mb-1" style={{ color: "#fff", fontFamily: "'DM Sans', sans-serif" }}>{s.title}</p>
                <p className="text-sm" style={{ color: "#9CA3AF", fontFamily: "'DM Sans', sans-serif" }}>{s.desc}</p>
              </div>
              <a
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-semibold tracking-widest uppercase shrink-0 transition-colors"
                style={{ color: "#C9A227", fontFamily: "'DM Sans', sans-serif" }}
              >
                {s.cta}
              </a>
            </div>
          ))}
        </div>
      </Reveal>

      {/* Already a member */}
      <Reveal>
        <div
          className="p-7"
          style={{ background: "#131629", border: "1px solid rgba(201,162,39,0.08)", borderRadius: "1.25rem" }}
        >
          <p className="label mb-3">Already a Member?</p>
          <p className="text-sm mb-5" style={{ color: "#9CA3AF", fontFamily: "'DM Sans', sans-serif" }}>
            Join our WhatsApp community or get in touch on Instagram.
          </p>
          <div className="flex gap-3 flex-wrap">
            <a href={WHATSAPP.brothersFreshers} target="_blank" rel="noopener noreferrer" className="btn-outline-gold" style={{ fontSize: "0.7rem", borderColor: "rgba(165,180,252,0.3)", color: "#a5b4fc" }}>Brothers WhatsApp</a>
            <a href={WHATSAPP.sistersFreshers} target="_blank" rel="noopener noreferrer" className="btn-outline-gold" style={{ fontSize: "0.7rem", borderColor: "rgba(249,168,212,0.3)", color: "#f9a8d4" }}>Sisters WhatsApp</a>
            <a href={SOCIAL.instagram} target="_blank" rel="noopener noreferrer" className="btn-ghost" style={{ fontSize: "0.7rem" }}>Instagram</a>
          </div>
        </div>
      </Reveal>
    </PageShell>
  );
}
