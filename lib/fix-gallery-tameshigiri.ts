import { neon } from "@neondatabase/serverless"

const TAMESHIGIRI_VIDEO =
  "https://0nt7gisybdk4bmcr.public.blob.vercel-storage.com/dougtameshigiri-pNJLu9WwACymGUfcGy3X0RS4rNmMGz.mp4"
const TAMESHIGIRI_CAPTION = "Shodan performing tameshigiri"

type GalleryItem = {
  caption?: string
  galleryImage?: string
  galleryMediaType?: "image" | "video"
}
type PageBlock = Record<string, unknown> & { _template?: string }

function isTameshigiriCoverSection(block: PageBlock): boolean {
  return (
    block._template === "coverSection" &&
    (block.headline === TAMESHIGIRI_CAPTION ||
      block.backgroundVideo === TAMESHIGIRI_VIDEO)
  )
}

export function fixGalleryBlocks(blocks: PageBlock[]): PageBlock[] {
  const hasVideoInGallery = blocks.some(
    (block) =>
      block._template === "gallery" &&
      Array.isArray(block.galleryImages) &&
      (block.galleryImages as GalleryItem[]).some(
        (item) => item.galleryImage === TAMESHIGIRI_VIDEO
      )
  )

  const withoutCover = blocks.filter((block) => !isTameshigiriCoverSection(block))

  if (hasVideoInGallery) {
    return withoutCover
  }

  const galleryIndexes = withoutCover
    .map((block, index) => (block._template === "gallery" ? index : -1))
    .filter((index) => index >= 0)

  if (galleryIndexes.length === 0) {
    withoutCover.push({
      _template: "gallery",
      galleryTitle: "Dojo Gallery",
      galleryImages: [
        {
          caption: TAMESHIGIRI_CAPTION,
          galleryImage: TAMESHIGIRI_VIDEO,
          galleryMediaType: "video",
        },
      ],
    })
    return withoutCover
  }

  const targetIndex = galleryIndexes[galleryIndexes.length - 1]!
  const target = { ...withoutCover[targetIndex]! }
  const galleryImages = [
    ...((target.galleryImages as GalleryItem[] | undefined) ?? []),
    {
      caption: TAMESHIGIRI_CAPTION,
      galleryImage: TAMESHIGIRI_VIDEO,
      galleryMediaType: "video",
    },
  ]
  target.galleryImages = galleryImages
  withoutCover[targetIndex] = target
  return withoutCover
}

export async function fixGalleryTameshigiriPage(): Promise<{
  removedCoverSections: number
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
  const updated = fixGalleryBlocks(blocks)
  const removedCoverSections = blocks.length - updated.length
  const videoPresentInGallery = updated.some(
    (block) =>
      block._template === "gallery" &&
      Array.isArray(block.galleryImages) &&
      (block.galleryImages as GalleryItem[]).some(
        (item) => item.galleryImage === TAMESHIGIRI_VIDEO
      )
  )

  await sql`
    UPDATE pages
    SET blocks = ${JSON.stringify(updated)}
    WHERE slug = 'gallery'
  `

  return { removedCoverSections, videoPresentInGallery }
}
