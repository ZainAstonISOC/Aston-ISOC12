import { categorise, isEarlyCareers, isNoise, isoDate, regionOf, summarise, today } from "../classify";
import type { OpportunityCategory, OpportunityDraft, OpportunityProvider } from "../types";

/**
 * ADZUNA JOB SEARCH
 * ---------------------------------------------------------------
 * ADZUNA_APP_ID and ADZUNA_APP_KEY from https://developer.adzuna.com/ (free).
 *
 * Limits (Adzuna terms, default key): 25 hits a minute, 250 a day, 1,000 a
 * week, 2,500 a month. The board refreshes once a day, so these queries cost
 * about 7 × 30 = 210 a month. Don't run them per page view.
 *
 * Terms also require every Adzuna listing to carry an "Adzuna" link to
 * adzuna.co.uk; the board's source chip does that.
 *
 * `what_exclude` matches single WORDS across the whole advert, not phrases:
 * "support worker" there would drop every ad containing "support". Phrases are
 * filtered on the title in classify.ts instead.
 */

const BASE = "https://api.adzuna.com/v1/api/jobs/gb/search/1";
const MAX_DAYS_OLD = 30;
const EXCLUDE = ["nursery", "childcare", "carer", "semh", "hgv", "cleaner"].join(" ");

/** Agencies that bulk-repost; matched as whole words in the employer name. */
const AGENCIES = [
  "gsl education", "prospero", "teaching personnel", "randstad", "hays", "reed", "adecco", "manpower",
  "blue arrow", "pertemps", "brook street", "office angels", "smart teachers", "tradewind",
  "protocol education", "supply desk", "vision for education", "the best connection", "research tribe",
];
const MAX_PER_EMPLOYER = 2;

const QUERIES: { params: Record<string, string>; fallback?: OpportunityCategory }[] = [
  { params: { what: "graduate scheme", category: "graduate-jobs" } },
  { params: { what: "internship" } },
  { params: { what_or: "placement industrial", what: "year" } },
  { params: { what: "summer internship" } },
  { params: { what: "degree apprenticeship" } },
  { params: { what_or: "spring insight", what: "week" } },
  { params: { where: "birmingham", distance: "8", part_time: "1" }, fallback: "part-time" },
];

interface AdzunaResult {
  id: string; title: string; company?: { display_name?: string }; location?: { display_name?: string };
  created?: string; redirect_url?: string; description?: string; salary_min?: number; salary_max?: number;
}

const isAgency = (employer: string) => AGENCIES.some(a => new RegExp(`\\b${a}\\b`, "i").test(employer));

async function run(appId: string, appKey: string, q: (typeof QUERIES)[number]): Promise<OpportunityDraft[]> {
  const params = new URLSearchParams({
    app_id: appId, app_key: appKey, results_per_page: "50", what_exclude: EXCLUDE,
    max_days_old: String(MAX_DAYS_OLD), sort_by: "date", "content-type": "application/json", ...q.params,
  });
  const res = await fetch(`${BASE}?${params}`, { cache: "no-store", signal: AbortSignal.timeout(15_000) });
  if (!res.ok) throw new Error(`Adzuna responded ${res.status}`);
  const { results = [] } = (await res.json()) as { results?: AdzunaResult[] };

  return results.flatMap(r => {
    const title = (r.title ?? "").replace(/<[^>]*>/g, "").trim();
    const employer = (r.company?.display_name ?? "").trim();
    // Anonymous postings are almost always agencies.
    if (!title || !employer || !r.redirect_url || isAgency(employer)) return [];
    const category = q.fallback && !categorise(title) ? q.fallback : categorise(title);
    if (!category || isNoise(title) || !isEarlyCareers(title)) return [];
    const location = r.location?.display_name?.trim() || "UK";
    const pay = r.salary_min ? `£${Math.round(r.salary_min).toLocaleString("en-GB")}` : undefined;
    return [{
      id: `adzuna-${r.id}`,
      title,
      employer,
      location,
      region: regionOf(location),
      category,
      deadline: null,
      postedAt: isoDate(r.created) ?? today(),
      description: summarise(r.description),
      salary: pay,
      applyUrl: r.redirect_url,
      source: "adzuna" as const,
    }];
  });
}

export const adzunaProvider: OpportunityProvider = {
  id: "adzuna",
  label: "Adzuna",
  isEnabled: () => Boolean(process.env.ADZUNA_APP_ID && process.env.ADZUNA_APP_KEY),
  load: async () => {
    const appId = process.env.ADZUNA_APP_ID;
    const appKey = process.env.ADZUNA_APP_KEY;
    if (!appId || !appKey) return [];
    const settled = await Promise.allSettled(QUERIES.map(q => run(appId, appKey, q)));
    const failed = settled.filter(s => s.status === "rejected");
    if (failed.length === settled.length) throw (failed[0] as PromiseRejectedResult).reason;

    // No employer may take over the board.
    const perEmployer = new Map<string, number>();
    return settled
      .flatMap(s => (s.status === "fulfilled" ? s.value : []))
      .filter(o => {
        const k = o.employer.toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 12);
        const n = perEmployer.get(k) ?? 0;
        perEmployer.set(k, n + 1);
        return n < MAX_PER_EMPLOYER;
      });
  },
};
