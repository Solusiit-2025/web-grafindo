import type { Metadata } from "next";
import Link from "next/link";
import { Check, Clock, Mail, MessageCircle, Phone, ShieldCheck } from "lucide-react";
import { prisma } from "@/lib/db/prisma";
import { getLocale } from "@/lib/i18n/locale";
import { getMessages } from "@/i18n";
import { PageHero } from "@/components/public/PageHero";
import { QuoteForm } from "@/components/public/QuoteForm";
import { siteConfig, waLink } from "@/config/site";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = getMessages(locale);
  return {
    title: t.quote.eyebrow,
    description: t.quote.lead,
    alternates: { canonical: "/quote" },
  };
}

export default async function QuotePage({
  searchParams,
}: {
  searchParams: Promise<{ product?: string; category?: string; lang?: string }>;
}) {
  const { product, category, lang } = await searchParams;
  const locale = await getLocale(lang);
  const t = getMessages(locale);

  const [categories, products, wa, testimonial] = await Promise.all([
    prisma.category.findMany({
      where: { type: "product" },
      include: { _count: { select: { products: { where: { status: "PUBLISHED" } } } } },
      orderBy: { createdAt: "asc" },
    }),
    prisma.product.findMany({
      where: { status: "PUBLISHED" },
      select: { id: true, name: true, category: { select: { slug: true } } },
      orderBy: { name: "asc" },
    }),
    prisma.whatsAppSetting.findFirst(),
    prisma.testimonial.findFirst({ where: { isActive: true, locale }, orderBy: { order: "asc" } }),
  ]);

  const waNumber = wa?.number ?? siteConfig.whatsapp;

  return (
    <>
      <PageHero
        crumbs={[{ label: t.common.home, href: "/" }, { label: t.common.quote }]}
        eyebrow={t.quote.eyebrow}
        title={t.quote.title}
        lead={t.quote.lead}
        meta={
          <div className="flex flex-wrap items-center gap-2 text-xs text-neutral-500">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-surface-300 bg-white px-3 py-1.5">
              <Clock className="h-3.5 w-3.5 text-accent-700" aria-hidden />
              {t.quote.asidePoints[0]}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-surface-300 bg-white px-3 py-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-accent-700" aria-hidden />
              NDA available
            </span>
          </div>
        }
      />

      <section className="container-site py-10 md:py-14">
        <div className="grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <QuoteForm
              locale={locale}
              categories={categories.map((item) => ({
                slug: item.slug,
                name: item.name,
                count: item._count.products,
              }))}
              products={products.map((item) => ({
                id: item.id,
                name: item.name,
                categorySlug: item.category?.slug,
              }))}
              defaultCategory={category}
              defaultProduct={product}
              whatsappNumber={waNumber}
              t={t.quote}
              common={t.common}
            />
          </div>

          <aside className="lg:col-span-4">
            <div className="space-y-4 lg:sticky lg:top-28">
              <div className="relative overflow-hidden rounded-xl bg-grad-steel p-6 text-white shadow-e2">
                <div className="pattern-grid pointer-events-none absolute inset-0 opacity-50" aria-hidden />
                <div className="relative">
                  <h2 className="font-display text-lg font-bold">{t.quote.asideTitle}</h2>
                  <ul className="mt-4 space-y-3">
                    {t.quote.asidePoints.map((point) => (
                      <li key={point} className="flex items-start gap-2.5 text-sm text-white/65">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden />
                        {point}
                      </li>
                    ))}
                  </ul>

                  <div className="mt-6 border-t border-white/10 pt-4">
                    <p className="text-[0.6rem] font-semibold uppercase tracking-[0.16em] text-white/35">
                      {t.quote.salesLabel}
                    </p>
                    <p className="mt-1 text-sm font-semibold text-white">{t.quote.salesName}</p>
                    <div className="mt-3 space-y-2 text-xs text-white/55">
                      <a href={`tel:${siteConfig.phoneHref}`} className="flex items-center gap-2 transition hover:text-accent">
                        <Phone className="h-3.5 w-3.5 text-accent" aria-hidden />
                        {siteConfig.phone}
                      </a>
                      <a href={`mailto:${siteConfig.email}`} className="flex items-center gap-2 transition hover:text-accent">
                        <Mail className="h-3.5 w-3.5 text-accent" aria-hidden />
                        {siteConfig.email}
                      </a>
                    </div>
                    <a
                      href={waLink(waNumber, locale === "en" ? "Hello GRAFINDO, I need help with a quotation." : "Halo GRAFINDO, saya butuh bantuan penawaran.")}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-accent btn-sm mt-4 w-full"
                    >
                      <MessageCircle className="h-3.5 w-3.5" aria-hidden />
                      {t.common.whatsapp}
                    </a>
                  </div>
                </div>
              </div>

              {testimonial && (
                <figure className="rounded-lg border border-surface-200 bg-white p-5 shadow-e1">
                  <blockquote className="text-sm leading-relaxed text-neutral-600">“{testimonial.quote}”</blockquote>
                  <figcaption className="mt-3 border-t border-surface-200 pt-3 text-xs">
                    <span className="block font-semibold text-primary">{testimonial.name}</span>
                    <span className="text-neutral-500">
                      {[testimonial.role, testimonial.company].filter(Boolean).join(" · ")}
                    </span>
                  </figcaption>
                </figure>
              )}

              <div className="rounded-lg border border-surface-200 bg-surface p-5 text-xs leading-relaxed text-neutral-500">
                <p className="font-semibold text-primary">{t.quote.autosave}</p>
                <p className="mt-1">
                  {locale === "en"
                    ? "Your draft is stored in this browser. You can return and continue anytime."
                    : "Draf Anda tersimpan di browser ini. Anda bisa kembali dan melanjutkan kapan saja."}
                </p>
                <Link href="/faq" className="btn-link mt-3 text-xs">
                  {t.faq.eyebrow}
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
