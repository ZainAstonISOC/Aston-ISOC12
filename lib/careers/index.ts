import { unstable_cache } from "next/cache";
import { getSetting, saveSetting, storageMode } from "@/lib/events/store";
import { scoreOf, today } from "./classify";
import { employerProvider, quickEmployerProvider } from "./providers/employers";
import { govukProvider } from "./providers/govuk";
import { reedProvider } from "./providers/reed";
import { adzunaProvider } from "./providers/adzuna";
import type { Opportunity, OpportunityBoardData, OpportunityDraft, OpportunityProvider, ProviderStatus } from "./types";

export * from "./types";

/**
 * THE CAREERS BOARD
 * ---------------------------------------------------------------
 * Built once a day by /api/cron/careers and stored as one JSON value in the
 * same Upstash store as events ("settings:careers:board"). The page only ever
 * reads that snapshot, so a visitor never waits on a dozen job sites and the
 * free API allowances (Adzuna: 2,500 a month) are spent once a day, not per
 * view. With no snapshot yet (a fresh deploy, or local dev without Redis) the
 * page builds one itself and caches it for six hours.
 */

/** Earlier sources win a duplicate: the employer's own page beats an aggregator's copy. */
const PROVIDERS: OpportunityProvider[] = [employerProvider, govukProvider, reedProvider, adzunaProvider];

export const CAREERS_TAG = "careers";
const SNAPSHOT = "careers:board";
/** Keeps the snapshot (and the page payload) a sensible size. */
const MAX_LISTINGS = 900;

/** Same job, any source: employer and title with suffixes and reference numbers stripped. */
function dedupeKey(o: OpportunityDraft): string {
  const employer = o.employer
    .toLowerCase()
    .replace(/\b(ltd|limited|llp|plc|uk|group|the)\b/g, "")
    .replace(/[^a-z0-9]/g, "")
    .slice(0, 12);
  const title = o.title.toLowerCase().replace(/\(.*?\)|\[.*?\]/g, "").replace(/[^a-z0-9]+/g, " ").trim();
  return `${employer}::${title}`;
}

/**
 * Each further listing from the same employer ranks a little lower, so the
 * default order alternates employers instead of showing six Rolls-Royce
 * internships in a row. Sorts in place.
 */
function spreadEmployers(list: Opportunity[]): void {
  const seen = new Map<string, number>();
  const ranked = list.map(o => {
    const n = seen.get(o.employer) ?? 0;
    seen.set(o.employer, n + 1);
    return { o, rank: o.score - n * 1.5 };
  });
  ranked.sort((a, b) => b.rank - a.rank);
  ranked.forEach((r, i) => (list[i] = r.o));
}

/**
 * `quick` leaves out Workday, which is read slowly on purpose (a minute or
 * two). The daily refresh is never quick; the page's own fallback always is,
 * so a build or first visit never waits on it.
 */
export async function buildBoard({ quick = false } = {}): Promise<OpportunityBoardData> {
  const providers = quick ? PROVIDERS.map(p => (p === employerProvider ? quickEmployerProvider : p)) : PROVIDERS;
  const enabled = providers.filter(p => p.isEnabled());
  const settled = await Promise.allSettled(enabled.map(p => p.load()));

  const now = today();
  const seen = new Set<string>();
  const opportunities: Opportunity[] = settled
    .flatMap(r => (r.status === "fulfilled" ? r.value : []))
    .filter(o => {
      if (o.deadline && o.deadline < now) return false;
      const key = dedupeKey(o);
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .map(o => ({ ...o, score: scoreOf(o) }))
    .sort((a, b) => b.score - a.score || b.postedAt.localeCompare(a.postedAt));
  spreadEmployers(opportunities);
  opportunities.splice(MAX_LISTINGS);

  const shown = new Map<string, number>();
  for (const o of opportunities) shown.set(o.source, (shown.get(o.source) ?? 0) + 1);

  const sources: ProviderStatus[] = providers.map(p => {
    const i = enabled.indexOf(p);
    if (i === -1) return { id: p.id, label: p.label, enabled: false, count: 0 };
    const r = settled[i];
    if (r.status === "rejected") {
      return { id: p.id, label: p.label, enabled: true, count: 0, error: r.reason instanceof Error ? r.reason.message : "Failed" };
    }
    return { id: p.id, label: p.label, enabled: true, count: shown.get(p.id) ?? 0 };
  });

  return { opportunities, sources, updatedAt: new Date().toISOString() };
}

/**
 * Rebuilds and stores the snapshot. A source that fails today keeps
 * yesterday's listings rather than vanishing from the board.
 */
export async function refreshBoard(): Promise<OpportunityBoardData> {
  const fresh = await buildBoard();
  const previous = await readSnapshot();
  const failed = new Set(fresh.sources.filter(s => s.error).map(s => s.id));
  if (previous && failed.size) {
    const now = today();
    const carried = previous.opportunities.filter(o => failed.has(o.source) && !(o.deadline && o.deadline < now));
    fresh.opportunities = [...fresh.opportunities, ...carried].sort((a, b) => b.score - a.score);
    spreadEmployers(fresh.opportunities);
  }
  if (storageMode() !== "unavailable") await saveSetting(SNAPSHOT, JSON.stringify(fresh));
  return fresh;
}

async function readSnapshot(): Promise<OpportunityBoardData | null> {
  try {
    const raw = await getSetting(SNAPSHOT);
    if (!raw) return null;
    const v = JSON.parse(raw) as OpportunityBoardData;
    return Array.isArray(v.opportunities) ? v : null;
  } catch {
    return null;
  }
}

const builtHere = unstable_cache(() => buildBoard({ quick: true }), ["careers-board-quick-v2"], {
  tags: [CAREERS_TAG],
  revalidate: 6 * 3600,
});

/** What the page shows: the daily snapshot, or a locally built board until one exists. */
export const getOpportunityBoard = unstable_cache(
  async (): Promise<OpportunityBoardData> => {
    const snap = await readSnapshot();
    if (snap) {
      // Anything that closed since the snapshot was taken drops off at once.
      const now = today();
      return { ...snap, opportunities: snap.opportunities.filter(o => !(o.deadline && o.deadline < now)) };
    }
    return builtHere(); // until the first daily refresh has run
  },
  ["careers-snapshot-v2"],
  { tags: [CAREERS_TAG], revalidate: 3600 },
);
