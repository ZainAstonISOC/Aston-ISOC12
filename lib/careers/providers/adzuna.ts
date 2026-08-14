import type {
  EmploymentType,
  Opportunity,
  OpportunityCategory,
  OpportunityProvider,
} from "../types";

/**
 * ADZUNA JOB SEARCH
 * ---------------------------------------------------------------
 * Adzuna aggregates UK vacancies and offers a free developer tier.
 *
 * Setup:
 *   1. Register at https://developer.adzuna.com/ (free).
 *   2. Set ADZUNA_APP_ID and ADZUNA_APP_KEY in Vercel → Environment Variables.
 *
 * Without those two variables the provider reports itself disabled and the
 * board simply shows curated entries — no errors, no empty states.
 *
 * TUNING NOTE: broad keyword queries return mostly recruitment-agency filler
 * (teaching assistants, nursery staff, care work). Three things keep the board
 * credible: Adzuna's own `category` buckets, a shared `what_exclude` list, and
 * an agency blocklist applied to the results.
 */

const BASE = "https://api.adzuna.com/v1/api/jobs/gb/search/1";

/** Nothing older than this is worth showing a student. */
const MAX_DAYS_OLD = 30;

/**
 * IMPORTANT: Adzuna's `what_exclude` is a space-separated list of INDIVIDUAL
 * WORDS, not phrases, and it matches the whole advert. An earlier version
 * passed "support worker" and "care assistant" here, which excluded every ad
 * containing "support", "worker", "care" or "assistant" — that is most of the
 * market, and the board silently fell back to curated entries only.
 *
 * So: only distinctive single words belong here. Anything ambiguous is handled
 * by TITLE_REJECT below, where we can match real phrases.
 */
const EXCLUDE_TERMS = [
  "nursery",
  "childcare",
  "carer",
  "semh",
  "hgv",
  "cleaner",
  "waiter",
].join(" ");

/** Phrases we drop outright, matched against the job title. */
const TITLE_REJECT = [
  "teaching assistant",
  "teaching",
  "nursery",
  "care assistant",
  "support worker",
  "cleaner",
  "hgv",
  "behaviour mentor",
  "cover supervisor",
  "tutor",
];

/**
 * A keyword search for "graduate" also matches ads that merely ask for "a
 * graduate of an engineering degree", which surfaced senior roles. Requiring an
 * early-careers marker in the title fixes that; SENIOR_MARKERS catches the rest.
 */
const EARLY_CAREERS_MARKERS = [
  "graduate",
  "trainee",
  "intern",
  "placement",
  "apprentice",
  "junior",
  "entry level",
  "entry-level",
  "school leaver",
];

const SENIOR_MARKERS = [
  "senior",
  "lead ",
  "principal",
  "head of",
  "manager",
  "director",
  "specialist",
  "architect",
];

/**
 * Staffing agencies that repost the same roles in bulk. Matched case-insensitively
 * as a substring of the employer name.
 */
const AGENCY_BLOCKLIST = [
  "gsl education",
  "prospero",
  "teaching personnel",
  "randstad",
  "hays",
  "reed",
  "adecco",
  "manpower",
  "blue arrow",
  "pertemps",
  "brook street",
  "office angels",
  "smart teachers",
  "tradewind",
  "protocol education",
  "supply desk",
  "vision for education",
];

/** No employer may take over the board — agencies repost the same role repeatedly. */
const MAX_PER_EMPLOYER = 2;

/** Word-boundary match, so "Reed" does not also block "Reed Smith" or "Screed". */
function matchesAgency(employer: string): boolean {
  const e = employer.toLowerCase();
  return AGENCY_BLOCKLIST.some(a => new RegExp(`\\b${a}\\b`).test(e));
}

/** Collapses "SF Partners", "SF Partners Ltd" and "SF Partners Admin" onto one key. */
function employerKey(employer: string): string {
  return employer
    .toLowerCase()
    .replace(/\b(ltd|limited|llp|plc|uk|group|admin|recruitment|recruit)\b/g, "")
    .replace(/[^a-z0-9]/g, "")
    .slice(0, 12);
}

/**
 * Each query becomes one API call. `category` is Adzuna's own taxonomy, which
 * filters far more reliably than keywords alone.
 */
const QUERIES: {
  what: string;
  category?: string;
  label: OpportunityCategory;
  industry: string;
}[] = [
  { what: "graduate scheme", category: "graduate-jobs", label: "graduate", industry: "All sectors" },
  { what: "graduate", category: "it-jobs", label: "graduate", industry: "Engineering & Technology" },
  { what: "graduate", category: "accounting-finance-jobs", label: "graduate", industry: "Finance & Professional Services" },
  { what: "graduate", category: "engineering-jobs", label: "graduate", industry: "Engineering & Technology" },
  { what: "internship", category: "graduate-jobs", label: "internship", industry: "All sectors" },
  { what: "placement", category: "graduate-jobs", label: "placement", industry: "All sectors" },
  { what: "degree apprenticeship", label: "apprenticeship", industry: "All sectors" },
];

