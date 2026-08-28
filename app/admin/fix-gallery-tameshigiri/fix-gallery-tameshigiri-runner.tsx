"use client"

import { useEffect, useState } from "react"

import { runGalleryTameshigiriFix } from "./actions"

export function FixGalleryTameshigiriRunner() {
  const [status, setStatus] = useState<"running" | "done" | "error">("running")
  const [message, setMessage] = useState("Running gallery fix…")

  useEffect(() => {
    runGalleryTameshigiriFix()
      .then((result) => {
        setStatus("done")
        setMessage(
          `Done. Gallery blocks: ${result.galleryBlockCount}. Removed ${result.removedCoverSections} cover section(s). Video in gallery: ${result.videoPresentInGallery ? "yes" : "no"}.`
        )
      })
      .catch((error: Error) => {
        setStatus("error")
        setMessage(error.message || "Fix failed")
      })
  }, [])

  return (
    <div className="mx-auto max-w-xl p-8">
      <h1 className="mb-4 text-2xl font-bold">Gallery tameshigiri fix</h1>
      <p
        className={
          status === "error"
            ? "text-red-600"
            : status === "done"
              ? "text-green-700"
              : "text-gray-700"
        }
      >
        {message}
      </p>
    </div>
  )
}
