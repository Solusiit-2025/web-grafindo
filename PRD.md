# Product Requirements Document (PRD)
## Website Manufaktur Sticker, Graphic, Emblem & Soft Emblem — dengan CMS

**Versi:** 1.0 (Draft)
**Tanggal:** 26 Oktober 2026
**Status:** Draft untuk review klien
**Platform:** Web (Responsive) + CMS Admin Panel
**Tech:** Next.js (latest) + PostgreSQL + Prisma | **Bahasa:** Indonesia (id) & English (en)

---

## 1. Project Overview

Website company profile + katalog produk + sistem pemesanan/penawaran (RFQ) untuk perusahaan manufaktur yang memproduksi **sticker**, **graphic printing**, **emblem (hard badge)**, dan **soft emblem (rubber/PVC/embroidered patch)**. Dilengkapi **CMS (Content Management System)** agar tim internal dapat mengelola konten, produk, portofolio, dan artikel tanpa ketergantungan developer.

**Tujuan utama:**
- Menampilkan identitas brand yang **modern, elegan, dan profesional**.
- Menjadi etalase digital produk & kapabilitas manufaktur.
- Memudahkan calon pembeli (B2B/B2C) untuk melihat produk, portofolio, dan mengajukan penawaran (RFQ).
- Mempermudah tim internal mengelola konten melalui CMS.
- Semua konten (teks, logo, data, artikel) tersentral di database & dikelola penuh via CMS (tanpa hard-coded).
- Mendukung 2 bahasa: Indonesia (id) & English (en).

**Bukan tujuan (out of scope v1):** E-commerce checkout penuh dengan payment gateway (dipertimbangkan fase 2). Fokus v1 adalah lead generation + RFQ + company profile.

---

## 2. Target Audience & Goals

### 2.1 Target Audience
- **B2B:** Brand owner, apparel brand, automotive accessory distributor, event organizer, corporate (seragam, merchandise, branding).
- **B2C:** Individu yang memesan sticker custom, emblem custom, patch untuk jaket/komunitas.
- **Internal:** Admin marketing, sales, content manager, owner.

### 2.2 Core Goals
- Meningkatkan kredibilitas & profesionalisme brand di mata calon klien.
- Menjadi channel utama akuisisi lead (inquiry/RFQ).
- Mempermudah presentasi kapabilitas produksi (material, teknik, MOQ, lead time).
- Memberikan CMS yang mudah dipakai non-teknis.

---

## 3. Brand & Design Direction

**Kata kunci visual:** Modern, elegan, profesional, clean, premium, industrial-craft.

### 3.1 Palet Warna (5 Warna Profesional — TETAP)
1. **Primary (Deep Charcoal):** `#0F1115` — utama, teks & header
2. **Secondary (Steel Blue):** `#1F3A5F` — sekunder, link & elemen pendukung
3. **Accent (Warm Gold):** `#C9A24B` — aksen premium, CTA, highlight
4. **Neutral (Slate Gray):** `#6B7280` — teks sekunder, border, ikon
5. **Surface (Off-white):** `#F7F5F2` — permukaan/background lembut

### 3.1b Layout
- **Full-width layout:** konten memenuhi lebar viewport (tanpa container sempit), dengan padding horizontal responsif (px-6 / md:px-12). Section hero & banner full-bleed.

### 3.2 Tipografi
- **Display / Heading:** `Urbanist` atau `Sora` (geometric, modern luxury)
- **Body / UI:** `Plus Jakarta Sans` atau `Inter` (legibility tinggi)
- **Mono (spec/teknis):** `JetBrains Mono` untuk spesifikasi material & ukuran

### 3.3 Prinsip UI/UX
- Hero full-bleed dengan visual produk high-res + headline tegas.
- Banyak whitespace, grid rapi, tipografi besar & tegas.
- Micro-interactions (hover, scroll reveal) halus via Framer Motion.
- Mobile-first, touch-friendly.
- Dark mode opsional (nice-to-have).

### 3.4 Imagery
- Foto produk studio (high-res, konsisten lighting).
- Foto proses produksi (workshop, mesin, QC) untuk kredibilitas.
- Video pendek (loop) di hero (opsional).

---

## 4. Informasi Arsitektur Situs (Sitemap)

