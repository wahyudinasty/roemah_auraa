import Link from "next/link";
import { AdminPageHeader, BookingStatusBadge } from "@/components/admin/ui";
import { getBookings } from "@/lib/data";
import { formatDate, todayISO } from "@/lib/format";

type SearchParams = Promise<{ bulan?: string }>;

const monthNames = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
];

const dayNames = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"];

const toMonthKey = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;

const shiftMonth = (key: string, delta: number) => {
  const [year, month] = key.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1 + delta, 1));
  return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}`;
};

export default async function AdminCalendarPage({ searchParams }: { searchParams: SearchParams }) {
  const { bulan } = await searchParams;
  const now = new Date();
  const isValid = bulan && /^\d{4}-\d{2}$/.test(bulan);
  const monthKey = isValid ? (bulan as string) : toMonthKey(now);
  const [year, month] = monthKey.split("-").map(Number);

  const bookings = await getBookings({ limit: 300 });
  const active = bookings.filter((booking) => booking.status !== "dibatalkan");

  const daysInMonth = new Date(Date.UTC(year, month, 0)).getUTCDate();
  const firstWeekday = (new Date(Date.UTC(year, month - 1, 1)).getUTCDay() + 6) % 7;
  const cells: (number | null)[] = [
    ...Array.from({ length: firstWeekday }, () => null),
    ...Array.from({ length: daysInMonth }, (_, index) => index + 1),
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  const periodBookings = active.filter((booking) => {
    const start = booking.startDate.slice(0, 7);
    const end = booking.endDate.slice(0, 7);
    return start <= monthKey && end >= monthKey;
  });

  const unitsOnDay = (day: number) => {
    const iso = `${monthKey}-${String(day).padStart(2, "0")}`;
    return periodBookings.filter(
      (booking) => booking.startDate <= iso && booking.endDate >= iso,
    );
  };

  const today = todayISO();
  const prev = shiftMonth(monthKey, -1);
  const next = shiftMonth(monthKey, 1);

  return (
    <>
      <AdminPageHeader
        eyebrow="Kalender Penyewaan"
        title="Jadwal Bulanan"
        description="Pantau pengambilan dan pengembalian per tanggal agar tidak terjadi benturan booking."
        action={
          <div className="flex items-center gap-2">
            <Link
              href={`/admin/kalender?bulan=${prev}`}
              className="border border-sand bg-white px-3 py-2 text-[10px] uppercase tracking-[0.12em] text-cocoa/60 hover:border-gold hover:text-gold-dark"
            >
              ← Sebelumnya
            </Link>
            <Link
              href={`/admin/kalender?bulan=${next}`}
              className="border border-sand bg-white px-3 py-2 text-[10px] uppercase tracking-[0.12em] text-cocoa/60 hover:border-gold hover:text-gold-dark"
            >
              Berikutnya →
            </Link>
          </div>
        }
      />

      <div className="border border-sand/70 bg-white">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-sand/70 px-5 py-4">
          <div>
            <h2 className="font-serif text-xl text-cocoa">
              {monthNames[month - 1]} {year}
            </h2>
            <p className="text-[11px] text-cocoa/45">
              {periodBookings.length} booking aktif pada bulan ini
            </p>
          </div>
          <Link
            href="/admin/kalender"
            className="text-[10px] uppercase tracking-[0.14em] text-gold-dark hover:text-cocoa"
          >
            Bulan ini
          </Link>
        </div>

        <div className="grid grid-cols-7 border-b border-sand/70 bg-cream/50 text-center">
          {dayNames.map((day) => (
            <div key={day} className="py-2 text-[9px] uppercase tracking-[0.14em] text-cocoa/45">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7">
          {cells.map((day, index) => {
            const iso = day ? `${monthKey}-${String(day).padStart(2, "0")}` : "";
            const items = day ? unitsOnDay(day) : [];
            const isToday = iso === today;
            return (
              <div
                key={`${iso}-${index}`}
                className={`min-h-[92px] border-b border-r border-sand/50 p-1.5 last:border-r-0 ${
                  day ? "" : "bg-cream/30"
                } ${isToday ? "bg-gold/10" : ""}`}
              >
                {day && (
                  <>
                    <p
                      className={`text-[11px] ${isToday ? "font-semibold text-gold-dark" : "text-cocoa/55"}`}
                    >
                      {day}
                    </p>
                    <div className="mt-1 space-y-1">
                      {items.slice(0, 2).map((booking) => (
                        <p
                          key={booking.code}
                          title={`${booking.code} · ${booking.productName}`}
                          className={`truncate border-l-2 px-1 text-[9px] ${
                            booking.status === "menunggu"
                              ? "border-amber-400 bg-amber-50 text-amber-900"
                              : booking.status === "diambil"
                                ? "border-sky-400 bg-sky-50 text-sky-900"
                                : "border-emerald-400 bg-emerald-50 text-emerald-900"
                          }`}
                        >
                          {booking.productCode} · {booking.qty}
                        </p>
                      ))}
                      {items.length > 2 && (
                        <p className="px-1 text-[9px] text-cocoa/40">+{items.length - 2} lainnya</p>
                      )}
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>

        <div className="flex flex-wrap gap-4 border-t border-sand/70 px-5 py-3 text-[10px] text-cocoa/50">
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 bg-amber-400" /> Menunggu konfirmasi
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 bg-emerald-400" /> Dikonfirmasi / dikembalikan
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 bg-sky-400" /> Sedang disewa
          </span>
        </div>
      </div>

      <section className="mt-6 border border-sand/70 bg-white">
        <div className="border-b border-sand/70 px-5 py-4">
          <h2 className="font-serif text-lg text-cocoa">Daftar jadwal bulan ini</h2>
        </div>
        {periodBookings.length === 0 ? (
          <p className="px-5 py-6 text-[12px] text-cocoa/45">Belum ada booking pada bulan ini.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] text-[12px]">
              <thead className="text-[9px] uppercase tracking-[0.14em] text-cocoa/40">
                <tr className="border-b border-sand/60">
                  <th className="px-5 py-2.5 text-left font-medium">Kode</th>
                  <th className="px-5 py-2.5 text-left font-medium">Pelanggan</th>
                  <th className="px-5 py-2.5 text-left font-medium">Koleksi</th>
                  <th className="px-5 py-2.5 text-left font-medium">Ambil</th>
                  <th className="px-5 py-2.5 text-left font-medium">Kembali</th>
                  <th className="px-5 py-2.5 text-left font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sand/50">
                {periodBookings.map((booking) => (
                  <tr key={booking.id}>
                    <td className="px-5 py-2.5 text-cocoa/70">{booking.code}</td>
                    <td className="px-5 py-2.5 text-cocoa/70">{booking.customerName}</td>
                    <td className="px-5 py-2.5 text-cocoa/60">
                      {booking.productName} · {booking.qty} unit
                    </td>
                    <td className="px-5 py-2.5 text-cocoa/60">{formatDate(booking.startDate)}</td>
                    <td className="px-5 py-2.5 text-cocoa/60">{formatDate(booking.endDate)}</td>
                    <td className="px-5 py-2.5">
                      <BookingStatusBadge status={booking.status} />
                    </td>
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
