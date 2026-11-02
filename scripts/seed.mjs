import { randomBytes, scryptSync } from "node:crypto";
import { Client } from "pg";
import "dotenv/config";

const IMG = {
  k1: "https://images.pexels.com/photos/40670299/pexels-photo-40670299.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
  k2: "https://images.pexels.com/photos/33413562/pexels-photo-33413562.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
  k3: "https://images.pexels.com/photos/40670330/pexels-photo-40670330.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
  k4: "https://images.pexels.com/photos/40670302/pexels-photo-40670302.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
  k5: "https://images.pexels.com/photos/33401792/pexels-photo-33401792.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
  k6: "https://images.pexels.com/photos/33475909/pexels-photo-33475909.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
  k7: "https://images.pexels.com/photos/40670310/pexels-photo-40670310.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
  k8: "https://images.pexels.com/photos/40670328/pexels-photo-40670328.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
  a1: "https://images.pexels.com/photos/37821002/pexels-photo-37821002.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
  a2: "https://images.pexels.com/photos/37821052/pexels-photo-37821052.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
  a3: "https://images.pexels.com/photos/34591151/pexels-photo-34591151.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
  a4: "https://images.pexels.com/photos/36489030/pexels-photo-36489030.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
  a5: "https://images.pexels.com/photos/35367079/pexels-photo-35367079.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
  a6: "https://images.pexels.com/photos/14534579/pexels-photo-14534579.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
  j1: "https://images.pexels.com/photos/29858929/pexels-photo-29858929.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
  j2: "https://images.pexels.com/photos/17542178/pexels-photo-17542178.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
  j3: "https://images.pexels.com/photos/16925520/pexels-photo-16925520.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
  j4: "https://images.pexels.com/photos/28557819/pexels-photo-28557819.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
  j5: "https://images.pexels.com/photos/19166870/pexels-photo-19166870.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
  j6: "https://images.pexels.com/photos/11981253/pexels-photo-11981253.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
  n1: "https://images.pexels.com/photos/18772861/pexels-photo-18772861.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1000&w=800",
  n2: "https://images.pexels.com/photos/13584775/pexels-photo-13584775.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
  n3: "https://images.pexels.com/photos/12719306/pexels-photo-12719306.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1000&w=800",
  n4: "https://images.pexels.com/photos/12719298/pexels-photo-12719298.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
  t1: "https://images.pexels.com/photos/38544942/pexels-photo-38544942.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
  t2: "https://images.pexels.com/photos/35365582/pexels-photo-35365582.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
  t3: "https://images.pexels.com/photos/35113938/pexels-photo-35113938.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
  t4: "https://images.pexels.com/photos/12280110/pexels-photo-12280110.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
  t5: "https://images.pexels.com/photos/6217057/pexels-photo-6217057.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
  t6: "https://images.pexels.com/photos/30880625/pexels-photo-30880625.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
  d1: "https://images.pexels.com/photos/6276053/pexels-photo-6276053.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
  d2: "https://images.pexels.com/photos/12991912/pexels-photo-12991912.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
  boutiq: "https://images.pexels.com/photos/10689371/pexels-photo-10689371.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=800&w=1200",
};

const categories = [
  {
    slug: "pakaian-adat",
    name: "Pakaian Adat",
    tagline: "Warisan budaya, dikenakan dengan bangga",
    description:
      "Busana adat Minangkabau dan daerah lain lengkap dengan aksesori utama. Cocok untuk pernikahan, acara keluarga, dan dokumentasi budaya.",
    imageUrl: IMG.a1,
    sortOrder: 1,
  },
  {
    slug: "kebaya",
    name: "Kebaya",
    tagline: "Anggun untuk acara istimewa",
    description:
      "Kebaya modern, kebaya formal, dan busana istimewa dengan detail brokat, payet, dan potongan yang nyaman dikenakan.",
    imageUrl: IMG.k5,
    sortOrder: 2,
  },
  {
    slug: "jas-pria",
    name: "Jas Pria",
    tagline: "Potongan rapi, kesan berkelas",
    description:
      "Jas formal, setelan lengkap, dan pilihan ukuran untuk pengantin, wisuda, hingga acara kantor.",
    imageUrl: IMG.j1,
    sortOrder: 3,
  },
  {
    slug: "pakaian-anak",
    name: "Pakaian Anak",
    tagline: "Siap untuk hari sekolah dan panggung",
    description:
      "Pakaian anak untuk PAUD, TK, dan SD. Tersedia dalam jumlah banyak untuk kebutuhan acara sekolah.",
    imageUrl: IMG.n1,
    sortOrder: 4,
  },
  {
    slug: "kostum-sekolah-pentas",
    name: "Kostum Sekolah & Pentas",
    tagline: "Bersinar di atas panggung",
    description:
      "Kostum tari, karnaval, pentas seni, dan kegiatan kebudayaan. Bisa dipinjam dalam jumlah besar untuk rombongan sekolah.",
    imageUrl: IMG.t1,
    sortOrder: 5,
  },
];

