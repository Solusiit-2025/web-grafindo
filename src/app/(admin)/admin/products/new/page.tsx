import Link from "next/link";
import { ArrowLeft, Boxes, Save } from "lucide-react";
import { prisma } from "@/lib/db/prisma";
import { createProductAction } from "../actions";

export default async function NewProductPage() {
  const categories = await prisma.category.findMany({ where: { type: "product" } });

  return (
    <div className="space-y-5">
      <div>
        <Link href="/admin/products" className="inline-flex items-center gap-1 text-xs font-medium text-neutral-500 transition hover:text-primary">
          <ArrowLeft className="h-3.5 w-3.5" aria-hidden />
          Kembali ke produk
        </Link>
        <h1 className="mt-2 font-display text-2xl font-extrabold text-primary md:text-3xl">Produk Baru</h1>
        <p className="mt-1 text-sm text-neutral-500">Lengkapi informasi dasar dan publikasikan ke katalog.</p>
      </div>

      <form action={createProductAction} className="grid gap-4 xl:grid-cols-12">
        <div className="card space-y-4 p-5 xl:col-span-8">
          <div>
            <label htmlFor="p-name" className="field-label">Nama produk</label>
            <input id="p-name" name="name" placeholder="Chrome Emblem Custom" required className="field" />
          </div>
          <div>
            <label htmlFor="p-slug" className="field-label">Slug</label>
            <input id="p-slug" name="slug" placeholder="chrome-emblem-custom" required className="field font-mono text-xs" />
            <p className="field-hint">Digunakan pada URL /products/[slug].</p>
          </div>
          <div>
            <label htmlFor="p-desc" className="field-label">Deskripsi</label>
            <textarea id="p-desc" name="description" placeholder="Deskripsi singkat produk…" rows={5} className="field resize-y" />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="p-category" className="field-label">Kategori</label>
              <select id="p-category" name="categoryId" className="field">
                <option value="">Tanpa kategori</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>{category.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="p-moq" className="field-label">MOQ</label>
              <input id="p-moq" name="moq" type="number" min={1} placeholder="50" className="field" />
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="p-lead" className="field-label">Lead time</label>
              <input id="p-lead" name="leadTime" placeholder="7-10 hari" className="field" />
            </div>
          </div>
        </div>

        <aside className="card h-fit p-5 xl:col-span-4">
          <h2 className="font-display text-base font-bold text-primary">Publikasi</h2>
          <div className="mt-4">
            <label htmlFor="p-status" className="field-label">Status</label>
            <select id="p-status" name="status" className="field" defaultValue="DRAFT">
              <option value="DRAFT">Draft</option>
              <option value="PUBLISHED">Published</option>
              <option value="ARCHIVED">Archived</option>
            </select>
          </div>
          <button type="submit" className="btn-dark mt-4 w-full">
            <Save className="h-4 w-4" aria-hidden />
            Simpan produk
          </button>
          <div className="mt-4 flex items-start gap-2 rounded-sm bg-surface p-3 text-[0.65rem] leading-relaxed text-neutral-500">
            <Boxes className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent-700" aria-hidden />
            Setelah produk dibuat, unggah gambar dan entry e-catalog dari halaman edit.
          </div>
        </aside>
      </form>
    </div>
  );
}
