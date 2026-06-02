import type { Metadata } from "next";
import PageShell from "@/components/layout/PageShell";
import Breadcrumb from "@/components/ui/Breadcrumb";
import { PageHeader, ResourceItem } from "@/components/ui/Cards";
import Reveal from "@/components/ui/Reveal";
import { resources, RESOURCE_CATEGORY_LABELS, RESOURCE_CATEGORY_ORDER } from "@/data/resources";
import { SOCIAL } from "@/lib/social";

export const metadata: Metadata = { title: "Resources", description: "Islamic learning, wellbeing, student finance, and community resources curated by Aston ISOC." };

export default function ResourcesPage() {
  const populated = RESOURCE_CATEGORY_ORDER.filter((cat) => resources.some((r) => r.category === cat));

  return (
    <PageShell>
      <Breadcrumb crumbs={[{ label: "Resources" }]} />
      <PageHeader label="Islamic Library" title="Resources" subtitle="Curated resources for Muslim students — Islamic learning, wellbeing, student finance, and more." />

      <Reveal>
        <div className="flex flex-wrap gap-2 mb-12">
          {populated.map((cat) => (
            <a key={cat} href={`#${cat}`} className="badge badge-muted" style={{ padding: "0.4rem 1rem", textDecoration: "none" }}>
              {RESOURCE_CATEGORY_LABELS[cat]}
            </a>
          ))}
        </div>
      </Reveal>

      {populated.map((cat, si) => (
        <section key={cat} id={cat} className="mb-14 scroll-mt-28">
          <Reveal delay={si * 30}>
            <div className="flex items-center gap-3 mb-5">
              <span className="gold-rule" style={{ margin: 0 }} />
              <p className="label">{RESOURCE_CATEGORY_LABELS[cat]}</p>
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              {resources.filter((r) => r.category === cat).map((r) => (
                <ResourceItem key={r.id} resource={r} />
              ))}
            </div>
          </Reveal>
        </section>
      ))}

      <Reveal>
        <div
          className="p-6 text-center"
          style={{ border: "1px dashed rgba(201,162,39,0.2)", borderRadius: "1rem" }}
        >
          <p className="text-sm mb-2" style={{ color: "#6B7280", fontFamily: "var(--font-dm), var(--font-dm), 'DM Sans', sans-serif" }}>Want to suggest a resource?</p>
          <a href={SOCIAL.instagram} target="_blank" rel="noopener noreferrer"
            className="text-xs" style={{ color: "#C9A227", fontFamily: "var(--font-dm), var(--font-dm), 'DM Sans', sans-serif" }}>
            Message @astonisoc on Instagram →
          </a>
        </div>
      </Reveal>
    </PageShell>
  );
}
