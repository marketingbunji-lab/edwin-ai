import { NextRequest, NextResponse } from "next/server";
import {
  deleteBrandAgentRecord,
  getBrandAgentRecord,
  isBrandAgentCollection,
  isSafeBrandAgentSlug,
  updateBrandAgentRecord,
} from "@/lib/brandAgentRecords";
import { requireAuthenticatedUser } from "@/lib/serverAuth";

type Params = Promise<{
  brand: string;
  collection: string;
  record: string;
}>;

export const dynamic = "force-dynamic";

function getValidParams(brand: string, collection: string, record: string) {
  if (
    !isSafeBrandAgentSlug(brand) ||
    !isSafeBrandAgentSlug(record) ||
    !isBrandAgentCollection(collection)
  ) {
    return null;
  }

  return { brand, collection, record };
}

export async function GET(_: NextRequest, { params }: { params: Params }) {
  const { brand, collection, record } = await params;
  const validParams = getValidParams(brand, collection, record);

  if (!validParams) {
    return NextResponse.json(
      { ok: false, error: "Ruta invalida" },
      { status: 400 },
    );
  }

  const item = getBrandAgentRecord(
    validParams.brand,
    validParams.collection,
    validParams.record,
  );

  if (!item) {
    return NextResponse.json(
      { ok: false, error: "Registro no encontrado" },
      { status: 404 },
    );
  }

  return NextResponse.json({ ok: true, record: item });
}

export async function PUT(req: NextRequest, { params }: { params: Params }) {
  try {
    const unauthorized = await requireAuthenticatedUser();

    if (unauthorized) {
      return unauthorized;
    }

    const { brand, collection, record } = await params;
    const validParams = getValidParams(brand, collection, record);

    if (!validParams) {
      return NextResponse.json(
        { ok: false, error: "Ruta invalida" },
        { status: 400 },
      );
    }

    const body = (await req.json()) as { record?: unknown };
    const item = updateBrandAgentRecord(
      validParams.brand,
      validParams.collection,
      validParams.record,
      body.record,
    );

    if (!item) {
      return NextResponse.json(
        { ok: false, error: "No se pudo actualizar el registro" },
        { status: 400 },
      );
    }

    return NextResponse.json({ ok: true, record: item });
  } catch {
    return NextResponse.json(
      { ok: false, error: "No se pudo actualizar el registro" },
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

    const { brand, collection, record } = await params;
    const validParams = getValidParams(brand, collection, record);

    if (!validParams) {
      return NextResponse.json(
        { ok: false, error: "Ruta invalida" },
        { status: 400 },
      );
    }

    const deleted = deleteBrandAgentRecord(
      validParams.brand,
      validParams.collection,
      validParams.record,
    );

    if (!deleted) {
      return NextResponse.json(
        { ok: false, error: "Registro no encontrado" },
        { status: 404 },
      );
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { ok: false, error: "No se pudo eliminar el registro" },
      { status: 500 },
    );
  }
}
