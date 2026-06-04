import { Lecture } from "@/types";
import { SOCIAL } from "@/lib/social";

export const lectures: Lecture[] = [
  {
    id: "purpose-of-life",
    title: "The Purpose of Life in Islam",
    speaker: "Sheikh Dr. Haitham Al-Haddad",
    series: "ISOC Annual Lecture",
    duration: "48 min",
    date: "2025-03-15",
    youtubeUrl: SOCIAL.instagram,
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
    youtubeUrl: SOCIAL.instagram,
    category: "khutbah",
    description: "How to remain firm in faith when facing personal and global challenges.",
  },
  {
    id: "muslim-woman-university",
    title: "Navigating University as a Muslim Woman",
    speaker: "Dr. Haifaa Younis",
    series: "Sisters' Lecture Series",
    duration: "52 min",
    date: "2025-02-20",
    youtubeUrl: SOCIAL.instagram,
    category: "halaqa",
    description: "A practical and spiritual guide for Muslim sisters in higher education.",
  },
  {
    id: "power-of-salah",
    title: "The Transformative Power of Salah",
    speaker: "Ustadh Nouman Ali Khan",
    series: "ISOC Lecture Series",
    duration: "61 min",
    date: "2025-01-18",
    youtubeUrl: SOCIAL.instagram,
    category: "lecture",
    description: "Understanding why Salah is the pillar of the Deen — motivating for students struggling to maintain their prayers.",
  },
  {
    id: "podcast-ep1",
    title: "Ep. 1 — Faith in the First Year",
    speaker: "Aston ISOC Committee",
    series: "ISOC Podcast",
    duration: "42 min",
    date: "2025-05-01",
    youtubeUrl: SOCIAL.instagram,
    category: "podcast",
    description: "Committee members share their first-year university experiences as Muslim students.",
  },
];

export const getLecturesByCategory = (cat: Lecture["category"]) =>
  lectures.filter((l) => l.category === cat);

export const LECTURE_CATEGORY_LABELS: Record<Lecture["category"], string> = {
  lecture: "Lectures",
  khutbah: "Jumu'ah Khutbahs",
  halaqa:  "Halaqa Sessions",
  podcast: "ISOC Podcast",
  event:   "Recorded Events",
};
