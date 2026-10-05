/**
 * MASJIDS NEAR CAMPUS
 * ---------------------------------------------------------------
 * Each entry checked against the masjid's own website on `checked`. We never
 * print another masjid's prayer times: each one links to its own timetable,
 * which it keeps up to date and we cannot.
 *
 * To add one: name, address and timetable link exactly as the masjid's own
 * site gives them, and update `checked`.
 */
export interface Masjid {
  name: string;
  address: string;
  website: string;
  timetable: string;
}

export const MASJIDS_CHECKED = "2026-10-05";

export const masjids: Masjid[] = [
  {
    name: "Aston Masjid",
    address: "125 Mansfield Road, Birmingham B6 6DA",
    website: "https://www.astonmasjid.com",
    timetable: "https://masjidbox.com/prayer-times/astonmasjid",
  },
  {
    name: "Birmingham Central Mosque",
    address: "180 Belgrave Middleway, Birmingham B12 0XS",
    website: "https://centralmosque.org.uk",
    timetable: "https://centralmosque.org.uk/timetable",
  },
  {
    name: "Green Lane Masjid & Community Centre",
    address: "20 Green Lane, Birmingham B9 5DB",
    website: "https://greenlanemasjid.org",
    timetable: "https://greenlanemasjid.org/prayer-timetable/",
  },
];

export function directionsUrl(address: string): string {
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`;
}
