import type { CollectionSpec, ContentItem, ContentValue } from "./schema";

export type ContentErrors = Record<string, string>;
/** What the form sends back on an error, so nothing typed is lost. */
export type ContentFormValues = Record<string, string>;

function validDate(v: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(v)) return false;
  const [y, m, d] = v.split("-").map(Number);
  const t = new Date(Date.UTC(y, m - 1, d));
  return t.getUTCFullYear() === y && t.getUTCMonth() === m - 1 && t.getUTCDate() === d;
}

/**
 * Links must be http(s) or a path on this site. Anything else (javascript:,
 * data:) would become a clickable link on the public site.
 */
function validUrl(v: string): boolean {
  if (/^\/(?!\/)/.test(v)) return true;
  try {
    const u = new URL(v);
    return u.protocol === "https:" || u.protocol === "http:";
  } catch {
    return false;
  }
}

export function readContentForm(spec: CollectionSpec, form: FormData): ContentFormValues {
  const out: ContentFormValues = {};
  for (const f of spec.fields) {
    if (f.type === "checkbox") out[f.name] = form.get(f.name) ? "on" : "";
    // Browsers submit textarea line breaks as CRLF; store plain newlines.
    else out[f.name] = String(form.get(f.name) ?? "").trim().replace(/\r\n?/g, "\n");
  }
  return out;
}

export function validateContent(spec: CollectionSpec, v: ContentFormValues): ContentErrors {
  const errors: ContentErrors = {};
  for (const f of spec.fields) {
    const val = v[f.name] ?? "";
    if (f.type === "checkbox") continue;
    if (!val) {
      if (f.required) errors[f.name] = f.type === "select" ? "Choose one." : "This is needed.";
      continue;
    }
    if (f.type === "lines") {
      const lines = val.split("\n").map(x => x.trim()).filter(Boolean);
      if (f.max && lines.length > f.max) errors[f.name] = `Up to ${f.max} lines.`;
      else if (lines.some(l => l.length > 80)) errors[f.name] = "Keep each line under 80 characters.";
      continue;
    }
    if (f.max && val.length > f.max) { errors[f.name] = `Keep this under ${f.max} characters.`; continue; }
    if (f.type === "url" && !validUrl(val)) errors[f.name] = "Use a full link starting https://, or a page here like /events.";
    if (f.type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) errors[f.name] = "That email address doesn't look right.";
    if (f.type === "date" && !validDate(val)) errors[f.name] = "Pick a date.";
    if (f.type === "select" && !f.options?.some(o => o.value === val)) errors[f.name] = "Choose one of the options.";
  }
  return errors;
}

export function toContentItem(spec: CollectionSpec, id: string, v: ContentFormValues): ContentItem {
  const item: ContentItem = { id };
  for (const f of spec.fields) {
    const val = v[f.name] ?? "";
    let out: ContentValue = val;
    if (f.type === "checkbox") out = val === "on";
    else if (f.type === "lines") out = val.split("\n").map(x => x.trim()).filter(Boolean);
    item[f.name] = out;
  }
  return item;
}

export function toFormValues(spec: CollectionSpec, item: ContentItem | undefined): ContentFormValues {
  const out: ContentFormValues = {};
  for (const f of spec.fields) {
    const val = item?.[f.name];
    if (f.type === "checkbox") out[f.name] = val === true ? "on" : "";
    else if (Array.isArray(val)) out[f.name] = val.join("\n");
    else out[f.name] = typeof val === "string" ? val : "";
  }
  return out;
}
