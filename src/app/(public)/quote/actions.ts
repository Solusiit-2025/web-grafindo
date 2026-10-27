"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db/prisma";
import { rfqSchema } from "@/validations/rfq.schema";
import { sendRfqEmails } from "@/services/email.service";

function makeRefNumber() {
  const now = new Date();
  const date = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}`;
  const random = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `RFQ-${date}-${random}`;
}

export async function submitQuoteAction(formData: FormData) {
  let files: string[] = [];
  try {
    const parsed = JSON.parse(String(formData.get("files") ?? "[]"));
    files = Array.isArray(parsed)
      ? parsed.filter((url): url is string => typeof url === "string" && url.startsWith("/uploads/")).slice(0, 5)
      : [];
  } catch {
    files = [];
  }

  const parsed = rfqSchema.safeParse({
    name: String(formData.get("name") ?? ""),
    company: String(formData.get("company") ?? ""),
    email: String(formData.get("email") ?? ""),
    phone: String(formData.get("phone") ?? ""),
    category: String(formData.get("category") ?? ""),
    product: String(formData.get("product") ?? ""),
    qty: String(formData.get("qty") ?? ""),
    size: String(formData.get("size") ?? ""),
    material: String(formData.get("material") ?? ""),
    finishing: String(formData.get("finishing") ?? ""),
    deadline: String(formData.get("deadline") ?? ""),
    notes: String(formData.get("notes") ?? ""),
    contactPref: String(formData.get("contactPref") ?? "whatsapp"),
    files,
    privacy: String(formData.get("privacy") ?? ""),
  });

  if (!parsed.success) {
    const first = parsed.error.issues[0];
    return { error: first?.message ?? "Data belum lengkap.", fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const data = parsed.data;
  if (!data.privacy) {
    return { error: "Persetujuan privasi diperlukan." };
  }

  const refNumber = makeRefNumber();

  try {
    const inquiry = await prisma.inquiry.create({
      data: {
        refNumber,
        name: data.name,
        company: data.company || undefined,
        email: data.email,
        phone: data.phone,
        category: data.category,
        files,
        details: {
          product: data.product || null,
          qty: data.qty,
          size: data.size || null,
          material: data.material || null,
          finishing: data.finishing || null,
          deadline: data.deadline || null,
          preferredContact: data.contactPref,
          notes: data.notes || null,
          source: "website-rfq",
        },
        status: "NEW",
      },
    });

    try {
      await sendRfqEmails(inquiry.id, "id");
    } catch (error) {
      console.error("RFQ email failed:", error);
    }

    revalidatePath("/admin/inquiries");
    revalidatePath("/admin/dashboard");
    return { success: true as const, refNumber };
  } catch (error) {
    console.error("RFQ submit failed:", error);
    return { error: "Permintaan gagal disimpan. Silakan coba lagi atau hubungi kami via WhatsApp." };
  }
}
