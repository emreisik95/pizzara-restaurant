import { getSetting } from "./db";

export const THEME_DEFAULTS = {
  theme_primary: "#ce352b",
  theme_primary_dark: "#ac2b23",
  theme_secondary: "#3e5541",
  theme_secondary_dark: "#25392d",
  theme_bg: "#ffe8a3",
  theme_bg_light: "#fff9ed",
  theme_text: "#252820",
} as const;

export type ThemeKey = keyof typeof THEME_DEFAULTS;
export const THEME_KEYS = Object.keys(THEME_DEFAULTS) as ThemeKey[];

export function isHex(s: string): boolean {
  return /^#[0-9a-fA-F]{6}$/.test(s);
}

export function hexToRgbTriple(hex: string): string {
  const n = parseInt(hex.slice(1), 16);
  return `${(n >> 16) & 255} ${(n >> 8) & 255} ${n & 255}`;
}

export function readTheme(): Record<ThemeKey, string> {
  const out = {} as Record<ThemeKey, string>;
  for (const k of THEME_KEYS) {
    const v = getSetting(k, "");
    out[k] = isHex(v) ? v : THEME_DEFAULTS[k];
  }
  return out;
}

export function themeCss(t: Record<ThemeKey, string>): string {
  return (
    `:root{` +
    `--rosso:${t.theme_primary};` +
    `--rosso-rgb:${hexToRgbTriple(t.theme_primary)};` +
    `--rosso-dark:${t.theme_primary_dark};` +
    `--rosso-dark-rgb:${hexToRgbTriple(t.theme_primary_dark)};` +
    `--bosco:${t.theme_secondary};` +
    `--bosco-rgb:${hexToRgbTriple(t.theme_secondary)};` +
    `--bosco-dark:${t.theme_secondary_dark};` +
    `--bosco-dark-rgb:${hexToRgbTriple(t.theme_secondary_dark)};` +
    `--crema:${t.theme_bg};` +
    `--crema-rgb:${hexToRgbTriple(t.theme_bg)};` +
    `--crema-light:${t.theme_bg_light};` +
    `--crema-light-rgb:${hexToRgbTriple(t.theme_bg_light)};` +
    `--ink:${t.theme_text};` +
    `--ink-rgb:${hexToRgbTriple(t.theme_text)};` +
    `}`
  );
}
