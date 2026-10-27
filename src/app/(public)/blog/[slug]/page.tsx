import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, CalendarDays, Clock, User } from "lucide-react";
import { prisma } from "@/lib/db/prisma";
import { getLocale } from "@/lib/i18n/locale";
import { format, getMessages } from "@/i18n";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Visual } from "@/components/public/Visual";
import { Badge } from "@/components/ui/Badge";
import { ButtonLink } from "@/components/ui/Button";
import { ShareButtons } from "@/components/public/ShareButtons";
import { articleJsonLd, breadcrumbJsonLd, jsonLdScript } from "@/lib/seo/structured-data";
import { formatDate, readingTime, slugify } from "@/lib/utils/format";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await prisma.blogPost.findUnique({ where: { slug } });
  if (!post) return { title: "Artikel" };
  return {
    title: post.seoTitle ?? post.title,
    description: post.seoDescription ?? post.content.replace(/<[^>]+>/g, " ").slice(0, 160),
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.seoDescription ?? post.content.replace(/<[^>]+>/g, " ").slice(0, 160),
      publishedTime: post.publishedAt?.toISOString(),
      images: post.featuredImage ? [{ url: post.featuredImage }] : undefined,
    },
  };
}

function buildArticle(content: string) {
  const headings: { id: string; text: string; level: number }[] = [];
  const html = content.replace(/<(h2|h3)([^>]*)>([\s\S]*?)<\/\1>/gi, (match, tag, attrs, inner) => {
    const text = String(inner).replace(/<[^>]+>/g, "").trim();
    if (!text) return match;
    const id = slugify(text) || `section-${headings.length + 1}`;
    headings.push({ id, text, level: tag === "h2" ? 2 : 3 });
    return `<${tag}${attrs} id="${id}">${inner}</${tag}>`;
  });
  return { html, headings };
}

