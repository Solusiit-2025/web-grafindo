import Link from "next/link";
import { ArrowRight, FileText, Inbox, Package, PanelsTopLeft, Search, Table2 } from "lucide-react";
import { prisma } from "@/lib/db/prisma";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { formatDate } from "@/lib/utils/format";

export default async function AdminSearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q = "" } = await searchParams;
  const query = q.trim();

  if (!query) {
    return (
      <div className="space-y-5">
        <div>
          <p className="text-[0.62rem] font-bold uppercase tracking-[0.16em] text-accent-700">Pencarian</p>
          <h1 className="mt-1.5 font-display text-2xl font-extrabold text-primary md:text-3xl">Cari di CMS</h1>
          <p className="mt-1 text-sm text-neutral-500">Cari produk, artikel, portofolio, inquiry, atau konten situs.</p>
        </div>
        <EmptyState
          icon={Search}
          title="Mulai mengetik kata kunci"
          description="Gunakan kolom pencarian di topbar. Contoh: chrome, RFQ, sticker, atau nama klien."
        />
      </div>
    );
  }

  const like = { contains: query, mode: "insensitive" as const };
  const [products, posts, portfolios, inquiries, contents] = await Promise.all([
    prisma.product.findMany({
      where: { OR: [{ name: like }, { slug: like }, { description: like }] },
      take: 8,
      include: { category: true },
    }),
    prisma.blogPost.findMany({
      where: { OR: [{ title: like }, { slug: like }, { content: like }] },
      take: 8,
    }),
    prisma.portfolio.findMany({
      where: { OR: [{ title: like }, { client: like }, { technique: like }] },
      take: 8,
    }),
    prisma.inquiry.findMany({
      where: {
        OR: [{ refNumber: like }, { name: like }, { company: like }, { email: like }],
      },
      take: 8,
      orderBy: { createdAt: "desc" },
    }),
    prisma.siteContent.findMany({
      where: { OR: [{ key: like }, { value: like }] },
      take: 8,
    }),
  ]);

  const total = products.length + posts.length + portfolios.length + inquiries.length + contents.length;

  return (
    <div className="space-y-5">
      <div>
        <p className="text-[0.62rem] font-bold uppercase tracking-[0.16em] text-accent-700">Pencarian</p>
        <h1 className="mt-1.5 font-display text-2xl font-extrabold text-primary md:text-3xl">
          Hasil untuk “{query}”
        </h1>
        <p className="mt-1 text-sm text-neutral-500">{total} hasil ditemukan.</p>
      </div>

      {total === 0 ? (
        <EmptyState
          icon={Search}
          title="Tidak ada hasil"
          description="Coba kata kunci lain atau lebih pendek."
        />
      ) : (
        <div className="grid gap-4 xl:grid-cols-2">
          <ResultGroup title="Produk" icon={Package} count={products.length}>
            {products.map((product) => (
              <ResultRow
                key={product.id}
                href={`/admin/products/${product.id}`}
                title={product.name}
                meta={`${product.category?.name ?? "Tanpa kategori"} · ${product.slug}`}
                badge={product.status}
              />
            ))}
          </ResultGroup>

          <ResultGroup title="Artikel" icon={FileText} count={posts.length}>
            {posts.map((post) => (
              <ResultRow
                key={post.id}
                href={`/admin/blog/${post.id}`}
                title={post.title}
                meta={`${post.slug} · ${formatDate(post.updatedAt)}`}
                badge={post.status}
              />
            ))}
          </ResultGroup>

          <ResultGroup title="Portofolio" icon={Table2} count={portfolios.length}>
            {portfolios.map((item) => (
              <ResultRow
                key={item.id}
                href={`/admin/portfolio/${item.id}`}
                title={item.title}
                meta={[item.client, item.technique].filter(Boolean).join(" · ") || item.slug}
              />
            ))}
          </ResultGroup>

          <ResultGroup title="Inquiry" icon={Inbox} count={inquiries.length}>
            {inquiries.map((inquiry) => (
              <ResultRow
                key={inquiry.id}
                href="/admin/inquiries"
                title={`${inquiry.refNumber} · ${inquiry.name}`}
                meta={`${inquiry.company ?? "—"} · ${inquiry.email}`}
                badge={inquiry.status}
              />
            ))}
          </ResultGroup>

          <ResultGroup title="Konten situs" icon={PanelsTopLeft} count={contents.length}>
            {contents.map((content) => (
              <ResultRow
                key={content.id}
                href="/admin/site-content"
                title={content.key}
                meta={`${content.locale.toUpperCase()} · ${content.value.slice(0, 80)}`}
                badge={content.type}
              />
            ))}
          </ResultGroup>
        </div>
      )}
    </div>
  );
}

function ResultGroup({
  title,
  icon: Icon,
  count,
  children,
}: {
  title: string;
  icon: typeof Package;
  count: number;
  children: React.ReactNode;
}) {
  if (count === 0) return null;
  return (
    <section className="card overflow-hidden">
      <div className="flex items-center gap-2 border-b border-surface-200 px-4 py-3">
        <Icon className="h-4 w-4 text-accent-700" aria-hidden />
        <h2 className="font-display text-sm font-bold text-primary">{title}</h2>
        <Badge tone="outline" className="ml-auto">{count}</Badge>
      </div>
      <div className="divide-y divide-surface-200">{children}</div>
    </section>
  );
}

function ResultRow({
  href,
  title,
  meta,
  badge,
}: {
  href: string;
  title: string;
  meta: string;
  badge?: string;
}) {
  return (
    <Link href={href} className="flex items-center gap-3 px-4 py-3 transition hover:bg-surface/70">
      <span className="min-w-0 flex-1">
        <span className="block truncate text-xs font-semibold text-primary">{title}</span>
        <span className="mt-0.5 block truncate text-[0.62rem] text-neutral-400">{meta}</span>
      </span>
      {badge && <Badge tone="neutral">{badge}</Badge>}
      <ArrowRight className="h-3.5 w-3.5 shrink-0 text-surface-400" aria-hidden />
    </Link>
  );
}
