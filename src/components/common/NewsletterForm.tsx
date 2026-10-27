"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { useToast } from "@/components/ui/Toast";

export function NewsletterForm({
  placeholder,
  cta,
  success,
}: {
  placeholder: string;
  cta: string;
  success: string;
}) {
  const { toast } = useToast();
  const [email, setEmail] = useState("");

  return (
    <form
      className="mt-4 flex items-center gap-2"
      onSubmit={(event) => {
        event.preventDefault();
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
          toast("Masukkan email yang valid.", "error");
          return;
        }
        toast(success, "success");
        setEmail("");
      }}
    >
      <label className="sr-only" htmlFor="newsletter-email">
        {placeholder}
      </label>
      <input
        id="newsletter-email"
        type="email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        placeholder={placeholder}
        className="min-w-0 flex-1 rounded-sm border border-white/15 bg-white/[0.04] px-3 py-2.5 text-sm text-white placeholder:text-white/35 focus:border-accent focus:outline-none"
      />
      <button
        type="submit"
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-sm bg-accent text-primary transition hover:bg-accent-300"
        aria-label={cta}
      >
        <ArrowRight className="h-4 w-4" aria-hidden />
      </button>
    </form>
  );
}
