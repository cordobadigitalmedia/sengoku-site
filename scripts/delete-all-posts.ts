/**
 * One-off script to delete all posts from the database.
 * Run: pnpm tsx scripts/delete-all-posts.ts
 */
import { readFile } from "fs/promises"
import { join } from "path"

import { neon } from "@neondatabase/serverless"

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

async function main() {
  await loadEnvLocal()
  const databaseUrl = process.env.DATABASE_URL
  if (!databaseUrl) {
    console.error("DATABASE_URL is required (e.g. in .env.local)")
    process.exit(1)
  }
  const sql = neon(databaseUrl)
  await sql`DELETE FROM posts`
  console.log("Deleted all posts.")
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
