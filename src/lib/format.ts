export const rupiah = (value: number | null | undefined) =>
  `Rp${new Intl.NumberFormat("id-ID").format(value ?? 0)}`;

export const rupiahRange = (min: number, max?: number | null) =>
  max && max > min ? `${rupiah(min)} – ${rupiah(max)}` : rupiah(min);

export const toISODate = (date: Date) => date.toISOString().slice(0, 10);

export const todayISO = () => toISODate(new Date());

export const addDaysISO = (iso: string, days: number) => {
  const date = new Date(`${iso}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return toISODate(date);
};

export const formatDate = (value: string | Date | null | undefined) => {
  if (!value) return "—";
  const date = typeof value === "string" ? new Date(`${value.slice(0, 10)}T00:00:00Z`) : value;
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
};

export const formatDateLong = (value: string | Date | null | undefined) => {
  if (!value) return "—";
  const date = typeof value === "string" ? new Date(`${value.slice(0, 10)}T00:00:00Z`) : value;
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
};

export const formatDateTime = (value: Date | string | null | undefined) => {
  if (!value) return "—";
  const date = typeof value === "string" ? new Date(value) : value;
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

export const rentalDaysBetween = (start: string, end: string) => {
  const a = new Date(`${start}T00:00:00Z`).getTime();
  const b = new Date(`${end}T00:00:00Z`).getTime();
  if (Number.isNaN(a) || Number.isNaN(b)) return 0;
  return Math.max(1, Math.round((b - a) / 86_400_000) + 1);
};

export const normalizePhone = (phone: string) => {
  const digits = phone.replace(/\D/g, "");
  if (digits.startsWith("62")) return digits;
  if (digits.startsWith("0")) return `62${digits.slice(1)}`;
  if (digits.startsWith("8")) return `62${digits}`;
  return digits;
};

export const whatsappLink = (phone: string, message: string) =>
  `https://wa.me/${normalizePhone(phone)}?text=${encodeURIComponent(message)}`;

export const instagramUrl = (handle: string) => {
  const clean = (handle ?? "").replace(/^@/, "").trim();
  return clean ? `https://instagram.com/${clean}` : "https://instagram.com";
};

export const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 70);

export const bookingStatusMeta: Record<
  string,
  { label: string; className: string; dot: string }
> = {
  menunggu: {
    label: "Menunggu Konfirmasi",
    className: "bg-amber-50 text-amber-800 border-amber-200",
    dot: "bg-amber-500",
  },
  dikonfirmasi: {
    label: "Dikonfirmasi",
    className: "bg-emerald-50 text-emerald-800 border-emerald-200",
    dot: "bg-emerald-500",
  },
  diambil: {
    label: "Sedang Disewa",
    className: "bg-sky-50 text-sky-800 border-sky-200",
    dot: "bg-sky-500",
  },
  dikembalikan: {
    label: "Dikembalikan",
    className: "bg-indigo-50 text-indigo-800 border-indigo-200",
    dot: "bg-indigo-500",
  },
  selesai: {
    label: "Selesai",
    className: "bg-stone-100 text-stone-700 border-stone-300",
    dot: "bg-stone-500",
  },
  dibatalkan: {
    label: "Dibatalkan",
    className: "bg-rose-50 text-rose-800 border-rose-200",
    dot: "bg-rose-500",
  },
};

export const productStatusMeta: Record<string, { label: string; className: string }> = {
  tersedia: {
    label: "Tersedia",
    className: "bg-emerald-50 text-emerald-800 border-emerald-200",
  },
  perawatan: {
    label: "Perawatan",
    className: "bg-amber-50 text-amber-800 border-amber-200",
  },
  arsip: {
    label: "Arsip",
    className: "bg-stone-100 text-stone-600 border-stone-300",
  },
};
