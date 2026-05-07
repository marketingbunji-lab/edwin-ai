import fs from "node:fs";
import { generateHTML } from "../lib/exportHtml";
import data from "../data/landings/uam/administracion-empresas.json";

async function main() {
  const html = await generateHTML();

  const slug = data.title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  const filename = `output-${data.brand}-${slug}.html`;

  fs.writeFileSync(filename, html, "utf8");

  console.log(`Landing exportada en ${filename}`);
}

main().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
