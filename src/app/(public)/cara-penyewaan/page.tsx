import type { Metadata } from "next";
import Link from "next/link";
import { PageHero, SectionTitle } from "@/components/page-hero";
import { getSettings } from "@/lib/data";
import { rupiah, whatsappLink } from "@/lib/format";

export const metadata: Metadata = {
  title: "Cara Penyewaan & Ketentuan",
  description:
    "Alur pemesanan, durasi sewa, pembayaran, deposit, dan ketentuan penyewaan Roemah Aura.",
};

const steps = [
  {
    title: "Pilih produk",
    text: "Buka katalog, pilih kategori, lalu baca detail koleksi: bahan, ukuran, warna, dan kelengkapan paket.",
  },
  {
    title: "Cek ukuran & tanggal",
    text: "Tentukan ukuran, jumlah unit, tanggal ambil, dan tanggal kembali. Lihat daftar jadwal yang sudah terisi pada halaman produk.",
  },
  {
    title: "Ajukan booking",
    text: "Isi formulir booking. Pesan ringkas berisi data Anda akan otomatis disiapkan untuk dikirim ke WhatsApp admin.",
  },
  {
    title: "Konfirmasi admin",
    text: "Admin memeriksa stok, potongan ukuran, dan benturan jadwal, lalu mengonfirmasi harga akhir, deposit, serta metode pembayaran.",
  },
  {
    title: "Ambil & kembalikan",
    text: "Ambil pakaian sesuai jadwal, periksa kelengkapan bersama admin, dan kembalikan tepat waktu dalam kondisi baik.",
  },
];

const rules = [
  {
    title: "Durasi sewa",
    text: "Masa sewa standar 3 hari termasuk hari pengambilan dan pengembalian. Perpanjangan diajukan melalui admin dan dikenakan biaya tambahan.",
  },
  {
    title: "Pembayaran",
    text: "Pembayaran dilakukan saat pengambilan. Harga dapat menyesuaikan ukuran pakaian dan aksesori tambahan yang dipilih.",
  },
  {
    title: "Deposit",
    text: "Uang jaminan dikembalikan penuh setelah pakaian diperiksa dan dikembalikan tepat waktu dalam kondisi baik. Nominal mengikuti jenis koleksi.",
  },
  {
    title: "Keterlambatan",
    text: "Pengembalian melewati jadwal dikenakan biaya harian sesuai ketentuan admin. Keterlambatan tanpa konfirmasi dapat memengaruhi booking berikutnya.",
  },
  {
    title: "Kerusakan atau kehilangan",
    text: "Pelanggan bertanggung jawab atas kerusakan berat, noda membandel, atau kehilangan komponen. Biaya perbaikan/penggantian dibicarakan bersama secara kekeluargaan.",
  },
  {
    title: "Pembatalan & perubahan",
    text: "Perubahan jadwal atau pembatalan dapat dilakukan maksimal 2 hari sebelum tanggal pengambilan dengan konfirmasi admin.",
  },
];

const faq = [
  {
    q: "Apakah bisa sewa untuk rombongan sekolah?",
    a: "Bisa. Kirim daftar ukuran dan jumlah siswa melalui WhatsApp. Admin akan menyiapkan jadwal serta harga khusus untuk rombongan.",
  },
  {
    q: "Apakah pakaian sudah termasuk aksesori?",
    a: "Setiap koleksi mencantumkan kelengkapan paket pada halaman produk. Hijab, set inner, dan aksesori tambahan dapat disewa terpisah dengan biaya sesuai price list.",
  },
  {
    q: "Bagaimana cara memastikan tanggal saya tersedia?",
    a: "Halaman produk menampilkan periode yang sudah terisi. Konfirmasi akhir tetap diberikan admin setelah booking diperiksa, karena stok dapat berubah.",
  },
  {
    q: "Apakah bisa fitting terlebih dahulu?",
    a: "Sangat disarankan. Silakan datang ke lokasi sesuai jam operasional untuk mencoba ukuran sebelum tanggal acara. Hubungi admin terlebih dahulu.",
  },
  {
    q: "Apakah pakaian dicuci sebelum disewa?",
    a: "Ya. Semua pakaian dibersihkan dan diperiksa aksesorinya sebelum diserahkan kepada pelanggan.",
  },
];

