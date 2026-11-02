import { and, asc, count, desc, eq, gte, inArray, lte, ne, or, sql, sum } from "drizzle-orm";
import { db } from "@/db";
import {
  bookings,
  categories,
  customers,
  products,
  settings,
  testimonials,
  type Category,
  type Product,
} from "@/db/schema";
import { SETTING_DEFAULTS } from "@/lib/constants";
import { productStatusMeta, todayISO } from "@/lib/format";

export const ACTIVE_BOOKING_STATUSES = ["menunggu", "dikonfirmasi", "diambil"];

export async function getSettings() {
  try {
    const rows = await db.select().from(settings);
    const map: Record<string, string> = { ...SETTING_DEFAULTS };
    for (const row of rows) {
      if (row.value) map[row.key] = row.value;
    }
    return map;
  } catch {
    return { ...SETTING_DEFAULTS };
  }
}

export type CategoryWithCount = Category & { productCount: number };

export async function getCategories(): Promise<CategoryWithCount[]> {
  const rows = await db
    .select({
      category: categories,
      productCount: count(products.id),
    })
    .from(categories)
    .leftJoin(products, and(eq(products.categoryId, categories.id), ne(products.status, "arsip")))
    .groupBy(categories.id)
    .orderBy(asc(categories.sortOrder));

  return rows.map((row) => ({ ...row.category, productCount: Number(row.productCount) }));
}

export type ProductWithCategory = Product & {
  categoryName: string;
  categorySlug: string;
};

const productSelection = {
  product: products,
  categoryName: categories.name,
  categorySlug: categories.slug,
};

const toProductWithCategory = (row: {
  product: Product;
  categoryName: string | null;
  categorySlug: string | null;
}): ProductWithCategory => ({
  ...row.product,
  categoryName: row.categoryName ?? "Koleksi",
  categorySlug: row.categorySlug ?? "lainnya",
});

export async function getFeaturedProducts(limit = 4): Promise<ProductWithCategory[]> {
  const rows = await db
    .select(productSelection)
    .from(products)
    .leftJoin(categories, eq(products.categoryId, categories.id))
    .where(and(eq(products.featured, true), ne(products.status, "arsip")))
    .orderBy(asc(products.id))
    .limit(limit);
  return rows.map(toProductWithCategory);
}

export async function getProducts(options?: {
  categorySlug?: string;
  search?: string;
  includeArchived?: boolean;
  limit?: number;
}): Promise<ProductWithCategory[]> {
  const filters = [];
  if (!options?.includeArchived) filters.push(ne(products.status, "arsip"));
  if (options?.categorySlug) filters.push(eq(categories.slug, options.categorySlug));
  if (options?.search) {
    const term = `%${options.search.toLowerCase()}%`;
    filters.push(
      or(
        sql`lower(${products.name}) like ${term}`,
        sql`lower(${products.code}) like ${term}`,
        sql`lower(${products.description}) like ${term}`,
      ),
    );
  }

  const rows = await db
    .select(productSelection)
    .from(products)
    .leftJoin(categories, eq(products.categoryId, categories.id))
    .where(filters.length ? and(...filters) : undefined)
    .orderBy(desc(products.featured), asc(products.id))
    .limit(options?.limit ?? 200);

  return rows.map(toProductWithCategory);
}

export async function getProductBySlug(slug: string): Promise<ProductWithCategory | null> {
  const [row] = await db
    .select(productSelection)
    .from(products)
    .leftJoin(categories, eq(products.categoryId, categories.id))
    .where(eq(products.slug, slug))
    .limit(1);
  return row ? toProductWithCategory(row) : null;
}

export async function getProductById(id: number): Promise<Product | null> {
  const [row] = await db.select().from(products).where(eq(products.id, id)).limit(1);
  return row ?? null;
}

export async function getRelatedProducts(
  categoryId: number,
  excludeId: number,
  limit = 3,
): Promise<ProductWithCategory[]> {
  const rows = await db
    .select(productSelection)
    .from(products)
    .leftJoin(categories, eq(products.categoryId, categories.id))
    .where(
      and(
        eq(products.categoryId, categoryId),
        ne(products.id, excludeId),
        ne(products.status, "arsip"),
      ),
    )
    .limit(limit);
  return rows.map(toProductWithCategory);
}

