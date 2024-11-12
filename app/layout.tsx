import { Crimson_Text, Manrope, Noto_Serif } from "next/font/google"

import "@/styles/globals.css"
import "@/styles/styles.css"
import { ThemeProvider } from "@/components/theme-provider"

const crimson_text = Crimson_Text({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-crimson_text",
  weight: ["400", "600", "700"],
})
const manrope = Manrope({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-manrope",
})
const noto_serif = Noto_Serif({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-noto-serif",
})

interface RootLayoutProps {
  children: React.ReactNode
}

export const metadata = {
  metadataBase: new URL("https://sengoku.ca"),
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <>
      <html lang="en" suppressHydrationWarning>
        <head />
        <body
          className={
            crimson_text.variable +
            " " +
            manrope.variable +
            " " +
            noto_serif.variable
          }
        >
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
        </body>
      </html>
    </>
  )
}
