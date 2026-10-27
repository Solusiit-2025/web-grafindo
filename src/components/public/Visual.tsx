import Image from "next/image";
import { cn } from "@/lib/utils/cn";

type VisualProps = {
  src?: string | null;
  alt: string;
  label?: string;
  category?: string | null;
  className?: string;
  imageClassName?: string;
  sizes?: string;
  priority?: boolean;
  ratio?: "square" | "video" | "portrait" | "wide" | "auto";
  showLabel?: boolean;
  showMeta?: boolean;
};

const ratioClass = {
  square: "aspect-square",
  video: "aspect-[4/3]",
  portrait: "aspect-[3/4]",
  wide: "aspect-[16/9]",
  auto: "",
};

const palettes: Record<string, { bg: string; stroke: string; glow: string; ink: string }> = {
  stickers: {
    bg: "linear-gradient(140deg,#1B1E25 0%,#0F1115 55%,#241F15 100%)",
    stroke: "#C9A24B",
    glow: "rgba(201,162,75,.35)",
    ink: "#E2C67F",
  },
  graphics: {
    bg: "linear-gradient(140deg,#16293F 0%,#0F1115 60%,#1F3A5F 100%)",
    stroke: "#7FA3CC",
    glow: "rgba(127,163,204,.3)",
    ink: "#DCE8F4",
  },
  emblems: {
    bg: "linear-gradient(140deg,#22262F 0%,#0F1115 50%,#2C2417 100%)",
    stroke: "#E2C67F",
    glow: "rgba(226,198,127,.35)",
    ink: "#F4E8C8",
  },
  "soft-emblems": {
    bg: "linear-gradient(140deg,#1D2A25 0%,#0F1115 60%,#2A2418 100%)",
    stroke: "#9CC3A8",
    glow: "rgba(156,195,168,.28)",
    ink: "#E6F0E9",
  },
  default: {
    bg: "linear-gradient(140deg,#1B1E25 0%,#0F1115 60%,#241F15 100%)",
    stroke: "#C9A24B",
    glow: "rgba(201,162,75,.3)",
    ink: "#E2C67F",
  },
};

function normalizeCategory(category?: string | null) {
  const value = (category ?? "").toLowerCase();
  if (value.includes("sticker")) return "stickers";
  if (value.includes("graphic")) return "graphics";
  if (value.includes("soft")) return "soft-emblems";
  if (value.includes("emblem")) return "emblems";
  return "default";
}

