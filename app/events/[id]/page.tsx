import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import PageShell from "@/components/layout/PageShell";
import Breadcrumb from "@/components/ui/Breadcrumb";
import Reveal from "@/components/ui/Reveal";
import { getEventById, events } from "@/data/events";
import { SOCIAL } from "@/lib/social";

export async function generateStaticParams() { return events.map(e => ({ id: e.id })); }
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const event = getEventById(id);
  return { title: event?.title ?? "Event Not Found" };
}

const PF = "'Playfair Display', Georgia, serif";
const DM = "'DM Sans', sans-serif";
const EVENT_LABELS: Record<string, string> = {
  all: "All Welcome", sisters: "Sisters Only", brothers: "Brothers Only",
  jummah: "Jumu'ah", charity: "Charity", sports: "Sports",
  speaker: "Speaker Event", freshers: "Freshers", social: "Social",
};

export default async function EventDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const event = getEventById(id);
  if (!event) notFound();
  const d = new Date(event.date);
  return (
    <PageShell>
      <Breadcrumb crumbs={[{ label: "Events", href: "/events" }, { label: event.title }]} />
      <Reveal>
        <div className="max-w-2xl">
          <div className="flex items-baseline gap-4 mb-6">
            <span style={{ fontFamily: PF, fontSize: "4.5rem", fontWeight: 400, color: "#d8af72", lineHeight: 1 }}>
              {d.getDate().toString().padStart(2, "0")}
            </span>
            <div>
              <p className="text-xs tracking-widest uppercase" style={{ color: "var(--muted-2)", fontFamily: DM }}>
                {d.toLocaleDateString("en-GB", { month: "long", year: "numeric" })}
              </p>
              <p className="text-xs mt-0.5" style={{ color: "#d8af72", fontFamily: DM }}>⏰ {event.time}</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 mb-5">
            <span className={`badge badge-${event.category}`}>{EVENT_LABELS[event.category] ?? event.category}</span>
            {event.isRecurring && <span className="badge badge-muted">Recurring</span>}
            {event.isFeatured && <span className="badge badge-gold">Featured</span>}
          </div>
          <h1 style={{ fontFamily: PF, fontSize: "clamp(2rem,4.5vw,3.2rem)", fontWeight: 500, color: "#fff", marginBottom: "1rem", lineHeight: 1.08 }}>{event.title}</h1>
          <span className="gold-rule" />
          <p className="text-sm mb-2" style={{ color: "var(--muted)", fontFamily: DM }}>📍 {event.location}</p>
          {event.isRecurring && event.recurringNote && (
            <p className="text-sm mb-6" style={{ color: "#d8af72", fontFamily: DM }}>🔁 {event.recurringNote}</p>
          )}
          <p className="text-base leading-relaxed mb-10" style={{ color: "var(--muted)", fontFamily: DM, lineHeight: 1.85 }}>{event.description}</p>
          <div className="flex gap-3 flex-wrap">
            {event.registrationUrl
              ? <a href={event.registrationUrl} target="_blank" rel="noopener noreferrer" className="btn btn-gold">Register for This Event</a>
              : <a href={SOCIAL.instagram} target="_blank" rel="noopener noreferrer" className="btn btn-gold">Register via Instagram</a>}
            <Link href="/events" className="btn btn-ghost">← All Events</Link>
          </div>
        </div>
      </Reveal>
    </PageShell>
  );
}
