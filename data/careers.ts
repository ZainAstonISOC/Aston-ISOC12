/**
 * CAREERS & NETWORKING DATA
 * ---------------------------------------------------
 * To add a new opportunity: add a new object to the array below.
 * The careers page updates automatically - no redesign needed.
 * To archive: set status to "archived"
 */

export interface CareerOpportunity {
  id: string;
  title: string;
  organisation: string;
  type: "internship" | "graduate" | "placement" | "networking" | "workshop" | "mentoring";
  sector: string;
  deadline?: string;
  description: string;
  applyUrl?: string;
  status: "active" | "archived";
  featured?: boolean;
  islamicFinance?: boolean;
  posted: string;
}

export const careers: CareerOpportunity[] = [
  {
    id: "islamic-finance-grad",
    title: "Islamic Finance Graduate Programme",
    organisation: "National Zakat Foundation",
    type: "graduate",
    sector: "Finance",
    description: "A graduate development programme focused on Sharia-compliant financial products, zakat calculation, and Islamic economics. Open to all disciplines.",
    applyUrl: "https://nzf.org.uk",
    status: "active",
    featured: true,
    islamicFinance: true,
    posted: "2026-05-01",
  },
  {
    id: "aston-placement",
    title: "Year in Industry Placements",
    organisation: "Aston University Careers",
    type: "placement",
    sector: "All sectors",
    description: "Aston University's placement office supports students in securing year-long industry placements. Engineering, Business, Health, Computing and more.",
    applyUrl: "https://www.aston.ac.uk/careers",
    status: "active",
    featured: true,
    posted: "2026-04-15",
  },
  {
    id: "medology-intern",
    title: "Healthcare & Medical Internship",
    organisation: "Medology",
    type: "internship",
    sector: "Healthcare",
    description: "Internship opportunities within the healthcare sector via Medology, ISOC's healthcare industry partner.",
    status: "active",
    posted: "2026-05-10",
  },
  {
    id: "isoc-mentoring",
    title: "ISOC Mentoring Programme",
    organisation: "Aston ISOC",
    type: "mentoring",
    sector: "All sectors",
    description: "Get matched with a senior student or alumni mentor from your field. Weekly check-ins, CV review, and career guidance throughout the academic year.",
    applyUrl: "https://www.instagram.com/astonisoc/",
    status: "active",
    featured: true,
    posted: "2026-04-01",
  },
  {
    id: "aims-healthcare",
    title: "Healthcare Careers Networking Event",
    organisation: "Aston AIMS",
    type: "networking",
    sector: "Healthcare",
    description: "Joint networking event with Aston Islamic Medical Society connecting Muslim students with healthcare professionals across Birmingham.",
    applyUrl: "https://www.instagram.com/aston.ims",
    status: "active",
    posted: "2026-05-20",
  },
];

export const getActiveCareers = () => careers.filter(c => c.status === "active");
export const getFeaturedCareers = () => careers.filter(c => c.status === "active" && c.featured);
export const getCareersByType = (type: CareerOpportunity["type"]) =>
  careers.filter(c => c.status === "active" && c.type === type);

export const CAREER_TYPE_LABELS: Record<CareerOpportunity["type"], string> = {
  internship:  "Internship",
  graduate:    "Graduate Programme",
  placement:   "Year in Industry",
  networking:  "Networking",
  workshop:    "Workshop",
  mentoring:   "Mentoring",
};
