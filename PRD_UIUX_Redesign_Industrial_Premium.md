# PRD — Redesign UI/UX "Industrial-Premium"
**Produk:** Website Grafindo Mitrasemesta (Graphic Emblem, Soft Emblem, Sticker)
**Versi:** 1.1 · **Tanggal:** 28 Oktober 2026 · **Status:** In Progress (Fase 4: QA visual)
**Dokumen terkait:** [PRD_Sticker_Graphic_Emblem_CMS.md](./PRD_Sticker_Graphic_Emblem_CMS.md)

---

## 1. Latar Belakang
Stakeholder menilai format UI/UX, desain, dan background website saat ini kurang cocok untuk bisnis manufaktur graphic emblem dan soft emblem. Hasil analisis kondisi sebelumnya:

| # | Temuan | Dampak |
|---|--------|--------|
| 1 | Background bertekstur (grid milimeter, lalu tenun kain) berbeda di tiap halaman | Terlihat seperti kertas grafik / dekoratif, bukan manufaktur premium; identitas visual tidak konsisten |
| 2 | Hero berupa kolase kartu miring, melayang, dan tilt 3D | Gimmicky, produk sulit dibaca, kurang kredibel untuk B2B |
| 3 | Navbar berganti gaya (transparan gelap di Home, putih di halaman lain) | Brand tidak konsisten antar halaman |
| 4 | Header halaman dalam (PageHero) pucat dengan blob warna | Tidak ada hierarki visual; kontras lemah |
| 5 | Terlalu banyak section berwarna pastel serupa | Tidak ada ritme gelap/terang, halaman terasa datar |

## 2. Tujuan & Metrik Keberhasilan
**Tujuan:** menampilkan Grafindo sebagai manufaktur emblem yang presisi, modern, dan terpercaya, dengan fokus pada showcase produk dan konversi ke "Minta Penawaran".

| Metrik | Target |
|--------|--------|
| Klik CTA "Minta Penawaran" dari Home | naik ≥ 25% dibanding baseline |
| Bounce rate Home | turun ≥ 15% |
| Skor Lighthouse (Perf / A11y / SEO) | ≥ 90 / ≥ 95 / ≥ 95 |
| Kontras teks (WCAG AA) | 100% teks utama ≥ 4.5:1 |
| Persetujuan visual stakeholder | Lolos review tanpa revisi mayor |

**Non-goal:** perubahan CMS/admin, struktur data, atau konten teks; penghapusan sistem multi-tema warna (tetap dipertahankan).

## 3. Arah Desain (Disetujui)
- **Gaya:** Industrial-Premium — dominan charcoal gelap, aksen warna tegas (mengikuti tema aktif), section terang bergantian, foto produk besar.
- **Fokus Home:** Showcase produk (Graphic Emblem & Soft Emblem) + CTA Minta Penawaran.
- **Background:** hapus tekstur kain/grid; ganti dengan permukaan bersih (gradient halus + elemen geometris tipis).
- **Cakupan awal:** Home, navbar, footer, komponen dasar (tombol, kartu); halaman lain mengikuti.

## 4. Prinsip Desain
1. **Presisi** — garis tegas, grid rapi, spasi konsisten.
2. **Produk adalah pahlawan** — foto produk besar, minim dekorasi pengganggu.
3. **Ritme gelap–terang** — hero & statistik gelap, konten terang.
4. **Satu identitas** — navbar, hero, dan footer memakai bahasa visual sama di semua halaman.
5. **Tema tetap fleksibel** — semua warna via CSS variable tema (gold, ocean, emerald, crimson, violet, electric).

## 5. Design System
### 5.1 Permukaan (Background)
| Token | Kegunaan | Tampilan |
|-------|----------|----------|
| `surface-industrial` | Hero, PageHero, statistik | Charcoal + glow aksen + garis diagonal sangat halus |
| `texture-subtle` / `texture-fabric-*` | Section terang | Putih → surface lembut (gradient vertikal) |
| `texture-subtle-alt` | Section terang bernuansa | Surface → surface-200 |
| `bg-white` | Section kontras (proses, artikel, trust bar) | Putih bersih |
| `pattern-*` (semua varian lama) | Aksen cahaya | Sorotan diagonal tipis + glow sudut |
| `pattern-grid` | Overlay di area gelap | Garis diagonal 135°, bukan kotak |

> Nama class lama dipertahankan agar semua halaman otomatis mengikuti tampilan baru tanpa edit massal.

### 5.2 Tipografi & Komponen
- Heading: Urbanist (display), body: Plus Jakarta Sans — tetap.
- Eyebrow dengan `accent-rule` (garis aksen 44×3px) sebagai penanda section.
- Tombol utama gradient aksen; tombol sekunder outline-light di area gelap.
- Kartu: border tipis, radius besar, hover naik 4px + shadow.

## 6. Spesifikasi per Area
### 6.1 Navbar (`HeaderShell.tsx`)
- Selalu gelap (charcoal `#0F1115`) di semua halaman.
- Home: transparan di atas hero, solid + blur setelah scroll. Halaman lain: solid sejak awal.
- Tetap ada: top bar kontak, mega-menu produk, **satu** dropdown tema, switcher bahasa, CTA Minta Penawaran, drawer mobile.

### 6.2 Hero Home (`page.tsx`, `HeroVisual.tsx`)
- Latar `surface-industrial` + overlay garis diagonal.
- Showcase **bento statis**: 1 plat besar Graphic Emblem + 2 tile (Soft Emblem, Sticker) + strip QC (ISO 9001:2015).
- Tanpa rotasi, tanpa animasi melayang/tilt; hanya zoom halus saat hover gambar.
- CTA utama "Minta Penawaran" + sekunder "E-Catalog", chip kepercayaan, bar bawah (lokasi · lini produk · ISO).

