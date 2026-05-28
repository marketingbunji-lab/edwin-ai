"use client";

import { useState, type CSSProperties } from "react";
import {
  ArrowRight,
  CheckCircle2,
  Loader2,
  RotateCcw,
  SendHorizontal,
  Sparkles,
} from "lucide-react";
import type { Brand } from "@/lib/data";
import { getRandomEdwinAssistantMessage } from "@/lib/edwinAssistantMessages";

const defaultPrimaryColor = "#111827";
const defaultSecondaryColor = "#F8D74A";

type BrandAgentStep = "identity" | "visual";

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

type DetectedProgram = {
  parentCategory?: string;
  parentCategoryLabel?: string;
  slug?: string;
  titleFromSlug?: string;
  url?: string;
  lastmod?: string | null;
  seed?: {
    title?: string;
    fullTitle?: string;
    slug?: string;
    sourceWebsite?: string;
    programUrl?: string;
    template?: string;
    status?: string;
  };
};

type ProgramImportConfig = {
  language?: string;
  includeParentCategories?: string[];
  excludeParentCategories?: string[];
  overwriteExisting?: boolean;
};

type BrandAgentPayload = {
  brand?: Brand;
  brandUrl?: string;
  detectedPrograms?: DetectedProgram[];
  programsSummary?: {
    totalDetected?: number;
    importablePrograms?: number;
  };
  programImportConfig?: ProgramImportConfig;
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

function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function getBrandAgentPreview(data: unknown): Brand | null {
  const firstValue = Array.isArray(data) ? data[0] : data;

  if (!firstValue || typeof firstValue !== "object") {
    return null;
  }

  const record = firstValue as Record<string, unknown>;
  const nestedBrand =
    record.brand && typeof record.brand === "object" && !Array.isArray(record.brand)
      ? (record.brand as Record<string, unknown>)
      : null;
  const name =
    getCleanString(record.name) ||
    getCleanString(record.title) ||
    getCleanString(nestedBrand?.name) ||
    getCleanString(nestedBrand?.title);
  const shortName =
    getCleanString(record.shortName) ||
    getCleanString(record.site_name) ||
    getCleanString(record.siteName) ||
    getCleanString(nestedBrand?.shortName) ||
    getCleanString(nestedBrand?.siteName);
  const description =
    getCleanString(record.content) ||
    getCleanString(record.description) ||
    getCleanString(nestedBrand?.description) ||
    getCleanString(nestedBrand?.content);
  const abstract =
    getCleanString(record.abstract) ||
    getCleanString(nestedBrand?.abstract);
  const keywords = Array.isArray(record.keywords)
    ? record.keywords
        .map(getCleanString)
        .filter((keyword) => keyword.length > 0)
    : Array.isArray(nestedBrand?.keywords)
      ? nestedBrand.keywords
          .map(getCleanString)
          .filter((keyword) => keyword.length > 0)
      : [];
  const officialWebsite =
    getCleanString(record.official_website) ||
    getCleanString(record.officialWebsite) ||
    getCleanString(record.brandUrl) ||
    getCleanString(nestedBrand?.officialWebsite);
  const robots =
    getCleanString(record.robots) ||
    getCleanString(nestedBrand?.robots);
  const generator =
    getCleanString(record.generator) ||
    getCleanString(nestedBrand?.generator);
  const images = Array.isArray(record.images)
    ? record.images
        .map(getCleanString)
        .filter((image) => image.length > 0)
    : Array.isArray(nestedBrand?.images)
      ? nestedBrand.images
          .map(getCleanString)
          .filter((image) => image.length > 0)
      : [];
  const logo =
    getCleanString(record.logo) ||
    getCleanString(nestedBrand?.logo);
  const logosRecord =
    nestedBrand?.logos &&
    typeof nestedBrand.logos === "object" &&
    !Array.isArray(nestedBrand.logos)
      ? (nestedBrand.logos as Record<string, unknown>)
      : null;
  const logoLight =
    getCleanString(logosRecord?.light) ||
    logo;
  const logoDark =
    getCleanString(logosRecord?.dark) ||
    logo;
  const typographyRecord =
    nestedBrand?.typography &&
    typeof nestedBrand.typography === "object" &&
    !Array.isArray(nestedBrand.typography)
      ? (nestedBrand.typography as Record<string, unknown>)
      : null;
  const imageBrand =
    getCleanString(record.main_image) ||
    getCleanString(record.mainImage) ||
    getCleanString(nestedBrand?.imageBrand) ||
    logoLight ||
    logoDark;
  const slug =
    getCleanString(record.slug) ||
    getCleanString(nestedBrand?.slug) ||
    slugify(name || shortName);
  const primaryColor =
    getCleanString(record.primaryColor) ||
    getCleanString(nestedBrand?.primaryColor) ||
    defaultPrimaryColor;
  const secondaryColor =
    getCleanString(record.secondaryColor) ||
    getCleanString(nestedBrand?.secondaryColor) ||
    defaultSecondaryColor;

  if (!name && !shortName && !description && !officialWebsite && !imageBrand) {
    return null;
  }

  return {
    slug,
    name,
    shortName: shortName || name,
    logo,
    logos: {
      light: logoLight,
      dark: logoDark,
    },
    typography: {
      fontFamily: getCleanString(typographyRecord?.fontFamily),
      googleFontHref: getCleanString(typographyRecord?.googleFontHref),
    },
    primaryColor,
    secondaryColor,
    description,
    officialWebsite,
    siteName: shortName || name,
    abstract,
    keywords,
    robots,
    generator,
    images,
    imageBrand,
    legalLinks: officialWebsite
      ? [
          {
            label: "Sitio oficial",
            url: officialWebsite,
          },
        ]
      : [],
    certifications: [],
  };
}

function getBrandAgentPayload(data: unknown): BrandAgentPayload | null {
  const firstValue = Array.isArray(data) ? data[0] : data;

  if (!firstValue || typeof firstValue !== "object") {
    return null;
  }

  const record = firstValue as Record<string, unknown>;
  const previewBrand = getBrandAgentPreview(firstValue);
  const detectedPrograms = Array.isArray(record.detectedPrograms)
    ? (record.detectedPrograms as DetectedProgram[])
    : [];
  const rawImportConfig =
    record.programImportConfig &&
    typeof record.programImportConfig === "object" &&
    !Array.isArray(record.programImportConfig)
      ? (record.programImportConfig as Record<string, unknown>)
      : null;
  const rawSummary =
    record.programsSummary &&
    typeof record.programsSummary === "object" &&
    !Array.isArray(record.programsSummary)
      ? (record.programsSummary as Record<string, unknown>)
      : null;

  if (!previewBrand && detectedPrograms.length === 0 && !rawImportConfig) {
    return null;
  }

  return {
    brand: previewBrand ?? undefined,
    brandUrl: getCleanString(record.brandUrl),
    detectedPrograms,
    programsSummary: rawSummary
      ? {
          totalDetected:
            typeof rawSummary.totalDetected === "number"
              ? rawSummary.totalDetected
              : detectedPrograms.length,
          importablePrograms:
            typeof rawSummary.importablePrograms === "number"
              ? rawSummary.importablePrograms
              : detectedPrograms.length,
        }
      : {
          totalDetected: detectedPrograms.length,
          importablePrograms: detectedPrograms.length,
        },
    programImportConfig: rawImportConfig
      ? {
          language: getCleanString(rawImportConfig.language),
          includeParentCategories: Array.isArray(
            rawImportConfig.includeParentCategories,
          )
            ? rawImportConfig.includeParentCategories
                .map(getCleanString)
                .filter(Boolean)
            : [],
          excludeParentCategories: Array.isArray(
            rawImportConfig.excludeParentCategories,
          )
            ? rawImportConfig.excludeParentCategories
                .map(getCleanString)
                .filter(Boolean)
            : [],
          overwriteExisting: rawImportConfig.overwriteExisting === true,
        }
      : undefined,
  };
}

function getProgramTypeSummary(detectedPrograms: DetectedProgram[]) {
  const counts = new Map<string, number>();

  for (const program of detectedPrograms) {
    const label =
      getCleanString(program.parentCategoryLabel) ||
      getCleanString(program.parentCategory) ||
      "Programs";
    counts.set(label, (counts.get(label) || 0) + 1);
  }

  return Array.from(counts.entries()).map(([label, count]) => ({
    label,
    count,
  }));
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
  const [agentPreview, setAgentPreview] = useState<Brand | null>(null);
  const [agentPayload, setAgentPayload] = useState<BrandAgentPayload | null>(null);
  const [savedBrand, setSavedBrand] = useState<Brand | null>(null);
  const [assistantLoadingMessage, setAssistantLoadingMessage] = useState(() =>
    getRandomEdwinAssistantMessage("loading"),
  );
  const [startingAnalysis, setStartingAnalysis] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [currentStep, setCurrentStep] = useState<BrandAgentStep>("identity");
  const [brandManualUrl, setBrandManualUrl] = useState("");
  const [sendingManual, setSendingManual] = useState(false);

  const resetSearch = () => {
    setName("");
    setError("");
    setMessage("");
    setAgentPreview(null);
    setAgentPayload(null);
    setAnalysisComplete(false);
    setCurrentStep("identity");
  };

  const sendBrandPrompt = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedName = name.trim();

    if (!trimmedName) {
      setError("Escribe la URL del sitio web de la universidad o institucion.");
      return;
    }

    try {
      setSending(true);
      setError("");
      setMessage("");
      setAssistantLoadingMessage(getRandomEdwinAssistantMessage("loading"));

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

      console.log("[NewBrandQuickStart] /api/ai-brand-chat response", {
        status: response.status,
        contentType,
        data,
      });

      console.log("[NewBrandQuickStart] raw webhook payload", data);
      console.log(
        "[NewBrandQuickStart] raw webhook payload JSON",
        JSON.stringify(data, null, 2),
      );

      const preview = getBrandAgentPreview(data);
      const payload = getBrandAgentPayload(data);

      console.log("[NewBrandQuickStart] parsed brand agent preview", preview);
      console.log("[NewBrandQuickStart] parsed brand agent payload", payload);

      setAgentPreview(preview);
      setAgentPayload(payload);

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
    const brandData: Brand = agentPreview;

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

      const createdBrandSlug = data.slug || brandData.slug;
      const detectedPrograms = agentPayload?.detectedPrograms || [];

      if (detectedPrograms.length > 0) {
        const bootstrapResponse = await fetch(
          `/api/programs/${createdBrandSlug}/bootstrap`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              detectedPrograms,
              includeParentCategories:
                agentPayload?.programImportConfig?.includeParentCategories || [],
              excludeParentCategories:
                agentPayload?.programImportConfig?.excludeParentCategories || [],
              language: agentPayload?.programImportConfig?.language || "",
              overwriteExisting:
                agentPayload?.programImportConfig?.overwriteExisting === true,
            }),
          },
        );
        const bootstrapData = (await bootstrapResponse.json()) as {
          ok?: boolean;
          error?: string;
          summary?: {
            created?: number;
            skipped?: number;
          };
        };

        if (!bootstrapResponse.ok || !bootstrapData.ok) {
          throw new Error(
            bootstrapData.error ||
              "La marca fue creada, pero no se pudieron importar los programas detectados",
          );
        }

        setMessage(
          `Marca creada. Se importaron ${bootstrapData.summary?.created ?? 0} programas base${(bootstrapData.summary?.skipped ?? 0) > 0 ? ` y se omitieron ${bootstrapData.summary?.skipped ?? 0}` : ""}.`,
        );
      } else {
        setMessage("Marca creada correctamente.");
      }

      setAnalysisComplete(true);
      setCurrentStep("visual");
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
    const trimmedManualUrl = brandManualUrl.trim();

    if (!trimmedManualUrl || sendingManual || !savedBrand) {
      return;
    }

    try {
      setSendingManual(true);
      setError("");
      setMessage("");

      const updatedBrand: Brand = {
        ...savedBrand,
        identityManual: trimmedManualUrl,
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
          updateData.error || "No se pudo guardar el manual de identidad",
        );
      }

      const webhookResponse = await fetch("/api/brand-manual-ai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          brand: updatedBrand,
          identityManual: trimmedManualUrl,
          manualUrl: trimmedManualUrl,
          source: "brand-manual-step",
        }),
      });

      const contentType = webhookResponse.headers.get("content-type") || "";
      const webhookData = (contentType.includes("application/json")
        ? await webhookResponse.json()
        : await webhookResponse.text()) as
        | string
        | {
            ok?: boolean;
            error?: string;
            message?: string;
            reply?: string;
            response?: string;
            output?: string;
          };

      if (!webhookResponse.ok) {
        throw new Error(
          typeof webhookData === "string"
            ? webhookData
            : webhookData.error || "No se pudo enviar el manual al webhook",
        );
      }

      setSavedBrand(updatedBrand);
      setMessage(
        (typeof webhookData === "string"
          ? webhookData
          : webhookData.message ||
            webhookData.reply ||
            webhookData.response ||
            webhookData.output) || "Manual enviado correctamente.",
      );
    } catch (manualError) {
      setError(
        manualError instanceof Error
          ? manualError.message
          : "No se pudo enviar el manual",
      );
    } finally {
      setSendingManual(false);
    }
  };

  if (savedBrand) {
    return (
      <section className="grid min-h-[calc(100vh-9rem)] gap-6 xl:grid-cols-[minmax(0,2fr)_minmax(320px,1fr)]">
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
                  Agrega la URL del manual de identidad para analizar logos, colores, tipografias y lineamientos visuales.
                </span>
                <input
                  type="url"
                  value={brandManualUrl}
                  onChange={(event) => setBrandManualUrl(event.target.value)}
                  placeholder="https://..."
                  className="mt-5 block w-full rounded-md border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-black dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                />
              </label>

              <button
                type="button"
                onClick={sendBrandManual}
                disabled={!brandManualUrl.trim() || sendingManual}
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

        <BrandPreviewCard
          agentPreview={agentPreview}
          brand={savedBrand}
          detectedPrograms={agentPayload?.detectedPrograms || []}
          programsSummary={agentPayload?.programsSummary}
        />
      </section>
    );
  }

  return (
    <section className="grid min-h-[calc(100vh-9rem)] gap-6 xl:grid-cols-[minmax(0,2fr)_minmax(320px,1fr)]">
      <form
        onSubmit={sendBrandPrompt}
        className="relative flex min-h-[560px] flex-col justify-between overflow-hidden rounded-[28px] border border-[color-mix(in_srgb,var(--bunji-primary-soft)_70%,white)] bg-[radial-gradient(circle_at_12%_14%,rgba(125,227,234,0.16),transparent_32%),linear-gradient(145deg,rgba(255,255,255,0.99),rgba(241,244,255,0.97))] p-6 shadow-[0_24px_56px_rgba(62,57,137,0.12)] dark:border-white/10 dark:bg-[linear-gradient(145deg,rgba(15,23,42,0.88),rgba(15,23,42,0.74))] sm:p-8 lg:p-10"
      >
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.22),transparent_55%)] dark:bg-[linear-gradient(135deg,rgba(255,255,255,0.06),transparent_55%)]" />
        <div className="pointer-events-none absolute -right-12 top-10 h-28 w-28 rounded-full bg-[rgba(255,11,46,0.06)] blur-3xl" />
        <div className="pointer-events-none absolute left-6 top-6 h-16 w-16 rounded-full bg-[radial-gradient(circle,rgba(125,227,234,0.22),transparent_70%)] blur-2xl" />
        <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(125,227,234,0.9),transparent)] opacity-80" />

        <div className="relative">
          <div className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] border-[color-mix(in_srgb,var(--bunji-primary-soft)_68%,white)] bg-[var(--bunji-primary-light)] text-[var(--bunji-primary-dark)] dark:border-[var(--bunji-primary-muted)]/20 dark:bg-[var(--bunji-primary-soft)]/20 dark:text-[var(--bunji-primary-muted)]">
            <Sparkles className="h-4 w-4" />
            Nueva marca
          </div>

          <label className="block">
            <span className="block max-w-4xl text-4xl font-semibold leading-tight text-slate-950 dark:text-slate-50 sm:text-5xl lg:text-6xl">
              {agentPreview
                ? "¿Esta es tu universidad?"
                : "Vamos a configurar tu marca. ¿Cuál es el sitio web de tu institución?"}
            </span>

            {agentPreview ? (
              <span className="mt-10 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={createBrandFromPreview}
                  disabled={creating}
                  className="admin-button-primary px-5 disabled:cursor-not-allowed disabled:opacity-60"
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
                  className="admin-button-secondary admin-button-icon h-11 w-11 shrink-0 disabled:cursor-not-allowed disabled:opacity-60"
                  aria-label="Volver a buscar"
                  title="Volver a buscar"
                >
                  <RotateCcw className="h-4 w-4" />
                </button>
              </span>
            ) : (
              <span className="mt-10 flex items-center gap-4 border-b border-slate-300 transition focus-within:border-[var(--bunji-primary)] dark:border-slate-700">
                <input
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  autoFocus
                  placeholder="Ej. https://www.universidad.edu"
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

          <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600 dark:text-slate-300">
            {agentPreview
              ? "Confirma la institucion encontrada por el agente o vuelve a buscar con otro nombre."
              : "Con esta URL buscaremos la institucion y prepararemos su informacion base."}
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

      <BrandPreviewCard
        agentPreview={agentPreview}
        detectedPrograms={agentPayload?.detectedPrograms || []}
        programsSummary={agentPayload?.programsSummary}
        isLoading={sending}
        loadingMessage={assistantLoadingMessage}
      />
    </section>
  );
}

