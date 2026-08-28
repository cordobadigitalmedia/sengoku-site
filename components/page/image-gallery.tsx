import type { ReactElement } from "react"
import Image from "next/image"

import { GalleryVideo } from "@/components/page/gallery-video"
import {
  getGalleryItemMediaType,
  getGalleryItemSrc,
} from "@/lib/gallery-item"
import type { BlockGallery } from "@/types/content"

export function ImageGallery(props: BlockGallery): ReactElement {
  const items = (props.galleryImages ?? []).filter((item) => getGalleryItemSrc(item))
  if (items.length === 0) return <></>
  return (
    <div className="container mx-auto grid w-full grid-cols-1 gap-8 p-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item, i) => {
        const src = getGalleryItemSrc(item)!
        const mediaType = getGalleryItemMediaType(item)
        return (
          <div
            key={item.caption ?? i}
            className={mediaType === "video" ? "col-span-full" : undefined}
          >
            {mediaType === "video" ? (
              <GalleryVideo src={src} caption={item.caption} />
            ) : (
              <div className="relative h-80">
                <Image
                  src={src}
                  fill
                  alt={item.caption ?? "Gallery Image"}
                  className="object-contain"
                />
              </div>
            )}
            {item.caption && (
              <div className="prose flex items-center justify-center gap-2 py-2">
                {item.caption}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
