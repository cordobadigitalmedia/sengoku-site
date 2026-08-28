const VIDEO_EXTENSIONS = /\.(mp4|webm|mov|m4v|ogv)(\?|$)/i

export function isVideoUrl(url: string): boolean {
  const trimmed = url.trim()
  if (!trimmed) return false
  try {
    const pathname = new URL(trimmed, "https://placeholder.local").pathname
    return VIDEO_EXTENSIONS.test(pathname)
  } catch {
    return VIDEO_EXTENSIONS.test(trimmed)
  }
}
