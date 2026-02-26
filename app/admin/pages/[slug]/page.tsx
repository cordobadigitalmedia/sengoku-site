import { notFound } from "next/navigation"
import Link from "next/link"

import { getPageBySlug } from "@/lib/content/pages"
import { PageEditor } from "./page-editor"

export default async function AdminEditPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const slug = (await params).slug
  const page = await getPageBySlug(slug)
  if (!page) notFound()
  return (
    <div>
      <Link href="/admin/pages" className="mb-4 inline-block text-sm text-gray-600 hover:underline">
        ← Back to pages
      </Link>
      <h1 className="mb-6 text-2xl font-bold">Edit: {page.title}</h1>
      <PageEditor page={page} />
    </div>
  )
}
