import Link from "next/link";
import { ArrowLeft, Images, Save } from "lucide-react";
import { createPortfolioAction } from "../actions";

export default function NewPortfolioPage() {
  return (
    <div className="space-y-5">
      <div>
        <Link href="/admin/portfolio" className="inline-flex items-center gap-1 text-xs font-medium text-neutral-500 transition hover:text-primary">
          <ArrowLeft className="h-3.5 w-3.5" aria-hidden />
          Kembali ke portofolio
        </Link>
        <h1 className="mt-2 font-display text-2xl font-extrabold text-primary md:text-3xl">Portofolio Baru</h1>
        <p className="mt-1 text-sm text-neutral-500">Dokumentasikan proyek dan hasil kerja untuk klien.</p>
      </div>

      <form action={createPortfolioAction} className="grid gap-4 xl:grid-cols-12">
        <div className="card space-y-4 p-5 xl:col-span-8">
          <div>
            <label htmlFor="pf-title" className="field-label">Judul proyek</label>
            <input id="pf-title" name="title" placeholder="Branding Kopi Nusantara" required className="field" />
          </div>
          <div>
            <label htmlFor="pf-slug" className="field-label">Slug</label>
            <input id="pf-slug" name="slug" placeholder="branding-kopi-nusantara" required className="field font-mono text-xs" />
          </div>
          <div>
            <label htmlFor="pf-desc" className="field-label">Deskripsi</label>
            <textarea id="pf-desc" name="description" placeholder="Ringkasan proyek, tantangan, dan solusi…" rows={5} className="field resize-y" />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="pf-client" className="field-label">Klien</label>
              <input id="pf-client" name="client" placeholder="Kopi Nusantara" className="field" />
            </div>
            <div>
              <label htmlFor="pf-technique" className="field-label">Teknik</label>
              <input id="pf-technique" name="technique" placeholder="Die-cut vinyl" className="field" />
            </div>
          </div>
          <div>
            <label htmlFor="pf-images" className="field-label">URL gambar</label>
            <textarea
              id="pf-images"
              name="images"
              rows={3}
              placeholder="/uploads/gambar-1.jpg&#10;https://…"
              className="field resize-y font-mono text-xs"
            />
            <p className="field-hint">Satu URL per baris (maks. 8). Unggah file lebih dulu di menu Media.</p>
          </div>
        </div>

        <aside className="card h-fit p-5 xl:col-span-4">
          <h2 className="flex items-center gap-2 font-display text-base font-bold text-primary">
            <Images className="h-4 w-4 text-accent-700" aria-hidden />
            Publikasi
          </h2>
          <button type="submit" className="btn-dark mt-4 w-full">
            <Save className="h-4 w-4" aria-hidden />
            Simpan proyek
          </button>
          <p className="mt-3 text-[0.65rem] leading-relaxed text-neutral-400">
            Proyek langsung tampil di halaman portofolio setelah disimpan.
          </p>
        </aside>
      </form>
    </div>
  );
}
