import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/layout/PageShell";
import Breadcrumb from "@/components/ui/Breadcrumb";
import Reveal from "@/components/ui/Reveal";
import { SOCIAL, WHATSAPP, MEMBERSHIP, CONTACT } from "@/lib/social";
import { volunteerCampaigns } from "@/data/volunteers";

export const metadata: Metadata = { title: "Contact & Get Involved" };

const PF = "'Playfair Display', Georgia, serif";
const DM = "'DM Sans', sans-serif";

export default function ContactPage() {
  const campaigns = volunteerCampaigns.filter(c => c.status !== "archived");
  return (
    <PageShell>
      <Breadcrumb crumbs={[{ label: "Contact & Get Involved" }]} />
      <div style={{ maxWidth: 680, marginBottom: "3.5rem" }}>
        <p className="eyebrow">Contact</p>
        <h1 style={{ fontFamily: PF, fontWeight: 600 }}>Get in Touch</h1>
        <div className="gold-rule" />
        <p className="lede" style={{ color: "var(--muted)", fontFamily: DM }}>
          Whether you want to join, volunteer, ask a question, or collaborate, we would love to hear from you.
        </p>
      </div>

      <Reveal>
        <div className="grid cols-3" style={{ marginBottom: "4rem" }}>
          {[
            { icon: "📸", title: "Instagram", sub: "@astonisoc", desc: "Our primary channel. DM us for quick questions, announcements, and all things ISOC.", href: SOCIAL.instagram, cta: "Message us" },
            { icon: "💬", title: "WhatsApp",  sub: "Community groups", desc: "Join the brothers or sisters WhatsApp group for daily updates, prayer times, and community chat.", href: WHATSAPP.community, cta: "Join WhatsApp" },
            { icon: "🔗", title: "Linktree",  sub: "All official links", desc: "Every official ISOC link in one place, from membership to donation campaigns.", href: SOCIAL.linktree, cta: "View all links" },
          ].map((ch, i) => (
            <Reveal key={ch.title} delay={i * 80}>
              <a href={ch.href} target="_blank" rel="noopener noreferrer" className="card link block" style={{ textDecoration: "none" }}>
                <span style={{ fontSize: "2rem", display: "block", marginBottom: "0.85rem" }}>{ch.icon}</span>
                <h3 style={{ fontFamily: PF, color: "#fff", fontSize: "1.2rem", marginBottom: "0.15rem" }}>{ch.title}</h3>
                <p style={{ fontFamily: DM, fontSize: "0.78rem", fontWeight: 600, color: "var(--gold)", letterSpacing: "0.06em", marginBottom: "0.6rem" }}>{ch.sub}</p>
                <p style={{ fontFamily: DM, fontSize: "0.88rem", color: "var(--muted)", lineHeight: 1.7, marginBottom: "1.2rem" }}>{ch.desc}</p>
                <span style={{ fontFamily: DM, fontSize: "0.78rem", fontWeight: 600, color: "var(--gold)", letterSpacing: "0.08em", textTransform: "uppercase" }}>{ch.cta} →</span>
              </a>
            </Reveal>
          ))}
        </div>
      </Reveal>

      <Reveal>
        <div className="card" style={{ background: "rgba(216,175,114,0.05)", border: "1px solid rgba(216,175,114,0.22)", marginBottom: "1.5rem" }}>
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "2rem" }}>
            <div>
              <p className="eyebrow">Membership</p>
              <h2 style={{ fontFamily: PF, fontSize: "1.8rem", marginBottom: "0.6rem" }}>Join ISOC</h2>
              <p style={{ fontFamily: DM, color: "var(--muted)", maxWidth: "48ch", lineHeight: 1.75 }}>
                £5 for the full academic year. Access all events, both WhatsApp communities, the student discount card, and a lifelong network.
              </p>
            </div>
            <a href={MEMBERSHIP.join} target="_blank" rel="noopener noreferrer" className="btn btn-gold btn-lg">Become a Member £5</a>
          </div>
        </div>
      </Reveal>

      <Reveal delay={80}>
        <div style={{ marginTop: "4rem", marginBottom: "2rem" }}>
          <p className="eyebrow">Volunteering</p>
          <h2 style={{ fontFamily: PF, fontSize: "clamp(1.8rem,3vw,2.4rem)", marginBottom: "0.5rem" }}>We Need You</h2>
          <div className="gold-rule" />
          <p style={{ fontFamily: DM, color: "var(--muted)", maxWidth: "56ch", lineHeight: 1.75, marginBottom: "2.5rem" }}>
            Aston ISOC runs on its volunteers. Every campaign, every event, every initiative is powered by students who give their time for the sake of their community.
          </p>
        </div>
      </Reveal>

      <div className="grid cols-3" style={{ marginBottom: "3rem" }}>
        {campaigns.map((c, i) => (
          <Reveal key={c.id} delay={i * 80}>
            <div className="card" style={{ borderColor: "rgba(216,175,114,0.15)" }}>
              <span style={{ fontSize: "2rem", display: "block", marginBottom: "0.85rem" }}>{c.icon}</span>
              <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "0.4rem", flexWrap: "wrap" }}>
                <h3 style={{ fontFamily: PF, fontSize: "1.2rem", color: "#fff" }}>{c.name}</h3>
                <span className={`pill${c.status === "active" ? " live" : ""}`} style={{ fontSize: "0.62rem" }}>
                  {c.status === "active" ? "Recruiting" : "Coming Soon"}
                </span>
              </div>
              <p style={{ fontFamily: DM, fontSize: "0.75rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--gold)", marginBottom: "0.7rem" }}>{c.tagline}</p>
              <p style={{ fontFamily: DM, fontSize: "0.88rem", color: "var(--muted)", lineHeight: 1.7, marginBottom: "1.2rem" }}>{c.description.slice(0,120)}...</p>
              <a href={c.signupUrl ?? SOCIAL.instagram} target="_blank" rel="noopener noreferrer" className="btn btn-gold" style={{ fontSize: "0.78rem", padding: "0.7rem 1.3rem" }}>
                {c.status === "active" ? "Sign Up" : "Express Interest"}
              </a>
            </div>
          </Reveal>
        ))}
      </div>

      <Reveal delay={100}>
        <div className="card" style={{ marginTop: "1rem" }}>
          <p className="eyebrow">Find Us</p>
          <h3 style={{ fontFamily: PF, color: "#fff", fontSize: "1.3rem", marginBottom: "1rem" }}>Aston University, Birmingham</h3>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "1.5rem" }}>
            {[
              { k: "Address",   v: CONTACT.address },
              { k: "Jumu'ah",   v: "Every Friday, Aston Students' Union Hall (SU Hall), 13:30" },
              { k: "Instagram", v: "@astonisoc (primary contact)" },
            ].map(row => (
              <div key={row.k} style={{ minWidth: 200 }}>
                <p style={{ fontFamily: DM, fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--gold)", marginBottom: "0.25rem" }}>{row.k}</p>
                <p style={{ fontFamily: DM, fontSize: "0.88rem", color: "var(--muted)", lineHeight: 1.65 }}>{row.v}</p>
              </div>
            ))}
          </div>
        </div>
      </Reveal>
    </PageShell>
  );
}