export async function getProductBookings(productId: number) {
  return db
    .select({
      code: bookings.code,
      startDate: bookings.startDate,
      endDate: bookings.endDate,
      qty: bookings.qty,
      status: bookings.status,
    })
    .from(bookings)
    .where(
      and(
        eq(bookings.productId, productId),
        inArray(bookings.status, ACTIVE_BOOKING_STATUSES),
        gte(bookings.endDate, todayISO()),
      ),
    )
    .orderBy(asc(bookings.startDate));
}

export async function getBookedUnits(
  productId: number,
  startDate: string,
  endDate: string,
) {
  const [row] = await db
    .select({ booked: sum(bookings.qty) })
    .from(bookings)
    .where(
      and(
        eq(bookings.productId, productId),
        inArray(bookings.status, ACTIVE_BOOKING_STATUSES),
        lte(bookings.startDate, endDate),
        gte(bookings.endDate, startDate),
      ),
    );
  return Number(row?.booked ?? 0);
}

export async function getTestimonials() {
  return db
    .select()
    .from(testimonials)
    .where(eq(testimonials.published, true))
    .orderBy(asc(testimonials.id))
    .limit(6);
}

export async function getGalleryImages(): Promise<
  { url: string; name: string; categoryName: string; code: string }[]
> {
  const rows = await db
    .select({
      images: products.images,
      name: products.name,
      code: products.code,
      categoryName: categories.name,
    })
    .from(products)
    .leftJoin(categories, eq(products.categoryId, categories.id))
    .where(ne(products.status, "arsip"))
    .orderBy(asc(products.id));

  return rows.flatMap((row) =>
    (row.images ?? []).slice(0, 2).map((url) => ({
      url,
      name: row.name,
      code: row.code,
      categoryName: row.categoryName ?? "Koleksi",
    })),
  );
}

export type ProductStats = {
  tersedia: number;
  perawatan: number;
  arsip: number;
  total: number;
};

export async function getProductStats(): Promise<ProductStats> {
  const rows = await db
    .select({ status: products.status, total: count() })
    .from(products)
    .groupBy(products.status);
  const map: ProductStats = { tersedia: 0, perawatan: 0, arsip: 0, total: 0 };
  for (const row of rows) {
    if (row.status === "tersedia" || row.status === "perawatan" || row.status === "arsip") {
      map[row.status] = Number(row.total);
    }
    map.total += Number(row.total);
  }
  return map;
}

export type AdminBooking = {
  id: number;
  code: string;
  productName: string;
  productCode: string;
  customerName: string;
  phone: string;
  size: string;
  color: string;
  qty: number;
  startDate: string;
  endDate: string;
  notes: string;
  status: string;
  totalPrice: number;
  adminNote: string;
  createdAt: Date;
};

export async function getBookings(options?: {
  status?: string;
  search?: string;
  limit?: number;
}): Promise<AdminBooking[]> {
  const filters = [];
  if (options?.status) filters.push(eq(bookings.status, options.status));
  if (options?.search) {
    const term = `%${options.search.toLowerCase()}%`;
    filters.push(
      or(
        sql`lower(${bookings.customerName}) like ${term}`,
        sql`lower(${bookings.code}) like ${term}`,
        sql`lower(${bookings.productName}) like ${term}`,
        sql`${bookings.phone} like ${term}`,
      ),
    );
  }

  const rows = await db
    .select({
      id: bookings.id,
      code: bookings.code,
      productName: bookings.productName,
      productCode: bookings.productCode,
      customerName: bookings.customerName,
      phone: bookings.phone,
      size: bookings.size,
      color: bookings.color,
      qty: bookings.qty,
      startDate: bookings.startDate,
      endDate: bookings.endDate,
      notes: bookings.notes,
      status: bookings.status,
      totalPrice: bookings.totalPrice,
      adminNote: bookings.adminNote,
      createdAt: bookings.createdAt,
    })
    .from(bookings)
    .where(filters.length ? and(...filters) : undefined)
    .orderBy(desc(bookings.createdAt))
    .limit(options?.limit ?? 100);

  return rows;
}

export async function getBookingById(id: number): Promise<AdminBooking | null> {
  const rows = await getBookings();
  return rows.find((row) => row.id === id) ?? null;
}

