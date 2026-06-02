/**
 * EVENTS DATA
 * ─────────────────────────────────────────────────────
 * Update this file to manage the events calendar.
 * Homepage, events page and category pages all read from here.
 *
 * In future: connect to a CMS (Sanity/Contentful) and replace this array.
 */

import { Event } from "@/types";

export const events: Event[] = [
  // ── RECURRING ─────────────────────────────────────────────────────────────
  {
    id: "jummah-weekly",
    title: "Jumu'ah (Friday Prayer)",
    date: "2026-06-06",
    time: "13:30",
    location: "Main Lecture Theatre, Aston University",
    category: "jummah",
    description:
      "Weekly Friday prayer (Jumu'ah) on campus. Khutbah begins at 13:30, prayer at 14:00. All welcome. Sisters' section available.",
    isRecurring: true,
    recurringNote: "Every Friday during term time",
    isFeatured: true,
  },
  {
    id: "brothers-halaqa-weekly",
    title: "Brothers' Weekly Halaqa",
    date: "2026-06-08",
    time: "18:00",
    location: "MB131, Main Building",
    category: "brothers",
    description:
      "Weekly brothers' study circle. This term we're exploring the Seerah of the Prophet ﷺ. All levels welcome.",
    isRecurring: true,
    recurringNote: "Every Monday",
    isFeatured: false,
  },
  {
    id: "sisters-halaqa-weekly",
    title: "Sisters' Weekly Halaqa",
    date: "2026-06-09",
    time: "12:00",
    location: "ABS G05, Aston Business School",
    category: "sisters",
    description:
      "Weekly sisters-only study circle exploring Qur'an, Seerah, and contemporary Islamic topics. All levels welcome.",
    isRecurring: true,
    recurringNote: "Every Tuesday",
    isFeatured: false,
  },

  // ── UPCOMING ──────────────────────────────────────────────────────────────
  {
    id: "freshers-welcome-2026",
    title: "Freshers Welcome Night 2026",
    date: "2026-09-20",
    time: "19:00",
    location: "Main Lecture Theatre, Aston University",
    category: "freshers",
    description:
      "Join us for a warm welcome to Aston ISOC. Meet the committee, enjoy free food, and discover everything we have planned for the year ahead. Perfect for new students and anyone wanting to connect.",
    isFeatured: true,
  },
  {
    id: "charity-iftar-2026",
    title: "Charity Iftaar Dinner",
    date: "2026-09-27",
    time: "20:30",
    location: "Aston Business School Atrium",
    category: "charity",
    description:
      "Annual charity Iftaar bringing the community together for an evening of food, dua, and fundraising for our active campaigns.",
    isFeatured: true,
  },
  {
    id: "sisters-brunch-oct",
    title: "Sisters' Brunch & Circle",
    date: "2026-10-05",
    time: "11:00",
    location: "ABS G05, Aston Business School",
    category: "sisters",
    description:
      "Monthly sisters' social brunch — a relaxed space to connect, eat well, and build friendships. All sisters welcome.",
    isFeatured: true,
  },
  {
    id: "brothers-football-oct",
    title: "Brothers' Football Tournament",
    date: "2026-10-12",
    time: "14:00",
    location: "Aston University Sports Hall",
    category: "sports",
    description:
      "Annual ISOC brothers' football tournament. Teams of 5. Register your team in advance or come and spectate.",
    isFeatured: false,
  },
  {
    id: "islamic-finance-panel",
    title: "Islamic Finance & Careers Panel",
    date: "2026-10-18",
    time: "17:00",
    location: "MB550, Main Building",
    category: "speaker",
    description:
      "Industry professionals from Islamic banking and finance discuss careers, halal investment, and navigating finance from an Islamic perspective. Networking afterwards.",
    isFeatured: true,
  },
  {
    id: "quran-competition-2026",
    title: "Inter-University Qur'an Competition",
    date: "2026-11-01",
    time: "10:00",
    location: "Aston University Great Hall",
    category: "all",
    description:
      "Aston ISOC hosts the annual inter-university Qur'an recitation competition. Open to all students from UK universities. Spectators welcome.",
    isFeatured: false,
  },
  {
    id: "mental-health-workshop",
    title: "Muslim Mental Health Workshop",
    date: "2026-11-10",
    time: "14:00",
    location: "LT4, Main Building",
    category: "all",
    description:
      "A safe space exploring mental health through an Islamic lens. Professional counsellors and ISOC welfare team present. Sisters' and brothers' sessions available.",
    isFeatured: false,
  },
];

export const getEventById = (id: string) => events.find((e) => e.id === id);
export const getFeaturedEvents = () => events.filter((e) => e.isFeatured);
export const getEventsByCategory = (cat: Event["category"]) =>
  events.filter((e) => e.category === cat || e.category === "all");
export const getUpcomingEvents = (count?: number) => {
  const now = new Date();
  const sorted = [...events]
    .filter((e) => new Date(e.date) >= now || e.isRecurring)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  return count ? sorted.slice(0, count) : sorted;
};
export const getSisterEvents = () =>
  events.filter((e) => e.category === "sisters" || e.category === "all");
export const getBrotherEvents = () =>
  events.filter((e) => e.category === "brothers" || e.category === "sports" || e.category === "all");
