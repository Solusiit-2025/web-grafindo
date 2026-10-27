import Link from "next/link";
import { ArrowLeft, FileText, Save } from "lucide-react";
import { createBlogPostAction } from "../actions";

export default function NewBlogPostPage() {
  return (
    <div className="space-y-5">
      <div>
        <Link href="/admin/blog" className="inline-flex items-center gap-1 text-xs font-medium text-neutral-500 transition hover:text-primary">
          <ArrowLeft className="h-3.5 w-3.5" aria-hidden />
          Kembali ke artikel
        </Link>
        <h1 className="mt-2 font-display text-2xl font-extrabold text-primary md:text-3xl">Artikel Baru</h1>
        <p className="mt-1 text-sm text-neutral-500">Tulis konten editorial dengan dukungan HTML.</p>
      </div>

      <form action={createBlogPostAction} className="grid gap-4 xl:grid-cols-12">
        <div className="card space-y-4 p-5 xl:col-span-8">
          <div>
            <label htmlFor="b-title" className="field-label">Judul</label>
            <input id="b-title" name="title" placeholder="Panduan memilih material sticker" required className="field" />
          </div>
          <div>
            <label htmlFor="b-slug" className="field-label">Slug</label>
            <input id="b-slug" name="slug" placeholder="panduan-material-sticker" required className="field font-mono text-xs" />
          </div>
          <div>
            <label htmlFor="b-content" className="field-label">Konten</label>
            <textarea id="b-content" name="content" placeholder="<p>Isi artikel…</p>" required rows={14} className="field resize-y font-mono text-xs" />
            <p className="field-hint">HTML diperbolehkan: &lt;p&gt;, &lt;h2&gt;, &lt;ul&gt;, &lt;blockquote&gt;.</p>
          </div>
        </div>

        <aside className="card h-fit p-5 xl:col-span-4">
          <h2 className="flex items-center gap-2 font-display text-base font-bold text-primary">
            <FileText className="h-4 w-4 text-accent-700" aria-hidden />
            Publikasi
          </h2>
          <div className="mt-4">
            <label htmlFor="b-status" className="field-label">Status</label>
            <select id="b-status" name="status" className="field" defaultValue="DRAFT">
              <option value="DRAFT">Draft</option>
              <option value="PUBLISHED">Published</option>
            </select>
          </div>
          <button type="submit" className="btn-dark mt-4 w-full">
            <Save className="h-4 w-4" aria-hidden />
            Simpan artikel
          </button>
          <p className="mt-3 text-[0.65rem] leading-relaxed text-neutral-400">
            Artikel published langsung tampil di /blog. Waktu terbit diisi otomatis.
          </p>
        </aside>
      </form>
    </div>
  );
}
