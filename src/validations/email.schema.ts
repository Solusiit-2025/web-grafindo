// Validasi Zod terpisah untuk EmailSetting & EmailTemplate.

import { z } from "zod";

export const emailSettingSchema = z.object({
  smtpHost: z.string().min(1),
  smtpPort: z.number().int().positive(),
  smtpUser: z.string().min(1),
  smtpPass: z.string().min(1),
  fromName: z.string().min(1),
  fromEmail: z.string().email(),
  replyTo: z.string().email().optional(),
  recipients: z.array(z.string().email()).min(1),
});

export const emailTemplateSchema = z.object({
  key: z.string().min(1),
  locale: z.string().min(2).max(5),
  subject: z.string().min(1),
  bodyHtml: z.string().min(1),
  bodyText: z.string().optional(),
});

export type EmailSettingInput = z.infer<typeof emailSettingSchema>;
export type EmailTemplateInput = z.infer<typeof emailTemplateSchema>;
