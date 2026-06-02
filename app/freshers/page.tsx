import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumb from "@/components/ui/Breadcrumb";
import { EventCard, CtaBanner } from "@/components/ui/Cards";
import Reveal from "@/components/ui/Reveal";
import { getFeaturedEvents } from "@/data/events";
import { SOCIAL, WHATSAPP, MEMBERSHIP } from "@/lib/social";

export const metadata: Metadata = { title: "Freshers Hub", description: "New to Aston? Prayer rooms, halal food, welcome events, and your ISOC community — all in one place." };

const HALAL_FOOD = [
  { name: "Sultan's Kitchen", type: "Pakistani / Desi", distance: "5 min", notes: "Student lunch deals" },
  { name: "Dixy Chicken", type: "Fried Chicken", distance: "3 min", notes: "Halal certified" },
  { name: "The Yemeni Kitchen", type: "Middle Eastern", distance: "8 min", notes: "Generous portions" },
  { name: "Subway — Digbeth", type: "Sandwiches", distance: "7 min", notes: "Full halal branch" },
  { name: "Co-op (Campus)", type: "Supermarket", distance: "2 min", notes: "Halal certified products" },
  { name: "Birmingham City Centre", type: "Various", distance: "15 min walk", notes: "Extensive halal dining" },
];

const GUIDE = [
  { icon: "💳", title: "Join ISOC — £5", desc: "Full year membership via Aston SU", href: MEMBERSHIP.join, external: true },
  { icon: "👩", title: "Sisters WhatsApp", desc: "Sisters Freshers Group 2025/26", href: WHATSAPP.sistersFreshers, external: true },
  { icon: "👨", title: "Brothers WhatsApp", desc: "Brothers Freshers Group 2025/26", href: WHATSAPP.brothersFreshers, external: true },
  { icon: "🕌", title: "Prayer Times", desc: "Live Birmingham prayer times", href: "/prayer-times", external: false },
  { icon: "📅", title: "Events Calendar", desc: "What's on this term", href: "/events", external: false },
  { icon: "📸", title: "Instagram", desc: "@astonisoc — all the latest", href: SOCIAL.instagram, external: true },
];

