import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/layout/PageShell";
import Breadcrumb from "@/components/ui/Breadcrumb";
import { PageHeader } from "@/components/ui/Cards";
import Reveal from "@/components/ui/Reveal";
import { SOCIAL, WHATSAPP, MEMBERSHIP } from "@/lib/social";

export const metadata: Metadata = { title: "Start Here", description: "New to Aston ISOC? New Muslim? Fresher? This is your starting point." };

const PATHWAYS = [
  { icon: "🌱", title: "I'm a Fresher", desc: "Just arrived at Aston? Find your community, prayer facilities, halal food, and your first events.", href: "/freshers", cta: "Freshers Hub →", accent: "rgba(201,162,39,0.12)", border: "rgba(201,162,39,0.25)" },
  { icon: "🕌", title: "Returning Muslim", desc: "Reconnect with your faith and community through halaqas, events, and WhatsApp groups.", href: "/events", cta: "See Events →", accent: "rgba(99,102,241,0.08)", border: "rgba(99,102,241,0.2)" },
  { icon: "🌙", title: "New Muslim", desc: "Alhamdulillah. We have dedicated support, resources, and a welcoming community for you.", href: "/resources", cta: "New Muslim Resources →", accent: "rgba(52,211,153,0.08)", border: "rgba(52,211,153,0.2)" },
  { icon: "🤝", title: "Curious About Islam", desc: "Welcome. Open conversations, events, and resources for anyone wanting to learn — no pressure.", href: "/blog", cta: "Read Articles →", accent: "rgba(167,139,250,0.08)", border: "rgba(167,139,250,0.2)" },
];

const STEPS = [
  { n: "01", title: "Join ISOC", desc: "£5 membership via Aston SU gives you full access.", href: MEMBERSHIP.join, cta: "Join Now →", external: true },
  { n: "02", title: "Join WhatsApp", desc: "The fastest way to stay updated with events and announcements.", href: WHATSAPP.community, cta: "Join WhatsApp →", external: true },
  { n: "03", title: "Follow Instagram", desc: "@astonisoc — all events, news, and community in one place.", href: SOCIAL.instagram, cta: "Follow →", external: true },
];

const FAQS = [
  { q: "Do I need to be Muslim to attend ISOC events?", a: "Most events are open to everyone. We warmly welcome non-Muslim students to open lectures, social events, and educational talks." },
  { q: "How much does membership cost?", a: "ISOC membership is just £5 for the full academic year, paid through Aston Students' Union." },
  { q: "I missed freshers week — can I still join?", a: "Absolutely. You can join ISOC at any point during the year through Aston SU." },
  { q: "Is there a sisters-only space?", a: "Yes. The Sisters' Section has dedicated events, a weekly halaqa, a private WhatsApp group, and committee members specifically there for sisters." },
  { q: "I'm a new Muslim — what support is available?", a: "We have dedicated resources, a warm and non-judgmental community, and committee members who have been through the same journey." },
  { q: "Where is Friday prayer (Jumu'ah)?", a: "Every Friday during term time — Aston Students' Union Hall (SU Hall). Khutbah 13:30, prayer ~14:00." },
];

