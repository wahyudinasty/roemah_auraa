import { asc, eq } from "drizzle-orm";
import { db } from "@/db";
import { bookings, customers, products } from "@/db/schema";
import { getBookedUnits, getSettings } from "@/lib/data";
import { formatDate, rupiah, rentalDaysBetween, todayISO, whatsappLink } from "@/lib/format";

export const dynamic = "force-dynamic";

type Payload = {
  productSlug?: string;
  name?: string;
  phone?: string;
  size?: string;
  color?: string;
  qty?: number;
  startDate?: string;
  endDate?: string;
  notes?: string;
};

const datePattern = /^\d{4}-\d{2}-\d{2}$/;

export async function POST(request: Request) {
  let body: Payload;
  try {
    body = (await request.json()) as Payload;
  } catch {
    return Response.json({ error: "Format permintaan tidak valid." }, { status: 400 });
  }

  const name = (body.name ?? "").trim();
  const phoneRaw = (body.phone ?? "").trim();
  const phoneDigits = phoneRaw.replace(/\D/g, "");
  const size = (body.size ?? "").trim();
  const color = (body.color ?? "").trim();
  const notes = (body.notes ?? "").trim().slice(0, 600);
  const qty = Math.max(1, Math.round(Number(body.qty ?? 1)));
  const startDate = body.startDate ?? "";
  const endDate = body.endDate ?? "";

  if (!body.productSlug) {
    return Response.json({ error: "Produk tidak dikenali." }, { status: 400 });
  }
  if (name.length < 3) {
    return Response.json({ error: "Nama minimal 3 karakter." }, { status: 400 });
  }
  if (phoneDigits.length < 9 || phoneDigits.length > 15) {
    return Response.json({ error: "Nomor WhatsApp tidak valid." }, { status: 400 });
  }
  if (!datePattern.test(startDate) || !datePattern.test(endDate)) {
    return Response.json({ error: "Tanggal pengambilan dan pengembalian wajib diisi." }, { status: 400 });
  }
  if (endDate < startDate) {
    return Response.json({ error: "Tanggal pengembalian tidak boleh sebelum tanggal ambil." }, { status: 400 });
  }
  if (startDate < todayISO()) {
    return Response.json({ error: "Tanggal pengambilan tidak boleh di masa lalu." }, { status: 400 });
  }

  const [product] = await db
    .select()
    .from(products)
    .where(eq(products.slug, body.productSlug))
    .limit(1);

  if (!product) {
    return Response.json({ error: "Koleksi tidak ditemukan." }, { status: 404 });
  }
  if (product.status === "perawatan") {
    return Response.json(
      { error: "Koleksi ini sedang dalam perawatan. Silakan hubungi admin untuk alternatif lain." },
      { status: 409 },
    );
  }
  if (qty > product.stockTotal) {
    return Response.json(
      { error: `Stok tersedia hanya ${product.stockTotal} unit untuk koleksi ini.` },
      { status: 409 },
    );
  }

  const booked = await getBookedUnits(product.id, startDate, endDate);
  if (booked + qty > product.stockTotal) {
    return Response.json(
      {
        error:
          "Tanggal yang Anda pilih sudah terisi untuk ukuran/jumlah tersebut. Silakan pilih tanggal lain atau hubungi admin untuk menunggu daftar tunggu.",
      },
      { status: 409 },
    );
  }

  const totalPrice = product.price * qty;
  const stamp = new Date();
  const code = `RA-${stamp.getFullYear()}${String(stamp.getMonth() + 1).padStart(2, "0")}${String(
    stamp.getDate(),
  ).padStart(2, "0")}-${Math.random().toString(36).slice(2, 5).toUpperCase()}`;

  let inserted;
  try {
    [inserted] = await db
      .insert(bookings)
      .values({
        code,
        productId: product.id,
        productName: product.name,
        productCode: product.code,
        customerName: name,
        phone: phoneDigits,
        size,
        color,
        qty,
        startDate,
        endDate,
        notes,
        status: "menunggu",
        totalPrice,
      })
      .returning({ id: bookings.id, code: bookings.code });
  } catch {
    return Response.json(
      { error: "Permintaan booking gagal disimpan. Silakan coba lagi." },
      { status: 500 },
    );
  }

  const existingCustomer = await db
    .select({ id: customers.id })
    .from(customers)
    .where(eq(customers.phone, phoneDigits))
    .limit(1);

  if (existingCustomer.length === 0) {
    await db.insert(customers).values({ name, phone: phoneDigits }).onConflictDoNothing();
  }

  const settings = await getSettings();
  const days = rentalDaysBetween(startDate, endDate);
  const message = [
    `Halo Roemah Aura, saya ingin mengajukan booking sewa.`,
    ``,
    `Kode pengajuan: ${inserted.code}`,
    `Nama: ${name}`,
    `WhatsApp: ${phoneDigits}`,
    `Produk: ${product.name} (${product.code})`,
    `Ukuran: ${size || "-"}${color ? ` | Warna: ${color}` : ""}`,
    `Jumlah: ${qty} unit`,
    `Tanggal ambil: ${formatDate(startDate)}`,
    `Tanggal kembali: ${formatDate(endDate)} (${days} hari)`,
    `Estimasi biaya: ${rupiah(totalPrice)}`,
    notes ? `Catatan: ${notes}` : null,
    ``,
    `Mohon konfirmasi ketersediaan, total biaya, dan deposit. Terima kasih.`,
  ]
    .filter((line) => line !== null)
    .join("\n");

  return Response.json({
    id: inserted.id,
    code: inserted.code,
    message,
    whatsappUrl: whatsappLink(settings.whatsapp, message),
  });
}

export async function GET() {
  const rows = await db
    .select({
      code: products.code,
      name: products.name,
      available: products.stockTotal,
      status: products.status,
    })
    .from(products)
    .orderBy(asc(products.id));
  return Response.json({ collections: rows });
}
