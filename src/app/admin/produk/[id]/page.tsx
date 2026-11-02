import Link from "next/link";
import { notFound } from "next/navigation";
import { AdminPageHeader, Notice } from "@/components/admin/ui";
import ProductForm from "@/components/admin/product-form";
import { getCategories, getProductBookings, getProductById } from "@/lib/data";
import { formatDate } from "@/lib/format";

type Params = Promise<{ id: string }>;
type SearchParams = Promise<{ error?: string }>;

export default async function EditProductPage({
  params,
  searchParams,
}: {
  params: Params;
  searchParams: SearchParams;
}) {
  const [{ id }, { error }] = await Promise.all([params, searchParams]);
  const productId = Number(id);
  if (!Number.isFinite(productId)) notFound();

  const [product, categories] = await Promise.all([getProductById(productId), getCategories()]);
  if (!product) notFound();

  const schedule = await getProductBookings(product.id);

  return (
    <>
      <AdminPageHeader
        eyebrow={`Produk ${product.code}`}
        title={product.name}
        description="Perbarui informasi produk, harga, stok, dan status ketersediaan."
        action={
          <div className="flex gap-2">
            <Link href={`/katalog/${product.slug}`} className="btn btn-ghost !py-2.5 !text-[10px]">
              Lihat di website
            </Link>
            <Link href="/admin/produk" className="btn btn-dark !py-2.5 !text-[10px]">
              ← Kembali
            </Link>
          </div>
        }
      />
      {error === "duplicate" && (
        <Notice tone="error">Kode produk sudah digunakan oleh koleksi lain.</Notice>
      )}
      {error === "1" && <Notice tone="error">Nama, kode, dan kategori wajib diisi.</Notice>}

      <div className="grid gap-6 xl:grid-cols-[1.6fr_1fr]">
        <ProductForm product={product} categories={categories} />

        <aside className="space-y-4">
          <div className="border border-sand/70 bg-white p-5">
            <h2 className="font-serif text-lg text-cocoa">Jadwal aktif</h2>
            <p className="mt-1 text-[11px] text-cocoa/50">
              Booking pada koleksi ini (menunggu, dikonfirmasi, dan sedang disewa).
            </p>
            {schedule.length === 0 ? (
              <p className="mt-4 text-[12px] text-cocoa/45">Belum ada booking aktif.</p>
            ) : (
              <ul className="mt-4 divide-y divide-sand/60 text-[12px]">
                {schedule.map((item) => (
                  <li key={item.code} className="flex items-center justify-between gap-3 py-2.5">
                    <div>
                      <p className="text-cocoa/75">{item.code}</p>
                      <p className="text-[10px] text-cocoa/40">
                        {formatDate(item.startDate)} – {formatDate(item.endDate)}
                      </p>
                    </div>
                    <span className="text-[10px] uppercase tracking-[0.1em] text-cocoa/45">
                      {item.qty} unit
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="border border-sand/70 bg-white p-5">
            <h2 className="font-serif text-lg text-cocoa">Pratinjau foto utama</h2>
            <div className="mt-3 overflow-hidden border border-sand/70 bg-cream">
              {product.images?.[0] ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="h-56 w-full object-cover"
                />
              ) : (
                <div className="grid h-40 place-items-center font-serif text-2xl text-gold">RA</div>
              )}
            </div>
            <p className="mt-2 text-[10px] text-cocoa/45">
              {product.images?.length ?? 0} foto terdaftar · slug: {product.slug}
            </p>
          </div>
        </aside>
      </div>
    </>
  );
}
