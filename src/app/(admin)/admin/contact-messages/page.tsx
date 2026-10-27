import { MessageSquare } from "lucide-react";
import { prisma } from "@/lib/db/prisma";
import { deleteContactMessageAction } from "./actions";
import { EmptyState } from "@/components/ui/EmptyState";
import { ConfirmSubmit } from "@/components/ui/ConfirmSubmit";
import { formatDate } from "@/lib/utils/format";

export default async function ContactMessagesPage() {
  const messages = await prisma.contactMessage.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div className="space-y-5">
      <div>
        <p className="text-[0.62rem] font-bold uppercase tracking-[0.16em] text-accent-700">Penjualan</p>
        <h1 className="mt-1.5 font-display text-2xl font-extrabold text-primary md:text-3xl">Pesan Kontak</h1>
        <p className="mt-1 text-sm text-neutral-500">{messages.length} pesan dari formulir kontak situs.</p>
      </div>

      {messages.length === 0 ? (
        <EmptyState
          icon={MessageSquare}
          title="Belum ada pesan"
          description="Pesan dari formulir kontak akan muncul di sini."
        />
      ) : (
        <div className="grid gap-3 lg:grid-cols-2">
          {messages.map((message) => (
            <article key={message.id} className="card p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="font-display text-base font-bold text-primary">{message.name}</h2>
                  <p className="mt-0.5 font-mono text-[0.62rem] text-neutral-400">{message.email}</p>
                  {message.phone && <p className="font-mono text-[0.62rem] text-neutral-400">{message.phone}</p>}
                </div>
                <span className="whitespace-nowrap text-[0.6rem] text-neutral-400">{formatDate(message.createdAt)}</span>
              </div>
              <p className="mt-3 whitespace-pre-line rounded-sm bg-surface p-3 text-xs leading-relaxed text-neutral-600">
                {message.message}
              </p>
              <div className="mt-3 flex items-center justify-between">
                <a href={`mailto:${message.email}`} className="btn-outline btn-sm">Balas email</a>
                <ConfirmSubmit
                  action={deleteContactMessageAction.bind(null, message.id)}
                  title={`Hapus pesan dari ${message.name}?`}
                  description="Pesan akan dihapus permanen dari database."
                  confirmLabel="Hapus pesan"
                >
                  Hapus
                </ConfirmSubmit>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
