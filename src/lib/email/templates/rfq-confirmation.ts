// Template email: konfirmasi penerimaan RFQ ke klien.

export const rfqConfirmationTemplate = {
  key: "rfq_confirmation",
  subject: "Kami menerima permintaan penawaran Anda ({{ref}})",
  bodyHtml: `
    <h2>Terima kasih, {{name}}</h2>
    <p>Kami telah menerima permintaan penawaran Anda dengan nomor referensi <strong>{{ref}}</strong>.</p>
    <p>Tim sales kami akan menghubungi Anda dalam 1x24 jam kerja.</p>
    <p>Salam,<br/>Tim Sales</p>
  `,
  bodyText: "Terima kasih {{name}}, RFQ {{ref}} diterima. Tim sales akan menghubungi Anda.",
};
