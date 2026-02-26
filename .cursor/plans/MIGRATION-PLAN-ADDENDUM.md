# Migration plan addendum: design, env, and best practices

Merge these into the main Tina → Neon + Clerk migration plan. Clerk and Neon env will be provided by you.

---

## Env

- **Clerk and Neon env vars** will be provided by you. Implementation only needs to reference:
  - `DATABASE_URL` (Neon)
  - Clerk vars (e.g. `NEXT_PUBLIC_CLERK_*`, `CLERK_SECRET_KEY`)

---

## Design and style preservation (mandatory)

- **No visual or layout changes.** The public site must look and behave exactly as it does today.
- **Keep unchanged**: All existing components (SiteHeader, Footer, block components, `components/page/components.jsx`), Tailwind classes, layout structure, typography, colors, and responsive behavior.
- **Only change**: Data source (Tina → Neon), removal of Tina edit overlays, and replacement of `TinaMarkdown` with a markdown/MDX renderer that uses the **same** custom components (Youtube, Googlemap, Alert, Button, link handling) so output HTML and styling stay identical.
- **Types**: New TypeScript types for blocks and posts must match current shapes so component props and rendered output are unchanged. Do not rename props or change structure.

---

## Performance and best practices

Implementation must follow **Vercel React Best Practices**, **Next.js Best Practices**, and **Next.js Cache Components** (Next 16+ where applicable).

### Eliminating waterfalls (critical)

- **async-parallel**: Fetch page + nav + header + footer in parallel (e.g. `Promise.all([getPageBySlug(slug), getNav(), getHeader(), getFooter()])`) instead of sequential awaits. Same for blog list (posts + nav + header + footer).
- **async-suspense-boundaries**: Use Suspense only where needed for streaming; prefer parallel data in Server Components so the shell is not blocked.

### Bundle and server

- **bundle-barrel-imports**: Import from concrete files (e.g. `@/components/page/card-grid`) not barrel `@/components` where it would pull in extra code.
- **bundle-dynamic-imports**: Load admin UI (e.g. rich editor, drag-and-drop) with `next/dynamic` so it is not in the main public bundle.
- **server-auth-actions**: In Server Actions that update content, call `auth()` and enforce admin role (e.g. `sessionClaims?.metadata?.role === "admin"`) before any DB write.
- **server-cache-react**: Use `React.cache()` for the data-layer functions (e.g. `getPageBySlug`, `getNav`) so duplicate calls in the same request are deduped.
- **server-serialization**: Pass only the data needed to client components; avoid passing large or redundant objects across the server/client boundary.

### Next.js conventions

- **Async APIs**: Use async `params` and `searchParams` (Next 15+); `await params` in pages and in `generateMetadata` / `generateStaticParams`.
- **RSC default**: Keep pages and layouts as Server Components; use `'use client'` only where required (e.g. admin forms, reorder UI, or components using hooks).
- **Data patterns**: No client-side fetching for public content; fetch in Server Components. Prefer Server Actions for mutations from admin forms.
- **Error handling**: Use `notFound()` when page/post slug is missing; use `forbidden()` / `unauthorized()` in admin when auth fails.
- **Images**: Keep using `next/image` for all images; existing usage in block components and blog post stays as-is.

### Cache components (Next.js 16+)

- **use cache for content**: Wrap read-only content fetchers in `'use cache'` (e.g. `getPageBySlug`, `getPostBySlug`, `getPostsForList`, `getNav`, `getHeader`, `getFooter`) with `cacheLife('hours')` or similar and `cacheTag('pages')`, `cacheTag('posts')`, `cacheTag('nav')`, etc.
- **Cache invalidation on edit**: In Server Actions that update a page or post, call `updateTag(\`page-${id}\`)` or `revalidateTag('posts')` so the next request sees fresh data.
- **No runtime APIs in use cache**: Do not use `cookies()` or `headers()` inside `'use cache'` functions; pass request-specific values as arguments or keep those reads outside cached functions.
- **Migration note**: If the project is not yet on Next 16, use `revalidate` or `unstable_cache` as per current Next docs; when upgrading to 16, migrate to `use cache` and `cacheTag`.

### Re-render and client (admin only)

- **rerender-memo**: In admin, memoize expensive list items (e.g. block rows) if needed; avoid memo for trivial primitives.
- **client**: If admin uses client-side data (e.g. SWR for a preview), use SWR for dedup; keep public site fully server-rendered.
