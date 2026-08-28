/**
 * Content types for pages, blocks, and global content (nav, header, footer).
 */

export type Seo = {
  title?: string
  description?: string
  keywords?: string
}

export type LinkItem = {
  link?: string
  label?: string
  style?: "simple" | "button"
  buttonColor?: "primary" | "secondary"
}

// Block template names (used by admin block editor and render-page-blocks)
export type BlockPageContent = {
  _template: "pageContent"
  content?: string
  backgroundColor?: string
  textAlign?: "left" | "center" | "right"
}

export type BlockWelcomeHero = {
  _template: "welcomeHero"
  title?: string
  message?: string
  links?: LinkItem[]
  backgroundType?: "image" | "color"
  backgroundImage?: string
  backgroundColor?: string
}

export type BlockCoverSection = {
  _template: "coverSection"
  headline?: string
  backgroundType?: "image" | "video"
  backgroundImage?: string
  backgroundVideo?: string
  backgroundColor?: string
}

export type BlockFeaturedPosts = {
  _template: "featuredPosts"
  Posts?: Array<{
    label?: string
    featuredPost?: {
      _sys?: { filename?: string; breadcrumbs?: string[] }
      title?: string
      image?: string
      description?: string
    }
  }>
}

export type CardBlockItem = {
  headline?: string
  coverimage?: string
  imageFit?: "cover" | "contain"
  content?: string
  links?: LinkItem[]
  backgroundColor?: string
}

export type BlockCardgrid = {
  _template: "cardgrid"
  cardblock?: CardBlockItem[]
  gridTitle?: string
}

export type BlockGallery = {
  _template: "gallery"
  galleryImages?: Array<{
    caption?: string
    galleryImage?: string
    galleryMediaType?: "image" | "video"
  }>
  galleryTitle?: string
}

export type PageBlock =
  | BlockPageContent
  | BlockWelcomeHero
  | BlockCoverSection
  | BlockFeaturedPosts
  | BlockCardgrid
  | BlockGallery

export type Page = {
  id: string
  slug: string
  title: string
  seo?: Seo
  blocks: PageBlock[]
  _sys?: { filename: string }
}

export type Post = {
  id: string
  slug: string
  title: string
  author?: { name?: string; image?: string }
  image?: string
  description?: string
  body: string
  _sys?: { filename: string }
}

export type NavLink = {
  label?: string
  link?: string
  linkedPage?: string
  linkType?: "relative" | "page" | "external"
}

export type Nav = {
  links?: NavLink[]
}

export type Header = {
  logo?: string
  logoTitle?: string
  siteTitle?: string
  siteDescription?: string
  navAlignment?: boolean
  darkmode?: boolean
  userlogin?: boolean
  bannerText?: string
  bannerCTAText?: string
  bannerCTALink?: string
  bannerShow?: boolean
}

export type Footer = {
  social?: {
    facebook?: string
    twitter?: string
    instagram?: string
    github?: string
    youtube?: string
  }
  copyright?: string
  backgroundColor?: string
}
