import { categorise, isEarlyCareers, isNoise, isoDate, regionOf, summarise, today } from "../classify";
import type { OpportunityCategory, OpportunityDraft, OpportunityProvider } from "../types";

/**
 * REED JOBSEEKER API
 * ---------------------------------------------------------------
 * Free key from https://www.reed.co.uk/developers/jobseeker, set as
 * REED_API_KEY. Reed publishes closing dates, which most sources do not.
 * Only direct employers are asked for: agency reposts are most of Reed's
 * graduate results otherwise. Links go to that job's page on reed.co.uk.
 */

const BASE = "https://www.reed.co.uk/api/1.0/search";

interface ReedJob {
  jobId: number; jobTitle: string; employerName: string; locationName?: string;
  minimumSalary?: number | null; maximumSalary?: number | null;
  expirationDate?: string; date?: string; jobDescription?: string; jobUrl: string;
}

/** `fallback` files a role whose title says nothing (e.g. a part-time shop job). */
const QUERIES: { params: Record<string, string>; fallback?: OpportunityCategory }[] = [
  { params: { keywords: "graduate scheme", graduate: "true" } },
  { params: { keywords: "graduate", graduate: "true", locationName: "Birmingham", distanceFromLocation: "25" } },
  { params: { keywords: "internship" } },
  { params: { keywords: "placement year" } },
  { params: { keywords: "summer internship" } },
  { params: { keywords: "degree apprenticeship" } },
  { params: { keywords: "spring week" } },
  { params: { keywords: "insight programme" } },
  // Student-friendly hours near campus.
  { params: { partTime: "true", locationName: "Birmingham", distanceFromLocation: "5" }, fallback: "part-time" },
];

function salary(j: ReedJob): string | undefined {
  const f = (n: number) => `£${n.toLocaleString("en-GB")}`;
  if (j.minimumSalary && j.maximumSalary && j.minimumSalary !== j.maximumSalary) return `${f(j.minimumSalary)}–${f(j.maximumSalary)}`;
  if (j.minimumSalary) return f(j.minimumSalary);
  return undefined;
}

async function run(key: string, q: (typeof QUERIES)[number]): Promise<OpportunityDraft[]> {
  const params = new URLSearchParams({ postedByDirectEmployer: "true", resultsToTake: "100", ...q.params });
  const res = await fetch(`${BASE}?${params}`, {
    headers: { Authorization: `Basic ${Buffer.from(`${key}:`).toString("base64")}` },
    cache: "no-store",
    signal: AbortSignal.timeout(15_000),
  });
  if (!res.ok) throw new Error(`Reed responded ${res.status}`);
  const { results = [] } = (await res.json()) as { results?: ReedJob[] };

  return results.flatMap(j => {
    const title = j.jobTitle.trim();
    const category = q.fallback && !categorise(title) ? q.fallback : categorise(title);
    // Research Tribe lists paid surveys as part-time jobs.
    if (!category || isNoise(title) || !isEarlyCareers(title) || /research tribe/i.test(j.employerName)) return [];
    const location = j.locationName ?? "United Kingdom";
    return [{
      id: `reed-${j.jobId}`,
      title,
      employer: j.employerName.trim(),
      location,
      region: regionOf(location),
      category,
      deadline: isoDate(j.expirationDate),
      postedAt: isoDate(j.date) ?? today(),
      description: summarise(j.jobDescription),
      salary: salary(j),
      applyUrl: j.jobUrl,
      source: "reed" as const,
    }];
  });
}

export const reedProvider: OpportunityProvider = {
  id: "reed",
  label: "Reed",
  isEnabled: () => Boolean(process.env.REED_API_KEY),
  load: async () => {
    const key = process.env.REED_API_KEY;
    if (!key) return [];
    const settled = await Promise.allSettled(QUERIES.map(q => run(key, q)));
    const failed = settled.filter(s => s.status === "rejected");
    if (failed.length === settled.length) throw (failed[0] as PromiseRejectedResult).reason;
    return settled.flatMap(s => (s.status === "fulfilled" ? s.value : []));
  },
};
