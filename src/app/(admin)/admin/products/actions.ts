"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { prisma } from "@/lib/db/prisma";
import { productSchema } from "@/validations/product.schema";
import { requireAdmin } from "@/lib/auth/session";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function createProductAction(formData: FormData) {
  await requireAdmin("EDITOR");
  const raw = {
    name: String(formData.get("name") ?? ""),
    slug: String(formData.get("slug") ?? ""),
    description: String(formData.get("description") ?? "") || undefined,
    categoryId: String(formData.get("categoryId") ?? "") || undefined,
    moq: formData.get("moq") ? Number(formData.get("moq")) : undefined,
    leadTime: String(formData.get("leadTime") ?? "") || undefined,
    status: String(formData.get("status") ?? "DRAFT"),
  };
  const parsed = productSchema.safeParse(raw);
  if (!parsed.success) return;

  await prisma.product.create({ data: parsed.data as any });
  revalidatePath("/admin/products");
  revalidatePath("/products");
  revalidateTag("categories", "max");
  revalidateTag("products", "max");
}

export async function updateProductAction(id: string, formData: FormData) {
  await requireAdmin("EDITOR");
  const raw = {
    name: String(formData.get("name") ?? ""),
    slug: String(formData.get("slug") ?? ""),
    description: String(formData.get("description") ?? "") || undefined,
    categoryId: String(formData.get("categoryId") ?? "") || undefined,
    moq: formData.get("moq") ? Number(formData.get("moq")) : undefined,
    leadTime: String(formData.get("leadTime") ?? "") || undefined,
    status: String(formData.get("status") ?? "DRAFT"),
  };
  const parsed = productSchema.safeParse(raw);
  if (!parsed.success) return;

  await prisma.product.update({ where: { id }, data: parsed.data as any });
  revalidatePath("/admin/products");
  revalidatePath("/products");
  revalidateTag("categories", "max");
  revalidateTag("products", "max");
}

export async function deleteProductAction(id: string) {
  await requireAdmin("EDITOR");
  await prisma.product.delete({ where: { id } });
  revalidatePath("/admin/products");
  revalidatePath("/products");
  revalidateTag("categories", "max");
  revalidateTag("products", "max");
}

export async function uploadProductImageAction(productId: string, formData: FormData) {
  await requireAdmin("EDITOR");
  const file = formData.get("file") as File | null;
  if (!file) return;

  const allowed = ["image/jpeg", "image/png", "image/webp"];
  if (!allowed.includes(file.type) || file.size > 10 * 1024 * 1024) return;

  const count = await prisma.productImage.count({ where: { productId } });
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const uploadsDir = path.join(process.cwd(), "public", "uploads");
  await mkdir(uploadsDir, { recursive: true });
  const filename = `${Date.now()}-${file.name.replace(/\s+/g, "-")}`;
  await writeFile(path.join(uploadsDir, filename), buffer);
  const url = `/uploads/${filename}`;
  await prisma.productImage.create({ data: { productId, url, alt: file.name, order: count } });
  revalidatePath(`/admin/products/${productId}`);
  revalidatePath("/products");
  revalidateTag("products", "max");
}

export async function deleteProductImageAction(imageId: string) {
  await requireAdmin("EDITOR");
  const image = await prisma.productImage.findUnique({ where: { id: imageId } });
  if (!image) return;
  await prisma.productImage.delete({ where: { id: imageId } });
  revalidatePath(`/admin/products/${image.productId}`);
  revalidatePath("/products");
  revalidateTag("products", "max");
}

export async function moveProductImageAction(imageId: string, direction: "up" | "down") {
  await requireAdmin("EDITOR");
  const image = await prisma.productImage.findUnique({ where: { id: imageId } });
  if (!image) return;

  const images = await prisma.productImage.findMany({
    where: { productId: image.productId },
    orderBy: [{ order: "asc" }, { id: "asc" }],
  });
  const index = images.findIndex((item) => item.id === imageId);
  const target = direction === "up" ? index - 1 : index + 1;
  if (index < 0 || target < 0 || target >= images.length) return;

  await prisma.$transaction(
    images.map((item, itemIndex) =>
      prisma.productImage.update({
        where: { id: item.id },
        data: { order: itemIndex === index ? target : itemIndex === target ? index : itemIndex },
      }),
    ),
  );
  revalidatePath(`/admin/products/${image.productId}`);
  revalidatePath("/products");
  revalidateTag("products", "max");
}
