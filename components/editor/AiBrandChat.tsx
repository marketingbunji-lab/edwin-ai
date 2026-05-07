"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Bot,
  Building2,
  Code2,
  FilePlus2,
  Send,
  Sparkles,
  User,
} from "lucide-react";
import type { Brand } from "@/lib/data";

type Message = {
  id: number;
  role: "assistant" | "user";
  content: string;
};

type WebhookResponse = {
  error?: string;
  details?: unknown;
  reply?: string;
  message?: string;
  response?: string;
  output?: string;
  text?: string;
  brand?: unknown;
  draft?: unknown;
  landing?: unknown;
  raw?: unknown;
};

const starterPrompts = [
  "Quiero crear una marca para una universidad virtual.",
  "Ayudame a organizar logos, colores y descripcion de una marca.",
  "Necesito una marca nueva para un cliente educativo.",
];

const emptyBrand: Brand = {
  slug: "",
  name: "",
  shortName: "",
  logo: "",
  logos: {
    light: "",
    dark: "",
  },
  typography: {
    fontFamily: "",
    googleFontHref: "",
  },
  primaryColor: "",
  secondaryColor: "",
  description: "",
  legalLinks: [],
  certifications: [],
};

function normalizeCertifications(brand: Brand) {
  return (brand.certifications ?? []).map((certification) => ({
    name: certification.name || "",
    url: certification.url || "",
    logos: {
      light: certification.logos?.light || "",
      dark: certification.logos?.dark || "",
    },
  }));
}

function normalizeWebhookResponse(value: unknown): WebhookResponse | null {
  const firstValue = Array.isArray(value) ? value[0] : value;

  if (!firstValue || typeof firstValue !== "object") {
    return null;
  }

  const record = firstValue as WebhookResponse;

  if (typeof record.raw === "string") {
    const cleanValue = record.raw
      .replace(/```json/gi, "")
      .replace(/```/g, "")
      .trim();
    const firstBrace = cleanValue.indexOf("{");
    const lastBrace = cleanValue.lastIndexOf("}");

    if (firstBrace !== -1 && lastBrace !== -1) {
      try {
        return {
          ...record,
          ...(JSON.parse(cleanValue.slice(firstBrace, lastBrace + 1)) as object),
        };
      } catch {
        return record;
      }
    }
  }

  return record;
}

function getAssistantText(value: unknown) {
  if (typeof value === "string") {
    return value;
  }

  const record = normalizeWebhookResponse(value);

  if (typeof record?.error === "string") {
    if (
      record.details &&
      typeof record.details === "object" &&
      "message" in record.details
    ) {
      const details = record.details as {
        message?: unknown;
        hint?: unknown;
      };
      const message =
        typeof details.message === "string" ? details.message : record.error;
      const hint = typeof details.hint === "string" ? ` ${details.hint}` : "";

      return `${message}${hint}`;
    }

    return record.error;
  }

  const candidates = [
    record?.reply,
    record?.message,
    record?.response,
    record?.output,
    record?.text,
  ];
  const text = candidates.find((candidate) => typeof candidate === "string");

  if (typeof text === "string") {
    return text;
  }

  return "Recibi respuesta del webhook, pero no vino texto para mostrar.";
}

function isBrand(value: unknown): value is Brand {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return false;
  }

  const record = value as Record<string, unknown>;
  return (
    typeof record.slug === "string" &&
    record.slug.trim().length > 0 &&
    typeof record.name === "string" &&
    record.name.trim().length > 0
  );
}

function getGeneratedBrand(value: unknown) {
  const record = normalizeWebhookResponse(value);

  if (isBrand(record?.brand)) {
    return record.brand;
  }

  if (isBrand(record?.draft)) {
    return record.draft;
  }

  if (isBrand(record?.landing)) {
    return record.landing;
  }

  const textCandidates = [
    record?.message,
    record?.reply,
    record?.response,
    record?.output,
    record?.text,
  ];

  for (const candidate of textCandidates) {
    if (typeof candidate !== "string") {
      continue;
    }

    const parsed = normalizeWebhookResponse({ raw: candidate });

    if (isBrand(parsed?.brand)) {
      return parsed.brand;
    }

    if (isBrand(parsed?.draft)) {
      return parsed.draft;
    }

    if (isBrand(parsed)) {
      return parsed;
    }
  }

  if (isBrand(record)) {
    return record;
  }

  return null;
}

