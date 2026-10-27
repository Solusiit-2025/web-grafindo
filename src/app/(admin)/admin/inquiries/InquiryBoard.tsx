"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Download,
  Inbox,
  LayoutGrid,
  List,
  Mail,
  MessageCircle,
  Phone,
  Search,
  X,
} from "lucide-react";
import { Badge, type BadgeTone } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { useToast } from "@/components/ui/Toast";
import { updateInquiryNotesAction, updateInquiryStatusAction } from "./actions";
import { cn } from "@/lib/utils/cn";
import { formatDate } from "@/lib/utils/format";

export type InquiryRow = {
  id: string;
  refNumber: string;
  name: string;
  company: string | null;
  email: string;
  phone: string;
  category: string | null;
  status: string;
  notes: string | null;
  files: string[];
  details: unknown;
  createdAt: string;
};

const COLUMNS: { key: string; label: string; tone: BadgeTone; accent: string }[] = [
  { key: "NEW", label: "New", tone: "steel", accent: "bg-secondary" },
  { key: "CONTACTED", label: "Contacted", tone: "warning", accent: "bg-warning" },
  { key: "QUOTED", label: "Quoted", tone: "gold", accent: "bg-accent" },
  { key: "WON", label: "Won", tone: "success", accent: "bg-success" },
  { key: "LOST", label: "Lost", tone: "danger", accent: "bg-danger" },
];

function statusTone(status: string): BadgeTone {
  return COLUMNS.find((column) => column.key === status)?.tone ?? "neutral";
}

function statusLabel(status: string) {
  return COLUMNS.find((column) => column.key === status)?.label ?? status;
}

