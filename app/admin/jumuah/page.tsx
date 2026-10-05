import type { Metadata } from "next";
import PageShell from "@/components/layout/PageShell";
import Breadcrumb from "@/components/ui/Breadcrumb";
import JumuahForm from "@/components/admin/JumuahForm";
import { requireAdmin } from "@/lib/admin/auth";
import { getSetting } from "@/lib/events/store";
import { parseJumuah } from "@/lib/jumuah";

export const metadata: Metadata = { title: "Jumu'ah" };

export default async function AdminJumuahPage() {
  await requireAdmin();
  // Read storage directly, not the cached copy, so the form shows what is saved.
  let raw: string | null = null;
  try {
    raw = await getSetting("jumuah");
  } catch (err) {
    console.error("[admin] could not load jumuah settings:", err);
  }
  const j = parseJumuah(raw);
  return (
    <PageShell>
      <Breadcrumb crumbs={[{ label: "Admin", href: "/admin" }, { label: "Jumu'ah" }]} />
      <div style={{ maxWidth: 760 }}>
        <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(2rem, 5vw, 2.6rem)", marginBottom: "0.5rem" }}>
          Jumu&apos;ah times
        </h1>
        <p style={{ fontFamily: "'DM Sans', sans-serif", color: "var(--muted)", marginBottom: "2rem", lineHeight: 1.7 }}>
          Changes show straight away on the homepage, prayer times, contact and Start Here pages, the events list, and
          everyone&apos;s subscribed calendars.
        </p>
        <JumuahForm initial={{ jamaats: j.jamaats, location: j.location, sisters: j.sisters, note: j.note }} />
      </div>
    </PageShell>
  );
}
