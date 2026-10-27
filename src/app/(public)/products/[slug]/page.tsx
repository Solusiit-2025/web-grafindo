import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowRight,
  BadgeCheck,
  Boxes,
  Download,
  FileText,
  Layers,
  MessageCircle,
  Ruler,
  ShieldCheck,
  Timer,
} from "lucide-react";
import { prisma } from "@/lib/db/prisma";
import { getLocale } from "@/lib/i18n/locale";
import { format, getMessages } from "@/i18n";
import { siteConfig, waLink } from "@/config/site";
import { ProductGallery } from "@/components/public/ProductGallery";
import { ProductCard } from "@/components/public/ProductCard";
import { Tabs } from "@/components/ui/Tabs";
import { Accordion } from "@/components/ui/Accordion";
import { Badge, AvailabilityBadge } from "@/components/ui/Badge";
import { ButtonLink } from "@/components/ui/Button";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { productJsonLd, breadcrumbJsonLd, jsonLdScript } from "@/lib/seo/structured-data";
import { formatCurrency } from "@/lib/utils/format";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await prisma.product.findUnique({
    where: { slug },
    include: { images: { take: 1, orderBy: { order: "asc" } } },
  });
  if (!product) return { title: "Produk" };
  const description =
    product.description ?? `Spesifikasi dan penawaran ${product.name} dari Grafindo.`;
  return {
    title: product.name,
    description,
    alternates: { canonical: `/products/${product.slug}` },
    openGraph: {
      title: product.name,
      description,
      images: product.images[0]?.url ? [{ url: product.images[0].url }] : undefined,
      type: "website",
    },
  };
}

type SpecRecord = Record<string, unknown>;

function specEntries(value: unknown): [string, string][] {
  if (!value || typeof value !== "object" || Array.isArray(value)) return [];
  return Object.entries(value as SpecRecord).map(([key, entry]) => [
    key,
    typeof entry === "string" || typeof entry === "number" || typeof entry === "boolean"
      ? String(entry)
      : JSON.stringify(entry),
  ]);
}

