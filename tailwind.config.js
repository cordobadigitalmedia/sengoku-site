const { fontFamily } = require("tailwindcss/defaultTheme")

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: ["app/**/*.{ts,tsx}", "components/**/*.{ts,tsx}"],
  theme: {
    container: {
      center: "true",
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        chart: {
          1: "hsl(var(--chart-1))",
          2: "hsl(var(--chart-2))",
          3: "hsl(var(--chart-3))",
          4: "hsl(var(--chart-4))",
          5: "hsl(var(--chart-5))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: ["var(--font-sans)", ...fontFamily.sans],
        crimson: ["var(--font-crimson_text)"],
        manrope: ["var(--font-manrope)"],
        serif: ["var(--font-noto-serif)"],
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      typography: (theme) => ({
        custom: {
          css: {
            "--tw-prose-body": "var(--custom-prose-color)",
            "--tw-prose-headings": "var(--custom-prose-color)",
            "--tw-prose-lead": "var(--custom-prose-color)",
            "--tw-prose-links": "var(--custom-prose-color)",
            "--tw-prose-bold": "var(--custom-prose-color)",
            "--tw-prose-counters": "var(--custom-prose-color)",
            "--tw-prose-bullets": "var(--custom-prose-color)",
            "--tw-prose-hr": "var(--custom-prose-color)",
            "--tw-prose-quotes": "var(--custom-prose-color)",
            "--tw-prose-quote-borders": "var(--custom-prose-color)",
            "--tw-prose-captions": "var(--custom-prose-color)",
            "--tw-prose-code": "var(--custom-prose-color)",
            "--tw-prose-pre-code": "var(--custom-prose-color)",
            "--tw-prose-pre-bg": "var(--custom-prose-color)",
            "--tw-prose-th-borders": "var(--custom-prose-color)",
            "--tw-prose-td-borders": "var(--custom-prose-color)",
          },
        },
      }),
    },
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
}