### 6.3 Ritme Section Home
Hero (gelap) → Trust (putih) → Kategori (terang gradient) → Statistik (gelap) → Proses (putih) → Produk unggulan → Portofolio → Testimoni (terang) → Artikel (putih) → CTA.

### 6.4 PageHero (halaman dalam)
- Banner gelap `surface-industrial`, judul putih, eyebrow beraksen, breadcrumb kontras terang, garis aksen di tepi bawah.
- Dipakai oleh: Products, E-Catalog, Portfolio, Services, About, Blog, Contact, Quote.

### 6.5 Footer (`SiteFooter.tsx`)
- Sudah gelap; akan diselaraskan dengan `surface-industrial` dan `pattern-grid` baru.

## 7. Status Implementasi
| Item | File | Status |
|------|------|--------|
| Ganti tekstur kain/grid → permukaan bersih & `surface-industrial` | `src/app/globals.css` | ✅ Selesai |
| Hero bento statis | `src/components/public/HeroVisual.tsx` | ✅ Selesai |
| Home: hero/statistik industrial, ritme terang–putih | `src/app/(public)/page.tsx` | ✅ Selesai |
| Navbar gelap konsisten | `src/components/common/HeaderShell.tsx` | ✅ Selesai |
| PageHero gelap industrial | `src/components/public/PageHero.tsx` | ✅ Selesai |
| Type-check (`tsc --noEmit`) | — | ✅ Lulus |
| Footer selaras (`surface-industrial`, kontras naik) | `SiteFooter.tsx` | ✅ Selesai |
| Tombol & kartu (radius 8px/20px, hover 4px, shadow) | `globals.css` | ✅ Selesai |
| Badge/pill khusus area gelap (`onDark`) | `Badge.tsx` | ✅ Selesai |
| Panel gelap konsisten (`panel-industrial`) | `globals.css` | ✅ Selesai |
| Drawer mobile gelap + switcher bahasa kontras | `HeaderShell.tsx`, `LocaleSwitcher.tsx` | ✅ Selesai |
| Audit halaman: Products, Services, About, Portfolio, Blog, Contact, Quote, E-Catalog, FAQ, detail | `src/app/(public)/*` | ✅ Selesai |
| Breadcrumb gelap pada halaman detail | `products/[slug]`, `blog/[slug]`, `e-catalog/[sku]` | ✅ Selesai |
| Review visual tiap tema warna (6 tema) | — | ⏳ Perlu review manual |

### 7.1 Catatan Implementasi Fase 2–3
- Semua panel CTA/aside yang sebelumnya `bg-grad-steel`/`bg-primary` kini memakai `panel-industrial` (charcoal + glow aksen + garis diagonal).
- Chip putih di atas PageHero diganti `Badge tone="onDark"` agar kontras AA dan tidak "pucat".
- Drawer mobile memakai permukaan industrial yang sama dengan navbar, bukan putih.
- Overlay grid pada gambar fallback diganti garis diagonal 135° agar tidak ada pola kotak tersisa.
- Teks sekunder di area gelap dinaikkan ke `white/60–white/70`.
- `tsc --noEmit` dan ESLint lulus tanpa error.

## 8. Rencana Fase
| Fase | Isi | Output |
|------|-----|--------|
| 1 ✅ | Fondasi: background, navbar, hero, PageHero | Home + semua header halaman konsisten |
| 2 ✅ | Footer, tombol, kartu, SectionHeader, badge | Komponen dasar seragam |
| 3 ✅ | Rapikan konten tiap halaman (Products, Services, About, dll.) | Halaman dalam setara kualitas Home |
| 4 ⏳ | QA: responsif, kontras 6 tema, Lighthouse, reduced-motion | Laporan QA + perbaikan |

## 9. Kriteria Penerimaan
- [x] Tidak ada lagi pola grid/kain di halaman publik mana pun.
- [x] Navbar, hero, dan footer tampil konsisten di semua halaman.
- [x] Hero Home memperlihatkan 3 lini produk dengan jelas tanpa elemen miring/melayang.
- [ ] Teks terbaca (kontras AA) pada ke-6 tema warna — perlu uji visual 6 tema.
- [ ] Tampilan rapi di 360px, 768px, 1280px, dan 1920px — perlu uji responsif.
- [x] Hanya satu dropdown tema pada navbar desktop.
- [ ] `tsc --noEmit` ✅ dan build produksi lulus — kompilasi + TypeScript ✅, tetapi prerender gagal karena database lokal belum memiliki tabel (`P2021`), bukan karena UI.

## 10. Risiko & Mitigasi
| Risiko | Mitigasi |
|--------|----------|
| Komponen/halaman lama memakai teks gelap pada latar yang kini gelap (mis. badge tone `dark` di PageHero) | Audit visual tiap halaman di Fase 3; sesuaikan tone |
| Kontras buruk di tema tertentu (gold/electric) | Uji 6 tema di Fase 4 |
| Gambar produk belum cukup berkualitas untuk showcase besar | Siapkan foto produk resolusi tinggi / generate aset |
| Stakeholder masih tidak cocok dengan arah visual | Review checkpoint di akhir Fase 1 sebelum lanjut |

## 11. Pertanyaan Terbuka
1. Apakah warna aksen default tetap emas, atau diganti satu warna brand (mis. dari logo biru)?
2. Apakah tersedia foto produk asli (emblem/soft emblem) untuk menggantikan gambar placeholder di hero?
3. Apakah halaman Portofolio dan Testimoni juga ingin dibuat gelap untuk memperkuat ritme?
