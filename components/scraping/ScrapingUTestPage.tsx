"use client";

import { FormEvent, useState } from "react";
import { Loader2, Send, Sparkles } from "lucide-react";

type PreviewState = {
  ok?: boolean;
  status?: number;
  webhookUrl?: string;
  data?: unknown;
  message?: string;
  error?: string;
};

export default function ScrapingUTestPage() {
  const [url, setUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [preview, setPreview] = useState<PreviewState | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedUrl = url.trim();

    if (!trimmedUrl) {
      setPreview({
        ok: false,
        message: "Ingresa una URL para ejecutar la prueba.",
      });
      return;
    }

    setIsSubmitting(true);
    setPreview({
      ok: true,
      message: "Enviando URL al webhook scraping-u...",
    });

    try {
      const response = await fetch("/api/scraping-u", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url: trimmedUrl }),
      });

      const data = (await response.json()) as PreviewState;
      setPreview(data);
    } catch (error) {
      setPreview({
        ok: false,
        message: "No se pudo ejecutar la prueba.",
        error: error instanceof Error ? error.message : "Error desconocido",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="admin-page">
      <div className="admin-page-inner max-w-7xl">
        <section className="admin-panel overflow-hidden p-6 sm:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-[var(--bunji-cyan)]/40 bg-[var(--bunji-cyan-soft)] px-3 py-2 text-sm font-semibold text-[var(--bunji-primary)] dark:text-[var(--bunji-cyan)]">
                <Sparkles className="h-4 w-4" />
                Flow test
              </div>
              <h1 className="mt-5 text-4xl font-semibold tracking-tight text-slate-950 dark:text-slate-50 sm:text-5xl">
                scraping-u
              </h1>
              <p className="admin-muted mt-4 max-w-2xl text-base leading-7">
                Envía una URL al webhook de prueba y revisa aquí mismo la
                respuesta que devuelve n8n.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white/70 px-4 py-3 text-sm text-slate-600 shadow-[0_10px_22px_rgba(15,23,42,0.05)] dark:border-slate-800 dark:bg-white/[0.04] dark:text-slate-300">
              <span className="font-semibold text-slate-900 dark:text-slate-100">
                POST
              </span>{" "}
              /webhook-test/scraping-u
            </div>
          </div>
        </section>

        <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,0.95fr)_minmax(380px,0.8fr)]">
          <section className="admin-panel p-6 sm:p-8">
            <p className="admin-eyebrow">Entrada</p>
            <h2 className="mt-3 text-2xl font-semibold text-slate-950 dark:text-slate-50">
              URL para probar el flow
            </h2>
            <p className="admin-muted mt-2">
              Este formulario solo envía el valor del input como{" "}
              <span className="font-mono text-xs">{"{ url }"}</span>.
            </p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <label className="block">
                <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                  URL del sitio
                </span>
                <input
                  value={url}
                  onChange={(event) => setUrl(event.target.value)}
                  className="admin-input mt-2"
                  placeholder="https://universidad.edu/"
                  type="url"
                />
              </label>

              <button
                type="submit"
                className="admin-button-primary px-5 disabled:cursor-not-allowed disabled:opacity-60"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
                {isSubmitting ? "Enviando..." : "Enviar al webhook"}
              </button>
            </form>
          </section>

          <aside className="admin-panel-soft overflow-hidden p-6 sm:p-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="admin-eyebrow">Preview</p>
                <h2 className="mt-3 text-2xl font-semibold text-slate-950 dark:text-slate-50">
                  Respuesta del webhook
                </h2>
              </div>

              {preview ? (
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    preview.ok
                      ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-300"
                      : "bg-red-500/10 text-red-600 dark:text-red-300"
                  }`}
                >
                  {preview.ok ? "OK" : "Error"}
                </span>
              ) : null}
            </div>

            <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-950 p-4 text-slate-100 shadow-[0_18px_44px_rgba(15,23,42,0.16)] dark:border-slate-800">
              <pre className="max-h-[520px] overflow-auto whitespace-pre-wrap break-words text-xs leading-6">
                {preview
                  ? JSON.stringify(preview, null, 2)
                  : JSON.stringify(
                      {
                        estado: "Esperando una prueba",
                        ejemplo: {
                          url: "https://universidad.edu/",
                        },
                      },
                      null,
                      2,
                    )}
              </pre>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
