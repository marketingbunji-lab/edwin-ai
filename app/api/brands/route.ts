import fs from "node:fs";
import path from "node:path";
import { NextRequest, NextResponse } from "next/server";
import type {
  Brand,
  BrandDocumentCategoryId,
  BrandDocuments,
} from "../../../lib/data";
import { enrichBrandColorPalette } from "@/lib/brandColors";
import { createAdminClient } from "../../../utils/supabase/admin";

const brandsDir = path.join(process.cwd(), "data", "brands");
const brandDocumentCategoryIds: BrandDocumentCategoryId[] = [
  "legal",
  "catalogs",
  "brandBook",
  "curriculum",
  "website",
];

function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

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

function normalizeCampuses(brand: Brand) {
  return (brand.campuses ?? []).map((campus) => ({
    name: campus.name || "",
    location: campus.location || "",
    description: campus.description || "",
    image: campus.image || "",
    videoUrl: campus.videoUrl || "",
  }));
}

function normalizeDocuments(brand: Partial<Brand>) {
  const normalized: BrandDocuments = {};

  for (const categoryId of brandDocumentCategoryIds) {
    const document = brand.documents?.[categoryId];

    if (!document) {
      continue;
    }

    const mode = document.mode === "link" ? "link" : "file";
    const fileName = (document.fileName || "").trim();
    const fileUrl = (document.fileUrl || "").trim();
    const link = (document.link || "").trim();

    if (document.deleted) {
      normalized[categoryId] = {
        mode,
        fileName: "",
        fileUrl: "",
        link: "",
        updatedAt: document.updatedAt || "",
        deleted: true,
      };
      continue;
    }

    if (!fileName && !fileUrl && !link) {
      continue;
    }

    normalized[categoryId] = {
      mode,
      fileName,
      fileUrl,
      link,
      updatedAt: document.updatedAt || "",
    };
  }

  return normalized;
}

async function createBrandInSupabase(brand: Brand) {
  try {
    const supabase = createAdminClient();

    if (!supabase) {
      return {
        ok: false,
        error:
          "No se encontró SUPABASE_SERVICE_ROLE_KEY en el servidor. Reinicia npm run dev después de agregarla.",
      };
    }

    const { error } = await supabase.from("brands").insert({
      id: crypto.randomUUID(),
      slug: brand.slug,
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
    });

    if (error) {
      const details = [
        error.message,
        error.code ? `Código: ${error.code}` : null,
        error.details ? `Detalle: ${error.details}` : null,
        error.hint ? `Sugerencia: ${error.hint}` : null,
      ].filter(Boolean);

      return {
        ok: false,
        error: details.join(" | "),
      };
    }

    return {
      ok: true,
      error: null,
    };
  } catch (error) {
    return {
      ok: false,
      error:
        error instanceof Error
          ? error.message
          : "No se pudo crear la marca en Supabase",
    };
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as Brand;
    const name = (body.name || "").trim();
    const requestedSlug = (body.slug || "").trim();
    const slug = slugify(requestedSlug || name);

    if (!name || !slug) {
      return NextResponse.json(
        { ok: false, error: "Nombre y slug son obligatorios" },
        { status: 400 },
      );
    }

    const filePath = path.join(brandsDir, `${slug}.json`);

    if (fs.existsSync(filePath)) {
      return NextResponse.json(
        { ok: false, error: "Ya existe una marca con ese slug" },
        { status: 409 },
      );
    }

    const brandData: Brand = enrichBrandColorPalette({
      slug,
      name,
      shortName: (body.shortName || name).trim(),
      logo: body.logo || "",
      favicon: body.favicon || "",
      logos: {
        light: body.logos?.light || "",
        dark: body.logos?.dark || "",
      },
      typography: {
        fontFamily: body.typography?.fontFamily || "",
        googleFontHref: body.typography?.googleFontHref || "",
      },
      identityManual: body.identityManual || "",
      primaryColor: body.primaryColor || "#111827",
      secondaryColor: body.secondaryColor || "#F8D74A",
      description: body.description || "",
      officialWebsite: body.officialWebsite || "",
      siteName: body.siteName || "",
      abstract: body.abstract || "",
      keywords: body.keywords || [],
      robots: body.robots || "",
      generator: body.generator || "",
      imageBrand: body.imageBrand || "",
      images: body.images || [],
      campuses: normalizeCampuses(body),
      legalLinks: body.legalLinks || [],
      certifications: normalizeCertifications(body),
      documents: normalizeDocuments(body),
    });

    fs.writeFileSync(filePath, JSON.stringify(brandData, null, 2), "utf8");
    const supabase = await createBrandInSupabase(brandData);

    return NextResponse.json({
      ok: true,
      slug,
      redirectTo: `/admin/brands/${slug}/edit`,
      supabase,
    });
  } catch {
    return NextResponse.json(
      { ok: false, error: "No se pudo crear la marca" },
      { status: 500 },
    );
  }
}
