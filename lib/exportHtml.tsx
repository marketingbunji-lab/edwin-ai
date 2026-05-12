import brand from "../data/brands/uam.json";
import data from "../data/programs/uam/administracion-empresas.json";
import type { Landing } from "./data";
import { exportLandingHtml } from "./exportLandingHtml";

export function generateHTML() {
  return exportLandingHtml(brand, data as Landing);
}
