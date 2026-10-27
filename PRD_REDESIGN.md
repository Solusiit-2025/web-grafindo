# PRD — Redesign Tahap 2: Dari "Modern" ke "Profesional & Siap Produksi"

**Versi:** 3.0 (menggantikan v2.0 yang sudah usang)
**Tanggal:** 27 Oktober 2026
**Status:** Draft untuk review
**Dokumen terkait:** `PRD.md` (fungsional v1.0), `PROJECT_STRUCTURE.md`
**Stack:** Next.js 16.4 (App Router, Turbopack) · React 19.3 · Tailwind 3.4 · Prisma 5 + PostgreSQL · framer-motion · lucide-react · jose · nodemailer

> **Catatan revisi.** PRD v2.0 ditulis dari audit kode pada ~05:15. Sejak itu redesign tahap 1 (design system, layout admin, proteksi login, i18n, animasi, model Testimonial/ClientLogo/HomeSection, dll.) sudah diimplementasikan. Dokumen ini adalah **audit ulang terhadap kondisi saat ini** dan mendefinisikan pekerjaan *berikutnya*.

### Cara audit ini dilakukan (dan batasannya)
| Metode | Status |
|---|---|
| Membaca kode sumber (layout, home, proxy, session, Visual, config, schema) | ✅ |
| `tsc --noEmit` | ✅ lulus, 0 error |
| Request HTTP ke dev server `localhost:3000` (status, redirect, canonical, h1, JSON-LD, `<img>`) | ✅ |
| Inspeksi visual di browser (screenshot, mobile, animasi) | ❌ **tidak bisa** — koneksi browser tool gagal (CDP). Penilaian visual di dokumen ini berdasar kode, bukan pengamatan langsung |
| Lighthouse / Core Web Vitals | ❌ **belum diukur** (dev server tidak representatif; harus pada `next build && next start`) |
| Pengujian fungsional form/login/upload | ❌ belum dijalankan |

---

## 1. Ringkasan Eksekutif

Tahap 1 berhasil menaikkan fondasi: ada design system, hero berlapis gradient, bento kategori, counter, marquee, carousel testimoni, admin dengan sidebar, dan akses admin yang sudah dijaga. **Secara struktur, web ini sudah modern.**

Yang menahannya dari kesan **profesional-terpercaya** untuk klien B2B/BUMN bukan lagi kode UI, melainkan lima hal:

1. **Tidak ada satu pun foto nyata.** Direktori `public/` hanya berisi `logo.png`; home hanya merender 2 `<img>` — keduanya logo. Seluruh visual produk adalah ilustrasi SVG generik berlabel "GRAFINDO · In-house".
2. **Klaim kepercayaan belum terverifikasi dan di-hardcode** (ISO 9001/14001, 480+ klien, 98% repeat order, 1,2 jt unit/bulan, rating 4,9/5, testimoni bernama). Untuk audiens BUMN ini risiko kredibilitas — dan potensi risiko hukum — jika tidak benar.
3. **Konfigurasi produksi belum aman/siap**: secret JWT punya fallback publik, tidak ada rate-limit login/RFQ/kontak, upload ke disk lokal (tidak jalan di Vercel), `remotePatterns` terbuka ke semua host.
4. **Placeholder masih tampil di produksi**: nomor WhatsApp `6281234567890`, tautan sosial tebakan, ThemeSwitcher untuk publik.
5. **Seluruh situs dirender dinamis** (`cookies()` di root layout + `searchParams`), 9 query Prisma per request di home, tanpa strategi cache.

---

## 2. Kondisi Saat Ini (Hasil Verifikasi)

### 2.1 ✅ Sudah Selesai — Tidak Perlu Dikerjakan Ulang

