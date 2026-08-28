/**
 * Move the tameshigiri video from a coverSection block into the gallery grid.
 * Only updates the gallery page — cover-section video heroes (e.g. /schedule) are untouched.
 * Run: pnpm tsx scripts/fix-gallery-tameshigiri.ts
 */
import { readFile } from "fs/promises"
import { join } from "path"

import { fixGalleryTameshigiriPage } from "@/lib/fix-gallery-tameshigiri"

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
            if (
              (value.startsWith('"') && value.endsWith('"')) ||
              (value.startsWith("'") && value.endsWith("'"))
            )
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
  const result = await fixGalleryTameshigiriPage()
  console.log("Gallery page updated.")
  console.log(`Removed cover sections: ${result.removedCoverSections}`)
  console.log(`Video present in gallery: ${result.videoPresentInGallery}`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
