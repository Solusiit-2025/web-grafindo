// Helper terpisah untuk pengiriman email (SMTP).
// Konfigurasi utama berasal dari EmailSetting di database; env menjadi fallback.

import nodemailer from "nodemailer";

export type SmtpConfig = {
  host: string;
  port: number;
  secure?: boolean;
  user?: string;
  pass?: string;
  fromName?: string;
};

type MailOptions = {
  to: string | string[];
  from: string;
  fromName?: string;
  replyTo?: string;
  subject: string;
  html: string;
  text?: string;
  smtp?: SmtpConfig;
};

export async function sendMail(options: MailOptions) {
  const config: SmtpConfig = options.smtp ?? {
    host: process.env.SMTP_HOST ?? "",
    port: Number(process.env.SMTP_PORT ?? 587),
    user: process.env.SMTP_USER ?? "",
    pass: process.env.SMTP_PASS ?? "",
  };

  if (!config.host) {
    throw new Error("SMTP host belum dikonfigurasi.");
  }

  const transporter = nodemailer.createTransport({
    host: config.host,
    port: config.port || 587,
    secure: config.secure ?? config.port === 465,
    auth: config.user
      ? {
          user: config.user,
          pass: config.pass,
        }
      : undefined,
  });

  const from = options.fromName ? `"${options.fromName}" <${options.from}>` : options.from;

  return transporter.sendMail({
    from,
    to: options.to,
    replyTo: options.replyTo,
    subject: options.subject,
    html: options.html,
    text: options.text,
  });
}
