"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/admin", label: "Ringkasan", icon: "◈" },
  { href: "/admin/produk", label: "Produk & Stok", icon: "◍" },
  { href: "/admin/booking", label: "Booking", icon: "❖" },
  { href: "/admin/kalender", label: "Kalender", icon: "▤" },
  { href: "/admin/pelanggan", label: "Pelanggan", icon: "◇" },
  { href: "/admin/laporan", label: "Laporan", icon: "◔" },
  { href: "/admin/pengaturan", label: "Pengaturan", icon: "⚙" },
];

export default function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="flex gap-1 overflow-x-auto lg:flex-col lg:gap-0.5 lg:overflow-visible">
      {links.map((link) => {
        const active = link.href === "/admin" ? pathname === "/admin" : pathname.startsWith(link.href);
        return (
          <Link
            key={link.href}
            href={link.href}
            className={`flex shrink-0 items-center gap-3 border-b-2 px-3 py-3 text-[11px] uppercase tracking-[0.14em] transition-colors lg:border-b-0 lg:border-l-2 lg:px-4 ${
              active
                ? "border-gold bg-cream/10 text-gold"
                : "border-transparent text-cream/60 hover:bg-cream/5 hover:text-cream"
            }`}
          >
            <span className="text-sm">{link.icon}</span>
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
