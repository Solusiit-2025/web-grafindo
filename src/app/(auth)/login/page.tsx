import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Check } from "lucide-react";
import { getAdminSession } from "@/lib/auth/session";
import { getLocale } from "@/lib/i18n/locale";
import { getMessages } from "@/i18n";
import { Logo } from "@/components/common/Logo";
import { LoginForm } from "@/components/admin/LoginForm";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Login CMS",
  robots: { index: false, follow: false },
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ from?: string; lang?: string }>;
}) {
  const { from, lang } = await searchParams;
  const session = await getAdminSession();
  if (session) redirect("/admin/dashboard");

  const locale = await getLocale(lang);
  const t = getMessages(locale);

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="relative hidden overflow-hidden bg-grad-hero p-12 text-white lg:flex lg:flex-col lg:justify-between">
        <div className="pattern-grid pointer-events-none absolute inset-0" aria-hidden />
        <div className="noise pointer-events-none absolute inset-0" aria-hidden />
        <div className="relative">
          <Logo variant="light" />
        </div>

        <div className="relative max-w-md">
          <p className="eyebrow eyebrow-dark">Content Management System</p>
          <h1 className="mt-4 font-display text-4xl font-extrabold leading-tight">
            Satu tempat untuk seluruh identitas brand Anda.
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-white/50">
            Kelola katalog, portofolio, konten, dan pipeline inquiry GRAFINDO dari satu dashboard.
          </p>
          <ul className="mt-8 space-y-3">
            {[
              "Produk & harga e-catalog terpusat",
              "Inquiry RFQ dengan status pipeline",
              "Konten bilingual ID / EN",
              "Akses berbasis role (RBAC)",
            ].map((item) => (
              <li key={item} className="flex items-center gap-2.5 text-sm text-white/60">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-accent/15 text-accent">
                  <Check className="h-3 w-3" aria-hidden />
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        <p className="relative text-[0.65rem] text-white/30">
          © {new Date().getFullYear()} {siteConfig.legalName} · Internal use only
        </p>
      </div>

      <div className="flex items-center justify-center bg-surface px-5 py-12 sm:px-10">
        <div className="w-full max-w-md">
          <div className="mb-8 lg:hidden">
            <Logo />
          </div>
          <div className="mb-7">
            <p className="eyebrow">Admin Access</p>
            <h2 className="mt-3 font-display text-3xl font-extrabold text-primary">{t.auth.title}</h2>
            <p className="mt-2 text-sm text-neutral-600">{t.auth.subtitle}</p>
          </div>

          <div className="rounded-lg border border-surface-200 bg-white p-6 shadow-e2 sm:p-8">
            <LoginForm from={from} t={t.auth} />
          </div>

          <p className="mt-6 text-center text-[0.65rem] leading-relaxed text-neutral-400">
            Dengan masuk, Anda menyetujui kebijakan keamanan internal GRAFINDO.
            <br />
            Akses tidak sah dapat dilaporkan.
          </p>
        </div>
      </div>
    </div>
  );
}
