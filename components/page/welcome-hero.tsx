import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { MdxContent } from "@/components/mdx-content"
import type { BlockWelcomeHero } from "@/types/content"

export async function WelcomeHero(props: BlockWelcomeHero) {
  const backgroundColor = props.backgroundColor || "#ffffff"
  const backgroundImage = props.backgroundImage
    ? `${props.backgroundImage}`
    : "none"
  return (
    <>
      <section
        className="relative flex h-[80vh] w-full items-center justify-center"
        style={{ backgroundColor }}
      >
        {backgroundImage !== "none" && (
          <div className="absolute inset-0 overflow-hidden">
            <Image
              alt={props.title || ""}
              className="size-full object-cover opacity-50"
              height={1080}
              src={backgroundImage}
              style={{
                aspectRatio: "1920/1080",
                objectFit: "cover",
              }}
              width={1920}
            />
          </div>
        )}
        <div className="z-5 relative max-w-3xl px-4 text-center">
          <h1 className="text-primary mb-4 text-5xl font-bold">
            {props.title}
          </h1>
          <div
            className="prose prose-custom max-w-none text-xl"
            style={
              {
                "--custom-prose-color": "hsl(var(--secondary))",
              } as React.CSSProperties
            }
          >
            {props.message ? await MdxContent({ source: props.message }) : null}
          </div>
          <div className="flex items-center justify-center gap-5 py-12">
            {props.links?.map((link) => {
              switch (link?.style) {
                case "button": {
                  return (
                    <Link key={link.label} href={link.link || ""}>
                      <Button
                        size="lg"
                        variant={
                          link.buttonColor === "primary"
                            ? "default"
                            : "secondary"
                        }
                      >
                        {link.label}
                      </Button>
                    </Link>
                  )
                }
                case "simple": {
                  return (
                    <Link key={link.label} href={link?.link || ""}>
                      <Button size="lg" variant="ghost">
                        Learn More
                        <ArrowRight className="ml-2 size-4" />
                      </Button>
                    </Link>
                  )
                }
              }
            })}
          </div>
        </div>
      </section>
    </>
  )
}
