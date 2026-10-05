import type { EventCategory } from "@/types";

/** Pure data — safe to import from client components. */
export const CATEGORY_LABELS: Record<EventCategory, string> = {
  all: "All Welcome",
  sisters: "Sisters Only",
  brothers: "Brothers Only",
  jummah: "Jumu'ah",
  charity: "Charity",
  sports: "Sports",
  speaker: "Speaker Event",
  freshers: "Freshers",
  social: "Social",
};
