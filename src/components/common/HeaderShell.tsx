"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
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

const categoryCovers: Record<string, string> = {
  stickers: "/images/products/cat-stickers.jpg",
  graphics: "/images/products/cat-graphics.jpg",
  emblems: "/images/products/cat-emblems.jpg",
  "soft-emblems": "/images/products/cat-soft-emblems.jpg",
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
  const [productsOpen, setProductsOpen] = useState(false);
  const [mobileProductsOpen, setMobileProductsOpen] = useState(false);
  const productsRef = useRef<HTMLDivElement>(null);
  const isHome = pathname === "/";
  const dark = true;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
    setProductsOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!productsOpen) return;
    const onPointerDown = (event: MouseEvent) => {
      if (productsRef.current && !productsRef.current.contains(event.target as Node)) {
        setProductsOpen(false);
      }
    };
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [productsOpen]);

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
    <header className={cn("sticky top-0 w-full transition-all duration-300", open ? "z-[75]" : "z-40")}>
      {/* Utility top bar */}
      <div
        className={cn(
          "navbar-strip hidden lg:block",
          (scrolled || !isHome) && "navbar-strip--solid",
        )}
      >
        <div className="container-bleed flex h-9 items-center justify-between text-[0.7rem] font-medium">
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
            <LocaleSwitcher locale={locale} compact />
          </div>
        </div>
      </div>

      {/* Main bar */}
      <div
        className={cn(
          "navbar-surface text-white",
          (scrolled || !isHome) && "navbar-surface--solid",
        )}
      >
        <div className="container-bleed flex h-[68px] items-center justify-between gap-4">
          <Logo variant={dark ? "light" : "dark"} />

          <nav className="hidden items-center gap-0.5 xl:flex" aria-label="Navigasi utama">
            <Link
              href="/"
              aria-current={isHome ? "page" : undefined}
              className={cn(
                "rounded-md px-3 py-2 text-[0.82rem] font-semibold transition",
                dark
                  ? isHome
                    ? "text-accent"
                    : "text-white/80 hover:text-white"
                  : isHome
                    ? "text-accent-700"
                    : "text-primary/75 hover:text-primary",
              )}
            >
              {t.nav.home}
            </Link>

            <div
              ref={productsRef}
              className="relative"
              onMouseEnter={() => setProductsOpen(true)}
              onMouseLeave={() => setProductsOpen(false)}
              onKeyDown={(event) => {
                if (event.key === "Escape") {
                  setProductsOpen(false);
                  if (typeof document !== "undefined") (document.activeElement as HTMLElement)?.blur();
                }
              }}
            >
              <button
                type="button"
                onClick={() => setProductsOpen((prev) => !prev)}
                onFocus={() => setProductsOpen(true)}
                aria-expanded={productsOpen}
                aria-haspopup="true"
                className={cn(
                  "inline-flex items-center gap-1 rounded-md px-3 py-2 text-[0.82rem] font-semibold transition cursor-pointer",
                  dark ? "text-white/80 hover:text-white" : "text-primary/75 hover:text-primary",
                  productsOpen && "text-accent",
                )}
              >
                {t.nav.products}
                <ChevronDown className={cn("h-3.5 w-3.5 transition-transform duration-300", productsOpen && "rotate-180")} aria-hidden />
              </button>

              <div
                className={cn(
                  "absolute left-0 top-full z-50 w-[680px] max-w-[calc(100vw-32px)] pt-3 transition-all duration-200",
                  productsOpen
                    ? "visible translate-y-0 opacity-100"
                    : "invisible -translate-y-1 opacity-0 pointer-events-none",
                )}
              >
                <div className="surface-industrial overflow-hidden rounded-xl border border-white/10 p-3 shadow-2xl shadow-black/50 backdrop-blur-xl">
                  <div className="grid grid-cols-2 gap-2">
                    {categories.map((category) => (
                      <Link
                        key={category.slug}
                        href={`/products?cat=${category.slug}`}
                        onClick={() => {
                          setProductsOpen(false);
                          if (typeof document !== "undefined") (document.activeElement as HTMLElement)?.blur();
                        }}
                        className="group/card flex items-center gap-3.5 rounded-lg border border-transparent p-2.5 transition hover:border-white/10 hover:bg-white/[0.06]"
                      >
                        <Visual
                          src={categoryCovers[category.slug]}
                          category={category.slug}
                          alt={category.name}
                          showLabel={false}
                          showMeta={false}
                          sizes="88px"
                          className="h-[72px] w-[88px] shrink-0 rounded-lg ring-1 ring-white/10"
                        />
                        <span className="min-w-0 flex-1">
                          <span className="flex items-center justify-between gap-2">
                            <span className="font-display text-sm font-bold text-white">{category.name}</span>
                            <span className="rounded-full bg-white/10 px-2 py-0.5 font-mono text-[0.6rem] text-white/70">
                              {category.count}
                            </span>
                          </span>
                          <span className="mt-1 line-clamp-2 block text-[0.72rem] leading-snug text-white/55">
                            {category.description}
                          </span>
                        </span>
                        <ArrowRight className="h-4 w-4 shrink-0 -translate-x-1 text-accent opacity-0 transition group-hover/card:translate-x-0 group-hover/card:opacity-100" aria-hidden />
                      </Link>
                    ))}
                  </div>
                  <Link
                    href="/products"
                    onClick={() => {
                      setProductsOpen(false);
                      if (typeof document !== "undefined") (document.activeElement as HTMLElement)?.blur();
                    }}
                    className="mt-2 flex items-center justify-between rounded-lg bg-accent px-4 py-3 text-sm font-semibold transition hover:brightness-105"
                    style={{ color: "rgb(var(--c-on-accent))" }}
                  >
                    {t.header.seeAllProducts}
                    <ArrowRight className="h-4 w-4" aria-hidden />
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

          <div className="flex items-center gap-2 sm:gap-2.5">
            <ThemeSwitcher
              current={theme}
              locale={locale}
              variant={dark ? "dark" : "light"}
              showLabel={true}
              className="inline-flex"
            />
            <Link
              href={quoteHref}
              className="btn-accent btn-sm hidden md:inline-flex"
            >
              {t.header.quoteCta}
              <ArrowRight className="h-3.5 w-3.5" aria-hidden />
            </Link>
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
          <div className="surface-industrial absolute inset-y-0 right-0 flex w-full max-w-sm flex-col overflow-y-auto text-white shadow-e3 animate-fade-up">
            <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
              <Logo variant="light" />
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="flex h-9 w-9 items-center justify-center rounded-sm border border-white/20 text-white transition hover:border-accent hover:text-accent"
                aria-label={t.common.close}
              >
                <X className="h-5 w-5" aria-hidden />
              </button>
            </div>

            <nav className="flex-1 px-3 py-4" aria-label="Navigasi mobile">
              {nav.map((item) => {
                if (item.key === "products") {
                  return (
                    <div key={item.href}>
                      <button
                        type="button"
                        onClick={() => setMobileProductsOpen((v) => !v)}
                        className="flex w-full items-center justify-between rounded-sm px-3 py-3 text-[0.95rem] font-semibold text-white/85 transition hover:bg-white/[0.06] hover:text-white"
                        aria-expanded={mobileProductsOpen}
                      >
                        {t.nav[item.key]}
                        <ChevronDown className={cn("h-4 w-4 text-white/30 transition-transform", mobileProductsOpen && "rotate-180")} aria-hidden />
                      </button>
                      {mobileProductsOpen && (
                        <div className="ml-3 mt-1 space-y-1 border-l border-white/10 pl-3">
                          {categories.map((category) => (
                            <Link
                              key={category.slug}
                              href={`/products?cat=${category.slug}`}
                              onClick={() => setOpen(false)}
                              className="flex items-center justify-between rounded-sm px-2 py-2 text-sm text-white/70 transition hover:bg-white/[0.06] hover:text-white"
                            >
                              {category.name}
                              <span className="font-mono text-[0.6rem] text-white/40">{category.count}</span>
                            </Link>
                          ))}
                          <Link
                            href="/products"
                            onClick={() => setOpen(false)}
                            className="block rounded-sm px-2 py-2 text-sm font-semibold text-accent"
                          >
                            {t.header.seeAllProducts}
                          </Link>
                        </div>
                      )}
                    </div>
                  );
                }
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center justify-between rounded-sm px-3 py-3 text-[0.95rem] font-semibold text-white/85 transition hover:bg-white/[0.06] hover:text-white"
                  >
                    {t.nav[item.key]}
                    <ArrowRight className="h-4 w-4 text-white/30" aria-hidden />
                  </Link>
                );
              })}
            </nav>

            <div className="border-t border-white/10 px-4 py-4">
              <p className="px-1 text-[0.65rem] font-bold uppercase tracking-[0.18em] text-white/50">
                {t.header.productsMega}
              </p>
              <div className="mt-2 grid grid-cols-2 gap-2">
                {categories.map((category) => (
                  <Link
                    key={category.slug}
                    href={`/products?cat=${category.slug}`}
                    className="rounded-sm border border-white/15 bg-white/[0.04] p-3 text-xs font-semibold text-white/85 transition hover:border-accent/60 hover:text-white"
                  >
                    {category.name}
                    <span className="mt-1 block font-mono text-[0.6rem] font-normal text-white/40">
                      {category.count} item
                    </span>
                  </Link>
                ))}
              </div>
            </div>

            <div className="space-y-3 border-t border-white/10 px-5 py-5">
              <Link href={quoteHref} className="btn-accent w-full">
                <FileText className="h-4 w-4" aria-hidden />
                {t.header.quoteCta}
              </Link>
              <a href={`tel:${contact.phone.replace(/[^\d+]/g, "")}`} className="flex items-center gap-2 text-sm text-white/70">
                <Phone className="h-4 w-4 text-accent" aria-hidden /> {contact.phone}
              </a>
              <a href={`mailto:${contact.email}`} className="flex items-center gap-2 text-sm text-white/70">
                <Mail className="h-4 w-4 text-accent" aria-hidden /> {contact.email}
              </a>
              <div className="flex items-center justify-between gap-3 border-t border-white/10 pt-3">
                <ThemeSwitcher current={theme} locale={locale} variant="dark" showLabel={true} />
                <LocaleSwitcher locale={locale} compact />
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
