import { prerender } from "react-dom/static";
import { renderLandingTemplate } from "@/components/templates/renderLandingTemplate";
import type { Brand, Landing } from "./data";
import { formatHtmlDocument } from "./formatExportHtml";

function escapeHtml(value: unknown) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export async function exportLandingHtml(brand: Brand, landing: Landing) {
  const title = landing.fullTitle || landing.title || "Programa";
  const brandName = brand.name || "Brand";
  const googleFontHref = brand.typography?.googleFontHref?.trim() || "";
  const { prelude } = await prerender(
    renderLandingTemplate({ brand, landing, mode: "export" }),
  );
  const markup = await new Response(prelude).text();

  const html = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(title)} | ${escapeHtml(brandName)}</title>
  ${
    googleFontHref
      ? `<link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="${escapeHtml(googleFontHref)}" rel="stylesheet">`
      : ""
  }
  <style>
    html { scroll-behavior: smooth; }
    body {
      margin: 0;
      overflow-x: hidden;
      background: #ffffff;
    }
    .u_content_html { padding: 0 !important; }
    .grecaptcha-badge { bottom: 20% !important; }
  </style>
</head>
<body>
  ${markup}
</body>
</html>`;

  return formatHtmlDocument(html);
}
