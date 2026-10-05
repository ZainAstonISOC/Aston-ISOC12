import { Lecture } from "@/types";

/**
 * LECTURES DATA
 * YouTube thumbnails are built from the video ID. "Foundations of Worship"
 * (HUZYbzIGv8Y) was removed on 2026-10-05: the video is no longer public on
 * YouTube, so its card showed a grey placeholder and a dead link.
 * Helper: thumbnailFromUrl() extracts video ID and builds thumbnail URL.
 */

export const lectures: Lecture[] = [
  {
    id: "purification-of-the-soul",
    title: "Purification of the Soul",
    speaker: "AMAU Academy",
    series: "AMAU Academy",
    duration: "Lecture",
    date: "2025-03-08",
    youtubeUrl: "https://www.youtube.com/watch?v=uvMTNDqWuYI",
    youtubeId: "uvMTNDqWuYI",
    category: "lecture",
    description: "A practical guide to tazkiyah — purifying the heart and developing strong, sincere character grounded in the Quran and Sunnah.",
  },
  {
    id: "amau-playlist",
    title: "AMAU Academy Full Playlist",
    speaker: "AMAU Academy",
    series: "AMAU Academy",
    duration: "Playlist",
    date: "2025-02-20",
    youtubeUrl: "https://www.youtube.com/playlist?list=PL2dRQaGGWZOAUeP0gfx_rmP-vMWTEjKrm",
    youtubeId: "PL2dRQaGGWZOAUeP0gfx_rmP-vMWTEjKrm",
    category: "lecture",
    description: "The complete AMAU Academy lecture playlist — structured Islamic learning across aqeedah, fiqh, and spirituality.",
    isPlaylist: true,
  },
  {
    id: "seerah-series",
    title: "Seerah Series",
    speaker: "AMAU Academy",
    series: "Seerah of the Prophet ﷺ",
    duration: "Series",
    date: "2025-04-05",
    youtubeUrl: "https://www.youtube.com/watch?v=28ip1xk3QBw&list=PL2dRQaGGWZOBTruan5Ca44q9qQzp-ne0T",
    youtubeId: "28ip1xk3QBw",
    category: "lecture",
    description: "A detailed series on the life of Prophet Muhammad ﷺ — essential listening for every Muslim student.",
    isPlaylist: true,
  },
  {
    id: "additional-lecture",
    title: "Knowledge & Practice",
    speaker: "AMAU Academy",
    series: "AMAU Academy",
    duration: "Lecture",
    date: "2025-03-15",
    youtubeUrl: "https://www.youtube.com/watch?v=FEQzf24R_sQ",
    youtubeId: "FEQzf24R_sQ",
    category: "lecture",
    description: "A reminder on connecting Islamic knowledge with daily practice and consistency in worship.",
  },
];

/** Build a YouTube thumbnail URL from a video ID. Playlists use the first video's ID. */
export function youtubeThumbnail(lecture: Lecture): string | null {
  if (!lecture.youtubeId) return null;
  // Playlist IDs start with "PL" and aren't valid video thumbnails
  if (lecture.youtubeId.startsWith("PL")) return null;
  return `https://i.ytimg.com/vi/${lecture.youtubeId}/hqdefault.jpg`;
}

export const getLecturesByCategory = (cat: Lecture["category"]) =>
  lectures.filter(l => l.category === cat);

export const LECTURE_CATEGORY_LABELS: Record<Lecture["category"], string> = {
  lecture: "Lectures & Series",
  khutbah: "Jumu'ah Khutbahs",
  podcast: "Podcast",
  event:   "Recorded Events",
};
