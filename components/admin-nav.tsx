"use client"

import { UserButton } from "@clerk/nextjs"
import Link from "next/link"

export function AdminNav() {
  return (
    <nav className="border-b bg-white px-4 py-3">
      <div className="mx-auto flex max-w-6xl items-center justify-between">
        <Link href="/admin" className="font-semibold text-gray-800">
          Sengoku Admin
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/" className="text-sm text-gray-600 hover:underline">
            View site
          </Link>
          <UserButton afterSignOutUrl="/" />
        </div>
      </div>
    </nav>
  )
}
