import Link from "next/link";
import { AdminPageHeader, Notice } from "@/components/admin/ui";
import ProductForm from "@/components/admin/product-form";
import { getCategories } from "@/lib/data";

type SearchParams = Promise<{ error?: string }>;

export default async function NewProductPage({ searchParams }: { searchParams: SearchParams }) {
  const [{ error }, categories] = await Promise.all([searchParams, getCategories()]);

  return (
    <>
      <AdminPageHeader
        eyebrow="Manajemen Produk"
        title="Tambah Produk Baru"
        description="Lengkapi data koleksi agar tampil rapi di katalog dan dapat di-booking pelanggan."
        action={
          <Link href="/admin/produk" className="btn btn-ghost !py-2.5 !text-[10px]">
            ← Kembali
          </Link>
        }
      />
      {error === "duplicate" && (
        <Notice tone="error">Kode atau nama produk sudah digunakan. Gunakan kode lain.</Notice>
      )}
      {error === "1" && <Notice tone="error">Nama, kode, dan kategori wajib diisi.</Notice>}
      <ProductForm categories={categories} />
    </>
  );
}
