import fs from "node:fs";
import path from "node:path";
import { NextRequest, NextResponse } from "next/server";
import { requireAuthenticatedUser } from "../../../../lib/serverAuth";
import {
  getProgramsByBrand,
  normalizeLandingSchema,
  serializeLandingForStorage,
  type Landing,
  type Program,
} from "../../../../lib/data";

type Params = Promise<{
  brand: string;
}>;

const programsDir = path.join(process.cwd(), "data", "programs");
const programsRegistryFile = "programs.json";
const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function isSafeSlug(value: string) {
  return slugPattern.test(value);
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

function normalizePrograms(value: unknown): Program[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((item, index) => {
      if (!isRecord(item)) {
        return null;
      }

      const programName =
        typeof item.programName === "string" ? item.programName.trim() : "";
      const sourceWebsite =
        typeof item.sourceWebsite === "string" ? item.sourceWebsite.trim() : "";
      const catalog =
        typeof item.catalog === "string" ? item.catalog.trim() : "";

      if (!programName && !sourceWebsite && !catalog) {
        return null;
      }

      return {
        id:
          typeof item.id === "string" && item.id.trim()
            ? item.id.trim()
            : crypto.randomUUID(),
        programName: programName || `Programa ${index + 1}`,
        sourceWebsite,
        catalog,
        updatedAt: new Date().toISOString().slice(0, 10),
      };
    })
    .filter((item): item is Program => Boolean(item));
}

function syncProgramDataFiles(brand: string, programs: Program[]) {
  programs.forEach((program) => {
    const filePath = getProgramDataPath(brand, program.id);

    if (!filePath || !fs.existsSync(filePath)) {
      return;
    }

    const content = fs.readFileSync(filePath, "utf8");
    const data = JSON.parse(content) as Landing;
    const nextData: Landing = {
      ...data,
      sourceWebsite: program.sourceWebsite,
      catalog: program.catalog,
      updatedAt: new Date().toISOString().slice(0, 10),
    };

    fs.writeFileSync(filePath, JSON.stringify(nextData, null, 2), "utf8");
  });
}

function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function getAvailableProgramSlug(brand: string, requestedSlug: string) {
  const baseSlug = slugify(requestedSlug);
  let nextSlug = baseSlug;
  let index = 1;

  while (getProgramDataPath(brand, nextSlug) && fs.existsSync(getProgramDataPath(brand, nextSlug)!)) {
    index += 1;
    nextSlug = `${baseSlug}-${index}`;
  }

  return nextSlug;
}

function isValidProgramPayload(value: unknown, brand: string): value is Landing {
  if (!isRecord(value)) {
    return false;
  }

  return (
    value.brand === brand &&
    typeof value.title === "string" &&
    value.title.trim().length > 0 &&
    typeof value.fullTitle === "string" &&
    value.fullTitle.trim().length > 0 &&
    typeof value.template === "string" &&
    value.template.trim().length > 0
  );
}

export async function GET(_: NextRequest, { params }: { params: Params }) {
  const { brand } = await params;
  const filePath = getProgramsPath(brand);

  if (!filePath) {
    return NextResponse.json(
      { ok: false, error: "Marca invalida" },
      { status: 400 },
    );
  }

  const programs = getProgramsByBrand(brand);

  return NextResponse.json({ ok: true, programs });
}

export async function POST(req: NextRequest, { params }: { params: Params }) {
  try {
    const unauthorized = await requireAuthenticatedUser();

    if (unauthorized) {
      return unauthorized;
    }

    const { brand } = await params;
    const body: unknown = await req.json();

    if (!isSafeSlug(brand) || !isValidProgramPayload(body, brand)) {
      return NextResponse.json(
        { ok: false, error: "Datos de programa invalidos" },
        { status: 400 },
      );
    }

    const requestedSlug = slugify(body.slug || body.fullTitle || body.title);

    if (!requestedSlug) {
      return NextResponse.json(
        { ok: false, error: "El programa necesita un slug valido" },
        { status: 400 },
      );
    }

    const slug = getAvailableProgramSlug(brand, requestedSlug);
    const filePath = getProgramDataPath(brand, slug);

    if (!filePath) {
      return NextResponse.json(
        { ok: false, error: "Ruta de programa invalida" },
        { status: 400 },
      );
    }

    const brandFolder = path.dirname(filePath);

    if (!fs.existsSync(brandFolder)) {
      fs.mkdirSync(brandFolder, { recursive: true });
    }

    const programData = normalizeLandingSchema({
      ...body,
      brand,
      slug,
      status: body.status || "draft",
      updatedAt: new Date().toISOString().slice(0, 10),
    });

    fs.writeFileSync(
      filePath,
      JSON.stringify(serializeLandingForStorage(programData), null, 2),
      "utf8",
    );

    return NextResponse.json({
      ok: true,
      slug,
      redirectTo: `/admin/brands/${brand}/programs/${slug}/edit`,
      program: programData,
    });
  } catch {
    return NextResponse.json(
      { ok: false, error: "No se pudo crear el programa" },
      { status: 500 },
    );
  }
}

export async function PUT(req: NextRequest, { params }: { params: Params }) {
  try {
    const unauthorized = await requireAuthenticatedUser();

    if (unauthorized) {
      return unauthorized;
    }

    const { brand } = await params;
    const filePath = getProgramsPath(brand);

    if (!filePath) {
      return NextResponse.json(
        { ok: false, error: "Marca invalida" },
        { status: 400 },
      );
    }

    const body = (await req.json()) as { programs?: unknown };
    const programs = normalizePrograms(body.programs);

    const brandFolder = path.dirname(filePath);

    if (!fs.existsSync(brandFolder)) {
      fs.mkdirSync(brandFolder, { recursive: true });
    }

    fs.writeFileSync(filePath, JSON.stringify(programs, null, 2), "utf8");
    syncProgramDataFiles(brand, programs);

    return NextResponse.json({ ok: true, programs });
  } catch {
    return NextResponse.json(
      { ok: false, error: "No se pudieron guardar los programas" },
      { status: 500 },
    );
  }
}
