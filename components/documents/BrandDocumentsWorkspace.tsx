"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  FileText,
  Link2,
  MoreHorizontal,
  Trash2,
  UploadCloud,
  X,
} from "lucide-react";
import { useDashboardLanguage } from "@/components/dashboard/DashboardLanguageProvider";
import type {
  BrandDocumentCategoryId,
  BrandDocumentSourceMode,
  BrandDocuments,
} from "@/lib/data";

type DocumentCategoryState = {
  file: File | null;
  fileName: string;
  fileUrl: string;
  link: string;
  mode: BrandDocumentSourceMode;
  deleted: boolean;
};

type DocumentCategoryConfig = {
  id: BrandDocumentCategoryId;
  labelKey:
    | "documentsPage.legalTab"
    | "documentsPage.catalogsTab"
    | "documentsPage.brandBookTab"
    | "documentsPage.curriculumTab"
    | "documentsPage.websiteTab";
};

const categories: DocumentCategoryConfig[] = [
  { id: "legal", labelKey: "documentsPage.legalTab" },
  { id: "catalogs", labelKey: "documentsPage.catalogsTab" },
  { id: "brandBook", labelKey: "documentsPage.brandBookTab" },
  { id: "curriculum", labelKey: "documentsPage.curriculumTab" },
  { id: "website", labelKey: "documentsPage.websiteTab" },
];

const defaultState: Record<BrandDocumentCategoryId, DocumentCategoryState> = {
  legal: {
    mode: "file",
    file: null,
    fileName: "",
    fileUrl: "",
    link: "",
    deleted: false,
  },
  catalogs: {
    mode: "file",
    file: null,
    fileName: "",
    fileUrl: "",
    link: "",
    deleted: false,
  },
  brandBook: {
    mode: "file",
    file: null,
    fileName: "",
    fileUrl: "",
    link: "",
    deleted: false,
  },
  curriculum: {
    mode: "file",
    file: null,
    fileName: "",
    fileUrl: "",
    link: "",
    deleted: false,
  },
  website: {
    mode: "link",
    file: null,
    fileName: "",
    fileUrl: "",
    link: "",
    deleted: false,
  },
};

type Props = {
  formId: string;
  brandSlug: string;
  initialDocuments?: BrandDocuments;
  initialIdentityManual?: string;
  initialWebsite?: string;
  universityName: string;
  universityOfficialName: string;
  universitySummary?: string;
  universityLogo?: string;
  brandCoverImage?: string;
  brandAssetCount: number;
  programCount: number;
  programTypes: string[];
};

function shortenSummary(value: string, maxLength = 220) {
  const normalized = value.replace(/\s+/g, " ").trim();

  if (normalized.length <= maxLength) return normalized;

  return `${normalized.slice(0, maxLength).trimEnd()}…`;
}

function buildInitialState(
  initialDocuments: BrandDocuments | undefined,
  initialIdentityManual: string | undefined,
  initialWebsite: string | undefined,
) {
  const nextState: Record<BrandDocumentCategoryId, DocumentCategoryState> = {
    ...defaultState,
  };

  for (const category of categories) {
    const currentDocument = initialDocuments?.[category.id];

    if (!currentDocument) {
      continue;
    }

    nextState[category.id] = {
      file: null,
      mode: currentDocument.mode === "link" ? "link" : "file",
      fileName: currentDocument.fileName || "",
      fileUrl: currentDocument.fileUrl || "",
      link: currentDocument.link || "",
      deleted: Boolean(currentDocument.deleted),
    };
  }

  if (
    !nextState.brandBook.fileName &&
    !nextState.brandBook.fileUrl &&
    !nextState.brandBook.link &&
    !nextState.brandBook.deleted &&
    initialIdentityManual
  ) {
    const trimmedValue = initialIdentityManual.trim();
    const inferredFileName = trimmedValue.split("/").pop() || "";
    const looksLikeUpload = trimmedValue.startsWith("/uploads/");

    nextState.brandBook = looksLikeUpload
      ? {
          file: null,
          mode: "file",
          fileName: inferredFileName,
          fileUrl: trimmedValue,
          link: "",
          deleted: false,
        }
      : {
          file: null,
          mode: "link",
          fileName: "",
          fileUrl: "",
          link: trimmedValue,
          deleted: false,
        };
  }

  if (
    !nextState.website.fileName &&
    !nextState.website.fileUrl &&
    !nextState.website.link &&
    !nextState.website.deleted &&
    initialWebsite?.trim()
  ) {
    nextState.website = {
      file: null,
      mode: "link",
      fileName: "",
      fileUrl: "",
      link: initialWebsite.trim(),
      deleted: false,
    };
  }

  return nextState;
}

