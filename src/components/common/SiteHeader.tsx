import { getLocale } from "@/lib/i18n/locale";
import { getTheme } from "@/lib/theme";
import { getMessages } from "@/i18n";
import { productCategoriesFallback, siteConfig } from "@/config/site";
import { getCategoriesCached, getSiteContentCached } from "@/services/content.service";
import { HeaderShell, type HeaderCategory } from "./HeaderShell";

export async function SiteHeader() {
  const [locale, theme] = await Promise.all([getLocale(), getTheme()]);
  const t = getMessages(locale);

  let categories: HeaderCategory[] = [];
  let contact: { phone: string; email: string; hours: string } = {
    phone: siteConfig.phone,
    email: siteConfig.email,
    hours: siteConfig.hours[locale],
  };

  try {
    const [dbCategories, contents] = await Promise.all([
      getCategoriesCached(),
      getSiteContentCached(locale),
    ]);

    const get = (key: string) => contents.find((entry) => entry.key === key)?.value;

    contact = {
      phone: get("contact_phone") ?? siteConfig.phone,
      email: get("contact_email") ?? siteConfig.email,
      hours: get("contact_hours") ?? siteConfig.hours[locale],
    };

    categories = dbCategories.map((category) => {
      const fallback = productCategoriesFallback.find((item) => item.slug === category.slug);
      return {
        slug: category.slug,
        name: category.name,
        description: fallback?.description[locale] ?? category.name,
        count: category._count.products,
      };
    });
  } catch {
    // DB unavailable — keep the site navigable with static fallback data.
  }

  if (categories.length === 0) {
    categories = productCategoriesFallback.map((item) => ({
      slug: item.slug,
      name: item.name[locale],
      description: item.description[locale],
      count: 0,
    }));
  }

  return <HeaderShell locale={locale} theme={theme} t={t} categories={categories} contact={contact} />;
}

export default SiteHeader;
