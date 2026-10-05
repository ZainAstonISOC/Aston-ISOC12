import { PrayerTime } from "@/types";
import { PRAYER_LINKS } from "@/lib/social";
import { londonNow } from "@/lib/events/time";

/**
 * Start times for Birmingham from the Aladhan API, Moonsighting Committee
 * Worldwide method (Aladhan method 15).
 *
 * Start times only. Jamaat (iqamah) times are set by the prayer room and
 * published on its MasjidBox page (PRAYER_LINKS.liveWidget); the site links
 * there rather than estimating them. Until October 2026 it showed start time
 * plus 15–18 minutes, which did not match the prayer room's real times.
 *
 * Returns null if the API fails — the page then says so and links to the
 * prayer room's timetable, rather than showing a stored set of times from
 * another season.
 */
export const PRAYER_METHOD = "Moonsighting Committee Worldwide";

export async function fetchLivePrayerTimes(): Promise<PrayerTime[] | null> {
  try {
    // Vercel runs in UTC: "today" must be London's date, or the hour after
    // midnight in summer shows yesterday's times.
    const [yyyy, mm, dd] = londonNow().date.split("-");
    const res = await fetch(
      `https://api.aladhan.com/v1/timings/${dd}-${mm}-${yyyy}?latitude=52.4862&longitude=-1.8904&method=15`,
      { next: { revalidate: 3600 } },
    );
    if (!res.ok) return null;
    const { data } = await res.json();
    const t = data.timings;
    return [
      { name: "Fajr",    arabicName: "الفجر",  time: t.Fajr },
      { name: "Sunrise", arabicName: "الشروق", time: t.Sunrise },
      { name: "Dhuhr",   arabicName: "الظهر",  time: t.Dhuhr },
      { name: "Asr",     arabicName: "العصر",  time: t.Asr },
      { name: "Maghrib", arabicName: "المغرب", time: t.Maghrib },
      { name: "Isha",    arabicName: "العشاء", time: t.Isha },
    ];
  } catch {
    return null;
  }
}

export { PRAYER_LINKS };
