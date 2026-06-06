import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/layout/PageShell";
import Breadcrumb from "@/components/ui/Breadcrumb";
import { EventCard, CtaBanner } from "@/components/ui/Cards";
import Reveal from "@/components/ui/Reveal";
import { getSisterEvents } from "@/data/events";
import { SOCIAL, WHATSAPP, MEMBERSHIP } from "@/lib/social";

export const metadata: Metadata = { title: "Sisters' Section", description: "Aston ISOC Sisters' Section — dedicated events, halaqa circles, and a welcoming community for Muslim sisters at Aston." };

const PROGRAMMES = [
  { icon: "📖", title: "Weekly Halaqa", desc: "Sisters-only Islamic study circle exploring Seerah, Qur'an, and contemporary topics. Every Tuesday at 12:00." },
  { icon: "☕", title: "Monthly Brunch", desc: "Casual sisters' social brunch — a relaxed space to connect and build genuine friendships." },
  { icon: "🌸", title: "Wellbeing Circle", desc: "A safe, private space to discuss mental health, faith, and university life." },
  { icon: "💼", title: "Careers Mentorship", desc: "Connecting sisters with Muslim women professionals for mentorship and networking." },
  { icon: "🤲", title: "Charity Projects", desc: "Sisters-led fundraising and community service initiatives throughout the year." },
  { icon: "📱", title: "Private WhatsApp", desc: "Sisters-only announcements and community group — join via the link below." },
];

export default function SistersPage() {
  const sistersEvents = getSisterEvents().slice(0, 3);

  return (
    <div style={{ background: "transparent", minHeight: "100vh", paddingTop: "5rem" }}>
      {/* Section hero */}
      <div
        className="relative overflow-hidden py-20 px-4"
        style={{ background: "linear-gradient(160deg, rgba(244,114,182,0.06) 0%, rgba(7,17,29,0.98) 60%)" }}
      >
        <div className="glow-orb absolute" style={{ width: 500, height: 500, top: -100, right: -100, background: "radial-gradient(circle, rgba(244,114,182,0.06) 0%, transparent 70%)" }} />
        <div className="container relative z-10">
          <Breadcrumb crumbs={[{ label: "Sisters' Section" }]} />
          <p className="label mb-4" style={{ color: "rgba(249,168,212,0.7)" }}>For Sisters</p>
          <h1 style={{ fontFamily: "var(--font-playfair), var(--font-playfair), 'Playfair Display', Georgia, serif", fontSize: "clamp(2.5rem,6vw,4.5rem)", fontWeight: 300, color: "#fff", lineHeight: 1.05, marginBottom: "1rem" }}>
            Sisters&apos;<br /><em style={{ color: "#f9a8d4" }}>Section</em>
          </h1>
          <span className="gold-rule" />
          <p className="max-w-lg leading-relaxed mb-8" style={{ color: "#9CA3AF", fontFamily: "var(--font-dm), var(--font-dm), 'DM Sans', sans-serif", fontSize: "0.95rem" }}>
            A dedicated, welcoming space for Muslim sisters at Aston. Our Sisters&apos; Section runs its own events, halaqa circles, mentorship programmes, and has a warm, supportive community — led by Aminah &amp; Yusra.
          </p>
          <div className="flex gap-3 flex-wrap">
            <a href={WHATSAPP.sistersFreshers} target="_blank" rel="noopener noreferrer" className="btn-outline-gold" style={{ borderColor: "rgba(249,168,212,0.4)", color: "#f9a8d4", fontSize: "0.72rem" }}>
              Join Sisters WhatsApp
            </a>
            <a href={MEMBERSHIP.join} target="_blank" rel="noopener noreferrer" className="btn-gold" style={{ fontSize: "0.72rem" }}>
              Join ISOC — £5
            </a>
          </div>
        </div>
      </div>

      <div className="container py-16">
        {/* Programmes */}
        <Reveal>
          <p className="label mb-6">Programmes</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-16">
            {PROGRAMMES.map((item) => (
              <div
                key={item.title}
                className="p-6 transition-all duration-200"
                style={{ background: "var(--surface)", border: "1px solid rgba(249,168,212,0.1)", borderRadius: "1rem" }}
              >
                <span className="text-2xl block mb-3">{item.icon}</span>
                <h3 style={{ fontFamily: "var(--font-playfair), var(--font-playfair), 'Playfair Display', Georgia, serif", fontSize: "1.15rem", color: "#fff", marginBottom: "0.5rem" }}>{item.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "#6B7280", fontFamily: "var(--font-dm), var(--font-dm), 'DM Sans', sans-serif" }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </Reveal>

        {/* Events */}
        {sistersEvents.length > 0 && (
          <section className="mb-16">
            <Reveal>
              <div className="flex items-end justify-between mb-6">
                <p className="label">Upcoming Sisters&apos; Events</p>
                <Link href="/events" className="text-xs font-semibold tracking-widest uppercase" style={{ color: "#C9A227", fontFamily: "var(--font-dm), var(--font-dm), 'DM Sans', sans-serif" }}>
                  All Events →
                </Link>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {sistersEvents.map((e) => <EventCard key={e.id} event={e} />)}
              </div>
            </Reveal>
          </section>
        )}

        {/* New Muslim support */}
        <Reveal>
          <div
            className="p-8 mb-16"
            style={{ background: "rgba(52,211,153,0.04)", border: "1px solid rgba(52,211,153,0.15)", borderRadius: "1.5rem" }}
          >
            <p className="label mb-3" style={{ color: "#34D399" }}>New Muslim Support</p>
            <h3 style={{ fontFamily: "var(--font-playfair), var(--font-playfair), 'Playfair Display', Georgia, serif", fontSize: "1.6rem", fontWeight: 300, color: "#fff", marginBottom: "0.75rem" }}>
              A Welcoming Space for Every Sister
            </h3>
            <p className="text-sm leading-relaxed mb-6 max-w-lg" style={{ color: "#9CA3AF", fontFamily: "var(--font-dm), var(--font-dm), 'DM Sans', sans-serif" }}>
              Whether you&apos;re a new Muslim, returning to faith, or simply curious — our sisters&apos; community is patient, warm, and non-judgmental.
            </p>
            <div className="flex gap-3 flex-wrap">
              <Link href="/resources" className="btn-outline-gold" style={{ fontSize: "0.7rem", borderColor: "rgba(52,211,153,0.3)", color: "#6ee7b7" }}>
                New Muslim Resources
              </Link>
              <a href={SOCIAL.instagram} target="_blank" rel="noopener noreferrer" className="btn-ghost" style={{ fontSize: "0.7rem" }}>
                Message @astonisoc
              </a>
            </div>
          </div>
        </Reveal>

        <Reveal>
          <CtaBanner
            title="Join the Sisters&apos; Community"
            description="Membership is £5 for the full year. Access all sisters' events, halaqa circles, and the private community."
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
