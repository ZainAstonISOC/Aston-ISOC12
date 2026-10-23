import { unstable_cache } from "next/cache";
import type { CommitteeMember, DonationCampaign, Sponsor } from "@/types";
import type { IconName } from "@/components/ui/Icon";
import { committeeMembers } from "@/data/committee";
import { donationCampaigns } from "@/data/donations";
import { sponsors } from "@/data/sponsors";
import { volunteerCampaigns, type VolunteerCampaign } from "@/data/volunteers";
import { getSetting, saveSetting } from "@/lib/events/store";
import { londonNow } from "@/lib/events/time";
import { ACCENTS, collectionSpec, type CollectionSpec, type ContentItem, type ContentValue } from "./schema";

/**
 * EDITABLE CONTENT — STORAGE
 * ---------------------------------------------------------------
 * Each collection is one JSON value in the same Upstash store as events and
 * Jumu'ah ("settings:content:<key>"). Until the committee saves a collection,
 * the site uses the defaults below, which come from the data/ files — so the
 * first save starts from exactly what is live.
 *
 * Every save also keeps the previous version ("…:previous"), so the admin can
 * undo one change without anyone touching the database.
 */

export const contentTag = (key: string) => `content:${key}`;

const CODE_DEFAULTS: Record<string, ContentItem[]> = {
  committee: committeeMembers.map(m => ({
    id: m.id, name: m.name, role: m.role, section: m.section, year: m.year, bio: m.bio,
    email: m.email ?? "", linkedin: m.linkedin ?? "",
  })),
  campaigns: volunteerCampaigns.map(c => ({
    id: c.id, name: c.name, tagline: c.tagline, description: c.description, status: c.status,
    startsOn: "", endsOn: "", roles: c.roles, commitment: c.commitment, impact: c.impact,
    signupUrl: c.signupUrl ?? "", icon: c.icon,
    accent: Object.keys(ACCENTS).find(k => ACCENTS[k] === c.colour) ?? "gold",
  })),
  fundraisers: donationCampaigns.map(c => ({
    id: c.id, name: c.name, description: c.description, donationUrl: c.donationUrl,
    organisation: c.organisation ?? "", status: c.status === "active" ? "active" : "completed",
    endsOn: c.deadline ?? "", isFeatured: !!c.isFeatured,
  })),
  weekly: [],
  // Carried over from the Freshers Hub as it stood on 2026-10-23. The
  // committee should check each one from /admin; it was not verified here.
  halal: [
    { id: "sultans-kitchen", name: "Sultan's Kitchen", kind: "Pakistani / Desi", walk: "5 min", note: "Student lunch deals" },
    { id: "dixy-chicken", name: "Dixy Chicken", kind: "Fried chicken", walk: "3 min", note: "Halal certified" },
    { id: "the-yemeni-kitchen", name: "The Yemeni Kitchen", kind: "Middle Eastern", walk: "8 min", note: "Generous portions" },
    { id: "subway-digbeth", name: "Subway Digbeth", kind: "Sandwiches", walk: "7 min", note: "Full halal branch" },
    { id: "co-op-campus", name: "Co-op (Campus)", kind: "Supermarket", walk: "2 min", note: "Halal certified products" },
    { id: "city-centre", name: "Birmingham City Centre", kind: "Various", walk: "15 min", note: "Extensive halal dining" },
  ],
  sponsors: sponsors.map(s => ({
    id: s.id, name: s.name, tier: s.tier, website: s.website === "#" ? "" : s.website, description: s.description,
  })),
  partners: [
    { id: "nzf", name: "National Zakat Foundation", desc: "UK Zakat collection & distribution", url: "https://nzf.org.uk" },
    { id: "human-appeal", name: "Human Appeal", desc: "Emergency relief and development", url: "https://humanappeal.org.uk" },
    { id: "one-ummah", name: "One Ummah", desc: "Global Muslim community support", url: "https://oneummah.org.uk" },
    { id: "grfuk", name: "Global Rahma Foundation", desc: "Humanitarian aid and development", url: "https://grfuk.org" },
    { id: "birmingham-food-bank", name: "Birmingham Food Bank", desc: "Local emergency food parcels", url: "https://birmingham.foodbank.org.uk" },
    { id: "gofundme", name: "GoFundMe", desc: "Direct community fundraising", url: "https://www.gofundme.com" },
  ],
  // Gift Aid and Legacy Giving were removed (2026-10-23): a society can only
  // offer them through a registered charity. Add them back here or in /admin
  // once the treasurer confirms the SU claims Gift Aid for ISOC.
  giving: [
    { id: "zakat-sadaqah", title: "Zakat & Sadaqah", desc: "We work with NZF to ensure correct Zakat distribution." },
    { id: "sponsor-event", title: "Sponsor an Event", desc: "Partner with ISOC by sponsoring a specific event or initiative." },
  ],
  banner: [{ id: "banner", enabled: false, text: "", linkLabel: "", linkUrl: "", endsOn: "" }],
  stats: [{ id: "stats", members: "1,000+", raised: "£100k+", events: "50+", partners: "6+" }],
};

