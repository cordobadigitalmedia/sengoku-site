import type { ReactElement } from "react"
import Image from "next/image"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { MdxContent } from "@/components/mdx-content"
import type { BlockCardgrid } from "@/types/content"

type ObjectFitValue = "fill" | "contain" | "cover" | "none" | "scale-down"

export async function CardGrid(props: BlockCardgrid): Promise<ReactElement> {
  const { cardblock } = props
  return (
    <>
      {cardblock && cardblock.length > 0 && (
        <div className="container mx-auto grid grid-cols-1 gap-8 p-4 sm:grid-cols-2">
          {await Promise.all(
            cardblock.map(async (item, i) => {
              const backgroundImage = item?.coverimage
                ? `${item.coverimage}`
                : "none"
              return (
                <div
                  className="overflow-hidden rounded-lg bg-white shadow-md"
                  key={item?.headline ?? i}
                >
                  {backgroundImage !== "none" && (
                    <Image
                      alt={item?.headline ?? ""}
                      className="h-[250px] w-full object-cover sm:h-[400px]"
                      height={300}
                      src={backgroundImage}
                      style={{
                        aspectRatio: "400/300",
                        objectFit: item?.imageFit
                          ? (item.imageFit as ObjectFitValue)
                          : "contain",
                      }}
                      width={400}
                    />
                  )}

                  <div className="p-4">
                    <h3 className="mb-2 text-xl font-bold">
                      {item?.headline ?? ""}
                    </h3>
                    <div className="prose mb-4 text-gray-600">
                      {item?.content
                        ? await MdxContent({ source: item.content })
                        : null}
                    </div>
                    {item?.links && item.links.length > 0 ? (
                      <div className="flex items-center justify-end gap-2">
                        {item.links.map((linkItem) => (
                          <Link
                            href={linkItem?.link ?? ""}
                            key={linkItem?.link ?? linkItem?.label}
                          >
                            {linkItem?.style === "button" ? (
                              <Button variant="secondary">
                                {linkItem?.label}
                              </Button>
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
      )}
    </>
  )
}
