"use client";

import Link from "next/link";
import { ArrowLeft, Bot, Save } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useDashboardLanguage } from "@/components/dashboard/DashboardLanguageProvider";
import type { Brand, Landing } from "@/lib/data";

type Props = {
  brand: Brand;
  initialProgram: Landing;
  mode?: "create" | "edit";
};

type EditableField =
  | "language"
  | "title"
  | "fullTitle"
  | "sourceWebsite"
  | "catalog"
  | "programType"
  | "schedule"
  | "status"
  | "updatedAt"
  | "template";

type CatalogInputMode = "link" | "file";

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function parseRawProgram(raw: unknown) {
  if (typeof raw !== "string" || !raw.trim()) {
    return null;
  }

  try {
    return JSON.parse(raw) as unknown;
  } catch {
    return null;
  }
}

function hasAgentFailure(data: unknown) {
  const firstItem = Array.isArray(data) ? data[0] : data;

  return isRecord(firstItem) && firstItem.success === false;
}

function extractAgentProgram(data: unknown): Partial<Landing> & {
  programUrl?: string;
} {
  const firstItem = Array.isArray(data) ? data[0] : data;

  if (!isRecord(firstItem)) {
    return {};
  }

  const candidate =
    firstItem.landing ?? firstItem.draft ?? parseRawProgram(firstItem.raw);

  if (!isRecord(candidate)) {
    return {
      programUrl:
        typeof firstItem.programUrl === "string" ? firstItem.programUrl : "",
    };
  }

  return {
    ...candidate,
    programUrl:
      typeof firstItem.programUrl === "string" ? firstItem.programUrl : "",
  } as Partial<Landing> & { programUrl?: string };
}

function hasProgramData(program: Partial<Landing> & { programUrl?: string }) {
  return Boolean(
    program.title ||
      program.fullTitle ||
      program.hero ||
      program.programInfo ||
      program.whyStudy ||
      program.supportSection ||
      program.studentSupport ||
      program.benefits ||
      program.opportunityToWork ||
      program.careerOutcomes ||
      program.programUrl,
  );
}

function isValidHttpUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function getAgentErrorMessage(data: {
  error?: string;
  status?: number;
  data?: unknown;
}) {
  if (data.error?.trim()) {
    return data.error;
  }

  if (typeof data.data === "string" && data.data.trim()) {
    return data.data;
  }

  if (data.status) {
    return `No se pudo ejecutar el Agent Content. Codigo ${data.status}.`;
  }

  return "No se pudo ejecutar el Agent Content";
}

