"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { useToast } from "./Toast";
import { cn } from "@/lib/utils/cn";

export function CopyButton({ value, label = "Salin", className }: { value: string; label?: string; className?: string }) {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      toast("Tersalin ke clipboard", "success");
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      toast("Gagal menyalin. Salin manual: " + value, "error");
    }
  }

  return (
    <button type="button" onClick={copy} className={cn("btn-outline btn-sm", className)}>
      {copied ? <Check className="h-3.5 w-3.5" aria-hidden /> : <Copy className="h-3.5 w-3.5" aria-hidden />}
      {copied ? "Tersalin" : label}
    </button>
  );
}
