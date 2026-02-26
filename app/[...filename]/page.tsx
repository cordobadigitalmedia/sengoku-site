import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { PageComponent } from "@/components/app/page"
import { getFooter, getHeader, getNav } from "@/lib/content/globals"
import { getPageBySlug, getAllPageSlugs } from "@/lib/content/pages"

/** ISR: revalidate static pages every hour (on-demand revalidation via revalidatePath in admin) */
export const revalidate = 3600

export default async function Page({
  params,
}: {
  params: Promise<{ filename: string[] }>
}) {
  const slug = (await params).filename.join("/")
  const [page, nav, header, footer] = await Promise.all([
    getPageBySlug(slug),
    getNav(),
    getHeader(),
    getFooter(),
  ])
  if (!page) notFound()
  return await PageComponent({ page, nav, header, footer })
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ filename: string[] }>
}): Promise<Metadata> {
  const slug = (await params).filename.join("/")
  const [page, header] = await Promise.all([
    getPageBySlug(slug),
    getHeader(),
  ])
  if (!page)
    return { title: "Page Not Found" }
  const metaTitle = page.seo?.title ?? page.title
  const metaDescription = page.seo?.description
  const metaKeywords = page.seo?.keywords
  return {
    title: metaTitle,
    ...(metaDescription && { description: metaDescription }),
    ...(metaKeywords && { keywords: metaKeywords }),
    openGraph: {
      title: metaTitle,
      siteName: header?.siteTitle,
      ...(metaDescription && { description: metaDescription }),
      url: `https://sengoku.ca/${slug}`,
    },
    twitter: {
      title: metaTitle,
      ...(metaDescription && { description: metaDescription }),
    },
  }
}

export async function generateStaticParams() {
  const slugs = await getAllPageSlugs()
  return slugs.map((slug) => ({ filename: slug.split("/") }))
}
