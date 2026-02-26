import { Footer } from "@/components/footer"
import { renderPageBlock } from "@/components/render-page-blocks"
import { SiteHeader } from "@/components/site-header"
import type { Header, Nav, Page as PageType, Footer as FooterType } from "@/types/content"

import { ArticleJsonLd, BusinessJsonLd } from "../json-ld"

export async function PageComponent(props: {
  page: PageType
  nav: Nav
  header: Header
  footer: FooterType
}) {
  const { page, nav, header, footer } = props
  const filename = page._sys?.filename ?? page.slug
  const blocks = await Promise.all(
    (page.blocks ?? []).map((block, i) => renderPageBlock(block, i))
  )
  return (
    <>
      <SiteHeader nav={nav} header={header} />
      <div className="flex min-h-[calc(100vh-65px)] flex-col">
        <div className="grow">
          {blocks}
        </div>
        <Footer footer={footer} />
      </div>
      <ArticleJsonLd
        title={page.title}
        description={page.seo?.description ?? ""}
        imageUrl="https://sengoku.ca/images/logo.png"
        articleSection="Martial Arts"
        keywords={page.seo?.keywords ?? ""}
        url={`https://sengoku.ca/${filename}`}
      />
      {(filename === "location" || filename === "home" || filename === "contact") && (
        <BusinessJsonLd />
      )}
    </>
  )
}