export default async function BlogDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const locale = await getLocale();
  const t = getMessages(locale);

  const post = await prisma.blogPost.findUnique({
    where: { slug },
    include: { category: true, author: { select: { name: true } } },
  });
  if (!post || post.status !== "PUBLISHED") notFound();

  const related = await prisma.blogPost.findMany({
    where: {
      status: "PUBLISHED",
      NOT: { id: post.id },
      ...(post.categoryId ? { categoryId: post.categoryId } : {}),
    },
    take: 3,
    orderBy: { publishedAt: "desc" },
  });

  const { html, headings } = buildArticle(post.content);

  return (
    <>
      <div className="surface-industrial border-b border-white/10 text-white">
        <div className="container-site relative py-4">
          <Breadcrumb
            className="text-white/55 [&_[aria-current=page]]:text-white [&_a:hover]:text-accent [&_svg]:text-white/30"
            items={[
              { label: t.common.home, href: "/" },
              { label: t.nav.blog, href: "/blog" },
              { label: post.title },
            ]}
          />
        </div>
      </div>

      <article>
        <header className="relative overflow-hidden border-b border-surface-200 bg-surface">
          <div className="pattern-grid-light pointer-events-none absolute inset-0 opacity-70" aria-hidden />
          <div className="container-site relative py-10 md:py-14">
            <div className="mx-auto max-w-3xl">
              <div className="flex flex-wrap items-center gap-2">
                {post.category && <Badge tone="gold">{post.category.name}</Badge>}
                <Badge tone="outline">{t.blog.eyebrow}</Badge>
              </div>
              <h1 className="mt-4 font-display text-display-md text-primary">{post.title}</h1>
              <p className="mt-4 text-base leading-relaxed text-neutral-600">
                {post.content.replace(/<[^>]+>/g, " ").slice(0, 220)}…
              </p>
              <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-surface-300/60 pt-4">
                <div className="flex flex-wrap items-center gap-4 text-[0.68rem] text-neutral-500">
                  <span className="inline-flex items-center gap-1.5">
                    <CalendarDays className="h-3.5 w-3.5 text-accent-700" aria-hidden />
                    {formatDate(post.publishedAt, locale === "en" ? "en-US" : "id-ID")}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 text-accent-700" aria-hidden />
                    {format(t.blog.minuteRead, { minutes: readingTime(post.content) })}
                  </span>
                  {post.author?.name && (
                    <span className="inline-flex items-center gap-1.5">
                      <User className="h-3.5 w-3.5 text-accent-700" aria-hidden />
                      {post.author.name}
                    </span>
                  )}
                </div>
                <ShareButtons title={post.title} path={`/blog/${post.slug}`} />
              </div>
            </div>
          </div>
        </header>

        <div className="container-site py-10 md:py-14">
          <div className="mx-auto grid max-w-5xl gap-10 lg:grid-cols-12">
            <div className="lg:col-span-8">
              <div className="overflow-hidden rounded-lg border border-surface-200">
                <Visual
                  src={post.featuredImage}
                  alt={post.title}
                  label={post.title}
                  category="graphics"
                  ratio="wide"
                  sizes="(max-width: 1024px) 100vw, 66vw"
                  priority
                  className="rounded-none"
                  showLabel={false}
                  showMeta={false}
                />
              </div>

              <div className="article-content mt-8" dangerouslySetInnerHTML={{ __html: html }} />

              {post.tags.length > 0 && (
                <div className="mt-8 flex flex-wrap gap-2 border-t border-surface-200 pt-5">
                  {post.tags.map((tag) => (
                    <Badge key={tag} tone="outline">
                      #{tag}
                    </Badge>
                  ))}
                </div>
              )}

              <div className="panel-industrial mt-10 p-6 sm:p-8">
                <h2 className="relative font-display text-xl font-bold">{t.blog.ctaTitle}</h2>
                <p className="relative mt-1.5 text-sm text-white/70">{t.about.lead}</p>
                <ButtonLink href="/quote" className="mt-4" iconRight={<ArrowRight className="h-4 w-4" aria-hidden />}>
                  {t.blog.ctaCta}
                </ButtonLink>
              </div>
            </div>

            <aside className="lg:col-span-4">
              <div className="lg:sticky lg:top-28">
                {headings.length > 0 && (
                  <div className="rounded-lg border border-surface-200 bg-white p-5">
                    <p className="text-[0.62rem] font-bold uppercase tracking-[0.14em] text-neutral-400">{t.blog.toc}</p>
                    <ol className="mt-3 space-y-2 text-xs">
                      {headings.map((heading) => (
                        <li key={heading.id} className={heading.level === 3 ? "pl-3" : ""}>
                          <a href={`#${heading.id}`} className="text-neutral-600 transition hover:text-accent-700">
                            {heading.text}
                          </a>
                        </li>
                      ))}
                    </ol>
                  </div>
                )}

                <div className="mt-4 rounded-lg border border-surface-200 bg-surface p-5">
                  <p className="font-display text-sm font-bold text-primary">{t.common.quote}</p>
                  <p className="mt-1.5 text-xs leading-relaxed text-neutral-500">{t.quote.lead}</p>
                  <ButtonLink href="/quote" variant="outline" size="sm" className="mt-3 w-full">
                    {t.common.quote}
                  </ButtonLink>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </article>

      {related.length > 0 && (
        <section className="border-t border-surface-200 bg-surface py-14">
          <div className="container-site">
            <div className="flex items-end justify-between">
              <h2 className="font-display text-2xl font-bold text-primary">{t.blog.related}</h2>
              <Link href="/blog" className="btn-link text-xs">
                {t.blog.all} <ArrowRight className="h-3 w-3" aria-hidden />
              </Link>
            </div>
            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              {related.map((item) => (
                <Link
                  key={item.id}
                  href={`/blog/${item.slug}`}
                  className="group overflow-hidden rounded-lg border border-surface-200 bg-white shadow-e1 transition hover:-translate-y-1 hover:shadow-e3"
                >
                  <Visual
                    src={item.featuredImage}
                    alt={item.title}
                    label={item.title}
                    category="stickers"
                    ratio="video"
                    sizes="33vw"
                    className="rounded-none"
                    showLabel={false}
                    showMeta={false}
                  />
                  <div className="p-4">
                    <p className="text-[0.6rem] text-neutral-400">
                      {formatDate(item.publishedAt, locale === "en" ? "en-US" : "id-ID")}
                    </p>
                    <h3 className="mt-1.5 font-display text-base font-bold leading-snug text-primary transition group-hover:text-accent-700">
                      {item.title}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLdScript(
          articleJsonLd({
            title: post.title,
            slug: post.slug,
            content: post.content,
            image: post.featuredImage,
            publishedAt: post.publishedAt,
            author: post.author?.name,
          }),
        )}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLdScript(
          breadcrumbJsonLd([
            { name: t.common.home, url: "/" },
            { name: t.nav.blog, url: "/blog" },
            { name: post.title, url: `/blog/${post.slug}` },
          ]),
        )}
      />
    </>
  );
}
