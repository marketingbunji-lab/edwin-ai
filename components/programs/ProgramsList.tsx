import Link from "next/link";
import { Pencil } from "lucide-react";
import DeleteProgramButton from "./DeleteProgramButton";
import UpdateProgramButton from "./UpdateProgramButton";
import type { Brand, Program } from "@/lib/data";

type Props = {
  brand: Brand;
  programs: Program[];
};

export default function ProgramsList({ brand, programs }: Props) {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="admin-eyebrow">
            {brand.name}
          </p>
          <h1 className="admin-title">
            Programs
          </h1>
          <p className="admin-muted mt-2 max-w-2xl">
            Registros base del Agente de Contenido para organizar la oferta
            academica de esta marca.
          </p>
        </div>
      </div>

      {programs.length === 0 ? (
        <section className="admin-empty-state">
          <p className="admin-eyebrow">
            Content Agent
          </p>
          <h2 className="mt-4 text-2xl font-bold tracking-tight text-slate-950 dark:text-slate-50">
            Aun no hay programs registrados
          </h2>
          <p className="admin-muted mx-auto mt-3 max-w-xl">
            Agrega el nombre del programa, sitio fuente y catalogo para empezar
            a alimentar el agente de contenido.
          </p>
        </section>
      ) : (
        <div className="admin-table-shell">
          <table className="w-full min-w-[760px] border-collapse text-left">
            <thead className="admin-table-header">
              <tr>
                <th className="px-5 py-4">Program</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4">Actualizado</th>
                <th className="px-5 py-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-slate-800">
              {programs.map((program) => (
                <tr
                  key={program.id}
                  className="transition hover:bg-slate-50 dark:hover:bg-white/[0.035]"
                >
                  <td className="px-5 py-4">
                    <p className="text-sm font-semibold text-gray-950 dark:text-slate-50">
                      {program.programName}
                    </p>
                    <p className="mt-1 font-mono text-xs text-gray-500 dark:text-slate-500">
                      {program.id}
                    </p>
                  </td>
                  <td className="px-5 py-4">
                    <span className="inline-flex bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300">
                      Activo
                    </span>
                  </td>
                  <td className="px-5 py-4 text-sm text-gray-600 dark:text-slate-400">
                    {program.updatedAt}
                  </td>
                  <td className="px-5 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <Link
                        href={`/admin/brands/${brand.slug}/programs/${program.id}/edit`}
                        className="admin-button-primary px-3 py-2 text-xs"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                        Editar
                      </Link>
                      <UpdateProgramButton
                        brandSlug={brand.slug}
                        programId={program.id}
                      />
                      <DeleteProgramButton
                        brandSlug={brand.slug}
                        programId={program.id}
                        programName={program.programName}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
