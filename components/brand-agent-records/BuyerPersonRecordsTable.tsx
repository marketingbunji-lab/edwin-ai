"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import type { BuyerPersonRecord } from "@/lib/brandAgentRecords";

type Props = {
  brandSlug: string;
  records: BuyerPersonRecord[];
};

export default function BuyerPersonRecordsTable({
  brandSlug,
  records,
}: Props) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState("");
  const [message, setMessage] = useState("");

  const deleteRecord = async (recordId: string) => {
    try {
      setDeletingId(recordId);
      setMessage("");

      const response = await fetch(
        `/api/brand-agent-records/${brandSlug}/buyer-person/${recordId}`,
        {
          method: "DELETE",
        },
      );
      const data = (await response.json()) as {
        ok?: boolean;
        error?: string;
      };

      if (!response.ok || !data.ok) {
        throw new Error(data.error || "No se pudo eliminar el buyer person");
      }

      setMessage("Buyer person eliminado correctamente");
      router.refresh();
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "No se pudo eliminar el buyer person",
      );
    } finally {
      setDeletingId("");
    }
  };

  return (
    <div className="space-y-3">
      <section className="overflow-x-auto border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
        <div className="min-w-[1060px]">
          <div className="grid grid-cols-[minmax(220px,1fr)_minmax(160px,0.5fr)_minmax(240px,1fr)_150px_260px] bg-slate-100 px-5 py-4 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:bg-slate-900 dark:text-slate-400">
            <span>Perfil</span>
            <span>Etapa</span>
            <span>Motivaciones</span>
            <span>Actualizado</span>
            <span className="text-right">Acciones</span>
          </div>
          {records.map((record) => (
            <article
              key={record.id}
              className="grid grid-cols-[minmax(220px,1fr)_minmax(160px,0.5fr)_minmax(240px,1fr)_150px_260px] gap-4 border-t border-slate-200 px-5 py-4 text-sm dark:border-slate-800"
            >
              <div>
                <p className="font-semibold text-slate-950 dark:text-slate-50">
                  {record.profileName}
                </p>
                <p className="mt-1 font-mono text-xs text-slate-500">
                  {record.id}
                </p>
              </div>
              <p className="text-slate-600 dark:text-slate-300">
                {record.stage || "Pendiente"}
              </p>
              <p className="line-clamp-2 text-slate-600 dark:text-slate-400">
                {record.motivations.length
                  ? record.motivations.join(", ")
                  : "Pendiente"}
              </p>
              <p className="text-slate-500 dark:text-slate-400">
                {record.metadata.updatedAt}
              </p>
              <div className="flex justify-end gap-2">
                <Link
                  href={`/admin/brands/${brandSlug}/buyer-person/${record.id}`}
                  className="inline-flex items-center gap-2 border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-white/5"
                >
                  <Eye className="h-3.5 w-3.5" />
                  Ver
                </Link>
                <Link
                  href={`/admin/brands/${brandSlug}/buyer-person/${record.id}/edit`}
                  className="inline-flex items-center gap-2 bg-[var(--bunji-primary)] px-3 py-2 text-xs font-semibold text-white transition hover:brightness-110"
                >
                  <Pencil className="h-3.5 w-3.5" />
                  Editar
                </Link>
                <button
                  type="button"
                  onClick={() => deleteRecord(record.id)}
                  disabled={deletingId === record.id}
                  className="inline-flex items-center gap-2 border border-red-500/40 px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60 dark:text-red-300 dark:hover:bg-red-500/10"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  {deletingId === record.id ? "Eliminando..." : "Eliminar"}
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      {message ? (
        <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
          {message}
        </p>
      ) : null}
    </div>
  );
}
