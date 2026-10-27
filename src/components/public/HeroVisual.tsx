"use client";

import { BadgeCheck, Layers, ShieldCheck } from "lucide-react";
import { Visual } from "./Visual";

/**
 * Hero product showcase — a clean, structured bento layout:
 * one large Graphic Emblem plate + two supporting tiles (Soft Emblem, Sticker).
 * No tilt / rotation / floating: precise and professional.
 */
export function HeroVisual({
  labels,
  images,
}: {
  labels: { emblem: string; soft: string; sticker: string };
  images?: { emblem?: string; soft?: string; sticker?: string };
}) {
  return (
    <div className="relative ml-auto w-full max-w-[720px]" aria-hidden>
      <div className="pointer-events-none absolute -inset-6 rounded-[2rem] bg-accent/10 blur-3xl" />

      <div className="relative grid grid-cols-12 gap-3 sm:gap-4">
        {/* Main: Graphic Emblem */}
        <div className="group relative col-span-12 overflow-hidden rounded-2xl border border-white/10 bg-primary-800 shadow-2xl sm:col-span-8 sm:row-span-2">
          <Visual
            src={images?.emblem}
            category="emblems"
            alt={labels.emblem}
            label={labels.emblem}
            ratio="auto"
            sizes="(max-width: 1024px) 95vw, 480px"
            priority
            className="h-[300px] w-full rounded-none transition-transform duration-700 ease-premium group-hover:scale-[1.03] sm:h-full sm:min-h-[460px]"
            showLabel={false}
            showMeta={false}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-primary-900/85 via-transparent to-primary-900/20" />
          <div className="absolute inset-x-4 top-4 flex items-center justify-between">
            <span className="rounded-md border border-white/15 bg-primary-900/60 px-2.5 py-1 font-mono text-[0.6rem] uppercase tracking-[0.16em] text-white/80 backdrop-blur-md">
              Graphic Emblem
            </span>
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-accent text-primary shadow-lg">
              <BadgeCheck className="h-4 w-4" />
            </span>
          </div>
          <div className="absolute inset-x-4 bottom-4 flex items-end justify-between gap-3">
            <div>
              <p className="font-display text-lg font-bold text-white">{labels.emblem}</p>
              <p className="mt-0.5 text-xs text-white/60">3D precision · Custom die &amp; finishing</p>
            </div>
            <span className="hidden items-center gap-1.5 rounded-md bg-white/10 px-2.5 py-1.5 text-[0.65rem] font-medium text-white/85 backdrop-blur-md sm:inline-flex">
              <Layers className="h-3.5 w-3.5 text-accent" />
              MOQ 30 pcs
            </span>
          </div>
        </div>

        {/* Soft Emblem */}
        <div className="group relative col-span-6 overflow-hidden rounded-2xl border border-white/10 bg-primary-800 shadow-xl sm:col-span-4">
          <Visual
            src={images?.soft}
            category="soft-emblems"
            alt={labels.soft}
            label={labels.soft}
            ratio="square"
            sizes="(max-width: 1024px) 45vw, 230px"
            className="w-full rounded-none transition-transform duration-700 ease-premium group-hover:scale-[1.05]"
            showLabel={false}
            showMeta={false}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-primary-900/80 to-transparent" />
          <span className="absolute bottom-3 left-3 rounded-md bg-primary-900/60 px-2 py-1 font-mono text-[0.58rem] uppercase tracking-[0.14em] text-white/85 backdrop-blur-md">
            Soft Emblem · PVC
          </span>
        </div>

        {/* Sticker */}
        <div className="group relative col-span-6 overflow-hidden rounded-2xl border border-white/10 bg-primary-800 shadow-xl sm:col-span-4">
          <Visual
            src={images?.sticker}
            category="stickers"
            alt={labels.sticker}
            label={labels.sticker}
            ratio="square"
            sizes="(max-width: 1024px) 45vw, 230px"
            className="w-full rounded-none transition-transform duration-700 ease-premium group-hover:scale-[1.05]"
            showLabel={false}
            showMeta={false}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-primary-900/80 to-transparent" />
          <span className="absolute bottom-3 left-3 rounded-md bg-primary-900/60 px-2 py-1 font-mono text-[0.58rem] uppercase tracking-[0.14em] text-white/85 backdrop-blur-md">
            Sticker · Die-cut
          </span>
        </div>

        {/* QC strip */}
        <div className="col-span-12 flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 backdrop-blur-md">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent/15 text-accent">
            <ShieldCheck className="h-4 w-4" />
          </span>
          <span className="leading-tight">
            <span className="block font-mono text-[0.58rem] uppercase tracking-[0.16em] text-white/45">QC Verified</span>
            <span className="block text-xs font-semibold text-white/90">Automotive Standard · ISO 9001:2015</span>
          </span>
        </div>
      </div>
    </div>
  );
}
