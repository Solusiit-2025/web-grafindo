import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
async function main() {
  const val = "(021) 8934714";
  for (const loc of ["id", "en"]) {
    await prisma.siteContent.upsert({
      where: { key_locale: { key: "contact_phone", locale: loc } },
      update: { value: val },
      create: { key: "contact_phone", locale: loc, value: val, type: "text" },
    });
  }
  console.log("phone updated");
}
main().catch(console.error).finally(() => prisma.$disconnect());
