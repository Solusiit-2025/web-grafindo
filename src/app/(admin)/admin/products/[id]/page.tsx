import Link from "next/link";
import Image from "next/image";
import { ArrowDown, ArrowLeft, ArrowUp, ImagePlus, Save, Trash2 } from "lucide-react";
import { prisma } from "@/lib/db/prisma";
import {
  deleteProductImageAction,
  moveProductImageAction,
  updateProductAction,
  uploadProductImageAction,
} from "../actions";

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [product, categories] = await Promise.all([
    prisma.product.findUnique({ where: { id }, include: { images: { orderBy: { order: "asc" } } } }),
    prisma.category.findMany({ where: { type: "product" } }),
  ]);

  if (!product) {
    return <p className="rounded-lg border border-dashed border-surface-300 p-8 text-center text-sm text-neutral-500">Produk tidak ditemukan.</p>;
  }

  return (
    <div className="space-y-5">
      <div>
        <Link href="/admin/products" className="inline-flex items-center gap-1 text-xs font-medium text-neutral-500 transition hover:text-primary">
          <ArrowLeft className="h-3.5 w-3.5" aria-hidden />
          Kembali ke produk
        </Link>
        <h1 className="mt-2 font-display text-2xl font-extrabold text-primary md:text-3xl">{product.name}</h1>
        <p className="mt-1 font-mono text-xs text-neutral-400">{product.slug}</p>
      </div>

      <div className="grid gap-4 xl:grid-cols-12">
        <form action={updateProductAction.bind(null, id)} className="card space-y-4 p-5 xl:col-span-7">
          <div>
            <label htmlFor="pe-name" className="field-label">Nama produk</label>
            <input id="pe-name" name="name" defaultValue={product.name} required className="field" />
          </div>
          <div>
            <label htmlFor="pe-slug" className="field-label">Slug</label>
            <input id="pe-slug" name="slug" defaultValue={product.slug} required className="field font-mono text-xs" />
          </div>
          <div>
            <label htmlFor="pe-desc" className="field-label">Deskripsi</label>
            <textarea id="pe-desc" name="description" defaultValue={product.description ?? ""} rows={5} className="field resize-y" />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="pe-category" className="field-label">Kategori</label>
              <select id="pe-category" name="categoryId" defaultValue={product.categoryId ?? ""} className="field">
                <option value="">Tanpa kategori</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>{category.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="pe-moq" className="field-label">MOQ</label>
              <input id="pe-moq" name="moq" type="number" defaultValue={product.moq ?? ""} className="field" />
            </div>
            <div>
              <label htmlFor="pe-lead" className="field-label">Lead time</label>
              <input id="pe-lead" name="leadTime" defaultValue={product.leadTime ?? ""} className="field" />
            </div>
            <div>
              <label htmlFor="pe-status" className="field-label">Status</label>
              <select id="pe-status" name="status" defaultValue={product.status} className="field">
                <option value="DRAFT">Draft</option>
                <option value="PUBLISHED">Published</option>
                <option value="ARCHIVED">Archived</option>
              </select>
            </div>
          </div>
          <button type="submit" className="btn-dark">
            <Save className="h-4 w-4" aria-hidden />
            Update produk
          </button>
        </form>

        <div className="space-y-4 xl:col-span-5">
          <section className="card p-5">
            <h2 className="flex items-center gap-2 font-display text-base font-bold text-primary">
              <ImagePlus className="h-4 w-4 text-accent-700" aria-hidden />
              Gambar produk
            </h2>
            {product.images.length > 0 ? (
              <div className="mt-3 grid grid-cols-3 gap-2">
                {product.images.map((image, index) => (
                  <div key={image.id} className="relative aspect-square overflow-hidden rounded-sm border border-surface-200">
                    <Image src={image.url} alt={image.alt ?? product.name} fill sizes="120px" className="object-cover" />
                    <div className="absolute inset-x-0 bottom-0 flex items-center justify-center gap-1 bg-primary/80 p-1 backdrop-blur">
                      <form action={moveProductImageAction.bind(null, image.id, "up")}>
                        <button
                          type="submit"
                          disabled={index === 0}
                          className="flex h-6 w-6 items-center justify-center rounded-sm text-white/70 transition hover:bg-white/15 hover:text-white disabled:opacity-30"
                          aria-label="Naikkan urutan"
                        >
                          <ArrowUp className="h-3 w-3" aria-hidden />
                        </button>
                      </form>
                      <form action={moveProductImageAction.bind(null, image.id, "down")}>
                        <button
                          type="submit"
                          disabled={index === product.images.length - 1}
                          className="flex h-6 w-6 items-center justify-center rounded-sm text-white/70 transition hover:bg-white/15 hover:text-white disabled:opacity-30"
                          aria-label="Turunkan urutan"
                        >
                          <ArrowDown className="h-3 w-3" aria-hidden />
                        </button>
                      </form>
                      <form action={deleteProductImageAction.bind(null, image.id)}>
                        <button
                          type="submit"
                          className="flex h-6 w-6 items-center justify-center rounded-sm text-white/70 transition hover:bg-danger/80 hover:text-white"
                          aria-label="Hapus gambar"
                        >
                          <Trash2 className="h-3 w-3" aria-hidden />
                        </button>
                      </form>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-3 rounded-sm border border-dashed border-surface-300 p-4 text-center text-[0.65rem] text-neutral-400">
                Belum ada gambar.
              </p>
            )}
            <form action={uploadProductImageAction.bind(null, id)} className="mt-4 space-y-2">
              <input
                type="file"
                name="file"
                required
                accept=".jpg,.jpeg,.png,.webp"
                className="w-full rounded-sm border border-surface-300 px-3 py-2 text-xs file:mr-3 file:rounded-sm file:border-0 file:bg-surface file:px-2 file:py-1 file:text-[0.65rem]"
              />
              <button type="submit" className="btn-outline btn-sm w-full">Upload gambar</button>
            </form>
          </section>

          <section className="card p-5">
            <h2 className="font-display text-base font-bold text-primary">E-Catalog</h2>
            <a href="/admin/ecatalog" className="btn-ghost btn-sm mt-3 w-full justify-start px-3">
              Kelola SKU & harga →
            </a>
            <Link
              href={`/admin/translations?entityType=Product&entityId=${id}&field=name`}
              className="btn-ghost btn-sm mt-1 w-full justify-start px-3"
            >
              Terjemahan EN →
            </Link>
          </section>
        </div>
      </div>
    </div>
  );
}
