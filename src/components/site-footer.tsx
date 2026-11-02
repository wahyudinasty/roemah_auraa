import Link from "next/link";
import { NAV_LINKS } from "@/lib/constants";
import { instagramUrl, whatsappLink } from "@/lib/format";

type FooterProps = {
  whatsapp: string;
  instagram: string;
  address: string;
  hours: string;
  categories: { slug: string; name: string }[];
};

export default function SiteFooter({ whatsapp, instagram, address, hours, categories }: FooterProps) {
  return (
    <footer className="bg-cocoa text-cream/80">
      <div className="container-x grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
        <div>
          <div className="flex items-center gap-3">
            <span className="grid h-12 w-12 place-items-center rounded-full border border-gold/70 font-serif text-base text-gold">
              RA
            </span>
            <div>
              <p className="font-serif text-xl tracking-[0.22em] text-cream">ROEMAH AURA</p>
              <p className="mt-1 text-[9px] uppercase tracking-[0.3em] text-gold">
                Elegance in Every Occasion
              </p>
            </div>
          </div>
          <p className="mt-6 max-w-sm text-sm leading-relaxed text-cream/65">
            Etalase busana untuk setiap momen istimewa — dari pakaian adat dan kebaya hingga kostum
            sekolah dan pentas. Disewa dengan mudah, dikelola dengan rapi.
          </p>
          <div className="mt-6 flex gap-3">
            <a
              href={whatsappLink(whatsapp, "Halo Roemah Aura, saya ingin bertanya.")}
              target="_blank"
              rel="noreferrer"
              className="btn btn-gold !px-4 !py-2.5 !text-[10px]"
            >
              WhatsApp
            </a>
            <a
              href={instagramUrl(instagram)}
              target="_blank"
              rel="noreferrer"
              className="btn !border-cream/30 !px-4 !py-2.5 !text-[10px] !text-cream/85 hover:!border-gold hover:!text-gold"
            >
              Instagram
            </a>
          </div>
        </div>

        <div>
          <h3 className="text-[11px] uppercase tracking-[0.28em] text-gold">Halaman</h3>
          <ul className="mt-5 space-y-3 text-sm">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="text-cream/65 transition-colors hover:text-gold">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-[11px] uppercase tracking-[0.28em] text-gold">Koleksi</h3>
          <ul className="mt-5 space-y-3 text-sm">
            {categories.map((category) => (
              <li key={category.slug}>
                <Link
                  href={`/katalog?kategori=${category.slug}`}
                  className="text-cream/65 transition-colors hover:text-gold"
                >
                  {category.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-[11px] uppercase tracking-[0.28em] text-gold">Kunjungi Kami</h3>
          <ul className="mt-5 space-y-4 text-sm text-cream/65">
            <li>
              <span className="block text-[10px] uppercase tracking-[0.2em] text-cream/40">WhatsApp</span>
              <a
                href={whatsappLink(whatsapp, "Halo Roemah Aura, saya ingin bertanya.")}
                target="_blank"
                rel="noreferrer"
                className="hover:text-gold"
              >
                {whatsapp}
              </a>
            </li>
            <li>
              <span className="block text-[10px] uppercase tracking-[0.2em] text-cream/40">Instagram</span>
              <a href={instagramUrl(instagram)} target="_blank" rel="noreferrer" className="hover:text-gold">
                {instagram}
              </a>
            </li>
            <li>
              <span className="block text-[10px] uppercase tracking-[0.2em] text-cream/40">Alamat</span>
              {address}
            </li>
            <li>
              <span className="block text-[10px] uppercase tracking-[0.2em] text-cream/40">Jam Operasional</span>
              {hours}
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-cream/10">
        <div className="container-x flex flex-col gap-3 py-5 text-[11px] tracking-wide text-cream/45 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Roemah Aura. Seluruh hak cipta dilindungi.</p>
          <div className="flex items-center gap-4">
            <Link href="/cara-penyewaan" className="hover:text-gold">
              Ketentuan Sewa
            </Link>
            <span className="text-cream/20">•</span>
            <Link href="/login" className="hover:text-gold">
              Login Admin
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
