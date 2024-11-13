/* eslint-disable tailwindcss/migration-from-tailwind-2 */
import React from "react"

interface BackgroundVideoProps {
  src: string
  children?: React.ReactNode
}

export default function BackgroundVideo({
  src,
  children,
}: BackgroundVideoProps) {
  return (
    <div className="relative h-[400px] w-full overflow-hidden">
      <video
        className="absolute left-0 top-0 size-full object-cover"
        autoPlay
        loop
        muted
        playsInline
        aria-hidden="true"
      >
        <source src={src} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className="relative z-10 flex size-full items-center justify-center bg-black bg-opacity-50">
        {children}
      </div>
    </div>
  )
}
