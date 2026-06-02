"use client";

import { useRef, useState, type CSSProperties, type RefObject } from "react";
import {
  AlertCircle,
  Bot,
  CheckCircle2,
  FileText,
  Link2,
  Save,
  Sparkles,
  UploadCloud,
} from "lucide-react";
import type { Brand } from "@/lib/data";
import type { UniversityInstitutionalProfile } from "@/lib/universityProfiles";

type SourceMode = "file" | "link";

type Props = {
  brand: Brand;
};

export default function UniversityProfileNewWorkspace({ brand }: Props) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [sourceMode, setSourceMode] = useState<SourceMode>("file");
  const [fileName, setFileName] = useState("");
  const [documentLink, setDocumentLink] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [generating, setGenerating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<UniversityInstitutionalProfile | null>(
    null,
  );

  const handleFileSelection = (files: FileList | null) => {
    const file = files?.[0];

    if (!file) {
      return;
    }

    setFileName(file.name);
    setErrorMessage("");
    setStatusMessage(
      "Documento seleccionado. Por ahora el agente usara los datos de marca y links publicos; la lectura del PDF la conectamos en el siguiente paso.",
    );
  };

  const handleGenerate = async () => {
    try {
      setGenerating(true);
      setStatusMessage("EDwin esta investigando la universidad...");
      setErrorMessage("");

      const response = await fetch("/api/university-profile-ai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          brand,
          officialWebsite: brand.officialWebsite,
          researchUrls:
            sourceMode === "link" && documentLink.trim()
              ? [documentLink.trim()]
              : [],
        }),
      });
      const data = (await response.json()) as UniversityProfileAgentResponse;
      const generatedProfile = extractUniversityProfile(data);

      console.log("[UniversityProfileNewWorkspace] agent response", data);

      if (!response.ok || !generatedProfile) {
        throw new Error(
          data.error ||
            data.message ||
            "El agente no devolvio un perfil institucional valido.",
        );
      }

      setProfile(generatedProfile);
      setStatusMessage("Perfil institucional generado. Revisa el preview y guardalo.");
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "No se pudo ejecutar el agente institucional.",
      );
      setStatusMessage("");
    } finally {
      setGenerating(false);
    }
  };

  const handleSave = async () => {
    if (!profile) {
      setErrorMessage("Primero genera un perfil institucional con el agente.");
      return;
    }

    try {
      setSaving(true);
      setErrorMessage("");
      setStatusMessage("Guardando University Content Base...");

      const response = await fetch(`/api/university-profiles/${brand.slug}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ profile }),
      });
      const data = (await response.json()) as {
        ok?: boolean;
        error?: string;
        profile?: UniversityInstitutionalProfile;
      };

      if (!response.ok || !data.ok || !data.profile) {
        throw new Error(
          data.error || "No se pudo guardar el perfil institucional.",
        );
      }

      setProfile(data.profile);
      setStatusMessage("University Content Base guardado correctamente.");
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "No se pudo guardar el perfil institucional.",
      );
      setStatusMessage("");
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="grid gap-6 xl:grid-cols-[minmax(0,1.35fr)_minmax(320px,0.65fr)]">
      <div className="admin-panel p-6">
        {profile ? (
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-emerald-400/30 bg-emerald-500/10 p-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-emerald-700 dark:text-emerald-300">
              <CheckCircle2 className="h-4 w-4" />
              Perfil generado y listo para guardar.
            </div>
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="admin-button-primary px-5 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Save className="h-4 w-4" />
              {saving ? "Guardando..." : "Guardar University Content Base"}
            </button>
          </div>
        ) : null}

        <div className="grid gap-5 lg:grid-cols-2 lg:items-stretch">
          <UniversityAiGenerateCard
            generating={generating}
            onGenerate={handleGenerate}
          />

          <UniversityDocumentUpload
            fileName={fileName}
            inputRef={inputRef}
            link={documentLink}
            mode={sourceMode}
            onChangeLink={(value) => {
              setDocumentLink(value);
              setErrorMessage("");
              setStatusMessage(
                value
                  ? "Link listo para enviarlo al agente institucional."
                  : "",
              );
            }}
            onChangeMode={(nextMode) => {
              setSourceMode(nextMode);
              setStatusMessage("");
              setErrorMessage("");

              if (nextMode === "file") {
                setDocumentLink("");
              } else {
                setFileName("");
              }
            }}
            onSelectFiles={handleFileSelection}
          />
        </div>

        {errorMessage ? (
          <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-red-400/40 bg-red-500/10 px-4 py-2 text-sm font-semibold text-red-700 dark:text-red-300">
            <AlertCircle className="h-4 w-4" />
            {errorMessage}
          </div>
        ) : null}

        {statusMessage ? (
          <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-emerald-400/40 bg-emerald-500/10 px-4 py-2 text-sm font-semibold text-emerald-700 dark:text-emerald-300">
            <CheckCircle2 className="h-4 w-4" />
            {statusMessage}
          </div>
        ) : null}
      </div>

      <UniversityProfilePreview
        brand={brand}
        fileName={fileName}
        link={documentLink}
        mode={sourceMode}
        profile={profile}
        isGenerating={generating}
      />
    </section>
  );
}

function UniversityAiGenerateCard({
  generating,
  onGenerate,
}: {
  generating: boolean;
  onGenerate: () => void;
}) {
  return (
    <div className="admin-panel-soft flex h-full flex-col p-6">
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400 dark:text-slate-500">
          Generacion automatica
        </p>
        <h2 className="mt-3 text-2xl font-bold tracking-tight text-slate-950 dark:text-slate-50">
          Generar con AI
        </h2>
      </div>

      <p className="admin-muted mt-3">
        El agente analizara el conocimiento disponible de la universidad para
        proponer una base institucional completa: esencia, mision, vision,
        cultura, historia y diferenciales.
      </p>

      <div className="mt-6 flex flex-1 rounded-2xl border border-dashed border-[color-mix(in_srgb,var(--bunji-primary-soft)_62%,white)] bg-white/78 p-6 dark:border-white/10 dark:bg-white/[0.04]">
        <div className="flex w-full flex-col justify-between gap-5">
          <div className="space-y-4">
            <div className="admin-icon-tile h-12 w-12">
              <Bot className="h-5 w-5" />
            </div>
            <p className="text-sm font-semibold text-slate-950 dark:text-slate-50">
              Crear perfil institucional sin cargar archivo
            </p>
            <p className="text-sm leading-6 text-slate-600 dark:text-slate-400">
              Ideal para obtener una primera version estrategica basada en los
              datos de marca, programas, buyer persons y contexto existente.
            </p>
          </div>

          <button
            type="button"
            onClick={onGenerate}
            disabled={generating}
            className="admin-button-primary px-5 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Bot className="h-4 w-4" />
            {generating ? "Investigando..." : "Generar con AI"}
          </button>
        </div>
      </div>
    </div>
  );
}

function UniversityDocumentUpload({
  fileName,
  inputRef,
  link,
  mode,
  onChangeLink,
  onChangeMode,
  onSelectFiles,
}: {
  fileName: string;
  inputRef: RefObject<HTMLInputElement | null>;
  link: string;
  mode: SourceMode;
  onChangeLink: (value: string) => void;
  onChangeMode: (mode: SourceMode) => void;
  onSelectFiles: (files: FileList | null) => void;
}) {
  return (
    <div className="admin-panel-soft flex h-full flex-col p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400 dark:text-slate-500">
            Flujo de carga
          </p>
          <h2 className="mt-3 text-2xl font-bold tracking-tight text-slate-950 dark:text-slate-50">
            Cargar documento institucional
          </h2>
        </div>

        <div className="flex gap-2">
          <ModeButton active={mode === "file"} onClick={() => onChangeMode("file")}>
            PDF
          </ModeButton>
          <ModeButton active={mode === "link"} onClick={() => onChangeMode("link")}>
            Link
          </ModeButton>
        </div>
      </div>

      <p className="admin-muted mt-3">
        Agrega un documento o enlace con informacion institucional: PEI, plan
        estrategico, mision, vision, manifiesto de marca o historia.
      </p>

      {mode === "file" ? (
        <div className="mt-6 flex flex-1 rounded-2xl border border-dashed border-[color-mix(in_srgb,var(--bunji-primary-soft)_62%,white)] bg-white/78 p-6 dark:border-white/10 dark:bg-white/[0.04]">
          <label
            className="block w-full cursor-pointer"
            onDragOver={(event) => event.preventDefault()}
            onDrop={(event) => {
              event.preventDefault();
              onSelectFiles(event.dataTransfer.files);
            }}
          >
            <input
              ref={inputRef}
              type="file"
              accept="application/pdf"
              className="sr-only"
              onChange={(event) => onSelectFiles(event.target.files)}
            />

            <div className="flex h-full flex-col justify-between gap-5">
              <div className="flex items-start gap-4">
                <div className="admin-icon-tile h-12 w-12">
                  <UploadCloud className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-950 dark:text-slate-50">
                    Arrastra y suelta tu PDF aqui
                  </p>
                  <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">
                    Tambien puedes buscarlo en tu computador. Por ahora queda
                    preparado para el webhook del agente.
                  </p>
                </div>
              </div>

              {fileName ? (
                <div className="rounded-xl border border-slate-200 bg-white/90 px-4 py-3 dark:border-white/10 dark:bg-white/[0.04]">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400 dark:text-slate-500">
                    Archivo seleccionado
                  </p>
                  <p className="mt-2 text-sm font-semibold text-slate-950 dark:text-slate-50">
                    {fileName}
                  </p>
                </div>
              ) : null}

              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className="admin-button-secondary"
              >
                <FileText className="h-4 w-4" />
                {fileName ? "Reemplazar PDF" : "Buscar PDF"}
              </button>
            </div>
          </label>
        </div>
      ) : (
        <div className="mt-6 flex flex-1 rounded-2xl border border-dashed border-[color-mix(in_srgb,var(--bunji-primary-soft)_62%,white)] bg-white/78 p-6 dark:border-white/10 dark:bg-white/[0.04]">
          <div className="flex w-full items-start gap-4">
            <div className="admin-icon-tile h-12 w-12">
              <Link2 className="h-5 w-5" />
            </div>
            <label className="block w-full">
              <span className="mb-2 block text-sm font-semibold text-slate-950 dark:text-slate-50">
                Link del documento institucional
              </span>
              <input
                type="url"
                value={link}
                onChange={(event) => onChangeLink(event.target.value)}
                className="admin-input"
                placeholder="https://..."
              />
            </label>
          </div>
        </div>
      )}
    </div>
  );
}

function ModeButton({
  active,
  children,
  onClick,
}: {
  active: boolean;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-xl px-3 py-2 text-sm font-semibold transition ${
        active
          ? "border border-[var(--bunji-cyan)] bg-[var(--bunji-primary-soft)] text-[var(--bunji-primary-dark)] dark:bg-white/[0.10] dark:text-slate-50"
          : "border border-slate-200 bg-white text-slate-600 hover:border-[var(--bunji-cyan)] dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-300"
      }`}
    >
      {children}
    </button>
  );
}

