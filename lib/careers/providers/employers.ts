import { EMPLOYERS, type EmployerFeed } from "../employers";
import { categorise, isEarlyCareers, isUK, isoDate, regionOf, summarise, today } from "../classify";
import type { OpportunityDraft as Draft, OpportunityProvider } from "../types";

/**
 * EMPLOYER JOB SITES
 * ---------------------------------------------------------------
 * Reads the employers in employers.ts straight from their own job sites
 * (Workday, Greenhouse, Lever). No keys; every link is the employer's posting.
 */

const TIMEOUT = 15_000;
/**
 * Workday returns 20 per page and can't OR terms together, so each term is its
 * own search. Many employers share one Workday host, which answers 429 to
 * bursts: employers run three at a time, one request each, with retries.
 */
const WORKDAY_SEARCHES = ["graduate", "intern", "placement", "apprentice", "insight", "spring"];
const WORKDAY_MAX_PAGES = 2;
const WORKDAY_PARALLEL = 3;
const RETRIES = 3;

const wait = (ms: number) => new Promise(r => setTimeout(r, ms));

/** Runs `fn` over `items` with at most `limit` in flight, so no employer sees a burst. */
async function pool<T, R>(items: T[], limit: number, fn: (item: T) => Promise<R>): Promise<R[]> {
  const out: R[] = new Array(items.length);
  let next = 0;
  await Promise.all(
    Array.from({ length: Math.min(limit, items.length) }, async () => {
      while (next < items.length) {
        const i = next++;
        out[i] = await fn(items[i]);
      }
    }),
  );
  return out;
}

async function json<T>(url: string, init?: RequestInit, attempt = 0): Promise<T> {
  const res = await fetch(url, {
    ...init,
    headers: { Accept: "application/json", ...(init?.body ? { "Content-Type": "application/json" } : {}), ...init?.headers },
    cache: "no-store",
    signal: AbortSignal.timeout(TIMEOUT),
  });
  if (res.status === 429 && attempt < RETRIES) {
    const after = Number(res.headers.get("retry-after"));
    await wait(Number.isFinite(after) && after > 0 ? after * 1000 : 1500 * (attempt + 1));
    return json<T>(url, init, attempt + 1);
  }
  if (!res.ok) throw new Error(`${res.status} from ${new URL(url).host}`);
  return (await res.json()) as T;
}

function draft(e: { name: string }, title: string, location: string, applyUrl: string, extra: Partial<Draft>): Draft | null {
  const category = categorise(title);
  if (!category || !isEarlyCareers(title) || !isUK(`${location} ${title}`)) return null;
  return {
    id: `employer-${applyUrl}`,
    title: title.trim(),
    employer: e.name,
    location: location || "United Kingdom",
    region: regionOf(location),
    category,
    deadline: null,
    postedAt: today(),
    description: "",
    applyUrl,
    source: "employer",
    ...extra,
  };
}

/* ── Workday ─────────────────────────────────────────────────────────── */

interface WorkdayList { total?: number; jobPostings?: { title: string; externalPath: string; locationsText?: string }[] }
interface WorkdayDetail {
  jobPostingInfo?: {
    title: string; jobDescription?: string; location?: string; startDate?: string; endDate?: string;
    timeType?: string; externalUrl?: string; country?: { descriptor?: string };
  };
}

