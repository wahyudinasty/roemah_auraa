import Link from "next/link";
import type { ReactNode } from "react";

export function PageHero({
  eyebrow,
  title,
  description,
  crumb,
  children,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  crumb: string;
  children?: ReactNode;
}) {
  return (
    <section className="relative overflow-hidden border-b border-sand/60 bg-ivory">
      <div className="pattern-gold pointer-events-none absolute inset-y-0 right-0 w-1/3 opacity-25" />
      <div className="container-x relative py-14 lg:py-16">
        <nav className="flex items-center gap-2 text-[10px] uppercase tracking-[0.18em] text-cocoa/45">
          <Link href="/" className="hover:text-gold-dark">
            Beranda
          </Link>
          <span>/</span>
          <span className="text-cocoa/70">{crumb}</span>
        </nav>
        <div className="mt-5 flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-2xl">
            <p className="eyebrow">{eyebrow}</p>
            <h1 className="mt-4 font-serif text-4xl leading-tight text-cocoa sm:text-5xl">{title}</h1>
            {description && (
              <p className="mt-4 text-sm leading-relaxed text-cocoa/60 sm:text-[15px]">{description}</p>
            )}
          </div>
          {children}
        </div>
      </div>
    </section>
  );
}

export function SectionTitle({
  eyebrow,
  title,
  description,
  center,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  center?: boolean;
}) {
  return (
    <div className={center ? "text-center" : ""}>
      <p className={`eyebrow ${center ? "justify-center" : ""}`}>{eyebrow}</p>
      <h2 className="mt-3 font-serif text-2xl leading-tight text-cocoa sm:text-3xl">{title}</h2>
      {description && (
        <p className={`mt-3 max-w-2xl text-sm leading-relaxed text-cocoa/60 ${center ? "mx-auto" : ""}`}>
          {description}
        </p>
      )}
    </div>
  );
}
