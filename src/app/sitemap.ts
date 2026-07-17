import type { MetadataRoute } from "next";
import { projects } from "@/data/portfolio";

const SITE_URL = "https://saathvik-visuals.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const projectEntries: MetadataRoute.Sitemap = projects.map((project) => ({
    url: `${SITE_URL}/work/${project.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.8
  }));

  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1
    },
    ...projectEntries
  ];
}
