import { saveSettingsAction } from "@/app/admin/actions";
import { AdminPageHeader, Notice } from "@/components/admin/ui";
import { getSettings } from "@/lib/data";

type SearchParams = Promise<{ saved?: string }>;

const fields = [
  { key: "brandName", label: "Nama usaha", type: "text" },
  { key: "tagline", label: "Tagline", type: "text" },
  { key: "whatsapp", label: "Nomor WhatsApp", type: "text", hint: "Contoh: 08161117656" },
  { key: "instagram", label: "Instagram", type: "text", hint: "Contoh: @Roemah_Aura" },
  { key: "address", label: "Alamat toko", type: "text" },
  { key: "mapsUrl", label: "Tautan Google Maps", type: "text", hint: "Tempel tautan lokasi atau embed maps" },
  { key: "hours", label: "Jam operasional", type: "text", hint: "Contoh: Senin–Sabtu, 09.00–18.00" },
  { key: "heroTitle", label: "Judul hero beranda", type: "text" },
] as const;

const longFields = [
  { key: "heroSubtitle", label: "Deskripsi hero beranda" },
  { key: "about", label: "Profil singkat (halaman Tentang)" },
  { key: "paymentNote", label: "Catatan pembayaran" },
  { key: "rentalNote", label: "Catatan durasi sewa" },
  { key: "depositNote", label: "Catatan deposit" },
] as const;

export default async function AdminSettingsPage({ searchParams }: { searchParams: SearchParams }) {
  const [{ saved }, settings] = await Promise.all([searchParams, getSettings()]);

  return (
    <>
      <AdminPageHeader
        eyebrow="Pengaturan Website"
        title="Informasi Usaha"
        description="Perubahan di sini langsung terlihat pada header, footer, halaman kontak, dan price list."
      />

      {saved && <Notice>Pengaturan berhasil disimpan dan dipublikasikan.</Notice>}

      <form action={saveSettingsAction} className="space-y-5">
        <section className="border border-sand/70 bg-white p-5">
          <h2 className="font-serif text-lg text-cocoa">Identitas &amp; kontak</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {fields.map((field) => (
              <div key={field.key} className={field.key === "address" ? "sm:col-span-2" : ""}>
                <label htmlFor={field.key} className="field-label">
                  {field.label}
                </label>
                <input
                  id={field.key}
                  name={field.key}
                  defaultValue={settings[field.key] ?? ""}
                  className="field"
                />
                {"hint" in field && field.hint && (
                  <p className="mt-1 text-[10px] text-cocoa/40">{field.hint}</p>
                )}
              </div>
            ))}
          </div>
        </section>

        <section className="border border-sand/70 bg-white p-5">
          <h2 className="font-serif text-lg text-cocoa">Narasi &amp; ketentuan</h2>
          <div className="mt-4 space-y-4">
            {longFields.map((field) => (
              <div key={field.key}>
                <label htmlFor={field.key} className="field-label">
                  {field.label}
                </label>
                <textarea
                  id={field.key}
                  name={field.key}
                  rows={field.key === "about" || field.key === "heroSubtitle" ? 4 : 3}
                  defaultValue={settings[field.key] ?? ""}
                  className="field resize-none"
                />
              </div>
            ))}
          </div>
        </section>

        <div className="border border-amber-200 bg-amber-50 px-4 py-3 text-[11px] leading-relaxed text-amber-900">
          Pastikan nomor WhatsApp, alamat, jam operasional, dan tautan Google Maps sudah final sebelum
          website dipublikasikan. Data kontak awal pada draft masih perlu dikonfirmasi pemilik usaha.
        </div>

        <button type="submit" className="btn btn-gold">
          Simpan Pengaturan
        </button>
      </form>
    </>
  );
}
