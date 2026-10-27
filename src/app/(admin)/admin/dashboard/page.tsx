import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  CalendarDays,
  FileText,
  Inbox,
  Package,
  Plus,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { prisma } from "@/lib/db/prisma";
import { getLocale } from "@/lib/i18n/locale";
import { Badge, type BadgeTone } from "@/components/ui/Badge";
import { ButtonLink } from "@/components/ui/Button";
import { formatDate } from "@/lib/utils/format";
import { cn } from "@/lib/utils/cn";

const statusTone: Record<string, BadgeTone> = {
  NEW: "steel",
  CONTACTED: "warning",
  QUOTED: "gold",
  WON: "success",
  LOST: "danger",
};

const statusLabel: Record<string, string> = {
  NEW: "New",
  CONTACTED: "Contacted",
  QUOTED: "Quoted",
  WON: "Won",
  LOST: "Lost",
};

export default async function AdminDashboardPage() {
  const locale = await getLocale();
  const now = new Date();
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  const [newInquiries, totalInquiries, publishedProducts, publishedPosts, statusGroups, recent, monthInquiries] =
    await Promise.all([
      prisma.inquiry.count({ where: { createdAt: { gte: weekAgo } } }),
      prisma.inquiry.count(),
      prisma.product.count({ where: { status: "PUBLISHED" } }),
      prisma.blogPost.count({ where: { status: "PUBLISHED" } }),
      prisma.inquiry.groupBy({ by: ["status"], _count: { _all: true } }),
      prisma.inquiry.findMany({ orderBy: { createdAt: "desc" }, take: 6 }),
      prisma.inquiry.findMany({
        where: { createdAt: { gte: monthAgo } },
        select: { createdAt: true },
      }),
    ]);

  const daily = new Map<string, number>();
  for (let index = 29; index >= 0; index -= 1) {
    const date = new Date(now.getTime() - index * 24 * 60 * 60 * 1000);
    daily.set(date.toISOString().slice(0, 10), 0);
  }
  monthInquiries.forEach((inquiry) => {
    const key = inquiry.createdAt.toISOString().slice(0, 10);
    if (daily.has(key)) daily.set(key, (daily.get(key) ?? 0) + 1);
  });
  const trend = Array.from(daily.entries());
  const peak = Math.max(1, ...trend.map(([, value]) => value));

  const statusMap = Object.fromEntries(statusGroups.map((group) => [group.status, group._count._all]));
  const won = statusMap.WON ?? 0;
  const conversion = totalInquiries > 0 ? Math.round((won / totalInquiries) * 100) : 0;

  const kpis = [
    {
      label: "Inquiry baru (7 hari)",
      value: newInquiries,
      hint: `${totalInquiries} total inquiry`,
      icon: Inbox,
      tone: "text-secondary bg-secondary-50",
      href: "/admin/inquiries",
    },
    {
      label: "Produk published",
      value: publishedProducts,
      hint: "Katalog aktif",
      icon: Package,
      tone: "text-accent-700 bg-accent-50",
      href: "/admin/products",
    },
    {
      label: "Artikel published",
      value: publishedPosts,
      hint: "Konten publik",
      icon: FileText,
      tone: "text-success bg-success-50",
      href: "/admin/blog",
    },
    {
      label: "Konversi won",
      value: `${conversion}%`,
      hint: `${won} inquiry won`,
      icon: TrendingUp,
      tone: "text-warning bg-warning-50",
      href: "/admin/inquiries",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[0.62rem] font-bold uppercase tracking-[0.16em] text-accent-700">Overview</p>
          <h1 className="mt-1.5 font-display text-2xl font-extrabold text-primary md:text-3xl">Dashboard</h1>
          <p className="mt-1 text-sm text-neutral-500">
            Ringkasan performa konten, katalog, dan pipeline inquiry GRAFINDO.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-md border border-surface-200 bg-white px-3 py-2 text-xs text-neutral-500">
            <CalendarDays className="h-3.5 w-3.5 text-accent-700" aria-hidden />
            {formatDate(now, locale === "en" ? "en-US" : "id-ID")}
          </span>
          <ButtonLink href="/admin/products/new" size="sm" iconLeft={<Plus className="h-3.5 w-3.5" aria-hidden />}>
            Produk
          </ButtonLink>
          <ButtonLink href="/admin/blog/new" size="sm" variant="outline" iconLeft={<Plus className="h-3.5 w-3.5" aria-hidden />}>
            Artikel
          </ButtonLink>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <Link
              key={kpi.label}
              href={kpi.href}
              className="group card card-hover p-4"
            >
              <div className="flex items-start justify-between">
                <span className={cn("flex h-10 w-10 items-center justify-center rounded-md", kpi.tone)}>
                  <Icon className="h-4 w-4" aria-hidden />
                </span>
                <ArrowUpRight className="h-4 w-4 text-surface-400 transition group-hover:text-accent-700" aria-hidden />
              </div>
              <p className="mt-4 font-display text-3xl font-extrabold text-primary">{kpi.value}</p>
              <p className="mt-1 text-xs font-semibold text-neutral-600">{kpi.label}</p>
              <p className="mt-0.5 text-[0.65rem] text-neutral-400">{kpi.hint}</p>
            </Link>
          );
        })}
      </div>

      <div className="grid gap-4 xl:grid-cols-12">
        <section className="card p-5 xl:col-span-8">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="font-display text-base font-bold text-primary">Tren inquiry 30 hari</h2>
              <p className="mt-0.5 text-xs text-neutral-500">{monthInquiries.length} inquiry masuk pada periode ini</p>
            </div>
            <Badge tone="gold">
              <Sparkles className="h-3 w-3" aria-hidden />
              Live
            </Badge>
          </div>

          <div className="mt-6 flex h-40 items-end gap-1">
            {trend.map(([date, value]) => (
              <div key={date} className="group relative flex flex-1 flex-col items-center justify-end">
                <div
                  className={cn(
                    "w-full rounded-t-[3px] transition-all duration-300",
                    value > 0 ? "bg-grad-gold group-hover:brightness-105" : "bg-surface-200",
                  )}
                  style={{ height: value > 0 ? `${Math.max(8, (value / peak) * 100)}%` : "4px" }}
                />
                <div className="pointer-events-none absolute bottom-full mb-1 hidden whitespace-nowrap rounded bg-primary px-2 py-1 text-[0.6rem] text-white group-hover:block">
                  {date.slice(5)} · {value}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-2 flex justify-between font-mono text-[0.58rem] text-neutral-400">
            <span>{trend[0]?.[0].slice(5)}</span>
            <span>{trend[14]?.[0].slice(5)}</span>
            <span>{trend[trend.length - 1]?.[0].slice(5)}</span>
          </div>

          <div className="mt-6 grid gap-2 border-t border-surface-200 pt-4 sm:grid-cols-5">
            {(["NEW", "CONTACTED", "QUOTED", "WON", "LOST"] as const).map((status) => {
              const count = statusMap[status] ?? 0;
              const total = totalInquiries || 1;
              return (
                <div key={status}>
                  <div className="flex items-center justify-between text-[0.62rem]">
                    <span className="text-neutral-500">{statusLabel[status]}</span>
                    <span className="font-mono text-primary">{count}</span>
                  </div>
                  <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-surface-200">
                    <div
                      className={cn(
                        "h-full rounded-full",
                        status === "WON"
                          ? "bg-success"
                          : status === "LOST"
                            ? "bg-danger"
                            : status === "QUOTED"
                              ? "bg-accent"
                              : status === "CONTACTED"
                                ? "bg-warning"
                                : "bg-secondary",
                      )}
                      style={{ width: `${Math.max(4, (count / total) * 100)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="card p-5 xl:col-span-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-base font-bold text-primary">Aksi cepat</h2>
          </div>
          <div className="mt-4 space-y-2">
            {[
              { href: "/admin/products/new", label: "Tambah produk baru", icon: Package },
              { href: "/admin/blog/new", label: "Tulis artikel", icon: FileText },
              { href: "/admin/inquiries", label: "Lihat pipeline inquiry", icon: Inbox },
              { href: "/admin/site-content", label: "Ubah konten beranda", icon: Sparkles },
            ].map((action) => {
              const Icon = action.icon;
              return (
                <Link
                  key={action.href}
                  href={action.href}
                  className="flex items-center gap-3 rounded-md border border-surface-200 px-3 py-2.5 text-sm text-primary transition hover:border-accent/40 hover:bg-surface"
                >
                  <Icon className="h-4 w-4 text-accent-700" aria-hidden />
                  <span className="flex-1">{action.label}</span>
                  <ArrowRight className="h-3.5 w-3.5 text-surface-400" aria-hidden />
                </Link>
              );
            })}
          </div>

          <div className="mt-5 rounded-md bg-grad-steel p-4 text-white">
            <p className="text-[0.6rem] font-semibold uppercase tracking-[0.16em] text-white/40">Quick tip</p>
            <p className="mt-1.5 text-xs leading-relaxed text-white/60">
              Lengkapi foto dan spesifikasi produk untuk meningkatkan kualitas lead RFQ.
            </p>
            <Link href="/admin/media" className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-accent">
              Kelola media <ArrowRight className="h-3 w-3" aria-hidden />
            </Link>
          </div>
        </section>
      </div>

      <section className="card overflow-hidden">
        <div className="flex items-center justify-between border-b border-surface-200 px-5 py-4">
          <h2 className="font-display text-base font-bold text-primary">Inquiry terbaru</h2>
          <Link href="/admin/inquiries" className="btn-link text-xs">
            Lihat semua <ArrowRight className="h-3 w-3" aria-hidden />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-surface">
              <tr>
                <th className="px-4 py-2.5 text-left text-[0.62rem] uppercase tracking-[0.1em] text-neutral-400">Ref</th>
                <th className="px-4 py-2.5 text-left text-[0.62rem] uppercase tracking-[0.1em] text-neutral-400">Kontak</th>
                <th className="px-4 py-2.5 text-left text-[0.62rem] uppercase tracking-[0.1em] text-neutral-400">Perusahaan</th>
                <th className="px-4 py-2.5 text-left text-[0.62rem] uppercase tracking-[0.1em] text-neutral-400">Status</th>
                <th className="px-4 py-2.5 text-right text-[0.62rem] uppercase tracking-[0.1em] text-neutral-400">Tanggal</th>
              </tr>
            </thead>
            <tbody>
              {recent.map((inquiry) => (
                <tr key={inquiry.id} className="border-t border-surface-200">
                  <td className="whitespace-nowrap px-4 py-3 font-mono text-[0.68rem] text-neutral-500">{inquiry.refNumber}</td>
                  <td className="px-4 py-3">
                    <span className="block text-xs font-semibold text-primary">{inquiry.name}</span>
                    <span className="block text-[0.65rem] text-neutral-400">{inquiry.email}</span>
                  </td>
                  <td className="px-4 py-3 text-xs text-neutral-500">{inquiry.company ?? "—"}</td>
                  <td className="px-4 py-3">
                    <Badge tone={statusTone[inquiry.status] ?? "neutral"} dot>
                      {statusLabel[inquiry.status] ?? inquiry.status}
                    </Badge>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-right text-xs text-neutral-400">
                    {formatDate(inquiry.createdAt, locale === "en" ? "en-US" : "id-ID")}
                  </td>
                </tr>
              ))}
              {recent.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-10 text-center text-xs text-neutral-400">
                    Belum ada inquiry.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
