"use server"

import { currentUser } from "@clerk/nextjs/server"
import { revalidatePath } from "next/cache"

import { updatePageBySlug } from "@/lib/content/pages"
import type { PageBlock } from "@/types/content"

async function requireAdmin() {
  const user = await currentUser()
  if (!user) throw new Error("Unauthorized")
  const role = (user.publicMetadata as { role?: string } | undefined)?.role
  if (role !== "admin") throw new Error("Forbidden")
}

export async function updatePage(
  slug: string,
  data: { title?: string; seo?: unknown; blocks?: PageBlock[] }
) {
  await requireAdmin()
  await updatePageBySlug(slug, data)
  revalidatePath("/")
  revalidatePath(`/${slug}`)
  revalidatePath("/admin/pages")
  revalidatePath(`/admin/pages/${slug}`)
}
