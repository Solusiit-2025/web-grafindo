import { Languages, Plus } from "lucide-react";
import { prisma } from "@/lib/db/prisma";
import { upsertTranslationAction } from "./actions";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { formatDate } from "@/lib/utils/format";

export default async function TranslationsPage({
  searchParams,
}: {
  searchParams: Promise<{ entityType?: string; entityId?: string; field?: string }>;
}) {
  const params = await searchParams;
  const translations = await prisma.translation.findMany({ orderBy: { createdAt: "desc" }, take: 100 });

  return (
    <div className="space-y-5">
      <div>
        <p className="text-[0.62rem] font-bold uppercase tracking-[0.16em] text-accent-700">Konten</p>
        <h1 className="mt-1.5 font-display text-2xl font-extrabold text-primary md:text-3xl">Terjemahan</h1>
        <p className="mt-1 text-sm text-neutral-500">
          Terjemahan dinamis per entity (produk, artikel, portofolio) untuk locale EN.
        </p>
      </div>

      <div className="grid gap-4 xl:grid-cols-12">
        <div className="card overflow-hidden xl:col-span-8">
          <div className="flex items-center justify-between border-b border-surface-200 px-5 py-4">
            <h2 className="font-display text-base font-bold text-primary">Daftar terjemahan</h2>
            <Badge tone="steel">{translations.length}</Badge>
          </div>
          {translations.length === 0 ? (
            <EmptyState
              icon={Languages}
              title="Belum ada terjemahan"
              description="Tambahkan terjemahan untuk konten dinamis dari form di samping."
              className="m-5"
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-surface">
                  <tr>
                    <th className="px-4 py-3 text-left text-[0.62rem] uppercase tracking-[0.1em] text-neutral-400">Entity</th>
                    <th className="px-4 py-3 text-left text-[0.62rem] uppercase tracking-[0.1em] text-neutral-400">Field</th>
                    <th className="px-4 py-3 text-left text-[0.62rem] uppercase tracking-[0.1em] text-neutral-400">Locale</th>
                    <th className="px-4 py-3 text-left text-[0.62rem] uppercase tracking-[0.1em] text-neutral-400">Value</th>
                    <th className="px-4 py-3 text-right text-[0.62rem] uppercase tracking-[0.1em] text-neutral-400">Update</th>
                  </tr>
                </thead>
                <tbody>
                  {translations.map((translation) => (
                    <tr key={translation.id} className="border-t border-surface-200 align-top">
                      <td className="px-4 py-3">
                        <span className="block text-xs font-semibold text-primary">{translation.entityType}</span>
                        <span className="block font-mono text-[0.6rem] text-neutral-400">{translation.entityId}</span>
                      </td>
                      <td className="px-4 py-3 font-mono text-[0.65rem] text-neutral-600">{translation.field}</td>
                      <td className="px-4 py-3"><Badge tone={translation.locale === "en" ? "steel" : "neutral"}>{translation.locale}</Badge></td>
                      <td className="max-w-xs px-4 py-3 text-xs text-neutral-600">{translation.value}</td>
                      <td className="whitespace-nowrap px-4 py-3 text-right text-[0.62rem] text-neutral-400">
                        {formatDate(translation.updatedAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="card h-fit p-5 xl:col-span-4">
          <h2 className="flex items-center gap-2 font-display text-base font-bold text-primary">
            <Languages className="h-4 w-4 text-accent-700" aria-hidden />
            Tambah terjemahan
          </h2>
          <form action={upsertTranslationAction} className="mt-4 space-y-3">
            <div>
              <label htmlFor="tr-entity" className="field-label text-xs">Entity type</label>
              <input id="tr-entity" name="entityType" defaultValue={params.entityType ?? ""} placeholder="Product / BlogPost" required className="field py-2 text-xs" />
            </div>
            <div>
              <label htmlFor="tr-id" className="field-label text-xs">Entity ID</label>
              <input id="tr-id" name="entityId" defaultValue={params.entityId ?? ""} placeholder="cuid…" required className="field py-2 font-mono text-xs" />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label htmlFor="tr-locale" className="field-label text-xs">Locale</label>
                <select id="tr-locale" name="locale" className="field py-2 text-xs">
                  <option value="en">en</option>
                  <option value="id">id</option>
                </select>
              </div>
              <div>
                <label htmlFor="tr-field" className="field-label text-xs">Field</label>
                <input id="tr-field" name="field" defaultValue={params.field ?? ""} placeholder="name" required className="field py-2 text-xs" />
              </div>
            </div>
            <div>
              <label htmlFor="tr-value" className="field-label text-xs">Value</label>
              <textarea id="tr-value" name="value" required rows={4} className="field resize-y py-2 text-xs" />
            </div>
            <button type="submit" className="btn-dark btn-sm w-full">
              <Plus className="h-3.5 w-3.5" aria-hidden />
              Simpan terjemahan
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