```
/ (Home)
/about (Tentang Kami)
  /about/facility (Fasilitas & Kapabilitas)
/products (Katalog Produk)
  /products/stickers
  /products/graphics
  /products/emblems
  /products/soft-emblems
  /products/[slug] (Detail Produk)
/e-catalog (E-Catalog / Katalog Elektronik)
  /e-catalog (Daftar Produk + Harga + Spesifikasi)
  /e-catalog/[slug] (Detail Spesifikasi & Harga per Produk)
  /e-catalog/compare (Perbandingan Produk)
  /e-catalog/download (Unduh Katalog PDF)
/portfolio (Portofolio / Galeri Karya)
  /portfolio/[slug]
/services (Layanan: Custom, OEM, Bulk)
/blog (Artikel / News / Tips)
  /blog/[slug]
/quote (Ajukan Penawaran / RFQ)
/contact (Kontak & Lokasi)
/faq
/privacy-policy
/terms

Admin CMS:
/admin (Dashboard)
/admin/products
/admin/ecatalog
/admin/categories
/admin/portfolio
/admin/blog
/admin/pages
/admin/media
/admin/inquiries (RFQ masuk)
/admin/users
/admin/settings
```

---

## 5. Core Features & Functional Requirements

### 5.1 Halaman Publik

#### 5.1.1 Home (FR-HOME)
- Hero section: headline + subheadline + CTA "Ajukan Penawaran" & "Lihat Katalog".
- Showcase 4 kategori utama (Sticker, Graphic, Emblem, Soft Emblem) dengan kartu visual.
- Highlight kapabilitas: material, teknik, MOQ, lead time, QC.
- Portofolio pilihan (carousel/grid).
- Testimoni klien.
- CTA banner + kontak cepat (WhatsApp floating button).

#### 5.1.2 Tentang Kami (FR-ABOUT)
- Sejarah, visi/misi, nilai perusahaan.
- Tim/leadership (opsional).
- Fasilitas & mesin produksi (foto + spesifikasi).
- Sertifikasi/standar kualitas (ISO, dll. jika ada).
- Angka pencapaian (tahun berdiri, klien, produksi/bulan).

#### 5.1.3 Katalog Produk (FR-CATALOG)
- Listing produk dengan filter: kategori, material, teknik, aplikasi, harga range.
- Search & sort (terbaru, populer, harga).
- Pagination / infinite scroll.
- Kartu produk: gambar, nama, kategori, badge "Custom Available", CTA "Detail" & "Minta Penawaran".

#### 5.1.4 Detail Produk (FR-PRODUCT-DETAIL)
- Galeri gambar (zoom, multiple view).
- Deskripsi lengkap, spesifikasi teknis (material, ukuran, finishing, ketahanan).
- Varian (ukuran, warna, finishing).
- Aplikasi/penggunaan.
- MOQ & estimasi lead time.
- FAQ per produk.
- CTA "Minta Penawaran" & "Konsultasi WhatsApp".
- Produk terkait.

#### 5.1.5 E-Catalog / Katalog Elektronik (FR-ECATALOG)
Khusus untuk kebutuhan procurement (termasuk klien BUMN/instansi), menampilkan produk secara terstruktur dengan spesifikasi teknis standar dan harga transparan.

- **FR-EC-1 Listing E-Catalog:** tabel/grid produk dengan kolom: SKU/Kode Produk, Nama, Kategori, Material, Dimensi, Finishing, MOQ, Harga Satuan, Harga Grosir (tier), Status Ketersediaan.
- **FR-EC-2 Filter & Sort:** filter by kategori, material, dimensi, range harga, ketersediaan; sort by harga/nama/terbaru.
- **FR-EC-3 Detail Spesifikasi:** halaman detail dengan spesifikasi teknis lengkap (material, ukuran, ketebalan, warna, finishing, ketahanan/weathering, aplikasi, standar kualitas), gambar multi-view, dan tabel harga bertingkat (volume tier).
- **FR-EC-4 Harga Transparan:** tampilkan harga satuan & harga grosir per tier (mis. 1-99, 100-499, 500+). Harga dapat disembunyikan/ditampilkan berdasarkan login (opsional: harga khusus B2B setelah login).
- **FR-EC-5 Perbandingan Produk:** pilih 2-4 produk untuk dibandingkan side-by-side (spesifikasi & harga).
- **FR-EC-6 Unduh Katalog PDF:** generate/download katalog PDF (per kategori atau full) dengan branding perusahaan, spesifikasi & harga. Dapat di-generate on-demand atau dari file yang di-upload admin.
- **FR-EC-7 Dokumen Pendukung:** lampiran sertifikat, spec sheet (PDF), MSDS (jika relevan) per produk.
- **FR-EC-8 Validitas Harga:** tampilkan periode berlaku harga (mis. "Harga berlaku s/d 31 Des 2026") + disclaimer.
- **FR-EC-9 Integrasi Procurement (opsional):** format data sesuai standar e-katalog LKPP (kode produk, satuan, harga, spesifikasi) untuk kemudahan upload ke sistem procurement BUMN. Export CSV/Excel dengan template standar.
- **FR-EC-10 CTA:** "Minta Penawaran Resmi / Quotation" & "Konsultasi" dari halaman detail.
- **FR-EC-11 SEO:** halaman e-catalog indexable, structured data Product (dengan price & availability) untuk rich results.

