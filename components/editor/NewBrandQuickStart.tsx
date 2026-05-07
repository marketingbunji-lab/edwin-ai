"use client";

import { useState } from "react";
import {
  ArrowRight,
  Building2,
  CheckCircle2,
  Loader2,
  RotateCcw,
  SendHorizontal,
  Sparkles,
} from "lucide-react";
import type { Brand } from "@/lib/data";

const defaultPrimaryColor = "#111827";
const defaultSecondaryColor = "#F8D74A";

type BrandAgentPreview = {
  title: string;
  content: string;
  officialWebsite: string;
  slug: string;
};

type BrandAgentStep = "identity" | "content" | "visual";

type GeneralContentAnalysis = {
  title: string;
  siteName: string;
  description: string;
  abstract: string;
  keywords: string[];
  officialWebsite: string;
  robots: string;
  generator: string;
  images: string[];
  mainImage: string;
};

function isN8nExpression(value: string) {
  return value.trim().startsWith("={{") || value.includes("$json.");
}

function getCleanString(value: unknown) {
  if (typeof value !== "string") {
    return "";
  }

  const trimmedValue = value.trim();

  if (!trimmedValue || isN8nExpression(trimmedValue)) {
    return "";
  }

  return trimmedValue;
}

function getBrandAgentPreview(data: unknown): BrandAgentPreview | null {
  const firstValue = Array.isArray(data) ? data[0] : data;

  if (!firstValue || typeof firstValue !== "object") {
    return null;
  }

  const record = firstValue as Record<string, unknown>;
  const title = getCleanString(record.title);
  const content = getCleanString(record.content);
  const officialWebsite = getCleanString(record.official_website);
  const slug = getCleanString(record.slug);

  if (!title && !content && !officialWebsite && !slug) {
    return null;
  }

  return {
    title,
    content,
    officialWebsite,
    slug,
  };
}

function getGeneralContentAnalysis(data: unknown): GeneralContentAnalysis | null {
  const firstValue = Array.isArray(data) ? data[0] : data;

  if (!firstValue || typeof firstValue !== "object") {
    return null;
  }

  const record = firstValue as Record<string, unknown>;
  const images = Array.isArray(record.images)
    ? record.images
        .map(getCleanString)
        .filter((image) => image.length > 0)
    : [];
  const mainImage = getCleanString(record.main_image);
  const title = getCleanString(record.title);
  const siteName = getCleanString(record.site_name);
  const description = getCleanString(record.description);
  const abstract = getCleanString(record.abstract);
  const keywords = Array.isArray(record.keywords)
    ? record.keywords
        .map(getCleanString)
        .filter((keyword) => keyword.length > 0)
    : [];
  const officialWebsite = getCleanString(record.official_website);
  const robots = getCleanString(record.robots);
  const generator = getCleanString(record.generator);

  if (
    !title &&
    !siteName &&
    !description &&
    !abstract &&
    !officialWebsite &&
    !mainImage &&
    images.length === 0
  ) {
    return null;
  }

  return {
    title,
    siteName,
    description,
    abstract,
    keywords,
    officialWebsite,
    robots,
    generator,
    images,
    mainImage,
  };
}

