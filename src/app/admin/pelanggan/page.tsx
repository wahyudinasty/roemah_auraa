import Link from "next/link";
import { AdminEmpty, AdminPageHeader } from "@/components/admin/ui";
import { getCustomers } from "@/lib/data";
import { formatDate, rupiah, whatsappLink } from "@/lib/format";

export default async function AdminCustomersPage() {
  const customers = await getCustomers();
  const repeat = customers.filter((customer) => customer.bookingCount > 1).length;

  return (
    <>
      <AdminPageHeader
        eyebrow="Data Pelanggan"
        title="Pelanggan"
        description="Data pelanggan dibuat otomatis saat booking diajukan. Gunakan seperlunya dan jaga kerahasiaan informasi pribadi."
      />

      <div className="mb-4 grid gap-3 sm:grid-cols-3">
        {[
          { label: "Total pelanggan", value: customers.length },
          { label: "Pelanggan berulang", value: repeat },
          {
            label: "Total nilai tercatat",
            value: rupiah(customers.reduce((sum, customer) => sum + customer.spent, 0)),
          },
        ].map((item) => (
          <div key={item.label} className="border border-sand/70 bg-white px-4 py-3">
            <p className="text-[9px] uppercase tracking-[0.16em] text-cocoa/40">{item.label}</p>
            <p className="font-serif text-xl text-cocoa">{item.value}</p>
          </div>
        ))}
      </div>

      {customers.length === 0 ? (
        <AdminEmpty
          title="Belum ada pelanggan"
          description="Data pelanggan akan terisi otomatis ketika ada permintaan booking dari website."
        />
      ) : (
        <div className="border border-sand/70 bg-white">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-[12px]">
              <thead className="text-[9px] uppercase tracking-[0.14em] text-cocoa/40">
                <tr className="border-b border-sand/70">
                  <th className="px-5 py-3 font-medium">Nama</th>
                  <th className="px-5 py-3 font-medium">WhatsApp</th>
                  <th className="px-5 py-3 font-medium">Booking</th>
                  <th className="px-5 py-3 font-medium">Nilai transaksi</th>
                  <th className="px-5 py-3 font-medium">Terdaftar</th>
                  <th className="px-5 py-3 text-right font-medium">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sand/60">
                {customers.map((customer) => (
                  <tr key={customer.id} className="hover:bg-cream/40">
                    <td className="px-5 py-3">
                      <p className="font-medium text-cocoa">{customer.name}</p>
                      {customer.instagram && (
                        <p className="text-[10px] text-cocoa/40">{customer.instagram}</p>
                      )}
                    </td>
                    <td className="px-5 py-3 text-cocoa/70">{customer.phone}</td>
                    <td className="px-5 py-3">
                      <Link
                        href={`/admin/booking?q=${encodeURIComponent(customer.phone)}`}
                        className="text-gold-dark hover:underline"
                      >
                        {customer.bookingCount} booking
                      </Link>
                    </td>
                    <td className="px-5 py-3 text-cocoa/70">{rupiah(customer.spent)}</td>
                    <td className="px-5 py-3 text-cocoa/55">{formatDate(customer.createdAt)}</td>
                    <td className="px-5 py-3 text-right">
                      <a
                        href={whatsappLink(
                          customer.phone,
                          `Halo ${customer.name}, ini admin Roemah Aura. Ada yang bisa kami bantu untuk acara Anda?`,
                        )}
                        target="_blank"
                        rel="noreferrer"
                        className="border border-sand px-2.5 py-1.5 text-[10px] uppercase tracking-[0.1em] text-cocoa/65 hover:border-gold hover:text-gold-dark"
                      >
                        Chat
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <p className="mt-5 border border-sand/70 bg-cream/50 px-4 py-3 text-[11px] leading-relaxed text-cocoa/50">
        Privasi: hanya simpan informasi yang dibutuhkan untuk pelayanan penyewaan (nama, kontak, dan
        riwayat booking). Hindari mencatat data sensitif seperti nomor identitas pada kolom catatan.
      </p>
    </>
  );
}
