import fs from "node:fs";
import path from "node:path";
import { NextRequest, NextResponse } from "next/server";
import type { Brand } from "../../../../lib/data";
import { createAdminClient } from "../../../../utils/supabase/admin";

type Params = Promise<{
  brand: string;
}>;

type SyncSupabaseResponse = {
  ok: boolean;
  skipped?: boolean;
  error?: string;
};

function normalizeCertifications(brand: Brand) {
  return (brand.certifications ?? []).map((certification) => ({
    name: certification.name || "",
    url: certification.url || "",
    logos: {
      light: certification.logos?.light || "",
      dark: certification.logos?.dark || "",
    },
  }));
}

export async function PUT(req: NextRequest, { params }: { params: Params }) {
  try {
    const { brand } = await params;
    const body = (await req.json()) as Brand;
    const brandData: Brand = {
      slug: brand,
      name: body.name || "",
      shortName: (body.shortName || body.name || brand).trim(),
      logo: body.logo || "",
      logos: {
        light: body.logos?.light || "",
        dark: body.logos?.dark || "",
      },
      typography: {
        fontFamily: body.typography?.fontFamily || "",
        googleFontHref: body.typography?.googleFontHref || "",
      },
      primaryColor: body.primaryColor || "#111827",
      secondaryColor: body.secondaryColor || "#F8D74A",
      description: body.description || "",
      legalLinks: body.legalLinks || [],
      certifications: normalizeCertifications(body),
    };

    const filePath = path.join(
      process.cwd(),
      "data",
      "brands",
      `${brand}.json`
    );

    if (!fs.existsSync(filePath)) {
      return await updateSupabaseBrand(brand, brandData);
    }

    fs.writeFileSync(filePath, JSON.stringify(brandData, null, 2), "utf8");

    const supabaseResult = await syncSupabaseBrand(brand, brandData);

    return NextResponse.json({ ok: true, supabase: supabaseResult });
  } catch {
    return NextResponse.json(
      { ok: false, error: "No se pudo guardar la marca" },
      { status: 500 }
    );
  }
}

function formatSupabaseError(error: {
  message: string;
  code?: string;
  details?: string | null;
  hint?: string | null;
}) {
  return [
    error.message,
    error.code ? `Codigo: ${error.code}` : null,
    error.details ? `Detalle: ${error.details}` : null,
    error.hint ? `Sugerencia: ${error.hint}` : null,
  ]
    .filter(Boolean)
    .join(" | ");
}

async function updateSupabaseBrand(brandSlug: string, brand: Brand) {
  const supabase = createAdminClient();

  if (!supabase) {
    return NextResponse.json(
      {
        ok: false,
        error: "No se encontro SUPABASE_SERVICE_ROLE_KEY en el servidor.",
      },
      { status: 500 }
    );
  }

  const { data, error } = await supabase
    .from("brands")
    .update({
      name: brand.name,
      shortName: brand.shortName ?? brand.name,
      logo: brand.logo,
      logos: brand.logos ?? {},
      typography: brand.typography ?? {},
      primary_color: brand.primaryColor,
      secondary_color: brand.secondaryColor,
      description: brand.description ?? "",
      legal_links: brand.legalLinks ?? [],
      certifications: normalizeCertifications(brand),
      updated_at: new Date().toISOString(),
    })
    .eq("slug", brandSlug)
    .select("slug");

  if (error) {
    return NextResponse.json(
      { ok: false, error: formatSupabaseError(error) },
      { status: 500 }
    );
  }

  if (!data || data.length === 0) {
    return NextResponse.json(
      { ok: false, error: "Marca no encontrada en Supabase" },
      { status: 404 }
    );
  }

  return NextResponse.json({ ok: true });
}

async function syncSupabaseBrand(
  brandSlug: string,
  brand: Brand,
): Promise<SyncSupabaseResponse> {
  const supabase = createAdminClient();

  if (!supabase) {
    return {
      ok: false,
      skipped: true,
      error: "No se encontro SUPABASE_SERVICE_ROLE_KEY en el servidor.",
    };
  }

  const { data, error } = await supabase
    .from("brands")
    .update({
      name: brand.name,
      shortName: brand.shortName ?? brand.name,
      logo: brand.logo,
      logos: brand.logos ?? {},
      typography: brand.typography ?? {},
      primary_color: brand.primaryColor,
      secondary_color: brand.secondaryColor,
      description: brand.description ?? "",
      legal_links: brand.legalLinks ?? [],
      certifications: normalizeCertifications(brand),
      updated_at: new Date().toISOString(),
    })
    .eq("slug", brandSlug)
    .select("slug");

  if (error) {
    return { ok: false, error: formatSupabaseError(error) };
  }

  if (!data || data.length === 0) {
    return { ok: true, skipped: true };
  }

  return { ok: true };
}

async function deleteSupabaseBrand(brand: string) {
  const supabase = createAdminClient();

  if (!supabase) {
    return NextResponse.json(
      {
        ok: false,
        error: "No se encontro SUPABASE_SERVICE_ROLE_KEY en el servidor.",
      },
      { status: 500 }
    );
  }

  const { data, error } = await supabase
    .from("brands")
    .delete()
    .eq("slug", brand)
    .select("slug");

  if (error) {
    return NextResponse.json(
      { ok: false, error: formatSupabaseError(error) },
      { status: 500 }
    );
  }

  if (!data || data.length === 0) {
    return NextResponse.json(
      { ok: false, error: "Marca no encontrada en Supabase" },
      { status: 404 }
    );
  }

  return NextResponse.json({ ok: true });
}

export async function DELETE(req: NextRequest, { params }: { params: Params }) {
  try {
    const { brand } = await params;

    if (req.nextUrl.searchParams.get("source") === "supabase") {
      return await deleteSupabaseBrand(brand);
    }

    const filePath = path.join(
      process.cwd(),
      "data",
      "brands",
      `${brand}.json`
    );

    if (!fs.existsSync(filePath)) {
      return NextResponse.json(
        { ok: false, error: "Marca no encontrada" },
        { status: 404 }
      );
    }

    fs.unlinkSync(filePath);

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { ok: false, error: "No se pudo eliminar la marca" },
      { status: 500 }
    );
  }
}
