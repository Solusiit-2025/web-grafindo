import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
async function main() {
  const contents = [
    { key: "contact_hours", locale: "id", value: "Senin - Jumat: 08.00 - 17.00 WIB", type: "text" },
    { key: "contact_hours", locale: "en", value: "Monday - Friday: 08:00 - 17:00 WIB", type: "text" },
    { key: "contact_map_embed", locale: "id", value: "https://www.google.com/maps?q=Cikarang+Industrial+Estate+Jababeka+1&output=embed", type: "text" },
    { key: "contact_map_embed", locale: "en", value: "https://www.google.com/maps?q=Cikarang+Industrial+Estate+Jababeka+1&output=embed", type: "text" },
    { key: "site_logo_url", locale: "id", value: "/icons/logo.png", type: "text" },
    { key: "site_logo_url", locale: "en", value: "/icons/logo.png", type: "text" },
  ];
  for (const c of contents) {
    await prisma.siteContent.upsert({
      where: { key_locale: { key: c.key, locale: c.locale } },
      update: { value: c.value },
      create: c,
    });
  }
  console.log("extra content seeded");
}
main().catch(console.error).finally(() => prisma.$disconnect());
