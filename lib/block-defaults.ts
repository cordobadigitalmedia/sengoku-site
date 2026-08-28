import type {
  BlockCardgrid,
  BlockCoverSection,
  BlockGallery,
  BlockPageContent,
  BlockWelcomeHero,
  PageBlock,
} from "@/types/content"

export const BLOCK_TYPE_LABELS: Record<PageBlock["_template"], string> = {
  pageContent: "Page content",
  welcomeHero: "Welcome hero",
  coverSection: "Cover section",
  cardgrid: "Card grid",
  gallery: "Gallery",
  featuredPosts: "Featured posts",
}

export const BLOCK_TEMPLATES = [
  "pageContent",
  "welcomeHero",
  "coverSection",
  "cardgrid",
  "gallery",
] as const

function createPageContent(): BlockPageContent {
  return { _template: "pageContent", content: "", textAlign: "left" }
}

function createWelcomeHero(): BlockWelcomeHero {
  return {
    _template: "welcomeHero",
    title: "",
    message: "",
    links: [],
    backgroundType: "color",
    backgroundColor: "#ffffff",
  }
}

function createCoverSection(): BlockCoverSection {
  return {
    _template: "coverSection",
    headline: "",
    backgroundType: "image",
    backgroundColor: "#ffffff",
  }
}

function createCardgrid(): BlockCardgrid {
  return { _template: "cardgrid", gridTitle: "", cardblock: [] }
}

function createGallery(): BlockGallery {
  return { _template: "gallery", galleryTitle: "", galleryImages: [] }
}

export function createDefaultBlock(template: PageBlock["_template"]): PageBlock {
  switch (template) {
    case "pageContent":
      return createPageContent()
    case "welcomeHero":
      return createWelcomeHero()
    case "coverSection":
      return createCoverSection()
    case "cardgrid":
      return createCardgrid()
    case "gallery":
      return createGallery()
    case "featuredPosts":
      return createPageContent()
    default:
      return createPageContent()
  }
}

/** One-line summary for block list card */
export function blockSummary(block: PageBlock): string {
  switch (block._template) {
    case "pageContent":
      return block.content?.replace(/<[^>]+>/g, "").slice(0, 50) || "Empty content"
    case "welcomeHero":
      return block.title || "Welcome hero"
    case "coverSection":
      return block.headline || "Cover section"
    case "cardgrid":
      return block.gridTitle || `${block.cardblock?.length ?? 0} cards`
    case "gallery":
      return block.galleryTitle || `${block.galleryImages?.length ?? 0} items`
    case "featuredPosts":
      return `${block.Posts?.length ?? 0} featured posts`
    default:
      return "Block"
  }
}
