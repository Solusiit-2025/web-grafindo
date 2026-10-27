import Image from "next/image";
import Link from "next/link";
import { ViewTransition } from "react";
import { ArrowUpRight, Layers, Timer } from "lucide-react";
import { Visual } from "./Visual";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils/cn";

export type ProductCardData = {
  id: string;
  name: string;
  slug: string;
  moq?: number | null;
  leadTime?: string | null;
  category?: { name: string; slug: string } | null;
  images?: { url: string; alt?: string | null }[];
  price?: number | null;
  isCustom?: boolean;
};

export function ProductCard({
  product,
  locale = "id",
  className,
}: {
  product: ProductCardData;
  locale?: "id" | "en";
  className?: string;
}) {
  const images = product.images ?? [];
  const primary = images[0]?.url;
  const secondary = images[1]?.url;

  return (
    <article className={cn("group card card-hover flex h-full min-w-0 flex-col overflow-hidden", className)}>
      <Link href={`/products/${product.slug}`} className="relative block" aria-label={product.name}>
        <ViewTransition name={`product-image-${product.id}`}>
          <div className="relative">
            <Visual
              src={primary}
              alt={product.name}
              label={product.name}
              category={product.category?.slug ?? product.category?.name}
              ratio="square"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              className="rounded-b-none"
              showLabel={false}
              showMeta={false}
            />
            {secondary && (
              <div className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                <Image
                  src={secondary}
                  alt={images[1]?.alt ?? product.name}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover"
                />
              </div>
            )}
          </div>
        </ViewTransition>
        <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
          {product.category && <Badge tone="dark">{product.category.name}</Badge>}
          {product.isCustom && <Badge tone="gold">Custom</Badge>}
        </div>
        <span className="absolute right-3 top-3 flex h-8 w-8 translate-y-1 items-center justify-center rounded-full bg-white/95 text-primary opacity-0 shadow-e2 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <ArrowUpRight className="h-4 w-4" aria-hidden />
        </span>
      </Link>

      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <h3 className="break-words font-display text-base font-bold leading-snug text-primary sm:text-[1.05rem]">
          <Link href={`/products/${product.slug}`} className="transition hover:text-accent-700">
            {product.name}
          </Link>
        </h3>

        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[0.7rem] text-neutral-500">
          {product.moq != null && (
            <span className="inline-flex items-center gap-1">
              <Layers className="h-3.5 w-3.5 text-accent-700" aria-hidden />
              MOQ {product.moq}
            </span>
          )}
          {product.leadTime && (
            <span className="inline-flex items-center gap-1">
              <Timer className="h-3.5 w-3.5 text-accent-700" aria-hidden />
              {product.leadTime}
            </span>
          )}
        </div>

        <div className="mt-auto flex flex-wrap items-end justify-between gap-2 pt-4">
          {product.price ? (
            <p className="font-mono text-sm font-medium text-primary">
              Rp {new Intl.NumberFormat(locale === "en" ? "en-US" : "id-ID").format(product.price)}
              <span className="ml-1 font-sans text-[0.65rem] font-normal text-neutral-400">/ unit</span>
            </p>
          ) : (
            <p className="text-[0.68rem] font-medium uppercase tracking-[0.12em] text-neutral-400">
              {locale === "en" ? "Price on request" : "Harga sesuai spesifikasi"}
            </p>
          )}
          <Link
            href={`/products/${product.slug}`}
            className="text-[0.7rem] font-semibold text-secondary transition hover:text-accent-700"
          >
            {locale === "en" ? "Detail" : "Detail"} →
          </Link>
        </div>
      </div>
    </article>
  );
}
