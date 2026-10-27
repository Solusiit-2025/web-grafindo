// Tipe data untuk SocialLink.

export type SocialPlatform =
  | "instagram"
  | "facebook"
  | "tiktok"
  | "youtube"
  | "linkedin"
  | "x"
  | "other";

export type SocialLink = {
  id: string;
  platform: SocialPlatform | string;
  url: string;
  icon: string;
  order: number;
  isActive: boolean;
};
