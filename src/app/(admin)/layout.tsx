import { redirect } from "next/navigation";
import Link from "next/link";
import { ShieldAlert } from "lucide-react";
import { getAdminSession } from "@/lib/auth/session";
import { hasRole } from "@/lib/auth/rbac";
import { prisma } from "@/lib/db/prisma";
import { getLocale } from "@/lib/i18n/locale";
import { getMessages } from "@/i18n";
import { AdminShell } from "@/components/admin/AdminShell";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getAdminSession();

  if (!session) {
    redirect("/login?from=/admin/dashboard");
  }

  if (!hasRole(session.role, "EDITOR")) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface p-6">
        <div className="w-full max-w-md rounded-lg border border-surface-200 bg-white p-8 text-center shadow-e2">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-danger-50 text-danger">
            <ShieldAlert className="h-6 w-6" aria-hidden />
          </span>
          <h1 className="mt-5 font-display text-2xl font-bold text-primary">Akses ditolak</h1>
          <p className="mt-2 text-sm text-neutral-600">
            Role <span className="font-mono text-xs">{session.role}</span> tidak memiliki izin mengakses CMS.
            Hubungi administrator untuk peningkatan akses.
          </p>
          <Link href="/" className="btn-dark mt-6">
            Kembali ke situs
          </Link>
        </div>
      </div>
    );
  }

  const [user, locale] = await Promise.all([
    prisma.user.findUnique({ where: { id: session.userId }, select: { name: true, email: true } }),
    getLocale(),
  ]);
  const t = getMessages(locale);

  return (
    <AdminShell
      user={{
        name: user?.name ?? session.email,
        email: user?.email ?? session.email,
        role: session.role,
      }}
      labels={{ viewSite: t.admin.viewSite, logout: t.admin.logout, groups: t.admin.groups }}
    >
      {children}
    </AdminShell>
  );
}
