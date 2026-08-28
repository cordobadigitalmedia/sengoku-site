"use client"

import { Pause, Play } from "lucide-react"
import { useCallback, useEffect, useRef, useState } from "react"

type GalleryVideoProps = {
  src: string
  caption?: string
}

export function GalleryVideo({ src, caption }: GalleryVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [playing, setPlaying] = useState(false)
  const [needsRotate, setNeedsRotate] = useState(false)
  const [ready, setReady] = useState(false)

  const applyOrientation = useCallback(() => {
    const video = videoRef.current
    if (!video || video.videoWidth === 0) return
    setNeedsRotate(video.videoHeight > video.videoWidth)
    setReady(true)
  }, [])

  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    applyOrientation()
    video.addEventListener("loadedmetadata", applyOrientation)
    return () => video.removeEventListener("loadedmetadata", applyOrientation)
  }, [applyOrientation, src])

  const togglePlayback = useCallback(() => {
    const video = videoRef.current
    if (!video) return
    if (video.paused) void video.play()
    else video.pause()
  }, [])

  return (
    <div className="relative aspect-video overflow-hidden bg-black">
      <video
        ref={videoRef}
        src={src}
        playsInline
        preload="metadata"
        controls={ready && !needsRotate}
        className={
          needsRotate
            ? `absolute left-1/2 top-1/2 h-[177.78%] w-[56.25%] max-w-none -translate-x-1/2 -translate-y-1/2 rotate-90 object-cover ${ready ? "opacity-100" : "opacity-0"}`
            : `size-full object-cover ${ready ? "opacity-100" : "opacity-0"}`
        }
        aria-label={caption ?? "Gallery video"}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onClick={needsRotate ? togglePlayback : undefined}
      >
        Your browser does not support the video tag.
      </video>
      {needsRotate && ready ? (
        <button
          type="button"
          onClick={togglePlayback}
          className="absolute bottom-3 left-3 z-10 rounded-full bg-black/70 p-2 text-white hover:bg-black/85"
          aria-label={playing ? "Pause video" : "Play video"}
        >
          {playing ? (
            <Pause className="size-5" aria-hidden />
          ) : (
            <Play className="size-5" aria-hidden />
          )}
        </button>
      ) : null}
    </div>
  )
}
