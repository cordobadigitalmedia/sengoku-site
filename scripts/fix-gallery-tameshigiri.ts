/**
 * Move the tameshigiri video from a coverSection block into the gallery grid.
 * Only updates the gallery page — cover-section video heroes (e.g. /schedule) are untouched.
 * Run: pnpm tsx scripts/fix-gallery-tameshigiri.ts
 */
import { readFile } from "fs/promises"
import { join } from "path"

import { neon } from "@neondatabase/serverless"

const TAMESHIGIRI_VIDEO =
  "https://0nt7gisybdk4bmcr.public.blob.vercel-storage.com/dougtameshigiri-pNJLu9WwACymGUfcGy3X0RS4rNmMGz.mp4"
const TAMESHIGIRI_CAPTION = "Shodan performing tameshigiri"

type GalleryItem = { caption?: string; galleryImage?: string }
type PageBlock = Record<string, unknown> & { _template?: string }

function loadEnvLocal() {
  const envPath = join(process.cwd(), ".env.local")
  return readFile(envPath, "utf-8")
    .then((envContent) => {
      for (const line of envContent.split("\n")) {
        const trimmed = line.trim()
        if (trimmed && !trimmed.startsWith("#")) {
          const eq = trimmed.indexOf("=")
          if (eq > 0) {
            const key = trimmed.slice(0, eq).trim()
            let value = trimmed.slice(eq + 1).trim()
            if (
              (value.startsWith('"') && value.endsWith('"')) ||
              (value.startsWith("'") && value.endsWith("'"))
            )
              value = value.slice(1, -1)
            process.env[key] = value
          }
        }
      }
    })
    .catch(() => {})
}

function isTameshigiriCoverSection(block: PageBlock): boolean {
  return (
    block._template === "coverSection" &&
    (block.headline === TAMESHIGIRI_CAPTION ||
      block.backgroundVideo === TAMESHIGIRI_VIDEO)
  )
}

function fixGalleryBlocks(blocks: PageBlock[]): PageBlock[] {
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
        { caption: TAMESHIGIRI_CAPTION, galleryImage: TAMESHIGIRI_VIDEO, galleryMediaType: "video" },
      ],
    })
    return withoutCover
  }

  const targetIndex = galleryIndexes[galleryIndexes.length - 1]!
  const target = { ...withoutCover[targetIndex]! }
  const galleryImages = [
    ...((target.galleryImages as GalleryItem[] | undefined) ?? []),
    { caption: TAMESHIGIRI_CAPTION, galleryImage: TAMESHIGIRI_VIDEO, galleryMediaType: "video" },
  ]
  target.galleryImages = galleryImages
  withoutCover[targetIndex] = target
  return withoutCover
}

async function main() {
  await loadEnvLocal()
  const databaseUrl = process.env.DATABASE_URL
  if (!databaseUrl) {
    console.error("DATABASE_URL is required")
    process.exit(1)
  }

  const sql = neon(databaseUrl)
  const rows = await sql`SELECT blocks FROM pages WHERE slug = 'gallery' LIMIT 1`
  if (!rows[0]) {
    console.error("Gallery page not found")
    process.exit(1)
  }

  const blocks = rows[0].blocks as PageBlock[]
  const updated = fixGalleryBlocks(blocks)
  const removedCover = blocks.length - updated.length
  const addedVideo = updated.some(
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

  console.log("Gallery page updated.")
  console.log(`Removed cover sections: ${removedCover}`)
  console.log(`Video present in gallery: ${addedVideo}`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
