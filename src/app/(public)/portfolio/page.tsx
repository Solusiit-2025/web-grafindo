import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { prisma } from "@/lib/db/prisma";
import { getLocale } from "@/lib/i18n/locale";
import { getMessages } from "@/i18n";
import { PageHero } from "@/components/public/PageHero";
import { PortfolioGrid } from "@/components/public/PortfolioGrid";
import { ButtonLink } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = getMessages(locale);
  return {
    title: t.portfolio.eyebrow,
    description: t.portfolio.lead,
    alternates: { canonical: "/portfolio" },
  };
}

export default async function PortfolioPage() {
  const locale = await getLocale();
  const t = getMessages(locale);

  const items = await prisma.portfolio.findMany({
    orderBy: { createdAt: "desc" },
    include: { category: true },
  });

  const clients = new Set(items.map((item) => item.client).filter(Boolean));

  return (
    <>
      <PageHero
        crumbs={[{ label: t.common.home, href: "/" }, { label: t.nav.portfolio }]}
        eyebrow={t.portfolio.eyebrow}
        title={t.portfolio.title}
        lead={t.portfolio.lead}
        texture="silk"
        meta={
          <div className="flex flex-wrap gap-2">
            <Badge tone="onDark">{items.length} proyek</Badge>
            <Badge tone="gold">{clients.size} klien</Badge>
          </div>
        }
        action={
          <ButtonLink href="/quote" iconRight={<ArrowRight className="h-4 w-4" aria-hidden />}>
            {t.portfolio.ctaCta}
          </ButtonLink>
        }
      />

      <section className="texture-fabric-silk relative overflow-hidden py-10 md:py-14">
        <div className="pattern-silk pointer-events-none absolute inset-0 opacity-70" aria-hidden />
        <div className="container-site relative">
        <PortfolioGrid
          items={items.map((item) => ({
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

        <div className="panel-industrial mt-14 p-7 text-center sm:p-10">
          <div className="pattern-grid pointer-events-none absolute inset-0 opacity-60" aria-hidden />
          <div className="relative">
            <h2 className="font-display text-2xl font-bold md:text-3xl">{t.portfolio.ctaTitle}</h2>
            <p className="mx-auto mt-3 max-w-lg text-sm text-white/70">
              {locale === "en"
                ? "Send us a brief and reference. We'll recommend the right material and technique."
                : "Kirim brief dan referensi Anda. Kami rekomendasikan material serta teknik yang tepat."}
            </p>
            <ButtonLink href="/quote" className="mt-6" iconRight={<ArrowRight className="h-4 w-4" aria-hidden />}>
              {t.portfolio.ctaCta}
            </ButtonLink>
          </div>
        </div>
        </div>
      </section>
    </>
  );
}
