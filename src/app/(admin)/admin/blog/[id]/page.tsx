import Link from "next/link";
import { ArrowLeft, Save, Trash2 } from "lucide-react";
import { prisma } from "@/lib/db/prisma";
import { updateBlogPostAction, deleteBlogPostAction } from "../actions";
import { ConfirmSubmit } from "@/components/ui/ConfirmSubmit";

export default async function EditBlogPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const post = await prisma.blogPost.findUnique({ where: { id } });
  if (!post) {
    return <p className="rounded-lg border border-dashed border-surface-300 p-8 text-center text-sm text-neutral-500">Artikel tidak ditemukan.</p>;
  }

  return (
    <div className="space-y-5">
      <div>
        <Link href="/admin/blog" className="inline-flex items-center gap-1 text-xs font-medium text-neutral-500 transition hover:text-primary">
          <ArrowLeft className="h-3.5 w-3.5" aria-hidden />
          Kembali ke artikel
        </Link>
        <h1 className="mt-2 font-display text-2xl font-extrabold text-primary md:text-3xl">{post.title}</h1>
        <p className="mt-1 font-mono text-xs text-neutral-400">{post.slug}</p>
      </div>

      <form action={updateBlogPostAction.bind(null, id)} className="grid gap-4 xl:grid-cols-12">
        <div className="card space-y-4 p-5 xl:col-span-8">
          <div>
            <label htmlFor="be-title" className="field-label">Judul</label>
            <input id="be-title" name="title" defaultValue={post.title} required className="field" />
          </div>
          <div>
            <label htmlFor="be-slug" className="field-label">Slug</label>
            <input id="be-slug" name="slug" defaultValue={post.slug} required className="field font-mono text-xs" />
          </div>
          <div>
            <label htmlFor="be-content" className="field-label">Konten</label>
            <textarea id="be-content" name="content" defaultValue={post.content} required rows={18} className="field resize-y font-mono text-xs" />
          </div>
        </div>

        <aside className="space-y-4 xl:col-span-4">
          <div className="card h-fit p-5">
            <h2 className="font-display text-base font-bold text-primary">Publikasi</h2>
            <div className="mt-4">
              <label htmlFor="be-status" className="field-label">Status</label>
              <select id="be-status" name="status" defaultValue={post.status} className="field">
                <option value="DRAFT">Draft</option>
                <option value="PUBLISHED">Published</option>
                <option value="SCHEDULED">Scheduled</option>
              </select>
            </div>
            <button type="submit" className="btn-dark mt-4 w-full">
              <Save className="h-4 w-4" aria-hidden />
              Update artikel
            </button>
            <Link
              href={`/admin/translations?entityType=BlogPost&entityId=${id}&field=title`}
              className="btn-ghost btn-sm mt-1 w-full justify-center px-3"
            >
              Terjemahan EN →
            </Link>
          </div>

          <div className="card p-5">
            <h2 className="flex items-center gap-2 font-display text-base font-bold text-primary">
              <Trash2 className="h-4 w-4 text-danger" aria-hidden />
              Zona bahaya
            </h2>
            <p className="mt-1.5 text-[0.65rem] leading-relaxed text-neutral-500">
              Hapus artikel secara permanen. Tindakan ini tidak dapat dibatalkan.
            </p>
            <ConfirmSubmit
              action={deleteBlogPostAction.bind(null, id)}
              title={`Hapus “${post.title}”?`}
              description="Artikel akan dihapus permanen dari situs dan CMS."
              confirmLabel="Hapus artikel"
              triggerClassName="btn-outline btn-sm mt-3 w-full text-danger"
            >
              Hapus artikel
            </ConfirmSubmit>
          </div>
        </aside>
      </form>
    </div>
  );
}
