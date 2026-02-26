/**
 * One-time script to migrate existing image URLs/paths to Vercel Blob.
 * Reads pages and posts from Neon; for each image that is not already a blob URL,
 * fetches it (resolving relative paths like /images/foo.jpg with a base URL),
 * uploads to Blob, then updates the DB so fields show blob URLs.
 *
 * Requires: DATABASE_URL, BLOB_READ_WRITE_TOKEN in .env.local
 * Optional: SITE_URL (e.g. https://sengoku.ca) to resolve relative image paths when fetching.
 * Run: pnpm db:migrate:images-to-blob
 */
import { readFile } from "fs/promises"
import { join } from "path"

import { put } from "@vercel/blob"
import { neon } from "@neondatabase/serverless"

const BLOB_ORIGIN = "blob.vercel-storage.com"

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
            if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'")))
              value = value.slice(1, -1)
            process.env[key] = value
          }
        }
      }
    })
    .catch(() => {})
}

function isBlobUrl(url: string): boolean {
  try {
    const u = new URL(url)
    return u.hostname.includes(BLOB_ORIGIN)
  } catch {
    return false
  }
}

function isAbsoluteImageUrl(url: string): boolean {
  if (!url || !url.startsWith("http")) return false
  const lower = url.toLowerCase()
  return (
    lower.includes(".jpg") ||
    lower.includes(".jpeg") ||
    lower.includes(".png") ||
    lower.includes(".gif") ||
    lower.includes(".webp") ||
    /\.(jpg|jpeg|png|gif|webp)(\?|$)/i.test(url)
  )
}

/** Relative paths like /images/foo.jpg that we can resolve and migrate. */
function isRelativeImagePath(url: string): boolean {
  if (!url || typeof url !== "string") return false
  const t = url.trim()
  if (!t.startsWith("/")) return false
  const lower = t.toLowerCase()
  return (
    /\.(jpg|jpeg|png|gif|webp)(\?|$)/i.test(t) ||
    lower.includes("/images/")
  )
}

/** Resolve to absolute URL for fetching. */
function resolveImageUrl(url: string, baseUrl: string): string {
  if (url.startsWith("http")) return url
  const base = baseUrl.replace(/\/$/, "")
  const path = url.startsWith("/") ? url : `/${url}`
  return `${base}${path}`
}

/** Extract image URLs from page blocks (known image fields only). */
function extractImageUrlsFromBlocks(blocks: unknown[]): Set<string> {
  const urls = new Set<string>()
  if (!Array.isArray(blocks)) return urls
  for (const block of blocks) {
    if (!block || typeof block !== "object") continue
    const b = block as Record<string, unknown>
    const t = b._template
    if (t === "welcomeHero" && typeof b.backgroundImage === "string" && b.backgroundImage)
      urls.add(b.backgroundImage)
    if (t === "coverSection" && typeof b.backgroundImage === "string" && b.backgroundImage)
      urls.add(b.backgroundImage)
    if (t === "cardgrid" && Array.isArray(b.cardblock)) {
      for (const card of b.cardblock) {
        if (card && typeof card === "object" && typeof (card as Record<string, unknown>).coverimage === "string") {
          const v = (card as Record<string, unknown>).coverimage as string
          if (v) urls.add(v)
        }
      }
    }
    if (t === "gallery" && Array.isArray(b.galleryImages)) {
      for (const item of b.galleryImages) {
        if (item && typeof item === "object" && typeof (item as Record<string, unknown>).galleryImage === "string") {
          const v = (item as Record<string, unknown>).galleryImage as string
          if (v) urls.add(v)
        }
      }
    }
  }
  return urls
}

/** Extract img src URLs from HTML string. */
function extractImageUrlsFromHtml(html: string): Set<string> {
  const urls = new Set<string>()
  const re = /<img[^>]+src=["']([^"']+)["']/gi
  let m: RegExpExecArray | null
  while ((m = re.exec(html)) !== null) urls.add(m[1])
  return urls
}

/** Replace image URLs in blocks (known fields). Returns new blocks. */
function replaceImageUrlsInBlocks(blocks: unknown[], urlMap: Map<string, string>): unknown[] {
  if (!Array.isArray(blocks)) return blocks
  return blocks.map((block) => {
    if (!block || typeof block !== "object") return block
    const b = { ...(block as Record<string, unknown>) }
    const t = b._template
    if (t === "welcomeHero" && typeof b.backgroundImage === "string" && urlMap.has(b.backgroundImage))
      b.backgroundImage = urlMap.get(b.backgroundImage)
    if (t === "coverSection" && typeof b.backgroundImage === "string" && urlMap.has(b.backgroundImage))
      b.backgroundImage = urlMap.get(b.backgroundImage)
    if (t === "cardgrid" && Array.isArray(b.cardblock))
      b.cardblock = b.cardblock.map((card) => {
        if (!card || typeof card !== "object") return card
        const c = { ...(card as Record<string, unknown>) }
        if (typeof c.coverimage === "string" && urlMap.has(c.coverimage))
          c.coverimage = urlMap.get(c.coverimage)
        return c
      })
    if (t === "gallery" && Array.isArray(b.galleryImages))
      b.galleryImages = b.galleryImages.map((item) => {
        if (!item || typeof item !== "object") return item
        const i = { ...(item as Record<string, unknown>) }
        if (typeof i.galleryImage === "string" && urlMap.has(i.galleryImage))
          i.galleryImage = urlMap.get(i.galleryImage)
        return i
      })
    return b
  })
}