function tierList(value: unknown): { qty: string; price: number }[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((entry) => {
      if (!entry || typeof entry !== "object") return null;
      const record = entry as Record<string, unknown>;
      const qty = String(record.qty ?? record.range ?? "—");
      const price = Number(record.price ?? 0);
      return Number.isFinite(price) ? { qty, price } : null;
    })
    .filter((entry): entry is { qty: string; price: number } => entry !== null);
}

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const locale = await getLocale();
  const t = getMessages(locale);

  const [product, faqs, wa] = await Promise.all([
    prisma.product.findUnique({
      where: { slug },
      include: {
        category: true,
        images: { orderBy: { order: "asc" } },
        variants: true,
        ecatalog: true,
      },
    }),
    prisma.fAQ.findMany({ where: { locale }, orderBy: { order: "asc" }, take: 5 }),
    prisma.whatsAppSetting.findFirst(),
  ]);

  if (!product || product.status !== "PUBLISHED") notFound();

  const related = await prisma.product.findMany({
    where: {
      status: "PUBLISHED",
      ...(product.categoryId ? { categoryId: product.categoryId } : {}),
      NOT: { id: product.id },
    },
    take: 4,
    include: { category: true, images: { take: 1, orderBy: { order: "asc" } }, ecatalog: true },
  });

  const specs = specEntries(product.ecatalog?.specStandard);
  const tiers = tierList(product.ecatalog?.priceTiers);
  const availability = product.ecatalog?.availability ?? "made_to_order";
  const price = product.ecatalog ? Number(product.ecatalog.priceUnit) : null;
  const docs = product.ecatalog?.docs ?? [];
  const sku = product.ecatalog?.sku;

  const quoteHref = `/quote?product=${encodeURIComponent(product.name)}${product.category ? `&category=${product.category.slug}` : ""}`;
  const waMessage = format(t.product.whatsappPrefill, { product: product.name });
  const waHref = waLink(wa?.number ?? siteConfig.whatsapp, waMessage);

  const tabs = [
    {
      id: "description",
      label: t.product.tabs.description,
      content: (
        <div className="space-y-6">
          <div className="article-content max-w-none">
            <p>{product.description ?? t.product.noSpecs}</p>
            <p>
              {locale === "en"
                ? "Each order is produced to your specification with material recommendations, pre-production samples, and batch-level QC documentation."
                : "Setiap pesanan diproduksi sesuai spesifikasi Anda dengan rekomendasi material, sampel pra-produksi, dan dokumentasi QC per batch."}
            </p>
          </div>
          {product.variants.length > 0 && (
            <div>
              <h3 className="font-display text-sm font-bold text-primary">{t.product.variants}</h3>
              <div className="mt-2.5 flex flex-wrap gap-2">
                {product.variants.map((variant) => (
                  <Badge key={variant.id} tone="outline">
                    {variant.name}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      ),
    },
    {
      id: "specs",
      label: t.product.tabs.specs,
      content:
        specs.length > 0 ? (
          <div className="overflow-hidden rounded-md border border-surface-200">
            <table className="w-full text-sm">
              <thead className="bg-surface">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-primary">{t.product.specKey}</th>
                  <th className="px-4 py-3 text-left font-semibold text-primary">{t.product.specValue}</th>
                </tr>
              </thead>
              <tbody>
                {specs.map(([key, value]) => (
                  <tr key={key} className="border-t border-surface-200">
                    <td className="px-4 py-3 text-neutral-500">{key}</td>
                    <td className="px-4 py-3 font-mono text-xs text-primary">{value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="rounded-md border border-dashed border-surface-300 bg-surface/60 p-6 text-sm text-neutral-600">
            <p>{t.product.noSpecs}</p>
            <Link href={quoteHref} className="btn-link mt-3">
              {t.product.requestDocs} <ArrowRight className="h-3.5 w-3.5" aria-hidden />
            </Link>
          </div>
        ),
    },
    {
      id: "tiers",
      label: t.product.tabs.tiers,
      content:
        tiers.length > 0 ? (
          <div>
            <div className="overflow-hidden rounded-md border border-surface-200">
              <table className="w-full text-sm">
                <thead className="bg-surface">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold text-primary">{t.product.qtyRange}</th>
                    <th className="px-4 py-3 text-right font-semibold text-primary">{t.product.unitPrice}</th>
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
            <p className="mt-3 text-xs text-neutral-500">{t.product.priceNote}</p>
          </div>
        ) : (
          <p className="rounded-md border border-dashed border-surface-300 bg-surface/60 p-6 text-sm text-neutral-600">
            {t.product.priceNote}
          </p>
        ),
    },
    {
      id: "faq",
      label: t.product.tabs.faq,
      content:
        faqs.length > 0 ? (
          <Accordion items={faqs.map((faq) => ({ id: faq.id, question: faq.question, answer: faq.answer }))} />
        ) : (
          <p className="text-sm text-neutral-500">{t.faq.empty}</p>
        ),
    },
    {
      id: "docs",
      label: t.product.tabs.docs,
      content: (
        <div className="rounded-md border border-surface-200 p-6">
          <p className="text-sm leading-relaxed text-neutral-600">{t.product.docsNote}</p>
          {docs.length > 0 && (
            <ul className="mt-4 space-y-2">
              {docs.map((doc) => (
                <li key={doc}>
                  <a
                    href={doc}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm font-medium text-secondary hover:text-accent-700"
                  >
                    <Download className="h-4 w-4" aria-hidden />
                    {doc.split("/").pop()}
                  </a>
                </li>
              ))}
            </ul>
          )}
          <div className="mt-5 flex flex-wrap gap-2">
            <ButtonLink href={quoteHref} size="sm" variant="outline">
              {t.product.requestDocs}
            </ButtonLink>
            {product.ecatalog?.catalogPdfUrl && (
              <a href={product.ecatalog.catalogPdfUrl} className="btn-dark btn-sm" target="_blank" rel="noopener noreferrer">
                <FileText className="h-3.5 w-3.5" aria-hidden />
                {t.common.downloadPdf}
              </a>
            )}
          </div>
        </div>
      ),
    },
  ];

  return (
    <>
      <div className="border-b border-surface-200 bg-white">
        <div className="container-site py-4">
          <Breadcrumb
            items={[
              { label: t.common.home, href: "/" },
              { label: t.nav.products, href: "/products" },
              ...(product.category
                ? [{ label: product.category.name, href: `/products?cat=${product.category.slug}` }]
                : []),
              { label: product.name },
            ]}
          />
        </div>
      </div>

      <section className="container-site py-8 md:py-12">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-7">
            <ProductGallery
              images={product.images}
              productName={product.name}
              category={product.category?.slug}
              productId={product.id}
            />
          </div>

          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-28">
              <div className="flex flex-wrap items-center gap-2">
                {product.category && (
                  <Link
                    href={`/products?cat=${product.category.slug}`}
                    className="text-[0.68rem] font-bold uppercase tracking-[0.18em] text-accent-700 transition hover:text-accent"
                  >
                    {product.category.name}
                  </Link>
                )}
                <AvailabilityBadge value={availability} locale={locale} />
                <Badge tone="gold">Custom</Badge>
              </div>

              <h1 className="mt-4 font-display text-display-md text-primary">{product.name}</h1>
              {product.description && (
                <p className="mt-4 text-sm leading-relaxed text-neutral-600 md:text-base">{product.description}</p>
              )}

              <div className="mt-6 grid grid-cols-3 gap-px overflow-hidden rounded-md border border-surface-200 bg-surface-200">
                <div className="bg-white px-3 py-3.5">
                  <p className="flex items-center gap-1 text-[0.6rem] font-semibold uppercase tracking-[0.12em] text-neutral-400">
                    <Layers className="h-3 w-3" aria-hidden /> {t.common.moq}
                  </p>
                  <p className="mt-1 font-mono text-sm font-medium text-primary">{product.moq ?? "—"}</p>
                </div>
                <div className="bg-white px-3 py-3.5">
                  <p className="flex items-center gap-1 text-[0.6rem] font-semibold uppercase tracking-[0.12em] text-neutral-400">
                    <Timer className="h-3 w-3" aria-hidden /> {t.common.leadTime}
                  </p>
                  <p className="mt-1 font-mono text-sm font-medium text-primary">{product.leadTime ?? "—"}</p>
                </div>
                <div className="bg-white px-3 py-3.5">
                  <p className="flex items-center gap-1 text-[0.6rem] font-semibold uppercase tracking-[0.12em] text-neutral-400">
                    <Boxes className="h-3 w-3" aria-hidden /> {t.common.sku}
                  </p>
                  <p className="mt-1 truncate font-mono text-[0.65rem] font-medium text-primary" title={sku}>
                    {sku ?? "—"}
                  </p>
                </div>
              </div>

              {price && (
                <div className="mt-4 rounded-md border border-accent/25 bg-accent-50/60 px-4 py-3.5">
                  <p className="text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-accent-700">
                    {t.common.from}
                  </p>
                  <p className="mt-0.5 font-display text-2xl font-extrabold text-primary">
                    {formatCurrency(price, locale === "en" ? "en-US" : "id-ID")}
                    <span className="ml-1 font-sans text-xs font-normal text-neutral-500">{t.common.perUnit}</span>
                  </p>
                  {tiers.length > 1 && (
                    <p className="mt-1 text-[0.65rem] text-neutral-500">
                      {locale === "en" ? "Volume pricing available" : "Harga bertingkat tersedia"} · {tiers.length} tier
                    </p>
                  )}
                </div>
              )}

              <div className="mt-6 flex flex-col gap-2.5">
                <ButtonLink href={quoteHref} size="lg" iconRight={<ArrowRight className="h-4 w-4" aria-hidden />}>
                  {t.common.quote}
                </ButtonLink>
                <a href={waHref} target="_blank" rel="noopener noreferrer" className="btn-outline btn-lg">
                  <MessageCircle className="h-4 w-4" aria-hidden />
                  {t.common.whatsapp}
                </a>
              </div>

              <ul className="mt-6 space-y-2 border-t border-surface-200 pt-5 text-xs text-neutral-500">
                <li className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-accent-700" aria-hidden />
                  {locale === "en" ? "Batch-level QC documentation" : "Dokumentasi QC per batch"}
                </li>
                <li className="flex items-center gap-2">
                  <BadgeCheck className="h-4 w-4 text-accent-700" aria-hidden />
                  {locale === "en" ? "Pre-production sample approval" : "Persetujuan sampel pra-produksi"}
                </li>
                <li className="flex items-center gap-2">
                  <Ruler className="h-4 w-4 text-accent-700" aria-hidden />
                  {locale === "en" ? "Custom dimensions & finishing" : "Dimensi & finishing custom"}
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-12 grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <Tabs items={tabs} />
          </div>
          <aside className="lg:col-span-4">
            <div className="rounded-lg border border-surface-200 bg-surface p-6">
              <h2 className="font-display text-lg font-bold text-primary">{t.product.needHelp}</h2>
              <p className="mt-2 text-sm leading-relaxed text-neutral-600">{t.product.needHelpLead}</p>
              <div className="mt-4 flex flex-col gap-2">
                <ButtonLink href="/contact" variant="dark" size="sm">
                  {t.common.consult}
                </ButtonLink>
                <a href={waHref} target="_blank" rel="noopener noreferrer" className="btn-outline btn-sm">
                  {t.common.contactSales}
                </a>
              </div>
            </div>
          </aside>
        </div>
      </section>

      {related.length > 0 && (
        <section className="border-t border-surface-200 bg-surface py-14 md:py-20">
          <div className="container-site">
            <SectionHeader
              eyebrow={t.common.related}
              title={locale === "en" ? "Complete your specification." : "Lengkapi spesifikasi Anda."}
              lead={locale === "en" ? "Products often ordered together." : "Produk yang sering dipesan bersamaan."}
              action={
                <ButtonLink href="/products" variant="outline" iconRight={<ArrowRight className="h-4 w-4" aria-hidden />}>
                  {t.common.viewAll}
                </ButtonLink>
              }
            />
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {related.map((item) => (
                <ProductCard
                  key={item.id}
                  locale={locale}
                  product={{
                    id: item.id,
                    name: item.name,
                    slug: item.slug,
                    moq: item.moq,
                    leadTime: item.leadTime,
                    category: item.category,
                    images: item.images,
                    price: item.ecatalog ? Number(item.ecatalog.priceUnit) : null,
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
            name: product.name,
            slug: product.slug,
            description: product.description,
            image: product.images[0]?.url,
            sku,
            price,
            availability,
          }),
        )}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLdScript(
          breadcrumbJsonLd([
            { name: t.common.home, url: "/" },
            { name: t.nav.products, url: "/products" },
            { name: product.name, url: `/products/${product.slug}` },
          ]),
        )}
      />
    </>
  );
}