export default function NewBrandQuickStart() {
  const [name, setName] = useState("");
  const [sending, setSending] = useState(false);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [agentPreview, setAgentPreview] = useState<BrandAgentPreview | null>(
    null,
  );
  const [savedBrand, setSavedBrand] = useState<Brand | null>(null);
  const [startingAnalysis, setStartingAnalysis] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [currentStep, setCurrentStep] = useState<BrandAgentStep>("identity");
  const [brandManual, setBrandManual] = useState<File | null>(null);
  const [sendingManual, setSendingManual] = useState(false);

  const resetSearch = () => {
    setName("");
    setError("");
    setMessage("");
    setAgentPreview(null);
    setAnalysisComplete(false);
    setCurrentStep("identity");
  };

  const sendBrandPrompt = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedName = name.trim();

    if (!trimmedName) {
      setError("Escribe el nombre de la universidad o institucion.");
      return;
    }

    try {
      setSending(true);
      setError("");
      setMessage("");

      const response = await fetch("/api/ai-brand-chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: trimmedName,
          brandName: trimmedName,
          source: "new-brand-quick-start",
        }),
      });
      const contentType = response.headers.get("content-type") || "";
      const data = (contentType.includes("application/json")
        ? await response.json()
        : await response.text()) as
        | string
        | {
        ok?: boolean;
        error?: string;
        message?: string;
        reply?: string;
        response?: string;
        output?: string;
      };

      if (!response.ok) {
        throw new Error(
          typeof data === "string"
            ? data
            : data.error || "No se pudo enviar el mensaje",
        );
      }

      const preview = getBrandAgentPreview(data);

      if (preview) {
        setAgentPreview(preview);
      }

      setMessage(
        preview
          ? "Informacion recibida del agente de marca."
          : (typeof data === "string"
          ? data
          : data.reply || data.message || data.response || data.output) ||
              "Mensaje enviado al agente de marca.",
      );
    } catch (sendError) {
      setError(
        sendError instanceof Error
          ? sendError.message
          : "No se pudo enviar el mensaje",
      );
    } finally {
      setSending(false);
    }
  };

  const createBrandFromPreview = async () => {
    if (!agentPreview || creating) {
      return;
    }

    if (!agentPreview.slug) {
      setError("El agente no devolvio un slug para crear la marca.");
      return;
    }

    const brandData: Brand = {
      slug: agentPreview.slug,
      name: agentPreview.title,
      shortName: agentPreview.title,
      logo: "",
      logos: {
        light: "",
        dark: "",
      },
      typography: {
        fontFamily: "",
        googleFontHref: "",
      },
      primaryColor: defaultPrimaryColor,
      secondaryColor: defaultSecondaryColor,
      description: agentPreview.content,
      officialWebsite: agentPreview.officialWebsite,
      legalLinks: agentPreview.officialWebsite
        ? [
            {
              label: "Sitio oficial",
              url: agentPreview.officialWebsite,
            },
          ]
        : [],
      certifications: [],
    };

    try {
      setCreating(true);
      setError("");
      setMessage("");

      const response = await fetch("/api/brands", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(brandData),
      });
      const data = (await response.json()) as {
        ok?: boolean;
        error?: string;
        slug?: string;
      };

      if (!response.ok || !data.ok) {
        throw new Error(data.error || "No se pudo crear la marca");
      }

      setSavedBrand({
        ...brandData,
        slug: data.slug || brandData.slug,
      });
      setCurrentStep("content");
    } catch (createError) {
      setError(
        createError instanceof Error
          ? createError.message
          : "No se pudo crear la marca",
      );
    } finally {
      setCreating(false);
    }
  };

  const startWebsiteAnalysis = async () => {
    if (!savedBrand || startingAnalysis) {
      return;
    }

    try {
      setStartingAnalysis(true);
      setError("");
      setMessage("");

      const response = await fetch("/api/general-content-ai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          brand: savedBrand,
          university: {
            title: savedBrand.name,
            content: savedBrand.description || "",
            official_website: savedBrand.officialWebsite || "",
            slug: savedBrand.slug,
          },
          source: "brand-agent-content-step",
        }),
      });
      const contentType = response.headers.get("content-type") || "";
      const data = (contentType.includes("application/json")
        ? await response.json()
        : await response.text()) as
        | string
        | {
            ok?: boolean;
            error?: string;
            message?: string;
            reply?: string;
            response?: string;
            output?: string;
          };

      console.log("General content AI response", data);

      if (!response.ok) {
        throw new Error(
          typeof data === "string"
            ? data
            : data.error || "No se pudo iniciar el analisis",
        );
      }

      const analysis = getGeneralContentAnalysis(data);

      if (analysis) {
        const updatedBrand: Brand = {
          ...savedBrand,
          name: analysis.title || savedBrand.name,
          shortName: analysis.siteName || analysis.title || savedBrand.shortName,
          description:
            analysis.description || analysis.abstract || savedBrand.description,
          officialWebsite:
            analysis.officialWebsite || savedBrand.officialWebsite,
          siteName: analysis.siteName,
          abstract: analysis.abstract,
          keywords: analysis.keywords,
          robots: analysis.robots,
          generator: analysis.generator,
          images: analysis.images,
          imageBrand: analysis.mainImage || analysis.images[0] || "",
        };

        const updateResponse = await fetch(`/api/brands/${savedBrand.slug}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedBrand),
        });
        const updateData = (await updateResponse.json()) as {
          ok?: boolean;
          error?: string;
        };

        if (!updateResponse.ok || !updateData.ok) {
          throw new Error(
            updateData.error || "No se pudo actualizar la marca con el analisis",
          );
        }

        setSavedBrand(updatedBrand);
        setAnalysisComplete(true);
      }

      setMessage(
        analysis
          ? "Analisis completado y datos de la marca actualizados."
          : (typeof data === "string"
          ? data
          : data.message || data.reply || data.response || data.output) ||
              "Analisis del sitio web iniciado.",
      );
    } catch (analysisError) {
      setError(
        analysisError instanceof Error
          ? analysisError.message
          : "No se pudo iniciar el analisis",
      );
    } finally {
      setStartingAnalysis(false);
    }
  };

  const sendBrandManual = async () => {
    if (!brandManual || sendingManual) {
      return;
    }

    setSendingManual(true);
    setMessage(`Manual "${brandManual.name}" listo para enviar.`);
    setSendingManual(false);
  };

  if (savedBrand) {
    return (
      <section className="grid min-h-[calc(100vh-9rem)] gap-6 xl:grid-cols-[260px_minmax(0,2fr)_minmax(320px,1fr)]">
        <BrandAgentProgress currentStep={currentStep} />

        <div className="border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950 sm:p-8 lg:p-10">
          <div className="mb-10 inline-flex items-center gap-2 border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-950/30 dark:text-emerald-300">
            <CheckCircle2 className="h-4 w-4" />
            Marca creada
          </div>

          <h1 className="max-w-4xl text-4xl font-semibold leading-tight text-slate-950 dark:text-slate-50 sm:text-5xl lg:text-6xl">
            {currentStep === "visual"
              ? "vamos a configurar tu identidad grafica"
              : "Vamos a revisar el sitio web de tu Universidad para tener mas contexto"}
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-7 text-slate-500 dark:text-slate-400">
            {currentStep === "visual"
              ? "Carga el manual de identidad grafica de la universidad en formato PDF para analizar logos, colores, tipografias y lineamientos visuales."
              : "Usaremos el sitio oficial para entender mejor su contenido, estructura, tono institucional y datos clave antes de seguir."}
          </p>

          {currentStep === "visual" ? (
            <div className="mt-10 max-w-2xl">
              <label className="block border border-dashed border-slate-300 bg-slate-50 p-6 dark:border-slate-700 dark:bg-slate-900">
                <span className="block text-sm font-semibold text-slate-950 dark:text-slate-50">
                  Manual de identidad grafica
                </span>
                <span className="mt-2 block text-sm leading-6 text-slate-500 dark:text-slate-400">
                  Sube un archivo PDF con los lineamientos de marca.
                </span>
                <input
                  type="file"
                  accept="application/pdf,.pdf"
                  onChange={(event) =>
                    setBrandManual(event.target.files?.[0] ?? null)
                  }
                  className="mt-5 block w-full text-sm text-slate-600 file:mr-4 file:border-0 file:bg-slate-950 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white dark:text-slate-300 dark:file:bg-[var(--bunji-primary)]"
                />
                {brandManual ? (
                  <span className="mt-3 block text-sm font-medium text-slate-700 dark:text-slate-200">
                    {brandManual.name}
                  </span>
                ) : null}
              </label>

              <button
                type="button"
                onClick={sendBrandManual}
                disabled={!brandManual || sendingManual}
                className="mt-5 inline-flex items-center gap-2 bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-[var(--bunji-primary)] disabled:cursor-not-allowed disabled:opacity-60 dark:bg-[var(--bunji-primary)]"
              >
                {sendingManual ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <ArrowRight className="h-4 w-4" />
                )}
                {sendingManual ? "Enviando..." : "Enviar manual"}
              </button>
            </div>
          ) : (
            <div className="mt-10 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={startWebsiteAnalysis}
                disabled={startingAnalysis}
                className="inline-flex items-center gap-2 bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-[var(--bunji-primary)] dark:bg-[var(--bunji-primary)]"
              >
                {startingAnalysis ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <ArrowRight className="h-4 w-4" />
                )}
                {startingAnalysis ? "Analizando..." : "Iniciar analisis"}
              </button>
            </div>
          )}

          {message ? (
            <p className="mt-5 text-sm font-medium text-emerald-600 dark:text-emerald-300">
              {message}
            </p>
          ) : null}

          {analysisComplete && currentStep !== "visual" ? (
            <button
              type="button"
              onClick={() => setCurrentStep("visual")}
              className="mt-6 inline-flex items-center gap-2 bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-[var(--bunji-primary)] dark:bg-[var(--bunji-primary)]"
            >
              Continuar
              <ArrowRight className="h-4 w-4" />
            </button>
          ) : null}
        </div>

        <BrandPreviewCard agentPreview={agentPreview} brand={savedBrand} />
      </section>
    );
  }

  return (
    <section className="grid min-h-[calc(100vh-9rem)] gap-6 xl:grid-cols-[260px_minmax(0,2fr)_minmax(320px,1fr)]">
      <BrandAgentProgress currentStep="identity" />

      <form
        onSubmit={sendBrandPrompt}
        className="flex min-h-[560px] flex-col justify-between border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950 sm:p-8 lg:p-10"
      >
        <div>
          <div className="mb-10 inline-flex items-center gap-2 border border-[var(--bunji-primary-soft)] bg-[var(--bunji-primary-light)] px-3 py-2 text-sm font-semibold text-[var(--bunji-primary)] dark:border-[var(--bunji-primary-muted)]/30 dark:bg-[var(--bunji-primary-soft)]/30 dark:text-[var(--bunji-primary-muted)]">
            <Sparkles className="h-4 w-4" />
            Nueva marca
          </div>

          <label className="block">
            <span className="block max-w-4xl text-4xl font-semibold leading-tight text-slate-950 dark:text-slate-50 sm:text-5xl lg:text-6xl">
              {agentPreview
                ? "¿Esta es tu universidad?"
                : "Cual es el nombre de tu universidad o institucion?"}
            </span>

            {agentPreview ? (
              <span className="mt-10 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={createBrandFromPreview}
                  disabled={creating}
                  className="inline-flex items-center gap-2 bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-[var(--bunji-primary)] disabled:cursor-not-allowed disabled:opacity-60 dark:bg-[var(--bunji-primary)] dark:hover:bg-[var(--bunji-primary-dark)]"
                >
                  {creating ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <CheckCircle2 className="h-4 w-4" />
                  )}
                  {creating ? "Guardando..." : "Continuemos"}
                </button>
                <button
                  type="button"
                  onClick={resetSearch}
                  disabled={creating}
                  className="inline-flex items-center gap-2 border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                >
                  <RotateCcw className="h-4 w-4" />
                  Volver a buscar
                </button>
              </span>
            ) : (
              <span className="mt-10 flex items-center gap-4 border-b border-slate-300 transition focus-within:border-[var(--bunji-primary)] dark:border-slate-700">
                <input
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  autoFocus
                  placeholder="Ej. Universidad EDwin"
                  className="min-w-0 flex-1 border-0 bg-transparent px-0 py-5 text-3xl font-semibold text-slate-950 outline-none placeholder:text-slate-300 dark:text-slate-50 dark:placeholder:text-slate-700 sm:text-4xl"
                />
              <button
                type="submit"
                disabled={sending}
                className="mb-3 inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-slate-950 text-white shadow-lg transition hover:bg-[var(--bunji-primary)] disabled:cursor-not-allowed disabled:opacity-60 dark:bg-[var(--bunji-primary)] dark:hover:bg-[var(--bunji-primary-dark)]"
                aria-label="Enviar mensaje al agente de marca"
              >
                {sending ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <SendHorizontal className="h-5 w-5" />
                )}
              </button>
            </span>
            )}
          </label>

          <p className="mt-5 max-w-2xl text-base leading-7 text-slate-500 dark:text-slate-400">
            {agentPreview
              ? "Confirma la institucion encontrada por el agente o vuelve a buscar con otro nombre."
              : "Con este primer dato buscaremos la institucion y prepararemos su informacion base."}
          </p>

          {error ? (
            <p className="mt-5 text-sm font-medium text-red-600 dark:text-red-300">
              {error}
            </p>
          ) : null}

          {message ? (
            <p className="mt-5 max-w-2xl text-sm font-medium text-emerald-600 dark:text-emerald-300">
              {message}
            </p>
          ) : null}
        </div>

        <div />
      </form>

      <BrandPreviewCard agentPreview={agentPreview} />
    </section>
  );
}

function BrandAgentProgress({
  currentStep,
}: {
  currentStep: BrandAgentStep;
}) {
  const steps: Array<{
    id: BrandAgentStep;
    label: string;
    description: string;
  }> = [
    {
      id: "identity",
      label: "Quien eres",
      description: "Encuentra y confirma la institucion.",
    },
    {
      id: "content",
      label: "Contenido General",
      description: "Completa la informacion base de la universidad.",
    },
    {
      id: "visual",
      label: "Identidad grafica",
      description: "Define logos, colores y estilo visual.",
    },
  ];
  const currentIndex = steps.findIndex((step) => step.id === currentStep);

  return (
    <aside className="border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950 xl:sticky xl:top-6 xl:h-[calc(100vh-3rem)]">
      <div className="flex h-full flex-col">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--bunji-primary)] dark:text-[var(--bunji-primary-muted)]">
            Progreso
          </p>
          <h2 className="mt-3 text-2xl font-semibold text-slate-950 dark:text-slate-50">
            Brand Agent
          </h2>
        </div>

        <div className="mt-8 flex-1">
          <ol className="relative space-y-7">
            <span className="absolute left-[11px] top-3 h-[calc(100%-1.5rem)] w-px bg-slate-200 dark:bg-slate-800" />

            {steps.map((step, index) => {
              const isActive = step.id === currentStep;
              const isComplete = index < currentIndex;

              return (
                <li key={step.id} className="relative flex gap-4">
                  <span
                    className={`relative z-10 mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border ${
                      isComplete
                        ? "border-[var(--bunji-primary)] bg-[var(--bunji-primary)] text-white"
                        : isActive
                          ? "border-[var(--bunji-primary)] bg-white text-[var(--bunji-primary)] dark:bg-slate-950 dark:text-[var(--bunji-primary-muted)]"
                          : "border-slate-300 bg-white text-slate-400 dark:border-slate-700 dark:bg-slate-950"
                    }`}
                  >
                    {isComplete ? (
                      <CheckCircle2 className="h-4 w-4" />
                    ) : (
                      <span className="h-2 w-2 rounded-full bg-current" />
                    )}
                  </span>

                  <div>
                    <p
                      className={`text-sm font-semibold ${
                        isActive
                          ? "text-slate-950 dark:text-slate-50"
                          : "text-slate-500 dark:text-slate-400"
                      }`}
                    >
                      {step.label}
                    </p>
                    <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-500">
                      {step.description}
                    </p>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </aside>
  );
}

function BrandPreviewCard({
  agentPreview,
  brand,
}: {
  agentPreview: BrandAgentPreview | null;
  brand?: Brand | null;
}) {
  const description = brand?.description || agentPreview?.content || "";

  return (
    <aside className="border border-slate-800 bg-slate-950 p-6 text-white shadow-sm">
      <div className="flex h-full min-h-[360px] flex-col">
        <div>
          <div className="mb-8 flex h-14 w-14 items-center justify-center bg-white/10 text-white">
            <Building2 className="h-7 w-7" />
          </div>

          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-white/50">
            Preview
          </p>
          <h2 className="mt-4 text-3xl font-semibold leading-tight">
            {agentPreview?.title ||
              "Aqui previsualizaras las caracteristicas de tu marca"}
          </h2>
          {!agentPreview ? (
            <p className="mt-4 text-sm leading-6 text-white/60">
              Este panel ira tomando forma a medida que agregues informacion de
              identidad.
            </p>
          ) : null}
        </div>

        {agentPreview ? (
          <div className="mt-10 space-y-5">
            {brand?.imageBrand ? (
              <div className="overflow-hidden border border-white/10 bg-white/[0.04]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={brand.imageBrand}
                  alt={brand.name}
                  className="h-40 w-full object-cover"
                />
              </div>
            ) : null}

            {description ? (
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/40">
                  Descripcion
                </p>
                <p className="mt-2 text-sm leading-6 text-white/75">
                  {description}
                </p>
              </div>
            ) : null}

            {agentPreview.officialWebsite ? (
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/40">
                  Sitio oficial
                </p>
                <a
                  href={agentPreview.officialWebsite}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-2 block truncate text-sm font-semibold text-[var(--bunji-primary-muted)] underline-offset-4 hover:underline"
                >
                  {agentPreview.officialWebsite}
                </a>
              </div>
            ) : null}

            {agentPreview.slug ? (
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/40">
                  Slug
                </p>
                <p className="mt-2 truncate font-mono text-sm text-white/70">
                  {agentPreview.slug}
                </p>
              </div>
            ) : null}
          </div>
        ) : null}
      </div>
    </aside>
  );
}
