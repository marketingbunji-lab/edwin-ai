import { NextRequest, NextResponse } from "next/server";
import { requireAuthenticatedUser } from "@/lib/serverAuth";
import {
  getUniversityProfileByBrand,
  saveUniversityProfile,
} from "@/lib/universityProfiles";

type Params = Promise<{
  brand: string;
}>;

export async function GET(_: NextRequest, { params }: { params: Params }) {
  const { brand } = await params;
  const profile = getUniversityProfileByBrand(brand);

  return NextResponse.json({ ok: true, profile });
}

export async function PUT(req: NextRequest, { params }: { params: Params }) {
  try {
    const unauthorized = await requireAuthenticatedUser();

    if (unauthorized) {
      return unauthorized;
    }

    const { brand } = await params;
    const body = (await req.json()) as { profile?: unknown };
    const profile = saveUniversityProfile(
      brand,
      typeof body.profile === "object" && body.profile !== null
        ? body.profile
        : {},
    );

    if (!profile) {
      return NextResponse.json(
        { ok: false, error: "Marca invalida" },
        { status: 400 },
      );
    }

    return NextResponse.json({ ok: true, profile });
  } catch {
    return NextResponse.json(
      { ok: false, error: "No se pudo guardar el perfil institucional" },
      { status: 500 },
    );
  }
}
