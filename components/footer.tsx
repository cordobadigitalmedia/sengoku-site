import React from "react"
import Link from "next/link"
import {
  FacebookIcon,
  GithubIcon,
  InstagramIcon,
  TwitterIcon,
  YoutubeIcon,
} from "lucide-react"

import { buttonVariants } from "@/components/ui/button"
import type { Footer as FooterType } from "@/types/content"

function objectEntriesFilter(
  obj: { [s: string]: unknown } | ArrayLike<unknown>
) {
  return Object.entries(obj)
    .filter(
      ([key, value]) =>
        value !== null &&
        value !== undefined &&
        value !== "" &&
        Object.keys(platformLinks).includes(key)
    )
    .map(([key, value]) => ({ platform: key, handle: value }))
}

const platformLinks: Record<string, string> = {
  github: "https://github.com",
  twitter: "https://twitter.com",
  facebook: "https://facebook.com",
  youtube: "https://youtube.com",
  instagram: "https://instagram.com",
}

type PlatformKey = keyof typeof platformLinks

const getLink = (platform: PlatformKey): string => {
  return platformLinks[platform] ?? ""
}

type SocialIconProps = {
  platform: string
  size?: number
}

function SocialIcon({ platform, size = 24 }: SocialIconProps) {
  const iconProps = {
    size,
    className: "text-gray-700 hover:text-gray-900 transition-colors",
  }

  switch (platform.toLowerCase()) {
    case "twitter":
      return <TwitterIcon {...iconProps} />
    case "facebook":
      return <FacebookIcon {...iconProps} />
    case "instagram":
      return <InstagramIcon {...iconProps} />
    case "github":
      return <GithubIcon {...iconProps} />
    case "youtube":
      return <YoutubeIcon {...iconProps} />
    default:
      return <FacebookIcon {...iconProps} />
  }
}

export function Footer({ footer }: { footer: FooterType }) {
  const year = React.useMemo(() => new Date().getFullYear(), [])
  const social = footer.social ? objectEntriesFilter(footer.social) : null
  let bgStyle = ""
  if (footer.backgroundColor) {
    bgStyle = `bg-${footer.backgroundColor}`
  }
  return (
    <footer className={bgStyle}>
      <div className="mx-auto max-w-7xl px-2 py-4 md:flex md:items-center md:justify-between lg:px-4">
        <div className="mb-2 mt-4 text-center md:my-0 md:text-left">
          <p className="text-sm leading-5 text-gray-800">
            &copy; {year} {footer.copyright}
          </p>
        </div>
        <div className="flex justify-center md:justify-start">
          <nav className="items-center space-x-1">
            {social &&
              social.map((item) => {
                const platformLink = getLink(item.platform as PlatformKey)
                return (
                  <Link
                    href={`${platformLink}/${item?.handle}`}
                    key={platformLink}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <div
                      className={buttonVariants({
                        size: "sm",
                        variant: "ghost",
                      })}
                    >
                      <SocialIcon platform={item.platform} />
                      <span className="sr-only">{item?.platform}</span>
                    </div>
                  </Link>
                )
              })}
          </nav>
        </div>
      </div>
    </footer>
  )
}
