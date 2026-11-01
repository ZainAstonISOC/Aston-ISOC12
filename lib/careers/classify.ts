import type { Opportunity, OpportunityCategory, Region } from "./types";

/**
 * CLASSIFICATION
 * ---------------------------------------------------------------
 * Sources label roles inconsistently ("Summer Analyst", "Industrial Placement
 * (12 months)", "2027 Spring Insight Week"), so the type comes from the title.
 * Order matters: an "Insight Day" is an event even though it says "insight",
 * and a "Graduate Apprenticeship" is an apprenticeship.
 */
const RULES: [OpportunityCategory, RegExp][] = [
  ["event", /\b(insight (day|evening|event)|open (day|evening)|webinar|virtual (event|experience)|information session|networking (event|evening)|masterclass|careers? fair|workshop)\b/i],
  ["insight", /\b(spring (week|insight|programme|program)|insight (week|programme|program)|discovery (week|programme)|first[- ]year)\b/i],
  ["apprenticeship", /\bapprentice(ship)?s?\b/i],
  ["placement", /\b(placements?|industrial year|year in industry|sandwich|12[- ]month (student|undergraduate))\b/i],
  ["internship", /\b(intern(ship)?s?|summer (analyst|associate|programme|program|scheme)|off[- ]cycle|vacation scheme)\b/i],
  ["graduate", /\b(graduate|grad scheme|trainee|analyst programme|entry[- ]level|junior)\b/i],
];

export function categorise(title: string): OpportunityCategory | null {
  for (const [category, re] of RULES) if (re.test(title)) return category;
  return null;
}

/** Not for undergraduates or recent graduates, whatever the title also says. */
const NEVER_EARLY = /\b(head of|director|experienced|phd|postdoc|post-doc|mba|professor|lecturer)\b/i;
/** Seniority words that a clear early-careers marker overrides ("Graduate Account Manager"). */
const SENIOR = /\b(senior|lead|principal|manager|specialist|architect)\b/i;
const EARLY_MARKER = /\b(graduate|intern(ship)?|placement|apprentice(ship)?|trainee|spring|insight|summer analyst|student)\b/i;

/** Agency filler and gig work that floods the aggregators. */
const NOISE =
  /\b(teaching assistant|teacher|tutor|cover supervisor|nursery|childcare|care assistant|carer|support worker|youth worker|early years|room leader|business coach|cleaner|hgv|driver|behaviour mentor|semh|nurse|doctor|practitioner|healthcare assistant|security officer|warehouse operative|mystery shopper|online surveys?|paid surveys?|focus groups?|market research participant)\b/i;

export function isEarlyCareers(title: string): boolean {
  if (NOISE.test(title) || NEVER_EARLY.test(title)) return false;
  return !SENIOR.test(title) || EARLY_MARKER.test(title);
}

export function isNoise(title: string): boolean {
  return NOISE.test(title);
}

const UK =
  /\b(united kingdom|uk|u\.k\.|gbr|great britain|england|scotland|wales|northern ireland|london|birmingham|manchester|leeds|bristol|edinburgh|glasgow|cardiff|belfast|reading|cambridge|oxford|newcastle|liverpool|sheffield|nottingham|leicester|coventry|derby|luton|knutsford|warwick|slough|swindon|bath|stevenage|bolton|blackpool|preston|port sunlight|maidenhead|wokingham|milton keynes|southampton|portsmouth|aberdeen|york|hull|guildford|crawley|basingstoke|chester|solihull|wolverhampton|northampton|ipswich|norwich|exeter|plymouth|brighton|sunderland|middlesbrough|stoke|lincoln|gloucester|cheltenham|worcester|hereford|telford|hertfordshire|surrey|kent|essex|yorkshire|lancashire|midlands|remote)\b/i;

/** Place names shared with other countries ("North York, Ontario") are caught here. */
const ABROAD =
  /\b(canada|ontario|united states|usa|u\.s\.|india|ireland|dublin|germany|france|spain|netherlands|poland|singapore|hong kong|australia|new zealand|south africa|egypt|united arab emirates|dubai|japan|china|brazil|mexico)\b/i;

export function isUK(location: string): boolean {
  if (ABROAD.test(location) && !/\b(united kingdom|uk)\b/i.test(location)) return false;
  return UK.test(location);
}

const BIRMINGHAM =
  /\b(birmingham|aston|solihull|wolverhampton|walsall|dudley|west bromwich|sutton coldfield|smethwick|halesowen|west midlands|b\d{1,2} ?\d[a-z]{2})\b/i;

export function regionOf(location: string): Region {
  if (BIRMINGHAM.test(location)) return "Birmingham";
  if (/\blondon\b/i.test(location)) return "London";
  if (/\b(remote|home[- ]based|work from home)\b/i.test(location)) return "Remote";
  return "Rest of UK";
}

/** One clean sentence or two from HTML or plain text. */
export function summarise(raw: string | undefined, max = 180): string {
  if (!raw) return "";
  const text = raw
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&#39;|&rsquo;/g, "'")
    .replace(/&quot;|&ldquo;|&rdquo;/g, '"')
    .replace(/&[a-z]+;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  if (text.length <= max) return text;
  const cut = text.slice(0, max);
  return `${cut.slice(0, cut.lastIndexOf(" "))}…`;
}

/** "10/11/2026" (Reed) or any ISO-ish string → "2026-11-10"; null when unparseable. */
export function isoDate(raw: string | null | undefined): string | null {
  if (!raw) return null;
  const dmy = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(raw);
  if (dmy) return `${dmy[3]}-${dmy[2]}-${dmy[1]}`;
  const t = Date.parse(raw);
  return Number.isNaN(t) ? null : new Date(t).toISOString().slice(0, 10);
}

export const today = () => new Date().toISOString().slice(0, 10);

function daysBetween(fromIso: string, toIso: string): number {
  return Math.round((Date.parse(toIso) - Date.parse(fromIso)) / 86_400_000);
}

/**
 * What "Top opportunities" ranks by. Employer-direct listings, local roles,
 * imminent deadlines and fresh postings rise; nothing here is hand-picked.
 */
export function scoreOf(o: Omit<Opportunity, "score">): number {
  const now = today();
  let s = 0;
  if (o.source === "employer") s += 5;
  if (o.region === "Birmingham") s += 2;
  // What most Aston students are hunting for; local apprenticeships and shop
  // jobs still show, just not above a placement year at a major employer.
  if (o.category === "insight" || o.category === "internship" || o.category === "placement" || o.category === "event") s += 2;
  else if (o.category === "graduate") s += 1;
  if (o.deadline) {
    const left = daysBetween(now, o.deadline);
    s += left <= 21 ? 2 : 1;
  }
  const age = daysBetween(o.postedAt, now);
  if (age <= 7) s += 2;
  else if (age <= 21) s += 1;
  return s;
}
