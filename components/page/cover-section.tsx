import Image from "next/image"
import { PageBlocksCoverSection } from "@/tina/__generated__/types"
import BackgroundVideo from "next-video/background-video"
import { tinaField } from "tinacms/dist/react"
import { TinaMarkdown } from "tinacms/dist/rich-text"

export function CoverSection(props: PageBlocksCoverSection) {
  const backgroundImage = props.backgroundImage
    ? `${props.backgroundImage}`
    : "none"
  const backgroundColor =
    props.backgroundColor && props.backgroundColor !== "none"
      ? `var(--${props.backgroundColor})`
      : "#ffffff"
  const backgroundType = props.backgroundType || "image"
  return (
    <>
      {backgroundImage !== "none" && backgroundType === "image" && (
        <section
          className={`relative h-[35vh]`}
          style={{ backgroundColor }}
          data-tina-field={tinaField(props, "backgroundColor")}
        >
          <Image
            alt={props.headline || ""}
            className={`size-full object-cover`}
            height={1080}
            src={backgroundImage}
            style={{
              aspectRatio: "1920/1080",
              objectFit: "cover",
            }}
            data-tina-field={tinaField(props, "backgroundImage")}
            width={1920}
          />
          <div
            className={`absolute inset-0 flex flex-col items-center justify-center bg-gray-900/50`}
          >
            <h1
              className="px-4 text-center text-4xl font-bold text-white sm:text-5xl md:text-6xl"
              data-tina-field={tinaField(props, "headline")}
            >
              {props.headline || ""}
            </h1>
            <div
              className="prose py-2 text-white"
              data-tina-field={tinaField(props, "content")}
            >
              <TinaMarkdown content={props.content} />
            </div>
          </div>
        </section>
      )}
      {backgroundType === "video" && props.backgroundVideo && (
        <section
          className={`relative w-full overflow-hidden`}
          style={{ backgroundColor }}
          data-tina-field={tinaField(props, "backgroundColor")}
        >
          <BackgroundVideo src={props.backgroundVideo}>
            <h1 className="px-4 text-center text-4xl font-bold text-white drop-shadow-md sm:text-5xl md:text-6xl">
              {props.headline || ""}
            </h1>
          </BackgroundVideo>
        </section>
      )}
    </>
  )
}
