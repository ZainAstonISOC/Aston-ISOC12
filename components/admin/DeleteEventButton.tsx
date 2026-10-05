"use client";
import { deleteEvent } from "@/app/admin/actions";

/** Deleting also removes the event from everyone's subscribed calendars, so confirm first. */
export default function DeleteEventButton({ id, title }: { id: string; title: string }) {
  return (
    <form
      action={deleteEvent}
      onSubmit={e => {
        if (!window.confirm(`Delete "${title}"?\n\nIt will disappear from the website and from subscribers' calendars.`)) {
          e.preventDefault();
        }
      }}
    >
      <input type="hidden" name="id" value={id} />
      <button type="submit" className="btn btn-ghost" style={{ padding: "0.55rem 1rem", fontSize: "0.82rem", color: "#fca5a5", borderColor: "rgba(248,113,113,0.3)" }}>
        Delete
      </button>
    </form>
  );
}
