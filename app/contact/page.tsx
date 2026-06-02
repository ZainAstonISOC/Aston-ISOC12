import type { Metadata } from "next";
import PageShell from "@/components/layout/PageShell";
import Breadcrumb from "@/components/ui/Breadcrumb";
import { PageHeader } from "@/components/ui/Cards";
import Reveal from "@/components/ui/Reveal";
import { SOCIAL, WHATSAPP, CONTACT, igDmLink } from "@/lib/social";

export const metadata: Metadata = { title: "Contact Us", description: "Get in touch with Aston ISOC via Instagram or WhatsApp." };

const ROUTES = [
  { category: "General Enquiry", icon: "💬", primary: igDmLink("astonisoc"), primaryLabel: "DM @astonisoc on Instagram", secondary: WHATSAPP.community, secondaryLabel: "WhatsApp Community" },
  { category: "Sisters", icon: "👩", primary: igDmLink("astonisoc"), primaryLabel: "DM @astonisoc — ask for Aminah", secondary: WHATSAPP.sistersFreshers, secondaryLabel: "Sisters WhatsApp" },
  { category: "Brothers", icon: "👨", primary: igDmLink("astonisoc"), primaryLabel: "DM @astonisoc — ask for Abdikarim", secondary: WHATSAPP.brothersFreshers, secondaryLabel: "Brothers WhatsApp" },
  { category: "Events", icon: "📅", primary: igDmLink("astonisoc"), primaryLabel: "DM @astonisoc — Events", secondary: null, secondaryLabel: null },
  { category: "Charity & Donations", icon: "🤲", primary: igDmLink("astonisoc"), primaryLabel: "DM @astonisoc — Charity Officer", secondary: null, secondaryLabel: null },
  { category: "Sponsorship", icon: "🤝", primary: igDmLink("astonisoc"), primaryLabel: "DM @astonisoc — Partnerships", secondary: null, secondaryLabel: null },
];

export default function ContactPage() {
  return (
    <PageShell>
      <Breadcrumb crumbs={[{ label: "Contact Us" }]} />
      <PageHeader label="Get In Touch" title="Contact Us" subtitle="Instagram DM is the fastest way to reach the team — we reply within 24 hours." />

      {/* Primary channels */}
      <Reveal>
        <div className="grid sm:grid-cols-2 gap-4 mb-16">
          {[
            { icon: "📸", title: "Instagram", sub: "@astonisoc", note: "Primary contact · replies within 24h", href: SOCIAL.instagram, color: "rgba(249,168,212,0.08)", border: "rgba(249,168,212,0.2)" },
            { icon: "💬", title: "WhatsApp Community", sub: "ISOC Community Group", note: "Join for announcements & updates", href: WHATSAPP.community, color: "rgba(52,211,153,0.06)", border: "rgba(52,211,153,0.2)" },
          ].map((c) => (
            <a
              key={c.title}
              href={c.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-5 p-7 transition-all duration-200"
              style={{ background: c.color, border: `1px solid ${c.border}`, borderRadius: "1.25rem" }}
            >
              <span className="text-3xl">{c.icon}</span>
              <div>
                <p className="font-medium" style={{ color: "#fff", fontFamily: "'DM Sans', sans-serif" }}>{c.title}</p>
                <p className="text-sm" style={{ color: "#9CA3AF", fontFamily: "'DM Sans', sans-serif" }}>{c.sub}</p>
                <p className="text-xs mt-1" style={{ color: "#C9A227", fontFamily: "'DM Sans', sans-serif" }}>{c.note}</p>
              </div>
            </a>
          ))}
        </div>
      </Reveal>

      {/* Routing guide */}
      <Reveal delay={100}>
        <p className="label mb-6">Route Your Enquiry</p>
        <div className="grid sm:grid-cols-2 gap-4 mb-16">
          {ROUTES.map((r) => (
            <div key={r.category} className="p-5" style={{ background: "#131629", border: "1px solid rgba(201,162,39,0.1)", borderRadius: "1rem" }}>
              <div className="flex items-center gap-2 mb-3">
                <span>{r.icon}</span>
                <span className="font-medium text-sm" style={{ color: "#fff", fontFamily: "'DM Sans', sans-serif" }}>{r.category}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                <a href={r.primary} target="_blank" rel="noopener noreferrer"
                  className="text-xs px-3 py-1.5 rounded-full transition-colors"
                  style={{ background: "rgba(201,162,39,0.1)", color: "#C9A227", border: "1px solid rgba(201,162,39,0.2)", fontFamily: "'DM Sans', sans-serif" }}>
                  {r.primaryLabel}
                </a>
                {r.secondary && (
                  <a href={r.secondary} target="_blank" rel="noopener noreferrer"
                    className="text-xs px-3 py-1.5 rounded-full"
                    style={{ background: "rgba(52,211,153,0.08)", color: "#6ee7b7", border: "1px solid rgba(52,211,153,0.2)", fontFamily: "'DM Sans', sans-serif" }}>
                    {r.secondaryLabel}
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </Reveal>

      <Reveal delay={150}>
        <div className="text-sm" style={{ color: "#4B5563", fontFamily: "'DM Sans', sans-serif" }}>
          <span style={{ color: "#6B7280" }}>📍 </span>
          {CONTACT.address}
        </div>
      </Reveal>
    </PageShell>
  );
}
