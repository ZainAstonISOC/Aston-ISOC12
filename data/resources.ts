/**
 * RESOURCES LIBRARY
 * ─────────────────────────────────────────────────────
 * Add resources here — pages will update automatically.
 */

import { Resource } from "@/types";

export const resources: Resource[] = [
  // ── ISLAMIC LEARNING ─────────────────────────────────────────────────────
  { id: "quran-com", title: "Quran.com", description: "Full Qur'an with 50+ translations, audio recitations, and word-by-word analysis", category: "quran", type: "link", url: "https://quran.com", isExternal: true },
  { id: "sunnah-com", title: "Sunnah.com", description: "Authenticated hadith collections from Bukhari, Muslim, and more with search and commentary", category: "hadith", type: "link", url: "https://sunnah.com", isExternal: true },
  { id: "seekersguidance", title: "SeekersGuidance", description: "Free Islamic courses, answers, and podcasts from qualified scholars", category: "fiqh", type: "link", url: "https://seekersguidance.org", isExternal: true },
  { id: "yaqeeninstitute", title: "Yaqeen Institute", description: "Research-based Islamic content addressing contemporary Muslim questions", category: "dawah", type: "link", url: "https://yaqeeninstitute.org", isExternal: true },
  { id: "islamqa", title: "IslamQA", description: "Answers to Islamic questions on fiqh, aqeedah, and daily life", category: "fiqh", type: "link", url: "https://islamqa.info", isExternal: true },

  // ── NEW MUSLIM ────────────────────────────────────────────────────────────
  { id: "new-muslim-guide", title: "New Muslim Guide", description: "A beginner's guide to Islam — beliefs, prayer, and community. ISOC-curated PDF.", category: "new-muslim", type: "pdf", url: "/resources/new-muslim-guide.pdf" },
  { id: "how-to-pray", title: "How to Pray (Step by Step)", description: "Complete illustrated guide to the five daily prayers with transliteration", category: "new-muslim", type: "link", url: "https://www.islamicfinder.org/how-to-pray/", isExternal: true },
  { id: "new-muslim-network", title: "New Muslim Network UK", description: "Support and community for new Muslims across the UK", category: "new-muslim", type: "link", url: "https://newmuslimnetwork.co.uk", isExternal: true },

  // ── DUA ───────────────────────────────────────────────────────────────────
  { id: "dua-student", title: "Student Dua Collection", description: "Duas for exams, anxiety, morning & evening — curated for students. ISOC PDF.", category: "dua", type: "pdf", url: "/resources/student-duas.pdf" },
  { id: "dua-app", title: "Hisnul Muslim (Fortress of the Muslim)", description: "Complete dua collection — available online and as an app", category: "dua", type: "link", url: "https://www.hisnulmuslim.com", isExternal: true },

  // ── STUDY SKILLS ─────────────────────────────────────────────────────────
  { id: "aston-study-skills", title: "Aston Library Study Skills", description: "Official Aston University academic skills resources — referencing, essay writing, research", category: "study-skills", type: "link", url: "https://www.aston.ac.uk/library", isExternal: true },
  { id: "notion-templates", title: "Study Organisation Templates", description: "Free Notion templates for university students — timetables, deadlines, note-taking", category: "study-skills", type: "link", url: "https://www.notion.so/templates/students", isExternal: true },
  { id: "pomodoro", title: "Pomodoro Focus Timer", description: "Free browser-based study timer using the Pomodoro technique", category: "productivity", type: "link", url: "https://pomofocus.io", isExternal: true },

  // ── WELLBEING ────────────────────────────────────────────────────────────
  { id: "aston-counselling", title: "Aston Wellbeing Services", description: "University counselling, mental health support and crisis services", category: "wellbeing", type: "link", url: "https://www.aston.ac.uk/current-students/student-services/wellbeing", isExternal: true },
  { id: "student-minds", title: "Student Minds", description: "UK's student mental health charity — resources, guides, and peer support", category: "wellbeing", type: "link", url: "https://www.studentminds.org.uk", isExternal: true },
  { id: "muslim-counsellor", title: "Muslim Counsellor Directory", description: "Find a Muslim therapist or counsellor in Birmingham and the UK", category: "wellbeing", type: "link", url: "https://www.muslimcounsellorsuk.org", isExternal: true },

  // ── STUDENT FINANCE ───────────────────────────────────────────────────────
  { id: "student-finance-gov", title: "Student Finance England", description: "Official student loan and maintenance grant application portal", category: "student-finance", type: "link", url: "https://www.gov.uk/student-finance", isExternal: true },
  { id: "aston-bursaries", title: "Aston University Bursaries", description: "University financial support, hardship funds and scholarship opportunities", category: "student-finance", type: "link", url: "https://www.aston.ac.uk/study/scholarships-and-bursaries", isExternal: true },
  { id: "islamic-student-finance", title: "Islamic Student Finance", description: "Sharia-compliant student finance alternative — Government Alternative Student Finance", category: "student-finance", type: "link", url: "https://www.gov.uk/get-undergraduate-student-loan/islamic-student-finance", isExternal: true },

  // ── COMMUNITY ────────────────────────────────────────────────────────────
  { id: "fosis", title: "FOSIS", description: "Federation of Student Islamic Societies — national network for UK Islamic societies", category: "community", type: "link", url: "https://www.fosis.org.uk", isExternal: true },
  { id: "bcm", title: "Birmingham Central Mosque", description: "Birmingham's largest mosque — prayer times, services and community programmes", category: "community", type: "link", url: "https://centralmosque.org.uk", isExternal: true },
];

export const RESOURCE_CATEGORY_LABELS: Record<Resource["category"], string> = {
  quran: "Qur'an & Tafsir",
  hadith: "Hadith",
  fiqh: "Fiqh & Rulings",
  dawah: "Dawah",
  "new-muslim": "New Muslim",
  dua: "Dua & Dhikr",
  "study-skills": "Study Skills",
  wellbeing: "Mental Wellbeing",
  "student-finance": "Student Finance",
  productivity: "Productivity",
  community: "Community",
  general: "General",
};

export const getResourcesByCategory = (cat: Resource["category"]) =>
  resources.filter((r) => r.category === cat);

export const RESOURCE_CATEGORY_ORDER: Resource["category"][] = [
  "new-muslim", "quran", "hadith", "fiqh", "dua",
  "study-skills", "productivity", "wellbeing",
  "student-finance", "community", "dawah", "general",
];
