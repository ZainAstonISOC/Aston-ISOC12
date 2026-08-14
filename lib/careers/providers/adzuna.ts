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
 */

const BASE = "https://api.adzuna.com/v1/api/jobs/gb/search/1";

/** Each query becomes one API call, tagged with the category it represents. */
const QUERIES: { what: string; where: string; category: OpportunityCategory; industry: string }[] = [
  { what: "graduate scheme", where: "birmingham", category: "graduate", industry: "All sectors" },
  { what: "internship", where: "birmingham", category: "internship", industry: "All sectors" },
  { what: "industrial placement", where: "birmingham", category: "placement", industry: "All sectors" },
  { what: "part time student", where: "birmingham", category: "part-time", industry: "Student Community" },
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

async function runQuery(
  query: (typeof QUERIES)[number],
  appId: string,
  appKey: string
): Promise<Opportunity[]> {
  const url =
    `${BASE}?app_id=${encodeURIComponent(appId)}&app_key=${encodeURIComponent(appKey)}` +
    `&results_per_page=10&what=${encodeURIComponent(query.what)}` +
    `&where=${encodeURIComponent(query.where)}&content-type=application/json`;

  const res = await fetch(url, {
    next: { revalidate: 3600, tags: ["opportunities"] },
    signal: AbortSignal.timeout(6000),
  });
  if (!res.ok) throw new Error(`Adzuna responded ${res.status}`);

  const json: unknown = await res.json();
  const results = (json as { results?: AdzunaResult[] }).results;
  if (!Array.isArray(results)) return [];

  return results
    .filter(r => r.redirect_url && r.title)
    .map(r => ({
      id: `adzuna-${r.id}`,
      title: r.title.replace(/<[^>]*>/g, "").trim(),
      employer: r.company?.display_name?.trim() || "Employer not stated",
      location: r.location?.display_name?.trim() || "United Kingdom",
      category: query.category,
      industry: r.category?.label?.trim() || query.industry,
      employmentType: employmentTypeFor(r, query.category),
      experienceLevel: query.category === "graduate" ? ("Graduate" as const) : ("Any year" as const),
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
    return batches.flatMap(b => (b.status === "fulfilled" ? b.value : []));
  },
};
