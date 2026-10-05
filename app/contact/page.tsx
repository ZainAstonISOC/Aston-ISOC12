import type { Metadata } from "next";
import PageShell from "@/components/layout/PageShell";
import Breadcrumb from "@/components/ui/Breadcrumb";
import Reveal from "@/components/ui/Reveal";
import Icon from "@/components/ui/Icon";
import { SOCIAL, WHATSAPP, MEMBERSHIP, CONTACT } from "@/lib/social";
import { volunteerCampaigns } from "@/data/volunteers";
import { getJumuah, jamaatList } from "@/lib/jumuah";

export const metadata: Metadata = { title: "Contact & Get Involved", description: "Get in touch with the Aston ISOC committee — Instagram, WhatsApp, LinkedIn, or the contact form." };

const PF = "'Playfair Display', Georgia, serif";
const DM = "'DM Sans', sans-serif";

export default async function ContactPage() {
  const jumuah = await getJumuah();
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

      {/* ── FIND US ONLINE ─────────────────────────────────────────── */}
      <Reveal>
        <div style={{ marginBottom: "1.5rem" }}>
          <p className="eyebrow">Find Us Online</p>
          <h2 style={{ fontFamily: PF, fontSize: "clamp(1.6rem,3vw,2.2rem)", marginBottom: "0.4rem" }}>Connect With Us</h2>
          <div className="gold-rule" />
          <p style={{ fontFamily: DM, color: "var(--muted)", maxWidth: "52ch", lineHeight: 1.7 }}>
            The fastest way to reach us is Instagram. Follow, message, and join our community across these channels.
          </p>
        </div>
      </Reveal>

      <div className="find-us-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1.25rem", marginBottom: "4rem" }}>
        {[
          {
            title: "Instagram", handle: "@astonisoc",
            desc: "Our primary channel for announcements, events, and daily community life.",
            href: SOCIAL.instagram, cta: "Follow us", available: true,
            accent: "rgba(225,48,108,0.12)", border: "rgba(225,48,108,0.3)", iconColor: "#e1306c",
            icon: <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>,
          },
          {
            title: "LinkedIn", handle: "Aston ISOC",
            desc: "Professional updates, alumni network, and careers opportunities.",
            href: SOCIAL.linkedin, cta: "Connect", available: true,
            accent: "rgba(10,102,194,0.12)", border: "rgba(10,102,194,0.3)", iconColor: "#0a66c2",
            icon: <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>,
          },
          {
            title: "WhatsApp", handle: "Brothers' group",
            desc: "Updates and community chat for brothers.",
            href: WHATSAPP.brothersFreshers, cta: "Join Brothers' Group", available: true,
            accent: "rgba(37,211,102,0.12)", border: "rgba(37,211,102,0.3)", iconColor: "#25d366",
            icon: <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>,
          },
          {
            title: "WhatsApp", handle: "Sisters' group",
            desc: "Updates and community chat for sisters.",
            href: WHATSAPP.sistersFreshers, cta: "Join Sisters' Group", available: true,
            accent: "rgba(37,211,102,0.12)", border: "rgba(37,211,102,0.3)", iconColor: "#25d366",
            icon: <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>,
          },
          {
            title: "Email", handle: "Get in touch",
            desc: "Prefer email? Reach the committee directly for formal enquiries and partnerships.",
            href: SOCIAL.instagram, cta: "Contact via Instagram", available: true,
            accent: "rgba(216,175,114,0.1)", border: "rgba(216,175,114,0.3)", iconColor: "#d8af72",
            icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="22" height="22"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 5L2 7"/></svg>,
          },
        ].map((ch, i) => (
          <Reveal key={`${ch.title}-${ch.handle}`} delay={i * 70}>
            <a href={ch.href} target="_blank" rel="noopener noreferrer"
              className="find-us-card"
              style={{
                display: "flex", flexDirection: "column", height: "100%",
                background: ch.accent, border: `1px solid ${ch.border}`,
                borderRadius: "var(--radius)", padding: "1.6rem", textDecoration: "none",
                transition: "transform 0.22s, box-shadow 0.22s",
              }}>
              <div style={{
                width: 48, height: 48, borderRadius: "13px", marginBottom: "1.1rem",
                background: "rgba(255,255,255,0.06)", border: `1px solid ${ch.border}`,
                display: "grid", placeItems: "center", color: ch.iconColor,
              }}>{ch.icon}</div>
              <h3 style={{ fontFamily: PF, color: "#fff", fontSize: "1.2rem", marginBottom: "0.15rem" }}>{ch.title}</h3>
              <p style={{ fontFamily: DM, fontSize: "0.78rem", fontWeight: 600, color: "var(--gold)", letterSpacing: "0.04em", marginBottom: "0.7rem" }}>{ch.handle}</p>
              <p style={{ fontFamily: DM, fontSize: "0.86rem", color: "var(--muted)", lineHeight: 1.65, marginBottom: "1.25rem", flex: 1 }}>{ch.desc}</p>
              <span style={{ fontFamily: DM, fontSize: "0.76rem", fontWeight: 700, color: "var(--gold)", letterSpacing: "0.08em", textTransform: "uppercase" }}>{ch.cta} →</span>
            </a>
          </Reveal>
        ))}
      </div>

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
              <span className="icon-badge" style={{ marginBottom: "0.85rem" }}><Icon name={c.icon} /></span>
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
              { k: "Jumu'ah",   v: `Every Friday, ${jumuah.location}, ${jamaatList(jumuah.jamaats)}` },
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