const products = [
  {
    code: "ADT-01",
    slug: "minang-suntiang-puti",
    name: "Minang Suntiang Puti",
    categorySlug: "pakaian-adat",
    description:
      "Busana adat Minangkabau pengantin perempuan dengan suntiang, baju kurung bordir, dan selendang. Termasuk aksesori kepala utama serta perhiasan dasar.",
    price: 350000,
    priceMax: null,
    deposit: 250000,
    sizes: ["S", "M", "L"],
    colors: "Putih gading, gold",
    includes: "Baju kurung, sunting, selendang, perhiasan dasar, aksesori kepala",
    rentalDays: 3,
    stockTotal: 2,
    status: "tersedia",
    featured: true,
    images: [IMG.a1, IMG.a2, IMG.d1],
  },
  {
    code: "ADT-02",
    slug: "minang-marapulai",
    name: "Minang Marapulai",
    categorySlug: "pakaian-adat",
    description:
      "Setelan pengantin pria Minangkabau: baju hitam bersulam, songket, dan destar. Lengkap untuk upacara akad maupun resepsi.",
    price: 300000,
    deposit: 200000,
    sizes: ["M", "L", "XL"],
    colors: "Hitam, gold",
    includes: "Baju sulam, kain songket, destar, aksesori dada",
    stockTotal: 2,
    status: "tersedia",
    featured: false,
    images: [IMG.a6, IMG.a3, IMG.d2],
  },
  {
    code: "ADT-03",
    slug: "bugis-makassar-baju-bodo",
    name: "Bugis Makassar Baju Bodo",
    categorySlug: "pakaian-adat",
    description:
      "Baju bodo dengan detail payet dan sarung sutra, dilengkapi hiasan kepala khas Bugis Makassar.",
    price: 275000,
    deposit: 200000,
    sizes: ["S", "M", "L"],
    colors: "Maroon, gold",
    includes: "Baju bodo, sarung, hiasan kepala, aksesori",
    stockTotal: 1,
    status: "tersedia",
    featured: true,
    images: [IMG.a4, IMG.a5, IMG.d1],
  },
  {
    code: "ADT-04",
    slug: "jawa-paes-ageng",
    name: "Jawa Paes Ageng",
    categorySlug: "pakaian-adat",
    description:
      "Busana adat Jawa dengan paes, kebaya beludru, dan kain batik sogan. Riasan paes dapat dikonsultasikan dengan admin.",
    price: 325000,
    deposit: 250000,
    sizes: ["S", "M", "L"],
    colors: "Hitam, sogan, gold",
    includes: "Kebaya beludru, kain batik, paes, aksesori",
    stockTotal: 1,
    status: "tersedia",
    featured: false,
    images: [IMG.a5, IMG.a1, IMG.d2],
  },
  {
    code: "KBY-01",
    slug: "kebaya-modern-aurora",
    name: "Kebaya Modern Aurora",
    categorySlug: "kebaya",
    description:
      "Kebaya modern putih dengan bordir bunga halus dan potongan peplum. Nyaman dipakai sepanjang acara resmi maupun foto studio.",
    price: 100000,
    deposit: 100000,
    sizes: ["S", "M", "L", "XL"],
    colors: "Ivory",
    includes: "Kebaya, kain lilit, bros",
    stockTotal: 3,
    status: "tersedia",
    featured: true,
    images: [IMG.k2, IMG.k5, IMG.d1],
  },
  {
    code: "KBY-02",
    slug: "kebaya-hitam-gold-series",
    name: "Kebaya Hitam Gold Series",
    categorySlug: "kebaya",
    description:
      "Kebaya hitam dengan payet gold, cocok untuk acara malam dan wisuda. Termasuk kain lilit senada dan bros.",
    price: 100000,
    deposit: 100000,
    sizes: ["S", "M", "L"],
    colors: "Hitam, gold",
    includes: "Kebaya, kain lilit, bros, aksesori pinggang",
    stockTotal: 2,
    status: "tersedia",
    featured: true,
    images: [IMG.k1, IMG.k3, IMG.d2],
  },
  {
    code: "KBY-03",
    slug: "kebaya-brokat-sage",
    name: "Kebaya Brokat Sage",
    categorySlug: "kebaya",
    description:
      "Kebaya brokat warna sage dengan potongan lengan panjang, favorit untuk acara keluarga dan lamaran.",
    price: 85000,
    deposit: 75000,
    sizes: ["S", "M", "L"],
    colors: "Sage green",
    includes: "Kebaya, kain, bros",
    stockTotal: 2,
    status: "tersedia",
    featured: false,
    images: [IMG.k4, IMG.k7],
  },
  {
    code: "KBY-04",
    slug: "kebaya-kutubaru-klasik",
    name: "Kebaya Kutubaru Klasik",
    categorySlug: "kebaya",
    description:
      "Kebaya kutubaru dengan detail renda klasik, pilihan aman untuk acara adat maupun pernikahan.",
    price: 75000,
    deposit: 75000,
    sizes: ["M", "L", "XL"],
    colors: "Cream, cokelat muda",
    includes: "Kebaya, kain, bros",
    stockTotal: 2,
    status: "tersedia",
    featured: false,
    images: [IMG.k6, IMG.k8],
  },
  {
    code: "KBY-05",
    slug: "kebaya-wisuda-ivory",
    name: "Kebaya Wisuda Ivory",
    categorySlug: "kebaya",
    description:
      "Kebaya ivory dengan detail mutiara, favorit untuk wisuda dan foto kelulusan. Ringan dan tidak transparan.",
    price: 90000,
    deposit: 75000,
    sizes: ["S", "M", "L"],
    colors: "Ivory",
    includes: "Kebaya, kain, bros",
    stockTotal: 2,
    status: "tersedia",
    featured: false,
    images: [IMG.k5, IMG.k2],
  },
  {
    code: "JAS-01",
    slug: "jas-pengantin-hitam",
    name: "Jas Pengantin Hitam",
    categorySlug: "jas-pria",
    description:
      "Jas pengantin hitam satu set dengan kemeja putih, rompi, dasi kupu-kupu, dan kancing emas. Termasuk peniti dan sapu tangan.",
    price: 75000,
    deposit: 75000,
    sizes: ["M", "L", "XL", "XXL"],
    colors: "Hitam",
    includes: "Jas, kemeja, rompi, dasi, sapu tangan",
    stockTotal: 4,
    status: "tersedia",
    featured: true,
    images: [IMG.j1, IMG.j3, IMG.d1],
  },
  {
    code: "JAS-02",
    slug: "setelan-jas-navy",
    name: "Setelan Jas Navy",
    categorySlug: "jas-pria",
    description:
      "Setelan jas navy untuk wisuda dan acara formal. Tersedia ukuran besar, dapat disesuaikan dengan tinggi pemakai.",
    price: 75000,
    deposit: 75000,
    sizes: ["M", "L", "XL", "XXL"],
    colors: "Navy",
    includes: "Jas, kemeja, celana, dasi",
    stockTotal: 3,
    status: "tersedia",
    featured: false,
    images: [IMG.j5, IMG.j6],
  },
  {
    code: "JAS-03",
    slug: "tuxedo-hitam-rompi",
    name: "Tuxedo Hitam + Rompi",
    categorySlug: "jas-pria",
    description:
      "Tuxedo hitam dengan rompi dan dasi kupu-kupu. Pilihan favorit untuk resepsi malam dan foto pengantin.",
    price: 95000,
    deposit: 100000,
    sizes: ["M", "L", "XL"],
    colors: "Hitam",
    includes: "Tuxedo, rompi, kemeja, kupu-kupu, sapu tangan",
    stockTotal: 2,
    status: "tersedia",
    featured: false,
    images: [IMG.j2, IMG.j4],
  },
  {
    code: "ANK-01",
    slug: "seragam-paud-lengkap",
    name: "Seragam PAUD Lengkap",
    categorySlug: "pakaian-anak",
    description:
      "Setelan seragam PAUD lengkap dengan topi dan dasi. Tersedia stok banyak untuk kebutuhan pentas atau wisuda sekolah.",
    price: 30000,
    deposit: 30000,
    sizes: ["2-3 th", "4-5 th", "6 th"],
    colors: "Putih, merah",
    includes: "Atasan, bawahan, topi, dasi",
    stockTotal: 12,
    status: "tersedia",
    featured: false,
    images: [IMG.n2, IMG.n3],
  },
  {
    code: "ANK-02",
    slug: "seragam-tk-ceria",
    name: "Seragam TK Ceria",
    categorySlug: "pakaian-anak",
    description:
      "Seragam TK dengan bahan adem dan potongan longgar, nyaman untuk anak-anak selama acara.",
    price: 30000,
    deposit: 30000,
    sizes: ["4-5 th", "6 th"],
    colors: "Putih, biru",
    includes: "Atasan, bawahan, topi",
    stockTotal: 10,
    status: "tersedia",
    featured: false,
    images: [IMG.n3, IMG.n1],
  },
  {
    code: "ANK-03",
    slug: "baju-sd-kelas-1-3",
    name: "Baju SD Kelas 1–3",
    categorySlug: "pakaian-anak",
    description:
      "Baju seragam SD kelas 1 sampai 3, tersedia untuk sewa rombongan dengan pengaturan jadwal khusus.",
    price: 35000,
    deposit: 30000,
    sizes: ["7-8 th", "9 th"],
    colors: "Putih, merah",
    includes: "Atasan, bawahan, topi, dasi",
    stockTotal: 15,
    status: "tersedia",
    featured: false,
    images: [IMG.n4, IMG.n1],
  },
  {
    code: "ANK-04",
    slug: "baju-sd-kelas-4-6",
    name: "Baju SD Kelas 4–6",
    categorySlug: "pakaian-anak",
    description:
      "Baju seragam SD kelas 4 sampai 6 dengan ukuran lebih besar. Bisa dipesan untuk satu kelas sekaligus.",
    price: 35000,
    deposit: 30000,
    sizes: ["10-11 th", "12 th"],
    colors: "Putih, merah",
    includes: "Atasan, bawahan, topi, dasi",
    stockTotal: 15,
    status: "tersedia",
    featured: false,
    images: [IMG.n1, IMG.n4],
  },
  {
    code: "KST-01",
    slug: "kostum-tari-bali",
    name: "Kostum Tari Bali",
    categorySlug: "kostum-sekolah-pentas",
    description:
      "Kostum tari Bali dengan hiasan kepala, kain, dan aksesori gelang. Ceria dan ringan untuk pentas anak.",
    price: 65000,
    deposit: 50000,
    sizes: ["Anak S", "Anak M", "Anak L"],
    colors: "Gold, merah, hijau",
    includes: "Set kostum, hiasan kepala, gelang, kain",
    stockTotal: 8,
    status: "tersedia",
    featured: true,
    images: [IMG.t2, IMG.t3],
  },
  {
    code: "KST-02",
    slug: "kostum-karnaval-nusantara",
    name: "Kostum Karnaval Nusantara",
    categorySlug: "kostum-sekolah-pentas",
    description:
      "Kostum karnaval bernuansa nusantara dengan aksesori warna cerah. Populer untuk pawai dan acara 17 Agustus.",
    price: 60000,
    deposit: 50000,
    sizes: ["SD 1-3", "SD 4-6"],
    colors: "Merah, putih, gold",
    includes: "Set kostum, aksesori kepala, properti",
    stockTotal: 10,
    status: "tersedia",
    featured: false,
    images: [IMG.t1, IMG.t5],
  },
  {
    code: "KST-03",
    slug: "kostum-pentas-bunga",
    name: "Kostum Pentas Bunga",
    categorySlug: "kostum-sekolah-pentas",
    description:
      "Kostum pentas bertema taman bunga dengan rok berlayer. Cocok untuk pentas seni TK dan SD.",
    price: 55000,
    deposit: 50000,
    sizes: ["Anak S", "Anak M"],
    colors: "Pink, ungu",
    includes: "Set kostum, aksesori bunga, kain",
    stockTotal: 6,
    status: "tersedia",
    featured: false,
    images: [IMG.t4, IMG.t3],
  },
  {
    code: "KST-04",
    slug: "kostum-tari-tradisional-putri",
    name: "Kostum Tari Tradisional Putri",
    categorySlug: "kostum-sekolah-pentas",
    description:
      "Kostum tari tradisional putri dengan detail payet dan kain lembut. Tersedia untuk kebutuhan sanggar.",
    price: 60000,
    deposit: 50000,
    sizes: ["Anak S", "Anak M", "Anak L"],
    colors: "Gold, maroon",
    includes: "Set kostum, hiasan kepala, selendang",
    stockTotal: 7,
    status: "perawatan",
    featured: false,
    images: [IMG.t5, IMG.t1],
  },
];

