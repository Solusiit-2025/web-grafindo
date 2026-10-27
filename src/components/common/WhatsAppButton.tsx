"use client";

import { useEffect, useState } from "react";
import { MessageCircle } from "lucide-react";
import { waLink } from "@/config/site";

export function WhatsAppButton({
  number,
  message,
  label = "Chat dengan Sales",
}: {
  number: string;
  message?: string;
  label?: string;
}) {
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setPulse(true), 5000);
    return () => window.clearTimeout(timer);
  }, []);

  if (!number) return null;

  return (
    <a
      href={waLink(number, message)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="group fixed bottom-5 right-5 z-50 flex items-center gap-0 rounded-full bg-[#25D366] p-3.5 text-white shadow-e3 transition-all duration-300 hover:gap-3 hover:pr-5 focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 sm:bottom-6 sm:right-6"
    >
      <MessageCircle className="h-6 w-6" aria-hidden />
      <span className="max-w-0 overflow-hidden whitespace-nowrap text-sm font-semibold opacity-0 transition-all duration-300 group-hover:max-w-[160px] group-hover:opacity-100">
        {label}
      </span>
      {pulse && <span className="absolute inset-0 -z-10 animate-pulse-ring rounded-full" aria-hidden />}
    </a>
  );
}

export default WhatsAppButton;
