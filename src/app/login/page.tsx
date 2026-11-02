import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import LoginForm from "@/components/login-form";
import { HERO_IMAGE } from "@/lib/constants";
import { getCurrentAdmin } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Login Admin",
  description: "Area khusus pengelola Roemah Aura.",
};

export const dynamic = "force-dynamic";

export default async function LoginPage() {
  const admin = await getCurrentAdmin();
  if (admin) redirect("/admin");

  return (
    <div className="grid min-h-screen bg-cream lg:grid-cols-[1.05fr_0.95fr]">
      <div className="relative hidden overflow-hidden bg-cocoa lg:block">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={HERO_IMAGE}
          alt="Roemah Aura"
          className="absolute inset-0 h-full w-full object-cover opacity-75"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-cocoa via-cocoa/50 to-cocoa/10" />
        <div className="relative flex h-full flex-col justify-between p-10 text-cream">
          <Link href="/" className="flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-full border border-gold/70 font-serif text-base text-gold">
              RA
            </span>
            <span className="font-serif text-lg tracking-[0.22em]">ROEMAH AURA</span>
          </Link>
          <div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-gold">Admin Workspace</p>
            <h1 className="mt-4 max-w-md font-serif text-4xl leading-tight">
              Kelola koleksi, stok, dan jadwal penyewaan dalam satu tempat.
            </h1>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-cream/65">
              Dashboard Roemah Aura mencatat booking, mencegah benturan jadwal, dan membantu laporan
              transaksi. Website tetap menjadi etalase, WhatsApp tetap menjadi saluran konfirmasi.
            </p>
          </div>
          <p className="text-[10px] uppercase tracking-[0.2em] text-cream/40">
            Elegance in Every Occasion
          </p>
        </div>
      </div>

      <div className="flex items-center justify-center px-5 py-14 sm:px-10">
        <div className="w-full max-w-md">
          <Link href="/" className="inline-flex items-center gap-3 lg:hidden">
            <span className="grid h-11 w-11 place-items-center rounded-full border border-gold/60 font-serif text-base text-gold-dark">
              RA
            </span>
            <span className="font-serif text-lg tracking-[0.22em] text-cocoa">ROEMAH AURA</span>
          </Link>

          <div className="mt-8 lg:mt-0">
            <p className="eyebrow">Area Pengelola</p>
            <h2 className="mt-4 font-serif text-3xl text-cocoa">Login Admin</h2>
            <p className="mt-2 text-sm leading-relaxed text-cocoa/60">
              Masuk untuk mengelola produk, stok, booking, pelanggan, laporan, dan pengaturan website.
            </p>
          </div>

          <LoginForm />

          <div className="mt-6 flex items-center justify-between text-[10px] uppercase tracking-[0.16em] text-cocoa/45">
            <Link href="/" className="hover:text-gold-dark">
              ← Kembali ke website
            </Link>
            <span>Akses terbatas</span>
          </div>
        </div>
      </div>
    </div>
  );
}
