"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { prisma } from "@/lib/db/prisma";
import { requireAdmin } from "@/lib/auth/session";

export async function toggleHomeSectionAction(id: string): Promise<void> {
  await requireAdmin("EDITOR");
  const section = await prisma.homeSection.findUnique({ where: { id } });
  if (!section) return;
  await prisma.homeSection.update({ where: { id }, data: { isActive: !section.isActive } });
  revalidatePath("/");
  revalidatePath("/admin/home-sections");
  revalidateTag("home-sections", "max");
}

export async function moveHomeSectionAction(id: string, direction: "up" | "down"): Promise<void> {
  await requireAdmin("EDITOR");
  const sections = await prisma.homeSection.findMany({ orderBy: [{ order: "asc" }, { id: "asc" }] });
  const index = sections.findIndex((section) => section.id === id);
  const target = direction === "up" ? index - 1 : index + 1;
  if (index < 0 || target < 0 || target >= sections.length) return;

  await prisma.$transaction(
    sections.map((section, sectionIndex) =>
      prisma.homeSection.update({
        where: { id: section.id },
        data: { order: sectionIndex === index ? target : sectionIndex === target ? index : sectionIndex },
      }),
    ),
  );
  revalidatePath("/");
  revalidatePath("/admin/home-sections");
  revalidateTag("home-sections", "max");
}
