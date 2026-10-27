import { z } from "zod";

export const rfqSchema = z.object({
  name: z.string().trim().min(2, "Nama minimal 2 karakter").max(120),
  company: z.string().trim().max(160).optional().or(z.literal("")),
  email: z.string().trim().email("Format email tidak valid").max(160),
  phone: z
    .string()
    .trim()
    .min(7, "Nomor telepon tidak valid")
    .max(30)
    .regex(/^[+\d][\d\s().-]{5,}$/, "Nomor telepon tidak valid"),
  category: z.string().trim().min(1, "Pilih kategori"),
  product: z.string().trim().max(160).optional().or(z.literal("")),
  qty: z.string().trim().min(1, "Isi estimasi qty").max(80),
  size: z.string().trim().max(120).optional().or(z.literal("")),
  material: z.string().trim().max(120).optional().or(z.literal("")),
  finishing: z.string().trim().max(120).optional().or(z.literal("")),
  deadline: z.string().trim().max(40).optional().or(z.literal("")),
  notes: z.string().trim().max(4000).optional().or(z.literal("")),
  contactPref: z.enum(["whatsapp", "email", "phone"]).default("whatsapp"),
  files: z.array(z.string().max(500)).max(5).default([]),
  privacy: z.union([z.literal("on"), z.literal("true"), z.boolean()]).optional(),
});

export type RfqInput = z.infer<typeof rfqSchema>;

export const contactSchema = z.object({
  name: z.string().trim().min(2, "Nama minimal 2 karakter").max(120),
  email: z.string().trim().email("Format email tidak valid").max(160),
  phone: z.string().trim().max(30).optional().or(z.literal("")),
  message: z.string().trim().min(10, "Pesan minimal 10 karakter").max(4000),
});

export const contactMessageSchema = contactSchema;
