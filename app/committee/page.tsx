import type { Metadata } from "next";
import PageShell from "@/components/layout/PageShell";
import Breadcrumb from "@/components/ui/Breadcrumb";
import { MemberCard } from "@/components/ui/Cards";
import Reveal from "@/components/ui/Reveal";
import { committeeMembers } from "@/data/committee";
import { SOCIAL } from "@/lib/social";

export const metadata: Metadata = {
  title: "Committee Team",
  description: "Meet the Aston ISOC 2026/27 committee — Core Committee, Heads of Divisions, and Committee Members.",
};

const PF = "var(--font-playfair), var(--font-playfair), 'Playfair Display', Georgia, serif";
const DM = "var(--font-dm), var(--font-dm), 'DM Sans', sans-serif";

// ── Section 1: Core Committee ─────────────────────────────────────────────
const CORE_IDS = ["head-sister", "vice-sister", "head-brother", "vice-brother", "treasurer", "general-secretary"];

// ── Section 2: Heads of Divisions ────────────────────────────────────────
const HEADS_IDS = ["academic-head", "education-head", "marketing-head", "socialmedia-head", "advocacy-head", "jummah-head"];

// Section 3: all remaining officers
function getSection(ids: string[]) {
  return ids.map((id) => committeeMembers.find((m) => m.id === id)).filter(Boolean) as typeof committeeMembers;
}
function getOfficers() {
  const allHeadIds = [...CORE_IDS, ...HEADS_IDS];
  return committeeMembers.filter((m) => !allHeadIds.includes(m.id));
}

