import type { Opportunity } from "@/lib/careers/types";

/**
 * CURATED OPPORTUNITIES
 * ---------------------------------------------------------------
 * Committee-maintained entries. These are long-running schemes and employer
 * talent pages rather than individual adverts, so they stay valid across the
 * year — but every URL should still be re-checked at the start of each term.
 *
 * `deadline: null` means the scheme is rolling or publishes its own dates; the
 * board shows "Rolling" rather than inventing a closing date.
 *
 * To add one: copy a block, give it a unique id, and it appears on /careers
 * with search and filters already working.
 */
export const curatedOpportunities: Opportunity[] = [
  /* ── Placement years ─────────────────────────────────────────────────── */
  {
    id: "aston-placements",
    title: "Year in Industry Placements",
    employer: "Aston University Careers",
    location: "Birmingham & nationwide",
    category: "placement",
    industry: "All sectors",
    employmentType: "Fixed-term",
    experienceLevel: "Penultimate year",
    deadline: null,
    description:
      "Aston's placement team supports students through applications, assessment centres and the placement year itself. Engineering, Business, Health, Computing and Languages all run placement routes.",
    applyUrl: "https://www.aston.ac.uk/careers",
    source: "curated",
    featured: true,
    postedAt: "2026-08-01",
  },
  {
    id: "ratemyplacement",
    title: "Placement & Internship Search",
    employer: "RateMyPlacement",
    location: "UK-wide",
    category: "placement",
    industry: "All sectors",
    employmentType: "Fixed-term",
    experienceLevel: "Penultimate year",
    deadline: null,
    description:
      "The largest UK board for undergraduate placements, with student-written reviews of the employer before you apply. Filter by sector, region and salary.",
    applyUrl: "https://www.ratemyplacement.co.uk/",
    source: "curated",
    postedAt: "2026-08-01",
  },

  /* ── Internships ─────────────────────────────────────────────────────── */
  {
    id: "ratemyplacement-internships",
    title: "Summer Internship Search",
    employer: "RateMyPlacement",
    location: "UK-wide",
    category: "internship",
    industry: "All sectors",
    employmentType: "Internship",
    experienceLevel: "Penultimate year",
    deadline: null,
    description:
      "Summer internships across every sector, typically 8–12 weeks and often the direct route to a graduate offer. Most large employers open applications the September before.",
    applyUrl: "https://www.ratemyplacement.co.uk/",
    source: "curated",
    postedAt: "2026-08-01",
  },

  /* ── Spring weeks & insight programmes ───────────────────────────────── */
  {
    id: "bright-network-insight",
    title: "Spring Weeks & Insight Programmes",
    employer: "Bright Network",
    location: "London, Birmingham & virtual",
    category: "spring-week",
    industry: "Finance & Professional Services",
    employmentType: "Internship",
    experienceLevel: "First year",
    deadline: null,
    description:
      "First-year spring weeks across banking, law and consulting, plus virtual internship experiences. Applications typically open in the autumn term and close early — register before then.",
    applyUrl: "https://www.brightnetwork.co.uk/",
    source: "curated",
    featured: true,
    postedAt: "2026-08-01",
  },
  {
    id: "seo-london",
    title: "SEO London Career Programmes",
    employer: "SEO London",
    location: "London (with regional events)",
    category: "insight",
    industry: "Finance & Professional Services",
    employmentType: "Internship",
    experienceLevel: "Any year",
    deadline: null,
    description:
      "Free training, mentoring and internship sponsorship for students from ethnic-minority and lower-income backgrounds, spanning banking, law, technology and corporate roles.",
    applyUrl: "https://www.seo-london.org/",
    source: "curated",
    featured: true,
    postedAt: "2026-08-01",
  },
  {
    id: "upreach",
    title: "upReach Associate Programme",
    employer: "upReach",
    location: "Birmingham & nationwide",
    category: "insight",
    industry: "All sectors",
    employmentType: "Internship",
    experienceLevel: "First year",
    deadline: null,
    description:
      "Multi-year support for undergraduates from less-advantaged backgrounds: one-to-one coaching, employer insight days and exclusive internship routes. Eligibility is means-tested.",
    applyUrl: "https://upreach.org.uk/",
    source: "curated",
    postedAt: "2026-08-01",
  },

  /* ── Graduate roles ──────────────────────────────────────────────────── */
  {
    id: "gradcracker",
    title: "Engineering & Technology Graduate Roles",
    employer: "Gradcracker",
    location: "UK-wide",
    category: "graduate",
    industry: "Engineering & Technology",
    employmentType: "Full-time",
    experienceLevel: "Final year",
    deadline: null,
    description:
      "The main UK board for STEM graduate schemes, placements and summer internships, organised by discipline — useful for Aston's engineering and computer science cohorts.",
    applyUrl: "https://www.gradcracker.com/",
    source: "curated",
    postedAt: "2026-08-01",
  },
  {
    id: "prospects-grad",
    title: "Graduate Job Search & Careers Advice",
    employer: "Prospects",
    location: "UK-wide",
    category: "graduate",
    industry: "All sectors",
    employmentType: "Full-time",
    experienceLevel: "Graduate",
    deadline: null,
    description:
      "The UK's official graduate careers service: vacancies, sector guides, postgraduate study routes and application advice written for final-year students.",
    applyUrl: "https://www.prospects.ac.uk/",
    source: "curated",
    postedAt: "2026-08-01",
  },
  {
    id: "nhs-jobs",
    title: "NHS Roles & Healthcare Careers",
    employer: "NHS",
    location: "Birmingham & nationwide",
    category: "graduate",
    industry: "Healthcare",
    employmentType: "Full-time",
    experienceLevel: "Graduate",
    deadline: null,
    description:
      "Every NHS vacancy in one place, including graduate management training, clinical roles and healthcare science. Relevant for Aston's pharmacy, optometry and health students.",
    applyUrl: "https://www.jobs.nhs.uk/",
    source: "curated",
    postedAt: "2026-08-01",
  },

  /* ── Apprenticeships ─────────────────────────────────────────────────── */
  {
    id: "gov-apprenticeships",
    title: "Degree & Higher Apprenticeships",
    employer: "Find an Apprenticeship (GOV.UK)",
    location: "Birmingham & nationwide",
    category: "apprenticeship",
    industry: "All sectors",
    employmentType: "Apprenticeship",
    experienceLevel: "School leaver",
    deadline: null,
    description:
      "The government's official apprenticeship service, including degree apprenticeships where an employer funds your study while you earn. Search by postcode and level.",
    applyUrl: "https://www.gov.uk/apply-apprenticeship",
    source: "curated",
    postedAt: "2026-08-01",
  },

  /* ── Islamic finance ─────────────────────────────────────────────────── */
  {
    id: "gatehouse-bank",
    title: "Careers at a UK Sharia-Compliant Bank",
    employer: "Gatehouse Bank",
    location: "London & Milton Keynes",
    category: "islamic-finance",
    industry: "Finance & Professional Services",
    employmentType: "Full-time",
    experienceLevel: "Graduate",
    deadline: null,
    description:
      "A UK Sharia-compliant bank offering roles across property finance, savings, risk and operations — a direct route into Islamic finance without leaving the UK market.",
    applyUrl: "https://www.gatehousebank.com/careers/",
    source: "curated",
    featured: true,
    postedAt: "2026-08-01",
  },
  {
    id: "al-rayan-bank",
    title: "Islamic Banking Roles & Early Careers",
    employer: "Al Rayan Bank",
    location: "Birmingham & UK",
    category: "islamic-finance",
    industry: "Finance & Professional Services",
    employmentType: "Full-time",
    experienceLevel: "Any year",
    deadline: null,
    description:
      "The UK's oldest and largest Islamic bank, with a Birmingham presence. Roles span retail banking, compliance, Sharia governance and customer operations.",
    applyUrl: "https://www.alrayanbank.co.uk/careers/",
    source: "curated",
    postedAt: "2026-08-01",
  },

  /* ── Charity & non-profit ────────────────────────────────────────────── */
  {
    id: "nzf",
    title: "Zakat & Community Roles",
    employer: "National Zakat Foundation",
    location: "London & remote",
    category: "charity",
    industry: "Charity & Non-Profit",
    employmentType: "Full-time",
    experienceLevel: "Any year",
    deadline: null,
    description:
      "NZF distributes zakat to Muslims in need across the UK, and recruits across casework, fundraising, research and operations. Volunteer routes also run alongside paid roles.",
    applyUrl: "https://nzf.org.uk/",
    source: "curated",
    postedAt: "2026-08-01",
  },
  {
    id: "islamic-relief",
    title: "Humanitarian & Fundraising Roles",
    employer: "Islamic Relief UK",
    location: "Birmingham (head office)",
    category: "charity",
    industry: "Charity & Non-Profit",
    employmentType: "Full-time",
    experienceLevel: "Graduate",
    deadline: null,
    description:
      "One of the largest Muslim humanitarian organisations, headquartered in Birmingham — a rare chance to work in international development without relocating from the city.",
    applyUrl: "https://www.islamic-relief.org.uk/",
    source: "curated",
    featured: true,
    postedAt: "2026-08-01",
  },
  {
    id: "muslim-aid",
    title: "Programme & Campaign Roles",
    employer: "Muslim Aid",
    location: "London & remote",
    category: "charity",
    industry: "Charity & Non-Profit",
    employmentType: "Full-time",
    experienceLevel: "Graduate",
    deadline: null,
    description:
      "International relief and development work spanning emergency response, community programmes and campaigning, with internship and volunteer routes alongside paid roles.",
    applyUrl: "https://www.muslimaid.org/",
    source: "curated",
    postedAt: "2026-08-01",
  },

  /* ── Volunteering ────────────────────────────────────────────────────── */
  {
    id: "isoc-volunteering",
    title: "Volunteer with Aston ISOC",
    employer: "Aston ISOC",
    location: "Aston University campus",
    category: "volunteering",
    industry: "Student Community",
    employmentType: "Voluntary",
    experienceLevel: "Any year",
    deadline: null,
    description:
      "Charity Week, Discover Islam Week, Ramadan iftars and Freshers all run on volunteers. The most direct way to build experience — and the reference that comes with it.",
    applyUrl: "/volunteer",
    source: "curated",
    featured: true,
    postedAt: "2026-08-01",
  },
  {
    id: "doit-volunteering",
    title: "Local Volunteering Opportunities",
    employer: "Do IT",
    location: "Birmingham",
    category: "volunteering",
    industry: "Charity & Non-Profit",
    employmentType: "Voluntary",
    experienceLevel: "Any year",
    deadline: null,
    description:
      "Search volunteering roles by postcode and cause across Birmingham — from tutoring and food banks to hospital and community projects, most needing only a few hours a week.",
    applyUrl: "https://doit.life/volunteer",
    source: "curated",
    postedAt: "2026-08-01",
  },

  /* ── Part-time & campus work ─────────────────────────────────────────── */
  {
    id: "aston-student-jobs",
    title: "Part-Time & On-Campus Work",
    employer: "Aston University Careers",
    location: "Aston University campus",
    category: "part-time",
    industry: "Student Community",
    employmentType: "Part-time",
    experienceLevel: "Any year",
    deadline: null,
    description:
      "Student ambassador, open-day and campus roles fit around lectures and pay above minimum wage. Listed through the university careers service alongside local part-time vacancies.",
    applyUrl: "https://www.aston.ac.uk/careers",
    source: "curated",
    postedAt: "2026-08-01",
  },

  /* ── Mentoring / ISOC-run ────────────────────────────────────────────── */
  {
    id: "isoc-mentoring",
    title: "ISOC Mentoring Programme",
    employer: "Aston ISOC",
    location: "Aston University campus",
    category: "insight",
    industry: "Student Community",
    employmentType: "Voluntary",
    experienceLevel: "First year",
    deadline: null,
    description:
      "Get matched with a senior student or alumnus in your field for CV review, application help and honest advice on the industry — and later, mentor someone yourself.",
    applyUrl: "https://www.instagram.com/astonisoc/",
    source: "curated",
    postedAt: "2026-08-01",
  },
];
