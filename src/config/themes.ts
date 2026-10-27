export const themeIds = ["gold", "ocean", "emerald", "crimson", "violet", "electric"] as const;

export type ThemeId = (typeof themeIds)[number];

export type ThemeDefinition = {
  id: ThemeId;
  name: { id: string; en: string };
  description: { id: string; en: string };
  swatches: [string, string, string];
};

export const defaultTheme: ThemeId = "gold";

export const themes: ThemeDefinition[] = [
  {
    id: "gold",
    name: { id: "Emas Klasik", en: "Classic Gold" },
    description: { id: "Hangat, premium, dan industrial.", en: "Warm, premium, and industrial." },
    swatches: ["#0F1115", "#C9A24B", "#F7F5F2"],
  },
  {
    id: "ocean",
    name: { id: "Samudra", en: "Ocean" },
    description: { id: "Biru presisi dengan aksen azure.", en: "Precision blue with azure accents." },
    swatches: ["#080F1A", "#5AAFFF", "#F2F7FC"],
  },
  {
    id: "emerald",
    name: { id: "Zamrud", en: "Emerald" },
    description: { id: "Hijau teknis yang tenang dan segar.", en: "Calm, technical green." },
    swatches: ["#08120F", "#2EC484", "#F2F8F5"],
  },
  {
    id: "crimson",
    name: { id: "Kirmizi", en: "Crimson" },
    description: { id: "Merah berani untuk brand yang tegas.", en: "Bold red for confident brands." },
    swatches: ["#160D0D", "#E25444", "#F9F5F4"],
  },
  {
    id: "violet",
    name: { id: "Violet", en: "Violet" },
    description: { id: "Ungu modern dengan nuansa kreatif.", en: "Modern violet with a creative edge." },
    swatches: ["#100E1A", "#A078FF", "#F6F4FB"],
  },
  {
    id: "electric",
    name: { id: "Electric Blue", en: "Electric Blue" },
    description: {
      id: "Royal blue pekat, cerah, dan sangat vibrant.",
      en: "Deep, bright, high-energy royal blue.",
    },
    swatches: ["#050B2E", "#1456FF", "#F4F6FF"],
  },
];

export function isThemeId(value: string | null | undefined): value is ThemeId {
  return typeof value === "string" && (themeIds as readonly string[]).includes(value);
}

export function normalizeTheme(value: string | null | undefined): ThemeId {
  return isThemeId(value) ? value : defaultTheme;
}

export function getThemeDefinition(id: ThemeId): ThemeDefinition {
  return themes.find((theme) => theme.id === id) ?? themes[0];
}
