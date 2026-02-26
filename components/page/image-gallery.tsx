import type { ReactElement } from "react"
import Image from "next/image"

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
            return (
              <div key={item?.caption ?? i}>
                <div className="relative h-80">
                  <Image
                    src={galleryImage}
                    fill
                    alt={item?.caption ?? "Gallery Image"}
                    className="object-contain"
                  />
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
