import type { Brand, BrandColorPalette, BrandColorScale } from "./data";

const defaultPrimary = "#111827";
const defaultSecondary = "#F8D74A";

function clamp(value: number) {
  return Math.max(0, Math.min(255, Math.round(value)));
}

function normalizeHexColor(value?: string, fallback = "#000000") {
  const trimmedValue = value?.trim();

  if (!trimmedValue) {
    return fallback;
  }

  const hex = trimmedValue.startsWith("#")
    ? trimmedValue.slice(1)
    : trimmedValue;

  if (/^[0-9a-fA-F]{3}$/.test(hex)) {
    return `#${hex
      .split("")
      .map((character) => character + character)
      .join("")}`.toUpperCase();
  }

  if (/^[0-9a-fA-F]{6}$/.test(hex)) {
    return `#${hex}`.toUpperCase();
  }

  return fallback;
}

function hexToRgb(hexColor: string) {
  const hex = normalizeHexColor(hexColor).slice(1);

  return {
    red: Number.parseInt(hex.slice(0, 2), 16),
    green: Number.parseInt(hex.slice(2, 4), 16),
    blue: Number.parseInt(hex.slice(4, 6), 16),
  };
}

function rgbToHex(red: number, green: number, blue: number) {
  return `#${[red, green, blue]
    .map((channel) => clamp(channel).toString(16).padStart(2, "0"))
    .join("")}`.toUpperCase();
}

function mixWith(hexColor: string, target: "#000000" | "#FFFFFF", amount: number) {
  const color = hexToRgb(hexColor);
  const targetColor = hexToRgb(target);

  return rgbToHex(
    color.red + (targetColor.red - color.red) * amount,
    color.green + (targetColor.green - color.green) * amount,
    color.blue + (targetColor.blue - color.blue) * amount,
  );
}

export function createBrandColorScale(baseColor?: string): BrandColorScale {
  const base = normalizeHexColor(baseColor, defaultPrimary);

  return {
    lightest: mixWith(base, "#FFFFFF", 0.88),
    light: mixWith(base, "#FFFFFF", 0.62),
    dark: mixWith(base, "#000000", 0.28),
    darkest: mixWith(base, "#000000", 0.5),
  };
}

export function createBrandColorPalette(
  primaryColor?: string,
  secondaryColor?: string,
): BrandColorPalette {
  return {
    primary: createBrandColorScale(primaryColor || defaultPrimary),
    secondary: createBrandColorScale(secondaryColor || defaultSecondary),
  };
}

function normalizeScale(
  baseColor: string,
  scale?: Partial<BrandColorScale>,
): BrandColorScale {
  const generatedScale = createBrandColorScale(baseColor);

  return {
    lightest: normalizeHexColor(scale?.lightest, generatedScale.lightest),
    light: normalizeHexColor(scale?.light, generatedScale.light),
    dark: normalizeHexColor(scale?.dark, generatedScale.dark),
    darkest: normalizeHexColor(scale?.darkest, generatedScale.darkest),
  };
}

export function normalizeBrandColorPalette(brand: Pick<
  Brand,
  "primaryColor" | "secondaryColor" | "colorPalette"
>): BrandColorPalette {
  const primaryColor = normalizeHexColor(brand.primaryColor, defaultPrimary);
  const secondaryColor = normalizeHexColor(brand.secondaryColor, defaultSecondary);

  return {
    primary: normalizeScale(primaryColor, brand.colorPalette?.primary),
    secondary: normalizeScale(secondaryColor, brand.colorPalette?.secondary),
  };
}

export function enrichBrandColorPalette<T extends Brand>(brand: T): T {
  return {
    ...brand,
    primaryColor: normalizeHexColor(brand.primaryColor, defaultPrimary),
    secondaryColor: normalizeHexColor(brand.secondaryColor, defaultSecondary),
    colorPalette: normalizeBrandColorPalette(brand),
  };
}
