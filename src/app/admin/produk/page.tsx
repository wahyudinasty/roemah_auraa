import Link from "next/link";
import { archiveProductAction } from "@/app/admin/actions";
import {
  AdminEmpty,
  AdminLinkButton,
  AdminPageHeader,
  Notice,
  ProductStatusBadge,
} from "@/components/admin/ui";
import { getCategories, getProducts, getProductStats } from "@/lib/data";
import { rupiahRange } from "@/lib/format";

type SearchParams = Promise<{ q?: string; saved?: string; updated?: string }>;

export default async function AdminProductsPage({ searchParams }: { searchParams: SearchParams }) {
  const { q, saved, updated } = await searchParams;
  const [products, categories, stats] = await Promise.all([
    getProducts({ search: q?.trim() || undefined, includeArchived: true }),
    getCategories(),
    getProductStats(),
  ]);

  return (
    <>
      <AdminPageHeader
        eyebrow="Manajemen Produk"
        title="Produk & Stok"
        description="Kelola kode, kategori, harga, ukuran, foto, dan status ketersediaan setiap koleksi."
        action={<AdminLinkButton href="/admin/produk/baru">+ Tambah Produk</AdminLinkButton>}
      />

      {saved && <Notice>Perubahan produk berhasil disimpan.</Notice>}
      {updated && <Notice>Status produk berhasil diperbarui.</Notice>}

      <div className="mb-4 grid gap-3 sm:grid-cols-4">
        {[
          { label: "Total produk", value: stats.total },
          { label: "Tersedia", value: stats.tersedia },
          { label: "Perawatan", value: stats.perawatan },
          { label: "Arsip", value: stats.arsip },
        ].map((item) => (
          <div key={item.label} className="border border-sand/70 bg-white px-4 py-3">
            <p className="text-[9px] uppercase tracking-[0.16em] text-cocoa/40">{item.label}</p>
            <p className="font-serif text-xl text-cocoa">{item.value}</p>
          </div>
        ))}
      </div>

      <div className="border border-sand/70 bg-white">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-sand/70 px-5 py-4">
          <form action="/admin/produk" method="get" className="flex gap-2">
            <input
              name="q"
              defaultValue={q ?? ""}
              placeholder="Cari nama, kode, atau deskripsi…"
              className="field !w-64 !py-2 !text-[12px]"
            />
            <button type="submit" className="btn btn-dark !px-4 !py-2 !text-[10px]">
              Cari
            </button>
            {q && (
              <Link href="/admin/produk" className="self-center text-[10px] uppercase text-cocoa/45">
                Reset
              </Link>
            )}
          </form>
          <p className="text-[11px] text-cocoa/45">
            {products.length} produk · {categories.length} kategori
          </p>
        </div>

        {products.length === 0 ? (
          <div className="p-5">
            <AdminEmpty
              title="Produk tidak ditemukan"
              description="Ubah kata kunci pencarian atau tambahkan produk baru untuk mulai mengelola stok."
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[880px] text-left text-[12px]">
              <thead className="text-[9px] uppercase tracking-[0.14em] text-cocoa/40">
                <tr className="border-b border-sand/70">
                  <th className="px-5 py-3 font-medium">Produk</th>
                  <th className="px-5 py-3 font-medium">Kategori</th>
                  <th className="px-5 py-3 font-medium">Ukuran</th>
                  <th className="px-5 py-3 font-medium">Harga</th>
                  <th className="px-5 py-3 font-medium">Stok</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 text-right font-medium">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sand/60">
                {products.map((product) => (
                  <tr key={product.id} className="hover:bg-cream/40">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-10 shrink-0 overflow-hidden border border-sand/70 bg-cream">
                          {product.images?.[0] ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={product.images[0]}
                              alt={product.name}
                              loading="lazy"
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <span className="grid h-full place-items-center text-[10px] text-gold">RA</span>
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-cocoa">
                            {product.name}
                            {product.featured && <span className="ml-2 text-[9px] text-gold-dark">★</span>}
                          </p>
                          <p className="text-[10px] text-cocoa/45">{product.code}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-cocoa/60">{product.categoryName}</td>
                    <td className="px-5 py-3 text-cocoa/55">
                      {product.sizes?.join(", ") || "—"}
                    </td>
                    <td className="px-5 py-3 text-cocoa/70">
                      {rupiahRange(product.price, product.priceMax)}
                    </td>
                    <td className="px-5 py-3 text-cocoa/70">{product.stockTotal} unit</td>
                    <td className="px-5 py-3">
                      <ProductStatusBadge status={product.status} />
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/produk/${product.id}`}
                          className="border border-sand px-2.5 py-1.5 text-[10px] uppercase tracking-[0.1em] text-cocoa/65 hover:border-gold hover:text-gold-dark"
                        >
                          Ubah
                        </Link>
                        <form action={archiveProductAction}>
                          <input type="hidden" name="id" value={product.id} />
                          <input
                            type="hidden"
                            name="status"
                            value={product.status === "arsip" ? "tersedia" : "arsip"}
                          />
                          <button
                            type="submit"
                            className="border border-sand px-2.5 py-1.5 text-[10px] uppercase tracking-[0.1em] text-cocoa/65 hover:border-rose-300 hover:text-rose-700"
                          >
                            {product.status === "arsip" ? "Pulihkan" : "Arsipkan"}
                          </button>
                        </form>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