/* ── Shape ─────────────────────────────────────────────────────────────── */

function emptyValue(type: string): ContentValue {
  return type === "checkbox" ? false : type === "lines" ? [] : "";
}

/** Fills every field the spec knows about, drops ones it doesn't, so pages never meet a missing field. */
function normalise(spec: CollectionSpec, raw: Record<string, unknown>): ContentItem | null {
  if (typeof raw.id !== "string" || !raw.id) return null;
  const item: ContentItem = { id: raw.id };
  for (const f of spec.fields) {
    const v = raw[f.name];
    if (f.type === "checkbox") item[f.name] = v === true;
    else if (f.type === "lines") item[f.name] = Array.isArray(v) ? v.filter((x): x is string => typeof x === "string") : [];
    else item[f.name] = typeof v === "string" ? v : emptyValue(f.type);
  }
  return item;
}

function parseStored(spec: CollectionSpec, raw: string | null): ContentItem[] | null {
  if (!raw) return null;
  try {
    const v = JSON.parse(raw) as { items?: unknown };
    if (!Array.isArray(v.items)) return null;
    return v.items.map(i => normalise(spec, i as Record<string, unknown>)).filter((i): i is ContentItem => i !== null);
  } catch {
    return null;
  }
}

export function defaultItems(key: string): ContentItem[] {
  const spec = collectionSpec(key);
  if (!spec) return [];
  return (CODE_DEFAULTS[key] ?? []).map(i => normalise(spec, i)!).filter(Boolean);
}

/* ── Reads ─────────────────────────────────────────────────────────────── */

export interface StoredCollection {
  items: ContentItem[];
  /** False until the committee first saves this collection. */
  saved: boolean;
  updatedAt?: string;
  canUndo: boolean;
}

/** Uncached read for the admin, which must always show exactly what is stored. */
export async function readCollection(key: string): Promise<StoredCollection> {
  const spec = collectionSpec(key);
  if (!spec) throw new Error(`Unknown collection ${key}`);
  const [raw, prev] = await Promise.all([getSetting(`content:${key}`), getSetting(`content:${key}:previous`)]);
  const items = parseStored(spec, raw);
  let updatedAt: string | undefined;
  try { updatedAt = raw ? (JSON.parse(raw) as { updatedAt?: string }).updatedAt : undefined; } catch { /* ignore */ }
  return { items: items ?? defaultItems(key), saved: items !== null, updatedAt, canUndo: prev !== null };
}

const cachedReaders = new Map<string, () => Promise<ContentItem[]>>();

/** Cached read for public pages. Storage trouble falls back to the defaults, never an error page. */
export function getCollection(key: string): Promise<ContentItem[]> {
  let reader = cachedReaders.get(key);
  if (!reader) {
    reader = unstable_cache(
      async () => {
        try {
          const spec = collectionSpec(key)!;
          return parseStored(spec, await getSetting(`content:${key}`)) ?? defaultItems(key);
        } catch (err) {
          console.error(`[content] ${key} read failed, using defaults:`, err);
          return defaultItems(key);
        }
      },
      [`content-${key}-v1`],
      { tags: [contentTag(key)], revalidate: 3600 },
    );
    cachedReaders.set(key, reader);
  }
  return reader();
}

/* ── Writes (admin actions only) ──────────────────────────────────────── */

export async function writeCollection(key: string, items: ContentItem[]): Promise<void> {
  const current = await getSetting(`content:${key}`);
  const previous = current ?? JSON.stringify({ items: defaultItems(key), updatedAt: null });
  await saveSetting(`content:${key}:previous`, previous);
  await saveSetting(`content:${key}`, JSON.stringify({ items, updatedAt: new Date().toISOString() }));
}

/** Swaps the current and previous versions, so pressing undo twice redoes. */
export async function undoCollection(key: string): Promise<boolean> {
  const prev = await getSetting(`content:${key}:previous`);
  if (!prev) return false;
  const current = (await getSetting(`content:${key}`)) ?? JSON.stringify({ items: defaultItems(key), updatedAt: null });
  await saveSetting(`content:${key}`, prev);
  await saveSetting(`content:${key}:previous`, current);
  return true;
}

/* ── Typed getters for pages ──────────────────────────────────────────── */

const s = (v: ContentValue | undefined) => (typeof v === "string" ? v : "");
const today = () => londonNow().date;
/** An end date is inclusive: a fundraiser ending today still shows today. */
const isOver = (endsOn: string) => !!endsOn && endsOn < today();

export async function getCommittee(): Promise<CommitteeMember[]> {
  return (await getCollection("committee")).map(i => ({
    id: i.id, name: s(i.name), role: s(i.role), section: s(i.section) as CommitteeMember["section"],
    year: s(i.year), bio: s(i.bio), email: s(i.email) || undefined, linkedin: s(i.linkedin) || undefined,
  }));
}

