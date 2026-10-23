"use client";
import { deleteContentItem } from "@/app/admin/content-actions";

/** Removes one entry from a content list after a confirm. Undo can bring it back. */
export default function DeleteContentButton({ collection, id, title }: { collection: string; id: string; title: string }) {
  return (
    <form
      action={deleteContentItem}
      onSubmit={e => {
        if (!window.confirm(`Delete "${title}"?\n\nIt disappears from the website straight away. "Undo last change" can bring it back.`)) {
          e.preventDefault();
        }
      }}
    >
      <input type="hidden" name="collection" value={collection} />
      <input type="hidden" name="id" value={id} />
      <button type="submit" className="btn btn-ghost" style={{ padding: "0.55rem 1rem", fontSize: "0.82rem", color: "#fca5a5", borderColor: "rgba(248,113,113,0.3)" }}>
        Delete
      </button>
    </form>
  );
}
