import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PageShell from "@/components/layout/PageShell";
import Breadcrumb from "@/components/ui/Breadcrumb";
import ContentForm from "@/components/admin/ContentForm";
import { requireAdmin } from "@/lib/admin/auth";
import { collectionSpec } from "@/lib/content/schema";
import { toFormValues } from "@/lib/content/validate";

export const metadata: Metadata = { title: "Add" };

export default async function NewContentPage({ params }: { params: Promise<{ collection: string }> }) {
  await requireAdmin();
  const spec = collectionSpec((await params).collection);
  if (!spec || spec.single) notFound();
  return (
    <PageShell>
      <Breadcrumb crumbs={[{ label: "Admin", href: "/admin" }, { label: spec.title, href: `/admin/content/${spec.key}` }, { label: "Add" }]} />
      <div style={{ maxWidth: 760 }}>
        <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(2rem, 5vw, 2.6rem)", marginBottom: "2rem" }}>
          Add {spec.singular}
        </h1>
        <ContentForm spec={spec} initial={toFormValues(spec, undefined)} />
      </div>
    </PageShell>
  );
}
