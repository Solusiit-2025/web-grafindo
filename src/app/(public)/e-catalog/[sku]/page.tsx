import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Download, FileText, Layers, ShieldCheck, Timer } from "lucide-react";
import { prisma } from "@/lib/db/prisma";
import { getLocale } from "@/lib/i18n/locale";
import { getMessages } from "@/i18n";
import { ProductGallery } from "@/components/public/ProductGallery";
import { ProductCard } from "@/components/public/ProductCard";
import { Badge, AvailabilityBadge } from "@/components/ui/Badge";
import { ButtonLink } from "@/components/ui/Button";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { formatCurrency, formatDate } from "@/lib/utils/format";
import { productJsonLd, jsonLdScript } from "@/lib/seo/structured-data";

export async function generateMetadata({ params }: { params: Promise<{ sku: string }> }): Promise<Metadata> {
  const { sku } = await params;
  const entry = await prisma.ecatalogEntry.findUnique({ where: { sku }, include: { product: true } });
  if (!entry) return { title: "E-Catalog" };
  return {
    title: `${entry.product.name} (${entry.sku})`,
    description: entry.product.description ?? "Spesifikasi & harga acuan produk Grafindo.",
    alternates: { canonical: `/e-catalog/${entry.sku}` },
  };
}

export default async function ECatalogDetailPage({ params }: { params: Promise<{ sku: string }> }) {
  const { sku } = await params;
  const locale = await getLocale();
  const t = getMessages(locale);

  const entry = await prisma.ecatalogEntry.findUnique({
    where: { sku },
    include: { product: { include: { category: true, images: { orderBy: { order: "asc" } }, variants: true } } },
  });
  if (!entry) notFound();

  const related = await prisma.ecatalogEntry.findMany({
    where: { NOT: { id: entry.id } },
    take: 4,
    include: { product: { include: { category: true, images: { take: 1, orderBy: { order: "asc" } } } } },
  });

  const specs =
    entry.specStandard && typeof entry.specStandard === "object" && !Array.isArray(entry.specStandard)
      ? Object.entries(entry.specStandard as Record<string, unknown>).map(([key, value]) => ({
          key,
          value: typeof value === "object" ? JSON.stringify(value) : String(value),
        }))
      : [];

  const tiers = Array.isArray(entry.priceTiers)
    ? (entry.priceTiers as unknown[])
        .map((tier) => {
          if (!tier || typeof tier !== "object") return null;
          const record = tier as Record<string, unknown>;
          return { qty: String(record.qty ?? "—"), price: Number(record.price ?? 0) };
        })
        .filter((tier): tier is { qty: string; price: number } => tier !== null)
    : [];

  const quoteHref = `/quote?product=${encodeURIComponent(entry.product.name)}&category=${entry.product.category?.slug ?? ""}`;
  const price = Number(entry.priceUnit);

  return (
    <>
      <div className="surface-industrial border-b border-white/10 text-white">
        <div className="container-site relative py-4">
          <Breadcrumb
            className="text-white/55 [&_[aria-current=page]]:text-white [&_a:hover]:text-accent [&_svg]:text-white/30"
            items={[
              { label: t.common.home, href: "/" },
              { label: t.nav.catalog, href: "/e-catalog" },
              { label: entry.sku },
            ]}
          />
        </div>
      </div>

      <section className="container-site py-8 md:py-12">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-6">
            <ProductGallery
              images={entry.product.images}
              productName={entry.product.name}
              category={entry.product.category?.slug}
              productId={entry.product.id}
            />
          </div>

          <div className="lg:col-span-6">
            <div className="flex flex-wrap items-center gap-2">
              <Badge tone="gold">E-Catalog</Badge>
              <AvailabilityBadge value={entry.availability} locale={locale} />
              {entry.product.category && <Badge tone="outline">{entry.product.category.name}</Badge>}
            </div>
            <h1 className="mt-4 font-display text-display-md text-primary">{entry.product.name}</h1>
            <p className="mt-2 font-mono text-xs text-neutral-500">
              {t.common.sku}: {entry.sku}
            </p>
            {entry.product.description && (
              <p className="mt-4 text-sm leading-relaxed text-neutral-600">{entry.product.description}</p>
            )}

            <div className="mt-6 rounded-md border border-accent/25 bg-accent-50/60 p-4">
              <p className="text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-accent-700">{t.product.unitPrice}</p>
              <p className="mt-1 font-display text-3xl font-extrabold text-primary">
                {formatCurrency(price, locale === "en" ? "en-US" : "id-ID")}
                <span className="ml-1 font-sans text-xs font-normal text-neutral-500">{t.common.perUnit}</span>
              </p>
              <p className="mt-1 text-[0.65rem] text-neutral-500">
                {t.common.validUntil} {formatDate(entry.priceValidUntil, locale === "en" ? "en-US" : "id-ID")}
              </p>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="rounded-md border border-surface-200 bg-white p-3">
                <p className="flex items-center gap-1 text-[0.6rem] uppercase tracking-[0.12em] text-neutral-400">
                  <Layers className="h-3 w-3" aria-hidden /> {t.common.moq}
                </p>
                <p className="mt-1 font-mono text-sm text-primary">{entry.product.moq ?? "—"}</p>
              </div>
              <div className="rounded-md border border-surface-200 bg-white p-3">
                <p className="flex items-center gap-1 text-[0.6rem] uppercase tracking-[0.12em] text-neutral-400">
                  <Timer className="h-3 w-3" aria-hidden /> {t.common.leadTime}
                </p>
                <p className="mt-1 font-mono text-sm text-primary">{entry.product.leadTime ?? "—"}</p>
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-2.5 sm:flex-row">
              <ButtonLink href={quoteHref} className="flex-1" iconRight={<ArrowRight className="h-4 w-4" aria-hidden />}>
                {t.common.quote}
              </ButtonLink>
              <ButtonLink href="/contact" variant="outline" className="flex-1">
                {t.common.consult}
              </ButtonLink>
            </div>

            <div className="mt-6 flex items-start gap-2 rounded-md bg-surface p-4 text-xs leading-relaxed text-neutral-600">
              <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-accent-700" aria-hidden />
              {t.catalog.validNote}
            </div>
          </div>
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <h2 className="font-display text-xl font-bold text-primary">{t.product.tabs.specs}</h2>
            {specs.length > 0 ? (
              <div className="mt-4 overflow-hidden rounded-md border border-surface-200">
                <table className="w-full text-sm">
                  <tbody>
                    {specs.map((spec) => (
                      <tr key={spec.key} className="odd:bg-surface/60">
                        <td className="w-40 px-4 py-3 text-xs font-medium capitalize text-neutral-500">{spec.key}</td>
                        <td className="px-4 py-3 font-mono text-xs text-primary">{spec.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="mt-4 rounded-md border border-dashed border-surface-300 p-6 text-sm text-neutral-500">
                {t.product.noSpecs}
              </p>
            )}

            {entry.product.variants.length > 0 && (
              <div className="mt-6">
                <h2 className="font-display text-sm font-bold text-primary">{t.product.variants}</h2>
                <div className="mt-2 flex flex-wrap gap-2">
                  {entry.product.variants.map((variant) => (
                    <Badge key={variant.id} tone="outline">
                      {variant.name}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-5">
            <h2 className="font-display text-xl font-bold text-primary">{t.product.tabs.tiers}</h2>
            {tiers.length > 0 ? (
              <div className="mt-4 overflow-hidden rounded-md border border-surface-200">
                <table className="w-full text-sm">
                  <thead className="bg-surface">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold">{t.product.qtyRange}</th>
                      <th className="px-4 py-3 text-right text-xs font-semibold">{t.product.unitPrice}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tiers.map((tier, index) => (
                      <tr key={`${tier.qty}-${index}`} className="border-t border-surface-200">
                        <td className="px-4 py-3 font-mono text-xs text-neutral-600">{tier.qty}</td>
                        <td className="px-4 py-3 text-right font-mono text-xs font-medium text-primary">
                          {formatCurrency(tier.price, locale === "en" ? "en-US" : "id-ID")}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="mt-4 text-sm text-neutral-500">{t.product.priceNote}</p>
            )}

            <div className="mt-6 rounded-md border border-surface-200 p-4">
              <p className="flex items-center gap-2 text-sm font-semibold text-primary">
                <FileText className="h-4 w-4 text-accent-700" aria-hidden />
                {t.product.tabs.docs}
              </p>
              <p className="mt-1.5 text-xs leading-relaxed text-neutral-500">{t.product.docsNote}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {entry.docs.map((doc) => (
                  <a
                    key={doc}
                    href={doc}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-outline btn-sm"
                  >
                    <Download className="h-3.5 w-3.5" aria-hidden />
                    {doc.split("/").pop()}
                  </a>
                ))}
                {entry.catalogPdfUrl && (
                  <a href={entry.catalogPdfUrl} target="_blank" rel="noopener noreferrer" className="btn-outline btn-sm">
                    <Download className="h-3.5 w-3.5" aria-hidden />
                    {t.common.downloadPdf}
                  </a>
                )}
                {entry.docs.length === 0 && !entry.catalogPdfUrl && (
                  <Link href={quoteHref} className="btn-outline btn-sm">
                    {t.product.requestDocs}
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="border-t border-surface-200 bg-surface py-14">
          <div className="container-site">
            <div className="flex items-end justify-between gap-4">
              <h2 className="font-display text-2xl font-bold text-primary">{t.common.related}</h2>
              <Link href="/e-catalog" className="btn-link">
                {t.common.viewAll} <ArrowRight className="h-3.5 w-3.5" aria-hidden />
              </Link>
            </div>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {related.map((item) => (
                <ProductCard
                  key={item.id}
                  locale={locale}
                  product={{
                    id: item.product.id,
                    name: item.product.name,
                    slug: item.product.slug,
                    moq: item.product.moq,
                    leadTime: item.product.leadTime,
                    category: item.product.category,
                    images: item.product.images,
                    price: Number(item.priceUnit),
                  }}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLdScript(
          productJsonLd({
            name: entry.product.name,
            slug: entry.product.slug,
            description: entry.product.description,
            image: entry.product.images[0]?.url,
            sku: entry.sku,
            price,
            availability: entry.availability,
          }),
        )}
      />
    </>
  );
}
