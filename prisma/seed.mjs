import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Admin user
  const passwordHash = await bcrypt.hash("admin123", 10);
  const admin = await prisma.user.upsert({
    where: { email: "admin@grafindo.local" },
    update: {},
    create: { name: "Admin Grafindo", email: "admin@grafindo.local", passwordHash, role: "SUPER_ADMIN" },
  });

  // Categories
  const cats = [
    { name: "Stickers", slug: "stickers", type: "product" },
    { name: "Graphics", slug: "graphics", type: "product" },
    { name: "Emblems", slug: "emblems", type: "product" },
    { name: "Soft Emblems", slug: "soft-emblems", type: "product" },
  ];
  const catMap = {};
  for (const c of cats) {
    const cat = await prisma.category.upsert({
      where: { slug: c.slug },
      update: {},
      create: c,
    });
    catMap[c.slug] = cat.id;
  }

  // Products sample
  const products = [
    { name: "Die-Cut Vinyl Sticker", slug: "die-cut-vinyl-sticker", cat: "stickers", desc: "Sticker vinyl die-cut tahan air, cocok untuk branding & merchandise.", moq: 100, lead: "5-7 hari", price: 1500 },
    { name: "Clear Sticker", slug: "clear-sticker", cat: "stickers", desc: "Sticker transparan premium untuk kemasan & produk.", moq: 100, lead: "5-7 hari", price: 1800 },
    { name: "Large Format Banner", slug: "large-format-banner", cat: "graphics", desc: "Banner large format untuk event & promosi.", moq: 1, lead: "3-5 hari", price: 45000 },
    { name: "Vinyl Sticker Roll", slug: "vinyl-sticker-roll", cat: "graphics", desc: "Sticker roll untuk cutting plotter.", moq: 1, lead: "3-5 hari", price: 85000 },
    { name: "Metal Emblem Badge", slug: "metal-emblem-badge", cat: "emblems", desc: "Emblem metal premium untuk branding kendaraan & produk.", moq: 50, lead: "10-14 hari", price: 12000 },
    { name: "Chrome Emblem", slug: "chrome-emblem", cat: "emblems", desc: "Emblem chrome dengan finishing mirror.", moq: 50, lead: "10-14 hari", price: 15000 },
    { name: "Rubber Soft Emblem", slug: "rubber-soft-emblem", cat: "soft-emblems", desc: "Soft emblem rubber/PVC untuk jaket & tas.", moq: 50, lead: "10-14 hari", price: 9500 },
    { name: "Embroidered Patch", slug: "embroidered-patch", cat: "soft-emblems", desc: "Patch bordir untuk komunitas & apparel.", moq: 30, lead: "12-16 hari", price: 8500 },
  ];

  const productMap = {};
  for (const p of products) {
    const prod = await prisma.product.upsert({
      where: { slug: p.slug },
      update: {},
      create: {
        name: p.name,
        slug: p.slug,
        description: p.desc,
        categoryId: catMap[p.cat],
        moq: p.moq,
        leadTime: p.lead,
        status: "PUBLISHED",
      },
    });
    productMap[p.slug] = prod.id;

    // E-catalog entry
    await prisma.ecatalogEntry.upsert({
      where: { sku: `SKU-${p.slug.toUpperCase().replace(/-/g, "")}` },
      update: {},
      create: {
        productId: prod.id,
        sku: `SKU-${p.slug.toUpperCase().replace(/-/g, "")}`,
        specStandard: { material: "Premium", finishing: "Glossy", thickness: "0.1mm" },
        priceUnit: p.price,
        priceTiers: [
          { qty: "1-99", price: p.price },
          { qty: "100-499", price: Math.round(p.price * 0.9) },
          { qty: "500+", price: Math.round(p.price * 0.8) },
        ],
        availability: "in_stock",
        docs: [],
      },
    });
  }

  // Portfolio
  const portfolios = [
    { title: "Branding Kopi Nusantara", slug: "branding-kopi-nusantara", desc: "Sticker & emblem untuk brand kopi lokal.", cat: "stickers", client: "Kopi Nusantara", tech: "Die-cut vinyl" },
    { title: "Jersey Tim Sepakbola", slug: "jersey-tim-sepakbola", desc: "Soft emblem untuk jersey klub.", cat: "soft-emblems", client: "FC Garuda", tech: "Rubber emblem" },
    { title: "Signage Toko Retail", slug: "signage-toko-retail", desc: "Large format graphic untuk toko.", cat: "graphics", client: "Retail Mart", tech: "Banner" },
    { title: "Badge Kendaraan Premium", slug: "badge-kendaraan-premium", desc: "Chrome emblem untuk aksesoris mobil.", cat: "emblems", client: "AutoParts Co", tech: "Chrome emblem" },
  ];
  for (const p of portfolios) {
    await prisma.portfolio.upsert({
      where: { slug: p.slug },
      update: {},
      create: {
        title: p.title,
        slug: p.slug,
        description: p.desc,
        categoryId: catMap[p.cat],
        client: p.client,
        technique: p.tech,
        images: [],
      },
    });
  }

  // Blog posts
  const posts = [
    { title: "Memilih Material Sticker yang Tepat", slug: "memilih-material-sticker", content: "<p>Panduan memilih material sticker untuk kebutuhan branding Anda.</p>", status: "PUBLISHED" },
    { title: "Perbedaan Emblem Metal dan Soft Emblem", slug: "perbedaan-emblem-metal-soft", content: "<p>Memahami perbedaan emblem metal dan soft emblem (rubber/PVC).</p>", status: "PUBLISHED" },
    { title: "Tips Perawatan Sticker Outdoor", slug: "tips-perawatan-sticker-outdoor", content: "<p>Cara merawat sticker outdoor agar tahan lama.</p>", status: "PUBLISHED" },
  ];
  for (const p of posts) {
    await prisma.blogPost.upsert({
      where: { slug: p.slug },
      update: {},
      create: {
        title: p.title,
        slug: p.slug,
        content: p.content,
        authorId: admin.id,
        status: p.status,
        publishedAt: new Date(),
      },
    });
  }

  // FAQ
  const faqs = [
    { q: "Berapa MOQ untuk sticker custom?", a: "MOQ mulai dari 100 pcs untuk sticker custom.", cat: "sticker" },
    { q: "Apakah bisa produksi emblem custom?", a: "Ya, kami menerima emblem custom sesuai desain klien.", cat: "emblem" },
    { q: "Berapa lama lead time produksi?", a: "Lead time 5-16 hari tergantung produk & qty.", cat: "umum" },
    { q: "Apakah melayani pengiriman ke seluruh Indonesia?", a: "Ya, kami melayani pengiriman nasional.", cat: "umum" },
  ];
  for (const f of faqs) {
    await prisma.fAQ.create({
      data: { question: f.q, answer: f.a, category: f.cat, locale: "id", order: 0 },
    });
  }

  // Site content
  const contents = [
    { key: "hero_title", locale: "id", value: "Manufaktur Sticker, Graphic, Emblem & Soft Emblem", type: "text" },
    { key: "hero_title", locale: "en", value: "Manufacturer of Stickers, Graphics, Emblems & Soft Emblems", type: "text" },
    { key: "hero_subtitle", locale: "id", value: "Solusi branding & identitas produk berkualitas tinggi.", type: "text" },
    { key: "hero_subtitle", locale: "en", value: "High-quality branding & product identity solutions.", type: "text" },
    { key: "about_title", locale: "id", value: "Tentang Kami", type: "text" },
    { key: "about_title", locale: "en", value: "About Us", type: "text" },
    { key: "about_body", locale: "id", value: "Kami adalah manufaktur profesional yang memproduksi sticker, graphic printing, emblem, dan soft emblem untuk kebutuhan branding & identitas produk.", type: "text" },
    { key: "about_body", locale: "en", value: "We are a professional manufacturer producing stickers, graphic printing, emblems, and soft emblems for branding & product identity needs.", type: "text" },
    { key: "contact_address", locale: "id", value: "Cikarang Industrial Estate Jababeka 1 Block U 8D, U 8C & U 7A, Cikarang, Harja Mekar, Cikarang Utara, Bekasi Regency, West Java 17530", type: "text" },
    { key: "contact_address", locale: "en", value: "Cikarang Industrial Estate Jababeka 1 Block U 8D, U 8C & U 7A, Cikarang, Harja Mekar, Cikarang Utara, Bekasi Regency, West Java 17530", type: "text" },
    { key: "contact_email", locale: "id", value: "admin1@grafindomitrasemesta.com", type: "text" },
    { key: "contact_email", locale: "en", value: "admin1@grafindomitrasemesta.com", type: "text" },
    { key: "contact_phone", locale: "id", value: "(021) 8934714", type: "text" },
    { key: "contact_phone", locale: "en", value: "(021) 8934714", type: "text" },
  ];
  for (const c of contents) {
    await prisma.siteContent.upsert({
      where: { key_locale: { key: c.key, locale: c.locale } },
      update: {},
      create: c,
    });
  }

  // WhatsApp
  await prisma.whatsAppSetting.upsert({
    where: { id: "default" },
    update: {},
    create: { id: "default", number: "6281234567890", defaultMessage: "Halo, saya ingin bertanya tentang produk Anda." },
  });

  // Social links (idempotent: one row per platform)
  const socials = [
    { platform: "instagram", url: "https://instagram.com/grafindo", icon: "instagram", order: 1, isActive: true },
    { platform: "facebook", url: "https://facebook.com/grafindo", icon: "facebook", order: 2, isActive: true },
    { platform: "tiktok", url: "https://tiktok.com/@grafindo", icon: "tiktok", order: 3, isActive: true },
    { platform: "youtube", url: "https://youtube.com/@grafindo", icon: "youtube", order: 4, isActive: true },
  ];
  for (const social of socials) {
    const exists = await prisma.socialLink.findFirst({ where: { platform: social.platform } });
    if (!exists) await prisma.socialLink.create({ data: social });
  }

  // Email template
  await prisma.emailTemplate.upsert({
    where: { key_locale: { key: "rfq_new", locale: "id" } },
    update: {},
    create: {
      key: "rfq_new",
      locale: "id",
      subject: "RFQ Baru: {{ref}} — {{company}}",
      bodyHtml: "<h2>Penawaran Baru</h2><p>Ref: {{ref}}</p><p>Nama: {{name}}</p><p>Perusahaan: {{company}}</p><p>Email: {{email}}</p><p>Telepon: {{phone}}</p><p>Detail: {{details}}</p>",
    },
  });

  console.log("Seed completed with sample data");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
