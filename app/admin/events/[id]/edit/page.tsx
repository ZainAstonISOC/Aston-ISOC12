import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PageShell from "@/components/layout/PageShell";
import Breadcrumb from "@/components/ui/Breadcrumb";
import EventForm from "@/components/admin/EventForm";
import { requireAdmin } from "@/lib/admin/auth";
import { toFormValues } from "@/lib/admin/validate";
import { getStoredEvent } from "@/lib/events/store";

export const metadata: Metadata = { title: "Edit event" };

export default async function EditEventPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await params;
  // Read storage directly so the form never starts from a stale cached copy.
  const event = await getStoredEvent(id);
  if (!event) notFound();

  return (
    <PageShell>
      <Breadcrumb crumbs={[{ label: "Admin", href: "/admin" }, { label: "Edit event" }]} />
      <div style={{ maxWidth: 760 }}>
        <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(2rem, 5vw, 2.6rem)", marginBottom: "2rem" }}>
          Edit event
        </h1>
        <EventForm id={event.id} initial={toFormValues(event)} />
      </div>
    </PageShell>
  );
}
