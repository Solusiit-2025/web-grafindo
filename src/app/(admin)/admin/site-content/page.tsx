import { PanelsTopLeft, Plus } from "lucide-react";
import { prisma } from "@/lib/db/prisma";
import { upsertSiteContentAction } from "./actions";
import { Badge } from "@/components/ui/Badge";

export default async function SiteContentPage() {
  const contents = await prisma.siteContent.findMany({ orderBy: [{ key: "asc" }, { locale: "asc" }] });

  const grouped = Array.from(
    contents.reduce((map, entry) => {
      const list = map.get(entry.key) ?? [];
      list.push(entry);
      map.set(entry.key, list);
      return map;
    }, new Map<string, typeof contents>()),
  );

  return (
    <div className="space-y-5">
      <div>
        <p className="text-[0.62rem] font-bold uppercase tracking-[0.16em] text-accent-700">Konten</p>
        <h1 className="mt-1.5 font-display text-2xl font-extrabold text-primary md:text-3xl">Konten Situs</h1>
        <p className="mt-1 text-sm text-neutral-500">Kelola teks statis beranda, kontak, dan footer dalam dua bahasa.</p>
      </div>

      <div className="grid gap-4 xl:grid-cols-12">
        <div className="card overflow-hidden xl:col-span-8">
          <div className="flex items-center justify-between border-b border-surface-200 px-5 py-4">
            <h2 className="font-display text-base font-bold text-primary">Daftar konten</h2>
            <Badge tone="steel">{grouped.length} key</Badge>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-surface">
                <tr>
                  <th className="px-4 py-3 text-left text-[0.62rem] uppercase tracking-[0.1em] text-neutral-400">Key</th>
                  <th className="px-4 py-3 text-left text-[0.62rem] uppercase tracking-[0.1em] text-neutral-400">ID</th>
                  <th className="px-4 py-3 text-left text-[0.62rem] uppercase tracking-[0.1em] text-neutral-400">EN</th>
                </tr>
              </thead>
              <tbody>
                {grouped.map(([key, values]) => {
                  const id = values.find((entry) => entry.locale === "id");
                  const en = values.find((entry) => entry.locale === "en");
                  return (
                    <tr key={key} className="border-t border-surface-200 align-top">
                      <td className="whitespace-nowrap px-4 py-3">
                        <span className="font-mono text-[0.65rem] text-primary">{key}</span>
                        <span className="mt-1 block">
                          <Badge tone="outline">{id?.type ?? en?.type ?? "text"}</Badge>
                        </span>
                      </td>
                      <td className="max-w-xs px-4 py-3 text-xs text-neutral-600">
                        <p className="line-clamp-3">{id?.value ?? "—"}</p>
                      </td>
                      <td className="max-w-xs px-4 py-3 text-xs text-neutral-500">
                        <p className="line-clamp-3">{en?.value ?? "—"}</p>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className="card h-fit p-5 xl:col-span-4">
          <h2 className="flex items-center gap-2 font-display text-base font-bold text-primary">
            <PanelsTopLeft className="h-4 w-4 text-accent-700" aria-hidden />
            Tambah / update
          </h2>
          <form action={upsertSiteContentAction} className="mt-4 space-y-3">
            <div>
              <label htmlFor="content-key" className="field-label text-xs">Key</label>
              <input id="content-key" name="key" placeholder="hero_title" required className="field py-2 font-mono text-xs" />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label htmlFor="content-locale" className="field-label text-xs">Locale</label>
                <select id="content-locale" name="locale" className="field py-2 text-xs">
                  <option value="id">id</option>
                  <option value="en">en</option>
                </select>
              </div>
              <div>
                <label htmlFor="content-type" className="field-label text-xs">Tipe</label>
                <select id="content-type" name="type" className="field py-2 text-xs">
                  <option value="text">text</option>
                  <option value="html">html</option>
                  <option value="json">json</option>
                </select>
              </div>
            </div>
            <div>
              <label htmlFor="content-value" className="field-label text-xs">Value</label>
              <textarea id="content-value" name="value" required rows={5} className="field resize-y py-2 text-xs" />
            </div>
            <button type="submit" className="btn-dark btn-sm w-full">
              <Plus className="h-3.5 w-3.5" aria-hidden />
              Simpan konten
            </button>
          </form>
          <p className="mt-3 text-[0.65rem] leading-relaxed text-neutral-400">
            Key yang sama dengan locale berbeda akan tersimpan sebagai pasangan ID/EN.
          </p>
        </div>
      </div>
    </div>
  );
}
