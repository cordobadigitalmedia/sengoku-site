"use client"

import { ChevronDown, ChevronUp, GripVertical, Trash2 } from "lucide-react"

import { ImageUploadField } from "@/components/admin/image-upload-field"
import { VideoUploadField } from "@/components/admin/video-upload-field"
import { RichTextEditor } from "@/components/rich-text-editor"
import { getGalleryItemMediaType } from "@/lib/gallery-item"
import type {
  CardBlockItem,
  GalleryItem,
  GalleryMediaType,
  LinkItem,
  PageBlock,
} from "@/types/content"
import { BLOCK_TYPE_LABELS, blockSummary } from "@/lib/block-defaults"

type BlockEditorProps = {
  block: PageBlock
  index: number
  total: number
  expanded: boolean
  onToggle: () => void
  onChange: (block: PageBlock) => void
  onRemove: () => void
  onMoveUp: () => void
  onMoveDown: () => void
}

function LinkItemEditor({
  link,
  onChange,
  onRemove,
}: {
  link: LinkItem
  onChange: (link: LinkItem) => void
  onRemove: () => void
}) {
  return (
    <div className="flex flex-wrap items-center gap-2 rounded border p-2">
      <input
        type="text"
        placeholder="Label"
        value={link.label ?? ""}
        onChange={(e) => onChange({ ...link, label: e.target.value })}
        className="w-24 rounded border px-2 py-1 text-sm"
      />
      <input
        type="text"
        placeholder="URL"
        value={link.link ?? ""}
        onChange={(e) => onChange({ ...link, link: e.target.value })}
        className="min-w-[120px] flex-1 rounded border px-2 py-1 text-sm"
      />
      <select
        value={link.style ?? "simple"}
        onChange={(e) => onChange({ ...link, style: e.target.value as "simple" | "button" })}
        className="rounded border px-2 py-1 text-sm"
      >
        <option value="simple">Simple</option>
        <option value="button">Button</option>
      </select>
      {link.style === "button" && (
        <select
          value={link.buttonColor ?? "primary"}
          onChange={(e) => onChange({ ...link, buttonColor: e.target.value as "primary" | "secondary" })}
          className="rounded border px-2 py-1 text-sm"
        >
          <option value="primary">Primary</option>
          <option value="secondary">Secondary</option>
        </select>
      )}
      <button type="button" onClick={onRemove} className="text-red-600 hover:underline">
        Remove
      </button>
    </div>
  )
}

function PageContentEditor({
  block,
  onChange,
}: {
  block: Extract<PageBlock, { _template: "pageContent" }>
  onChange: (b: PageBlock) => void
}) {
  return (
    <div className="space-y-4">
      <div>
        <label className="mb-1 block text-sm font-medium">Content</label>
        <RichTextEditor
          content={block.content ?? ""}
          onChange={(content) => onChange({ ...block, content })}
        />
      </div>
      <div className="flex gap-4">
        <div>
          <label className="mb-1 block text-sm font-medium">Text align</label>
          <select
            value={block.textAlign ?? "left"}
            onChange={(e) => onChange({ ...block, textAlign: e.target.value as "left" | "center" | "right" })}
            className="rounded border px-3 py-2"
          >
            <option value="left">Left</option>
            <option value="center">Center</option>
            <option value="right">Right</option>
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Background</label>
          <input
            type="text"
            value={block.backgroundColor ?? ""}
            onChange={(e) => onChange({ ...block, backgroundColor: e.target.value || undefined })}
            placeholder="e.g. gray-100"
            className="rounded border px-3 py-2"
          />
        </div>
      </div>
    </div>
  )
}

function WelcomeHeroEditor({
  block,
  onChange,
}: {
  block: Extract<PageBlock, { _template: "welcomeHero" }>
  onChange: (b: PageBlock) => void
}) {
  return (
    <div className="space-y-4">
      <div>
        <label className="mb-1 block text-sm font-medium">Title</label>
        <input
          type="text"
          value={block.title ?? ""}
          onChange={(e) => onChange({ ...block, title: e.target.value })}
          className="w-full rounded border px-3 py-2"
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium">Message</label>
        <RichTextEditor
          content={block.message ?? ""}
          onChange={(message) => onChange({ ...block, message })}
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium">Background image</label>
        <ImageUploadField
          value={block.backgroundImage ?? ""}
          onChange={(backgroundImage) => onChange({ ...block, backgroundImage })}
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium">Background type</label>
        <select
          value={block.backgroundType ?? "color"}
          onChange={(e) => onChange({ ...block, backgroundType: e.target.value as "image" | "color" })}
          className="rounded border px-3 py-2"
        >
          <option value="color">Color</option>
          <option value="image">Image</option>
        </select>
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium">Background color</label>
        <input
          type="text"
          value={block.backgroundColor ?? "#ffffff"}
          onChange={(e) => onChange({ ...block, backgroundColor: e.target.value })}
          className="rounded border px-3 py-2"
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium">Links</label>
        {(block.links ?? []).map((link, i) => (
          <LinkItemEditor
            key={i}
            link={link}
            onChange={(updated) => {
              const links = [...(block.links ?? [])]
              links[i] = updated
              onChange({ ...block, links })
            }}
            onRemove={() => {
              const links = (block.links ?? []).filter((_, j) => j !== i)
              onChange({ ...block, links })
            }}
          />
        ))}
        <button
          type="button"
          onClick={() => onChange({ ...block, links: [...(block.links ?? []), { label: "", link: "", style: "simple" }] })}
          className="mt-2 text-sm text-gray-600 hover:underline"
        >
          + Add link
        </button>
      </div>
    </div>
  )
}

