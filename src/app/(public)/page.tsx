import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  Check,
  Factory,
  Ruler,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { prisma } from "@/lib/db/prisma";
import { getLocale } from "@/lib/i18n/locale";
import { format, getMessages } from "@/i18n";
import { productCategoriesFallback, siteConfig } from "@/config/site";
import { ButtonLink } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Reveal } from "@/components/motion/Reveal";
import { Counter } from "@/components/motion/Counter";
import { Marquee } from "@/components/motion/Marquee";
import { Visual } from "@/components/public/Visual";
import { HeroVisual } from "@/components/public/HeroVisual";
import { ProductCard } from "@/components/public/ProductCard";
import { PortfolioGrid } from "@/components/public/PortfolioGrid";
import { TestimonialCarousel } from "@/components/public/TestimonialCarousel";
import { formatDate, readingTime } from "@/lib/utils/format";
import { cn } from "@/lib/utils/cn";
import { getJsonContent } from "@/lib/content";
import {
  getCategoriesCached,
  getClientLogosCached,
  getHomeSectionsCached,
  getHomeStatsCached,
  getSiteContentCached,
  getTestimonialsCached,
} from "@/services/content.service";

const fallbackTestimonials = [
  {
    id: "fallback-1",
    name: "Rani Prameswari",
    role: "Brand Manager",
    company: "Kopi Nusantara",
    quote:
      "Warna sticker konsisten di semua batch. Mockup dan sampel fisiknya membantu kami mengunci desain sebelum produksi besar.",
    rating: 5,
  },
  {
    id: "fallback-2",
    name: "Dimas Ardhana",
    role: "Procurement Lead",
    company: "AutoParts Co",
    quote:
      "Dokumentasi QC dan spec sheet lengkap, jadi proses vendor registration kami jauh lebih cepat.",
    rating: 5,
  },
  {
    id: "fallback-3",
    name: "Sarah Lim",
    role: "Product Director",
    company: "FC Garuda",
    quote:
      "Soft emblem jersey rapi, tepi bersih, dan tidak kaku. Repeat order tiga musim berturut-turut tanpa perubahan kualitas.",
    rating: 5,
  },
];

const categoryCovers: Record<string, string> = {
  stickers: "/images/products/cat-stickers.jpg",
  graphics: "/images/products/cat-graphics.jpg",
  emblems: "/images/products/cat-emblems.jpg",
  "soft-emblems": "/images/products/cat-soft-emblems.jpg",
};


