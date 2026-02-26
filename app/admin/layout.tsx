import { currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"

import { AdminNav } from "@/components/admin-nav"

/** Admin is always dynamic (auth + fresh data); never statically cached */
export const dynamic = "force-dynamic"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await currentUser()
  if (!user) redirect("/sign-in")
  const role = (user.publicMetadata as { role?: string } | undefined)?.role
  if (role !== "admin") {
    redirect("/")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNav />
      <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
    </div>
  )
}
