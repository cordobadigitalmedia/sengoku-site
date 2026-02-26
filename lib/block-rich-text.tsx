import sanitizeHtml from "sanitize-html"

import { MdxContent } from "@/components/mdx-content"

function isHtml(source: string): boolean {
  const t = source.trim()
  return t.startsWith("<") && (t.includes("</") || t.endsWith("/>"))
}

const sanitizeOptions: sanitizeHtml.IOptions = {
  allowedTags: [
    "p", "br", "strong", "em", "u", "s", "a", "ul", "ol", "li",
    "h1", "h2", "h3", "h4", "blockquote", "img", "hr",
  ],
  allowedAttributes: {
    a: ["href", "target", "rel"],
    img: ["src", "alt", "width", "height"],
  },
  allowedSchemes: ["https", "http", "mailto"],
}

/** Renders block content/message as HTML (WYSIWYG) or MDX. Used by render-page-blocks. */
export async function renderBlockRichText(
  source: string,
  className = "prose max-w-none"
): Promise<React.ReactNode> {
  if (!source?.trim()) return null
  if (isHtml(source)) {
    const clean = sanitizeHtml(source, sanitizeOptions)
    return (
      <div
        className={className}
        dangerouslySetInnerHTML={{ __html: clean }}
      />
    )
  }
  return await MdxContent({ source })
}
