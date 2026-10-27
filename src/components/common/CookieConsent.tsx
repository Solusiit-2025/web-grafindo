"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Cookie } from "lucide-react";

const STORAGE_KEY = "grafindo.cookie-consent";

export function CookieConsent({ locale = "id" }: { locale?: "id" | "en" }) {
  const [visible, setVisible] = useState(false);
  const copy =
    locale === "en"
      ? "We use cookies to improve your experience."
      : "Kami menggunakan cookie untuk meningkatkan pengalaman Anda.";
  const learn = locale === "en" ? "Learn more" : "Pelajari";
  const accept = locale === "en" ? "Accept" : "Setuju";

  useEffect(() => {
    if (!window.localStorage.getItem(STORAGE_KEY)) setVisible(true);
  }, []);

  function handleAccept() {
    window.localStorage.setItem(STORAGE_KEY, "accepted");
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed inset-x-3 bottom-3 z-[60] sm:left-6 sm:right-auto sm:max-w-md">
      <div className="flex items-start gap-3 rounded-md border border-surface-300 bg-white/95 p-4 shadow-e3 backdrop-blur animate-fade-up">
        <Cookie className="mt-0.5 h-5 w-5 shrink-0 text-accent-700" aria-hidden />
        <div className="flex-1 text-xs leading-relaxed text-neutral-600">
          {copy}{" "}
          <Link href="/privacy" className="font-semibold text-primary underline underline-offset-2">
            {learn}
          </Link>
          .
        </div>
        <button type="button" onClick={handleAccept} className="btn-dark btn-sm shrink-0">
          {accept}
        </button>
      </div>
    </div>
  );
}
