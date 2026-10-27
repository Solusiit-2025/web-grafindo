import Link from "next/link";
import { Boxes, ChevronLeft, ChevronRight, Plus, Search } from "lucide-react";
import { prisma } from "@/lib/db/prisma";
import { deleteProductAction } from "./actions";
import { Badge, type BadgeTone } from "@/components/ui/Badge";
import { ButtonLink } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { ConfirmSubmit } from "@/components/ui/ConfirmSubmit";
import { formatDate } from "@/lib/utils/format";

const statusTone: Record<string, BadgeTone> = {
  PUBLISHED: "success",
  DRAFT: "warning",
  ARCHIVED: "neutral",
};

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  const { q, page: pageParam } = await searchParams;
  const page = Math.max(1, Number(pageParam ?? 1) || 1);
  const perPage = 20;
  const where = q
    ? {
        OR: [
          { name: { contains: q, mode: "insensitive" as const } },
          { slug: { contains: q, mode: "insensitive" as const } },
        ],
      }
    : undefined;

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      include: { category: true, ecatalog: true, _count: { select: { images: true } } },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * perPage,
      take: perPage,
    }),
    prisma.product.count({ where }),
  ]);
  const totalPages = Math.max(1, Math.ceil(total / perPage));

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[0.62rem] font-bold uppercase tracking-[0.16em] text-accent-700">Katalog</p>
          <h1 className="mt-1.5 font-display text-2xl font-extrabold text-primary md:text-3xl">Produk</h1>
          <p className="mt-1 text-sm text-neutral-500">{total} produk terdaftar di katalog.</p>
        </div>
        <ButtonLink href="/admin/products/new" iconLeft={<Plus className="h-4 w-4" aria-hidden />}>
          Produk Baru
        </ButtonLink>
      </div>

      <form action="/admin/products" method="get" className="relative max-w-sm">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" aria-hidden />
        <input
          name="q"
          defaultValue={q ?? ""}
          placeholder="Cari nama atau slug produk…"
          className="field py-2.5 pl-9"
          aria-label="Cari produk"
        />
      </form>

      {products.length === 0 ? (
        <EmptyState
          icon={Boxes}
          title={q ? "Produk tidak ditemukan" : "Belum ada produk"}
          description={q ? "Coba kata kunci lain." : "Tambahkan produk pertama ke katalog."}
          action={
            <ButtonLink href="/admin/products/new" variant="outline">
              Tambah produk
            </ButtonLink>
          }
        />
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-surface">
                <tr>
                  <th className="px-4 py-3 text-left text-[0.62rem] uppercase tracking-[0.1em] text-neutral-400">Nama</th>
                  <th className="px-4 py-3 text-left text-[0.62rem] uppercase tracking-[0.1em] text-neutral-400">Kategori</th>
                  <th className="px-4 py-3 text-left text-[0.62rem] uppercase tracking-[0.1em] text-neutral-400">SKU</th>
                  <th className="px-4 py-3 text-left text-[0.62rem] uppercase tracking-[0.1em] text-neutral-400">Media</th>
                  <th className="px-4 py-3 text-left text-[0.62rem] uppercase tracking-[0.1em] text-neutral-400">Status</th>
                  <th className="px-4 py-3 text-left text-[0.62rem] uppercase tracking-[0.1em] text-neutral-400">Diperbarui</th>
                  <th className="px-4 py-3 text-right text-[0.62rem] uppercase tracking-[0.1em] text-neutral-400">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id} className="border-t border-surface-200">
                    <td className="px-4 py-3">
                      <span className="block text-xs font-semibold text-primary">{product.name}</span>
                      <span className="mt-0.5 block font-mono text-[0.6rem] text-neutral-400">{product.slug}</span>
                    </td>
                    <td className="px-4 py-3 text-xs text-neutral-500">{product.category?.name ?? "—"}</td>
                    <td className="px-4 py-3 font-mono text-[0.65rem] text-neutral-500">{product.ecatalog?.sku ?? "—"}</td>
                    <td className="px-4 py-3 text-xs text-neutral-500">{product._count.images} foto</td>
                    <td className="px-4 py-3">
                      <Badge tone={statusTone[product.status] ?? "neutral"} dot>
                        {product.status}
                      </Badge>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-[0.65rem] text-neutral-400">
                      {formatDate(product.updatedAt)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-3 text-xs">
                        <Link href={`/admin/products/${product.id}`} className="font-medium text-secondary hover:underline">
                          Edit
                        </Link>
                        <ConfirmSubmit
                          action={deleteProductAction.bind(null, product.id)}
                          title={`Hapus “${product.name}”?`}
                          description="Produk dan seluruh gambar terkait akan dihapus permanen. Tindakan ini tidak dapat dibatalkan."
                          confirmLabel="Hapus produk"
                          triggerClassName="font-medium text-danger hover:underline"
                        >
                          Hapus
                        </ConfirmSubmit>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-surface-200 px-4 py-3 text-xs">
              <span className="text-neutral-400">
                Halaman {page} dari {totalPages}
              </span>
              <div className="flex items-center gap-2">
                <Link
                  href={`/admin/products?${new URLSearchParams({ ...(q ? { q } : {}), page: String(Math.max(1, page - 1)) }).toString()}`}
                  aria-disabled={page <= 1}
                  className={`btn-outline btn-sm ${page <= 1 ? "pointer-events-none opacity-40" : ""}`}
                >
                  <ChevronLeft className="h-3.5 w-3.5" aria-hidden />
                  Sebelumnya
                </Link>
                <Link
                  href={`/admin/products?${new URLSearchParams({ ...(q ? { q } : {}), page: String(Math.min(totalPages, page + 1)) }).toString()}`}
                  aria-disabled={page >= totalPages}
                  className={`btn-outline btn-sm ${page >= totalPages ? "pointer-events-none opacity-40" : ""}`}
                >
                  Berikutnya
                  <ChevronRight className="h-3.5 w-3.5" aria-hidden />
                </Link>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
