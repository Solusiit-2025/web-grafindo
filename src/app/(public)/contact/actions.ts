"use server";

import { prisma } from "@/lib/db/prisma";
import { contactSchema } from "@/validations/rfq.schema";

export async function submitContactAction(formData: FormData) {
  const parsed = contactSchema.safeParse({
    name: String(formData.get("name") ?? ""),
    email: String(formData.get("email") ?? ""),
    phone: String(formData.get("phone") ?? ""),
    message: String(formData.get("message") ?? ""),
  });

  if (!parsed.success) {
    const first = parsed.error.issues[0];
    return { error: first?.message ?? "Data belum lengkap." };
  }

  try {
    await prisma.contactMessage.create({
      data: {
        name: parsed.data.name,
        email: parsed.data.email,
        phone: parsed.data.phone || undefined,
        message: parsed.data.message,
      },
    });
    return { success: true as const };
  } catch (error) {
    console.error("Contact submit failed:", error);
    return { error: "Pesan gagal dikirim. Silakan coba lagi." };
  }
}
