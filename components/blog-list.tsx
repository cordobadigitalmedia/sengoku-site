import Image from "next/image"
import Link from "next/link"
import { PostConnectionQuery } from "@/tina/__generated__/types"
import { tinaField } from "tinacms/dist/react"

export function BlogList(props: PostConnectionQuery) {
  const posts = props.postConnection.edges
  return (
    <>
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="order-1 col-span-2 grid grid-cols-1 gap-8 lg:-order-1 lg:grid-cols-2">
          {posts?.map((edge, i) => {
            const post = edge?.node
            if (!post) {
              return null
            }
            return (
              <Link
                key={post._sys.breadcrumbs.join("/")}
                data-tina-field={tinaField(post, "id")}
                href={`/blog/${post._sys.breadcrumbs.join("/")}`}
                className={`bg-card grid grid-cols-1 overflow-hidden rounded-lg shadow-md`}
              >
                <div className="relative col-span-1 px-8 pb-16 pt-8">
                  <h2
                    data-tina-field={tinaField(post, "title")}
                    id="featured-post"
                    className="text-card-foreground relative line-clamp-2 text-2xl font-bold"
                  >
                    {post.title}
                  </h2>
                  <p
                    data-tina-field={tinaField(post, "description")}
                    className="text-primary mt-8 line-clamp-2 text-lg leading-8"
                  >
                    {post.description}
                  </p>
                  <div className="absolute inset-x-0 bottom-0 z-10 flex translate-y-1/2 justify-center">
                    <div
                      data-tina-field={
                        post.author && tinaField(post.author, "image")
                      }
                      className="ring-card relative size-20 overflow-hidden rounded-full ring-4 md:ring-8"
                    >
                      <Image
                        fill={true}
                        className="object-cover"
                        alt=""
                        src={post.author?.image || ""}
                      />
                    </div>
                  </div>
                </div>
                <div className="relative min-h-[150px]">
                  <Image
                    fill={true}
                    className="absolute inset-0 object-cover"
                    alt=""
                    src={post.image || ""}
                  />
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </>
  )
}
