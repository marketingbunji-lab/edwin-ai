import fs from "node:fs";
import path from "node:path";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  getProgramsByBrand,
  type Landing,
  type Program,
} from "../../../../lib/data";
import { getSupabaseConfig } from "../../../../utils/supabase/config";
import { createClient } from "../../../../utils/supabase/server";

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
