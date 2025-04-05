import type { MetadataRoute } from "next"
import client from "@/tina/__generated__/client"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const pages = await client.queries.pageConnection()
  const page_links = pages.data?.pageConnection.edges?.map((edge) => ({
    url: `https://sengoku.ca/${edge?.node?._sys.breadcrumbs}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.9,
  })) as MetadataRoute.Sitemap
  return [
    {
      url: "https://sengoku.ca",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    ...page_links,
  ]
}