export default function StartHerePage() {
  return (
    <PageShell>
      <Breadcrumb crumbs={[{ label: "Start Here" }]} />
      <PageHeader label="Welcome" title="Start Here" subtitle="Whether you're a fresher, new Muslim, returning to faith, or simply curious — this is your starting point." />

      {/* Pathways */}
      <Reveal>
        <p className="label mb-6">Where Do You Want to Start?</p>
        <div className="grid sm:grid-cols-2 gap-4 mb-20">
          {PATHWAYS.map((p) => (
            <div
              key={p.title}
              className="p-7 transition-all duration-200"
              style={{ background: p.accent, border: `1px solid ${p.border}`, borderRadius: "1.25rem" }}
            >
              <span className="text-3xl block mb-4">{p.icon}</span>
              <h3 style={{ fontFamily: "var(--font-playfair), var(--font-playfair), 'Playfair Display', Georgia, serif", fontSize: "1.35rem", color: "#fff", marginBottom: "0.5rem" }}>{p.title}</h3>
              <p className="text-sm leading-relaxed mb-5" style={{ color: "#9CA3AF", fontFamily: "var(--font-dm), var(--font-dm), 'DM Sans', sans-serif" }}>{p.desc}</p>
              <Link href={p.href} className="text-xs font-semibold tracking-widest uppercase" style={{ color: "#C9A227", fontFamily: "var(--font-dm), var(--font-dm), 'DM Sans', sans-serif" }}>{p.cta}</Link>
            </div>
          ))}
        </div>
      </Reveal>

      {/* 3 Steps */}
      <Reveal delay={80}>
        <p className="label mb-6">Get Started in 3 Steps</p>
        <div className="space-y-3 mb-20">
          {STEPS.map((s) => (
            <div
              key={s.n}
              className="flex items-start gap-6 p-6"
              style={{ background: "var(--surface)", border: "1px solid rgba(201,162,39,0.1)", borderRadius: "1rem" }}
            >
              <span style={{ fontFamily: "var(--font-playfair), var(--font-playfair), 'Playfair Display', Georgia, serif", fontSize: "2.5rem", fontWeight: 300, color: "rgba(201,162,39,0.2)", lineHeight: 1, flexShrink: 0, minWidth: 48 }}>
                {s.n}
              </span>
              <div className="flex-1">
                <p className="font-medium mb-1" style={{ color: "#fff", fontFamily: "var(--font-dm), var(--font-dm), 'DM Sans', sans-serif" }}>{s.title}</p>
                <p className="text-sm" style={{ color: "#9CA3AF", fontFamily: "var(--font-dm), var(--font-dm), 'DM Sans', sans-serif" }}>{s.desc}</p>
              </div>
              <a href={s.href} target="_blank" rel="noopener noreferrer"
                className="text-xs font-semibold tracking-widest uppercase shrink-0"
                style={{ color: "#C9A227", fontFamily: "var(--font-dm), var(--font-dm), 'DM Sans', sans-serif" }}>
                {s.cta}
              </a>
            </div>
          ))}
        </div>
      </Reveal>

      {/* FAQ */}
      <Reveal delay={100}>
        <p className="label mb-6">Frequently Asked Questions</p>
        <div className="space-y-2 mb-20">
          {FAQS.map((faq) => (
            <details
              key={faq.q}
              style={{ border: "1px solid rgba(201,162,39,0.1)", borderRadius: "0.75rem", overflow: "hidden" }}
            >
              <summary
                className="flex justify-between items-center px-5 py-4 cursor-pointer font-medium text-sm"
                style={{ color: "#E5E7EB", fontFamily: "var(--font-dm), var(--font-dm), 'DM Sans', sans-serif", listStyle: "none" }}
              >
                {faq.q}
                <span style={{ color: "#C9A227", flexShrink: 0 }}>▾</span>
              </summary>
              <div
                className="px-5 pb-4 text-sm leading-relaxed"
                style={{ color: "#9CA3AF", fontFamily: "var(--font-dm), var(--font-dm), 'DM Sans', sans-serif", borderTop: "1px solid rgba(201,162,39,0.06)" }}
              >
                {faq.a}
              </div>
            </details>
          ))}
        </div>
      </Reveal>

      {/* Support */}
      <Reveal>
        <p className="label mb-5">Need Support?</p>
        <div className="grid sm:grid-cols-3 gap-3">
          {[
            { title: "Sisters' Support", desc: "Contact Aminah (Head Sister) via Instagram DM", href: SOCIAL.instagram },
            { title: "Brothers' Support", desc: "Contact Abdikarim (Head Brother) via Instagram DM", href: SOCIAL.instagram },
            { title: "General Enquiry", desc: "Message @astonisoc — replies within 24h", href: SOCIAL.instagram },
          ].map((s) => (
            <a
              key={s.title}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              className="block p-5 transition-all duration-200"
              style={{ background: "var(--surface)", border: "1px solid rgba(201,162,39,0.08)", borderRadius: "1rem" }}
            >
              <p className="font-medium text-sm mb-1" style={{ color: "#fff", fontFamily: "var(--font-dm), var(--font-dm), 'DM Sans', sans-serif" }}>{s.title}</p>
              <p className="text-xs" style={{ color: "#6B7280", fontFamily: "var(--font-dm), var(--font-dm), 'DM Sans', sans-serif" }}>{s.desc}</p>
            </a>
          ))}
        </div>
      </Reveal>
    </PageShell>
  );
}
