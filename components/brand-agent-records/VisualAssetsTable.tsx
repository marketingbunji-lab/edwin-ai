"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import type {
  VisualAssetCategory,
  VisualAssetRecord,
} from "@/lib/brandAgentRecords";

type Props = {
  brandSlug: string;
  category: VisualAssetCategory;
  records: VisualAssetRecord[];
};

export default function VisualAssetsTable({
  brandSlug,
  category,
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
        `/api/brand-agent-records/${brandSlug}/visual-assets/${recordId}`,
        {
          method: "DELETE",
        },
      );
      const data = (await response.json()) as {
        ok?: boolean;
        error?: string;
      };

      if (!response.ok || !data.ok) {
        throw new Error(data.error || "No se pudo eliminar el asset");
      }

      setMessage("Asset eliminado correctamente");
      router.refresh();
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "No se pudo eliminar el asset",
      );
    } finally {
      setDeletingId("");
    }
  };

  return (
    <div className="space-y-3">
      <section className="admin-table-shell">
        <div className="min-w-[1080px]">
          <div className="admin-table-header grid grid-cols-[96px_minmax(220px,1fr)_minmax(150px,0.4fr)_minmax(260px,1fr)_150px_190px]">
            <span>Preview</span>
            <span>Recurso</span>
            <span>Tipo</span>
            <span>URL</span>
            <span>Actualizado</span>
            <span className="text-right">Acciones</span>
          </div>
          {records.map((record) => (
            <article
              key={record.id}
              className="admin-table-row grid grid-cols-[96px_minmax(220px,1fr)_minmax(150px,0.4fr)_minmax(260px,1fr)_150px_190px] gap-4"
            >
              <div className="flex h-14 w-20 items-center justify-center overflow-hidden rounded-lg border border-slate-200 bg-slate-100 dark:border-slate-800 dark:bg-slate-900">
                {record.url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={record.url}
                    alt={record.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400">
                    Empty
                  </span>
                )}
              </div>
              <div>
                <p className="font-semibold text-slate-950 dark:text-slate-50">
                  {record.name}
                </p>
                <p className="mt-1 font-mono text-xs text-slate-500">
                  {record.id}
                </p>
              </div>
              <p className="text-slate-600 dark:text-slate-300">
                {record.assetType || "Pendiente"}
              </p>
              <p className="truncate text-slate-600 dark:text-slate-400">
                {record.url || "Pendiente"}
              </p>
              <p className="text-slate-500 dark:text-slate-400">
                {record.updatedAt.slice(0, 10)}
              </p>
              <div className="flex justify-end gap-2">
                <Link
                  href={`/admin/brands/${brandSlug}/visual-assets/${category}/${record.id}/edit`}
                  className="admin-button-primary px-3 py-2 text-xs"
                >
                  <Pencil className="h-3.5 w-3.5" />
                  Editar
                </Link>
                <button
                  type="button"
                  onClick={() => deleteRecord(record.id)}
                  disabled={deletingId === record.id}
                  className="admin-button-danger px-3 py-2 text-xs"
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