interface AdzunaResult {
  id: string;
  title: string;
  company?: { display_name?: string };
  location?: { display_name?: string };
  created?: string;
  redirect_url?: string;
  description?: string;
  contract_time?: string;
  category?: { label?: string };
}

function employmentTypeFor(result: AdzunaResult, category: OpportunityCategory): EmploymentType {
  if (category === "internship") return "Internship";
  if (category === "apprenticeship") return "Apprenticeship";
  if (category === "placement") return "Fixed-term";
  if (result.contract_time === "part_time") return "Part-time";
  return "Full-time";
}

/** Adzuna descriptions arrive as truncated HTML-ish text; keep it to one clean paragraph. */
function cleanDescription(raw: string | undefined): string {
  if (!raw) return "Full details on the employer's listing.";
  const text = raw.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
  if (text.length <= 220) return text;
  const cut = text.slice(0, 220);
  return `${cut.slice(0, cut.lastIndexOf(" "))}…`;
}

/** True when a result is agency filler rather than a real early-careers role. */
function isNoise(result: AdzunaResult): boolean {
  const employer = (result.company?.display_name ?? "").trim();
  // Anonymous postings are almost always agencies.
  if (!employer) return true;
  if (matchesAgency(employer)) return true;

  const title = (result.title ?? "").toLowerCase();
  if (TITLE_REJECT.some(t => title.includes(t))) return true;
  if (SENIOR_MARKERS.some(t => title.includes(t))) return true;
  // Must actually be an early-careers role.
  return !EARLY_CAREERS_MARKERS.some(t => title.includes(t));
}

async function runQuery(
  query: (typeof QUERIES)[number],
  appId: string,
  appKey: string
): Promise<Opportunity[]> {
  const params = new URLSearchParams({
    app_id: appId,
    app_key: appKey,
    results_per_page: "12",
    what: query.what,
    where: "birmingham",
    distance: "40",
    what_exclude: EXCLUDE_TERMS,
    max_days_old: String(MAX_DAYS_OLD),
    sort_by: "date",
    "content-type": "application/json",
  });
  if (query.category) params.set("category", query.category);

  const res = await fetch(`${BASE}?${params.toString()}`, {
    next: { revalidate: 3600, tags: ["opportunities"] },
    signal: AbortSignal.timeout(6000),
  });
  if (!res.ok) throw new Error(`Adzuna responded ${res.status}`);

  const json: unknown = await res.json();
  const results = (json as { results?: AdzunaResult[] }).results;
  if (!Array.isArray(results)) return [];

  return results
    .filter(r => r.redirect_url && r.title && !isNoise(r))
    .map(r => ({
      id: `adzuna-${r.id}`,
      title: r.title.replace(/<[^>]*>/g, "").trim(),
      employer: (r.company?.display_name ?? "").trim(),
      location: r.location?.display_name?.trim() || "United Kingdom",
      category: query.label,
      industry: r.category?.label?.trim() || query.industry,
      employmentType: employmentTypeFor(r, query.label),
      experienceLevel: query.label === "graduate" ? ("Graduate" as const) : ("Any year" as const),
      // Adzuna does not publish closing dates on the free tier.
      deadline: null,
      description: cleanDescription(r.description),
      applyUrl: r.redirect_url as string,
      source: "adzuna",
      postedAt: r.created?.slice(0, 10) ?? new Date().toISOString().slice(0, 10),
    }));
}

export const adzunaProvider: OpportunityProvider = {
  id: "adzuna",
  label: "Adzuna (Birmingham)",

  isEnabled: () => Boolean(process.env.ADZUNA_APP_ID && process.env.ADZUNA_APP_KEY),

  load: async (): Promise<Opportunity[]> => {
    const appId = process.env.ADZUNA_APP_ID;
    const appKey = process.env.ADZUNA_APP_KEY;
    if (!appId || !appKey) return [];

    const batches = await Promise.allSettled(QUERIES.map(q => runQuery(q, appId, appKey)));
    const found = batches.flatMap(b => (b.status === "fulfilled" ? b.value : []));

    // Cap each employer so one bulk poster cannot dominate the board.
    const perEmployer = new Map<string, number>();
    return found.filter(o => {
      const key = employerKey(o.employer);
      const seen = perEmployer.get(key) ?? 0;
      if (seen >= MAX_PER_EMPLOYER) return false;
      perEmployer.set(key, seen + 1);
      return true;
    });
  },
};