export function InquiryBoard({ inquiries }: { inquiries: InquiryRow[] }) {
  const { toast } = useToast();
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [view, setView] = useState<"pipeline" | "table">("pipeline");
  const [query, setQuery] = useState("");
  const [active, setActive] = useState<InquiryRow | null>(null);
  const [notes, setNotes] = useState("");

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return inquiries;
    return inquiries.filter((inquiry) =>
      [inquiry.refNumber, inquiry.name, inquiry.company, inquiry.email, inquiry.category]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(normalized)),
    );
  }, [inquiries, query]);

  function changeStatus(id: string, status: string) {
    startTransition(async () => {
      const result = await updateInquiryStatusAction(id, status);
      if (result?.error) {
        toast(result.error, "error");
        return;
      }
      toast(`Status diubah ke ${statusLabel(status)}`, "success");
      setActive((current) => (current && current.id === id ? { ...current, status } : current));
      router.refresh();
    });
  }

  function saveNotes() {
    if (!active) return;
    startTransition(async () => {
      const result = await updateInquiryNotesAction(active.id, notes);
      if (result?.success) {
        toast("Catatan disimpan.", "success");
        setActive((current) => (current ? { ...current, notes } : current));
        router.refresh();
      } else {
        toast("Gagal menyimpan catatan.", "error");
      }
    });
  }

  function open(inquiry: InquiryRow) {
    setActive(inquiry);
    setNotes(inquiry.notes ?? "");
  }

  const stats = COLUMNS.map((column) => ({
    ...column,
    count: inquiries.filter((inquiry) => inquiry.status === column.key).length,
  }));

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[0.62rem] font-bold uppercase tracking-[0.16em] text-accent-700">Pipeline</p>
          <h1 className="mt-1.5 font-display text-2xl font-extrabold text-primary md:text-3xl">Inquiry (RFQ)</h1>
          <p className="mt-1 text-sm text-neutral-500">
            Kelola permintaan penawaran dari tahap masuk hingga menang.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-neutral-400" aria-hidden />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Cari ref, nama, perusahaan…"
              className="w-full rounded-md border border-surface-200 bg-white py-2 pl-9 pr-3 text-xs outline-none transition focus:border-accent sm:w-64"
              aria-label="Cari inquiry"
            />
          </div>
          <div className="flex items-center rounded-md border border-surface-300 bg-white p-0.5">
            <button
              type="button"
              onClick={() => setView("pipeline")}
              aria-label="Tampilan pipeline"
              className={cn("flex h-8 w-8 items-center justify-center rounded", view === "pipeline" ? "bg-primary text-white" : "text-neutral-500")}
            >
              <LayoutGrid className="h-4 w-4" aria-hidden />
            </button>
            <button
              type="button"
              onClick={() => setView("table")}
              aria-label="Tampilan tabel"
              className={cn("flex h-8 w-8 items-center justify-center rounded", view === "table" ? "bg-primary text-white" : "text-neutral-500")}
            >
              <List className="h-4 w-4" aria-hidden />
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
        {stats.map((column) => (
          <div key={column.key} className="card flex items-center gap-3 px-3 py-2.5">
            <span className={cn("h-2 w-2 rounded-full", column.accent)} aria-hidden />
            <div>
              <p className="font-mono text-lg font-semibold text-primary">{column.count}</p>
              <p className="text-[0.6rem] uppercase tracking-[0.1em] text-neutral-400">{column.label}</p>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={Inbox} title="Belum ada inquiry" description="Permintaan RFQ dari situs akan muncul di sini." />
      ) : view === "pipeline" ? (
        <div className="no-scrollbar -mx-1 flex gap-3 overflow-x-auto px-1 pb-2">
          {COLUMNS.map((column) => {
            const items = filtered.filter((inquiry) => inquiry.status === column.key);
            return (
              <div key={column.key} className="flex w-[280px] shrink-0 flex-col rounded-lg border border-surface-200 bg-surface/60">
                <div className="flex items-center justify-between px-3 py-2.5">
                  <span className="inline-flex items-center gap-2 text-xs font-bold text-primary">
                    <span className={cn("h-2 w-2 rounded-full", column.accent)} aria-hidden />
                    {column.label}
                  </span>
                  <span className="font-mono text-[0.65rem] text-neutral-400">{items.length}</span>
                </div>
                <div className="flex-1 space-y-2 p-2">
                  {items.map((inquiry) => (
                    <button
                      key={inquiry.id}
                      type="button"
                      onClick={() => open(inquiry)}
                      className="w-full rounded-md border border-surface-200 bg-white p-3 text-left shadow-e1 transition hover:-translate-y-0.5 hover:border-accent/40 hover:shadow-e2"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-mono text-[0.6rem] text-neutral-400">{inquiry.refNumber}</span>
                        <ArrowRight className="h-3 w-3 text-surface-400" aria-hidden />
                      </div>
                      <p className="mt-1.5 text-xs font-semibold text-primary">{inquiry.name}</p>
                      <p className="text-[0.65rem] text-neutral-500">{inquiry.company ?? "—"}</p>
                      <div className="mt-2 flex flex-wrap items-center gap-1.5">
                        {inquiry.category && <Badge tone="outline">{inquiry.category}</Badge>}
                        <span className="text-[0.58rem] text-neutral-400">
                          {new Date(inquiry.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "short" })}
                        </span>
                      </div>
                    </button>
                  ))}
                  {items.length === 0 && (
                    <p className="rounded-md border border-dashed border-surface-300 px-3 py-6 text-center text-[0.65rem] text-neutral-400">
                      Kosong
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-surface">
                <tr>
                  <th className="px-4 py-3 text-left text-[0.62rem] uppercase tracking-[0.1em] text-neutral-400">Ref</th>
                  <th className="px-4 py-3 text-left text-[0.62rem] uppercase tracking-[0.1em] text-neutral-400">Kontak</th>
                  <th className="px-4 py-3 text-left text-[0.62rem] uppercase tracking-[0.1em] text-neutral-400">Perusahaan</th>
                  <th className="px-4 py-3 text-left text-[0.62rem] uppercase tracking-[0.1em] text-neutral-400">Kategori</th>
                  <th className="px-4 py-3 text-left text-[0.62rem] uppercase tracking-[0.1em] text-neutral-400">Status</th>
                  <th className="px-4 py-3 text-right text-[0.62rem] uppercase tracking-[0.1em] text-neutral-400">Tanggal</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((inquiry) => (
                  <tr key={inquiry.id} className="cursor-pointer border-t border-surface-200 transition hover:bg-surface/60" onClick={() => open(inquiry)}>
                    <td className="whitespace-nowrap px-4 py-3 font-mono text-[0.68rem] text-neutral-500">{inquiry.refNumber}</td>
                    <td className="px-4 py-3">
                      <span className="block text-xs font-semibold text-primary">{inquiry.name}</span>
                      <span className="block text-[0.65rem] text-neutral-400">{inquiry.email}</span>
                    </td>
                    <td className="px-4 py-3 text-xs text-neutral-500">{inquiry.company ?? "—"}</td>
                    <td className="px-4 py-3 text-xs text-neutral-500">{inquiry.category ?? "—"}</td>
                    <td className="px-4 py-3">
                      <Badge tone={statusTone(inquiry.status)} dot>{statusLabel(inquiry.status)}</Badge>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-right text-xs text-neutral-400">
                      {formatDate(inquiry.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Detail drawer */}
      {active && (
        <div className="fixed inset-0 z-[70] flex justify-end" role="dialog" aria-modal="true" aria-label={active.refNumber}>
          <button type="button" className="absolute inset-0 bg-primary/50 backdrop-blur-sm" onClick={() => setActive(null)} aria-label="Tutup" />
          <div className="relative flex h-full w-full max-w-lg flex-col overflow-y-auto bg-white shadow-e3">
            <div className="sticky top-0 flex items-start justify-between gap-3 border-b border-surface-200 bg-white/95 px-5 py-4 backdrop-blur">
              <div>
                <p className="font-mono text-[0.65rem] text-neutral-400">{active.refNumber}</p>
                <h2 className="mt-0.5 font-display text-lg font-bold text-primary">{active.name}</h2>
                <p className="text-xs text-neutral-500">{active.company ?? "—"}</p>
              </div>
              <button
                type="button"
                onClick={() => setActive(null)}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-surface-300 text-neutral-500 transition hover:text-primary"
                aria-label="Tutup"
              >
                <X className="h-4 w-4" aria-hidden />
              </button>
            </div>

            <div className="flex-1 space-y-5 p-5">
              <div className="flex flex-wrap gap-2">
                <Badge tone={statusTone(active.status)} dot>{statusLabel(active.status)}</Badge>
                <Badge tone="outline">{active.category ?? "Tanpa kategori"}</Badge>
              </div>

              <div className="grid gap-2">
                <a href={`mailto:${active.email}`} className="flex items-center gap-2 rounded-md border border-surface-200 px-3 py-2 text-xs text-primary transition hover:border-accent/40">
                  <Mail className="h-3.5 w-3.5 text-accent-700" aria-hidden /> {active.email}
                </a>
                <a href={`https://wa.me/${active.phone.replace(/[^\d]/g, "")}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 rounded-md border border-surface-200 px-3 py-2 text-xs text-primary transition hover:border-accent/40">
                  <MessageCircle className="h-3.5 w-3.5 text-accent-700" aria-hidden /> {active.phone}
                </a>
                <span className="flex items-center gap-2 rounded-md border border-surface-200 px-3 py-2 text-xs text-neutral-500">
                  <Phone className="h-3.5 w-3.5 text-accent-700" aria-hidden />
                  {formatDate(active.createdAt)}
                </span>
              </div>

              <div>
                <p className="text-[0.62rem] font-bold uppercase tracking-[0.14em] text-neutral-400">Detail permintaan</p>
                <dl className="mt-2 space-y-1.5 rounded-md bg-surface p-3 text-xs">
                  {Object.entries((active.details as Record<string, unknown>) ?? {}).map(([key, value]) => (
                    <div key={key} className="flex gap-3">
                      <dt className="w-28 shrink-0 capitalize text-neutral-400">{key.replace(/([A-Z])/g, " $1")}</dt>
                      <dd className="min-w-0 flex-1 break-words text-primary">{value == null || value === "" ? "—" : String(value)}</dd>
                    </div>
                  ))}
                </dl>
              </div>

              {active.files.length > 0 && (
                <div>
                  <p className="text-[0.62rem] font-bold uppercase tracking-[0.14em] text-neutral-400">Lampiran</p>
                  <ul className="mt-2 space-y-1.5">
                    {active.files.map((file) => (
                      <li key={file}>
                        <a href={file} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 rounded-md border border-surface-200 px-3 py-2 text-xs text-secondary hover:border-accent/40">
                          <Download className="h-3.5 w-3.5" aria-hidden />
                          {file.split("/").pop()}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div>
                <p className="text-[0.62rem] font-bold uppercase tracking-[0.14em] text-neutral-400">Ubah status</p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {COLUMNS.map((column) => (
                    <button
                      key={column.key}
                      type="button"
                      disabled={pending}
                      onClick={() => changeStatus(active.id, column.key)}
                      className={cn("chip text-[0.65rem]", active.status === column.key && "chip-active")}
                    >
                      {column.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label htmlFor="inquiry-notes" className="text-[0.62rem] font-bold uppercase tracking-[0.14em] text-neutral-400">
                  Catatan internal
                </label>
                <textarea
                  id="inquiry-notes"
                  rows={4}
                  value={notes}
                  onChange={(event) => setNotes(event.target.value)}
                  className="field mt-2 resize-y text-xs"
                  placeholder="Hasil follow-up, harga yang disepakati, dsb."
                />
                <button type="button" onClick={saveNotes} disabled={pending} className="btn-dark btn-sm mt-2">
                  Simpan catatan
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
