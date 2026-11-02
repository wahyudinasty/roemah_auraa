import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Roemah Aura — Sewa Kebaya, Pakaian Adat & Kostum",
    template: "%s | Roemah Aura",
  },
  description:
    "Roemah Aura menyewakan pakaian adat, kebaya, jas pria, pakaian anak, serta kostum sekolah dan pentas. Elegance in every occasion.",
  keywords: [
    "sewa kebaya",
    "sewa pakaian adat",
    "sewa jas",
    "kostum pentas",
    "roemah aura",
  ],
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="id">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;1,400&family=Poppins:wght@300;400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
