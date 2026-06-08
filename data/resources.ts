import { Resource } from "@/types";

export const resources: Resource[] = [
  // NEW MUSLIM
  { id: "new-muslim-guide",  title: "New Muslim Guide",             description: "A beginners guide to Islam for those exploring the faith. ISOC curated PDF.", category: "new-muslim", type: "pdf",  url: "/resources/new-muslim-guide.pdf" },
  { id: "how-to-pray",       title: "How to Pray (Step by Step)",   description: "Complete illustrated guide to the five daily prayers with transliteration.", category: "new-muslim", type: "link", url: "https://www.islamicfinder.org/how-to-pray/", isExternal: true },
  { id: "new-muslim-network",title: "New Muslim Network UK",        description: "Support and community for new Muslims across the UK.", category: "new-muslim", type: "link", url: "https://newmuslimnetwork.co.uk", isExternal: true },

  // QUR'AN & HADITH
  { id: "quran-com",    title: "Quran.com",   description: "Full Quran with 50+ translations, audio recitations, and word-by-word analysis.", category: "quran",  type: "link", url: "https://quran.com",    isExternal: true },
  { id: "sunnah-com",   title: "Sunnah.com",  description: "Authenticated hadith collections from Bukhari, Muslim, and more with search and commentary.", category: "hadith", type: "link", url: "https://sunnah.com",   isExternal: true },

  // FIQH & LEARNING
  { id: "seekersguidance", title: "SeekersGuidance",  description: "Free Islamic courses, answers, and podcasts from qualified scholars.", category: "fiqh", type: "link", url: "https://seekersguidance.org", isExternal: true },
  { id: "islamqa",         title: "IslamQA",           description: "Answers to Islamic questions on fiqh, aqeedah, and daily life.", category: "fiqh", type: "link", url: "https://islamqa.info", isExternal: true },
  { id: "roots-academy",   title: "Roots Academy",     description: "Structured Islamic education courses for young Muslims in the UK. Highly recommended.", category: "fiqh", type: "link", url: "https://rootsacademy.co.uk", isExternal: true },

  // DUA
  { id: "dua-student",  title: "Student Dua Collection",         description: "Duas for exams, anxiety, morning and evening. Curated for students by ISOC.", category: "dua", type: "pdf",  url: "/resources/student-duas.pdf" },
  { id: "hisnul-muslim",title: "Hisnul Muslim (Fortress of the Muslim)", description: "Complete dua collection available online and as an app.", category: "dua", type: "link", url: "https://www.hisnulmuslim.com", isExternal: true },

  // WELLBEING
  { id: "aston-counselling",   title: "Aston Wellbeing Services",    description: "University counselling, mental health support and crisis services.", category: "wellbeing", type: "link", url: "https://www.aston.ac.uk/current-students/student-services/wellbeing", isExternal: true },
  { id: "student-minds",       title: "Student Minds",               description: "The UK student mental health charity with resources, guides, and peer support.", category: "wellbeing", type: "link", url: "https://www.studentminds.org.uk", isExternal: true },
  { id: "muslim-counsellor",   title: "Muslim Counsellor Directory", description: "Find a Muslim therapist or counsellor in Birmingham and across the UK.", category: "wellbeing", type: "link", url: "https://www.muslimcounsellorsuk.org", isExternal: true },

  // STUDENT FINANCE
  { id: "student-finance-gov", title: "Student Finance England",       description: "Official student loan and maintenance grant application portal.", category: "student-finance", type: "link", url: "https://www.gov.uk/student-finance", isExternal: true },
  { id: "islamic-student-fin", title: "Islamic Student Finance",       description: "Sharia-compliant alternative student finance from the UK Government.", category: "student-finance", type: "link", url: "https://www.gov.uk/get-undergraduate-student-loan/islamic-student-finance", isExternal: true },

  // COMMUNITY
  { id: "green-lane-masjid",   title: "Green Lane Masjid",            description: "One of Birmingham's most active masajid, 1.2 miles from campus. Events, classes, and daily prayers.", category: "community", type: "link", url: "https://greenlanemasjid.org", isExternal: true },
  { id: "bcm",                 title: "Birmingham Central Mosque",    description: "Birmingham largest mosque, 0.4 miles from campus.", category: "community", type: "link", url: "https://centralmosque.org.uk", isExternal: true },
  { id: "fosis",               title: "FOSIS",                        description: "Federation of Student Islamic Societies, our national umbrella organisation.", category: "community", type: "link", url: "https://www.fosis.org.uk", isExternal: true },
];

export const RESOURCE_CATEGORY_LABELS: Record<Resource["category"], string> = {
  quran:           "Quran and Tafsir",
  hadith:          "Hadith",
  fiqh:            "Islamic Learning",
  dawah:           "Dawah",
  "new-muslim":    "New Muslim",
  dua:             "Dua and Dhikr",
  "study-skills":  "Study Skills",
  wellbeing:       "Mental Wellbeing",
  "student-finance":"Student Finance",
  productivity:    "Productivity",
  community:       "Community",
  general:         "General",
};

export const RESOURCE_CATEGORY_ORDER: Resource["category"][] = [
  "new-muslim", "quran", "hadith", "fiqh", "dua",
  "wellbeing", "student-finance", "community",
];

export const getResourcesByCategory = (cat: Resource["category"]) =>
  resources.filter(r => r.category === cat);
