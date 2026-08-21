import fs from "node:fs";
import path from "node:path";
import { NextRequest, NextResponse } from "next/server";
import { requireAuthenticatedUser } from "../../../../../lib/serverAuth";
import {
  normalizeLandingSchema,
  serializeLandingForStorage,
  type Landing,
  type Program,
} from "../../../../../lib/data";

type Params = Promise<{
  brand: string;
  program: string;
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

function getProgramPath(brand: string, program: string) {
  if (!isSafeSlug(brand) || !isSafeSlug(program)) {
    return null;
  }

  const filePath = path.resolve(programsDir, brand, `${program}.json`);
  const relativePath = path.relative(programsDir, filePath);

  if (relativePath.startsWith("..") || path.isAbsolute(relativePath)) {
    return null;
  }

  return filePath;
}

function getProgramsRegistryPath(brand: string) {
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

function slugifyFileName(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function persistCurriculumFile(
  brand: string,
  program: string,
  file: File,
) {
  const isPdf =
    file.type.toLowerCase() === "application/pdf" ||
    file.name.toLowerCase().endsWith(".pdf");

  if (!isPdf) {
    throw new Error("El plan de estudios debe ser un archivo PDF");
  }

  if (file.size > 15 * 1024 * 1024) {
    throw new Error("El plan de estudios no puede superar los 15 MB");
  }

  const uploadDir = path.join(
    process.cwd(),
    "public",
    "uploads",
    "brands",
    brand,
    "programs",
    program,
    "sources",
  );
  fs.mkdirSync(uploadDir, { recursive: true });

  const safeName = slugifyFileName(path.basename(file.name, path.extname(file.name)));
  const fileName = `${Date.now()}-${safeName || "plan-de-estudios"}.pdf`;
  fs.writeFileSync(
    path.join(uploadDir, fileName),
    Buffer.from(await file.arrayBuffer()),
  );

  return `/uploads/brands/${brand}/programs/${program}/sources/${fileName}`;
}

function isValidProgramPayload(
  value: unknown,
  brand: string,
  program: string,
): value is Landing {
  if (!isRecord(value)) {
    return false;
  }

  return (
    value.brand === brand &&
    value.slug === program &&
    typeof value.title === "string" &&
    value.title.trim().length > 0 &&
    typeof value.fullTitle === "string" &&
    value.fullTitle.trim().length > 0 &&
    typeof value.template === "string" &&
    value.template.trim().length > 0
  );
}

function removeProgramFromRegistry(brand: string, program: string) {
  const registryPath = getProgramsRegistryPath(brand);

  if (!registryPath || !fs.existsSync(registryPath)) {
    return;
  }

  const content = fs.readFileSync(registryPath, "utf8");
  const programs = JSON.parse(content) as Program[];
  const nextPrograms = programs.filter((item) => item.id !== program);

  fs.writeFileSync(
    registryPath,
    JSON.stringify(nextPrograms, null, 2),
    "utf8",
  );
}

export async function PUT(req: NextRequest, { params }: { params: Params }) {
  try {
    const unauthorized = await requireAuthenticatedUser();

    if (unauthorized) {
      return unauthorized;
    }

    const { brand, program } = await params;
    const filePath = getProgramPath(brand, program);

    if (!filePath) {
      return NextResponse.json(
        { ok: false, error: "Parametros de programa invalidos" },
        { status: 400 },
      );
    }

    if (!fs.existsSync(filePath)) {
      return NextResponse.json(
        { ok: false, error: "Programa no encontrado" },
        { status: 404 },
      );
    }

    const contentType = req.headers.get("content-type") || "";
    let body: unknown;
    let curriculumFile: File | null = null;

    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      const serializedProgram = formData.get("program");
      const uploadedCurriculum = formData.get("curriculumFile");

      if (typeof serializedProgram !== "string") {
        return NextResponse.json(
          { ok: false, error: "Datos de programa invalidos" },
          { status: 400 },
        );
      }

      try {
        body = JSON.parse(serializedProgram) as unknown;
      } catch {
        return NextResponse.json(
          { ok: false, error: "Datos de programa invalidos" },
          { status: 400 },
        );
      }

      curriculumFile =
        uploadedCurriculum instanceof File && uploadedCurriculum.size > 0
          ? uploadedCurriculum
          : null;
    } else {
      body = await req.json();
    }

    if (!isValidProgramPayload(body, brand, program)) {
      return NextResponse.json(
        { ok: false, error: "Datos de programa invalidos" },
        { status: 400 },
      );
    }

    let curriculumUrl = (body.catalog as string | undefined) || "";

    if (curriculumFile) {
      try {
        curriculumUrl = await persistCurriculumFile(
          brand,
          program,
          curriculumFile,
        );
      } catch (error) {
        return NextResponse.json(
          {
            ok: false,
            error:
              error instanceof Error
                ? error.message
                : "No se pudo guardar el plan de estudios",
          },
          { status: 400 },
        );
      }
    }

    const nextProgram = normalizeLandingSchema({
      ...body,
      brand,
      slug: program,
      catalog: curriculumUrl,
      updatedAt: new Date().toISOString().slice(0, 10),
    });

    fs.writeFileSync(
      filePath,
      JSON.stringify(serializeLandingForStorage(nextProgram), null, 2),
      "utf8",
    );

    return NextResponse.json({ ok: true, program: nextProgram });
  } catch {
    return NextResponse.json(
      { ok: false, error: "No se pudo guardar el programa" },
      { status: 500 },
    );
  }
}

export async function DELETE(_: NextRequest, { params }: { params: Params }) {
  try {
    const unauthorized = await requireAuthenticatedUser();

    if (unauthorized) {
      return unauthorized;
    }

    const { brand, program } = await params;
    const filePath = getProgramPath(brand, program);

    if (!filePath) {
      return NextResponse.json(
        { ok: false, error: "Parametros de programa invalidos" },
        { status: 400 },
      );
    }

    if (!fs.existsSync(filePath)) {
      return NextResponse.json(
        { ok: false, error: "Programa no encontrado" },
        { status: 404 },
      );
    }

    fs.unlinkSync(filePath);
    removeProgramFromRegistry(brand, program);

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { ok: false, error: "No se pudo eliminar el programa" },
      { status: 500 },
    );
  }
}
