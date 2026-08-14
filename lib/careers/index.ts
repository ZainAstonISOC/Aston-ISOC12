import type { Opportunity, OpportunityProvider, ProviderStatus } from "./types";
import { curatedProvider } from "./providers/curated";
import { adzunaProvider } from "./providers/adzuna";

export * from "./types";

/**
 * Registered sources. Add a provider here and it joins the board — the page,
 * the filters and the search all pick it up without further changes.
 */
const PROVIDERS: OpportunityProvider[] = [curatedProvider, adzunaProvider];

export interface OpportunityBoardData {
  opportunities: Opportunity[];
  sources: ProviderStatus[];
}

/** Two entries are the same job if the employer and title match, whatever the source. */
function dedupeKey(o: Opportunity): string {
  return `${o.employer.toLowerCase().trim()}::${o.title.toLowerCase().trim()}`;
}

function sortForBoard(a: Opportunity, b: Opportunity): number {
  // Featured first, then soonest real deadline, then most recently posted.
  if (Boolean(a.featured) !== Boolean(b.featured)) return a.featured ? -1 : 1;
  if (a.deadline && b.deadline) return a.deadline.localeCompare(b.deadline);
  if (a.deadline) return -1;
  if (b.deadline) return 1;
  return b.postedAt.localeCompare(a.postedAt);
}

/**
 * Loads every enabled provider in parallel. A provider that fails is reported
 * in `sources` and skipped — it never takes the page down with it.
 */
export async function getOpportunityBoard(): Promise<OpportunityBoardData> {
  const enabled = PROVIDERS.filter(p => p.isEnabled());

  const settled = await Promise.allSettled(enabled.map(p => p.load()));

  const sources: ProviderStatus[] = PROVIDERS.map(provider => {
    const index = enabled.indexOf(provider);
    if (index === -1) {
      return { id: provider.id, label: provider.label, enabled: false, count: 0 };
    }
    const result = settled[index];
    if (result.status === "rejected") {
      return {
        id: provider.id,
        label: provider.label,
        enabled: true,
        count: 0,
        error: result.reason instanceof Error ? result.reason.message : "Unknown provider error",
      };
    }
    return { id: provider.id, label: provider.label, enabled: true, count: result.value.length };
  });

  const seen = new Set<string>();
  const opportunities = settled
    .flatMap(r => (r.status === "fulfilled" ? r.value : []))
    .filter(o => {
      const key = dedupeKey(o);
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .sort(sortForBoard);

  return { opportunities, sources };
}
