"use client";

import Link from "next/link";
import { ArrowLeft, Plus, Save, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useDashboardLanguage } from "@/components/dashboard/DashboardLanguageProvider";
import type { Brand, Program } from "@/lib/data";

type Props = {
  brand: Brand;
  initialPrograms: Program[];
};

export default function ProgramsEditor({ brand, initialPrograms }: Props) {
  const { t } = useDashboardLanguage();
  const router = useRouter();
  const [programs, setPrograms] = useState<Program[]>(initialPrograms);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const addProgram = () => {
    setPrograms((current) => [
      ...current,
      {
        id: crypto.randomUUID(),
        programName: "",
        sourceWebsite: "",
        catalog: "",
        updatedAt: new Date().toISOString().slice(0, 10),
      },
    ]);
  };

  const updateProgram = (
    index: number,
    field: keyof Pick<Program, "programName" | "sourceWebsite" | "catalog">,
    value: string,
  ) => {
    setPrograms((current) =>
      current.map((program, itemIndex) =>
        itemIndex === index
          ? {
              ...program,
              [field]: value,
            }
          : program,
      ),
    );
  };

  const removeProgram = (index: number) => {
    setPrograms((current) =>
      current.filter((_, itemIndex) => itemIndex !== index),
    );
  };

  const savePrograms = async () => {
    try {
      setSaving(true);
      setMessage("");

      const response = await fetch(`/api/programs/${brand.slug}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ programs }),
      });
      const data = (await response.json()) as {
        ok?: boolean;
        error?: string;
        programs?: Program[];
      };

      if (!response.ok || !data.ok) {
        throw new Error(data.error || t("programsEditor.saveError"));
      }

      setPrograms(data.programs ?? programs);
      setMessage(t("programsEditor.saveSuccess"));
      router.refresh();
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : t("programsEditor.saveError"),
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
            className="admin-button-secondary admin-button-icon mb-3"
            aria-label={t("programsEditor.backToPrograms")}
            title={t("programsEditor.backToPrograms")}
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <h1 className="admin-title">{t("programsEditor.title")}</h1>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={addProgram}
            className="admin-button-secondary"
          >
            <Plus className="h-4 w-4" />
            {t("programsEditor.addProgram")}
          </button>
          <button
            type="button"
            onClick={savePrograms}
            disabled={saving}
            className="admin-button-primary"
          >
            <Save className="h-4 w-4" />
            {saving ? t("programsEditor.saving") : t("programsEditor.save")}
          </button>
        </div>
      </div>

      <div className="grid gap-4">
        {programs.map((program, index) => (
          <section key={program.id} className="admin-panel p-5">
            <div className="mb-4 flex items-center justify-between gap-4">
              <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-500">
                {t("programsEditor.programLabel")} {index + 1}
              </h2>
              <button
                type="button"
                onClick={() => removeProgram(index)}
                className="inline-flex items-center gap-2 text-sm font-semibold text-red-600 dark:text-red-300"
              >
                <Trash2 className="h-4 w-4" />
                {t("programsEditor.remove")}
              </button>
            </div>

            <div className="grid gap-4">
              <Field
                label={t("programsEditor.fields.programName")}
                value={program.programName}
                onChange={(value) => updateProgram(index, "programName", value)}
              />
              <Field
                label={t("programsEditor.fields.sourceWebsite")}
                value={program.sourceWebsite}
                onChange={(value) =>
                  updateProgram(index, "sourceWebsite", value)
                }
              />
              <Field
                label={t("programsEditor.fields.catalog")}
                value={program.catalog}
                onChange={(value) => updateProgram(index, "catalog", value)}
              />
            </div>
          </section>
        ))}
      </div>

      {programs.length === 0 ? (
        <button
          type="button"
          onClick={addProgram}
          className="admin-empty-state w-full text-sm font-semibold text-slate-600 transition hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-white/[0.04]"
        >
          {t("programsEditor.addFirstProgram")}
        </button>
      ) : null}

      {message ? (
        <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
          {message}
        </p>
      ) : null}
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-semibold text-slate-950 dark:text-slate-100">
        {label}
      </span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="admin-input"
      />
    </label>
  );
}
