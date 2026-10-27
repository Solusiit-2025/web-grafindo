// Service terpisah: operasi data SocialLink (CRUD) via Prisma.
// Jangan campur dengan service lain agar trace error mudah.

import { prisma } from "@/lib/db/prisma";

export async function listSocialLinks(activeOnly = false) {
  return prisma.socialLink.findMany({
    where: activeOnly ? { isActive: true } : undefined,
    orderBy: { order: "asc" },
  });
}

export async function createSocialLink(data: {
  platform: string;
  url: string;
  icon: string;
  order?: number;
  isActive?: boolean;
}) {
  return prisma.socialLink.create({ data });
}

export async function updateSocialLink(
  id: string,
  data: Partial<{
    platform: string;
    url: string;
    icon: string;
    order: number;
    isActive: boolean;
  }>
) {
  return prisma.socialLink.update({ where: { id }, data });
}

export async function deleteSocialLink(id: string) {
  return prisma.socialLink.delete({ where: { id } });
}
