import { PageBlocksPageContent } from "@/tina/__generated__/types"
import { tinaField } from "tinacms/dist/react"
import { TinaMarkdown } from "tinacms/dist/rich-text"

export function PageContent(props: PageBlocksPageContent) {
  return (
    <section className="container mx-auto px-4 py-8">
      <div className="prose" data-tina-field={tinaField(props, "content")}>
        <TinaMarkdown content={props.content} />
      </div>
    </section>
  )
}
