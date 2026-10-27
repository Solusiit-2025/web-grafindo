"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db/prisma";
import { requireAdmin } from "@/lib/auth/session";

export async function upsertTranslationAction(formData: FormData): Promise<void> {
  await requireAdmin("EDITOR");

  const entityType = String(formData.get("entityType") ?? "").trim();
  const entityId = String(formData.get("entityId") ?? "").trim();
  const locale = String(formData.get("locale") ?? "en") === "en" ? "en" : "id";
  const field = String(formData.get("field") ?? "").trim();
  const value = String(formData.get("value") ?? "").trim();

  if (!entityType || !entityId || !field || !value) return;

  await prisma.translation.upsert({
    where: { entityType_entityId_locale_field: { entityType, entityId, locale, field } },
    update: { value },
    create: { entityType, entityId, locale, field, value },
  });

  revalidatePath("/admin/translations");
}
