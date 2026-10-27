// Tipe data untuk pengaturan WhatsApp.

export type WhatsAppSetting = {
  id: string;
  number: string;
  defaultMessage?: string;
  prefillByPage?: Record<string, string>;
};
