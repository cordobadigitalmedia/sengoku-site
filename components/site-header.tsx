"use client"

import Image from "next/image"
import Link from "next/link"
import { Menu } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ThemeToggle } from "@/components/theme-toggle"
import { Banner } from "./ui/banner"
import type { Header, Nav } from "@/types/content"

export function SiteHeader({
  nav,
  header,
}: {
  nav: Nav
  header: Header
}) {
  return (
    <header className="bg-background sticky top-0 z-40 w-full border-b">
      {header.bannerShow ? (
        <div>
          <Banner
            button={{
              text: header.bannerCTAText ?? "",
              link: header.bannerCTALink ?? "",
            }}
          >
            {header.bannerText}
          </Banner>
        </div>
      ) : null}
      <div className="container flex h-16 items-center">
        <Link href="/" className="flex items-center gap-1">
          <div
            style={{ position: "relative", width: "50px", height: "50px" }}
            className="hover:bg-gray-100"
          >
            {header.logo ? (
              <Image
                src={header.logo}
                alt={header.siteTitle ?? ""}
                sizes="50px"
                fill
                style={{ objectFit: "contain" }}
              />
            ) : null}
          </div>
          {header.logoTitle && (
            <div className="font-crimson">{header.logoTitle}</div>
          )}
        </Link>
        <div
          className={`hidden grow ${
            header.navAlignment ? "justify-end" : ""
          } md:flex`}
        >
          <ul className="flex items-center gap-3 p-6">
            {nav.links?.map((link) => {
              const navLink = link?.link ?? ""
              const isExternal = link?.linkType === "external"
              return (
                <li key={link?.link ?? link?.label} className="row-span-3">
                  <Link href={navLink} target={isExternal ? "_blank" : "_self"}>
                    <Button variant="ghost">{link?.label}</Button>
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-4 md:hidden">
          <Dialog>
            <DialogTrigger asChild className="block md:hidden">
              <Button
                variant="ghost"
                className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
              >
                <Menu className="size-6" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="flex flex-col justify-center py-12 sm:max-w-[425px]">
              {nav.links?.map((link) => {
                const navLink = link?.link ?? ""
                const isExternal = link?.linkType === "external"
                return (
                  <Link
                    key={link?.link ?? link?.label}
                    href={navLink}
                    target={isExternal ? "_blank" : "_self"}
                  >
                    <Button variant="ghost" className="w-full text-lg">
                      {link?.label}
                    </Button>
                  </Link>
                )
              })}
              {header.darkmode && (
                <DialogFooter>
                  <div className="flex w-full justify-center md:hidden">
                    <ThemeToggle />
                  </div>
                </DialogFooter>
              )}
            </DialogContent>
          </Dialog>
          {header.darkmode ? (
            <div className="hidden md:flex">
              <ThemeToggle />
            </div>
          ) : null}
        </div>
      </div>
    </header>
  )
}
