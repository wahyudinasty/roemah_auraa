import { sql } from "drizzle-orm";
import {
  boolean,
  date,
  integer,
  pgTable,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  tagline: text("tagline").notNull().default(""),
  description: text("description").notNull().default(""),
  imageUrl: text("image_url").notNull().default(""),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  code: text("code").notNull().unique(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  categoryId: integer("category_id")
    .notNull()
    .references(() => categories.id),
  description: text("description").notNull().default(""),
  price: integer("price").notNull().default(0),
  priceMax: integer("price_max"),
  deposit: integer("deposit").notNull().default(0),
  sizes: text("sizes")
    .array()
    .notNull()
    .default(sql`'{}'::text[]`),
  colors: text("colors").notNull().default(""),
  includes: text("includes").notNull().default(""),
  rentalDays: integer("rental_days").notNull().default(3),
  stockTotal: integer("stock_total").notNull().default(1),
  status: text("status").notNull().default("tersedia"),
  featured: boolean("featured").notNull().default(false),
  images: text("images")
    .array()
    .notNull()
    .default(sql`'{}'::text[]`),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const customers = pgTable("customers", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  phone: text("phone").notNull().unique(),
  instagram: text("instagram").notNull().default(""),
  notes: text("notes").notNull().default(""),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const bookings = pgTable("bookings", {
  id: serial("id").primaryKey(),
  code: text("code").notNull().unique(),
  productId: integer("product_id")
    .notNull()
    .references(() => products.id),
  productName: text("product_name").notNull(),
  productCode: text("product_code").notNull(),
  customerName: text("customer_name").notNull(),
  phone: text("phone").notNull(),
  size: text("size").notNull().default(""),
  color: text("color").notNull().default(""),
  qty: integer("qty").notNull().default(1),
  startDate: date("start_date", { mode: "string" }).notNull(),
  endDate: date("end_date", { mode: "string" }).notNull(),
  notes: text("notes").notNull().default(""),
  status: text("status").notNull().default("menunggu"),
  totalPrice: integer("total_price").notNull().default(0),
  adminNote: text("admin_note").notNull().default(""),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const admins = pgTable("admins", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  role: text("role").notNull().default("admin"),
  passwordHash: text("password_hash").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const settings = pgTable("settings", {
  key: text("key").primaryKey(),
  value: text("value").notNull().default(""),
});

export const testimonials = pgTable("testimonials", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  role: text("role").notNull().default(""),
  message: text("message").notNull(),
  rating: integer("rating").notNull().default(5),
  published: boolean("published").notNull().default(true),
});

export type Category = typeof categories.$inferSelect;
export type Product = typeof products.$inferSelect;
export type Booking = typeof bookings.$inferSelect;
export type Customer = typeof customers.$inferSelect;
export type Testimonial = typeof testimonials.$inferSelect;
export type Admin = typeof admins.$inferSelect;
