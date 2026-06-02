import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/layout/PageShell";
import Breadcrumb from "@/components/ui/Breadcrumb";
import { EventCard, CtaBanner } from "@/components/ui/Cards";
import Reveal from "@/components/ui/Reveal";
import { getBrotherEvents } from "@/data/events";
import { SOCIAL, WHATSAPP, MEMBERSHIP } from "@/lib/social";

export const metadata: Metadata = { title: "Brothers' Section", description: "Aston ISOC Brothers' Section — sports, halaqa, brotherhood events, and careers for Muslim brothers at Aston." };

const PROGRAMMES = [
  { icon: "⚽", title: "Football & Sports", desc: "Weekly football sessions, inter-university tournaments, and gym meetups throughout the year." },
  { icon: "📖", title: "Brothers' Halaqa", desc: "Weekly study circle — Seerah, current affairs, and Qur'an. Every Monday at 18:00." },
  { icon: "🎙️", title: "Monthly Speakers", desc: "Talks addressing issues relevant to Muslim men today — faith, identity, and purpose." },
  { icon: "💼", title: "Careers Network", desc: "Connecting brothers with Muslim professionals, employers, and industry mentors." },
  { icon: "🤝", title: "Mentorship", desc: "Senior brothers mentor fresher students through their first year at Aston." },
  { icon: "📱", title: "Brothers' WhatsApp", desc: "Private brotherhood group for announcements, community and organising meetups." },
];

export default function BrothersPage() {
  const brothersEvents = getBrotherEvents().slice(0, 3);

  return (
    <div style={{ background: "#0D1025", minHeight: "100vh", paddingTop: "5rem" }}>
      {/* Section hero */}
      <div
        className="relative overflow-hidden py-20 px-4"
        style={{ background: "linear-gradient(160deg, rgba(99,102,241,0.06) 0%, rgba(7,17,29,0.98) 60%)" }}
      >
        <div className="glow-orb absolute" style={{ width: 500, height: 500, top: -100, left: -100, background: "radial-gradient(circle, rgba(99,102,241,0.07) 0%, transparent 70%)" }} />
        <div className="container relative z-10">
          <Breadcrumb crumbs={[{ label: "Brothers' Section" }]} />
          <p className="label mb-4" style={{ color: "rgba(165,180,252,0.7)" }}>For Brothers</p>
          <h1 style={{ fontFamily: "var(--font-playfair), var(--font-playfair), 'Playfair Display', Georgia, serif", fontSize: "clamp(2.5rem,6vw,4.5rem)", fontWeight: 300, color: "#fff", lineHeight: 1.05, marginBottom: "1rem" }}>
            Brothers&apos;<br /><em style={{ color: "#a5b4fc" }}>Section</em>
          </h1>
          <span className="gold-rule" />
          <p className="max-w-lg leading-relaxed mb-8" style={{ color: "#9CA3AF", fontFamily: "var(--font-dm), var(--font-dm), 'DM Sans', sans-serif", fontSize: "0.95rem" }}>
            Brotherhood, sports, circles, and real community. The Brothers&apos; Section is your home for faith, friendship, and purpose at Aston — led by Abdikarim &amp; Shaz.
          </p>
          <div className="flex gap-3 flex-wrap">
            <a href={WHATSAPP.brothersFreshers} target="_blank" rel="noopener noreferrer" className="btn-outline-gold" style={{ borderColor: "rgba(165,180,252,0.4)", color: "#a5b4fc", fontSize: "0.72rem" }}>
              Join Brothers WhatsApp
            </a>
            <a href={MEMBERSHIP.join} target="_blank" rel="noopener noreferrer" className="btn-gold" style={{ fontSize: "0.72rem" }}>
              Join ISOC — £5
            </a>
          </div>
        </div>
      </div>

      <div className="container py-16">
        <Reveal>
          <p className="label mb-6">Programmes</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-16">
            {PROGRAMMES.map((item) => (
              <div
                key={item.title}
                className="p-6 transition-all duration-200"
                style={{ background: "#131629", border: "1px solid rgba(165,180,252,0.1)", borderRadius: "1rem" }}
              >
                <span className="text-2xl block mb-3">{item.icon}</span>
                <h3 style={{ fontFamily: "var(--font-playfair), var(--font-playfair), 'Playfair Display', Georgia, serif", fontSize: "1.15rem", color: "#fff", marginBottom: "0.5rem" }}>{item.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "#6B7280", fontFamily: "var(--font-dm), var(--font-dm), 'DM Sans', sans-serif" }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </Reveal>

        {brothersEvents.length > 0 && (
          <section className="mb-16">
            <Reveal>
              <div className="flex items-end justify-between mb-6">
                <p className="label">Upcoming Brothers&apos; Events</p>
                <Link href="/events" className="text-xs font-semibold tracking-widest uppercase" style={{ color: "#C9A227", fontFamily: "var(--font-dm), var(--font-dm), 'DM Sans', sans-serif" }}>All Events →</Link>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {brothersEvents.map((e) => <EventCard key={e.id} event={e} />)}
              </div>
            </Reveal>
          </section>
        )}

        <Reveal>
          <CtaBanner
            title="Join the Brotherhood"
            description="Membership is £5 for the full year. Access all brothers' events, sports programmes, and the full ISOC community."
            primaryLabel="Join ISOC — £5"
            primaryHref={MEMBERSHIP.join}
            secondaryLabel="View All Events"
            secondaryHref="/events"
          />
        </Reveal>
      </div>
    </div>
  );
}
