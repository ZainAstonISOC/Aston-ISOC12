import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/layout/PageShell";
import Breadcrumb from "@/components/ui/Breadcrumb";
import Reveal from "@/components/ui/Reveal";
import { volunteerCampaigns, getActiveCampaigns } from "@/data/volunteers";
import { SOCIAL, MEMBERSHIP } from "@/lib/social";

export const metadata: Metadata = {
  title: "Volunteer — We Need You",
  description: "Volunteer with Aston ISOC. Join Ramadan, Discover Islam Week, and Charity Week campaigns. Make a real impact.",
};

const PF = "'Playfair Display', Georgia, serif";
const DM = "'DM Sans', sans-serif";

const BENEFITS = [
  { icon: "🌱", title: "Real Leadership", desc: "Build genuine leadership skills managing events and people — experience valued by employers." },
  { icon: "🤝", title: "Deep Community", desc: "Form meaningful friendships through shared purpose and working together for something greater." },
  { icon: "📈", title: "CV & Portfolio", desc: "Event management, fundraising, and campaign coordination all strengthen your professional profile." },
  { icon: "🏆", title: "Recognition", desc: "Recognised volunteer certificates and references from the ISOC committee for outstanding volunteers." },
  { icon: "🌍", title: "Real Impact", desc: "Your hours translate directly into community events, funds raised, and lives touched — measurably." },
  { icon: "✨", title: "Spiritual Reward", desc: "Volunteering for the sake of Allah is among the most rewarding actions a Muslim can take." },
];

