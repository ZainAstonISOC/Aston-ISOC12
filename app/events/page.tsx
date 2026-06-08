import type { Metadata } from "next";
import PageShell from "@/components/layout/PageShell";
import Breadcrumb from "@/components/ui/Breadcrumb";
import { PageHeader } from "@/components/ui/Cards";
import { EventCard } from "@/components/ui/Cards";
import Reveal from "@/components/ui/Reveal";
import { events } from "@/data/events";

export const metadata: Metadata = { title: "Events", description: "All Aston ISOC events Jumu'ah, sisters, brothers, charity, speakers and more." };

const CATEGORIES = [
  { key: "all", label: "All Events" },
  { key: "jummah", label: "Jumu'ah" },
  { key: "sisters", label: "Sisters" },
  { key: "brothers", label: "Brothers" },
  { key: "charity", label: "Charity" },
  { key: "speaker", label: "Speakers" },
  { key: "freshers", label: "Freshers" },
];

export default function EventsPage() {
  return (
    <PageShell>
      <Breadcrumb crumbs={[{ label: "Events" }]} />
      <PageHeader label="What's On" title="Events" subtitle="From weekly prayers to annual conferences every ISOC event in one place." />

      {/* Category filters */}
      <Reveal>
        <div className="flex flex-wrap gap-2 mb-12">
          {CATEGORIES.map((cat) => (
            <span
              key={cat.key}
              className="badge badge-muted cursor-pointer transition-all"
              style={{ padding: "0.4rem 1rem", fontSize: "0.65rem" }}
            >
              {cat.label}
            </span>
          ))}
        </div>
      </Reveal>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {events.map((e, i) => (
          <Reveal key={e.id} delay={i * 50}>
            <EventCard event={e} />
          </Reveal>
        ))}
      </div>
    </PageShell>
  );
}
