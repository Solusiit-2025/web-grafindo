"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db/prisma";
import { requireAdmin } from "@/lib/auth/session";

export async function createBlogPostAction(formData: FormData) {
  await requireAdmin("EDITOR");
  const title = String(formData.get("title") ?? "");
  const slug = String(formData.get("slug") ?? "");
  const content = String(formData.get("content") ?? "");
  const status = String(formData.get("status") ?? "DRAFT");
  if (!title || !slug || !content) return;

  const author = await prisma.user.findFirst({ where: { role: "SUPER_ADMIN" } });
  if (!author) return;

  await prisma.blogPost.create({
    data: {
      title,
      slug,
      content,
      status: status as any,
      authorId: author.id,
      publishedAt: status === "PUBLISHED" ? new Date() : null,
    },
  });
  revalidatePath("/admin/blog");
  revalidatePath("/blog");
}

export async function updateBlogPostAction(id: string, formData: FormData) {
  await requireAdmin("EDITOR");
  const title = String(formData.get("title") ?? "");
  const slug = String(formData.get("slug") ?? "");
  const content = String(formData.get("content") ?? "");
  const status = String(formData.get("status") ?? "DRAFT");
  if (!title || !slug || !content) return;

  await prisma.blogPost.update({
    where: { id },
    data: {
      title,
      slug,
      content,
      status: status as any,
      publishedAt: status === "PUBLISHED" ? new Date() : null,
    },
  });
  revalidatePath("/admin/blog");
  revalidatePath("/blog");
}

export async function deleteBlogPostAction(id: string) {
  await requireAdmin("EDITOR");
  await prisma.blogPost.delete({ where: { id } });
  revalidatePath("/admin/blog");
  revalidatePath("/blog");
}
