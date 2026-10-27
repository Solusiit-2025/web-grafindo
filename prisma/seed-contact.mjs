import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
async function main() {
  const contents = [
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
      update: { value: c.value },
      create: c,
    });
  }
  console.log("Contact content seeded");
}
main().catch(console.error).finally(() => prisma.$disconnect());
