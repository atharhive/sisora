import {
  pgTable,
  text,
  timestamp,
  boolean,
  integer,
  jsonb,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

// ─── Admin Users ─────────────────────────────────────────
export const admins = pgTable("admins", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ─── Domains ─────────────────────────────────────────────
export const domains = pgTable("domains", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  extension: varchar("extension", { length: 10 }).notNull().default(".si"),
  description: text("description"),
  category: varchar("category", { length: 255 }),
  tags: jsonb("tags").$type<string[]>().default([]),
  price: integer("price"),
  priceType: varchar("price_type", { length: 50 })
    .notNull()
    .default("make_offer"),
  featured: boolean("featured").default(false),
  status: varchar("status", { length: 50 }).notNull().default("active"),
  totalVisitors: integer("total_visitors").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ─── Inquiries ───────────────────────────────────────────
export const inquiries = pgTable("inquiries", {
  id: uuid("id").defaultRandom().primaryKey(),
  domainId: uuid("domain_id").references(() => domains.id, {
    onDelete: "set null",
  }),
  domainName: varchar("domain_name", { length: 255 }),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 50 }),
  message: text("message"),
  type: varchar("type", { length: 50 }).notNull().default("general"),
  status: varchar("status", { length: 50 }).notNull().default("new"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ─── Sell Submissions ────────────────────────────────────
export const sellSubmissions = pgTable("sell_submissions", {
  id: uuid("id").defaultRandom().primaryKey(),
  domainName: varchar("domain_name", { length: 255 }).notNull(),
  ownerName: varchar("owner_name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 50 }),
  askingPrice: varchar("asking_price", { length: 100 }),
  description: text("description"),
  status: varchar("status", { length: 50 }).notNull().default("pending"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ─── Page Content (CMS) ─────────────────────────────────
export const pages = pgTable("pages", {
  id: uuid("id").defaultRandom().primaryKey(),
  slug: varchar("slug", { length: 100 }).notNull().unique(),
  title: varchar("title", { length: 255 }).notNull(),
  content: jsonb("content").$type<Record<string, unknown>>().default({}),
  metaTitle: varchar("meta_title", { length: 255 }),
  metaDescription: text("meta_description"),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ─── Site Settings ───────────────────────────────────────
export const siteSettings = pgTable("site_settings", {
  id: uuid("id").defaultRandom().primaryKey(),
  key: varchar("key", { length: 100 }).notNull().unique(),
  value: text("value").notNull(),
  group: varchar("group", { length: 50 }).notNull().default("general"),
});

// ─── Type Exports ────────────────────────────────────────
export type Admin = typeof admins.$inferSelect;
export type NewAdmin = typeof admins.$inferInsert;
export type Domain = typeof domains.$inferSelect;
export type NewDomain = typeof domains.$inferInsert;
export type Inquiry = typeof inquiries.$inferSelect;
export type NewInquiry = typeof inquiries.$inferInsert;
export type SellSubmission = typeof sellSubmissions.$inferSelect;
export type NewSellSubmission = typeof sellSubmissions.$inferInsert;
export type Page = typeof pages.$inferSelect;
export type SiteSetting = typeof siteSettings.$inferSelect;
