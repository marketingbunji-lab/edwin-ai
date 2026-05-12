import brand from "../data/brands/pcihealth.json";
import data from "../data/programs/pcihealth/dental-assistant-dental-assistant-program.json";
import type { Landing } from "./data";
import { exportLandingHtml } from "./exportLandingHtml";

export function generateHTML() {
  return exportLandingHtml(brand, data as Landing);
}
