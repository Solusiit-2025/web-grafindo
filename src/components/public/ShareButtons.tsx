"use client";

import { useEffect, useState } from "react";
import { Check, Copy, Facebook, Linkedin, Share2 } from "lucide-react";
import { useToast } from "@/components/ui/Toast";

export function ShareButtons({ title, path }: { title: string; path: string }) {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  const [url, setUrl] = useState(path);

  useEffect(() => {
    setUrl(new URL(path, window.location.origin).toString());
  }, [path]);

  async function share() {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title, url });
        return;
      } catch {
        // fall through to copy
      }
    }
    await copy();
  }

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast("Tautan artikel tersalin.", "success");
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      toast("Gagal menyalin tautan.", "error");
    }
  }

  return (
    <div className="flex items-center gap-2">
      <span className="mr-1 text-[0.6rem] font-semibold uppercase tracking-[0.14em] text-neutral-400">Share</span>
      <button type="button" onClick={share} aria-label="Bagikan artikel" className="flex h-8 w-8 items-center justify-center rounded-full border border-surface-300 text-neutral-500 transition hover:border-accent hover:text-accent-700">
        <Share2 className="h-3.5 w-3.5" aria-hidden />
      </button>
      <a
        href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Bagikan ke Facebook"
        className="flex h-8 w-8 items-center justify-center rounded-full border border-surface-300 text-neutral-500 transition hover:border-accent hover:text-accent-700"
      >
        <Facebook className="h-3.5 w-3.5" aria-hidden />
      </a>
      <a
        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Bagikan ke LinkedIn"
        className="flex h-8 w-8 items-center justify-center rounded-full border border-surface-300 text-neutral-500 transition hover:border-accent hover:text-accent-700"
      >
        <Linkedin className="h-3.5 w-3.5" aria-hidden />
      </a>
      <button type="button" onClick={copy} aria-label="Salin tautan" className="flex h-8 w-8 items-center justify-center rounded-full border border-surface-300 text-neutral-500 transition hover:border-accent hover:text-accent-700">
        {copied ? <Check className="h-3.5 w-3.5" aria-hidden /> : <Copy className="h-3.5 w-3.5" aria-hidden />}
      </button>
    </div>
  );
}
