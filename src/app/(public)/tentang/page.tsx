import type { Metadata } from "next";
import Link from "next/link";
import { PageHero, SectionTitle } from "@/components/page-hero";
import { ABOUT_IMAGE, HERO_IMAGE_SECONDARY, DETAIL_IMAGE } from "@/lib/constants";
import { getCategories, getSettings } from "@/lib/data";
import { whatsappLink } from "@/lib/format";

export const metadata: Metadata = {
  title: "Tentang Kami",
  description:
    "Profil Roemah Aura: layanan penyewaan pakaian adat, kebaya, jas, pakaian anak, dan kostum sekolah & pentas.",
};

const values = [
  {
    title: "Bersih & terawat",
    text: "Setiap koleksi dicuci, disetrika, dan diperiksa aksesorinya sebelum diserahkan kepada pelanggan.",
  },
  {
    title: "Jujur soal ukuran",
    text: "Kami mencantumkan ukuran apa adanya dan membantu mengukur ulang melalui konsultasi WhatsApp.",
  },
  {
    title: "Ramah untuk rombongan",
    text: "Sewa sekolah dan sanggar dapat memesan banyak unit dengan satu jadwal yang tertata.",
  },
  {
    title: "Harga transparan",
    text: "Harga sewa, biaya tambahan, dan deposit dijelaskan sejak awal — tanpa biaya tersembunyi.",
  },
];

export default async function AboutPage() {
  const [settings, categories] = await Promise.all([getSettings(), getCategories()]);
  const totalCollections = categories.reduce((sum, category) => sum + category.productCount, 0);

  return (
    <>
      <PageHero
        crumb="Tentang Kami"
        eyebrow="Profil Roemah Aura"
        title="Rumah bagi busana yang menemani cerita Anda"
        description="Roemah Aura adalah layanan penyewaan busana untuk acara adat, pernikahan, wisuda, hari besar sekolah, hingga pentas seni. Kami percaya penampilan terbaik lahir dari busana yang tepat dan pelayanan yang tenang."
      />

      <section className="container-x py-14 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div>
            <SectionTitle eyebrow="Cerita Kami" title="Berawal dari satu lemari penuh kenangan" />
            <div className="mt-5 space-y-4 text-sm leading-relaxed text-cocoa/65">
              <p>{settings.about}</p>
              <p>
                Kini koleksi Roemah Aura terus bertambah — dari busana adat Minangkabau, kebaya modern,
                jas formal, seragam anak, sampai kostum tari dan karnaval. Setiap koleksi diberi kode
                unik dan stok unit agar mudah dipantau, sehingga pelanggan tidak perlu khawatir
                bertabrakan jadwal.
              </p>
              <p>
                Website ini kami buat agar Anda dapat melihat koleksi, harga, ukuran, dan tanggal
                kosong tanpa harus datang dulu. Satu formulir booking akan menghubungkan Anda langsung
                dengan admin kami melalui WhatsApp.
              </p>
            </div>

            <dl className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
              {[
                { value: `${totalCollections}+`, label: "Koleksi" },
                { value: `${categories.length}`, label: "Kategori" },
                { value: "3 hari", label: "Sewa standar" },
                { value: "1 on 1", label: "Bantuan admin" },
              ].map((stat) => (
                <div key={stat.label} className="border-t border-gold/40 pt-3">
                  <dt className="font-serif text-2xl text-gold-dark">{stat.value}</dt>
                  <dd className="mt-1 text-[9px] uppercase tracking-[0.16em] text-cocoa/45">
                    {stat.label}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="overflow-hidden rounded-t-[8rem] border border-gold/25">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={ABOUT_IMAGE} alt="Koleksi Roemah Aura" className="h-72 w-full object-cover" />
            </div>
            <div className="space-y-4 sm:mt-10">
              <div className="overflow-hidden rounded-t-[5rem] border border-gold/25">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={HERO_IMAGE_SECONDARY}
                  alt="Kebaya ivory Roemah Aura"
                  className="h-44 w-full object-cover"
                />
              </div>
              <div className="overflow-hidden border border-gold/25">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={DETAIL_IMAGE}
                  alt="Detail bahan Roemah Aura"
                  className="h-32 w-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-sand/60 bg-ivory py-14 lg:py-20">
        <div className="container-x">
          <SectionTitle
            eyebrow="Yang Kami Jaga"
            title="Empat prinsip pelayanan Roemah Aura"
            center
          />
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((value, index) => (
              <div key={value.title} className="border border-sand/70 bg-cream/60 p-6">
                <p className="font-serif text-xl text-gold">0{index + 1}</p>
                <h3 className="mt-3 font-serif text-lg text-cocoa">{value.title}</h3>
                <p className="mt-2 text-[13px] leading-relaxed text-cocoa/60">{value.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container-x py-14 lg:py-20">
        <SectionTitle eyebrow="Layanan" title="Koleksi yang dapat Anda sewa" />
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/katalog?kategori=${category.slug}`}
              className="group flex gap-4 border border-sand/70 bg-ivory p-4 transition-colors hover:border-gold/60"
            >
              <div className="h-24 w-20 shrink-0 overflow-hidden rounded-t-[3rem] bg-cream-deep">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={category.imageUrl}
                  alt={category.name}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div>
                <h3 className="font-serif text-lg text-cocoa">{category.name}</h3>
                <p className="mt-1 text-[12px] leading-relaxed text-cocoa/55">{category.tagline}</p>
                <p className="mt-2 text-[10px] uppercase tracking-[0.16em] text-gold-dark">
                  {category.productCount} koleksi →
                </p>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center gap-4 border border-gold/30 bg-ivory px-6 py-10 text-center">
          <p className="eyebrow justify-center">Mari Berkenalan</p>
          <h2 className="max-w-xl font-serif text-2xl leading-snug text-cocoa sm:text-3xl">
            Ada acara yang perlu disiapkan? Kami senang membantu.
          </h2>
          <div className="flex flex-wrap justify-center gap-3">
            <a
              href={whatsappLink(settings.whatsapp, "Halo Roemah Aura, saya ingin berdiskusi soal kebutuhan sewa.")}
              target="_blank"
              rel="noreferrer"
              className="btn btn-gold"
            >
              WhatsApp Admin
            </a>
            <Link href="/katalog" className="btn btn-outline">
              Lihat Koleksi
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
