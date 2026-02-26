# Plan: WYSIWYG Page Editor & Block Management

## Goal

Replace the raw JSON block editor with a visual block manager and WYSIWYG (TipTap) for all rich-text fields, plus client-side image upload (Vercel Blob) for image fields. No new page or site-wide editing—only editing existing pages and their blocks.

---

## Current state

- **Page editor** (`app/admin/pages/[slug]/page-editor.tsx`): Title, SEO fields, and a single textarea with the full `blocks` JSON.
- **Block types** (from `types/content.ts`): `pageContent`, `welcomeHero`, `coverSection`, `cardgrid`, `gallery`, `featuredPosts`.
- **Rendering** (`components/render-page-blocks.tsx`): Each block is rendered by type; rich-text fields use `MdxContent({ source })` (MDX/markdown).

---

## Phase 1: Block list UI (manage blocks)

**Objective:** Replace the JSON textarea with a list of blocks that can be added, removed, and reordered.

### 1.1 State and actions

- Keep `blocks: PageBlock[]` in React state (initialized from `page.blocks`).
- **Add block:** Button or dropdown to append a new block. User picks template: `pageContent` | `welcomeHero` | `coverSection` | `cardgrid` | `gallery` | `featuredPosts`. New block gets `_template` and default empty fields.
- **Remove block:** Delete button per block (confirm or undo).
- **Reorder:** Drag-and-drop (e.g. `@dnd-kit/core` or native HTML5 drag) or simple “Move up” / “Move down” buttons.
- **Save:** Same as now—on submit, call `updatePage(page.slug, { title, seo, blocks })` with the current `blocks` array.

### 1.2 UI layout

- Page-level fields (Title, SEO description, SEO keywords) stay at the top.
- **Blocks section:** For each block, show a card with:
  - Block type label (e.g. “Welcome hero”, “Card grid”).
  - Collapsed summary (e.g. first line of content or title).
  - Actions: Edit (expand), Move up, Move down, Delete.
- **“Add block”** button at the bottom (or between blocks) opens a type picker, then inserts the new block and expands it for editing.

### 1.3 Deliverables

- `BlockList` (or `BlockManager`) component: renders the list, handles add/remove/reorder and passes block data + onChange into per-block editors.
- Default “empty” shape for each block type so new blocks are valid.

---

## Phase 2: Per-block WYSIWYG and image upload

**Objective:** For each block type, replace raw text/markdown with the existing WYSIWYG (`RichTextEditor`) and add image upload where needed. Store rich text as **HTML** (same as posts) for consistency.

### 2.1 Field mapping

| Block type       | Rich-text (WYSIWYG)     | Image (upload to Blob)              | Other fields (inputs/selects)                    |
|------------------|--------------------------|-------------------------------------|--------------------------------------------------|
| **pageContent**  | `content`                | —                                   | `backgroundColor`, `textAlign`                   |
| **welcomeHero**  | `message`                | `backgroundImage`                   | `title`, `links[]`, `backgroundType`, `backgroundColor` |
| **coverSection** | `content`                | `backgroundImage`, `backgroundVideo`| `headline`, `backgroundType`, `backgroundColor`  |
| **cardgrid**     | each `cardblock[].content`| each `cardblock[].coverimage`        | `gridTitle`, card `headline`, `links[]`, etc.    |
| **gallery**      | —                        | each `galleryImages[].galleryImage` | `galleryTitle`, `galleryImages[].caption`        |
| **featuredPosts**| —                        | (post image is reference, not upload)| `Posts[]`: label + post picker (slug or select)  |

### 2.2 Shared components

- **RichTextEditor** (existing): Use for every field in the table above that is “Rich-text (WYSIWYG)”. Content is stored as HTML.
- **Image upload control** (existing pattern): Same as post editor—input for URL plus “Upload” button that calls `upload()` from `@vercel/blob/client` with `handleUploadUrl: "/api/blob-upload"`, then set the field to `blob.url`. Reuse in:
  - Welcome hero background
  - Cover section background image/video URL (or separate upload for video file if you support it)
  - Card grid item cover image
  - Gallery item image

### 2.3 Per-block editor components

Create one editor component per block type (or one `BlockEditor` that switches on `block._template`):