export async function getVolunteerCampaigns(): Promise<(VolunteerCampaign & { startsOn: string; endsOn: string })[]> {
  return (await getCollection("campaigns"))
    .filter(i => i.status !== "archived")
    .map(i => ({
      id: i.id, name: s(i.name), tagline: s(i.tagline), description: s(i.description),
      // A campaign whose end date has passed stops recruiting by itself.
      status: (i.status === "active" && isOver(s(i.endsOn)) ? "upcoming" : s(i.status)) as VolunteerCampaign["status"],
      roles: Array.isArray(i.roles) ? i.roles : [], commitment: s(i.commitment), impact: s(i.impact),
      signupUrl: s(i.signupUrl) || undefined, colour: ACCENTS[s(i.accent)] ?? ACCENTS.gold, icon: s(i.icon) as IconName,
      startsOn: s(i.startsOn), endsOn: s(i.endsOn),
    }));
}

/** Live fundraisers only: status "active" and not past their end date. */
export async function getActiveFundraisers(): Promise<DonationCampaign[]> {
  return (await getCollection("fundraisers"))
    .filter(i => i.status === "active" && !isOver(s(i.endsOn)))
    .map(i => ({
      id: i.id, name: s(i.name), description: s(i.description), donationUrl: s(i.donationUrl),
      status: "active" as const, isFeatured: i.isFeatured === true, organisation: s(i.organisation) || undefined,
      deadline: s(i.endsOn) || undefined,
    }));
}

export async function getSponsors(): Promise<Sponsor[]> {
  return (await getCollection("sponsors")).map(i => ({
    id: i.id, name: s(i.name), tier: s(i.tier) as Sponsor["tier"], website: s(i.website), description: s(i.description),
  }));
}

export interface SimpleCard { id: string; title: string; desc: string; url?: string }

export async function getCharityPartners(): Promise<SimpleCard[]> {
  return (await getCollection("partners")).map(i => ({ id: i.id, title: s(i.name), desc: s(i.desc), url: s(i.url) }));
}

export async function getGivingOptions(): Promise<SimpleCard[]> {
  return (await getCollection("giving")).map(i => ({ id: i.id, title: s(i.title), desc: s(i.desc) }));
}

export interface WeeklySession { id: string; title: string; day: string; time: string; location: string; audience: string; note: string }

export async function getWeeklyProgramme(): Promise<WeeklySession[]> {
  return (await getCollection("weekly")).map(i => ({
    id: i.id, title: s(i.title), day: s(i.day), time: s(i.time), location: s(i.location), audience: s(i.audience), note: s(i.note),
  }));
}

export interface HalalPlace { id: string; name: string; kind: string; walk: string; area: string; url: string; note: string }

export async function getHalalPlaces(): Promise<HalalPlace[]> {
  return (await getCollection("halal")).map(i => ({
    id: i.id, name: s(i.name), kind: s(i.kind), walk: s(i.walk), area: s(i.area), url: s(i.url), note: s(i.note),
  }));
}

export interface SiteBanner { text: string; linkLabel: string; linkUrl: string }

/** The banner if it is switched on, has a message and has not passed its end date. */
export async function getBanner(): Promise<SiteBanner | null> {
  const b = (await getCollection("banner"))[0];
  if (!b || b.enabled !== true || !s(b.text) || isOver(s(b.endsOn))) return null;
  return { text: s(b.text), linkLabel: s(b.linkLabel), linkUrl: s(b.linkUrl) };
}

export interface SiteStats { members: string; raised: string; events: string; partners: string }

export async function getStats(): Promise<SiteStats> {
  const st = (await getCollection("stats"))[0] ?? defaultItems("stats")[0];
  return { members: s(st.members), raised: s(st.raised), events: s(st.events), partners: s(st.partners) };
}

export interface Leaders {
  headBrother?: CommitteeMember; viceBrother?: CommitteeMember;
  headSister?: CommitteeMember; viceSister?: CommitteeMember;
  /** The committee year, e.g. "2026/27", from the members themselves. */
  year: string;
}

/** The four society leads, found by role so renaming or replacing a member in /admin updates every mention. */
export async function getLeaders(): Promise<Leaders> {
  const all = await getCommittee();
  const role = (r: string) => all.find(m => m.role.trim().toLowerCase() === r);
  const year = all.find(m => m.year)?.year ?? "";
  return { headBrother: role("head brother"), viceBrother: role("vice brother"), headSister: role("head sister"), viceSister: role("vice sister"), year };
}

/** "Aminah & Yusra", "Aminah", or "" — first names only. */
export function ledBy(...members: (CommitteeMember | undefined)[]): string {
  return members.filter(Boolean).map(m => m!.name.split(" ")[0]).join(" & ");
}
