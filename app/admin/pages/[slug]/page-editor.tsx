"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ChevronDown, ChevronRight } from "lucide-react"

import { updatePage } from "@/app/admin/actions"
import { BlockList } from "@/components/admin/block-list"
import type { Page, PageBlock } from "@/types/content"

export function PageEditor({ page }: { page: Page }) {
  const router = useRouter()
  const [title, setTitle] = useState(page.title)
  const [seoTitle, setSeoTitle] = useState(page.seo?.title ?? "")
  const [seoDescription, setSeoDescription] = useState(page.seo?.description ?? "")
  const [seoKeywords, setSeoKeywords] = useState(page.seo?.keywords ?? "")
  const [blocks, setBlocks] = useState<PageBlock[]>(page.blocks ?? [])
  const [seoOpen, setSeoOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [saved, setSaved] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setSaved(false)
    setSaving(true)
    try {
      await updatePage(page.slug, {
        title,
        seo: {
          title: seoTitle || undefined,
          description: seoDescription || undefined,
          keywords: seoKeywords || undefined,
        },
        blocks,
      })
      setSaved(true)
      router.refresh()
      setTimeout(() => setSaved(false), 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save")
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 rounded-lg border bg-white p-6 shadow-sm">
      {error && (
        <div className="rounded bg-red-50 px-3 py-2 text-sm text-red-800">{error}</div>
      )}
      {saved && (
        <div className="rounded bg-green-50 px-3 py-2 text-sm text-green-800">
          Page saved successfully.
        </div>
      )}
      <div>
        <label className="mb-1 block text-sm font-medium">Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full rounded border px-3 py-2"
        />
      </div>

      <div className="rounded-lg border border-gray-200">
        <button
          type="button"
          onClick={() => setSeoOpen((o) => !o)}
          className="flex w-full items-center gap-2 px-4 py-3 text-left text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          {seoOpen ? (
            <ChevronDown className="size-4 shrink-0 text-gray-500" />
          ) : (
            <ChevronRight className="size-4 shrink-0 text-gray-500" />
          )}
          <span>SEO (optional)</span>
          {(seoTitle || seoDescription || seoKeywords) && (
            <span className="text-gray-400">— has content</span>
          )}
        </button>
        {seoOpen && (
          <div className="space-y-4 border-t border-gray-200 px-4 pb-4 pt-3">
            <div>
              <label className="mb-1 block text-sm font-medium">SEO title</label>
              <input
                type="text"
                value={seoTitle}
                onChange={(e) => setSeoTitle(e.target.value)}
                placeholder="Override for meta title (defaults to page title)"
                className="w-full rounded border px-3 py-2"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">SEO description</label>
              <input
                type="text"
                value={seoDescription}
                onChange={(e) => setSeoDescription(e.target.value)}
                placeholder="Meta description"
                className="w-full rounded border px-3 py-2"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">SEO keywords</label>
              <input
                type="text"
                value={seoKeywords}
                onChange={(e) => setSeoKeywords(e.target.value)}
                placeholder="Comma-separated keywords"
                className="w-full rounded border px-3 py-2"
              />
            </div>
          </div>
        )}
      </div>

      <BlockList blocks={blocks} onChange={setBlocks} />
      <button
        type="submit"
        disabled={saving}
        className="rounded bg-gray-800 px-4 py-2 text-white hover:bg-gray-700 disabled:opacity-50"
      >
        {saving ? "Saving…" : "Save"}
      </button>
    </form>
  )
}
