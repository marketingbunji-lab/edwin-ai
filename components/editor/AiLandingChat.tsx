"use client";

import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Bot,
  CheckCircle2,
  Code2,
  FilePlus2,
  Send,
  Sparkles,
  User,
} from "lucide-react";
import type { Landing } from "@/lib/data";

type Message = {
  id: number;
  role: "assistant" | "user";
  content: string;
};

type Draft = {
  title: string;
  fullTitle: string;
  modality: string;
  audience: string;
};

type WebhookResponse = {
  reply?: string;
  message?: string;
  response?: string;
  output?: string;
  text?: string;
  draft?: unknown;
  landing?: unknown;
  programUrl?: string;
  raw?: unknown;
};

type Props = {
  brandSlug: string;
  brandName: string;
};

const starterPrompts = [
  "Quiero crear una landing para un pregrado presencial.",
  "Necesito una landing para un programa virtual.",
  "Ayúdame a ordenar la información de un programa nuevo.",
];

function getAssistantText(value: unknown) {
  if (typeof value === "string") {
    return value;
  }

  const normalizedValue = normalizeWebhookResponse(value);

  if (normalizedValue && typeof normalizedValue === "object") {
    const record = normalizedValue;
    const candidates = [
      record.reply,
      record.message,
      record.response,
      record.output,
      record.text,
    ];

    const text = candidates.find((candidate) => typeof candidate === "string");

    if (typeof text === "string") {
      return text;
    }

    return JSON.stringify(value, null, 2);
  }

  return "Recibí respuesta del webhook, pero no vino texto para mostrar.";
}

function isLanding(value: unknown): value is Landing {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    console.log(
      "[AiLandingChat] isLanding=false: value is not an object",
      value,
    );
    return false;
  }

  const record = value as Record<string, unknown>;
  const isValid =
    typeof record.title === "string" &&
    record.title.trim().length > 0 &&
    typeof record.fullTitle === "string" &&
    record.fullTitle.trim().length > 0 &&
    (record.template === undefined ||
      (typeof record.template === "string" &&
        record.template.trim().length > 0));

  if (!isValid) {
    console.log("[AiLandingChat] isLanding=false: missing base fields", {
      title: record.title,
      fullTitle: record.fullTitle,
      template: record.template,
      value,
    });
  }

  return isValid;
}

function getGeneratedLanding(value: unknown) {
  const normalizedValue = normalizeWebhookResponse(value);

  console.log("[AiLandingChat] getGeneratedLanding", {
    input: value,
    normalizedValue,
  });

  if (!normalizedValue || typeof normalizedValue !== "object") {
    console.log("[AiLandingChat] getGeneratedLanding: no normalized object");
    return null;
  }

  const record = normalizedValue as WebhookResponse;

  if (isLanding(record.landing)) {
    console.log("[AiLandingChat] landing found in record.landing");
    return record.landing;
  }

  if (isLanding(record.draft)) {
    console.log("[AiLandingChat] landing found in record.draft");
    return record.draft;
  }

  console.log("[AiLandingChat] no valid landing found", record);
  return null;
}

function parseJsonString(value: string) {
  const cleanValue = value
    .replace(/```json/gi, "")
    .replace(/```/g, "")
    .trim();
  const firstBrace = cleanValue.indexOf("{");
  const lastBrace = cleanValue.lastIndexOf("}");

  if (firstBrace === -1 || lastBrace === -1) {
    return null;
  }

  try {
    const parsed = JSON.parse(
      cleanValue.slice(firstBrace, lastBrace + 1),
    ) as unknown;
    console.log("[AiLandingChat] parsed raw JSON", parsed);
    return parsed;
  } catch {
    console.log("[AiLandingChat] failed to parse raw JSON", value);
    return null;
  }
}

