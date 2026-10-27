// Template email: update status inquiry ke klien.

export const statusUpdateTemplate = {
  key: "inquiry_status_update",
  subject: "Update status penawaran {{ref}}: {{status}}",
  bodyHtml: `
    <h2>Update Status Penawaran</h2>
    <p><strong>Ref:</strong> {{ref}}</p>
    <p><strong>Status baru:</strong> {{status}}</p>
    <p>{{note}}</p>
  `,
  bodyText: "Status {{ref}} berubah menjadi {{status}}. {{note}}",
};
