import type { BlockPageContent } from "@/types/content"

import { MdxContent } from "@/components/mdx-content"

export async function PageContent(props: BlockPageContent) {
  let bgStyle = ""
  if (props.backgroundColor) {
    bgStyle = `bg-${props.backgroundColor}`
  }
  let textAlign = "text-left"
  if (props.textAlign) {
    textAlign = `text-${props.textAlign}`
  }
  return (
    <section className={`w-full px-4 py-8 ${bgStyle} ${textAlign}`}>
      <div className="container mx-auto">
        <div className="prose max-w-none">
          {props.content ? await MdxContent({ source: props.content }) : null}
        </div>
      </div>
    </section>
  )
}
