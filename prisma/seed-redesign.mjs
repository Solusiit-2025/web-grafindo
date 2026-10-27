/**
 * Redesign seed: content models introduced in PRD v2.0.
 * Idempotent — safe to run multiple times.
 */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const testimonials = [
  {
    name: "Rani Prameswari",
    role: "Brand Manager",
    company: "Kopi Nusantara",
    quote:
      "Warna sticker konsisten di semua batch. Mockup dan sampel fisiknya membantu kami mengunci desain sebelum produksi besar.",
    rating: 5,
    locale: "id",
    order: 1,
  },
  {
    name: "Dimas Ardhana",
    role: "Procurement Lead",
    company: "AutoParts Co",
    quote:
      "Dokumentasi QC dan spec sheet lengkap, jadi proses vendor registration kami jauh lebih cepat. Komunikasi juga responsif.",
    rating: 5,
    locale: "id",
    order: 2,
  },
  {
    name: "Sarah Lim",
    role: "Product Director",
    company: "FC Garuda",
    quote:
      "Soft emblem jersey rapi, tepi bersih, dan tidak kaku. Repeat order tiga musim berturut-turut tanpa perubahan kualitas.",
    rating: 5,
    locale: "id",
    order: 3,
  },
  {
    name: "Andi Kurnia",
    role: "Retail Operations",
    company: "Retail Mart",
    quote:
      "Signage toko kami terpasang seragam di 42 gerai. Tim Grafindo mengatur jadwal kirim per region dengan rapi.",
    rating: 4,
    locale: "id",
    order: 4,
  },
];

const clientLogos = [
  "KOPI NUSANTARA",
  "AUTOPARTS CO",
  "FC GARUDA",
  "RETAIL MART",
  "NUSANTARA FOODS",
  "PRIMA MOTOR",
  "ARTA APPAREL",
  "BUMI LOGISTIK",
  "SINAR ELEKTRONIK",
  "GARUDA AGRO",
];

const homeSections = [
  ["hero", "Hero", 1],
  ["trust", "Trust Bar", 2],
  ["categories", "Kategori Produk", 3],
  ["stats", "Statistik", 4],
  ["process", "Kapabilitas & Proses", 5],
  ["featured", "Produk Unggulan", 6],
  ["portfolio", "Portofolio", 7],
  ["testimonials", "Testimoni", 8],
  ["articles", "Artikel Terbaru", 9],
  ["cta", "CTA Banner", 10],
];

const contents = [
  {
    key: "hero_title",
    locale: "id",
    value: "Presisi manufaktur untuk identitas brand Anda.",
    type: "text",
  },
  {
    key: "hero_title",
    locale: "en",
    value: "Manufacturing precision for your brand identity.",
    type: "text",
  },
  {
    key: "hero_subtitle",
    locale: "id",
    value:
      "Sticker, graphic, emblem, dan soft emblem diproduksi in-house dengan kontrol kualitas ketat — dari mockup hingga pengiriman.",
    type: "text",
  },
  {
    key: "hero_subtitle",
    locale: "en",
    value:
      "Stickers, graphics, emblems, and soft emblems produced in-house with strict quality control — from mockup to delivery.",
    type: "text",
  },
  { key: "hero_eyebrow", locale: "id", value: "Cikarang · Sejak 1994", type: "text" },
  { key: "hero_eyebrow", locale: "en", value: "Cikarang · Since 1994", type: "text" },
  {
    key: "hero_lead",
    locale: "id",
    value:
      "Sticker, graphic, emblem, dan soft emblem diproduksi in-house dengan kontrol kualitas ketat — dari mockup hingga pengiriman.",
    type: "text",
  },
  {
    key: "hero_lead",
    locale: "en",
    value:
      "Stickers, graphics, emblems, and soft emblems produced in-house with strict quality control — from mockup to delivery.",
    type: "text",
  },
  { key: "contact_hours", locale: "id", value: "Senin – Jumat, 08.00 – 17.00 WIB", type: "text" },
  { key: "contact_hours", locale: "en", value: "Monday – Friday, 08.00 – 17.00 WIB", type: "text" },
  {
    key: "contact_map_embed",
    locale: "id",
    value:
      "https://www.google.com/maps?q=Cikarang+Industrial+Estate+Jababeka+1+Block+U+8D&output=embed",
    type: "text",
  },
  {
    key: "contact_map_embed",
    locale: "en",
    value:
      "https://www.google.com/maps?q=Cikarang+Industrial+Estate+Jababeka+1+Block+U+8D&output=embed",
    type: "text",
  },
  {
    key: "about_body",
    locale: "id",
    value:
      "Sejak 1994, GRAFINDO memproduksi komponen visual yang menempel pada produk, kendaraan, dan apparel — dengan presisi sebagai standar, bukan tambahan.",
    type: "text",
  },
  {
    key: "about_body",
    locale: "en",
    value:
      "Since 1994, GRAFINDO has produced visual components that live on products, vehicles, and apparel — with precision as a standard, not an add-on.",
    type: "text",
  },
  { key: "contact_email", locale: "id", value: "admin1@grafindomitrasemesta.com", type: "text" },
  { key: "contact_email", locale: "en", value: "admin1@grafindomitrasemesta.com", type: "text" },
  {
    key: "footer_note",
    locale: "id",
    value: "Manufaktur sticker, graphic, emblem & soft emblem presisi untuk brand dan industri Indonesia.",
    type: "text",
  },
  {
    key: "footer_note",
    locale: "en",
    value: "Precision stickers, graphics, emblems & soft emblems for Indonesian brands and industry.",
    type: "text",
  },
];

