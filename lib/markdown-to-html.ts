import { marked } from "marked"
import sanitizeHtml from "sanitize-html"

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

/** Convert Markdown to sanitized HTML. Safe to use for editor content. */
export function markdownToHtml(md: string): string {
  if (!md?.trim()) return ""
  const raw = marked.parse(md) as string
  return sanitizeHtml(raw ?? "", sanitizeOptions)
}

/** True if content looks like HTML (starts with a tag), so we don't treat it as Markdown. */
export function isHtml(source: string): boolean {
  const t = source.trim()
  return t.startsWith("<") && (t.includes("</") || t.endsWith("/>"))
}

/** Normalize block content: if Markdown, convert to HTML; otherwise return as-is (assumed HTML). */
export function normalizeRichTextContent(content: string): string {
  if (!content?.trim()) return ""
  return isHtml(content) ? content : markdownToHtml(content)
}
