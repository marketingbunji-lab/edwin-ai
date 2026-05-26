import { NextRequest, NextResponse } from "next/server";
import {
  buildUxWriterAgentPayload,
  getUxWriterAgentDefinition,
  getUxWriterSections,
  listUxWriterDashboardSections,
  type UxWriterAgentRunInput,
} from "@/lib/agents/uxWriterAgent";

export const dynamic = "force-dynamic";

const webhookUrl = process.env.UX_WRITER_AGENT_WEBHOOK_URL || "";

function parseSectionIds(searchParams: URLSearchParams) {
  return searchParams.getAll("sectionId").filter(Boolean);
}

function getWebhookError(data: unknown) {
  if (typeof data === "string" && data.trim()) {
    return data;
  }

  if (data && typeof data === "object" && !Array.isArray(data)) {
    const record = data as Record<string, unknown>;

    if (typeof record.error === "string" && record.error.trim()) {
      return record.error;
    }

    if (typeof record.message === "string" && record.message.trim()) {
      return record.message;
    }
  }

  return "The UX Writer agent could not complete the request.";
}

export async function GET(request: NextRequest) {
  const sectionIds = parseSectionIds(request.nextUrl.searchParams);
  const route = request.nextUrl.searchParams.get("route") || undefined;
  const sections = getUxWriterSections({ sectionIds, route });

  return NextResponse.json({
    ok: true,
    agent: getUxWriterAgentDefinition(),
    availableSections: listUxWriterDashboardSections(),
    selectedSections: sections,
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as UxWriterAgentRunInput;
    const payload = buildUxWriterAgentPayload(body);

    if (payload.sections.length === 0) {
      return NextResponse.json(
        {
          ok: false,
          error:
            "Select at least one dashboard section or provide a route/custom section for the UX Writer agent.",
        },
        { status: 400 },
      );
    }

    if (!webhookUrl || body.dryRun !== false) {
      return NextResponse.json({
        ok: true,
        dryRun: true,
        payload,
      });
    }

    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
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
          payload,
          data,
        },
        { status: response.status },
      );
    }

    return NextResponse.json({
      ok: true,
      dryRun: false,
      payload,
      data,
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error:
          error instanceof Error
            ? error.message
            : "The UX Writer agent could not be executed.",
      },
      { status: 500 },
    );
  }
}
