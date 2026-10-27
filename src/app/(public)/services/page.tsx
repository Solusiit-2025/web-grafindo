import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Boxes, Check, FlaskConical, PenTool, Factory, ShieldCheck } from "lucide-react";
import { getLocale } from "@/lib/i18n/locale";
import { getMessages } from "@/i18n";
import { PageHero } from "@/components/public/PageHero";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { ButtonLink } from "@/components/ui/Button";
import { Visual } from "@/components/public/Visual";
import { Accordion } from "@/components/ui/Accordion";
import { Reveal } from "@/components/motion/Reveal";
import { getJsonContent } from "@/lib/content";
import { getFaqsCached, getSiteContentCached } from "@/services/content.service";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = getMessages(locale);
  return {
    title: t.nav.services,
    description: t.services.lead,
    alternates: { canonical: "/services" },
  };
}

const icons = [PenTool, Factory, Boxes, FlaskConical];
const categories = ["stickers", "graphics", "emblems", "soft-emblems"];
const serviceImages = [
  "/images/products/cat-stickers.jpg",
  "/images/facility/printing-machine.jpg",
  "/images/products/cat-emblems.jpg",
  "/images/products/cat-soft-emblems.jpg",
];

export default async function ServicesPage() {
  const locale = await getLocale();
  const t = getMessages(locale);
  const [allFaqs, contents] = await Promise.all([
    getFaqsCached(locale),
    getSiteContentCached(locale),
  ]);
  const faqs = allFaqs.slice(0, 5);

  const serviceItems = getJsonContent(contents, "services_items", t.services.items);
  const whyItems = getJsonContent(contents, "services_why", t.services.why);
  const processSteps = getJsonContent(contents, "home_process", t.home.processSteps);

  return (
    <>
      <PageHero
        crumbs={[{ label: t.common.home, href: "/" }, { label: t.nav.services }]}
        eyebrow={t.services.eyebrow}
        title={t.services.title}
        lead={t.services.lead}
        texture="twill"
        action={
          <ButtonLink href="/quote" iconRight={<ArrowRight className="h-4 w-4" aria-hidden />}>
            {t.services.ctaCta}
          </ButtonLink>
        }
      />

      <div className="texture-fabric-twill relative overflow-hidden">
        <div className="pattern-twill pointer-events-none absolute inset-0 opacity-70" aria-hidden />
        <section className="container-site section relative">
        <div className="grid gap-4 md:grid-cols-2">
          {serviceItems.map((item, index) => {
            const Icon = icons[index] ?? PenTool;
            return (
              <Reveal key={item.title} delay={index * 0.06}>
                <article className="group card card-hover flex h-full flex-col overflow-hidden">
                  <div className="relative">
                    <Visual
                      src={serviceImages[index]}
                      category={categories[index]}
                      alt={item.title}
                      label={item.title}
                      ratio="wide"
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="rounded-none"
                      showLabel={false}
                    />
                    <span className="absolute left-4 top-4 flex h-10 w-10 items-center justify-center rounded-md bg-accent text-primary shadow-e2">
                      <Icon className="h-5 w-5" aria-hidden />
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <h2 className="font-display text-xl font-bold text-primary">{item.title}</h2>
                    <p className="mt-2 text-sm leading-relaxed text-neutral-600">{item.desc}</p>
                    <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                      {item.points.map((point) => (
                        <li key={point} className="flex items-center gap-2 text-xs text-neutral-500">
                          <Check className="h-3.5 w-3.5 shrink-0 text-accent-700" aria-hidden />
                          {point}
                        </li>
                      ))}
                    </ul>
                    <Link href="/quote" className="btn-link mt-5 text-xs">
                      {t.common.quote} <ArrowRight className="h-3.5 w-3.5" aria-hidden />
                    </Link>
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>
      </section>

      <section className="section border-y border-surface-200 bg-surface">
        <div className="container-site">
          <Reveal>
            <SectionHeader
              eyebrow={t.services.whyTitle}
              title={locale === "en" ? "Built for teams that need certainty." : "Dibangun untuk tim yang butuh kepastian."}
              lead={t.services.lead}
            />
          </Reveal>
          <div className="mt-9 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {whyItems.map((item, index) => (
              <Reveal key={item.title} delay={index * 0.05}>
                <div className="h-full rounded-lg border border-surface-200 bg-white p-5 shadow-e1">
                  <span className="flex h-9 w-9 items-center justify-center rounded-md bg-accent-50 text-accent-700">
                    <ShieldCheck className="h-4 w-4" aria-hidden />
                  </span>
                  <h3 className="mt-4 font-display text-base font-bold text-primary">{item.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-neutral-600">{item.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="container-site section">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <SectionHeader eyebrow={t.services.processTitle} title={t.home.processTitle} lead={t.services.processLead} />
            <ButtonLink href="/about" variant="outline" className="mt-6">
              {t.nav.about}
            </ButtonLink>
          </div>
          <div className="lg:col-span-7">
            <ol className="relative space-y-0">
              <span className="absolute bottom-3 left-[19px] top-3 w-px bg-surface-300" aria-hidden />
              {processSteps.map((step, index) => (
                <li key={step.title} className="relative flex gap-5 pb-7 last:pb-0">
                  <span className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-surface-300 bg-white font-mono text-xs font-semibold text-accent-700 shadow-e1">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div className="pt-1">
                    <h3 className="font-display text-base font-bold text-primary">{step.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-neutral-600">{step.desc}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <section className="section bg-surface">
        <div className="container-site grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <SectionHeader eyebrow={t.faq.eyebrow} title={t.services.faqTitle} lead={t.faq.lead} />
            <ButtonLink href="/faq" variant="outline" className="mt-6">
              {t.faq.eyebrow}
            </ButtonLink>
          </div>
          <div className="lg:col-span-8">
            {faqs.length > 0 ? (
              <Accordion items={faqs.map((faq) => ({ id: faq.id, question: faq.question, answer: faq.answer }))} />
            ) : (
              <p className="text-sm text-neutral-500">{t.faq.empty}</p>
            )}
          </div>
        </div>
      </section>
      </div>

      <section className="container-site section">
        <div className="panel-industrial p-8 sm:p-12">
          <div className="pattern-grid pointer-events-none absolute inset-0" aria-hidden />
          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-xl">
              <h2 className="font-display text-2xl font-bold sm:text-3xl">{t.services.ctaTitle}</h2>
              <p className="mt-2 text-sm text-white/70">{t.services.ctaLead}</p>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
              <ButtonLink href="/quote" size="lg">
                {t.services.ctaCta}
              </ButtonLink>
              <ButtonLink href="/contact" variant="outlineLight" size="lg">
                {t.common.contactSales}
              </ButtonLink>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