function FallbackArt({ kind, label, showMeta = true }: { kind: string; label?: string; showMeta?: boolean }) {
  const palette = palettes[kind] ?? palettes.default;

  return (
    <div className="absolute inset-0" style={{ background: palette.bg }}>
      <div
        className="absolute inset-0 opacity-70"
        style={{
          background: `radial-gradient(70% 60% at 70% 15%, ${palette.glow}, transparent 65%)`,
        }}
      />
      <div
        className="absolute inset-0 opacity-[0.14]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(135deg, rgba(255,255,255,.3) 0 1px, transparent 1px 22px)",
          maskImage: "radial-gradient(ellipse at 50% 40%, black 20%, transparent 78%)",
        }}
      />
      <svg viewBox="0 0 400 400" className="absolute inset-0 h-full w-full" aria-hidden>
        <defs>
          <linearGradient id={`fallback-${kind}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={palette.ink} stopOpacity="0.95" />
            <stop offset="100%" stopColor={palette.stroke} stopOpacity="0.35" />
          </linearGradient>
        </defs>

        {kind === "stickers" && (
          <g transform="translate(200 196)">
            <rect x="-92" y="-92" width="184" height="184" rx="38" transform="rotate(-12)" fill="none" stroke={`url(#fallback-${kind})`} strokeWidth="2" />
            <rect x="-72" y="-72" width="144" height="144" rx="28" transform="rotate(7)" fill="none" stroke={palette.stroke} strokeWidth="1" opacity="0.55" />
            <path d="M-34 -6h68M-34 18h44" stroke={palette.ink} strokeWidth="7" strokeLinecap="round" opacity="0.8" />
            <circle cx="52" cy="-52" r="12" fill={palette.stroke} opacity="0.5" />
          </g>
        )}

        {kind === "graphics" && (
          <g transform="translate(200 196)">
            <rect x="-120" y="-76" width="240" height="152" rx="18" fill="none" stroke={palette.stroke} strokeWidth="1.4" opacity="0.6" />
            <path d="M-96 34 0 -48 96 34" fill="none" stroke={`url(#fallback-${kind})`} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M-40 34V-4h80v38" fill="none" stroke={palette.ink} strokeWidth="2" opacity="0.5" />
            <circle cx="-96" cy="-76" r="5" fill={palette.stroke} />
            <circle cx="96" cy="-76" r="5" fill={palette.stroke} />
          </g>
        )}

        {kind === "emblems" && (
          <g transform="translate(200 196)">
            <path d="M0 -112 97 -56v112L0 112-97 56v-112z" fill="none" stroke={`url(#fallback-${kind})`} strokeWidth="3" />
            <path d="M0 -82 71 -41v82L0 82-71 41v-82z" fill="none" stroke={palette.stroke} strokeWidth="1" opacity="0.7" />
            <path d="M0 -46 40 -23v46L0 46-40 23v-46z" fill={palette.stroke} opacity="0.14" />
            <path d="M-22 -6h44M-22 16h28" stroke={palette.ink} strokeWidth="6" strokeLinecap="round" />
          </g>
        )}

        {kind === "soft-emblems" && (
          <g transform="translate(200 196)">
            <circle r="96" fill="none" stroke={`url(#fallback-${kind})`} strokeWidth="2.5" />
            <circle r="78" fill="none" stroke={palette.stroke} strokeWidth="1" strokeDasharray="5 7" opacity="0.7" />
            <circle r="58" fill={palette.stroke} opacity="0.12" />
            <path d="M-32 -20c0-18 14-32 32-32s32 14 32 32v24c0 18-14 32-32 32s-32-14-32-32z" fill="none" stroke={palette.ink} strokeWidth="2.5" />
            <path d="M-14 0h28M-14 16h18" stroke={palette.ink} strokeWidth="4" strokeLinecap="round" opacity="0.75" />
          </g>
        )}

        {kind === "default" && (
          <g transform="translate(200 196)">
            <circle r="96" fill="none" stroke={`url(#fallback-${kind})`} strokeWidth="2" />
            <path d="M-34 -30h52a0 0 0 0 1 0 0v10a34 34 0 0 1-34 34h-18z" fill="none" stroke={palette.ink} strokeWidth="4" />
            <path d="M-18 14v26" stroke={palette.ink} strokeWidth="4" strokeLinecap="round" />
          </g>
        )}
      </svg>

      {showMeta && (
        <div className="absolute inset-x-4 bottom-4 flex items-end justify-between gap-3">
          <div className="min-w-0">
            <p className="font-mono text-[0.6rem] uppercase tracking-[0.18em] text-white/45">GRAFINDO · In-house</p>
            {label && <p className="mt-1 truncate font-display text-sm font-semibold text-white/90">{label}</p>}
          </div>
        </div>
      )}
    </div>
  );
}

export function Visual({
  src,
  alt,
  label,
  category,
  className,
  imageClassName,
  sizes = "(max-width: 768px) 100vw, 33vw",
  priority = false,
  ratio = "auto",
  showLabel = true,
  showMeta = true,
}: VisualProps) {
  const kind = normalizeCategory(category);
  const hasImage = Boolean(src && src.trim().length > 0);

  return (
    <div className={cn("relative overflow-hidden bg-primary", ratioClass[ratio], className)}>
      {hasImage ? (
        <Image
          src={src as string}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          className={cn("object-cover transition-transform duration-500 ease-premium group-hover:scale-[1.04]", imageClassName)}
        />
      ) : (
        <div role="img" aria-label={`${alt} — ilustrasi GRAFINDO`} className="absolute inset-0">
          <FallbackArt kind={kind} label={showLabel ? (label ?? alt) : undefined} showMeta={showMeta} />
        </div>
      )}
    </div>
  );
}
