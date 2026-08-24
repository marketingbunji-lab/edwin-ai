import type { Brand, Landing } from "./data";
import { exportLandingHtml } from "./exportLandingHtml";

type BundleFile = {
  name: string;
  data: Uint8Array;
};

const textEncoder = new TextEncoder();
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

function getUrlExtension(url: string) {
  try {
    const parsed = new URL(url);
    const pathname = parsed.pathname.toLowerCase();
    const match = pathname.match(/\.([a-z0-9]{2,8})$/i);

    return match ? `.${match[1]}` : "";
  } catch {
    return "";
  }
}

function sanitizeFileStem(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase()
    .slice(0, 48);
}

function collectResourceUrls(html: string) {
  const urls = new Set<string>();
  const attrPattern =
    /<(img|source|script|link)\b[^>]+\b(?:src|href|srcset)=["']([^"']+)["']/gi;
  const cssUrlPattern = /url\(["']?(https?:\/\/[^)"']+)["']?\)/gi;

  for (const match of html.matchAll(attrPattern)) {
    const rawValue = match[2]?.trim() || "";

    if (!rawValue.startsWith("http")) continue;
    if (rawValue.includes(",")) {
      for (const candidate of rawValue.split(",")) {
        const firstPart = candidate.trim().split(/\s+/)[0];

        if (firstPart.startsWith("http")) {
          urls.add(firstPart);
        }
      }
      continue;
    }

    urls.add(rawValue);
  }

  for (const match of html.matchAll(cssUrlPattern)) {
    const url = match[1]?.trim() || "";

    if (url.startsWith("http")) {
      urls.add(url);
    }
  }

  return Array.from(urls);
}

async function fetchAsset(url: string) {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`No se pudo descargar ${url}`);
  }

  const arrayBuffer = await response.arrayBuffer();
  const contentType = response.headers.get("content-type") || "";

  return {
    data: new Uint8Array(arrayBuffer),
    contentType,
  };
}

function buildAssetFileName(url: string, index: number) {
  const extension = getUrlExtension(url) || ".bin";

  try {
    const parsed = new URL(url);
    const lastSegment = parsed.pathname.split("/").filter(Boolean).pop() || "";
    const stem = sanitizeFileStem(lastSegment.replace(/\.[^.]+$/, "")) || "asset";

    return `assets/${String(index + 1).padStart(2, "0")}-${stem}${extension}`;
  } catch {
    return `assets/${String(index + 1).padStart(2, "0")}-asset${extension}`;
  }
}

export async function exportLandingZip(brand: Brand, landing: Landing) {
  let html = await exportLandingHtml(brand, landing);
  const resourceUrls = collectResourceUrls(html);
  const assetFiles: BundleFile[] = [];

  for (const [index, url] of resourceUrls.entries()) {
    try {
      const asset = await fetchAsset(url);
      const fileName = buildAssetFileName(url, index);

      assetFiles.push({
        name: fileName,
        data: asset.data,
      });

      html = html.split(url).join(`./${fileName}`);
    } catch (error) {
      console.warn("ZIP EXPORT ASSET SKIPPED:", url, error);
    }
  }

  const zipBuffer = createStoredZip([
    {
      name: "index.html",
      data: textEncoder.encode(html),
    },
    ...assetFiles,
  ]);

  return zipBuffer;
}
