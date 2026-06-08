import { Lecture } from "@/types";
import { SOCIAL } from "@/lib/social";

export const lectures: Lecture[] = [
  // LECTURES
  { id: "purpose-of-life",    title: "The Purpose of Life in Islam",             speaker: "Sheikh Dr. Haitham Al-Haddad",  series: "ISOC Annual Lecture",    duration: "48 min", date: "2025-03-15", youtubeUrl: SOCIAL.instagram, category: "lecture",  description: "A deep exploration of the Islamic worldview on the purpose of human existence, drawing from Quran, Sunnah and classical scholarship." },
  { id: "power-of-salah",     title: "The Transformative Power of Salah",        speaker: "Sheikh Assim Al-Hakeem",         series: "ISOC Lecture Series",    duration: "55 min", date: "2025-01-18", youtubeUrl: SOCIAL.instagram, category: "lecture",  description: "Understanding why Salah is the pillar of the Deen, a motivating talk for students struggling to maintain their prayers." },
  { id: "amau-aqeedah",       title: "Foundations of Islamic Belief",            speaker: "AMAU Academy",                   series: "AMAU Academy",           duration: "60 min", date: "2025-02-10", youtubeUrl: "https://www.youtube.com/@amauacademy", category: "lecture",  description: "A comprehensive introduction to Islamic aqeedah delivered by AMAU Academy scholars. Highly recommended for all students." },
  { id: "abdurrahman-seerah", title: "The Life of the Prophet",                  speaker: "Ustaadh Abdurrahman Hassan",     series: "Al-Madrasah Al-Umariyyah",duration: "75 min", date: "2025-04-05", youtubeUrl: "https://www.youtube.com/@abdurrahmanhassan", category: "lecture",  description: "An inspiring and detailed study of the Seerah, delivered by Ustaadh Abdurrahman Hassan. Essential listening for every Muslim student." },
  { id: "abdurrahman-tazkiyah",title: "Purification of the Soul",               speaker: "Ustaadh Abdurrahman Hassan",     series: "Al-Madrasah Al-Umariyyah",duration: "50 min", date: "2025-03-20", youtubeUrl: "https://www.youtube.com/@abdurrahmanhassan", category: "lecture",  description: "A practical guide to spiritual purification and self-development grounded in the Quran and Sunnah." },

  // KHUTBAHS
  { id: "steadfastness-trials",title: "Steadfastness in Times of Trial",         speaker: "Ustadh Asim Khan",               series: "Jumu'ah Khutbah Series", duration: "35 min", date: "2025-04-11", youtubeUrl: SOCIAL.instagram, category: "khutbah", description: "How to remain firm in faith when facing personal and global challenges." },

  // HALAQA
  { id: "muslim-woman-university",title: "Navigating University as a Muslim Woman",speaker: "Dr. Haifaa Younis",            series: "Sisters Lecture Series", duration: "52 min", date: "2025-02-20", youtubeUrl: SOCIAL.instagram, category: "halaqa",  description: "A practical and spiritual guide for Muslim sisters in higher education." },
];

export const getLecturesByCategory = (cat: Lecture["category"]) =>
  lectures.filter(l => l.category === cat);

export const LECTURE_CATEGORY_LABELS: Record<Lecture["category"], string> = {
  lecture: "Lectures",
  khutbah: "Jumu'ah Khutbahs",
  halaqa:  "Halaqa Sessions",
  podcast: "Podcast",
  event:   "Recorded Events",
};
