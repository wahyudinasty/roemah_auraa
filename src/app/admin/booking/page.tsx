import Link from "next/link";
import { updateBookingAction } from "@/app/admin/actions";
import {
  AdminEmpty,
  AdminPageHeader,
  BookingStatusBadge,
  Notice,
} from "@/components/admin/ui";
import { getBookings, getStatusBreakdown, getSettings } from "@/lib/data";
import {
  bookingStatusMeta,
  formatDate,
  formatDateTime,
  rentalDaysBetween,
  rupiah,
  todayISO,
  whatsappLink,
} from "@/lib/format";

type SearchParams = Promise<{ status?: string; q?: string; updated?: string }>;

const statusOrder = [
  "menunggu",
  "dikonfirmasi",
  "diambil",
  "dikembalikan",
  "selesai",
  "dibatalkan",
];

export default async function AdminBookingsPage({ searchParams }: { searchParams: SearchParams }) {
  const { status, q, updated } = await searchParams;
  const [bookings, statuses, settings] = await Promise.all([
    getBookings({ status, search: q?.trim() || undefined, limit: 200 }),
    getStatusBreakdown(),
    getSettings(),
  ]);

  const counts = new Map(statuses.map((item) => [item.status, item.total]));
  const totalAll = statuses.reduce((sum, item) => sum + item.total, 0);
  const today = todayISO();

  return (
    <>
      <AdminPageHeader
        eyebrow="Data Booking"
        title="Booking & Jadwal"
        description="Periksa permintaan dari website, konfirmasi jadwal, dan perbarui status sewa. Catatan ini menjadi acuan operasional."
      />

      {updated && <Notice>Status booking berhasil diperbarui.</Notice>}

      <div className="mb-4 flex flex-wrap gap-2">
        <Link
          href="/admin/booking"
          className={`border px-3 py-2 text-[10px] uppercase tracking-[0.12em] ${
            !status ? "border-cocoa bg-cocoa text-cream" : "border-sand bg-white text-cocoa/60"
          }`}
        >
          Semua ({totalAll})
        </Link>
        {statusOrder.map((item) => (
          <Link
            key={item}
            href={`/admin/booking?status=${item}`}
            className={`border px-3 py-2 text-[10px] uppercase tracking-[0.12em] ${
              status === item ? "border-cocoa bg-cocoa text-cream" : "border-sand bg-white text-cocoa/60"
            }`}
          >
            {bookingStatusMeta[item]?.label ?? item} ({counts.get(item) ?? 0})
          </Link>
        ))}
      </div>

      <div className="mb-4 border border-sand/70 bg-white px-5 py-4">
        <form action="/admin/booking" method="get" className="flex flex-wrap items-end gap-3">
          {status && <input type="hidden" name="status" value={status} />}
          <div className="flex-1">
            <label htmlFor="q" className="field-label">
              Cari booking
            </label>
            <input
              id="q"
              name="q"
              defaultValue={q ?? ""}
              placeholder="Kode booking, nama pelanggan, produk, atau nomor WA…"
              className="field !py-2 !text-[12px]"
            />
          </div>
          <button type="submit" className="btn btn-dark !py-2.5 !text-[10px]">
            Cari
          </button>
          {(q || status) && (
            <Link
              href="/admin/booking"
              className="text-[10px] uppercase tracking-[0.12em] text-cocoa/45 hover:text-gold-dark"
            >
              Reset filter
            </Link>
          )}
        </form>
      </div>

      {bookings.length === 0 ? (
        <AdminEmpty
          title="Tidak ada booking pada filter ini"
          description="Permintaan booking baru dari website akan otomatis muncul di sini. Coba ubah filter status atau kata kunci."
        />
      ) : (
        <div className="space-y-3">
          {bookings.map((booking) => {
            const days = rentalDaysBetween(booking.startDate, booking.endDate);
            const late = booking.status === "diambil" && booking.endDate < today;
            return (
              <article key={booking.id} className="border border-sand/70 bg-white p-4 sm:p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-serif text-base text-cocoa">{booking.code}</p>
                      <BookingStatusBadge status={booking.status} />
                      {late && (
                        <span className="border border-rose-200 bg-rose-50 px-2 py-1 text-[9px] uppercase tracking-[0.1em] text-rose-700">
                          Terlambat kembali
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-[10px] uppercase tracking-[0.12em] text-cocoa/40">
                      Dibuat {formatDateTime(booking.createdAt)}
                    </p>
                  </div>
                  <p className="font-serif text-xl text-gold-dark">{rupiah(booking.totalPrice)}</p>
                </div>

                <div className="mt-4 grid gap-3 border-t border-sand/60 pt-3 text-[12px] sm:grid-cols-3">
                  <div>
                    <p className="text-[9px] uppercase tracking-[0.14em] text-cocoa/40">Pelanggan</p>
                    <p className="mt-1 font-medium text-cocoa">{booking.customerName}</p>
                    <a
                      href={whatsappLink(
                        booking.phone,
                        `Halo ${booking.customerName}, ini admin Roemah Aura mengenai booking ${booking.code} (${booking.productName}).`,
                      )}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[11px] text-gold-dark hover:underline"
                    >
                      {booking.phone} · WhatsApp
                    </a>
                  </div>
                  <div>
                    <p className="text-[9px] uppercase tracking-[0.14em] text-cocoa/40">Koleksi</p>
                    <p className="mt-1 text-cocoa/75">
                      {booking.productName}{" "}
                      <span className="text-cocoa/40">({booking.productCode})</span>
                    </p>
                    <p className="text-[11px] text-cocoa/45">
                      Ukuran {booking.size || "—"}
                      {booking.color ? ` · ${booking.color}` : ""} · {booking.qty} unit
                    </p>
                  </div>
                  <div>
                    <p className="text-[9px] uppercase tracking-[0.14em] text-cocoa/40">Jadwal</p>
                    <p className="mt-1 text-cocoa/75">
                      {formatDate(booking.startDate)} – {formatDate(booking.endDate)}
                    </p>
                    <p className="text-[11px] text-cocoa/45">{days} hari sewa</p>
                  </div>
                </div>

                {booking.notes && (
                  <p className="mt-3 border-l-2 border-gold/50 bg-cream/50 px-3 py-2 text-[11px] leading-relaxed text-cocoa/65">
                    Catatan pelanggan: {booking.notes}
                  </p>
                )}

                <form
                  action={updateBookingAction}
                  className="mt-4 flex flex-wrap items-end gap-2 border-t border-sand/60 pt-3"
                >
                  <input type="hidden" name="id" value={booking.id} />
                  <div>
                    <label htmlFor={`status-${booking.id}`} className="field-label">
                      Ubah status
                    </label>
                    <select
                      id={`status-${booking.id}`}
                      name="status"
                      defaultValue={booking.status}
                      className="field !w-48 !py-2 !text-[12px]"
                    >
                      {statusOrder.map((item) => (
                        <option key={item} value={item}>
                          {bookingStatusMeta[item]?.label ?? item}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="min-w-[12rem] flex-1">
                    <label htmlFor={`note-${booking.id}`} className="field-label">
                      Catatan admin
                    </label>
                    <input
                      id={`note-${booking.id}`}
                      name="adminNote"
                      defaultValue={booking.adminNote}
                      placeholder="Deposit diterima, ukuran disesuaikan, dll."
                      className="field !py-2 !text-[12px]"
                    />
                  </div>
                  <button type="submit" className="btn btn-gold !py-2.5 !text-[10px]">
                    Simpan
                  </button>
                </form>
              </article>
            );
          })}
        </div>
      )}

      <p className="mt-6 text-[11px] leading-relaxed text-cocoa/40">
        Konfirmasi kepada pelanggan tetap dilakukan melalui WhatsApp {settings.whatsapp}. Setelah
        pelanggan mengambil pakaian, ubah status menjadi “Sedang Disewa”; setelah kembali dan diperiksa,
        ubah menjadi “Dikembalikan”.
      </p>
    </>
  );
}
