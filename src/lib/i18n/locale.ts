import { cookies } from "next/headers";
import type { Locale } from "@/i18n";

export type { Locale };
export { locales, defaultLocale, getMessages, format } from "@/i18n";

export function normalizeLocale(input?: string | null): Locale {
  return input === "en" ? "en" : "id";
}

/**
 * Resolve the active locale. Priority:
 * 1. explicit ?lang= (legacy links)
 * 2. `locale` cookie set by LocaleSwitcher
 * 3. default (id)
 */
export async function getLocale(searchLang?: string | null): Promise<Locale> {
  if (searchLang === "id" || searchLang === "en") return searchLang;
  const stored = (await cookies()).get("locale")?.value;
  return normalizeLocale(stored);
}
