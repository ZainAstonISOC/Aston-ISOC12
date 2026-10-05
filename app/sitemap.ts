import { MetadataRoute } from "next";
import { getUpcomingEvents } from "@/lib/events";
import { SITE_URL } from "@/lib/site";

const BASE = SITE_URL;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE,                          lastModified: new Date(), changeFrequency: "daily",   priority: 1 },
    { url: `${BASE}/about`,                                         changeFrequency: "monthly",  priority: 0.8 },
    { url: `${BASE}/start-here`,                                    changeFrequency: "monthly",  priority: 0.9 },
    { url: `${BASE}/prayer-times`,                                  changeFrequency: "daily",    priority: 0.9 },
    { url: `${BASE}/events`,                                        changeFrequency: "weekly",   priority: 0.9 },
    { url: `${BASE}/freshers`,                                      changeFrequency: "monthly",  priority: 0.9 },
    { url: `${BASE}/committee`,                                     changeFrequency: "yearly",   priority: 0.7 },
    { url: `${BASE}/sisters`,                                       changeFrequency: "weekly",   priority: 0.8 },
    { url: `${BASE}/brothers`,                                      changeFrequency: "weekly",   priority: 0.8 },
    { url: `${BASE}/volunteer`,                                     changeFrequency: "monthly",  priority: 0.8 },
    { url: `${BASE}/quran`,                                         changeFrequency: "monthly",  priority: 0.8 },
    { url: `${BASE}/ayah`,                                          changeFrequency: "daily",    priority: 0.8 },
    { url: `${BASE}/resources`,                                     changeFrequency: "monthly",  priority: 0.7 },
    { url: `${BASE}/lectures`,                                      changeFrequency: "monthly",  priority: 0.7 },
    { url: `${BASE}/charity`,                                       changeFrequency: "weekly",   priority: 0.8 },
    { url: `${BASE}/donate`,                                        changeFrequency: "weekly",   priority: 0.9 },
    { url: `${BASE}/join`,                                          changeFrequency: "monthly",  priority: 0.9 },
    { url: `${BASE}/feedback`,                                      changeFrequency: "monthly",  priority: 0.6 },
    { url: `${BASE}/contact`,                                       changeFrequency: "monthly",  priority: 0.7 },
    { url: `${BASE}/sponsors`,                                      changeFrequency: "monthly",  priority: 0.6 },
    { url: `${BASE}/careers`,                                       changeFrequency: "weekly",   priority: 0.7 },
    { url: `${BASE}/zakat`,                                         changeFrequency: "monthly",  priority: 0.7 },
    { url: `${BASE}/privacy`,                                       changeFrequency: "yearly",   priority: 0.3 },
    { url: `${BASE}/data-policy`,                                   changeFrequency: "yearly",   priority: 0.3 },
  ];

  const eventRoutes: MetadataRoute.Sitemap = (await getUpcomingEvents()).map((e) => ({
    url: `${BASE}/events/${e.id}`,
    lastModified: new Date(e.date),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  // One entry per surah; the per-ayah pages are reachable from them.
  const surahRoutes: MetadataRoute.Sitemap = Array.from({ length: 114 }, (_, i) => ({
    url: `${BASE}/quran/${i + 1}`,
    changeFrequency: "yearly" as const,
    priority: 0.5,
  }));

  return [...staticRoutes, ...eventRoutes, ...surahRoutes];
}