export default function ProgramDataEditor({
  brand,
  initialProgram,
  mode = "edit",
}: Props) {
  const { t } = useDashboardLanguage();
  const router = useRouter();
  const [program, setProgram] = useState<Landing>(initialProgram);
  const [jsonDraft, setJsonDraft] = useState(
    JSON.stringify(initialProgram, null, 2),
  );
  const [jsonError, setJsonError] = useState("");
  const [previewProgram, setPreviewProgram] = useState<Landing | null>(null);
  const [saving, setSaving] = useState(false);
  const [agentRunning, setAgentRunning] = useState(false);
  const [agentReady, setAgentReady] = useState(false);
  const [message, setMessage] = useState("");
  const [activeStep, setActiveStep] = useState(0);
  const [catalogInputMode, setCatalogInputMode] =
    useState<CatalogInputMode>("link");
  const [lastSavedSnapshot, setLastSavedSnapshot] = useState(() =>
    JSON.stringify(initialProgram),
  );
  const isCreateMode = mode === "create";
  const generatedSlug = slugify(
    isCreateMode ? program.title : program.fullTitle || program.title,
  );
  const currentSnapshot = JSON.stringify(program);
  const hasChanges = currentSnapshot !== lastSavedSnapshot;
  const hasProgramName = Boolean(program.title.trim());
  const canCreateProgram = !isCreateMode || hasProgramName;
  const saveDisabled =
    saving || !hasChanges || Boolean(jsonError) || !canCreateProgram;

  const applyProgram = (nextProgram: Landing) => {
    setProgram(nextProgram);
    setJsonDraft(JSON.stringify(nextProgram, null, 2));
    setJsonError("");
  };

  const updateField = (field: EditableField, value: string) => {
    setProgram((current) => {
      const nextProgram = {
        ...current,
        [field]: value,
      };

      setJsonDraft(JSON.stringify(nextProgram, null, 2));
      return nextProgram;
    });

    if (isCreateMode) {
      setAgentReady(false);
      setPreviewProgram(null);
    }
  };

  const updateJsonDraft = (value: string) => {
    setJsonDraft(value);

    try {
      const parsedProgram = JSON.parse(value) as Landing;
      setProgram(parsedProgram);
      setJsonError("");
    } catch {
      setJsonError(t("programDataEditor.jsonInvalid"));
    }
  };

  const saveProgram = async () => {
    if (saveDisabled) {
      return;
    }

    try {
      setSaving(true);
      setMessage("");

      if (jsonError) {
        setMessage(t("programDataEditor.messages.fixJsonBeforeSave"));
        return;
      }

      const title = program.title.trim();
      const fullTitle = (program.fullTitle || program.title).trim();
      const sourceWebsite = (program.sourceWebsite ?? "").trim();
      const slug = slugify(isCreateMode ? title : fullTitle);

      if (!title) {
        setMessage(
          t("programDataEditor.messages.missingProgramName"),
        );
        return;
      }

      if (isCreateMode && !agentReady) {
        setMessage(t("programDataEditor.messages.runAgentBeforeCreate"));
        return;
      }

      if (!slug) {
        setMessage("El nombre del programa debe generar un slug valido.");
        return;
      }

      const nextProgram: Landing = {
        ...program,
        brand: brand.slug,
        slug: isCreateMode ? slug : initialProgram.slug,
        title,
        fullTitle,
        sourceWebsite,
        updatedAt: new Date().toISOString().slice(0, 10),
        hero: {
          ...(program.hero ?? {}),
          title: program.hero?.title || title,
        },
        language: (program.language ?? "es").trim() as Landing["language"],
        form: {
          ...(program.form ?? {}),
          programName: program.form?.programName || fullTitle,
        },
      };

      const response = await fetch(
        isCreateMode
          ? `/api/landings/${brand.slug}`
          : `/api/landings/${brand.slug}/${initialProgram.slug}`,
        {
          method: isCreateMode ? "POST" : "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(nextProgram),
        },
      );
      const data = (await response.json()) as {
        ok?: boolean;
        error?: string;
        slug?: string;
      };

      if (!response.ok || !data.ok) {
        throw new Error(data.error || t("programDataEditor.messages.saveError"));
      }

        if (isCreateMode && data.slug) {
        const createdProgram = {
          ...nextProgram,
          slug: data.slug,
          sourceWebsite:
            nextProgram.sourceWebsite || `/${brand.slug}/${data.slug}`,
        };

        applyProgram(createdProgram);
        setPreviewProgram(createdProgram);
        setLastSavedSnapshot(JSON.stringify(createdProgram));
        setMessage(t("programDataEditor.messages.created"));
        router.refresh();
        return;
      }

      applyProgram(nextProgram);
      setLastSavedSnapshot(JSON.stringify(nextProgram));
      setMessage(
        isCreateMode
          ? t("programDataEditor.messages.created")
          : t("programDataEditor.messages.saved"),
      );
      router.refresh();
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : t("programDataEditor.messages.saveError"),
      );
    } finally {
      setSaving(false);
    }
  };

  const runDraftAgent = async () => {
    if (agentRunning || saving) {
      return;
    }

    try {
      setAgentRunning(true);
      setMessage(t("programDataEditor.messages.running"));
      setAgentReady(false);

      if (jsonError) {
        setMessage(t("programDataEditor.messages.fixJsonBeforeAgent"));
        return;
      }

      const title = program.title.trim();
      const fullTitle = (program.fullTitle || program.title).trim();
      const sourceWebsite = (program.sourceWebsite ?? "").trim();
      const slug = slugify(title);

      if (!title || !slug) {
        setMessage(t("programDataEditor.messages.missingNameForAgent"));
        return;
      }

      if (!sourceWebsite) {
        setMessage(t("programDataEditor.messages.missingSourceWebsite"));
        return;
      }

      if (!isValidHttpUrl(sourceWebsite)) {
        setMessage(
          t("programDataEditor.messages.invalidSourceWebsite"),
        );
        return;
      }

      const draftProgram: Landing = {
        ...program,
        brand: brand.slug,
        slug,
        title,
        fullTitle,
        sourceWebsite,
        updatedAt: new Date().toISOString().slice(0, 10),
        hero: {
          ...(program.hero ?? {}),
          title: program.hero?.title || title,
        },
        language: (program.language ?? "es").trim() as Landing["language"],
        form: {
          ...(program.form ?? {}),
          programName: program.form?.programName || fullTitle,
        },
      };

      const response = await fetch("/api/program-agent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          brand,
          program: draftProgram,
        }),
      });
      const data = (await response.json()) as {
        ok?: boolean;
        error?: string;
        status?: number;
        data?: unknown;
      };

      if (!response.ok || !data.ok) {
        throw new Error(getAgentErrorMessage(data));
      }

      if (hasAgentFailure(data.data)) {
        throw new Error(
          t("programDataEditor.messages.agentFailure"),
        );
      }

      const agentProgram = extractAgentProgram(data.data);

      if (!hasProgramData(agentProgram)) {
        throw new Error(
          t("programDataEditor.messages.emptyAgentData"),
        );
      }

      const nextProgram: Landing = {
        ...draftProgram,
        ...agentProgram,
        brand: brand.slug,
        slug: agentProgram.slug
          ? slugify(agentProgram.slug) || draftProgram.slug
          : draftProgram.slug,
        sourceWebsite:
          agentProgram.sourceWebsite ||
          agentProgram.programUrl ||
          draftProgram.sourceWebsite ||
          "",
        catalog: agentProgram.catalog ?? draftProgram.catalog ?? "",
        updatedAt: new Date().toISOString().slice(0, 10),
      };

      applyProgram(nextProgram);
      setPreviewProgram(nextProgram);
      setAgentReady(true);
      setMessage(
        t("programDataEditor.messages.agentComplete"),
      );
    } catch (error) {
      setPreviewProgram(null);
      setAgentReady(false);
      setMessage(
        error instanceof Error
          ? error.message
          : t("programDataEditor.messages.agentError"),
      );
    } finally {
      setAgentRunning(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="sticky top-4 z-20 overflow-hidden rounded-[22px] border border-white/55 bg-[linear-gradient(135deg,rgba(255,255,255,0.82),rgba(255,255,255,0.54))] p-4 shadow-[0_22px_55px_rgba(15,23,42,0.14)] backdrop-blur-xl before:pointer-events-none before:absolute before:inset-0 before:bg-[linear-gradient(135deg,rgba(255,255,255,0.34),transparent_58%)] before:content-[''] dark:border-white/10 dark:bg-[linear-gradient(135deg,rgba(15,23,42,0.78),rgba(15,23,42,0.62))] dark:shadow-[0_22px_55px_rgba(2,6,23,0.32)] dark:before:bg-[linear-gradient(135deg,rgba(255,255,255,0.08),transparent_58%)]">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Link
            href={`/admin/brands/${brand.slug}/programs`}
            className="admin-button-secondary admin-button-icon"
            aria-label={t("programsEditor.backToPrograms")}
            title={t("programsEditor.backToPrograms")}
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>

          {isCreateMode ? null : (
            <button
              type="button"
              onClick={saveProgram}
              disabled={saveDisabled}
              className="admin-button-primary disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Save className="h-4 w-4" />
              {saving
                ? t("programDataEditor.saving")
                : t("programDataEditor.saveProgram")}
            </button>
          )}
        </div>
      </div>

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="admin-eyebrow">
            {brand.name}
          </p>
          <h1 className="admin-title">
            {isCreateMode
              ? t("programDataEditor.addProgram")
              : t("programDataEditor.editProgram")}
          </h1>
          {isCreateMode ? (
            <p className="admin-muted mt-2">
              {t("programDataEditor.createDescription")}
            </p>
          ) : null}
        </div>
      </div>

      <div
        className={
          isCreateMode
            ? "grid gap-6 xl:grid-cols-[minmax(0,1.35fr)_minmax(320px,0.65fr)]"
            : "block"
        }
      >
        <section className="admin-panel p-5">
          <SectionTitle title={t("programDataEditor.baseInfo")} />

          {isCreateMode ? (
            <ProgramBaseStepForm
              activeStep={activeStep}
              catalogInputMode={catalogInputMode}
              generatedSlug={generatedSlug}
              program={program}
              setActiveStep={setActiveStep}
              setCatalogInputMode={setCatalogInputMode}
              updateField={updateField}
              onCreate={saveProgram}
              saving={saving}
              agentReady={agentReady}
              agentRunning={agentRunning}
              saveDisabled={saveDisabled}
              onRunAgent={runDraftAgent}
            />
          ) : (
            <>
              <div className="grid gap-4 md:grid-cols-2">
                <Field label={t("programDataEditor.fields.programName")} value={program.title} required onChange={(value) => updateField("title", value)} />
                <Field label={t("programDataEditor.fields.fullTitle")} value={program.fullTitle} required onChange={(value) => updateField("fullTitle", value)} />
                <SelectField
                  label={t("programDataEditor.fields.language")}
                  value={program.language ?? "es"}
                  onChange={(value) => updateField("language", value)}
                  options={[
                    { label: t("programDataEditor.actions.spanish"), value: "es" },
                    { label: t("programDataEditor.actions.english"), value: "en" },
                  ]}
                />
                <Field label={t("programDataEditor.fields.slug")} value={generatedSlug} readOnly onChange={() => {}} />
                <Field label={t("programDataEditor.fields.sourceWebsite")} value={program.sourceWebsite ?? ""} onChange={(value) => updateField("sourceWebsite", value)} />
                <Field label={t("programDataEditor.fields.catalog")} value={program.catalog ?? ""} onChange={(value) => updateField("catalog", value)} />
              </div>

              <div className="mt-4 grid gap-4 md:grid-cols-2">
              <Field label={t("programDataEditor.fields.programType")} value={program.programType ?? ""} onChange={(value) => updateField("programType", value)} />
              <Field label={t("programDataEditor.fields.schedule")} value={program.schedule ?? ""} onChange={(value) => updateField("schedule", value)} />
              <Field label={t("programDataEditor.fields.status")} value={program.status} onChange={(value) => updateField("status", value)} />
              <Field label={t("programDataEditor.fields.template")} value={program.template} onChange={(value) => updateField("template", value)} />
              </div>
            </>
          )}
        </section>

        {isCreateMode ? (
          <ProgramPreviewCard
            brand={brand}
            program={previewProgram}
          />
        ) : null}
      </div>

      {message ? (
        <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
          {message}
        </p>
      ) : null}

      <section className="admin-panel space-y-4 p-5 hidden">
        <div className="space-y-2">
          <SectionTitle title={t("programDataEditor.jsonTitle")} />
          <p className="admin-muted">
            {t("programDataEditor.jsonDescription")}
          </p>
        </div>

        <label className="block">
          <span className="mb-1 block text-sm font-semibold text-slate-950 dark:text-slate-100">
            JSON
          </span>
          <textarea
            value={jsonDraft}
            rows={28}
            onChange={(event) => updateJsonDraft(event.target.value)}
            spellCheck={false}
            className="admin-textarea font-mono"
          />
        </label>

        {jsonError ? (
          <p className="text-sm font-medium text-red-600 dark:text-red-300">
            {jsonError}
          </p>
        ) : (
          <p className="admin-muted">
            {t("programDataEditor.jsonSync")}
          </p>
        )}
      </section>
    </div>
  );
}

