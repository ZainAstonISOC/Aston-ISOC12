import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/layout/PageShell";
import Breadcrumb from "@/components/ui/Breadcrumb";
import { PageHeader, EventCard } from "@/components/ui/Cards";
import Reveal from "@/components/ui/Reveal";
import SubscribeCalendar from "@/components/events/SubscribeCalendar";
import { getPastEvents, getUpcomingEvents } from "@/lib/events";
import { formatEventDate } from "@/lib/events/time";
import { SOCIAL } from "@/lib/social";

export const revalidate = 3600;
export const metadata: Metadata = {
  title: "Events",
  description: "Every Aston ISOC event — Jumu'ah, sisters, brothers, charity, speakers and socials — with one-tap add to calendar.",
};

const PF = "'Playfair Display', Georgia, serif";
const DM = "'DM Sans', sans-serif";

export default async function EventsPage() {
  const [upcoming, past] = await Promise.all([getUpcomingEvents(), getPastEvents()]);
  const recent = past.slice(0, 6);

  return (
    <PageShell>
      <Breadcrumb crumbs={[{ label: "Events" }]} />
      <PageHeader
        label="What's On"
        title="Upcoming Events"
        subtitle="From weekly prayers to annual conferences — every ISOC event in one place, ready to drop into your calendar."
      />

      <h2 className="visually-hidden">All upcoming events</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {upcoming.map((e, i) => (
          <Reveal key={e.id} delay={i * 50}>
            <EventCard event={e} />
          </Reveal>
        ))}
      </div>

      {upcoming.length <= 1 && (
        <p style={{ fontFamily: DM, fontSize: "0.9rem", color: "var(--muted-2)", marginTop: "1.5rem" }}>
          More events are announced on{" "}
          <a href={SOCIAL.instagram} target="_blank" rel="noopener noreferrer" style={{ color: "var(--gold)" }}>
            Instagram
          </a>{" "}
          first — subscribe below and they&apos;ll land in your calendar too.
        </p>
      )}

      <div style={{ marginTop: "clamp(3rem, 7vw, 4.5rem)" }}>
        <SubscribeCalendar />
      </div>

      {recent.length > 0 && (
        <section style={{ marginTop: "clamp(3rem, 7vw, 4.5rem)" }}>
          <h2 className="eyebrow">Recently</h2>
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {recent.map(e => (
              <li key={e.id} style={{ borderBottom: "1px solid var(--line-soft)" }}>
                <Link
                  href={`/events/${e.id}`}
                  style={{ display: "flex", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap", padding: "0.9rem 0" }}
                >
                  <span style={{ fontFamily: PF, color: "#fff" }}>{e.title}</span>
                  <span style={{ fontFamily: DM, fontSize: "0.85rem", color: "var(--muted-2)" }}>
                    {formatEventDate(e.date, { day: "numeric", month: "short", year: "numeric" })}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </PageShell>
  );
}
