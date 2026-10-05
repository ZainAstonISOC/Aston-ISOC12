import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/layout/PageShell";
import DeleteEventButton from "@/components/admin/DeleteEventButton";
import { requireAdmin } from "@/lib/admin/auth";
import { logout } from "./actions";
import { CATEGORY_LABELS } from "@/lib/events";
import { getBuiltinEvents } from "@/data/events";
import { listStoredEvents, storageMode } from "@/lib/events/store";
import { formatEventDate, londonNow } from "@/lib/events/time";
import type { Event } from "@/types";

// absolute: the layout template does not apply to a page in its own segment
export const metadata: Metadata = { title: { absolute: "Events | Aston ISOC Admin" } };

const PF = "'Playfair Display', Georgia, serif";
const DM = "'DM Sans', sans-serif";

function EventRow({ event, editable }: { event: Event; editable: boolean }) {
  return (
    <li className="admin-event">
      <div style={{ minWidth: 0 }}>
        <p style={{ fontFamily: PF, color: "#fff", fontSize: "1.05rem", marginBottom: "0.2rem" }}>
          <Link href={`/events/${event.id}`} style={{ color: "inherit" }}>{event.title}</Link>
        </p>
        <p style={{ fontFamily: DM, fontSize: "0.82rem", color: "var(--muted-2)" }}>
          {event.isRecurring
            ? `${event.recurringNote} · ${event.time}`
            : `${formatEventDate(event.date, { weekday: "short", day: "numeric", month: "short", year: "numeric" })} · ${event.time}${event.endTime ? `–${event.endTime}` : ""}`}
          {" · "}
          {CATEGORY_LABELS[event.category]}
          {event.isFeatured && " · Featured"}
        </p>
      </div>
      {editable ? (
        <div style={{ display: "flex", gap: "0.5rem", flexShrink: 0 }}>
          <Link href={`/admin/events/${event.id}/edit`} className="btn btn-outline-gold" style={{ padding: "0.55rem 1rem", fontSize: "0.82rem" }}>
            Edit
          </Link>
          <DeleteEventButton id={event.id} title={event.title} />
        </div>
      ) : (
        <span className="badge badge-muted" title="Built into the website — change it in data/events.ts">Built in</span>
      )}
    </li>
  );
}

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string; deleted?: string; error?: string }>;
}) {
  await requireAdmin();
  const params = await searchParams;
  const mode = storageMode();

  // Uncached on purpose: an admin should always see exactly what is stored.
  let stored: Event[] = [];
  let loadError = false;
  try {
    stored = await listStoredEvents();
  } catch (err) {
    console.error("[admin] could not load events:", err);
    loadError = true;
  }

  const today = londonNow().date;
  const byDate = (a: Event, b: Event) => `${a.date}T${a.time}`.localeCompare(`${b.date}T${b.time}`);
  const upcoming = stored.filter(e => e.date >= today).sort(byDate);
  const past = stored.filter(e => e.date < today).sort(byDate).reverse();

  return (
    <PageShell>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: "1rem", flexWrap: "wrap", marginBottom: "2rem" }}>
        <div>
          <p className="eyebrow">Admin</p>
          <h1 style={{ fontFamily: PF, fontSize: "clamp(2rem, 5vw, 2.8rem)" }}>Events</h1>
        </div>
        <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
          <Link href="/admin/events/new" className="btn btn-gold">+ New event</Link>
          <form action={logout}>
            <button type="submit" className="btn btn-ghost">Log out</button>
          </form>
        </div>
      </div>

      {params.saved && (
        <p role="status" className="card admin-flash">
          Saved. It&apos;s live on the site and in subscribed calendars.{" "}
          <Link href={`/events/${params.saved}`} style={{ color: "var(--gold)" }}>View it →</Link>
        </p>
      )}
      {params.deleted && <p role="status" className="card admin-flash">Event deleted.</p>}
      {params.error === "delete" && (
        <p role="alert" className="card admin-flash admin-flash--error">Deleting failed — the event is still there. Try again.</p>
      )}

      {mode === "unavailable" && (
        <div role="alert" className="card admin-flash admin-flash--error">
          <strong>Event storage isn&apos;t connected yet</strong>, so new events can&apos;t be saved. In Vercel:
          Storage → create an <strong>Upstash Redis</strong> database → connect it to this project → redeploy.
        </div>
      )}
      {mode === "redis" && process.env.VERCEL_ENV === "preview" && (
        <p className="card admin-flash">
          <strong>Preview deployment.</strong> Events saved here are test data, stored separately, and
          never appear on the live site.
        </p>
      )}
      {mode === "local-file" && (
        <p className="card admin-flash">
          Development mode: events are saved to <code>.data/events.json</code> on this computer only.
        </p>
      )}
      {loadError && (
        <p role="alert" className="card admin-flash admin-flash--error">
          Couldn&apos;t load events from storage just now. The public site is unaffected — refresh to try again.
        </p>
      )}

      <section style={{ marginBottom: "3rem" }}>
        <h2 className="eyebrow">Upcoming</h2>
        {upcoming.length === 0 ? (
          <p style={{ fontFamily: DM, color: "var(--muted)" }}>
            No upcoming events yet. <Link href="/admin/events/new" style={{ color: "var(--gold)" }}>Add the first one →</Link>
          </p>
        ) : (
          <ul className="admin-list">{upcoming.map(e => <EventRow key={e.id} event={e} editable />)}</ul>
        )}
      </section>

      <section style={{ marginBottom: "3rem" }}>
        <h2 className="eyebrow">Every week</h2>
        <ul className="admin-list">{getBuiltinEvents().map(e => <EventRow key={e.id} event={e} editable={false} />)}</ul>
      </section>

      {past.length > 0 && (
        <section>
          <h2 className="eyebrow">Past</h2>
          <ul className="admin-list">{past.map(e => <EventRow key={e.id} event={e} editable />)}</ul>
        </section>
      )}

      <style>{`
        .admin-list { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 0.6rem; }
        .admin-event {
          display: flex; justify-content: space-between; align-items: center; gap: 1rem; flex-wrap: wrap;
          padding: 1rem 1.25rem; border: 1px solid var(--line-soft); border-radius: var(--radius-sm); background: var(--surface);
        }
        .admin-flash { padding: 0.9rem 1.1rem !important; margin-bottom: 1.25rem; font-family: ${DM}; font-size: 0.9rem; color: var(--text); line-height: 1.6; }
        .admin-flash:hover { transform: none !important; }
        .admin-flash--error { border-color: rgba(248,113,113,0.4) !important; color: #fca5a5; }
        .admin-flash code { font-size: 0.85em; color: var(--gold-soft); }
      `}</style>
    </PageShell>
  );
}
