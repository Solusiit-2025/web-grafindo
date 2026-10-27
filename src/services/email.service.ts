// Service terpisah: pengiriman email penawaran (RFQ) + logging.
// Template & pengaturan diambil dari DB/CMS, dengan fallback template bawaan.

import type { Inquiry } from "@prisma/client";
import { prisma } from "@/lib/db/prisma";
import { sendMail } from "@/lib/email/mailer";
import { rfqNewTemplate } from "@/lib/email/templates/rfq-new";
import { rfqConfirmationTemplate } from "@/lib/email/templates/rfq-confirmation";

export async function getEmailSetting() {
  return prisma.emailSetting.findFirst();
}

export async function getEmailTemplate(key: string, locale: string) {
  return prisma.emailTemplate.findFirst({ where: { key, locale } });
}

function detailsToText(details: unknown) {
  if (!details || typeof details !== "object") return "—";
  return Object.entries(details as Record<string, unknown>)
    .filter(([, value]) => value !== null && value !== undefined && value !== "")
    .map(([key, value]) => `${key}: ${value}`)
    .join("\n");
}

export function renderTemplate(
  template: { subject: string; bodyHtml: string; bodyText?: string | null },
  inquiry: Inquiry,
) {
  const variables: Record<string, string> = {
    ref: inquiry.refNumber,
    name: inquiry.name,
    company: inquiry.company ?? "—",
    email: inquiry.email,
    phone: inquiry.phone,
    category: inquiry.category ?? "—",
    details: detailsToText(inquiry.details),
  };

  const replace = (value: string) =>
    value.replace(/\{\{(\w+)\}\}/g, (_, key: string) => variables[key] ?? "");

  return {
    subject: replace(template.subject),
    html: replace(template.bodyHtml),
    text: template.bodyText ? replace(template.bodyText) : undefined,
  };
}

async function logEmail(input: {
  inquiryId: string;
  templateKey: string;
  to: string;
  status: "sent" | "failed";
  error?: string;
}) {
  try {
    await prisma.emailLog.create({
      data: {
        inquiryId: input.inquiryId,
        templateKey: input.templateKey,
        to: input.to,
        status: input.status,
        error: input.error,
      },
    });
  } catch (error) {
    console.error("Email log failed:", error);
  }
}

export async function sendRfqEmails(inquiryId: string, locale = "id") {
  const setting = await getEmailSetting();
  if (!setting) throw new Error("Email setting not configured");

  const inquiry = await prisma.inquiry.findUnique({ where: { id: inquiryId } });
  if (!inquiry) throw new Error("Inquiry not found");

  const smtp = {
    host: setting.smtpHost,
    port: setting.smtpPort,
    user: setting.smtpUser || undefined,
    pass: setting.smtpPass || undefined,
    secure: setting.smtpPort === 465,
    fromName: setting.fromName,
  };

  const recipients = Array.isArray(setting.recipients)
    ? (setting.recipients as string[]).filter(Boolean)
    : [];
  if (recipients.length === 0) throw new Error("Email recipients belum diatur");

  // 1) Notifikasi ke tim sales
  const adminTemplate = (await getEmailTemplate("rfq_new", locale)) ?? {
    key: rfqNewTemplate.key,
    subject: rfqNewTemplate.subject,
    bodyHtml: rfqNewTemplate.bodyHtml,
    bodyText: rfqNewTemplate.bodyText,
  };
  const adminMessage = renderTemplate(adminTemplate, inquiry);

  try {
    await sendMail({
      to: recipients,
      from: setting.fromEmail,
      fromName: setting.fromName,
      replyTo: setting.replyTo ?? inquiry.email,
      subject: adminMessage.subject,
      html: adminMessage.html,
      text: adminMessage.text,
      smtp,
    });
    await logEmail({ inquiryId, templateKey: "rfq_new", to: recipients.join(","), status: "sent" });
  } catch (error) {
    await logEmail({
      inquiryId,
      templateKey: "rfq_new",
      to: recipients.join(","),
      status: "failed",
      error: String(error),
    });
    throw error;
  }

  // 2) Konfirmasi ke klien (kegagalan di sini tidak membatalkan request)
  const clientTemplate = (await getEmailTemplate("rfq_confirmation", locale)) ?? {
    key: rfqConfirmationTemplate.key,
    subject: rfqConfirmationTemplate.subject,
    bodyHtml: rfqConfirmationTemplate.bodyHtml,
    bodyText: rfqConfirmationTemplate.bodyText,
  };
  const clientMessage = renderTemplate(clientTemplate, inquiry);

  try {
    await sendMail({
      to: inquiry.email,
      from: setting.fromEmail,
      fromName: setting.fromName,
      replyTo: setting.replyTo ?? setting.fromEmail,
      subject: clientMessage.subject,
      html: clientMessage.html,
      text: clientMessage.text,
      smtp,
    });
    await logEmail({ inquiryId, templateKey: "rfq_confirmation", to: inquiry.email, status: "sent" });
  } catch (error) {
    await logEmail({
      inquiryId,
      templateKey: "rfq_confirmation",
      to: inquiry.email,
      status: "failed",
      error: String(error),
    });
    console.error("RFQ confirmation email failed:", error);
  }
}

export async function sendTestEmail(to: string) {
  const setting = await getEmailSetting();
  if (!setting) throw new Error("Email setting belum dikonfigurasi.");

  await sendMail({
    to,
    from: setting.fromEmail,
    fromName: setting.fromName,
    replyTo: setting.replyTo ?? setting.fromEmail,
    subject: "Test email — GRAFINDO CMS",
    html: `
      <div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;padding:24px">
        <h2 style="color:#0F1115">SMTP berhasil terhubung</h2>
        <p>Email ini dikirim dari pengaturan CMS GRAFINDO.</p>
        <p style="color:#6B7280;font-size:13px">${new Date().toLocaleString("id-ID")}</p>
      </div>
    `,
    text: "SMTP berhasil terhubung. Email ini dikirim dari CMS GRAFINDO.",
    smtp: {
      host: setting.smtpHost,
      port: setting.smtpPort,
      user: setting.smtpUser || undefined,
      pass: setting.smtpPass || undefined,
      secure: setting.smtpPort === 465,
      fromName: setting.fromName,
    },
  });
}
