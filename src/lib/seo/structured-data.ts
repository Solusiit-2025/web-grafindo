import { siteConfig } from "@/config/site";
import type { Locale } from "@/i18n";

export function organizationJsonLd(locale: Locale = "id") {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${siteConfig.url}/#organization`,
    name: siteConfig.legalName,
    alternateName: siteConfig.name,
    url: siteConfig.url,
    logo: `${siteConfig.url}/icons/logo.png`,
    description: siteConfig.description,
    foundingDate: String(siteConfig.foundedYear),
    address: {
      "@type": "PostalAddress",
      streetAddress: siteConfig.address[locale],
      addressLocality: "Cikarang",
      addressRegion: "Jawa Barat",
      postalCode: "17530",
      addressCountry: "ID",
    },
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: siteConfig.phoneHref,
        email: siteConfig.email,
        contactType: "sales",
        areaServed: "ID",
        availableLanguage: ["id", "en"],
      },
    ],
    sameAs: siteConfig.socials.map((social) => social.url),
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteConfig.url}/#website`,
    url: siteConfig.url,
    name: siteConfig.name,
    publisher: { "@id": `${siteConfig.url}/#organization` },
    potentialAction: {
      "@type": "SearchAction",
      target: `${siteConfig.url}/products?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}

export function productJsonLd(product: {
  name: string;
  slug: string;
  description?: string | null;
  image?: string | null;
  sku?: string | null;
  price?: number | string | null;
  availability?: string | null;
}) {
  const availabilityMap: Record<string, string> = {
    in_stock: "https://schema.org/InStock",
    low_stock: "https://schema.org/LimitedAvailability",
    made_to_order: "https://schema.org/PreOrder",
    out_of_stock: "https://schema.org/OutOfStock",
  };

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description ?? undefined,
    image: product.image ? new URL(product.image, siteConfig.url).toString() : undefined,
    sku: product.sku ?? product.slug,
    brand: { "@type": "Brand", name: siteConfig.name },
    manufacturer: { "@id": `${siteConfig.url}/#organization` },
    offers: product.price
      ? {
          "@type": "Offer",
          priceCurrency: "IDR",
          price: Number(product.price),
          availability: availabilityMap[product.availability ?? "in_stock"] ?? "https://schema.org/InStock",
          url: `${siteConfig.url}/products/${product.slug}`,
          seller: { "@id": `${siteConfig.url}/#organization` },
        }
      : undefined,
  };
}

export function articleJsonLd(post: {
  title: string;
  slug: string;
  content: string;
  image?: string | null;
  publishedAt?: Date | string | null;
  author?: string | null;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.content.replace(/<[^>]+>/g, " ").slice(0, 180),
    image: post.image ? new URL(post.image, siteConfig.url).toString() : undefined,
    datePublished: post.publishedAt ? new Date(post.publishedAt).toISOString() : undefined,
    author: { "@type": "Person", name: post.author ?? siteConfig.legalName },
    publisher: { "@id": `${siteConfig.url}/#organization` },
    mainEntityOfPage: `${siteConfig.url}/blog/${post.slug}`,
  };
}

export function breadcrumbJsonLd(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: new URL(item.url, siteConfig.url).toString(),
    })),
  };
}

export function jsonLdScript(data: object) {
  return { __html: JSON.stringify(data) };
}
