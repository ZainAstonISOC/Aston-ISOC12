import type { Metadata } from "next";
import PageShell from "@/components/layout/PageShell";
import Breadcrumb from "@/components/ui/Breadcrumb";
import { PageHeader, LectureCard } from "@/components/ui/Cards";
import Reveal from "@/components/ui/Reveal";
import { lectures, LECTURE_CATEGORY_LABELS, getLecturesByCategory } from "@/data/lectures";
import { SOCIAL } from "@/lib/social";

export const metadata: Metadata = { title: "Lectures & Podcasts", description: "Recorded talks, Jumu'ah khutbahs, halaqa sessions, and the ISOC podcast." };

const CATS = ["lecture", "khutbah", "halaqa", "podcast", "event"] as const;
const PF = "'Playfair Display', Georgia, serif";
const DM = "'DM Sans', sans-serif";

export default function LecturesPage() {
  return (
    <PageShell>
      <Breadcrumb crumbs={[{ label: "Lectures & Podcasts" }]} />
      <PageHeader label="Knowledge" title="Lectures & Podcasts" subtitle="Recorded talks, Jumu'ah khutbahs, halaqa sessions, and the ISOC podcast archive." />
      {CATS.map((cat, si) => {
        const items = getLecturesByCategory(cat);
        if (!items.length) return null;
        return (
          <section key={cat} className="mb-14">
            <Reveal delay={si * 40}>
              <div className="mb-6" style={{ borderBottom: "1px solid rgba(216,175,114,0.08)", paddingBottom: "0.75rem" }}>
                <p className="label">{LECTURE_CATEGORY_LABELS[cat]}</p>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {items.map((l) => <LectureCard key={l.id} lecture={l} />)}
              </div>
            </Reveal>
          </section>
        );
      })}
      <Reveal>
        <div className="p-8 card">
          <p className="label mb-3">Stay Updated</p>
          <h3 style={{ fontFamily: PF, fontSize: "1.6rem", fontWeight: 500, color: "#fff", marginBottom: "0.75rem" }}>Never Miss a Lecture</h3>
          <p className="text-sm mb-6" style={{ color: "var(--muted)", fontFamily: DM }}>Follow @astonisoc on Instagram for all lecture announcements, recordings, and events.</p>
          <a href={SOCIAL.instagram} target="_blank" rel="noopener noreferrer" className="btn btn-gold">Follow @astonisoc →</a>
        </div>
      </Reveal>
    </PageShell>
  );
}
