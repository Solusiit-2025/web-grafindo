import { Globe2, MessageCircle, Plus, Settings, Share2 } from "lucide-react";
import { prisma } from "@/lib/db/prisma";
import { upsertWhatsAppAction, createSocialLinkAction, deleteSocialLinkAction } from "./actions";
import { Badge } from "@/components/ui/Badge";
import { ConfirmSubmit } from "@/components/ui/ConfirmSubmit";
import { EmailSettingsPanel } from "./EmailSettingsPanel";
import { siteConfig } from "@/config/site";

export default async function SettingsPage() {
  const [wa, socials, emailSetting] = await Promise.all([
    prisma.whatsAppSetting.findFirst(),
    prisma.socialLink.findMany({ orderBy: { order: "asc" } }),
    prisma.emailSetting.findFirst(),
  ]);

  return (
    <div className="space-y-5">
      <div>
        <p className="text-[0.62rem] font-bold uppercase tracking-[0.16em] text-accent-700">Pengaturan</p>
        <h1 className="mt-1.5 font-display text-2xl font-extrabold text-primary md:text-3xl">Pengaturan Situs</h1>
        <p className="mt-1 text-sm text-neutral-500">Kelola identitas, WhatsApp, dan kanal sosial resmi.</p>
      </div>

      <div className="grid gap-4 xl:grid-cols-12">
        <div className="space-y-4 xl:col-span-7">
          <section className="card p-5">
            <h2 className="flex items-center gap-2 font-display text-base font-bold text-primary">
              <MessageCircle className="h-4 w-4 text-accent-700" aria-hidden />
              WhatsApp (chat utama)
            </h2>
            <form action={upsertWhatsAppAction} className="mt-4 space-y-3">
              <div>
                <label htmlFor="wa-number" className="field-label text-xs">Nomor (format 628…)</label>
                <input
                  id="wa-number"
                  name="number"
                  defaultValue={wa?.number ?? ""}
                  placeholder="6281234567890"
                  className="field py-2 font-mono text-xs"
                />
              </div>
              <div>
                <label htmlFor="wa-message" className="field-label text-xs">Pesan default</label>
                <textarea
                  id="wa-message"
                  name="defaultMessage"
                  defaultValue={wa?.defaultMessage ?? ""}
                  placeholder="Halo, saya ingin bertanya tentang produk Anda."
                  className="field resize-y py-2 text-xs"
                  rows={3}
                />
              </div>
              <button type="submit" className="btn-dark btn-sm">Simpan WhatsApp</button>
            </form>
          </section>

          <section className="card p-5">
            <h2 className="flex items-center gap-2 font-display text-base font-bold text-primary">
              <Share2 className="h-4 w-4 text-accent-700" aria-hidden />
              Media sosial
            </h2>
            <form action={createSocialLinkAction} className="mt-4 grid gap-2 sm:grid-cols-2">
              <div>
                <label htmlFor="social-platform" className="field-label text-xs">Platform</label>
                <input id="social-platform" name="platform" placeholder="instagram" className="field py-2 text-xs" />
              </div>
              <div>
                <label htmlFor="social-url" className="field-label text-xs">URL</label>
                <input id="social-url" name="url" placeholder="https://…" className="field py-2 text-xs" />
              </div>
              <div>
                <label htmlFor="social-icon" className="field-label text-xs">Icon key</label>
                <input id="social-icon" name="icon" placeholder="instagram" className="field py-2 text-xs" />
              </div>
              <div>
                <label htmlFor="social-order" className="field-label text-xs">Urutan</label>
                <input id="social-order" name="order" type="number" defaultValue={socials.length + 1} className="field py-2 text-xs" />
              </div>
              <button type="submit" className="btn-outline btn-sm sm:col-span-2">
                <Plus className="h-3.5 w-3.5" aria-hidden />
                Tambah social link
              </button>
            </form>

            <ul className="mt-4 divide-y divide-surface-200 rounded-md border border-surface-200">
              {socials.map((social) => (
                <li key={social.id} className="flex items-center gap-3 px-3 py-2.5">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-surface text-accent-700">
                    <Globe2 className="h-3.5 w-3.5" aria-hidden />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold capitalize text-primary">{social.platform}</p>
                    <p className="truncate font-mono text-[0.6rem] text-neutral-400">{social.url}</p>
                  </div>
                  <Badge tone={social.isActive ? "success" : "neutral"}>{social.isActive ? "aktif" : "nonaktif"}</Badge>
                  <ConfirmSubmit
                    action={deleteSocialLinkAction.bind(null, social.id)}
                    title={`Hapus ${social.platform}?`}
                    description="Link akan dihapus dari footer situs."
                    confirmLabel="Hapus link"
                  >
                    Hapus
                  </ConfirmSubmit>
                </li>
              ))}
              {socials.length === 0 && (
                <li className="px-3 py-6 text-center text-xs text-neutral-400">Belum ada social link.</li>
              )}
            </ul>
          </section>

          <EmailSettingsPanel setting={emailSetting} />
        </div>

        <aside className="space-y-4 xl:col-span-5">
          <section className="relative overflow-hidden rounded-lg bg-primary p-5 text-white">
            <div className="pattern-grid pointer-events-none absolute inset-0 opacity-50" aria-hidden />
            <div className="relative">
              <p className="text-[0.6rem] font-semibold uppercase tracking-[0.16em] text-accent">Identitas brand</p>
              <p className="mt-2 font-display text-2xl font-extrabold">GRAFINDO</p>
              <p className="mt-1 text-xs text-white/50">{siteConfig.legalName}</p>
              <dl className="mt-4 space-y-2 text-xs">
                <div className="flex justify-between gap-3 border-t border-white/10 pt-2">
                  <dt className="text-white/40">Email</dt>
                  <dd className="font-mono text-white/80">{siteConfig.email}</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-white/40">Telepon</dt>
                  <dd className="font-mono text-white/80">{siteConfig.phone}</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-white/40">Berdiri</dt>
                  <dd className="font-mono text-white/80">{siteConfig.foundedYear}</dd>
                </div>
              </dl>
              <p className="mt-4 text-[0.62rem] leading-relaxed text-white/40">
                Perubahan identitas inti dilakukan di konfigurasi situs agar konsisten di metadata, JSON-LD, dan footer.
              </p>
            </div>
          </section>

          <section className="card p-5">
            <h2 className="flex items-center gap-2 font-display text-base font-bold text-primary">
              <Settings className="h-4 w-4 text-accent-700" aria-hidden />
              Catatan operasional
            </h2>
            <ul className="mt-3 space-y-2 text-xs leading-relaxed text-neutral-600">
              <li>• Email RFQ & kontak masuk tercatat di database.</li>
              <li>• Nomor WhatsApp dipakai untuk floating button dan CTA.</li>
              <li>• Social link tampil di footer dengan urutan di atas.</li>
              <li>• Perubahan langsung berlaku setelah disimpan.</li>
            </ul>
          </section>
        </aside>
      </div>
    </div>
  );
}
