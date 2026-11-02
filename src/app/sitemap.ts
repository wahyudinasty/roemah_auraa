import type { MetadataRoute } from "next";

const baseUrl = "https://roemahaura.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    "",
    "/tentang",
    "/katalog",
    "/harga",
    "/galeri",
    "/cara-penyewaan",
    "/kontak",
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : 0.7,
  }));
}
