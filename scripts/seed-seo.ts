/**
 * Generate and save SEO title, description, and keywords for all pages.
 * Run: pnpm tsx scripts/seed-seo.ts
 */
import { readFile } from "fs/promises"
import { join } from "path"

import { neon } from "@neondatabase/serverless"

const SITE = "Sengoku Martial Arts"
const LOCATION = "St. Albert"

type SeoRow = { slug: string; title: string }

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
    .catch(() => {})
}

function getSeoForPage(slug: string, pageTitle: string): { title: string; description: string; keywords: string } {
  const base = `${SITE} | ${LOCATION}`
  const slugLower = slug.toLowerCase()

  const bySlug: Record<string, { title: string; description: string; keywords: string }> = {
    home: {
      title: `${SITE} | Traditional Martial Arts in ${LOCATION}`,
      description: `${SITE} offers traditional martial arts training in ${LOCATION}. Join our dojo for kung fu, self-defence, and more.`,
      keywords: `martial arts ${LOCATION}, kung fu, dojo, Sengoku, traditional martial arts, St. Albert`,
    },
    contact: {
      title: `Contact Us | ${base}`,
      description: `Get in touch with ${SITE} in ${LOCATION}. Find our address, hours, and contact details.`,
      keywords: `contact ${SITE}, ${LOCATION} dojo, martial arts contact, Sengoku`,
    },
    location: {
      title: `Location & Map | ${base}`,
      description: `Find ${SITE} at 33 Rayborn Crescent, ${LOCATION}. View map and directions to our dojo.`,
      keywords: `${SITE} location, ${LOCATION} dojo address, map, directions, Rayborn Crescent`,
    },
    gallery: {
      title: `Photo Gallery | ${SITE}`,
      description: `Photos from ${SITE} dojo—training, events, and our community in ${LOCATION}.`,
      keywords: `${SITE} gallery, dojo photos, martial arts ${LOCATION}, training photos`,
    },
    schedule: {
      title: `Class Schedule | ${base}`,
      description: `View the class schedule for ${SITE} in ${LOCATION}. Find times for kung fu and martial arts classes.`,
      keywords: `martial arts class schedule, ${LOCATION}, kung fu times, training schedule, Sengoku classes`,
    },
    arts: {
      title: `Martial Arts We Offer | ${SITE}`,
      description: `Discover the martial arts taught at Sengoku—Kudoshin Sogo Ryu Bujutsu, kung fu, and more in ${LOCATION}.`,
      keywords: `martial arts styles, Kudoshin Sogo Ryu, kung fu, Sengoku ${LOCATION}, bujutsu`,
    },
    "special-classes": {
      title: `Special Classes & Workshops | ${base}`,
      description: `Special classes and workshops at ${SITE} in ${LOCATION}. Enhance your training with focused sessions.`,
      keywords: `special martial arts classes, workshops, ${LOCATION}, Sengoku, martial arts workshops`,
    },
    "classes-kungfu": {
      title: `Kung Fu & Taiji Classes | ${base}`,
      description: `Kung fu and Taiji (Tai Chi) classes at ${SITE} in ${LOCATION}. Traditional Chinese martial arts for all levels.`,
      keywords: `kung fu ${LOCATION}, Taiji, Tai Chi, martial arts classes, Sengoku, St. Albert`,
    },
  }

  const exact = bySlug[slugLower] ?? bySlug[slug]
  if (exact) return exact

  const title = pageTitle ? `${pageTitle} | ${base}` : base
  const description = `${pageTitle || SITE} at ${SITE} in ${LOCATION}. Traditional martial arts training and community.`
  const keywords = `martial arts ${LOCATION}, Sengoku, ${(pageTitle || slug).replace(/-/g, " ")}, dojo St. Albert`
  return { title, description, keywords }
}

async function main() {
  await loadEnvLocal()
  const databaseUrl = process.env.DATABASE_URL
  if (!databaseUrl) {
    console.error("DATABASE_URL is required (e.g. in .env.local)")
    process.exit(1)
  }
  const sql = neon(databaseUrl)
  const pages = (await sql`SELECT slug, title FROM pages`) as SeoRow[]

  for (const row of pages) {
    const seo = getSeoForPage(row.slug, row.title)
    await sql`
      UPDATE pages
      SET seo = ${JSON.stringify(seo)}::jsonb
      WHERE slug = ${row.slug}
    `
    console.log(`${row.slug}: ${seo.title.slice(0, 50)}…`)
  }
  console.log(`\nUpdated SEO for ${pages.length} page(s).`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
