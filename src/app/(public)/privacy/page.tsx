import type { Metadata } from "next";
import { PageHero } from "@/components/public/PageHero";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Kebijakan Privasi",
  description: "Kebijakan privasi dan pengelolaan data pengunjung serta klien Grafindo.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <>
      <PageHero
        crumbs={[{ label: "Beranda", href: "/" }, { label: "Kebijakan Privasi" }]}
        eyebrow="Legal"
        title="Kebijakan Privasi"
        lead={`Bagaimana ${siteConfig.legalName} mengumpulkan, menggunakan, dan melindungi data Anda.`}
      />
      <section className="container-site py-10 md:py-14">
        <article className="article-content mx-auto max-w-article">
          <p>Terakhir diperbarui: 27 Oktober 2026.</p>
          <h2>Data yang kami kumpulkan</h2>
          <p>
            Kami mengumpulkan data yang Anda kirimkan melalui formulir permintaan penawaran (RFQ), formulir kontak,
            atau kanal komunikasi resmi: nama, perusahaan, email, nomor telepon, detail kebutuhan, dan lampiran
            desain.
          </p>
          <h2>Penggunaan data</h2>
          <ul>
            <li>Menyiapkan penawaran, spesifikasi teknis, dan estimasi produksi.</li>
            <li>Menghubungi Anda terkait permintaan yang dikirim.</li>
            <li>Meningkatkan kualitas layanan dan situs.</li>
          </ul>
          <h2>Penyimpanan & keamanan</h2>
          <p>
            Data disimpan pada infrastruktur yang kami kelola dengan kontrol akses berbasis peran. Lampiran desain
            hanya dapat diakses oleh tim penawaran dan produksi yang berkepentingan.
          </p>
          <h2>Pembagian data</h2>
          <p>
            Kami tidak menjual data Anda. Data hanya dibagikan kepada pihak ketiga yang terlibat dalam proses
            produksi atau pengiriman apabila diperlukan untuk memenuhi permintaan Anda.
          </p>
          <h2>Hak Anda</h2>
          <p>
            Anda dapat meminta akses, koreksi, atau penghapusan data dengan menghubungi{" "}
            <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>.
          </p>
          <h2>Cookie</h2>
          <p>
            Situs menggunakan cookie fungsional untuk menyimpan preferensi bahasa dan draf formulir. Cookie analitik
            hanya diaktifkan dengan persetujuan Anda.
          </p>
        </article>
      </section>
    </>
  );
}
