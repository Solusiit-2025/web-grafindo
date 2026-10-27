import type { ReactNode } from "react";
import { Breadcrumb, type Crumb } from "@/components/ui/Breadcrumb";
import { cn } from "@/lib/utils/cn";

/** Kept for backwards compatibility with existing pages; all variants now share the industrial look. */
export type PageHeroTexture = "linen" | "canvas" | "twill" | "silk" | "craft" | "oxford" | "bookcloth";

export function PageHero({
  eyebrow,
  title,
  lead,
  crumbs,
  action,
  meta,
  className,
  align = "left",
}: {
  eyebrow?: string;
  title: string;
  lead?: string;
  crumbs?: Crumb[];
  action?: ReactNode;
  meta?: ReactNode;
  className?: string;
  align?: "left" | "center";
  texture?: PageHeroTexture;
}) {
  return (
    <section className={cn("surface-industrial relative overflow-hidden text-white", className)}>
      <div className="pattern-grid pointer-events-none absolute inset-0" aria-hidden />
      <div className="pointer-events-none absolute -right-32 -top-24 h-[420px] w-[420px] rounded-full bg-accent/10 blur-3xl" aria-hidden />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-accent/50 to-transparent" aria-hidden />
      <div className={cn("container-site relative py-14 md:py-20", align === "center" && "text-center")}>
        {crumbs && (
          <Breadcrumb
            items={crumbs}
            className={cn(
              "mb-7 text-white/55 [&_[aria-current=page]]:text-white [&_a:hover]:text-accent [&_svg]:text-white/30",
              align === "center" && "justify-center",
            )}
          />
        )}
        <div className={cn("flex flex-col gap-6 md:flex-row md:items-end md:justify-between", align === "center" && "md:flex-col md:items-center")}>
          <div className={cn("max-w-3xl", align === "center" && "mx-auto")}>
            {eyebrow && (
              <p className="eyebrow eyebrow-dark">
                <span className="accent-rule" aria-hidden />
                {eyebrow}
              </p>
            )}
            <h1 className="mt-4 font-display text-display-md text-white">{title}</h1>
            {lead && <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/70 md:text-base">{lead}</p>}
            {meta && <div className="mt-6">{meta}</div>}
          </div>
          {action && <div className="shrink-0">{action}</div>}
        </div>
      </div>
    </section>
  );
}
