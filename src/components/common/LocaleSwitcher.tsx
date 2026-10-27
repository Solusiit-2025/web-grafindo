"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { Globe } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export function LocaleSwitcher({ locale, compact = false }: { locale: "id" | "en"; compact?: boolean }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function switchTo(next: "id" | "en") {
    if (next === locale) return;
    document.cookie = `locale=${next}; path=/; max-age=31536000; samesite=lax`;
    startTransition(() => router.refresh());
  }

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1 rounded-full border border-primary/10 bg-white/70 p-0.5 text-[0.7rem] font-semibold backdrop-blur",
        compact && "border-white/15 bg-white/5",
        pending && "opacity-60",
      )}
      role="group"
      aria-label="Pilih bahasa"
    >
      <Globe className={cn("ml-1.5 h-3.5 w-3.5 text-neutral-400", compact && "text-white/50")} aria-hidden />
      {(["id", "en"] as const).map((code) => (
        <button
          key={code}
          type="button"
          onClick={() => switchTo(code)}
          aria-pressed={locale === code}
          className={cn(
            "rounded-full px-2 py-1 uppercase tracking-wide transition",
            locale === code
              ? "bg-primary text-white"
              : compact
                ? "text-white/60 hover:text-white"
                : "text-neutral-500 hover:text-primary",
          )}
        >
          {code}
        </button>
      ))}
    </div>
  );
}

export default LocaleSwitcher;
