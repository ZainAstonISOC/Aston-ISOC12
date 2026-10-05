import type { EventFormValues } from "@/lib/admin/validate";

/**
 * LUMA IMPORT
 * ---------------------------------------------------------------
 * The society runs sign-ups on Luma, mostly as private (link-only) events, so
 * they never appear in Luma's public calendar feed. Instead the committee
 * pastes an event's link into /admin, and this reads that one public event
 * page and pre-fills the new-event form. Nothing is saved until they press
 * Save, and they can edit everything first.
 *
 * Only luma.com / lu.ma links are fetched, so the admin form can't be used to
 * make the server request arbitrary URLs.
 */

const HOSTS = new Set(["luma.com", "www.luma.com", "lu.ma", "www.lu.ma"]);
const SLUG = /^\/(?:event\/)?([A-Za-z0-9_-]{4,64})\/?$/;

export class LumaImportError extends Error {}

/** "https://lu.ma/abc123?x=1" → "https://luma.com/abc123"; anything else throws. */
export function normaliseLumaUrl(input: string): string {
  let url: URL;
  try {
    url = new URL(input.trim());
  } catch {
    throw new LumaImportError("That isn't a link. Paste the full Luma address, like https://luma.com/abc123.");
  }
  const slug = SLUG.exec(url.pathname)?.[1];
  if (url.protocol !== "https:" || !HOSTS.has(url.hostname) || !slug) {
    throw new LumaImportError("Only Luma event links work here, like https://luma.com/abc123.");
  }
  return `https://luma.com/${slug}`;
}

interface MirrorNode {
  type?: string;
  text?: string;
  content?: MirrorNode[];
}

/** Luma stores descriptions as a ProseMirror document; flatten it to paragraphs. */
function mirrorToText(node: MirrorNode | undefined): string {
  if (!node) return "";
  if (node.type === "text") return node.text ?? "";
  if (node.type === "hard_break") return "\n";
  const inner = (node.content ?? []).map(mirrorToText).join("");
  return ["paragraph", "heading", "list_item", "blockquote"].includes(node.type ?? "") ? `${inner}\n\n` : inner;
}

const londonParts = new Intl.DateTimeFormat("en-GB", {
  timeZone: "Europe/London",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
});

function londonDateTime(iso: string): { date: string; time: string } {
  const p = Object.fromEntries(londonParts.formatToParts(new Date(iso)).map((x) => [x.type, x.value]));
  return { date: `${p.year}-${p.month}-${p.day}`, time: `${p.hour}:${p.minute}` };
}

/** A best guess the committee can change: who the event looks aimed at. */
function guessCategory(name: string): string {
  if (/\bsisters?\b/i.test(name)) return "sisters";
  if (/\bbrothers?\b/i.test(name)) return "brothers";
  if (/football|futsal|netball|badminton|sport/i.test(name)) return "sports";
  return "all";
}

export async function fetchLumaEvent(input: string): Promise<EventFormValues> {
  const url = normaliseLumaUrl(input);
  let html: string;
  try {
    const res = await fetch(url, {
      cache: "no-store",
      redirect: "follow",
      headers: { "User-Agent": "Mozilla/5.0 (compatible; AstonISOC-admin/1.0; +https://www.astonisoc.com)" },
      signal: AbortSignal.timeout(8000),
    });
    if (!HOSTS.has(new URL(res.url).hostname)) throw new LumaImportError("That link left Luma, so it wasn't read.");
    if (res.status === 404) throw new LumaImportError("Luma says that event doesn't exist. Check the link.");
    if (!res.ok) throw new LumaImportError(`Luma didn't answer (${res.status}). Try again, or fill the form in by hand.`);
    html = await res.text();
  } catch (err) {
    if (err instanceof LumaImportError) throw err;
    throw new LumaImportError("Couldn't reach Luma just now. Try again, or fill the form in by hand.");
  }

  const raw = /<script id="__NEXT_DATA__"[^>]*>([\s\S]*?)<\/script>/.exec(html)?.[1];
  let data: Record<string, unknown> | undefined;
  try {
    const initial = JSON.parse(raw ?? "null")?.props?.pageProps?.initialData;
    data = initial?.data ?? initial;
  } catch {
    data = undefined;
  }
  const event = data?.event as
    | { name?: string; start_at?: string; end_at?: string; geo_address_info?: { address?: string; full_address?: string } }
    | undefined;
  if (!event?.name || !event.start_at) {
    // Luma changed its page, or the link is a calendar rather than an event.
    throw new LumaImportError("Couldn't read the event from that page. Fill the form in by hand, and paste the link as the sign-up link.");
  }

  const start = londonDateTime(event.start_at);
  const end = event.end_at ? londonDateTime(event.end_at) : null;
  const description = mirrorToText(data?.description_mirror as MirrorNode | undefined)
    .replace(/\n{3,}/g, "\n\n")
    .trim()
    .slice(0, 2000);

  return {
    title: event.name.trim().slice(0, 120),
    date: start.date,
    time: start.time,
    // Only a same-day end time fits the form; multi-day events keep just the start.
    endTime: end && end.date === start.date && end.time > start.time ? end.time : "",
    location: (event.geo_address_info?.address ?? event.geo_address_info?.full_address ?? "").trim().slice(0, 160),
    category: guessCategory(event.name),
    description,
    registrationUrl: url,
    isFeatured: "",
  };
}
