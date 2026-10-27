import { ArrowDown, ArrowUp, LayoutTemplate, Power } from "lucide-react";
import { prisma } from "@/lib/db/prisma";
import { moveHomeSectionAction, toggleHomeSectionAction } from "./actions";
import { Badge } from "@/components/ui/Badge";

export default async function HomeSectionsPage() {
  const sections = await prisma.homeSection.findMany({ orderBy: [{ order: "asc" }, { id: "asc" }] });

  return (
    <div className="space-y-5">
      <div>
        <p className="text-[0.62rem] font-bold uppercase tracking-[0.16em] text-accent-700">Konten</p>
        <h1 className="mt-1.5 font-display text-2xl font-extrabold text-primary md:text-3xl">Section Beranda</h1>
        <p className="mt-1 text-sm text-neutral-500">
          Atur urutan dan visibilitas setiap section di halaman utama tanpa mengubah kode.
        </p>
      </div>

      <div className="card overflow-hidden">
        <div className="flex items-center justify-between border-b border-surface-200 px-5 py-4">
          <h2 className="flex items-center gap-2 font-display text-base font-bold text-primary">
            <LayoutTemplate className="h-4 w-4 text-accent-700" aria-hidden />
            Urutan section
          </h2>
          <Badge tone="steel">{sections.filter((section) => section.isActive).length} aktif</Badge>
        </div>
        <ul className="divide-y divide-surface-200">
          {sections.map((section, index) => (
            <li key={section.id} className="flex flex-wrap items-center gap-3 px-5 py-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-surface font-mono text-[0.65rem] font-semibold text-accent-700">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-primary">{section.label}</p>
                <p className="mt-0.5 font-mono text-[0.6rem] text-neutral-400">{section.key}</p>
              </div>
              <Badge tone={section.isActive ? "success" : "neutral"} dot>
                {section.isActive ? "Tampil" : "Disembunyikan"}
              </Badge>
              <div className="flex items-center gap-1">
                <form action={moveHomeSectionAction.bind(null, section.id, "up")}>
                  <button
                    type="submit"
                    disabled={index === 0}
                    aria-label="Naikkan"
                    className="flex h-8 w-8 items-center justify-center rounded-sm border border-surface-300 text-neutral-500 transition hover:border-accent hover:text-accent-700 disabled:opacity-30"
                  >
                    <ArrowUp className="h-3.5 w-3.5" aria-hidden />
                  </button>
                </form>
                <form action={moveHomeSectionAction.bind(null, section.id, "down")}>
                  <button
                    type="submit"
                    disabled={index === sections.length - 1}
                    aria-label="Turunkan"
                    className="flex h-8 w-8 items-center justify-center rounded-sm border border-surface-300 text-neutral-500 transition hover:border-accent hover:text-accent-700 disabled:opacity-30"
                  >
                    <ArrowDown className="h-3.5 w-3.5" aria-hidden />
                  </button>
                </form>
                <form action={toggleHomeSectionAction.bind(null, section.id)}>
                  <button
                    type="submit"
                    aria-label={section.isActive ? "Sembunyikan" : "Tampilkan"}
                    className="flex h-8 w-8 items-center justify-center rounded-sm border border-surface-300 text-neutral-500 transition hover:border-accent hover:text-accent-700"
                  >
                    <Power className="h-3.5 w-3.5" aria-hidden />
                  </button>
                </form>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <p className="rounded-md border border-surface-200 bg-surface p-4 text-xs leading-relaxed text-neutral-500">
        Section yang disembunyikan tidak akan dirender di halaman utama. Section <strong>Hero</strong> sebaiknya
        tetap berada di urutan pertama.
      </p>
    </div>
  );
}
