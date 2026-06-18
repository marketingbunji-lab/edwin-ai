import fs from "node:fs";
import path from "node:path";
import { NextRequest, NextResponse } from "next/server";
import { requireAuthenticatedUser } from "@/lib/serverAuth";
import { serializeLandingForStorage, type Landing, type Program } from "@/lib/data";
import {
  defaultLandingLanguageForBrand,
  getLandingTemplateCopy,
  normalizeLandingLanguage,
  type LandingLanguage,
} from "@/lib/landingLanguage";

type Params = Promise<{
  brand: string;
}>;

type DetectedProgramSeed = {
  title?: string;
  fullTitle?: string;
  slug?: string;
  sourceWebsite?: string;
  programUrl?: string;
  template?: string;
  status?: string;
  language?: string;
};

type DetectedProgram = {
  parentCategory?: string;
  parentCategoryLabel?: string;
  slug?: string;
  titleFromSlug?: string;
  url?: string;
  lastmod?: string | null;
  seed?: DetectedProgramSeed;
};

type BootstrapPayload = {
  detectedPrograms?: unknown;
  includeParentCategories?: unknown;
  excludeParentCategories?: unknown;
  overwriteExisting?: unknown;
  language?: unknown;
};

const programsDir = path.join(process.cwd(), "data", "programs");
const programsRegistryFile = "programs.json";
const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function isSafeSlug(value: string) {
  return slugPattern.test(value);
}

function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function normalizeString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function normalizeStringList(value: unknown) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.map(normalizeString).filter(Boolean);
}

function getProgramsPath(brand: string) {
  if (!isSafeSlug(brand)) {
    return null;
  }

  const filePath = path.resolve(programsDir, brand, programsRegistryFile);
  const relativePath = path.relative(programsDir, filePath);

  if (relativePath.startsWith("..") || path.isAbsolute(relativePath)) {
    return null;
  }

  return filePath;
}

function getProgramDataPath(brand: string, programId: string) {
  if (!isSafeSlug(brand) || !isSafeSlug(programId)) {
    return null;
  }

  const filePath = path.resolve(programsDir, brand, `${programId}.json`);
  const relativePath = path.relative(programsDir, filePath);

  if (relativePath.startsWith("..") || path.isAbsolute(relativePath)) {
    return null;
  }

  return filePath;
}

function getAvailableSlug(folder: string, requestedSlug: string) {
  const baseSlug = slugify(requestedSlug);
  let nextSlug = baseSlug;
  let index = 1;

  while (fs.existsSync(path.join(folder, `${nextSlug}.json`))) {
    index += 1;
    nextSlug = `${baseSlug}-${index}`;
  }

  return nextSlug;
}

function createBaseLanding(
  brand: string,
  title: string,
  fullTitle: string,
  template: string,
  language: LandingLanguage,
): Landing {
  const copy = getLandingTemplateCopy(language, brand);

  return {
    slug: slugify(title),
    brand,
    language,
    template,
    status: "draft",
    updatedAt: new Date().toISOString().slice(0, 10),
    logoMode: "dark",
    certifications: {
      enabled: false,
      resolutionText: "",
      items: [],
    },
    title,
    fullTitle,
    sourceWebsite: "",
    catalog: "",
    programType: "",
    schedule: "",
    hero: {
      variant: "default",
      eyebrow: `${copy.studyAt} ${brand.toUpperCase()}`,
      highlight: "",
      title: fullTitle,
      description: "",
      supportText: "",
      modality: "",
      semesterPrice: "",
      price: "",
      discountedPrice: "",
      discountPercentage: "",
      backgroundImage: "",
      personImage: "",
    },
    programInfo: [],
    graduateProfile: {
      title: "",
      image: "",
      items: [],
    },
    whyStudy: {
      title: "",
      description: "",
      image: "",
      items: [],
    },
    curriculum: {
      title: "",
      description: "",
      downloadUrl: "",
      buttonUrl: "",
      buttonTitle: "",
      items: [],
    },
    careerOutcomes: {
      title: "",
      subtitle: "",
      image: "",
      items: [],
    },
    studentSupport: {
      title: "",
      description: "",
      videoUrl: "",
      items: [],
    },
    benefits: {
      title: "",
      items: [],
    },
    cta: {
      title: "",
      button: "",
    },
    form: {
      title: copy.formTitle,
      description: copy.formDescription,
      scriptUrl: "",
      scriptCode: "",
      formId: "",
      programName: fullTitle,
      submitLabel: copy.formSubmitLabel,
    },
    footerScripts: [],
  };
}

