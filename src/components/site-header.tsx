"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { NAV_LINKS } from "@/lib/constants";
import { instagramUrl, whatsappLink } from "@/lib/format";

type HeaderProps = {
  whatsapp: string;
  instagram: string;
  hours: string;
  categories: { slug: string; name: string }[];
};

export default function SiteHeader({ whatsapp, instagram, hours, categories }: HeaderProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-50">
      <div className="hidden bg-cocoa text-[11px] tracking-[0.16em] text-cream/85 md:block">
        <div className="container-x flex items-center justify-between py-2.5">
          <div className="flex items-center gap-6">
            <a
              href={whatsappLink(whatsapp, "Halo Roemah Aura, saya ingin bertanya tentang koleksi.")}
              target="_blank"
              rel="noreferrer"
              className="link-underline uppercase"
            >
              WhatsApp · {whatsapp}
            </a>
            <span className="hidden text-cream/40 lg:inline">|</span>
            <span className="hidden normal-case tracking-[0.08em] text-cream/65 lg:inline">
              {hours}
            </span>
          </div>
          <div className="flex items-center gap-5">
            <span className="hidden uppercase text-cream/65 sm:inline">Elegance in Every Occasion</span>
            <a
              href={instagramUrl(instagram)}
              target="_blank"
              rel="noreferrer"
              className="link-underline uppercase"
            >
              Instagram {instagram}
            </a>
          </div>
        </div>
      </div>

      <div className="border-b border-sand/70 bg-cream/95 backdrop-blur">
        <div className="container-x flex items-center justify-between gap-4 py-4">
          <Link href="/" className="flex items-center gap-3" aria-label="Roemah Aura — Beranda">
            <span className="grid h-11 w-11 place-items-center rounded-full border border-gold/60 bg-ivory font-serif text-base tracking-[0.06em] text-gold-dark">
              RA
            </span>
            <span className="leading-none">
              <span className="block font-serif text-xl tracking-[0.22em] text-cocoa sm:text-[22px]">
                ROEMAH AURA
              </span>
              <span className="mt-1.5 block text-[8px] uppercase tracking-[0.38em] text-gold-dark sm:text-[9px]">
                Elegance in Every Occasion
              </span>
            </span>
          </Link>

          <nav className="hidden items-center gap-6 xl:flex">
            {NAV_LINKS.map((link) =>
              link.label === "Katalog" ? (
                <div key={link.href} className="group relative">
                  <Link
                    href={link.href}
                    className={`flex items-center gap-1.5 pb-1 text-[11px] uppercase tracking-[0.18em] transition-colors ${
                      isActive(link.href) ? "text-gold-dark" : "text-cocoa/80 hover:text-gold-dark"
                    }`}
                  >
                    Katalog
                    <svg width="9" height="9" viewBox="0 0 12 12" fill="none" aria-hidden>
                      <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.2" />
                    </svg>
                  </Link>
                  <div className="invisible absolute left-1/2 top-full w-60 -translate-x-1/2 pt-4 opacity-0 transition-all duration-200 group-hover:visible group-hover:opacity-100">
                    <div className="border border-sand/80 bg-ivory p-2 shadow-[var(--shadow-soft)]">
                      {categories.map((category) => (
                        <Link
                          key={category.slug}
                          href={`/katalog?kategori=${category.slug}`}
                          className="block px-3 py-2.5 text-[12px] tracking-wide text-cocoa/80 transition-colors hover:bg-cream hover:text-gold-dark"
                        >
                          {category.name}
                        </Link>
                      ))}
                      <Link
                        href="/katalog"
                        className="mt-1 block border-t border-sand/70 px-3 py-2.5 text-[11px] uppercase tracking-[0.18em] text-gold-dark"
                      >
                        Lihat semua koleksi
                      </Link>
                    </div>
                  </div>
                </div>
              ) : (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`pb-1 text-[11px] uppercase tracking-[0.18em] transition-colors ${
                    isActive(link.href)
                      ? "border-b border-gold text-gold-dark"
                      : "text-cocoa/80 hover:text-gold-dark"
                  }`}
                >
                  {link.label}
                </Link>
              ),
            )}
          </nav>

          <div className="flex items-center gap-2">
            <a
              href={whatsappLink(
                whatsapp,
                "Halo Roemah Aura, saya ingin berkonsultasi mengenai sewa pakaian.",
              )}
              target="_blank"
              rel="noreferrer"
              className="btn btn-gold hidden !px-5 !py-3 !text-[10px] sm:inline-flex"
            >
              Booking via WhatsApp
            </a>
            <button
              type="button"
              onClick={() => setOpen((value) => !value)}
              aria-label="Buka menu"
              aria-expanded={open}
              className="grid h-11 w-11 place-items-center border border-sand text-cocoa xl:hidden"
            >
              <span className="sr-only">Menu</span>
              <div className="space-y-1.5">
                <span
                  className={`block h-px w-5 bg-cocoa transition-transform ${open ? "translate-y-[7px] rotate-45" : ""}`}
                />
                <span className={`block h-px w-5 bg-cocoa transition-opacity ${open ? "opacity-0" : ""}`} />
                <span
                  className={`block h-px w-5 bg-cocoa transition-transform ${open ? "-translate-y-[7px] -rotate-45" : ""}`}
                />
              </div>
            </button>
          </div>
        </div>
      </div>

      {open && (
        <div className="border-b border-sand bg-ivory xl:hidden">
          <div className="container-x max-h-[75vh] overflow-y-auto py-5">
            <nav className="grid grid-cols-2 gap-x-4 gap-y-1">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`border-b border-sand/60 py-3 text-[12px] uppercase tracking-[0.16em] ${
                    isActive(link.href) ? "text-gold-dark" : "text-cocoa/80"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
            <p className="mt-5 text-[10px] uppercase tracking-[0.24em] text-gold-dark">Kategori</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {categories.map((category) => (
                <Link
                  key={category.slug}
                  href={`/katalog?kategori=${category.slug}`}
                  className="border border-sand px-3 py-2 text-[11px] text-cocoa/80"
                >
                  {category.name}
                </Link>
              ))}
            </div>
            <a
              href={whatsappLink(whatsapp, "Halo Roemah Aura, saya ingin bertanya tentang sewa pakaian.")}
              target="_blank"
              rel="noreferrer"
              className="btn btn-gold mt-5 w-full"
            >
              Hubungi Admin via WhatsApp
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
