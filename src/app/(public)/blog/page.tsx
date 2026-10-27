import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, CalendarDays } from "lucide-react";
import { prisma } from "@/lib/db/prisma";
import { getLocale } from "@/lib/i18n/locale";
import { format, getMessages } from "@/i18n";
import { PageHero } from "@/components/public/PageHero";
import { Visual } from "@/components/public/Visual";
import { Badge } from "@/components/ui/Badge";
import { ButtonLink } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { cn } from "@/lib/utils/cn";
import { formatDate, readingTime } from "@/lib/utils/format";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = getMessages(locale);
  return {
    title: t.nav.blog,
    description: t.blog.lead,
    alternates: { canonical: "/blog" },
  };
}

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ cat?: string }>;
}) {
  const { cat } = await searchParams;
  const locale = await getLocale();
  const t = getMessages(locale);

  const [posts, categories] = await Promise.all([
    prisma.blogPost.findMany({
      where: {
        status: "PUBLISHED",
        ...(cat ? { category: { slug: cat } } : {}),
      },
      orderBy: { publishedAt: "desc" },
      include: { category: true, author: { select: { name: true } } },
    }),
    prisma.category.findMany({ where: { type: "blog" } }),
  ]);

  const [featured, ...rest] = posts;

  return (
    <>
      <PageHero
        crumbs={[{ label: t.common.home, href: "/" }, { label: t.nav.blog }]}
        eyebrow={t.blog.eyebrow}
        title={t.blog.title}
        lead={t.blog.lead}
        texture="bookcloth"
        meta={<Badge tone="onDark">{posts.length} artikel</Badge>}
      />

      <section className="texture-fabric-bookcloth relative overflow-hidden py-10 md:py-14">
        <div className="pattern-bookcloth pointer-events-none absolute inset-0 opacity-70" aria-hidden />
        <div className="container-site relative">
          <div className="no-scrollbar flex gap-2 overflow-x-auto pb-1">
          <Link href="/blog" className={cn("chip shrink-0", !cat && "chip-active")}>
            {t.blog.all}
          </Link>
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/blog?cat=${category.slug}`}
              className={cn("chip shrink-0", cat === category.slug && "chip-active")}
            >
              {category.name}
            </Link>
          ))}
        </div>

        {posts.length === 0 ? (
          <EmptyState
            className="mt-8"
            title={t.blog.empty}
            description={t.blog.lead}
            action={<ButtonLink href="/blog" variant="outline">{t.common.reset}</ButtonLink>}
          />
        ) : (
          <>
            {featured && (
              <Link
                href={`/blog/${featured.slug}`}
                className="group mt-6 grid overflow-hidden rounded-xl border border-surface-200 bg-white shadow-e1 transition hover:shadow-e3 lg:grid-cols-12"
              >
                <div className="lg:col-span-7">
                  <Visual
                    src={featured.featuredImage}
                    alt={featured.title}
                    label={featured.title}
                    category="graphics"
                    ratio="wide"
                    sizes="(max-width: 1024px) 100vw, 58vw"
                    className="h-full rounded-none lg:aspect-auto lg:h-full"
                    showLabel={false}
                    showMeta={false}
                    priority
                  />
                </div>
                <div className="flex flex-col justify-center p-6 sm:p-8 lg:col-span-5">
                  <div className="flex flex-wrap items-center gap-3 text-[0.62rem] font-semibold uppercase tracking-[0.14em]">
                    <Badge tone="gold">{t.blog.featured}</Badge>
                    {featured.category && <span className="text-accent-700">{featured.category.name}</span>}
                  </div>
                  <h2 className="mt-3 font-display text-2xl font-extrabold leading-tight text-primary transition group-hover:text-accent-700 sm:text-3xl">
                    {featured.title}
                  </h2>
                  <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-neutral-600">
                    {featured.content.replace(/<[^>]+>/g, " ").slice(0, 220)}…
                  </p>
                  <div className="mt-5 flex flex-wrap items-center gap-3 text-[0.65rem] text-neutral-400">
                    <span className="inline-flex items-center gap-1.5">
                      <CalendarDays className="h-3.5 w-3.5" aria-hidden />
                      {formatDate(featured.publishedAt, locale === "en" ? "en-US" : "id-ID")}
                    </span>
                    <span>{format(t.blog.minuteRead, { minutes: readingTime(featured.content) })}</span>
                    {featured.author?.name && <span>· {featured.author.name}</span>}
                  </div>
                  <span className="btn-link mt-5 text-xs">
                    {t.common.readMore} <ArrowRight className="h-3.5 w-3.5" aria-hidden />
                  </span>
                </div>
              </Link>
            )}

            {rest.length > 0 && (
              <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {rest.map((post) => (
                  <Link
                    key={post.id}
                    href={`/blog/${post.slug}`}
                    className="group flex h-full flex-col overflow-hidden rounded-lg border border-surface-200 bg-white shadow-e1 transition-all duration-300 hover:-translate-y-1 hover:shadow-e3"
                  >
                    <Visual
                      src={post.featuredImage}
                      alt={post.title}
                      label={post.title}
                      category="stickers"
                      ratio="video"
                      sizes="(max-width: 640px) 100vw, 33vw"
                      className="rounded-none"
                      showLabel={false}
                      showMeta={false}
                    />
                    <div className="flex flex-1 flex-col p-5">
                      <div className="flex items-center gap-2 text-[0.6rem] font-semibold uppercase tracking-[0.12em]">
                        {post.category && <span className="text-accent-700">{post.category.name}</span>}
                        <span className="text-neutral-400">
                          {formatDate(post.publishedAt, locale === "en" ? "en-US" : "id-ID")}
                        </span>
                      </div>
                      <h3 className="mt-2.5 font-display text-lg font-bold leading-snug text-primary transition group-hover:text-accent-700">
                        {post.title}
                      </h3>
                      <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-neutral-600">
                        {post.content.replace(/<[^>]+>/g, " ").slice(0, 150)}…
                      </p>
                      <div className="mt-auto flex items-center justify-between pt-5 text-[0.65rem] text-neutral-400">
                        <span>{format(t.blog.minuteRead, { minutes: readingTime(post.content) })}</span>
                        <ArrowUpRight className="h-4 w-4 transition group-hover:text-accent-700" aria-hidden />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </>
        )}

        <div className="panel-industrial mt-12 p-6 sm:p-8">
          <div className="pattern-grid pointer-events-none absolute inset-0 opacity-60" aria-hidden />
          <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-display text-xl font-bold">{t.blog.ctaTitle}</h2>
              <p className="mt-1 text-sm text-white/70">{t.about.lead}</p>
            </div>
            <ButtonLink href="/quote" className="shrink-0">
              {t.blog.ctaCta}
            </ButtonLink>
          </div>
        </div>
        </div>
      </section>
    </>
  );
}
