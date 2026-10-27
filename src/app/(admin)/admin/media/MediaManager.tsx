"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { CloudUpload, Copy, FileText, ImageIcon, Trash2 } from "lucide-react";
import { useToast } from "@/components/ui/Toast";
import { cn } from "@/lib/utils/cn";

type MediaItem = {
  id: string;
  url: string;
  filename: string;
  mimeType: string;
  size: number;
  createdAt: string;
};

export function MediaManager({ initial }: { initial: MediaItem[] }) {
  const { toast } = useToast();
  const [items, setItems] = useState(initial);
  const [uploading, setUploading] = useState(false);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function upload(files: FileList | null) {
    if (!files?.length) return;
    setUploading(true);
    for (const file of Array.from(files)) {
      if (file.size > 20 * 1024 * 1024) {
        toast(`${file.name}: maksimal 20MB.`, "error");
        continue;
      }
      const body = new FormData();
      body.append("file", file);
      try {
        const response = await fetch("/api/upload", { method: "POST", body });
        const payload = await response.json();
        if (!response.ok || !payload.url) {
          toast(payload.error ?? "Upload gagal.", "error");
          continue;
        }
        setItems((current) => [
          {
            id: payload.filename ?? payload.url,
            url: payload.url,
            filename: file.name,
            mimeType: file.type || "application/octet-stream",
            size: file.size,
            createdAt: new Date().toISOString(),
          },
          ...current,
        ]);
        toast(`${file.name} berhasil diunggah.`, "success");
      } catch {
        toast("Upload gagal. Coba lagi.", "error");
      }
    }
    setUploading(false);
  }

  async function copy(url: string) {
    try {
      await navigator.clipboard.writeText(`${window.location.origin}${url}`);
      toast("URL disalin.", "success");
    } catch {
      toast("Gagal menyalin URL.", "error");
    }
  }

  return (
    <div className="grid gap-4 xl:grid-cols-12">
      <div className="xl:col-span-8">
        <div className="card overflow-hidden">
          <div className="flex items-center justify-between border-b border-surface-200 px-5 py-4">
            <h2 className="font-display text-base font-bold text-primary">Media library</h2>
            <span className="font-mono text-xs text-neutral-400">{items.length} file</span>
          </div>
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
              <ImageIcon className="h-8 w-8 text-surface-400" aria-hidden />
              <p className="mt-3 text-sm text-neutral-500">Belum ada media.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 p-4 sm:grid-cols-3 lg:grid-cols-4">
              {items.map((item) => {
                const isImage = item.mimeType.startsWith("image/");
                return (
                  <div key={item.id} className="group overflow-hidden rounded-md border border-surface-200 bg-white">
                    <div className="relative aspect-square bg-surface">
                      {isImage ? (
                        <Image src={item.url} alt={item.filename} fill sizes="200px" className="object-cover" />
                      ) : (
                        <span className="flex h-full items-center justify-center text-accent-700">
                          <FileText className="h-8 w-8" aria-hidden />
                        </span>
                      )}
                    </div>
                    <div className="p-2.5">
                      <p className="truncate text-[0.68rem] font-medium text-primary" title={item.filename}>{item.filename}</p>
                      <p className="mt-0.5 text-[0.58rem] text-neutral-400">{(item.size / 1024).toFixed(0)} KB</p>
                      <div className="mt-2 flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => copy(item.url)}
                          className="flex h-7 flex-1 items-center justify-center gap-1 rounded-sm border border-surface-300 text-[0.6rem] text-neutral-600 transition hover:border-accent hover:text-accent-700"
                        >
                          <Copy className="h-3 w-3" aria-hidden />
                          Copy
                        </button>
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex h-7 w-7 items-center justify-center rounded-sm border border-surface-300 text-neutral-600 transition hover:border-accent hover:text-accent-700"
                          aria-label={`Buka ${item.filename}`}
                        >
                          <FileText className="h-3 w-3" aria-hidden />
                        </a>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <div className="card h-fit p-5 xl:col-span-4">
        <h2 className="flex items-center gap-2 font-display text-base font-bold text-primary">
          <CloudUpload className="h-4 w-4 text-accent-700" aria-hidden />
          Unggah media
        </h2>
        <div
          onDragOver={(event) => {
            event.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(event) => {
            event.preventDefault();
            setDragging(false);
            void upload(event.dataTransfer.files);
          }}
          className={cn(
            "mt-4 rounded-md border-2 border-dashed p-6 text-center transition",
            dragging ? "border-accent bg-accent-50" : "border-surface-300 bg-surface/50",
          )}
        >
          <input
            ref={inputRef}
            type="file"
            multiple
            accept=".jpg,.jpeg,.png,.webp,.pdf,.ai,.eps,.svg"
            className="sr-only"
            onChange={(event) => {
              void upload(event.target.files);
              event.target.value = "";
            }}
          />
          <CloudUpload className="mx-auto h-7 w-7 text-accent-700" aria-hidden />
          <p className="mt-2 text-xs text-neutral-600">
            Tarik file atau{" "}
            <button type="button" onClick={() => inputRef.current?.click()} className="font-semibold text-accent-700 underline underline-offset-2">
              pilih file
            </button>
          </p>
          <p className="mt-1 text-[0.6rem] text-neutral-400">JPG, PNG, WebP, PDF, AI, EPS, SVG · maks. 20MB</p>
        </div>
        {uploading && <p className="mt-3 text-center text-xs text-accent-700">Mengunggah…</p>}
        <div className="mt-4 flex items-start gap-2 rounded-sm bg-surface p-3 text-[0.65rem] leading-relaxed text-neutral-500">
          <Trash2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-neutral-400" aria-hidden />
          File tersimpan di /public/uploads dan tercatat pada tabel Media. Hapus file langsung dari server bila tidak dipakai.
        </div>
      </div>
    </div>
  );
}