export default function VolunteerPage() {
  const campaigns = getActiveCampaigns();

  return (
    <div style={{ background: "#0D1025", minHeight: "100vh", paddingTop: "5rem" }}>

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <div className="relative overflow-hidden py-24 px-4"
        style={{ background: "linear-gradient(160deg, rgba(99,91,255,0.08) 0%, rgba(13,16,37,0.98) 55%)" }}>
        <div className="glow-orb glow-purple absolute" style={{ width: 700, height: 700, top: -150, right: -100 }} />
        <div className="glow-orb glow-gold absolute" style={{ width: 400, height: 400, bottom: -50, left: "30%" }} />
        <div className="container relative z-10">
          <Breadcrumb crumbs={[{ label: "Volunteer" }]} />
          <p className="label mb-5">Get Involved</p>
          <h1 style={{ fontFamily: PF, fontSize: "clamp(3rem,7vw,5.5rem)", fontWeight: 500, color: "#fff", lineHeight: 1.02, marginBottom: "1.25rem" }}>
            We Need<br /><em style={{ color: "#C9A227" }}>You.</em>
          </h1>
          <span className="gold-rule" />
          <p className="max-w-xl leading-relaxed mb-10" style={{ color: "#A8A8B3", fontFamily: DM, fontSize: "1.05rem" }}>
            Aston ISOC runs on the dedication of volunteers. Whether it&apos;s Ramadan, Discover Islam Week, or Charity Week — your time, energy and passion directly shape the experience of hundreds of Muslim students.
          </p>
          <div className="flex gap-3 flex-wrap">
            <a href={SOCIAL.instagram} target="_blank" rel="noopener noreferrer" className="btn-gold" style={{ fontSize: "0.75rem" }}>
              Express Interest via Instagram
            </a>
            <a href={MEMBERSHIP.join} target="_blank" rel="noopener noreferrer" className="btn-outline-gold" style={{ fontSize: "0.75rem" }}>
              Join ISOC First
            </a>
          </div>
        </div>
      </div>

      <div className="container py-20">

        {/* ── CAMPAIGNS ─────────────────────────────────────────────────── */}
        <Reveal>
          <p className="label mb-4">Volunteer Campaigns</p>
          <h2 style={{ fontFamily: PF, fontSize: "clamp(1.8rem,3vw,2.6rem)", fontWeight: 500, color: "#fff", marginBottom: "0.5rem" }}>
            Where We Need Help
          </h2>
          <span className="gold-rule" />
        </Reveal>

        <div className="grid md:grid-cols-3 gap-6 mb-24">
          {campaigns.map((c, i) => (
            <Reveal key={c.id} delay={i * 80}>
              <div
                className="h-full flex flex-col p-8 volunteer-card"
                style={{
                  background: c.colour,
                  border: "1px solid rgba(201,162,39,0.15)",
                  borderRadius: "1.375rem",
                }}
              >
                {/* Status badge */}
                <div className="flex items-center justify-between mb-5">
                  <span className="text-3xl">{c.icon}</span>
                  <span
                    className="badge"
                    style={{
                      background: c.status === "active" ? "rgba(52,211,153,0.12)" : "rgba(201,162,39,0.12)",
                      color: c.status === "active" ? "#6ee7b7" : "#EDD882",
                      border: `1px solid ${c.status === "active" ? "rgba(52,211,153,0.25)" : "rgba(201,162,39,0.25)"}`,
                    }}
                  >
                    {c.status === "active" ? "Recruiting Now" : "Coming Soon"}
                  </span>
                </div>

                <h3 style={{ fontFamily: PF, fontSize: "1.5rem", fontWeight: 500, color: "#fff", marginBottom: "0.3rem" }}>
                  {c.name}
                </h3>
                <p className="text-xs font-semibold tracking-widest uppercase mb-4" style={{ color: "#C9A227", fontFamily: DM }}>
                  {c.tagline}
                </p>
                <p className="text-sm leading-relaxed mb-6 flex-1" style={{ color: "#A8A8B3", fontFamily: DM }}>
                  {c.description}
                </p>

                {/* Roles */}
                <div className="mb-5">
                  <p className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: "#6B6B80", fontFamily: DM }}>
                    Roles Available
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {c.roles.map((r) => (
                      <span key={r} className="badge badge-muted" style={{ fontSize: "0.55rem" }}>{r}</span>
                    ))}
                  </div>
                </div>

                {/* Meta */}
                <div className="space-y-1.5 mb-6 text-xs" style={{ color: "#6B6B80", fontFamily: DM }}>
                  <p>⏰ {c.commitment}</p>
                  <p>✦ {c.impact}</p>
                </div>

                <a
                  href={c.signupUrl ?? SOCIAL.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-gold w-full justify-center"
                  style={{ fontSize: "0.72rem" }}
                >
                  {c.status === "active" ? "Sign Up Now" : "Register Interest"}
                </a>
              </div>
            </Reveal>
          ))}
        </div>

        {/* ── BENEFITS ──────────────────────────────────────────────────── */}
        <Reveal>
          <p className="label mb-4">Why Volunteer</p>
          <h2 style={{ fontFamily: PF, fontSize: "clamp(1.8rem,3vw,2.6rem)", fontWeight: 500, color: "#fff", marginBottom: "0.5rem" }}>
            What You Gain
          </h2>
          <span className="gold-rule" />
        </Reveal>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-24">
          {BENEFITS.map((b, i) => (
            <Reveal key={b.title} delay={i * 60}>
              <div
                className="p-6 hover-l1"
                style={{
                  background: "#131629",
                  border: "1px solid rgba(201,162,39,0.1)",
                  borderRadius: "1.125rem",
                }}
              >
                <span className="text-2xl block mb-4">{b.icon}</span>
                <h3 style={{ fontFamily: PF, fontSize: "1.1rem", fontWeight: 500, color: "#fff", marginBottom: "0.5rem" }}>{b.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "#6B6B80", fontFamily: DM }}>{b.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>

        {/* ── HOW IT WORKS ──────────────────────────────────────────────── */}
        <Reveal>
          <div className="p-10 relative overflow-hidden mb-20"
            style={{
              background: "linear-gradient(135deg, rgba(201,162,39,0.06) 0%, rgba(21,25,55,0.95) 100%)",
              border: "1px solid rgba(201,162,39,0.18)",
              borderRadius: "1.5rem",
            }}>
            <div className="absolute inset-0 geo-pattern opacity-20" />
            <div className="relative z-10">
              <p className="label mb-5">How to Get Involved</p>
              <div className="grid sm:grid-cols-3 gap-6">
                {[
                  { n: "01", title: "Become a Member", desc: "Join ISOC for £5 — membership is required for all volunteering roles.", href: MEMBERSHIP.join, external: true, cta: "Join ISOC →" },
                  { n: "02", title: "Express Interest", desc: "DM @astonisoc on Instagram stating which campaign you'd like to volunteer for.", href: SOCIAL.instagram, external: true, cta: "Message Us →" },
                  { n: "03", title: "Get Involved", desc: "The relevant campaign lead will be in touch with onboarding details and your first shift.", href: "/contact", external: false, cta: "Contact Page →" },
                ].map((s) => (
                  <div key={s.n}>
                    <p style={{ fontFamily: PF, fontSize: "3rem", fontWeight: 400, color: "rgba(201,162,39,0.18)", lineHeight: 1, marginBottom: "0.75rem" }}>{s.n}</p>
                    <h3 style={{ fontFamily: PF, fontSize: "1.1rem", fontWeight: 500, color: "#fff", marginBottom: "0.5rem" }}>{s.title}</h3>
                    <p className="text-sm leading-relaxed mb-4" style={{ color: "#A8A8B3", fontFamily: DM }}>{s.desc}</p>
                    <a
                      href={s.href}
                      target={s.external ? "_blank" : undefined}
                      rel={s.external ? "noopener noreferrer" : undefined}
                      className="text-xs font-semibold tracking-widest uppercase"
                      style={{ color: "#C9A227", fontFamily: DM }}
                    >
                      {s.cta}
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Reveal>

        {/* ── QUOTE ─────────────────────────────────────────────────────── */}
        <Reveal>
          <div className="text-center mb-20">
            <p style={{ fontFamily: PF, fontSize: "clamp(1.2rem,2.5vw,1.6rem)", fontStyle: "italic", color: "#C9A227", opacity: 0.7, marginBottom: "0.5rem" }}>
              &ldquo;The best of people are those most beneficial to people.&rdquo;
            </p>
            <p className="text-xs tracking-widest uppercase" style={{ color: "#6B6B80", fontFamily: DM }}>
              Prophet Muhammad ﷺ · Al-Mu&apos;jam al-Awsat
            </p>
          </div>
        </Reveal>

      </div>
    </div>
  );
}
