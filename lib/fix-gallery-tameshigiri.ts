import { isVideoUrl } from "@/lib/is-video-url"
import { neon } from "@neondatabase/serverless"
import type { GalleryItem } from "@/types/content"

const TAMESHIGIRI_VIDEO =
  "https://0nt7gisybdk4bmcr.public.blob.vercel-storage.com/dougtameshigiri-pNJLu9WwACymGUfcGy3X0RS4rNmMGz.mp4"
const TAMESHIGIRI_CAPTION = "Shodan performing tameshigiri"

type PageBlock = Record<string, unknown> & { _template?: string }

function isTameshigiriCoverSection(block: PageBlock): boolean {
  return (
    block._template === "coverSection" &&
    (block.headline === TAMESHIGIRI_CAPTION ||
      block.backgroundVideo === TAMESHIGIRI_VIDEO)
  )
}

function toTypedGalleryItem(item: GalleryItem): GalleryItem | null {
  const caption = item.caption?.trim() ? item.caption : undefined
  const videoFromFields =
    item.galleryVideo?.trim() ||
    (isVideoUrl(item.galleryImage ?? "") ? item.galleryImage!.trim() : "")
  const treatAsVideo =
    item.galleryMediaType === "video" ||
    Boolean(videoFromFields) ||
    caption === TAMESHIGIRI_CAPTION

  if (treatAsVideo) {
    const galleryVideo =
      videoFromFields || (caption === TAMESHIGIRI_CAPTION ? TAMESHIGIRI_VIDEO : "")
    if (!galleryVideo) return null
    return {
      ...(caption ? { caption } : {}),
      galleryMediaType: "video",
      galleryVideo,
      // Keep galleryImage so the current production renderer still finds the file
      // until this branch is deployed. New renderer uses galleryVideo + type.
      galleryImage: galleryVideo,
    }
  }

  const galleryImage = item.galleryImage?.trim()
  if (!galleryImage) return null
  return {
    ...(caption ? { caption } : {}),
    galleryMediaType: "image",
    galleryImage,
  }
}

function hasTameshigiriVideo(items: GalleryItem[]): boolean {
  return items.some(
    (item) =>
      item.galleryMediaType === "video" &&
      (item.galleryVideo === TAMESHIGIRI_VIDEO || item.caption === TAMESHIGIRI_CAPTION)
  )
}

export function fixGalleryBlocks(blocks: PageBlock[]): PageBlock[] {
  const result: PageBlock[] = []
  let mergedGallery: PageBlock | null = null

  for (const block of blocks) {
    if (isTameshigiriCoverSection(block)) {
      continue
    }

    if (block._template !== "gallery") {
      result.push(block)
      continue
    }

    const typedItems = ((block.galleryImages as GalleryItem[] | undefined) ?? [])
      .map(toTypedGalleryItem)
      .filter((item): item is GalleryItem => item != null)

    if (!mergedGallery) {
      mergedGallery = {
        _template: "gallery",
        galleryTitle: (typeof block.galleryTitle === "string" && block.galleryTitle) || "Dojo Gallery",
        galleryImages: typedItems,
      }
      result.push(mergedGallery)
    } else {
      mergedGallery.galleryImages = [
        ...((mergedGallery.galleryImages as GalleryItem[]) ?? []),
        ...typedItems,
      ]
    }
  }

  if (!mergedGallery) {
    mergedGallery = {
      _template: "gallery",
      galleryTitle: "Dojo Gallery",
      galleryImages: [],
    }
    result.push(mergedGallery)
  }

  const galleryImages = [...((mergedGallery.galleryImages as GalleryItem[]) ?? [])]
  if (!hasTameshigiriVideo(galleryImages)) {
    galleryImages.push({
      caption: TAMESHIGIRI_CAPTION,
      galleryMediaType: "video",
      galleryVideo: TAMESHIGIRI_VIDEO,
      galleryImage: TAMESHIGIRI_VIDEO,
    })
  }
  mergedGallery.galleryImages = galleryImages
  return result
}

export async function fixGalleryTameshigiriPage(): Promise<{
  removedCoverSections: number
  galleryBlockCount: number
  videoPresentInGallery: boolean
}> {
  const databaseUrl = process.env.DATABASE_URL
  if (!databaseUrl) {
    throw new Error("DATABASE_URL is required")
  }

  const sql = neon(databaseUrl)
  const rows = await sql`SELECT blocks FROM pages WHERE slug = 'gallery' LIMIT 1`
  if (!rows[0]) {
    throw new Error("Gallery page not found")
  }

  const blocks = rows[0].blocks as PageBlock[]
  const coverCount = blocks.filter(isTameshigiriCoverSection).length
  const updated = fixGalleryBlocks(blocks)
  const galleryBlockCount = updated.filter((block) => block._template === "gallery").length
  const videoPresentInGallery = updated.some(
    (block) =>
      block._template === "gallery" &&
      Array.isArray(block.galleryImages) &&
      hasTameshigiriVideo(block.galleryImages as GalleryItem[])
  )

  await sql`
    UPDATE pages
    SET blocks = ${JSON.stringify(updated)}
    WHERE slug = 'gallery'
  `

  return {
    removedCoverSections: coverCount,
    galleryBlockCount,
    videoPresentInGallery,
  }
}
