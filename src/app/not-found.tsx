import Link from "next/link";

export default function NotFound() {
  return (
    <div className="grid min-h-screen place-items-center bg-cream px-5 py-16">
      <div className="w-full max-w-lg border border-sand/80 bg-ivory px-8 py-12 text-center shadow-[var(--shadow-soft)]">
        <span className="mx-auto grid h-14 w-14 place-items-center rounded-full border border-gold/60 font-serif text-lg text-gold-dark">
          RA
        </span>
        <p className="mt-6 text-[10px] uppercase tracking-[0.3em] text-gold-dark">Roemah Aura</p>
        <h1 className="mt-3 font-serif text-4xl text-cocoa">Halaman tidak ditemukan</h1>
        <p className="mt-3 text-sm leading-relaxed text-cocoa/60">
          Koleksi atau halaman yang Anda cari mungkin sudah dipindahkan. Silakan kembali ke katalog
          untuk melihat koleksi yang tersedia.
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Link href="/katalog" className="btn btn-gold">
            Lihat Katalog
          </Link>
          <Link href="/" className="btn btn-outline">
            Beranda
          </Link>
        </div>
        <p className="mt-6 text-[10px] uppercase tracking-[0.18em] text-cocoa/40">
          Elegance in Every Occasion
        </p>
      </div>
    </div>
  );
}
