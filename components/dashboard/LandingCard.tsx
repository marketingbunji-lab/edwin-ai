"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  Copy,
  ExternalLink,
  Eye,
  FileDown,
  Moon,
  Sun,
  SunMoon,
  Trash2,
} from "lucide-react";
import { useDashboardLanguage } from "@/components/dashboard/DashboardLanguageProvider";
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

function getModalityBadge(
  modality: string | undefined,
  labels: { onCampus: string; online: string },
) {
  const normalized = modality?.toLowerCase() ?? "";

  if (normalized.includes("presencial")) {
    return {
      label: labels.onCampus,
      className:
        "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200 dark:bg-emerald-950/45 dark:text-emerald-200 dark:ring-emerald-900",
    };
  }

  if (normalized.includes("virtual")) {
    return {
      label: labels.online,
      className:
        "bg-[var(--bunji-primary-light)] text-[var(--bunji-primary)] ring-1 ring-[var(--bunji-primary-soft)] dark:bg-[var(--bunji-primary-soft)]/30 dark:text-[var(--bunji-primary-muted)] dark:ring-[var(--bunji-primary-dark)]",
    };
  }

  return null;
}

function getScheduleBadge(
  schedule: string | undefined,
  labels: { day: string; night: string; flexible: string },
) {
  const normalized = schedule?.toLowerCase().trim() ?? "";

  if (normalized === "diurna") {
    return {
      label: labels.day,
      icon: Sun,
      className:
        "bg-amber-50 text-amber-700 ring-1 ring-amber-200 dark:bg-amber-950/45 dark:text-amber-200 dark:ring-amber-900",
    };
  }

  if (normalized === "nocturna") {
    return {
      label: labels.night,
      icon: Moon,
      className:
        "bg-violet-50 text-violet-700 ring-1 ring-violet-200 dark:bg-violet-950/45 dark:text-violet-200 dark:ring-violet-900",
    };
  }

  if (normalized === "flexible") {
    return {
      label: labels.flexible,
      icon: SunMoon,
      className:
        "bg-slate-100 text-slate-700 ring-1 ring-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:ring-slate-700",
    };
  }

  return null;
}

export default function LandingCard({ landing }: Props) {
  const { t } = useDashboardLanguage();
  const router = useRouter();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [duplicating, setDuplicating] = useState(false);
  const [error, setError] = useState("");
  const modalityBadge = getModalityBadge(landing.hero?.modality, {
    onCampus: t("landings.modalityOnCampus"),
    online: t("landings.modalityOnline"),
  });
  const scheduleBadge = getScheduleBadge(landing.schedule, {
    day: t("landings.scheduleDay"),
    night: t("landings.scheduleNight"),
    flexible: t("landings.scheduleFlexible"),
  });

  const duplicateLanding = async () => {
    try {
      setDuplicating(true);
      setError("");

      const response = await fetch(
        `/api/landings/${landing.brand}/${landing.slug}/duplicate`,
        { method: "POST" },
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || t("landings.duplicateError"));
      }

      router.push(data.redirectTo);
      router.refresh();
    } catch (duplicateError) {
      setError(
        duplicateError instanceof Error
          ? duplicateError.message
          : t("landings.duplicateError"),
      );
    } finally {
      setDuplicating(false);
    }
  };

  const deleteLanding = async () => {
    try {
      setDeleting(true);
      setError("");

      const response = await fetch(
        `/api/landings/${landing.brand}/${landing.slug}`,
        {
          method: "DELETE",
        },
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || t("landings.deleteError"));
      }

      setShowDeleteModal(false);
      router.refresh();
    } catch (deleteError) {
      setError(
        deleteError instanceof Error
          ? deleteError.message
          : t("landings.deleteError"),
      );
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="admin-panel relative p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_46px_rgba(15,23,42,0.12)]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold tracking-tight text-slate-950 dark:text-slate-50">
            {landing.title}
          </h3>
          <p className="admin-muted">{landing.fullTitle}</p>
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

      <div className="mt-4 space-y-1 rounded-xl border border-slate-200 bg-slate-50/70 p-3 text-sm text-slate-600 dark:border-white/10 dark:bg-white/[0.03] dark:text-slate-300">
        <p>
          <strong>{t("landings.slug")}:</strong> {landing.slug}
        </p>
        <p>
          <strong>{t("landings.updatedAt")}:</strong> {landing.updatedAt}
        </p>
      </div>

      <div className="mt-5 flex flex-wrap gap-3">
        <Link
          href={`/admin/brands/${landing.brand}/landings/${landing.slug}`}
          className="admin-button-primary py-2"
          style={{ backgroundColor: "var(--bunji-primary)", color: "#fff" }}
        >
          <ExternalLink className="h-4 w-4" />
          {t("landings.viewDetail")}
        </Link>

        <Link
          href={`/landings/${landing.brand}/${landing.slug}`}
          target="_blank"
          rel="noreferrer"
          className="admin-button-secondary py-2"
        >
          <Eye className="h-4 w-4" />
          {t("landings.preview")}
        </Link>

        <ExportHtmlButton
          endpoint={`/api/export/${landing.brand}/${landing.slug}`}
          filename={`${landing.brand}-${landing.slug}.html`}
          clientifyEndpoint={`/api/export-clientify/${landing.brand}/${landing.slug}`}
          clientifyFilename={`${landing.brand}-${landing.slug}-clientify.html`}
          icon={<FileDown className="h-4 w-4" />}
          className="admin-button-secondary py-2"
          style={{ backgroundColor: "var(--bunji-primary-muted)", color: "#fff" }}
        >
          {t("landings.export")}
        </ExportHtmlButton>

        <button
          type="button"
          onClick={duplicateLanding}
          disabled={duplicating || deleting}
          className="admin-button-secondary py-2"
        >
          <Copy className="h-4 w-4" />
          {duplicating ? t("landings.duplicating") : t("landings.duplicate")}
        </button>

        <button
          type="button"
          onClick={() => {
            setError("");
            setShowDeleteModal(true);
          }}
          disabled={duplicating || deleting}
          className="admin-button-danger py-2"
        >
          <Trash2 className="h-4 w-4" />
          {t("landings.delete")}
        </button>
      </div>

      {error ? <p className="mt-3 text-sm text-red-600">{error}</p> : null}

      {showDeleteModal ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby={`delete-${landing.slug}-title`}
            className="admin-panel w-full max-w-md p-6"
          >
            <h2
              id={`delete-${landing.slug}-title`}
              className="text-lg font-semibold text-gray-900 dark:text-slate-50"
            >
              {t("landings.deleteTitle")}
            </h2>
            <p className="mt-2 text-sm text-gray-600 dark:text-slate-300">
              {t("landings.deleteBody", { title: landing.fullTitle })}
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                disabled={deleting}
                className="admin-button-secondary py-2"
              >
                {t("landings.cancel")}
              </button>
              <button
                type="button"
                onClick={deleteLanding}
                disabled={deleting}
                className="admin-button-danger bg-red-600 py-2 text-white hover:bg-red-700 dark:bg-red-600 dark:text-white dark:hover:bg-red-700"
              >
                <Trash2 className="h-4 w-4" />
                {deleting ? t("landings.deleting") : t("landings.confirmDelete")}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
