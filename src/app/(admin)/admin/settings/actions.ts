"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { prisma } from "@/lib/db/prisma";
import { requireAdmin } from "@/lib/auth/session";
import { sendTestEmail } from "@/services/email.service";

export async function upsertWhatsAppAction(formData: FormData) {
  await requireAdmin("ADMIN");
  const number = String(formData.get("number") ?? "");
  const defaultMessage = String(formData.get("defaultMessage") ?? "") || undefined;
  if (!number) return;

  const existing = await prisma.whatsAppSetting.findFirst();
  if (existing) {
    await prisma.whatsAppSetting.update({ where: { id: existing.id }, data: { number, defaultMessage } });
  } else {
    await prisma.whatsAppSetting.create({ data: { number, defaultMessage } });
  }
  revalidatePath("/admin/settings");
  revalidateTag("site-settings", "max");
}

export async function createSocialLinkAction(formData: FormData) {
  await requireAdmin("ADMIN");
  const platform = String(formData.get("platform") ?? "");
  const url = String(formData.get("url") ?? "");
  const icon = String(formData.get("icon") ?? platform);
  const order = Number(formData.get("order") ?? 0);
  if (!platform || !url) return;

  await prisma.socialLink.create({ data: { platform, url, icon, order, isActive: true } });
  revalidatePath("/admin/settings");
  revalidateTag("social-links", "max");
  revalidateTag("site-settings", "max");
}

export async function deleteSocialLinkAction(id: string) {
  await requireAdmin("ADMIN");
  await prisma.socialLink.delete({ where: { id } });
  revalidatePath("/admin/settings");
  revalidateTag("social-links", "max");
  revalidateTag("site-settings", "max");
}

export async function saveEmailSettingAction(
  formData: FormData,
): Promise<{ success?: boolean; error?: string }> {
  await requireAdmin("ADMIN");

  const smtpHost = String(formData.get("smtpHost") ?? "").trim();
  const smtpPort = Number(formData.get("smtpPort") ?? 587);
  const smtpUser = String(formData.get("smtpUser") ?? "").trim();
  const smtpPass = String(formData.get("smtpPass") ?? "");
  const fromName = String(formData.get("fromName") ?? "").trim();
  const fromEmail = String(formData.get("fromEmail") ?? "").trim();
  const replyTo = String(formData.get("replyTo") ?? "").trim() || null;
  const recipients = String(formData.get("recipients") ?? "")
    .split(/[,;\n]/)
    .map((value) => value.trim())
    .filter(Boolean);

  if (!smtpHost) return { error: "SMTP host wajib diisi." };
  if (!Number.isFinite(smtpPort) || smtpPort < 1 || smtpPort > 65535) {
    return { error: "Port SMTP tidak valid." };
  }
  if (!fromName || !fromEmail) return { error: "Nama pengirim dan email pengirim wajib diisi." };
  if (recipients.length === 0) return { error: "Minimal satu email penerima RFQ diperlukan." };

  const existing = await prisma.emailSetting.findFirst();

  if (existing) {
    await prisma.emailSetting.update({
      where: { id: existing.id },
      data: {
        smtpHost,
        smtpPort,
        smtpUser,
        smtpPass: smtpPass || existing.smtpPass,
        fromName,
        fromEmail,
        replyTo,
        recipients,
      },
    });
  } else {
    await prisma.emailSetting.create({
      data: { smtpHost, smtpPort, smtpUser, smtpPass, fromName, fromEmail, replyTo, recipients },
    });
  }

  revalidatePath("/admin/settings");
  revalidatePath("/admin/email-templates");
  revalidateTag("site-settings", "max");
  return { success: true };
}

export async function sendTestEmailAction(
  formData: FormData,
): Promise<{ success?: boolean; error?: string }> {
  await requireAdmin("ADMIN");
  const to = String(formData.get("to") ?? "").trim();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(to)) return { error: "Alamat email tujuan tidak valid." };

  try {
    await sendTestEmail(to);
    return { success: true };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Gagal mengirim email test." };
  }
}
