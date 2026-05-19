import { NextRequest, NextResponse } from "next/server";
import { requireAuthenticatedUser } from "@/lib/serverAuth";

const programAssetsWebhookUrl =
  "https://n8n.crisnnino.com/webhook/edwin-program-assets-agent";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const unauthorized = await requireAuthenticatedUser();

    if (unauthorized) {
      return unauthorized;
    }

    const body = await request.json();
    const response = await fetch(programAssetsWebhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(180000),
    });
    const text = await response.text();
    const data = parseJsonResponse(text);

    if (!response.ok) {
      return NextResponse.json(
        {
          ok: false,
          error: "El agente de program assets no respondio correctamente",
          status: response.status,
          data,
        },
        { status: 502 },
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error:
          error instanceof Error
            ? error.message
            : "No se pudo conectar con el agente de program assets",
      },
      { status: 502 },
    );
  }
}

function parseJsonResponse(value: string) {
  if (!value) {
    return {
      ok: false,
      error: "El agente no devolvio contenido",
    };
  }

  try {
    return JSON.parse(value);
  } catch {
    return {
      ok: false,
      error: "El agente devolvio una respuesta no JSON",
      raw: value,
    };
  }
}
