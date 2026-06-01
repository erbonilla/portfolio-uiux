import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/siteUrl";
import { caseStudies } from "@/content/caseStudies";

/** XML sitemap (App Router). Static routes + one entry per case-study summary. */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes = ["", "/resume", "/resume/es"].map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: path === "" ? 1 : 0.7,
  }));

  const workRoutes = caseStudies.map((study) => ({
    url: `${SITE_URL}${study.href}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  return [...staticRoutes, ...workRoutes];
}
