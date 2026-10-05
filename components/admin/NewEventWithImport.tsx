"use client";
import { useActionState } from "react";
import EventForm from "./EventForm";
import { importFromLuma, type LumaImportState } from "@/app/admin/actions";

const DM = "'DM Sans', sans-serif";

/**
 * "New event" with an optional first step: paste a Luma link to fill the form.
 * The import only pre-fills; the event is saved by the form's own Save button.
 */
export default function NewEventWithImport() {
  const [state, action, pending] = useActionState<LumaImportState, FormData>(importFromLuma, {});

  return (
    <>
      <form action={action} className="card" style={{ marginBottom: "2rem", padding: "1.25rem 1.4rem" }}>
        <label htmlFor="lumaUrl" style={{ display: "block", fontFamily: DM, fontWeight: 600, marginBottom: "0.35rem" }}>
          Import from Luma <span style={{ color: "var(--muted-2)", fontWeight: 400 }}>(optional)</span>
        </label>
        <p style={{ fontFamily: DM, fontSize: "0.82rem", color: "var(--muted-2)", marginBottom: "0.75rem" }}>
          Paste the event&apos;s Luma link to fill in the form below. Check it, then save.
        </p>
        <div style={{ display: "flex", gap: "0.6rem", flexWrap: "wrap" }}>
          <input
            id="lumaUrl"
            name="lumaUrl"
            type="url"
            className="field"
            placeholder="https://luma.com/abc123"
            style={{ flex: "1 1 260px" }}
            aria-invalid={state.error ? true : undefined}
            aria-describedby={state.error ? "luma-error" : undefined}
          />
          <button type="submit" className="btn btn-outline-gold" disabled={pending}>
            {pending ? "Reading…" : "Fill the form"}
          </button>
        </div>
        {state.error && (
          <p id="luma-error" role="alert" style={{ fontFamily: DM, fontSize: "0.85rem", color: "#fca5a5", marginTop: "0.6rem" }}>
            {state.error}
          </p>
        )}
        {state.values && (
          <p role="status" style={{ fontFamily: DM, fontSize: "0.85rem", color: "var(--gold-soft)", marginTop: "0.6rem" }}>
            Filled in from Luma. Check who it&apos;s for and the description, then save.
          </p>
        )}
      </form>
      <EventForm key={state.stamp ?? "blank"} initial={state.values} />
    </>
  );
}
