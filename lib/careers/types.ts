/**
 * OPPORTUNITY MODEL
 * ---------------------------------------------------------------
 * One shape for every source. Curated committee entries and API results are
 * normalised into this before they reach the UI, so adding a provider never
 * touches a component.
 */

export type OpportunityCategory =
  | "internship"
  | "placement"
  | "graduate"
  | "spring-week"
  | "insight"
  | "apprenticeship"
  | "part-time"
  | "charity"
  | "islamic-finance"
  | "volunteering";

export type EmploymentType =
  | "Full-time"
  | "Part-time"
  | "Fixed-term"
  | "Internship"
  | "Apprenticeship"
  | "Voluntary";

export type ExperienceLevel =
  | "Any year"
  | "First year"
  | "Penultimate year"
  | "Final year"
  | "Graduate"
  | "School leaver";

export interface Opportunity {
  id: string;
  title: string;
  employer: string;
  /** Free text, e.g. "Birmingham", "London (hybrid)", "Remote". */
  location: string;
  category: OpportunityCategory;
  /** Broad sector used by the industry filter, e.g. "Finance", "Healthcare". */
  industry: string;
  employmentType: EmploymentType;
  experienceLevel: ExperienceLevel;
  /** ISO date. `null` means rolling / no published closing date. */
  deadline: string | null;
  description: string;
  applyUrl: string;
  /** Which provider produced this row. */
  source: string;
  featured?: boolean;
  /** ISO date the entry was added or published. */
  postedAt: string;
}

export const CATEGORY_LABELS: Record<OpportunityCategory, string> = {
  internship: "Internship",
  placement: "Placement Year",
  graduate: "Graduate Role",
  "spring-week": "Spring Week",
  insight: "Insight Programme",
  apprenticeship: "Apprenticeship",
  "part-time": "Part-Time",
  charity: "Charity & Non-Profit",
  "islamic-finance": "Islamic Finance",
  volunteering: "Volunteering",
};

/** Display order for the category rail — broadly the student journey. */
export const CATEGORY_ORDER: OpportunityCategory[] = [
  "spring-week",
  "insight",
  "internship",
  "placement",
  "graduate",
  "apprenticeship",
  "part-time",
  "islamic-finance",
  "charity",
  "volunteering",
];

/**
 * A source of opportunities. Implement this and register it in `providers.ts`
 * — nothing else needs to change.
 */
export interface OpportunityProvider {
  id: string;
  label: string;
  /** False when the provider's credentials are absent, so it is skipped. */
  isEnabled(): boolean;
  load(): Promise<Opportunity[]>;
}

export interface ProviderStatus {
  id: string;
  label: string;
  enabled: boolean;
  count: number;
  error?: string;
}
