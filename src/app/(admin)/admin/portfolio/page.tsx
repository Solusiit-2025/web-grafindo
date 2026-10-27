import Link from "next/link";
import { Images, Plus } from "lucide-react";
import { prisma } from "@/lib/db/prisma";
import { deletePortfolioAction } from "./actions";
import { Badge } from "@/components/ui/Badge";
import { ButtonLink } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { ConfirmSubmit } from "@/components/ui/ConfirmSubmit";
import { Visual } from "@/components/public/Visual";
import { formatDate } from "@/lib/utils/format";

export default async function AdminPortfolioPage() {
  const items = await prisma.portfolio.findMany({
    include: { category: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[0.62rem] font-bold uppercase tracking-[0.16em] text-accent-700">Katalog</p>
          <h1 className="mt-1.5 font-display text-2xl font-extrabold text-primary md:text-3xl">Portofolio</h1>
          <p className="mt-1 text-sm text-neutral-500">{items.length} proyek terdaftar.</p>
        </div>
        <ButtonLink href="/admin/portfolio/new" iconLeft={<Plus className="h-4 w-4" aria-hidden />}>
          Portofolio Baru
        </ButtonLink>
      </div>

      {items.length === 0 ? (
        <EmptyState
          icon={Images}
          title="Belum ada portofolio"
          description="Tambahkan proyek pertama untuk ditampilkan di situs."
          action={<ButtonLink href="/admin/portfolio/new" variant="outline">Tambah proyek</ButtonLink>}
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {items.map((item) => (
            <article key={item.id} className="card group overflow-hidden">
              <Visual
                src={item.images[0]}
                alt={item.title}
                label={item.title}
                category={item.category?.slug}
                ratio="video"
                sizes="(max-width: 768px) 100vw, 33vw"
                className="rounded-none"
                showLabel={false}
                showMeta={false}
              />
              <div className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h2 className="font-display text-base font-bold text-primary">{item.title}</h2>
                    <p className="mt-0.5 text-[0.65rem] text-neutral-500">
                      {[item.client, item.technique].filter(Boolean).join(" · ") || "—"}
                    </p>
                  </div>
                  {item.category && <Badge tone="outline">{item.category.name}</Badge>}
                </div>
                <div className="mt-3 flex items-center justify-between border-t border-surface-200 pt-3 text-xs">
                  <span className="text-[0.62rem] text-neutral-400">{formatDate(item.createdAt)}</span>
                  <div className="flex items-center gap-3">
                    <Link href={`/admin/portfolio/${item.id}`} className="font-medium text-secondary hover:underline">Edit</Link>
                    <ConfirmSubmit
                      action={deletePortfolioAction.bind(null, item.id)}
                      title={`Hapus “${item.title}”?`}
                      description="Proyek portofolio akan dihapus permanen."
                      confirmLabel="Hapus proyek"
                    >
                      Hapus
                    </ConfirmSubmit>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
