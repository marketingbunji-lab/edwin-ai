import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const apply = process.argv.includes("--apply");
const dataRoots = ["programs", "landings"];
const imageKeys = new Set(["image", "backgroundImage", "logo", "icon", "src", "imageUrl"]);
const allowedTypes = new Map([
  ["image/png", "png"],
  ["image/jpeg", "jpg"],
  ["image/webp", "webp"],
  ["image/gif", "gif"],
  ["image/avif", "avif"],
  ["image/svg+xml", "svg"],
]);
const knownLocalSources = new Map([
  [
    "https://www.pcihealth.edu/wp-content/uploads/2021/12/Dental-Assistant-Hero.jpg",
    "/Dental-Assistant-Hero.jpg",
  ],
  [
    "https://www.pcihealth.edu/wp-content/uploads/2021/12/Med-Office-Hero.jpg",
    "/pci-health/PCI-Medical-Office-Hero-scaled-1-1920x1080.jpg",
  ],
]);
const report = {
  scannedJson: 0,
  references: 0,
  uniqueAssets: 0,
  downloaded: 0,
  copied: 0,
  reused: 0,
  failed: [],
  recordsBefore: 0,
  recordsAfter: 0,
  updatedJson: 0,
  backup: "",
};
const assetCache = new Map();
const discoveredByBrand = new Map();

