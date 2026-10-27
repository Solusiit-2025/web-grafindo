import type { ReactNode } from "react";
import { prisma } from "@/lib/db/prisma";
import { SiteHeader } from "@/components/common/SiteHeader";
import { SiteFooter } from "@/components/common/SiteFooter";
import { WhatsAppButton } from "@/components/common/WhatsAppButton";
import { BackToTop } from "@/components/common/BackToTop";
import { CookieConsent } from "@/components/common/CookieConsent";
import { siteConfig } from "@/config/site";
import { getLocale } from "@/lib/i18n/locale";
import { organizationJsonLd, websiteJsonLd, jsonLdScript } from "@/lib/seo/structured-data";

export default async function PublicLayout({ children }: { children: ReactNode }) {
  const locale = await getLocale();
  let waNumber: string = siteConfig.whatsapp;
  let waMessage = "Halo GRAFINDO, saya ingin bertanya tentang produk dan penawaran.";

  try {
    const wa = await prisma.whatsAppSetting.findFirst();
    if (wa) {
      waNumber = wa.number;
      waMessage = wa.defaultMessage ?? waMessage;
    }
  } catch {
    // keep defaults when DB is unavailable
  }

  const message =
    locale === "en"
      ? "Hello GRAFINDO, I'd like to ask about your products and pricing."
      : waMessage;

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main id="main" className="flex-1">
        {children}
      </main>
      <SiteFooter />
      <WhatsAppButton number={waNumber} message={message} />
      <BackToTop />
      <CookieConsent locale={locale} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLdScript(organizationJsonLd(locale))}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLdScript(websiteJsonLd())}
      />
    </div>
  );
}
