"use client"

type GalleryVideoProps = {
  src: string
  caption?: string
}

export function GalleryVideo({ src, caption }: GalleryVideoProps) {
  return (
    <div className="relative aspect-video overflow-hidden bg-black">
      <video
        src={src}
        controls
        playsInline
        preload="metadata"
        className="size-full object-contain"
        aria-label={caption ?? "Gallery video"}
      >
        Your browser does not support the video tag.
      </video>
    </div>
  )
}
