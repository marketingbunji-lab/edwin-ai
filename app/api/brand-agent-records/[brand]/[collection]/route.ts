import { NextRequest, NextResponse } from "next/server";
import {
  createBrandAgentRecord,
  getBrandAgentRecords,
  isBrandAgentCollection,
  isSafeBrandAgentSlug,
} from "@/lib/brandAgentRecords";
import { requireAuthenticatedUser } from "@/lib/serverAuth";

type Params = Promise<{
  brand: string;
  collection: string;
}>;

export const dynamic = "force-dynamic";

export async function GET(_: NextRequest, { params }: { params: Params }) {
  const { brand, collection } = await params;

  if (!isSafeBrandAgentSlug(brand) || !isBrandAgentCollection(collection)) {
    return NextResponse.json(
      { ok: false, error: "Ruta invalida" },
      { status: 400 },
    );
  }

  return NextResponse.json({
    ok: true,
    records: getBrandAgentRecords(brand, collection),
  });
}

export async function POST(req: NextRequest, { params }: { params: Params }) {
  try {
    const unauthorized = await requireAuthenticatedUser();

    if (unauthorized) {
      return unauthorized;
    }

    const { brand, collection } = await params;

    if (!isSafeBrandAgentSlug(brand) || !isBrandAgentCollection(collection)) {
      return NextResponse.json(
        { ok: false, error: "Ruta invalida" },
        { status: 400 },
      );
    }

    const body = (await req.json()) as { record?: unknown };
    const record = createBrandAgentRecord(brand, collection, body.record);

    if (!record) {
      return NextResponse.json(
        { ok: false, error: "Completa los campos requeridos" },
        { status: 400 },
      );
    }

    return NextResponse.json({ ok: true, record }, { status: 201 });
  } catch {
    return NextResponse.json(
      { ok: false, error: "No se pudo guardar la informacion" },
      { status: 500 },
    );
  }
}
