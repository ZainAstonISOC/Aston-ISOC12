/**
 * EDITABLE CONTENT — FIELD DEFINITIONS
 * ---------------------------------------------------------------
 * Every list the committee can change from /admin is described here once:
 * its fields, which are required, and the pages it appears on. The admin list,
 * the form and the server-side validation are all generated from these specs,
 * so adding a field means adding one line below.
 *
 * Plain data only — this file is imported by client components.
 */

export type FieldType = "text" | "textarea" | "url" | "email" | "select" | "date" | "checkbox" | "lines";

export interface FieldSpec {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  /** Character limit (text-like fields) or item limit ("lines"). */
  max?: number;
  help?: string;
  placeholder?: string;
  options?: { value: string; label: string }[];
}

export interface CollectionSpec {
  key: string;
  title: string;
  singular: string;
  /** One line for the admin dashboard. */
  description: string;
  /** Field shown as each row's heading in the admin list. */
  titleField: string;
  /** Fields joined under the heading in the admin list. */
  subtitleFields?: string[];
  fields: FieldSpec[];
  /** Public pages to link from the admin list ("See it on …"). */
  pages: { label: string; href: string }[];
  /** One record rather than a list (e.g. the site banner). */
  single?: boolean;
}

export type ContentValue = string | boolean | string[];
export type ContentItem = { id: string } & Record<string, ContentValue>;

const STATUS_CAMPAIGN = [
  { value: "active", label: "Recruiting now" },
  { value: "upcoming", label: "Coming soon" },
  { value: "archived", label: "Hidden (archived)" },
];

export const ACCENTS: Record<string, string> = {
  gold: "rgba(216,175,114,0.12)",
  purple: "rgba(99,91,255,0.1)",
  green: "rgba(52,211,153,0.1)",
  blue: "rgba(96,165,250,0.1)",
};

const ICON_OPTIONS = ["moon", "handshake", "globe", "heart", "mosque", "book", "users", "sparkle", "hands", "seedling", "trophy", "mic"]
  .map(v => ({ value: v, label: v[0].toUpperCase() + v.slice(1) }));

export const SECTION_OPTIONS = [
  { value: "executive", label: "Core Committee" },
  { value: "academic", label: "Academic Development" },
  { value: "jummah", label: "Jummah" },
  { value: "marketing", label: "Marketing" },
  { value: "social_media", label: "Socials" },
  { value: "education", label: "Education" },
  { value: "advocacy", label: "Advocacy" },
  { value: "ambassadors", label: "Ambassadors" },
];

export const DAY_OPTIONS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
  .map(d => ({ value: d, label: d }));

