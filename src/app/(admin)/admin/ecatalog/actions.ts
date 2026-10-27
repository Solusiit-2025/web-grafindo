"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db/prisma";
import { requireAdmin } from "@/lib/auth/session";

export async function createEcatalogAction(formData: FormData) {
  await requireAdmin("EDITOR");
  const productId = String(formData.get("productId") ?? "");
  const sku = String(formData.get("sku") ?? "");
  const priceUnit = Number(formData.get("priceUnit") ?? 0);
  const availability = String(formData.get("availability") ?? "in_stock");
  if (!productId || !sku) return;

  await prisma.ecatalogEntry.create({
    data: { productId, sku, priceUnit, availability, docs: [] },
  });
  revalidatePath("/admin/ecatalog");
  revalidatePath("/e-catalog");
}

export async function deleteEcatalogAction(id: string) {
  await requireAdmin("EDITOR");
  await prisma.ecatalogEntry.delete({ where: { id } });
  revalidatePath("/admin/ecatalog");
  revalidatePath("/e-catalog");
}
