"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db/prisma";
import { requireAdmin } from "@/lib/auth/session";

export async function createPortfolioAction(formData: FormData) {
  await requireAdmin("EDITOR");
  const title = String(formData.get("title") ?? "");
  const slug = String(formData.get("slug") ?? "");
  const description = String(formData.get("description") ?? "") || undefined;
  const client = String(formData.get("client") ?? "") || undefined;
  const technique = String(formData.get("technique") ?? "") || undefined;
  const images = String(formData.get("images") ?? "")
    .split(/[\n,]/)
    .map((value) => value.trim())
    .filter(Boolean)
    .slice(0, 8);
  if (!title || !slug) return;

  await prisma.portfolio.create({ data: { title, slug, description, client, technique, images } });
  revalidatePath("/admin/portfolio");
  revalidatePath("/portfolio");
}

export async function updatePortfolioAction(id: string, formData: FormData) {
  await requireAdmin("EDITOR");
  const title = String(formData.get("title") ?? "");
  const slug = String(formData.get("slug") ?? "");
  const description = String(formData.get("description") ?? "") || undefined;
  const client = String(formData.get("client") ?? "") || undefined;
  const technique = String(formData.get("technique") ?? "") || undefined;
  const images = String(formData.get("images") ?? "")
    .split(/[\n,]/)
    .map((value) => value.trim())
    .filter(Boolean)
    .slice(0, 8);
  if (!title || !slug) return;

  await prisma.portfolio.update({ where: { id }, data: { title, slug, description, client, technique, images } });
  revalidatePath("/admin/portfolio");
  revalidatePath("/portfolio");
}

export async function deletePortfolioAction(id: string) {
  await requireAdmin("EDITOR");
  await prisma.portfolio.delete({ where: { id } });
  revalidatePath("/admin/portfolio");
  revalidatePath("/portfolio");
}