export async function getDashboardStats() {
  const today = todayISO();
  const [bookingStats] = await db
    .select({
      total: count(),
      waiting: sql<number>`count(*) filter (where ${bookings.status} = 'menunggu')`,
      confirmed: sql<number>`count(*) filter (where ${bookings.status} = 'dikonfirmasi')`,
      active: sql<number>`count(*) filter (where ${bookings.status} = 'diambil')`,
      returned: sql<number>`count(*) filter (where ${bookings.status} = 'dikembalikan')`,
      revenue: sql<number>`coalesce(sum(${bookings.totalPrice}) filter (where ${bookings.status} <> 'dibatalkan'), 0)`,
    })
    .from(bookings);

  const [dueSoon] = await db
    .select({ total: count() })
    .from(bookings)
    .where(
      and(
        inArray(bookings.status, ["dikonfirmasi", "diambil"]),
        gte(bookings.endDate, today),
        lte(bookings.endDate, sql`(${today}::date + interval '3 day')`),
      ),
    );

  const productStats = await getProductStats();
  const [customerStats] = await db.select({ total: count() }).from(customers);

  return {
    bookings: Number(bookingStats?.total ?? 0),
    waiting: Number(bookingStats?.waiting ?? 0),
    confirmed: Number(bookingStats?.confirmed ?? 0),
    active: Number(bookingStats?.active ?? 0),
    returned: Number(bookingStats?.returned ?? 0),
    revenue: Number(bookingStats?.revenue ?? 0),
    dueSoon: Number(dueSoon?.total ?? 0),
    customers: Number(customerStats?.total ?? 0),
    products: productStats,
  };
}

export async function getMonthlyRevenue() {
  const rows = await db
    .select({
      month: sql<string>`to_char(date_trunc('month', ${bookings.createdAt}), 'YYYY-MM')`,
      label: sql<string>`to_char(date_trunc('month', ${bookings.createdAt}), 'Mon')`,
      revenue: sql<number>`coalesce(sum(${bookings.totalPrice}) filter (where ${bookings.status} <> 'dibatalkan'), 0)`,
      total: count(),
    })
    .from(bookings)
    .groupBy(sql`date_trunc('month', ${bookings.createdAt})`)
    .orderBy(sql`date_trunc('month', ${bookings.createdAt}) desc`)
    .limit(6);
  return rows.reverse().map((row) => ({
    month: row.month,
    label: row.label,
    revenue: Number(row.revenue),
    total: Number(row.total),
  }));
}

export async function getTopProducts() {
  const rows = await db
    .select({
      name: bookings.productName,
      code: bookings.productCode,
      total: count(),
      qty: sql<number>`coalesce(sum(${bookings.qty}), 0)`,
      revenue: sql<number>`coalesce(sum(${bookings.totalPrice}), 0)`,
    })
    .from(bookings)
    .where(ne(bookings.status, "dibatalkan"))
    .groupBy(bookings.productName, bookings.productCode)
    .orderBy(desc(count()))
    .limit(5);
  return rows.map((row) => ({
    name: row.name,
    code: row.code,
    total: Number(row.total),
    qty: Number(row.qty),
    revenue: Number(row.revenue),
  }));
}

export async function getStatusBreakdown() {
  const rows = await db
    .select({ status: bookings.status, total: count() })
    .from(bookings)
    .groupBy(bookings.status);
  return rows.map((row) => ({ status: row.status, total: Number(row.total) }));
}

export async function getCustomers() {
  const rows = await db
    .select({
      customer: customers,
      bookingCount: count(bookings.id),
      lastBooking: sql<string>`coalesce(max(${bookings.createdAt})::text, '')`,
      spent: sql<number>`coalesce(sum(${bookings.totalPrice}) filter (where ${bookings.status} <> 'dibatalkan'), 0)`,
    })
    .from(customers)
    .leftJoin(bookings, eq(bookings.phone, customers.phone))
    .groupBy(customers.id)
    .orderBy(desc(customers.createdAt));

  return rows.map((row) => ({
    ...row.customer,
    bookingCount: Number(row.bookingCount),
    lastBooking: row.lastBooking,
    spent: Number(row.spent),
  }));
}

export const productPublicStatus = (product: Product) => {
  if (product.status === "perawatan") return { label: "Perawatan", tone: "muted" as const };
  return productStatusMeta[product.status] ?? productStatusMeta.tersedia;
};
