import Link from "next/link"

export default function AdminDashboard() {
  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Admin</h1>
      <div className="grid gap-4 sm:grid-cols-2">
        <Link
          href="/admin/pages"
          className="rounded-lg border bg-white p-4 shadow-sm hover:bg-gray-50"
        >
          <h2 className="font-semibold">Pages</h2>
          <p className="text-sm text-gray-600">
            Edit page content and blocks (hero, cards, gallery, etc.)
          </p>
        </Link>
      </div>
    </div>
  )
}
