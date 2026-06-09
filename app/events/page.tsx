import type { Metadata } from "next";
import PageShell from "@/components/layout/PageShell";
import Breadcrumb from "@/components/ui/Breadcrumb";
import { PageHeader, EventCard } from "@/components/ui/Cards";
import Reveal from "@/components/ui/Reveal";
import { events } from "@/data/events";

export const revalidate = 3600;
export const metadata: Metadata = { title: "Events", description: "All Aston ISOC events Jumu'ah, sisters, brothers, charity, speakers and more." };

export default function EventsPage() {
  return (
    <PageShell>
      <Breadcrumb crumbs={[{ label: "Events" }]} />
      <PageHeader label="What's On" title="Upcoming Events" subtitle="From weekly prayers to annual conferences every ISOC event in one place." />
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
