import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils/cn";
import { siteConfig } from "@/config/site";

export function LogoMark({
  className,
  variant = "dark",
}: {
  className?: string;
  variant?: "dark" | "light";
}) {
  return (
    <Image
      src="/icons/logo.png"
      alt="GRAFINDO"
      width={1224}
      height={816}
      unoptimized
      loading="eager"
      className={cn("h-10 w-auto shrink-0", className)}
      data-variant={variant}
    />
  );
}

export function Logo({
  href = "/",
  className,
  variant = "dark",
  compact = false,
  showTagline = true,
}: {
  href?: string | null;
  className?: string;
  variant?: "dark" | "light";
  compact?: boolean;
  showTagline?: boolean;
}) {
  const content = (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <LogoMark variant={variant} className="h-11 w-auto shrink-0" />
      {!compact && (
        <span className="flex flex-col leading-none">
          <span
            className={cn(
              "font-display text-[1.4rem] font-extrabold tracking-[-0.04em]",
              variant === "light" ? "text-white" : "text-primary",
            )}
          >
            {siteConfig.wordmark}
          </span>
          {showTagline && (
            <span
              className={cn(
                "mt-1 font-sans text-[0.54rem] font-semibold uppercase tracking-[0.2em]",
                variant === "light" ? "text-white/45" : "text-neutral-500",
              )}
            >
              MITRASEMESTA
            </span>
          )}
        </span>
      )}
    </span>
  );

  if (!href) return content;

  return (
    <Link href={href} className="group inline-flex items-center" aria-label={`${siteConfig.name} — beranda`}>
      {content}
    </Link>
  );
}