const settingsSeed = {
  brandName: "Roemah Aura",
  tagline: "Elegance in Every Occasion",
  heroTitle: "Tampil Anggun di Setiap Momen Istimewa",
  heroSubtitle:
    "Penyewaan pakaian adat, kebaya, jas pria, pakaian anak, serta kostum sekolah dan pentas. Koleksi terkurasi, ukuran yang jelas, dan pendampingan admin dari pemilihan hingga pengembalian.",
  about:
    "Roemah Aura lahir dari kecintaan pada busana yang bercerita. Kami merawat setiap helai kain, menyiapkan setiap aksesori, dan membantu Anda tampil percaya diri pada acara pernikahan, wisuda, pentas seni, karnaval, hingga hari besar sekolah.",
  whatsapp: "08161117656",
  instagram: "@Roemah_Aura",
  address: "Belum diisi — perlu dilengkapi pemilik",
  mapsUrl: "",
  hours: "Belum diisi — perlu dilengkapi pemilik",
  depositNote:
    "Uang jaminan dikembalikan penuh setelah pakaian diperiksa dan dikembalikan tepat waktu dalam kondisi baik.",
  paymentNote:
    "Pembayaran dilakukan saat pengambilan pakaian. Harga dapat menyesuaikan ukuran dan kelengkapan aksesori.",
  rentalNote:
    "Durasi sewa standar 3 hari. Perpanjangan dapat diajukan melalui admin dan dikenakan biaya tambahan sesuai ketentuan.",
};

