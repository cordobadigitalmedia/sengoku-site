import { isVideoUrl } from "@/lib/is-video-url"
import type { GalleryItem, GalleryMediaType } from "@/types/content"

export function getGalleryItemMediaType(item: GalleryItem): GalleryMediaType {
  if (item.galleryMediaType === "video" || item.galleryMediaType === "image") {
    return item.galleryMediaType
  }
  if (item.galleryVideo?.trim()) return "video"
  if (isVideoUrl(item.galleryImage ?? "")) return "video"
  return "image"
}

export function getGalleryItemSrc(item: GalleryItem): string | undefined {
  if (getGalleryItemMediaType(item) === "video") {
    return item.galleryVideo?.trim() || item.galleryImage?.trim() || undefined
  }
  return item.galleryImage?.trim() || undefined
}
