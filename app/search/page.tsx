import type { Metadata } from "next";
import PageShell from "@/components/layout/PageShell";
import Breadcrumb from "@/components/ui/Breadcrumb";
import { PageHeader } from "@/components/ui/Cards";
import SiteSearch, { type SearchEntry } from "@/components/ui/SiteSearch";
import { navItems, footerLinks } from "@/lib/nav";
import { resources } from "@/data/resources";
import { lectures } from "@/data/lectures";
import { getUpcomingEvents } from "@/lib/events";
import { getCommittee, getHalalPlaces } from "@/lib/content";
import { listChapters } from "@/lib/quran/reader";

export const metadata: Metadata = { title: "Search", description: "Search Aston ISOC: pages, events, resources, lectures and surahs." };
export const revalidate = 3600;

/** Extra words people search for that a page's title doesn't contain. */
const PAGE_KEYWORDS: Record<string, string> = {
  "/prayer-times": "salah namaz prayer room masjid mosque jamaat fajr dhuhr asr maghrib isha jummah jumuah friday",
  "/join": "membership member sign up £5 su",
  "/zakat": "nisab calculate wealth",
  "/donate": "give sadaqah charity money",
  "/events": "calendar whats on",
  "/freshers": "new student welcome",
  "/halal-food": "eat restaurant takeaway food",
  "/feedback": "complaint suggestion anonymous tellsafe",
  "/careers": "jobs internship placement graduate",
  "/ayah": "verse daily quran",
};

/**
 * Built on the server once an hour and searched in the browser. No search
 * service, nothing sent anywhere: the whole index is a few kilobytes.
 */
export default async function SearchPage() {
  const pages = new Map<string, SearchEntry>();
  const addPage = (label: string, href: string) => {
    if (href.startsWith("http") || pages.has(href)) return;
    pages.set(href, { title: label, href, kind: "Page", text: PAGE_KEYWORDS[href] ?? "" });
  };
  for (const item of navItems) {
    addPage(item.label, item.href);
    item.children?.forEach(c => addPage(c.label, c.href));
  }
  Object.values(footerLinks).flat().forEach(l => addPage(l.label, l.href));

  const [events, committee, halal, chapters] = await Promise.all([
    getUpcomingEvents(),
    getCommittee(),
    getHalalPlaces(),
    listChapters().catch(() => []),
  ]);

  const entries: SearchEntry[] = [
    ...pages.values(),
    ...events.map(e => ({ title: e.title, href: `/events/${e.id}`, kind: "Event", text: `${e.location} ${e.description}` })),
    ...resources.map(r => ({ title: r.title, href: r.url, kind: "Resource", text: `${r.description} ${r.category}`, external: r.url.startsWith("http") })),
    ...lectures.map(l => ({ title: l.title, href: "/lectures", kind: "Lecture", text: `${l.speaker} ${l.series} ${l.description}` })),
    ...committee.map(m => ({ title: m.name, href: "/committee", kind: "Committee", text: m.role })),
    ...halal.map(h => ({ title: h.name, href: "/halal-food", kind: "Halal food", text: `${h.kind} ${h.area}` })),
    ...chapters.map(c => ({ title: `Surah ${c.name_simple}`, href: `/quran/${c.id}`, kind: "Qur'an", text: `${c.translated_name.name} ${c.id}` })),
  ];

  return (
    <PageShell>
      <Breadcrumb crumbs={[{ label: "Search" }]} />
      <PageHeader label="Find it" title="Search" subtitle="Pages, events, resources, lectures, the committee and every surah." />
      <SiteSearch entries={entries} />
    </PageShell>
  );
}
