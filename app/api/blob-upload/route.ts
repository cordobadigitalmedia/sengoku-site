import { currentUser } from "@clerk/nextjs/server"
import { handleUpload, type HandleUploadBody } from "@vercel/blob/client"
import { NextResponse } from "next/server"

async function requireAdmin() {
  const user = await currentUser()
  if (!user) return null
  const role = (user.publicMetadata as { role?: string } | undefined)?.role
  return role === "admin" ? user : null
}

export async function POST(request: Request): Promise<NextResponse> {
  const user = await requireAdmin()
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = (await request.json()) as HandleUploadBody

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname, _clientPayload, _multipart) => {
        return {
          allowedContentTypes: [
            "image/jpeg",
            "image/png",
            "image/webp",
            "image/gif",
            "video/mp4",
            "video/webm",
            "video/quicktime",
          ],
          addRandomSuffix: true,
        }
      },
      onUploadCompleted: async () => {
        // Optional: run logic after upload (e.g. log, update DB)
      },
    })

    return NextResponse.json(jsonResponse)
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 400 }
    )
  }
}
