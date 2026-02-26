/**
 * One-time script to migrate content/pages/*.mdx and content/posts/*.mdx into Neon.
 * Run: pnpm db:migrate:content (loads .env.local automatically)
 */
import { readFile, readdir } from "fs/promises"
import { join } from "path"

import { neon } from "@neondatabase/serverless"
import matter from "gray-matter"

function loadEnvLocal() {
  const envPath = join(process.cwd(), ".env.local")
  return readFile(envPath, "utf-8")
    .then((envContent) => {
      for (const line of envContent.split("\n")) {
        const trimmed = line.trim()
        if (trimmed && !trimmed.startsWith("#")) {
          const eq = trimmed.indexOf("=")
          if (eq > 0) {
            const key = trimmed.slice(0, eq).trim()
            let value = trimmed.slice(eq + 1).trim()
            if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'")))
              value = value.slice(1, -1)
            process.env[key] = value
          }
        }
      }
    })
    .catch(() => { /* .env.local optional if DATABASE_URL already set */ })
}

const contentDir = join(process.cwd(), "content")
const pagesDir = join(contentDir, "pages")
const postsDir = join(contentDir, "posts")

async function migrate() {
  await loadEnvLocal()
  const databaseUrl = process.env.DATABASE_URL
  if (!databaseUrl) {
    console.error("DATABASE_URL is required")
    process.exit(1)
  }

  const sql = neon(databaseUrl)

  // Ensure tables exist (run migrations first: pnpm drizzle-kit push)
  const pageFiles = await readdir(pagesDir).then((f) => f.filter((f) => f.endsWith(".mdx")))
  const postFiles = await readdir(postsDir).then((f) => f.filter((f) => f.endsWith(".mdx")))

  for (const file of pageFiles) {
    const slug = file.replace(/\.mdx$/, "")
    const raw = await readFile(join(pagesDir, file), "utf-8")
    const { data: frontmatter } = matter(raw)
    const title = frontmatter.title ?? slug
    const seo = frontmatter.seo ? { description: frontmatter.seo.description, keywords: frontmatter.seo.keywords } : null
    const blocks = Array.isArray(frontmatter.blocks) ? frontmatter.blocks : []
    await sql`
      INSERT INTO pages (slug, title, seo, blocks)
      VALUES (${slug}, ${title}, ${seo ? JSON.stringify(seo) : null}, ${JSON.stringify(blocks)})
      ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title, seo = EXCLUDED.seo, blocks = EXCLUDED.blocks
    `
    console.log("Page:", slug)
  }

  for (const file of postFiles) {
    const slug = file.replace(/\.mdx$/, "")
    const raw = await readFile(join(postsDir, file), "utf-8")
    const { data: frontmatter, content } = matter(raw)
    const title = frontmatter.title ?? slug
    const image = frontmatter.image ?? null
    const description = frontmatter.description ?? null
    const body = content?.trim() ?? ""
    await sql`
      INSERT INTO posts (slug, title, image, description, body)
      VALUES (${slug}, ${title}, ${image}, ${description}, ${body})
      ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title, image = EXCLUDED.image, description = EXCLUDED.description, body = EXCLUDED.body
    `
    console.log("Post:", slug)
  }

  console.log("Migration done.")
}

migrate().catch((e) => {
  console.error(e)
  process.exit(1)
})
