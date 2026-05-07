"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";

type Props = {
  brandName: string;
  brandSlug: string;
  source?: "json" | "supabase";
};

export default function DeleteBrandButton({
  brandName,
  brandSlug,
  source = "json",
}: Props) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleDelete() {
    const target =
      source === "supabase"
        ? "el registro de Supabase"
        : "el JSON de la marca";
    const confirmed = window.confirm(
      `Seguro que quieres eliminar la marca "${brandName}"? Esto eliminara ${target}.`
    );

    if (!confirmed) {
      return;
    }

    setIsDeleting(true);

    try {
      const endpoint =
        source === "supabase"
          ? `/api/brands/${encodeURIComponent(brandSlug)}?source=supabase`
          : `/api/brands/${encodeURIComponent(brandSlug)}`;
      const response = await fetch(endpoint, { method: "DELETE" });
      const data = (await response.json()) as {
        ok?: boolean;
        error?: string;
      };

      if (!response.ok || !data.ok) {
        throw new Error(data.error || "No se pudo eliminar la marca");
      }

      router.refresh();
    } catch (error) {
      window.alert(
        error instanceof Error
          ? error.message
          : "No se pudo eliminar la marca"
      );
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={isDeleting}
      className="inline-flex items-center gap-2 rounded-full border border-red-200 px-3 py-1 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-red-900/70 dark:text-red-300 dark:hover:bg-red-950/40"
    >
      <Trash2 className="h-4 w-4" />
      {isDeleting ? "Eliminando" : "Eliminar"}
    </button>
  );
}
