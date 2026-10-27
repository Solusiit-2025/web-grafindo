// Tipe data untuk pengaturan email & template.

export type EmailSetting = {
  id: string;
  smtpHost: string;
  smtpPort: number;
  smtpUser: string;
  smtpPass: string;
  fromName: string;
  fromEmail: string;
  replyTo?: string;
  recipients: string[];
};

export type EmailTemplate = {
  id: string;
  key: string;
  locale: string;
  subject: string;
  bodyHtml: string;
  bodyText?: string;
};
