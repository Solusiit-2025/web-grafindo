import Link from "next/link";
import { ArrowUpRight, Clock, Mail, MapPin, Phone, ShieldCheck } from "lucide-react";
import { getLocale } from "@/lib/i18n/locale";
import { getMessages } from "@/i18n";
import { getSiteContentCached, getSocialLinksCached } from "@/services/content.service";
import { productCategoriesFallback, siteConfig } from "@/config/site";
import { Logo } from "./Logo";
import { SocialLinks } from "./SocialLinks";
import { LocaleSwitcher } from "./LocaleSwitcher";
import { NewsletterForm } from "./NewsletterForm";

export async function SiteFooter() {
  const locale = await getLocale();
  const t = getMessages(locale);

  let socials: { id: string; platform: string; url: string; icon: string; order?: number; isActive?: boolean }[] = [];
  let contents: { key: string; value: string }[] = [];

  try {
    const [dbSocials, dbContents] = await Promise.all([
      getSocialLinksCached(),
      getSiteContentCached(locale),
    ]);
    socials = dbSocials;
    contents = dbContents.filter((entry) =>
      ["contact_address", "contact_email", "contact_phone", "contact_hours", "footer_note"].includes(
        entry.key,
      ),
    );
  } catch {
    // fallback to config
  }

  const get = (key: string) => contents.find((entry) => entry.key === key)?.value;
  const address = get("contact_address") ?? siteConfig.address[locale];
  const email = get("contact_email") ?? siteConfig.email;
  const phone = get("contact_phone") ?? siteConfig.phone;
  const hours = get("contact_hours") ?? siteConfig.hours[locale];
  const note = get("footer_note") ?? t.footer.tagline;

  const productLinks = productCategoriesFallback.map((item) => ({
    label: item.name[locale],
    href: `/products?cat=${item.slug}`,
  }));

  return (
    <footer className="relative overflow-hidden bg-primary text-white">
      <div className="pattern-grid pointer-events-none absolute inset-0 opacity-60" aria-hidden />
      <div className="pointer-events-none absolute -left-24 top-0 h-72 w-72 rounded-full bg-accent/10 blur-3xl" aria-hidden />

      <div className="container-site relative py-14 md:py-20">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Logo variant="light" />
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-white/55">{note}</p>
            <SocialLinks links={socials} variant="dark" className="mt-5" />
            <div className="mt-8">
              <p className="text-[0.65rem] font-bold uppercase tracking-[0.18em] text-white/35">
                {t.footer.certifications}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {siteConfig.certifications.map((cert) => (
                  <span
                    key={cert}
                    className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1 text-[0.62rem] font-semibold text-white/60"
                  >
                    <ShieldCheck className="h-3 w-3 text-accent" aria-hidden />
                    {cert}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            <h2 className="font-display text-xs font-bold uppercase tracking-[0.18em] text-white/40">{t.footer.products}</h2>
            <ul className="mt-4 space-y-2.5 text-sm">
              {productLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="group inline-flex items-center gap-1.5 text-white/65 transition hover:text-accent">
                    {link.label}
                    <ArrowUpRight className="h-3 w-3 opacity-0 transition group-hover:opacity-100" aria-hidden />
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/e-catalog" className="text-white/65 transition hover:text-accent">
                  {t.nav.catalog}
                </Link>
              </li>
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h2 className="font-display text-xs font-bold uppercase tracking-[0.18em] text-white/40">{t.footer.company}</h2>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li><Link href="/about" className="text-white/65 transition hover:text-accent">{t.nav.about}</Link></li>
              <li><Link href="/services" className="text-white/65 transition hover:text-accent">{t.nav.services}</Link></li>
              <li><Link href="/portfolio" className="text-white/65 transition hover:text-accent">{t.nav.portfolio}</Link></li>
              <li><Link href="/blog" className="text-white/65 transition hover:text-accent">{t.nav.blog}</Link></li>
              <li><Link href="/contact" className="text-white/65 transition hover:text-accent">{t.nav.contact}</Link></li>
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h2 className="font-display text-xs font-bold uppercase tracking-[0.18em] text-white/40">{t.footer.support}</h2>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li><Link href="/quote" className="text-white/65 transition hover:text-accent">{t.common.quote}</Link></li>
              <li><Link href="/e-catalog" className="text-white/65 transition hover:text-accent">{t.nav.catalog}</Link></li>
              <li><Link href="/faq" className="text-white/65 transition hover:text-accent">FAQ</Link></li>
              <li><Link href="/privacy" className="text-white/65 transition hover:text-accent">{t.footer.privacy}</Link></li>
              <li><Link href="/terms" className="text-white/65 transition hover:text-accent">{t.footer.terms}</Link></li>
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h2 className="font-display text-xs font-bold uppercase tracking-[0.18em] text-white/40">{t.footer.contact}</h2>
            <ul className="mt-4 space-y-3 text-sm text-white/65">
              <li className="flex gap-2.5">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden />
                <span className="leading-relaxed">{address}</span>
              </li>
              <li>
                <a href={`tel:${phone.replace(/[^\d+]/g, "")}`} className="flex items-center gap-2.5 transition hover:text-accent">
                  <Phone className="h-4 w-4 shrink-0 text-accent" aria-hidden /> {phone}
                </a>
              </li>
              <li>
                <a href={`mailto:${email}`} className="flex items-center gap-2.5 transition hover:text-accent">
                  <Mail className="h-4 w-4 shrink-0 text-accent" aria-hidden /> {email}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Clock className="h-4 w-4 shrink-0 text-accent" aria-hidden /> {hours}
              </li>
            </ul>

            <div className="mt-6 border-t border-white/10 pt-5">
              <p className="font-display text-sm font-semibold text-white">{t.footer.newsletter}</p>
              <p className="mt-1 text-xs text-white/45">{t.footer.newsletterNote}</p>
              <NewsletterForm
                placeholder={t.footer.newsletterPlaceholder}
                cta={t.footer.newsletterCta}
                success={t.footer.newsletterSuccess}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="relative border-t border-white/10">
        <div className="container-site flex flex-col gap-3 py-5 text-[0.7rem] text-white/40 md:flex-row md:items-center md:justify-between">
          <p>
            © {new Date().getFullYear()} {siteConfig.legalName}. {t.footer.rights}
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <Link href="/privacy" className="transition hover:text-accent">{t.footer.privacy}</Link>
            <Link href="/terms" className="transition hover:text-accent">{t.footer.terms}</Link>
            <LocaleSwitcher locale={locale} compact />
          </div>
        </div>
      </div>
    </footer>
  );
}

export default SiteFooter;
