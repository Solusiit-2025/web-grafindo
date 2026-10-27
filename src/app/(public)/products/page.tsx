import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  LayoutGrid,
  List,
  PackageSearch,
  Search,
  SlidersHorizontal,
  Timer,
} from "lucide-react";
import { prisma } from "@/lib/db/prisma";
import { getLocale } from "@/lib/i18n/locale";
import { format, getMessages } from "@/i18n";
import { PageHero } from "@/components/public/PageHero";
import { ProductCard } from "@/components/public/ProductCard";
import { Visual } from "@/components/public/Visual";
import { EmptyState } from "@/components/ui/EmptyState";
import { ButtonLink } from "@/components/ui/Button";
import { AvailabilityBadge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils/cn";
import { formatCurrency } from "@/lib/utils/format";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = getMessages(locale);
  return {
    title: t.products.title,
    description: t.products.lead,
    alternates: { canonical: "/products" },
  };
}

type Search = { cat?: string; q?: string; sort?: string; view?: string };

function buildHref(current: Search, patch: Record<string, string | undefined>) {
  const params = new URLSearchParams();
  const merged = { ...current, ...patch };
  (Object.keys(merged) as (keyof Search)[]).forEach((key) => {
    const value = merged[key];
    if (value) params.set(key, value);
  });
  const query = params.toString();
  return `/products${query ? `?${query}` : ""}`;
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<Search>;
}) {
  const { cat, q, sort = "newest", view = "grid" } = await searchParams;
  const locale = await getLocale();
  const t = getMessages(locale);

  const [categories, products] = await Promise.all([
    prisma.category.findMany({
      where: { type: "product" },
      include: { _count: { select: { products: { where: { status: "PUBLISHED" } } } } },
      orderBy: { createdAt: "asc" },
    }),
    prisma.product.findMany({
      where: {
        status: "PUBLISHED",
        ...(cat ? { category: { slug: cat } } : {}),
        ...(q
          ? {
              OR: [
                { name: { contains: q, mode: "insensitive" as const } },
                { description: { contains: q, mode: "insensitive" as const } },
              ],
            }
          : {}),
      },
      include: { category: true, images: { orderBy: { order: "asc" }, take: 2 }, ecatalog: true },
      orderBy:
        sort === "name"
          ? { name: "asc" }
          : sort === "moq"
            ? { moq: "asc" }
            : { updatedAt: "desc" },
    }),
  ]);

  const activeCategory = categories.find((category) => category.slug === cat);
  const sortOptions = [
    { value: "newest", label: t.products.sortOptions.newest },
    { value: "name", label: t.products.sortOptions.name },
    { value: "moq", label: t.products.sortOptions.moq },
  ];

  return (
    <>
      <PageHero
        crumbs={[
          { label: t.common.home, href: "/" },
          { label: t.nav.products },
        ]}
        eyebrow={t.nav.products}
        title={activeCategory ? activeCategory.name : t.products.title}
        lead={t.products.lead}
        meta={
          <p className="inline-flex items-center gap-2 rounded-full border border-surface-300 bg-white px-3 py-1.5 text-xs font-medium text-neutral-600 shadow-e1">
            <PackageSearch className="h-3.5 w-3.5 text-accent-700" aria-hidden />
            {format(t.products.resultCount, { count: products.length })}
          </p>
        }
        action={
          <ButtonLink href="/quote" iconRight={<ArrowRight className="h-4 w-4" aria-hidden />}>
            {t.common.quote}
          </ButtonLink>
        }
      />

      <div className="container-site py-10 md:py-14">
        <div className="grid min-w-0 gap-8 lg:grid-cols-[240px_1fr] lg:gap-10">
          {/* Sidebar */}
          <aside className="hidden lg:block">
            <div className="sticky top-28 space-y-7">
              <div>
                <h2 className="flex items-center gap-2 font-display text-sm font-bold text-primary">
                  <SlidersHorizontal className="h-4 w-4 text-accent-700" aria-hidden />
                  {t.products.filters}
                </h2>
                <div className="mt-4 space-y-1">
                  <Link
                    href={buildHref({ cat, q, sort, view }, { cat: undefined })}
                    className={cn(
                      "flex items-center justify-between rounded-sm px-3 py-2 text-sm transition",
                      !cat ? "bg-primary font-semibold text-white" : "text-neutral-600 hover:bg-surface",
                    )}
                  >
                    {t.common.all}
                    <span className="font-mono text-[0.65rem] opacity-60">
                      {categories.reduce((total, category) => total + category._count.products, 0)}
                    </span>
                  </Link>
                  {categories.map((category) => (
                    <Link
                      key={category.id}
                      href={buildHref({ cat, q, sort, view }, { cat: category.slug })}
                      className={cn(
                        "flex items-center justify-between rounded-sm px-3 py-2 text-sm transition",
                        cat === category.slug
                          ? "bg-primary font-semibold text-white"
                          : "text-neutral-600 hover:bg-surface",
                      )}
                    >
                      {category.name}
                      <span className="font-mono text-[0.65rem] opacity-60">{category._count.products}</span>
                    </Link>
                  ))}
                </div>
              </div>

              <div className="rounded-md border border-surface-200 bg-white p-4 shadow-e1">
                <p className="font-display text-sm font-bold text-primary">{t.products.customTitle}</p>
                <p className="mt-1.5 text-xs leading-relaxed text-neutral-500">{t.products.customLead}</p>
                <Link href="/quote" className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-secondary hover:text-accent-700">
                  {t.products.customCta}
                  <ArrowRight className="h-3 w-3" aria-hidden />
                </Link>
              </div>
            </div>
          </aside>

          <div className="min-w-0">
            {/* Toolbar */}
            <div className="flex flex-col gap-3 border-b border-surface-200 pb-5 sm:flex-row sm:items-center sm:justify-between">
              <form action="/products" method="get" className="relative flex-1 sm:max-w-sm">
                {cat && <input type="hidden" name="cat" value={cat} />}
                {sort && <input type="hidden" name="sort" value={sort} />}
                {view && <input type="hidden" name="view" value={view} />}
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" aria-hidden />
                <input
                  name="q"
                  defaultValue={q ?? ""}
                  placeholder={t.products.searchPlaceholder}
                  className="field py-2.5 pl-9"
                  aria-label={t.common.search}
                />
              </form>

              <div className="flex min-w-0 flex-wrap items-center gap-2">
                <form action="/products" method="get" className="flex min-w-0 flex-1 items-center gap-2 sm:flex-none">
                  {cat && <input type="hidden" name="cat" value={cat} />}
                  {q && <input type="hidden" name="q" value={q} />}
                  <input type="hidden" name="view" value={view} />
                  <select name="sort" defaultValue={sort} className="field min-w-0 flex-1 py-2.5 pr-8 text-xs sm:w-auto sm:flex-none" aria-label={t.common.sort}>
                    {sortOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <button type="submit" className="btn-outline btn-sm shrink-0">
                    {t.common.sort}
                  </button>
                </form>

                <div className="flex shrink-0 items-center rounded-sm border border-surface-300 bg-white p-0.5">
                  <Link
                    href={buildHref({ cat, q, sort }, { view: "grid" })}
                    aria-label={t.common.grid}
                    className={cn(
                      "flex h-8 w-8 items-center justify-center rounded-[6px] transition",
                      view !== "list" ? "bg-primary text-white" : "text-neutral-500 hover:text-primary",
                    )}
                  >
                    <LayoutGrid className="h-4 w-4" aria-hidden />
                  </Link>
                  <Link
                    href={buildHref({ cat, q, sort }, { view: "list" })}
                    aria-label={t.common.list}
                    className={cn(
                      "flex h-8 w-8 items-center justify-center rounded-[6px] transition",
                      view === "list" ? "bg-primary text-white" : "text-neutral-500 hover:text-primary",
                    )}
                  >
                    <List className="h-4 w-4" aria-hidden />
                  </Link>
                </div>
              </div>
            </div>

            {/* Mobile category chips */}
            <div className="no-scrollbar mt-4 flex gap-2 overflow-x-auto pb-1 lg:hidden">
              <Link href={buildHref({ cat, q, sort, view }, { cat: undefined })} className={cn("chip shrink-0", !cat && "chip-active")}>
                {t.common.all}
              </Link>
              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={buildHref({ cat, q, sort, view }, { cat: category.slug })}
                  className={cn("chip shrink-0", cat === category.slug && "chip-active")}
                >
                  {category.name}
                </Link>
              ))}
            </div>

            {products.length === 0 ? (
              <EmptyState
                className="mt-8"
                icon={PackageSearch}
                title={t.products.emptyTitle}
                description={t.products.emptyLead}
                action={
                  <ButtonLink href="/quote" variant="outline">
                    {t.products.customCta}
                  </ButtonLink>
                }
              />
            ) : view === "list" ? (
              <div className="mt-6 min-w-0 space-y-3">
                {products.map((product) => (
                  <Link
                    key={product.id}
                    href={`/products/${product.slug}`}
                    className="group card card-hover flex flex-col gap-4 overflow-hidden p-3 sm:flex-row sm:items-center sm:p-4"
                  >
                    <Visual
                      src={product.images[0]?.url}
                      alt={product.name}
                      label={product.name}
                      category={product.category?.slug}
                      ratio="square"
                      sizes="160px"
                      className="h-32 w-full shrink-0 rounded-md sm:h-28 sm:w-28"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-accent-700">
                          {product.category?.name}
                        </span>
                        {product.ecatalog && (
                          <AvailabilityBadge value={product.ecatalog.availability} locale={locale} />
                        )}
                      </div>
                      <h2 className="mt-1.5 font-display text-lg font-bold text-primary transition group-hover:text-accent-700">
                        {product.name}
                      </h2>
                      <p className="mt-1 line-clamp-2 text-sm text-neutral-600">{product.description}</p>
                      <div className="mt-2 flex flex-wrap items-center gap-4 text-xs text-neutral-500">
                        {product.moq != null && <span>MOQ {product.moq}</span>}
                        {product.leadTime && (
                          <span className="inline-flex items-center gap-1">
                            <Timer className="h-3.5 w-3.5 text-accent-700" aria-hidden />
                            {product.leadTime}
                          </span>
                        )}
                        {product.ecatalog && (
                          <span className="font-mono text-primary">
                            {formatCurrency(Number(product.ecatalog.priceUnit), locale === "en" ? "en-US" : "id-ID")}
                          </span>
                        )}
                      </div>
                    </div>
                    <span className="flex items-center gap-1 text-xs font-semibold text-secondary sm:pr-3">
                      {t.products.viewDetail}
                      <ArrowUpRight className="h-4 w-4" aria-hidden />
                    </span>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="mt-6 grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {products.map((product) => (
                  <ProductCard
                    key={product.id}
                    locale={locale}
                    product={{
                      id: product.id,
                      name: product.name,
                      slug: product.slug,
                      moq: product.moq,
                      leadTime: product.leadTime,
                      category: product.category,
                      images: product.images,
                      price: product.ecatalog ? Number(product.ecatalog.priceUnit) : null,
                    }}
                  />
                ))}
              </div>
            )}

            <div className="mt-12 overflow-hidden rounded-lg border border-surface-200 bg-surface p-6 sm:p-8">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="font-display text-xl font-bold text-primary">{t.products.customTitle}</h2>
                  <p className="mt-1.5 text-sm text-neutral-600">{t.products.customLead}</p>
                </div>
                <ButtonLink href="/quote" className="shrink-0" iconRight={<ArrowRight className="h-4 w-4" aria-hidden />}>
                  {t.products.customCta}
                </ButtonLink>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
