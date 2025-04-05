import React from "react"
import type { Metadata } from "next"
import client from "@/tina/__generated__/client"

import { PageComponent } from "@/components/app/page"

export default async function Page({
  params,
}: {
  params: Promise<{ filename: string[] }>
}) {
  const result = await client.queries.pageAndNav({
    relativePath: `${(await params).filename}.mdx`,
  })
  return <PageComponent {...result} />
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ filename: string[] }>
}): Promise<Metadata> {
  const slug = (await params).filename
  const result = await client.queries.pageAndNav({
    relativePath: `${slug}.mdx`,
  })
  const headerQuery = await client.queries.headerConnection()
  const headerData = headerQuery.data.headerConnection.edges
    ? headerQuery.data.headerConnection.edges[0]?.node
    : undefined
  const title = result.data.page.title
  const description = result.data.page.seo?.description
  return {
    title: title,
    description: description,
    openGraph: {
      title: title as string,
      siteName: headerData?.siteTitle as string,
      description: description as string,
      url: `https://sengoku.ca/${slug}`,
    },
    twitter: {
      title: title as string,
      description: description as string,
    },
  }
}

export async function generateStaticParams() {
  const pages = await client.queries.pageConnection()
  const paths = pages.data?.pageConnection.edges?.map((edge) => ({
    filename: edge?.node?._sys.breadcrumbs,
  }))

  return paths || []
}
