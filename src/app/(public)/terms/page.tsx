import type { Metadata } from "next";
import { PageHero } from "@/components/public/PageHero";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Syarat & Ketentuan",
  description: "Syarat dan ketentuan penggunaan situs serta layanan Grafindo.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <>
      <PageHero
        crumbs={[{ label: "Beranda", href: "/" }, { label: "Syarat & Ketentuan" }]}
        eyebrow="Legal"
        title="Syarat & Ketentuan"
        lead={`Ketentuan penggunaan situs dan layanan produksi ${siteConfig.legalName}.`}
      />
      <section className="container-site py-10 md:py-14">
        <article className="article-content mx-auto max-w-article">
          <p>Terakhir diperbarui: 27 Oktober 2026.</p>
          <h2>Informasi harga</h2>
          <p>
            Harga pada e-catalog merupakan harga acuan dan belum termasuk pajak, ongkos kirim, serta penyesuaian
            material. Harga final ditetapkan melalui penawaran resmi tertulis.
          </p>
          <h2>Permintaan penawaran (RFQ)</h2>
          <p>
            Pengiriman RFQ tidak membentuk kontrak. Kontrak berlaku setelah penawaran disetujui dan/atau purchase
            order diterima sesuai ketentuan yang disepakati.
          </p>
          <h2>Kekayaan intelektual</h2>
          <p>
            Anda menjamin memiliki hak atas seluruh desain, logo, dan materi yang dikirimkan. Kami menjaga
            kerahasiaan desain klien dan tidak mempublikasikan proyek tanpa izin.
          </p>
          <h2>Produksi & toleransi</h2>
          <p>
            Terdapat toleransi wajar pada warna, dimensi, dan finishing sesuai karakteristik material. Spesifikasi
            final disepakati pada tahap persetujuan sampel.
          </p>
          <h2>Pembatalan</h2>
          <p>
            Pembatalan setelah produksi dimulai dapat dikenakan biaya material dan proses yang sudah berjalan.
            Ketentuan rinci tercantum pada dokumen penawaran.
          </p>
          <h2>Kontak</h2>
          <p>
            Pertanyaan mengenai ketentuan ini dapat dikirim ke <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>.
          </p>
        </article>
      </section>
    </>
  );
}