- **PageContentBlockEditor**: `content` → RichTextEditor, `backgroundColor` / `textAlign` → select or buttons.
- **WelcomeHeroBlockEditor**: `title` (input), `message` (RichTextEditor), `links` (small list: label, link, style, buttonColor), `backgroundType` (image | color), `backgroundImage` (URL + Upload), `backgroundColor` (color input).
- **CoverSectionBlockEditor**: `headline`, `content` (RichTextEditor), `backgroundType`, `backgroundImage` / `backgroundVideo` (URL + Upload), `backgroundColor`.
- **CardgridBlockEditor**: `gridTitle`; list of cards, each: `headline`, `coverimage` (URL + Upload), `content` (RichTextEditor), `links[]`, `backgroundColor`, `imageFit`.
- **GalleryBlockEditor**: `galleryTitle`; list of items: image (URL + Upload), caption.
- **FeaturedPostsBlockEditor**: List of items: label, featured post (e.g. select from `getPostsForList()` or slug input). No WYSIWYG; optional image override if you add it later.

Each editor receives `block`, `onChange(updatedBlock)`, and optionally `onRemove`.

### 2.4 Data format for rich text in blocks

- **Storage:** Store HTML in `content` / `message` fields when edited with WYSIWYG (same as post body).
- **Backward compatibility:** Existing blocks may still have markdown. Rendering (Phase 3) will support both.

### 2.5 Deliverables

- One editor component per block type (or a single `BlockEditor` that delegates).
- All rich-text fields use `RichTextEditor`; all image fields use the shared “URL + Upload” pattern.
- Block list still saves `blocks: PageBlock[]` via `updatePage`; no API or DB schema change.

---

## Phase 3: Front-end rendering for HTML block content

**Objective:** When a block’s `content` or `message` is HTML (from WYSIWYG), render it safely instead of passing to MDX.

### 3.1 Detection and rendering

- Reuse the same approach as `components/post-body.tsx`: if the string looks like HTML (e.g. `trim().startsWith('<')` and contains `</` or `/>`), treat as HTML; otherwise treat as MDX/markdown.
- Add a small helper (e.g. `renderBlockRichText(source: string)`) that:
  - If HTML: sanitize with `sanitize-html` (same options as post body) and return a React node (e.g. `<div className="prose …" dangerouslySetInnerHTML={{ __html: clean }} />`).
  - If not HTML: return `await MdxContent({ source })` as today.

### 3.2 Where to use it

In `components/render-page-blocks.tsx`, replace every `MdxContent({ source: block.message })` / `MdxContent({ source: block.content })` / `MdxContent({ source: item.content })` with the new helper so that:

- Existing markdown/MDX blocks keep working.
- New or edited blocks with HTML from the WYSIWYG render correctly.

### 3.3 Deliverables

- `renderBlockRichText(source: string): Promise<ReactNode>` (or similar) used by `renderPageBlock` for all block content/message fields.
- No change to block data shape or admin save flow.

---

## Phase 4: Polish and optional enhancements

- **Collapse/expand:** Allow collapsing block cards so the list is scannable on long pages.
- **Preview:** Optional “Preview” tab or modal that renders the current blocks (e.g. same `renderPageBlock` on the client with a read-only view or iframe).
- **Links editor:** For `links[]` in welcomeHero and cardgrid, a small inline editor (label, URL, style, button color) with add/remove row.
- **Featured posts:** If needed, a dropdown of existing posts (from `getPostsForList()`) instead of free-text slug.

---

## Implementation order

1. **Phase 1** – Block list UI (add/remove/reorder, type picker, state → `updatePage`). Keep editing each block as JSON for now or minimal inputs so you can test the flow.
2. **Phase 3** – Add `renderBlockRichText` and switch block rendering to it (HTML vs MDX). Ensures new WYSIWYG content will display before you rely on it.
3. **Phase 2** – Implement per-block editors with RichTextEditor and image upload; wire them into the block list from Phase 1.
4. **Phase 4** – Collapse/expand, preview, links editor, featured-post picker as needed.

---

## Files to add or change (summary)

| Area              | Action |
|-------------------|--------|
| `app/admin/pages/[slug]/page-editor.tsx` | Replace JSON textarea with BlockList + block editors; keep title/SEO and `updatePage` call. |
| `components/admin/block-list.tsx`        | New: list of blocks, add/remove/reorder, type picker. |
| `components/admin/block-editors/*.tsx`  | New: one editor per block type (or single BlockEditor). |
| `components/render-page-blocks.tsx`      | Use new `renderBlockRichText()` for every content/message field. |
| `lib/block-rich-text.tsx` (or similar)   | New: `renderBlockRichText(source)` (HTML vs MDX + sanitize). |
| Existing `RichTextEditor`, `upload`/`/api/blob-upload` | Reuse as-is. |

---

## Out of scope (by design)

- Creating new pages or changing site structure.
- Site-wide or template-level editing.
- Changing the block type definitions or the way blocks are stored (still JSON array in `pages.blocks`).
