import Link from "next/link";
import { saveProductAction } from "@/app/admin/actions";
import type { Category, Product } from "@/db/schema";

export default function ProductForm({
  product,
  categories,
}: {
  product?: Product;
  categories: Category[];
}) {
  return (
    <form action={saveProductAction} className="space-y-5">
      {product && <input type="hidden" name="id" value={product.id} />}

      <section className="border border-sand/70 bg-white p-5">
        <h2 className="font-serif text-lg text-cocoa">Informasi koleksi</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label htmlFor="name" className="field-label">
              Nama produk *
            </label>
            <input
              id="name"
              name="name"
              required
              defaultValue={product?.name ?? ""}
              className="field"
              placeholder="Contoh: Kebaya Modern Aurora"
            />
          </div>
          <div>
            <label htmlFor="code" className="field-label">
              Kode unik *
            </label>
            <input
              id="code"
              name="code"
              required
              defaultValue={product?.code ?? ""}
              className="field"
              placeholder="KBY-01"
            />
          </div>
          <div>
            <label htmlFor="categoryId" className="field-label">
              Kategori *
            </label>
            <select
              id="categoryId"
              name="categoryId"
              required
              defaultValue={product?.categoryId ?? ""}
              className="field"
            >
              <option value="">Pilih kategori</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="description" className="field-label">
              Deskripsi
            </label>
            <textarea
              id="description"
              name="description"
              rows={4}
              defaultValue={product?.description ?? ""}
              className="field resize-none"
              placeholder="Bahan, model, dan catatan penting koleksi"
            />
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="includes" className="field-label">
              Kelengkapan paket (pisahkan dengan koma)
            </label>
            <input
              id="includes"
              name="includes"
              defaultValue={product?.includes ?? ""}
              className="field"
              placeholder="Kebaya, kain lilit, bros"
            />
          </div>
          <div>
            <label htmlFor="colors" className="field-label">
              Warna
            </label>
            <input
              id="colors"
              name="colors"
              defaultValue={product?.colors ?? ""}
              className="field"
              placeholder="Ivory, gold"
            />
          </div>
          <div>
            <label htmlFor="sizes" className="field-label">
              Ukuran (pisahkan dengan koma)
            </label>
            <input
              id="sizes"
              name="sizes"
              defaultValue={product?.sizes?.join(", ") ?? ""}
              className="field"
              placeholder="S, M, L, XL"
            />
          </div>
        </div>
      </section>

      <section className="border border-sand/70 bg-white p-5">
        <h2 className="font-serif text-lg text-cocoa">Harga, stok &amp; status</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <label htmlFor="price" className="field-label">
              Harga sewa (Rp) *
            </label>
            <input
              id="price"
              name="price"
              type="number"
              min={0}
              required
              defaultValue={product?.price ?? 0}
              className="field"
            />
          </div>
          <div>
            <label htmlFor="priceMax" className="field-label">
              Harga maksimum (opsional)
            </label>
            <input
              id="priceMax"
              name="priceMax"
              type="number"
              min={0}
              defaultValue={product?.priceMax ?? ""}
              className="field"
              placeholder="Kosongkan jika harga tetap"
            />
          </div>
          <div>
            <label htmlFor="deposit" className="field-label">
              Deposit (Rp)
            </label>
            <input
              id="deposit"
              name="deposit"
              type="number"
              min={0}
              defaultValue={product?.deposit ?? 0}
              className="field"
            />
          </div>
          <div>
            <label htmlFor="stockTotal" className="field-label">
              Jumlah stok (unit)
            </label>
            <input
              id="stockTotal"
              name="stockTotal"
              type="number"
              min={1}
              defaultValue={product?.stockTotal ?? 1}
              className="field"
            />
          </div>
          <div>
            <label htmlFor="rentalDays" className="field-label">
              Durasi sewa (hari)
            </label>
            <input
              id="rentalDays"
              name="rentalDays"
              type="number"
              min={1}
              defaultValue={product?.rentalDays ?? 3}
              className="field"
            />
          </div>
          <div>
            <label htmlFor="status" className="field-label">
              Status produk
            </label>
            <select id="status" name="status" defaultValue={product?.status ?? "tersedia"} className="field">
              <option value="tersedia">Tersedia</option>
              <option value="perawatan">Perawatan</option>
              <option value="arsip">Arsip</option>
            </select>
          </div>
          <label className="flex items-center gap-2 text-[12px] text-cocoa/70 sm:col-span-2">
            <input
              type="checkbox"
              name="featured"
              defaultChecked={product?.featured ?? false}
              className="h-4 w-4 accent-[#c5a267]"
            />
            Tampilkan sebagai koleksi unggulan di beranda
          </label>
        </div>
      </section>

      <section className="border border-sand/70 bg-white p-5">
        <h2 className="font-serif text-lg text-cocoa">Foto koleksi</h2>
        <p className="mt-1 text-[11px] text-cocoa/50">
          Satu URL per baris. Foto pertama menjadi foto utama. Gunakan tautan gambar publik (mis.
          hasil unggahan penyimpanan foto) hingga fitur unggah berkas dihubungkan.
        </p>
        <textarea
          id="images"
          name="images"
          rows={4}
          defaultValue={product?.images?.join("\n") ?? ""}
          className="field mt-3 resize-none font-mono !text-[11px]"
          placeholder="https://…/foto-1.jpg"
        />
      </section>

      <div className="flex flex-wrap items-center gap-3">
        <button type="submit" className="btn btn-gold">
          {product ? "Simpan Perubahan" : "Tambah Produk"}
        </button>
        <Link href="/admin/produk" className="btn btn-ghost">
          Batal
        </Link>
      </div>
    </form>
  );
}
