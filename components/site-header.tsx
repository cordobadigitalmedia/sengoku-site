"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { PageAndNavQuery } from "@/tina/__generated__/types"
import { Menu } from "lucide-react"
import { tinaField } from "tinacms/dist/react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ThemeToggle } from "@/components/theme-toggle"

import { Banner } from "./ui/banner"

export function SiteHeader({
  nav,
  header,
}: {
  nav: PageAndNavQuery["nav"]
  header: PageAndNavQuery["header"]
}) {
  return (
    <header className="bg-background sticky top-0 z-40 w-full border-b">
      {header.bannerShow ? (
        <div data-tina-field={tinaField(header, "bannerText")}>
          <Banner
            button={{
              text: header.bannerCTAText as string,
              link: header.bannerCTALink as string,
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
            data-tina-field={header.logo && tinaField(header, "logo")}
          >
            <Image
              src={header.logo || ""}
              alt={header.siteTitle || ""}
              sizes="50px"
              fill
              style={{
                objectFit: "contain",
              }}
            />
          </div>
          {header.logoTitle && (
            <div
              className="font-crimson"
              data-tina-field={header.logo && tinaField(header, "logoTitle")}
            >
              {header.logoTitle}
            </div>
          )}
        </Link>
        <div
          className={`hidden grow ${
            Boolean(header.navAlignment) && `justify-end`
          } md:flex`}
        >
          <ul className="flex items-center gap-3 p-6">
            {nav.links?.map((link) => {
              let navLink = ""
              let isExternal = false
              if (link?.linkType === "page") {
                navLink =
                  "/" + link.linkedPage?._sys.breadcrumbs.join("/") || ""
              }
              if (link?.linkType === "relative") {
                navLink = link.link || ""
              }
              if (link?.linkType === "external") {
                navLink = link.link || ""
                isExternal = true
              }
              return (
                <li
                  data-tina-field={link && tinaField(link, "label")}
                  key={link?.link}
                  className="row-span-3"
                >
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
                let navLink = ""
                let isExternal = false
                if (link?.linkType === "page") {
                  navLink = link.linkedPage?._sys.breadcrumbs.join("/") || ""
                }
                if (link?.linkType === "relative") {
                  navLink = link.link || ""
                }
                if (link?.linkType === "external") {
                  navLink = link.link || ""
                  isExternal = true
                }
                return (
                  <Link
                    key={link?.link}
                    href={navLink}
                    target={isExternal ? "_blank" : "_self"}
                    data-tina-field={link && tinaField(link, "label")}
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
          {header.darkmode && (
            <div className="hidden md:flex">
              <ThemeToggle />
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
