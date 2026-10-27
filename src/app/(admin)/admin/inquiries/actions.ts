"use server";

import { revalidatePath } from "next/cache";
import type { InquiryStatus } from "@prisma/client";
import { prisma } from "@/lib/db/prisma";
import { requireAdmin } from "@/lib/auth/session";

const STATUSES: InquiryStatus[] = ["NEW", "CONTACTED", "QUOTED", "WON", "LOST"];

export async function updateInquiryStatusAction(id: string, status: string) {
  await requireAdmin("SALES");
  if (!STATUSES.includes(status as InquiryStatus)) return { error: "Status tidak valid." };

  await prisma.inquiry.update({
    where: { id },
    data: { status: status as InquiryStatus },
  });
  revalidatePath("/admin/inquiries");
  revalidatePath("/admin/dashboard");
  return { success: true };
}

export async function updateInquiryNotesAction(id: string, notes: string) {
  await requireAdmin("SALES");
  await prisma.inquiry.update({
    where: { id },
    data: { notes: notes.slice(0, 4000) || null },
  });
  revalidatePath("/admin/inquiries");
  return { success: true };
}
