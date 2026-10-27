"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { prisma } from "@/lib/db/prisma";
import { requireAdmin } from "@/lib/auth/session";

export async function createTestimonialAction(formData: FormData): Promise<void> {
  await requireAdmin("EDITOR");
  const name = String(formData.get("name") ?? "").trim();
  const quote = String(formData.get("quote") ?? "").trim();
  if (!name || !quote) return;

  await prisma.testimonial.create({
    data: {
      name,
      role: String(formData.get("role") ?? "").trim() || null,
      company: String(formData.get("company") ?? "").trim() || null,
      quote,
      rating: Math.min(5, Math.max(1, Number(formData.get("rating") ?? 5))),
      locale: String(formData.get("locale") ?? "id") === "en" ? "en" : "id",
      order: Number(formData.get("order") ?? 0),
      isActive: true,
    },
  });
  revalidatePath("/");
  revalidatePath("/admin/testimonials");
  revalidateTag("testimonials", "max");
}

export async function toggleTestimonialAction(id: string): Promise<void> {
  await requireAdmin("EDITOR");
  const item = await prisma.testimonial.findUnique({ where: { id } });
  if (!item) return;
  await prisma.testimonial.update({ where: { id }, data: { isActive: !item.isActive } });
  revalidatePath("/");
  revalidatePath("/admin/testimonials");
  revalidateTag("testimonials", "max");
}

export async function deleteTestimonialAction(id: string): Promise<void> {
  await requireAdmin("EDITOR");
  await prisma.testimonial.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath("/admin/testimonials");
  revalidateTag("testimonials", "max");
}

export async function createClientLogoAction(formData: FormData): Promise<void> {
  await requireAdmin("EDITOR");
  const name = String(formData.get("name") ?? "").trim();
  if (!name) return;

  await prisma.clientLogo.create({
    data: {
      name,
      logoUrl: String(formData.get("logoUrl") ?? "").trim() || null,
      order: Number(formData.get("order") ?? 0),
      isActive: true,
    },
  });
  revalidatePath("/");
  revalidatePath("/admin/testimonials");
  revalidateTag("client-logos", "max");
}

export async function toggleClientLogoAction(id: string): Promise<void> {
  await requireAdmin("EDITOR");
  const item = await prisma.clientLogo.findUnique({ where: { id } });
  if (!item) return;
  await prisma.clientLogo.update({ where: { id }, data: { isActive: !item.isActive } });
  revalidatePath("/");
  revalidatePath("/admin/testimonials");
  revalidateTag("client-logos", "max");
}

export async function deleteClientLogoAction(id: string): Promise<void> {
  await requireAdmin("EDITOR");
  await prisma.clientLogo.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath("/admin/testimonials");
  revalidateTag("client-logos", "max");
}
