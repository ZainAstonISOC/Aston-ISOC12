import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumb from "@/components/ui/Breadcrumb";
import { EventCard, CtaBanner } from "@/components/ui/Cards";
import Reveal from "@/components/ui/Reveal";
import { getBrotherEvents } from "@/lib/events";
import Icon, { type IconName } from "@/components/ui/Icon";
import { WHATSAPP, MEMBERSHIP } from "@/lib/social";

export const metadata: Metadata = { title: "Brothers' Section", description: "Football, weekly halaqa, speakers, mentoring and the brothers' WhatsApp — the Aston ISOC brotherhood." };

const PROGRAMMES: { icon: IconName; title: string; desc: string }[] = [
  { icon: "football", title: "Football & Sports", desc: "Weekly football sessions, inter-university tournaments, and gym meetups throughout the year." },
  { icon: "book", title: "Brothers' Halaqa", desc: "Weekly study circle Seerah, current affairs, and Qur'an. Every Monday at 18:00." },
  { icon: "mic", title: "Monthly Speakers", desc: "Talks addressing issues relevant to Muslim men today faith, identity, and purpose." },
  { icon: "briefcase", title: "Careers Network", desc: "Connecting brothers with Muslim professionals, employers, and industry mentors." },
  { icon: "handshake", title: "Mentorship", desc: "Senior brothers mentor fresher students through their first year at Aston." },
  { icon: "phone", title: "Brothers' WhatsApp", desc: "Private brotherhood group for announcements, community and organising meetups." },
];

export default async function BrothersPage() {
  const brothersEvents = await getBrotherEvents(3);
  return (
    <div style={{ background: "transparent", minHeight: "100vh" }}>
      <div className="interior-hero" style={{ background: "linear-gradient(160deg, rgba(99,102,241,0.06) 0%, rgba(19,13,40,0.98) 60%)" }}>
        <div className="container relative z-10">
          <Breadcrumb crumbs={[{ label: "Brothers' Section" }]} />
          <p className="eyebrow mb-4" style={{ color: "rgba(165,180,252,0.7)" }}>For Brothers</p>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2.5rem,6vw,4.5rem)", fontWeight: 300, color: "#fff", lineHeight: 1.05, marginBottom: "1rem" }}>
            Brothers&apos;<br /><em style={{ color: "#a5b4fc" }}>Section</em>
          </h1>
          <span className="gold-rule" />
          <p className="max-w-lg leading-relaxed mb-8" style={{ color: "var(--muted)", fontFamily: "'DM Sans', sans-serif", fontSize: "0.95rem" }}>
            Brotherhood, sports, circles, and real community. The Brothers&apos; Section is your home for faith, friendship, and purpose at Aston led by Abdikarim &amp; Shahz.
          </p>
          <div className="flex gap-3 flex-wrap">
            <a href={WHATSAPP.brothersFreshers} target="_blank" rel="noopener noreferrer" className="btn btn-outline-gold" style={{ borderColor: "rgba(165,180,252,0.4)", color: "#a5b4fc" }}>Join Brothers WhatsApp</a>
            <a href={MEMBERSHIP.join} target="_blank" rel="noopener noreferrer" className="btn btn-gold">Join ISOC</a>
          </div>
        </div>
      </div>
      <div className="container py-16">
        <Reveal>
          <h2 className="eyebrow mb-6">Programmes</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-16">
            {PROGRAMMES.map((item) => (
              <div key={item.title} className="card p-6">
                <span className="icon-badge" style={{ color: "#a5b4fc", borderColor: "rgba(129,140,248,0.28)", background: "linear-gradient(135deg, rgba(129,140,248,0.16), rgba(129,140,248,0.04))" }}>
                  <Icon name={item.icon} />
                </span>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.15rem", color: "#fff", marginBottom: "0.5rem" }}>{item.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "var(--muted-2)", fontFamily: "'DM Sans', sans-serif" }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </Reveal>
        {brothersEvents.length > 0 && (
          <section className="mb-16">
            <Reveal>
              <div className="flex items-end justify-between mb-6">
                <p className="eyebrow">Upcoming Brothers&apos; Events</p>
                <Link href="/events" className="text-xs font-semibold tracking-widest uppercase" style={{ color: "#d8af72" }}>All Events →</Link>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {brothersEvents.map((e) => <EventCard key={e.id} event={e} />)}
              </div>
            </Reveal>
          </section>
        )}
        <Reveal>
          <CtaBanner title="Join the Brotherhood" description="Join us register on Aston SU for just £5 for the full year. Access all brothers' events, sports programmes, and the full ISOC community." primaryLabel="Join ISOC" primaryHref={MEMBERSHIP.join} secondaryLabel="View All Events" secondaryHref="/events" />
        </Reveal>
      </div>
    </div>
  );
}
