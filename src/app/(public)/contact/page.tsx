import type { Metadata } from "next";
import { Clock, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { prisma } from "@/lib/db/prisma";
import { getLocale } from "@/lib/i18n/locale";
import { getMessages } from "@/i18n";
import { PageHero } from "@/components/public/PageHero";
import { ContactForm } from "@/components/public/ContactForm";
import { siteConfig, waLink } from "@/config/site";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = getMessages(locale);
  return {
    title: t.nav.contact,
    description: t.contact.lead,
    alternates: { canonical: "/contact" },
  };
}

export default async function ContactPage() {
  const locale = await getLocale();
  const t = getMessages(locale);

  const [contents, wa] = await Promise.all([
    prisma.siteContent.findMany({
      where: {
        key: { in: ["contact_address", "contact_email", "contact_phone", "contact_hours", "contact_map_embed"] },
        locale,
      },
    }),
    prisma.whatsAppSetting.findFirst(),
  ]);

  const get = (key: string) => contents.find((entry) => entry.key === key)?.value;
  const address = get("contact_address") ?? siteConfig.address[locale];
  const email = get("contact_email") ?? siteConfig.email;
  const phone = get("contact_phone") ?? siteConfig.phone;
  const hours = get("contact_hours") ?? siteConfig.hours[locale];
  const mapEmbed = get("contact_map_embed");

  const info = [
    { icon: MapPin, label: t.contact.address, value: address, href: siteConfig.mapsUrl },
    { icon: Phone, label: t.contact.phone, value: phone, href: `tel:${siteConfig.phoneHref}` },
    { icon: Mail, label: t.contact.email, value: email, href: `mailto:${email}` },
    { icon: Clock, label: t.contact.hours, value: hours },
  ];

  return (
    <>
      <PageHero
        crumbs={[{ label: t.common.home, href: "/" }, { label: t.nav.contact }]}
        eyebrow={t.contact.eyebrow}
        title={t.contact.title}
        lead={t.contact.lead}
        texture="oxford"
        action={
          <a
            href={waLink(wa?.number ?? siteConfig.whatsapp, locale === "en" ? "Hello GRAFINDO, I'd like to consult about a project." : "Halo GRAFINDO, saya ingin konsultasi proyek.")}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-outline-light"
          >
            <MessageCircle className="h-4 w-4" aria-hidden />
            {t.common.whatsapp}
          </a>
        }
      />

      <section className="texture-fabric-oxford relative overflow-hidden py-10 md:py-14">
        <div className="pattern-oxford pointer-events-none absolute inset-0 opacity-70" aria-hidden />
        <div className="container-site relative">
        <div className="grid gap-8 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-7">
            <div className="rounded-xl border border-surface-200 bg-white p-6 shadow-e2 sm:p-8">
              <h2 className="font-display text-xl font-bold text-primary">{t.contact.formTitle}</h2>
              <p className="mt-1.5 text-sm text-neutral-500">
                {locale === "en" ? "We respond within one business day." : "Kami merespons dalam 1×24 jam kerja."}
              </p>
              <div className="mt-6">
                <ContactForm t={t.contact} />
              </div>
            </div>
          </div>

          <aside className="lg:col-span-5">
            <div className="space-y-3">
              {info.map((item) => {
                const Icon = item.icon;
                const content = (
                  <div className="flex items-start gap-3.5 rounded-lg border border-surface-200 bg-white p-4 shadow-e1 transition hover:border-accent/40">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-accent-50 text-accent-700">
                      <Icon className="h-4 w-4" aria-hidden />
                    </span>
                    <div className="min-w-0">
                      <p className="text-[0.6rem] font-bold uppercase tracking-[0.14em] text-neutral-400">{item.label}</p>
                      <p className="mt-1 text-sm leading-relaxed text-primary">{item.value}</p>
                    </div>
                  </div>
                );
                return item.href ? (
                  <a key={item.label} href={item.href} target="_blank" rel="noopener noreferrer" className="block">
                    {content}
                  </a>
                ) : (
                  <div key={item.label}>{content}</div>
                );
              })}
            </div>

            <div className="panel-industrial mt-4 p-5">
              <p className="relative text-[0.6rem] font-semibold uppercase tracking-[0.16em] text-white/55">
                {locale === "en" ? "Site visit" : "Kunjungan pabrik"}
              </p>
              <p className="relative mt-1.5 text-sm leading-relaxed text-white/70">
                {locale === "en"
                  ? "We welcome client visits and vendor audits by appointment."
                  : "Kami menerima kunjungan klien dan audit vendor dengan penjadwalan."}
              </p>
              <a
                href={waLink(wa?.number ?? siteConfig.whatsapp, locale === "en" ? "Hello, I'd like to schedule a facility visit." : "Halo, saya ingin menjadwalkan kunjungan fasilitas.")}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-accent btn-sm mt-4 w-full"
              >
                <MessageCircle className="h-3.5 w-3.5" aria-hidden />
                {t.about.ctaCta}
              </a>
            </div>
          </aside>
        </div>
        </div>
      </section>

      <section className="border-t border-surface-200/80 texture-fabric-oxford relative overflow-hidden py-10 md:py-14">
        <div className="pattern-oxford pointer-events-none absolute inset-0 opacity-70" aria-hidden />
        <div className="container-site relative">
          <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="eyebrow">{t.contact.mapTitle}</p>
              <h2 className="mt-2 font-display text-2xl font-bold text-primary">{siteConfig.address[locale]}</h2>
            </div>
            <a href={siteConfig.mapsUrl} target="_blank" rel="noopener noreferrer" className="btn-outline btn-sm">
              <MapPin className="h-3.5 w-3.5" aria-hidden />
              {t.contact.mapCta}
            </a>
          </div>
          <div className="overflow-hidden rounded-lg border border-surface-200 bg-white shadow-e1">
            {mapEmbed ? (
              <iframe
                src={mapEmbed}
                width="100%"
                height="420"
                style={{ border: 0 }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title={t.contact.mapTitle}
                className="block h-[320px] w-full md:h-[420px]"
              />
            ) : (
              <div className="flex h-80 flex-col items-center justify-center gap-2 text-center text-sm text-neutral-500">
                <MapPin className="h-6 w-6 text-accent-700" aria-hidden />
                {t.contact.mapFallback}
                <a href={siteConfig.mapsUrl} target="_blank" rel="noopener noreferrer" className="btn-outline btn-sm mt-2">
                  {t.contact.mapCta}
                </a>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
