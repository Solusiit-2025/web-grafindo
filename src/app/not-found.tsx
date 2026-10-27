import Link from "next/link";
import { ArrowRight, Compass } from "lucide-react";
import { Logo } from "@/components/common/Logo";
import { ButtonLink } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col bg-grad-hero text-white">
      <div className="container-site flex h-20 items-center">
        <Logo variant="light" />
      </div>
      <div className="container-site flex flex-1 flex-col items-center justify-center py-16 text-center">
        <span className="flex h-16 w-16 items-center justify-center rounded-full border border-white/10 bg-white/5 text-accent">
          <Compass className="h-7 w-7" aria-hidden />
        </span>
        <p className="mt-6 font-mono text-xs uppercase tracking-[0.24em] text-accent">Error 404</p>
        <h1 className="mt-3 font-display text-display-lg text-white">Halaman tidak ditemukan</h1>
        <p className="mt-4 max-w-md text-sm leading-relaxed text-white/50">
          Tautan mungkin sudah berubah atau halaman dipindahkan. Anda bisa kembali ke beranda atau menelusuri katalog.
        </p>
        <div className="mt-8 flex flex-col gap-2.5 sm:flex-row">
          <ButtonLink href="/" iconRight={<ArrowRight className="h-4 w-4" aria-hidden />}>
            Kembali ke beranda
          </ButtonLink>
          <ButtonLink href="/products" variant="outlineLight">
            Lihat katalog
          </ButtonLink>
        </div>

        <div className="mt-12 flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs text-white/40">
          {[
            { href: "/products", label: "Produk" },
            { href: "/e-catalog", label: "E-Catalog" },
            { href: "/portfolio", label: "Portofolio" },
            { href: "/quote", label: "Minta Penawaran" },
            { href: "/contact", label: "Kontak" },
          ].map((link) => (
            <Link key={link.href} href={link.href} className="transition hover:text-accent">
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
