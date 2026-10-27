"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCw } from "lucide-react";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-surface px-6 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-danger-50 text-danger">
        <AlertTriangle className="h-6 w-6" aria-hidden />
      </span>
      <p className="mt-5 font-mono text-[0.65rem] uppercase tracking-[0.2em] text-neutral-400">Unexpected error</p>
      <h1 className="mt-2 font-display text-3xl font-extrabold text-primary">Terjadi kesalahan</h1>
      <p className="mt-3 max-w-md text-sm leading-relaxed text-neutral-600">
        Kami gagal memuat halaman ini. Silakan coba lagi, atau kembali ke beranda.
      </p>
      <div className="mt-7 flex flex-col gap-2 sm:flex-row">
        <button type="button" onClick={reset} className="btn-dark">
          <RefreshCw className="h-4 w-4" aria-hidden />
          Coba lagi
        </button>
        <Link href="/" className="btn-outline">
          Kembali ke beranda
        </Link>
      </div>
    </div>
  );
}