function BrandPreviewCard({
  agentPreview,
  brand,
  detectedPrograms = [],
  programsSummary,
  isLoading = false,
  loadingMessage = "",
}: {
  agentPreview: Brand | null;
  brand?: Brand | null;
  detectedPrograms?: DetectedProgram[];
  programsSummary?: BrandAgentPayload["programsSummary"];
  isLoading?: boolean;
  loadingMessage?: string;
}) {
  const description = brand?.description || agentPreview?.description || "";
  const previewLogo =
    brand?.logos?.light ||
    brand?.logo ||
    agentPreview?.logos?.light ||
    agentPreview?.logo ||
    "";
  const primaryColor = brand?.primaryColor || agentPreview?.primaryColor || "";
  const secondaryColor =
    brand?.secondaryColor || agentPreview?.secondaryColor || "";
  const previewPrimary = primaryColor || "#3e3989";
  const previewSecondary = secondaryColor || "#7de3ea";
  const previewAccent = "#ff0b2e";
  const previewGlowA = `${previewPrimary}26`;
  const previewGlowB = `${previewSecondary}30`;
  const previewGlowC = `${previewAccent}2e`;
  const programTypeSummary = getProgramTypeSummary(detectedPrograms);
  const totalPrograms =
    programsSummary?.importablePrograms ||
    programsSummary?.totalDetected ||
    detectedPrograms.length;
  const typePreview = programTypeSummary.slice(0, 3);

  return (
    <aside className="relative overflow-hidden rounded-[28px] border border-[color-mix(in_srgb,var(--bunji-cyan)_36%,white)] bg-[radial-gradient(circle_at_88%_10%,rgba(125,227,234,0.18),transparent_34%),linear-gradient(145deg,rgba(255,255,255,0.99),rgba(238,250,251,0.95))] p-6 text-slate-950 shadow-[0_24px_56px_rgba(125,227,234,0.14)]">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.22),transparent_55%)]" />
      <div className="pointer-events-none absolute -right-12 top-10 h-28 w-28 rounded-full bg-[rgba(255,11,46,0.06)] blur-3xl" />
      <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(125,227,234,0.9),transparent)] opacity-80" />
      <div className="flex h-full min-h-[360px] flex-col">
        <div className="relative">
          <p className="mb-5 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            Preview
          </p>
          <div className="mb-8 flex h-14 w-50 items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 p-2 text-slate-950">
            {previewLogo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={previewLogo}
                alt={brand?.name || agentPreview?.name || "Logo de la marca"}
                className="max-h-full w-full object-contain"
              />
            ) : (
              <span className="text-lg font-semibold text-slate-400">Logo</span>
            )}
          </div>
          <h2 className="mt-4 text-3xl font-semibold leading-tight">
            {agentPreview?.name ||
              "Aqui previsualizaras las caracteristicas de tu marca"}
          </h2>
          {!agentPreview ? (
            <p className="mt-4 text-sm leading-6 text-slate-500">
              Este panel ira tomando forma a medida que agregues informacion de
              identidad.
            </p>
          ) : null}
        </div>

        {agentPreview ? (
          <div className="mt-10 space-y-5">

            {description ? (
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Descripcion
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {description}
                </p>
              </div>
            ) : null}

            {detectedPrograms.length > 0 ? (
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Programas detectados
                </p>
                <div className="mt-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-3xl font-semibold text-slate-950">
                    {totalPrograms}
                  </p>
                  <p className="mt-1 text-sm text-slate-500">
                    programas encontrados para importar
                  </p>
                  {typePreview.length > 0 ? (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {typePreview.map((item) => (
                        <span
                          key={item.label}
                          className="inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-600"
                        >
                          {item.label}: {item.count}
                        </span>
                      ))}
                    </div>
                  ) : null}
                </div>
              </div>
            ) : null}

            {primaryColor || secondaryColor ? (
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Colores
                </p>
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  {primaryColor ? (
                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                      <div className="flex items-center gap-3">
                        <span
                          aria-hidden="true"
                          className="h-10 w-10 rounded-lg border border-slate-200"
                          style={{ backgroundColor: primaryColor }}
                        />
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                            Primario
                          </p>
                          <p className="mt-1 text-sm font-medium text-slate-700">
                            {primaryColor}
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : null}

                  {secondaryColor ? (
                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                      <div className="flex items-center gap-3">
                        <span
                          aria-hidden="true"
                          className="h-10 w-10 rounded-lg border border-slate-200"
                          style={{ backgroundColor: secondaryColor }}
                        />
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                            Secundario
                          </p>
                          <p className="mt-1 text-sm font-medium text-slate-700">
                            {secondaryColor}
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>
            ) : null}

            {agentPreview.officialWebsite ? (
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Sitio oficial
                </p>
                <a
                  href={agentPreview.officialWebsite}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-2 block truncate text-sm font-semibold text-[var(--bunji-primary)] underline-offset-4 hover:underline"
                >
                  {agentPreview.officialWebsite}
                </a>
              </div>
            ) : null}

            {agentPreview.slug ? (
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Slug
                </p>
                <p className="mt-2 truncate font-mono text-sm text-slate-600">
                  {agentPreview.slug}
                </p>
              </div>
            ) : null}
          </div>
        ) : null}
      </div>

      <div
        aria-hidden={!isLoading}
        className={`absolute inset-0 z-10 flex items-center justify-center overflow-hidden backdrop-blur-md transition-all duration-700 ease-out ${
          isLoading
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
        style={{
          background:
            "linear-gradient(145deg, rgba(255,255,255,0.84), rgba(248,250,252,0.9))",
        }}
      >
        <div
          className={`pointer-events-none absolute inset-0 z-0 rounded-[28px] transition-all duration-700 ${
            isLoading ? "opacity-100" : "opacity-0"
          }`}
        >
          <div
            className="absolute left-1/2 top-1/2 h-[185%] w-[185%] -translate-x-1/2 -translate-y-1/2 rounded-full p-[1.5px]"
            style={{
              background: `conic-gradient(from 0deg, ${previewSecondary}00 0deg, ${previewSecondary}aa 48deg, ${previewAccent}cc 98deg, ${previewPrimary}cc 160deg, ${previewPrimary}00 224deg, ${previewSecondary}cc 286deg, ${previewAccent}aa 326deg, ${previewSecondary}00 360deg)`,
              animation: isLoading
                ? "preview-rotating-halo 6s linear infinite"
                : undefined,
            }}
          >
            <div className="h-full w-full rounded-[999px] bg-transparent" />
          </div>
          <div
            className="absolute left-1/2 top-1/2 h-[165%] w-[165%] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
            style={{
              background: `conic-gradient(from 0deg, ${previewSecondary}00 0deg, ${previewSecondary}55 64deg, ${previewGlowC} 116deg, ${previewPrimary}88 172deg, ${previewPrimary}00 236deg, ${previewSecondary}66 300deg, ${previewGlowC} 336deg, ${previewPrimary}44 360deg)`,
              animation: isLoading
                ? "preview-rotating-halo 8s linear infinite reverse"
                : undefined,
            }}
          />
        </div>
        <div
          className={`pointer-events-none absolute inset-[1px] z-10 rounded-[26px] transition-all duration-700 ${
            isLoading ? "opacity-100" : "opacity-0"
          }`}
          style={{
            background: `linear-gradient(135deg, ${previewGlowA}, ${previewGlowC} 48%, ${previewGlowB})`,
            opacity: 0.34,
          }}
        />
        <div
          className={`pointer-events-none absolute -left-16 top-8 h-40 w-40 rounded-full blur-3xl transition-opacity duration-700 ${
            isLoading ? "opacity-100 animate-[pulse_5s_ease-in-out_infinite]" : "opacity-0"
          }`}
          style={{
            background: `radial-gradient(circle, ${previewGlowA} 0%, transparent 72%)`,
            animation: isLoading
              ? "preview-glow-drift-a 9s ease-in-out infinite"
              : undefined,
          }}
        />
        <div
          className={`pointer-events-none absolute -right-20 bottom-4 h-44 w-44 rounded-full blur-3xl transition-opacity duration-700 ${
            isLoading ? "opacity-100 animate-[pulse_6s_ease-in-out_infinite]" : "opacity-0"
          }`}
          style={{
            background: `radial-gradient(circle, ${previewGlowB} 0%, transparent 72%)`,
            animation: isLoading
              ? "preview-glow-drift-b 11s ease-in-out infinite"
              : undefined,
          }}
        />
        <div
          className={`pointer-events-none absolute inset-3 rounded-[22px] transition-all duration-700 ${
            isLoading ? "opacity-100" : "opacity-0"
          }`}
        />
        <div
          className={`relative z-20 transition-all duration-700 ease-out w-full h-full p-[4px] ${
            isLoading ? "scale-100 opacity-100" : "scale-100 opacity-0"
          }`}
        >
          <div className="p-[2px] flex flex-col items-center h-full justify-center rounded-[24px] bg-[#F5F7FE] backdrop-blur-xl">
            <div
              className="fingerprint-spinner"
              aria-hidden="true"
              style={
                {
                  "--spinner-primary": previewPrimary,
                  "--spinner-secondary": previewSecondary,
                  "--spinner-accent": previewAccent,
                } as CSSProperties
              }
            >
              {Array.from({ length: 9 }).map((_, index) => (
                <div key={index} className="spinner-ring" />
              ))}
            </div>
            <p className="mx-auto -mt-6 max-w-[260px] text-center text-sm font-semibold leading-6 text-slate-950">
              {loadingMessage}
            </p>
          </div>
        </div>
      </div>
      <style jsx>{`
        @keyframes preview-glow-drift-a {
          0%,
          100% {
            transform: translate3d(0, 0, 0) scale(1);
          }
          50% {
            transform: translate3d(52px, 24px, 0) scale(1.12);
          }
        }

        @keyframes preview-glow-drift-b {
          0%,
          100% {
            transform: translate3d(0, 0, 0) scale(1);
          }
          50% {
            transform: translate3d(-54px, -28px, 0) scale(1.16);
          }
        }

        @keyframes preview-rotating-halo {
          0% {
            transform: rotate(0deg) scale(1);
          }
          100% {
            transform: rotate(360deg) scale(1);
          }
        }

        .fingerprint-spinner,
        .fingerprint-spinner * {
          box-sizing: border-box;
        }

        .fingerprint-spinner {
          position: relative;
          height: 88px;
          width: 88px;
          padding: 4px;
          overflow: hidden;
          margin-bottom: 1.5rem;
          filter: drop-shadow(0 8px 24px ${previewGlowA});
        }

        .fingerprint-spinner .spinner-ring {
          position: absolute;
          inset: 0;
          margin: auto;
          border-radius: 999px;
          border: 2px solid transparent;
          animation: fingerprint-spinner-animation 1500ms
            cubic-bezier(0.68, -0.75, 0.265, 1.75) infinite forwards;
        }

        .fingerprint-spinner .spinner-ring:nth-child(3n + 1) {
          border-top-color: var(--spinner-primary);
          border-right-color: color-mix(in srgb, var(--spinner-primary) 54%, transparent);
        }

        .fingerprint-spinner .spinner-ring:nth-child(3n + 2) {
          border-top-color: var(--spinner-secondary);
          border-right-color: color-mix(in srgb, var(--spinner-secondary) 54%, transparent);
        }

        .fingerprint-spinner .spinner-ring:nth-child(3n) {
          border-top-color: var(--spinner-accent);
          border-right-color: color-mix(in srgb, var(--spinner-accent) 54%, transparent);
        }

        .fingerprint-spinner .spinner-ring:nth-child(1) {
          height: calc(76px / 9 + 0 * 76px / 9);
          width: calc(76px / 9 + 0 * 76px / 9);
          animation-delay: calc(50ms * 1);
        }

        .fingerprint-spinner .spinner-ring:nth-child(2) {
          height: calc(76px / 9 + 1 * 76px / 9);
          width: calc(76px / 9 + 1 * 76px / 9);
          animation-delay: calc(50ms * 2);
        }

        .fingerprint-spinner .spinner-ring:nth-child(3) {
          height: calc(76px / 9 + 2 * 76px / 9);
          width: calc(76px / 9 + 2 * 76px / 9);
          animation-delay: calc(50ms * 3);
        }

        .fingerprint-spinner .spinner-ring:nth-child(4) {
          height: calc(76px / 9 + 3 * 76px / 9);
          width: calc(76px / 9 + 3 * 76px / 9);
          animation-delay: calc(50ms * 4);
        }

        .fingerprint-spinner .spinner-ring:nth-child(5) {
          height: calc(76px / 9 + 4 * 76px / 9);
          width: calc(76px / 9 + 4 * 76px / 9);
          animation-delay: calc(50ms * 5);
        }

        .fingerprint-spinner .spinner-ring:nth-child(6) {
          height: calc(76px / 9 + 5 * 76px / 9);
          width: calc(76px / 9 + 5 * 76px / 9);
          animation-delay: calc(50ms * 6);
        }

        .fingerprint-spinner .spinner-ring:nth-child(7) {
          height: calc(76px / 9 + 6 * 76px / 9);
          width: calc(76px / 9 + 6 * 76px / 9);
          animation-delay: calc(50ms * 7);
        }

        .fingerprint-spinner .spinner-ring:nth-child(8) {
          height: calc(76px / 9 + 7 * 76px / 9);
          width: calc(76px / 9 + 7 * 76px / 9);
          animation-delay: calc(50ms * 8);
        }

        .fingerprint-spinner .spinner-ring:nth-child(9) {
          height: calc(76px / 9 + 8 * 76px / 9);
          width: calc(76px / 9 + 8 * 76px / 9);
          animation-delay: calc(50ms * 9);
        }

        @keyframes fingerprint-spinner-animation {
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </aside>
  );
}
