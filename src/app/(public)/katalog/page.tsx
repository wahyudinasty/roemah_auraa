import type { Metadata } from "next";
import Link from "next/link";
import { EmptyState, ProductGrid } from "@/components/product-card";
import { getCategories, getProducts, getSettings } from "@/lib/data";
import { whatsappLink } from "@/lib/format";

export const metadata: Metadata = {
  title: "Katalog Koleksi",
  description:
    "Jelajahi koleksi pakaian adat, kebaya, jas pria, pakaian anak, dan kostum sekolah & pentas Roemah Aura.",
};

type SearchParams = Promise<{ kategori?: string; q?: string; sort?: string }>;

export default async function CatalogPage({ searchParams }: { searchParams: SearchParams }) {
  const { kategori, q, sort } = await searchParams;
  const [categories, settings] = await Promise.all([getCategories(), getSettings()]);
  const activeCategory = categories.find((category) => category.slug === kategori);

  let products = await getProducts({
    categorySlug: activeCategory?.slug,
    search: q?.trim() || undefined,
  });

  if (sort === "termurah") products = [...products].sort((a, b) => a.price - b.price);
  if (sort === "termahal") products = [...products].sort((a, b) => b.price - a.price);

  const totalStock = products.reduce((sum, product) => sum + product.stockTotal, 0);

  return (
    <>
      <section className="relative overflow-hidden border-b border-sand/60 bg-ivory">
        <div className="pattern-gold pointer-events-none absolute inset-y-0 right-0 w-1/4 opacity-25" />
        <div className="container-x relative py-14 lg:py-16">
          <nav className="flex items-center gap-2 text-[10px] uppercase tracking-[0.18em] text-cocoa/45">
            <Link href="/" className="hover:text-gold-dark">
              Beranda
            </Link>
            <span>/</span>
            <span className="text-cocoa/70">Katalog</span>
            {activeCategory && (
              <>
                <span>/</span>
                <span className="text-gold-dark">{activeCategory.name}</span>
              </>
            )}
          </nav>
          <div className="mt-5 flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="eyebrow">Koleksi Roemah Aura</p>
              <h1 className="mt-4 max-w-2xl font-serif text-4xl leading-tight text-cocoa sm:text-5xl">
                {activeCategory ? activeCategory.name : "Katalog Busana & Kostum"}
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-relaxed text-cocoa/60">
                {activeCategory
                  ? activeCategory.description
                  : "Pilih dari koleksi pakaian adat, kebaya, jas pria, pakaian anak, serta kostum sekolah dan pentas. Setiap koleksi mencantumkan kode, harga sewa, ukuran, dan status ketersediaan."}
              </p>
            </div>
            <div className="flex gap-6 border border-sand/70 bg-cream/70 px-5 py-4 text-center">
              <div>
                <p className="font-serif text-2xl text-gold-dark">{products.length}</p>
                <p className="text-[9px] uppercase tracking-[0.16em] text-cocoa/45">Koleksi tampil</p>
              </div>
              <div className="w-px bg-sand/80" />
              <div>
                <p className="font-serif text-2xl text-gold-dark">{totalStock}</p>
                <p className="text-[9px] uppercase tracking-[0.16em] text-cocoa/45">Total unit</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container-x py-10 lg:py-14">
        <div className="border border-sand/70 bg-ivory p-4 sm:p-5">
          <form className="grid gap-4 lg:grid-cols-[1fr_auto_auto]" action="/katalog" method="get">
            <div>
              <label htmlFor="q" className="field-label">
                Cari koleksi
              </label>
              <div className="relative">
                <input
                  id="q"
                  name="q"
                  defaultValue={q ?? ""}
                  placeholder="Nama produk, kode, atau kata kunci…"
                  className="field !pl-9"
                />
                <svg
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-cocoa/35"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden
                >
                  <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.6" />
                  <path d="m16.5 16.5 4 4" stroke="currentColor" strokeWidth="1.6" />
                </svg>
              </div>
            </div>
            <div className="lg:w-48">
              <label htmlFor="kategori" className="field-label">
                Kategori
              </label>
              <select id="kategori" name="kategori" defaultValue={kategori ?? ""} className="field">
                <option value="">Semua kategori</option>
                {categories.map((category) => (
                  <option key={category.slug} value={category.slug}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-end gap-2">
              <div className="flex-1 lg:w-40">
                <label htmlFor="sort" className="field-label">
                  Urutkan
                </label>
                <select id="sort" name="sort" defaultValue={sort ?? ""} className="field">
                  <option value="">Rekomendasi</option>
                  <option value="termurah">Harga terendah</option>
                  <option value="termahal">Harga tertinggi</option>
                </select>
              </div>
              <button type="submit" className="btn btn-dark !px-5">
                Terapkan
              </button>
            </div>
          </form>

          <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-sand/60 pt-4">
            <span className="mr-1 text-[9px] uppercase tracking-[0.2em] text-cocoa/40">Kategori</span>
            <Link
              href={`/katalog${q ? `?q=${encodeURIComponent(q)}` : ""}`}
              className={`border px-3 py-1.5 text-[11px] transition-colors ${
                !activeCategory
                  ? "border-gold bg-gold text-white"
                  : "border-sand text-cocoa/65 hover:border-gold hover:text-gold-dark"
              }`}
            >
              Semua
            </Link>
            {categories.map((category) => {
              const params = new URLSearchParams();
              params.set("kategori", category.slug);
              if (q) params.set("q", q);
              if (sort) params.set("sort", sort);
              const isActive = activeCategory?.slug === category.slug;
              return (
                <Link
                  key={category.slug}
                  href={`/katalog?${params.toString()}`}
                  className={`border px-3 py-1.5 text-[11px] transition-colors ${
                    isActive
                      ? "border-gold bg-gold text-white"
                      : "border-sand text-cocoa/65 hover:border-gold hover:text-gold-dark"
                  }`}
                >
                  {category.name}
                </Link>
              );
            })}
          </div>
        </div>

        <div className="mt-10">
          {products.length > 0 ? (
            <ProductGrid products={products} />
          ) : (
            <EmptyState
              title="Koleksi tidak ditemukan"
              description="Coba kata kunci lain atau reset filter. Anda juga dapat menghubungi admin untuk koleksi yang belum ditampilkan."
            />
          )}
        </div>

        <div className="mt-14 grid items-center gap-6 border border-gold/30 bg-ivory p-6 sm:grid-cols-[1fr_auto] sm:p-8">
          <div>
            <p className="eyebrow">Tidak menemukan yang dicari?</p>
            <h2 className="mt-3 font-serif text-2xl text-cocoa">
              Koleksi baru dan sewa rombongan bisa kami siapkan.
            </h2>
            <p className="mt-2 text-sm text-cocoa/60">
              Kebutuhan pentas sekolah, karnaval, atau beberapa set sekaligus? Hubungi admin untuk
              jadwal dan harga khusus.
            </p>
          </div>
          <a
            href={whatsappLink(
              settings.whatsapp,
              "Halo Roemah Aura, saya ingin menanyakan koleksi yang belum ada di katalog.",
            )}
            target="_blank"
            rel="noreferrer"
            className="btn btn-gold"
          >
            Tanya Admin
          </a>
        </div>
      </section>
    </>
  );
}
