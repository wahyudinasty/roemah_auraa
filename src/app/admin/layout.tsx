import type { ReactNode } from "react";
import Link from "next/link";
import AdminNav from "@/components/admin/admin-nav";
import { logoutAction } from "@/app/login/actions";
import { requireAdmin } from "@/lib/auth";
import { formatDateLong, todayISO } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const admin = await requireAdmin();

  return (
    <div className="min-h-screen bg-[#faf6ee] lg:grid lg:grid-cols-[16.5rem_1fr]">
      <aside className="flex flex-col bg-cocoa text-cream lg:sticky lg:top-0 lg:h-screen">
        <div className="flex items-center justify-between gap-3 px-5 py-5">
          <Link href="/admin" className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-full border border-gold/70 font-serif text-sm text-gold">
              RA
            </span>
            <span>
              <span className="block font-serif text-base tracking-[0.18em]">ROEMAH AURA</span>
              <span className="mt-0.5 block text-[8px] uppercase tracking-[0.24em] text-gold">
                Admin Workspace
              </span>
            </span>
          </Link>
          <Link
            href="/"
            className="border border-cream/25 px-2.5 py-1.5 text-[9px] uppercase tracking-[0.14em] text-cream/70 transition-colors hover:border-gold hover:text-gold lg:hidden"
          >
            Website
          </Link>
        </div>

        <div className="flex-1 overflow-hidden border-y border-cream/10">
          <AdminNav />
        </div>

        <div className="px-4 py-4">
          <div className="border border-cream/15 bg-cream/5 p-3">
            <p className="text-[9px] uppercase tracking-[0.18em] text-cream/40">Masuk sebagai</p>
            <p className="mt-1 text-[13px] text-cream">{admin.name}</p>
            <p className="truncate text-[11px] text-cream/45">{admin.email}</p>
            <p className="mt-1 text-[9px] uppercase tracking-[0.14em] text-gold">{admin.role}</p>
          </div>
          <div className="mt-3 flex gap-2">
            <Link
              href="/"
              className="flex-1 border border-cream/20 px-2 py-2 text-center text-[9px] uppercase tracking-[0.12em] text-cream/70 transition-colors hover:border-gold hover:text-gold"
            >
              Lihat Website
            </Link>
            <form action={logoutAction} className="flex-1">
              <button
                type="submit"
                className="w-full border border-cream/20 px-2 py-2 text-[9px] uppercase tracking-[0.12em] text-cream/70 transition-colors hover:border-rose-300 hover:text-rose-200"
              >
                Keluar
              </button>
            </form>
          </div>
        </div>
      </aside>

      <div className="flex min-h-screen flex-col">
        <header className="sticky top-0 z-30 border-b border-sand/70 bg-[#fdfaf3]/95 backdrop-blur">
          <div className="flex items-center justify-between gap-4 px-5 py-3.5 lg:px-8">
            <div>
              <p className="text-[9px] uppercase tracking-[0.2em] text-cocoa/40">Dashboard Operasional</p>
              <p className="text-[12px] text-cocoa/65">{formatDateLong(todayISO())}</p>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href="/katalog"
                className="hidden border border-sand px-3 py-2 text-[9px] uppercase tracking-[0.14em] text-cocoa/60 transition-colors hover:border-gold hover:text-gold-dark sm:block"
              >
                Etalase Publik
              </Link>
              <div className="flex items-center gap-2">
                <span className="grid h-8 w-8 place-items-center rounded-full bg-cocoa text-[10px] uppercase text-cream">
                  {admin.name.slice(0, 2)}
                </span>
                <span className="hidden text-[11px] text-cocoa/60 sm:block">{admin.name}</span>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 px-5 py-6 lg:px-8 lg:py-8">{children}</main>

        <footer className="border-t border-sand/70 px-5 py-4 text-[10px] uppercase tracking-[0.16em] text-cocoa/35 lg:px-8">
          Roemah Aura Admin · Data stok dan jadwal adalah catatan utama operasional
        </footer>
      </div>
    </div>
  );
}