export const COLLECTIONS: CollectionSpec[] = [
  {
    key: "committee",
    title: "Committee",
    singular: "committee member",
    description: "Names, roles and bios on the committee, about and home pages.",
    titleField: "name",
    subtitleFields: ["role"],
    pages: [{ label: "Committee", href: "/committee" }],
    fields: [
      { name: "name", label: "Name", type: "text", required: true, max: 60 },
      {
        name: "role", label: "Role", type: "text", required: true, max: 80,
        help: "Use the exact titles \"Head Brother\", \"Head Sister\", \"Vice Brother\", \"Vice Sister\", \"Treasurer\" or \"General Secretary\" for the leadership rows on the committee page.",
      },
      { name: "section", label: "Team", type: "select", required: true, options: SECTION_OPTIONS },
      { name: "year", label: "Committee year", type: "text", required: true, max: 9, placeholder: "2026/27" },
      { name: "bio", label: "Short bio", type: "textarea", required: true, max: 240 },
      { name: "email", label: "Email", type: "email", max: 120, help: "Optional. Shown publicly." },
      { name: "linkedin", label: "LinkedIn URL", type: "url", max: 200, help: "Optional. Shown publicly." },
    ],
  },
  {
    key: "campaigns",
    title: "Flagship campaigns",
    singular: "campaign",
    description: "Ramadan, Discover Islam Week, Charity Week and others: when they recruit volunteers and what for.",
    titleField: "name",
    subtitleFields: ["status"],
    pages: [{ label: "Volunteer", href: "/volunteer" }],
    fields: [
      { name: "name", label: "Name", type: "text", required: true, max: 60 },
      { name: "tagline", label: "Tagline", type: "text", required: true, max: 60 },
      { name: "description", label: "Description", type: "textarea", required: true, max: 600 },
      { name: "status", label: "Status", type: "select", required: true, options: STATUS_CAMPAIGN, help: "\"Recruiting now\" shows the sign-up button." },
      { name: "startsOn", label: "Campaign starts", type: "date", help: "Optional. Shown on the card." },
      { name: "endsOn", label: "Campaign ends", type: "date", help: "Optional. After this date the card goes back to \"Coming soon\" by itself." },
      { name: "roles", label: "Volunteer roles", type: "lines", max: 12, help: "One per line." },
      { name: "commitment", label: "Time commitment", type: "text", max: 80 },
      { name: "impact", label: "Impact", type: "text", max: 140, help: "Only figures you can stand behind." },
      { name: "signupUrl", label: "Sign-up link", type: "url", max: 300, help: "A form or Luma page. Without one, the button opens Instagram DMs." },
      { name: "icon", label: "Icon", type: "select", required: true, options: ICON_OPTIONS },
      { name: "accent", label: "Card colour", type: "select", required: true, options: Object.keys(ACCENTS).map(v => ({ value: v, label: v[0].toUpperCase() + v.slice(1) })) },
    ],
  },
  {
    key: "fundraisers",
    title: "Fundraisers",
    singular: "fundraiser",
    description: "Donation campaigns on the home, charity and donate pages.",
    titleField: "name",
    subtitleFields: ["status"],
    pages: [{ label: "Donate", href: "/donate" }, { label: "Charity", href: "/charity" }],
    fields: [
      { name: "name", label: "Name", type: "text", required: true, max: 80 },
      { name: "description", label: "Description", type: "textarea", required: true, max: 500 },
      { name: "donationUrl", label: "Donation link", type: "url", required: true, max: 300 },
      { name: "organisation", label: "Collected via", type: "text", max: 60, placeholder: "e.g. GoFundMe, LaunchGood" },
      {
        name: "status", label: "Status", type: "select", required: true,
        options: [{ value: "active", label: "Live" }, { value: "completed", label: "Finished (hidden)" }],
      },
      { name: "endsOn", label: "Hide after", type: "date", help: "Optional. The fundraiser disappears from the site after this date." },
      { name: "isFeatured", label: "Feature it (highlighted on the homepage)", type: "checkbox" },
    ],
  },
  {
    key: "weekly",
    title: "Weekly programme",
    singular: "weekly session",
    description: "The regular week (classes, sports, socials) shown on the homepage. Jumu'ah is added automatically.",
    titleField: "title",
    subtitleFields: ["day", "time"],
    pages: [{ label: "Homepage", href: "/#week" }],
    fields: [
      { name: "title", label: "Session", type: "text", required: true, max: 60, placeholder: "e.g. Roots class" },
      { name: "day", label: "Day", type: "select", required: true, options: DAY_OPTIONS },
      { name: "time", label: "Time", type: "text", required: true, max: 20, placeholder: "e.g. 18:00 or Evenings" },
      { name: "location", label: "Where", type: "text", max: 80 },
      {
        name: "audience", label: "For", type: "select", required: true,
        options: [{ value: "all", label: "Everyone" }, { value: "brothers", label: "Brothers" }, { value: "sisters", label: "Sisters" }],
      },
      { name: "note", label: "Note", type: "text", max: 120, help: "Optional, e.g. \"Term time only\"." },
    ],
  },
  {
    key: "halal",
    title: "Halal food",
    singular: "place",
    description: "Halal places near campus, on the Freshers Hub and the halal food page.",
    titleField: "name",
    subtitleFields: ["kind", "walk"],
    pages: [{ label: "Halal food", href: "/halal-food" }, { label: "Freshers Hub", href: "/freshers" }],
    fields: [
      { name: "name", label: "Name", type: "text", required: true, max: 60 },
      { name: "kind", label: "Type of food", type: "text", required: true, max: 40, placeholder: "e.g. Pakistani / Desi" },
      { name: "walk", label: "Walk from campus", type: "text", max: 20, placeholder: "e.g. 5 min" },
      { name: "area", label: "Area", type: "text", max: 60, placeholder: "e.g. Corporation Street" },
      { name: "url", label: "Website or Google Maps link", type: "url", max: 300 },
      { name: "note", label: "Note", type: "text", max: 140, help: "e.g. \"Student discount with ISOC card\". Only what the committee has checked." },
    ],
  },
  {
    key: "sponsors",
    title: "Sponsors",
    singular: "sponsor",
    description: "Sponsors and partners by tier on the sponsors page.",
    titleField: "name",
    subtitleFields: ["tier"],
    pages: [{ label: "Sponsors", href: "/sponsors" }],
    fields: [
      { name: "name", label: "Name", type: "text", required: true, max: 60 },
      {
        name: "tier", label: "Tier", type: "select", required: true,
        options: [{ value: "gold", label: "Gold" }, { value: "silver", label: "Silver" }, { value: "bronze", label: "Bronze" }, { value: "community", label: "Community partner" }],
      },
      { name: "website", label: "Website", type: "url", max: 200 },
      { name: "description", label: "Description", type: "textarea", required: true, max: 200 },
    ],
  },
  {
    key: "partners",
    title: "Charity partners",
    singular: "charity partner",
    description: "The organisations listed on the charity page.",
    titleField: "name",
    subtitleFields: ["desc"],
    pages: [{ label: "Charity", href: "/charity" }],
    fields: [
      { name: "name", label: "Name", type: "text", required: true, max: 60 },
      { name: "desc", label: "What they do", type: "text", required: true, max: 80 },
      { name: "url", label: "Website", type: "url", required: true, max: 200 },
    ],
  },
  {
    key: "giving",
    title: "Other ways to give",
    singular: "way to give",
    description: "The cards under \"More ways to support\" on the donate page.",
    titleField: "title",
    pages: [{ label: "Donate", href: "/donate" }],
    fields: [
      { name: "title", label: "Title", type: "text", required: true, max: 40 },
      { name: "desc", label: "Description", type: "text", required: true, max: 140 },
    ],
  },
  {
    key: "banner",
    title: "Site banner",
    singular: "banner",
    description: "A notice across the top of every page, e.g. Ramadan timetable or DIW week.",
    titleField: "text",
    pages: [{ label: "Homepage", href: "/" }],
    single: true,
    fields: [
      { name: "enabled", label: "Show the banner", type: "checkbox" },
      { name: "text", label: "Message", type: "text", max: 120, placeholder: "e.g. Discover Islam Week starts Monday 2 February" },
      { name: "linkLabel", label: "Link text", type: "text", max: 30, placeholder: "e.g. See the programme" },
      { name: "linkUrl", label: "Link", type: "url", max: 300, help: "A full link, or a page on this site such as /events." },
      { name: "endsOn", label: "Hide after", type: "date", help: "Optional. The banner switches itself off after this date." },
    ],
  },
  {
    key: "stats",
    title: "Headline numbers",
    singular: "headline numbers",
    description: "Members, money raised and events, as shown on the home, about and charity pages.",
    titleField: "members",
    pages: [{ label: "Homepage", href: "/" }, { label: "Charity", href: "/charity" }],
    single: true,
    fields: [
      { name: "members", label: "Members", type: "text", required: true, max: 12, placeholder: "1,000+" },
      { name: "raised", label: "Raised for charity last year", type: "text", required: true, max: 12, placeholder: "£100k+" },
      { name: "events", label: "Events each semester", type: "text", required: true, max: 12, placeholder: "50+" },
      { name: "partners", label: "Partner organisations", type: "text", required: true, max: 12, placeholder: "6+" },
    ],
  },
];

export function collectionSpec(key: string): CollectionSpec | undefined {
  return COLLECTIONS.find(c => c.key === key);
}

/** "18:00" stays; a select value is shown by its label. */
export function displayValue(spec: CollectionSpec, field: string, value: ContentValue | undefined): string {
  if (value === undefined || value === "") return "";
  const f = spec.fields.find(x => x.name === field);
  if (f?.type === "select") return f.options?.find(o => o.value === value)?.label ?? String(value);
  if (Array.isArray(value)) return value.join(", ");
  return String(value);
}
