/**
 * Small formatting and date helpers shared by server and browser code.
 * Kept free of data imports so client components stay light.
 */

/** Today's date in London as YYYY-MM-DD, wherever the code runs. */
export function londonDate(at: Date = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/London",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(at);
}

/** Walks a list one entry per day, looping. Same answer everywhere for a given date. */
export function dailyIndex(date: string, count: number): number {
  const [y, m, d] = date.split("-").map(Number);
  const day = Math.floor(Date.UTC(y, m - 1, d) / 86_400_000);
  return ((day % count) + count) % count;
}

/** "2:155-157" → "Qur'an 2:155–157" */
export function formatRef(ref: string): string {
  return `Qur\u2019an ${ref.replace("-", "\u2013")}`;
}

/** Western digits → Arabic-Indic, for the ayah-end ornament. */
export function arabicNumber(n: number): string {
  return String(n).replace(/\d/g, (d) => "٠١٢٣٤٥٦٧٨٩"[Number(d)]);
}
