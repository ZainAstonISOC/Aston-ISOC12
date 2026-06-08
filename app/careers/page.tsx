import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/layout/PageShell";
import Breadcrumb from "@/components/ui/Breadcrumb";
import { PageHeader, CtaBanner } from "@/components/ui/Cards";
import Reveal from "@/components/ui/Reveal";
import { getActiveCareers, getFeaturedCareers, CAREER_TYPE_LABELS } from "@/data/careers";
import { SOCIAL, MEMBERSHIP } from "@/lib/social";

export const metadata: Metadata = {
  title: "Careers & Networking",
  description: "Internships, placements, graduate programmes, and networking for Muslim students at Aston University.",
};

const PF = "'Playfair Display', Georgia, serif";
const DM = "'DM Sans', sans-serif";

const TYPE_STYLE: Record<string, React.CSSProperties> = {
  graduate:    { background: "rgba(99,102,241,0.1)",  color: "#a5b4fc", border: "1px solid rgba(99,102,241,0.25)" },
  placement:   { background: "rgba(167,139,250,0.1)", color: "#c4b5fd", border: "1px solid rgba(167,139,250,0.2)" },
  internship:  { background: "rgba(52,211,153,0.1)",  color: "#6ee7b7", border: "1px solid rgba(52,211,153,0.2)" },
  networking:  { background: "rgba(251,191,36,0.1)",  color: "#fde68a", border: "1px solid rgba(251,191,36,0.2)" },
  workshop:    { background: "rgba(251,146,60,0.1)",  color: "#fdba74", border: "1px solid rgba(251,146,60,0.2)" },
  mentoring:   { background: "rgba(216,175,114,0.1)", color: "#d8af72", border: "1px solid rgba(216,175,114,0.2)" },
};

export default function CareersPage() {
  const active   = getActiveCareers();
  const featured = getFeaturedCareers();

  return (
    <PageShell>
      <Breadcrumb crumbs={[{ label: "Careers & Networking" }]} />
      <PageHeader label="Opportunities"
        title="Careers & Networking"
        subtitle="Internships, placements, graduate programmes, and networking events curated for Aston ISOC members." />

      {/* Featured */}
      {featured.length > 0 && (
        <Reveal>
          <p className="eyebrow" style={{ marginBottom: "1.25rem" }}>Featured Opportunities</p>
          <div className="grid cols-3" style={{ marginBottom: "3.5rem" }}>
            {featured.map((job, i) => (
              <Reveal key={job.id} delay={i * 80}>
                <div className="card" style={{ height: "100%" }}>
                  <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "1rem" }}>
                    <span className="badge" style={TYPE_STYLE[job.type] ?? {}}>
                      {CAREER_TYPE_LABELS[job.type]}
                    </span>
                    {job.islamicFinance && (
                      <span className="badge badge-gold">Islamic Finance</span>
                    )}
                  </div>
                  <h3 style={{ fontFamily: PF, color: "#fff", fontSize: "1.15rem", marginBottom: "0.3rem" }}>{job.title}</h3>
                  <p style={{ fontFamily: DM, fontSize: "0.8rem", fontWeight: 600, color: "var(--gold)", marginBottom: "0.75rem" }}>{job.organisation}</p>
                  <p style={{ fontFamily: DM, fontSize: "0.88rem", color: "var(--muted)", lineHeight: 1.75, marginBottom: "1.2rem", flex: 1 }}>{job.description}</p>
                  {job.deadline && (
                    <p style={{ fontFamily: DM, fontSize: "0.75rem", color: "var(--muted-2)", marginBottom: "1rem" }}>
                      Deadline: {job.deadline}
                    </p>
                  )}
                  {job.applyUrl && (
                    <a href={job.applyUrl} target="_blank" rel="noopener noreferrer" className="btn btn-gold" style={{ fontSize: "0.78rem", padding: "0.65rem 1.2rem" }}>
                      Learn More
                    </a>
                  )}
                </div>
              </Reveal>
            ))}
          </div>
        </Reveal>
      )}

      {/* All active */}
      <Reveal delay={80}>
        <p className="eyebrow" style={{ marginBottom: "1.25rem" }}>All Opportunities</p>
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginBottom: "3.5rem" }}>
          {active.map((job, i) => (
            <Reveal key={job.id} delay={i * 40}>
              <div className="card" style={{ display: "flex", alignItems: "flex-start", gap: "1.5rem", flexWrap: "wrap" }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "0.6rem" }}>
                    <span className="badge" style={TYPE_STYLE[job.type] ?? {}}>
                      {CAREER_TYPE_LABELS[job.type]}
                    </span>
                    <span className="badge badge-muted">{job.sector}</span>
                    {job.islamicFinance && <span className="badge badge-gold">Islamic Finance</span>}
                  </div>
                  <h3 style={{ fontFamily: PF, fontSize: "1.1rem", color: "#fff", marginBottom: "0.2rem" }}>{job.title}</h3>
                  <p style={{ fontFamily: DM, fontSize: "0.8rem", fontWeight: 600, color: "var(--gold)", marginBottom: "0.5rem" }}>{job.organisation}</p>
                  <p style={{ fontFamily: DM, fontSize: "0.88rem", color: "var(--muted)", lineHeight: 1.7 }}>{job.description}</p>
                  {job.deadline && (
                    <p style={{ fontFamily: DM, fontSize: "0.75rem", color: "var(--muted-2)", marginTop: "0.5rem" }}>Deadline: {job.deadline}</p>
                  )}
                </div>
                {job.applyUrl && (
                  <a href={job.applyUrl} target="_blank" rel="noopener noreferrer"
                    className="btn btn-outline-gold" style={{ fontSize: "0.75rem", padding: "0.65rem 1.2rem", flexShrink: 0 }}>
                    Apply
                  </a>
                )}
              </div>
            </Reveal>
          ))}
        </div>
      </Reveal>

      {/* Tips */}
      <Reveal delay={100}>
        <div className="card" style={{ marginBottom: "3rem" }}>
          <p className="eyebrow">Career Tips</p>
          <h3 style={{ fontFamily: PF, color: "#fff", marginBottom: "1.2rem" }}>Making the most of your time at Aston</h3>
          <div className="grid cols-3">
            {[
              { n: "01", t: "Join the mentoring programme", d: "Get matched with a senior student or alumni in your field through ISOC." },
              { n: "02", t: "LinkedIn from year one", d: "Build your professional network early. Connect with committee members and alumni." },
              { n: "03", t: "Islamic finance is growing", d: "The UK Islamic finance sector is expanding. ISOC can connect you with organisations." },
            ].map(tip => (
              <div key={tip.n}>
                <p style={{ fontFamily: PF, fontSize: "2.5rem", color: "rgba(216,175,114,0.2)", lineHeight: 1, marginBottom: "0.5rem" }}>{tip.n}</p>
                <h4 style={{ fontFamily: PF, color: "#fff", fontSize: "1.05rem", marginBottom: "0.4rem" }}>{tip.t}</h4>
                <p style={{ fontFamily: DM, fontSize: "0.85rem", color: "var(--muted)", lineHeight: 1.7 }}>{tip.d}</p>
              </div>
            ))}
          </div>
        </div>
      </Reveal>

      <Reveal>
        <CtaBanner
          title="Have an opportunity to share?"
          description="If you know of a placement, internship, or networking event that would benefit Aston ISOC members, let us know and we will add it here."
          primaryLabel="Contact us on Instagram"
          primaryHref={SOCIAL.instagram}
          secondaryLabel="Join ISOC"
          secondaryHref={MEMBERSHIP.join}
        />
      </Reveal>
    </PageShell>
  );
}
