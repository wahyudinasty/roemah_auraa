import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/page-hero";
import { getSettings } from "@/lib/data";
import { instagramUrl, whatsappLink } from "@/lib/format";

export const metadata: Metadata = {
  title: "Kontak & Lokasi",
  description:
    "Hubungi Roemah Aura melalui WhatsApp atau Instagram, lihat lokasi dan jam operasional.",
};

export default async function ContactPage() {
  const settings = await getSettings();
  const waMessage = "Halo Roemah Aura, saya ingin bertanya tentang sewa pakaian.";
  const hasMaps = Boolean(settings.mapsUrl?.trim());
  const mapEmbed = hasMaps
    ? settings.mapsUrl.includes("embed")
      ? settings.mapsUrl
      : `https://www.google.com/maps?q=${encodeURIComponent(settings.address)}&output=embed`
    : "";

  return (
    <>
      <PageHero
        crumb="Kontak"
        eyebrow="Hubungi Kami"
        title="Kami siap membantu persiapan acara Anda"
        description="WhatsApp menjadi saluran utama untuk konsultasi, cek ketersediaan, dan konfirmasi booking. Anda juga dapat berkunjung langsung sesuai jam operasional."
      />

      <section className="container-x py-14 lg:py-20">
        <div className="grid gap-5 lg:grid-cols-3">
          <a
            href={whatsappLink(settings.whatsapp, waMessage)}
            target="_blank"
            rel="noreferrer"
            className="group border border-sand/70 bg-ivory p-6 transition-colors hover:border-gold/60"
          >
            <p className="text-[9px] uppercase tracking-[0.22em] text-cocoa/40">WhatsApp</p>
            <p className="mt-3 font-serif text-2xl text-cocoa">{settings.whatsapp}</p>
            <p className="mt-2 text-[12px] leading-relaxed text-cocoa/55">
              Respon tercepat untuk cek stok, ukuran, dan jadwal. Sertakan tanggal acara Anda.
            </p>
            <span className="mt-4 inline-block text-[10px] uppercase tracking-[0.18em] text-gold-dark">
              Chat sekarang →
            </span>
          </a>

          <a
            href={instagramUrl(settings.instagram)}
            target="_blank"
            rel="noreferrer"
            className="group border border-sand/70 bg-ivory p-6 transition-colors hover:border-gold/60"
          >
            <p className="text-[9px] uppercase tracking-[0.22em] text-cocoa/40">Instagram</p>
            <p className="mt-3 font-serif text-2xl text-cocoa">{settings.instagram}</p>
            <p className="mt-2 text-[12px] leading-relaxed text-cocoa/55">
              Lihat koleksi terbaru, dokumentasi pelanggan, dan info promo sewa.
            </p>
            <span className="mt-4 inline-block text-[10px] uppercase tracking-[0.18em] text-gold-dark">
              Buka Instagram →
            </span>
          </a>

          <div className="border border-gold/30 bg-cream/70 p-6">
            <p className="text-[9px] uppercase tracking-[0.22em] text-cocoa/40">Jam Operasional</p>
            <p className="mt-3 font-serif text-xl leading-snug text-cocoa">{settings.hours}</p>
            <p className="mt-3 text-[12px] leading-relaxed text-cocoa/55">
              Disarankan menghubungi admin terlebih dahulu sebelum berkunjung agar koleksi yang Anda
              minati dapat disiapkan.
            </p>
            <Link
              href="/katalog"
              className="mt-4 inline-block text-[10px] uppercase tracking-[0.18em] text-gold-dark"
            >
              Lihat koleksi →
            </Link>
          </div>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="border border-sand/70 bg-ivory p-6">
            <p className="eyebrow">Kunjungi Toko</p>
            <h2 className="mt-3 font-serif text-2xl text-cocoa">Alamat Roemah Aura</h2>
            <p className="mt-3 text-sm leading-relaxed text-cocoa/65">{settings.address}</p>

            <div className="mt-6 space-y-4 border-t border-sand/60 pt-5 text-[12px] leading-relaxed text-cocoa/60">
              <div>
                <p className="text-[9px] uppercase tracking-[0.18em] text-cocoa/40">Pengambilan &amp; pengembalian</p>
                <p className="mt-1">
                  Dilakukan di lokasi toko pada jam operasional, dengan pemeriksaan kelengkapan bersama
                  admin.
                </p>
              </div>
              <div>
                <p className="text-[9px] uppercase tracking-[0.18em] text-cocoa/40">Pembayaran</p>
                <p className="mt-1">{settings.paymentNote}</p>
              </div>
              <div>
                <p className="text-[9px] uppercase tracking-[0.18em] text-cocoa/40">Deposit</p>
                <p className="mt-1">{settings.depositNote}</p>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href={whatsappLink(settings.whatsapp, waMessage)}
                target="_blank"
                rel="noreferrer"
                className="btn btn-gold"
              >
                WhatsApp Admin
              </a>
              {hasMaps && (
                <a href={settings.mapsUrl} target="_blank" rel="noreferrer" className="btn btn-outline">
                  Buka Google Maps
                </a>
              )}
            </div>
          </div>

          <div className="overflow-hidden border border-sand/70 bg-ivory">
            {hasMaps ? (
              <iframe
                title="Lokasi Roemah Aura"
                src={mapEmbed}
                className="h-[22rem] w-full border-0 lg:h-full"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            ) : (
              <div className="relative grid h-[22rem] place-items-center bg-cream-deep pattern-gold p-8 text-center lg:h-full">
                <div className="border border-gold/40 bg-ivory/95 px-6 py-7">
                  <p className="font-serif text-3xl text-gold">RA</p>
                  <p className="mt-2 font-serif text-lg text-cocoa">Peta lokasi segera hadir</p>
                  <p className="mx-auto mt-2 max-w-xs text-[12px] leading-relaxed text-cocoa/55">
                    Tautan Google Maps dan alamat lengkap belum diisi oleh pemilik. Admin dapat
                    mengirimkan titik lokasi melalui WhatsApp.
                  </p>
                  <a
                    href={whatsappLink(settings.whatsapp, "Halo Roemah Aura, boleh minta titik lokasi toko?")}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-outline mt-4 !py-2.5 !text-[10px]"
                  >
                    Minta Lokasi
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mt-10 border border-sand/70 bg-ivory p-6 sm:p-8">
          <div className="grid gap-6 sm:grid-cols-[1fr_auto] sm:items-center">
            <div>
              <p className="eyebrow">Untuk Sekolah &amp; Sanggar</p>
              <h2 className="mt-3 font-serif text-2xl text-cocoa">
                Sewa rombongan dengan jadwal yang tertata
              </h2>
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-cocoa/60">
                Kirimkan jumlah siswa, daftar ukuran, dan tanggal acara. Kami bantu menyiapkan unit
                serta jadwal pengambilan agar tidak menumpuk di satu hari.
              </p>
            </div>
            <a
              href={whatsappLink(
                settings.whatsapp,
                "Halo Roemah Aura, saya ingin mengajukan sewa rombongan sekolah. Berikut jumlah dan tanggal acara:",
              )}
              target="_blank"
              rel="noreferrer"
              className="btn btn-dark"
            >
              Ajukan Sewa Rombongan
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
