// Validasi Zod terpisah untuk WhatsAppSetting.

import { z } from "zod";

export const whatsAppSettingSchema = z.object({
  number: z.string().regex(/^\d+$/, "Nomor harus angka (format internasional)"),
  defaultMessage: z.string().optional(),
  prefillByPage: z.record(z.string()).optional(),
});

export type WhatsAppSettingInput = z.infer<typeof whatsAppSettingSchema>;