export default function AiBrandChat() {
  const router = useRouter();
  const nextMessageId = useRef(2);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      role: "assistant",
      content:
        "Cuentame que marca quieres crear. Puedes empezar con nombre, slug, colores, logos, tipografia o una descripcion general.",
    },
  ]);
  const [input, setInput] = useState("");
  const [draft, setDraft] = useState<Brand>(emptyBrand);
  const [generatedBrand, setGeneratedBrand] = useState<Brand | null>(null);
  const [showJson, setShowJson] = useState(false);
  const [showDebug, setShowDebug] = useState(false);
  const [debugData, setDebugData] = useState<{
    raw?: unknown;
    normalized?: WebhookResponse | null;
    brand?: Brand | null;
  }>({});
  const [sending, setSending] = useState(false);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");

  const canSend = input.trim().length > 0 && !sending;
  const canCreate = Boolean(generatedBrand) && !sending && !creating;

  function applyWebhookData(data: unknown) {
    const nextBrand = getGeneratedBrand(data);
    const normalized = normalizeWebhookResponse(data);

    if (!nextBrand) {
      setDebugData({ raw: data, normalized, brand: null });
      return;
    }

    const normalizedBrand: Brand = {
      ...emptyBrand,
      ...nextBrand,
      shortName: nextBrand.shortName?.trim() || nextBrand.name || "",
      logos: {
        light: nextBrand.logos?.light ?? nextBrand.logo ?? "",
        dark: nextBrand.logos?.dark ?? nextBrand.logo ?? "",
      },
      typography: {
        fontFamily: nextBrand.typography?.fontFamily ?? "",
        googleFontHref: nextBrand.typography?.googleFontHref ?? "",
      },
      primaryColor: nextBrand.primaryColor || "#111827",
      secondaryColor: nextBrand.secondaryColor || "#F8D74A",
      legalLinks: nextBrand.legalLinks ?? [],
      certifications: normalizeCertifications(nextBrand),
    };

    setGeneratedBrand(normalizedBrand);
    setDraft(normalizedBrand);
    setDebugData({ raw: data, normalized, brand: normalizedBrand });
  }

  async function sendMessage(text = input) {
    const trimmed = text.trim();

    if (!trimmed || sending) {
      return;
    }

    const userMessage: Message = {
      id: nextMessageId.current,
      role: "user",
      content: trimmed,
    };
    nextMessageId.current += 1;

    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    setInput("");
    setError("");
    setSending(true);

    try {
      const response = await fetch("/api/ai-brand-chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: trimmed,
          draft: generatedBrand ?? draft,
          programUrl:
            trimmed.match(/https?:\/\/[^\s)]+/i)?.[0] ??
            (generatedBrand as (Brand & { programUrl?: string }) | null)
              ?.programUrl ??
            "",
          history: nextMessages,
        }),
      });
      const contentType = response.headers.get("content-type") || "";
      const data = contentType.includes("application/json")
        ? await response.json()
        : await response.text();

      if (!response.ok) {
        throw new Error(getAssistantText(data) || "No se pudo enviar el mensaje");
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
          content: message,
        },
      ]);
      nextMessageId.current += 1;
    } finally {
      setSending(false);
    }
  }

  async function createBrand() {
    if (!generatedBrand || creating) {
      return;
    }

    try {
      setCreating(true);
      setError("");

      const response = await fetch("/api/brands", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(generatedBrand),
      });
      const data = await response.json();

      if (!response.ok || !data.ok) {
        throw new Error(data.error || "No se pudo crear la marca");
      }

      router.push(data.redirectTo || `/admin/brands/${generatedBrand.slug}/edit`);
      router.refresh();
    } catch (createError) {
      setError(
        createError instanceof Error
          ? createError.message
          : "No se pudo crear la marca"
      );
    } finally {
      setCreating(false);
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_420px]">
      <section className="flex min-h-[620px] flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950">
        <div className="border-b border-gray-200 p-5 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-black text-white dark:bg-[var(--bunji-primary)]">
              <Sparkles className="h-5 w-5" />
            </span>
            <div>
              <p className="text-sm text-gray-500 dark:text-slate-400">
                Nueva marca
              </p>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-slate-50">
                Crear marca con IA
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
              placeholder="Escribe la informacion de la marca..."
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

          {error ? (
            <p className="mt-3 text-sm text-red-600 dark:text-red-300">
              {error}
            </p>
          ) : null}
        </div>
      </section>

      <aside className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-slate-400">
              Borrador
            </p>
            <h3 className="mt-2 text-xl font-bold text-gray-900 dark:text-slate-50">
              Marca generada
            </h3>
          </div>

          <Building2 className="h-6 w-6 text-[var(--bunji-primary)] dark:text-[var(--bunji-primary-muted)]" />
        </div>

        <p className="mt-2 text-sm text-gray-600 dark:text-slate-300">
          {generatedBrand
            ? "IA ya organizo la informacion en el formato de marca del proyecto."
            : "El borrador se ira completando a medida que converses con IA."}
        </p>

        {generatedBrand ? (
          <div className="mt-5 space-y-4">
            <DraftField label="Nombre" value={generatedBrand.name} />
            <DraftField
              label="Nombre completo"
              value={generatedBrand.shortName || generatedBrand.name}
            />
            <DraftField label="Slug" value={generatedBrand.slug} />
            <DraftField
              label="Descripcion"
              value={generatedBrand.description || ""}
            />
            <DraftField
              label="Color primario"
              value={generatedBrand.primaryColor}
            />
            <DraftField
              label="Color secundario"
              value={generatedBrand.secondaryColor}
            />
            <DraftField
              label="Font family"
              value={generatedBrand.typography?.fontFamily || ""}
            />
            <DraftField
              label="Certificaciones"
              value={`${generatedBrand.certifications?.length ?? 0}`}
            />
          </div>
        ) : (
          <div className="mt-6 rounded-xl bg-gray-50 p-4 text-sm text-gray-600 dark:bg-slate-900 dark:text-slate-300">
            Cuando n8n responda con un objeto <strong>brand</strong> o{" "}
            <strong>draft</strong>, aparecera aqui para revisarlo y crearlo.
          </div>
        )}

        <div className="mt-5 space-y-3">
          <button
            type="button"
            onClick={createBrand}
            disabled={!canCreate}
            className="bunji-button-primary inline-flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-60"
          >
            <FilePlus2 className="h-4 w-4" />
            {creating ? "Creando marca..." : "Crear marca con este JSON"}
          </button>

          {generatedBrand ? (
            <button
              type="button"
              onClick={() => setShowJson((value) => !value)}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-gray-300 px-4 py-3 text-sm font-semibold text-gray-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
            >
              <Code2 className="h-4 w-4" />
              {showJson ? "Ocultar JSON" : "Ver JSON"}
            </button>
          ) : null}
        </div>

        {showJson && generatedBrand ? (
          <pre className="mt-4 max-h-80 overflow-auto rounded-xl bg-gray-950 p-4 text-xs leading-5 text-gray-100">
            {JSON.stringify(generatedBrand, null, 2)}
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
          href="/admin/brands/new"
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
