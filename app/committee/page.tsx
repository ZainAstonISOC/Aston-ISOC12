import type { Metadata } from "next";
import Breadcrumb from "@/components/ui/Breadcrumb";
import Reveal from "@/components/ui/Reveal";
import CommitteeAccordion from "@/components/ui/CommitteeAccordion";
import { committeeMembers, SECTION_LABELS, SECTION_ORDER } from "@/data/committee";
import { SOCIAL } from "@/lib/social";
import MemberCard from "@/components/ui/MemberCard";
import { departments } from "@/data/departments";
import Icon from "@/components/ui/Icon";

export const metadata: Metadata = { title: "Committee Team", description: "Meet the Aston ISOC 2026/27 committee." };

const PF = "'Playfair Display', Georgia, serif";
const DM = "'DM Sans', sans-serif";

export default function CommitteePage() {
  const headBrother = committeeMembers.find(m => m.id === "head-brother");
  const headSister  = committeeMembers.find(m => m.id === "head-sister");
  const viceBrother = committeeMembers.find(m => m.id === "vice-brother");
  const viceSister  = committeeMembers.find(m => m.id === "vice-sister");
  const treasurer   = committeeMembers.find(m => m.id === "treasurer");
  const genSec      = committeeMembers.find(m => m.id === "general-secretary");

  const accordionSections = SECTION_ORDER
    .filter(s => s !== "executive")
    .map(section => ({ key: section, label: SECTION_LABELS[section], members: committeeMembers.filter(m => m.section === section) }))
    .filter(s => s.members.length > 0);

  return (
    <div style={{ minHeight: "100vh" }}>
      <div className="page-hero">
        <div className="container">
          <Breadcrumb crumbs={[{ label: "About", href: "/about" }, { label: "Committee" }]} />
          <p className="eyebrow" style={{ justifyContent: "center" }}>Leadership</p>
          <h1 style={{ fontFamily: PF }}>Committee 2026/27</h1>
          <p className="lede" style={{ margin: "1.4rem auto 0" }}>
            Your elected student leadership team. Every member volunteers their time to serve the Aston Muslim community.
          </p>
        </div>
      </div>

      <section className="section section--tight">
        <div className="container">
          <Reveal>
            <div style={{ marginBottom: "1rem" }}>
              <p className="eyebrow">Core Committee</p>
              <h2 style={{ fontFamily: PF, fontSize: "clamp(1.6rem,3vw,2.2rem)", marginBottom: "0.4rem" }}>Executive Leadership</h2>
              <div className="gold-rule" />
            </div>
          </Reveal>

          {/* Row 1 Head Brother & Head Sister */}
          <Reveal delay={60}>
            <div style={{ marginBottom: "1rem" }}>
              <p style={{ fontFamily: DM, fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--muted-2)", marginBottom: "0.75rem" }}>Society Heads</p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                {[headBrother, headSister].filter(Boolean).map(m => m && <MemberCard key={m.id} member={m} large />)}
              </div>
            </div>
          </Reveal>

          {/* Row 2 Vice */}
          <Reveal delay={120}>
            <div style={{ marginBottom: "1rem" }}>
              <p style={{ fontFamily: DM, fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--muted-2)", marginBottom: "0.75rem" }}>Vice Presidents</p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                {[viceBrother, viceSister].filter(Boolean).map(m => m && <MemberCard key={m.id} member={m} />)}
              </div>
            </div>
          </Reveal>

          {/* Row 3 Treasurer & General Secretary */}
          <Reveal delay={180}>
            <div style={{ marginBottom: "3.5rem" }}>
              <p style={{ fontFamily: DM, fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--muted-2)", marginBottom: "0.75rem" }}>Operations</p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                {[treasurer, genSec].filter(Boolean).map(m => m && <MemberCard key={m.id} member={m} />)}
              </div>
            </div>
          </Reveal>

          {/* Departments */}
          {/* ── DEPARTMENT OVERVIEWS ──────────────────────────────────── */}
          <Reveal delay={60}>
            <div style={{ marginTop: "1rem", marginBottom: "1.5rem" }}>
              <p className="eyebrow">Our Departments</p>
              <h2 style={{ fontFamily: PF, fontSize: "clamp(1.6rem,3vw,2.2rem)", marginBottom: "0.4rem" }}>What Each Team Does</h2>
              <div className="gold-rule" />
            </div>
          </Reveal>

          <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem", marginBottom: "3.5rem" }}>
            {departments.map((d, i) => (
              <Reveal key={d.key} delay={i * 60}>
                <div className="card">
                  <div style={{ display: "flex", alignItems: "flex-start", gap: "1.25rem", flexWrap: "wrap" }}>
                    <div style={{
                      width: 56, height: 56, borderRadius: "16px", flexShrink: 0,
                      background: "linear-gradient(135deg, rgba(216,175,114,0.18), rgba(216,175,114,0.05))",
                      border: "1px solid rgba(216,175,114,0.25)",
                      display: "grid", placeItems: "center", color: "#d8af72",
                    }}><Icon name={d.icon} size={24} /></div>
                    <div style={{ flex: 1, minWidth: "min(100%, 280px)" }}>
                      <h3 style={{ fontFamily: PF, fontSize: "1.4rem", fontWeight: 500, color: "#fff", marginBottom: "0.1rem" }}>{d.name}</h3>
                      <p style={{ fontFamily: DM, fontSize: "0.78rem", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", color: "#d8af72", marginBottom: "0.85rem" }}>{d.tagline}</p>
                      <p style={{ fontFamily: DM, fontSize: "0.92rem", color: "var(--muted)", lineHeight: 1.75, marginBottom: "1.5rem" }}>{d.mission}</p>

                      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1.25rem" }}>
                        <div>
                          <p style={{ fontFamily: DM, fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--muted-2)", marginBottom: "0.6rem" }}>Objectives</p>
                          <ul style={{ listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: "0.45rem" }}>
                            {d.objectives.map(o => (
                              <li key={o} style={{ display: "flex", gap: "0.5rem", fontFamily: DM, fontSize: "0.84rem", color: "var(--muted)", lineHeight: 1.55 }}>
                                <span style={{ color: "#d8af72", flexShrink: 0 }}>✦</span>{o}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <p style={{ fontFamily: DM, fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--muted-2)", marginBottom: "0.6rem" }}>Key Initiatives</p>
                          <div style={{ display: "flex", flexDirection: "column", gap: "0.7rem" }}>
                            {d.initiatives.map(init => (
                              <div key={init.title}>
                                <p style={{ fontFamily: DM, fontSize: "0.84rem", fontWeight: 600, color: "#fff", marginBottom: "0.1rem" }}>{init.title}</p>
                                <p style={{ fontFamily: DM, fontSize: "0.8rem", color: "var(--muted-2)", lineHeight: 1.55 }}>{init.desc}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={80}>
            <div style={{ marginBottom: "1.5rem" }}>
              <p className="eyebrow">Departments</p>
              <h2 style={{ fontFamily: PF, fontSize: "clamp(1.6rem,3vw,2.2rem)", marginBottom: "0.4rem" }}>Heads of Departments & Officers</h2>
              <div className="gold-rule" />
              <p style={{ fontFamily: DM, fontSize: "0.9rem", color: "var(--muted)" }}>Click any department to see its team members.</p>
            </div>
          </Reveal>
          <Reveal delay={100}><CommitteeAccordion sections={accordionSections} /></Reveal>

          <div className="cta-band" style={{ marginTop: "4rem" }}>
            <h2 style={{ fontFamily: PF }}>Join the Committee 2027/28</h2>
            <p className="lede" style={{ margin: "0 auto 2rem" }}>Elections are held every May, open to all ISOC members.</p>
            <div className="cta-band__actions">
              <a href={SOCIAL.instagram} target="_blank" rel="noopener noreferrer" className="btn btn-gold">Express Interest via Instagram</a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