const testimonialsSeed = [
  {
    name: "Rina Kartika",
    role: "Pengantin — Padang",
    message:
      "Kebayanya rapi banget, wangi, dan semua aksesori lengkap. Admin sabar membantu pilih ukuran lewat WhatsApp, jadi tidak perlu bolak-balik.",
    rating: 5,
  },
  {
    name: "Bu Yuni — SMPN 3",
    role: "Guru pendamping pentas",
    message:
      "Sewa 24 kostum untuk pentas sekolah, semuanya siap dan bersih. Jadwal pengambilan jelas dan pengembalian tidak ribet.",
    rating: 5,
  },
  {
    name: "Dwi Lestari",
    role: "Wisuda & acara keluarga",
    message:
      "Harga masih ramah, kualitas kain di atas ekspektasi. Suka karena tanggal kosong bisa langsung dilihat di website.",
    rating: 5,
  },
];

const customersSeed = [
  { name: "Rina Kartika", phone: "081234567801" },
  { name: "Dwi Lestari", phone: "081234567802" },
  { name: "Andi Pratama", phone: "081234567803" },
  { name: "Yuni Safitri", phone: "081234567804" },
  { name: "Sari Dewi", phone: "081234567805" },
  { name: "Fitri Handayani", phone: "081234567806" },
  { name: "Reza Maulana", phone: "081234567807" },
  { name: "Nadia Putri", phone: "081234567808" },
];

