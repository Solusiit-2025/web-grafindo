import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export type Crumb = { label: string; href?: string };

export function Breadcrumb({ items, className }: { items: Crumb[]; className?: string }) {
  return (
    <nav aria-label="Breadcrumb" className={cn("flex flex-wrap items-center gap-1.5 text-xs text-neutral-500", className)}>
      <Link href="/" className="inline-flex items-center gap-1 transition hover:text-primary" aria-label="Beranda">
        <Home className="h-3.5 w-3.5" aria-hidden />
      </Link>
      {items.map((item, index) => (
        <span key={`${item.label}-${index}`} className="inline-flex items-center gap-1.5">
          <ChevronRight className="h-3 w-3 text-surface-400" aria-hidden />
          {item.href ? (
            <Link href={item.href} className="transition hover:text-primary">
              {item.label}
            </Link>
          ) : (
            <span className="font-medium text-primary" aria-current="page">
              {item.label}
            </span>
          )}
        </span>
      ))}
    </nav>
  );
}
