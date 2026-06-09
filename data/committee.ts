import { CommitteeMember } from "@/types";

export const committeeMembers: CommitteeMember[] = [
  // EXECUTIVE
  { id: "head-sister",       name: "Aminah",           role: "Head Sister",        year: "2026/27", bio: "Leads the sisters community at Aston ISOC, overseeing all sisters programmes, events, and wellbeing.", section: "executive" },
  { id: "vice-sister",       name: "Yusra",            role: "Vice Sister",        year: "2026/27", bio: "Supports the Head Sister in delivering sisters programming and community initiatives.", section: "executive" },
  { id: "head-brother",      name: "Abdikarim",        role: "Head Brother",       year: "2026/27", bio: "Leads the brothers community at Aston ISOC, overseeing all brothers programmes, events, and brotherhood activities.", section: "executive" },
  { id: "vice-brother",      name: "Shahz",             role: "Vice Brother",       year: "2026/27", bio: "Supports the Head Brother in brothers events and day-to-day operations.", section: "executive" },
  { id: "treasurer",         name: "Salman Omer",      role: "Treasurer",          year: "2026/27", bio: "Manages ISOC finances, membership funds, event budgets, and charity financial reporting.", section: "executive" },
  { id: "general-secretary", name: "Maryam",           role: "General Secretary",  year: "2026/27", bio: "Manages internal communications, meeting minutes, and administrative operations for the society.", section: "executive" },

  // ACADEMIC DEVELOPMENT
  { id: "academic-head",     name: "Zain-Ud-Deen Khan", role: "Head of Academic Development", year: "2026/27", bio: "Leads ISOC academic support initiatives, study events, and educational programmes for students.", section: "academic" },
  { id: "academic-officer",  name: "Zahra Bukhari",    role: "Academic Development Officer",  year: "2026/27", bio: "Organises study sessions, academic workshops, and resources to support students throughout the year.", section: "academic" },

  // JUMMAH
  { id: "jummah-head",       name: "Umar",             role: "Jummah Head",              year: "2026/27", bio: "Organises and coordinates Friday Jumu'ah prayer on campus, ensuring smooth logistics for the community.", section: "jummah" },
  { id: "jummah-brothers",   name: "Zayyan",           role: "Jummah Brothers Officer",  year: "2026/27", bio: "Supports brothers Jumu'ah arrangements and coordinates with the mosque team.", section: "jummah" },
  { id: "jummah-sisters-1",  name: "Khadija Masare",   role: "Jummah Sisters Officer",   year: "2026/27", bio: "Coordinates sisters Jumu'ah arrangements and prayer space logistics.", section: "jummah" },
  { id: "jummah-sisters-2",  name: "Noor",             role: "Jummah Sisters Officer",   year: "2026/27", bio: "Supports the sisters Jumu'ah team with on-the-day coordination.", section: "jummah" },

  // MARKETING
  { id: "marketing-head",      name: "Ibrahim",        role: "Head of Marketing",         year: "2026/27", bio: "Oversees all ISOC branding, campaigns, promotional materials and marketing strategy.", section: "marketing" },
  { id: "marketing-brothers",  name: "Nicolas Habib",  role: "Marketing Brothers Officer", year: "2026/27", bio: "Produces brothers-focused marketing materials and event promotions.", section: "marketing" },
  { id: "marketing-sisters-1", name: "Lybah",          role: "Marketing Sisters Officer",  year: "2026/27", bio: "Creates sisters-focused marketing assets and promotional designs.", section: "marketing" },
  { id: "marketing-sisters-2", name: "Laila",          role: "Marketing Sisters Officer",  year: "2026/27", bio: "Supports sisters marketing content and graphic design production.", section: "marketing" },

  // SOCIALS
  { id: "socials-head",        name: "Ahmad Gebriel",  role: "Head of Socials",           year: "2026/27", bio: "Manages ISOC social events, community engagement, and content creation across all platforms.", section: "social_media" },
  { id: "socials-brothers-1",  name: "Fayez",          role: "Socials Brothers Officer",  year: "2026/27", bio: "Creates brothers-focused social content, organises community events, and drives engagement.", section: "social_media" },
  { id: "socials-brothers-2",  name: "Al Juwainy",        role: "Socials Brothers Officer",  year: "2026/27", bio: "Produces video content, supports social events, and manages brothers community campaigns.", section: "social_media" },
  { id: "socials-sisters-1",   name: "Hibah",          role: "Socials Sisters Officer",   year: "2026/27", bio: "Manages sisters social presence, creates community content, and organises sisters engagement activities.", section: "social_media" },
  { id: "socials-sisters-2",   name: "Shafiya",        role: "Socials Sisters Officer",   year: "2026/27", bio: "Supports sisters social content creation and community engagement.", section: "social_media" },

  // EDUCATION
  { id: "education-head",       name: "Yousaf Ali",    role: "Head of Education",          year: "2026/27", bio: "Leads ISOC Islamic education programme, halaqa circles, lecture series, and speaker events.", section: "education" },
  { id: "education-brothers-1", name: "Zahi Manakkal", role: "Education Brothers Officer",  year: "2026/27", bio: "Organises brothers halaqa circles and supports the Islamic education programme.", section: "education" },
  { id: "education-brothers-2", name: "Ismaeel",       role: "Education Brothers Officer",  year: "2026/27", bio: "Coordinates brothers educational workshops and Islamic study sessions.", section: "education" },
  { id: "education-sisters-1",  name: "Zainab Khan",   role: "Education Sisters Officer",   year: "2026/27", bio: "Leads sisters halaqa circles and Islamic knowledge sessions.", section: "education" },
  { id: "education-sisters-2",  name: "Madheeha",      role: "Education Sisters Officer",   year: "2026/27", bio: "Organises sisters educational events and supports the education programme.", section: "education" },

  // ADVOCACY
  { id: "advocacy-head",        name: "Karbin",        role: "Head of Advocacy",           year: "2026/27", bio: "Leads ISOC advocacy work, representing Muslim students interests within the university and beyond.", section: "advocacy" },
  { id: "advocacy-brothers-1",  name: "Adam Milhim",   role: "Advocacy Brothers Officer",  year: "2026/27", bio: "Supports advocacy campaigns and student representation for the brothers community.", section: "advocacy" },
  { id: "advocacy-brothers-2",  name: "Ahmed Khattab", role: "Advocacy Brothers Officer",  year: "2026/27", bio: "Coordinates advocacy initiatives and community outreach programmes.", section: "advocacy" },
  { id: "advocacy-sisters-1",   name: "Shayma",        role: "Advocacy Sisters Officer",   year: "2026/27", bio: "Leads advocacy work for the sisters community and university-wide representation.", section: "advocacy" },
  { id: "advocacy-sisters-2",   name: "Sanaa",         role: "Advocacy Sisters Officer",   year: "2026/27", bio: "Supports sisters advocacy campaigns and student wellbeing initiatives.", section: "advocacy" },
];

export const getBySection = (section: CommitteeMember["section"]) =>
  committeeMembers.filter(m => m.section === section);
export const getExecutive = () => getBySection("executive");

export const SECTION_LABELS: Record<string, string> = {
  executive:    "Core Committee",
  academic:     "Academic Development",
  jummah:       "Jummah",
  marketing:    "Marketing",
  social_media: "Socials",
  education:    "Education",
  advocacy:     "Advocacy",
};

export const SECTION_ORDER = [
  "executive", "academic", "jummah", "marketing", "social_media", "education", "advocacy",
] as const;
