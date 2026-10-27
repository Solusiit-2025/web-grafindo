import Link from "next/link";
import { ExternalLink, Plus, Table2 } from "lucide-react";
import { prisma } from "@/lib/db/prisma";
import { createEcatalogAction, deleteEcatalogAction } from "./actions";
import { AvailabilityBadge, Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { ConfirmSubmit } from "@/components/ui/ConfirmSubmit";
import { formatCurrency } from "@/lib/utils/format";

export default async function AdminECatalogPage() {
  const [entries, products] = await Promise.all([
    prisma.ecatalogEntry.findMany({ include: { product: { include: { category: true } } }, orderBy: { createdAt: "desc" } }),
    prisma.product.findMany({ orderBy: { name: "asc" } }),
  ]);

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[0.62rem] font-bold uppercase tracking-[0.16em] text-accent-700">Katalog</p>
          <h1 className="mt-1.5 font-display text-2xl font-extrabold text-primary md:text-3xl">E-Catalog</h1>
          <p className="mt-1 text-sm text-neutral-500">{entries.length} SKU dengan harga acuan.</p>
        </div>
        <Link href="/e-catalog" target="_blank" className="btn-outline btn-sm">
          <ExternalLink className="h-3.5 w-3.5" aria-hidden />
          Lihat halaman publik
        </Link>
      </div>

      <div className="grid gap-4 xl:grid-cols-12">
        <div className="card overflow-hidden xl:col-span-8">
          <div className="flex items-center justify-between border-b border-surface-200 px-5 py-4">
            <h2 className="font-display text-base font-bold text-primary">Daftar SKU</h2>
            <Badge tone="steel">{entries.length}</Badge>
          </div>
          {entries.length === 0 ? (
            <EmptyState icon={Table2} title="Belum ada entry" description="Tambahkan SKU pertama melalui form di samping." className="m-5" />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-surface">
                  <tr>
                    <th className="px-4 py-3 text-left text-[0.62rem] uppercase tracking-[0.1em] text-neutral-400">SKU</th>
                    <th className="px-4 py-3 text-left text-[0.62rem] uppercase tracking-[0.1em] text-neutral-400">Produk</th>
                    <th className="px-4 py-3 text-right text-[0.62rem] uppercase tracking-[0.1em] text-neutral-400">Harga</th>
                    <th className="px-4 py-3 text-left text-[0.62rem] uppercase tracking-[0.1em] text-neutral-400">Status</th>
                    <th className="px-4 py-3 text-right text-[0.62rem] uppercase tracking-[0.1em] text-neutral-400">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {entries.map((entry) => (
                    <tr key={entry.id} className="border-t border-surface-200">
                      <td className="whitespace-nowrap px-4 py-3 font-mono text-[0.65rem] text-neutral-500">{entry.sku}</td>
                      <td className="px-4 py-3">
                        <span className="block text-xs font-semibold text-primary">{entry.product.name}</span>
                        <span className="block text-[0.6rem] text-neutral-400">{entry.product.category?.name ?? "—"}</span>
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-right font-mono text-xs text-primary">
                        {formatCurrency(Number(entry.priceUnit))}
                      </td>
                      <td className="px-4 py-3">
                        <AvailabilityBadge value={entry.availability} />
                      </td>
                      <td className="px-4 py-3 text-right">
                        <ConfirmSubmit
                          action={deleteEcatalogAction.bind(null, entry.id)}
                          title={`Hapus SKU ${entry.sku}?`}
                          description="Entry e-catalog akan dihapus. Produk tetap tersimpan."
                          confirmLabel="Hapus SKU"
                        >
                          Hapus
                        </ConfirmSubmit>
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
            <Plus className="h-4 w-4 text-accent-700" aria-hidden />
            Tambah entry
          </h2>
          <form action={createEcatalogAction} className="mt-4 space-y-3">
            <div>
              <label htmlFor="ecat-product" className="field-label text-xs">Produk</label>
              <select id="ecat-product" name="productId" required className="field py-2 text-xs">
                <option value="">Pilih produk</option>
                {products.map((product) => (
                  <option key={product.id} value={product.id}>{product.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="ecat-sku" className="field-label text-xs">SKU</label>
              <input id="ecat-sku" name="sku" placeholder="SKU-XXX" required className="field py-2 text-xs" />
            </div>
            <div>
              <label htmlFor="ecat-price" className="field-label text-xs">Harga satuan (Rp)</label>
              <input id="ecat-price" name="priceUnit" type="number" min={0} placeholder="15000" required className="field py-2 text-xs" />
            </div>
            <div>
              <label htmlFor="ecat-availability" className="field-label text-xs">Ketersediaan</label>
              <select id="ecat-availability" name="availability" className="field py-2 text-xs">
                <option value="in_stock">Tersedia</option>
                <option value="low_stock">Stok terbatas</option>
                <option value="made_to_order">Made to order</option>
                <option value="out_of_stock">Kosong</option>
              </select>
            </div>
            <button type="submit" className="btn-dark btn-sm w-full">Simpan entry</button>
          </form>
        </div>
      </div>
    </div>
  );
}
