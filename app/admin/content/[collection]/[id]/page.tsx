import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PageShell from "@/components/layout/PageShell";
import Breadcrumb from "@/components/ui/Breadcrumb";
import ContentForm from "@/components/admin/ContentForm";
import { requireAdmin } from "@/lib/admin/auth";
import { readCollection } from "@/lib/content";
import { collectionSpec } from "@/lib/content/schema";
import { toFormValues } from "@/lib/content/validate";

export const metadata: Metadata = { title: "Edit" };

export default async function EditContentPage({ params }: { params: Promise<{ collection: string; id: string }> }) {
  await requireAdmin();
  const { collection, id } = await params;
  const spec = collectionSpec(collection);
  if (!spec || spec.single) notFound();
  // Read storage directly so the form never starts from a stale cached copy.
  const item = (await readCollection(spec.key)).items.find(i => i.id === decodeURIComponent(id));
  if (!item) notFound();
  return (
    <PageShell>
      <Breadcrumb crumbs={[{ label: "Admin", href: "/admin" }, { label: spec.title, href: `/admin/content/${spec.key}` }, { label: "Edit" }]} />
      <div style={{ maxWidth: 760 }}>
        <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(2rem, 5vw, 2.6rem)", marginBottom: "2rem" }}>
          Edit {spec.singular}
        </h1>
        <ContentForm spec={spec} id={item.id} initial={toFormValues(spec, item)} />
      </div>
    </PageShell>
  );
}
