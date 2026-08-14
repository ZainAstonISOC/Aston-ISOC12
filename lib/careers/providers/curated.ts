import { curatedOpportunities } from "@/data/opportunities";
import type { Opportunity, OpportunityProvider } from "../types";

/** Committee-maintained entries. Always on — it needs no credentials. */
export const curatedProvider: OpportunityProvider = {
  id: "curated",
  label: "ISOC committee",
  isEnabled: () => true,
  load: async (): Promise<Opportunity[]> => curatedOpportunities,
};
