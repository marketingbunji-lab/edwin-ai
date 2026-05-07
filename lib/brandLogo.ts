import type { Brand } from "./data";

export function getBrandLogo(brand: Brand, mode: "light" | "dark" = "light") {
  return brand.logos?.[mode] || brand.logo || brand.logos?.light || brand.logos?.dark || "";
}