| Area | Bukti |
|---|---|
| Proteksi admin berlapis | `GET /admin/dashboard` → **307 → `/login?from=…`**; `src/proxy.ts` (optimistic) + `(admin)/layout.tsx` (`getAdminSession`, cek role) + **11/11** `actions.ts` memakai guard (`requireAdmin`) |
| Layout admin & publik terpisah | `(admin)/layout.tsx` + `AdminShell`; `(public)/layout.tsx` |
| Design system | `components/ui/*` (Button, Badge, Tabs, Accordion, Toast, Skeleton, Breadcrumb, EmptyState, ConfirmSubmit, CopyButton), `components/motion/*` (Reveal, Marquee, Counter) |
| `next/image` | `Visual.tsx` memakai `next/image`; **0** `<img>` mentah tersisa di `src/` |
| Brand | `PT. GRAFINDO MITRASEMESTA`, logo, `siteConfig` sebagai single source |
| Tipografi | Urbanist + Plus Jakarta Sans + JetBrains Mono via `next/font` (`display: swap`) |
| SEO dasar | `<title>` per halaman, **canonical benar per-route** (`/products`, `/about`, …), 1 `<h1>`/halaman, JSON-LD di semua halaman, OG image dinamis, `sitemap.ts`, `robots.ts`, skip-link |
| Konten dari CMS | Model `Testimonial`, `ClientLogo`, `HomeSection` (urutan & aktif/nonaktif section home), `home_stats` di `SiteSetting` |
| State sistem | `not-found.tsx`, `error.tsx`, `loading.tsx` (public & products) |
| Security headers dasar | `X-Content-Type-Options`, `Referrer-Policy`, `X-Frame-Options`, `Permissions-Policy` |
| Kualitas kode | `tsc` bersih |

### 2.2 Temuan Baru

Level: 🔴 Kritis · 🟠 Tinggi · 🟡 Sedang · ⚪ Rendah

#### A. Kredibilitas & Konten

| # | Temuan | Bukti | Level |
|---|---|---|---|
| C1 | **Tidak ada fotografi.** Semua gambar produk/kategori/portofolio/blog jatuh ke `FallbackArt` SVG. Ilustrasi garis-garis bagus sebagai fallback, tapi bukan pengganti foto produk untuk industri manufaktur | `public/` hanya `icons/logo.png`; home render 2 `<img>` = logo; `Visual.tsx` | 🔴 |
| C2 | **Klaim sertifikasi & angka di-hardcode**: ISO 9001:2015, ISO 14001, SNI/TKDN Ready, 32+ tahun (`foundedYear: 1994`), 480+ klien, 1,2 jt unit/bulan, 98% repeat, rating 4,9/5 | `config/site.ts` L26-45, `page.tsx` L506 & L215, `opengraph-image.tsx` L68 | 🔴 |
| C3 | **Testimoni fallback fiktif dengan nama orang & perusahaan** (Rani Prameswari/Kopi Nusantara, Dimas Ardhana/AutoParts Co, Sarah Lim/FC Garuda) tampil bila tabel kosong | `(public)/page.tsx` L31-59 | 🔴 |
| C4 | Nomor WhatsApp **placeholder** `6281234567890` live di halaman Kontak | HTTP: `wa.me/6281234567890` | 🟠 |
| C5 | Tautan sosial tebakan (`instagram.com/grafindo`, `facebook.com/grafindo`, `linkedin.com/company/grafindo`, …) | `config/site.ts` | 🟠 |
| C6 | Marquee "Dipercaya oleh" memakai **nama teks** tanpa logo; fallback `clientsFallback` juga teks | `page.tsx` L244-262 | 🟡 |
| C7 | Avatar inisial "KN / AP / FG" + "480+" di hero adalah elemen dekoratif yang meniru bukti sosial | `page.tsx` L203-217 | 🟡 |
| C8 | Email kontak `admin1@…` terkesan akun internal, bukan alamat bisnis (`sales@`/`info@`) | `config/site.ts` | ⚪ |

#### B. Keamanan & Produksi

