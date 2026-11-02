import Link from "next/link";
import type { ProductWithCategory } from "@/lib/data";
import { productStatusMeta, rupiah, rupiahRange } from "@/lib/format";

export function ProductCard({ product }: { product: ProductWithCategory }) {
  const status = productStatusMeta[product.status] ?? productStatusMeta.tersedia;
  const isMaintenance = product.status === "perawatan";
  const cover = product.images?.[0];

  return (
    <article className="group flex h-full flex-col">
      <Link
        href={`/katalog/${product.slug}`}
        className="relative block overflow-hidden bg-cream-deep"
      >
        <div className="aspect-[4/5] w-full overflow-hidden">
          {cover ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={cover}
              alt={product.name}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.05]"
            />
          ) : (
            <div className="grid h-full place-items-center font-serif text-3xl text-gold">RA</div>
          )}
        </div>
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-cocoa/45 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        <span className="absolute left-3 top-3 bg-ivory/95 px-2.5 py-1 text-[9px] uppercase tracking-[0.18em] text-cocoa/70">
          {product.categoryName}
        </span>
        {product.featured && !isMaintenance && (
          <span className="absolute right-3 top-3 bg-gold px-2.5 py-1 text-[9px] uppercase tracking-[0.18em] text-white">
            Unggulan
          </span>
        )}
        {isMaintenance && (
          <span className="absolute right-3 top-3 border border-amber-300 bg-amber-50 px-2.5 py-1 text-[9px] uppercase tracking-[0.18em] text-amber-800">
            Perawatan
          </span>
        )}
        <span className="absolute inset-x-3 bottom-3 translate-y-2 text-center text-[10px] uppercase tracking-[0.2em] text-white opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          Lihat Detail
        </span>
      </Link>

      <div className="flex flex-1 flex-col border border-t-0 border-sand/70 bg-ivory p-4">
        <div className="flex items-center justify-between text-[9px] uppercase tracking-[0.18em] text-cocoa/40">
          <span>{product.code}</span>
          <span className={`inline-flex items-center gap-1.5 ${isMaintenance ? "text-amber-700" : "text-emerald-700"}`}>
            <span className={`h-1 w-1 rounded-full ${isMaintenance ? "bg-amber-500" : "bg-emerald-500"}`} />
            {status.label}
          </span>
        </div>
        <h3 className="mt-2 font-serif text-lg leading-snug text-cocoa">
          <Link href={`/katalog/${product.slug}`} className="hover:text-gold-dark">
            {product.name}
          </Link>
        </h3>
        <p className="mt-1 text-[11px] text-cocoa/50">
          {product.sizes?.length ? `Ukuran ${product.sizes.join(" · ")}` : "Ukuran sesuai stok"}
        </p>
        <div className="mt-4 flex items-end justify-between border-t border-sand/60 pt-3">
          <div>
            <p className="text-[9px] uppercase tracking-[0.16em] text-cocoa/40">Sewa mulai</p>
            <p className="font-serif text-lg text-gold-dark">
              {rupiahRange(product.price, product.priceMax)}
            </p>
          </div>
          <Link
            href={`/katalog/${product.slug}`}
            className="text-[10px] uppercase tracking-[0.18em] text-cocoa/70 underline decoration-gold/60 decoration-1 underline-offset-4 transition-colors hover:text-gold-dark"
          >
            Sewa
          </Link>
        </div>
      </div>
    </article>
  );
}

export function ProductGrid({ products }: { products: ProductWithCategory[] }) {
  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-8 lg:grid-cols-4 lg:gap-x-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

export function PriceBadge({ min, max }: { min: number; max?: number | null }) {
  return <span className="font-serif text-lg text-gold-dark">{rupiahRange(min, max)}</span>;
}

export function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <div className="border border-dashed border-sand bg-ivory/60 px-6 py-16 text-center">
      <p className="font-serif text-xl text-cocoa">{title}</p>
      <p className="mx-auto mt-2 max-w-md text-sm text-cocoa/55">{description}</p>
    </div>
  );
}

export function rupiahLabel(value: number) {
  return rupiah(value);
}
