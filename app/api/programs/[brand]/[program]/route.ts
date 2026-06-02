import fs from "node:fs";
import path from "node:path";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  normalizeLandingSchema,
  serializeLandingForStorage,
  type Landing,
  type Program,
} from "../../../../../lib/data";
import { getSupabaseConfig } from "../../../../../utils/supabase/config";
import { createClient } from "../../../../../utils/supabase/server";

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

async function requireAuthenticatedUser() {
  if (!getSupabaseConfig()) {
    return null;
  }

  const supabase = createClient(await cookies());
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json(
      { ok: false, error: "No autorizado" },
      { status: 401 },
    );
  }

  return null;
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

    const body: unknown = await req.json();

    if (!isValidProgramPayload(body, brand, program)) {
      return NextResponse.json(
        { ok: false, error: "Datos de programa invalidos" },
        { status: 400 },
      );
    }

    const nextProgram = normalizeLandingSchema({
      ...body,
      brand,
      slug: program,
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
