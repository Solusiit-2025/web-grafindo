"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  ChevronDown,
  Clock,
  FileText,
  Mail,
  Menu,
  Phone,
  X,
} from "lucide-react";
import { LocaleSwitcher } from "./LocaleSwitcher";
import { ThemeSwitcher } from "./ThemeSwitcher";
import { Logo } from "./Logo";
import { cn } from "@/lib/utils/cn";
import type { Messages } from "@/i18n";
import type { ThemeId } from "@/config/themes";
import { Visual } from "@/components/public/Visual";

export type HeaderCategory = {
  slug: string;
  name: string;
  description: string;
  count: number;
};

type Props = {
  locale: "id" | "en";
  theme: ThemeId;
  t: Messages;
  categories: HeaderCategory[];
  contact: { phone: string; email: string; hours: string };
  quoteHref?: string;
};

export function HeaderShell({ locale, theme, t, categories, contact, quoteHref = "/quote" }: Props) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const isHome = pathname === "/";
  const dark = isHome && !scrolled;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const nav = [
    { key: "home", href: "/" },
    { key: "products", href: "/products" },
    { key: "catalog", href: "/e-catalog" },
    { key: "portfolio", href: "/portfolio" },
    { key: "services", href: "/services" },
    { key: "about", href: "/about" },
    { key: "blog", href: "/blog" },
    { key: "contact", href: "/contact" },
  ] as const;

  return (
    <header className={cn("sticky top-0 w-full", open ? "z-[75]" : "z-40")}>
      {/* Utility top bar */}
      <div className="hidden bg-primary text-white/70 lg:block">
        <div className="container-site flex h-9 items-center justify-between text-[0.7rem] font-medium">
          <p className="hidden items-center gap-2 xl:flex">
            <span className="h-1 w-1 rounded-full bg-accent" aria-hidden />
            {t.header.topbarNote}
          </p>
          <div className="flex items-center gap-5">
            <a href={`tel:${contact.phone.replace(/[^\d+]/g, "")}`} className="inline-flex items-center gap-1.5 transition hover:text-accent">
              <Phone className="h-3 w-3" aria-hidden /> {contact.phone}
            </a>
            <a href={`mailto:${contact.email}`} className="hidden items-center gap-1.5 transition hover:text-accent xl:inline-flex">
              <Mail className="h-3 w-3" aria-hidden /> {contact.email}
            </a>
            <span className="hidden items-center gap-1.5 2xl:inline-flex">
              <Clock className="h-3 w-3" aria-hidden /> {contact.hours}
            </span>
            <span className="h-4 w-px bg-white/15" aria-hidden />
            <ThemeSwitcher current={theme} locale={locale} variant="dark" />
            <LocaleSwitcher locale={locale} compact />
          </div>
        </div>
      </div>

      {/* Main bar */}
      <div
        className={cn(
          "border-b transition-all duration-300",
          dark
            ? "border-white/10 bg-primary/95 text-white backdrop-blur-md"
            : "border-surface-200/80 bg-white/[0.97] text-primary shadow-e1 backdrop-blur-xl",
        )}
      >
        <div className="container-site flex h-[68px] items-center justify-between gap-4">
          <Logo variant={dark ? "light" : "dark"} />

          <nav className="hidden items-center gap-0.5 xl:flex" aria-label="Navigasi utama">
            <div className="group relative">
              <Link
                href="/products"
                className={cn(
                  "inline-flex items-center gap-1 rounded-md px-3 py-2 text-[0.82rem] font-semibold transition",
                  dark ? "text-white/80 hover:text-white" : "text-primary/75 hover:text-primary",
                )}
              >
                {t.nav.products}
                <ChevronDown className="h-3.5 w-3.5 transition-transform duration-300 group-hover:rotate-180" aria-hidden />
              </Link>

              <div className="invisible absolute left-1/2 top-full z-50 w-[640px] -translate-x-1/2 translate-y-2 pt-3 opacity-0 transition-all duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100">
                <div className="overflow-hidden rounded-lg border border-surface-200 bg-white p-2 shadow-e3">
                  <div className="grid grid-cols-2 gap-1">
                    {categories.map((category) => (
                      <Link
                        key={category.slug}
                        href={`/products?cat=${category.slug}`}
                        className="group/card flex items-center gap-3 rounded-md p-2 transition hover:bg-surface"
                      >
                        <Visual
                          category={category.slug}
                          alt={category.name}
                          label={category.name}
                          className="h-16 w-16 shrink-0 rounded-md"
                        />
                        <span className="min-w-0 flex-1">
                          <span className="flex items-center justify-between gap-2">
                            <span className="font-display text-sm font-bold text-primary">{category.name}</span>
                            <span className="font-mono text-[0.6rem] text-neutral-400">{category.count}</span>
                          </span>
                          <span className="mt-0.5 line-clamp-2 block text-[0.72rem] leading-snug text-neutral-500">
                            {category.description}
                          </span>
                        </span>
                      </Link>
                    ))}
                  </div>
                  <Link
                    href="/products"
                    className="mt-1 flex items-center justify-between rounded-md bg-primary px-4 py-3 text-sm font-semibold text-white transition hover:bg-primary-700"
                  >
                    {t.header.seeAllProducts}
                    <ArrowRight className="h-4 w-4 text-accent" aria-hidden />
                  </Link>
                </div>
              </div>
            </div>

            {nav.slice(2).map((item) => {
              const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "rounded-md px-3 py-2 text-[0.82rem] font-semibold transition",
                    dark
                      ? active
                        ? "text-accent"
                        : "text-white/80 hover:text-white"
                      : active
                        ? "text-accent-700"
                        : "text-primary/75 hover:text-primary",
                  )}
                >
                  {t.nav[item.key]}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2.5">
            <Link
              href={quoteHref}
              className="btn-accent btn-sm hidden md:inline-flex"
            >
              {t.header.quoteCta}
              <ArrowRight className="h-3.5 w-3.5" aria-hidden />
            </Link>
            <ThemeSwitcher
              current={theme}
              locale={locale}
              variant={dark ? "dark" : "light"}
              showLabel={false}
              className="lg:hidden"
            />
            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-label={t.header.menu}
              aria-expanded={open}
              className={cn(
                "inline-flex h-10 w-10 items-center justify-center rounded-md border transition xl:hidden",
                dark
                  ? "border-white/20 text-white hover:bg-white/10"
                  : "border-surface-300 text-primary hover:border-primary/40",
              )}
            >
              <Menu className="h-5 w-5" aria-hidden />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-[70] xl:hidden" role="dialog" aria-modal="true" aria-label={t.header.menu}>
          <button
            type="button"
            aria-label={t.common.close}
            className="absolute inset-0 bg-primary/60 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <div className="absolute inset-y-0 right-0 flex w-full max-w-sm flex-col overflow-y-auto bg-white shadow-e3 animate-fade-up">
            <div className="flex items-center justify-between border-b border-surface-200 px-5 py-4">
              <Logo />
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="flex h-9 w-9 items-center justify-center rounded-md border border-surface-300 text-primary"
                aria-label={t.common.close}
              >
                <X className="h-5 w-5" aria-hidden />
              </button>
            </div>

            <nav className="flex-1 px-3 py-4" aria-label="Navigasi mobile">
              {nav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center justify-between rounded-md px-3 py-3 text-[0.95rem] font-semibold text-primary transition hover:bg-surface"
                >
                  {t.nav[item.key]}
                  <ArrowRight className="h-4 w-4 text-surface-400" aria-hidden />
                </Link>
              ))}
            </nav>

            <div className="border-t border-surface-200 px-4 py-4">
              <p className="px-1 text-[0.65rem] font-bold uppercase tracking-[0.18em] text-neutral-400">
                {t.header.productsMega}
              </p>
              <div className="mt-2 grid grid-cols-2 gap-2">
                {categories.map((category) => (
                  <Link
                    key={category.slug}
                    href={`/products?cat=${category.slug}`}
                    className="rounded-md border border-surface-200 p-3 text-xs font-semibold text-primary transition hover:border-accent/50"
                  >
                    {category.name}
                    <span className="mt-1 block font-mono text-[0.6rem] font-normal text-neutral-400">
                      {category.count} item
                    </span>
                  </Link>
                ))}
              </div>
            </div>

            <div className="space-y-3 border-t border-surface-200 px-5 py-5">
              <Link href={quoteHref} className="btn-accent w-full">
                <FileText className="h-4 w-4" aria-hidden />
                {t.header.quoteCta}
              </Link>
              <a href={`tel:${contact.phone.replace(/[^\d+]/g, "")}`} className="flex items-center gap-2 text-sm text-neutral-600">
                <Phone className="h-4 w-4 text-accent-700" aria-hidden /> {contact.phone}
              </a>
              <a href={`mailto:${contact.email}`} className="flex items-center gap-2 text-sm text-neutral-600">
                <Mail className="h-4 w-4 text-accent-700" aria-hidden /> {contact.email}
              </a>
              <div className="pt-2">
                <LocaleSwitcher locale={locale} />
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