function normalizeWebhookResponse(value: unknown): WebhookResponse | null {
  const firstValue = Array.isArray(value) ? value[0] : value;

  console.log("[AiLandingChat] normalizeWebhookResponse", {
    value,
    firstValue,
  });

  if (!firstValue || typeof firstValue !== "object") {
    console.log("[AiLandingChat] normalizeWebhookResponse=null");
    return null;
  }

  const record = firstValue as WebhookResponse;

  if (isLanding(record.landing) || isLanding(record.draft)) {
    return record;
  }

  if (typeof record.raw === "string") {
    const parsedRaw = parseJsonString(record.raw);

    if (parsedRaw && typeof parsedRaw === "object") {
      console.log("[AiLandingChat] merging parsed raw into response", {
        record,
        parsedRaw,
      });
      return {
        ...record,
        ...(parsedRaw as WebhookResponse),
      };
    }
  }

  console.log("[AiLandingChat] normalized response without parsed raw", record);
  return record;
}

export default function AiLandingChat({ brandSlug, brandName }: Props) {
  const router = useRouter();
  const nextMessageId = useRef(2);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      role: "assistant",
      content:
        "Cuéntame qué programa quieres crear. Puedes empezar con el nombre, modalidad, público objetivo o cualquier texto que ya tengas.",
    },
  ]);
  const [input, setInput] = useState("");
  const [draft, setDraft] = useState<Draft>({
    title: "",
    fullTitle: "",
    modality: "",
    audience: "",
  });
  const [programUrl, setProgramUrl] = useState("");
  const [generatedLanding, setGeneratedLanding] = useState<Landing | null>(
    null,
  );
  const [showJson, setShowJson] = useState(false);
  const [showDebug, setShowDebug] = useState(false);
  const [debugData, setDebugData] = useState<{
    raw?: unknown;
    normalized?: WebhookResponse | null;
    landing?: Landing | null;
  }>({});
  const [sending, setSending] = useState(false);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");

  const canSend = input.trim().length > 0 && !sending;
  const canCreate = Boolean(generatedLanding) && !creating && !sending;

  const assistantPreview = useMemo(() => {
    if (generatedLanding) {
      return "AI ya organizó la información en el formato de landing del proyecto.";
    }

    if (
      !draft.title &&
      !draft.fullTitle &&
      !draft.modality &&
      !draft.audience
    ) {
      return "El borrador se irá completando a medida que converses con AI.";
    }

    return "Borrador inicial listo para convertirlo luego en una landing editable.";
  }, [draft, generatedLanding]);

  const updateDraftFromText = (text: string) => {
    const firstSentence = text.split(".")[0].trim();
    const lowerText = text.toLowerCase();

    setDraft((current) => ({
      title: current.title || firstSentence.slice(0, 42),
      fullTitle: current.fullTitle || firstSentence.slice(0, 80),
      modality:
        current.modality ||
        (lowerText.includes("virtual")
          ? "Virtual"
          : lowerText.includes("presencial")
            ? "Presencial"
            : ""),
      audience: current.audience || "",
    }));
  };

  const applyWebhookData = (data: unknown) => {
    console.log("[AiLandingChat] applyWebhookData: raw data", data);

    if (!data || typeof data !== "object") {
      console.log("[AiLandingChat] applyWebhookData: ignored non-object data");
      setDebugData({ raw: data, normalized: null, landing: null });
      return;
    }

    const record = normalizeWebhookResponse(data);
    const nextLanding = getGeneratedLanding(record);

    console.log("[AiLandingChat] applyWebhookData: normalized result", {
      record,
      nextLanding,
    });
    setDebugData({ raw: data, normalized: record, landing: nextLanding });

    if (typeof record?.programUrl === "string") {
      console.log(
        "[AiLandingChat] applyWebhookData: setting programUrl",
        record.programUrl,
      );
      setProgramUrl(record.programUrl);
    }

    if (nextLanding) {
      console.log(
        "[AiLandingChat] applyWebhookData: setting generatedLanding",
        nextLanding,
      );
      setGeneratedLanding({
        ...nextLanding,
        brand: brandSlug,
        template: nextLanding.template || "DefaultLanding",
        status: nextLanding.status || "draft",
      });
      setDraft((current) => ({
        ...current,
        title: nextLanding.title || current.title,
        fullTitle: nextLanding.fullTitle || current.fullTitle,
        modality: nextLanding.hero?.modality || current.modality,
      }));
    }
  };

  const sendMessage = async (text = input) => {
    const trimmed = text.trim();

    if (!trimmed || sending) return;

    const userMessageId = nextMessageId.current;
    nextMessageId.current += 1;

    const userMessage: Message = {
      id: userMessageId,
      role: "user",
      content: trimmed,
    };
    const nextMessages = [...messages, userMessage];

    setMessages(nextMessages);
    updateDraftFromText(trimmed);
    setInput("");
    setError("");
    setSending(true);

    try {
      const response = await fetch("/api/ai-landing-chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: trimmed,
          brand: {
            slug: brandSlug,
            name: brandName,
          },
          draft: generatedLanding ?? draft,
          programUrl,
          history: nextMessages,
        }),
      });

      const contentType = response.headers.get("content-type") || "";
      const data = contentType.includes("application/json")
        ? await response.json()
        : await response.text();

      console.log("[AiLandingChat] /api/ai-landing-chat response", {
        status: response.status,
        contentType,
        data,
      });

      if (!response.ok) {
        throw new Error(
          getAssistantText(data) || "No se pudo enviar el mensaje",
        );
      }

      applyWebhookData(data);
      setMessages((current) => [
        ...current,
        {
          id: nextMessageId.current,
          role: "assistant",
          content: getAssistantText(data),
        },
      ]);
      nextMessageId.current += 1;
    } catch (requestError) {
      const message =
        requestError instanceof Error
          ? requestError.message
          : "No se pudo enviar el mensaje";

      setError(message);
      setMessages((current) => [
        ...current,
        {
          id: nextMessageId.current,
          role: "assistant",
          content:
            "No pude conectarme con el webhook en este momento. Revisa n8n e intenta de nuevo.",
        },
      ]);
      nextMessageId.current += 1;
    } finally {
      setSending(false);
    }
  };

  const createLanding = async () => {
    if (!generatedLanding || creating) return;

    try {
      setCreating(true);
      setError("");

      const response = await fetch(`/api/landings/${brandSlug}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(generatedLanding),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "No se pudo crear la landing");
      }

      router.push(data.redirectTo);
      router.refresh();
    } catch (createError) {
      setError(
        createError instanceof Error
          ? createError.message
          : "No se pudo crear la landing",
      );
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_420px]">
      <section className="flex min-h-[620px] flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950">
        <div className="border-b border-gray-200 p-5 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-black text-white dark:bg-[var(--bunji-primary)]">
              <Sparkles className="h-5 w-5" />
            </span>
            <div>
              <p className="text-sm text-gray-500 dark:text-slate-400">{brandName}</p>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-slate-50">
                Crear landing con AI
              </h2>
            </div>
          </div>
        </div>

        <div className="flex-1 space-y-4 overflow-y-auto bg-gray-50 p-5 dark:bg-[#020617]">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {message.role === "assistant" ? (
                <span className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-gray-700 shadow-sm dark:bg-slate-900 dark:text-slate-100">
                  <Bot className="h-4 w-4" />
                </span>
              ) : null}

              <div
                className={`max-w-[78%] whitespace-pre-wrap rounded-2xl px-4 py-3 text-sm leading-6 ${
                  message.role === "user"
                    ? "bg-black text-white dark:bg-[var(--bunji-primary)]"
                    : "border border-gray-200 bg-white text-gray-700 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200"
                }`}
              >
                {message.content}
              </div>

              {message.role === "user" ? (
                <span className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-black text-white dark:bg-[var(--bunji-primary)]">
                  <User className="h-4 w-4" />
                </span>
              ) : null}
            </div>
          ))}

          {sending ? (
            <div className="flex gap-3">
              <span className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-gray-700 shadow-sm dark:bg-slate-900 dark:text-slate-100">
                <Bot className="h-4 w-4" />
              </span>
              <div className="rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-500 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-400">
                Enviando al webhook...
              </div>
            </div>
          ) : null}
        </div>

        <div className="border-t border-gray-200 p-4 dark:border-slate-800">
          <div className="mb-3 flex flex-wrap gap-2">
            {starterPrompts.map((prompt) => (
              <button
                key={prompt}
                type="button"
                onClick={() => sendMessage(prompt)}
                disabled={sending}
                className="rounded-full border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-900"
              >
                {prompt}
              </button>
            ))}
          </div>

          <div className="flex gap-3">
            <textarea
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Escribe el nombre del programa o pega la información que tienes..."
              rows={2}
              disabled={sending}
              className="min-h-12 flex-1 resize-none rounded-xl border border-gray-300 px-4 py-3 text-sm text-gray-900 outline-none focus:border-black disabled:bg-gray-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500 dark:disabled:bg-slate-800"
            />
            <button
              type="button"
              onClick={() => sendMessage()}
              disabled={!canSend}
              className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-black text-white disabled:cursor-not-allowed disabled:opacity-50 dark:bg-[var(--bunji-primary)]"
              aria-label="Enviar mensaje"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>

          {error ? <p className="mt-3 text-sm text-red-600 dark:text-red-300">{error}</p> : null}
        </div>
      </section>

      <aside className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-slate-400">
              Borrador
            </p>
            <h3 className="mt-2 text-xl font-bold text-gray-900 dark:text-slate-50">
              Landing generada
            </h3>
          </div>

          {generatedLanding ? (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-200">
              <CheckCircle2 className="h-3.5 w-3.5" />
              Lista
            </span>
          ) : null}
        </div>

        <p className="mt-2 text-sm text-gray-600 dark:text-slate-300">{assistantPreview}</p>

        {generatedLanding ? (
          <div className="mt-5">
            <div className="space-y-4">
              <DraftField label="Título corto" value={generatedLanding.title} />
              <DraftField
                label="Título completo"
                value={generatedLanding.fullTitle}
              />
              <DraftField
                label="Modalidad"
                value={generatedLanding.hero?.modality || ""}
              />
              <DraftField
                label="Jornada"
                value={generatedLanding.schedule || ""}
              />
              <DraftField label="URL del programa" value={programUrl} />
            </div>

            <div className="mt-5 space-y-3">
              <button
                type="button"
                onClick={createLanding}
                disabled={!canCreate}
                className="bunji-button-primary inline-flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-60"
              >
                <FilePlus2 className="h-4 w-4" />
                {creating
                  ? "Creando landing..."
                  : "Crear landing con este JSON"}
              </button>

              <button
                type="button"
                onClick={() => setShowJson((value) => !value)}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-gray-300 px-4 py-3 text-sm font-semibold text-gray-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
              >
                <Code2 className="h-4 w-4" />
                {showJson ? "Ocultar JSON" : "Ver JSON"}
              </button>
            </div>
          </div>
        ) : (
          <div className="mt-6 rounded-xl bg-gray-50 p-4 text-sm text-gray-600 dark:bg-slate-900 dark:text-slate-300">
            Cuando n8n responda con un objeto <strong>landing</strong> o{" "}
            <strong>draft</strong>, aparecerá aquí para revisarlo y crearlo.
          </div>
        )}

        {showJson && generatedLanding ? (
          <pre className="mt-4 max-h-80 overflow-auto rounded-xl bg-gray-950 p-4 text-xs leading-5 text-gray-100">
            {JSON.stringify(generatedLanding, null, 2)}
          </pre>
        ) : null}

        <button
          type="button"
          onClick={() => setShowDebug((value) => !value)}
          className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-gray-300 px-4 py-3 text-sm font-semibold text-gray-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
        >
          <Code2 className="h-4 w-4" />
          {showDebug ? "Ocultar debug" : "Ver debug"}
        </button>

        {showDebug ? (
          <pre className="mt-4 max-h-80 overflow-auto rounded-xl bg-gray-950 p-4 text-xs leading-5 text-gray-100">
            {JSON.stringify(debugData, null, 2)}
          </pre>
        ) : null}

        <Link
          href={`/admin/brands/${brandSlug}/new`}
          className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-gray-300 px-4 py-3 text-sm font-semibold text-gray-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
        >
          Volver al formulario manual
          <ArrowRight className="h-4 w-4" />
        </Link>
      </aside>
    </div>
  );
}

function DraftField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-slate-400">
        {label}
      </p>
      <p className="mt-1 min-h-10 rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-800 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100">
        {value || "Pendiente"}
      </p>
    </div>
  );
}