const iso = (offsetDays) => {
  const date = new Date();
  date.setUTCDate(date.getUTCDate() + offsetDays);
  return date.toISOString().slice(0, 10);
};

async function main() {
  const client = new Client({
    connectionString:
      process.env.DATABASE_URL ?? "postgresql://postgres:postgres@127.0.0.1:5432/app_db",
  });
  await client.connect();

  // Admin
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync("roemahaura123", salt, 64).toString("hex");
  await client.query(
    `insert into admins (email, name, role, password_hash)
     values ($1, $2, $3, $4)
     on conflict (email) do update set name = excluded.name`,
    ["admin@roemahaura.com", "Aura Admin", "owner", `${salt}:${hash}`],
  );

  // Settings
  for (const [key, value] of Object.entries(settingsSeed)) {
    await client.query(
      `insert into settings (key, value) values ($1, $2) on conflict (key) do nothing`,
      [key, value],
    );
  }

  // Categories
  for (const category of categories) {
    await client.query(
      `insert into categories (slug, name, tagline, description, image_url, sort_order)
       values ($1, $2, $3, $4, $5, $6)
       on conflict (slug) do update set
         name = excluded.name,
         tagline = excluded.tagline,
         description = excluded.description,
         image_url = excluded.image_url,
         sort_order = excluded.sort_order`,
      [
        category.slug,
        category.name,
        category.tagline,
        category.description,
        category.imageUrl,
        category.sortOrder,
      ],
    );
  }

  const categoryRows = await client.query(`select id, slug from categories`);
  const categoryMap = new Map(categoryRows.rows.map((row) => [row.slug, row.id]));

  // Products
  for (const product of products) {
    await client.query(
      `insert into products
        (code, slug, name, category_id, description, price, price_max, deposit, sizes, colors, includes, rental_days, stock_total, status, featured, images)
       values ($1,$2,$3,$4,$5,$6,$7,$8,$9::text[],$10,$11,$12,$13,$14,$15,$16::text[])
       on conflict (slug) do nothing`,
      [
        product.code,
        product.slug,
        product.name,
        categoryMap.get(product.categorySlug),
        product.description,
        product.price,
        product.priceMax ?? null,
        product.deposit ?? 0,
        product.sizes,
        product.colors,
        product.includes ?? "",
        product.rentalDays ?? 3,
        product.stockTotal,
        product.status,
        product.featured ?? false,
        product.images,
      ],
    );
  }

  // Testimonials
  const testimonialCount = await client.query(`select count(*)::int as total from testimonials`);
  if (testimonialCount.rows[0].total === 0) {
    for (const item of testimonialsSeed) {
      await client.query(
        `insert into testimonials (name, role, message, rating, published) values ($1,$2,$3,$4,true)`,
        [item.name, item.role, item.message, item.rating],
      );
    }
  }

  // Customers
  for (const customer of customersSeed) {
    await client.query(
      `insert into customers (name, phone) values ($1, $2) on conflict (phone) do nothing`,
      [customer.name, customer.phone],
    );
  }

  // Sample bookings
  const bookingCount = await client.query(`select count(*)::int as total from bookings`);
  if (bookingCount.rows[0].total === 0) {
    const samples = [
      { slug: "kebaya-modern-aurora", name: "Rina Kartika", phone: "081234567801", size: "M", qty: 1, start: 4, end: 6, status: "dikonfirmasi" },
      { slug: "minang-suntiang-puti", name: "Dwi Lestari", phone: "081234567802", size: "S", qty: 1, start: 11, end: 13, status: "menunggu" },
      { slug: "jas-pengantin-hitam", name: "Andi Pratama", phone: "081234567803", size: "L", qty: 1, start: -1, end: 1, status: "diambil" },
      { slug: "baju-sd-kelas-1-3", name: "Yuni Safitri", phone: "081234567804", size: "7-8 th", qty: 12, start: 7, end: 8, status: "menunggu" },
      { slug: "kostum-tari-bali", name: "Sari Dewi", phone: "081234567805", size: "Anak M", qty: 4, start: -6, end: -4, status: "dikembalikan" },
      { slug: "kebaya-brokat-sage", name: "Fitri Handayani", phone: "081234567806", size: "S", qty: 1, start: -20, end: -18, status: "selesai" },
      { slug: "setelan-jas-navy", name: "Reza Maulana", phone: "081234567807", size: "XL", qty: 1, start: 20, end: 21, status: "dibatalkan" },
      { slug: "kebaya-hitam-gold-series", name: "Nadia Putri", phone: "081234567808", size: "M", qty: 1, start: 0, end: 2, status: "dikonfirmasi" },
    ];

    let counter = 1;
    for (const sample of samples) {
      const productRow = await client.query(
        `select id, name, code, price from products where slug = $1`,
        [sample.slug],
      );
      const product = productRow.rows[0];
      if (!product) continue;
      const code = `RA-${String(counter).padStart(4, "0")}`;
      counter += 1;
      await client.query(
        `insert into bookings
          (code, product_id, product_name, product_code, customer_name, phone, size, color, qty, start_date, end_date, notes, status, total_price, admin_note)
         values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15)
         on conflict (code) do nothing`,
        [
          code,
          product.id,
          product.name,
          product.code,
          sample.name,
          sample.phone,
          sample.size,
          "",
          sample.qty,
          iso(sample.start),
          iso(sample.end),
          "",
          sample.status,
          Number(product.price) * sample.qty,
          "",
        ],
      );
    }
  }

  await client.end();
  console.log("Roemah Aura seed selesai.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
