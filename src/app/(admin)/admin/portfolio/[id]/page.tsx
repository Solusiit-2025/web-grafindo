import Link from "next/link";
import { ArrowLeft, Save, Trash2 } from "lucide-react";
import { prisma } from "@/lib/db/prisma";
import { updatePortfolioAction, deletePortfolioAction } from "../actions";
import { ConfirmSubmit } from "@/components/ui/ConfirmSubmit";

export default async function EditPortfolioPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const item = await prisma.portfolio.findUnique({ where: { id } });
  if (!item) {
    return <p className="rounded-lg border border-dashed border-surface-300 p-8 text-center text-sm text-neutral-500">Portofolio tidak ditemukan.</p>;
  }

  return (
    <div className="space-y-5">
      <div>
        <Link href="/admin/portfolio" className="inline-flex items-center gap-1 text-xs font-medium text-neutral-500 transition hover:text-primary">
          <ArrowLeft className="h-3.5 w-3.5" aria-hidden />
          Kembali ke portofolio
        </Link>
        <h1 className="mt-2 font-display text-2xl font-extrabold text-primary md:text-3xl">{item.title}</h1>
        <p className="mt-1 font-mono text-xs text-neutral-400">{item.slug}</p>
      </div>

      <form action={updatePortfolioAction.bind(null, id)} className="grid gap-4 xl:grid-cols-12">
        <div className="card space-y-4 p-5 xl:col-span-8">
          <div>
            <label htmlFor="pfe-title" className="field-label">Judul proyek</label>
            <input id="pfe-title" name="title" defaultValue={item.title} required className="field" />
          </div>
          <div>
            <label htmlFor="pfe-slug" className="field-label">Slug</label>
            <input id="pfe-slug" name="slug" defaultValue={item.slug} required className="field font-mono text-xs" />
          </div>
          <div>
            <label htmlFor="pfe-desc" className="field-label">Deskripsi</label>
            <textarea id="pfe-desc" name="description" defaultValue={item.description ?? ""} rows={5} className="field resize-y" />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="pfe-client" className="field-label">Klien</label>
              <input id="pfe-client" name="client" defaultValue={item.client ?? ""} className="field" />
            </div>
            <div>
              <label htmlFor="pfe-technique" className="field-label">Teknik</label>
              <input id="pfe-technique" name="technique" defaultValue={item.technique ?? ""} className="field" />
            </div>
          </div>
          <div>
            <label htmlFor="pfe-images" className="field-label">URL gambar</label>
            <textarea
              id="pfe-images"
              name="images"
              defaultValue={item.images.join("\n")}
              rows={4}
              className="field resize-y font-mono text-xs"
            />
            <p className="field-hint">Satu URL per baris (maks. 8).</p>
          </div>
        </div>

        <aside className="space-y-4 xl:col-span-4">
          <div className="card h-fit p-5">
            <h2 className="font-display text-base font-bold text-primary">Publikasi</h2>
            <button type="submit" className="btn-dark mt-4 w-full">
              <Save className="h-4 w-4" aria-hidden />
              Update proyek
            </button>
            <Link
              href={`/admin/translations?entityType=Portfolio&entityId=${id}&field=title`}
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
              Hapus proyek portofolio secara permanen.
            </p>
            <ConfirmSubmit
              action={deletePortfolioAction.bind(null, id)}
              title={`Hapus “${item.title}”?`}
              description="Proyek akan dihapus permanen dari halaman portofolio."
              confirmLabel="Hapus proyek"
              triggerClassName="btn-outline btn-sm mt-3 w-full text-danger"
            >
              Hapus proyek
            </ConfirmSubmit>
          </div>
        </aside>
      </form>
    </div>
  );
}
