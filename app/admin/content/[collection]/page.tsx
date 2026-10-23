import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import PageShell from "@/components/layout/PageShell";
import ContentForm from "@/components/admin/ContentForm";
import DeleteContentButton from "@/components/admin/DeleteContentButton";
import { AdminNav, AdminStyles } from "@/components/admin/AdminChrome";
import { moveContentItem, undoContent } from "@/app/admin/content-actions";
import { requireAdmin } from "@/lib/admin/auth";
import { readCollection, type StoredCollection } from "@/lib/content";
import { collectionSpec, displayValue } from "@/lib/content/schema";
import { toFormValues } from "@/lib/content/validate";

const PF = "'Playfair Display', Georgia, serif";
const DM = "'DM Sans', sans-serif";

export async function generateMetadata({ params }: { params: Promise<{ collection: string }> }): Promise<Metadata> {
  const spec = collectionSpec((await params).collection);
  return { title: spec?.title ?? "Content" };
}

export default async function AdminCollectionPage({
  params,
  searchParams,
}: {
  params: Promise<{ collection: string }>;
  searchParams: Promise<{ saved?: string; deleted?: string; undone?: string; error?: string }>;
}) {
  await requireAdmin();
  const { collection } = await params;
  const spec = collectionSpec(collection);
  if (!spec) notFound();
  const flash = await searchParams;

  let data: StoredCollection | null = null;
  try {
    data = await readCollection(spec.key);
  } catch (err) {
    console.error(`[admin] could not load ${spec.key}:`, err);
  }

  const MoveButton = ({ id, dir, disabled }: { id: string; dir: "up" | "down"; disabled: boolean }) => (
    <form action={moveContentItem}>
      <input type="hidden" name="collection" value={spec.key} />
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="dir" value={dir} />
      <button type="submit" className="btn btn-ghost admin-small-btn" disabled={disabled} aria-label={`Move ${dir}`}>
        {dir === "up" ? "↑" : "↓"}
      </button>
    </form>
  );

  return (
    <PageShell>
      <AdminStyles />
      <AdminNav current={spec.key} />

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: "1rem", flexWrap: "wrap", marginBottom: "1.5rem" }}>
        <div>
          <p className="eyebrow">Admin</p>
          <h1 style={{ fontFamily: PF, fontSize: "clamp(2rem, 5vw, 2.8rem)" }}>{spec.title}</h1>
          <p style={{ fontFamily: DM, color: "var(--muted)", marginTop: "0.4rem", maxWidth: "60ch" }}>
            {spec.description}{" "}
            {spec.pages.map((p, i) => (
              <span key={p.href}>{i ? " · " : "See it on "}<Link href={p.href} style={{ color: "var(--gold)" }}>{p.label}</Link></span>
            ))}
          </p>
        </div>
        <div style={{ display: "flex", gap: "0.6rem", flexWrap: "wrap" }}>
          {data?.canUndo && (
            <form action={undoContent}>
              <input type="hidden" name="collection" value={spec.key} />
              <button type="submit" className="btn btn-ghost">Undo last change</button>
            </form>
          )}
          {!spec.single && <Link href={`/admin/content/${spec.key}/new`} className="btn btn-gold">+ Add {spec.singular}</Link>}
        </div>
      </div>

      {flash.saved && <p role="status" className="card admin-flash">Saved. It&apos;s live on the site now.</p>}
      {flash.deleted && <p role="status" className="card admin-flash">Deleted. &ldquo;Undo last change&rdquo; brings it back.</p>}
      {flash.undone && <p role="status" className="card admin-flash">Last change undone. Press undo again to redo it.</p>}
      {flash.error && <p role="alert" className="card admin-flash admin-flash--error">That didn&apos;t work — nothing was changed. Try again in a moment.</p>}
      {!data && (
        <p role="alert" className="card admin-flash admin-flash--error">
          Couldn&apos;t load this from storage just now. The public site is unaffected — refresh to try again.
        </p>
      )}
      {data && !data.saved && (
        <p className="card admin-flash">
          Showing what&apos;s on the site today. Nothing has been changed from here yet.
        </p>
      )}
      {data?.updatedAt && (
        <p style={{ fontFamily: DM, fontSize: "0.78rem", color: "var(--muted-2)", marginBottom: "1rem" }}>
          Last saved {new Date(data.updatedAt).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short", timeZone: "Europe/London" })}
        </p>
      )}

      {data && spec.single && (
        <div style={{ maxWidth: 760 }}>
          <ContentForm spec={spec} initial={toFormValues(spec, data.items[0])} />
        </div>
      )}

      {data && !spec.single && (
        data.items.length === 0 ? (
          <p style={{ fontFamily: DM, color: "var(--muted)" }}>
            Nothing here yet. <Link href={`/admin/content/${spec.key}/new`} style={{ color: "var(--gold)" }}>Add the first {spec.singular} →</Link>
          </p>
        ) : (
          <ul className="admin-list">
            {data.items.map((item, i) => {
              const title = displayValue(spec, spec.titleField, item[spec.titleField]) || item.id;
              const sub = (spec.subtitleFields ?? []).map(f => displayValue(spec, f, item[f])).filter(Boolean).join(" · ");
              return (
                <li key={item.id} className="admin-event">
                  <div style={{ minWidth: 0 }}>
                    <p style={{ fontFamily: PF, color: "#fff", fontSize: "1.05rem", marginBottom: "0.2rem" }}>{title}</p>
                    {sub && <p style={{ fontFamily: DM, fontSize: "0.82rem", color: "var(--muted-2)" }}>{sub}</p>}
                  </div>
                  <div style={{ display: "flex", gap: "0.4rem", flexShrink: 0, flexWrap: "wrap" }}>
                    <MoveButton id={item.id} dir="up" disabled={i === 0} />
                    <MoveButton id={item.id} dir="down" disabled={i === data.items.length - 1} />
                    <Link href={`/admin/content/${spec.key}/${encodeURIComponent(item.id)}`} className="btn btn-outline-gold admin-small-btn">Edit</Link>
                    <DeleteContentButton collection={spec.key} id={item.id} title={title} />
                  </div>
                </li>
              );
            })}
          </ul>
        )
      )}
    </PageShell>
  );
}
