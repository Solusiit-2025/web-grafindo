"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowRight, Quote, Star } from "lucide-react";
import { initials } from "@/lib/utils/format";
import { cn } from "@/lib/utils/cn";

export type TestimonialItem = {
  id: string;
  name: string;
  role?: string | null;
  company?: string | null;
  quote: string;
  rating: number;
};

export function TestimonialCarousel({ items }: { items: TestimonialItem[] }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduce = useReducedMotion();
  const [direction, setDirection] = useState(1);

  useEffect(() => {
    if (items.length <= 1 || paused || reduce) return;
    const timer = window.setInterval(() => {
      setDirection(1);
      setIndex((current) => (current + 1) % items.length);
    }, 8000);
    return () => window.clearInterval(timer);
  }, [items.length, paused, reduce]);

  if (items.length === 0) return null;
  const active = items[index];

  function go(next: number) {
    setDirection(next > index ? 1 : -1);
    setIndex((next + items.length) % items.length);
  }

  return (
    <div
      className="relative overflow-hidden rounded-xl border border-surface-200 bg-white p-6 shadow-e1 sm:p-10"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-accent-50" aria-hidden />
      <Quote className="relative h-9 w-9 text-accent" aria-hidden />

      <div className="relative mt-6 min-h-[190px] sm:min-h-[170px]">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.figure
            key={active.id}
            custom={direction}
            initial={reduce ? { opacity: 0 } : { opacity: 0, x: direction * 36 }}
            animate={{ opacity: 1, x: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, x: direction * -36 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            <blockquote className="font-display text-lg font-medium leading-relaxed text-primary sm:text-2xl">
              “{active.quote}”
            </blockquote>

            <figcaption className="mt-6 flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-primary font-display text-sm font-bold text-accent">
                {initials(active.name)}
              </span>
              <span>
                <span className="block text-sm font-bold text-primary">{active.name}</span>
                <span className="block text-xs text-neutral-500">
                  {[active.role, active.company].filter(Boolean).join(" · ")}
                </span>
              </span>
              <span className="ml-auto hidden items-center gap-0.5 sm:flex" aria-label={`${active.rating} dari 5`}>
                {Array.from({ length: 5 }).map((_, star) => (
                  <Star
                    key={star}
                    className={cn("h-3.5 w-3.5", star < active.rating ? "fill-accent text-accent" : "text-surface-300")}
                    aria-hidden
                  />
                ))}
              </span>
            </figcaption>
          </motion.figure>
        </AnimatePresence>
      </div>

      <div className="relative mt-6 flex items-center justify-between border-t border-surface-200 pt-5">
        <div className="flex items-center gap-1.5">
          {items.map((item, dot) => (
            <button
              key={item.id}
              type="button"
              onClick={() => go(dot)}
              aria-label={`Testimoni ${dot + 1}`}
              aria-current={dot === index}
              className={cn(
                "h-1.5 rounded-full transition-all duration-300",
                dot === index ? "w-7 bg-accent" : "w-1.5 bg-surface-300 hover:bg-surface-400",
              )}
            />
          ))}
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => go(index - 1)}
            aria-label="Testimoni sebelumnya"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-surface-300 text-primary transition hover:border-accent hover:text-accent-700"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden />
          </button>
          <button
            type="button"
            onClick={() => go(index + 1)}
            aria-label="Testimoni berikutnya"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-surface-300 text-primary transition hover:border-accent hover:text-accent-700"
          >
            <ArrowRight className="h-4 w-4" aria-hidden />
          </button>
        </div>
      </div>
    </div>
  );
}
