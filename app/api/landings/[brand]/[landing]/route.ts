import fs from "node:fs";
import path from "node:path";
import { NextRequest, NextResponse } from "next/server";
import type { Landing } from "../../../../../lib/data";

type Params = Promise<{
  brand: string;
  landing: string;
}>;

const landingsDir = path.join(process.cwd(), "data", "landings");
const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function isSafeSlug(value: string) {
  return slugPattern.test(value);
}

function getLandingPath(brand: string, landing: string) {
  if (!isSafeSlug(brand) || !isSafeSlug(landing)) {
    return null;
  }

  const filePath = path.resolve(landingsDir, brand, `${landing}.json`);
  const relativePath = path.relative(landingsDir, filePath);

  if (relativePath.startsWith("..") || path.isAbsolute(relativePath)) {
    return null;
  }

  return filePath;
}

function isValidLandingPayload(
  value: unknown,
  brand: string,
  landing: string,
): value is Landing {
  if (!isRecord(value)) {
    return false;
  }

  return (
    value.brand === brand &&
    value.slug === landing &&
    typeof value.title === "string" &&
    typeof value.fullTitle === "string" &&
    typeof value.template === "string" &&
    value.template.trim().length > 0 &&
    typeof value.status === "string" &&
    value.status.trim().length > 0 &&
    typeof value.updatedAt === "string" &&
    value.updatedAt.trim().length > 0
  );
}

export async function PUT(req: NextRequest, { params }: { params: Params }) {
  try {
    const { brand, landing } = await params;
    const filePath = getLandingPath(brand, landing);

    if (!filePath) {
      return NextResponse.json(
        { ok: false, error: "Parámetros de landing inválidos" },
        { status: 400 },
      );
    }

    if (!fs.existsSync(filePath)) {
      return NextResponse.json(
        { ok: false, error: "Landing no encontrada" },
        { status: 404 },
      );
    }

    const body: unknown = await req.json();

    if (!isValidLandingPayload(body, brand, landing)) {
      return NextResponse.json(
        { ok: false, error: "Datos de landing inválidos" },
        { status: 400 },
      );
    }

    fs.writeFileSync(filePath, JSON.stringify(body, null, 2), "utf8");

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { ok: false, error: "No se pudo guardar la landing" },
      { status: 500 },
    );
  }
}

export async function DELETE(_: NextRequest, { params }: { params: Params }) {
  try {
    const { brand, landing } = await params;
    const filePath = getLandingPath(brand, landing);

    if (!filePath) {
      return NextResponse.json(
        { ok: false, error: "Parámetros de landing inválidos" },
        { status: 400 },
      );
    }

    if (!fs.existsSync(filePath)) {
      return NextResponse.json(
        { ok: false, error: "Landing no encontrada" },
        { status: 404 },
      );
    }

    fs.unlinkSync(filePath);

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { ok: false, error: "No se pudo eliminar la landing" },
      { status: 500 },
    );
  }
}
