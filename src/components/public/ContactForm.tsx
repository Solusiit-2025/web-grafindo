"use client";

import { useState, useTransition } from "react";
import { Check, Loader2, Send } from "lucide-react";
import { submitContactAction } from "@/app/(public)/contact/actions";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { cn } from "@/lib/utils/cn";
import type { Messages } from "@/i18n";

export function ContactForm({ t }: { t: Messages["contact"] }) {
  const { toast } = useToast();
  const [pending, startTransition] = useTransition();
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });

  function update(key: keyof typeof form, value: string) {
    setForm((current) => ({ ...current, [key]: value }));
    setErrors((current) => {
      const next = { ...current };
      delete next[key];
      return next;
    });
  }

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const next: Record<string, string> = {};
    if (form.name.trim().length < 2) next.name = "Nama minimal 2 karakter";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) next.email = "Format email tidak valid";
    if (form.message.trim().length < 10) next.message = "Pesan minimal 10 karakter";
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => formData.append(key, value));

    startTransition(async () => {
      const result = await submitContactAction(formData);
      if ("error" in result && result.error) {
        toast(result.error, "error");
        return;
      }
      setSuccess(true);
      setForm({ name: "", email: "", phone: "", message: "" });
      toast(t.success, "success");
    });
  }

  if (success) {
    return (
      <div className="rounded-lg border border-success/20 bg-success-50/60 p-8 text-center">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-white text-success shadow-e1">
          <Check className="h-7 w-7" aria-hidden />
        </span>
        <h3 className="mt-4 font-display text-xl font-bold text-primary">{t.success}</h3>
        <button type="button" onClick={() => setSuccess(false)} className="btn-outline btn-sm mt-5">
          Kirim pesan lain
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="contact-name" className="field-label">{t.fields.name}</label>
          <input
            id="contact-name"
            value={form.name}
            onChange={(event) => update("name", event.target.value)}
            className={cn("field", errors.name && "field-error")}
            autoComplete="name"
          />
          {errors.name && <p className="mt-1 text-xs text-danger">{errors.name}</p>}
        </div>
        <div>
          <label htmlFor="contact-email" className="field-label">{t.fields.email}</label>
          <input
            id="contact-email"
            type="email"
            value={form.email}
            onChange={(event) => update("email", event.target.value)}
            className={cn("field", errors.email && "field-error")}
            autoComplete="email"
          />
          {errors.email && <p className="mt-1 text-xs text-danger">{errors.email}</p>}
        </div>
      </div>
      <div>
        <label htmlFor="contact-phone" className="field-label">{t.fields.phone}</label>
        <input
          id="contact-phone"
          value={form.phone}
          onChange={(event) => update("phone", event.target.value)}
          className="field"
          autoComplete="tel"
        />
      </div>
      <div>
        <label htmlFor="contact-message" className="field-label">{t.fields.message}</label>
        <textarea
          id="contact-message"
          rows={5}
          value={form.message}
          onChange={(event) => update("message", event.target.value)}
          className={cn("field resize-y", errors.message && "field-error")}
          placeholder={t.fields.messagePlaceholder}
        />
        {errors.message && <p className="mt-1 text-xs text-danger">{errors.message}</p>}
      </div>
      <Button type="submit" disabled={pending} iconRight={pending ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : <Send className="h-4 w-4" aria-hidden />}>
        {pending ? "Mengirim…" : t.formTitle}
      </Button>
    </form>
  );
}
