"use client"

import { upload } from "@vercel/blob/client"
import { useEditor, EditorContent, type Editor } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Image from "@tiptap/extension-image"
import Link from "@tiptap/extension-link"
import { Extension } from "@tiptap/core"
import { Plugin } from "@tiptap/pm/state"
import { useCallback, useMemo, useRef } from "react"

import { isHtml, markdownToHtml, normalizeRichTextContent } from "@/lib/markdown-to-html"

type RichTextEditorProps = {
  content: string
  onChange: (html: string) => void
  placeholder?: string
  className?: string
}

function Toolbar({
  editor,
  inputRef,
}: {
  editor: Editor | null
  inputRef: React.RefObject<HTMLInputElement | null>
}) {
  const handleImageUpload = useCallback(() => {
    inputRef.current?.click()
  }, [inputRef])

  const onFileChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (!file || !editor) return
      e.target.value = ""
      try {
        const blob = await upload(file.name, file, {
          access: "public",
          handleUploadUrl: "/api/blob-upload",
        })
        editor.chain().focus().setImage({ src: blob.url }).run()
      } catch (err) {
        console.error(err)
      }
    },
    [editor]
  )

  if (!editor) return null

  return (
    <div className="flex flex-wrap items-center gap-1 border-b border-gray-200 bg-gray-50 p-2">
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={`rounded px-2 py-1 text-sm font-medium ${editor.isActive("bold") ? "bg-gray-200" : "hover:bg-gray-100"}`}
      >
        Bold
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={`rounded px-2 py-1 text-sm ${editor.isActive("italic") ? "bg-gray-200" : "hover:bg-gray-100"}`}
      >
        Italic
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={`rounded px-2 py-1 text-sm ${editor.isActive("bulletList") ? "bg-gray-200" : "hover:bg-gray-100"}`}
      >
        List
      </button>
      <button
        type="button"
        onClick={() => {
          const url = window.prompt("URL")
          if (url) editor.chain().focus().setLink({ href: url }).run()
        }}
        className={`rounded px-2 py-1 text-sm ${editor.isActive("link") ? "bg-gray-200" : "hover:bg-gray-100"}`}
      >
        Link
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={onFileChange}
      />
      <button
        type="button"
        onClick={handleImageUpload}
        className="rounded px-2 py-1 text-sm hover:bg-gray-100"
      >
        Upload image
      </button>
    </div>
  )
}

/** TipTap extension: paste Markdown → convert to HTML and insert. */
const MarkdownPaste = Extension.create({
  name: "markdownPaste",
  addProseMirrorPlugins() {
    const editor = this.editor
    return [
      new Plugin({
        props: {
          handlePaste: (view, event) => {
            const text = event.clipboardData?.getData("text/plain")
            if (!text?.trim() || isHtml(text)) return false
            const looksLikeMarkdown =
              /^#+\s/m.test(text) ||
              /^\s*[-*]\s/m.test(text) ||
              /\[[^\]]+\]\([^)]+\)/.test(text) ||
              /^\s*\d+\.\s/m.test(text)
            if (!looksLikeMarkdown) return false
            const html = markdownToHtml(text)
            editor.commands.insertContent(html)
            return true
          },
        },
      }),
    ]
  },
})

export function RichTextEditor({
  content,
  onChange,
  className = "",
}: RichTextEditorProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const initialContent = useMemo(() => normalizeRichTextContent(content), [content])
  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({ inline: false, allowBase64: false }),
      Link.configure({ openOnClick: false }),
      MarkdownPaste,
    ],
    content: initialContent,
    editorProps: {
      attributes: {
        class:
          "min-h-[200px] w-full px-3 py-2 prose prose-sm max-w-none focus:outline-none",
      },
    },
    onUpdate: ({ editor: ed }) => {
      onChange(ed.getHTML())
    },
  })

  return (
    <div
      className={`overflow-hidden rounded border border-gray-300 bg-white ${className}`}
    >
      <Toolbar editor={editor} inputRef={inputRef} />
      <EditorContent editor={editor} />
    </div>
  )
}
