import type { Metadata } from "next";
import { ArrowRight, MessageCircle } from "lucide-react";
import { getLocale } from "@/lib/i18n/locale";
import { getMessages } from "@/i18n";
import { PageHero } from "@/components/public/PageHero";
import { Accordion } from "@/components/ui/Accordion";
import { ButtonLink } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { getFaqsCached } from "@/services/content.service";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = getMessages(locale);
  return {
    title: t.faq.eyebrow,
    description: t.faq.lead,
    alternates: { canonical: "/faq" },
  };
}

export default async function FaqPage() {
  const locale = await getLocale();
  const t = getMessages(locale);
  const faqs = await getFaqsCached(locale);

  const groups = Array.from(
    faqs.reduce((map, faq) => {
      const key = faq.category ?? "Umum";
      const list = map.get(key) ?? [];
      list.push(faq);
      map.set(key, list);
      return map;
    }, new Map<string, typeof faqs>()),
  );

  return (
    <>
      <PageHero
        crumbs={[{ label: t.common.home, href: "/" }, { label: t.faq.eyebrow }]}
        eyebrow={t.faq.eyebrow}
        title={t.faq.title}
        lead={t.faq.lead}
        action={
          <ButtonLink href="/contact" iconRight={<ArrowRight className="h-4 w-4" aria-hidden />}>
            {t.faq.cta}
          </ButtonLink>
        }
      />

      <section className="container-site py-10 md:py-14">
        {faqs.length === 0 ? (
          <EmptyState title={t.faq.empty} description={t.faq.lead} action={<ButtonLink href="/contact">{t.faq.cta}</ButtonLink>} />
        ) : (
          <div className="mx-auto max-w-3xl space-y-8">
            {groups.map(([category, items]) => (
              <div key={category}>
                <h2 className="mb-3 font-display text-sm font-bold uppercase tracking-[0.14em] text-accent-700">
                  {category}
                </h2>
                <Accordion items={items.map((faq) => ({ id: faq.id, question: faq.question, answer: faq.answer }))} />
              </div>
            ))}

            <div className="rounded-lg bg-grad-steel p-6 text-white">
              <h2 className="font-display text-lg font-bold">{t.faq.lead}</h2>
              <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                <ButtonLink href="/contact" size="sm">
                  <MessageCircle className="h-3.5 w-3.5" aria-hidden />
                  {t.faq.cta}
                </ButtonLink>
                <ButtonLink href="/quote" variant="outlineLight" size="sm">
                  {t.common.quote}
                </ButtonLink>
              </div>
            </div>
          </div>
        )}
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqs.map((faq) => ({
              "@type": "Question",
              name: faq.question,
              acceptedAnswer: { "@type": "Answer", text: faq.answer },
            })),
          }),
        }}
      />
    </>
  );
}
