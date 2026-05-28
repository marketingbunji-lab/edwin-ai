"use client";

import { useRef, useState } from "react";
import { FileText, Link2, UploadCloud } from "lucide-react";
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
};

type DocumentCategoryConfig = {
  id: BrandDocumentCategoryId;
  labelKey:
    | "documentsPage.legalTab"
    | "documentsPage.catalogsTab"
    | "documentsPage.brandBookTab"
    | "documentsPage.curriculumTab";
};

const categories: DocumentCategoryConfig[] = [
  { id: "legal", labelKey: "documentsPage.legalTab" },
  { id: "catalogs", labelKey: "documentsPage.catalogsTab" },
  { id: "brandBook", labelKey: "documentsPage.brandBookTab" },
  { id: "curriculum", labelKey: "documentsPage.curriculumTab" },
];

const defaultState: Record<BrandDocumentCategoryId, DocumentCategoryState> = {
  legal: { mode: "file", file: null, fileName: "", fileUrl: "", link: "" },
  catalogs: { mode: "file", file: null, fileName: "", fileUrl: "", link: "" },
  brandBook: { mode: "file", file: null, fileName: "", fileUrl: "", link: "" },
  curriculum: { mode: "file", file: null, fileName: "", fileUrl: "", link: "" },
};

type Props = {
  formId: string;
  brandSlug: string;
  initialDocuments?: BrandDocuments;
  initialIdentityManual?: string;
};

function buildInitialState(
  initialDocuments: BrandDocuments | undefined,
  initialIdentityManual: string | undefined,
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
    };
  }

  if (
    !nextState.brandBook.fileName &&
    !nextState.brandBook.fileUrl &&
    !nextState.brandBook.link &&
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
        }
      : {
          file: null,
          mode: "link",
          fileName: "",
          fileUrl: "",
          link: trimmedValue,
        };
  }

  return nextState;
}

