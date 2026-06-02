import type { Metadata } from "next";
import PageShell from "@/components/layout/PageShell";
import Breadcrumb from "@/components/ui/Breadcrumb";
import { PageHeader, LectureCard } from "@/components/ui/Cards";
import Reveal from "@/components/ui/Reveal";
import { lectures, LECTURE_CATEGORY_LABELS, getLecturesByCategory } from "@/data/lectures";
import { SOCIAL } from "@/lib/social";

export const metadata: Metadata = { title: "Lectures & Podcasts" };

const CATS = ["lecture", "khutbah", "halaqa", "podcast", "event"] as const;

export default function LecturesPage() {
  return (
    <PageShell>
      <Breadcrumb crumbs={[{ label: "Lectures & Podcasts" }]} />
      <PageHeader label="Knowledge" title="Lectures & Podcasts" subtitle="Recorded talks, Jumu'ah khutbahs, halaqa sessions, and the ISOC podcast." />

      {CATS.map((cat, si) => {
        const items = getLecturesByCategory(cat);
        if (!items.length) return null;
        return (
          <section key={cat} className="mb-14">
            <Reveal delay={si * 40}>
              <div className="mb-6" style={{ borderBottom: "1px solid rgba(201,162,39,0.08)", paddingBottom: "0.75rem" }}>
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
        <div className="p-8" style={{ background: "#131629", border: "1px solid rgba(201,162,39,0.1)", borderRadius: "1.5rem" }}>
          <p className="label mb-3">Subscribe</p>
          <h3 style={{ fontFamily: "var(--font-playfair), var(--font-playfair), 'Playfair Display', Georgia, serif", fontSize: "1.6rem", fontWeight: 300, color: "#fff", marginBottom: "0.75rem" }}>
            Never Miss a Lecture
          </h3>
          <p className="text-sm mb-6" style={{ color: "#9CA3AF", fontFamily: "var(--font-dm), var(--font-dm), 'DM Sans', sans-serif" }}>Follow on YouTube and Instagram to be notified of new content.</p>
          <div className="flex gap-3 flex-wrap">
            <a href={SOCIAL.youtube} target="_blank" rel="noopener noreferrer" className="btn-outline-gold" style={{ fontSize: "0.7rem" }}>YouTube →</a>
            <a href={SOCIAL.instagram} target="_blank" rel="noopener noreferrer" className="btn-ghost" style={{ fontSize: "0.7rem" }}>Instagram →</a>
          </div>
        </div>
      </Reveal>
    </PageShell>
  );
}
