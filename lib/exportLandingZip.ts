import { readFile } from "node:fs/promises";
import path from "node:path";
import type { Brand, Landing } from "./data";
import { exportLandingHtml } from "./exportLandingHtml";

type BundleFile = {
  name: string;
  data: Uint8Array;
};

const textEncoder = new TextEncoder();
const textDecoder = new TextDecoder();
const htmlAttrPattern =
  /<(img|source|script|link)\b[^>]+\b(?:src|href|srcset)=["']([^"']+)["']/gi;
const assetUrlPattern =
  /url\((['"]?)([^)'"]+)\1\)|@import\s+url\((['"]?)([^)'"]+)\3\)|@import\s+['"]([^'"]+)['"]/gi;
const absoluteAssetPathPattern =
  /\/[a-zA-Z0-9_./%+-]+\.(?:png|jpe?g|webp|svg|ico|css|js|mjs|ttf|woff2?)/gi;
const styleTagPattern = /<style\b[^>]*>([\s\S]*?)<\/style>/gi;
const inlineScriptPattern =
  /<script\b((?:(?!\bsrc=)[^>])*)>([\s\S]*?)<\/script>/gi;
const inlineSvgPattern = /<svg\b[^>]*>[\s\S]*?<\/svg>/gi;
const crcTable = new Uint32Array(256).map((_, index) => {
  let crc = index;

  for (let bit = 0; bit < 8; bit += 1) {
    crc = (crc & 1) !== 0 ? 0xedb88320 ^ (crc >>> 1) : crc >>> 1;
  }

  return crc >>> 0;
});

function crc32(data: Uint8Array) {
  let crc = 0xffffffff;

  for (const value of data) {
    crc = crcTable[(crc ^ value) & 0xff] ^ (crc >>> 8);
  }

  return (crc ^ 0xffffffff) >>> 0;
}

function writeUint16(value: number) {
  const buffer = Buffer.alloc(2);
  buffer.writeUInt16LE(value & 0xffff, 0);
  return buffer;
}

function writeUint32(value: number) {
  const buffer = Buffer.alloc(4);
  buffer.writeUInt32LE(value >>> 0, 0);
  return buffer;
}

function createStoredZip(files: BundleFile[]) {
  const localParts: Buffer[] = [];
  const centralParts: Buffer[] = [];
  let offset = 0;

  for (const file of files) {
    const fileNameBytes = Buffer.from(textEncoder.encode(file.name));
    const fileData = Buffer.from(file.data);
    const checksum = crc32(file.data);

    const localHeader = Buffer.concat([
      writeUint32(0x04034b50),
      writeUint16(20),
      writeUint16(0),
      writeUint16(0),
      writeUint16(0),
      writeUint16(0),
      writeUint32(checksum),
      writeUint32(fileData.length),
      writeUint32(fileData.length),
      writeUint16(fileNameBytes.length),
      writeUint16(0),
      fileNameBytes,
    ]);

    localParts.push(localHeader, fileData);

    const centralHeader = Buffer.concat([
      writeUint32(0x02014b50),
      writeUint16(20),
      writeUint16(20),
      writeUint16(0),
      writeUint16(0),
      writeUint16(0),
      writeUint16(0),
      writeUint32(checksum),
      writeUint32(fileData.length),
      writeUint32(fileData.length),
      writeUint16(fileNameBytes.length),
      writeUint16(0),
      writeUint16(0),
      writeUint16(0),
      writeUint16(0),
      writeUint32(0),
      writeUint32(offset),
      fileNameBytes,
    ]);

    centralParts.push(centralHeader);
    offset += localHeader.length + fileData.length;
  }

  const centralDirectory = Buffer.concat(centralParts);
  const localDirectory = Buffer.concat(localParts);
  const endRecord = Buffer.concat([
    writeUint32(0x06054b50),
    writeUint16(0),
    writeUint16(0),
    writeUint16(files.length),
    writeUint16(files.length),
    writeUint32(centralDirectory.length),
    writeUint32(localDirectory.length),
    writeUint16(0),
  ]);

  return Buffer.concat([localDirectory, centralDirectory, endRecord]);
}

function sanitizeFileStem(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase()
    .slice(0, 64);
}

function getExtensionFromContentType(contentType = "") {
  const normalized = contentType.split(";")[0].trim().toLowerCase();

  switch (normalized) {
    case "text/css":
      return ".css";
    case "text/javascript":
    case "application/javascript":
      return ".js";
    case "image/png":
      return ".png";
    case "image/jpeg":
      return ".jpg";
    case "image/webp":
      return ".webp";
    case "image/svg+xml":
      return ".svg";
    case "image/x-icon":
    case "image/vnd.microsoft.icon":
      return ".ico";
    case "font/ttf":
    case "application/x-font-ttf":
      return ".ttf";
    case "font/woff":
      return ".woff";
    case "font/woff2":
      return ".woff2";
    default:
      return "";
  }
}

function getUrlExtension(url: string) {
  try {
    const parsed = new URL(url, "https://bundle.local");
    const pathname = parsed.pathname.toLowerCase();
    const match = pathname.match(/\.([a-z0-9]{2,8})$/i);

    return match ? `.${match[1]}` : "";
  } catch {
    return "";
  }
}

function shouldBundleUrl(url: string) {
  const value = url.trim();

  if (!value) return false;
  if (value.startsWith("data:")) return false;
  if (value.startsWith("#")) return false;

  return (
    value.startsWith("//") ||
    value.startsWith("http://") ||
    value.startsWith("https://") ||
    value.startsWith("/")
  );
}

function normalizeSourceUrl(url: string, baseUrl?: string) {
  const value = url.trim();

  if (value.startsWith("http://") || value.startsWith("https://")) {
    return value;
  }

  if (value.startsWith("//")) {
    return `https:${value}`;
  }

  if (value.startsWith("/")) {
    return value;
  }

  if (!baseUrl) {
    return value;
  }

  if (baseUrl.startsWith("http://") || baseUrl.startsWith("https://")) {
    return new URL(value, baseUrl).toString();
  }

  if (baseUrl.startsWith("/")) {
    return path.posix.normalize(
      path.posix.join(path.posix.dirname(baseUrl), value),
    );
  }

  return value;
}

function buildAssetFileName(sourceUrl: string, index: number, contentType = "") {
  const extension =
    getUrlExtension(sourceUrl) || getExtensionFromContentType(contentType) || ".bin";

  try {
    const parsed = new URL(sourceUrl, "https://bundle.local");
    const lastSegment = parsed.pathname.split("/").filter(Boolean).pop() || "asset";
    const stem = sanitizeFileStem(lastSegment.replace(/\.[^.]+$/, "")) || "asset";

    return `assets/${String(index + 1).padStart(2, "0")}-${stem}${extension}`;
  } catch {
    return `assets/${String(index + 1).padStart(2, "0")}-asset${extension}`;
  }
}

function collectHtmlResourceUrls(html: string) {
  const urls = new Set<string>();

  for (const match of html.matchAll(htmlAttrPattern)) {
    const rawValue = match[2]?.trim() || "";

    if (!rawValue) continue;

    if (rawValue.includes(",")) {
      for (const candidate of rawValue.split(",")) {
        const firstPart = candidate.trim().split(/\s+/)[0];

        if (shouldBundleUrl(firstPart)) {
          urls.add(firstPart);
        }
      }
      continue;
    }

    if (shouldBundleUrl(rawValue)) {
      urls.add(rawValue);
    }
  }

  for (const match of html.matchAll(assetUrlPattern)) {
    const rawValue = (match[2] || match[4] || match[5] || "").trim();

    if (shouldBundleUrl(rawValue)) {
      urls.add(rawValue);
    }
  }

  for (const match of html.matchAll(absoluteAssetPathPattern)) {
    const rawValue = match[0]?.trim() || "";

    if (shouldBundleUrl(rawValue)) {
      urls.add(rawValue);
    }
  }

  return Array.from(urls);
}

function collectCssResourceUrls(css: string) {
  const urls = new Set<string>();

  for (const match of css.matchAll(assetUrlPattern)) {
    const rawValue = (match[2] || match[4] || match[5] || "").trim();

    if (shouldBundleUrl(rawValue)) {
      urls.add(rawValue);
    }
  }

  return Array.from(urls);
}

function collectStyleTags(html: string) {
  const styles: string[] = [];

  html.replace(styleTagPattern, (_, css: string) => {
    if (css.trim()) {
      styles.push(css.trim());
    }

    return "";
  });

  return styles;
}

function removeStyleTags(html: string) {
  return html.replace(styleTagPattern, "");
}

function isJavaScriptType(typeValue: string) {
  const normalized = typeValue.trim().toLowerCase();

  return (
    !normalized ||
    normalized === "text/javascript" ||
    normalized === "application/javascript" ||
    normalized === "module"
  );
}

function collectInlineScripts(html: string) {
  const scripts: string[] = [];

  html.replace(inlineScriptPattern, (fullMatch, attrs: string, content: string) => {
    const typeMatch = attrs.match(/\btype=["']([^"']+)["']/i);
    const typeValue = typeMatch?.[1] ?? "";

    if (isJavaScriptType(typeValue) && content.trim()) {
      scripts.push(content.trim());
    }

    return fullMatch;
  });

  return scripts;
}

function removeInlineScripts(html: string) {
  return html.replace(
    inlineScriptPattern,
    (fullMatch, attrs: string, content: string) => {
      const typeMatch = attrs.match(/\btype=["']([^"']+)["']/i);
      const typeValue = typeMatch?.[1] ?? "";

      if (isJavaScriptType(typeValue) && content.trim()) {
        return "";
      }

      return fullMatch;
    },
  );
}

function hasRdStationEmbed(html: string) {
  return /<script\b[^>]*\bsrc=["'][^"']*rdstation-forms[^"']*["'][^>]*><\/script>/i.test(
    html,
  );
}

function collectRdStationFormIds(html: string) {
  const formIds = new Set<string>();

  html.replace(
    /<div\b[^>]*\brole=["']main["'][^>]*\bid=["']([^"']+)["'][^>]*><\/div>/gi,
    (_fullMatch, formId: string) => {
      const normalizedFormId = formId.trim();

      if (normalizedFormId) {
        formIds.add(normalizedFormId);
      }

      return _fullMatch;
    },
  );

  return Array.from(formIds);
}

function buildRdStationAutoInitScript(html: string) {
  if (!hasRdStationEmbed(html)) {
    return "";
  }

  const formIds = collectRdStationFormIds(html);

  if (formIds.length === 0) {
    return "";
  }

  const rdStationToken = "UA-263596197-1";

  return `(function () {
  var formIds = ${JSON.stringify(formIds)};
  function initialize() {
    if (typeof window === "undefined" || typeof window.RDStationForms !== "function") {
      return false;
    }
    formIds.forEach(function (formId) {
      var element = document.getElementById(formId);
      if (!element || element.dataset.rdStationBound === "true") {
        return;
      }
      try {
        new window.RDStationForms(formId, ${JSON.stringify(rdStationToken)}).createForm();
        element.dataset.rdStationBound = "true";
      } catch (error) {
        console.error("RD Station form init failed", error);
      }
    });
    return true;
  }
  if (initialize()) {
    return;
  }
  var tries = 0;
  var interval = window.setInterval(function () {
    tries += 1;
    if (initialize() || tries >= 20) {
      window.clearInterval(interval);
    }
  }, 250);
})();`;
}

function ensureRdStationInlineScripts(html: string, scripts: string[]) {
  const hasExplicitInit = scripts.some(
    (script) =>
      script.includes("RDStationForms(") || script.includes(".createForm("),
  );

  if (hasExplicitInit) {
    return scripts;
  }

  const fallbackScript = buildRdStationAutoInitScript(html);

  if (!fallbackScript) {
    return scripts;
  }

  return [fallbackScript, ...scripts];
}

function extractSvgImgAttributes(svgMarkup: string) {
  const openTagMatch = svgMarkup.match(/^<svg\b([^>]*)>/i);
  const attrs = openTagMatch?.[1] ?? "";
  const namesToKeep = [
    "class",
    "style",
    "width",
    "height",
    "role",
    "aria-hidden",
    "aria-label",
  ];

  const keptAttributes: string[] = [];

  for (const name of namesToKeep) {
    const attrMatch = attrs.match(
      new RegExp(`\\b${name}=["']([^"']*)["']`, "i"),
    );

    if (attrMatch?.[1] != null) {
      keptAttributes.push(`${name}="${attrMatch[1]}"`);
    }
  }

  if (!keptAttributes.some((attr) => attr.startsWith("alt="))) {
    const ariaLabel = keptAttributes.find((attr) => attr.startsWith("aria-label="));
    keptAttributes.push(
      ariaLabel ? `alt=${ariaLabel.slice("aria-label=".length)}` : 'alt=""',
    );
  }

  return keptAttributes.join(" ");
}

function usesCurrentColor(svgMarkup: string) {
  return /\bcurrentColor\b/i.test(svgMarkup);
}

async function fetchAsset(sourceUrl: string) {
  if (sourceUrl.startsWith("/")) {
    const localPath = path.join(
      process.cwd(),
      "public",
      decodeURIComponent(sourceUrl.replace(/^\//, "")),
    );
    const data = new Uint8Array(await readFile(localPath));
    const extension = path.extname(localPath).toLowerCase();
    const contentType =
      extension === ".png"
        ? "image/png"
        : extension === ".jpg" || extension === ".jpeg"
        ? "image/jpeg"
        : extension === ".webp"
        ? "image/webp"
        : extension === ".svg"
        ? "image/svg+xml"
        : extension === ".ico"
        ? "image/x-icon"
        : extension === ".css"
        ? "text/css"
        : extension === ".js"
        ? "application/javascript"
        : extension === ".ttf"
        ? "font/ttf"
        : extension === ".woff"
        ? "font/woff"
        : extension === ".woff2"
        ? "font/woff2"
        : "application/octet-stream";

    return { data, contentType };
  }

  const response = await fetch(sourceUrl);

  if (!response.ok) {
    throw new Error(`No se pudo descargar ${sourceUrl}`);
  }

  const arrayBuffer = await response.arrayBuffer();
  const contentType = response.headers.get("content-type") || "";

  return {
    data: new Uint8Array(arrayBuffer),
    contentType,
  };
}

export async function exportLandingZip(brand: Brand, landing: Landing) {
  let html = await exportLandingHtml(brand, landing);
  html = html.replace(/<link rel="preconnect"[^>]+>/gi, "");

  const files: BundleFile[] = [];
  const sourceToFileName = new Map<string, string>();
  let bundledAssetCount = 0;

  async function bundleAsset(sourceUrl: string, baseUrl?: string): Promise<string> {
    const normalizedSourceUrl = normalizeSourceUrl(sourceUrl, baseUrl);

    if (sourceToFileName.has(normalizedSourceUrl)) {
      return sourceToFileName.get(normalizedSourceUrl)!;
    }

    const fetched = await fetchAsset(normalizedSourceUrl);
    const fileName = buildAssetFileName(
      normalizedSourceUrl,
      bundledAssetCount,
      fetched.contentType,
    );
    bundledAssetCount += 1;

    sourceToFileName.set(normalizedSourceUrl, fileName);

    let data = fetched.data;

    if (
      fetched.contentType.includes("text/css") ||
      fileName.toLowerCase().endsWith(".css")
    ) {
      let css = textDecoder.decode(fetched.data);
      const nestedUrls = collectCssResourceUrls(css);

      for (const nestedUrl of nestedUrls) {
        try {
          const nestedFileName = await bundleAsset(nestedUrl, normalizedSourceUrl);
          const rawValue = nestedUrl.trim();
          css = css
            .split(rawValue)
            .join(`./${path.posix.basename(nestedFileName)}`);
        } catch (error) {
          console.warn("ZIP EXPORT CSS ASSET SKIPPED:", nestedUrl, error);
        }
      }

      data = textEncoder.encode(css);
    }

    files.push({
      name: fileName,
      data,
    });

    return fileName;
  }

  const resourceUrls = collectHtmlResourceUrls(html);

  for (const resourceUrl of resourceUrls) {
    try {
      const fileName = await bundleAsset(resourceUrl);
      html = html.split(resourceUrl).join(`./${fileName}`);
    } catch (error) {
      console.warn("ZIP EXPORT ASSET SKIPPED:", resourceUrl, error);
    }
  }

  const inlineStyles = collectStyleTags(html);
  if (inlineStyles.length > 0) {
    const styleFileName = "assets/styles.css";
    files.push({
      name: styleFileName,
      data: textEncoder.encode(`${inlineStyles.join("\n\n")}\n`),
    });
    html = removeStyleTags(html).replace(
      /<\/head>/i,
      `  <link rel="stylesheet" href="./${styleFileName}">\n</head>`,
    );
  }

  const inlineScripts = ensureRdStationInlineScripts(
    html,
    collectInlineScripts(html),
  );
  if (inlineScripts.length > 0) {
    const scriptFileName = "assets/app.js";
    files.push({
      name: scriptFileName,
      data: textEncoder.encode(`${inlineScripts.join("\n\n")}\n`),
    });
    html = removeInlineScripts(html).replace(
      /<\/body>/i,
      `  <script src="./${scriptFileName}"></script>\n</body>`,
    );
  }

  let inlineSvgCount = 0;
  html = html.replace(inlineSvgPattern, (svgMarkup) => {
    if (usesCurrentColor(svgMarkup)) {
      return svgMarkup;
    }

    inlineSvgCount += 1;
    const fileName = `assets/${String(inlineSvgCount).padStart(2, "0")}-inline-graphic.svg`;
    files.push({
      name: fileName,
      data: textEncoder.encode(svgMarkup),
    });

    const imgAttributes = extractSvgImgAttributes(svgMarkup);
    return `<img src="./${fileName}" ${imgAttributes}>`;
  });

  const zipBuffer = createStoredZip([
    {
      name: "index.html",
      data: textEncoder.encode(html),
    },
    ...files,
  ]);

  return zipBuffer;
}
