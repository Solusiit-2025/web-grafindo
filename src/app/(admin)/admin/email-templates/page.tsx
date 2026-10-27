import { Mail, Plus } from "lucide-react";
import { prisma } from "@/lib/db/prisma";
import { upsertEmailTemplateAction } from "./actions";
import { Badge } from "@/components/ui/Badge";
import { formatDate } from "@/lib/utils/format";

export default async function EmailTemplatesPage() {
  const templates = await prisma.emailTemplate.findMany({ orderBy: [{ key: "asc" }, { locale: "asc" }] });

  return (
    <div className="space-y-5">
      <div>
        <p className="text-[0.62rem] font-bold uppercase tracking-[0.16em] text-accent-700">Pengaturan</p>
        <h1 className="mt-1.5 font-display text-2xl font-extrabold text-primary md:text-3xl">Email Templates</h1>
        <p className="mt-1 text-sm text-neutral-500">Template notifikasi RFQ dan pembaruan status untuk tim sales.</p>
      </div>

      <div className="grid gap-4 xl:grid-cols-12">
        <div className="space-y-3 xl:col-span-7">
          {templates.map((template) => (
            <article key={template.id} className="card p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-accent-700" aria-hidden />
                    <h2 className="font-mono text-xs font-semibold text-primary">{template.key}</h2>
                    <Badge tone={template.locale === "en" ? "steel" : "gold"}>{template.locale}</Badge>
                  </div>
                  <p className="mt-2 text-sm font-semibold text-primary">{template.subject}</p>
                </div>
                <span className="whitespace-nowrap text-[0.6rem] text-neutral-400">{formatDate(template.updatedAt)}</span>
              </div>
              <pre className="mt-3 max-h-28 overflow-auto rounded-sm bg-surface p-3 font-mono text-[0.62rem] leading-relaxed text-neutral-600">
                {template.bodyHtml.slice(0, 500)}
              </pre>
            </article>
          ))}
          {templates.length === 0 && (
            <div className="rounded-lg border border-dashed border-surface-300 p-8 text-center text-sm text-neutral-500">
              Belum ada template email.
            </div>
          )}
        </div>

        <div className="card h-fit p-5 xl:col-span-5">
          <h2 className="flex items-center gap-2 font-display text-base font-bold text-primary">
            <Mail className="h-4 w-4 text-accent-700" aria-hidden />
            Tambah / update template
          </h2>
          <form action={upsertEmailTemplateAction} className="mt-4 space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label htmlFor="tpl-key" className="field-label text-xs">Key</label>
                <input id="tpl-key" name="key" placeholder="rfq_new" required className="field py-2 font-mono text-xs" />
              </div>
              <div>
                <label htmlFor="tpl-locale" className="field-label text-xs">Locale</label>
                <select id="tpl-locale" name="locale" className="field py-2 text-xs">
                  <option value="id">id</option>
                  <option value="en">en</option>
                </select>
              </div>
            </div>
            <div>
              <label htmlFor="tpl-subject" className="field-label text-xs">Subject</label>
              <input id="tpl-subject" name="subject" placeholder="RFQ Baru: {{ref}}" required className="field py-2 text-xs" />
            </div>
            <div>
              <label htmlFor="tpl-body" className="field-label text-xs">Body HTML</label>
              <textarea id="tpl-body" name="bodyHtml" required rows={8} className="field resize-y py-2 font-mono text-xs" />
            </div>
            <button type="submit" className="btn-dark btn-sm w-full">
              <Plus className="h-3.5 w-3.5" aria-hidden />
              Simpan template
            </button>
            <p className="text-[0.62rem] leading-relaxed text-neutral-400">
              Variabel tersedia: {"{{ref}}"}, {"{{name}}"}, {"{{company}}"}, {"{{email}}"}, {"{{phone}}"}, {"{{details}}"}.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
