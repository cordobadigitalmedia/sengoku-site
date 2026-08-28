"use server"

import { revalidatePath } from "next/cache"

import { fixGalleryTameshigiriPage } from "@/lib/fix-gallery-tameshigiri"

import { requireAdmin } from "./actions"

export async function runGalleryTameshigiriFix() {
  await requireAdmin()
  const result = await fixGalleryTameshigiriPage()
  revalidatePath("/gallery")
  revalidatePath("/admin/pages/gallery")
  return result
}
