import type {
  UxWriterAgentRunInput,
  UxWriterCustomSectionInput,
} from "@/lib/agents/uxWriterAgent";

type UxWriterAgentResponse = {
  ok: boolean;
  dryRun?: boolean;
  data?: unknown;
  payload?: unknown;
  error?: string;
};

export async function runUxWriterAgent(
  input: UxWriterAgentRunInput,
): Promise<UxWriterAgentResponse> {
  const response = await fetch("/api/ux-writer-agent", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });

  return (await response.json()) as UxWriterAgentResponse;
}

export async function getUxWriterAgentCatalog(options?: {
  sectionIds?: string[];
  route?: string;
}) {
  const params = new URLSearchParams();

  for (const sectionId of options?.sectionIds ?? []) {
    params.append("sectionId", sectionId);
  }

  if (options?.route) {
    params.set("route", options.route);
  }

  const search = params.toString();
  const response = await fetch(
    `/api/ux-writer-agent${search ? `?${search}` : ""}`,
    {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    },
  );

  return response.json();
}

export function createUxWriterCustomSection(
  section: UxWriterCustomSectionInput,
) {
  return section;
}
