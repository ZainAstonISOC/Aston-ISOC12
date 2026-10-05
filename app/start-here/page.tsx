import type { Metadata } from "next";
import { getJumuah, jamaatList } from "@/lib/jumuah";
import Link from "next/link";
import PageShell from "@/components/layout/PageShell";
import Breadcrumb from "@/components/ui/Breadcrumb";
import { PageHeader } from "@/components/ui/Cards";
import Reveal from "@/components/ui/Reveal";
import Icon, { type IconName } from "@/components/ui/Icon";
import { SOCIAL, WHATSAPP, MEMBERSHIP } from "@/lib/social";

export const metadata: Metadata = { title: "Start Here", description: "New to Aston ISOC? New Muslim? Fresher? This is your starting point." };

const PATHWAYS: { icon: IconName; title: string; desc: string; href: string; cta: string; accent: string; border: string; tint: string }[] = [
  { icon: "seedling", title: "I'm a Fresher", desc: "Just arrived at Aston? Find your community, prayer facilities, halal food, and your first events.", href: "/freshers", cta: "Freshers Hub →", accent: "rgba(216,175,114,0.12)", border: "rgba(216,175,114,0.25)", tint: "#d8af72" },
  { icon: "mosque", title: "Returning Muslim", desc: "Reconnect with your faith and community through halaqas, events, and WhatsApp groups.", href: "/events", cta: "See Events →", accent: "rgba(99,102,241,0.08)", border: "rgba(99,102,241,0.2)", tint: "#a5b4fc" },
  { icon: "moon", title: "New Muslim", desc: "Alhamdulillah. We have dedicated support, resources, and a welcoming community for you.", href: "/resources", cta: "New Muslim Resources →", accent: "rgba(52,211,153,0.08)", border: "rgba(52,211,153,0.2)", tint: "#6ee7b7" },
  { icon: "handshake", title: "Curious About Islam", desc: "Welcome. Open conversations, events, and resources for anyone wanting to learn no pressure.", href: "/resources", cta: "Explore Resources →", accent: "rgba(167,139,250,0.08)", border: "rgba(167,139,250,0.2)", tint: "#ddd6fe" },
];

const STEPS = [
  { n: "01", title: "Buy Your Membership", desc: "Purchase ISOC membership on Aston SU for £5. This is how you officially become a member.", href: MEMBERSHIP.join, cta: "Buy Membership →", external: true },
  { n: "02", title: "Join WhatsApp", desc: "The fastest way to stay updated with events and announcements.", href: WHATSAPP.community, cta: "Join WhatsApp →", external: true },
  { n: "03", title: "Follow Instagram", desc: "@astonisoc all events, news, and community in one place.", href: SOCIAL.instagram, cta: "Follow →", external: true },
];

const FAQS = [
  { q: "Do I need to be Muslim to attend ISOC events?", a: "Most events are open to everyone. We warmly welcome non-Muslim students to open lectures, social events, and educational talks." },
  { q: "How much does membership cost?", a: "ISOC membership is just £5 for the full academic year, paid through Aston Students' Union." },
  { q: "I missed freshers week can I still join?", a: "Absolutely. You can join ISOC at any point during the year through Aston SU." },
  { q: "Is there a sisters-only space?", a: "Yes. The Sisters' Section has dedicated events, a weekly halaqa, a private WhatsApp group, and committee members specifically there for sisters." },
  { q: "I'm a new Muslim what support is available?", a: "We have dedicated resources, a warm and non-judgmental community, and committee members who have been through the same journey." },
];

