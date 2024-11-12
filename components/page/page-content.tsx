import { PageBlocksPageContent } from "@/tina/__generated__/types"
import { tinaField } from "tinacms/dist/react"
import { TinaMarkdown } from "tinacms/dist/rich-text"

export function PageContent(props: PageBlocksPageContent) {
  let bgStyle = "bg-primary"
  if (props.backgroundColor === "secondary") {
    bgStyle = "bg-secondary"
  }
  if (props.backgroundColor === "muted") {
    bgStyle = "bg-muted"
  }
  return (
    <section className={`w-full px-4 py-8 ${bgStyle}`}>
      <div className="container mx-auto">
        <div
          className="prose max-w-none"
          data-tina-field={tinaField(props, "content")}
        >
          <TinaMarkdown content={props.content} />
        </div>
      </div>
    </section>
  )
}