const defaultOrder = [
  "hero",
  "trust",
  "categories",
  "stats",
  "process",
  "featured",
  "portfolio",
  "testimonials",
  "articles",
  "cta",
];

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ lang?: string }>;
}) {
  const { lang } = await searchParams;
  const locale = await getLocale(lang);
  const t = getMessages(locale);

  const [contents, sectionRows, categories, products, portfolios, testimonials, clientLogos, posts, statSetting] =
    await Promise.all([
      getSiteContentCached(locale),
      getHomeSectionsCached(),
      getCategoriesCached(),
      prisma.product.findMany({
        where: { status: "PUBLISHED" },
        take: 4,
        orderBy: { updatedAt: "desc" },
        include: { category: true, images: { orderBy: { order: "asc" }, take: 2 }, ecatalog: true },
      }),
      prisma.portfolio.findMany({
        take: 6,
        orderBy: { createdAt: "desc" },
        include: { category: true },
      }),
      getTestimonialsCached(locale),
      getClientLogosCached(),
      prisma.blogPost.findMany({
        where: { status: "PUBLISHED" },
        orderBy: { publishedAt: "desc" },
        take: 3,
        include: { category: true },
      }),
      getHomeStatsCached(),
    ]);

  const content = (key: string, fallback = "") =>
    contents.find((entry) => entry.key === key)?.value ?? fallback;

  const title = content("hero_title", t.home.title);
  const subtitle = content("hero_subtitle", t.home.lead);
  const eyebrow = content("hero_eyebrow", format(t.home.eyebrow, { year: siteConfig.foundedYear }));
  const processSteps = getJsonContent(contents, "home_process", t.home.processSteps);

  const stats = (Array.isArray(statSetting?.value) ? statSetting?.value : siteConfig.stats) as {
    key: string;
    value: number;
    suffix?: string;
    label: { id: string; en: string } | string;
  }[];

  const order = sectionRows.filter((section) => section.isActive).map((section) => section.key);
  const sectionOrder = order.length > 0 ? order : defaultOrder;

  const testimonialItems =
    testimonials.length > 0
      ? testimonials.map((item) => ({
          id: item.id,
          name: item.name,
          role: item.role,
          company: item.company,
          quote: item.quote,
          rating: item.rating,
        }))
      : fallbackTestimonials;

  const logoItems =
    clientLogos.length > 0
      ? clientLogos.map((logo) => ({ name: logo.name, logoUrl: logo.logoUrl }))
      : t.home.clientsFallback.map((name) => ({ name, logoUrl: null }));

  const sectionMap: Record<string, React.ReactNode> = {
    hero: (
      <section key="hero" className="relative overflow-hidden surface-industrial text-white -mt-[68px] lg:-mt-[104px] pt-[68px] lg:pt-[104px]">
        <div className="pattern-grid pointer-events-none absolute inset-0" aria-hidden />
        <div className="pointer-events-none absolute -right-40 top-0 h-[520px] w-[520px] rounded-full bg-accent/10 blur-3xl" aria-hidden />
        <div className="noise pointer-events-none absolute inset-0" aria-hidden />

        <div className="container-bleed relative grid items-start gap-12 pb-16 pt-12 md:pb-24 md:pt-16 lg:grid-cols-12 lg:gap-8 xl:gap-12">
          <div className="lg:col-span-5 xl:col-span-5">
            <Reveal>
              <p className="eyebrow eyebrow-dark">
                <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden />
                {eyebrow}
              </p>
            </Reveal>
            <Reveal delay={0.06}>
              <h1 className="mt-5 font-display text-display-xl text-white">{title}</h1>
            </Reveal>
            <Reveal delay={0.12}>
              <p className="mt-6 max-w-xl text-base leading-relaxed text-white/70 md:text-lg">{subtitle}</p>
            </Reveal>

            <Reveal delay={0.18}>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <ButtonLink href="/quote" size="lg" iconRight={<ArrowRight className="h-4 w-4" aria-hidden />}>
                  {t.common.quote}
                </ButtonLink>
                <ButtonLink href="/e-catalog" variant="outlineLight" size="lg">
                  {t.common.catalog}
                </ButtonLink>
              </div>
            </Reveal>

            <Reveal delay={0.24}>
              <ul className="mt-8 flex flex-wrap gap-x-5 gap-y-2.5">
                {t.home.trustChipsFallback.map((chip) => (
                  <li key={chip} className="inline-flex items-center gap-1.5 text-xs text-white/65">
                    <Check className="h-3.5 w-3.5 text-accent" aria-hidden />
                    {chip}
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal delay={0.3}>
              <div className="mt-10 flex items-center gap-3 border-t border-white/10 pt-6">
                <div className="flex -space-x-2">
                  {["KN", "AP", "FG"].map((initials) => (
                    <span
                      key={initials}
                      className="flex h-8 w-8 items-center justify-center rounded-full border border-primary bg-white/10 font-mono text-[0.55rem] font-semibold text-white/70 backdrop-blur"
                    >
                      {initials}
                    </span>
                  ))}
                </div>
                <p className="text-xs text-white/60">
                  {t.home.heroNote} · <span className="text-white/85">480+</span>
                </p>
              </div>
            </Reveal>
          </div>

          <div className="lg:col-span-7 xl:col-span-7">
            <Reveal delay={0.15} y={0}>
              <HeroVisual
                labels={t.home.heroCardLabels}
                images={{
                  emblem: "/images/hero/hero-showcase.jpg",
                  soft: "/images/products/cat-soft-emblems.jpg",
                  sticker: "/images/products/cat-stickers.jpg",
                }}
              />
            </Reveal>
          </div>
        </div>

        <div className="relative border-t border-white/10">
          <div className="container-bleed flex items-center justify-between gap-4 py-4 text-[0.65rem] uppercase tracking-[0.18em] text-white/50">
            <span className="inline-flex items-center gap-2">
              <Factory className="h-3.5 w-3.5 text-accent" aria-hidden />
              Cikarang · Jawa Barat
            </span>
            <span className="hidden sm:inline">Sticker · Graphic · Emblem · Soft Emblem</span>
            <span className="inline-flex items-center gap-2">
              <ShieldCheck className="h-3.5 w-3.5 text-accent" aria-hidden />
              ISO 9001:2015
            </span>
          </div>
        </div>
      </section>
    ),

    trust: (
      <section key="trust" className="relative overflow-hidden border-b border-surface-200/80 bg-white py-8">
        <div className="pattern-dots-light pointer-events-none absolute inset-0 opacity-40" aria-hidden />
        <div className="container-site relative">
          <p className="text-center text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-neutral-400">
            {t.common.trustedBy} BUMN · Automotive · Apparel · FMCG
          </p>
          <Marquee className="mt-5" ariaLabel={t.common.trustedBy}>
            {logoItems.map((logo) => (
              <span
                key={logo.name}
                className="mx-6 inline-flex h-9 w-32 items-center justify-center sm:mx-9"
              >
                {logo.logoUrl ? (
                  <span className="relative h-8 w-full opacity-65 grayscale transition duration-300 hover:opacity-100 hover:grayscale-0">
                    <Image src={logo.logoUrl} alt={logo.name} fill sizes="128px" className="object-contain" />
                  </span>
                ) : (
                  <span className="whitespace-nowrap font-display text-base font-bold uppercase tracking-[0.12em] text-primary/35 transition hover:text-accent sm:text-lg">
                    {logo.name}
                  </span>
                )}
              </span>
            ))}
          </Marquee>
        </div>
      </section>
    ),

    categories: (
      <section key="categories" className="section texture-fabric-linen relative overflow-hidden border-b border-surface-200/70">
        <div className="pattern-linen pointer-events-none absolute inset-0 opacity-70" aria-hidden />
        <div className="pointer-events-none absolute -right-32 top-10 h-96 w-96 rounded-full bg-accent/5 blur-3xl" aria-hidden />
        <div className="container-site relative">
          <Reveal>
            <SectionHeader
              eyebrow={t.home.categoriesEyebrow}
              title={t.home.categoriesTitle}
              lead={t.home.categoriesLead}
              action={
                <ButtonLink href="/products" variant="outline" iconRight={<ArrowUpRight className="h-4 w-4" aria-hidden />}>
                  {t.common.viewAll}
                </ButtonLink>
              }
            />
          </Reveal>

          <div className="mt-10 grid gap-3 md:grid-cols-12 md:grid-rows-[230px_230px]">
            {categories.map((category, index) => {
              const fallback = productCategoriesFallback.find((item) => item.slug === category.slug);
              const description = fallback?.description[locale] ?? category.name;
              const image = categoryCovers[category.slug] ?? category.products[0]?.images[0]?.url;
              const isLead = index === 0;
              return (
                <Reveal
                  key={category.id}
                  delay={index * 0.05}
                  className={cn(
                    "md:row-span-2",
                    isLead ? "md:col-span-6" : index === 1 ? "md:col-span-6" : "md:col-span-3",
                    !isLead && "md:row-span-1",
                  )}
                >
                  <Link
                    href={`/products?cat=${category.slug}`}
                    className="group relative flex h-full min-h-[230px] overflow-hidden rounded-lg border border-surface-200 bg-primary shadow-e1 transition-all duration-300 hover:-translate-y-1 hover:shadow-e3"
                  >
                    <Visual
                      src={image}
                      alt={category.name}
                      label={category.name}
                      category={category.slug}
                      sizes={isLead ? "(max-width: 768px) 100vw, 50vw" : "(max-width: 768px) 100vw, 25vw"}
                      className="absolute inset-0 h-full w-full"
                      showLabel={false}
                      showMeta={false}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/45 to-primary/5" />
                    <div className="relative z-10 flex w-full flex-col justify-between p-5 sm:p-6">
                      <div className="flex items-start justify-between">
                        <Badge tone="dark" className="border-white/15 bg-white/10 text-white/80 backdrop-blur">
                          {format(t.home.productsCount, { count: category._count.products })}
                        </Badge>
                        <span className="flex h-8 w-8 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white transition group-hover:border-accent group-hover:bg-accent group-hover:text-primary">
                          <ArrowUpRight className="h-4 w-4" aria-hidden />
                        </span>
                      </div>
                      <div>
                        <h3 className={cn("font-display font-bold text-white", isLead ? "text-2xl sm:text-3xl" : "text-lg")}>
                          {category.name}
                        </h3>
                        <p className="mt-1.5 line-clamp-2 max-w-md text-xs leading-relaxed text-white/55 sm:text-sm">
                          {description}
                        </p>
                      </div>
                    </div>
                  </Link>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>
    ),

    stats: (
      <section key="stats" className="relative overflow-hidden surface-industrial py-14 text-white md:py-20">
        <div className="pattern-grid pointer-events-none absolute inset-0 opacity-60" aria-hidden />
        <div className="container-site relative">
          <div className="grid gap-8 lg:grid-cols-12 lg:items-center">
            <Reveal className="lg:col-span-4">
              <p className="eyebrow eyebrow-dark">{t.home.statsEyebrow}</p>
              <h2 className="mt-4 font-display text-display-sm text-white">{t.home.statsTitle}</h2>
              <p className="mt-3 text-sm leading-relaxed text-white/50">{t.home.statsLead}</p>
            </Reveal>
            <div className="grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-white/10 bg-white/10 sm:grid-cols-4 lg:col-span-8">
              {stats.map((stat) => {
                const label = typeof stat.label === "string" ? stat.label : stat.label[locale] ?? stat.label.id;
                const decimals = String(stat.value).includes(".") ? 1 : 0;
                return (
                  <div key={stat.key} className="bg-primary/60 px-4 py-6 text-center backdrop-blur sm:px-5 sm:py-8">
                    <p className="font-display text-3xl font-extrabold text-accent sm:text-4xl">
                      <Counter value={stat.value} suffix={stat.suffix ?? ""} decimals={decimals} />
                    </p>
                    <p className="mt-2 text-[0.68rem] font-medium uppercase tracking-[0.14em] text-white/60">{label}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    ),

    process: (
      <section key="process" className="section bg-white relative overflow-hidden border-b border-surface-200/70">
        <div className="pattern-linen pointer-events-none absolute inset-0 opacity-70" aria-hidden />
        <div className="pointer-events-none absolute -left-20 top-20 h-96 w-96 rounded-full bg-secondary/5 blur-3xl" aria-hidden />
        <div className="container-site relative">
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-5">
              <Reveal>
                <SectionHeader eyebrow={t.home.processEyebrow} title={t.home.processTitle} lead={t.home.processLead} />
                <div className="mt-8 overflow-hidden rounded-lg border border-surface-200 bg-white shadow-e1">
                  <Visual
                    src="/images/facility/printing-machine.jpg"
                    category="graphics"
                    alt={t.home.processTitle}
                    label={t.home.processImageCaption}
                    ratio="video"
                    sizes="(max-width: 1024px) 100vw, 40vw"
                    showLabel={false}
                  />
                  <div className="flex items-center gap-2 px-4 py-3 text-[0.68rem] text-neutral-500">
                    <Ruler className="h-3.5 w-3.5 text-accent-700" aria-hidden />
                    {t.home.processImageCaption}
                  </div>
                </div>
              </Reveal>
            </div>

            <div className="lg:col-span-7">
              <ol className="relative space-y-0">
                <span className="absolute left-[19px] top-3 bottom-3 w-px bg-surface-300" aria-hidden />
                {processSteps.map((step, index) => (
                  <Reveal key={step.title} as="li" delay={index * 0.06} className="relative flex gap-5 pb-8 last:pb-0">
                    <span className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-surface-300 bg-white font-mono text-xs font-semibold text-accent-700 shadow-e1">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <div className="pt-1">
                      <h3 className="font-display text-lg font-bold text-primary">{step.title}</h3>
                      <p className="mt-1 text-sm leading-relaxed text-neutral-600">{step.desc}</p>
                    </div>
                  </Reveal>
                ))}
              </ol>
              <Reveal delay={0.3} className="mt-2 pl-[60px]">
                <ButtonLink href="/services" variant="outline" iconRight={<ArrowRight className="h-4 w-4" aria-hidden />}>
                  {locale === "en" ? "See capabilities" : "Lihat kapabilitas"}
                </ButtonLink>
              </Reveal>
            </div>
          </div>
        </div>
      </section>
    ),

    featured: (
      <section key="featured" className="section texture-subtle relative overflow-hidden border-b border-surface-200/70">
        <div className="pattern-dots-light pointer-events-none absolute inset-0 opacity-75" aria-hidden />
        <div className="pointer-events-none absolute -right-24 top-0 h-96 w-96 rounded-full bg-accent/5 blur-3xl" aria-hidden />
        <div className="container-site relative">
          <Reveal>
            <SectionHeader
              eyebrow={t.home.featuredEyebrow}
              title={t.home.featuredTitle}
              lead={t.home.featuredLead}
              action={
                <ButtonLink href="/products" variant="outline" iconRight={<ArrowRight className="h-4 w-4" aria-hidden />}>
                  {t.common.viewAll}
                </ButtonLink>
              }
            />
          </Reveal>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((product, index) => (
              <Reveal key={product.id} delay={index * 0.05}>
                <ProductCard
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
                    isCustom: true,
                  }}
                />
              </Reveal>
            ))}
            {products.length === 0 && (
              <p className="col-span-full rounded-lg border border-dashed border-surface-300 p-10 text-center text-sm text-neutral-500">
                {t.products.emptyLead}
              </p>
            )}
          </div>
        </div>
      </section>
    ),

    portfolio: (
      <section key="portfolio" className="section texture-subtle-alt relative overflow-hidden border-b border-surface-200/70">
        <div className="pattern-technical pointer-events-none absolute inset-0 opacity-70" aria-hidden />
        <div className="pointer-events-none absolute -left-32 bottom-0 h-96 w-96 rounded-full bg-secondary/5 blur-3xl" aria-hidden />
        <div className="container-site relative">
          <Reveal>
            <SectionHeader
              eyebrow={t.home.portfolioEyebrow}
              title={t.home.portfolioTitle}
              lead={t.home.portfolioLead}
              action={
                <ButtonLink href="/portfolio" variant="outline" iconRight={<ArrowUpRight className="h-4 w-4" aria-hidden />}>
                  {t.common.viewAll}
                </ButtonLink>
              }
            />
          </Reveal>
          <Reveal delay={0.08} className="mt-8">
            <PortfolioGrid
              items={portfolios.map((item) => ({
                id: item.id,
                title: item.title,
                slug: item.slug,
                description: item.description,
                client: item.client,
                technique: item.technique,
                images: item.images,
                category: item.category,
              }))}
              allLabel={t.portfolio.filterAll}
              emptyLabel={t.portfolio.empty}
            />
          </Reveal>
        </div>
      </section>
    ),

    testimonials: (
      <section key="testimonials" className="section texture-fabric-linen relative overflow-hidden border-b border-surface-200/70">
        <div className="pattern-linen pointer-events-none absolute inset-0 opacity-70" aria-hidden />
        <div className="pointer-events-none absolute right-1/4 top-10 h-80 w-80 rounded-full bg-accent/5 blur-3xl" aria-hidden />
        <div className="container-site relative grid gap-10 lg:grid-cols-12 lg:items-center">
          <Reveal className="lg:col-span-5">
            <SectionHeader eyebrow={t.home.testimonialsEyebrow} title={t.home.testimonialsTitle} lead={t.home.testimonialsLead} />
            <div className="mt-8 flex items-center gap-4 border-t border-surface-200 pt-6">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-accent-50 text-accent-700">
                <Sparkles className="h-5 w-5" aria-hidden />
              </span>
              <div>
                <p className="font-display text-2xl font-extrabold text-primary">
                  <Counter value={4.9} decimals={1} />
                  <span className="ml-1 text-sm font-semibold text-neutral-400">/ 5</span>
                </p>
                <p className="text-xs text-neutral-500">{locale === "en" ? "Average client rating" : "Rata-rata penilaian klien"}</p>
              </div>
            </div>
          </Reveal>
          <Reveal delay={0.1} className="lg:col-span-7">
            <TestimonialCarousel items={testimonialItems} />
          </Reveal>
        </div>
      </section>
    ),

    articles: (
      <section key="articles" className="section bg-white relative overflow-hidden border-b border-surface-200/70">
        <div className="pattern-linen pointer-events-none absolute inset-0 opacity-70" aria-hidden />
        <div className="container-site relative">
          <Reveal>
            <SectionHeader
              eyebrow={t.home.articlesEyebrow}
              title={t.home.articlesTitle}
              lead={t.home.articlesLead}
              action={
                <ButtonLink href="/blog" variant="outline" iconRight={<ArrowRight className="h-4 w-4" aria-hidden />}>
                  {t.common.viewAll}
                </ButtonLink>
              }
            />
          </Reveal>

          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {posts.map((post, index) => (
              <Reveal key={post.id} delay={index * 0.06}>
                <Link
                  href={`/blog/${post.slug}`}
                  className="group flex h-full flex-col overflow-hidden rounded-lg border border-surface-200 bg-white shadow-e1 transition-all duration-300 hover:-translate-y-1 hover:shadow-e3"
                >
                  <Visual
                    src={post.featuredImage}
                    alt={post.title}
                    label={post.title}
                    category="graphics"
                    ratio="video"
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="rounded-none"
                    showLabel={false}
                    showMeta={false}
                  />
                  <div className="flex flex-1 flex-col p-5">
                    <div className="flex items-center gap-3 text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-neutral-400">
                      {post.category && <span className="text-accent-700">{post.category.name}</span>}
                      <span>{formatDate(post.publishedAt, locale === "en" ? "en-US" : "id-ID")}</span>
                    </div>
                    <h3 className="mt-3 font-display text-lg font-bold leading-snug text-primary transition group-hover:text-accent-700">
                      {post.title}
                    </h3>
                    <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-neutral-600">
                      {post.content.replace(/<[^>]+>/g, " ").slice(0, 140)}…
                    </p>
                    <div className="mt-auto flex items-center justify-between pt-5 text-xs text-neutral-400">
                      <span>{format(t.blog.minuteRead, { minutes: readingTime(post.content) })}</span>
                      <ArrowUpRight className="h-4 w-4 transition group-hover:text-accent-700" aria-hidden />
                    </div>
                  </div>
                </Link>
              </Reveal>
            ))}
            {posts.length === 0 && (
              <p className="col-span-full rounded-lg border border-dashed border-surface-300 p-10 text-center text-sm text-neutral-500">
                {t.blog.empty}
              </p>
            )}
          </div>
        </div>
      </section>
    ),

    cta: (
      <section key="cta" className="section texture-fabric-linen relative overflow-hidden">
        <div className="pattern-linen pointer-events-none absolute inset-0 opacity-65" aria-hidden />
        <div className="container-site relative">
          <Reveal>
            <div className="panel-industrial px-6 py-12 shadow-e3 sm:px-10 md:px-14 md:py-16">
              <div className="noise pointer-events-none absolute inset-0" aria-hidden />
              <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-accent/20 blur-3xl" aria-hidden />
              <div className="pattern-grid pointer-events-none absolute inset-0 opacity-70" aria-hidden />
              <div className="relative grid gap-8 lg:grid-cols-12 lg:items-center">
                <div className="lg:col-span-8">
                  <p className="eyebrow eyebrow-dark">
                    <BadgeCheck className="h-3.5 w-3.5" aria-hidden />
                    {t.home.ctaNote}
                  </p>
                  <h2 className="mt-4 font-display text-display-md text-white">{t.home.ctaTitle}</h2>
                  <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/70 md:text-base">{t.home.ctaLead}</p>
                </div>
                <div className="flex flex-col gap-3 lg:col-span-4">
                  <ButtonLink href="/quote" size="lg" iconRight={<ArrowRight className="h-4 w-4" aria-hidden />}>
                    {t.common.quote}
                  </ButtonLink>
                  <ButtonLink href="/contact" variant="outlineLight" size="lg">
                    {t.common.contactSales}
                  </ButtonLink>
                  <a
                    href={`tel:${siteConfig.phoneHref}`}
                    className="mt-1 text-center font-mono text-xs text-white/60 transition hover:text-accent"
                  >
                    {siteConfig.phone}
                  </a>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    ),
  };

  return (
    <>
      {sectionOrder.map((key) => sectionMap[key] ?? null)}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              {
                "@type": "Question",
                name: locale === "en" ? "What is the minimum order?" : "Berapa minimum order?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text:
                    locale === "en"
                      ? "MOQ starts from 30 pcs depending on the product and material."
                      : "MOQ mulai dari 30 pcs tergantung produk dan material.",
                },
              },
            ],
          }),
        }}
      />
    </>
  );
}
