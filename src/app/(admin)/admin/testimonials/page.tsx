import { Building2, Quote, Star } from "lucide-react";
import { prisma } from "@/lib/db/prisma";
import {
  createClientLogoAction,
  createTestimonialAction,
  deleteClientLogoAction,
  deleteTestimonialAction,
  toggleClientLogoAction,
  toggleTestimonialAction,
} from "./actions";
import { Badge } from "@/components/ui/Badge";
import { ConfirmSubmit } from "@/components/ui/ConfirmSubmit";

export default async function TestimonialsAdminPage() {
  const [testimonials, logos] = await Promise.all([
    prisma.testimonial.findMany({ orderBy: [{ locale: "asc" }, { order: "asc" }] }),
    prisma.clientLogo.findMany({ orderBy: { order: "asc" } }),
  ]);

  return (
    <div className="space-y-5">
      <div>
        <p className="text-[0.62rem] font-bold uppercase tracking-[0.16em] text-accent-700">Konten</p>
        <h1 className="mt-1.5 font-display text-2xl font-extrabold text-primary md:text-3xl">
          Testimoni & Logo Klien
        </h1>
        <p className="mt-1 text-sm text-neutral-500">
          Konten sosial proof yang tampil di beranda. Perubahan langsung tervalidasi cache.
        </p>
      </div>

      <div className="grid gap-4 xl:grid-cols-12">
        <div className="card overflow-hidden xl:col-span-7">
          <div className="flex items-center justify-between border-b border-surface-200 px-5 py-4">
            <h2 className="flex items-center gap-2 font-display text-base font-bold text-primary">
              <Quote className="h-4 w-4 text-accent-700" aria-hidden />
              Testimoni
            </h2>
            <Badge tone="steel">{testimonials.length}</Badge>
          </div>
          <ul className="divide-y divide-surface-200">
            {testimonials.map((item) => (
              <li key={item.id} className="px-5 py-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-primary">
                      {item.name} <span className="font-normal text-neutral-400">· {item.company ?? "—"}</span>
                    </p>
                    <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-neutral-600">“{item.quote}”</p>
                    <div className="mt-2 flex items-center gap-2">
                      <Badge tone={item.locale === "en" ? "steel" : "gold"}>{item.locale.toUpperCase()}</Badge>
                      <span className="flex items-center gap-0.5">
                        {Array.from({ length: 5 }).map((_, index) => (
                          <Star
                            key={index}
                            className={`h-3 w-3 ${index < item.rating ? "fill-accent text-accent" : "text-surface-300"}`}
                            aria-hidden
                          />
                        ))}
                      </span>
                    </div>
                  </div>
                  <div className="flex shrink-0 flex-col items-end gap-2 text-xs">
                    <form action={toggleTestimonialAction.bind(null, item.id)}>
                      <button type="submit" className="font-medium text-secondary hover:underline">
                        {item.isActive ? "Sembunyikan" : "Tampilkan"}
                      </button>
                    </form>
                    <ConfirmSubmit
                      action={deleteTestimonialAction.bind(null, item.id)}
                      title={`Hapus testimoni ${item.name}?`}
                      description="Testimoni akan dihapus permanen dari beranda."
                      confirmLabel="Hapus testimoni"
                    >
                      Hapus
                    </ConfirmSubmit>
                  </div>
                </div>
              </li>
            ))}
            {testimonials.length === 0 && (
              <li className="px-5 py-10 text-center text-xs text-neutral-400">Belum ada testimoni.</li>
            )}
          </ul>
        </div>

        <div className="card h-fit p-5 xl:col-span-5">
          <h2 className="font-display text-base font-bold text-primary">Tambah testimoni</h2>
          <form action={createTestimonialAction} className="mt-4 space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label htmlFor="t-name" className="field-label text-xs">Nama</label>
                <input id="t-name" name="name" required className="field py-2 text-xs" />
              </div>
              <div>
                <label htmlFor="t-company" className="field-label text-xs">Perusahaan</label>
                <input id="t-company" name="company" className="field py-2 text-xs" />
              </div>
              <div>
                <label htmlFor="t-role" className="field-label text-xs">Jabatan</label>
                <input id="t-role" name="role" className="field py-2 text-xs" />
              </div>
              <div>
                <label htmlFor="t-locale" className="field-label text-xs">Locale</label>
                <select id="t-locale" name="locale" className="field py-2 text-xs">
                  <option value="id">ID</option>
                  <option value="en">EN</option>
                </select>
              </div>
              <div>
                <label htmlFor="t-rating" className="field-label text-xs">Rating</label>
                <input id="t-rating" name="rating" type="number" min={1} max={5} defaultValue={5} className="field py-2 text-xs" />
              </div>
              <div>
                <label htmlFor="t-order" className="field-label text-xs">Urutan</label>
                <input id="t-order" name="order" type="number" defaultValue={testimonials.length + 1} className="field py-2 text-xs" />
              </div>
            </div>
            <div>
              <label htmlFor="t-quote" className="field-label text-xs">Kutipan</label>
              <textarea id="t-quote" name="quote" rows={4} required className="field resize-y py-2 text-xs" />
            </div>
            <button type="submit" className="btn-dark btn-sm w-full">Simpan testimoni</button>
          </form>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-12">
        <div className="card overflow-hidden xl:col-span-7">
          <div className="flex items-center justify-between border-b border-surface-200 px-5 py-4">
            <h2 className="flex items-center gap-2 font-display text-base font-bold text-primary">
              <Building2 className="h-4 w-4 text-accent-700" aria-hidden />
              Logo klien
            </h2>
            <Badge tone="steel">{logos.length}</Badge>
          </div>
          <ul className="divide-y divide-surface-200">
            {logos.map((logo) => (
              <li key={logo.id} className="flex items-center gap-3 px-5 py-3">
                <span className="min-w-0 flex-1">
                  <span className="block text-xs font-semibold text-primary">{logo.name}</span>
                  <span className="block truncate font-mono text-[0.6rem] text-neutral-400">
                    {logo.logoUrl ?? "Wordmark teks"}
                  </span>
                </span>
                <form action={toggleClientLogoAction.bind(null, logo.id)}>
                  <button type="submit" className="text-xs font-medium text-secondary hover:underline">
                    {logo.isActive ? "Sembunyikan" : "Tampilkan"}
                  </button>
                </form>
                <ConfirmSubmit
                  action={deleteClientLogoAction.bind(null, logo.id)}
                  title={`Hapus logo ${logo.name}?`}
                  description="Logo akan dihapus dari trust bar beranda."
                  confirmLabel="Hapus logo"
                >
                  Hapus
                </ConfirmSubmit>
              </li>
            ))}
            {logos.length === 0 && (
              <li className="px-5 py-10 text-center text-xs text-neutral-400">Belum ada logo klien.</li>
            )}
          </ul>
        </div>

        <div className="card h-fit p-5 xl:col-span-5">
          <h2 className="font-display text-base font-bold text-primary">Tambah logo klien</h2>
          <form action={createClientLogoAction} className="mt-4 space-y-3">
            <div>
              <label htmlFor="l-name" className="field-label text-xs">Nama klien</label>
              <input id="l-name" name="name" required className="field py-2 text-xs" />
            </div>
            <div>
              <label htmlFor="l-url" className="field-label text-xs">URL logo (opsional)</label>
              <input id="l-url" name="logoUrl" placeholder="/uploads/logo.png" className="field py-2 font-mono text-xs" />
              <p className="field-hint">Kosongkan untuk memakai wordmark teks. Rasio ideal 3:1, latar transparan.</p>
            </div>
            <div>
              <label htmlFor="l-order" className="field-label text-xs">Urutan</label>
              <input id="l-order" name="order" type="number" defaultValue={logos.length + 1} className="field py-2 text-xs" />
            </div>
            <button type="submit" className="btn-dark btn-sm w-full">Simpan logo</button>
          </form>
        </div>
      </div>
    </div>
  );
}
