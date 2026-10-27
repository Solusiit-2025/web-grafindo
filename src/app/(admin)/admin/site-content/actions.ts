"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { prisma } from "@/lib/db/prisma";
import { requireAdmin } from "@/lib/auth/session";

export async function upsertSiteContentAction(formData: FormData) {
  await requireAdmin("EDITOR");
  const key = String(formData.get("key") ?? "");
  const locale = String(formData.get("locale") ?? "id");
  const value = String(formData.get("value") ?? "");
  const type = String(formData.get("type") ?? "text");
  if (!key) return;

  await prisma.siteContent.upsert({
    where: { key_locale: { key, locale } },
    update: { value, type },
    create: { key, locale, value, type },
  });
  revalidatePath("/admin/site-content");
  revalidateTag("site-content", "max");
}
