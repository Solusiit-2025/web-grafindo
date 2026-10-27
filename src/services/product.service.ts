import { prisma } from "@/lib/db/prisma";

export async function listProducts(status?: string) {
  return prisma.product.findMany({
    where: status ? { status: status as any } : undefined,
    include: { category: true, images: true, variants: true },
    orderBy: { createdAt: "desc" },
  });
}

export async function getProductBySlug(slug: string) {
  return prisma.product.findUnique({
    where: { slug },
    include: { category: true, images: true, variants: true, ecatalog: true },
  });
}

export async function getProductById(id: string) {
  return prisma.product.findUnique({
    where: { id },
    include: { category: true, images: true, variants: true, ecatalog: true },
  });
}

export async function createProduct(data: {
  name: string;
  slug: string;
  description?: string;
  categoryId?: string;
  moq?: number;
  leadTime?: string;
  status?: string;
}) {
  return prisma.product.create({ data: data as any });
}

export async function updateProduct(id: string, data: any) {
  return prisma.product.update({ where: { id }, data });
}

export async function deleteProduct(id: string) {
  return prisma.product.delete({ where: { id } });
}