function CoverSectionEditor({
  block,
  onChange,
}: {
  block: Extract<PageBlock, { _template: "coverSection" }>
  onChange: (b: PageBlock) => void
}) {
  return (
    <div className="space-y-4">
      <div>
        <label className="mb-1 block text-sm font-medium">Headline</label>
        <input
          type="text"
          value={block.headline ?? ""}
          onChange={(e) => onChange({ ...block, headline: e.target.value })}
          className="w-full rounded border px-3 py-2"
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium">Background type</label>
        <select
          value={block.backgroundType ?? "image"}
          onChange={(e) => onChange({ ...block, backgroundType: e.target.value as "image" | "video" })}
          className="rounded border px-3 py-2"
        >
          <option value="image">Image</option>
          <option value="video">Video</option>
        </select>
      </div>
      <ImageUploadField
        label="Background image"
        value={block.backgroundImage ?? ""}
        onChange={(backgroundImage) => onChange({ ...block, backgroundImage })}
      />
      <VideoUploadField
        label="Background video"
        value={block.backgroundVideo ?? ""}
        onChange={(backgroundVideo) => onChange({ ...block, backgroundVideo: backgroundVideo || undefined })}
      />
    </div>
  )
}

function CardgridEditor({
  block,
  onChange,
}: {
  block: Extract<PageBlock, { _template: "cardgrid" }>
  onChange: (b: PageBlock) => void
}) {
  const cards = block.cardblock ?? []
  return (
    <div className="space-y-4">
      <div>
        <label className="mb-1 block text-sm font-medium">Grid title</label>
        <input
          type="text"
          value={block.gridTitle ?? ""}
          onChange={(e) => onChange({ ...block, gridTitle: e.target.value })}
          className="w-full rounded border px-3 py-2"
        />
      </div>
      {cards.map((card, i) => (
        <div key={i} className="rounded-lg border border-gray-200 bg-gray-50 p-4">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm font-medium">Card {i + 1}</span>
            <button
              type="button"
              onClick={() => onChange({ ...block, cardblock: cards.filter((_, j) => j !== i) })}
              className="text-sm text-red-600 hover:underline"
            >
              Remove card
            </button>
          </div>
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Headline"
              value={card.headline ?? ""}
              onChange={(e) => {
                const next = [...cards]
                next[i] = { ...card, headline: e.target.value }
                onChange({ ...block, cardblock: next })
              }}
              className="w-full rounded border px-3 py-2 text-sm"
            />
            <ImageUploadField
              label="Cover image"
              value={card.coverimage ?? ""}
              onChange={(coverimage) => {
                const next = [...cards]
                next[i] = { ...card, coverimage }
                onChange({ ...block, cardblock: next })
              }}
            />
            <div>
              <label className="mb-1 block text-sm font-medium">Content</label>
              <RichTextEditor
                content={card.content ?? ""}
                onChange={(content) => {
                  const next = [...cards]
                  next[i] = { ...card, content }
                  onChange({ ...block, cardblock: next })
                }}
              />
            </div>
          </div>
        </div>
      ))}
      <button
        type="button"
        onClick={() => onChange({ ...block, cardblock: [...cards, { headline: "", content: "" } as CardBlockItem] })}
        className="text-sm text-gray-600 hover:underline"
      >
        + Add card
      </button>
    </div>
  )
}

function updateGalleryItem(
  items: GalleryItem[],
  index: number,
  patch: GalleryItem
): GalleryItem[] {
  const next = [...items]
  next[index] = { ...items[index], ...patch }
  return next
}

