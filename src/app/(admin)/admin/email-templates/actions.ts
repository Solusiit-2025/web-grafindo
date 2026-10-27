"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db/prisma";
import { requireAdmin } from "@/lib/auth/session";

export async function upsertEmailTemplateAction(formData: FormData) {
  await requireAdmin("ADMIN");
  const key = String(formData.get("key") ?? "");
  const locale = String(formData.get("locale") ?? "id");
  const subject = String(formData.get("subject") ?? "");
  const bodyHtml = String(formData.get("bodyHtml") ?? "");
  if (!key || !subject || !bodyHtml) return;

  await prisma.emailTemplate.upsert({
    where: { key_locale: { key, locale } },
    update: { subject, bodyHtml },
    create: { key, locale, subject, bodyHtml },
  });
  revalidatePath("/admin/email-templates");
}
