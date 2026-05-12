"use client";

import Link from "next/link";
import { ArrowLeft, Bot, Save } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Brand, Landing, ProgramInfoItem } from "@/lib/data";

type Props = {
  brand: Brand;
  initialProgram: Landing;
  mode?: "create" | "edit";
};

type EditableField =
  | "title"
  | "fullTitle"
  | "sourceWebsite"
  | "catalog"
  | "programType"
  | "schedule"
  | "status"
  | "updatedAt"
  | "template";

type HeroField =
  | "eyebrow"
  | "highlight"
  | "title"
  | "description"
  | "supportText"
  | "modality"
  | "semesterPrice"
  | "backgroundImage"
  | "overlayColor"
  | "personImage";

export default function ProgramDataEditor({
  brand,
  initialProgram,
  mode = "edit",
}: Props) {
  const router = useRouter();
  const [program, setProgram] = useState<Landing>(initialProgram);
  const [previewProgram, setPreviewProgram] = useState<Landing | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const isCreateMode = mode === "create";
  const generatedSlug = slugify(program.fullTitle || program.title);

  const updateField = (field: EditableField, value: string) => {
    setProgram((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const updateHeroField = (field: HeroField, value: string) => {
    setProgram((current) => ({
      ...current,
      hero: {
        ...(current.hero ?? {}),
        [field]: value,
      },
    }));
  };

  const updateFormField = (
    field: "type" | "scriptUrl" | "scriptCode" | "programName",
    value: string,
  ) => {
    setProgram((current) => ({
      ...current,
      form: {
        ...(current.form ?? {}),
        [field]: value,
      },
    }));
  };

  const updateProgramInfo = (
    index: number,
    field: keyof ProgramInfoItem,
    value: string,
  ) => {
    setProgram((current) => {
      const items = normalizeProgramInfo(current.programInfo);
      items[index] = {
        ...items[index],
        [field]: value,
      };

      return {
        ...current,
        programInfo: items,
      };
    });
  };

  const addProgramInfo = () => {
    setProgram((current) => ({
      ...current,
      programInfo: [
        ...normalizeProgramInfo(current.programInfo),
        {
          key: "custom",
          label: "",
          value: "",
        },
      ],
    }));
  };

  const removeProgramInfo = (index: number) => {
    setProgram((current) => ({
      ...current,
      programInfo: normalizeProgramInfo(current.programInfo).filter(
        (_, itemIndex) => itemIndex !== index,
      ),
    }));
  };

  const saveProgram = async () => {
    try {
      setSaving(true);
      setMessage("");

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

        setProgram(createdProgram);
        setPreviewProgram(createdProgram);
        setMessage("Programa creado correctamente");
        router.refresh();
        return;
      }

      setProgram(nextProgram);
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
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <Link
            href={`/admin/brands/${brand.slug}/programs`}
            className="mb-3 inline-flex items-center gap-2 bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-900 dark:bg-slate-900 dark:hover:bg-slate-800"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver a programs
          </Link>
          <p className="text-sm text-gray-500 dark:text-slate-400">
            {brand.name}
          </p>
          <h1 className="text-3xl font-semibold text-gray-950 dark:text-slate-50">
            {isCreateMode ? "Agregar program" : "Editar programa"}
          </h1>
          {isCreateMode ? (
            <p className="mt-2 text-sm text-gray-600 dark:text-slate-400">
              Campos minimos: Program name y Full title. El slug se genera
              automaticamente desde Full title.
            </p>
          ) : null}
        </div>

        <button
          type="button"
          onClick={saveProgram}
          disabled={saving}
          className="inline-flex items-center gap-2 bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-900 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-[var(--bunji-primary)]"
        >
          <Save className="h-4 w-4" />
          {saving
            ? "Guardando..."
            : isCreateMode
              ? "Crear programa"
              : "Guardar programa"}
        </button>
      </div>

      <div
        className={
          isCreateMode
            ? "grid gap-6 xl:grid-cols-[minmax(0,1.35fr)_minmax(320px,0.65fr)]"
            : "block"
        }
      >
        <section className="grid gap-4 border border-gray-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-950 md:grid-cols-2">
          <SectionTitle title="Informacion base" />
          <Field label="Program name" value={program.title} required onChange={(value) => updateField("title", value)} />
          <Field label="Full title" value={program.fullTitle} required onChange={(value) => updateField("fullTitle", value)} />
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

      {isCreateMode ? null : (
        <>
          <section className="grid gap-4 border border-gray-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-950 md:grid-cols-2">
            <SectionTitle title="Hero" />
            <Field label="Eyebrow" value={program.hero?.eyebrow ?? ""} onChange={(value) => updateHeroField("eyebrow", value)} />
            <Field label="Highlight" value={program.hero?.highlight ?? ""} onChange={(value) => updateHeroField("highlight", value)} />
            <Field label="Title" value={program.hero?.title ?? ""} onChange={(value) => updateHeroField("title", value)} />
            <Field label="Description" value={program.hero?.description ?? ""} onChange={(value) => updateHeroField("description", value)} />
            <Field label="Support text" value={program.hero?.supportText ?? ""} onChange={(value) => updateHeroField("supportText", value)} />
            <Field label="Modality" value={program.hero?.modality ?? ""} onChange={(value) => updateHeroField("modality", value)} />
            <Field label="Semester price" value={program.hero?.semesterPrice ?? ""} onChange={(value) => updateHeroField("semesterPrice", value)} />
            <Field label="Overlay color" value={program.hero?.overlayColor ?? ""} onChange={(value) => updateHeroField("overlayColor", value)} />
            <Field className="md:col-span-2" label="Background image" value={program.hero?.backgroundImage ?? ""} onChange={(value) => updateHeroField("backgroundImage", value)} />
            <Field className="md:col-span-2" label="Person image" value={program.hero?.personImage ?? ""} onChange={(value) => updateHeroField("personImage", value)} />
          </section>

          <section className="space-y-4 border border-gray-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-950">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <SectionTitle title="Program info" />
              <button
                type="button"
                onClick={addProgramInfo}
                className="border border-gray-300 px-3 py-2 text-xs font-semibold text-gray-700 transition hover:bg-gray-50 dark:border-slate-700 dark:text-slate-100 dark:hover:bg-slate-900"
              >
                Agregar dato
              </button>
            </div>

            {normalizeProgramInfo(program.programInfo).map((item, index) => (
              <div key={`${item.key}-${index}`} className="grid gap-3 md:grid-cols-[1fr_1fr_2fr_auto]">
                <Field label="Key" value={item.key ?? ""} onChange={(value) => updateProgramInfo(index, "key", value)} />
                <Field label="Label" value={item.label ?? ""} onChange={(value) => updateProgramInfo(index, "label", value)} />
                <Field label="Value" value={item.value ?? ""} onChange={(value) => updateProgramInfo(index, "value", value)} />
                <button
                  type="button"
                  onClick={() => removeProgramInfo(index)}
                  className="self-end px-3 py-3 text-sm font-semibold text-red-600 dark:text-red-300"
                >
                  Quitar
                </button>
              </div>
            ))}
          </section>

          <section className="grid gap-4 border border-gray-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-950 md:grid-cols-2">
            <SectionTitle title="Formulario" />
            <Field label="Program form name" value={program.form?.programName ?? ""} onChange={(value) => updateFormField("programName", value)} />
            <Field label="Form type" value={program.form?.type ?? ""} onChange={(value) => updateFormField("type", value)} />
            <Field className="md:col-span-2" label="Script URL" value={program.form?.scriptUrl ?? ""} onChange={(value) => updateFormField("scriptUrl", value)} />
            <Field className="md:col-span-2" label="Script code" value={program.form?.scriptCode ?? ""} onChange={(value) => updateFormField("scriptCode", value)} />
          </section>
        </>
      )}

      {message ? (
        <p className="text-sm font-medium text-gray-600 dark:text-slate-300">
          {message}
        </p>
      ) : null}
    </div>
  );
}

function normalizeProgramInfo(
  programInfo: Landing["programInfo"],
): ProgramInfoItem[] {
  return (programInfo ?? []).map((item, index) => {
    if (typeof item === "string") {
      return {
        key: index === 0 ? "degree" : "custom",
        label: index === 0 ? "Titulo otorgado" : `Dato ${index + 1}`,
        value: item,
      };
    }

    return {
      key: item.key ?? "",
      label: item.label ?? "",
      value: item.value ?? "",
    };
  });
}

function SectionTitle({ title }: { title: string }) {
  return (
    <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-gray-500 dark:text-slate-500 md:col-span-2">
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
      <aside className="border border-dashed border-gray-300 bg-white p-6 dark:border-slate-700 dark:bg-slate-950">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500 dark:text-slate-500">
          Preview
        </p>
        <h2 className="mt-4 text-xl font-semibold text-gray-950 dark:text-slate-50">
          Aqui se muestra la informacion del programa
        </h2>
        <p className="mt-3 text-sm leading-6 text-gray-600 dark:text-slate-400">
          Completa los campos minimos y crea el programa para revisar aqui la
          informacion antes de ejecutar el agente de contenido.
        </p>
      </aside>
    );
  }

  return (
    <aside className="border border-gray-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-950">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--bunji-primary)] dark:text-[var(--bunji-primary-muted)]">
        Preview
      </p>
      <h2 className="mt-4 text-2xl font-semibold text-gray-950 dark:text-slate-50">
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
        className="mt-6 inline-flex w-full items-center justify-center gap-2 bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-900 dark:bg-[var(--bunji-primary)]"
      >
        <Bot className="h-4 w-4" />
        {sending ? "Enviando..." : "Ejecutar Agent Content"}
      </button>
      {message ? (
        <p className="mt-3 text-sm font-medium text-gray-600 dark:text-slate-300">
          {message}
        </p>
      ) : null}
    </aside>
  );
}

function PreviewItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs font-semibold uppercase tracking-[0.16em] text-gray-500 dark:text-slate-500">
        {label}
      </dt>
      <dd className="mt-1 break-words text-gray-900 dark:text-slate-100">
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
      <span className="mb-1 block text-sm font-semibold text-gray-900 dark:text-slate-100">
        {label}
        {required ? <span className="text-red-500"> *</span> : null}
      </span>
      <input
        value={value}
        required={required}
        readOnly={readOnly}
        onChange={(event) => onChange(event.target.value)}
        className="w-full border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none focus:border-black focus:ring-1 focus:ring-black/10 read-only:bg-gray-100 read-only:text-gray-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:read-only:bg-slate-950 dark:read-only:text-slate-500"
      />
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
