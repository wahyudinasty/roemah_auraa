import Link from "next/link";
import { ProductGrid } from "@/components/product-card";
import {
  ABOUT_IMAGE,
  DETAIL_IMAGE,
  HERO_IMAGE,
  HERO_IMAGE_SECONDARY,
} from "@/lib/constants";
import {
  getCategories,
  getFeaturedProducts,
  getGalleryImages,
  getSettings,
  getTestimonials,
} from "@/lib/data";
import { rupiah, whatsappLink } from "@/lib/format";

const steps = [
  {
    title: "Pilih koleksi",
    text: "Telusuri katalog, simpan kode produk, dan cek ukuran yang tersedia.",
  },
  {
    title: "Cek tanggal",
    text: "Tentukan tanggal ambil dan kembali. Sistem menandai jadwal yang sudah terisi.",
  },
  {
    title: "Ajukan via WhatsApp",
    text: "Isi form booking, pesan otomatis terkirim ke admin Roemah Aura.",
  },
  {
    title: "Konfirmasi admin",
    text: "Admin memverifikasi stok, harga akhir, deposit, dan metode pembayaran.",
  },
  {
    title: "Ambil & kembalikan",
    text: "Ambil sesuai jadwal, rawat dengan baik, lalu kembalikan tepat waktu.",
  },
];

const advantages = [
  {
    number: "01",
    title: "Koleksi terkurasi",
    text: "Setiap unit diperiksa, dibersihkan, dan dilengkapi aksesori sebelum disewakan.",
  },
  {
    number: "02",
    title: "Informasi ukuran jelas",
    text: "Ukuran, warna, dan kelengkapan paket tertulis di halaman produk — tanpa menebak.",
  },
  {
    number: "03",
    title: "Booking tanpa ribet",
    text: "Satu form terhubung langsung ke WhatsApp admin dengan ringkasan pesanan otomatis.",
  },
  {
    number: "04",
    title: "Bantuan personal",
    text: "Admin membantu memilih ukuran, memadukan set, dan mengatur jadwal rombongan.",
  },
];

