import fs from "node:fs";
import path from "node:path";
import { NextRequest, NextResponse } from "next/server";
import type { Landing } from "../../../../lib/data";

type Params = Promise<{
  brand: string;
}>;

type LandingPayload = Partial<Landing> & {
  title: string;
  fullTitle: string;
};

const landingsDir = path.join(process.cwd(), "data", "landings");

function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function isLandingPayload(value: unknown): value is LandingPayload {
  return (
    isRecord(value) &&
    typeof value.title === "string" &&
    typeof value.fullTitle === "string" &&
    (value.template === undefined || typeof value.template === "string")
  );
}

function getAvailableSlug(folder: string, requestedSlug: string) {
  const baseSlug = slugify(requestedSlug);
  let nextSlug = baseSlug;
  let index = 1;

  while (fs.existsSync(path.join(folder, `${nextSlug}.json`))) {
    index += 1;
    nextSlug = `${baseSlug}-${index}`;
  }

  return nextSlug;
}

function createBaseLanding(
  brand: string,
  title: string,
  fullTitle: string,
  template: string,
): Landing {
  return {
    slug: slugify(title),
    brand,
    template,
    status: "draft",
    updatedAt: new Date().toISOString().slice(0, 10),
    logoMode: "dark",
    certifications: {
      enabled: false,
      resolutionText: "",
      items: [],
    },
    title,
    fullTitle,
    programType: "",
    schedule: "",
    hero: {
      eyebrow: `Estudia en ${brand.toUpperCase()}`,
      highlight: "",
      title: fullTitle,
      description: "",
      supportText: "",
      modality: "",
      semesterPrice: "",
      backgroundImage: "",
      personImage: "",
    },
    programInfo: [],
    whyStudy: {
      title: "",
      description: "",
      image: "",
      items: [],
    },
    supportSection: {
      title: "",
      videoUrl: "",
      items: [],
    },
    benefits: {
      title: "",
      items: [],
    },
    cta: {
      title: "",
      button: "¡Inscríbete ahora!",
    },
    form: {
      scriptUrl: "",
      scriptCode: "",
      programName: fullTitle,
    },
    footerScripts: [],
  };
}

function normalizeLanding(
  body: Partial<Landing>,
  brand: string,
  fallbackTemplate: string,
): Landing {
  const title = body.title?.trim() ?? "";
  const fullTitle = body.fullTitle?.trim() ?? "";
  const template =
    body.template?.trim() || fallbackTemplate || "DefaultLanding";

  const normalizedBody = normalizeAiLandingData(body);

  return {
    ...createBaseLanding(brand, title, fullTitle, template),
    ...normalizedBody,
    brand,
    title,
    fullTitle,
    template,
    slug: slugify(body.slug || title),
    status: body.status || "draft",
    updatedAt: new Date().toISOString().slice(0, 10),
    logoMode: body.logoMode || "dark",
    form: {
      scriptUrl: normalizedBody.form?.scriptUrl || "",
      scriptCode: normalizedBody.form?.scriptCode || "",
      programName: normalizedBody.form?.programName || fullTitle,
      type: normalizedBody.form?.type,
    },
  };
}

function normalizeAiLandingData(body: Partial<Landing>): Partial<Landing> {
  return {
    ...body,
    programInfo: normalizeProgramInfo(body.programInfo),
  };
}

function normalizeProgramInfo(programInfo: unknown): string[] {
  if (!Array.isArray(programInfo)) {
    return [];
  }

  return programInfo
    .map((item) => {
      if (typeof item === "string") {
        return item;
      }

      if (isRecord(item)) {
        const title = typeof item.title === "string" ? item.title.trim() : "";
        const content =
          typeof item.content === "string" ? item.content.trim() : "";

        return [title, content].filter(Boolean).join(": ");
      }

      return "";
    })
    .filter(Boolean);
}

export async function POST(req: NextRequest, { params }: { params: Params }) {
  try {
    const { brand } = await params;
    const body: unknown = await req.json();

    if (!isLandingPayload(body)) {
      return NextResponse.json(
        { ok: false, error: "Datos de landing inválidos" },
        { status: 400 },
      );
    }

    const title = body.title.trim();
    const fullTitle = body.fullTitle.trim();
    const template = body.template?.trim() || "DefaultLanding";

    if (!title || !fullTitle) {
      return NextResponse.json(
        { ok: false, error: "Título y título completo son obligatorios" },
        { status: 400 },
      );
    }

    const brandFolder = path.join(landingsDir, brand);

    if (!fs.existsSync(brandFolder)) {
      fs.mkdirSync(brandFolder, { recursive: true });
    }

    const landingData = normalizeLanding(body, brand, template);
    const slug = getAvailableSlug(brandFolder, landingData.slug || title);
    const filePath = path.join(brandFolder, `${slug}.json`);

    landingData.slug = slug;

    fs.writeFileSync(filePath, JSON.stringify(landingData, null, 2), "utf8");

    return NextResponse.json({
      ok: true,
      slug,
      redirectTo: `/admin/brands/${brand}/${slug}`,
    });
  } catch {
    return NextResponse.json(
      { ok: false, error: "No se pudo crear la landing" },
      { status: 500 },
    );
  }
}