function UniversityProfilePreview({
  brand,
  fileName,
  link,
  mode,
  profile,
  isGenerating,
}: {
  brand: Brand;
  fileName: string;
  link: string;
  mode: SourceMode;
  profile: UniversityInstitutionalProfile | null;
  isGenerating: boolean;
}) {
  const sourceValue = mode === "file" ? fileName : link;
  const previewPrimary = brand.primaryColor || "#3e3989";
  const previewSecondary = brand.secondaryColor || "#7de3ea";
  const previewAccent = "#ff0b2e";
  const previewGlowA = `${previewPrimary}28`;
  const previewGlowB = `${previewSecondary}32`;
  const previewGlowC = `${previewAccent}24`;

  return (
    <aside className="relative overflow-hidden rounded-[28px] border border-[color-mix(in_srgb,var(--bunji-cyan)_36%,white)] bg-[radial-gradient(circle_at_88%_10%,rgba(125,227,234,0.18),transparent_34%),linear-gradient(145deg,rgba(255,255,255,0.99),rgba(238,250,251,0.95))] p-6 text-slate-950 shadow-[0_24px_56px_rgba(125,227,234,0.14)] dark:border-white/10 dark:bg-[radial-gradient(circle_at_88%_10%,rgba(125,227,234,0.14),transparent_34%),linear-gradient(145deg,rgba(15,23,42,0.92),rgba(15,23,42,0.76))] dark:text-slate-50">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.22),transparent_55%)] dark:bg-[linear-gradient(135deg,rgba(255,255,255,0.06),transparent_55%)]" />
      <div className="pointer-events-none absolute -right-12 top-10 h-28 w-28 rounded-full bg-[rgba(255,11,46,0.06)] blur-3xl" />

      <div className="relative flex min-h-[520px] flex-col">
        <div className="admin-icon-tile">
          <Sparkles className="h-5 w-5" />
        </div>
        <p className="mt-6 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-500">
          Preview
        </p>
        <h2 className="mt-3 text-2xl font-semibold text-slate-950 dark:text-slate-50">
          {profile?.brandIdentity.brandPromise ||
            "Preview del perfil institucional"}
        </h2>
        <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-400">
          {profile?.institutionalEssence.whatItIs ||
            "Aqui veras la informacion que devuelva el agente antes de guardarla como University Content Base."}
        </p>

        <div className="mt-6 space-y-5">
          <PreviewField label="Universidad" value={brand.name} />
          <PreviewField
            label="Fuente"
            value={sourceValue || "Pendiente"}
          />
          <PreviewField
            label="Essence"
            value={
              profile
                ? [
                    profile.institutionalEssence.whatItIs,
                    profile.institutionalEssence.whatItDoes,
                    profile.institutionalEssence.whoItServes,
                  ]
                    .filter(Boolean)
                    .join(" ")
                : "Lo que es, que hace y para quien se mostrara aqui."
            }
          />
          <PreviewField
            label="Mision y vision"
            value={
              profile
                ? [profile.mission.statement, profile.vision.statement]
                    .filter(Boolean)
                    .join(" ")
                : "Pendiente de generar con AI o cargar desde documento."
            }
          />
          <PreviewField
            label="Cultura institucional"
            value={
              profile
                ? [
                    profile.institutionalCulture.cultureDescription,
                    profile.competitiveAdvantages
                      .slice(0, 3)
                      .map((item) => item.title)
                      .filter(Boolean)
                      .join(", "),
                  ]
                    .filter(Boolean)
                    .join(" ")
                : "Valores, principios, historia y diferenciales quedaran agrupados en esta vista previa."
            }
          />
        </div>
      </div>

      <div
        aria-hidden={!isGenerating}
        className={`absolute inset-0 z-10 flex items-center justify-center overflow-hidden backdrop-blur-md transition-all duration-700 ease-out ${
          isGenerating
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
            isGenerating ? "opacity-100" : "opacity-0"
          }`}
        >
          <div
            className="absolute left-1/2 top-1/2 h-[185%] w-[185%] -translate-x-1/2 -translate-y-1/2 rounded-full p-[1.5px]"
            style={{
              background: `conic-gradient(from 0deg, ${previewSecondary}00 0deg, ${previewSecondary}aa 48deg, ${previewAccent}cc 98deg, ${previewPrimary}cc 160deg, ${previewPrimary}00 224deg, ${previewSecondary}cc 286deg, ${previewAccent}aa 326deg, ${previewSecondary}00 360deg)`,
              animation: isGenerating
                ? "record-preview-rotating-halo 6s linear infinite"
                : undefined,
            }}
          >
            <div className="h-full w-full rounded-[999px] bg-transparent" />
          </div>
          <div
            className="absolute left-1/2 top-1/2 h-[165%] w-[165%] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
            style={{
              background: `conic-gradient(from 0deg, ${previewSecondary}00 0deg, ${previewSecondary}55 64deg, ${previewGlowC} 116deg, ${previewPrimary}88 172deg, ${previewPrimary}00 236deg, ${previewSecondary}66 300deg, ${previewGlowC} 336deg, ${previewPrimary}44 360deg)`,
              animation: isGenerating
                ? "record-preview-rotating-halo 8s linear infinite reverse"
                : undefined,
            }}
          />
        </div>
        <div
          className={`pointer-events-none absolute inset-[1px] z-10 rounded-[26px] transition-all duration-700 ${
            isGenerating ? "opacity-100" : "opacity-0"
          }`}
          style={{
            background: `linear-gradient(135deg, ${previewGlowA}, ${previewGlowC} 48%, ${previewGlowB})`,
            opacity: 0.34,
          }}
        />
        <div
          className={`pointer-events-none absolute -left-16 top-8 h-40 w-40 rounded-full blur-3xl transition-opacity duration-700 ${
            isGenerating ? "opacity-100" : "opacity-0"
          }`}
          style={{
            background: `radial-gradient(circle, ${previewGlowA} 0%, transparent 72%)`,
            animation: isGenerating
              ? "record-preview-glow-drift-a 9s ease-in-out infinite"
              : undefined,
          }}
        />
        <div
          className={`pointer-events-none absolute -right-20 bottom-4 h-44 w-44 rounded-full blur-3xl transition-opacity duration-700 ${
            isGenerating ? "opacity-100" : "opacity-0"
          }`}
          style={{
            background: `radial-gradient(circle, ${previewGlowB} 0%, transparent 72%)`,
            animation: isGenerating
              ? "record-preview-glow-drift-b 11s ease-in-out infinite"
              : undefined,
          }}
        />
        <div
          className={`relative z-20 h-full w-full p-[4px] transition-all duration-700 ease-out ${
            isGenerating ? "scale-100 opacity-100" : "scale-100 opacity-0"
          }`}
        >
          <div className="flex h-full flex-col items-center justify-center rounded-[24px] bg-[#f5f7fe] p-[2px] backdrop-blur-xl">
            <div
              className="record-fingerprint-spinner"
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
              EDwin esta investigando la universidad...
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}

function PreviewField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-500">
        {label}
      </p>
      <p className="mt-2 text-sm leading-6 text-slate-700 dark:text-slate-200">
        {value}
      </p>
    </div>
  );
}

type UniversityProfileAgentResponse = {
  ok?: boolean;
  error?: string;
  message?: string;
  universityProfile?: UniversityInstitutionalProfile;
  profile?: UniversityInstitutionalProfile;
  data?: unknown;
};

function extractUniversityProfile(value: unknown) {
  if (Array.isArray(value)) {
    return extractUniversityProfile(value[0]);
  }

  if (!value || typeof value !== "object") {
    return null;
  }

  const record = value as UniversityProfileAgentResponse;

  if (record.universityProfile) {
    return record.universityProfile;
  }

  if (record.profile) {
    return record.profile;
  }

  return extractUniversityProfile(record.data);
}
