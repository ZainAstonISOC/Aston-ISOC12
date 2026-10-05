"use client";
import { useActionState } from "react";
import Link from "next/link";
import { saveJumuah, type JumuahFormState, type JumuahFormValues } from "@/app/admin/actions";

const DM = "'DM Sans', sans-serif";
const SLOTS = 3;

export default function JumuahForm({ initial }: { initial: JumuahFormValues }) {
  const [state, action, pending] = useActionState<JumuahFormState, FormData>(saveJumuah, {});
  const v = state.values ?? initial;
  const err = state.fieldErrors ?? {};
  const slots = Array.from({ length: SLOTS }, (_, i) => v.jamaats[i] ?? "");

  const errorText = (name: keyof NonNullable<JumuahFormState["fieldErrors"]>) =>
    err[name] ? (
      <p id={`${name}-error`} style={{ fontFamily: DM, fontSize: "0.8rem", color: "#fca5a5", marginTop: "0.4rem" }}>{err[name]}</p>
    ) : null;

  return (
    <form action={action} key={JSON.stringify(state.values ?? null)} noValidate>
      {state.error && (
        <p role="alert" className="card" style={{ padding: "0.9rem 1.1rem", marginBottom: "1.5rem", borderColor: "rgba(248,113,113,0.4)", color: "#fca5a5", fontFamily: DM, fontSize: "0.9rem" }}>
          {state.error}
        </p>
      )}

      <fieldset className="field-wrap" style={{ border: "none", padding: 0 }} aria-describedby={err.jamaats ? "jamaats-error" : "jamaats-help"}>
        <legend style={{ fontFamily: DM, fontWeight: 600, marginBottom: "0.4rem" }}>Jamaat times</legend>
        <p id="jamaats-help" style={{ fontFamily: DM, fontSize: "0.82rem", color: "var(--muted-2)", marginBottom: "0.6rem" }}>
          When each Jumu&apos;ah starts. Leave a box empty to remove that jamaat.
        </p>
        <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
          {slots.map((t, i) => (
            <label key={i} style={{ display: "flex", flexDirection: "column", gap: "0.3rem", fontFamily: DM, fontSize: "0.78rem", color: "var(--muted-2)" }}>
              {["1st", "2nd", "3rd"][i]} jamaat
              <input type="time" name="jamaat" defaultValue={t} step={300} aria-invalid={err.jamaats ? true : undefined} style={{ minWidth: 140 }} />
            </label>
          ))}
        </div>
        {errorText("jamaats")}
      </fieldset>

      <div className="field-wrap">
        <label htmlFor="location">Location</label>
        <input id="location" name="location" defaultValue={v.location} maxLength={120} aria-invalid={err.location ? true : undefined} aria-describedby={err.location ? "location-error" : undefined} />
        {errorText("location")}
      </div>

      <div className="field-wrap">
        <label htmlFor="sisters">Sisters&apos; arrangements <span style={{ color: "var(--muted-2)", fontWeight: 400 }}>(optional)</span></label>
        <input id="sisters" name="sisters" defaultValue={v.sisters} maxLength={160} aria-invalid={err.sisters ? true : undefined} aria-describedby={err.sisters ? "sisters-error" : undefined} />
        {errorText("sisters")}
      </div>

      <div className="field-wrap">
        <label htmlFor="note">Notice <span style={{ color: "var(--muted-2)", fontWeight: 400 }}>(optional)</span></label>
        <textarea id="note" name="note" rows={2} defaultValue={v.note} maxLength={240} placeholder="e.g. No Jumu'ah on campus on 26 December." aria-invalid={err.note ? true : undefined} aria-describedby={err.note ? "note-error" : undefined} />
        <p style={{ fontFamily: DM, fontSize: "0.78rem", color: "var(--muted-2)", marginTop: "0.35rem" }}>Shown on the prayer page and the Jumu&apos;ah event. Clear it when it no longer applies.</p>
        {errorText("note")}
      </div>

      <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", marginTop: "1.5rem" }}>
        <button type="submit" className="btn btn-gold" disabled={pending}>{pending ? "Saving…" : "Save Jumu'ah details"}</button>
        <Link href="/admin" className="btn btn-ghost">Cancel</Link>
      </div>
    </form>
  );
}
