"use client";

import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

type Props = {
  brandSlug: string;
  programId: string;
  programName: string;
};

export default function DeleteProgramButton({
  brandSlug,
  programId,
  programName,
}: Props) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  const deleteProgram = async () => {
    const confirmed = window.confirm(
      `¿Eliminar el programa "${programName}"? Esta acción no se puede deshacer.`,
    );

    if (!confirmed) return;

    try {
      setDeleting(true);
      const response = await fetch(`/api/landings/${brandSlug}/${programId}`, {
        method: "DELETE",
      });
      const data = (await response.json()) as { ok?: boolean; error?: string };

      if (!response.ok || !data.ok) {
        throw new Error(data.error || "No se pudo eliminar el programa");
      }

      router.refresh();
    } catch (error) {
      window.alert(
        error instanceof Error ? error.message : "No se pudo eliminar el programa",
      );
    } finally {
      setDeleting(false);
    }
  };

  return (
    <button
      type="button"
      onClick={deleteProgram}
      disabled={deleting}
      className="inline-flex items-center gap-2 border border-red-200 px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-red-500/30 dark:text-red-300 dark:hover:bg-red-500/10"
    >
      <Trash2 className="h-3.5 w-3.5" />
      {deleting ? "Eliminando..." : "Eliminar"}
    </button>
  );
}