export default function CommitteePage() {
  const core = getSection(CORE_IDS);
  const heads = getSection(HEADS_IDS);
  const officers = getOfficers();

  return (
    <PageShell>
      <Breadcrumb crumbs={[{ label: "About", href: "/about" }, { label: "Committee Team" }]} />

      <div className="mb-20">
        <p className="label mb-4">Leadership</p>
        <h1 style={{ fontFamily: PF, fontSize: "clamp(2.4rem,5vw,4rem)", fontWeight: 500, color: "#fff", lineHeight: 1.08 }}>
          Committee 2026/27
        </h1>
        <span className="gold-rule" />
        <p className="max-w-xl leading-relaxed" style={{ color: "#A8A8B3", fontSize: "0.95rem", fontFamily: DM, lineHeight: 1.8 }}>
          Every member volunteers their time to serve the Aston Muslim community. Three tiers of leadership — from the core executive to division heads and specialist officers.
        </p>
      </div>

      {/* ── SECTION 1: Core Committee ─────────────────────────────────── */}
      <section className="mb-20">
        <Reveal>
          <div className="flex items-end justify-between mb-8 pb-4"
            style={{ borderBottom: "1px solid rgba(201,162,39,0.1)" }}>
            <div>
              <p className="label mb-1">Section One</p>
              <h2 style={{ fontFamily: PF, fontSize: "1.9rem", fontWeight: 500, color: "#fff" }}>Core Committee</h2>
            </div>
            <span className="badge badge-gold">Executive</span>
          </div>
        </Reveal>

        {/* Featured top-row — Head Sister + Head Brother side by side */}
        <Reveal delay={60}>
          <div className="grid sm:grid-cols-2 gap-5 mb-5">
            {core.slice(0, 2).map((m) => (
              <div key={m.id} className="p-8 relative overflow-hidden hover-l1"
                style={{
                  background: "linear-gradient(135deg, rgba(201,162,39,0.07) 0%, #131629 100%)",
                  border: "1px solid rgba(201,162,39,0.22)",
                  borderRadius: "1.375rem",
                }}>
                <div className="glow-orb glow-gold absolute" style={{ width: 200, height: 200, top: -60, right: -60 }} />
                <div className="relative z-10">
                  <div className="flex items-center justify-center w-14 h-14 mb-5"
                    style={{
                      background: "rgba(201,162,39,0.1)",
                      border: "1px solid rgba(201,162,39,0.35)",
                      borderRadius: "50%",
                      fontFamily: PF,
                      fontSize: "1.25rem",
                      fontWeight: 600,
                      color: "#C9A227",
                    }}>
                    {m.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
                  </div>
                  <h3 style={{ fontFamily: PF, fontSize: "1.3rem", fontWeight: 500, color: "#fff", marginBottom: "0.3rem" }}>{m.name}</h3>
                  <p className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: "#C9A227", fontFamily: DM }}>{m.role}</p>
                  <p className="text-sm leading-relaxed" style={{ color: "#6B6B80", fontFamily: DM }}>{m.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal delay={100}>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {core.slice(2).map((m) => <MemberCard key={m.id} member={m} />)}
          </div>
        </Reveal>
      </section>

      {/* ── SECTION 2: Heads of Divisions ──────────────────────────────── */}
      <section className="mb-20">
        <Reveal>
          <div className="flex items-end justify-between mb-8 pb-4"
            style={{ borderBottom: "1px solid rgba(201,162,39,0.1)" }}>
            <div>
              <p className="label mb-1">Section Two</p>
              <h2 style={{ fontFamily: PF, fontSize: "1.9rem", fontWeight: 500, color: "#fff" }}>Heads of Divisions</h2>
            </div>
            <span className="badge badge-muted">Division Leads</span>
          </div>
        </Reveal>
        <Reveal delay={60}>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {heads.map((m, i) => (
              <div key={m.id} className="p-6 hover-l1"
                style={{
                  background: "#131629",
                  border: "1px solid rgba(201,162,39,0.12)",
                  borderRadius: "1.125rem",
                  transition: "all 0.25s",
                }}>
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center justify-center w-10 h-10"
                    style={{
                      background: "rgba(201,162,39,0.08)",
                      border: "1px solid rgba(201,162,39,0.2)",
                      borderRadius: "50%",
                      fontFamily: PF,
                      fontSize: "0.9rem",
                      fontWeight: 600,
                      color: "#C9A227",
                    }}>
                    {m.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h3 style={{ fontFamily: PF, fontSize: "1rem", fontWeight: 500, color: "#fff" }}>{m.name}</h3>
                    <p className="text-xs font-semibold tracking-widest uppercase" style={{ color: "#C9A227", fontFamily: DM }}>{m.role}</p>
                  </div>
                </div>
                <p className="text-xs leading-relaxed line-clamp-3" style={{ color: "#6B6B80", fontFamily: DM }}>{m.bio}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      {/* ── SECTION 3: Committee Members ───────────────────────────────── */}
      <section className="mb-20">
        <Reveal>
          <div className="flex items-end justify-between mb-8 pb-4"
            style={{ borderBottom: "1px solid rgba(201,162,39,0.1)" }}>
            <div>
              <p className="label mb-1">Section Three</p>
              <h2 style={{ fontFamily: PF, fontSize: "1.9rem", fontWeight: 500, color: "#fff" }}>Committee Members</h2>
            </div>
            <span className="badge badge-muted">{officers.length} Officers</span>
          </div>
        </Reveal>
        <Reveal delay={60}>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {officers.map((m) => <MemberCard key={m.id} member={m} />)}
          </div>
        </Reveal>
      </section>

      {/* ── Join CTA ─────────────────────────────────────────────────────── */}
      <Reveal>
        <div className="p-10 text-center relative overflow-hidden"
          style={{
            background: "rgba(201,162,39,0.04)",
            border: "1px solid rgba(201,162,39,0.15)",
            borderRadius: "1.5rem",
          }}>
          <div className="absolute inset-0 geo-pattern opacity-20" />
          <div className="relative z-10">
            <p className="label mb-3">Join the Team</p>
            <h3 style={{ fontFamily: PF, fontSize: "1.9rem", fontWeight: 500, color: "#fff", marginBottom: "0.75rem" }}>
              Committee Elections 2027/28
            </h3>
            <p className="text-sm max-w-md mx-auto mb-7" style={{ color: "#A8A8B3", fontFamily: DM, lineHeight: 1.8 }}>
              Elections are held every May, open to all ISOC members. No experience required — just passion for your community and willingness to serve.
            </p>
            <a href={SOCIAL.instagram} target="_blank" rel="noopener noreferrer" className="btn-outline-gold" style={{ fontSize: "0.72rem" }}>
              Express Interest via Instagram
            </a>
          </div>
        </div>
      </Reveal>
    </PageShell>
  );
}