function SectionTitle({ title }: { title: string }) {
  return (
    <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-500 md:col-span-2">
      {title}
    </h2>
  );
}

function ProgramBaseStepForm({
  activeStep,
  catalogInputMode,
  generatedSlug,
  program,
  setActiveStep,
  setCatalogInputMode,
  updateField,
  onCreate,
  onRunAgent,
  saving,
  agentReady,
  agentRunning,
  saveDisabled,
}: {
  activeStep: number;
  catalogInputMode: CatalogInputMode;
  generatedSlug: string;
  program: Landing;
  setActiveStep: (step: number) => void;
  setCatalogInputMode: (mode: CatalogInputMode) => void;
  updateField: (field: EditableField, value: string) => void;
  onCreate: () => void;
  onRunAgent: () => void;
  saving: boolean;
  agentReady: boolean;
  agentRunning: boolean;
  saveDisabled: boolean;
}) {
  const { t } = useDashboardLanguage();
  const programCreationSteps = [
    {
      title: t("programDataEditor.steps.nameTitle"),
      description: t("programDataEditor.steps.nameDescription"),
    },
    {
      title: t("programDataEditor.steps.sourceTitle"),
      description: t("programDataEditor.steps.sourceDescription"),
    },
    {
      title: t("programDataEditor.steps.catalogTitle"),
      description: t("programDataEditor.steps.catalogDescription"),
    },
  ];
  const isFirstStep = activeStep === 0;
  const isLastStep = activeStep === programCreationSteps.length - 1;
  const canContinue = activeStep === 0 ? Boolean(program.title.trim()) : true;
  const canRunAgent =
    Boolean(program.title.trim()) &&
    Boolean((program.sourceWebsite ?? "").trim()) &&
    isValidHttpUrl((program.sourceWebsite ?? "").trim());
  const goToPreviousStep = () => setActiveStep(Math.max(activeStep - 1, 0));
  const goToNextStep = () =>
    setActiveStep(Math.min(activeStep + 1, programCreationSteps.length - 1));

  return (
    <div className="mt-5 space-y-6">
      <ol className="grid gap-3 md:grid-cols-3">
        {programCreationSteps.map((step, index) => {
          const isActive = index === activeStep;
          const isComplete = index < activeStep;

          return (
            <li
              key={step.title}
              className={`rounded-2xl border p-4 transition ${
                isActive
                  ? "border-[color-mix(in_srgb,var(--bunji-cyan)_56%,var(--bunji-primary)_44%)] bg-[linear-gradient(135deg,color-mix(in_srgb,var(--bunji-primary-darker)_88%,#020617_12%),color-mix(in_srgb,var(--bunji-primary-dark)_76%,#020617_24%))] shadow-[0_18px_42px_rgba(62,57,137,0.34),0_0_0_1px_rgba(125,227,234,0.10)] ring-1 ring-[color-mix(in_srgb,var(--bunji-cyan)_30%,transparent)]"
                  : "border-slate-200 bg-white/60 dark:border-white/10 dark:bg-white/[0.03]"
              }`}
            >
              <span
                className={`inline-flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${
                  isActive || isComplete
                    ? "bg-[linear-gradient(135deg,var(--bunji-cyan),var(--bunji-primary-light))] text-slate-950 shadow-[0_8px_20px_rgba(125,227,234,0.25)]"
                    : "bg-slate-100 text-slate-500 dark:bg-slate-900 dark:text-slate-400"
                }`}
              >
                {index + 1}
              </span>
              <h3
                className={`mt-3 text-sm font-semibold ${
                  isActive
                    ? "text-white"
                    : "text-slate-950 dark:text-slate-50"
                }`}
              >
                {step.title}
              </h3>
              <p
                className={`mt-2 text-sm leading-6 ${
                  isActive
                    ? "text-slate-200"
                    : "text-slate-600 dark:text-slate-400"
                }`}
              >
                {step.description}
              </p>
            </li>
          );
        })}
      </ol>

      <div className="rounded-2xl border border-slate-200 bg-white/72 p-5 dark:border-white/10 dark:bg-white/[0.04]">
        {activeStep === 0 ? (
          <div className="grid gap-4 md:grid-cols-2">
            <Field
              label={t("programDataEditor.fields.programName")}
              helper={t("programDataEditor.helper.userFacingName")}
              value={program.title}
              required
              onChange={(value) => {
                updateField("title", value);
                updateField("fullTitle", value);
              }}
            />
            <Field
              label={t("programDataEditor.fields.slug")}
              helper={t("programDataEditor.helper.autoSlug")}
              value={generatedSlug}
              readOnly
              onChange={() => {}}
            />
          </div>
        ) : null}

        {activeStep === 1 ? (
          <Field
            label={t("programDataEditor.fields.sourceWebsite")}
            helper={t("programDataEditor.helper.sourceWebsite")}
            value={program.sourceWebsite ?? ""}
            onChange={(value) => updateField("sourceWebsite", value)}
          />
        ) : null}

        {activeStep === 2 ? (
          <div className="space-y-5">
            <div>
              <p className="text-sm font-semibold text-slate-950 dark:text-slate-100">
                {t("programDataEditor.helper.howAddCatalog")}
              </p>
              <p className="admin-muted mt-1">
                {t("programDataEditor.helper.howAddCatalogDescription")}
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => setCatalogInputMode("file")}
                className={`rounded-xl border px-4 py-3 text-left text-sm font-semibold transition ${
                  catalogInputMode === "file"
                    ? "border-[var(--bunji-primary)] bg-[var(--bunji-primary)] text-white shadow-[0_12px_28px_rgba(62,57,137,0.22)]"
                    : "border-slate-200 bg-white text-slate-700 hover:border-[var(--bunji-primary)] dark:border-white/10 dark:bg-slate-950 dark:text-slate-100"
                }`}
              >
                {t("programDataEditor.helper.uploadCatalog")}
              </button>
              <button
                type="button"
                onClick={() => setCatalogInputMode("link")}
                className={`rounded-xl border px-4 py-3 text-left text-sm font-semibold transition ${
                  catalogInputMode === "link"
                    ? "border-[var(--bunji-primary)] bg-[var(--bunji-primary)] text-white shadow-[0_12px_28px_rgba(62,57,137,0.22)]"
                    : "border-slate-200 bg-white text-slate-700 hover:border-[var(--bunji-primary)] dark:border-white/10 dark:bg-slate-950 dark:text-slate-100"
                }`}
              >
                {t("programDataEditor.helper.addLink")}
              </button>
            </div>

            {catalogInputMode === "link" ? (
              <Field
                label={t("programDataEditor.fields.catalog")}
                helper={t("programDataEditor.helper.catalogLink")}
                value={program.catalog ?? ""}
                onChange={(value) => updateField("catalog", value)}
              />
            ) : (
              <label className="block">
                <span className="mb-1 block text-sm font-semibold text-slate-950 dark:text-slate-100">
                  {t("programDataEditor.helper.catalogFile")}
                </span>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx,.ppt,.pptx"
                  onChange={(event) => {
                    const file = event.target.files?.[0];
                    updateField("catalog", file?.name ?? "");
                  }}
                  className="admin-input file:mr-4 file:rounded-lg file:border-0 file:bg-[var(--bunji-primary)] file:px-3 file:py-2 file:text-sm file:font-semibold file:text-white"
                />
                <span className="admin-muted mt-2 block">
                  {t("programDataEditor.helper.fileReference")}
                </span>
              </label>
            )}
          </div>
        ) : null}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          onClick={goToPreviousStep}
          disabled={isFirstStep}
          className="admin-button-secondary disabled:cursor-not-allowed disabled:opacity-50"
        >
          {t("programDataEditor.previous")}
        </button>

        {isLastStep && agentReady ? (
          <button
            type="button"
            onClick={onCreate}
            disabled={saveDisabled}
            className="admin-button-primary disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Save className="h-4 w-4" />
            {saving
              ? t("programDataEditor.creating")
              : t("programDataEditor.createProgram")}
          </button>
        ) : isLastStep ? (
          <button
            type="button"
            onClick={onRunAgent}
            disabled={agentRunning || saving || !canRunAgent}
            className="admin-button-primary disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Bot className="h-4 w-4" />
            {agentRunning
              ? t("programDataEditor.runningAgent")
              : t("programDataEditor.runAgent")}
          </button>
        ) : (
          <button
            type="button"
            onClick={goToNextStep}
            disabled={!canContinue}
            className="admin-button-primary disabled:cursor-not-allowed disabled:opacity-60"
          >
            {t("programDataEditor.continue")}
          </button>
        )}
      </div>
    </div>
  );
}

