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
  const favicon = brand.favicon?.trim() || "";
  const tailwindCdnUrl = "https://cdn.tailwindcss.com";
  const { renderToStaticMarkup } = await import("react-dom/server");
  const markup = renderToStaticMarkup(
    renderLandingTemplate({ brand, landing, mode: "export" }),
  );
  const exportTabsScript = `
  (function () {
    function activateTab(panelId) {
      var tabs = Array.prototype.slice.call(document.querySelectorAll('[data-export-tab-target]'));
      var panels = Array.prototype.slice.call(document.querySelectorAll('.landing-export-panel'));
      if (!tabs.length || !panels.length) return;
      var targetPanelId = panelId || tabs[0].getAttribute('data-export-tab-target');
      tabs.forEach(function (tab) {
        var isActive = tab.getAttribute('data-export-tab-target') === targetPanelId;
        tab.classList.toggle('is-active', isActive);
        tab.setAttribute('aria-selected', isActive ? 'true' : 'false');
      });
      panels.forEach(function (panel) {
        var isActive = panel.id === targetPanelId;
        panel.classList.toggle('is-active', isActive);
        panel.style.display = isActive ? 'block' : 'none';
      });
    }
    function syncFromHash() {
      var hash = window.location.hash ? window.location.hash.slice(1) : '';
      if (hash && document.getElementById(hash) && document.getElementById(hash).classList.contains('landing-export-panel')) {
        activateTab(hash);
      } else {
        activateTab();
      }
    }
    document.addEventListener('click', function (event) {
      var tab = event.target instanceof Element ? event.target.closest('[data-export-tab-target]') : null;
      if (!tab) return;
      event.preventDefault();
      var panelId = tab.getAttribute('data-export-tab-target');
      if (!panelId) return;
      activateTab(panelId);
      if (history && history.replaceState) {
        history.replaceState(null, '', '#' + panelId);
      } else {
        window.location.hash = panelId;
      }
    });
    window.addEventListener('hashchange', syncFromHash);
    window.addEventListener('DOMContentLoaded', syncFromHash);
  })();
  `;

  const html = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(title)} | ${escapeHtml(brandName)}</title>
  ${favicon ? `<link rel="icon" href="${escapeHtml(favicon)}">` : ""}
  <script src="${tailwindCdnUrl}"></script>
  ${
    googleFontHref
      ? `<link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="${escapeHtml(googleFontHref)}" rel="stylesheet">`
      : ""
  }
  <style>
    html { scroll-behavior: smooth; }
    *, *::before, *::after { box-sizing: border-box; }
    body {
      margin: 0;
      overflow-x: hidden;
      background: #ffffff;
      font-family: ${brand.typography?.fontFamily?.trim() || "Arial, Helvetica, sans-serif"};
    }
    .u_content_html { padding: 0 !important; }
    .grecaptcha-badge { bottom: 20% !important; }
    .landing-export-header-link {
      color: rgba(255, 255, 255, 0.88) !important;
    }
    .landing-export-header-link:hover,
    .landing-export-header-link:focus-visible,
    .landing-export-mobile-link:hover,
    .landing-export-mobile-link:focus-visible {
      color: #ffffff !important;
    }
    .landing-export-mobile-link {
      color: rgba(255, 255, 255, 0.9) !important;
    }
    .landing-export-header-cta {
      color: var(--landing-secondary-text) !important;
    }
    .landing-export-surface,
    .landing-export-card,
    .landing-export-group-card {
      background-color: rgba(255, 255, 255, 0.96) !important;
      backdrop-filter: none !important;
    }
    .landing-export-group-card {
      border-top: 4px solid var(--landing-secondary);
    }
    .landing-export-tabbar {
      gap: 0.5rem;
    }
    .landing-export-tab {
      color: #64748b !important;
      text-decoration: none !important;
      background: transparent;
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }
    .landing-export-tab:hover,
    .landing-export-tab:focus-visible {
      color: var(--landing-primary-darkest) !important;
    }
    .landing-export-tab.is-active {
      color: var(--landing-primary-darkest) !important;
      background: rgba(255, 255, 255, 0.98);
    }
    .landing-export-panel {
      display: none;
    }
    .landing-export-panel.is-default,
    .landing-export-panel.is-active {
      display: block;
    }
  </style>
</head>
<body>
  ${markup}
  <script>${exportTabsScript}</script>
</body>
</html>`;

  return formatHtmlDocument(html);
}
