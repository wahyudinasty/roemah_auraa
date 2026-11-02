"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { bookings, products, settings } from "@/db/schema";
import { requireAdmin } from "@/lib/auth";
import { SETTING_DEFAULTS } from "@/lib/constants";
import { slugify } from "@/lib/format";

const revalidateAll = () => {
  revalidatePath("/");
  revalidatePath("/katalog");
  revalidatePath("/harga");
  revalidatePath("/galeri");
  revalidatePath("/admin");
  revalidatePath("/admin/produk");
  revalidatePath("/admin/booking");
  revalidatePath("/admin/pelanggan");
  revalidatePath("/admin/laporan");
  revalidatePath("/admin/pengaturan");
};

const parseNumber = (value: FormDataEntryValue | null, fallback = 0) => {
  const number = Number(String(value ?? "").replace(/[^\d-]/g, ""));
  return Number.isFinite(number) ? number : fallback;
};

export async function saveProductAction(formData: FormData) {
  await requireAdmin();

  const id = parseNumber(formData.get("id"));
  const name = String(formData.get("name") ?? "").trim();
  const code = String(formData.get("code") ?? "").trim().toUpperCase();
  const categoryId = parseNumber(formData.get("categoryId"));
  const status = String(formData.get("status") ?? "tersedia");
  const sizes = String(formData.get("sizes") ?? "")
    .split(",")
    .map((size) => size.trim())
    .filter(Boolean);
  const images = String(formData.get("images") ?? "")
    .split(/\r?\n/)
    .map((url) => url.trim())
    .filter(Boolean);

  if (!name || !code || !categoryId) {
    redirect(id ? `/admin/produk/${id}?error=1` : "/admin/produk/baru?error=1");
  }

  const values = {
    name,
    code,
    slug: slugify(name) || slugify(code),
    categoryId,
    description: String(formData.get("description") ?? "").trim(),
    price: parseNumber(formData.get("price")),
    priceMax: parseNumber(formData.get("priceMax")) || null,
    deposit: parseNumber(formData.get("deposit")),
    sizes,
    colors: String(formData.get("colors") ?? "").trim(),
    includes: String(formData.get("includes") ?? "").trim(),
    rentalDays: Math.max(1, parseNumber(formData.get("rentalDays"), 3)),
    stockTotal: Math.max(1, parseNumber(formData.get("stockTotal"), 1)),
    status,
    featured: formData.get("featured") === "on",
    images,
  };

  try {
    if (id > 0) {
      await db.update(products).set(values).where(eq(products.id, id));
      revalidatePath(`/katalog/${values.slug}`);
    } else {
      await db.insert(products).values(values);
    }
  } catch {
    redirect(id ? `/admin/produk/${id}?error=duplicate` : "/admin/produk/baru?error=duplicate");
  }

  revalidateAll();
  redirect("/admin/produk?saved=1");
}

export async function archiveProductAction(formData: FormData) {
  await requireAdmin();
  const id = parseNumber(formData.get("id"));
  const status = String(formData.get("status") ?? "arsip");
  if (id > 0) {
    await db.update(products).set({ status }).where(eq(products.id, id));
  }
  revalidateAll();
  redirect("/admin/produk?updated=1");
}

export async function updateBookingAction(formData: FormData) {
  await requireAdmin();
  const id = parseNumber(formData.get("id"));
  const status = String(formData.get("status") ?? "menunggu");
  const adminNote = String(formData.get("adminNote") ?? "").trim();

  if (id > 0) {
    await db
      .update(bookings)
      .set({ status, adminNote, updatedAt: new Date() })
      .where(eq(bookings.id, id));
  }

  revalidateAll();
  redirect("/admin/booking?updated=1");
}

export async function saveSettingsAction(formData: FormData) {
  await requireAdmin();

  for (const key of Object.keys(SETTING_DEFAULTS)) {
    const raw = formData.get(key);
    if (raw === null) continue;
    const value = String(raw).trim();
    await db
      .insert(settings)
      .values({ key, value })
      .onConflictDoUpdate({ target: settings.key, set: { value } });
  }

  revalidateAll();
  revalidatePath("/tentang");
  revalidatePath("/kontak");
  revalidatePath("/cara-penyewaan");
  redirect("/admin/pengaturan?saved=1");
}
