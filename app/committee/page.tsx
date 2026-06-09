import type { Metadata } from "next";
import Breadcrumb from "@/components/ui/Breadcrumb";
import Reveal from "@/components/ui/Reveal";
import CommitteeAccordion from "@/components/ui/CommitteeAccordion";
import { committeeMembers, SECTION_LABELS, SECTION_ORDER } from "@/data/committee";
import { SOCIAL } from "@/lib/social";
import MemberCard from "@/components/ui/MemberCard";

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

  const departments = SECTION_ORDER
    .filter(s => s !== "executive")
    .map(section => ({ key: section, label: SECTION_LABELS[section], members: committeeMembers.filter(m => m.section === section) }))
    .filter(s => s.members.length > 0);

  return (
    <div style={{ minHeight: "100vh", paddingTop: "5rem" }}>
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
          <Reveal delay={80}>
            <div style={{ marginBottom: "1.5rem" }}>
              <p className="eyebrow">Departments</p>
              <h2 style={{ fontFamily: PF, fontSize: "clamp(1.6rem,3vw,2.2rem)", marginBottom: "0.4rem" }}>Heads of Departments & Officers</h2>
              <div className="gold-rule" />
              <p style={{ fontFamily: DM, fontSize: "0.9rem", color: "var(--muted)" }}>Click any department to see its team members.</p>
            </div>
          </Reveal>
          <Reveal delay={100}><CommitteeAccordion sections={departments} /></Reveal>

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