/** Replace all occurrences of old URLs in html with new URLs. */
function replaceImageUrlsInHtml(html: string, urlMap: Map<string, string>): string {
  let out = html
  for (const [oldUrl, newUrl] of urlMap) {
    out = out.split(oldUrl).join(newUrl)
  }
  return out
}

async function main() {
  await loadEnvLocal()
  const databaseUrl = process.env.DATABASE_URL
  const blobToken = process.env.BLOB_READ_WRITE_TOKEN
  if (!databaseUrl) {
    console.error("DATABASE_URL is required (e.g. in .env.local)")
    process.exit(1)
  }
  if (!blobToken) {
    console.error("BLOB_READ_WRITE_TOKEN is required for server-side uploads (e.g. in .env.local)")
    process.exit(1)
  }

  const sql = neon(databaseUrl)

  type PageRow = { slug: string; blocks: unknown[] }
  type PostRow = { slug: string; image: string | null; body: string }
  const pages = (await sql`SELECT slug, blocks FROM pages`) as PageRow[]
  const posts = (await sql`SELECT slug, image, body FROM posts`) as PostRow[]

  const allUrls = new Set<string>()
  for (const p of pages) {
    extractImageUrlsFromBlocks(p.blocks ?? []).forEach((u) => allUrls.add(u))
  }
  for (const p of posts) {
    if (p.image) allUrls.add(p.image)
    extractImageUrlsFromHtml(p.body ?? "").forEach((u) => allUrls.add(u))
  }

  const resolvedBaseUrl =
    process.env.SITE_URL ??
    (process.env.NEXT_PUBLIC_VERCEL_URL ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}` : null) ??
    "https://sengoku.ca"

  const toMigrate = [...allUrls].filter(
    (u) => !isBlobUrl(u) && (isAbsoluteImageUrl(u) || isRelativeImagePath(u))
  )
  console.log(
    `Found ${toMigrate.length} image(s) to migrate (absolute URLs + relative paths, excluding already blob).`
  )
  if (toMigrate.length > 0 && toMigrate.some(isRelativeImagePath)) {
    console.log(`Base URL for relative paths: ${resolvedBaseUrl}`)
  }

  const urlMap = new Map<string, string>()
  for (const url of toMigrate) {
    const fetchUrl = resolveImageUrl(url, resolvedBaseUrl)
    try {
      const res = await fetch(fetchUrl, { signal: AbortSignal.timeout(15000) })
      if (!res.ok) {
        console.warn(`Skip ${url}: ${res.status}`)
        continue
      }
      const buf = Buffer.from(await res.arrayBuffer())
      const ext = url.replace(/\?.*/, "").match(/\.(jpg|jpeg|png|gif|webp)$/i)?.[1] ?? "jpg"
      const name = `migrated/${Date.now()}-${Math.random().toString(36).slice(2, 10)}.${ext}`
      const blob = await put(name, buf, { access: "public" })
      urlMap.set(url, blob.url)
      console.log(`  ${url} -> ${blob.url}`)
    } catch (err) {
      console.warn(`Skip ${url}:`, err instanceof Error ? err.message : err)
    }
  }

  if (urlMap.size === 0) {
    console.log("No URLs migrated. Nothing to update.")
    return
  }

  for (const p of pages) {
    const newBlocks = replaceImageUrlsInBlocks(p.blocks ?? [], urlMap)
    if (JSON.stringify(newBlocks) !== JSON.stringify(p.blocks)) {
      await sql`UPDATE pages SET blocks = ${JSON.stringify(newBlocks)}::jsonb WHERE slug = ${p.slug}`
      console.log("Updated page:", p.slug)
    }
  }

  for (const p of posts) {
    let changed = false
    let newImage = p.image
    let newBody = p.body ?? ""
    if (p.image && urlMap.has(p.image)) {
      newImage = urlMap.get(p.image)!
      changed = true
    }
    newBody = replaceImageUrlsInHtml(p.body ?? "", urlMap)
    if (newBody !== (p.body ?? "")) changed = true
    if (changed) {
      await sql`UPDATE posts SET image = ${newImage}, body = ${newBody} WHERE slug = ${p.slug}`
      console.log("Updated post:", p.slug)
    }
  }

  console.log("Migration done.")
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
