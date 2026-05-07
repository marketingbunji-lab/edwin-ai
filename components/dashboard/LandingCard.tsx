"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Copy, ExternalLink, FileDown, Moon, Sun, SunMoon, Trash2 } from "lucide-react";
import ExportHtmlButton from "@/components/export/ExportHtmlButton";

type Props = {
  landing: LandingCardData;
};

export type LandingCardData = {
  slug: string;
  brand: string;
  title: string;
  fullTitle: string;
  template: string;
  status: string;
  updatedAt: string;
  schedule?: string;
  hero?: {
    modality?: string;
  };
};

function getModalityBadge(modality?: string) {
  const normalized = modality?.toLowerCase() ?? "";

  if (normalized.includes("presencial")) {
    return {
      label: "Presencial",
      className:
        "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200 dark:bg-emerald-950/45 dark:text-emerald-200 dark:ring-emerald-900",
    };
  }

  if (normalized.includes("virtual")) {
    return {
      label: "Virtual",
      className:
        "bg-[var(--bunji-primary-light)] text-[var(--bunji-primary)] ring-1 ring-[var(--bunji-primary-soft)] dark:bg-[var(--bunji-primary-soft)]/30 dark:text-[var(--bunji-primary-muted)] dark:ring-[var(--bunji-primary-dark)]",
    };
  }

  return null;
}

function getScheduleBadge(schedule?: string) {
  const normalized = schedule?.toLowerCase().trim() ?? "";

  if (normalized === "diurna") {
    return {
      label: "Diurna",
      icon: Sun,
      className:
        "bg-amber-50 text-amber-700 ring-1 ring-amber-200 dark:bg-amber-950/45 dark:text-amber-200 dark:ring-amber-900",
    };
  }

  if (normalized === "nocturna") {
    return {
      label: "Nocturna",
      icon: Moon,
      className:
        "bg-violet-50 text-violet-700 ring-1 ring-violet-200 dark:bg-violet-950/45 dark:text-violet-200 dark:ring-violet-900",
    };
  }

  if (normalized === "flexible") {
    return {
      label: "Flexible",
      icon: SunMoon,
      className:
        "bg-slate-100 text-slate-700 ring-1 ring-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:ring-slate-700",
    };
  }

  return null;
}

export default function LandingCard({ landing }: Props) {
  const router = useRouter();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [duplicating, setDuplicating] = useState(false);
  const [error, setError] = useState("");
  const modalityBadge = getModalityBadge(landing.hero?.modality);
  const scheduleBadge = getScheduleBadge(landing.schedule);

  const duplicateLanding = async () => {
    try {
      setDuplicating(true);
      setError("");

      const response = await fetch(
        `/api/landings/${landing.brand}/${landing.slug}/duplicate`,
        { method: "POST" }
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "No se pudo duplicar la landing");
      }

      router.push(data.redirectTo);
      router.refresh();
    } catch (error) {
      setError(error instanceof Error ? error.message : "No se pudo duplicar");
    } finally {
      setDuplicating(false);
    }
  };

  const deleteLanding = async () => {
    try {
      setDeleting(true);
      setError("");

      const response = await fetch(`/api/landings/${landing.brand}/${landing.slug}`, {
        method: "DELETE",
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "No se pudo eliminar la landing");
      }

      setShowDeleteModal(false);
      router.refresh();
    } catch (error) {
      setError(error instanceof Error ? error.message : "No se pudo eliminar");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="relative border border-gray-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-950">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold dark:text-slate-50">{landing.title}</h3>
          <p className="text-sm text-gray-500 dark:text-slate-400">{landing.fullTitle}</p>
        </div>

        <div className="flex shrink-0 flex-col items-end gap-2">
          {scheduleBadge ? (
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${scheduleBadge.className}`}
            >
              <scheduleBadge.icon className="h-3.5 w-3.5" />
              {scheduleBadge.label}
            </span>
          ) : null}

          {modalityBadge ? (
            <span
              className={`rounded-full px-3 py-1 text-xs font-medium ${modalityBadge.className}`}
            >
              {modalityBadge.label}
            </span>
          ) : null}

          <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700 dark:bg-slate-800 dark:text-slate-200">
            {landing.status}
          </span>
        </div>
      </div>

      <div className="mt-4 space-y-1 text-sm text-gray-600 dark:text-slate-300">
        <p>
          <strong>Template:</strong> {landing.template}
        </p>
        <p>
          <strong>Slug:</strong> {landing.slug}
        </p>
        <p>
          <strong>Actualizado:</strong> {landing.updatedAt}
        </p>
      </div>

      <div className="mt-5 flex flex-wrap gap-3">
        <Link
          href={`/admin/brands/${landing.brand}/${landing.slug}`}
          className="bunji-button-primary inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium"
          style={{ backgroundColor: "var(--bunji-primary)", color: "#fff" }}
        >
          <ExternalLink className="h-4 w-4" />
          Ver detalle
        </Link>

        <ExportHtmlButton
          endpoint={`/api/export/${landing.brand}/${landing.slug}`}
          filename={`${landing.brand}-${landing.slug}.html`}
          clientifyEndpoint={`/api/export-clientify/${landing.brand}/${landing.slug}`}
          clientifyFilename={`${landing.brand}-${landing.slug}-clientify.html`}
          icon={<FileDown className="h-4 w-4" />}
          className="bunji-button-secondary rounded-lg px-4 py-2 text-sm font-medium"
          style={{ backgroundColor: "var(--bunji-primary-muted)", color: "#fff" }}
        >
          Exportar
        </ExportHtmlButton>

        <button
          type="button"
          onClick={duplicateLanding}
          disabled={duplicating || deleting}
          className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:text-slate-100"
        >
          <Copy className="h-4 w-4" />
          {duplicating ? "Duplicando..." : "Duplicar"}
        </button>

        <button
          type="button"
          onClick={() => {
            setError("");
            setShowDeleteModal(true);
          }}
          disabled={duplicating || deleting}
          className="inline-flex items-center gap-2 rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-red-900/60 dark:text-red-300 dark:hover:bg-red-950/40"
        >
          <Trash2 className="h-4 w-4" />
          Eliminar
        </button>
      </div>

      {error ? <p className="mt-3 text-sm text-red-600">{error}</p> : null}

      {showDeleteModal ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby={`delete-${landing.slug}-title`}
            className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-xl dark:border-slate-700 dark:bg-slate-950"
          >
            <h2
              id={`delete-${landing.slug}-title`}
              className="text-lg font-semibold text-gray-900 dark:text-slate-50"
            >
              Eliminar landing
            </h2>
            <p className="mt-2 text-sm text-gray-600 dark:text-slate-300">
              Vas a eliminar <strong>{landing.fullTitle}</strong>. Esta acción no se
              puede deshacer.
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                disabled={deleting}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 disabled:opacity-60 dark:border-slate-700 dark:text-slate-100"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={deleteLanding}
                disabled={deleting}
                className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
              >
                <Trash2 className="h-4 w-4" />
                {deleting ? "Eliminando..." : "Sí, eliminar"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
