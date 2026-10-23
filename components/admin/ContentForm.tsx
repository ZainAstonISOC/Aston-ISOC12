"use client";
import { useActionState } from "react";
import Link from "next/link";
import { saveContentItem, type ContentFormState } from "@/app/admin/content-actions";
import type { CollectionSpec, FieldSpec } from "@/lib/content/schema";
import type { ContentFormValues } from "@/lib/content/validate";

const DM = "'DM Sans', sans-serif";

interface Props {
  spec: CollectionSpec;
  /** Present when editing an existing entry. */
  id?: string;
  initial: ContentFormValues;
}

/** One form for every editable collection, generated from its field specs. */
export default function ContentForm({ spec, id, initial }: Props) {
  const [state, action, pending] = useActionState<ContentFormState, FormData>(saveContentItem, {});
  // After a failed submit, show what was typed rather than the original values.
  const v = state.values ?? initial;
  const err = state.fieldErrors ?? {};

  const describedBy = (f: FieldSpec) =>
    [err[f.name] ? `${f.name}-error` : "", f.help ? `${f.name}-help` : ""].filter(Boolean).join(" ") || undefined;

  const input = (f: FieldSpec) => {
    const common = {
      id: f.name,
      name: f.name,
      defaultValue: v[f.name] ?? "",
      "aria-invalid": err[f.name] ? true : undefined,
      "aria-describedby": describedBy(f),
      placeholder: f.placeholder,
    };
    switch (f.type) {
      case "textarea":
        return <textarea {...common} rows={4} maxLength={f.max} />;
      case "lines":
        return <textarea {...common} rows={Math.min(8, Math.max(3, (v[f.name] ?? "").split("\n").length + 1))} />;
      case "select":
        return (
          <select {...common}>
            {!f.required && <option value="">—</option>}
            {f.required && !v[f.name] && <option value="" disabled>Choose…</option>}
            {f.options?.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        );
      case "date":
        return <input {...common} type="date" />;
      case "time":
        return <input {...common} type="time" step={300} style={{ maxWidth: 180 }} />;
      case "url":
        return <input {...common} type="text" inputMode="url" maxLength={f.max} />;
      case "email":
        return <input {...common} type="email" maxLength={f.max} />;
      default:
        return <input {...common} type="text" maxLength={f.max} />;
    }
  };

  return (
    // key forces the inputs to pick up the returned values after a failed save
    <form action={action} key={JSON.stringify(state.values ?? null)} noValidate>
      <input type="hidden" name="collection" value={spec.key} />
      {id && <input type="hidden" name="id" value={id} />}

      {state.error && (
        <p role="alert" className="card" style={{ padding: "0.9rem 1.1rem", marginBottom: "1.5rem", borderColor: "rgba(248,113,113,0.4)", color: "#fca5a5", fontFamily: DM, fontSize: "0.9rem" }}>
          {state.error}
        </p>
      )}

      {spec.fields.map(f =>
        f.type === "checkbox" ? (
          <div key={f.name} className="field-wrap">
            <label style={{ display: "flex", alignItems: "center", gap: "0.6rem", cursor: "pointer" }}>
              <input type="checkbox" name={f.name} defaultChecked={v[f.name] === "on"} style={{ width: 18, height: 18 }} />
              {f.label}
            </label>
            {f.help && <p id={`${f.name}-help`} className="admin-help">{f.help}</p>}
          </div>
        ) : (
          <div key={f.name} className="field-wrap">
            <label htmlFor={f.name}>
              {f.label}
              {!f.required && <span style={{ color: "var(--muted-2)", fontWeight: 400 }}> (optional)</span>}
            </label>
            {input(f)}
            {f.help && <p id={`${f.name}-help`} className="admin-help">{f.help}</p>}
            {err[f.name] && (
              <p id={`${f.name}-error`} style={{ fontFamily: DM, fontSize: "0.8rem", color: "#fca5a5", marginTop: "0.4rem" }}>{err[f.name]}</p>
            )}
          </div>
        ),
      )}

      <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", marginTop: "1.5rem" }}>
        <button type="submit" className="btn btn-gold" disabled={pending}>
          {pending ? "Saving…" : spec.single ? `Save ${spec.singular}` : id ? "Save changes" : `Add ${spec.singular}`}
        </button>
        <Link href={spec.single ? "/admin" : `/admin/content/${spec.key}`} className="btn btn-ghost">Cancel</Link>
      </div>

      <style>{`.admin-help { font-family: ${DM}; font-size: 0.78rem; color: var(--muted-2); margin-top: 0.35rem; line-height: 1.55; }`}</style>
    </form>
  );
}
