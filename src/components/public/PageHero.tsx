import type { ReactNode } from "react";
import { Breadcrumb, type Crumb } from "@/components/ui/Breadcrumb";
import { cn } from "@/lib/utils/cn";

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
}) {
  return (
    <section className={cn("relative overflow-hidden border-b border-surface-200 bg-surface", className)}>
      <div className="pattern-grid-light pointer-events-none absolute inset-0 opacity-70" aria-hidden />
      <div className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-accent/10 blur-3xl" aria-hidden />
      <div className={cn("container-site relative py-10 md:py-14", align === "center" && "text-center")}>
        {crumbs && (
          <Breadcrumb items={crumbs} className={cn("mb-6", align === "center" && "justify-center")} />
        )}
        <div className={cn("flex flex-col gap-5 md:flex-row md:items-end md:justify-between", align === "center" && "md:flex-col md:items-center")}>
          <div className={cn("max-w-3xl", align === "center" && "mx-auto")}>
            {eyebrow && <p className="eyebrow">{eyebrow}</p>}
            <h1 className="mt-3 font-display text-display-md text-primary">{title}</h1>
            {lead && <p className="mt-4 max-w-2xl text-sm leading-relaxed text-neutral-600 md:text-base">{lead}</p>}
            {meta && <div className="mt-5">{meta}</div>}
          </div>
          {action && <div className="shrink-0">{action}</div>}
        </div>
      </div>
    </section>
  );
}
