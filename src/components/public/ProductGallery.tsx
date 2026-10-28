"use client";

import { useEffect, useState, ViewTransition } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Maximize2, X } from "lucide-react";
import { Visual } from "./Visual";
import { cn } from "@/lib/utils/cn";

export type GalleryImage = { id?: string; url: string; alt?: string | null };

export function ProductGallery({
  images,
  productName,
  category,
  productId,
}: {
  images: GalleryImage[];
  productName: string;
  category?: string | null;
  productId?: string;
}) {
  const [active, setActive] = useState(0);
  const [lightbox, setLightbox] = useState(false);

  const gallery =
    images.length > 0 ? images : [{ id: "fallback", url: "", alt: productName }];
  const current = gallery[Math.min(active, gallery.length - 1)];

  useEffect(() => {
    if (!lightbox) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setLightbox(false);
      if (event.key === "ArrowRight") setActive((index) => (index + 1) % gallery.length);
      if (event.key === "ArrowLeft") setActive((index) => (index - 1 + gallery.length) % gallery.length);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [lightbox, gallery.length]);

  return (
    <div>
      <div className="relative overflow-hidden rounded-lg border border-surface-200 bg-primary shadow-e1">
        <ViewTransition name={productId ? `product-image-${productId}` : undefined}>
          <button
            type="button"
            onClick={() => setLightbox(true)}
            className="group relative block aspect-square w-full overflow-hidden"
            aria-label={`Perbesar foto ${productName}`}
          >
            {current.url ? (
              <Image
                src={current.url}
                alt={current.alt ?? productName}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover transition-transform duration-700 ease-premium group-hover:scale-[1.05]"
              />
            ) : (
              <Visual
                category={category}
                alt={productName}
                label={productName}
                className="h-full w-full"
              />
            )}
            <span className="absolute bottom-3 right-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-primary shadow-e2 backdrop-blur transition group-hover:bg-accent">
              <Maximize2 className="h-4 w-4" aria-hidden />
            </span>
          </button>
        </ViewTransition>

        {gallery.length > 1 && (
          <>
            <button
              type="button"
              onClick={() => setActive((index) => (index - 1 + gallery.length) % gallery.length)}
              aria-label="Foto sebelumnya"
              className="absolute left-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-primary shadow-e2 backdrop-blur transition hover:bg-accent"
            >
              <ChevronLeft className="h-4 w-4" aria-hidden />
            </button>
            <button
              type="button"
              onClick={() => setActive((index) => (index + 1) % gallery.length)}
              aria-label="Foto berikutnya"
              className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-primary shadow-e2 backdrop-blur transition hover:bg-accent"
            >
              <ChevronRight className="h-4 w-4" aria-hidden />
            </button>
          </>
        )}
      </div>

      {gallery.length > 1 && (
        <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-5">
          {gallery.map((image, index) => (
            <button
              key={image.id ?? index}
              type="button"
              onClick={() => setActive(index)}
              aria-label={`Lihat foto ${index + 1}`}
              aria-current={index === active}
              className={cn(
                "relative aspect-square overflow-hidden rounded-sm border-2 transition",
                index === active ? "border-accent" : "border-transparent opacity-70 hover:opacity-100",
              )}
            >
              {image.url ? (
                <Image src={image.url} alt={image.alt ?? productName} fill sizes="80px" className="object-cover" />
              ) : (
                <Visual category={category} alt={productName} className="h-full w-full" />
              )}
            </button>
          ))}
        </div>
      )}

      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[90] flex items-center justify-center bg-primary/95 p-4 backdrop-blur"
            role="dialog"
            aria-modal="true"
            aria-label={productName}
          >
            <button type="button" aria-label="Tutup" className="absolute inset-0" onClick={() => setLightbox(false)} />
            <div className="relative aspect-square w-full max-w-3xl overflow-hidden rounded-lg">
              {current.url ? (
                <Image src={current.url} alt={current.alt ?? productName} fill sizes="90vw" className="object-contain" />
              ) : (
                <Visual category={category} alt={productName} label={productName} className="h-full w-full" />
              )}
            </div>
            <button
              type="button"
              onClick={() => setLightbox(false)}
              className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-white transition hover:border-accent hover:text-accent"
              aria-label="Tutup"
            >
              <X className="h-5 w-5" aria-hidden />
            </button>
            {gallery.length > 1 && (
              <div className="absolute bottom-6 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setActive((index) => (index - 1 + gallery.length) % gallery.length)}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-white hover:border-accent hover:text-accent"
                  aria-label="Foto sebelumnya"
                >
                  <ChevronLeft className="h-5 w-5" aria-hidden />
                </button>
                <span className="font-mono text-xs text-white/60">
                  {active + 1} / {gallery.length}
                </span>
                <button
                  type="button"
                  onClick={() => setActive((index) => (index + 1) % gallery.length)}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-white hover:border-accent hover:text-accent"
                  aria-label="Foto berikutnya"
                >
                  <ChevronRight className="h-5 w-5" aria-hidden />
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
