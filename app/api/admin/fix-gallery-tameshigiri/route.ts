import { currentUser } from "@clerk/nextjs/server"
import { revalidatePath } from "next/cache"
import { NextResponse } from "next/server"

import { fixGalleryTameshigiriPage } from "@/lib/fix-gallery-tameshigiri"

export async function POST() {
  const user = await currentUser()
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  const role = (user.publicMetadata as { role?: string } | undefined)?.role
  if (role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const result = await fixGalleryTameshigiriPage()
  revalidatePath("/gallery")

  return NextResponse.json({
    ok: true,
    ...result,
  })
}