function normalizeDetectedPrograms(value: unknown): DetectedProgram[] {
  if (!Array.isArray(value)) {
    return [];
  }

  const normalized: DetectedProgram[] = [];

  for (const item of value) {
    if (!isRecord(item)) {
      continue;
    }

    const seed = isRecord(item.seed) ? item.seed : {};
    const title =
      normalizeString(seed.title) ||
      normalizeString(seed.fullTitle) ||
      normalizeString(item.titleFromSlug);
    const fullTitle =
      normalizeString(seed.fullTitle) ||
      normalizeString(seed.title) ||
      normalizeString(item.titleFromSlug);
    const slug =
      normalizeString(seed.slug) || normalizeString(item.slug) || slugify(title);
    const sourceWebsite =
      normalizeString(seed.sourceWebsite) ||
      normalizeString(seed.programUrl) ||
      normalizeString(item.url);

    if (!title || !fullTitle || !slug) {
      continue;
    }

    normalized.push({
      parentCategory: normalizeString(item.parentCategory),
      parentCategoryLabel: normalizeString(item.parentCategoryLabel),
      slug,
      titleFromSlug: normalizeString(item.titleFromSlug),
      url: normalizeString(item.url),
      lastmod:
        typeof item.lastmod === "string" && item.lastmod.trim()
          ? item.lastmod.trim()
          : null,
      seed: {
        title,
        fullTitle,
        slug,
        sourceWebsite,
        programUrl:
          normalizeString(seed.programUrl) || normalizeString(item.url),
        template: normalizeString(seed.template) || "DefaultLanding",
        status: normalizeString(seed.status) || "draft",
        language: normalizeString(seed.language),
      },
    });
  }

  return normalized;
}

function createProgramRegistryEntry(landing: Landing): Program {
  return {
    id: landing.slug,
    programName: landing.fullTitle || landing.title,
    sourceWebsite: landing.sourceWebsite || `/${landing.brand}/${landing.slug}`,
    catalog: landing.catalog || "",
    updatedAt: landing.updatedAt,
  };
}

