import { NextResponse } from "next/server";

const webhookUrl =
  "https://n8n.crisnnino.com/webhook/bunji-landing-engine-landing";

export async function POST(request: Request) {
  try {
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
            typeof data === "string" ? data : "El webhook respondió con error",
          details: typeof data === "string" ? undefined : data,
        },
        { status: webhookResponse.status },
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
    console.error("AI LANDING CHAT WEBHOOK ERROR:", error);

    return NextResponse.json(
      { ok: false, error: "No se pudo contactar el webhook" },
      { status: 500 },
    );
  }
}
