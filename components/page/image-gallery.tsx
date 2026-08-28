import type { ReactElement } from "react"
import Image from "next/image"

import { isVideoUrl } from "@/lib/is-video-url"
import type { BlockGallery } from "@/types/content"

export function ImageGallery(props: BlockGallery): ReactElement {
  const { galleryImages } = props
  const itemsWithImage = (galleryImages ?? []).filter(
    (item) => item?.galleryImage?.trim()
  )
  return (
    <>
      {itemsWithImage.length > 0 && (
        <div className="container mx-auto grid w-full grid-cols-1 gap-8 p-4 sm:grid-cols-2 lg:grid-cols-3">
          {itemsWithImage.map((item, i) => {
            const galleryImage = `${item!.galleryImage!}`
            const isVideo = isVideoUrl(galleryImage)
            // #region agent log
            fetch("http://127.0.0.1:7315/ingest/b3ad8b19-524c-4126-bf90-9efaffdb8438", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "X-Debug-Session-Id": "d7f2d6",
              },
              body: JSON.stringify({
                sessionId: "d7f2d6",
                runId: "post-fix",
                hypothesisId: "A",
                location: "image-gallery.tsx:map",
                message: "Gallery item render path",
                data: { src: galleryImage, isVideo, caption: item?.caption ?? null },
                timestamp: Date.now(),
              }),
            }).catch(() => {})
            // #endregion
            return (
              <div key={item?.caption ?? i}>
                <div className="relative h-80 bg-black">
                  {isVideo ? (
                    <video
                      src={galleryImage}
                      controls
                      playsInline
                      preload="metadata"
                      className="size-full object-contain"
                      aria-label={item?.caption ?? "Gallery video"}
                    >
                      Your browser does not support the video tag.
                    </video>
                  ) : (
                    <Image
                      src={galleryImage}
                      fill
                      alt={item?.caption ?? "Gallery Image"}
                      className="object-contain"
                    />
                  )}
                </div>
                {item?.caption && (
                  <div className="prose flex items-center justify-center gap-2 py-2">
                    {item.caption}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </>
  )
}