#### 5.1.6 Portofolio (FR-PORTFOLIO)
- Galeri karya dengan filter kategori/industri.
- Lightbox detail dengan deskripsi, klien (anonim opsional), teknik & material.
- Before/after (opsional).

#### 5.1.7 Layanan (FR-SERVICES)
- Custom design & production.
- OEM/ODM.
- Bulk order & kontrak.
- Konsultasi material & aplikasi.

#### 5.1.8 Blog/Artikel (FR-BLOG)
- Listing artikel dengan kategori & tag.
- Detail artikel dengan rich text, gambar, video embed.
- Share buttons, related articles.
- SEO-friendly URL (slug).

#### 5.1.9 RFQ / Penawaran (FR-RFQ)
- Form multi-step: data klien + detail kebutuhan (kategori, jenis produk, ukuran, qty, material, finishing, deadline, upload referensi).
- Upload file (gambar/PDF/AI/EPS) dengan validasi.
- Auto-email notifikasi ke sales + konfirmasi ke klien.
- Tracking status inquiry (opsional, via nomor referensi).

#### 5.1.10 Kontak (FR-CONTACT)
- Form kontak (nama, email, telepon, pesan).
- Info kontak: telepon, email, WhatsApp, alamat.
- Peta lokasi (Google Maps embed).
- Jam operasional.

#### 5.1.11 FAQ (FR-FAQ)
- Accordion Q&A, filter kategori.

#### 5.1.12 Media Sosial, WhatsApp & Penawaran by Email (FR-SOCIAL-WA-EMAIL)
Semua link/konfigurasi dikelola dari CMS (tanpa hard-coded).

- **FR-SW-1 Link Media Sosial:** tampilkan ikon + link ke platform (Instagram, Facebook, TikTok, YouTube, LinkedIn, dll.) di header/footer/halaman kontak. Urutan & visibilitas diatur CMS.
- **FR-SW-2 WhatsApp (Chat Utama):** floating button + link chat WhatsApp ke nomor utama (dari CMS). Dukung pesan awal (prefill text) yang bisa dikustomisasi per halaman/produk. Nomor & pesan dikelola CMS.
- **FR-SW-3 Penawaran by Email (RFQ Email):** form penawaran mengirim email otomatis ke tim sales (daftar penerima dari CMS) + konfirmasi ke klien. Template email (subject/body) dikelola CMS (id/en).
- **FR-SW-4 Pengaturan Email:** SMTP/from-name/from-email, daftar penerima (To/CC), reply-to, dan template notifikasi (RFQ baru, status update, auto-reply) dikelola dari CMS Settings.
- **FR-SW-5 Tracking:** log pengiriman email (status sent/failed) & nomor referensi inquiry tersimpan di DB.
- **FR-SW-6 Fallback:** jika email gagal, inquiry tetap tersimpan di DB & ditampilkan di CMS; retry manual tersedia.

### 5.2 CMS Admin (FR-CMS)
- **Autentikasi & RBAC:** login, role (Super Admin, Admin, Editor, Sales).
- **Dashboard:** ringkasan inquiry masuk, konten terbaru, statistik kunjungan (opsional).
- **Manajemen Produk:** CRUD produk, kategori, varian, spesifikasi, gambar, status (draft/publish).
- **Manajemen E-Catalog:** CRUD entri katalog elektronik (SKU, spesifikasi standar, harga satuan/grosir tier, validitas harga, dokumen pendukung PDF), import/export CSV/Excel (template standar procurement), generate katalog PDF.
- **Manajemen Portofolio:** CRUD karya + kategori + gambar.
- **Manajemen Blog:** rich text editor (WYSIWYG), kategori/tag, featured image, SEO meta, draft/schedule publish.
- **Manajemen Halaman Statis:** edit konten halaman (About, Services, FAQ) via block-based editor.
- **Media Library:** upload, organize, reuse gambar/file.
- **Inquiry/RFQ Management:** list, filter, status (new/contacted/quoted/won/lost), assign sales, catatan, export CSV.
- **SEO Tools:** meta title/description, slug, OG image, sitemap auto.
- **Settings:** info perusahaan, kontak, sosial media, branding (logo, favicon, warna tema).
- **Manajemen Media Sosial & WhatsApp:** CRUD link sosial media (platform, url, icon, urutan, aktif), nomor WhatsApp utama, pesan prefill default & per halaman/produk.
- **Manajemen Email & Template RFQ:** pengaturan SMTP/from/reply-to, daftar penerima (To/CC), template email (RFQ baru, konfirmasi klien, status update) per bahasa (id/en), preview & test send.
- **Manajemen Konten Situs (Site Content):** CRUD semua teks UI & konten statis (hero headline/subheadline, CTA, about, services, FAQ, footer, navigation label) per bahasa via CMS — tidak ada hard-coded text di frontend.
- **Manajemen Navigasi & Footer:** atur menu, link, urutan, label (id/en) dari CMS.
- **Manajemen Terjemahan (i18n):** kelola terjemahan semua konten (produk, artikel, halaman, UI) untuk id & en dari CMS; fallback ke bahasa default jika belum diterjemahkan.
- **User Management:** CRUD user & role (super admin only).
- **Activity Log:** audit trail perubahan konten (nice-to-have).