export async function POST(req: NextRequest, { params }: { params: Params }) {
  try {
    const unauthorized = await requireAuthenticatedUser();

    if (unauthorized) {
      return unauthorized;
    }

    const { brand } = await params;
    const registryPath = getProgramsPath(brand);

    if (!registryPath) {
      return NextResponse.json(
        { ok: false, error: "Marca invalida" },
        { status: 400 },
      );
    }

    const body = (await req.json()) as BootstrapPayload;
    const detectedPrograms = normalizeDetectedPrograms(body.detectedPrograms);
    const includeParentCategories = normalizeStringList(body.includeParentCategories);
    const excludeParentCategories = new Set(
      normalizeStringList(body.excludeParentCategories),
    );
    const overwriteExisting = body.overwriteExisting === true;
    const forcedLanguage = normalizeLandingLanguage(normalizeString(body.language));

    if (detectedPrograms.length === 0) {
      return NextResponse.json(
        { ok: false, error: "No se recibieron programas detectados" },
        { status: 400 },
      );
    }

    const brandFolder = path.dirname(registryPath);

    if (!fs.existsSync(brandFolder)) {
      fs.mkdirSync(brandFolder, { recursive: true });
    }

    const filteredPrograms = detectedPrograms.filter((program) => {
      const parentCategory = normalizeString(program.parentCategory);

      if (
        includeParentCategories.length > 0 &&
        !includeParentCategories.includes(parentCategory)
      ) {
        return false;
      }

      if (excludeParentCategories.has(parentCategory)) {
        return false;
      }

      return true;
    });

    const existingRegistry = fs.existsSync(registryPath)
      ? (JSON.parse(fs.readFileSync(registryPath, "utf8")) as Program[])
      : [];
    const registryMap = new Map(existingRegistry.map((program) => [program.id, program]));

    const created: Array<{ slug: string; title: string; sourceWebsite: string }> = [];
    const skipped: Array<{ slug: string; reason: string }> = [];

    for (const program of filteredPrograms) {
      const seed = program.seed;

      if (!seed?.title || !seed.fullTitle || !seed.slug) {
        skipped.push({
          slug: program.slug || "unknown",
          reason: "missing-seed-fields",
        });
        continue;
      }

      const requestedSlug = slugify(seed.slug);
      const existingPath = getProgramDataPath(brand, requestedSlug);

      if (existingPath && fs.existsSync(existingPath) && !overwriteExisting) {
        skipped.push({
          slug: requestedSlug,
          reason: "already-exists",
        });
        continue;
      }

      const finalSlug =
        existingPath && fs.existsSync(existingPath) && overwriteExisting
          ? requestedSlug
          : getAvailableSlug(brandFolder, requestedSlug || seed.title);
      const finalPath = getProgramDataPath(brand, finalSlug);

      if (!finalPath) {
        skipped.push({
          slug: requestedSlug || "unknown",
          reason: "invalid-slug",
        });
        continue;
      }

      const language =
        forcedLanguage ||
        normalizeLandingLanguage(seed.language) ||
        defaultLandingLanguageForBrand(brand);
      const template = normalizeString(seed.template) || "DefaultLanding";
      const sourceWebsite =
        normalizeString(seed.sourceWebsite) ||
        normalizeString(seed.programUrl) ||
        normalizeString(program.url);
      const programType =
        normalizeString(program.parentCategoryLabel) ||
        normalizeString(program.parentCategory);

      const landing = createBaseLanding(
        brand,
        seed.title,
        seed.fullTitle,
        template,
        language,
      );

      landing.slug = finalSlug;
      landing.status = normalizeString(seed.status) || "draft";
      landing.updatedAt = new Date().toISOString().slice(0, 10);
      landing.sourceWebsite = sourceWebsite || `/${brand}/${finalSlug}`;
      landing.programUrl = sourceWebsite || `/${brand}/${finalSlug}`;
      landing.programType = programType;
      landing.title = seed.title;
      landing.fullTitle = seed.fullTitle;
      landing.form = {
        ...landing.form,
        programName: seed.fullTitle,
      };

      fs.writeFileSync(
        finalPath,
        JSON.stringify(serializeLandingForStorage(landing), null, 2),
        "utf8",
      );

      const registryEntry = createProgramRegistryEntry(landing);
      registryMap.set(registryEntry.id, registryEntry);
      created.push({
        slug: finalSlug,
        title: landing.fullTitle,
        sourceWebsite: landing.sourceWebsite,
      });
    }

    const nextRegistry = Array.from(registryMap.values()).sort((a, b) =>
      a.programName.localeCompare(b.programName, "es"),
    );

    fs.writeFileSync(registryPath, JSON.stringify(nextRegistry, null, 2), "utf8");

    return NextResponse.json({
      ok: true,
      summary: {
        received: detectedPrograms.length,
        filtered: filteredPrograms.length,
        created: created.length,
        skipped: skipped.length,
      },
      created,
      skipped,
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error:
          error instanceof Error
            ? error.message
            : "No se pudieron importar los programas detectados",
      },
      { status: 500 },
    );
  }
}