function ProgramPreviewCard({
  brand,
  program,
}: {
  brand: Brand;
  program: Landing | null;
}) {
  const { t } = useDashboardLanguage();

  if (!program) {
    return (
      <aside className="admin-empty-state p-6 text-left">
        <p className="admin-eyebrow">
          {t("programDataEditor.preview")}
        </p>
        <h2 className="mt-4 text-xl font-bold tracking-tight text-slate-950 dark:text-slate-50">
          {t("programDataEditor.previewTitle")}
        </h2>
        <p className="admin-muted mt-3">
          {t("programDataEditor.previewDescription")}
        </p>
      </aside>
    );
  }

  return (
    <aside className="admin-panel p-6">
      <p className="admin-eyebrow">
        {t("programDataEditor.preview")}
      </p>
      <h2 className="mt-4 text-2xl font-bold tracking-tight text-slate-950 dark:text-slate-50">
        {program.fullTitle}
      </h2>
      <dl className="mt-5 space-y-4 text-sm">
        <PreviewItem label="Brand" value={brand.name} />
        <PreviewItem label={t("programDataEditor.fields.programName")} value={program.title} />
        <PreviewItem label={t("programDataEditor.fields.slug")} value={program.slug} />
        <PreviewItem
          label={t("programDataEditor.fields.sourceWebsite")}
          value={program.sourceWebsite || t("programDataEditor.empty.pending")}
        />
        <PreviewItem
          label={t("programDataEditor.fields.catalog")}
          value={program.catalog || t("programDataEditor.empty.pending")}
        />
      </dl>
      <p className="admin-muted mt-6">
        {t("programDataEditor.previewFooter")}
      </p>
    </aside>
  );
}

function PreviewItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-500">
        {label}
      </dt>
      <dd className="mt-1 break-words text-slate-900 dark:text-slate-100">
        {value}
      </dd>
    </div>
  );
}

function Field({
  label,
  helper = "",
  value,
  onChange,
  className = "",
  required = false,
  readOnly = false,
}: {
  label: string;
  helper?: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
  required?: boolean;
  readOnly?: boolean;
}) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-1 block text-sm font-semibold text-slate-950 dark:text-slate-100">
        {label}
        {required ? <span className="text-red-500"> *</span> : null}
      </span>
      {helper ? <span className="admin-muted mb-2 block">{helper}</span> : null}
      <input
        value={value}
        required={required}
        readOnly={readOnly}
        onChange={(event) => onChange(event.target.value)}
        className="admin-input"
      />
    </label>
  );
}

function SelectField({
  label,
  value,
  onChange,
  className = "",
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
  options: Array<{ label: string; value: string }>;
}) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-1 block text-sm font-semibold text-slate-950 dark:text-slate-100">
        {label}
      </span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="admin-input"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
