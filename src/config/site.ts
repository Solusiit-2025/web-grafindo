/**
 * Single source of truth for brand/company information.
 * Values are safe defaults; the CMS can override most of them at runtime
 * (SiteContent / SiteSetting / WhatsAppSetting).
 */
export const siteConfig = {
  name: "GRAFINDO",
  legalName: "PT. GRAFINDO MITRASEMESTA",
  wordmark: "GRAFINDO",
  tagline: "Industrial Precision, Crafted Premium",
  description:
    "Manufaktur sticker, graphic printing, emblem, dan soft emblem untuk kebutuhan branding, identitas produk, dan procurement industri di Indonesia.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  email: "admin1@grafindomitrasemesta.com",
  phone: "(021) 8934714",
  phoneHref: "+62218934714",
  whatsapp: "6281234567890",
  hours: {
    id: "Senin – Jumat, 08.00 – 17.00 WIB",
    en: "Monday – Friday, 08.00 – 17.00 WIB",
  },
  address: {
    id: "Cikarang Industrial Estate Jababeka 1, Block U 8D, U 8C & U 7A, Cikarang, Bekasi, Jawa Barat 17530",
    en: "Cikarang Industrial Estate Jababeka 1, Block U 8D, U 8C & U 7A, Cikarang, Bekasi, West Java 17530",
  },
  foundedYear: 1994,
  mapsUrl:
    "https://www.google.com/maps/search/?api=1&query=Grafindo+Cikarang+Jababeka+1+Block+U+8D",
  socials: [
    { platform: "instagram", url: "https://instagram.com/grafindo" },
    { platform: "facebook", url: "https://facebook.com/grafindo" },
    { platform: "youtube", url: "https://youtube.com/@grafindo" },
    { platform: "linkedin", url: "https://linkedin.com/company/grafindo" },
  ],
  trustChips: {
    id: ["ISO 9001:2015", "MOQ mulai 30 pcs", "Lead time 7–14 hari"],
    en: ["ISO 9001:2015", "MOQ from 30 pcs", "Lead time 7–14 days"],
  },
  stats: [
    { key: "years", value: 32, suffix: "+", label: { id: "Tahun Pengalaman", en: "Years of Experience" } },
    { key: "clients", value: 480, suffix: "+", label: { id: "Klien Industri", en: "Industrial Clients" } },
    { key: "capacity", value: 1.2, suffix: "jt", label: { id: "Unit / Bulan", en: "Units / Month" } },
    { key: "repeat", value: 98, suffix: "%", label: { id: "Repeat Order", en: "Repeat Orders" } },
  ],
  certifications: ["ISO 9001:2015", "ISO 14001", "SNI Ready", "TKDN Ready"],
} as const;

export type NavKey =
  | "home"
  | "products"
  | "catalog"
  | "portfolio"
  | "services"
  | "about"
  | "blog"
  | "contact";

export const navItems: { key: NavKey; href: string }[] = [
  { key: "home", href: "/" },
  { key: "products", href: "/products" },
  { key: "catalog", href: "/e-catalog" },
  { key: "portfolio", href: "/portfolio" },
  { key: "services", href: "/services" },
  { key: "about", href: "/about" },
  { key: "blog", href: "/blog" },
  { key: "contact", href: "/contact" },
];

export const productCategoriesFallback = [
  {
    slug: "stickers",
    name: { id: "Stickers", en: "Stickers" },
    description: {
      id: "Die-cut, clear, vinyl & label sticker presisi untuk kemasan dan merchandise.",
      en: "Precision die-cut, clear, vinyl & label stickers for packaging and merchandise.",
    },
  },
  {
    slug: "graphics",
    name: { id: "Graphics", en: "Graphics" },
    description: {
      id: "Large format printing, signage, dan graphic panel untuk kebutuhan visual.",
      en: "Large format printing, signage, and graphic panels for visual needs.",
    },
  },
  {
    slug: "emblems",
    name: { id: "Emblems", en: "Emblems" },
    description: {
      id: "Emblem metal, chrome, dan doming premium dengan finishing presisi.",
      en: "Premium metal, chrome, and doming emblems with precision finishing.",
    },
  },
  {
    slug: "soft-emblems",
    name: { id: "Soft Emblems", en: "Soft Emblems" },
    description: {
      id: "Rubber, PVC, woven, dan bordir untuk apparel, jersey, serta komunitas.",
      en: "Rubber, PVC, woven, and embroidered patches for apparel, jerseys, and communities.",
    },
  },
];

export function waLink(number: string, message?: string) {
  const clean = number.replace(/[^\d]/g, "");
  return `https://wa.me/${clean}${message ? `?text=${encodeURIComponent(message)}` : ""}`;
}
