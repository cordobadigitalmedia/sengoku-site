import "server-only"

import { readFile } from "fs/promises"
import matter from "gray-matter"
import { join } from "path"

import type { Footer, Header, Nav } from "@/types/content"

const contentDir = join(process.cwd(), "content")

async function readJson<T>(path: string): Promise<T> {
  const full = join(contentDir, path)
  const raw = await readFile(full, "utf-8")
  return JSON.parse(raw) as T
}

async function readMdFrontmatter<T>(path: string): Promise<T> {
  const full = join(contentDir, path)
  const raw = await readFile(full, "utf-8")
  return matter(raw).data as T
}

export async function getNav(): Promise<Nav> {
  const data = await readMdFrontmatter<{ links?: Nav["links"] }>("nav/nav.md")
  const links = data.links?.map((link) => {
    const pagePath = link.linkedPage
    const slug = pagePath
      ? pagePath.replace("content/pages/", "").replace(".mdx", "")
      : undefined
    return {
      ...link,
      link: link.linkType === "page" && slug ? `/${slug}` : link.link,
    }
  })
  return { links }
}

export async function getHeader(): Promise<Header> {
  return readJson<Header>("header/header.json")
}

export async function getFooter(): Promise<Footer> {
  return readJson<Footer>("footer/footer.json")
}
