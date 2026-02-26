import "server-only"

import { cache } from "react"

import { db } from "@/lib/db"
import { pages as pagesTable } from "@/lib/db/schema"
import type { Page, PageBlock } from "@/types/content"
import { eq } from "drizzle-orm"

export async function updatePageBySlug(
  slug: string,
  data: { title?: string; seo?: unknown; blocks?: unknown[] }
) {
  await db
    .update(pagesTable)
    .set({
      ...(data.title !== undefined && { title: data.title }),
      ...(data.seo !== undefined && { seo: data.seo }),
      ...(data.blocks !== undefined && { blocks: data.blocks }),
    })
    .where(eq(pagesTable.slug, slug))
}

function normalizeSeo(seo: unknown): Page["seo"] {
  if (seo == null) return undefined
  if (typeof seo === "string") {
    try {
      seo = JSON.parse(seo) as Record<string, unknown>
    } catch {
      return undefined
    }
  }
  if (typeof seo !== "object" || Array.isArray(seo)) return undefined
  const o = seo as Record<string, unknown>
  return {
    ...(typeof o.title === "string" && { title: o.title }),
    ...(typeof o.description === "string" && { description: o.description }),
    ...(typeof o.keywords === "string" && { keywords: o.keywords }),
  }
}

function rowToPage(row: { id: string; slug: string; title: string; seo: unknown; blocks: unknown[] }): Page {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    seo: normalizeSeo(row.seo),
    blocks: (row.blocks ?? []) as PageBlock[],
    _sys: { filename: row.slug },
  }
}

export const getPageBySlug = cache(async (slug: string): Promise<Page | null> => {
  const [row] = await db.select().from(pagesTable).where(eq(pagesTable.slug, slug)).limit(1)
  if (!row) return null
  return rowToPage(row)
})

export const getAllPageSlugs = cache(async (): Promise<string[]> => {
  const rows = await db.select({ slug: pagesTable.slug }).from(pagesTable)
  return rows.map((r) => r.slug)
})

export async function deletePageBySlug(slug: string): Promise<void> {
  await db.delete(pagesTable).where(eq(pagesTable.slug, slug))
}
