"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { AlertTriangle, X } from "lucide-react";
import { Button } from "./Button";

type ServerAction = (formData: FormData) => void | Promise<void>;

export function ConfirmSubmit({
  action,
  title,
  description,
  confirmLabel = "Hapus",
  children,
  triggerClassName,
}: {
  action: ServerAction;
  title: string;
  description?: string;
  confirmLabel?: string;
  children?: ReactNode;
  triggerClassName?: string;
}) {
  const [open, setOpen] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <>
      <form ref={formRef} action={action} className="inline">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className={triggerClassName ?? "text-sm font-medium text-danger hover:underline"}
        >
          {children ?? "Hapus"}
        </button>
      </form>

      {open && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby="confirm-title">
          <button
            type="button"
            aria-label="Tutup"
            className="absolute inset-0 bg-primary/60 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <div className="relative w-full max-w-md rounded-lg border border-surface-200 bg-white p-6 shadow-e3 animate-fade-up">
            <div className="flex items-start gap-4">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-danger-50 text-danger">
                <AlertTriangle className="h-5 w-5" aria-hidden />
              </span>
              <div className="flex-1">
                <h2 id="confirm-title" className="font-display text-lg font-bold text-primary">
                  {title}
                </h2>
                {description && <p className="mt-2 text-sm leading-relaxed text-neutral-600">{description}</p>}
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="text-neutral-400 transition hover:text-primary"
                aria-label="Tutup"
              >
                <X className="h-5 w-5" aria-hidden />
              </button>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <Button type="button" variant="outline" size="sm" onClick={() => setOpen(false)}>
                Batal
              </Button>
              <Button
                type="button"
                size="sm"
                className="bg-danger text-white hover:bg-danger/90"
                onClick={() => {
                  setOpen(false);
                  formRef.current?.requestSubmit();
                }}
              >
                {confirmLabel}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
