import { NextResponse } from "next/server";

const webhookUrl = process.env.AI_BRAND_WEBHOOK_URL;

export async function POST(request: Request) {
  try {
    if (!webhookUrl) {
      return NextResponse.json(
        {
          ok: false,
          error:
            "Todavia no hay webhook configurado para crear marcas con IA. Agrega AI_BRAND_WEBHOOK_URL cuando tengas la URL.",
        },
        { status: 503 }
      );
    }

    const body = await request.json();

    const webhookResponse = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const contentType = webhookResponse.headers.get("content-type") || "";
    const data = contentType.includes("application/json")
      ? await webhookResponse.json()
      : await webhookResponse.text();

    if (!webhookResponse.ok) {
      return NextResponse.json(
        {
          ok: false,
          error:
            typeof data === "string" ? data : "El webhook respondio con error",
          details: typeof data === "string" ? undefined : data,
        },
        { status: webhookResponse.status }
      );
    }

    if (typeof data === "string") {
      return new NextResponse(data, {
        status: 200,
        headers: {
          "Content-Type": "text/plain; charset=utf-8",
        },
      });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("AI BRAND CHAT WEBHOOK ERROR:", error);

    return NextResponse.json(
      { ok: false, error: "No se pudo contactar el webhook" },
      { status: 500 }
    );
  }
}
