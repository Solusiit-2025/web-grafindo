"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db/prisma";
import { requireAdmin } from "@/lib/auth/session";

export async function deleteContactMessageAction(id: string): Promise<void> {
  await requireAdmin("SALES");
  await prisma.contactMessage.delete({ where: { id } });
  revalidatePath("/admin/contact-messages");
}
