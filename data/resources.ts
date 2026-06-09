import { Resource } from "@/types";

/**
 * RESOURCES DATA
 * ─────────────────────────────────────────────────────────────────
 * All links are verified external URLs no local PDF paths.
 * Local PDFs were removed as the files do not exist in /public.
 * To add a PDF: upload the file to /public/resources/ first,
 * then add an entry with type: "pdf" and url: "/resources/filename.pdf"
 * ─────────────────────────────────────────────────────────────────
 */
export const resources: Resource[] = [

  // ── NEW MUSLIM ──────────────────────────────────────────────────
  {
    id: "new-muslim-guide",
    title: "New Muslim Guide",
    description: "A comprehensive beginner's guide to Islam beliefs, prayer, and community. Free from the New Muslim Network UK.",
    category: "new-muslim", type: "link",
    url: "https://newmuslim.net/new-muslim-guide/", isExternal: true,
  },
  {
    id: "how-to-pray",
    title: "How to Pray (Step by Step)",
    description: "Complete illustrated guide to the five daily prayers with transliteration and audio.",
    category: "new-muslim", type: "link",
    url: "https://islamicfinder.org/prayer/how-to-pray-in-islam/", isExternal: true,
  },
  {
    id: "new-muslim-network",
    title: "New Muslim Network UK",
    description: "Support, community, and resources for new Muslims across the United Kingdom.",
    category: "new-muslim", type: "link",
    url: "https://www.newmuslim.net", isExternal: true,
  },

  // ── QUR'AN & HADITH ─────────────────────────────────────────────
  {
    id: "quran-com",
    title: "Quran.com",
    description: "Full Quran with 50+ translations, audio recitations, and word-by-word analysis.",
    category: "quran", type: "link",
    url: "https://quran.com", isExternal: true,
  },
  {
    id: "sunnah-com",
    title: "Sunnah.com",
    description: "Authenticated hadith collections from Bukhari, Muslim, and more with search.",
    category: "hadith", type: "link",
    url: "https://sunnah.com", isExternal: true,
  },

  // ── ISLAMIC LEARNING ────────────────────────────────────────────
  {
    id: "roots-academy",
    title: "Roots Academy",
    description: "Structured Islamic education for young Muslims in the UK. Highly recommended by ISOC.",
    category: "fiqh", type: "link",
    url: "https://rootsacademy.co.uk", isExternal: true,
  },
  {
    id: "islamqa",
    title: "IslamQA",
    description: "Answers to Islamic questions on fiqh, aqeedah, and daily life from verified scholars.",
    category: "fiqh", type: "link",
    url: "https://islamqa.info/en", isExternal: true,
  },

  // ── DUA & DHIKR ─────────────────────────────────────────────────
  {
    id: "hisnul-muslim",
    title: "Hisnul Muslim (Fortress of the Muslim)",
    description: "Complete dua collection available as a website, app, and PDF download.",
    category: "dua", type: "link",
    url: "https://www.hisnulmuslim.com", isExternal: true,
  },
  {
    id: "dua-student",
    title: "Student Dua Collection (Supplication.net)",
    description: "Duas for exams, anxiety, morning and evening essential for every student.",
    category: "dua", type: "link",
    url: "https://www.supplication.net", isExternal: true,
  },

  // ── MENTAL WELLBEING ────────────────────────────────────────────
  {
    id: "aston-wellbeing",
    title: "Aston University Wellbeing Services",
    description: "Counselling, mental health support, and student crisis services at Aston.",
    category: "wellbeing", type: "link",
    url: "https://www.aston.ac.uk/current-students/student-services/wellbeing", isExternal: true,
  },
  {
    id: "student-minds",
    title: "Student Minds",
    description: "The UK's leading student mental health charity guides, support, and peer networks.",
    category: "wellbeing", type: "link",
    url: "https://www.studentminds.org.uk", isExternal: true,
  },
  {
    id: "muslim-counsellor",
    title: "Muslim Counsellor & Psychotherapist Association",
    description: "Find a Muslim therapist or counsellor in Birmingham and across the UK.",
    category: "wellbeing", type: "link",
    url: "https://www.mcapuk.com", isExternal: true,
  },

  // ── STUDENT FINANCE ─────────────────────────────────────────────
  {
    id: "student-finance-gov",
    title: "Student Finance England",
    description: "Official student loan and maintenance grant application portal.",
    category: "student-finance", type: "link",
    url: "https://www.gov.uk/student-finance", isExternal: true,
  },
  {
    id: "islamic-student-fin",
    title: "Islamic Student Finance (UK Gov)",
    description: "Sharia-compliant alternative student finance interest-free, government-backed.",
    category: "student-finance", type: "link",
    url: "https://www.gov.uk/get-undergraduate-student-loan/islamic-student-finance", isExternal: true,
  },

  // ── COMMUNITY ───────────────────────────────────────────────────
  {
    id: "green-lane-masjid",
    title: "Green Lane Masjid",
    description: "One of Birmingham's most active masajid 1.2 miles from campus. Daily prayers, classes, events.",
    category: "community", type: "link",
    url: "https://www.greenlanemasjid.org", isExternal: true,
  },
  {
    id: "bcm",
    title: "Birmingham Central Mosque",
    description: "Birmingham's largest mosque 0.4 miles from campus. Open to all.",
    category: "community", type: "link",
    url: "https://centralmosque.org.uk", isExternal: true,
  },
  {
    id: "fosis",
    title: "FOSIS",
    description: "Federation of Student Islamic Societies our national umbrella organisation.",
    category: "community", type: "link",
    url: "https://www.fosis.org.uk", isExternal: true,
  },
];

export const RESOURCE_CATEGORY_LABELS: Record<Resource["category"], string> = {
  quran:            "Quran & Tafsir",
  hadith:           "Hadith",
  fiqh:             "Islamic Learning",
  dawah:            "Dawah",
  "new-muslim":     "New Muslim",
  dua:              "Dua & Dhikr",
  "study-skills":   "Study Skills",
  wellbeing:        "Mental Wellbeing",
  "student-finance":"Student Finance",
  productivity:     "Productivity",
  community:        "Community",
  general:          "General",
};

export const RESOURCE_CATEGORY_ORDER: Resource["category"][] = [
  "new-muslim", "quran", "hadith", "fiqh", "dua",
  "wellbeing", "student-finance", "community",
];

export const getResourcesByCategory = (cat: Resource["category"]) =>
  resources.filter(r => r.category === cat);
