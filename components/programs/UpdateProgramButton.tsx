"use client";

import { Bot } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

type Props = {
  brandSlug: string;
  programId: string;
};

export default function UpdateProgramButton({ brandSlug, programId }: Props) {
  const router = useRouter();
  const [updating, setUpdating] = useState(false);
  const [message, setMessage] = useState("");

  const updateProgram = async () => {
    try {
      setUpdating(true);
      setMessage("Enviando...");

      const response = await fetch(`/api/program-agent/${brandSlug}/${programId}`, {
        method: "POST",
      });
      const data = (await response.json()) as { ok?: boolean; error?: string };

      if (!response.ok || !data.ok) {
        throw new Error(data.error || "No se pudo actualizar el programa");
      }

      setMessage("Actualizado");
      router.refresh();
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "No se pudo actualizar",
      );
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="inline-flex flex-col items-end gap-1">
      <button
        type="button"
        onClick={updateProgram}
        disabled={updating}
        className="inline-flex items-center gap-2 border border-sky-300 px-3 py-2 text-xs font-semibold text-sky-700 transition hover:bg-sky-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-sky-500/40 dark:text-sky-300 dark:hover:bg-sky-500/10"
      >
        <Bot className="h-3.5 w-3.5" />
        {updating ? "Actualizando..." : "Actualizar"}
      </button>
      {message ? (
        <p className="max-w-40 text-right text-[11px] font-medium text-gray-500 dark:text-slate-400">
          {message}
        </p>
      ) : null}
    </div>
  );
}
