import { cookies } from "next/headers";
import { defaultTheme, isThemeId, type ThemeId } from "@/config/themes";

export type { ThemeId };
export { defaultTheme };

/** Resolve theme from the persisted cookie (SSR-safe, avoids theme flash). */
export async function getTheme(): Promise<ThemeId> {
  const value = (await cookies()).get("theme")?.value;
  return isThemeId(value) ? value : defaultTheme;
}