async function main() {
  for (const [key, label, order] of homeSections) {
    await prisma.homeSection.upsert({
      where: { key },
      update: { label, order },
      create: { key, label, order },
    });
  }

  if ((await prisma.testimonial.count()) === 0) {
    await prisma.testimonial.createMany({ data: testimonials });
  }

  if ((await prisma.testimonial.count({ where: { locale: "en" } })) === 0) {
    await prisma.testimonial.createMany({
      data: [
        {
          name: "Rani Prameswari",
          role: "Brand Manager",
          company: "Kopi Nusantara",
          quote:
            "Colors stayed consistent across every batch. The mockups and physical samples helped us lock the design before mass production.",
          rating: 5,
          locale: "en",
          order: 1,
        },
        {
          name: "Dimas Ardhana",
          role: "Procurement Lead",
          company: "AutoParts Co",
          quote:
            "QC documentation and spec sheets were complete, which made vendor registration much faster. Communication was responsive too.",
          rating: 5,
          locale: "en",
          order: 2,
        },
        {
          name: "Sarah Lim",
          role: "Product Director",
          company: "FC Garuda",
          quote:
            "The jersey soft emblems are neat, edges are clean, and they are not stiff. Three seasons of repeat orders with no quality drift.",
          rating: 5,
          locale: "en",
          order: 3,
        },
      ],
    });
  }

  const categoryRows = await prisma.category.findMany({ select: { id: true, slug: true } });
  const categoryMap = Object.fromEntries(categoryRows.map((category) => [category.slug, category.id]));
  const extraPortfolios = [
    {
      title: "Label Kemasan Premium",
      slug: "label-kemasan-premium",
      description: "Label waterproof untuk kemasan produk makanan dan minuman.",
      cat: "stickers",
      client: "Nusantara Foods",
      tech: "Waterproof label",
    },
    {
      title: "Emblem Custom Motor",
      slug: "emblem-custom-motor",
      description: "Emblem metal custom untuk aksesoris motor aftermarket.",
      cat: "emblems",
      client: "Prima Motor",
      tech: "Metal emblem",
    },
  ];

  for (const item of extraPortfolios) {
    await prisma.portfolio.upsert({
      where: { slug: item.slug },
      update: {},
      create: {
        title: item.title,
        slug: item.slug,
        description: item.description,
        categoryId: categoryMap[item.cat],
        client: item.client,
        technique: item.tech,
        images: [],
      },
    });
  }

  if ((await prisma.clientLogo.count()) === 0) {
    await prisma.clientLogo.createMany({
      data: clientLogos.map((name, index) => ({ name, order: index + 1 })),
    });
  }

  for (const c of contents) {
    await prisma.siteContent.upsert({
      where: { key_locale: { key: c.key, locale: c.locale } },
      update: { value: c.value, type: c.type },
      create: c,
    });
  }

  const emailTemplates = [
    {
      key: "rfq_confirmation",
      locale: "id",
      subject: "Kami menerima permintaan penawaran Anda ({{ref}})",
      bodyHtml:
        "<h2>Terima kasih, {{name}}</h2><p>Kami telah menerima permintaan penawaran Anda dengan nomor referensi <strong>{{ref}}</strong>.</p><p>Tim sales kami akan menghubungi Anda dalam 1×24 jam kerja.</p><p>Salam,<br/>Tim GRAFINDO</p>",
      bodyText: "Terima kasih {{name}}, RFQ {{ref}} diterima. Tim sales akan menghubungi Anda.",
    },
    {
      key: "rfq_confirmation",
      locale: "en",
      subject: "We received your quotation request ({{ref}})",
      bodyHtml:
        "<h2>Thank you, {{name}}</h2><p>We have received your quotation request with reference <strong>{{ref}}</strong>.</p><p>Our sales team will contact you within one business day.</p><p>Regards,<br/>GRAFINDO Team</p>",
      bodyText: "Thank you {{name}}, RFQ {{ref}} received. Our sales team will contact you.",
    },
    {
      key: "rfq_new",
      locale: "en",
      subject: "New RFQ: {{ref}} — {{company}}",
      bodyHtml:
        "<h2>New quotation request</h2><p><strong>Ref:</strong> {{ref}}</p><p><strong>Name:</strong> {{name}}</p><p><strong>Company:</strong> {{company}}</p><p><strong>Email:</strong> {{email}}</p><p><strong>Phone:</strong> {{phone}}</p><p><strong>Details:</strong></p><p>{{details}}</p>",
      bodyText: "New RFQ {{ref}} from {{name}} ({{company}}). Details: {{details}}",
    },
  ];

  for (const template of emailTemplates) {
    await prisma.emailTemplate.upsert({
      where: { key_locale: { key: template.key, locale: template.locale } },
      update: { subject: template.subject, bodyHtml: template.bodyHtml, bodyText: template.bodyText },
      create: template,
    });
  }

  const homeStats = [
    { key: "years", value: 32, suffix: "+", label: { id: "Tahun Pengalaman", en: "Years of Experience" } },
    { key: "clients", value: 480, suffix: "+", label: { id: "Klien Industri", en: "Industrial Clients" } },
    { key: "capacity", value: 1.2, suffix: "jt", label: { id: "Unit / Bulan", en: "Units / Month" } },
    { key: "repeat", value: 98, suffix: "%", label: { id: "Repeat Order", en: "Repeat Orders" } },
  ];

  await prisma.siteSetting.upsert({
    where: { key: "home_stats" },
    update: { value: homeStats },
    create: { key: "home_stats", value: homeStats },
  });

  console.log("Redesign seed completed.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
