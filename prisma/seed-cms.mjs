/**
 * CMS seed for static marketing sections (PRD TR-6).
 * Run: npm run db:seed:cms
 */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const id = {
  home_process: [
    { title: "Konsultasi", desc: "Diskusi kebutuhan, aplikasi, dan target biaya." },
    { title: "Desain & Mockup", desc: "Mockup digital dan rekomendasi material." },
    { title: "Sampling", desc: "Sampel fisik untuk validasi warna dan finishing." },
    { title: "Produksi", desc: "Produksi terjadwal dengan update progres." },
    { title: "QC & Kirim", desc: "Inspeksi batch dan pengiriman nasional." },
  ],
  services_items: [
    {
      title: "Custom Design & Production",
      desc: "Pengembangan artwork, mockup digital, dan produksi sesuai brand guideline.",
      points: ["Mockup 3D opsional", "Color matching Pantone", "Revisi terstruktur"],
    },
    {
      title: "OEM / ODM",
      desc: "Produksi white-label dan pengembangan produk dari nol untuk brand Anda.",
      points: ["Kerahasiaan & NDA", "Kontrol bill of material", "Kemasan private label"],
    },
    {
      title: "Bulk & Kontrak",
      desc: "Skema harga volume, kontrak tahunan, dan pengiriman bertahap.",
      points: ["Harga tier volume", "Safety stock", "Jadwal kirim fleksibel"],
    },
    {
      title: "Konsultasi Material",
      desc: "Rekomendasi material dan adhesive berdasarkan lingkungan pemakaian.",
      points: ["Uji tempel & ketahanan", "Rekomendasi finishing", "Estimasi umur pakai"],
    },
  ],
  services_why: [
    { title: "In-house end-to-end", desc: "Printing, cutting, etching, hingga QC di satu atap." },
    { title: "Dokumentasi QC", desc: "Laporan inspeksi per batch untuk audit vendor." },
    { title: "Kapasitas terukur", desc: "Slot produksi jelas, update progres berkala." },
    { title: "Pengiriman nasional", desc: "Kurir rekanan dan ekspedisi pilihan klien." },
  ],
  about_story: [
    { year: "1994", title: "Berdiri di Cikarang", desc: "Dimulai sebagai workshop sticker & graphic printing." },
    { year: "2008", title: "Lini emblem metal", desc: "Investasi mesin etsa & finishing chrome untuk kebutuhan otomotif." },
    { year: "2016", title: "Soft emblem & apparel", desc: "Melayani brand apparel, jersey, dan komunitas nasional." },
    { year: "2023", title: "Integrasi digital", desc: "Sistem RFQ, e-catalog, dan pelacakan produksi terdigitalisasi." },
  ],
  about_vision: "Menjadi mitra manufaktur identitas visual paling dipercaya di Asia Tenggara.",
  about_mission: [
    "Menjaga presisi dan konsistensi warna di setiap batch.",
    "Menyediakan material yang tepat guna, bukan sekadar termurah.",
    "Memberi transparansi progres dan biaya kepada klien.",
    "Mengembangkan talenta produksi lokal berstandar global.",
  ],
  about_values: [
    { title: "Presisi", desc: "Toleransi ketat, diukur, dan didokumentasikan." },
    { title: "Transparan", desc: "Harga, lead time, dan risiko dijelaskan sejak awal." },
    { title: "Berkelanjutan", desc: "Material dan proses yang lebih ramah lingkungan." },
    { title: "Responsif", desc: "Satu titik kontak untuk setiap proyek." },
  ],
  about_facilities: [
    { name: "Digital printing", spec: "HP Latex · 1.6 m" },
    { name: "Die-cutting", spec: "Flatbed · ±0.1 mm" },
    { name: "Metal etching", spec: "Chrome & brass finishing" },
    { name: "Embroidery", spec: "12-head computerized" },
    { name: "Doming & coating", spec: "UV & epoxy resin" },
    { name: "QC station", spec: "Color & adhesion test" },
  ],
};