export default async function HomePage() {
  const [settings, categories, featured, testimonials, gallery] = await Promise.all([
    getSettings(),
    getCategories(),
    getFeaturedProducts(4),
    getTestimonials(),
    getGalleryImages(),
  ]);

  const totalCollections = categories.reduce((sum, category) => sum + category.productCount, 0);
  const previewImages = gallery.slice(0, 6);

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden border-b border-sand/60">
        <div className="pattern-gold pointer-events-none absolute -right-24 top-0 h-full w-1/3 opacity-30" />
        <div className="container-x relative grid gap-14 py-14 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:py-20">
          <div className="animate-rise">
            <p className="eyebrow">Roemah Aura · Sewa Busana &amp; Kostum</p>
            <h1 className="mt-5 font-serif text-[2.7rem] leading-[1.08] text-cocoa sm:text-6xl lg:text-[4.1rem]">
              {settings.heroTitle.split("Istimewa")[0]}
              <span className="italic text-gold-dark">Istimewa</span>
            </h1>
            <p className="mt-6 max-w-xl text-sm leading-relaxed text-cocoa/65 sm:text-[15px]">
              {settings.heroSubtitle}
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link href="/katalog" className="btn btn-gold">
                Jelajahi Koleksi
              </Link>
              <a
                href={whatsappLink(
                  settings.whatsapp,
                  "Halo Roemah Aura, saya ingin konsultasi sewa pakaian untuk acara saya.",
                )}
                target="_blank"
                rel="noreferrer"
                className="btn btn-outline"
              >
                Hubungi Kami
              </a>
            </div>

            <dl className="mt-10 grid max-w-lg grid-cols-3 gap-4 border-t border-sand/80 pt-6">
              {[
                { value: `${totalCollections}+`, label: "Koleksi siap sewa" },
                { value: `${categories.length}`, label: "Kategori busana" },
                { value: "3 hari", label: "Durasi sewa standar" },
              ].map((stat) => (
                <div key={stat.label}>
                  <dt className="font-serif text-2xl text-gold-dark">{stat.value}</dt>
                  <dd className="mt-1 text-[10px] uppercase leading-relaxed tracking-[0.14em] text-cocoa/45">
                    {stat.label}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="relative mx-auto w-full max-w-md lg:max-w-none">
            <div className="absolute -left-4 top-8 hidden h-full w-full border border-gold/40 sm:block" />
            <div className="relative overflow-hidden rounded-t-[14rem] border border-gold/30 bg-cream-deep">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={HERO_IMAGE}
                alt="Koleksi kebaya hitam gold Roemah Aura"
                className="h-[26rem] w-full object-cover object-top sm:h-[34rem]"
              />
            </div>
            <div className="absolute -bottom-6 -left-2 hidden w-40 overflow-hidden rounded-t-[5rem] border-4 border-cream shadow-[var(--shadow-soft)] sm:block lg:-left-10 lg:w-48">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={HERO_IMAGE_SECONDARY}
                alt="Kebaya ivory Roemah Aura"
                className="h-56 w-full object-cover"
              />
            </div>
            <div className="absolute bottom-6 right-2 border border-gold/40 bg-ivory/95 px-4 py-3 shadow-[var(--shadow-soft)] lg:-right-4">
              <p className="text-[9px] uppercase tracking-[0.2em] text-cocoa/45">Mulai dari</p>
              <p className="font-serif text-xl text-gold-dark">{rupiah(30000)}</p>
              <p className="text-[10px] text-cocoa/50">per unit / masa sewa</p>
            </div>
          </div>
        </div>

        <div className="border-t border-sand/60 bg-ivory/70">
          <div className="container-x flex flex-wrap items-center justify-center gap-x-8 gap-y-3 py-4 text-[10px] uppercase tracking-[0.24em] text-cocoa/50">
            <span>Pakaian Adat</span>
            <span className="text-gold">◆</span>
            <span>Kebaya</span>
            <span className="text-gold">◆</span>
            <span>Jas Pria</span>
            <span className="text-gold">◆</span>
            <span>Pakaian Anak</span>
            <span className="text-gold">◆</span>
            <span>Kostum Sekolah &amp; Pentas</span>
          </div>
        </div>
      </section>

      {/* KATEGORI */}
      <section className="container-x py-16 lg:py-24">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="eyebrow">Kategori Pilihan</p>
            <h2 className="mt-4 max-w-xl font-serif text-3xl leading-tight text-cocoa sm:text-4xl">
              Satu rumah untuk setiap busana istimewa
            </h2>
          </div>
          <Link
            href="/katalog"
            className="text-[11px] uppercase tracking-[0.2em] text-cocoa/60 underline decoration-gold/60 decoration-1 underline-offset-8 hover:text-gold-dark"
          >
            Lihat seluruh katalog
          </Link>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5 lg:gap-5">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/katalog?kategori=${category.slug}`}
              className="group relative overflow-hidden rounded-t-[8rem] border border-sand/70 bg-cream-deep"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={category.imageUrl}
                alt={category.name}
                loading="lazy"
                className="h-64 w-full object-cover transition-transform duration-700 group-hover:scale-105 md:h-72"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-cocoa/85 via-cocoa/15 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-4 text-cream">
                <p className="font-serif text-lg leading-snug">{category.name}</p>
                <p className="mt-1 text-[10px] uppercase tracking-[0.18em] text-cream/70">
                  {category.productCount} koleksi
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* KOLEKSI UNGGULAN */}
      <section className="border-y border-sand/60 bg-ivory py-16 lg:py-24">
        <div className="container-x">
          <div className="text-center">
            <p className="eyebrow justify-center">Koleksi Unggulan</p>
            <h2 className="mx-auto mt-4 max-w-2xl font-serif text-3xl leading-tight text-cocoa sm:text-4xl">
              Paling sering dipilih pelanggan Roemah Aura
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-cocoa/60">
              Tampilan elegan dengan informasi harga dan ketersediaan yang jelas. Klik koleksi untuk
              melihat detail bahan, ukuran, dan ajukan booking.
            </p>
          </div>
          <div className="mt-12">
            <ProductGrid products={featured} />
          </div>
          <div className="mt-12 text-center">
            <Link href="/katalog" className="btn btn-dark">
              Lihat Semua Koleksi
            </Link>
          </div>
        </div>
      </section>

      {/* KEUNGGULAN */}
      <section className="container-x py-16 lg:py-24">
        <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
          <div className="relative">
            <div className="overflow-hidden border border-gold/30 rounded-t-[10rem]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={ABOUT_IMAGE}
                alt="Koleksi busana Roemah Aura digantung rapi"
                loading="lazy"
                className="h-[24rem] w-full object-cover lg:h-[30rem]"
              />
            </div>
            <div className="absolute -bottom-5 left-5 right-5 border border-gold/30 bg-ivory px-5 py-4 shadow-[var(--shadow-soft)] sm:right-auto sm:w-72">
              <p className="font-serif text-sm italic text-cocoa">
                “Dirawat seperti milik sendiri, disiapkan untuk hari besar Anda.”
              </p>
              <p className="mt-2 text-[9px] uppercase tracking-[0.22em] text-gold-dark">
                Roemah Aura Care
              </p>
            </div>
          </div>

          <div>
            <p className="eyebrow">Mengapa Roemah Aura</p>
            <h2 className="mt-4 max-w-xl font-serif text-3xl leading-tight text-cocoa sm:text-4xl">
              Detail kecil yang membuat momen terasa sempurna
            </h2>
            <div className="mt-8 grid gap-x-8 gap-y-7 sm:grid-cols-2">
              {advantages.map((item) => (
                <div key={item.number} className="border-t border-sand/80 pt-4">
                  <p className="font-serif text-lg text-gold">{item.number}</p>
                  <h3 className="mt-2 font-serif text-lg text-cocoa">{item.title}</h3>
                  <p className="mt-2 text-[13px] leading-relaxed text-cocoa/60">{item.text}</p>
                </div>
              ))}
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/harga" className="btn btn-outline">
                Lihat Price List
              </Link>
              <Link href="/tentang" className="btn btn-ghost">
                Tentang Kami
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* BANTUAN / CTA BANNER */}
      <section className="bg-cocoa">
        <div className="container-x grid items-center gap-10 py-14 lg:grid-cols-2 lg:py-16">
          <div>
            <p className="eyebrow !text-gold">Butuh Bantuan Memilih?</p>
            <h2 className="mt-4 font-serif text-3xl leading-tight text-cream sm:text-4xl">
              Bingung ukuran atau padu padan set?
            </h2>
            <p className="mt-4 max-w-lg text-sm leading-relaxed text-cream/65">
              Kirimkan tinggi badan, ukuran biasanya, dan tanggal acara. Admin Roemah Aura akan
              merekomendasikan koleksi yang paling pas — termasuk kebutuhan tambahan seperti hijab
              dan set inner.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <a
                href={whatsappLink(
                  settings.whatsapp,
                  "Halo Roemah Aura, saya butuh bantuan memilih ukuran dan koleksi.",
                )}
                target="_blank"
                rel="noreferrer"
                className="btn btn-gold"
              >
                Konsultasi Gratis
              </a>
              <Link
                href="/cara-penyewaan"
                className="btn !border-cream/30 !text-cream/85 hover:!border-gold hover:!text-gold"
              >
                Baca Cara Sewa
              </Link>
            </div>
          </div>
          <div className="relative overflow-hidden rounded-t-[8rem] border border-gold/30">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={DETAIL_IMAGE}
              alt="Detail payet gold pada kain Roemah Aura"
              loading="lazy"
              className="h-64 w-full object-cover sm:h-80"
            />
            <div className="absolute bottom-4 left-4 bg-cream/95 px-4 py-3">
              <p className="text-[9px] uppercase tracking-[0.2em] text-cocoa/50">Tambahan</p>
              <p className="text-sm text-cocoa">Hijab {rupiah(5000)} · Set inner {rupiah(7000)}</p>
            </div>
          </div>
        </div>
      </section>

      {/* CARA SEWA */}
      <section className="container-x py-16 lg:py-24">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="eyebrow">Cara Penyewaan</p>
            <h2 className="mt-4 max-w-xl font-serif text-3xl leading-tight text-cocoa sm:text-4xl">
              Lima langkah, dari pilih koleksi sampai kembali
            </h2>
          </div>
          <a
            href={whatsappLink(settings.whatsapp, "Halo Roemah Aura, saya ingin mulai booking.")}
            target="_blank"
            rel="noreferrer"
            className="btn btn-gold"
          >
            Mulai Booking
          </a>
        </div>

        <ol className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
          {steps.map((step, index) => (
            <li key={step.title} className="relative border-t border-gold/40 pt-5">
              <span className="absolute -top-[9px] left-0 grid h-[18px] w-[18px] place-items-center rounded-full border border-gold/60 bg-cream text-[9px] text-gold-dark">
                {index + 1}
              </span>
              <h3 className="font-serif text-lg text-cocoa">{step.title}</h3>
              <p className="mt-2 text-[13px] leading-relaxed text-cocoa/60">{step.text}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* TESTIMONI */}
      <section className="border-y border-sand/60 bg-ivory py-16 lg:py-20">
        <div className="container-x">
          <div className="text-center">
            <p className="eyebrow justify-center">Kata Mereka</p>
            <h2 className="mt-4 font-serif text-3xl text-cocoa sm:text-4xl">Kepercayaan pelanggan</h2>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {testimonials.map((item) => (
              <figure key={item.id} className="border border-sand/70 bg-cream/60 p-6">
                <div className="flex gap-1 text-gold" aria-label={`${item.rating} dari 5`}>
                  {Array.from({ length: item.rating }).map((_, index) => (
                    <span key={index}>★</span>
                  ))}
                </div>
                <blockquote className="mt-4 text-[13px] leading-relaxed text-cocoa/70">
                  “{item.message}”
                </blockquote>
                <figcaption className="mt-5 border-t border-sand/70 pt-4">
                  <p className="font-serif text-base text-cocoa">{item.name}</p>
                  <p className="text-[10px] uppercase tracking-[0.18em] text-cocoa/40">{item.role}</p>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* GALERI PREVIEW */}
      {previewImages.length > 0 && (
        <section className="container-x py-16 lg:py-20">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="eyebrow">Galeri</p>
              <h2 className="mt-4 font-serif text-3xl text-cocoa sm:text-4xl">Sekilas koleksi kami</h2>
            </div>
            <Link href="/galeri" className="btn btn-outline">
              Buka Galeri
            </Link>
          </div>
          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {previewImages.map((image, index) => (
              <div
                key={`${image.url}-${index}`}
                className={`overflow-hidden border border-sand/60 bg-cream-deep ${
                  index % 5 === 0 ? "rounded-t-[5rem]" : ""
                }`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={image.url}
                  alt={image.name}
                  loading="lazy"
                  className="h-40 w-full object-cover transition-transform duration-700 hover:scale-105 sm:h-48"
                />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* KONTAK CTA */}
      <section className="bg-cream-deep/70">
        <div className="container-x grid gap-8 py-14 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <div>
            <p className="eyebrow">Momen Anda Menanti</p>
            <h2 className="mt-4 max-w-2xl font-serif text-3xl leading-tight text-cocoa sm:text-4xl">
              Siap tampil memukau? Kami bantu dari pemilihan hingga pengembalian.
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-cocoa/60">
              Hubungi admin untuk ketersediaan tanggal, sewa rombongan sekolah, atau permintaan khusus.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <a
                href={whatsappLink(
                  settings.whatsapp,
                  "Halo Roemah Aura, saya ingin menanyakan ketersediaan koleksi.",
                )}
                target="_blank"
                rel="noreferrer"
                className="btn btn-gold"
              >
                Chat WhatsApp {settings.whatsapp}
              </a>
              <Link href="/kontak" className="btn btn-ghost">
                Info &amp; Lokasi
              </Link>
            </div>
          </div>
          <div className="grid gap-3 border border-sand/70 bg-ivory p-6 text-[13px] text-cocoa/70">
            <div className="flex justify-between gap-4 border-b border-sand/60 pb-3">
              <span className="text-[10px] uppercase tracking-[0.16em] text-cocoa/40">Alamat</span>
              <span className="text-right">{settings.address}</span>
            </div>
            <div className="flex justify-between gap-4 border-b border-sand/60 pb-3">
              <span className="text-[10px] uppercase tracking-[0.16em] text-cocoa/40">Jam Buka</span>
              <span className="text-right">{settings.hours}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-[10px] uppercase tracking-[0.16em] text-cocoa/40">Instagram</span>
              <span className="text-right">{settings.instagram}</span>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
