import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

export type BadgeTone = "neutral" | "gold" | "steel" | "success" | "warning" | "danger" | "dark" | "outline";

const tones: Record<BadgeTone, string> = {
  neutral: "bg-surface text-primary/70 border-surface-300",
  gold: "bg-accent-50 text-accent-700 border-accent/30",
  steel: "bg-secondary-50 text-secondary border-secondary/15",
  success: "bg-success-50 text-success border-success/20",
  warning: "bg-warning-50 text-warning border-warning/20",
  danger: "bg-danger-50 text-danger border-danger/20",
  dark: "bg-primary text-white border-primary",
  outline: "bg-transparent text-primary/70 border-surface-300",
};

export function Badge({
  children,
  tone = "neutral",
  className,
  dot = false,
}: {
  children: ReactNode;
  tone?: BadgeTone;
  className?: string;
  dot?: boolean;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[0.7rem] font-semibold leading-none",
        tones[tone],
        className,
      )}
    >
      {dot && <span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden />}
      {children}
    </span>
  );
}

const availabilityTone: Record<string, { tone: BadgeTone; id: string; en: string }> = {
  in_stock: { tone: "success", id: "Tersedia", en: "In stock" },
  low_stock: { tone: "warning", id: "Stok terbatas", en: "Low stock" },
  made_to_order: { tone: "steel", id: "Made to order", en: "Made to order" },
  out_of_stock: { tone: "danger", id: "Kosong", en: "Out of stock" },
};

export function AvailabilityBadge({ value, locale = "id" }: { value: string; locale?: "id" | "en" }) {
  const meta = availabilityTone[value] ?? { tone: "neutral" as BadgeTone, id: value, en: value };
  return (
    <Badge tone={meta.tone} dot>
      {locale === "en" ? meta.en : meta.id}
    </Badge>
  );
}
