import Link from "next/link";
import { FileText, Plus, Search } from "lucide-react";
import { prisma } from "@/lib/db/prisma";
import { deleteBlogPostAction } from "./actions";
import { Badge, type BadgeTone } from "@/components/ui/Badge";
import { ButtonLink } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { ConfirmSubmit } from "@/components/ui/ConfirmSubmit";
import { formatDate } from "@/lib/utils/format";

const statusTone: Record<string, BadgeTone> = {
  PUBLISHED: "success",
  DRAFT: "warning",
  SCHEDULED: "steel",
};

export default async function AdminBlogPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const posts = await prisma.blogPost.findMany({
    where: q ? { title: { contains: q, mode: "insensitive" } } : undefined,
    include: { category: true, author: { select: { name: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[0.62rem] font-bold uppercase tracking-[0.16em] text-accent-700">Konten</p>
          <h1 className="mt-1.5 font-display text-2xl font-extrabold text-primary md:text-3xl">Blog & Artikel</h1>
          <p className="mt-1 text-sm text-neutral-500">{posts.length} artikel terdaftar.</p>
        </div>
        <ButtonLink href="/admin/blog/new" iconLeft={<Plus className="h-4 w-4" aria-hidden />}>
          Artikel Baru
        </ButtonLink>
      </div>

      <form action="/admin/blog" method="get" className="relative max-w-sm">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" aria-hidden />
        <input name="q" defaultValue={q ?? ""} placeholder="Cari judul artikel…" className="field py-2.5 pl-9" aria-label="Cari artikel" />
      </form>

      {posts.length === 0 ? (
        <EmptyState
          icon={FileText}
          title={q ? "Artikel tidak ditemukan" : "Belum ada artikel"}
          description={q ? "Coba kata kunci lain." : "Mulai dengan menulis artikel pertama."}
          action={<ButtonLink href="/admin/blog/new" variant="outline">Tulis artikel</ButtonLink>}
        />
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-surface">
                <tr>
                  <th className="px-4 py-3 text-left text-[0.62rem] uppercase tracking-[0.1em] text-neutral-400">Artikel</th>
                  <th className="px-4 py-3 text-left text-[0.62rem] uppercase tracking-[0.1em] text-neutral-400">Kategori</th>
                  <th className="px-4 py-3 text-left text-[0.62rem] uppercase tracking-[0.1em] text-neutral-400">Status</th>
                  <th className="px-4 py-3 text-left text-[0.62rem] uppercase tracking-[0.1em] text-neutral-400">Terbit</th>
                  <th className="px-4 py-3 text-right text-[0.62rem] uppercase tracking-[0.1em] text-neutral-400">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {posts.map((post) => (
                  <tr key={post.id} className="border-t border-surface-200">
                    <td className="px-4 py-3">
                      <span className="block text-xs font-semibold text-primary">{post.title}</span>
                      <span className="mt-0.5 block font-mono text-[0.6rem] text-neutral-400">
                        {post.slug} · {post.author?.name ?? "—"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-neutral-500">{post.category?.name ?? "—"}</td>
                    <td className="px-4 py-3">
                      <Badge tone={statusTone[post.status] ?? "neutral"} dot>{post.status}</Badge>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-[0.65rem] text-neutral-400">
                      {formatDate(post.publishedAt)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-3 text-xs">
                        <Link href={`/admin/blog/${post.id}`} className="font-medium text-secondary hover:underline">Edit</Link>
                        <ConfirmSubmit
                          action={deleteBlogPostAction.bind(null, post.id)}
                          title={`Hapus “${post.title}”?`}
                          description="Artikel akan dihapus permanen dari situs dan CMS."
                          confirmLabel="Hapus artikel"
                        >
                          Hapus
                        </ConfirmSubmit>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
