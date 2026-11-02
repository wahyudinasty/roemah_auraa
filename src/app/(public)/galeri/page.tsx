import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/page-hero";
import { getGalleryImages, getSettings } from "@/lib/data";
import { whatsappLink } from "@/lib/format";

export const metadata: Metadata = {
  title: "Galeri Koleksi",
  description:
    "Dokumentasi koleksi kebaya, pakaian adat, jas, pakaian anak, dan kostum pentas Roemah Aura.",
};

export default async function GalleryPage() {
  const [images, settings] = await Promise.all([getGalleryImages(), getSettings()]);

  return (
    <>
      <PageHero
        crumb="Galeri"
        eyebrow="Dokumentasi Koleksi"
        title="Galeri Roemah Aura"
        description="Sekilas detail bahan, motif, dan aksesori dari koleksi kami. Foto pelanggan hanya dipublikasikan dengan izin yang bersangkutan."
      >
        <a
          href={whatsappLink(settings.whatsapp, "Halo Roemah Aura, saya ingin melihat koleksi lebih detail.")}
          target="_blank"
          rel="noreferrer"
          className="btn btn-outline"
        >
          Minta Foto Detail
        </a>
      </PageHero>

      <section className="container-x py-14 lg:py-20">
        {images.length === 0 ? (
          <div className="border border-dashed border-sand bg-ivory px-6 py-16 text-center">
            <p className="font-serif text-xl text-cocoa">Galeri sedang disiapkan</p>
            <p className="mt-2 text-sm text-cocoa/55">
              Hubungi admin untuk melihat foto koleksi terbaru melalui WhatsApp.
            </p>
          </div>
        ) : (
          <div className="columns-2 gap-4 md:columns-3 lg:columns-4 [&>*]:mb-4">
            {images.map((image, index) => (
              <figure
                key={`${image.code}-${index}`}
                className="group relative break-inside-avoid overflow-hidden border border-sand/60 bg-cream-deep"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={image.url}
                  alt={`${image.name} — ${image.categoryName}`}
                  loading="lazy"
                  className={`w-full object-cover transition-transform duration-700 group-hover:scale-[1.04] ${
                    index % 5 === 0 ? "h-80" : index % 3 === 0 ? "h-64" : "h-56"
                  }`}
                />
                <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-cocoa/85 to-transparent px-3 pb-3 pt-8 text-cream">
                  <p className="text-[9px] uppercase tracking-[0.18em] text-cream/65">
                    {image.categoryName}
                  </p>
                  <p className="font-serif text-sm leading-snug">{image.name}</p>
                </figcaption>
              </figure>
            ))}
          </div>
        )}

        <div className="mt-12 grid gap-6 border border-gold/30 bg-ivory p-6 sm:grid-cols-[1fr_auto] sm:items-center sm:p-8">
          <div>
            <h2 className="font-serif text-2xl text-cocoa">Ingin melihat koleksi langsung?</h2>
            <p className="mt-2 text-sm text-cocoa/60">
              Kunjungi lokasi kami atau minta video detail bahan melalui WhatsApp. Admin dapat
              menunjukkan kondisi terkini koleksi yang Anda minati.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/kontak" className="btn btn-outline">
              Lokasi
            </Link>
            <a
              href={whatsappLink(settings.whatsapp, "Halo Roemah Aura, boleh minta video detail koleksi?")}
              target="_blank"
              rel="noreferrer"
              className="btn btn-gold"
            >
              WhatsApp
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
