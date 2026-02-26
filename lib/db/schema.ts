import { jsonb, pgTable, text, uuid } from "drizzle-orm/pg-core"

export const pages = pgTable("pages", {
  id: uuid("id").primaryKey().defaultRandom(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  seo: jsonb("seo").$type<{ title?: string; description?: string; keywords?: string }>(),
  blocks: jsonb("blocks").$type<unknown[]>().notNull(),
})

export const posts = pgTable("posts", {
  id: uuid("id").primaryKey().defaultRandom(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  authorId: text("author_id"),
  image: text("image"),
  description: text("description"),
  body: text("body").notNull(),
})

export type PageRow = typeof pages.$inferSelect
export type PostRow = typeof posts.$inferSelect
