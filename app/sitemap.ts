import { MetadataRoute } from "next";
import { events } from "@/data/events";
import { blogPosts } from "@/data/blog";

const BASE_URL = "https://astonisoc.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    { url: `${BASE_URL}/about`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE_URL}/start-here`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE_URL}/prayer-times`, changeFrequency: "daily", priority: 0.9 },
    { url: `${BASE_URL}/events`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE_URL}/freshers`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE_URL}/committee`, changeFrequency: "yearly", priority: 0.7 },
    { url: `${BASE_URL}/sisters`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE_URL}/brothers`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE_URL}/resources`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE_URL}/lectures`, changeFrequency: "weekly", priority: 0.7 },
    { url: `${BASE_URL}/charity`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE_URL}/donate`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE_URL}/join`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE_URL}/contact`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE_URL}/sponsors`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE_URL}/blog`, changeFrequency: "weekly", priority: 0.7 },
    { url: `${BASE_URL}/volunteer`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE_URL}/careers`, changeFrequency: "weekly", priority: 0.7 },
  ];

  const eventRoutes: MetadataRoute.Sitemap = events.map((e) => ({
    url: `${BASE_URL}/events/${e.id}`,
    lastModified: new Date(e.date),
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  const blogRoutes: MetadataRoute.Sitemap = blogPosts.map((p) => ({
    url: `${BASE_URL}/blog/${p.slug}`,
    lastModified: new Date(p.date),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...staticRoutes, ...eventRoutes, ...blogRoutes];
}