export default async function RentalGuidePage() {
  const settings = await getSettings();

  return (
    <>
      <PageHero
        crumb="Cara Sewa"
        eyebrow="Panduan Penyewaan"
        title="Mudah, jelas, dan tanpa kejutan"
        description="Kami ingin setiap pelanggan memahami proses sejak awal. Berikut alur pemesanan serta ketentuan yang berlaku di Roemah Aura."
      >
        <a
          href={whatsappLink(settings.whatsapp, "Halo Roemah Aura, saya ingin bertanya soal prosedur sewa.")}
          target="_blank"
          rel="noreferrer"
          className="btn btn-gold"
        >
          Tanya Admin
        </a>
      </PageHero>

      <section className="container-x py-14 lg:py-20">
        <SectionTitle eyebrow="Alur Booking" title="Lima langkah menyewa di Roemah Aura" />
        <ol className="mt-9 space-y-3">
          {steps.map((step, index) => (
            <li
              key={step.title}
              className="grid gap-3 border border-sand/70 bg-ivory p-5 sm:grid-cols-[auto_1fr] sm:items-start sm:gap-6 sm:p-6"
            >
              <span className="grid h-11 w-11 place-items-center rounded-full border border-gold/50 font-serif text-lg text-gold-dark">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div>
                <h3 className="font-serif text-lg text-cocoa">{step.title}</h3>
                <p className="mt-1.5 text-[13px] leading-relaxed text-cocoa/60">{step.text}</p>
              </div>
            </li>
          ))}
        </ol>

        <p className="mt-5 border border-amber-200 bg-amber-50 p-4 text-[12px] leading-relaxed text-amber-900">
          Catatan: mengirim pesan WhatsApp tidak otomatis berarti booking telah diterima. Pesanan baru
          dikonfirmasi setelah admin memeriksa ketersediaan dan menyetujui jadwal.
        </p>
      </section>

      <section className="border-y border-sand/60 bg-ivory py-14 lg:py-20">
        <div className="container-x">
          <SectionTitle eyebrow="Ketentuan" title="Aturan sewa yang perlu diketahui" center />
          <div className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {rules.map((rule) => (
              <div key={rule.title} className="border border-sand/70 bg-cream/50 p-5">
                <h3 className="font-serif text-lg text-cocoa">{rule.title}</h3>
                <p className="mt-2 text-[12px] leading-relaxed text-cocoa/60">{rule.text}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {[
              { label: "Durasi standar", value: "3 hari" },
              { label: "Tambahan hijab", value: rupiah(5000) },
              { label: "Hijab + inner", value: rupiah(10000) },
            ].map((item) => (
              <div key={item.label} className="border border-gold/30 bg-ivory px-5 py-4">
                <p className="text-[9px] uppercase tracking-[0.18em] text-cocoa/40">{item.label}</p>
                <p className="mt-1 font-serif text-xl text-gold-dark">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container-x py-14 lg:py-20">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
          <div>
            <SectionTitle eyebrow="FAQ" title="Pertanyaan yang sering diajukan" />
            <p className="mt-4 text-sm leading-relaxed text-cocoa/60">
              Belum menemukan jawaban? Admin kami siap membantu melalui WhatsApp pada jam operasional.
            </p>
            <div className="mt-5 border border-sand/70 bg-ivory p-5 text-[12px] leading-relaxed text-cocoa/60">
              <p className="text-[9px] uppercase tracking-[0.18em] text-cocoa/40">Jam operasional</p>
              <p className="mt-1 text-cocoa/80">{settings.hours}</p>
              <p className="mt-3 text-[9px] uppercase tracking-[0.18em] text-cocoa/40">Alamat</p>
              <p className="mt-1 text-cocoa/80">{settings.address}</p>
            </div>
          </div>

          <div className="divide-y divide-sand/70 border border-sand/70 bg-ivory">
            {faq.map((item) => (
              <details key={item.q} className="group px-5 py-4">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-serif text-base text-cocoa">
                  {item.q}
                  <span className="text-gold transition-transform group-open:rotate-45">+</span>
                </summary>
                <p className="mt-3 text-[13px] leading-relaxed text-cocoa/60">{item.a}</p>
              </details>
            ))}
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center gap-3 border border-gold/30 bg-cream/70 px-6 py-10 text-center">
          <h2 className="font-serif text-2xl text-cocoa sm:text-3xl">Sudah siap memilih koleksi?</h2>
          <p className="max-w-lg text-sm text-cocoa/60">
            Mulai dari katalog, atau hubungi admin jika ingin dibantu merekomendasikan set yang sesuai.
          </p>
          <div className="mt-2 flex flex-wrap justify-center gap-3">
            <Link href="/katalog" className="btn btn-gold">
              Buka Katalog
            </Link>
            <a
              href={whatsappLink(settings.whatsapp, "Halo Roemah Aura, tolong bantu rekomendasi koleksi.")}
              target="_blank"
              rel="noreferrer"
              className="btn btn-outline"
            >
              Konsultasi
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
