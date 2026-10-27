"use client";

import { useRef } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "framer-motion";
import { BadgeCheck, Layers, ShieldCheck } from "lucide-react";
import { Visual } from "./Visual";

export function HeroVisual({
  labels,
  images,
}: {
  labels: { emblem: string; soft: string; sticker: string };
  images?: { emblem?: string; soft?: string; sticker?: string };
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 120, damping: 20 });
  const springY = useSpring(y, { stiffness: 120, damping: 20 });
  const rotateX = useTransform(springY, [-0.5, 0.5], [4, -4]);
  const rotateY = useTransform(springX, [-0.5, 0.5], [-5, 5]);

  function onMove(event: React.MouseEvent<HTMLDivElement>) {
    if (reduce) return;
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    x.set((event.clientX - rect.left) / rect.width - 0.5);
    y.set((event.clientY - rect.top) / rect.height - 0.5);
  }

  function onLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className="relative mx-auto w-full max-w-[560px]"
      aria-hidden
    >
      <div className="pointer-events-none absolute -inset-8 rounded-full bg-accent/15 blur-3xl" />

      <motion.div
        style={reduce ? undefined : { rotateX, rotateY, transformPerspective: 1000 }}
        className="relative"
      >
        {/* Main emblem card */}
        <div className="relative ml-auto w-[76%] rotate-[-3deg] overflow-hidden rounded-xl border border-white/10 bg-primary-800 shadow-e3">
          <Visual
            src={images?.emblem}
            category="emblems"
            alt={labels.emblem}
            label={labels.emblem}
            ratio="video"
            sizes="(max-width: 1024px) 70vw, 420px"
            priority
            className="rounded-none"
            showLabel={false}
            showMeta={false}
          />
          <div className="absolute inset-x-4 top-4 flex items-center justify-between">
            <span className="rounded-full border border-white/15 bg-black/30 px-2.5 py-1 font-mono text-[0.55rem] uppercase tracking-[0.16em] text-white/70 backdrop-blur">
              Premium line
            </span>
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-accent text-primary">
              <BadgeCheck className="h-4 w-4" />
            </span>
          </div>
        </div>

        {/* Sticker card */}
        <div className="absolute -left-2 top-8 w-[44%] rotate-[5deg] overflow-hidden rounded-lg border border-white/10 bg-primary-800 shadow-e3 animate-float">
          <Visual
            src={images?.sticker}
            category="stickers"
            alt={labels.sticker}
            label={labels.sticker}
            ratio="square"
            sizes="(max-width: 1024px) 40vw, 240px"
            className="rounded-none"
            showLabel={false}
            showMeta={false}
          />
        </div>

        {/* Soft emblem card */}
        <div
          className="absolute -bottom-6 left-8 w-[48%] rotate-[-6deg] overflow-hidden rounded-lg border border-white/10 bg-primary-800 shadow-e3 animate-float"
          style={{ animationDelay: "1.4s" }}
        >
          <Visual
            src={images?.soft}
            category="soft-emblems"
            alt={labels.soft}
            label={labels.soft}
            ratio="video"
            sizes="(max-width: 1024px) 45vw, 260px"
            className="rounded-none"
            showLabel={false}
            showMeta={false}
          />
        </div>

        {/* QC stamp */}
        <div className="absolute -right-3 bottom-0 flex items-center gap-2 rounded-md border border-white/10 bg-primary/90 px-3 py-2 shadow-e2 backdrop-blur">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-accent/15 text-accent">
            <ShieldCheck className="h-4 w-4" />
          </span>
          <span className="leading-tight">
            <span className="block font-mono text-[0.55rem] uppercase tracking-[0.15em] text-white/40">QC</span>
            <span className="block text-[0.68rem] font-semibold text-white/85">Batch verified</span>
          </span>
        </div>
      </motion.div>

      <div className="absolute -left-6 -top-6 hidden items-center gap-2 rounded-md border border-white/10 bg-white/[0.04] px-3 py-2 text-[0.62rem] font-medium text-white/65 backdrop-blur sm:flex">
        <Layers className="h-3.5 w-3.5 text-accent" />
        MOQ 30 pcs
      </div>
    </div>
  );
}
