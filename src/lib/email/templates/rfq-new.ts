// Template email: notifikasi RFQ baru ke tim sales.
// Placeholder: {{ref}}, {{name}}, {{company}}, {{email}}, {{phone}}, {{details}}

export const rfqNewTemplate = {
  key: "rfq_new",
  subject: "RFQ Baru: {{ref}} — {{company}}",
  bodyHtml: `
    <h2>Penawaran Baru Masuk</h2>
    <p><strong>Ref:</strong> {{ref}}</p>
    <p><strong>Nama:</strong> {{name}}</p>
    <p><strong>Perusahaan:</strong> {{company}}</p>
    <p><strong>Email:</strong> {{email}}</p>
    <p><strong>Telepon:</strong> {{phone}}</p>
    <p><strong>Detail Kebutuhan:</strong></p>
    <p>{{details}}</p>
  `,
  bodyText: "RFQ Baru {{ref}} dari {{name}} ({{company}}). Detail: {{details}}",
};