const en = {
  home_process: [
    { title: "Consultation", desc: "Discuss needs, application, and cost targets." },
    { title: "Design & Mockup", desc: "Digital mockups and material recommendations." },
    { title: "Sampling", desc: "Physical samples to validate color and finish." },
    { title: "Production", desc: "Scheduled production with progress updates." },
    { title: "QC & Delivery", desc: "Batch inspection and nationwide shipping." },
  ],
  services_items: [
    {
      title: "Custom Design & Production",
      desc: "Artwork development, digital mockups, and production aligned with brand guidelines.",
      points: ["Optional 3D mockups", "Pantone color matching", "Structured revisions"],
    },
    {
      title: "OEM / ODM",
      desc: "White-label production and product development from scratch for your brand.",
      points: ["Confidentiality & NDA", "Bill of material control", "Private label packaging"],
    },
    {
      title: "Bulk & Contract",
      desc: "Volume pricing, annual contracts, and phased deliveries.",
      points: ["Volume tier pricing", "Safety stock", "Flexible delivery schedules"],
    },
    {
      title: "Material Consulting",
      desc: "Material and adhesive recommendations based on the operating environment.",
      points: ["Adhesion & durability tests", "Finishing recommendations", "Lifespan estimates"],
    },
  ],
  services_why: [
    { title: "In-house end-to-end", desc: "Printing, cutting, etching, and QC under one roof." },
    { title: "QC documentation", desc: "Batch inspection reports for vendor audits." },
    { title: "Measured capacity", desc: "Clear production slots and regular progress updates." },
    { title: "Nationwide delivery", desc: "Partner couriers and your preferred forwarder." },
  ],
  about_story: [
    { year: "1994", title: "Founded in Cikarang", desc: "Started as a sticker & graphic printing workshop." },
    { year: "2008", title: "Metal emblem line", desc: "Invested in etching & chrome finishing for automotive needs." },
    { year: "2016", title: "Soft emblem & apparel", desc: "Serving apparel brands, jerseys, and national communities." },
    { year: "2023", title: "Digital integration", desc: "Digitalized RFQ, e-catalog, and production tracking." },
  ],
  about_vision: "To become the most trusted visual identity manufacturing partner in Southeast Asia.",
  about_mission: [
    "Maintain precision and color consistency in every batch.",
    "Provide fit-for-purpose materials, not merely the cheapest.",
    "Give clients transparency on progress and cost.",
    "Develop local production talent to global standards.",
  ],
  about_values: [
    { title: "Precision", desc: "Tight tolerances, measured and documented." },
    { title: "Transparency", desc: "Pricing, lead time, and risks explained upfront." },
    { title: "Sustainability", desc: "More environmentally responsible materials and processes." },
    { title: "Responsiveness", desc: "One point of contact for every project." },
  ],
  about_facilities: [
    { name: "Digital printing", spec: "HP Latex · 1.6 m" },
    { name: "Die-cutting", spec: "Flatbed · ±0.1 mm" },
    { name: "Metal etching", spec: "Chrome & brass finishing" },
    { name: "Embroidery", spec: "12-head computerized" },
    { name: "Doming & coating", spec: "UV & epoxy resin" },
    { name: "QC station", spec: "Color & adhesion test" },
  ],
};

async function main() {
  for (const [locale, values] of Object.entries({ id, en })) {
    for (const [key, value] of Object.entries(values)) {
      const isJson = typeof value !== "string";
      await prisma.siteContent.upsert({
        where: { key_locale: { key, locale } },
        update: { value: isJson ? JSON.stringify(value) : value, type: isJson ? "json" : "text" },
        create: {
          key,
          locale,
          value: isJson ? JSON.stringify(value) : value,
          type: isJson ? "json" : "text",
        },
      });
    }
  }
  console.log("CMS content seed completed.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
