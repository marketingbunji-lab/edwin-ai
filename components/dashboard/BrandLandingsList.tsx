"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Copy,
  Eye,
  FileDown,
  Search,
  Trash2,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";
import { useDashboardLanguage } from "@/components/dashboard/DashboardLanguageProvider";
import ExportHtmlButton from "@/components/export/ExportHtmlButton";
import type { LandingCardData } from "./LandingCard";
import { formatCountLabel } from "@/lib/dashboardI18n";

export type BrandLandingListItem = LandingCardData & {
  programType: string;
};

type Props = {
  landings: BrandLandingListItem[];
};

type LandingRowProps = {
  landing: BrandLandingListItem;
};

function normalizeSearchText(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function getSearchableText(landing: BrandLandingListItem) {
  return normalizeSearchText(
    [
      landing.title,
      landing.fullTitle,
      landing.slug,
      landing.status,
      landing.schedule,
      landing.hero?.modality,
      landing.programType,
    ]
      .filter(Boolean)
      .join(" "),
  );
}

function getStatusBadge(status: string, labels: { draft: string; published: string }) {
  const normalized = status.trim().toLowerCase();

  if (normalized === "published") {
    return {
      label: labels.published,
      className:
        "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200 dark:bg-emerald-950/45 dark:text-emerald-200 dark:ring-emerald-900",
    };
  }

  if (normalized === "draft") {
    return {
      label: labels.draft,
      className:
        "bg-amber-50 text-amber-700 ring-1 ring-amber-200 dark:bg-amber-950/45 dark:text-amber-200 dark:ring-amber-900",
    };
  }

  return {
    label: status,
    className:
      "bg-slate-100 text-slate-700 ring-1 ring-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:ring-slate-700",
  };
}

function LandingRow({ landing }: LandingRowProps) {
  const { t } = useDashboardLanguage();
  const router = useRouter();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [duplicating, setDuplicating] = useState(false);
  const [error, setError] = useState("");
  const statusBadge = getStatusBadge(landing.status, {
    draft: t("landings.statusDraft"),
    published: t("landings.statusPublished"),
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

      const response = await fetch(`/api/landings/${landing.brand}/${landing.slug}`, {
        method: "DELETE",
      });
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
    <>
      <tr className="transition hover:bg-slate-50 dark:hover:bg-white/[0.035]">
        <td className="px-5 py-4 align-top">
          <p className="text-sm font-semibold text-slate-950 dark:text-slate-50">
            {landing.fullTitle}
          </p>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            {landing.title}
          </p>
          <p className="mt-2 font-mono text-[11px] text-slate-400 dark:text-slate-500">
            {landing.slug}
          </p>
        </td>
        <td className="px-5 py-4 align-top text-sm text-slate-700 dark:text-slate-300">
          {landing.programType || t("landings.noType")}
        </td>
        <td className="px-5 py-4 align-top">
          <span className="inline-flex rounded-full bg-[var(--bunji-primary-light)] px-2.5 py-1 text-xs font-semibold text-[var(--bunji-primary)] ring-1 ring-[var(--bunji-primary-soft)] dark:bg-[var(--bunji-primary-soft)]/30 dark:text-[var(--bunji-primary-muted)] dark:ring-[var(--bunji-primary-dark)]">
            {landing.hero?.modality || "—"}
          </span>
        </td>
        <td className="px-5 py-4 align-top">
          <span
            className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${statusBadge.className}`}
          >
            {statusBadge.label}
          </span>
        </td>
        <td className="px-5 py-4 align-top text-sm text-slate-600 dark:text-slate-400">
          {landing.updatedAt}
        </td>
        <td className="px-5 py-4 align-top">
          <div className="flex flex-wrap justify-end gap-2">
            <Link
              href={`/admin/brands/${landing.brand}/landings/${landing.slug}`}
              className="admin-button-primary px-3 py-2 text-xs"
            >
              {t("landings.viewDetail")}
            </Link>
            <Link
              href={`/landings/${landing.brand}/${landing.slug}`}
              target="_blank"
              rel="noreferrer"
              className="admin-button-secondary h-9 w-9 p-0"
              aria-label={t("landings.preview")}
              title={t("landings.preview")}
            >
              <Eye className="h-4 w-4" />
            </Link>
            <ExportHtmlButton
              endpoint={`/api/export/${landing.brand}/${landing.slug}`}
              filename={`${landing.brand}-${landing.slug}.html`}
              clientifyEndpoint={`/api/export-clientify/${landing.brand}/${landing.slug}`}
              clientifyFilename={`${landing.brand}-${landing.slug}-clientify.html`}
              icon={<FileDown className="h-4 w-4" />}
              className="admin-button-secondary h-9 w-9 p-0"
              aria-label={t("landings.export")}
              title={t("landings.export")}
            />
            <button
              type="button"
              onClick={duplicateLanding}
              disabled={duplicating || deleting}
              className="admin-button-secondary h-9 w-9 p-0"
              aria-label={duplicating ? t("landings.duplicating") : t("landings.duplicate")}
              title={duplicating ? t("landings.duplicating") : t("landings.duplicate")}
            >
              <Copy className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => {
                setError("");
                setShowDeleteModal(true);
              }}
              disabled={duplicating || deleting}
              className="admin-button-danger h-9 w-9 p-0"
              aria-label={t("landings.delete")}
              title={t("landings.delete")}
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
          {error ? <p className="mt-2 text-right text-xs text-red-600">{error}</p> : null}
        </td>
      </tr>

      {showDeleteModal ? (
        <tr>
          <td colSpan={6}>
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
          </td>
        </tr>
      ) : null}
    </>
  );
}

export default function BrandLandingsList({ landings }: Props) {
  const { language, t } = useDashboardLanguage();
  const [query, setQuery] = useState("");
  const normalizedQuery = normalizeSearchText(query.trim());

  const filteredLandings = useMemo(() => {
    if (!normalizedQuery) return landings;

    return landings.filter((landing) =>
      getSearchableText(landing).includes(normalizedQuery),
    );
  }, [landings, normalizedQuery]);

  return (
    <div className="space-y-8">
      <div className="admin-panel p-4">
        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-slate-950 dark:text-slate-50">
            {t("landings.searchLabel")}
          </span>
          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={t("landings.searchPlaceholder")}
              className="admin-input pl-11 pr-12"
            />
            {query ? (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="absolute right-3 top-1/2 inline-flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-900"
                aria-label={t("landings.clearSearch")}
              >
                <X className="h-4 w-4" />
              </button>
            ) : null}
          </div>
        </label>

        <p className="admin-muted mt-3">
          {language === "en"
            ? `${filteredLandings.length} of ${formatCountLabel(
                language,
                landings.length,
                "landing",
                "landings",
              )}`
            : `${filteredLandings.length} de ${formatCountLabel(
                language,
                landings.length,
                "landing",
                "landings",
              )}`}
        </p>
      </div>

      {filteredLandings.length === 0 ? (
        <div className="admin-empty-state text-slate-500 dark:text-slate-400">
          {t("landings.empty")}
        </div>
      ) : (
        <div className="admin-table-shell">
          <table className="w-full min-w-[980px] border-collapse text-left">
            <thead className="admin-table-header">
              <tr>
                <th className="px-5 py-4">{t("landings.program")}</th>
                <th className="px-5 py-4">{t("landings.category")}</th>
                <th className="px-5 py-4">{t("landings.modality")}</th>
                <th className="px-5 py-4">{t("landings.status")}</th>
                <th className="px-5 py-4">{t("landings.updatedAt")}</th>
                <th className="px-5 py-4 text-right">{t("landings.actions")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-slate-800">
              {filteredLandings.map((landing) => (
                <LandingRow key={landing.slug} landing={landing} />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
