/**
 * OPPORTUNITY MODEL
 * ---------------------------------------------------------------
 * One shape for every source. Each provider normalises its API's results into
 * this before they reach the UI, so adding a source never touches a component.
 * Every `applyUrl` is the listing itself (the employer's posting, or that
 * specific advert on Reed, GOV.UK or Adzuna), never a site's homepage.
 */

export type OpportunityCategory =
  | "internship"
  | "placement"
  | "graduate"
  | "insight"
  | "apprenticeship"
  | "part-time"
  | "event";

export type Region = "Birmingham" | "London" | "Rest of UK" | "Remote";

export type SourceId = "employer" | "govuk" | "reed" | "adzuna";

export interface Opportunity {
  id: string;
  title: string;
  employer: string;
  /** As the source wrote it, e.g. "London, United Kingdom" or "B4 7ET". */
  location: string;
  region: Region;
  category: OpportunityCategory;
  /** ISO date. `null` when the source publishes no closing date. */
  deadline: string | null;
  /** ISO date the listing went up. */
  postedAt: string;
  /** One or two sentences; full details are on the listing. */
  description: string;
  salary?: string;
  applyUrl: string;
  source: SourceId;
  /** Higher is more worth a student's attention; drives "Top opportunities". */
  score: number;
}

/** What a provider returns; index.ts adds the score. */
export type OpportunityDraft = Omit<Opportunity, "score">;

export const CATEGORY_LABELS: Record<OpportunityCategory, string> = {
  internship: "Internships",
  placement: "Placement years",
  graduate: "Graduate schemes",
  insight: "Spring weeks & insights",
  apprenticeship: "Apprenticeships",
  "part-time": "Part-time",
  event: "Events",
};

/** Singular, for the badge on each card. */
export const CATEGORY_BADGE: Record<OpportunityCategory, string> = {
  internship: "Internship",
  placement: "Placement year",
  graduate: "Graduate",
  insight: "Spring week / insight",
  apprenticeship: "Apprenticeship",
  "part-time": "Part-time",
  event: "Event",
};

/** Tab order: broadly the student journey, first year to final year. */
export const CATEGORY_ORDER: OpportunityCategory[] = [
  "insight",
  "internship",
  "placement",
  "graduate",
  "apprenticeship",
  "part-time",
  "event",
];

export const SOURCE_LABELS: Record<SourceId, string> = {
  employer: "Direct from employer",
  govuk: "GOV.UK Find an apprenticeship",
  reed: "Reed",
  adzuna: "Adzuna",
};

/**
 * A source of opportunities. Implement this and register it in index.ts;
 * nothing else needs to change.
 */
export interface OpportunityProvider {
  id: SourceId;
  label: string;
  /** False when the provider's credentials are absent, so it is skipped. */
  isEnabled(): boolean;
  load(): Promise<OpportunityDraft[]>;
}

export interface ProviderStatus {
  id: SourceId;
  label: string;
  enabled: boolean;
  count: number;
  error?: string;
}

export interface OpportunityBoardData {
  opportunities: Opportunity[];
  sources: ProviderStatus[];
  /** ISO timestamp of the refresh that produced this board. */
  updatedAt: string;
}
