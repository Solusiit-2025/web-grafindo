import { ShieldCheck, UserPlus, Users } from "lucide-react";
import { prisma } from "@/lib/db/prisma";
import { Badge, type BadgeTone } from "@/components/ui/Badge";
import { formatDate } from "@/lib/utils/format";
import { createUserAction } from "./actions";

const roleTone: Record<string, BadgeTone> = {
  SUPER_ADMIN: "gold",
  ADMIN: "steel",
  EDITOR: "success",
  SALES: "warning",
  CUSTOMER: "neutral",
};

export default async function AdminUsersPage() {
  const users = await prisma.user.findMany({ orderBy: { createdAt: "asc" } });

  return (
    <div className="space-y-5">
      <div>
        <p className="text-[0.62rem] font-bold uppercase tracking-[0.16em] text-accent-700">Pengaturan</p>
        <h1 className="mt-1.5 font-display text-2xl font-extrabold text-primary md:text-3xl">Pengguna CMS</h1>
        <p className="mt-1 text-sm text-neutral-500">Kelola akses tim berdasarkan role (RBAC).</p>
      </div>

      <div className="grid gap-4 xl:grid-cols-12">
        <div className="card overflow-hidden xl:col-span-8">
          <div className="flex items-center justify-between border-b border-surface-200 px-5 py-4">
            <h2 className="font-display text-base font-bold text-primary">Daftar pengguna</h2>
            <span className="font-mono text-xs text-neutral-400">{users.length}</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-surface">
                <tr>
                  <th className="px-4 py-3 text-left text-[0.62rem] uppercase tracking-[0.1em] text-neutral-400">Nama</th>
                  <th className="px-4 py-3 text-left text-[0.62rem] uppercase tracking-[0.1em] text-neutral-400">Email</th>
                  <th className="px-4 py-3 text-left text-[0.62rem] uppercase tracking-[0.1em] text-neutral-400">Role</th>
                  <th className="px-4 py-3 text-right text-[0.62rem] uppercase tracking-[0.1em] text-neutral-400">Dibuat</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-t border-surface-200">
                    <td className="px-4 py-3 text-xs font-semibold text-primary">{user.name}</td>
                    <td className="px-4 py-3 font-mono text-[0.65rem] text-neutral-500">{user.email}</td>
                    <td className="px-4 py-3">
                      <Badge tone={roleTone[user.role] ?? "neutral"} dot>
                        {user.role.replace("_", " ")}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-right text-[0.65rem] text-neutral-400">{formatDate(user.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="card h-fit p-5 xl:col-span-4">
          <h2 className="flex items-center gap-2 font-display text-base font-bold text-primary">
            <UserPlus className="h-4 w-4 text-accent-700" aria-hidden />
            Tambah pengguna
          </h2>
          <form action={createUserAction} className="mt-4 space-y-3">
            <div>
              <label htmlFor="user-name" className="field-label text-xs">Nama</label>
              <input id="user-name" name="name" required className="field py-2 text-xs" />
            </div>
            <div>
              <label htmlFor="user-email" className="field-label text-xs">Email</label>
              <input id="user-email" name="email" type="email" required className="field py-2 text-xs" />
            </div>
            <div>
              <label htmlFor="user-password" className="field-label text-xs">Password (min. 8 karakter)</label>
              <input id="user-password" name="password" type="password" required minLength={8} className="field py-2 text-xs" />
            </div>
            <div>
              <label htmlFor="user-role" className="field-label text-xs">Role</label>
              <select id="user-role" name="role" className="field py-2 text-xs" defaultValue="EDITOR">
                {["EDITOR", "SALES", "ADMIN", "SUPER_ADMIN", "CUSTOMER"].map((role) => (
                  <option key={role} value={role}>{role.replace("_", " ")}</option>
                ))}
              </select>
            </div>
            <button type="submit" className="btn-dark btn-sm w-full">Tambah pengguna</button>
          </form>
          <div className="mt-4 flex items-start gap-2 rounded-sm bg-surface p-3 text-[0.65rem] leading-relaxed text-neutral-500">
            <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent-700" aria-hidden />
            Password di-hash dengan bcrypt. Sesi menggunakan JWT httpOnly 7 hari.
          </div>
        </div>
      </div>

      <div className="card p-5">
        <h2 className="flex items-center gap-2 font-display text-base font-bold text-primary">
          <Users className="h-4 w-4 text-accent-700" aria-hidden />
          Matriks akses
        </h2>
        <div className="mt-4 grid gap-2 text-xs sm:grid-cols-2 lg:grid-cols-5">
          {[
            { role: "CUSTOMER", access: "Portal publik" },
            { role: "SALES", access: "Inquiry & pipeline" },
            { role: "EDITOR", access: "Konten & katalog" },
            { role: "ADMIN", access: "Seluruh modul + pengaturan" },
            { role: "SUPER_ADMIN", access: "Akses penuh" },
          ].map((item) => (
            <div key={item.role} className="rounded-md border border-surface-200 p-3">
              <p className="font-mono text-[0.6rem] font-semibold text-primary">{item.role}</p>
              <p className="mt-1 text-[0.65rem] text-neutral-500">{item.access}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