export default function BrandDocumentsWorkspace({
  formId,
  brandSlug,
  initialDocuments,
  initialIdentityManual,
}: Props) {
  const { t } = useDashboardLanguage();
  const [activeTab, setActiveTab] = useState<BrandDocumentCategoryId>("legal");
  const [documents, setDocuments] =
    useState<Record<BrandDocumentCategoryId, DocumentCategoryState>>(() =>
      buildInitialState(initialDocuments, initialIdentityManual),
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
    });
    setMessage("");
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setMessage("");
    setMessageTone("success");

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
          }
        >
      >
    >((current, category) => {
      const currentDocument = documents[category.id];

      current[category.id] = {
        mode: currentDocument.mode,
        fileName: currentDocument.fileName,
        fileUrl: currentDocument.fileUrl,
        link: currentDocument.link.trim(),
      };

      if (currentDocument.file) {
        formData.append(`${category.id}File`, currentDocument.file);
      }

      return current;
    }, {});

    formData.append("documents", JSON.stringify(payload));

    try {
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

      setDocuments((current) => {
        const nextState = structuredClone(current);

        for (const category of categories) {
          const savedDocument = responseData.documents?.[category.id];

          nextState[category.id] = {
            file: null,
            mode: savedDocument?.mode === "link" ? "link" : "file",
            fileName: savedDocument?.fileName || "",
            fileUrl: savedDocument?.fileUrl || "",
            link: savedDocument?.link || "",
          };
        }

        return nextState;
      });

      setMessageTone("success");
      setMessage(t("documentsPage.saved"));
    } catch (error) {
      setMessageTone("error");
      setMessage(
        error instanceof Error ? error.message : t("documentsPage.saveError"),
      );
    }

    setSaving(false);
  }

  return (
    <form id={formId} className="space-y-6" onSubmit={handleSubmit}>
      <div className="grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-5">
          <div className="admin-panel-soft p-6">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400 dark:text-slate-500">
              {t("documentsPage.categoriesEyebrow")}
            </p>
            <h2 className="mt-3 text-2xl font-bold tracking-tight text-slate-950 dark:text-slate-50">
              {t("documentsPage.categoriesTitle")}
            </h2>
            <p className="admin-muted mt-3">
              {t("documentsPage.categoriesDescription")}
            </p>

            <div className="mt-6 flex flex-wrap gap-2">
              {categories.map((category) => {
                const active = category.id === activeTab;

                return (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() => setActiveTab(category.id)}
                    className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
                      active
                        ? "bg-[linear-gradient(135deg,color-mix(in_srgb,var(--bunji-primary-light)_70%,white),color-mix(in_srgb,var(--bunji-cyan-soft)_80%,white))] text-[var(--bunji-primary-dark)] ring-1 ring-[color-mix(in_srgb,var(--bunji-cyan)_38%,white)] shadow-[0_12px_24px_rgba(125,227,234,0.16)]"
                        : "border border-slate-200/80 bg-white text-slate-600 hover:border-[color-mix(in_srgb,var(--bunji-primary-soft)_70%,white)] hover:text-slate-950 dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-300 dark:hover:text-white"
                    }`}
                  >
                    {t(category.labelKey)}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="admin-panel-soft p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400 dark:text-slate-500">
                  {t("documentsPage.uploadEyebrow")}
                </p>
                <h2 className="mt-3 text-2xl font-bold tracking-tight text-slate-950 dark:text-slate-50">
                  {t("documentsPage.uploadTitle")}
                </h2>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() =>
                    updateCategory(activeTab, {
                      file: null,
                      mode: "file",
                      link: "",
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
            </div>

            <p className="admin-muted mt-3">
              {t("documentsPage.uploadDescription")}
            </p>
            <p className="mt-3 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--bunji-primary)] dark:text-[var(--bunji-primary-muted)]">
              {t("documentsPage.uploadFormats")}
            </p>

            {activeDocument.mode === "file" ? (
              <div className="mt-6 rounded-2xl border border-dashed border-[color-mix(in_srgb,var(--bunji-primary-soft)_62%,white)] bg-white/78 p-6 dark:border-white/10 dark:bg-white/[0.04]">
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
              <div className="mt-6 rounded-2xl border border-dashed border-[color-mix(in_srgb,var(--bunji-primary-soft)_62%,white)] bg-white/78 p-6 dark:border-white/10 dark:bg-white/[0.04]">
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
                          updateCategory(activeTab, { link: event.target.value })
                        }
                        className="admin-input"
                        placeholder={t("documentsPage.linkPlaceholder")}
                      />
                    </label>
                  </div>
                </div>
              </div>
            )}

            <p className="admin-muted mt-4">
              {t("documentsPage.helperInstruction")}
            </p>
          </div>
        </div>

        <div className="grid gap-5">
          <div className="admin-panel-soft p-6">
            <div className="admin-icon-tile">
              <FileText className="h-5 w-5" />
            </div>
            <p className="mt-5 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400 dark:text-slate-500">
              {t("documentsPage.readyEyebrow")}
            </p>
            <h2 className="mt-3 text-2xl font-bold tracking-tight text-slate-950 dark:text-slate-50">
              {t("documentsPage.readyTitle")}
            </h2>
            <p className="admin-muted mt-3">
              {t("documentsPage.readyDescription")}
            </p>

            <div className="mt-6 space-y-3">
              {categories.map((category) => {
                const categoryState = documents[category.id];
                const hasFile = Boolean(categoryState.fileName);
                const hasLink = Boolean(categoryState.link.trim());
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
                    className={`rounded-2xl border p-4 transition ${
                      category.id === activeTab
                        ? "border-[color-mix(in_srgb,var(--bunji-cyan)_38%,white)] bg-[color-mix(in_srgb,var(--bunji-cyan-soft)_84%,white)]"
                        : "border-slate-200 bg-white/85 dark:border-white/10 dark:bg-white/[0.04]"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-slate-950 dark:text-slate-50">
                          {t(category.labelKey)}
                        </p>
                        <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400 dark:text-slate-500">
                          {t("documentsPage.sourceLabel")}: {sourceLabel}
                        </p>
                      </div>
                    </div>
                    <p className="mt-3 break-words text-sm leading-6 text-slate-600 dark:text-slate-400">
                      {sourceValue}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="admin-panel-soft p-6">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400 dark:text-slate-500">
              {t("documentsPage.nextPhaseEyebrow")}
            </p>
            <p className="admin-muted mt-3">
              {t("documentsPage.nextPhaseDescription")}
            </p>
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