export default function BrandDocumentsWorkspace({
  formId,
  brandSlug,
  initialDocuments,
  initialIdentityManual,
  initialWebsite,
  universityName,
  universityOfficialName,
  universitySummary = "",
  universityLogo = "",
  brandCoverImage = "",
  brandAssetCount,
  programCount,
  programTypes,
}: Props) {
  const { t } = useDashboardLanguage();
  const [activeTab, setActiveTab] = useState<BrandDocumentCategoryId>("legal");
  const [expandedCategory, setExpandedCategory] =
    useState<BrandDocumentCategoryId | null>("legal");
  const [sourceModalCategory, setSourceModalCategory] =
    useState<BrandDocumentCategoryId | null>(null);
  const [openOptionsCategory, setOpenOptionsCategory] =
    useState<BrandDocumentCategoryId | null>(null);
  const [documents, setDocuments] = useState<
    Record<BrandDocumentCategoryId, DocumentCategoryState>
  >(() =>
    buildInitialState(initialDocuments, initialIdentityManual, initialWebsite),
  );
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [messageTone, setMessageTone] = useState<"success" | "error">(
    "success",
  );
  const inputRefs = useRef<
    Partial<Record<BrandDocumentCategoryId, HTMLInputElement | null>>
  >({});

  const activeDocument = documents[activeTab];

  useEffect(() => {
    if (!sourceModalCategory) return;

    const previousOverflow = document.body.style.overflow;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSourceModalCategory(null);
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", closeOnEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [sourceModalCategory]);

  function updateCategory(
    categoryId: BrandDocumentCategoryId,
    nextState: Partial<DocumentCategoryState>,
  ) {
    setDocuments((current) => ({
      ...current,
      [categoryId]: {
        ...current[categoryId],
        ...nextState,
      },
    }));
  }

  function handleFileSelection(
    categoryId: BrandDocumentCategoryId,
    fileList: FileList | null,
  ) {
    const file = fileList?.[0];

    if (!file) {
      return;
    }

    updateCategory(categoryId, {
      file,
      mode: "file",
      fileName: file.name,
      fileUrl: "",
      deleted: false,
    });
    setMessage("");
  }

  async function persistDocuments(
    nextDocuments: Record<BrandDocumentCategoryId, DocumentCategoryState>,
  ) {
    const formData = new FormData();
    const payload = categories.reduce<
      Partial<
        Record<
          BrandDocumentCategoryId,
          {
            mode: BrandDocumentSourceMode;
            fileName: string;
            fileUrl: string;
            link: string;
            deleted: boolean;
          }
        >
      >
    >((current, category) => {
      const currentDocument = nextDocuments[category.id];

      current[category.id] = {
        mode: currentDocument.mode,
        fileName: currentDocument.fileName,
        fileUrl: currentDocument.fileUrl,
        link: currentDocument.link.trim(),
        deleted: currentDocument.deleted,
      };

      if (currentDocument.file) {
        formData.append(`${category.id}File`, currentDocument.file);
      }

      return current;
    }, {});

    formData.append("documents", JSON.stringify(payload));

    const response = await fetch(`/api/brands/${brandSlug}/documents`, {
      method: "PUT",
      body: formData,
    });
    const responseData = (await response.json()) as {
      ok?: boolean;
      error?: string;
      documents?: BrandDocuments;
    };

    if (!response.ok || !responseData.ok) {
      throw new Error(responseData.error || t("documentsPage.saveError"));
    }

    const savedState = structuredClone(nextDocuments);

    for (const category of categories) {
      const savedDocument = responseData.documents?.[category.id];

      savedState[category.id] = {
        file: null,
        mode: savedDocument?.mode === "link" ? "link" : "file",
        fileName: savedDocument?.fileName || "",
        fileUrl: savedDocument?.fileUrl || "",
        link: savedDocument?.link || "",
        deleted: Boolean(savedDocument?.deleted),
      };
    }

    setDocuments(savedState);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setMessage("");
    setMessageTone("success");

    try {
      await persistDocuments(documents);

      setMessageTone("success");
      setMessage(t("documentsPage.saved"));
      setSourceModalCategory(null);
    } catch (error) {
      setMessageTone("error");
      setMessage(
        error instanceof Error ? error.message : t("documentsPage.saveError"),
      );
    }

    setSaving(false);
  }

  async function handleDelete(categoryId: BrandDocumentCategoryId) {
    if (saving) return;

    const nextDocuments = {
      ...documents,
      [categoryId]: {
        ...defaultState[categoryId],
        deleted: true,
      },
    };

    setSaving(true);
    setMessage("");
    setOpenOptionsCategory(null);

    try {
      await persistDocuments(nextDocuments);
      setMessageTone("success");
      setMessage("La fuente se eliminó correctamente.");
    } catch (error) {
      setMessageTone("error");
      setMessage(
        error instanceof Error ? error.message : t("documentsPage.saveError"),
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <form id={formId} className="space-y-6" onSubmit={handleSubmit}>
      {sourceModalCategory ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <button
            type="button"
            aria-label="Cerrar modal"
            className="absolute inset-0 bg-slate-950/45 backdrop-blur-sm"
            onClick={() => setSourceModalCategory(null)}
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="source-modal-title"
            className="relative z-10 max-h-[calc(100vh-2rem)] w-full max-w-2xl overflow-y-auto rounded-[28px] border border-white/60 bg-white p-1 shadow-[0_30px_90px_rgba(15,23,42,0.28)] dark:border-white/10 dark:bg-slate-950"
          >
            <div className="admin-panel-soft p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400 dark:text-slate-500">
                    {t("documentsPage.uploadEyebrow")}
                  </p>
                  <h2
                    id="source-modal-title"
                    className="mt-2 text-xl font-bold text-slate-950 dark:text-slate-50"
                  >
                    {t(
                      categories.find(
                        (category) => category.id === sourceModalCategory,
                      )?.labelKey ?? "documentsPage.legalTab",
                    )}
                  </h2>
                </div>

                <button
                  type="button"
                  onClick={() => setSourceModalCategory(null)}
                  className="admin-button-secondary admin-button-icon"
                  aria-label="Cerrar"
                  autoFocus
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="mt-5 flex gap-2">
                <button
                  type="button"
                  onClick={() =>
                    updateCategory(activeTab, {
                      file: null,
                      mode: "file",
                      link: "",
                      deleted: false,
                    })
                  }
                  className={`rounded-xl px-3 py-2 text-sm font-semibold transition ${
                    activeDocument.mode === "file"
                      ? "bg-[var(--bunji-primary-light)] text-[var(--bunji-primary-dark)]"
                      : "border border-slate-200 bg-white text-slate-600 dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-300"
                  }`}
                >
                  {t("documentsPage.uploadFileOption")}
                </button>
                <button
                  type="button"
                  onClick={() =>
                    updateCategory(activeTab, {
                      file: null,
                      mode: "link",
                      fileName: "",
                      fileUrl: "",
                      deleted: false,
                    })
                  }
                  className={`rounded-xl px-3 py-2 text-sm font-semibold transition ${
                    activeDocument.mode === "link"
                      ? "bg-[var(--bunji-primary-light)] text-[var(--bunji-primary-dark)]"
                      : "border border-slate-200 bg-white text-slate-600 dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-300"
                  }`}
                >
                  {t("documentsPage.addLinkOption")}
                </button>
              </div>

              {activeDocument.mode === "file" ? (
                <div className="mt-5 rounded-2xl border border-dashed border-[color-mix(in_srgb,var(--bunji-primary-soft)_62%,white)] bg-white/78 p-6 dark:border-white/10 dark:bg-white/[0.04]">
                  <label
                    className="block cursor-pointer"
                    onDragOver={(event) => event.preventDefault()}
                    onDrop={(event) => {
                      event.preventDefault();
                      handleFileSelection(activeTab, event.dataTransfer.files);
                    }}
                  >
                    <input
                      ref={(node) => {
                        inputRefs.current[activeTab] = node;
                      }}
                      type="file"
                      accept="application/pdf"
                      className="sr-only"
                      onChange={(event) =>
                        handleFileSelection(activeTab, event.target.files)
                      }
                    />

                    <div className="flex items-start gap-4">
                      <div className="admin-icon-tile h-12 w-12">
                        <UploadCloud className="h-5 w-5" />
                      </div>
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm font-semibold text-slate-950 dark:text-slate-50">
                            {t("documentsPage.dropTitle")}
                          </p>
                          <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">
                            {t("documentsPage.dropDescription")}
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() => inputRefs.current[activeTab]?.click()}
                          className="admin-button-secondary"
                        >
                          {activeDocument.fileName
                            ? t("documentsPage.replaceFile")
                            : t("documentsPage.browseFile")}
                        </button>

                        {activeDocument.fileName ? (
                          <div className="rounded-xl border border-slate-200 bg-white/90 px-4 py-3 dark:border-white/10 dark:bg-white/[0.04]">
                            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400 dark:text-slate-500">
                              {t("documentsPage.selectedFile")}
                            </p>
                            <p className="mt-2 text-sm font-semibold text-slate-950 dark:text-slate-50">
                              {activeDocument.fileName}
                            </p>
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </label>
                </div>
              ) : (
                <div className="mt-5 rounded-2xl border border-dashed border-[color-mix(in_srgb,var(--bunji-primary-soft)_62%,white)] bg-white/78 p-6 dark:border-white/10 dark:bg-white/[0.04]">
                  <div className="flex items-start gap-4">
                    <div className="admin-icon-tile h-12 w-12">
                      <Link2 className="h-5 w-5" />
                    </div>
                    <div className="w-full">
                      <label className="block">
                        <span className="mb-2 block text-sm font-semibold text-slate-950 dark:text-slate-50">
                          {t("documentsPage.linkLabel")}
                        </span>
                        <input
                          type="url"
                          value={activeDocument.link}
                          onChange={(event) =>
                            updateCategory(activeTab, {
                              link: event.target.value,
                              deleted: false,
                            })
                          }
                          className="admin-input"
                          placeholder={t("documentsPage.linkPlaceholder")}
                        />
                      </label>
                    </div>
                  </div>
                </div>
              )}

              <div className="mt-5 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setSourceModalCategory(null)}
                  className="admin-button-secondary"
                >
                  Cerrar
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="admin-button-primary disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving ? t("documentsPage.saving") : t("documentsPage.save")}
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
        <article className="admin-panel-soft overflow-hidden p-4 sm:p-5">
          <div className="relative aspect-[16/9] overflow-hidden rounded-2xl bg-[linear-gradient(135deg,var(--bunji-primary),var(--bunji-primary-dark))]">
            {brandCoverImage ? (
              <Image
                src={brandCoverImage}
                alt={`Asset de marca de ${universityName}`}
                fill
                sizes="(min-width: 1280px) 48vw, 100vw"
                className="object-cover"
              />
            ) : (
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(255,255,255,0.24),transparent_38%),linear-gradient(135deg,var(--bunji-primary),var(--bunji-primary-dark))]" />
            )}

            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(15,23,42,0.02)_20%,rgba(15,23,42,0.86)_100%)]" />

            <div className="absolute inset-x-0 bottom-0 z-10 p-5 text-white sm:p-6">
              <div className="mb-3 flex items-center gap-2.5">
                {universityLogo ? (
                  <span className="relative h-9 w-9 shrink-0 overflow-hidden rounded-full border border-white/60 bg-white shadow-sm">
                    <Image
                      src={universityLogo}
                      alt=""
                      fill
                      sizes="36px"
                      unoptimized
                      className="object-contain p-1"
                    />
                  </span>
                ) : (
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/50 bg-white/15 text-sm font-bold backdrop-blur-sm">
                    {universityName.slice(0, 1).toUpperCase()}
                  </span>
                )}
                <span className="text-sm font-semibold drop-shadow-sm">
                  {universityName}
                </span>
              </div>

              <h2 className="max-w-xl text-2xl font-bold leading-tight tracking-tight drop-shadow-sm sm:text-3xl">
                {universityOfficialName}
              </h2>
              <p className="mt-3 text-sm font-semibold text-white/90">
                {brandAssetCount} {brandAssetCount === 1 ? "asset" : "assets"}{" "}
                de marca
              </p>
            </div>
          </div>

          <div className="px-1 pb-1 pt-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400 dark:text-slate-500">
              Resumen de la universidad
            </p>
            <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
              {shortenSummary(universitySummary) ||
                "Agrega una descripción institucional para completar este resumen."}
            </p>

            <div className="mt-5 grid gap-3 sm:grid-cols-[0.7fr_1.3fr]">
              <div className="rounded-2xl border border-slate-200/80 bg-white/75 p-4 dark:border-white/10 dark:bg-white/[0.04]">
                <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400 dark:text-slate-500">
                  Programas
                </p>
                <p className="mt-2 text-2xl font-bold text-[var(--bunji-primary-dark)] dark:text-[var(--bunji-primary-light)]">
                  {programCount}
                </p>
                <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
                  {programCount === 1
                    ? "Programa registrado"
                    : "Programas registrados"}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200/80 bg-white/75 p-4 dark:border-white/10 dark:bg-white/[0.04]">
                <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400 dark:text-slate-500">
                  Tipos de programas
                </p>
                {programTypes.length > 0 ? (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {programTypes.map((programType) => (
                      <span
                        key={programType}
                        className="rounded-full bg-[color-mix(in_srgb,var(--bunji-primary-light)_55%,white)] px-2.5 py-1 text-xs font-semibold text-[var(--bunji-primary-dark)] dark:bg-white/10 dark:text-slate-200"
                      >
                        {programType}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="mt-2 text-xs leading-5 text-slate-500 dark:text-slate-400">
                    Aún no hay tipos de programas identificados.
                  </p>
                )}
              </div>
            </div>
          </div>
        </article>

        <div className="space-y-5">
          <div className="admin-panel-soft p-6">
            <h2 className="text-2xl font-bold tracking-tight text-slate-950 dark:text-slate-50">
              {t("documentsPage.readyTitle")}
            </h2>

            <div className="mt-5 overflow-hidden rounded-2xl border border-slate-200/80 bg-white/80 dark:border-white/10 dark:bg-white/[0.03]">
              {categories.map((category) => {
                const categoryState = documents[category.id];
                const hasFile = Boolean(categoryState.fileName);
                const hasLink = Boolean(categoryState.link.trim());
                const hasSource = hasFile || hasLink;
                const expanded = category.id === expandedCategory;
                const sourceLabel = hasFile
                  ? t("documentsPage.sourceFile")
                  : hasLink
                    ? t("documentsPage.sourceLink")
                    : t("documentsPage.noSource");
                const sourceValue = hasFile
                  ? categoryState.fileName
                  : hasLink
                    ? categoryState.link
                    : t("documentsPage.emptyState");

                return (
                  <div
                    key={category.id}
                    className="border-b border-slate-200/80 last:border-b-0 dark:border-white/10"
                  >
                    <button
                      type="button"
                      aria-expanded={expanded}
                      aria-controls={`document-category-${category.id}`}
                      onClick={() => {
                        setActiveTab(category.id);
                        setExpandedCategory((current) =>
                          current === category.id ? null : category.id,
                        );
                      }}
                      className={`flex w-full items-center gap-2 px-3 py-3 text-left transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--bunji-primary)] dark:hover:bg-white/[0.05] ${
                        category.id === activeTab
                          ? "bg-[color-mix(in_srgb,var(--bunji-cyan-soft)_84%,white)] dark:bg-white/[0.05]"
                          : ""
                      }`}
                    >
                      {expanded ? (
                        <ChevronDown className="h-4 w-4 shrink-0 text-[var(--bunji-primary)]" />
                      ) : (
                        <ChevronRight className="h-4 w-4 shrink-0 text-slate-400" />
                      )}
                      <span className="min-w-0 flex-1 truncate text-sm font-semibold text-slate-950 dark:text-slate-50">
                        {t(category.labelKey)}
                      </span>
                    </button>

                    {expanded ? (
                      <div
                        id={`document-category-${category.id}`}
                        className="px-3 pb-3 pl-9"
                      >
                        <div
                          className={`relative flex w-full min-w-0 items-center gap-3 rounded-xl bg-slate-50 px-3 py-2.5 text-left dark:bg-white/[0.04] ${
                            hasSource
                              ? ""
                              : "cursor-pointer transition hover:bg-slate-100 focus-within:ring-2 focus-within:ring-[var(--bunji-primary)] dark:hover:bg-white/[0.08]"
                          }`}
                        >
                          {!hasSource ? (
                            <button
                              type="button"
                              aria-label={`Agregar fuente: ${t(category.labelKey)}`}
                              onClick={() => {
                                setActiveTab(category.id);
                                setSourceModalCategory(category.id);
                              }}
                              className="absolute inset-0 rounded-xl focus-visible:outline-none"
                            />
                          ) : null}
                          {hasLink ? (
                            <Link2 className="h-4 w-4 shrink-0 text-[var(--bunji-primary)]" />
                          ) : (
                            <FileText className="h-4 w-4 shrink-0 text-[var(--bunji-primary)]" />
                          )}
                          <div className="min-w-0 flex-1">
                            <p
                              className="truncate text-sm font-medium text-slate-700 dark:text-slate-200"
                              title={sourceValue}
                            >
                              {sourceValue}
                            </p>
                            <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400 dark:text-slate-500">
                              {sourceLabel}
                            </p>
                          </div>
                          {hasSource ? (
                            <div className="relative z-10 shrink-0">
                              <button
                                type="button"
                                aria-label={`Opciones de ${t(category.labelKey)}`}
                                aria-haspopup="menu"
                                aria-expanded={
                                  openOptionsCategory === category.id
                                }
                                onClick={() =>
                                  setOpenOptionsCategory((current) =>
                                    current === category.id
                                      ? null
                                      : category.id,
                                  )
                                }
                                className="flex h-9 w-9 items-center justify-center rounded-full text-slate-500 transition hover:bg-white hover:text-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--bunji-primary)] dark:hover:bg-white/10 dark:hover:text-white"
                              >
                                <MoreHorizontal className="h-5 w-5" />
                              </button>

                              {openOptionsCategory === category.id ? (
                                <div
                                  role="menu"
                                  className="absolute right-0 top-full z-20 mt-2 min-w-40 rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl dark:border-white/10 dark:bg-slate-900"
                                >
                                  <button
                                    type="button"
                                    role="menuitem"
                                    disabled={saving}
                                    onClick={() =>
                                      void handleDelete(category.id)
                                    }
                                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-rose-600 transition hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-60 dark:text-rose-300 dark:hover:bg-rose-950/40"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                    {saving ? "Eliminando..." : "Eliminar"}
                                  </button>
                                </div>
                              ) : null}
                            </div>
                          ) : null}
                        </div>
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </div>
          </div>

          {message ? (
            <div
              className={`rounded-2xl px-4 py-3 text-sm font-medium ${
                messageTone === "success"
                  ? "border border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/60 dark:bg-emerald-950/30 dark:text-emerald-300"
                  : "border border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-900/60 dark:bg-rose-950/30 dark:text-rose-300"
              }`}
            >
              {message}
            </div>
          ) : null}
        </div>
      </div>

      <button type="submit" className="sr-only" disabled={saving}>
        {saving ? t("documentsPage.saving") : t("documentsPage.save")}
      </button>
    </form>
  );
}
