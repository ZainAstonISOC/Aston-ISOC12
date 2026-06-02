import { PrayerTime } from "@/types";
import { PRAYER_LINKS } from "@/lib/social";

// Static fallback times for Birmingham (used if API fails)
export const fallbackPrayerTimes: PrayerTime[] = [
  { name: "Fajr",    arabicName: "الفجر",  time: "03:42", iqamaTime: "04:00" },
  { name: "Sunrise", arabicName: "الشروق", time: "05:28" },
  { name: "Dhuhr",   arabicName: "الظهر",  time: "13:15", iqamaTime: "13:30" },
  { name: "Asr",     arabicName: "العصر",  time: "17:28", iqamaTime: "17:45" },
  { name: "Maghrib", arabicName: "المغرب", time: "21:04", iqamaTime: "21:04" },
  { name: "Isha",    arabicName: "العشاء", time: "23:12", iqamaTime: "23:30" },
];

// Live fetch from Aladhan API (Birmingham coords)
export async function fetchLivePrayerTimes(date?: Date): Promise<PrayerTime[]> {
  try {
    const d = date ?? new Date();
    const dd = d.getDate().toString().padStart(2, "0");
    const mm = (d.getMonth() + 1).toString().padStart(2, "0");
    const yyyy = d.getFullYear();
    const res = await fetch(
      `https://api.aladhan.com/v1/timings/${dd}-${mm}-${yyyy}?latitude=52.4862&longitude=-1.8904&method=15`,
      { next: { revalidate: 3600 } } // revalidate hourly
    );
    if (!res.ok) return fallbackPrayerTimes;
    const { data } = await res.json();
    const t = data.timings;
    return [
      { name: "Fajr",    arabicName: "الفجر",  time: t.Fajr,    iqamaTime: addMinutes(t.Fajr, 18) },
      { name: "Sunrise", arabicName: "الشروق", time: t.Sunrise },
      { name: "Dhuhr",   arabicName: "الظهر",  time: t.Dhuhr,   iqamaTime: addMinutes(t.Dhuhr, 15) },
      { name: "Asr",     arabicName: "العصر",  time: t.Asr,     iqamaTime: addMinutes(t.Asr, 17) },
      { name: "Maghrib", arabicName: "المغرب", time: t.Maghrib, iqamaTime: t.Maghrib },
      { name: "Isha",    arabicName: "العشاء", time: t.Isha,    iqamaTime: addMinutes(t.Isha, 18) },
    ];
  } catch {
    return fallbackPrayerTimes;
  }
}

function addMinutes(timeStr: string, mins: number): string {
  const [h, m] = timeStr.split(":").map(Number);
  const total = h * 60 + m + mins;
  const nh = Math.floor(total / 60) % 24;
  const nm = total % 60;
  return `${nh.toString().padStart(2, "0")}:${nm.toString().padStart(2, "0")}`;
}

export { PRAYER_LINKS };
