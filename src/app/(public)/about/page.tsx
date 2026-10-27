import type { Metadata } from "next";
import type { LucideIcon } from "lucide-react";
import { ArrowRight, Award, Check, Compass, Factory, Gauge, MapPin, ShieldCheck, Target, Wrench } from "lucide-react";
import { getLocale } from "@/lib/i18n/locale";
import { getMessages } from "@/i18n";
import { PageHero } from "@/components/public/PageHero";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { ButtonLink } from "@/components/ui/Button";
import { Visual } from "@/components/public/Visual";
import { Badge } from "@/components/ui/Badge";
import { Reveal } from "@/components/motion/Reveal";
import { siteConfig } from "@/config/site";
import { getContent, getJsonContent } from "@/lib/content";
import { getSiteContentCached } from "@/services/content.service";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = getMessages(locale);
  return {
    title: t.nav.about,
    description: t.about.lead,
    alternates: { canonical: "/about" },
  };
}

const valueIcons: LucideIcon[] = [Target, Compass, ShieldCheck, Gauge];

export default async function AboutPage() {
  const locale = await getLocale();
  const t = getMessages(locale);
  const contents = await getSiteContentCached(locale);
  const aboutBody = getContent(contents, "about_body", t.about.lead);
  const story = getJsonContent(contents, "about_story", t.about.story);
  const mission = getJsonContent(contents, "about_mission", t.about.mission);
  const values = getJsonContent(contents, "about_values", t.about.values);
  const facilities = getJsonContent(contents, "about_facilities", t.about.facilities);
  const vision = getContent(contents, "about_vision", t.about.vision);

  return (
    <>
      <PageHero
        crumbs={[{ label: t.common.home, href: "/" }, { label: t.nav.about }]}
        eyebrow={t.about.eyebrow}
        title={t.about.title}
        lead={t.about.lead}
        texture="craft"
        meta={
          <div className="flex flex-wrap gap-2">
            <Badge tone="onDark">{siteConfig.legalName}</Badge>
            <Badge tone="gold">Est. {siteConfig.foundedYear}</Badge>
            <Badge tone="onDark">Cikarang · Jawa Barat</Badge>
          </div>
        }
        action={
          <ButtonLink href="/contact" iconRight={<ArrowRight className="h-4 w-4" aria-hidden />}>
            {t.about.ctaCta}
          </ButtonLink>
        }
      />

      <section className="container-site -mt-8 pb-16 md:-mt-10 md:pb-24">
        <Reveal>
          <div className="overflow-hidden rounded-xl border border-surface-200 bg-white shadow-e2">
            <Visual
              src="/images/facility/production-floor.jpg"
              category="emblems"
              alt={t.about.facilityTitle}
              label="Grafindo Production Floor · Cikarang"
              ratio="wide"
              sizes="(max-width: 1280px) 100vw, 1280px"
              className="rounded-none"
              showLabel={false}
            />
            <div className="grid gap-6 p-6 md:grid-cols-12 md:items-center md:p-8">
              <div className="md:col-span-8">
                <p className="eyebrow">{t.about.eyebrow}</p>
                <p className="mt-3 font-display text-lg font-medium leading-relaxed text-primary md:text-xl">{aboutBody}</p>
              </div>
              <div className="grid grid-cols-2 gap-3 md:col-span-4">
                {siteConfig.stats.slice(0, 4).map((stat) => (
                  <div key={stat.key} className="rounded-md bg-surface p-3">
                    <p className="font-display text-xl font-extrabold text-primary">
                      {stat.value}
                      {stat.suffix}
                    </p>
                    <p className="text-[0.6rem] uppercase tracking-[0.12em] text-neutral-400">{stat.label[locale]}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      <section className="border-y border-surface-200 bg-surface py-16 md:py-24">
        <div className="container-site grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <SectionHeader eyebrow={t.about.storyTitle} title={locale === "en" ? "Three decades of precision." : "Tiga dekade presisi."} lead={t.about.lead} />
          </div>
          <div className="lg:col-span-8">
            <ol className="relative space-y-0">
              <span className="absolute bottom-4 left-[13px] top-4 w-px bg-surface-300" aria-hidden />
              {story.map((item, index) => (
                <Reveal key={item.year} as="li" delay={index * 0.05} className="relative flex gap-6 pb-8 last:pb-0">
                  <span className="relative z-10 mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 border-accent bg-white" aria-hidden>
                    <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                  </span>
                  <div>
                    <span className="font-mono text-xs font-semibold text-accent-700">{item.year}</span>
                    <h3 className="mt-1 font-display text-lg font-bold text-primary">{item.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-neutral-600">{item.desc}</p>
                  </div>
                </Reveal>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <section className="container-site section">
        <div className="grid gap-4 md:grid-cols-2">
          <Reveal>
            <div className="panel-industrial h-full p-7">
              <div className="pattern-grid pointer-events-none absolute inset-0 opacity-60" aria-hidden />
              <Compass className="relative h-8 w-8 text-accent" aria-hidden />
              <h2 className="relative mt-4 font-display text-2xl font-bold">{t.about.visionTitle}</h2>
              <p className="relative mt-3 text-sm leading-relaxed text-white/70">{vision}</p>
            </div>
          </Reveal>
          <Reveal delay={0.08}>
            <div className="h-full rounded-lg border border-surface-200 bg-white p-7 shadow-e1">
              <Target className="h-8 w-8 text-accent-700" aria-hidden />
              <h2 className="mt-4 font-display text-2xl font-bold text-primary">{t.about.missionTitle}</h2>
              <ul className="mt-3 space-y-2.5">
                {mission.map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm text-neutral-600">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent-700" aria-hidden />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section texture-fabric-craft relative overflow-hidden border-y border-surface-200">
        <div className="pattern-craft pointer-events-none absolute inset-0 opacity-70" aria-hidden />
        <div className="container-site relative">
          <Reveal>
            <SectionHeader
              eyebrow={t.about.valuesTitle}
              title={locale === "en" ? "The standard behind every batch." : "Standar di balik setiap batch."}
              lead={t.about.lead}
            />
          </Reveal>
          <div className="mt-9 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((value, index) => {
              const Icon = valueIcons[index] ?? Target;
              return (
                <Reveal key={value.title} delay={index * 0.05}>
                  <div className="h-full rounded-lg border border-surface-200 bg-white p-5">
                    <span className="flex h-10 w-10 items-center justify-center rounded-md bg-accent-50 text-accent-700">
                      <Icon className="h-5 w-5" aria-hidden />
                    </span>
                    <h3 className="mt-4 font-display text-base font-bold text-primary">{value.title}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-neutral-600">{value.desc}</p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      <section className="container-site section">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <SectionHeader eyebrow={t.about.facilityTitle} title={t.about.facilityTitle} lead={t.about.facilityLead} />
            <div className="mt-6 overflow-hidden rounded-lg">
              <Visual
                src="/images/facility/production-floor.png"
                category="graphics"
                alt={t.about.facilityTitle}
                label="In-house production line"
                ratio="video"
                sizes="(max-width: 1024px) 100vw, 40vw"
                showLabel={false}
              />
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {siteConfig.certifications.map((cert) => (
                <Badge key={cert} tone="outline">
                  <Award className="h-3 w-3 text-accent-700" aria-hidden />
                  {cert}
                </Badge>
              ))}
            </div>
          </div>
          <div className="lg:col-span-7">
            <div className="grid gap-3 sm:grid-cols-2">
              {facilities.map((facility, index) => (
                <Reveal key={facility.name} delay={index * 0.04}>
                  <div className="flex items-start gap-3 rounded-md border border-surface-200 bg-white p-4">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-surface text-accent-700">
                      {index % 3 === 0 ? <Factory className="h-4 w-4" aria-hidden /> : <Wrench className="h-4 w-4" aria-hidden />}
                    </span>
                    <div>
                      <p className="font-display text-sm font-bold text-primary">{facility.name}</p>
                      <p className="mt-0.5 font-mono text-[0.65rem] text-neutral-500">{facility.spec}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section border-t border-surface-200 bg-grad-soft">
        <div className="container-site grid gap-8 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-7">
            <p className="eyebrow">{t.about.mapTitle}</p>
            <h2 className="mt-3 font-display text-display-sm text-primary">{t.about.ctaTitle}</h2>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-neutral-600">{t.about.ctaLead}</p>
            <div className="mt-6 flex flex-col gap-2.5 sm:flex-row">
              <ButtonLink href="/contact" iconRight={<ArrowRight className="h-4 w-4" aria-hidden />}>
                {t.about.ctaCta}
              </ButtonLink>
              <a href={siteConfig.mapsUrl} target="_blank" rel="noopener noreferrer" className="btn-outline">
                <MapPin className="h-4 w-4" aria-hidden />
                {t.contact.mapCta}
              </a>
            </div>
          </div>
          <div className="lg:col-span-5">
            <div className="rounded-lg border border-surface-200 bg-white p-5 shadow-e1">
              <p className="text-[0.62rem] font-bold uppercase tracking-[0.14em] text-neutral-400">Alamat</p>
              <p className="mt-1.5 text-sm leading-relaxed text-primary">{siteConfig.address[locale]}</p>
              <div className="mt-4 grid grid-cols-2 gap-2 text-xs text-neutral-500">
                <span className="rounded-sm bg-surface px-3 py-2">{siteConfig.phone}</span>
                <span className="rounded-sm bg-surface px-3 py-2">{siteConfig.email}</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