export default async function StartHerePage() {
  const jumuah = await getJumuah();
  const faqs = [
    ...FAQS,
    {
      q: "Where is Friday prayer (Jumu'ah)?",
      a: `Every Friday during term time at ${jumuah.location}. ${jumuah.jamaats.length > 1 ? `There are ${jumuah.jamaats.length} jamaats: ${jamaatList(jumuah.jamaats)}.` : `It starts at ${jumuah.jamaats[0]}.`}`,
    },
  ];
  return (
    <PageShell>
      <Breadcrumb crumbs={[{ label: "Start Here" }]} />
      <PageHeader label="Welcome" title="Start Here" subtitle="Whether you're a fresher, new Muslim, returning to faith, or simply curious this is your starting point." />

      <Reveal>
        <h2 className="eyebrow mb-6">Where Do You Want to Start?</h2>
        <div className="grid sm:grid-cols-2 gap-4 mb-20">
          {PATHWAYS.map(p => (
            <div key={p.title} className="p-7" style={{ background: p.accent, border: `1px solid ${p.border}`, borderRadius: "var(--radius)" }}>
              <span className="icon-badge" style={{ color: p.tint, borderColor: p.border, background: `linear-gradient(135deg, ${p.accent}, transparent)` }}>
                <Icon name={p.icon} />
              </span>
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.35rem", color: "#fff", marginBottom: "0.5rem" }}>{p.title}</h3>
              <p className="text-sm leading-relaxed mb-5" style={{ color: "var(--muted)", fontFamily: "'DM Sans', sans-serif" }}>{p.desc}</p>
              <Link href={p.href} className="text-xs font-semibold tracking-widest uppercase" style={{ color: "#d8af72", fontFamily: "'DM Sans', sans-serif" }}>{p.cta}</Link>
            </div>
          ))}
        </div>
      </Reveal>

      <Reveal delay={80}>
        <p className="eyebrow mb-6">Get Started in 3 Steps</p>
        <div className="space-y-3 mb-20">
          {STEPS.map(s => (
            <div key={s.n} className="flex items-start gap-6 p-6 card">
              <span style={{ fontFamily: "'Playfair Display', serif", fontSize: "2.5rem", fontWeight: 300, color: "rgba(216,175,114,0.2)", lineHeight: 1, flexShrink: 0, minWidth: 48 }}>{s.n}</span>
              <div className="flex-1">
                <p className="font-medium mb-1" style={{ color: "#fff", fontFamily: "'DM Sans', sans-serif" }}>{s.title}</p>
                <p className="text-sm" style={{ color: "var(--muted)", fontFamily: "'DM Sans', sans-serif" }}>{s.desc}</p>
              </div>
              <a href={s.href} target="_blank" rel="noopener noreferrer" className="text-xs font-semibold tracking-widest uppercase shrink-0" style={{ color: "#d8af72", fontFamily: "'DM Sans', sans-serif" }}>{s.cta}</a>
            </div>
          ))}
        </div>
      </Reveal>

      <Reveal delay={100}>
        <p className="eyebrow mb-6">Frequently Asked Questions</p>
        <div className="space-y-2 mb-20">
          {faqs.map(faq => (
            <details key={faq.q} style={{ border: "1px solid rgba(216,175,114,0.1)", borderRadius: "0.75rem", overflow: "hidden" }}>
              <summary className="flex justify-between items-center px-5 py-4 cursor-pointer font-medium text-sm" style={{ color: "#fff", fontFamily: "'DM Sans', sans-serif", listStyle: "none" }}>
                {faq.q}<span style={{ color: "#d8af72", flexShrink: 0 }}>▾</span>
              </summary>
              <div className="px-5 pb-4 text-sm leading-relaxed" style={{ color: "var(--muted)", fontFamily: "'DM Sans', sans-serif", borderTop: "1px solid rgba(216,175,114,0.06)" }}>{faq.a}</div>
            </details>
          ))}
        </div>
      </Reveal>

      <Reveal>
        <p className="eyebrow mb-5">Need Support?</p>
        <div className="grid sm:grid-cols-3 gap-3">
          {[
            { title: "Sisters' Support",  desc: "Contact Aminah (Head Sister) via Instagram DM",     href: SOCIAL.instagram },
            { title: "Brothers' Support", desc: "Contact Abdikarim (Head Brother) via Instagram DM", href: SOCIAL.instagram },
            { title: "General Enquiry",   desc: "Message @astonisoc replies within 24h",           href: SOCIAL.instagram },
          ].map(s => (
            <a key={s.title} href={s.href} target="_blank" rel="noopener noreferrer" className="block p-5 card">
              <p className="font-medium text-sm mb-1" style={{ color: "#fff", fontFamily: "'DM Sans', sans-serif" }}>{s.title}</p>
              <p className="text-xs" style={{ color: "var(--muted-2)", fontFamily: "'DM Sans', sans-serif" }}>{s.desc}</p>
            </a>
          ))}
        </div>
      </Reveal>
    </PageShell>
  );
}
