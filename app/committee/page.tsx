import type { Metadata } from "next";
import Breadcrumb from "@/components/ui/Breadcrumb";
import Reveal from "@/components/ui/Reveal";
import CommitteeAccordion from "@/components/ui/CommitteeAccordion";
import { committeeMembers, SECTION_LABELS, SECTION_ORDER } from "@/data/committee";
import { SOCIAL } from "@/lib/social";

export const metadata: Metadata = {
  title: "Committee Team",
  description: "Meet the Aston ISOC 2026/27 committee across all departments.",
};

const PF = "'Playfair Display', Georgia, serif";
const DM = "'DM Sans', sans-serif";

export default function CommitteePage() {
  // Build sections data
  const sections = SECTION_ORDER.map(section => ({
    key: section,
    label: SECTION_LABELS[section],
    members: committeeMembers.filter(m => m.section === section),
  })).filter(s => s.members.length > 0);

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
        <div className="container container-sm">
          <Reveal>
            <CommitteeAccordion sections={sections} />
          </Reveal>

          <div className="cta-band" style={{ marginTop: "4rem" }}>
            <h2 style={{ fontFamily: PF }}>Join the Committee 2027/28</h2>
            <p className="lede" style={{ margin: "0 auto 2rem" }}>
              Elections are held every May, open to all ISOC members. No experience required, just passion for your community.
            </p>
            <div className="cta-band__actions">
              <a href={SOCIAL.instagram} target="_blank" rel="noopener noreferrer" className="btn btn-gold">
                Express Interest via Instagram
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