async function workday(e: Extract<EmployerFeed, { kind: "workday" }>): Promise<Draft[]> {
  const base = `https://${e.tenant}.${e.pod}.myworkdayjobs.com/wday/cxs/${e.tenant}/${e.site}`;
  const found = new Map<string, { title: string; externalPath: string; locationsText?: string }>();

  for (const searchText of WORKDAY_SEARCHES) {
    for (let page = 0; page < WORKDAY_MAX_PAGES; page++) {
      const list = await json<WorkdayList>(`${base}/jobs`, {
        method: "POST",
        body: JSON.stringify({ appliedFacets: {}, limit: 20, offset: page * 20, searchText }),
      });
      for (const p of list.jobPostings ?? []) found.set(p.externalPath, p);
      if ((page + 1) * 20 >= (list.total ?? 0)) break;
    }
  }

  // Cheap title filter first; "3 Locations" can only be checked on the detail page.
  const candidates = [...found.values()].filter(
    p => categorise(p.title) && isEarlyCareers(p.title) && (isUK(`${p.locationsText} ${p.title}`) || /\d+ Locations/i.test(p.locationsText ?? "")),
  );

  const details = await pool(candidates, 1, async p => {
    try {
      const d = await json<WorkdayDetail>(`${base}${p.externalPath}`);
      const info = d.jobPostingInfo;
      if (!info) return null;
      // Workday knows the country; trust it over place-name matching.
      const country = info.country?.descriptor;
      if (country && country !== "United Kingdom") return null;
      const location = country && !(info.location ?? "").includes(country) ? [info.location, country].filter(Boolean).join(", ") : info.location ?? "";
      return draft(e, info.title, location, info.externalUrl ?? `https://${e.tenant}.${e.pod}.myworkdayjobs.com/${e.site}${p.externalPath}`, {
        deadline: isoDate(info.endDate),
        postedAt: isoDate(info.startDate) ?? today(),
        description: summarise(info.jobDescription),
      });
    } catch {
      return null;
    }
  });
  return details.filter((d): d is Draft => d !== null);
}

/* ── Greenhouse ──────────────────────────────────────────────────────── */

interface GreenhouseJob {
  title: string; absolute_url: string; location?: { name?: string };
  first_published?: string; updated_at?: string; application_deadline?: string | null;
}

async function greenhouse(e: Extract<EmployerFeed, { kind: "greenhouse" }>): Promise<Draft[]> {
  const { jobs } = await json<{ jobs: GreenhouseJob[] }>(`https://boards-api.greenhouse.io/v1/boards/${e.board}/jobs`);
  return jobs
    .map(j =>
      draft(e, j.title, j.location?.name ?? "", j.absolute_url, {
        deadline: isoDate(j.application_deadline),
        postedAt: isoDate(j.first_published ?? j.updated_at) ?? today(),
      }),
    )
    .filter((d): d is Draft => d !== null);
}

/* ── Lever ───────────────────────────────────────────────────────────── */

interface LeverPosting {
  text: string; hostedUrl: string; createdAt?: number; descriptionPlain?: string;
  categories?: { location?: string; commitment?: string };
}

async function lever(e: Extract<EmployerFeed, { kind: "lever" }>): Promise<Draft[]> {
  const postings = await json<LeverPosting[]>(`https://api.lever.co/v0/postings/${e.board}?mode=json`);
  return postings
    .map(p =>
      draft(e, p.text, p.categories?.location ?? "", p.hostedUrl, {
        postedAt: p.createdAt ? new Date(p.createdAt).toISOString().slice(0, 10) : today(),
        description: summarise(p.descriptionPlain),
      }),
    )
    .filter((d): d is Draft => d !== null);
}

/** Per-employer results, so the refresh can log which feeds broke. */
export async function loadEmployers(includeWorkday = true): Promise<{ drafts: Draft[]; failures: string[] }> {
  const failures: string[] = [];
  const load = async (e: EmployerFeed) => {
    try {
      return e.kind === "workday" ? await workday(e) : e.kind === "greenhouse" ? await greenhouse(e) : await lever(e);
    } catch (err) {
      failures.push(`${e.name}: ${err instanceof Error ? err.message : "failed"}`);
      return [];
    }
  };
  // Greenhouse and Lever are separate hosts with no such limits.
  const [onWorkday, elsewhere] = await Promise.all([
    pool(includeWorkday ? EMPLOYERS.filter(e => e.kind === "workday") : [], WORKDAY_PARALLEL, load),
    pool(EMPLOYERS.filter(e => e.kind !== "workday"), 6, load),
  ]);
  return { drafts: [...onWorkday, ...elsewhere].flat(), failures };
}

function provider(includeWorkday: boolean): OpportunityProvider {
  return {
    id: "employer",
    label: "Employers' own job sites",
    isEnabled: () => true,
    load: async () => {
      const { drafts, failures } = await loadEmployers(includeWorkday);
      if (failures.length) console.warn("[careers] employer feeds failed:", failures.join("; "));
      return drafts;
    },
  };
}

export const employerProvider = provider(true);
/** Seconds rather than minutes: for building a page when no daily snapshot exists yet. */
export const quickEmployerProvider = provider(false);
