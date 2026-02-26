import type { ReactElement } from "react"

export function GoogleMap({ url }: { url: string }): ReactElement {
  return (
    <div className="w-full">
      <iframe src={url} width="100%" height="350" loading="lazy"></iframe>
    </div>
  )
}
