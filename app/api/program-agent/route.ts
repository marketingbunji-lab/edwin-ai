import { NextRequest, NextResponse } from "next/server";

const webhookUrl = "https://n8n.crisnnino.com/webhook/bunji-agent-program";

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function getWebhookError(data: unknown) {
  if (typeof data === "string" && data.trim()) {
    return data;
  }

  if (isRecord(data)) {
    if (typeof data.error === "string" && data.error.trim()) {
      return data.error;
    }

    if (typeof data.message === "string" && data.message.trim()) {
      return data.message;
    }
  }

  return "No se pudo ejecutar el Agent Content";
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const program = isRecord(body) ? body.program : null;

    if (!isRecord(body) || !isRecord(body.brand) || !isRecord(program)) {
      return NextResponse.json(
        {
          ok: false,
          error:
            "Faltan datos para ejecutar el agente. Se requiere brand y program.",
        },
        { status: 400 },
      );
    }

    if (
      typeof program.title !== "string" ||
      !program.title.trim() ||
      typeof program.sourceWebsite !== "string" ||
      !program.sourceWebsite.trim()
    ) {
      return NextResponse.json(
        {
          ok: false,
          error:
            "Completa el nombre del programa y el sitio web fuente antes de ejecutar el agente.",
        },
        { status: 400 },
      );
    }

    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
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
          error: getWebhookError(data),
          status: response.status,
          data,
        },
        { status: response.status },
      );
    }

    return NextResponse.json({
      ok: true,
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
