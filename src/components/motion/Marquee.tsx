import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

export function Marquee({
  children,
  reverse = false,
  className,
  ariaLabel,
}: {
  children: ReactNode;
  reverse?: boolean;
  className?: string;
  ariaLabel?: string;
}) {
  return (
    <div className={cn("marquee mask-fade-x overflow-hidden", className)} aria-label={ariaLabel}>
      <div className={cn("flex w-max items-center", reverse ? "marquee-track-reverse" : "marquee-track")}>
        <div className="flex shrink-0 items-center">{children}</div>
        <div className="flex shrink-0 items-center" aria-hidden>
          {children}
        </div>
      </div>
    </div>
  );
}
