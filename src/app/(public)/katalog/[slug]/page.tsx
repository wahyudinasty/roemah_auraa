import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import BookingForm from "@/components/booking-form";
import { ProductGrid } from "@/components/product-card";
import {
  getProductBookings,
  getProductBySlug,
  getRelatedProducts,
  getSettings,
} from "@/lib/data";
import { formatDate, rupiah, rupiahRange } from "@/lib/format";

type Params = Promise<{ slug: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Koleksi tidak ditemukan" };
  return {
    title: `${product.name} (${product.code})`,
    description: product.description.slice(0, 155),
  };
}

export default async function ProductDetailPage({ params }: { params: Params }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product || product.status === "arsip") notFound();

  const [settings, related, schedule] = await Promise.all([
    getSettings(),
    getRelatedProducts(product.categoryId, product.id, 4),
    getProductBookings(product.id),
  ]);

  const isMaintenance = product.status === "perawatan";
  const gallery = product.images?.length ? product.images : [];

  return (
    <>
      <div className="border-b border-sand/60 bg-ivory">
        <div className="container-x flex flex-wrap items-center gap-2 py-3.5 text-[10px] uppercase tracking-[0.16em] text-cocoa/45">
          <Link href="/" className="hover:text-gold-dark">
            Beranda
          </Link>
          <span>/</span>
          <Link href="/katalog" className="hover:text-gold-dark">
            Katalog
          </Link>
          <span>/</span>
          <Link href={`/katalog?kategori=${product.categorySlug}`} className="hover:text-gold-dark">
            {product.categoryName}
          </Link>
          <span>/</span>
          <span className="text-cocoa/70">{product.name}</span>
        </div>
      </div>

      <section className="container-x grid gap-10 py-10 lg:grid-cols-[1.05fr_0.95fr] lg:py-14">
        {/* GALERI + DETAIL */}
        <div>
          <div className="relative overflow-hidden border border-gold/25 bg-cream-deep">
            {gallery[0] ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={gallery[0]}
                alt={product.name}
                className="h-[26rem] w-full object-cover sm:h-[34rem]"
              />
            ) : (
              <div className="grid h-[26rem] place-items-center font-serif text-5xl text-gold">RA</div>
            )}
            <span className="absolute left-4 top-4 bg-ivory/95 px-3 py-1.5 text-[9px] uppercase tracking-[0.18em] text-cocoa/70">
              {product.categoryName}
            </span>
            {product.featured && (
              <span className="absolute right-4 top-4 bg-gold px-3 py-1.5 text-[9px] uppercase tracking-[0.18em] text-white">
                Unggulan
              </span>
            )}
          </div>

          {gallery.length > 1 && (
            <div className="mt-3 grid grid-cols-3 gap-3">
              {gallery.slice(1, 4).map((image) => (
                <div key={image} className="overflow-hidden border border-sand/70 bg-cream-deep">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={image}
                    alt={`${product.name} tampilan detail`}
                    loading="lazy"
                    className="h-24 w-full object-cover sm:h-32"
                  />
                </div>
              ))}
            </div>
          )}

          <div className="mt-8 border border-sand/70 bg-ivory p-6">
            <p className="eyebrow">Detail Koleksi</p>
            <h2 className="mt-3 font-serif text-2xl text-cocoa">Bahan, kelengkapan &amp; ketentuan</h2>
            <p className="mt-4 text-sm leading-relaxed text-cocoa/65">{product.description}</p>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="border border-sand/60 bg-cream/50 p-4">
                <p className="text-[9px] uppercase tracking-[0.18em] text-cocoa/40">Ukuran tersedia</p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {product.sizes?.length ? (
                    product.sizes.map((size) => (
                      <span
                        key={size}
                        className="border border-gold/40 bg-ivory px-2.5 py-1 text-[11px] text-cocoa/75"
                      >
                        {size}
                      </span>
                    ))
                  ) : (
                    <span className="text-[12px] text-cocoa/60">Sesuai stok</span>
                  )}
                </div>
              </div>
              <div className="border border-sand/60 bg-cream/50 p-4">
                <p className="text-[9px] uppercase tracking-[0.18em] text-cocoa/40">Warna</p>
                <p className="mt-2 text-[13px] text-cocoa/75">{product.colors || "Sesuai foto"}</p>
                <p className="mt-2 text-[9px] uppercase tracking-[0.18em] text-cocoa/40">Stok unit</p>
                <p className="text-[13px] text-cocoa/75">{product.stockTotal} unit</p>
              </div>
            </div>

            {product.includes && (
              <div className="mt-5">
                <p className="text-[9px] uppercase tracking-[0.18em] text-cocoa/40">
                  Termasuk dalam paket
                </p>
                <ul className="mt-2 grid gap-1.5 text-[13px] text-cocoa/70 sm:grid-cols-2">
                  {product.includes.split(",").map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <span className="mt-1.5 text-[7px] text-gold">◆</span>
                      {item.trim()}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="mt-6 space-y-2.5 border-t border-sand/60 pt-5 text-[12px] leading-relaxed text-cocoa/60">
              <p>
                <span className="font-medium text-cocoa">Durasi sewa:</span> {product.rentalDays} hari
                (dapat diperpanjang melalui admin).
              </p>
              <p>
                <span className="font-medium text-cocoa">Deposit:</span>{" "}
                {product.deposit > 0
                  ? `${rupiah(product.deposit)} — dikembalikan setelah pakaian diperiksa.`
                  : "Tidak memberlakukan deposit khusus."}
              </p>
              <p>
                <span className="font-medium text-cocoa">Pembayaran:</span> {settings.paymentNote}
              </p>
              <p>
                <span className="font-medium text-cocoa">Pembatalan:</span> dapat dilakukan maksimal 2
                hari sebelum tanggal pengambilan dengan konfirmasi admin.
              </p>
            </div>
          </div>
        </div>

        {/* INFO + FORM */}
        <div>
          <div className="border-b border-sand/70 pb-6">
            <p className="text-[10px] uppercase tracking-[0.22em] text-gold-dark">
              {product.code} · {product.categoryName}
            </p>
            <h1 className="mt-3 font-serif text-3xl leading-tight text-cocoa sm:text-4xl">
              {product.name}
            </h1>
            <div className="mt-4 flex flex-wrap items-end gap-x-4 gap-y-2">
              <p className="font-serif text-3xl text-gold-dark">
                {rupiahRange(product.price, product.priceMax)}
              </p>
              <p className="pb-1 text-[11px] text-cocoa/50">per unit / masa sewa</p>
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span
                className={`inline-flex items-center gap-1.5 border px-3 py-1.5 text-[10px] uppercase tracking-[0.14em] ${
                  isMaintenance
                    ? "border-amber-200 bg-amber-50 text-amber-800"
                    : "border-emerald-200 bg-emerald-50 text-emerald-800"
                }`}
              >
                <span
                  className={`h-1.5 w-1.5 rounded-full ${isMaintenance ? "bg-amber-500" : "bg-emerald-500"}`}
                />
                {isMaintenance ? "Sedang perawatan" : "Tersedia untuk disewa"}
              </span>
              <span className="inline-flex items-center gap-1.5 border border-sand bg-ivory px-3 py-1.5 text-[10px] uppercase tracking-[0.14em] text-cocoa/60">
                Stok {product.stockTotal} unit
              </span>
            </div>
          </div>

          <div className="mt-6 border border-sand/70 bg-ivory p-5">
            <div className="flex items-center justify-between">
              <p className="text-[10px] uppercase tracking-[0.2em] text-cocoa/45">
                Jadwal sudah terisi
              </p>
              <span className="text-[10px] text-cocoa/40">{schedule.length} periode</span>
            </div>
            {schedule.length === 0 ? (
              <p className="mt-3 text-[12px] text-emerald-700">
                Belum ada booking aktif. Tanggal Anda kemungkinan besar tersedia.
              </p>
            ) : (
              <ul className="mt-3 divide-y divide-sand/60 text-[12px]">
                {schedule.slice(0, 5).map((item) => (
                  <li key={item.code} className="flex items-center justify-between gap-3 py-2">
                    <span className="text-cocoa/70">
                      {formatDate(item.startDate)} – {formatDate(item.endDate)}
                    </span>
                    <span className="text-[10px] uppercase tracking-[0.12em] text-cocoa/40">
                      {item.qty} unit
                    </span>
                  </li>
                ))}
              </ul>
            )}
            <p className="mt-3 border-t border-sand/60 pt-3 text-[10px] leading-relaxed text-cocoa/45">
              Jadwal di atas adalah booking yang sudah tercatat. Konfirmasi akhir tetap dilakukan admin
              melalui WhatsApp.
            </p>
          </div>

          <div className="mt-6">
            <BookingForm
              product={{
                slug: product.slug,
                name: product.name,
                code: product.code,
                price: product.price,
                priceMax: product.priceMax,
                deposit: product.deposit,
                sizes: product.sizes ?? [],
                colors: product.colors,
                rentalDays: product.rentalDays,
                stockTotal: product.stockTotal,
                status: product.status,
              }}
              whatsapp={settings.whatsapp}
            />
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="border-t border-sand/60 bg-ivory py-14">
          <div className="container-x">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="eyebrow">Koleksi Serupa</p>
                <h2 className="mt-3 font-serif text-2xl text-cocoa sm:text-3xl">
                  Lengkapi penampilan Anda
                </h2>
              </div>
              <Link
                href={`/katalog?kategori=${product.categorySlug}`}
                className="text-[10px] uppercase tracking-[0.18em] text-cocoa/55 hover:text-gold-dark"
              >
                Semua {product.categoryName}
              </Link>
            </div>
            <div className="mt-8">
              <ProductGrid products={related} />
            </div>
          </div>
        </section>
      )}
    </>
  );
}
