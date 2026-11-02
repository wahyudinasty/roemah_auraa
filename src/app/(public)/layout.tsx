import type { ReactNode } from "react";
import SiteFooter from "@/components/site-footer";
import SiteHeader from "@/components/site-header";
import { getCategories, getSettings } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function PublicLayout({ children }: { children: ReactNode }) {
  const [settings, categories] = await Promise.all([getSettings(), getCategories()]);
  const navCategories = categories.map((category) => ({
    slug: category.slug,
    name: category.name,
  }));

  return (
    <div className="flex min-h-screen flex-col bg-cream">
      <SiteHeader
        whatsapp={settings.whatsapp}
        instagram={settings.instagram}
        hours={settings.hours}
        categories={navCategories}
      />
      <main className="flex-1">{children}</main>
      <SiteFooter
        whatsapp={settings.whatsapp}
        instagram={settings.instagram}
        address={settings.address}
        hours={settings.hours}
        categories={navCategories}
      />
    </div>
  );
}
