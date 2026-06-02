/**
 * LECTURES & PODCASTS DATA
 * Add new entries here — the lectures page updates automatically.
 * For YouTube embeds, provide the video ID (the part after ?v=)
 */

import { Lecture } from "@/types";

export const lectures: Lecture[] = [
  {
    id: "purpose-of-life",
    title: "The Purpose of Life in Islam",
    speaker: "Sheikh Dr. Haitham Al-Haddad",
    series: "ISOC Annual Lecture",
    duration: "48 min",
    date: "2025-03-15",
    youtubeUrl: "https://www.youtube.com/@astonisoc",
    category: "lecture",
    description: "A deep exploration of the Islamic worldview on the purpose of human existence — drawing from Qur'an, Sunnah and classical scholarship.",
  },
  {
    id: "steadfastness-trials",
    title: "Steadfastness in Times of Trial",
    speaker: "Ustadh Asim Khan",
    series: "Jumu'ah Khutbah Series",
    duration: "35 min",
    date: "2025-04-11",
    youtubeUrl: "https://www.youtube.com/@astonisoc",
    category: "khutbah",
    description: "How to remain firm in faith when facing personal and global challenges. A practical khutbah for students.",
  },
  {
    id: "muslim-woman-university",
    title: "Navigating University as a Muslim Woman",
    speaker: "Dr. Haifaa Younis",
    series: "Sisters' Lecture Series",
    duration: "52 min",
    date: "2025-02-20",
    youtubeUrl: "https://www.youtube.com/@astonisoc",
    category: "halaqa",
    description: "A practical and spiritual guide for Muslim sisters in higher education — balancing faith, study and community.",
  },
  {
    id: "power-of-salah",
    title: "The Transformative Power of Salah",
    speaker: "Ustadh Nouman Ali Khan",
    series: "ISOC Lecture Series",
    duration: "61 min",
    date: "2025-01-18",
    youtubeUrl: "https://www.youtube.com/@astonisoc",
    category: "lecture",
    description: "Understanding why Salah is the pillar of the Deen — a motivating talk for students struggling to maintain their prayers.",
  },
  {
    id: "muslim-community-west",
    title: "Building Muslim Community in the West",
    speaker: "Dr. Yasir Qadhi",
    series: "ISOC Annual Conference",
    duration: "74 min",
    date: "2024-11-10",
    youtubeUrl: "https://www.youtube.com/@astonisoc",
    category: "lecture",
    description: "Challenges and opportunities for Muslim communities in Western universities — an honest and inspiring talk.",
  },
  {
    id: "podcast-ep1",
    title: "Ep. 1 — Faith in the First Year",
    speaker: "Aston ISOC Committee",
    series: "ISOC Podcast",
    duration: "42 min",
    date: "2025-05-01",
    youtubeUrl: "https://www.youtube.com/@astonisoc",
    category: "podcast",
    description: "Committee members share their first-year university experiences as Muslim students — honest, relatable and inspiring.",
  },
  {
    id: "podcast-ep2",
    title: "Ep. 2 — Maintaining Your Deen at University",
    speaker: "Aston ISOC Committee",
    series: "ISOC Podcast",
    duration: "38 min",
    date: "2025-05-15",
    youtubeUrl: "https://www.youtube.com/@astonisoc",
    category: "podcast",
    description: "Practical tips for keeping up your prayer, fasting, and Islamic identity during university life.",
  },
];

export const getLecturesByCategory = (cat: Lecture["category"]) =>
  lectures.filter((l) => l.category === cat);

export const LECTURE_CATEGORY_LABELS: Record<Lecture["category"], string> = {
  lecture: "Lectures",
  khutbah: "Jumu'ah Khutbahs",
  halaqa: "Halaqa Sessions",
  podcast: "ISOC Podcast",
  event: "Recorded Events",
};
