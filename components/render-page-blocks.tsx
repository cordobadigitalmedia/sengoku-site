import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { ImageGallery } from "@/components/page/image-gallery"
import { renderBlockRichText } from "@/lib/block-rich-text"
import BackgroundVideo from "@/components/ui/background-video"
import type { PageBlock } from "@/types/content"

type ObjectFitValue = "fill" | "contain" | "cover" | "none" | "scale-down"

export async function renderPageBlock(
  block: PageBlock,
  i: number
): Promise<React.ReactNode> {
  switch (block._template) {
    case "welcomeHero": {
      const backgroundColor = block.backgroundColor || "#ffffff"
      const backgroundImage = block.backgroundImage ? `${block.backgroundImage}` : "none"
      const messageNode = block.message ? await renderBlockRichText(block.message, "prose prose-custom max-w-none text-xl") : null
      return (
        <section
          key={i}
          className="relative flex h-[80vh] w-full items-center justify-center"
          style={{ backgroundColor }}
        >
          {backgroundImage !== "none" && (
            <div className="absolute inset-0 overflow-hidden">
              <Image
                alt={block.title || ""}
                className="size-full object-cover opacity-50"
                height={1080}
                src={backgroundImage}
                style={{ aspectRatio: "1920/1080", objectFit: "cover" }}
                width={1920}
              />
            </div>
          )}
          <div className="z-5 relative max-w-3xl px-4 text-center">
            <h1 className="text-primary mb-4 text-5xl font-bold">{block.title}</h1>
            <div
              className="prose prose-custom max-w-none text-xl"
              style={{ "--custom-prose-color": "hsl(var(--secondary))" } as React.CSSProperties}
            >
              {messageNode}
            </div>
            <div className="flex items-center justify-center gap-5 py-12">
              {block.links?.map((link) => {
                if (link?.style === "button") {
                  return (
                    <Link key={link.label} href={link.link || ""}>
                      <Button
                        size="lg"
                        variant={link.buttonColor === "primary" ? "default" : "secondary"}
                      >
                        {link.label}
                      </Button>
                    </Link>
                  )
                }
                if (link?.style === "simple") {
                  return (
                    <Link key={link.label} href={link?.link || ""}>
                      <Button size="lg" variant="ghost">
                        Learn More
                        <ArrowRight className="ml-2 size-4" />
                      </Button>
                    </Link>
                  )
                }
                return null
              })}
            </div>
          </div>
        </section>
      )
    }
    case "cardgrid": {
      const { cardblock, gridTitle } = block
      if (!cardblock?.length) return null
      return (
        <div key={i} className="container mx-auto grid grid-cols-1 gap-8 p-4 sm:grid-cols-2">
          {await Promise.all(
            cardblock.map(async (item, j) => {
              const backgroundImage = item?.coverimage ? `${item.coverimage}` : "none"
              const contentNode = item?.content
                ? await renderBlockRichText(item.content, "prose mb-4 text-gray-600")
                : null
              return (
                <div
                  className="overflow-hidden rounded-lg bg-white shadow-md"
                  key={item?.headline ?? j}
                >
                  {backgroundImage !== "none" && (
                    <Image
                      alt={item?.headline ?? ""}
                      className="h-[250px] w-full object-cover sm:h-[400px]"
                      height={300}
                      src={backgroundImage}
                      style={{
                        aspectRatio: "400/300",
                        objectFit: (item?.imageFit as ObjectFitValue) || "contain",
                      }}
                      width={400}
                    />
                  )}
                  <div className="p-4">
                    <h3 className="mb-2 text-xl font-bold">{item?.headline ?? ""}</h3>
                    <div className="prose mb-4 text-gray-600">{contentNode}</div>
                    {item?.links?.length ? (
                      <div className="flex items-center justify-end gap-2">
                        {item.links.map((linkItem) => (
                          <Link
                            href={linkItem?.link ?? ""}
                            key={linkItem?.link ?? linkItem?.label}
                          >
                            {linkItem?.style === "button" ? (
                              <Button variant="secondary">{linkItem?.label}</Button>
                            ) : (
                              <div>{linkItem?.label}</div>
                            )}
                          </Link>
                        ))}
                      </div>
                    ) : null}
                  </div>
                </div>
              )
            })
          )}
        </div>
      )
    }
    case "gallery":
      return <ImageGallery key={i} {...block} />
    case "coverSection": {
      const backgroundImage = block.backgroundImage ? `${block.backgroundImage}` : "none"
      const backgroundColor =
        block.backgroundColor && block.backgroundColor !== "none"
          ? `var(--${block.backgroundColor})`
          : "#ffffff"
      const backgroundType = block.backgroundType || "image"
      if (backgroundImage !== "none" && backgroundType === "image") {
        return (
          <section key={i} className="relative h-[35vh]" style={{ backgroundColor }}>
            <Image
              alt={block.headline || ""}
              className="size-full object-cover"
              height={1080}
              src={backgroundImage}
              style={{ aspectRatio: "1920/1080", objectFit: "cover" }}
              width={1920}
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900/50">
              <h1 className="px-4 text-center text-4xl font-bold text-white sm:text-5xl md:text-6xl">
                {block.headline || ""}
              </h1>
            </div>
          </section>
        )
      }
      if (backgroundType === "video" && block.backgroundVideo) {
        return (
          <section key={i} className="relative w-full overflow-hidden">
            <BackgroundVideo src={block.backgroundVideo}>
              <h1 className="px-4 text-center text-4xl font-bold text-white drop-shadow-md sm:text-5xl md:text-6xl">
                {block.headline || ""}
              </h1>
            </BackgroundVideo>
          </section>
        )
      }
      return null
    }
    case "featuredPosts":
      return null
    case "pageContent": {
      let bgStyle = block.backgroundColor ? `bg-${block.backgroundColor}` : ""
      let textAlign = block.textAlign ? `text-${block.textAlign}` : "text-left"
      const contentNode = block.content ? await renderBlockRichText(block.content) : null
      return (
        <section key={i} className={`w-full px-4 py-8 ${bgStyle} ${textAlign}`}>
          <div className="container mx-auto">
            <div className="prose max-w-none">{contentNode}</div>
          </div>
        </section>
      )
    }
    default:
      return null
  }
}
