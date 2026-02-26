"use client"

import { upload } from "@vercel/blob/client"
import { Loader2 } from "lucide-react"
import { useRef, useState } from "react"

type VideoUploadFieldProps = {
  label?: string
  value: string
  onChange: (url: string) => void
  className?: string
}

export function VideoUploadField({
  label = "Video",
  value,
  onChange,
  className = "",
}: VideoUploadFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    e.target.value = ""
    setUploading(true)
    try {
      const blob = await upload(file.name, file, {
        access: "public",
        handleUploadUrl: "/api/blob-upload",
      })
      onChange(blob.url)
    } catch (err) {
      console.error(err)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className={className}>
      {label && (
        <label className="mb-1 block text-sm font-medium text-gray-700">{label}</label>
      )}
      <div className="flex gap-2">
        <input
          type="url"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="https://… or upload"
          className="flex-1 rounded border border-gray-300 px-3 py-2 text-sm"
        />
        <input
          ref={inputRef}
          type="file"
          accept="video/*"
          className="hidden"
          onChange={handleUpload}
          disabled={uploading}
        />
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="flex items-center gap-1.5 rounded border border-gray-300 bg-gray-50 px-3 py-2 text-sm hover:bg-gray-100 disabled:opacity-70"
        >
          {uploading ? (
            <Loader2 className="size-4 animate-spin" aria-hidden />
          ) : null}
          {uploading ? "Uploading…" : "Upload"}
        </button>
      </div>
      {value ? (
        <video
          src={value}
          controls
          className="mt-2 max-h-32 w-full rounded border object-contain"
        >
          Your browser does not support the video tag.
        </video>
      ) : null}
    </div>
  )
}
