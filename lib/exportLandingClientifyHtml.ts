import type { Brand, Landing } from "./data";
import { exportLandingHtml } from "./exportLandingHtml";
import { formatHtmlFragment } from "./formatExportHtml";

function collectStyleTags(html: string) {
  return html.match(/<style\b[^>]*>[\s\S]*?<\/style>/gi) ?? [];
}

function removeStyleTags(html: string) {
  return html.replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, "");
}

function getBodyContent(html: string) {
  const bodyMatch = html.match(/<body\b[^>]*>([\s\S]*?)<\/body>/i);
  return bodyMatch?.[1] ?? html;
}

function isGlobalDocumentStyle(styleTag: string) {
  return /\bhtml\s*\{|\bbody\s*\{/i.test(styleTag);
}

export async function exportLandingClientifyHtml(brand: Brand, landing: Landing) {
  const html = await exportLandingHtml(brand, landing);
  const styleTags = collectStyleTags(html).filter(
    (styleTag) => !isGlobalDocumentStyle(styleTag)
  );
  const bodyContent = removeStyleTags(getBodyContent(html)).trim();

  const fragment = [
    `<style>
  body {
    margin: 0 !important;
  }

  .uam-landing {
    margin: 0;
    overflow-x: hidden;
    background: #ffffff;
    box-sizing: border-box;
  }

  .uam-landing, .uam-landing * {
    box-sizing: border-box;
  }

  .u_content_html {
    padding: 0 !important;
  }

  .grecaptcha-badge {
    bottom: 20% !important;
  }
</style>`,
    ...styleTags,
    bodyContent,
  ].join("\n\n");

  return formatHtmlFragment(fragment);
}
