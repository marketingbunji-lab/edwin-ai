const SCRAPING_U_WEBHOOK_URL =
  "https://n8n.crisnnino.com/webhook-test/scraping-u";

export async function POST(request: Request) {
  let payload: { url?: unknown };

  try {
    payload = await request.json();
  } catch {
    return Response.json(
      {
        ok: false,
        message: "No se pudo leer el cuerpo de la solicitud.",
      },
      { status: 400 },
    );
  }

  const url = typeof payload.url === "string" ? payload.url.trim() : "";

  if (!url) {
    return Response.json(
      {
        ok: false,
        message: "Ingresa una URL antes de enviar la prueba.",
      },
      { status: 400 },
    );
  }

  try {
    const response = await fetch(SCRAPING_U_WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ url }),
    });

    const text = await response.text();
    let data: unknown = text;

    try {
      data = text ? JSON.parse(text) : null;
    } catch {
      data = text;
    }

    return Response.json({
      ok: response.ok,
      status: response.status,
      webhookUrl: SCRAPING_U_WEBHOOK_URL,
      message: response.ok
        ? "Webhook ejecutado correctamente."
        : "El webhook respondio con error. Revisa si el workflow test esta en Execute workflow.",
      data,
    });
  } catch (error) {
    return Response.json(
      {
        ok: false,
        message: "No se pudo conectar con el webhook scraping-u.",
        error: error instanceof Error ? error.message : "Error desconocido",
      },
      { status: 502 },
    );
  }
}
