import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, FileCheck2, Search, ShieldCheck, Sparkles } from "lucide-react";
import { prisma } from "@/lib/db/prisma";
import { getLocale } from "@/lib/i18n/locale";
import { getMessages } from "@/i18n";
import { PageHero } from "@/components/public/PageHero";
import { CatalogTable, type CatalogRow } from "@/components/public/CatalogTable";
import { ButtonLink } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { formatDate } from "@/lib/utils/format";
import { PackageSearch } from "lucide-react";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = getMessages(locale);
  return {
    title: t.catalog.title,
    description: t.catalog.lead,
    alternates: { canonical: "/e-catalog" },
  };
}

function stringifySpec(value: unknown): { label: string; value: string }[] {
  if (!value || typeof value !== "object" || Array.isArray(value)) return [];
  return Object.entries(value as Record<string, unknown>).map(([label, entry]) => ({
    label,
    value: typeof entry === "object" ? JSON.stringify(entry) : String(entry),
  }));
}

export default async function ECatalogPage({
  searchParams,
}: {
  searchParams: Promise<{ cat?: string; q?: string }>;
}) {
  const { cat, q } = await searchParams;
  const locale = await getLocale();
  const t = getMessages(locale);

  const [categories, entries] = await Promise.all([
    prisma.category.findMany({ where: { type: "product" }, orderBy: { createdAt: "asc" } }),
    prisma.ecatalogEntry.findMany({
      where: {
        ...(cat ? { product: { category: { slug: cat } } } : {}),
        ...(q
          ? {
              OR: [
                { sku: { contains: q, mode: "insensitive" as const } },
                { product: { name: { contains: q, mode: "insensitive" as const } } },
              ],
            }
          : {}),
      },
      include: {
        product: {
          include: { category: true, images: { take: 1, orderBy: { order: "asc" } } },
        },
      },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  const rows: CatalogRow[] = entries.map((entry) => {
    const tiers = Array.isArray(entry.priceTiers)
      ? (entry.priceTiers as unknown[])
          .map((tier) => {
            if (!tier || typeof tier !== "object") return null;
            const record = tier as Record<string, unknown>;
            return { qty: String(record.qty ?? "—"), price: Number(record.price ?? 0) };
          })
          .filter((tier): tier is { qty: string; price: number } => tier !== null)
      : [];

    return {
      id: entry.id,
      sku: entry.sku,
      productId: entry.productId,
      name: entry.product.name,
      slug: entry.product.slug,
      description: entry.product.description,
      category: entry.product.category?.name ?? null,
      categorySlug: entry.product.category?.slug ?? null,
      price: Number(entry.priceUnit),
      availability: entry.availability,
      priceValidUntil: entry.priceValidUntil ? entry.priceValidUntil.toISOString() : null,
      moq: entry.product.moq,
      leadTime: entry.product.leadTime,
      image: entry.product.images[0]?.url ?? null,
      specs: stringifySpec(entry.specStandard),
      tiers,
    };
  });

  const validUntil =
    entries.find((entry) => entry.priceValidUntil)?.priceValidUntil ??
    new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

  const pdfParams = new URLSearchParams();
  if (cat) pdfParams.set("cat", cat);
  if (q) pdfParams.set("q", q);
  const pdfQuery = pdfParams.toString();
  const pdfHref = `/api/ecatalog/pdf${pdfQuery ? `?${pdfQuery}` : ""}`;

  return (
    <>
      <PageHero
        crumbs={[{ label: t.common.home, href: "/" }, { label: t.nav.catalog }]}
        eyebrow={t.catalog.official}
        title={t.catalog.title}
        lead={t.catalog.lead}
        meta={
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone="gold" dot>
              {t.common.validUntil} {formatDate(validUntil, locale === "en" ? "en-US" : "id-ID")}
            </Badge>
            <Badge tone="steel">
              <ShieldCheck className="h-3 w-3" aria-hidden />
              BUMN / Procurement ready
            </Badge>
          </div>
        }
        action={
          <div className="flex flex-col gap-2 sm:flex-row lg:flex-col">
            <ButtonLink href={pdfHref} variant="outline" iconLeft={<FileCheck2 className="h-4 w-4" aria-hidden />}>
              {t.common.downloadPdf}
            </ButtonLink>
            <ButtonLink href="/quote" iconRight={<ArrowRight className="h-4 w-4" aria-hidden />}>
              {t.common.quote}
            </ButtonLink>
          </div>
        }
      />

      <section className="container-site py-10 md:py-14">
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-md border border-surface-200 bg-white p-4 shadow-e1">
            <p className="text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-neutral-400">SKU aktif</p>
            <p className="mt-1 font-display text-2xl font-extrabold text-primary">{rows.length}</p>
          </div>
          <div className="rounded-md border border-surface-200 bg-white p-4 shadow-e1">
            <p className="text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-neutral-400">{t.catalog.table.category}</p>
            <p className="mt-1 font-display text-2xl font-extrabold text-primary">{categories.length}</p>
          </div>
          <div className="rounded-md border border-accent/25 bg-accent-50/70 p-4">
            <p className="flex items-center gap-1 text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-accent-700">
              <Sparkles className="h-3 w-3" aria-hidden />
              {locale === "en" ? "Procurement notes" : "Catatan procurement"}
            </p>
            <p className="mt-1 text-xs leading-relaxed text-neutral-600">{t.catalog.validNote}</p>
          </div>
        </div>

        <form action="/e-catalog" method="get" className="mt-6 flex flex-col gap-2.5 rounded-md border border-surface-200 bg-white p-3 shadow-e1 sm:flex-row">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" aria-hidden />
            <input
              name="q"
              defaultValue={q ?? ""}
              placeholder={t.catalog.searchPlaceholder}
              className="field py-2.5 pl-9"
              aria-label={t.common.search}
            />
          </div>
          <select name="cat" defaultValue={cat ?? ""} className="field sm:w-56" aria-label={t.common.category}>
            <option value="">{t.common.all}</option>
            {categories.map((category) => (
              <option key={category.id} value={category.slug}>
                {category.name}
              </option>
            ))}
          </select>
          <button type="submit" className="btn-dark">
            {t.common.filter}
          </button>
          {(q || cat) && (
            <Link href="/e-catalog" className="btn-ghost">
              {t.common.reset}
            </Link>
          )}
        </form>

        <div className="mt-5">
          {rows.length > 0 ? (
            <CatalogTable
              rows={rows}
              locale={locale}
              pdfHref={pdfHref}
              labels={{
                product: t.catalog.table.product,
                sku: t.catalog.table.sku,
                category: t.catalog.table.category,
                price: t.catalog.table.price,
                availability: t.catalog.table.availability,
                action: t.catalog.table.action,
                detail: t.common.detail,
                compare: t.common.compare,
                compareTitle: t.catalog.compareTitle,
                compareNote: t.catalog.compareNote,
                compareSelected: t.catalog.compareSelected,
                compareOpen: t.catalog.compareOpen,
                compareClear: t.catalog.compareClear,
                compareLimit: t.catalog.compareLimit,
                compareEmpty: t.catalog.compareEmpty,
                exportExcel: t.common.exportExcel,
                validUntil: t.common.validUntil,
                exportNote: t.catalog.exportNote,
                mobileHint: t.catalog.mobileHint,
                moq: t.common.moq,
                leadTime: t.common.leadTime,
                specs: t.product.tabs.specs,
              }}
            />
          ) : (
            <EmptyState
              icon={PackageSearch}
              title={t.products.emptyTitle}
              description={t.products.emptyLead}
              action={
                <ButtonLink href="/e-catalog" variant="outline">
                  {t.common.reset}
                </ButtonLink>
              }
            />
          )}
        </div>
      </section>
    </>
  );
}
