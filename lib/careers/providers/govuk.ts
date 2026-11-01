import { isNoise, isoDate, regionOf, summarise, today } from "../classify";
import type { OpportunityDraft, OpportunityProvider } from "../types";

/**
 * GOV.UK FIND AN APPRENTICESHIP
 * ---------------------------------------------------------------
 * The government's Display Advert API. Subscription key from the Apprenticeship
 * Service developer portal, set as GOV_UK_DISPLAY_ADVERT_API_KEY. Links go to
 * the official advert on findapprenticeship.service.gov.uk.
 *
 * Kept for students: degree-level (6–7) anywhere in England, and higher
 * apprenticeships (4–5) within commuting distance of campus. Levels 2–3 are
 * school-leaver roles.
 */

const BASE = "https://api.apprenticeships.education.gov.uk/vacancies/vacancy";
const CAMPUS = { lat: "52.4862", lon: "-1.8904" };
const LOCAL_MILES = 30;
const PAGE_SIZE = 100;
const MAX_PAGES = 50;

interface Vacancy {
  title: string; description?: string; postedDate?: string; closingDate?: string;
  employerName: string; vacancyUrl: string; vacancyReference: string; distance?: number;
  course?: { level?: number; title?: string };
  wage?: { wageAdditionalInformation?: string };
  addresses?: { addressLine3?: string; addressLine4?: string; postcode?: string }[];
  address?: { addressLine3?: string; addressLine4?: string; postcode?: string };
}

function place(v: Vacancy): string {
  const a = v.addresses?.[0] ?? v.address;
  if (!a) return "England";
  return [a.addressLine4 || a.addressLine3, a.postcode].filter(Boolean).join(", ");
}

async function page(key: string, n: number): Promise<{ vacancies: Vacancy[]; totalPages: number }> {
  const params = new URLSearchParams({
    PageNumber: String(n), PageSize: String(PAGE_SIZE), Lat: CAMPUS.lat, Lon: CAMPUS.lon,
    DistanceInMiles: "1000", Sort: "DistanceAsc",
  });
  const res = await fetch(`${BASE}?${params}`, {
    headers: { "Ocp-Apim-Subscription-Key": key, "X-Version": "2" },
    cache: "no-store",
    signal: AbortSignal.timeout(15_000),
  });
  if (!res.ok) throw new Error(`GOV.UK responded ${res.status}`);
  const j = (await res.json()) as { vacancies?: Vacancy[]; totalPages?: number };
  return { vacancies: j.vacancies ?? [], totalPages: j.totalPages ?? 1 };
}

export const govukProvider: OpportunityProvider = {
  id: "govuk",
  label: "GOV.UK Find an apprenticeship",
  isEnabled: () => Boolean(process.env.GOV_UK_DISPLAY_ADVERT_API_KEY),
  load: async () => {
    const key = process.env.GOV_UK_DISPLAY_ADVERT_API_KEY;
    if (!key) return [];
    const first = await page(key, 1);
    const pages = Math.min(first.totalPages, MAX_PAGES);
    const rest = await Promise.all(Array.from({ length: pages - 1 }, (_, i) => page(key, i + 2).catch(() => ({ vacancies: [] }))));
    const all = [first, ...rest].flatMap(p => p.vacancies);

    return all.flatMap((v): OpportunityDraft[] => {
      const level = v.course?.level ?? 0;
      const near = (v.distance ?? Infinity) <= LOCAL_MILES;
      if (!(level >= 6 || (level >= 4 && near)) || isNoise(v.title)) return [];
      const location = place(v);
      return [{
        id: `govuk-${v.vacancyReference}`,
        title: v.title.trim(),
        employer: v.employerName.trim(),
        location,
        // Postcodes alone don't say Birmingham; distance from campus does.
        region: (v.distance ?? Infinity) <= 12 ? "Birmingham" : regionOf(location),
        category: "apprenticeship",
        deadline: isoDate(v.closingDate),
        postedAt: isoDate(v.postedDate) ?? today(),
        description: summarise(v.description),
        salary: v.wage?.wageAdditionalInformation || undefined,
        applyUrl: v.vacancyUrl,
        source: "govuk",
      }];
    });
  },
};