function slugify(value) {
  return String(value || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "asset";
}

function isAssetReference(key, value) {
  return imageKeys.has(key) && typeof value === "string" && (/^https?:\/\//.test(value) || value.startsWith("/"));
}

function inferCategory(pointer) {
  const value = pointer.toLowerCase();
  if (value.includes("hero") || value.includes("background")) return "heroImages";
  if (value.includes("testimonial")) return "testimonialImages";
  if (value.includes("faculty") || value.includes("teacher")) return "facultyImages";
  if (value.includes("career") || value.includes("job")) return "careerImages";
  if (value.includes("classroom")) return "classroomImages";
  if (value.includes("training") || value.includes("lab")) return "handsOnTrainingImages";
  if (value.includes("lifestyle")) return "lifestyleImages";
  return "galleryImages";
}

function extensionFromUrl(value) {
  try {
    const extension = path.extname(new URL(value, "http://local").pathname).slice(1).toLowerCase();
    return /^(png|jpe?g|webp|gif|avif|svg)$/.test(extension)
      ? extension.replace("jpeg", "jpg")
      : "";
  } catch {
    return "";
  }
}

function descriptiveName(value, pointer) {
  try {
    const pathname = value.startsWith("/") ? value : new URL(value).pathname;
    const base = decodeURIComponent(path.basename(pathname, path.extname(pathname)));
    return slugify(base.replace(/_data$/i, "")) || slugify(pointer);
  } catch {
    return slugify(pointer);
  }
}

async function listJsonFiles(relativeRoot) {
  const absoluteRoot = path.join(root, relativeRoot);
  const result = [];
  let brands = [];
  try {
    brands = await fs.readdir(absoluteRoot, { withFileTypes: true });
  } catch {
    return result;
  }
  for (const brandEntry of brands.filter((entry) => entry.isDirectory())) {
    const brandDir = path.join(absoluteRoot, brandEntry.name);
    for (const file of (await fs.readdir(brandDir)).filter((name) => name.endsWith(".json"))) {
      result.push({ brand: brandEntry.name, absolute: path.join(brandDir, file), relative: path.relative(root, path.join(brandDir, file)) });
    }
  }
  return result;
}

async function materializeAsset(source, brand, programId, pointer) {
  source = knownLocalSources.get(source) || source;
  const cacheKey = `${brand}|${programId}|${source}`;
  if (assetCache.has(cacheKey)) return assetCache.get(cacheKey);

  if (source.startsWith(`/generated-assets/${brand}/programs-assets/${programId}/`)) {
    assetCache.set(cacheKey, source);
    report.reused++;
    return source;
  }

  const hash = crypto.createHash("sha256").update(source).digest("hex").slice(0, 12);
  let buffer;
  let extension = extensionFromUrl(source);

  try {
    if (source.startsWith("/")) {
      const sourcePath = path.resolve(root, "public", source.slice(1));
      const publicRoot = path.resolve(root, "public");
      if (!sourcePath.startsWith(`${publicRoot}${path.sep}`)) throw new Error("Ruta local fuera de public");
      buffer = await fs.readFile(sourcePath);
      report.copied++;
    } else {
      const response = await fetch(source, { headers: { Accept: "image/*" }, signal: AbortSignal.timeout(30000) });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const contentType = (response.headers.get("content-type") || "").split(";")[0].toLowerCase();
      if (!contentType.startsWith("image/")) throw new Error(`Contenido no visual: ${contentType || "desconocido"}`);
      extension = allowedTypes.get(contentType) || extension;
      if (!extension) throw new Error(`Formato no soportado: ${contentType}`);
      buffer = Buffer.from(await response.arrayBuffer());
      report.downloaded++;
    }

    if (!extension) extension = "png";
    const filename = `${descriptiveName(source, pointer)}-${hash}.${extension}`;
    const relative = path.posix.join("generated-assets", brand, "programs-assets", programId, filename);
    const destination = path.join(root, "public", ...relative.split("/"));
    if (apply) {
      await fs.mkdir(path.dirname(destination), { recursive: true });
      try {
        await fs.writeFile(destination, buffer, { flag: "wx" });
      } catch (error) {
        if (error?.code !== "EEXIST") throw error;
      }
    }
    const localUrl = `/${relative}`;
    assetCache.set(cacheKey, localUrl);
    return localUrl;
  } catch (error) {
    report.failed.push({ source, brand, programId, error: error instanceof Error ? error.message : String(error) });
    assetCache.set(cacheKey, source);
    return source;
  }
}

function addDiscovered(brand, item) {
  if (!discoveredByBrand.has(brand)) discoveredByBrand.set(brand, new Map());
  const key = `${item.programId}|${item.url}`;
  const records = discoveredByBrand.get(brand);
  const current = records.get(key);
  if (current) {
    current.sources.add(item.source);
    if (current.assetCategory === "galleryImages" && item.assetCategory !== "galleryImages") current.assetCategory = item.assetCategory;
  } else {
    records.set(key, { ...item, sources: new Set([item.source]) });
  }
}

async function walkAndReplace(value, context, pointer = []) {
  if (Array.isArray(value)) {
    for (let index = 0; index < value.length; index++) await walkAndReplace(value[index], context, [...pointer, String(index)]);
    return;
  }
  if (!value || typeof value !== "object") return;
  for (const [key, child] of Object.entries(value)) {
    const nextPointer = [...pointer, key];
    if (isAssetReference(key, child)) {
      report.references++;
      const pointerText = nextPointer.join(".");
      const localUrl = await materializeAsset(child, context.brand, context.programId, pointerText);
      value[key] = localUrl;
      addDiscovered(context.brand, {
        programId: context.programId,
        programName: context.programName,
        url: localUrl,
        name: `${context.programName} - ${descriptiveName(child, pointerText).replace(/-/g, " ")}`,
        assetCategory: inferCategory(pointerText),
        source: `${context.relative}#${pointerText}`,
      });
    } else {
      await walkAndReplace(child, context, nextPointer);
    }
  }
}

async function createBackup(files) {
  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  const backupRoot = path.join(root, ".tmp", `asset-consolidation-backup-${stamp}`);
  for (const file of files) {
    const destination = path.join(backupRoot, file.relative);
    await fs.mkdir(path.dirname(destination), { recursive: true });
    await fs.copyFile(file.absolute, destination);
  }
  report.backup = path.relative(root, backupRoot);
}

const contentFiles = (await Promise.all(dataRoots.map((name) => listJsonFiles(path.join("data", name))))).flat();
const visualFiles = await listJsonFiles(path.join("data", "visual-assets"));
report.scannedJson = contentFiles.length;
report.recordsBefore = visualFiles.length;

if (apply) await createBackup([...contentFiles, ...visualFiles]);

for (const file of contentFiles) {
  const json = JSON.parse(await fs.readFile(file.absolute, "utf8"));
  const programId = slugify(json.slug || path.basename(file.absolute, ".json"));
  const programName = String(json.fullTitle || json.shortTitle || json.title || programId).replace(/\s*\|.*$/, "");
  const before = JSON.stringify(json);
  await walkAndReplace(json, { ...file, programId, programName });
  if (JSON.stringify(json) !== before) {
    report.updatedJson++;
    if (apply) await fs.writeFile(file.absolute, `${JSON.stringify(json, null, 2)}\n`, "utf8");
  }
}

const existingByBrand = new Map();
for (const file of visualFiles) {
  const record = JSON.parse(await fs.readFile(file.absolute, "utf8"));
  const programId = slugify(record.programId || "brand");
  if (typeof record.url === "string" && record.url) {
    record.url = await materializeAsset(record.url, file.brand, programId, "visualAsset.url");
  }
  if (!existingByBrand.has(file.brand)) existingByBrand.set(file.brand, []);
  existingByBrand.get(file.brand).push({ file, record });
}

const allBrands = new Set([...existingByBrand.keys(), ...discoveredByBrand.keys()]);
for (const brand of allBrands) {
  const finalRecords = new Map();
  for (const { record } of existingByBrand.get(brand) || []) {
    const key = `${slugify(record.programId || "brand")}|${record.url}`;
    if (!finalRecords.has(key)) finalRecords.set(key, record);
  }
  for (const item of discoveredByBrand.get(brand)?.values() || []) {
    const key = `${item.programId}|${item.url}`;
    const existing = finalRecords.get(key);
    if (existing) {
      existing.programId ||= item.programId;
      existing.programName ||= item.programName;
      existing.assetCategory ||= item.assetCategory;
      existing.notes = `Unificado desde: ${[...item.sources].join("; ")}`;
      continue;
    }
    const now = new Date().toISOString();
    finalRecords.set(key, {
      id: `${slugify(item.name)}-${crypto.createHash("sha256").update(key).digest("hex").slice(0, 8)}`,
      category: "programs-assets",
      assetCategory: item.assetCategory,
      programId: item.programId,
      programName: item.programName,
      name: item.name,
      assetType: "Image",
      url: item.url,
      notes: `Unificado desde: ${[...item.sources].join("; ")}`,
      createdAt: now,
      updatedAt: now,
    });
  }

  report.recordsAfter += finalRecords.size;
  if (apply) {
    const brandDir = path.join(root, "data", "visual-assets", brand);
    await fs.mkdir(brandDir, { recursive: true });
    for (const file of (await fs.readdir(brandDir)).filter((name) => name.endsWith(".json"))) await fs.unlink(path.join(brandDir, file));
    for (const record of finalRecords.values()) {
      await fs.writeFile(path.join(brandDir, `${record.id}.json`), `${JSON.stringify(record, null, 2)}\n`, "utf8");
    }
  }
}

report.uniqueAssets = assetCache.size;
console.log(JSON.stringify({ mode: apply ? "apply" : "audit", ...report }, null, 2));
