import type {
  Article,
  BreadcrumbList,
  FAQPage,
  HowTo,
  WithContext,
} from "schema-dts"

interface ArticleJsonLdProps {
  title: string
  description: string
  publishedDate?: string
  modifiedDate?: string
  authorName?: string
  imageUrl?: string
  articleSection?: string
  keywords?: string
  url: string
}

interface BusinessJsonLdProps {
  title: string
  description: string
  publishedDate?: string
  modifiedDate?: string
  authorName?: string
  imageUrl?: string
  articleSection?: string
  keywords?: string
  url: string
}

interface FAQJsonLdProps {
  faqs: Array<{
    question: string
    answer: string
  }>
}

interface BreadcrumbJsonLdProps {
  items: Array<{
    label: string
    href: string
  }>
  baseUrl?: string
}

interface HowToJsonLdProps {
  name: string
  description: string
  totalTime?: string
  steps: Array<{
    name: string
    text: string
    url?: string
    imageUrl?: string
  }>
}

export function ArticleJsonLd({
  title,
  description,
  publishedDate,
  modifiedDate,
  authorName = "Sengoku Martial Arts",
  imageUrl,
  articleSection = "Martial Arts",
  keywords = "",
  url,
}: ArticleJsonLdProps) {
  const jsonLd: WithContext<Article> = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description: description,
    image: imageUrl,
    author: {
      "@type": "Person",
      name: authorName,
    },
    publisher: {
      "@type": "Organization",
      name: "Sengoku Martial Arts",
      logo: {
        "@type": "ImageObject",
        url: "https://sengoku.ca/images/logo.png",
      },
    },
    datePublished: publishedDate || new Date().toDateString(),
    dateModified: modifiedDate || new Date().toDateString(),
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
    keywords: keywords,
    articleSection: articleSection,
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(jsonLd),
      }}
    />
  )
}

export function FAQJsonLd({ faqs }: FAQJsonLdProps) {
  const jsonLd: WithContext<FAQPage> = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(jsonLd),
      }}
    />
  )
}

export function BreadcrumbJsonLd({
  items,
  baseUrl = "https://sengokua.ca",
}: BreadcrumbJsonLdProps) {
  const jsonLd: WithContext<BreadcrumbList> = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.label,
      item: `${baseUrl}${item.href}`,
    })),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(jsonLd),
      }}
    />
  )
}

export function HowToJsonLd({
  name,
  description,
  totalTime,
  steps,
}: HowToJsonLdProps) {
  const jsonLd: WithContext<HowTo> = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: name,
    description: description,
    totalTime: totalTime,
    step: steps.map((step, index) => ({
      "@type": "HowToStep",
      position: index + 1,
      name: step.name,
      text: step.text,
      url: step.url,
      image: step.imageUrl,
    })),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(jsonLd),
      }}
    />
  )
}

export function BusinessJsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "MartialArtsSchool",
    name: "Sengoku Martial Arts",
    image: "https://www.sengoku.ca/logo.jpg",
    url: "https://www.sengoku.ca",
    telephone: ["+18254402547", "+17806672705"],
    email: "sengokumartialartscenter@gmail.com",
    description:
      "Traditional Japanese Bujutsu and Kung Fu martial arts training in St. Albert, serving both St. Albert and Edmonton areas since 1991.",
    address: {
      "@type": "PostalAddress",
      streetAddress: "33 Rayborn Crescent",
      addressLocality: "St. Albert",
      addressRegion: "Alberta",
      postalCode: "T8N 0Z2",
      addressCountry: "CA",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: "53.6335",
      longitude: "-113.6258",
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Wednesday", "Friday"],
        opens: "18:00",
        closes: "21:00",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Tuesday", "Thursday"],
        opens: "18:30",
        closes: "20:30",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: "Saturday",
        opens: "10:00",
        closes: "12:00",
      },
    ],
    priceRange: "$$",
    currenciesAccepted: "CAD",
    paymentAccepted: "Cash, Credit Card",
    areaServed: ["St. Albert", "Edmonton"],
    sameAs: [
      "https://www.facebook.com/sengokumartialarts",
      "https://www.instagram.com/sengokumartialarts",
    ],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Martial Arts Classes",
      itemListElement: [
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Kudoshin Sogo Ryu Bujutsu Classes",
            description:
              "Traditional Japanese martial arts including unarmed techniques, sword use, and more.",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Ladies Self Defense",
            description:
              "Self-defense courses specifically designed for women.",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Ladies Traditional Jujutsu Classes",
            description:
              "Women-only classes accommodating religious and personal preferences.",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Traditional Kung Fu",
            description: "Authentic Kung Fu training for all skill levels.",
          },
        },
      ],
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(jsonLd),
      }}
    />
  )
}
