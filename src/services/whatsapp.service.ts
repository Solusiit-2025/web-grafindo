// Service terpisah: pengaturan WhatsApp (nomor, pesan default, prefill per halaman).

import { prisma } from "@/lib/db/prisma";

export async function getWhatsAppSetting() {
  return prisma.whatsAppSetting.findFirst();
}

export async function upsertWhatsAppSetting(data: {
  number: string;
  defaultMessage?: string;
  prefillByPage?: Record<string, string>;
}) {
  const existing = await prisma.whatsAppSetting.findFirst();
  if (existing) {
    return prisma.whatsAppSetting.update({ where: { id: existing.id }, data });
  }
  return prisma.whatsAppSetting.create({ data });
}
