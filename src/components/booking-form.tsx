"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { addDaysISO, rupiah, todayISO, whatsappLink } from "@/lib/format";

type BookingProduct = {
  slug: string;
  name: string;
  code: string;
  price: number;
  priceMax: number | null;
  deposit: number;
  sizes: string[];
  colors: string;
  rentalDays: number;
  stockTotal: number;
  status: string;
};

type BookingResult = {
  code: string;
  whatsappUrl: string;
  message: string;
};

export default function BookingForm({
  product,
  whatsapp,
}: {
  product: BookingProduct;
  whatsapp: string;
}) {
  const today = todayISO();
  const [form, setForm] = useState({
    name: "",
    phone: "",
    size: product.sizes?.[0] ?? "",
    color: "",
    qty: 1,
    startDate: addDaysISO(today, 1),
    endDate: addDaysISO(today, 1 + Math.max(0, product.rentalDays - 1)),
    notes: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<BookingResult | null>(null);

  const estimate = useMemo(() => product.price * Math.max(1, form.qty), [product.price, form.qty]);
  const disabled = product.status === "perawatan";

  const update = (key: keyof typeof form, value: string | number) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productSlug: product.slug, ...form }),
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.error ?? "Permintaan booking gagal diproses.");
        return;
      }
      setResult(data as BookingResult);
      window.open((data as BookingResult).whatsappUrl, "_blank", "noopener,noreferrer");
    } catch {
      setError("Tidak dapat menghubungi server. Silakan coba lagi atau hubungi admin langsung.");
    } finally {
      setLoading(false);
    }
  };

  if (result) {
    return (
      <div className="card p-6">
        <p className="eyebrow">Permintaan Terkirim</p>
        <h3 className="mt-3 font-serif text-2xl text-cocoa">Satu langkah lagi, {form.name.split(" ")[0]}</h3>
        <p className="mt-2 text-sm leading-relaxed text-cocoa/65">
          Permintaan booking <span className="font-medium text-cocoa">{result.code}</span> sudah kami
          catat. Kirim pesan WhatsApp di bawah agar admin dapat memeriksa stok dan benturan jadwal.
        </p>
        <div className="mt-4 border border-sand/80 bg-cream/60 p-4 text-sm text-cocoa/70">
          <div className="flex justify-between border-b border-sand/60 py-1.5">
            <span>Produk</span>
            <span className="text-cocoa">{product.name}</span>
          </div>
          <div className="flex justify-between border-b border-sand/60 py-1.5">
            <span>Ukuran / Jumlah</span>
            <span className="text-cocoa">
              {form.size || "-"} · {form.qty} unit
            </span>
          </div>
          <div className="flex justify-between py-1.5">
            <span>Tanggal</span>
            <span className="text-cocoa">
              {form.startDate} → {form.endDate}
            </span>
          </div>
        </div>
        <a href={result.whatsappUrl} target="_blank" rel="noreferrer" className="btn btn-gold mt-5 w-full">
          Buka WhatsApp Admin
        </a>
        <button
          type="button"
          onClick={() => setResult(null)}
          className="btn btn-ghost mt-2 w-full !py-3 !text-[10px]"
        >
          Ajukan booking lain
        </button>
        <p className="mt-3 rounded-sm bg-amber-50/80 p-3 text-[11px] leading-relaxed text-amber-900">
          Catatan: mengirim pesan WhatsApp tidak otomatis berarti booking diterima. Pesanan dikonfirmasi
          admin setelah stok, ukuran, dan jadwal diperiksa.
        </p>
        <Link href="/katalog" className="mt-4 block text-center text-[11px] uppercase tracking-[0.18em] text-cocoa/50 hover:text-gold-dark">
          Kembali ke katalog
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="card p-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="eyebrow">Form Booking</p>
          <h3 className="mt-2 font-serif text-2xl text-cocoa">Sewa koleksi ini</h3>
        </div>
        <div className="text-right">
          <p className="text-[9px] uppercase tracking-[0.16em] text-cocoa/40">Estimasi</p>
          <p className="font-serif text-xl text-gold-dark">{rupiah(estimate)}</p>
        </div>
      </div>

      {disabled && (
        <p className="mt-4 border border-amber-200 bg-amber-50 p-3 text-[11px] leading-relaxed text-amber-900">
          Koleksi ini sedang dalam perawatan. Anda tetap dapat menghubungi admin untuk ketersediaan
          koleksi serupa.
        </p>
      )}

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="field-label">
            Nama Lengkap
          </label>
          <input
            id="name"
            required
            value={form.name}
            onChange={(event) => update("name", event.target.value)}
            className="field"
            placeholder="Nama sesuai identitas"
          />
        </div>
        <div>
          <label htmlFor="phone" className="field-label">
            Nomor WhatsApp
          </label>
          <input
            id="phone"
            required
            inputMode="tel"
            value={form.phone}
            onChange={(event) => update("phone", event.target.value)}
            className="field"
            placeholder="08xxxxxxxxxx"
          />
        </div>
        <div>
          <label htmlFor="size" className="field-label">
            Ukuran
          </label>
          <select
            id="size"
            value={form.size}
            onChange={(event) => update("size", event.target.value)}
            className="field"
          >
            {product.sizes?.length ? (
              product.sizes.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))
            ) : (
              <option value="">Sesuai stok</option>
            )}
          </select>
        </div>
        <div>
          <label htmlFor="qty" className="field-label">
            Jumlah Unit
          </label>
          <input
            id="qty"
            type="number"
            min={1}
            max={Math.max(1, product.stockTotal)}
            value={form.qty}
            onChange={(event) => update("qty", Math.max(1, Number(event.target.value) || 1))}
            className="field"
          />
        </div>
        <div>
          <label htmlFor="startDate" className="field-label">
            Tanggal Ambil
          </label>
          <input
            id="startDate"
            type="date"
            min={today}
            required
            value={form.startDate}
            onChange={(event) => {
              const value = event.target.value;
              update("startDate", value);
              if (form.endDate < value) update("endDate", value);
            }}
            className="field"
          />
        </div>
        <div>
          <label htmlFor="endDate" className="field-label">
            Tanggal Kembali
          </label>
          <input
            id="endDate"
            type="date"
            min={form.startDate || today}
            required
            value={form.endDate}
            onChange={(event) => update("endDate", event.target.value)}
            className="field"
          />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="color" className="field-label">
            Warna / Varian
          </label>
          <input
            id="color"
            value={form.color}
            onChange={(event) => update("color", event.target.value)}
            className="field"
            placeholder={product.colors || "Contoh: ivory, hitam gold"}
          />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="notes" className="field-label">
            Catatan / Permintaan Khusus
          </label>
          <textarea
            id="notes"
            rows={3}
            value={form.notes}
            onChange={(event) => update("notes", event.target.value)}
            className="field resize-none"
            placeholder="Contoh: butuh tambahan hijab dan set inner, tinggi pemakai 165 cm"
          />
        </div>
      </div>

      {product.deposit > 0 && (
        <p className="mt-4 text-[11px] text-cocoa/55">
          Deposit {rupiah(product.deposit)} dikembalikan setelah pakaian diperiksa dan kembali tepat waktu.
        </p>
      )}

      {error && (
        <p className="mt-4 border border-rose-200 bg-rose-50 p-3 text-[12px] leading-relaxed text-rose-800">
          {error}
        </p>
      )}

      <button type="submit" disabled={loading || disabled} className="btn btn-gold mt-5 w-full disabled:cursor-not-allowed disabled:opacity-60">
        {loading ? "Memproses…" : "Booking via WhatsApp"}
      </button>
      <p className="mt-3 text-center text-[10px] leading-relaxed text-cocoa/45">
        Pesan booking disiapkan otomatis. Admin akan mengonfirmasi ketersediaan, harga akhir, dan deposit.
      </p>
      <a
        href={whatsappLink(whatsapp, `Halo Roemah Aura, saya ingin bertanya tentang ${product.name} (${product.code}).`)}
        target="_blank"
        rel="noreferrer"
        className="mt-2 block text-center text-[11px] uppercase tracking-[0.16em] text-cocoa/55 hover:text-gold-dark"
      >
        Tanya dulu lewat WhatsApp
      </a>
    </form>
  );
}
