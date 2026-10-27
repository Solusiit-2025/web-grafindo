import { Facebook, Instagram, Linkedin, Music2, Twitter, Youtube, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils/cn";

const iconMap: Record<string, LucideIcon> = {
  instagram: Instagram,
  facebook: Facebook,
  youtube: Youtube,
  linkedin: Linkedin,
  twitter: Twitter,
  x: Twitter,
  tiktok: Music2,
};

export type SocialLinkItem = {
  id: string;
  platform: string;
  url: string;
  icon?: string;
  order?: number;
  isActive?: boolean;
};

export function SocialLinks({
  links,
  className,
  variant = "light",
}: {
  links: SocialLinkItem[];
  className?: string;
  variant?: "light" | "dark";
}) {
  if (!links.length) return null;

  const unique = Array.from(
    links
      .reduce((map, link) => {
        const key = (link.icon || link.platform).toLowerCase();
        if (!map.has(key)) map.set(key, link);
        return map;
      }, new Map<string, SocialLinkItem>())
      .values(),
  );

  return (
    <ul className={cn("flex flex-wrap items-center gap-2", className)}>
      {unique.map((link) => {
        const Icon = iconMap[(link.icon || link.platform).toLowerCase()] ?? Instagram;
        return (
          <li key={link.id}>
            <a
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={link.platform}
              className={cn(
                "flex h-9 w-9 items-center justify-center rounded-full border transition duration-300",
                variant === "dark"
                  ? "border-white/12 bg-white/[0.04] text-white/65 hover:border-accent hover:bg-accent hover:text-primary"
                  : "border-surface-300 bg-white text-neutral-500 hover:border-accent hover:text-accent-700",
              )}
            >
              <Icon className="h-4 w-4" aria-hidden />
            </a>
          </li>
        );
      })}
    </ul>
  );
}

export default SocialLinks;
