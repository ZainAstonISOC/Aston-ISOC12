import type { Metadata } from "next";
import PageShell from "@/components/layout/PageShell";
import Breadcrumb from "@/components/ui/Breadcrumb";
import EventForm from "@/components/admin/EventForm";
import { requireAdmin } from "@/lib/admin/auth";

export const metadata: Metadata = { title: "New event" };

export default async function NewEventPage() {
  await requireAdmin();
  return (
    <PageShell>
      <Breadcrumb crumbs={[{ label: "Admin", href: "/admin" }, { label: "New event" }]} />
      <div style={{ maxWidth: 760 }}>
        <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(2rem, 5vw, 2.6rem)", marginBottom: "2rem" }}>
          New event
        </h1>
        <EventForm />
      </div>
    </PageShell>
  );
}
