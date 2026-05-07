import brand from "../data/brands/uam.json";
import data from "../data/landings/uam/administracion-empresas.json";
import { exportLandingHtml } from "./exportLandingHtml";

export function generateHTML() {
  return exportLandingHtml(brand, data);
}
