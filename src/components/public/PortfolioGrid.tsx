"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowRight, Maximize2, X } from "lucide-react";
import { Visual } from "./Visual";
import { cn } from "@/lib/utils/cn";

export type PortfolioItem = {
  id: string;
  title: string;
  slug: string;
  description?: string | null;
  client?: string | null;
  technique?: string | null;
  images: string[];
  category?: { name: string; slug: string } | null;
};

export function PortfolioGrid({
  items,
  allLabel = "Semua",
  emptyLabel = "Belum ada portofolio.",
  className,
}: {
  items: PortfolioItem[];
  allLabel?: string;
  emptyLabel?: string;
  className?: string;
}) {
  const [filter, setFilter] = useState<string>("all");
  const [selected, setSelected] = useState<number | null>(null);
  const reduce = useReducedMotion();

  const categories = useMemo(() => {
    const map = new Map<string, string>();
    items.forEach((item) => {
      if (item.category) map.set(item.category.slug, item.category.name);
    });
    return Array.from(map.entries()).map(([slug, name]) => ({ slug, name }));
  }, [items]);

  const filtered = useMemo(
    () => (filter === "all" ? items : items.filter((item) => item.category?.slug === filter)),
    [filter, items],
  );

  useEffect(() => {
    if (selected === null) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelected(null);
      if (event.key === "ArrowRight") setSelected((current) => (current === null ? null : (current + 1) % filtered.length));
      if (event.key === "ArrowLeft") setSelected((current) => (current === null ? null : (current - 1 + filtered.length) % filtered.length));
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [selected, filtered.length]);

  const active = selected !== null ? filtered[selected] : null;

  return (
    <div className={className}>
      {categories.length > 0 && (
        <div className="no-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
          <button
            type="button"
            onClick={() => setFilter("all")}
            className={cn("chip shrink-0", filter === "all" && "chip-active")}
          >
            {allLabel}
          </button>
          {categories.map((category) => (
            <button
              key={category.slug}
              type="button"
              onClick={() => setFilter(category.slug)}
              className={cn("chip shrink-0", filter === category.slug && "chip-active")}
            >
              {category.name}
            </button>
          ))}
        </div>
      )}

      {filtered.length === 0 ? (
        <p className="mt-10 rounded-lg border border-dashed border-surface-300 bg-surface/60 px-6 py-12 text-center text-sm text-neutral-500">
          {emptyLabel}
        </p>
      ) : (
        <motion.div layout className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {filtered.map((item, index) => (
              <motion.button
                type="button"
                key={item.id}
                layout={!reduce}
                initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                onClick={() => setSelected(index)}
                className={cn(
                  "group relative overflow-hidden rounded-lg border border-surface-200 bg-white text-left shadow-e1 transition-all duration-300 hover:-translate-y-1 hover:shadow-e3",
                  index === 0 && "sm:col-span-2 lg:col-span-1",
                )}
                aria-label={`${item.title} — perbesar`}
              >
                <Visual
                  src={item.images[0]}
                  alt={item.title}
                  label={item.title}
                  category={item.category?.slug}
                  ratio={index === 0 ? "video" : "square"}
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="rounded-none"
                  showLabel={false}
                  showMeta={false}
                  priority={index === 0}
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/10 to-transparent opacity-80 transition-opacity group-hover:opacity-95" />
                <div className="absolute inset-x-0 bottom-0 p-5">
                  <div className="flex items-end justify-between gap-3">
                    <div>
                      {item.category && (
                        <span className="font-mono text-[0.58rem] uppercase tracking-[0.18em] text-accent">
                          {item.category.name}
                        </span>
                      )}
                      <h3 className="mt-1 font-display text-lg font-bold leading-tight text-white">{item.title}</h3>
                      <p className="mt-1 text-xs text-white/60">
                        {[item.client, item.technique].filter(Boolean).join(" · ")}
                      </p>
                    </div>
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur transition group-hover:bg-accent group-hover:text-primary">
                      <Maximize2 className="h-3.5 w-3.5" aria-hidden />
                    </span>
                  </div>
                </div>
              </motion.button>
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      <AnimatePresence>
        {active && selected !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[80] flex items-center justify-center bg-primary/90 p-4 backdrop-blur-md"
            role="dialog"
            aria-modal="true"
            aria-label={active.title}
          >
            <button
              type="button"
              aria-label="Tutup"
              className="absolute inset-0 cursor-default"
              onClick={() => setSelected(null)}
            />

            <div className="relative w-full max-w-5xl">
              <div className="relative overflow-hidden rounded-xl border border-white/10 bg-primary-800 shadow-e3">
                <div className="relative aspect-[16/10] w-full">
                  {active.images[0] ? (
                    <Image
                      src={active.images[0]}
                      alt={active.title}
                      fill
                      sizes="90vw"
                      className="object-contain"
                      priority
                    />
                  ) : (
                    <Visual
                      category={active.category?.slug}
                      alt={active.title}
                      label={active.title}
                      className="h-full w-full"
                      showLabel={false}
                      showMeta={false}
                    />
                  )}
                </div>
              </div>

              <div className="mt-4 flex flex-col gap-3 text-white sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="font-mono text-[0.6rem] uppercase tracking-[0.18em] text-accent">
                    {active.category?.name ?? "Portofolio"}
                  </p>
                  <h3 className="mt-1 font-display text-2xl font-bold">{active.title}</h3>
                  <p className="mt-1 text-sm text-white/60">
                    {[active.client, active.technique].filter(Boolean).join(" · ")}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setSelected((selected - 1 + filtered.length) % filtered.length)}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-white transition hover:border-accent hover:text-accent"
                    aria-label="Sebelumnya"
                  >
                    <ArrowLeft className="h-4 w-4" aria-hidden />
                  </button>
                  <span className="font-mono text-xs text-white/50">
                    {selected + 1} / {filtered.length}
                  </span>
                  <button
                    type="button"
                    onClick={() => setSelected((selected + 1) % filtered.length)}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-white transition hover:border-accent hover:text-accent"
                    aria-label="Berikutnya"
                  >
                    <ArrowRight className="h-4 w-4" aria-hidden />
                  </button>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelected(null)}
                className="absolute -right-2 -top-12 flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-white transition hover:border-accent hover:text-accent sm:-right-12 sm:top-0"
                aria-label="Tutup"
              >
                <X className="h-5 w-5" aria-hidden />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