function GalleryEditor({
  block,
  onChange,
}: {
  block: Extract<PageBlock, { _template: "gallery" }>
  onChange: (b: PageBlock) => void
}) {
  const items = block.galleryImages ?? []

  function setItems(galleryImages: GalleryItem[]) {
    onChange({ ...block, galleryImages })
  }

  function setMediaType(index: number, galleryMediaType: GalleryMediaType) {
    const item = items[index] ?? {}
    if (galleryMediaType === "video") {
      setItems(
        updateGalleryItem(items, index, {
          galleryMediaType: "video",
          galleryVideo: item.galleryVideo || item.galleryImage || "",
          galleryImage: "",
        })
      )
      return
    }
    setItems(
      updateGalleryItem(items, index, {
        galleryMediaType: "image",
        galleryImage: item.galleryImage || "",
        galleryVideo: "",
      })
    )
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="mb-1 block text-sm font-medium">Gallery title</label>
        <input
          type="text"
          value={block.galleryTitle ?? ""}
          onChange={(e) => onChange({ ...block, galleryTitle: e.target.value })}
          className="w-full rounded border px-3 py-2"
        />
      </div>
      {items.map((item, i) => {
        const mediaType = getGalleryItemMediaType(item)
        return (
          <div key={i} className="flex gap-4 rounded border p-3">
            <div className="min-w-0 flex-1 space-y-3">
              <div>
                <label className="mb-1 block text-sm font-medium">Type</label>
                <select
                  value={mediaType}
                  onChange={(e) =>
                    setMediaType(i, e.target.value as GalleryMediaType)
                  }
                  className="rounded border px-3 py-2"
                >
                  <option value="image">Image</option>
                  <option value="video">Video</option>
                </select>
              </div>
              {mediaType === "video" ? (
                <VideoUploadField
                  label="Video"
                  value={item.galleryVideo || item.galleryImage || ""}
                  onChange={(galleryVideo) => {
                    setItems(
                      updateGalleryItem(items, i, {
                        galleryVideo,
                        galleryImage: "",
                        galleryMediaType: "video",
                      })
                    )
                  }}
                />
              ) : (
                <ImageUploadField
                  label="Image"
                  value={item.galleryImage ?? ""}
                  onChange={(galleryImage) => {
                    setItems(
                      updateGalleryItem(items, i, {
                        galleryImage,
                        galleryVideo: "",
                        galleryMediaType: "image",
                      })
                    )
                  }}
                />
              )}
              <div>
                <label className="mb-1 block text-sm font-medium">Caption</label>
                <input
                  type="text"
                  value={item.caption ?? ""}
                  onChange={(e) => {
                    setItems(updateGalleryItem(items, i, { caption: e.target.value }))
                  }}
                  className="w-full rounded border px-3 py-2"
                />
              </div>
            </div>
            <button
              type="button"
              onClick={() => setItems(items.filter((_, j) => j !== i))}
              className="self-end text-sm text-red-600 hover:underline"
            >
              Remove
            </button>
          </div>
        )
      })}
      <div className="flex gap-4">
        <button
          type="button"
          onClick={() => setItems([...items, { galleryMediaType: "image" }])}
          className="text-sm text-gray-600 hover:underline"
        >
          + Add image
        </button>
        <button
          type="button"
          onClick={() => setItems([...items, { galleryMediaType: "video" }])}
          className="text-sm text-gray-600 hover:underline"
        >
          + Add video
        </button>
      </div>
    </div>
  )
}

export function BlockEditor({
  block,
  index,
  total,
  expanded,
  onToggle,
  onChange,
  onRemove,
  onMoveUp,
  onMoveDown,
}: BlockEditorProps) {
  const label = BLOCK_TYPE_LABELS[block._template]
  const summary = blockSummary(block)

  return (
    <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
      <div
        className="flex cursor-pointer items-center gap-2 px-4 py-3 hover:bg-gray-50"
        onClick={onToggle}
      >
        <GripVertical className="size-4 text-gray-400" />
        <span className="font-medium text-gray-800">{label}</span>
        <span className="truncate text-sm text-gray-500">— {summary}</span>
        <div className="ml-auto flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
          <button
            type="button"
            onClick={onMoveUp}
            disabled={index === 0}
            className="rounded p-1 hover:bg-gray-200 disabled:opacity-30"
            title="Move up"
          >
            <ChevronUp className="size-4" />
          </button>
          <button
            type="button"
            onClick={onMoveDown}
            disabled={index >= total - 1}
            className="rounded p-1 hover:bg-gray-200 disabled:opacity-30"
            title="Move down"
          >
            <ChevronDown className="size-4" />
          </button>
          <button
            type="button"
            onClick={onRemove}
            className="rounded p-1 text-red-600 hover:bg-red-50"
            title="Remove block"
          >
            <Trash2 className="size-4" />
          </button>
          <span
            className={`ml-2 transition ${expanded ? "rotate-180" : ""}`}
          >
            <ChevronDown className="size-4 text-gray-500" />
          </span>
        </div>
      </div>
      {expanded && (
        <div className="border-t border-gray-200 px-4 py-4">
          {block._template === "pageContent" && (
            <PageContentEditor block={block} onChange={onChange} />
          )}
          {block._template === "welcomeHero" && (
            <WelcomeHeroEditor block={block} onChange={onChange} />
          )}
          {block._template === "coverSection" && (
            <CoverSectionEditor block={block} onChange={onChange} />
          )}
          {block._template === "cardgrid" && (
            <CardgridEditor block={block} onChange={onChange} />
          )}
          {block._template === "gallery" && (
            <GalleryEditor block={block} onChange={onChange} />
          )}
          {block._template === "featuredPosts" && (
            <p className="text-sm text-gray-500">Blog has been removed. You can remove this block.</p>
          )}
        </div>
      )}
    </div>
  )
}
