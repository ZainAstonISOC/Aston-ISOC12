import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/layout/PageShell";
import Breadcrumb from "@/components/ui/Breadcrumb";
import { PageHeader, CtaBanner } from "@/components/ui/Cards";
import Reveal from "@/components/ui/Reveal";

export const metadata: Metadata = { title: "About Us", description: "Learn about Aston University Islamic Society our mission, history, and the community we've built." };

const STATS = [
  { value: "500+", label: "Active Members" },
  { value: "29", label: "Committee Members" },
  { value: "40+", label: "Events Per Year" },
  { value: "£200k+", label: "Raised for Charity" },
];

const MISSION = [
  "Facilitate the five daily prayers and Friday Jumu'ah on campus",
  "Run Islamic education: halaqas, lectures, and study circles",
  "Organise social events that strengthen brotherhood and sisterhood",
  "Lead significant charity campaigns locally and internationally",
  "Support Muslim students' wellbeing and sense of identity",
  "Create career and networking opportunities aligned with Islamic values",
];

export default function AboutPage() {
  return (
    <PageShell>
      <Breadcrumb crumbs={[{ label: "About Us" }]} />
      <div className="text-center mb-8"><p style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "1.1rem", color: "#C9A227", opacity: 0.6 }}>بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ</p></div>
      <PageHeader label="Who We Are" title="More Than a Society" subtitle="Aston ISOC is the home of Muslim students at Aston University. A community built on faith, sustained by brotherhood and sisterhood, and driven by purpose." />

      {/* Stats */}
      <Reveal>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-20">
          {STATS.map((s) => (
            <div key={s.label} className="text-center p-6" style={{ background: "var(--surface)", border: "1px solid rgba(201,162,39,0.1)", borderRadius: "1rem" }}>
              <p style={{ fontFamily: "var(--font-playfair), var(--font-playfair), 'Playfair Display', Georgia, serif", fontSize: "2.5rem", fontWeight: 300, color: "#C9A227", lineHeight: 1 }}>{s.value}</p>
              <p className="mt-2 text-xs tracking-widest uppercase" style={{ color: "#6B7280", fontFamily: "var(--font-dm), var(--font-dm), 'DM Sans', sans-serif" }}>{s.label}</p>
            </div>
          ))}
        </div>
      </Reveal>

      {/* Story */}
      <Reveal>
        <div className="grid md:grid-cols-2 gap-12 mb-20">
          <div>
            <p className="label mb-4">Our Story</p>
            <h2 style={{ fontFamily: "var(--font-playfair), var(--font-playfair), 'Playfair Display', Georgia, serif", fontSize: "2rem", fontWeight: 300, color: "#fff", marginBottom: "1.5rem" }}>
              Serving Aston for Decades
            </h2>
            <div className="space-y-4 text-sm leading-relaxed" style={{ color: "#9CA3AF", fontFamily: "var(--font-dm), var(--font-dm), 'DM Sans', sans-serif" }}>
              <p>Aston ISOC has been the home of Muslim students at Aston University for decades. We are a family built on faith, sustained by community, and driven by purpose.</p>
              <p>From daily congregational prayers to national charity campaigns, from intimate study circles to large-scale conferences, we serve every dimension of the Muslim student experience.</p>
              <p>We exist to ensure that no Muslim student at Aston ever feels alone, lost, or disconnected from their faith and identity.</p>
            </div>
            <div className="mt-8 border-l-2 pl-5" style={{ borderColor: "#C9A227" }}>
              <p className="italic" style={{ fontFamily: "var(--font-playfair), var(--font-playfair), 'Playfair Display', Georgia, serif", fontSize: "1.15rem", color: "#E5E7EB", lineHeight: 1.6 }}>
                &ldquo;And hold firmly to the rope of Allah all together and do not become divided.&rdquo;
              </p>
              <p className="mt-2 text-xs tracking-widest uppercase" style={{ color: "#C9A227", fontFamily: "var(--font-dm), var(--font-dm), 'DM Sans', sans-serif" }}>Surah Al-Imran · 3:103</p>
            </div>
          </div>
          <div>
            <p className="label mb-4">Our Mission</p>
            <h2 style={{ fontFamily: "var(--font-playfair), var(--font-playfair), 'Playfair Display', Georgia, serif", fontSize: "2rem", fontWeight: 300, color: "#fff", marginBottom: "1.5rem" }}>
              What We Stand For
            </h2>
            <div className="space-y-3">
              {MISSION.map((m) => (
                <div key={m} className="flex items-start gap-3 text-sm" style={{ color: "#9CA3AF", fontFamily: "var(--font-dm), var(--font-dm), 'DM Sans', sans-serif" }}>
                  <span style={{ color: "#C9A227", flexShrink: 0, marginTop: 2 }}>✦</span>
                  {m}
                </div>
              ))}
            </div>
          </div>
        </div>
      </Reveal>

      {/* Quick links */}
      <Reveal>
        <div className="grid sm:grid-cols-3 gap-4 mb-16">
          {[
            { title: "Meet the Committee", sub: "Your elected student leadership team", href: "/committee" },
            { title: "Our Partners", sub: "Who supports and works with us", href: "/sponsors" },
            { title: "Join ISOC", sub: "£5 for the full academic year", href: "/join" },
          ].map((l) => (
            <Link
              key={l.title}
              href={l.href}
              className="block p-6 transition-all duration-200"
              style={{ background: "var(--surface)", border: "1px solid rgba(201,162,39,0.1)", borderRadius: "1rem" }}
            >
              <p className="font-medium mb-1" style={{ color: "#fff", fontFamily: "var(--font-dm), var(--font-dm), 'DM Sans', sans-serif" }}>{l.title} →</p>
              <p className="text-xs" style={{ color: "#6B7280", fontFamily: "var(--font-dm), var(--font-dm), 'DM Sans', sans-serif" }}>{l.sub}</p>
            </Link>
          ))}
        </div>
      </Reveal>

      <Reveal>
        <CtaBanner
          title="Join the Community"
          description="Membership is just £5 for the full academic year. Access all events, community groups, and everything ISOC offers."
          primaryLabel="Join ISOC"
          primaryHref="/join"
          secondaryLabel="Contact Us"
          secondaryHref="/contact"
        />
      </Reveal>
    </PageShell>
  );
}
