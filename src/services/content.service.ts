import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/db/prisma";

/**
 * Data cache for public content. Tags are invalidated from CMS server actions
 * (see the admin server actions) so pages stay fast without losing freshness.
 */
const siteContentCache = unstable_cache(
  async (locale: string) =>
    prisma.siteContent.findMany({ where: { locale }, orderBy: { key: "asc" } }),
  ["site-content"],
  { tags: ["site-content"], revalidate: 3600 },
);

const categoriesCache = unstable_cache(
  async () =>
    prisma.category.findMany({
      where: { type: "product" },
      include: {
        _count: { select: { products: { where: { status: "PUBLISHED" } } } },
        products: {
          where: { status: "PUBLISHED" },
          take: 1,
          orderBy: { createdAt: "desc" },
          include: { images: { take: 1, orderBy: { order: "asc" } } },
        },
      },
      orderBy: { createdAt: "asc" },
    }),
  ["product-categories"],
  { tags: ["categories", "products"], revalidate: 600 },
);

const homeSectionsCache = unstable_cache(
  async () => prisma.homeSection.findMany({ orderBy: { order: "asc" } }),
  ["home-sections"],
  { tags: ["home-sections"], revalidate: 3600 },
);

const testimonialsCache = unstable_cache(
  async (locale: string) =>
    prisma.testimonial.findMany({
      where: { isActive: true, locale },
      orderBy: { order: "asc" },
      take: 6,
    }),
  ["testimonials"],
  { tags: ["testimonials"], revalidate: 3600 },
);

const clientLogosCache = unstable_cache(
  async () =>
    prisma.clientLogo.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" },
    }),
  ["client-logos"],
  { tags: ["client-logos"], revalidate: 3600 },
);

const homeStatsCache = unstable_cache(
  async () => prisma.siteSetting.findUnique({ where: { key: "home_stats" } }),
  ["home-stats"],
  { tags: ["site-settings"], revalidate: 3600 },
);

const socialLinksCache = unstable_cache(
  async () => prisma.socialLink.findMany({ where: { isActive: true }, orderBy: { order: "asc" } }),
  ["social-links"],
  { tags: ["social-links", "site-settings"], revalidate: 3600 },
);

const faqCache = unstable_cache(
  async (locale: string) =>
    prisma.fAQ.findMany({ where: { locale }, orderBy: [{ category: "asc" }, { order: "asc" }] }),
  ["faqs"],
  { tags: ["faqs"], revalidate: 3600 },
);

export const getSiteContentCached = (locale: string) => siteContentCache(locale);
export const getCategoriesCached = () => categoriesCache();
export const getHomeSectionsCached = () => homeSectionsCache();
export const getTestimonialsCached = (locale: string) => testimonialsCache(locale);
export const getClientLogosCached = () => clientLogosCache();
export const getHomeStatsCached = () => homeStatsCache();
export const getSocialLinksCached = () => socialLinksCache();
export const getFaqsCached = (locale: string) => faqCache(locale);
