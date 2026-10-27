import { id, type Messages } from "./messages/id";
import { en } from "./messages/en";

export type Locale = "id" | "en";
export const locales: Locale[] = ["id", "en"];
export const defaultLocale: Locale = "id";

const dictionaries: Record<Locale, Messages> = { id, en };

export function getMessages(locale: Locale = defaultLocale): Messages {
  return dictionaries[locale] ?? dictionaries[defaultLocale];
}

/** Tiny template helper: format("Halo {name}", { name: "A" }) */
export function format(template: string, vars: Record<string, string | number> = {}) {
  return template.replace(/\{(\w+)\}/g, (_, key: string) =>
    vars[key] !== undefined ? String(vars[key]) : `{${key}}`,
  );
}

export type { Messages };
