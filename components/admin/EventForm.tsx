"use client";
import { useActionState } from "react";
import Link from "next/link";
import { saveEvent, type EventFormState } from "@/app/admin/actions";
import { CATEGORY_LABELS } from "@/lib/events/categories";
import type { EventFormValues } from "@/lib/admin/validate";

const DM = "'DM Sans', sans-serif";

const EMPTY: EventFormValues = {
  title: "",
  date: "",
  time: "",
  endTime: "",
  location: "",
  category: "all",
  description: "",
  registrationUrl: "",
  isFeatured: "",
};

interface Props {
  /** Present when editing an existing event. */
  id?: string;
  initial?: EventFormValues;
}

export default function EventForm({ id, initial }: Props) {
  const [state, action, pending] = useActionState<EventFormState, FormData>(saveEvent, {});
  // After a failed submit, show what was typed rather than the original values.
  const v = state.values ?? initial ?? EMPTY;
  const err = state.fieldErrors ?? {};

  const field = (name: keyof EventFormValues) => ({
    id: name,
    name,
    "aria-invalid": err[name] ? true : undefined,
    "aria-describedby": err[name] ? `${name}-error` : undefined,
  });

  const errorText = (name: keyof EventFormValues) =>
    err[name] ? (
      <p id={`${name}-error`} style={{ fontFamily: DM, fontSize: "0.8rem", color: "#fca5a5", marginTop: "0.4rem" }}>
        {err[name]}
      </p>
    ) : null;

  return (
    // key forces the inputs to pick up the returned values after a failed save
    <form action={action} key={JSON.stringify(state.values ?? null)} noValidate>
      {id && <input type="hidden" name="id" value={id} />}

      {state.error && (
        <p role="alert" className="card" style={{ padding: "0.9rem 1.1rem", marginBottom: "1.5rem", borderColor: "rgba(248,113,113,0.4)", color: "#fca5a5", fontFamily: DM, fontSize: "0.9rem" }}>
          {state.error}
        </p>
      )}

      <div className="field-wrap">
        <label htmlFor="title">Title</label>
        <input {...field("title")} className="field" defaultValue={v.title} maxLength={120} required placeholder="e.g. Charity Week Launch" />
        {errorText("title")}
      </div>

      <div className="admin-row">
        <div className="field-wrap">
          <label htmlFor="date">Date</label>
          <input {...field("date")} type="date" className="field" defaultValue={v.date} required />
          {errorText("date")}
        </div>
        <div className="field-wrap">
          <label htmlFor="time">Starts</label>
          <input {...field("time")} type="time" className="field" defaultValue={v.time} required />
          {errorText("time")}
        </div>
        <div className="field-wrap">
          <label htmlFor="endTime">Ends <span style={{ color: "var(--muted-2)", fontWeight: 400 }}>(optional)</span></label>
          <input {...field("endTime")} type="time" className="field" defaultValue={v.endTime} />
          {errorText("endTime")}
        </div>
      </div>

      <div className="admin-row admin-row--2">
        <div className="field-wrap">
          <label htmlFor="location">Location</label>
          <input {...field("location")} className="field" defaultValue={v.location} maxLength={160} required placeholder="e.g. Main Building, MB550" />
          {errorText("location")}
        </div>
        <div className="field-wrap">
          <label htmlFor="category">Who is it for?</label>
          <select {...field("category")} className="field" defaultValue={v.category}>
            {Object.entries(CATEGORY_LABELS).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
          {errorText("category")}
        </div>
      </div>

      <div className="field-wrap">
        <label htmlFor="description">Description</label>
        <textarea {...field("description")} className="field" defaultValue={v.description} rows={6} maxLength={2000} required
          placeholder="What's happening, who's speaking, what to bring. Line breaks are kept." />
        {errorText("description")}
      </div>

      <div className="field-wrap">
        <label htmlFor="registrationUrl">Sign-up link <span style={{ color: "var(--muted-2)", fontWeight: 400 }}>(optional)</span></label>
        <input {...field("registrationUrl")} type="url" className="field" defaultValue={v.registrationUrl} placeholder="https://…" />
        {errorText("registrationUrl")}
      </div>

      <label style={{ display: "flex", gap: "0.7rem", alignItems: "center", fontFamily: DM, fontSize: "0.92rem", color: "var(--text)", margin: "0.5rem 0 1.75rem", cursor: "pointer" }}>
        <input type="checkbox" name="isFeatured" defaultChecked={v.isFeatured === "on"} style={{ width: 18, height: 18, accentColor: "#d8af72" }} />
        Feature on the homepage
      </label>

      <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
        <button type="submit" className="btn btn-gold" disabled={pending}>
          {pending ? "Saving…" : id ? "Save changes" : "Publish event"}
        </button>
        <Link href="/admin" className="btn btn-ghost">Cancel</Link>
      </div>

      <style>{`
        .admin-row { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 0 1rem; }
        .admin-row--2 { grid-template-columns: minmax(0, 1.4fr) minmax(0, 1fr); }
        textarea.field { resize: vertical; min-height: 140px; line-height: 1.6; }
        input[type="date"].field, input[type="time"].field { color-scheme: dark; min-height: 44px; }
        @media (max-width: 640px) {
          .admin-row, .admin-row--2 { grid-template-columns: minmax(0, 1fr); }
        }
      `}</style>
    </form>
  );
}
