import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/page-hero";
import { getCategories, getProducts, getSettings } from "@/lib/data";
import { rupiah, rupiahRange, whatsappLink } from "@/lib/format";

export const metadata: Metadata = {
  title: "Price List Sewa",
  description:
    "Daftar harga sewa pakaian adat, kebaya, jas pria, pakaian anak, dan kostum pentas di Roemah Aura.",
};

const addOns = [
  { item: "Hijab", price: 5000, note: "Berbagai warna, disesuaikan dengan koleksi" },
  { item: "Set inner", price: 7000, note: "Atasan dalam, nyaman dan tidak transparan" },
  { item: "Hijab + set inner", price: 10000, note: "Paket hemat untuk satu kali sewa" },
];

const guidelines = [
  {
    title: "Harga menyesuaikan ukuran",
    text: "Beberapa koleksi adat dan kebaya memiliki rentang harga sesuai ukuran dan kelengkapan aksesori yang dipilih.",
  },
  {
    title: "Pembayaran saat pengambilan",
    text: "Pembayaran dilakukan di tempat saat pakaian diambil, setelah admin mengonfirmasi ketersediaan dan total biaya.",
  },
  {
    title: "Deposit dikembalikan",
    text: "Uang jaminan dikembalikan penuh setelah pakaian diperiksa dan dikembalikan tepat waktu dalam kondisi baik.",
  },
  {
    title: "Durasi standar 3 hari",
    text: "Perpanjangan dapat diajukan melalui admin. Keterlambatan pengembalian dikenakan biaya sesuai ketentuan.",
  },
];

export default async function PriceListPage() {
  const [categories, products, settings] = await Promise.all([
    getCategories(),
    getProducts(),
    getSettings(),
  ]);

  const grouped = categories.map((category) => ({
    category,
    items: products.filter((product) => product.categoryId === category.id),
  }));

  return (
    <>
      <PageHero
        crumb="Price List"
        eyebrow="Transparan Sejak Awal"
        title="Price list sewa Roemah Aura"
        description="Daftar harga berikut menjadi acuan awal. Harga final dikonfirmasi admin saat booking, terutama untuk ukuran khusus, aksesori tambahan, atau sewa rombongan."
      >
        <a
          href={whatsappLink(settings.whatsapp, "Halo Roemah Aura, saya ingin konfirmasi harga sewa.")}
          target="_blank"
          rel="noreferrer"
          className="btn btn-gold"
        >
          Konfirmasi Harga
        </a>
      </PageHero>

      <section className="container-x py-14 lg:py-20">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {guidelines.map((item) => (
            <div key={item.title} className="border border-sand/70 bg-ivory p-5">
              <p className="font-serif text-base text-cocoa">{item.title}</p>
              <p className="mt-2 text-[12px] leading-relaxed text-cocoa/60">{item.text}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 space-y-10">
          {grouped.map(({ category, items }) => (
            <div key={category.id} className="border border-sand/70 bg-ivory">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-sand/70 bg-cream/60 px-5 py-4">
                <div>
                  <h2 className="font-serif text-xl text-cocoa">{category.name}</h2>
                  <p className="mt-0.5 text-[11px] text-cocoa/50">{category.tagline}</p>
                </div>
                <Link
                  href={`/katalog?kategori=${category.slug}`}
                  className="text-[10px] uppercase tracking-[0.18em] text-gold-dark hover:text-cocoa"
                >
                  Lihat koleksi →
                </Link>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[640px] text-left text-[13px]">
                  <thead className="text-[9px] uppercase tracking-[0.18em] text-cocoa/45">
                    <tr className="border-b border-sand/60">
                      <th className="px-5 py-3 font-medium">Kode</th>
                      <th className="px-5 py-3 font-medium">Koleksi</th>
                      <th className="px-5 py-3 font-medium">Ukuran</th>
                      <th className="px-5 py-3 font-medium">Deposit</th>
                      <th className="px-5 py-3 text-right font-medium">Harga sewa</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-sand/50">
                    {items.map((item) => (
                      <tr key={item.id} className="transition-colors hover:bg-cream/50">
                        <td className="px-5 py-3 text-[11px] tracking-wide text-cocoa/45">{item.code}</td>
                        <td className="px-5 py-3">
                          <Link
                            href={`/katalog/${item.slug}`}
                            className="font-medium text-cocoa hover:text-gold-dark"
                          >
                            {item.name}
                          </Link>
                        </td>
                        <td className="px-5 py-3 text-cocoa/60">
                          {item.sizes?.join(" · ") || "Sesuai stok"}
                        </td>
                        <td className="px-5 py-3 text-cocoa/60">
                          {item.deposit > 0 ? rupiah(item.deposit) : "—"}
                        </td>
                        <td className="px-5 py-3 text-right font-serif text-base text-gold-dark">
                          {rupiahRange(item.price, item.priceMax)}
                        </td>
                      </tr>
                    ))}
                    {items.length === 0 && (
                      <tr>
                        <td colSpan={5} className="px-5 py-6 text-center text-cocoa/45">
                          Belum ada koleksi pada kategori ini.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-[1fr_1fr]">
          <div className="border border-sand/70 bg-ivory p-6">
            <p className="eyebrow">Biaya Tambahan</p>
            <h2 className="mt-3 font-serif text-2xl text-cocoa">Pelengkap penampilan</h2>
            <table className="mt-5 w-full text-[13px]">
              <tbody className="divide-y divide-sand/60">
                {addOns.map((addOn) => (
                  <tr key={addOn.item}>
                    <td className="py-3">
                      <p className="text-cocoa">{addOn.item}</p>
                      <p className="text-[11px] text-cocoa/45">{addOn.note}</p>
                    </td>
                    <td className="py-3 text-right font-serif text-base text-gold-dark">
                      {rupiah(addOn.price)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="mt-4 border-t border-sand/60 pt-4 text-[11px] leading-relaxed text-cocoa/50">
              {settings.depositNote}
            </p>
          </div>

          <div className="flex flex-col justify-between border border-gold/30 bg-cream/70 p-6">
            <div>
              <p className="eyebrow">Catatan Penting</p>
              <h2 className="mt-3 font-serif text-2xl text-cocoa">Sebelum Anda memesan</h2>
              <ul className="mt-4 space-y-3 text-[13px] leading-relaxed text-cocoa/65">
                <li className="flex gap-2">
                  <span className="mt-1.5 text-[7px] text-gold">◆</span>
                  {settings.paymentNote}
                </li>
                <li className="flex gap-2">
                  <span className="mt-1.5 text-[7px] text-gold">◆</span>
                  {settings.rentalNote}
                </li>
                <li className="flex gap-2">
                  <span className="mt-1.5 text-[7px] text-gold">◆</span>
                  Harga pada price list ini adalah acuan awal dan dapat diperbarui oleh pemilik usaha.
                </li>
                <li className="flex gap-2">
                  <span className="mt-1.5 text-[7px] text-gold">◆</span>
                  Sewa rombongan sekolah mendapat penawaran khusus — hubungi admin.
                </li>
              </ul>
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href={whatsappLink(settings.whatsapp, "Halo Roemah Aura, saya ingin memesan dengan harga pada price list.")}
                target="_blank"
                rel="noreferrer"
                className="btn btn-gold"
              >
                Booking Sekarang
              </a>
              <Link href="/cara-penyewaan" className="btn btn-ghost">
                Ketentuan Sewa
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
