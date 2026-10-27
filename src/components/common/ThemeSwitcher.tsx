"use client";

import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import { normalizeTheme, themes, type ThemeId } from "@/config/themes";
import { cn } from "@/lib/utils/cn";

const STORAGE_COOKIE = "theme";

export function ThemeSwitcher({
  current,
  locale = "id",
  variant = "light",
  showLabel = true,
  className,
}: {
  current: ThemeId;
  locale?: "id" | "en";
  variant?: "light" | "dark";
  showLabel?: boolean;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<ThemeId>(current);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setActive(normalizeTheme(document.documentElement.dataset.theme));
  }, []);

  useEffect(() => {
    const onTheme = (event: Event) => {
      const next = (event as CustomEvent<ThemeId>).detail;
      setActive(normalizeTheme(next));
    };
    window.addEventListener("grafindo:theme-change", onTheme);
    return () => window.removeEventListener("grafindo:theme-change", onTheme);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  function apply(theme: ThemeId) {
    document.documentElement.dataset.theme = theme;
    document.cookie = `${STORAGE_COOKIE}=${theme}; path=/; max-age=31536000; samesite=lax`;
    setActive(theme);
    setOpen(false);
    window.dispatchEvent(new CustomEvent("grafindo:theme-change", { detail: theme }));
  }

  const activeTheme = themes.find((theme) => theme.id === active) ?? themes[0];

  return (
    <div ref={rootRef} className={cn("relative", className)}>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={locale === "en" ? "Choose display theme" : "Pilih tema tampilan"}
        className={cn(
          "inline-flex h-8 items-center gap-1.5 rounded-full border px-2 text-[0.7rem] font-semibold transition",
          variant === "dark"
            ? "border-white/15 bg-white/5 text-white/70 hover:border-accent/60 hover:text-white"
            : "border-surface-300 bg-white text-primary/70 hover:border-accent/60 hover:text-primary",
        )}
      >
        <span
          className="h-2.5 w-2.5 shrink-0 rounded-full border border-black/20 shadow-e1"
          style={{ backgroundColor: activeTheme.swatches[1] }}
          aria-hidden
        />
        {showLabel && (
          <span className="whitespace-nowrap text-[0.72rem] font-semibold">
            {activeTheme.name[locale]}
          </span>
        )}
        <ChevronDown
          className={cn("h-3 w-3 shrink-0 transition-transform", open && "rotate-180")}
          aria-hidden
        />
      </button>

      {open && (
        <div
          role="menu"
          aria-label={locale === "en" ? "Display theme" : "Tema tampilan"}
          className="absolute right-0 top-full z-[80] mt-2 max-h-[70vh] w-72 overflow-y-auto rounded-lg border border-surface-200 bg-white p-2 text-primary shadow-e3 animate-fade-up"
        >
          <p className="px-2 pb-1.5 pt-1 text-[0.58rem] font-bold uppercase tracking-[0.16em] text-neutral-400">
            {locale === "en" ? "Display theme" : "Tema tampilan"}
          </p>
          {themes.map((theme) => {
            const selected = theme.id === active;
            return (
              <button
                key={theme.id}
                type="button"
                role="menuitemradio"
                aria-checked={selected}
                onClick={() => apply(theme.id)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-md px-2.5 py-2 text-left transition",
                  selected ? "bg-surface" : "hover:bg-surface/70",
                )}
              >
                <span className="flex shrink-0 -space-x-1" aria-hidden>
                  {theme.swatches.map((color) => (
                    <span
                      key={color}
                      className="h-4 w-4 rounded-full border border-white shadow-e1"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-xs font-semibold text-primary">{theme.name[locale]}</span>
                  <span
                    className="mt-0.5 block truncate text-[0.6rem] text-neutral-500"
                    title={theme.description[locale]}
                  >
                    {theme.description[locale]}
                  </span>
                </span>
                {selected && <Check className="h-4 w-4 shrink-0 text-accent-700" aria-hidden />}
              </button>
            );
          })}
          <p className="px-2 pb-1 pt-2 text-[0.55rem] leading-relaxed text-neutral-400">
            {locale === "en" ? "Saved automatically on this device." : "Tersimpan otomatis di perangkat ini."}
          </p>
        </div>
      )}
    </div>
  );
}