export default function FreshersPage() {
  const featuredEvents = getFeaturedEvents();

  return (
    <div style={{ background: "#0D1025", minHeight: "100vh", paddingTop: "5rem" }}>
      {/* Hero */}
      <div
        className="relative overflow-hidden py-20 px-4"
        style={{ background: "linear-gradient(160deg, rgba(201,162,39,0.07) 0%, rgba(7,17,29,0.98) 60%)" }}
      >
        <div className="glow-orb glow-gold absolute" style={{ width: 600, height: 600, top: -100, right: -100, opacity: 0.5 }} />
        <div className="container relative z-10">
          <Breadcrumb crumbs={[{ label: "Freshers Hub" }]} />
          <p className="label mb-4">Welcome to Aston</p>
          <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(2.5rem,6vw,4.5rem)", fontWeight: 300, color: "#fff", lineHeight: 1.05, marginBottom: "1rem" }}>
            Freshers Hub<br /><em style={{ color: "#C9A227" }}>2026</em>
          </h1>
          <span className="gold-rule" />
          <p className="max-w-lg leading-relaxed mb-8" style={{ color: "#9CA3AF", fontFamily: "'DM Sans', sans-serif", fontSize: "0.95rem" }}>
            Starting university is a big step. We&apos;ve made it our mission to ensure every Muslim student at Aston feels welcomed, grounded, and part of a family from day one.
          </p>
          <a href={MEMBERSHIP.join} target="_blank" rel="noopener noreferrer" className="btn-gold" style={{ fontSize: "0.78rem" }}>
            Join ISOC — £5
          </a>
        </div>
      </div>

      <div className="container py-16">
        {/* Coming soon */}
        <Reveal>
          <p className="label mb-6">Freshers Week 2026</p>
          <div className="grid sm:grid-cols-3 gap-4 mb-16">
            {[
              { title: "Freshers Fair Location", desc: "ISOC stall location — stand number and map to follow." },
              { title: "Welcome Week Timetable", desc: "Full schedule of ISOC events during welcome week." },
              { title: "Welcome Pack", desc: "Digital pack — prayer guide, halal map, and key contacts." },
            ].map((item) => (
              <div
                key={item.title}
                className="p-6"
                style={{ border: "1px dashed rgba(201,162,39,0.25)", borderRadius: "1rem", background: "rgba(201,162,39,0.03)" }}
              >
                <p
                  className="text-xs font-semibold tracking-widest uppercase mb-3"
                  style={{ color: "#C9A227", fontFamily: "'DM Sans', sans-serif", background: "rgba(201,162,39,0.1)", display: "inline-block", padding: "0.2rem 0.6rem", borderRadius: "0.25rem" }}
                >
                  Coming Soon
                </p>
                <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "1.1rem", color: "#fff", marginBottom: "0.5rem" }}>{item.title}</h3>
                <p className="text-sm" style={{ color: "#6B7280", fontFamily: "'DM Sans', sans-serif" }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </Reveal>

        {/* Quick start */}
        <Reveal delay={80}>
          <p className="label mb-6">Get Started Now</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-16">
            {GUIDE.map((item) => (
              <Link
                key={item.title}
                href={item.href}
                target={item.external ? "_blank" : undefined}
                rel={item.external ? "noopener noreferrer" : undefined}
                className="block p-5 transition-all duration-200"
                style={{ background: "#131629", border: "1px solid rgba(201,162,39,0.1)", borderRadius: "1rem" }}
              >
                <span className="text-2xl block mb-3">{item.icon}</span>
                <p className="font-medium mb-1" style={{ color: "#fff", fontFamily: "'DM Sans', sans-serif" }}>{item.title}</p>
                <p className="text-xs" style={{ color: "#6B7280", fontFamily: "'DM Sans', sans-serif" }}>{item.desc}</p>
              </Link>
            ))}
          </div>
        </Reveal>

        {/* Discount card */}
        <Reveal>
          <div
            className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 p-7 mb-16"
            style={{ background: "rgba(201,162,39,0.05)", border: "1px solid rgba(201,162,39,0.2)", borderRadius: "1.25rem" }}
          >
            <div>
              <p className="label mb-1">Member Perk</p>
              <p className="font-medium" style={{ color: "#fff", fontFamily: "'DM Sans', sans-serif" }}>ISOC Discount Card 2025/26</p>
              <p className="text-sm mt-1" style={{ color: "#9CA3AF", fontFamily: "'DM Sans', sans-serif" }}>Exclusive discounts for ISOC members across Birmingham and online.</p>
            </div>
            <a href={MEMBERSHIP.discountCard} target="_blank" rel="noopener noreferrer" className="btn-outline-gold shrink-0" style={{ fontSize: "0.7rem" }}>
              View Discounts →
            </a>
          </div>
        </Reveal>

        {/* Halal food */}
        <Reveal>
          <p className="label mb-4">Birmingham Halal Food Guide</p>
          <p className="text-sm mb-5" style={{ color: "#6B7280", fontFamily: "'DM Sans', sans-serif" }}>Closest halal options to campus — always verify certification in-store.</p>
          <div className="overflow-hidden mb-16" style={{ border: "1px solid rgba(201,162,39,0.1)", borderRadius: "1rem" }}>
            {HALAL_FOOD.map((f, i) => (
              <div
                key={f.name}
                className="flex justify-between items-start gap-4 px-6 py-4"
                style={{ borderBottom: i < HALAL_FOOD.length - 1 ? "1px solid rgba(201,162,39,0.06)" : "none" }}
              >
                <div>
                  <p className="text-sm font-medium" style={{ color: "#E5E7EB", fontFamily: "'DM Sans', sans-serif" }}>{f.name}</p>
                  <p className="text-xs mt-0.5" style={{ color: "#6B7280", fontFamily: "'DM Sans', sans-serif" }}>{f.type} · {f.notes}</p>
                </div>
                <span className="text-xs shrink-0" style={{ color: "#4B5563", fontFamily: "'DM Sans', sans-serif" }}>{f.distance}</span>
              </div>
            ))}
          </div>
        </Reveal>

        {/* Events */}
        {featuredEvents.length > 0 && (
          <section className="mb-16">
            <Reveal>
              <p className="label mb-6">Welcome Week Events</p>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {featuredEvents.map((e) => <EventCard key={e.id} event={e} />)}
              </div>
            </Reveal>
          </section>
        )}

        {/* FAQ */}
        <Reveal>
          <p className="label mb-6">Freshers FAQ</p>
          <div className="space-y-2 mb-16">
            {[
              { q: "When do ISOC events start?", a: "Events begin from freshers week in September. Check the Events page for the full schedule." },
              { q: "Is ISOC only for Muslims?", a: "Most events are open to everyone. We warmly welcome non-Muslim students curious about Islam." },
              { q: "How do I join ISOC?", a: "Membership is £5 for the full year via Aston SU. Visit the Join page for the full process." },
              { q: "Is there a sisters-only space?", a: "Yes — dedicated events, private WhatsApp group, and a separate prayer space for sisters." },
              { q: "I missed freshers week — can I still join?", a: "Yes, ISOC is open year-round. Join via Aston SU at any time." },
            ].map((faq) => (
              <details
                key={faq.q}
                className="group"
                style={{ border: "1px solid rgba(201,162,39,0.1)", borderRadius: "0.75rem", overflow: "hidden" }}
              >
                <summary
                  className="flex justify-between items-center px-5 py-4 cursor-pointer font-medium text-sm"
                  style={{ color: "#E5E7EB", fontFamily: "'DM Sans', sans-serif", listStyle: "none" }}
                >
                  {faq.q}
                  <span style={{ color: "#C9A227" }}>▾</span>
                </summary>
                <div
                  className="px-5 pb-4 text-sm leading-relaxed"
                  style={{ color: "#9CA3AF", fontFamily: "'DM Sans', sans-serif", borderTop: "1px solid rgba(201,162,39,0.06)" }}
                >
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </Reveal>

        <Reveal>
          <CtaBanner
            title="Ready to Join Your Community?"
            description="Come to one event, meet one person — and you'll see why Aston ISOC is home."
            primaryLabel="Join ISOC — £5"
            primaryHref={MEMBERSHIP.join}
            secondaryLabel="View Events"
            secondaryHref="/events"
          />
        </Reveal>
      </div>
    </div>
  );
}