### 5.3 Fitur Pendukung
- **WhatsApp Floating Button** (FR-WA): link chat dengan nomor sales.
- **Cookie Consent & Privacy** (FR-COOKIE).
- **Multi-bahasa** (FR-I18N): Indonesia (id, default) + English (en) — wajib dari v1, semua konten & UI diterjemahkan & dikelola via CMS.
- **Konten Tercentral** (FR-CENTRAL): Semua teks, logo, gambar, navigasi, footer, hero, CTA, dan data produk/katalog berasal dari database & dikelola penuh via CMS; frontend tidak memiliki konten hard-coded.
- **Newsletter subscription** (opsional).
- **Search global** (produk + artikel).

---

## 6. Non-Functional Requirements

- **Performance:** LCP < 2.5s, CLS < 0.1, TTFB < 600ms. Gambar optimized (WebP/AVIF, lazy load).
- **SEO:** SSR/SSG, semantic HTML, structured data (Product, Organization, Article, FAQPage), sitemap.xml (per locale), robots.txt, canonical, hreflang untuk id/en.
- **Accessibility:** WCAG 2.1 AA (kontras, keyboard nav, alt text, ARIA).
- **Security:** CSRF protection, rate limiting pada form, validasi upload, sanitasi input, RBAC, password hashing, secure headers.
- **Responsiveness:** breakpoint mobile/tablet/desktop.
- **Scalability:** CMS content-driven, DB terstruktur, CDN untuk media.
- **Backup:** backup DB & media harian.
- **Uptime:** target 99.9%.

---

## 7. Technical Architecture & Tech Stack

- **Framework:** Next.js (versi terbaru / latest, App Router, React 19, TypeScript) — SSR/SSG/ISR.
- **Styling:** Tailwind CSS + shadcn/ui + Framer Motion.
- **CMS:** Custom CMS internal berbasis Next.js + Prisma (full control, semua konten dari database). Tidak ada konten hard-coded di frontend; semua teks, logo, gambar, data dikelola via CMS.
- **Database:** PostgreSQL + Prisma ORM (semua konten, konfigurasi, dan data tersentral di DB).
- **Internasionalisasi (i18n):** Bahasa utama Indonesia (id) & English (en) — bilingual penuh (konten, UI, SEO). Routing berbasis locale (mis. `/id/...`, `/en/...`) dengan deteksi bahasa & fallback.
- **Storage:** Cloudflare R2 / AWS S3 untuk media (gambar, file upload RFQ).
- **Auth:** JWT + RBAC (atau NextAuth).
- **Email:** Nodemailer / Resend untuk notifikasi RFQ.
- **Search:** PostgreSQL full-text atau Meilisearch (opsional).
- **Deployment:** Docker + Nginx + Cloudflare CDN/SSL, atau Vercel.
- **Analytics:** Google Analytics 4 + Search Console.