| # | Temuan | Bukti | Level |
|---|---|---|---|
| S1 | **Fallback secret JWT publik** `"dev-secret-change-me"` di dua tempat. Jika `JWT_SECRET` tak ter-set di production, siapa pun dapat memalsukan token admin. `.env` lokal berisi secret hanya 20 karakter | `lib/auth/jwt.ts` L4, `proxy.ts` L4 | 🔴 |
| S2 | **Tidak ada rate-limit / lockout pada login** → brute force | `api/auth/login/route.ts` | 🟠 |
| S3 | **RFQ & Kontak tanpa rate-limit / honeypot / CAPTCHA** → spam & email flooding (upload sudah ber-rate-limit) | `quote/actions.ts`, `contact/actions.ts` | 🟠 |
| S4 | **Upload ke `public/uploads` (disk lokal)**. Folder `.vercel/` ada → jika deploy ke Vercel, filesystem serverless read-only, upload gagal / file hilang. Storage R2/S3 di PRD v1.0 belum diimplementasikan | `admin/products/actions.ts` L61-65, `MediaManager.tsx` L173 | 🟠 |
| S5 | `images.remotePatterns` = `hostname: "**"` → image optimizer bisa dipakai memproses gambar dari host mana pun (abuse bandwidth/SSRF-ish) | `next.config.ts` L7 | 🟠 |
| S6 | Tidak ada **CSP**; tidak ada `Strict-Transport-Security` | `next.config.ts` | 🟡 |
| S7 | Guard admin melempar `Error("UNAUTHORIZED")` → pengguna melihat halaman error generik, bukan pesan/redirect yang rapi | `lib/auth/session.ts` | 🟡 |
| S8 | `allowedDevOrigins` memuat host tunnel & IP LAN di config produksi | `next.config.ts` L5 | ⚪ |
| S9 | Upload publik (`/api/upload`) tanpa sesi; validasi hanya via `file.type` dari klien (bisa dipalsukan) — perlu sniffing magic-bytes | `api/upload/route.ts` | 🟡 |

#### C. Performa & Arsitektur

| # | Temuan | Bukti | Level |
|---|---|---|---|
| P1 | **Seluruh situs dinamis.** Root layout memanggil `cookies()` (locale, theme) dan home membaca `searchParams` → tak ada static/ISR; setiap kunjungan = round-trip DB | `app/layout.tsx` L100-102; header `Cache-Control: no-store` | 🟠 |
| P2 | Home menjalankan **9 query Prisma paralel** per request, termasuk memuat semua `siteContent` locale | `(public)/page.tsx` L83-124 | 🟠 |
| P3 | Kode memakai `revalidatePath`/`revalidateTag`/`unstable_cache`/`use cache` (49 kemunculan di `src/`, belum dirinci per jenis), tetapi respons halaman tetap `no-store` di dev dan belum ada strategi cache yang terukur. Next 16 menyediakan `cacheComponents`, `use cache`, `updateTag` (dokumen: `node_modules/next/dist/docs/01-app/…`). Perlu diverifikasi pada build produksi | grep + docs | 🟡 |
| P4 | `page.tsx` home = **659 baris**, semua section inline dalam satu file → sulit dirawat, bertentangan dengan prinsip modularitas `PROJECT_STRUCTURE.md` | `(public)/page.tsx` | 🟡 |
| P5 | `remotePatterns` terbuka + tanpa `minimumCacheTTL`; ukuran gambar upload 20MB tanpa kompresi sisi server | `next.config.ts` | 🟡 |
| P6 | **Belum ada pengukuran** Core Web Vitals / Lighthouse | — | 🟡 |

#### D. i18n & SEO

| # | Temuan | Bukti | Level |
|---|---|---|---|
| I1 | Locale lewat **cookie + `?lang=`** (bukan path). Mesin pencari tidak bisa mengindeks versi EN sebagai URL terpisah; `alternates.languages` menunjuk `/?lang=en` statis dari root | `layout.tsx` L53-59 | 🟠 |
| I2 | Masih ada teks inline bahasa: `locale === "en" ? … : …` di home; teks skip-link hardcoded Indonesia di root layout; `<title>` template tidak dilokalkan | `page.tsx` L407, L509; `layout.tsx` L113 | 🟡 |
| I3 | **FAQPage JSON-LD di home berisi 1 pertanyaan hardcoded yang tidak tampil di halaman** → melanggar pedoman Google (markup harus sesuai konten terlihat), berisiko diabaikan/penalti | `page.tsx` L634-655 | 🟡 |
| I4 | Atribut `hreflang` per halaman perlu diverifikasi di HTML produksi (pengecekan regex saya tidak konklusif) | — | ⚪ |

#### E. UX & Desain

