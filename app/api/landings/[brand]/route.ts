import fs from "node:fs";
import path from "node:path";
import { NextRequest, NextResponse } from "next/server";
import {
  normalizeLandingSchema,
  type Landing,
  type ProgramInfoItem,
} from "../../../../lib/data";

type Params = Promise<{
  brand: string;
}>;

type LandingPayload = Partial<Landing> & {
  title: string;
  fullTitle: string;
};

const programsDir = path.join(process.cwd(), "data", "programs");

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
    sourceWebsite: "",
    catalog: "",
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
    opportunityToWork: {
      title: "",
      subtitle: "",
      image: "",
      items: [],
    },
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

function slugifyProgramInfoKey(text: string) {
  return slugify(text) || "custom";
}

function inferProgramInfoItem(item: string, index: number): ProgramInfoItem {
  const value = item.trim();
  const [rawLabel, ...rest] = value.split(":");

  if (rest.length > 0) {
    const label = rawLabel.trim();
    return {
      key: slugifyProgramInfoKey(label),
      label,
      value: rest.join(":").trim(),
    };
  }

  if (/snies/i.test(value)) {
    return {
      key: "snies",
      label: "SNIES",
      value: value.replace(/^snies\s*/i, "").trim(),
    };
  }

  if (/cr[eé]dit/i.test(value)) {
    return {
      key: "credits",
      label: "Creditos academicos",
      value: value.replace(/\s*cr[eé]ditos?\s+acad[eé]micos?/i, "").trim(),
    };
  }

  if (/semestre|mes|month|hour|hora|duraci[oó]n/i.test(value)) {
    return {
      key: "duration",
      label: "Duracion",
      value: value.replace(/\s+de\s+duraci[oó]n/i, "").trim(),
    };
  }

  return {
    key: index === 0 ? "degree" : "custom",
    label: index === 0 ? "Titulo otorgado" : `Dato ${index + 1}`,
    value,
  };
}

function normalizeProgramInfo(programInfo: unknown): ProgramInfoItem[] {
  if (!Array.isArray(programInfo)) {
    return [];
  }

  return programInfo
    .map((item, index) => {
      if (typeof item === "string") {
        return inferProgramInfoItem(item, index);
      }

      if (isRecord(item)) {
        const key = typeof item.key === "string" ? item.key.trim() : "";
        const label = typeof item.label === "string" ? item.label.trim() : "";
        const value = typeof item.value === "string" ? item.value.trim() : "";
        const title = typeof item.title === "string" ? item.title.trim() : "";
        const content = typeof item.content === "string" ? item.content.trim() : "";

        if (value || label || key) {
          return {
            key: key || slugifyProgramInfoKey(label) || "custom",
            label: label || title || "Dato",
            value: value || content,
          };
        }

        if (title || content) {
          return inferProgramInfoItem(
            [title, content].filter(Boolean).join(": "),
            index,
          );
        }
      }

      return null;
    })
    .filter((item): item is ProgramInfoItem => Boolean(item));
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

    const brandFolder = path.join(programsDir, brand);

    if (!fs.existsSync(brandFolder)) {
      fs.mkdirSync(brandFolder, { recursive: true });
    }

    const landingData = normalizeLanding(body, brand, template);
    const slug = getAvailableSlug(brandFolder, landingData.slug || title);
    const filePath = path.join(brandFolder, `${slug}.json`);

    landingData.slug = slug;
    landingData.sourceWebsite = landingData.sourceWebsite || `/${brand}/${slug}`;

    fs.writeFileSync(
      filePath,
      JSON.stringify(normalizeLandingSchema(landingData), null, 2),
      "utf8",
    );

    return NextResponse.json({
      ok: true,
      slug,
      redirectTo: `/admin/brands/${brand}/landings/${slug}`,
    });
  } catch {
    return NextResponse.json(
      { ok: false, error: "No se pudo crear la landing" },
      { status: 500 },
    );
  }
}
