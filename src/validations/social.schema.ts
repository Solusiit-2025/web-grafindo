// Validasi Zod terpisah untuk SocialLink.

import { z } from "zod";

export const socialLinkSchema = z.object({
  platform: z.string().min(1),
  url: z.string().url(),
  icon: z.string().min(1),
  order: z.number().int().min(0).default(0),
  isActive: z.boolean().default(true),
});

export type SocialLinkInput = z.infer<typeof socialLinkSchema>;
