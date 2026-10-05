import type { IconName } from "@/components/ui/Icon";

/**
 * DEPARTMENT OVERVIEW CONTENT
 * Rich descriptions for each ISOC department — mission, objectives, initiatives.
 * Keyed to committee section IDs.
 */

export interface Department {
  key: string;
  name: string;
  icon: IconName;
  tagline: string;
  mission: string;
  objectives: string[];
  initiatives: { title: string; desc: string }[];
}

export const departments: Department[] = [
  {
    key: "social_media",
    name: "Socials",
    icon: "handshake",
    tagline: "Where the community comes together",
    mission: "To bring Muslims and non-Muslims together, build lasting friendships, and create a home for students who are away from home.",
    objectives: [
      "Bring Muslims and non-Muslims together",
      "Create lasting friendships across year groups and courses",
      "Build a home for students away from home",
      "Help new students settle into university life",
    ],
    initiatives: [
      { title: "Weekly Sports", desc: "Football, badminton, and more — regular sessions for brothers and sisters to stay active and connected." },
      { title: "Monthly Socials", desc: "Relaxed gatherings, meals, and community events that bring everyone together." },
      { title: "Football Watch-Alongs", desc: "Big-match screenings that turn a game into a community night." },
      { title: "Non-Sports Events", desc: "Game nights, trips, and casual meetups for those who prefer something different." },
    ],
  },
  {
    key: "marketing",
    name: "Marketing",
    icon: "sparkle",
    tagline: "Telling the ISOC story",
    mission: "To make sure every student knows what's on, feels welcome to come, and sees a society worth being part of — through a brand and campaigns people recognise.",
    objectives: [
      "Make sure every event reaches the students it's for",
      "Keep a consistent, recognisable ISOC brand across every channel",
      "Give the sisters' and brothers' programmes their own dedicated promotion",
      "Represent the society professionally to the university, partners and sponsors",
    ],
    initiatives: [
      { title: "Event Campaigns", desc: "Posters, graphics and countdowns for every event, so nothing gets announced at the last minute." },
      { title: "Brand & Design", desc: "The ISOC look — logo, colours and templates used across Instagram, print and the website." },
      { title: "Sisters' & Brothers' Promotion", desc: "Dedicated officers producing content for each community's own programmes and events." },
      { title: "Flagship Campaigns", desc: "Freshers, Charity Week, Discover Islam Week and Ramadan — the campaigns that need the biggest push." },
    ],
  },
  {
    key: "jummah",
    name: "Jumu'ah",
    icon: "mosque",
    tagline: "The heart of our week",
    mission: "To deliver a welcoming and spiritually uplifting Jumu'ah experience that builds community, belonging, and a stronger connection to faith on campus.",
    objectives: [
      "Deliver a welcoming and spiritually uplifting Jumu'ah experience",
      "Build community and a sense of belonging",
      "Help students integrate into university life",
      "Facilitate organised and accessible Jumu'ah services",
      "Encourage Islamic learning and worship",
      "Strengthen student engagement with local mosques",
      "Support student wellbeing and faith development",
    ],
    initiatives: [
      { title: "Weekly Jumu'ah", desc: "Friday congregational prayer every week during term time at the SU Hall, with a dedicated sisters' section." },
      { title: "Guest Khateebs", desc: "A rotation of speakers delivering relevant, uplifting khutbahs for students." },
      { title: "Mosque Links", desc: "Building bridges between students and the established masajid of Birmingham." },
    ],
  },
  {
    key: "advocacy",
    name: "Advocacy",
    icon: "mic",
    tagline: "Standing for our community and beyond",
    mission: "To represent and serve the Muslim student body, raise awareness of the issues that matter, and channel the community's energy into meaningful service, both locally and globally.",
    objectives: [
      "Represent Muslim students within the university and Students' Union",
      "Run awareness campaigns on local and global issues",
      "Deliver community engagement and service projects",
      "Host workplace and professional awareness events",
      "Build global awareness through flagship initiatives",
    ],
    initiatives: [
      { title: "Monthly Flagship Events", desc: "A headline advocacy or awareness event each month, spotlighting a cause that matters to the community." },
      { title: "Service Projects", desc: "Hands-on community work — food drives, charity collections, and local outreach." },
      { title: "Campaigns & Awareness", desc: "Student-led campaigns on humanitarian causes and global issues." },
      { title: "Workplace Events", desc: "Sessions addressing faith in the workplace and student rights." },
    ],
  },
  {
    key: "education",
    name: "Education",
    icon: "book",
    tagline: "Knowledge that lasts a lifetime",
    mission: "To deliver consistent, structured Islamic education that nurtures understanding, encourages participation, and builds a community of learners.",
    objectives: [
      "Deliver consistent Islamic education",
      "Provide structured Islamic learning pathways",
      "Offer an Ijazah pathway for committed students",
      "Encourage discussion, participation and community building",
    ],
    initiatives: [
      { title: "Weekly Roots Classes", desc: "Structured Islamic learning in partnership with Roots Academy, building knowledge week by week." },
      { title: "Ijazah Pathway", desc: "A route for dedicated students to pursue certified Islamic study." },
      { title: "Monthly Guest Lectures", desc: "Visiting scholars and speakers on a range of beneficial topics." },
    ],
  },
  {
    key: "academic",
    name: "Academic Development",
    icon: "compass",
    tagline: "Faith and ambition, together",
    mission: "To equip students for professional success through career development, mentorship, and an introduction to ethical, Islamic approaches to finance and work.",
    objectives: [
      "Run career workshops and skills sessions",
      "Provide CV reviews and application support",
      "Offer assessment centre and insight day preparation",
      "Deliver Islamic finance education",
      "Enable professional networking and careers opportunities",
    ],
    initiatives: [
      { title: "Career Workshops", desc: "Practical sessions on applications, interviews, and assessment centres." },
      { title: "CV Reviews", desc: "One-to-one feedback to sharpen your CV before you apply." },
      { title: "Islamic Finance Education", desc: "Introducing the principles and careers within the growing halal finance sector." },
      { title: "Professional Networking", desc: "Connecting students with Muslim professionals, alumni, and employers." },
    ],
  },
];

export const getDepartment = (key: string) => departments.find(d => d.key === key);
