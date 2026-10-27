"use client";

import { useState, useTransition } from "react";
import { CheckCircle2, Mail, Send, ServerCog } from "lucide-react";
import { saveEmailSettingAction, sendTestEmailAction } from "./actions";
import { useToast } from "@/components/ui/Toast";
import { Button } from "@/components/ui/Button";
import type { EmailSetting } from "@prisma/client";

export function EmailSettingsPanel({ setting }: { setting: EmailSetting | null }) {
  const { toast } = useToast();
  const [saving, startSaving] = useTransition();
  const [testing, startTesting] = useTransition();
  const [testTo, setTestTo] = useState(setting?.fromEmail ?? "");

  function save(formData: FormData) {
    startSaving(async () => {
      const result = await saveEmailSettingAction(formData);
      if (result.error) {
        toast(result.error, "error");
        return;
      }
      toast("Pengaturan SMTP disimpan.", "success");
    });
  }

  function test() {
    const formData = new FormData();
    formData.set("to", testTo);
    startTesting(async () => {
      const result = await sendTestEmailAction(formData);
      if (result.error) {
        toast(result.error, "error");
        return;
      }
      toast("Email test terkirim. Cek inbox/spam.", "success");
    });
  }

  return (
    <section className="card p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="flex items-center gap-2 font-display text-base font-bold text-primary">
            <ServerCog className="h-4 w-4 text-accent-700" aria-hidden />
            Email / SMTP
          </h2>
          <p className="mt-1 text-xs text-neutral-500">
            Dipakai untuk notifikasi RFQ baru dan konfirmasi otomatis ke klien.
          </p>
        </div>
        <span
          className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[0.62rem] font-semibold ${
            setting
              ? "border-success/20 bg-success-50 text-success"
              : "border-warning/20 bg-warning-50 text-warning"
          }`}
        >
          {setting ? <CheckCircle2 className="h-3 w-3" aria-hidden /> : null}
          {setting ? "Terhubung" : "Belum diatur"}
        </span>
      </div>

      <form
        className="mt-4 space-y-3"
        onSubmit={(event) => {
          event.preventDefault();
          save(new FormData(event.currentTarget));
        }}
      >
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label htmlFor="smtp-host" className="field-label text-xs">SMTP host</label>
            <input id="smtp-host" name="smtpHost" defaultValue={setting?.smtpHost ?? ""} placeholder="smtp.gmail.com" className="field py-2 font-mono text-xs" required />
          </div>
          <div>
            <label htmlFor="smtp-port" className="field-label text-xs">Port</label>
            <input id="smtp-port" name="smtpPort" type="number" defaultValue={setting?.smtpPort ?? 587} className="field py-2 font-mono text-xs" required />
          </div>
          <div>
            <label htmlFor="smtp-user" className="field-label text-xs">Username</label>
            <input id="smtp-user" name="smtpUser" defaultValue={setting?.smtpUser ?? ""} className="field py-2 font-mono text-xs" autoComplete="off" />
          </div>
          <div>
            <label htmlFor="smtp-pass" className="field-label text-xs">Password / App password</label>
            <input id="smtp-pass" name="smtpPass" type="password" placeholder={setting ? "•••••••• (biarkan kosong jika tidak diubah)" : ""} className="field py-2 font-mono text-xs" autoComplete="new-password" />
          </div>
          <div>
            <label htmlFor="from-name" className="field-label text-xs">Nama pengirim</label>
            <input id="from-name" name="fromName" defaultValue={setting?.fromName ?? "GRAFINDO"} className="field py-2 text-xs" required />
          </div>
          <div>
            <label htmlFor="from-email" className="field-label text-xs">Email pengirim</label>
            <input id="from-email" name="fromEmail" type="email" defaultValue={setting?.fromEmail ?? "admin1@grafindomitrasemesta.com"} className="field py-2 text-xs" required />
          </div>
          <div>
            <label htmlFor="reply-to" className="field-label text-xs">Reply-to</label>
            <input id="reply-to" name="replyTo" type="email" defaultValue={setting?.replyTo ?? ""} className="field py-2 text-xs" />
          </div>
          <div>
            <label htmlFor="recipients" className="field-label text-xs">Penerima RFQ</label>
            <input id="recipients" name="recipients" defaultValue={setting?.recipients.join(", ") ?? ""} placeholder="sales@…, admin@…" className="field py-2 text-xs" required />
          </div>
        </div>
        <Button type="submit" size="sm" disabled={saving}>
          {saving ? "Menyimpan…" : "Simpan SMTP"}
        </Button>
      </form>

      <div className="mt-5 border-t border-surface-200 pt-4">
        <p className="flex items-center gap-2 text-xs font-semibold text-primary">
          <Mail className="h-3.5 w-3.5 text-accent-700" aria-hidden />
          Test koneksi
        </p>
        <div className="mt-2 flex flex-col gap-2 sm:flex-row">
          <input
            value={testTo}
            onChange={(event) => setTestTo(event.target.value)}
            type="email"
            placeholder="email-tujuan@domain.com"
            aria-label="Email tujuan test"
            className="field flex-1 py-2 text-xs"
          />
          <Button type="button" variant="outline" size="sm" onClick={test} disabled={testing || !setting}>
            <Send className="h-3.5 w-3.5" aria-hidden />
            {testing ? "Mengirim…" : "Kirim test"}
          </Button>
        </div>
        {!setting && (
          <p className="mt-2 text-[0.62rem] text-warning">
            Simpan konfigurasi SMTP terlebih dahulu sebelum mengirim email test.
          </p>
        )}
      </div>
    </section>
  );
}
