"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, type ReactNode } from "react";
import {
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  FileText,
  Image as ImageIcon,
  Inbox,
  LayoutDashboard,
  LayoutTemplate,
  Languages,
  LogOut,
  Mail,
  Menu,
  MessageSquare,
  Package,
  PanelsTopLeft,
  Search,
  Settings,
  ShoppingBag,
  Star,
  Table2,
  Users,
  X,
} from "lucide-react";
import { Logo } from "@/components/common/Logo";
import { cn } from "@/lib/utils/cn";
import { initials } from "@/lib/utils/format";

type NavItem = { href: string; label: string; icon: typeof LayoutDashboard };
type NavGroup = { label: string; items: NavItem[] };

export function AdminShell({
  children,
  user,
  labels,
}: {
  children: ReactNode;
  user: { name: string; email: string; role: string };
  labels: { viewSite: string; logout: string; groups: { content: string; catalog: string; sales: string; settings: string } };
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const groups: NavGroup[] = [
    {
      label: "Overview",
      items: [{ href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard }],
    },
    {
      label: labels.groups.content,
      items: [
        { href: "/admin/blog", label: "Blog", icon: FileText },
        { href: "/admin/home-sections", label: "Section Beranda", icon: LayoutTemplate },
        { href: "/admin/testimonials", label: "Testimoni & Klien", icon: Star },
        { href: "/admin/site-content", label: "Konten Situs", icon: PanelsTopLeft },
        { href: "/admin/translations", label: "Terjemahan", icon: Languages },
        { href: "/admin/media", label: "Media", icon: ImageIcon },
      ],
    },
    {
      label: labels.groups.catalog,
      items: [
        { href: "/admin/products", label: "Produk", icon: Package },
        { href: "/admin/ecatalog", label: "E-Catalog", icon: Table2 },
        { href: "/admin/portfolio", label: "Portofolio", icon: ShoppingBag },
      ],
    },
    {
      label: labels.groups.sales,
      items: [
        { href: "/admin/inquiries", label: "Inquiry", icon: Inbox },
        { href: "/admin/contact-messages", label: "Pesan Kontak", icon: MessageSquare },
      ],
    },
    {
      label: labels.groups.settings,
      items: [
        { href: "/admin/email-templates", label: "Email", icon: Mail },
        { href: "/admin/settings", label: "Pengaturan", icon: Settings },
        { href: "/admin/users", label: "Pengguna", icon: Users },
      ],
    },
  ];

  const flat = groups.flatMap((group) => group.items);
  const current =
    flat.find((item) => pathname === item.href || pathname.startsWith(`${item.href}/`)) ?? flat[0];

  async function logout() {
    setLoggingOut(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/login");
      router.refresh();
    } finally {
      setLoggingOut(false);
    }
  }

  const sidebar = (
    <div className="flex h-full flex-col bg-primary text-white">
      <div className={cn("flex h-16 items-center border-b border-white/10 px-4", collapsed ? "justify-center" : "justify-between")}>
        {collapsed ? <Logo compact variant="light" href="/admin/dashboard" /> : <Logo variant="light" href="/admin/dashboard" />}
        <button
          type="button"
          onClick={() => setCollapsed((value) => !value)}
          className="hidden h-8 w-8 items-center justify-center rounded-md border border-white/10 text-white/50 transition hover:text-white lg:flex"
          aria-label={collapsed ? "Perluas sidebar" : "Ciutkan sidebar"}
        >
          {collapsed ? <ChevronRight className="h-4 w-4" aria-hidden /> : <ChevronLeft className="h-4 w-4" aria-hidden />}
        </button>
        <button
          type="button"
          onClick={() => setMobileOpen(false)}
          className="flex h-8 w-8 items-center justify-center rounded-md border border-white/10 text-white/60 lg:hidden"
          aria-label="Tutup menu"
        >
          <X className="h-4 w-4" aria-hidden />
        </button>
      </div>

      <nav className="no-scrollbar flex-1 overflow-y-auto px-2 py-4" aria-label="Navigasi CMS">
        {groups.map((group) => (
          <div key={group.label} className="mb-5">
            {!collapsed && (
              <p className="mb-1.5 px-3 text-[0.58rem] font-bold uppercase tracking-[0.18em] text-white/30">
                {group.label}
              </p>
            )}
            <ul className="space-y-0.5">
              {group.items.map((item) => {
                const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
                const Icon = item.icon;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      title={collapsed ? item.label : undefined}
                      onClick={() => setMobileOpen(false)}
                      className={cn(
                        "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition",
                        collapsed && "justify-center px-0",
                        active
                          ? "bg-accent text-primary shadow-e1"
                          : "text-white/60 hover:bg-white/[0.06] hover:text-white",
                      )}
                    >
                      <Icon className="h-4 w-4 shrink-0" aria-hidden />
                      {!collapsed && <span>{item.label}</span>}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div className="border-t border-white/10 p-3">
        <Link
          href="/"
          target="_blank"
          className={cn(
            "flex items-center gap-2 rounded-md px-3 py-2 text-xs font-medium text-white/50 transition hover:bg-white/[0.06] hover:text-white",
            collapsed && "justify-center px-0",
          )}
          title={labels.viewSite}
        >
          <ExternalLink className="h-4 w-4" aria-hidden />
          {!collapsed && labels.viewSite}
        </Link>
        <div className={cn("mt-2 flex items-center gap-2.5 rounded-md bg-white/[0.04] p-2.5", collapsed && "justify-center")}>
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent text-[0.65rem] font-bold text-primary">
            {initials(user.name)}
          </span>
          {!collapsed && (
            <span className="min-w-0 flex-1">
              <span className="block truncate text-xs font-semibold text-white">{user.name}</span>
              <span className="block truncate text-[0.6rem] text-white/40">{user.role.replace("_", " ")}</span>
            </span>
          )}
          <button
            type="button"
            onClick={logout}
            disabled={loggingOut}
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-white/40 transition hover:bg-white/10 hover:text-danger"
            aria-label={labels.logout}
            title={labels.logout}
          >
            <LogOut className="h-3.5 w-3.5" aria-hidden />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-surface">
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 hidden transition-all duration-300 lg:block",
          collapsed ? "w-[76px]" : "w-[260px]",
        )}
      >
        {sidebar}
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Menu CMS">
          <button type="button" className="absolute inset-0 bg-primary/60 backdrop-blur-sm" onClick={() => setMobileOpen(false)} aria-label="Tutup" />
          <div className="absolute inset-y-0 left-0 w-[280px] shadow-e3">{sidebar}</div>
        </div>
      )}

      <div className={cn("transition-all duration-300", collapsed ? "lg:pl-[76px]" : "lg:pl-[260px]")}>
        <header className="sticky top-0 z-30 border-b border-surface-200 bg-white/90 backdrop-blur-xl">
          <div className="flex h-16 items-center gap-3 px-4 md:px-6">
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="flex h-9 w-9 items-center justify-center rounded-md border border-surface-300 text-primary lg:hidden"
              aria-label="Buka menu"
            >
              <Menu className="h-4 w-4" aria-hidden />
            </button>

            <div className="min-w-0 flex-1">
              <p className="text-[0.6rem] font-semibold uppercase tracking-[0.16em] text-neutral-400">CMS GRAFINDO</p>
              <p className="truncate font-display text-sm font-bold text-primary">{current?.label ?? "Dashboard"}</p>
            </div>

            <form action="/admin/search" className="relative hidden md:block">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-neutral-400" aria-hidden />
              <input
                name="q"
                placeholder="Cari produk, artikel…"
                className="w-56 rounded-md border border-surface-200 bg-surface/70 py-2 pl-9 pr-3 text-xs text-primary outline-none transition focus:border-accent focus:bg-white"
                aria-label="Cari di CMS"
              />
            </form>

            <Link href="/" target="_blank" className="hidden h-9 items-center gap-1.5 rounded-md border border-surface-300 px-3 text-xs font-semibold text-primary transition hover:border-primary/40 sm:flex">
              <ExternalLink className="h-3.5 w-3.5" aria-hidden />
              {labels.viewSite}
            </Link>

            <div className="flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-[0.65rem] font-bold text-accent">
                {initials(user.name)}
              </span>
            </div>
          </div>
        </header>

        <main className="p-4 md:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
