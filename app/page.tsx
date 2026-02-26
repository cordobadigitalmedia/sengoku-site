import type { Metadata } from "next"

import { PageComponent } from "@/components/app/page"
import { getFooter, getHeader, getNav } from "@/lib/content/globals"
import { getPageBySlug } from "@/lib/content/pages"

/** ISR: revalidate home page every hour (on-demand revalidation via revalidatePath in admin) */
export const revalidate = 3600

export async function generateMetadata(): Promise<Metadata> {
  const [page, header] = await Promise.all([
    getPageBySlug("home"),
    getHeader(),
  ])
  const metaTitle = page?.seo?.title ?? page?.title ?? header?.siteTitle ?? ""
  const metaDescription = page?.seo?.description ?? header?.siteDescription
  const metaKeywords = page?.seo?.keywords
  return {
    title: metaTitle,
    ...(metaDescription && { description: metaDescription }),
    ...(metaKeywords && { keywords: metaKeywords }),
    openGraph: {
      title: metaTitle,
      siteName: header?.siteTitle,
      ...(metaDescription && { description: metaDescription }),
      url: "https://sengoku.ca",
    },
    twitter: {
      title: metaTitle,
      ...(metaDescription && { description: metaDescription }),
    },
  }
}

export default async function Page() {
  const [page, nav, header, footer] = await Promise.all([
    getPageBySlug("home"),
    getNav(),
    getHeader(),
    getFooter(),
  ])
  if (!page) return null
  return await PageComponent({ page, nav, header, footer })
}
