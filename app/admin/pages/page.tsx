import Link from "next/link"

import { getAllPageSlugs } from "@/lib/content/pages"
import { getPageBySlug } from "@/lib/content/pages"

export default async function AdminPagesList() {
  const slugs = await getAllPageSlugs()
  const pages = await Promise.all(
    slugs.map(async (slug) => {
      const page = await getPageBySlug(slug)
      return { slug, title: page?.title ?? slug }
    })
  )
  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Pages</h1>
      <ul className="space-y-2">
        {pages.map((p) => (
          <li key={p.slug}>
            <Link
              href={`/admin/pages/${p.slug}`}
              className="block rounded border bg-white px-4 py-3 hover:bg-gray-50"
            >
              <span className="font-medium">{p.title}</span>
              <span className="ml-2 text-sm text-gray-500">/{p.slug}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
