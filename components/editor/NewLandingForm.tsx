"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowRight, FileStack } from "lucide-react";
import type { Program } from "@/lib/data";

type Props = {
  brandSlug: string;
  programs: Program[];
  totalProgramCount: number;
};

export default function NewLandingForm({
  brandSlug,
  programs,
  totalProgramCount,
}: Props) {
  const router = useRouter();
  const [selectedProgramId, setSelectedProgramId] = useState(
    programs[0]?.id ?? "",
  );
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const selectedProgram = programs.find(
    (program) => program.id === selectedProgramId,
  );

  const handleCreate = async () => {
    if (!selectedProgram) {
      setMessage("Selecciona un programa base antes de crear la landing.");
      return;
    }

    try {
      setSaving(true);
      setMessage("");

      const res = await fetch(`/api/landings/${brandSlug}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          slug: selectedProgram.id,
          title: selectedProgram.programName,
          fullTitle: selectedProgram.programName,
          sourceWebsite: selectedProgram.sourceWebsite,
          catalog: selectedProgram.catalog,
          sourceProgramId: selectedProgram.id,
          sourceProgramSlug: selectedProgram.id,
          template: "DefaultLanding",
        }),
      });

      const data = (await res.json()) as {
        error?: string;
        redirectTo?: string;
      };

      if (!res.ok || !data.redirectTo) {
        throw new Error(data.error || "No se pudo crear la landing");
      }

      router.push(data.redirectTo);
    } catch (error: unknown) {
      setMessage(error instanceof Error ? error.message : "Ocurrio un error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="admin-panel p-8">
      <div className="mb-6">
        <h1 className="admin-title">Nueva landing</h1>
        <p className="admin-muted mt-2">
          Crea una landing editable desde un programa sin modificar la data base
          del programa.
        </p>
      </div>

      {programs.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50/70 p-6 dark:border-white/10 dark:bg-white/[0.03]">
          <FileStack className="h-8 w-8 text-[var(--bunji-primary)]" />
          <h2 className="mt-4 text-xl font-bold text-slate-950 dark:text-slate-50">
            {totalProgramCount > 0
              ? "Todos los programas ya tienen landing"
              : "Primero necesitas un programa"}
          </h2>
          <p className="admin-muted mt-2">
            {totalProgramCount > 0
              ? "No hay programas disponibles para crear otra landing. Si necesitas una variante, duplica una landing existente desde la lista."
              : "Las landings nacen como una copia editable de un programa. Crea o actualiza un programa antes de continuar."}
          </p>
          {totalProgramCount > 0 ? (
            <Link
              href={`/admin/brands/${brandSlug}/landings`}
              className="admin-button-primary mt-5 inline-flex"
            >
              Ver landings
              <ArrowRight className="h-4 w-4" />
            </Link>
          ) : (
            <Link
              href={`/admin/brands/${brandSlug}/programs/new`}
              className="admin-button-primary mt-5 inline-flex"
            >
              Crear programa
              <ArrowRight className="h-4 w-4" />
            </Link>
          )}
        </div>
      ) : (
        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_360px]">
          <div className="rounded-2xl border border-slate-200 bg-white/70 p-5 shadow-sm dark:border-white/10 dark:bg-white/[0.03]">
            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-slate-950 dark:text-slate-200">
                Programa base
              </span>
              <select
                value={selectedProgramId}
                onChange={(event) => setSelectedProgramId(event.target.value)}
                className="admin-input"
              >
                {programs.map((program) => (
                  <option key={program.id} value={program.id}>
                    {program.programName}
                  </option>
                ))}
              </select>
            </label>

            <p className="admin-muted mt-3">
              EDwin creara una copia independiente para el editor de landings.
              Los cambios de textos, precios o imagenes no tocaran el programa
              original.
            </p>
          </div>

          <div className="rounded-2xl border border-[var(--bunji-primary-soft)] bg-[var(--bunji-primary-light)]/60 p-5 dark:border-white/10 dark:bg-white/[0.04]">
            <p className="admin-eyebrow">Preview</p>
            <h2 className="mt-3 text-xl font-bold text-slate-950 dark:text-slate-50">
              {selectedProgram?.programName ?? "Selecciona un programa"}
            </h2>
            <dl className="mt-4 space-y-3 text-sm">
              <div>
                <dt className="font-semibold text-slate-500 dark:text-slate-400">
                  Slug del programa
                </dt>
                <dd className="mt-1 font-mono text-slate-900 dark:text-slate-100">
                  {selectedProgram?.id ?? "Pendiente"}
                </dd>
              </div>
              <div>
                <dt className="font-semibold text-slate-500 dark:text-slate-400">
                  Sitio fuente
                </dt>
                <dd className="mt-1 break-words text-slate-900 dark:text-slate-100">
                  {selectedProgram?.sourceWebsite || "Sin sitio fuente"}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      )}

      <div className="mt-6 flex items-center gap-3">
        <button
          type="button"
          onClick={handleCreate}
          disabled={saving || programs.length === 0}
          className="admin-button-primary px-5"
        >
          {saving ? "Creando..." : "Crear landing"}
        </button>

        {message ? (
          <p className="text-sm text-red-600 dark:text-red-300">{message}</p>
        ) : null}
      </div>
    </div>
  );
}
