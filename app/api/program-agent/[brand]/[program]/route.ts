import fs from "node:fs";
import path from "node:path";
import { NextResponse } from "next/server";
import {
  getBrandBySlug,
  getLandingBySlug,
  normalizeLandingSchema,
  type Landing,
} from "@/lib/data";
import { getSupabaseBrandBySlug } from "@/lib/supabaseBrands";

type Params = Promise<{
  brand: string;
  program: string;
}>;

//const webhookUrl = "https://n8n.crisnnino.com/webhook-test/bunji-agent-program";
const webhookUrl = "https://n8n.crisnnino.com/webhook/bunji-agent-program";
const programsDir = path.join(process.cwd(), "data", "programs");
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

function extractAgentProgram(data: unknown): Partial<Landing> & {
  programUrl?: string;
} {
  const firstItem = Array.isArray(data) ? data[0] : data;

  if (!isRecord(firstItem)) {
    return {};
  }

  const candidate =
    firstItem.landing ?? firstItem.draft ?? parseRawProgram(firstItem.raw);

  if (!isRecord(candidate)) {
    return {
      programUrl:
        typeof firstItem.programUrl === "string" ? firstItem.programUrl : "",
    };
  }

  return {
    ...candidate,
    programUrl:
      typeof firstItem.programUrl === "string" ? firstItem.programUrl : "",
  } as Partial<Landing> & { programUrl?: string };
}

function hasAgentFailure(data: unknown) {
  const firstItem = Array.isArray(data) ? data[0] : data;

  return isRecord(firstItem) && firstItem.success === false;
}

function parseRawProgram(raw: unknown) {
  if (typeof raw !== "string" || !raw.trim()) {
    return null;
  }

  try {
    return JSON.parse(raw) as unknown;
  } catch {
    return null;
  }
}

function hasProgramData(program: Partial<Landing> & { programUrl?: string }) {
  return Boolean(
    program.title ||
      program.fullTitle ||
      program.hero ||
      program.programInfo ||
      program.whyStudy ||
      program.supportSection ||
      program.benefits ||
      program.opportunityToWork ||
      program.programUrl,
  );
}

export async function POST(_: Request, { params }: { params: Params }) {
  try {
    const { brand: brandSlug, program: programSlug } = await params;
    const brand =
      getBrandBySlug(brandSlug) ?? (await getSupabaseBrandBySlug(brandSlug));
    const program = getLandingBySlug(brandSlug, programSlug);
    const filePath = getProgramPath(brandSlug, programSlug);

    if (!brand || !program || !filePath) {
      return NextResponse.json(
        { ok: false, error: "Programa no encontrado" },
        { status: 404 },
      );
    }

    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        brand,
        program,
      }),
    });

    const text = await response.text();
    let data: unknown = text;

    try {
      data = text ? JSON.parse(text) : null;
    } catch {
      data = text;
    }

    if (!response.ok) {
      return NextResponse.json(
        {
          ok: false,
          error: "No se pudo ejecutar el Agent Content",
          status: response.status,
          data,
        },
        { status: response.status },
      );
    }

    if (hasAgentFailure(data)) {
      return NextResponse.json(
        {
          ok: false,
          error:
            "El Agent Content respondio sin exito. Revisa el flujo del bot.",
          data,
        },
        { status: 422 },
      );
    }

    const agentProgram = extractAgentProgram(data);

    if (!hasProgramData(agentProgram)) {
      return NextResponse.json(
        {
          ok: false,
          error:
            "El Agent Content no devolvio datos para actualizar el programa. Revisa el flujo del bot.",
          data,
        },
        { status: 422 },
      );
    }

    const nextSlug =
      agentProgram.slug && isSafeSlug(agentProgram.slug)
        ? agentProgram.slug
        : programSlug;
    const nextFilePath =
      nextSlug !== programSlug ? getProgramPath(brandSlug, nextSlug) : filePath;

    if (!nextFilePath) {
      return NextResponse.json(
        { ok: false, error: "El slug devuelto por el agente no es valido" },
        { status: 400 },
      );
    }

    if (nextFilePath !== filePath && fs.existsSync(nextFilePath)) {
      return NextResponse.json(
        {
          ok: false,
          error:
            "El Agent Content devolvio un slug que ya existe en otro programa.",
          data,
        },
        { status: 409 },
      );
    }

    const nextProgram: Landing = {
      ...program,
      ...agentProgram,
      brand: brandSlug,
      slug: nextSlug,
      sourceWebsite:
        agentProgram.sourceWebsite ||
        agentProgram.programUrl ||
        program.sourceWebsite ||
        "",
      catalog: agentProgram.catalog ?? program.catalog ?? "",
      updatedAt: new Date().toISOString().slice(0, 10),
    };

    const normalizedProgram = normalizeLandingSchema(nextProgram);

    fs.writeFileSync(
      nextFilePath,
      JSON.stringify(normalizedProgram, null, 2),
      "utf8",
    );

    if (nextFilePath !== filePath) {
      fs.unlinkSync(filePath);
    }

    return NextResponse.json({
      ok: true,
      program: normalizedProgram,
      slug: normalizedProgram.slug,
      data,
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error:
          error instanceof Error
            ? error.message
            : "No se pudo ejecutar el Agent Content",
      },
      { status: 500 },
    );
  }
}
