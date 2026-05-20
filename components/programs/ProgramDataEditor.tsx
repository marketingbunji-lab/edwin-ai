"use client";

import Link from "next/link";
import { ArrowLeft, Bot, Save } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
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

export default function ProgramDataEditor({
  brand,
  initialProgram,
  mode = "edit",
}: Props) {
  const router = useRouter();
  const [program, setProgram] = useState<Landing>(initialProgram);
  const [jsonDraft, setJsonDraft] = useState(
    JSON.stringify(initialProgram, null, 2),
  );
  const [jsonError, setJsonError] = useState("");
  const [previewProgram, setPreviewProgram] = useState<Landing | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [lastSavedSnapshot, setLastSavedSnapshot] = useState(() =>
    JSON.stringify(initialProgram),
  );
  const isCreateMode = mode === "create";
  const generatedSlug = slugify(program.fullTitle || program.title);
  const currentSnapshot = JSON.stringify(program);
  const hasChanges = currentSnapshot !== lastSavedSnapshot;
  const saveDisabled = saving || !hasChanges || Boolean(jsonError);

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
  };

  const updateJsonDraft = (value: string) => {
    setJsonDraft(value);

    try {
      const parsedProgram = JSON.parse(value) as Landing;
      setProgram(parsedProgram);
      setJsonError("");
    } catch {
      setJsonError("JSON invalido. Corrigelo antes de guardar.");
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
        setMessage("Corrige el JSON completo antes de guardar el programa.");
        return;
      }

      const title = program.title.trim();
      const fullTitle = program.fullTitle.trim();
      const sourceWebsite = (program.sourceWebsite ?? "").trim();
      const slug = slugify(fullTitle);

      if (!title || !fullTitle) {
        setMessage(
          "Completa Program name y Full title para crear el programa.",
        );
        return;
      }

      if (!slug) {
        setMessage("El Full title debe generar un slug valido.");
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
        throw new Error(data.error || "No se pudo guardar el programa");
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
        setMessage("Programa creado correctamente");
        router.refresh();
        return;
      }

      applyProgram(nextProgram);
      setLastSavedSnapshot(JSON.stringify(nextProgram));
      setMessage(
        isCreateMode
          ? "Programa creado correctamente"
          : "Programa guardado correctamente",
      );
      router.refresh();
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "No se pudo guardar el programa",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="sticky top-4 z-20 overflow-hidden rounded-[22px] border border-white/55 bg-[linear-gradient(135deg,rgba(255,255,255,0.82),rgba(255,255,255,0.54))] p-4 shadow-[0_22px_55px_rgba(15,23,42,0.14)] backdrop-blur-xl before:pointer-events-none before:absolute before:inset-0 before:bg-[linear-gradient(135deg,rgba(255,255,255,0.34),transparent_58%)] before:content-[''] dark:border-white/10 dark:bg-[linear-gradient(135deg,rgba(15,23,42,0.78),rgba(15,23,42,0.62))] dark:shadow-[0_22px_55px_rgba(2,6,23,0.32)] dark:before:bg-[linear-gradient(135deg,rgba(255,255,255,0.08),transparent_58%)]">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Link
            href={`/admin/brands/${brand.slug}/programs`}
            className="admin-button-secondary admin-button-icon"
            aria-label="Volver a programs"
            title="Volver a programs"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>

          <button
            type="button"
            onClick={saveProgram}
            disabled={saveDisabled}
            className="admin-button-primary disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Save className="h-4 w-4" />
            {saving
              ? "Guardando..."
              : isCreateMode
                ? "Crear programa"
                : "Guardar programa"}
          </button>
        </div>
      </div>

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="admin-eyebrow">
            {brand.name}
          </p>
          <h1 className="admin-title">
            {isCreateMode ? "Agregar program" : "Editar programa"}
          </h1>
          {isCreateMode ? (
            <p className="admin-muted mt-2">
              Campos minimos: Program name y Full title. El slug se genera
              automaticamente desde Full title.
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
        <section className="admin-panel grid gap-4 p-5 md:grid-cols-2">
          <SectionTitle title="Informacion base" />
          <Field label="Program name" value={program.title} required onChange={(value) => updateField("title", value)} />
          <Field label="Full title" value={program.fullTitle} required onChange={(value) => updateField("fullTitle", value)} />
          <SelectField
            label="Language"
            value={program.language ?? "es"}
            onChange={(value) => updateField("language", value)}
            options={[
              { label: "Spanish", value: "es" },
              { label: "English", value: "en" },
            ]}
          />
          <Field label="Slug" value={generatedSlug} readOnly onChange={() => {}} />
          <Field label="Source website" value={program.sourceWebsite ?? ""} onChange={(value) => updateField("sourceWebsite", value)} />
          <Field label="Catalogo" value={program.catalog ?? ""} onChange={(value) => updateField("catalog", value)} />
          {isCreateMode ? null : (
            <>
              <Field label="Program type" value={program.programType ?? ""} onChange={(value) => updateField("programType", value)} />
              <Field label="Schedule" value={program.schedule ?? ""} onChange={(value) => updateField("schedule", value)} />
              <Field label="Status" value={program.status} onChange={(value) => updateField("status", value)} />
              <Field label="Template" value={program.template} onChange={(value) => updateField("template", value)} />
            </>
          )}
        </section>

        {isCreateMode ? (
          <ProgramPreviewCard
            brand={brand}
            program={previewProgram}
            onProgramUpdated={(nextProgram) => {
              setProgram(nextProgram);
              setPreviewProgram(nextProgram);
            }}
          />
        ) : null}
      </div>

      {message ? (
        <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
          {message}
        </p>
      ) : null}

      <section className="admin-panel space-y-4 p-5">
        <div className="space-y-2">
          <SectionTitle title="JSON completo del programa" />
          <p className="admin-muted">
            Aqui puedes editar absolutamente toda la estructura del programa.
            Cualquier campo que exista en el data puede modificarse desde este
            bloque.
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
            La informacion base y este JSON quedan sincronizados mientras el
            contenido sea valido.
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

function ProgramPreviewCard({
  brand,
  program,
  onProgramUpdated,
}: {
  brand: Brand;
  program: Landing | null;
  onProgramUpdated: (program: Landing) => void;
}) {
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState("");

  const executeAgent = async () => {
    if (!program) return;

    try {
      setSending(true);
      setMessage("Enviando programa al Agent Content...");

      const response = await fetch(`/api/program-agent/${brand.slug}/${program.slug}`, {
        method: "POST",
      });
      const data = (await response.json()) as {
        ok?: boolean;
        error?: string;
        program?: Landing;
        slug?: string;
      };

      if (!response.ok || !data.ok) {
        throw new Error(data.error || "No se pudo ejecutar el Agent Content");
      }

      if (!data.program) {
        throw new Error("El Agent Content no devolvio el programa actualizado.");
      }

      onProgramUpdated(data.program);
      setMessage("Agent Content ejecutado y programa actualizado.");
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "No se pudo ejecutar el Agent Content",
      );
    } finally {
      setSending(false);
    }
  };

  if (!program) {
    return (
      <aside className="admin-empty-state p-6 text-left">
        <p className="admin-eyebrow">
          Preview
        </p>
        <h2 className="mt-4 text-xl font-bold tracking-tight text-slate-950 dark:text-slate-50">
          Aqui se muestra la informacion del programa
        </h2>
        <p className="admin-muted mt-3">
          Completa los campos minimos y crea el programa para revisar aqui la
          informacion antes de ejecutar el agente de contenido.
        </p>
      </aside>
    );
  }

  return (
    <aside className="admin-panel p-6">
      <p className="admin-eyebrow">
        Preview
      </p>
      <h2 className="mt-4 text-2xl font-bold tracking-tight text-slate-950 dark:text-slate-50">
        {program.fullTitle}
      </h2>
      <dl className="mt-5 space-y-4 text-sm">
        <PreviewItem label="Brand" value={brand.name} />
        <PreviewItem label="Program name" value={program.title} />
        <PreviewItem label="Slug" value={program.slug} />
        <PreviewItem
          label="Source website"
          value={program.sourceWebsite || "Pendiente"}
        />
        <PreviewItem label="Catalogo" value={program.catalog || "Pendiente"} />
      </dl>
      <button
        type="button"
        onClick={executeAgent}
        disabled={sending}
        className="admin-button-primary mt-6 w-full"
      >
        <Bot className="h-4 w-4" />
        {sending ? "Enviando..." : "Ejecutar Agent Content"}
      </button>
      {message ? (
        <p className="mt-3 text-sm font-medium text-slate-600 dark:text-slate-300">
          {message}
        </p>
      ) : null}
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
  value,
  onChange,
  className = "",
  required = false,
  readOnly = false,
}: {
  label: string;
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
