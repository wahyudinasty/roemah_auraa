import Link from "next/link";
import type { ReactNode } from "react";
import { bookingStatusMeta, productStatusMeta } from "@/lib/format";

export function StatCard({
  label,
  value,
  hint,
  accent,
}: {
  label: string;
  value: string | number;
  hint?: string;
  accent?: boolean;
}) {
  return (
    <div
      className={`border p-5 ${
        accent ? "border-gold/50 bg-gradient-to-br from-[#fdf8ec] to-[#f6ecd8]" : "border-sand/70 bg-white"
      }`}
    >
      <p className="text-[9px] uppercase tracking-[0.18em] text-cocoa/45">{label}</p>
      <p className={`mt-2 font-serif text-3xl ${accent ? "text-gold-dark" : "text-cocoa"}`}>{value}</p>
      {hint && <p className="mt-1 text-[11px] text-cocoa/45">{hint}</p>}
    </div>
  );
}

export function BookingStatusBadge({ status }: { status: string }) {
  const meta = bookingStatusMeta[status] ?? bookingStatusMeta.menunggu;
  return (
    <span
      className={`inline-flex items-center gap-1.5 whitespace-nowrap border px-2 py-1 text-[10px] font-medium uppercase tracking-[0.08em] ${meta.className}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${meta.dot}`} />
      {meta.label}
    </span>
  );
}

export function ProductStatusBadge({ status }: { status: string }) {
  const meta = productStatusMeta[status] ?? productStatusMeta.tersedia;
  return (
    <span
      className={`inline-flex items-center whitespace-nowrap border px-2 py-1 text-[10px] uppercase tracking-[0.08em] ${meta.className}`}
    >
      {meta.label}
    </span>
  );
}

export function AdminPageHeader({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
      <div>
        <p className="text-[9px] uppercase tracking-[0.24em] text-gold-dark">{eyebrow}</p>
        <h1 className="mt-2 font-serif text-3xl text-cocoa">{title}</h1>
        {description && <p className="mt-1.5 max-w-2xl text-[13px] text-cocoa/55">{description}</p>}
      </div>
      {action}
    </div>
  );
}

export function Notice({ tone = "success", children }: { tone?: "success" | "error"; children: ReactNode }) {
  return (
    <div
      className={`mb-6 border px-4 py-3 text-[12px] ${
        tone === "success"
          ? "border-emerald-200 bg-emerald-50 text-emerald-800"
          : "border-rose-200 bg-rose-50 text-rose-800"
      }`}
    >
      {children}
    </div>
  );
}

export function AdminEmpty({ title, description }: { title: string; description: string }) {
  return (
    <div className="border border-dashed border-sand bg-white px-6 py-14 text-center">
      <p className="font-serif text-lg text-cocoa">{title}</p>
      <p className="mx-auto mt-2 max-w-md text-[12px] text-cocoa/50">{description}</p>
    </div>
  );
}

export function AdminLinkButton({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-2 bg-cocoa px-4 py-2.5 text-[10px] font-medium uppercase tracking-[0.16em] text-cream transition-colors hover:bg-gold-dark"
    >
      {children}
    </Link>
  );
}
