import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/layout/PageShell";
import Breadcrumb from "@/components/ui/Breadcrumb";
import { PageHeader, CtaBanner } from "@/components/ui/Cards";
import Reveal from "@/components/ui/Reveal";
import { jobListings, getIslamicFinanceRoles } from "@/data/careers";
import { SOCIAL } from "@/lib/social";

export const metadata: Metadata = { title: "Careers & Networking", description: "Internships, placements, Islamic finance roles, and networking for Muslim students at Aston." };

const TYPE_META: Record<string, { label: string; badgeStyle: React.CSSProperties }> = {
  graduate:   { label: "Graduate",   badgeStyle: { background: "rgba(99,102,241,0.1)", color: "#a5b4fc", border: "1px solid rgba(99,102,241,0.25)" } },
  placement:  { label: "Placement",  badgeStyle: { background: "rgba(167,139,250,0.1)", color: "#c4b5fd", border: "1px solid rgba(167,139,250,0.2)" } },
  internship: { label: "Internship", badgeStyle: { background: "rgba(52,211,153,0.1)", color: "#6ee7b7", border: "1px solid rgba(52,211,153,0.2)" } },
  volunteer:  { label: "Volunteer",  badgeStyle: { background: "rgba(251,191,36,0.1)", color: "#fde68a", border: "1px solid rgba(251,191,36,0.2)" } },
};

export default function CareersPage() {
  const islamicFinance = getIslamicFinanceRoles();

  return (
    <PageShell>
      <Breadcrumb crumbs={[{ label: "Careers & Networking" }]} />
      <PageHeader label="Your Future" title="Careers & Networking" subtitle="Build a purposeful, halal career. We connect Muslim students with opportunities that align with faith and ambition." />

      {/* Upcoming events */}
      <Reveal>
        <div
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 mb-16"
          style={{ background: "rgba(201,162,39,0.05)", border: "1px solid rgba(201,162,39,0.2)", borderRadius: "1rem" }}
        >
          <div>
            <p className="label mb-1">Coming Up</p>
            <p className="font-medium" style={{ color: "#fff", fontFamily: "var(--font-dm), var(--font-dm), 'DM Sans', sans-serif" }}>Careers Events</p>
            <p className="text-sm" style={{ color: "#9CA3AF", fontFamily: "var(--font-dm), var(--font-dm), 'DM Sans', sans-serif" }}>Networking panels, CV workshops, mock interviews, and speaker series.</p>
          </div>
          <Link href="/events" className="btn-outline-gold shrink-0" style={{ fontSize: "0.7rem" }}>View Events →</Link>
        </div>
      </Reveal>

      {/* Islamic finance */}
      {islamicFinance.length > 0 && (
        <section className="mb-14">
          <Reveal>
            <div className="mb-6" style={{ borderBottom: "1px solid rgba(201,162,39,0.08)", paddingBottom: "0.75rem" }}>
              <p className="label">Islamic Finance & Halal Careers</p>
              <p className="text-xs mt-1" style={{ color: "#6B7280", fontFamily: "var(--font-dm), var(--font-dm), 'DM Sans', sans-serif" }}>The Islamic finance industry is worth $3+ trillion globally.</p>
            </div>
            <div className="space-y-4">
              {islamicFinance.map((job) => (
                <div
                  key={job.id}
                  className="p-6 flex items-start justify-between gap-6 flex-wrap"
                  style={{ background: "rgba(201,162,39,0.04)", border: "1px solid rgba(201,162,39,0.15)", borderRadius: "1rem" }}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap gap-2 mb-2">
                      <span className="badge" style={TYPE_META[job.type]?.badgeStyle ?? {}}>{TYPE_META[job.type]?.label ?? job.type}</span>
                      <span className="badge badge-gold">Islamic Finance</span>
                      {job.deadline && <span className="badge badge-muted">Deadline: {new Date(job.deadline).toLocaleDateString("en-GB")}</span>}
                    </div>
                    <p className="font-medium" style={{ color: "#fff", fontFamily: "var(--font-dm), var(--font-dm), 'DM Sans', sans-serif" }}>{job.title}</p>
                    <p className="text-sm mt-0.5" style={{ color: "#9CA3AF", fontFamily: "var(--font-dm), var(--font-dm), 'DM Sans', sans-serif" }}>{job.organisation} · {job.location}</p>
                    <p className="text-sm mt-1.5 leading-relaxed" style={{ color: "#6B7280", fontFamily: "var(--font-dm), var(--font-dm), 'DM Sans', sans-serif" }}>{job.description}</p>
                  </div>
                  <a href={job.url.startsWith("/") ? job.url : job.url}
                    target={job.url.startsWith("http") ? "_blank" : undefined}
                    rel={job.url.startsWith("http") ? "noopener noreferrer" : undefined}
                    className="btn-gold shrink-0" style={{ fontSize: "0.7rem" }}>
                    Apply →
                  </a>
                </div>
              ))}
            </div>
          </Reveal>
        </section>
      )}

      {/* All listings */}
      <section className="mb-14">
        <Reveal>
          <div className="mb-6" style={{ borderBottom: "1px solid rgba(201,162,39,0.08)", paddingBottom: "0.75rem" }}>
            <p className="label">All Opportunities</p>
          </div>
          <div className="space-y-3">
            {jobListings.map((job) => (
              <div
                key={job.id}
                className="p-5 flex items-start justify-between gap-4 flex-wrap transition-all duration-200"
                style={{ background: "var(--surface)", border: "1px solid rgba(201,162,39,0.08)", borderRadius: "1rem" }}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    <span className="badge" style={TYPE_META[job.type]?.badgeStyle ?? {}}>{TYPE_META[job.type]?.label ?? job.type}</span>
                    {job.isIslamicFinance && <span className="badge badge-gold">Islamic Finance</span>}
                    {job.deadline && <span className="badge badge-muted">Deadline: {new Date(job.deadline).toLocaleDateString("en-GB")}</span>}
                  </div>
                  <p className="font-medium text-sm" style={{ color: "#E5E7EB", fontFamily: "var(--font-dm), var(--font-dm), 'DM Sans', sans-serif" }}>{job.title}</p>
                  <p className="text-xs mt-0.5" style={{ color: "#6B7280", fontFamily: "var(--font-dm), var(--font-dm), 'DM Sans', sans-serif" }}>{job.organisation} · {job.location}</p>
                </div>
                <a href={job.url.startsWith("/") ? job.url : job.url}
                  target={job.url.startsWith("http") ? "_blank" : undefined}
                  rel={job.url.startsWith("http") ? "noopener noreferrer" : undefined}
                  className="btn-outline-gold shrink-0" style={{ fontSize: "0.68rem", padding: "0.55rem 1rem" }}>
                  Apply →
                </a>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      <Reveal>
        <CtaBanner
          title="Post an Opportunity"
          description="Employer, alumni, or professional? Reach Muslim students at Aston through our network."
          primaryLabel="Contact via Instagram"
          primaryHref={SOCIAL.instagram}
          secondaryLabel="View Events"
          secondaryHref="/events"
        />
      </Reveal>
    </PageShell>
  );
}
