# Arsitektur & Struktur Folder — Website Manufaktur Sticker, Graphic, Emblem & Soft Emblem (dengan CMS)

Dokumen struktur folder proyek. Prinsip: **modular, terpisah per domain/bagian**, hindari file monolitik yang memuat banyak logic.

---

## 1. Tech Stack
- **Framework:** Next.js (latest, App Router, React 19, TypeScript)
- **Database:** PostgreSQL + Prisma ORM
- **Styling:** Tailwind CSS + shadcn/ui + Framer Motion
- **CMS:** Custom CMS (semua konten dari DB)
- **i18n:** Indonesia (id) & English (en) — bilingual penuh
- **Storage:** Cloudflare R2 / AWS S3 (media & file RFQ)
- **Auth:** JWT + RBAC
- **Email:** Nodemailer / Resend

## 2. Struktur Direktori

```text
sticker-emblem-web/
├── .env.example
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── package.json
├── prisma/
│   ├── schema.prisma              # Skema PostgreSQL (produk, e-catalog, blog, cms, i18n)
│   └── seed.ts                    # Data awal (admin, kategori, konten default id/en)
├── public/
│   ├── images/                    # Asset statis (logo, hero)
│   ├── icons/
│   └── documents/                 # Katalog PDF statis (opsional)
└── src/
    ├── app/                       # Next.js App Router
    │   ├── (public)/              # Route group: website publik (storefront)
    │   │   ├── layout.tsx         # Header, footer, nav (konten dari DB)
    │   │   ├── page.tsx           # Home
    │   │   ├── about/
    │   │   ├── products/          # Katalog produk
    │   │   ├── e-catalog/         # E-Catalog (spesifikasi + harga, BUMN)
    │   │   ├── portfolio/
    │   │   ├── services/
    │   │   ├── blog/
    │   │   ├── quote/             # RFQ
    │   │   ├── contact/
    │   │   └── faq/
    │   ├── (auth)/                # Login, register, forgot password
    │   ├── (admin)/admin/         # CMS admin panel (RBAC)
    │   │   ├── dashboard/
    │   │   ├── products/
    │   │   ├── ecatalog/
    │   │   ├── portfolio/
    │   │   ├── blog/
    │   │   ├── pages/
    │   │   ├── media/
    │   │   ├── inquiries/
    │   │   ├── site-content/      # Kelola semua teks/konten statis
    │   │   ├── translations/      # Kelola terjemahan id/en
    │   │   ├── users/
    │   │   └── settings/
    │   ├── api/                   # Route handlers (API layer)
    │   │   ├── auth/
    │   │   ├── products/
    │   │   ├── ecatalog/
    │   │   ├── blog/
    │   │   ├── inquiries/
    │   │   ├── upload/
    │   │   └── webhooks/
    │   ├── layout.tsx             # Root layout (providers, i18n)
    │   ├── globals.css
    │   ├── sitemap.ts
    │   └── robots.ts
    ├── components/                # Komponen UI modular
    │   ├── ui/                    # Primitif shadcn (Button, Dialog, ...)
    │   ├── common/                # Navbar, Footer, Breadcrumb, LocaleSwitcher, SocialLinks, WhatsAppButton
    │   ├── public/                # Komponen storefront (ProductCard, Hero, ...)
    │   ├── admin/                 # Komponen CMS (tables, forms, editors)
    │   ├── forms/                 # Form reusable (React Hook Form + Zod)
    │   └── providers/             # Session, Query, Theme, I18n providers
    ├── config/                    # Konfigurasi statis (site meta, nav, i18n)
    ├── hooks/                     # Custom React hooks
    ├── lib/                       # Core utilities & integrations
    │   ├── db/                    # Prisma client singleton
    │   ├── auth/                  # JWT, RBAC helpers
    │   ├── i18n/                  # Locale helpers, message loaders
    │   ├── storage/               # S3/R2 upload helpers
    │   ├── email/                 # Email templates & senders
│   │   ├── mailer.ts
│   │   └── templates/
│   │       ├── rfq-new.ts
│   │       ├── rfq-confirmation.ts
│   │       └── status-update.ts
    │   ├── seo/                   # Metadata, structured data helpers
    │   └── utils/                 # Formatters, validators helpers
    ├── services/                  # Business logic per domain (terpisah)
    │   ├── product.service.ts
    │   ├── ecatalog.service.ts
    │   ├── portfolio.service.ts
    │   ├── blog.service.ts
    │   ├── inquiry.service.ts
    │   ├── content.service.ts     # Site content & i18n content
    │   ├── translation.service.ts
    │   ├── social.service.ts      # CRUD SocialLink
    │   ├── whatsapp.service.ts    # Pengaturan WhatsApp
    │   └── email.service.ts       # Pengiriman email RFQ + logging
    ├── types/                     # TypeScript type definitions per domain
    │   ├── social.ts
    │   ├── whatsapp.ts
    │   └── email.ts
    ├── validations/               # Zod schemas per domain
    │   ├── social.schema.ts
    │   ├── whatsapp.schema.ts
    │   └── email.schema.ts
    └── i18n/
        └── messages/              # Pesan UI id.json & en.json
```

## 3. Prinsip Modularitas
- **Satu file = satu tanggung jawab.** Hindari file besar yang memuat banyak logic; pisahkan per domain.
- **Service layer** (`src/services/*`) memuat business logic; route handlers & components hanya memanggil service.
- **Komponen** dipisah per konteks (public vs admin) agar tidak bercampur.
- **Validasi** (Zod) terpisah di `src/validations/*`.
- **Tipe data** terpisah di `src/types/*`.
- **Konten & i18n** tidak hard-coded; semua dari DB via service `content.service` & `translation.service`.

## 4. Konvensi Penamaan
- File komponen: PascalCase (`ProductCard.tsx`).
- Service/hook/util: camelCase (`product.service.ts`, `useCart.ts`).
- Route folder: kebab-case (`e-catalog`, `site-content`).
- Slug URL: kebab-case (id/en sama, konten diterjemahkan via DB).

## 5. Alur Data (ringkas)
UI Component → Service (`src/services/*`) → Prisma (`src/lib/db`) → PostgreSQL.
Semua konten teks/logo/data diambil dari DB; CMS menulis ke DB; frontend membaca dari DB (SSR/ISR).
