"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Eye, EyeOff, Lock, Mail, ShieldCheck } from "lucide-react";
import type { Messages } from "@/i18n";

export function LoginForm({ from, t }: { from?: string; t: Messages["auth"] }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [visible, setVisible] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!response.ok) {
        setError(t.error);
        return;
      }
      router.push(from && from.startsWith("/admin") ? from : "/admin/dashboard");
      router.refresh();
    } catch {
      setError(t.error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {error && (
        <p className="rounded-sm border border-danger/20 bg-danger-50 px-3 py-2 text-xs font-medium text-danger" role="alert">
          {error}
        </p>
      )}

      <div>
        <label htmlFor="email" className="field-label">
          {t.email}
        </label>
        <div className="relative">
          <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" aria-hidden />
          <input
            id="email"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="field pl-10"
            placeholder="nama@grafindomitrasemesta.com"
          />
        </div>
      </div>

      <div>
        <label htmlFor="password" className="field-label">
          {t.password}
        </label>
        <div className="relative">
          <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" aria-hidden />
          <input
            id="password"
            type={visible ? "text" : "password"}
            required
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="field px-10"
            placeholder="••••••••"
          />
          <button
            type="button"
            onClick={() => setVisible((value) => !value)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 transition hover:text-primary"
            aria-label={visible ? "Sembunyikan password" : "Tampilkan password"}
          >
            {visible ? <EyeOff className="h-4 w-4" aria-hidden /> : <Eye className="h-4 w-4" aria-hidden />}
          </button>
        </div>
      </div>

      <button type="submit" disabled={loading} className="btn-dark w-full">
        {loading ? t.submitting : t.submit}
      </button>

      <div className="flex items-center justify-between gap-3 text-xs text-neutral-500">
        <span className="inline-flex items-center gap-1.5">
          <ShieldCheck className="h-3.5 w-3.5 text-accent-700" aria-hidden />
          JWT · RBAC
        </span>
        <Link href="/" className="inline-flex items-center gap-1 transition hover:text-primary">
          <ArrowLeft className="h-3 w-3" aria-hidden />
          {t.backToSite}
        </Link>
      </div>
    </form>
  );
}
