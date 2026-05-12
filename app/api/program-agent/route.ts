import { NextRequest, NextResponse } from "next/server";

//const webhookUrl = "https://n8n.crisnnino.com/webhook/bunji-agent-program";
const webhookUrl = "https://n8n.crisnnino.com/webhook-test/bunji-agent-program";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
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
          error: "No se pudo ejecutar el Agent Content",
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
