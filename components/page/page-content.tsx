import { PageBlocksPageContent } from "@/tina/__generated__/types"
import { tinaField } from "tinacms/dist/react"
import { TinaMarkdown } from "tinacms/dist/rich-text"

export function PageContent(props: PageBlocksPageContent) {
  let bgStyle = ""
  if (props.backgroundColor) {
    bgStyle = `bg-${props.backgroundColor}`
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
