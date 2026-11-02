import { AdminPageHeader, StatCard } from "@/components/admin/ui";
import {
  getBookings,
  getDashboardStats,
  getMonthlyRevenue,
  getStatusBreakdown,
  getTopProducts,
} from "@/lib/data";
import {
  bookingStatusMeta,
  formatDate,
  rupiah,
  todayISO,
} from "@/lib/format";

export default async function AdminReportPage() {
  const [stats, months, topProducts, statuses, bookings] = await Promise.all([
    getDashboardStats(),
    getMonthlyRevenue(),
    getTopProducts(),
    getStatusBreakdown(),
    getBookings({ limit: 300 }),
  ]);

  const validBookings = bookings.filter((booking) => booking.status !== "dibatalkan");
  const average = validBookings.length ? Math.round(stats.revenue / validBookings.length) : 0;
  const today = todayISO();
  const late = bookings.filter((booking) => booking.status === "diambil" && booking.endDate < today);
  const maxRevenue = Math.max(1, ...months.map((month) => month.revenue));
  const totalStatus = Math.max(1, statuses.reduce((sum, item) => sum + item.total, 0));

  return (
    <>
      <AdminPageHeader
        eyebrow="Laporan"
        title="Rekap Transaksi & Penyewaan"
        description="Ringkasan pendapatan, koleksi terlaris, dan keterlambatan pengembalian untuk evaluasi operasional."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total pendapatan" value={rupiah(stats.revenue)} hint="Tanpa booking dibatalkan" accent />
        <StatCard label="Rata-rata per booking" value={rupiah(average)} hint={`${validBookings.length} booking valid`} />
        <StatCard label="Booking aktif" value={stats.active + stats.confirmed} hint="Konfirmasi + sedang disewa" />
        <StatCard label="Keterlambatan" value={late.length} hint="Perlu tindak lanjut admin" />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.4fr_1fr]">
        <section className="border border-sand/70 bg-white p-5">
          <h2 className="font-serif text-lg text-cocoa">Pendapatan per bulan</h2>
          <p className="text-[11px] text-cocoa/45">Berdasarkan tanggal booking masuk</p>
          <div className="mt-5 flex h-48 items-end gap-3">
            {months.length === 0 && <p className="text-[12px] text-cocoa/45">Belum ada data transaksi.</p>}
            {months.map((month) => (
              <div key={month.month} className="flex flex-1 flex-col items-center gap-1.5">
                <span className="text-[9px] text-cocoa/50">{rupiah(month.revenue)}</span>
                <div
                  className="w-full bg-gradient-to-t from-gold/60 to-gold"
                  style={{ height: `${Math.max(6, (month.revenue / maxRevenue) * 100)}%` }}
                />
                <span className="text-[10px] uppercase tracking-wide text-cocoa/45">{month.label}</span>
              </div>
            ))}
          </div>
          <table className="mt-6 w-full text-[12px]">
            <thead className="text-[9px] uppercase tracking-[0.14em] text-cocoa/40">
              <tr className="border-b border-sand/70">
                <th className="py-2 text-left font-medium">Bulan</th>
                <th className="py-2 text-right font-medium">Booking</th>
                <th className="py-2 text-right font-medium">Pendapatan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sand/50">
              {[...months].reverse().map((month) => (
                <tr key={`row-${month.month}`}>
                  <td className="py-2 text-cocoa/70">{month.month}</td>
                  <td className="py-2 text-right text-cocoa/60">{month.total}</td>
                  <td className="py-2 text-right text-cocoa/80">{rupiah(month.revenue)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <div className="space-y-6">
          <section className="border border-sand/70 bg-white p-5">
            <h2 className="font-serif text-lg text-cocoa">Koleksi terlaris</h2>
            <ul className="mt-4 space-y-3">
              {topProducts.length === 0 && <li className="text-[12px] text-cocoa/45">Belum ada data.</li>}
              {topProducts.map((product, index) => (
                <li key={product.code} className="flex items-start justify-between gap-3 border-b border-sand/50 pb-2.5">
                  <div>
                    <p className="text-[12px] text-cocoa/80">
                      <span className="mr-2 font-serif text-gold">{index + 1}.</span>
                      {product.name}
                    </p>
                    <p className="text-[10px] text-cocoa/40">
                      {product.code} · {product.total} booking · {product.qty} unit
                    </p>
                  </div>
                  <span className="whitespace-nowrap text-[11px] text-cocoa/60">{rupiah(product.revenue)}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="border border-sand/70 bg-white p-5">
            <h2 className="font-serif text-lg text-cocoa">Distribusi status</h2>
            <div className="mt-4 space-y-3">
              {statuses.map((status) => {
                const meta = bookingStatusMeta[status.status] ?? bookingStatusMeta.menunggu;
                return (
                  <div key={status.status}>
                    <div className="flex justify-between text-[11px]">
                      <span className="text-cocoa/65">{meta.label}</span>
                      <span className="text-cocoa/45">{status.total}</span>
                    </div>
                    <div className="mt-1 h-1.5 bg-cream">
                      <div
                        className={`h-full ${meta.dot}`}
                        style={{ width: `${(status.total / totalStatus) * 100}%` }}
                      />
                    </div>
                  </div>
                );
              })}
              {statuses.length === 0 && <p className="text-[12px] text-cocoa/45">Belum ada data.</p>}
            </div>
          </section>
        </div>
      </div>

      <section className="mt-6 border border-sand/70 bg-white">
        <div className="border-b border-sand/70 px-5 py-4">
          <h2 className="font-serif text-lg text-cocoa">Pengembalian terlambat</h2>
          <p className="text-[11px] text-cocoa/45">
            Booking berstatus “Sedang Disewa” dengan tanggal kembali sudah lewat.
          </p>
        </div>
        {late.length === 0 ? (
          <p className="px-5 py-6 text-[12px] text-cocoa/45">
            Tidak ada keterlambatan. Semua pengembalian sesuai jadwal.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-[12px]">
              <thead className="text-[9px] uppercase tracking-[0.14em] text-cocoa/40">
                <tr className="border-b border-sand/60">
                  <th className="px-5 py-2.5 text-left font-medium">Kode</th>
                  <th className="px-5 py-2.5 text-left font-medium">Pelanggan</th>
                  <th className="px-5 py-2.5 text-left font-medium">Koleksi</th>
                  <th className="px-5 py-2.5 text-left font-medium">Jatuh tempo</th>
                  <th className="px-5 py-2.5 text-right font-medium">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sand/50">
                {late.map((booking) => (
                  <tr key={booking.id}>
                    <td className="px-5 py-2.5 text-cocoa/70">{booking.code}</td>
                    <td className="px-5 py-2.5 text-cocoa/70">{booking.customerName}</td>
                    <td className="px-5 py-2.5 text-cocoa/60">{booking.productName}</td>
                    <td className="px-5 py-2.5 text-rose-700">{formatDate(booking.endDate)}</td>
                    <td className="px-5 py-2.5 text-right text-cocoa/70">{rupiah(booking.totalPrice)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </>
  );
}
