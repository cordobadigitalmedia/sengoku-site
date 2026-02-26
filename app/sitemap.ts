import type { MetadataRoute } from "next"

import { getAllPageSlugs } from "@/lib/content/pages"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const pageSlugs = await getAllPageSlugs()
  const pageLinks: MetadataRoute.Sitemap = pageSlugs.map((slug) => ({
    url: `https://sengoku.ca/${slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: slug === "home" ? 1 : 0.9,
  }))
  return [
    {
      url: "https://sengoku.ca",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    ...pageLinks.filter((p) => p.url !== "https://sengoku.ca/home"),
  ]
}