| # | Temuan | Bukti | Level |
|---|---|---|---|
| X1 | **ThemeSwitcher 6 tema (gold/ocean/emerald/crimson/violet/electric) tampil untuk pengunjung publik** (`HeaderShell` L104 & L205). Situs korporat B2B butuh identitas konsisten; 6 warna merusak brand recognition & bertentangan dengan keputusan PRD v1.0 "5 warna TETAP" | `HeaderShell.tsx`, `config/themes.ts` | 🟠 |
| X2 | Halaman dalam (About, Services, Blog) belum diverifikasi visual; asumsi masih "ilustrasi + teks" tanpa foto fasilitas/mesin/tim | — | 🟡 |
| X3 | Tidak ada **bukti kredibilitas yang bisa diunduh**: company profile PDF, sertifikat, spec sheet | tidak ada di `public/documents` | 🟡 |
| X4 | Tidak ada **mockup/preview** interaktif atau kalkulator estimasi — fitur pembeda yang umum pada situs sticker/emblem kustom | — | ⚪ |
| X5 | Belum ada pengujian aksesibilitas otomatis (axe) maupun uji kontras tema non-default | — | 🟡 |

#### F. Kualitas & Operasional

| # | Temuan | Level |
|---|---|---|
| Q1 | **Tidak ada test** (unit/E2E) dan **tidak ada ESLint** (`npm run lint` = `tsc --noEmit`) | 🟠 |
| Q2 | Tidak ada CI, tidak ada monitoring error (Sentry), tidak ada analytics (GA4/Plausible) terpasang | 🟡 |
| Q3 | Tidak ada pengaturan backup DB/media yang terdokumentasi | 🟡 |
| Q4 | Seed lebih dari satu (`seed.mjs`, `-contact`, `-extra`, `-redesign`, `update-phone`) → data awal tersebar, risiko duplikasi | ⚪ |

---

## 3. Tujuan & Metrik

| Metrik | Baseline | Target |
|---|---|---|
| Halaman publik dengan foto nyata (produk, fasilitas, portofolio) | **0%** | 100% pada Home, Katalog (≥ 12 produk), Detail, About, Services |
| Klaim di situs yang punya bukti/dokumen pendukung | belum terverifikasi | 100% (atau dihapus) |
| Temuan Level 🔴 | 4 (C1, C2, C3, S1) | 0 |
| Lighthouse mobile — Performance | belum diukur | ≥ 90 |
| Lighthouse — Accessibility / SEO / Best Practices | belum diukur | ≥ 95 / 100 / ≥ 95 |
| LCP / CLS / INP (field, p75) | belum diukur | < 2,0 s / < 0,05 / < 200 ms |
| TTFB halaman publik (cache hit) | no-store | < 200 ms |
| Query DB per tampilan home (cache miss) | 9 | ≤ 3 (cache selebihnya) |
| Test otomatis | 0 | ≥ 1 E2E untuk RFQ, login, ganti bahasa; unit untuk validasi & RBAC |
| Konversi visitor → RFQ | belum diukur | baseline dulu (butuh analytics), target ≥ 2,5% |

---

## 4. Lingkup Pekerjaan

### Fase 0 — Verifikasi & Baseline (1-2 hari) · **prasyarat semua fase**
- F0.1 Jalankan `npm run build && npm start`; ukur Lighthouse mobile+desktop untuk `/`, `/products`, `/products/[slug]`, `/e-catalog`, `/quote`, `/about`; simpan laporan.
- F0.2 Inspeksi visual manual 360 / 768 / 1280 / 1920 px, semua halaman publik + admin; screenshot sebagai baseline "sebelum".
- F0.3 Uji alur: login admin, CRUD produk, upload, RFQ end-to-end (email terkirim?), ganti bahasa, form kontak.
- F0.4 Pasang analytics (GA4 atau Plausible) + Sentry agar semua perubahan berikutnya terukur.

