import "server-only"

import { cache } from "react"

import { db } from "@/lib/db"
import { posts as postsTable } from "@/lib/db/schema"
import type { Post } from "@/types/content"
import { eq } from "drizzle-orm"

export async function updatePostBySlug(
  slug: string,
  data: {
    title?: string
    image?: string
    description?: string
    body?: string
  }
) {
  await db
    .update(postsTable)
    .set({
      ...(data.title !== undefined && { title: data.title }),
      ...(data.image !== undefined && { image: data.image }),
      ...(data.description !== undefined && { description: data.description }),
      ...(data.body !== undefined && { body: data.body }),
    })
    .where(eq(postsTable.slug, slug))
}

function rowToPost(row: {
  id: string
  slug: string
  title: string
  authorId: string | null
  image: string | null
  description: string | null
  body: string
}): Post {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    image: row.image ?? undefined,
    description: row.description ?? undefined,
    body: row.body,
    _sys: { filename: row.slug },
  }
}

export const getPostBySlug = cache(async (slug: string): Promise<Post | null> => {
  const [row] = await db.select().from(postsTable).where(eq(postsTable.slug, slug)).limit(1)
  if (!row) return null
  return rowToPost(row)
})

export const getAllPostSlugs = cache(async (): Promise<string[]> => {
  const rows = await db.select({ slug: postsTable.slug }).from(postsTable)
  return rows.map((r) => r.slug)
})

export const getPostsForList = cache(async (): Promise<Post[]> => {
  const rows = await db.select().from(postsTable).orderBy(postsTable.slug)
  return rows.map((r) => rowToPost(r))
})
