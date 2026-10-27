import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

export function SectionHeader({
  eyebrow,
  title,
  lead,
  action,
  align = "left",
  dark = false,
  className,
}: {
  eyebrow?: string;
  title: ReactNode;
  lead?: ReactNode;
  action?: ReactNode;
  align?: "left" | "center";
  dark?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-5 md:flex-row md:items-end md:justify-between",
        align === "center" && "md:flex-col md:items-center md:text-center",
        className,
      )}
    >
      <div className={cn("max-w-2xl", align === "center" && "mx-auto")}>
        {eyebrow && (
          <p className={cn("eyebrow", dark && "eyebrow-dark")}>
            <span className="accent-rule" aria-hidden />
            {eyebrow}
          </p>
        )}
        <h2 className={cn("mt-4 heading-2", dark && "text-white")}>{title}</h2>
        {lead && <p className={cn("mt-4 lead", dark && "text-white/65")}>{lead}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