### Fase 1 — Keamanan & Kesiapan Produksi (3-4 hari) · 🔴/🟠
| ID | Tugas |
|---|---|
| S1 | Hapus fallback secret; aplikasi **gagal start** jika `JWT_SECRET` kosong atau < 32 karakter (validasi env terpusat dengan Zod, mis. `src/lib/env.ts`). Rotasi secret. |
| S2 | Rate-limit + lockout login (mis. 5 gagal/15 menit per IP+email), log percobaan; pertimbangkan hashing dengan cost yang memadai. |
| S3 | Rate-limit + honeypot (+ Cloudflare Turnstile opsional) untuk RFQ & kontak; antrean/throttle email. |
| S4 | **Storage object (R2/S3)** untuk upload: presigned upload, simpan hanya URL + metadata di `Media`. Hentikan tulis ke `public/uploads`. Tentukan target deploy dulu (lihat pertanyaan #1). |
| S5 | `remotePatterns` dibatasi ke host storage/CDN milik sendiri. |
| S6 | Tambah CSP (mulai `Content-Security-Policy-Report-Only`), HSTS di production. |
| S7 | Guard admin: redirect/`forbidden()` yang rapi alih-alih throw generik; pesan Indonesia/Inggris. |
| S9 | Validasi upload dengan **magic-bytes**, bukan hanya `file.type`; re-encode gambar (sharp) & batasi dimensi. |
| S8 | Pindahkan `allowedDevOrigins` ke env, hanya aktif di development. |

### Fase 2 — Kredibilitas & Konten (paralel Fase 1; bergantung pada klien)
| ID | Tugas |
|---|---|
| C1 | **Program fotografi**: ≥ 12 foto produk studio (konsisten: background, lighting, rasio 1:1 & 4:3), 8-10 foto fasilitas/mesin/QC, 1 set tim; atau sesi foto profesional. Pipeline: upload via Media Library → kompres → AVIF/WebP. `FallbackArt` tetap sebagai fallback, **bukan** tampilan utama. |
| C2 | **Audit klaim**: tiap angka/sertifikat harus punya bukti (nomor sertifikat, tanggal berlaku, lembaga penerbit). Yang tak terbukti → hapus/ubah jadi pernyataan faktual. Pindahkan ke CMS (`SiteSetting`) dengan field `buktiURL`/tanggal berlaku. Halaman "Sertifikasi" dengan PDF yang dapat diunduh. |
| C3 | Hapus testimoni fallback fiktif; jika kosong, **sembunyikan section** (bukan tampilkan data palsu). Testimoni nyata butuh izin tertulis; tambahkan opsi anonim. |
| C4/C5 | Nomor WhatsApp & sosial dari CMS; tombol yang belum dikonfigurasi **tidak dirender**. Tambahkan pemeriksaan pre-launch di dashboard ("Checklist go-live"). |
| C6 | Logo klien SVG monokrom (dengan izin publikasi); fallback teks dihapus. |
| C7 | Hapus avatar inisial & "480+" hardcoded dari hero, ganti dengan data `home_stats` yang terverifikasi. |
| C8 | Email bisnis (`sales@`/`info@`) untuk publik; `admin1@` hanya internal. |
| X3 | Unduhan: Company Profile PDF, sertifikat, katalog PDF — dikelola dari CMS. |

### Fase 3 — Performa & Arsitektur (1 minggu)
| ID | Tugas |
|---|---|
| P1 | Keluarkan `cookies()` dari root layout (pindah ke segmen yang butuh / baca locale dari URL — lihat I1). Aktifkan strategi cache Next 16: `cacheComponents` + `use cache` + `cacheTag`, dan `updateTag`/`revalidateTag` dari server action CMS. **Wajib baca** `node_modules/next/dist/docs/01-app/03-api-reference/01-directives/use-cache.md` & `05-config/01-next-config-js/cacheComponents.md` sebelum implementasi (API berbeda dari versi lama). |
| P2 | Pecah query home: data statis (kategori, testimoni, logo, stats) di-cache; hanya data yang berubah cepat dibaca langsung. Target ≤ 3 query saat cache miss. |
| P4 | Pecah `(public)/page.tsx` (659 baris) menjadi komponen per section di `components/public/home/*` (`HeroSection`, `CategoryBento`, `StatsBand`, `ProcessTimeline`, …), page hanya merangkai berdasar `HomeSection`. |
| P5 | `minimumCacheTTL`, `sizes` yang tepat, `priority` hanya untuk LCP; gambar hero di-preload. |
| P6 | Budget performa di CI (Lighthouse CI): LCP < 2,0 s, JS awal < 170 KB gz di halaman utama. |
| – | Audit bundle (`@next/bundle-analyzer`): pastikan `framer-motion` hanya di Client Component kecil; pertimbangkan `LazyMotion`/`m` untuk mengurangi ukuran. |

### Fase 4 — i18n & SEO (1 minggu)
| ID | Tugas |
|---|---|
| I1 | Migrasi ke **routing `/[locale]/…`** (`/id`, `/en`) sesuai PRD v1.0; `proxy.ts` melakukan deteksi `Accept-Language` + redirect; cookie hanya sebagai preferensi. Update `sitemap.ts` per-locale, `alternates.languages` per halaman, `<html lang>` dari segmen. Konsultasikan docs i18n di `node_modules/next/dist/docs`. |
| I2 | Hilangkan semua `locale === "en" ? …` inline & teks hardcoded (skip-link, tombol) → kamus `i18n/messages`. Lokalisasi `title`/`description`. |
| I3 | Hapus FAQPage JSON-LD hardcoded di home; hasilkan dari FAQ yang **benar-benar ditampilkan** (model `FAQ`), per locale. |
| I4 | Verifikasi `hreflang`/`x-default` di HTML; uji di Google Rich Results Test & Search Console. |
| – | Breadcrumb JSON-LD di semua halaman dalam; `Product` + `Offer` (harga & ketersediaan) dari e-catalog. |

### Fase 5 — Penyempurnaan UX & Desain (1,5 minggu)
| ID | Tugas |
|---|---|
| X1 | **Hapus ThemeSwitcher dari area publik.** Pertahankan sistem tema sebagai *pengaturan brand di CMS* (satu tema aktif, mis. Gold sesuai brand). Jika klien ingin white-label, jadikan opsi admin, bukan pilihan pengunjung. Audit kontras WCAG untuk tema yang dipertahankan. |
| X2 | Redesain halaman dalam memakai foto nyata: About (hero fasilitas, timeline sejarah, mesin & kapasitas, sertifikasi, tim), Services (4 layanan bergambar + proses), Portofolio (case study dengan brief → solusi → hasil), Blog (editorial layout, daftar isi, artikel terkait). |
| X4 | **Fitur pembeda (opsional, ROI tinggi):** (a) kalkulator estimasi harga/lead time di RFQ, (b) pratinjau mockup sticker/emblem dari upload desain, (c) pembanding material interaktif (chrome vs PVC vs bordir). |
| – | RFQ: simpan draft (localStorage), status lacak via nomor referensi (`/quote/track`), halaman sukses dengan estimasi waktu respons. |
| – | E-Catalog: sticky header tabel, mode kartu di mobile, tier harga, perbandingan 2-4 produk, ekspor CSV/Excel format LKPP (jika dikonfirmasi klien). |
| – | Micro-interaction: View Transitions antar halaman (docs: `02-guides/view-transitions.md`), skeleton konsisten di semua route, respek `prefers-reduced-motion` (verifikasi, bukan asumsi). |
| – | Admin: dashboard KPI + grafik inquiry, bulk action, pencarian global, log aktivitas (audit trail). |

### Fase 6 — Kualitas & Operasional (1 minggu, paralel)
| ID | Tugas |
|---|---|
| Q1 | ESLint (`eslint-config-next`) + Prettier + `lint` yang sebenarnya; Vitest untuk unit (validasi Zod, RBAC, format harga), **Playwright** untuk E2E: login admin, RFQ end-to-end, ganti bahasa, redirect admin. |
| Q2 | GitHub Actions: typecheck → lint → test → build → Lighthouse CI. Sentry + analytics + uptime monitor. |
| Q3 | Backup DB harian + restore drill terdokumentasi; kebijakan retensi media. |
| Q4 | Satukan seed menjadi satu pipeline idempoten (`prisma/seed.ts`) dengan profil `dev` & `prod`; hapus `update-phone.mjs` & skrip sekali-pakai. |
| – | `README.md` yang benar (env, setup, deploy, runbook), `.env.example` lengkap + validasi. |

---

## 5. Acceptance Criteria (Definition of Done)

**Kredibilitas**
- [ ] Tidak ada satu pun placeholder/data fiktif di produksi (WA, sosial, testimoni, logo klien, angka).
- [ ] Setiap sertifikasi/angka yang tampil memiliki dokumen bukti di CMS.
- [ ] Home, Katalog, Detail, About, Services menampilkan foto nyata; FallbackArt hanya muncul untuk item tanpa foto.

**Keamanan**
- [ ] Aplikasi menolak start tanpa `JWT_SECRET` ≥ 32 karakter; tidak ada literal secret di kode.
- [ ] Login, RFQ, kontak, upload ter-rate-limit (diuji otomatis).
- [ ] Upload tidak lagi menulis ke `public/`; file tersimpan di object storage; MIME dicek via magic-bytes.
- [ ] `remotePatterns` hanya host milik sendiri; CSP aktif (minimal report-only → enforce).

**Performa & SEO**
- [ ] Lighthouse mobile (build produksi): Perf ≥ 90, A11y ≥ 95, BP ≥ 95, SEO = 100 pada `/`, `/products`, `/products/[slug]`, `/quote`.
- [ ] Halaman publik tidak lagi `no-store`; perubahan di CMS tampil < 60 detik (atau instan via `updateTag`).
- [ ] URL `/id/…` & `/en/…` terindeks terpisah; `hreflang` valid; FAQ JSON-LD sesuai konten.

**UX**
- [ ] Pengunjung tidak melihat pemilih tema.
- [ ] Semua halaman lolos uji visual 360 / 768 / 1280 / 1920 px; tidak ada layout shift (CLS < 0,05).
- [ ] Axe: 0 pelanggaran serius/kritis pada halaman utama; navigasi keyboard penuh.

**Kualitas**
- [ ] CI hijau (typecheck, lint, test, build); E2E mencakup RFQ & login.
- [ ] Sentry & analytics aktif; backup & restore teruji.

---

## 6. Risiko

| Risiko | Dampak | Mitigasi |
|---|---|---|
| Klien tidak menyediakan foto/bukti sertifikasi tepat waktu | Fase 2 terhambat; situs tetap tampak "ilustrasi" | Jadwalkan sesi foto di minggu pertama; siapkan foto stok berlisensi hanya sebagai sementara (diberi label internal, tidak dipublikasikan sebagai foto pabrik) |
| Migrasi `/[locale]` memutus URL/SEO yang sudah ada | Penurunan trafik | Redirect 301 dari `?lang=` & path lama; pantau Search Console |
| `cacheComponents` mengubah perilaku render (breaking vs Next lama) | Bug data basi | Aktifkan bertahap per-route, uji E2E, baca docs resmi di `node_modules` |
| Pindah ke object storage | Tautan gambar lama rusak | Skrip migrasi `public/uploads` → bucket + update URL di tabel `Media`/`ProductImage` |
| Banyak agen/orang mengubah kode paralel (terminal `opencode` aktif saat audit ini) | Konflik & audit cepat usang | Satu cabang per fase, PR kecil, CI wajib; audit ulang di akhir tiap fase |

---

## 7. Roadmap

| Fase | Durasi | Bergantung pada |
|---|---|---|
| 0. Verifikasi & Baseline | 1-2 hari | — |
| 1. Keamanan & Produksi | 3-4 hari | Keputusan target deploy |
| 2. Kredibilitas & Konten | 1-3 minggu (kalender, banyak menunggu klien) | Foto, dokumen, izin |
| 3. Performa & Arsitektur | 1 minggu | Fase 0 |
| 4. i18n & SEO | 1 minggu | Fase 3 (cache) |
| 5. UX & Desain | 1,5 minggu | Fase 2 (foto) |
| 6. Kualitas & Operasional | 1 minggu (paralel) | — |

**Estimasi kerja efektif:** ± 5-6 minggu; **minimum jalur kritis** untuk kesiapan produksi aman = Fase 0 + 1 + (C2-C5 dari Fase 2) ≈ **1 minggu**.

---

## 8. Pertanyaan Terbuka (Butuh Keputusan)

1. **Target deploy?** Vercel (ada folder `.vercel/`), VPS+Docker, atau lainnya? Menentukan solusi upload & cache.
2. **Fakta perusahaan:** benarkah berdiri 1994, ISO 9001:2015 & ISO 14001 (nomor & masa berlaku?), 480+ klien, 1,2 jt unit/bulan, 98% repeat order? Jika tak bisa dibuktikan, angka akan dihapus.
3. **Aset:** apakah tersedia foto produk/fasilitas profesional dan logo klien berizin? Atau perlu sesi foto?
4. **Kontak resmi:** nomor WhatsApp bisnis, email sales, dan akun media sosial yang benar.
5. **Tema:** setuju ThemeSwitcher dihapus dari publik dan hanya satu tema brand (Gold) yang dipakai?
6. **Routing bahasa:** setuju migrasi ke `/id` & `/en`?
7. **Harga E-Catalog:** publik, atau hanya setelah login B2B?
8. **Fitur pembeda (X4):** apakah ingin kalkulator estimasi / mockup preview masuk lingkup ini?

---

*Draft v3.0 — hasil audit ulang pada 27 Oktober 2026 (kode + HTTP). Penilaian visual & skor Lighthouse menunggu Fase 0.*
