import Link from "next/link";
import {
  AdminEmpty,
  AdminLinkButton,
  AdminPageHeader,
  BookingStatusBadge,
  StatCard,
} from "@/components/admin/ui";
import {
  getBookings,
  getDashboardStats,
  getMonthlyRevenue,
  getStatusBreakdown,
} from "@/lib/data";
import {
  bookingStatusMeta,
  formatDate,
  formatDateTime,
  rentalDaysBetween,
  rupiah,
  todayISO,
} from "@/lib/format";

export default async function AdminDashboardPage() {
  const [stats, bookings, months, statuses] = await Promise.all([
    getDashboardStats(),
    getBookings({ limit: 8 }),
    getMonthlyRevenue(),
    getStatusBreakdown(),
  ]);

  const today = todayISO();
  const maxRevenue = Math.max(1, ...months.map((month) => month.revenue));
  const totalStatus = Math.max(1, statuses.reduce((sum, status) => sum + status.total, 0));
  const upcoming = bookings
    .filter((booking) => booking.endDate >= today && booking.status !== "dibatalkan")
    .sort((a, b) => a.startDate.localeCompare(b.startDate))
    .slice(0, 4);

  return (
    <>
      <AdminPageHeader
        eyebrow="Dashboard"
        title="Ringkasan Operasional"
        description="Pantau booking masuk, stok koleksi, dan jadwal penyewaan. Konfirmasi pesanan melalui WhatsApp tetap tercatat di sini."
        action={<AdminLinkButton href="/admin/booking">Kelola Booking →</AdminLinkButton>}
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Menunggu konfirmasi"
          value={stats.waiting}
          hint="Perlu diperiksa admin"
          accent
        />
        <StatCard label="Sedang disewa" value={stats.active} hint="Barang sudah diambil pelanggan" />
        <StatCard label="Booking terkonfirmasi" value={stats.confirmed} hint="Jadwal sudah disetujui" />
        <StatCard
          label="Pendapatan tercatat"
          value={rupiah(stats.revenue)}
          hint="Tidak termasuk booking dibatalkan"
        />
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="border border-sand/70 bg-white px-4 py-3">
          <p className="text-[9px] uppercase tracking-[0.16em] text-cocoa/40">Total koleksi</p>
          <p className="font-serif text-xl text-cocoa">{stats.products.total}</p>
          <p className="text-[10px] text-cocoa/45">
            {stats.products.tersedia} tersedia · {stats.products.perawatan} perawatan
          </p>
        </div>
        <div className="border border-sand/70 bg-white px-4 py-3">
          <p className="text-[9px] uppercase tracking-[0.16em] text-cocoa/40">Pelanggan terdata</p>
          <p className="font-serif text-xl text-cocoa">{stats.customers}</p>
          <p className="text-[10px] text-cocoa/45">Dibuat otomatis dari booking</p>
        </div>
        <div className="border border-sand/70 bg-white px-4 py-3">
          <p className="text-[9px] uppercase tracking-[0.16em] text-cocoa/40">Jatuh tempo 3 hari</p>
          <p className="font-serif text-xl text-cocoa">{stats.dueSoon}</p>
          <p className="text-[10px] text-cocoa/45">Siapkan pengingat pengembalian</p>
        </div>
        <div className="border border-sand/70 bg-white px-4 py-3">
          <p className="text-[9px] uppercase tracking-[0.16em] text-cocoa/40">Total booking</p>
          <p className="font-serif text-xl text-cocoa">{stats.bookings}</p>
          <p className="text-[10px] text-cocoa/45">{stats.returned} sudah dikembalikan</p>
        </div>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.65fr_1fr]">
        <section className="border border-sand/70 bg-white">
          <div className="flex items-center justify-between border-b border-sand/70 px-5 py-4">
            <div>
              <h2 className="font-serif text-lg text-cocoa">Booking terbaru</h2>
              <p className="text-[11px] text-cocoa/45">Permintaan terakhir dari website</p>
            </div>
            <Link
              href="/admin/booking"
              className="text-[10px] uppercase tracking-[0.14em] text-gold-dark hover:text-cocoa"
            >
              Semua
            </Link>
          </div>

          {bookings.length === 0 ? (
            <div className="p-5">
              <AdminEmpty
                title="Belum ada booking"
                description="Permintaan booking dari website akan muncul di sini secara otomatis."
              />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[620px] text-left text-[12px]">
                <thead className="text-[9px] uppercase tracking-[0.14em] text-cocoa/40">
                  <tr className="border-b border-sand/70">
                    <th className="px-5 py-3 font-medium">Kode / Pelanggan</th>
                    <th className="px-5 py-3 font-medium">Koleksi</th>
                    <th className="px-5 py-3 font-medium">Jadwal</th>
                    <th className="px-5 py-3 font-medium">Status</th>
                    <th className="px-5 py-3 text-right font-medium">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-sand/60">
                  {bookings.slice(0, 6).map((booking) => (
                    <tr key={booking.id} className="hover:bg-cream/40">
                      <td className="px-5 py-3">
                        <p className="font-medium text-cocoa">{booking.code}</p>
                        <p className="text-[11px] text-cocoa/50">{booking.customerName}</p>
                      </td>
                      <td className="px-5 py-3 text-cocoa/70">
                        {booking.productName}
                        <p className="text-[10px] text-cocoa/40">
                          {booking.productCode} · {booking.qty} unit
                        </p>
                      </td>
                      <td className="px-5 py-3 text-cocoa/60">
                        {formatDate(booking.startDate)}
                        <p className="text-[10px] text-cocoa/40">s.d. {formatDate(booking.endDate)}</p>
                      </td>
                      <td className="px-5 py-3">
                        <BookingStatusBadge status={booking.status} />
                      </td>
                      <td className="px-5 py-3 text-right font-medium text-cocoa">
                        {rupiah(booking.totalPrice)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <div className="space-y-6">
          <section className="border border-sand/70 bg-white p-5">
            <h2 className="font-serif text-lg text-cocoa">Status booking</h2>
            <div className="mt-4 space-y-3">
              {statuses.length === 0 && <p className="text-[12px] text-cocoa/45">Belum ada data.</p>}
              {statuses.map((status) => {
                const meta = bookingStatusMeta[status.status] ?? bookingStatusMeta.menunggu;
                return (
                  <div key={status.status}>
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-cocoa/65">{meta.label}</span>
                      <span className="text-cocoa/45">{status.total}</span>
                    </div>
                    <div className="mt-1 h-1.5 w-full bg-cream">
                      <div
                        className={`h-full ${meta.dot}`}
                        style={{ width: `${(status.total / totalStatus) * 100}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          <section className="border border-sand/70 bg-white p-5">
            <div className="flex items-center justify-between">
              <h2 className="font-serif text-lg text-cocoa">Pendapatan 6 bulan</h2>
              <Link href="/admin/laporan" className="text-[10px] uppercase tracking-[0.14em] text-gold-dark">
                Laporan
              </Link>
            </div>
            <div className="mt-4 flex h-32 items-end gap-2">
              {months.length === 0 && <p className="text-[12px] text-cocoa/45">Belum ada data.</p>}
              {months.map((month) => (
                <div key={month.month} className="flex flex-1 flex-col items-center gap-1">
                  <div
                    className="w-full bg-gradient-to-t from-gold/70 to-gold"
                    style={{ height: `${Math.max(6, (month.revenue / maxRevenue) * 100)}%` }}
                    title={rupiah(month.revenue)}
                  />
                  <span className="text-[9px] uppercase text-cocoa/40">{month.label}</span>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.65fr_1fr]">
        <section className="border border-sand/70 bg-white">
          <div className="border-b border-sand/70 px-5 py-4">
            <h2 className="font-serif text-lg text-cocoa">Jadwal terdekat</h2>
            <p className="text-[11px] text-cocoa/45">Pengambilan dan pengembalian yang perlu disiapkan</p>
          </div>
          {upcoming.length === 0 ? (
            <p className="px-5 py-6 text-[12px] text-cocoa/45">Tidak ada jadwal aktif.</p>
          ) : (
            <ul className="divide-y divide-sand/60">
              {upcoming.map((booking) => (
                <li key={booking.id} className="flex flex-wrap items-center justify-between gap-3 px-5 py-3.5">
                  <div>
                    <p className="text-[12px] font-medium text-cocoa">{booking.productName}</p>
                    <p className="text-[11px] text-cocoa/45">
                      {booking.customerName} · {booking.size || "-"} · {booking.qty} unit
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-[11px] text-cocoa/70">{formatDate(booking.startDate)}</p>
                    <p className="text-[10px] text-cocoa/40">
                      {rentalDaysBetween(booking.startDate, booking.endDate)} hari ·{" "}
                      {bookingStatusMeta[booking.status]?.label ?? booking.status}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="border border-sand/70 bg-white p-5">
          <h2 className="font-serif text-lg text-cocoa">Aktivitas terakhir</h2>
          <ul className="mt-4 space-y-3 text-[12px]">
            {bookings.slice(0, 5).map((booking) => (
              <li key={`activity-${booking.id}`} className="flex gap-3">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
                <div>
                  <p className="text-cocoa/75">
                    {booking.code} · {booking.customerName}
                  </p>
                  <p className="text-[10px] text-cocoa/40">{formatDateTime(booking.createdAt)}</p>
                </div>
              </li>
            ))}
            {bookings.length === 0 && <p className="text-cocoa/45">Belum ada aktivitas.</p>}
          </ul>
        </section>
      </div>
    </>
  );
}