### 7.1 High-Level Data Model (entitas utama)
- User (id, name, email, passwordHash, role)
- Category (id, name, slug, type: product/portfolio/blog)
- Product (id, name, slug, description, categoryId, specs JSON, moq, leadTime, status)
- EcatalogEntry (id, productId, sku, specStandard JSON, priceUnit, priceTiers JSON, priceValidUntil, availability, docs[], catalogPdfUrl)
- ProductVariant (id, productId, name, attributes)
- ProductImage (id, productId, url, alt, order)
- Portfolio (id, title, slug, description, categoryId, client, technique, images[])
- BlogPost (id, title, slug, content, categoryId, tags, authorId, status, publishedAt, seoMeta)
- Page (id, slug, title, blocks JSON)
- Media (id, url, filename, mimeType, size)
- Inquiry (id, refNumber, name, company, email, phone, category, details JSON, files[], status, assignedTo, notes)
- ContactMessage (id, name, email, phone, message, createdAt)
- SiteSetting (key, value)
- SocialLink (id, platform, url, icon, order, isActive)
- WhatsAppSetting (id, number, defaultMessage, prefillByPage JSON)
- EmailSetting (id, smtpHost, smtpPort, smtpUser, smtpPass, fromName, fromEmail, replyTo, recipients JSON)
- EmailTemplate (id, key, locale, subject, bodyHtml, bodyText)
- EmailLog (id, inquiryId, templateKey, to, status, error, sentAt)
- SiteContent (id, key, locale, value, type) — semua teks/konten statis per bahasa
- NavigationItem (id, parentId, labelId, labelEn, url, order, locale)
- FooterBlock (id, locale, content)
- Media (id, url, filename, mimeType, size, altId, altEn)
- Translation (id, entityType, entityId, locale, field, value) — terjemahan konten dinamis
- FAQ (id, questionId, questionEn, answerId, answerEn, category, order)
- Locale (id, code, name, isDefault)

---

## 8. User Roles & Permissions (RBAC)

| Role | Akses |
|---|---|
| Super Admin | Semua + user management + settings |
| Admin | Kelola konten, produk, portofolio, blog, inquiry |
| Editor | Kelola blog, halaman, media (tanpa produk/harga/inquiry) |
| Sales | Lihat & kelola inquiry, catatan, export |
| (Public) | Baca konten, submit RFQ/kontak |

---

## 9. Milestones & Phases

**Phase 1 — Discovery & Design (Minggu 1-2)**
- Finalisasi brand direction, wireframe, UI kit, sitemap.
- Pilih CMS approach (custom vs headless).

**Phase 2 — Foundation (Minggu 3-4)**
- Setup project (Next.js latest), DB schema (PostgreSQL), auth/RBAC, layout, design system, i18n routing & locale handling.

**Phase 3 — Public Website (Minggu 5-7)**
- Home, About, Catalog, Product Detail, Portfolio, Services, Blog, Contact, FAQ, RFQ (semua bilingual id/en, konten dari DB).

**Phase 4 — CMS Admin (Minggu 8-10)**
- Dashboard, CRUD produk/kategori/portofolio/blog/halaman, media library, inquiry management, SEO tools, settings, manajemen konten situs & terjemahan (id/en), branding/logo.

**Phase 5 — SEO, Performance & QA (Minggu 11-12)**
- SEO audit, performance tuning, accessibility, cross-browser, UAT.

**Phase 6 — Launch & Handover (Minggu 13)**
- Deploy, training CMS untuk tim klien, dokumentasi, go-live.

---

## 10. Assumptions & Open Questions

**Asumsi:**
- Fokus v1 = company profile + katalog + RFQ (bukan e-commerce checkout).
- Konten awal (teks, foto produk) disediakan klien.
- Bahasa utama Indonesia (id) & English (en) — bilingual penuh sejak v1; semua konten & UI dikelola via CMS.
- Hosting & domain disediakan klien atau bundling.

**Open Questions untuk klien:**
1. Nama brand/perusahaan resmi & logo (vector)?
2. Apakah perlu e-commerce (checkout online) di v1 atau cukup RFQ?
3. Konfirmasi: bilingual id/en penuh sejak v1 (sudah disepakati); apakah perlu bahasa tambahan di masa depan?
4. Sistem ERP/akuntansi yang perlu diintegrasikan?
5. Preferensi CMS: custom (kontrol penuh) vs Sanity/Strapi (lebih cepat)?
6. Apakah perlu portal klien (tracking order) di v1?
7. Kebutuhan integrasi WhatsApp Business API vs link biasa?
8. Apakah e-catalog perlu mengikuti format/standar LKPP (e-katalog BUMN) & butuh integrasi langsung ke sistem procurement klien?
9. Apakah harga di e-catalog ditampilkan publik atau hanya setelah login B2B?

---

## 11. Success Metrics

- Waktu load halaman utama < 2.5s.
- Jumlah inquiry/RFQ per bulan meningkat vs baseline.
- Bounce rate < 45%.
- 100% konten dikelola via CMS tanpa developer.
- Lighthouse score ≥ 90 (Performance, SEO, Accessibility).

---

*Dokumen ini adalah draft v1.0 — siap untuk review & iterasi bersama klien.*