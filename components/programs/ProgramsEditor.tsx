"use client";

import Link from "next/link";
import { ArrowLeft, Plus, Save, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Brand, Program } from "@/lib/data";

type Props = {
  brand: Brand;
  initialPrograms: Program[];
};

export default function ProgramsEditor({ brand, initialPrograms }: Props) {
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
        throw new Error(data.error || "No se pudieron guardar los programs");
      }

      setPrograms(data.programs ?? programs);
      setMessage("Programs guardados correctamente");
      router.refresh();
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "No se pudieron guardar los programs",
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
            Editar Programs
          </h1>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={addProgram}
            className="inline-flex items-center gap-2 border border-gray-300 bg-white px-4 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
          >
            <Plus className="h-4 w-4" />
            Agregar program
          </button>
          <button
            type="button"
            onClick={savePrograms}
            disabled={saving}
            className="inline-flex items-center gap-2 bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-900 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-[var(--bunji-primary)]"
          >
            <Save className="h-4 w-4" />
            {saving ? "Guardando..." : "Guardar"}
          </button>
        </div>
      </div>

      <div className="grid gap-4">
        {programs.map((program, index) => (
          <section
            key={program.id}
            className="border border-gray-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-950"
          >
            <div className="mb-4 flex items-center justify-between gap-4">
              <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-gray-500 dark:text-slate-500">
                Program {index + 1}
              </h2>
              <button
                type="button"
                onClick={() => removeProgram(index)}
                className="inline-flex items-center gap-2 text-sm font-semibold text-red-600 dark:text-red-300"
              >
                <Trash2 className="h-4 w-4" />
                Eliminar
              </button>
            </div>

            <div className="grid gap-4">
              <Field
                label="Program name"
                value={program.programName}
                onChange={(value) => updateProgram(index, "programName", value)}
              />
              <Field
                label="Source website"
                value={program.sourceWebsite}
                onChange={(value) =>
                  updateProgram(index, "sourceWebsite", value)
                }
              />
              <Field
                label="Catalogo"
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
          className="w-full border border-dashed border-gray-300 bg-white p-10 text-center text-sm font-semibold text-gray-600 transition hover:bg-gray-50 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-300"
        >
          Agregar primer program
        </button>
      ) : null}

      {message ? (
        <p className="text-sm font-medium text-gray-600 dark:text-slate-300">
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
      <span className="mb-1 block text-sm font-semibold text-gray-900 dark:text-slate-100">
        {label}
      </span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-md border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none focus:border-black focus:ring-1 focus:ring-black/10 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
      />
    </label>
  );
}
