import { MetadataRoute } from "next";
import { events } from "@/data/events";

const BASE = "https://astonisoc.com";

export default function sitemap(): MetadataRoute.Sitemap {
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
    { url: `${BASE}/resources`,                                     changeFrequency: "monthly",  priority: 0.7 },
    { url: `${BASE}/lectures`,                                      changeFrequency: "monthly",  priority: 0.7 },
    { url: `${BASE}/charity`,                                       changeFrequency: "weekly",   priority: 0.8 },
    { url: `${BASE}/donate`,                                        changeFrequency: "weekly",   priority: 0.9 },
    { url: `${BASE}/join`,                                          changeFrequency: "monthly",  priority: 0.9 },
    { url: `${BASE}/contact`,                                       changeFrequency: "monthly",  priority: 0.7 },
    { url: `${BASE}/sponsors`,                                      changeFrequency: "monthly",  priority: 0.6 },
    { url: `${BASE}/careers`,                                       changeFrequency: "weekly",   priority: 0.7 },
  ];

  const eventRoutes: MetadataRoute.Sitemap = events.map((e) => ({
    url: `${BASE}/events/${e.id}`,
    lastModified: new Date(e.date),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  return [...staticRoutes, ...eventRoutes];
}
