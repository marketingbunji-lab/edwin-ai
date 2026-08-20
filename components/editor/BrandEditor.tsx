"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";
import { useDashboardLanguage } from "@/components/dashboard/DashboardLanguageProvider";
import type {
  Brand,
  BrandCampus,
  BrandCertification,
  BrandColorPalette,
  BrandColorScale,
  LegalLink,
} from "@/lib/data";
import {
  createBrandColorScale,
  enrichBrandColorPalette,
  normalizeBrandColorPalette,
} from "@/lib/brandColors";

type EditableBrand = Brand & Record<string, unknown>;
type EditableRecord = Record<string, unknown>;

type Props = {
  mode: "create" | "edit";
  initialBrand: Brand;
  backHref?: string;
  backLabel?: string;
  stickyActions?: boolean;
  formId?: string;
  showSaveActions?: boolean;
};

type SaveBrandResponse = {
  ok?: boolean;
  error?: string;
  redirectTo?: string;
  supabase?: {
    ok: boolean;
    error: string | null;
  };
};

function isRecord(value: unknown): value is EditableRecord {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function getRecordAtPath(target: EditableRecord, keys: string[]) {
  let current = target;

  for (const key of keys) {
    if (!isRecord(current[key])) {
      current[key] = {};
    }

    current = current[key] as EditableRecord;
  }

  return current;
}

export default function BrandEditor({
  mode,
  initialBrand,
  backHref,
  backLabel = "Volver",
  stickyActions = false,
  formId,
  showSaveActions = true,
}: Props) {
  const { t } = useDashboardLanguage();
  const router = useRouter();
  const enrichedInitialBrand = enrichBrandColorPalette(initialBrand);
  const [brand, setBrand] = useState<Brand>(() => enrichedInitialBrand);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [activeTab, setActiveTab] = useState<"general" | "styles">("general");
  const [lastSavedSnapshot, setLastSavedSnapshot] = useState(() =>
    JSON.stringify(enrichedInitialBrand),
  );
  const currentSnapshot = JSON.stringify(brand);
  const hasChanges = currentSnapshot !== lastSavedSnapshot;
  const saveDisabled = saving || !hasChanges;

  const updateField = (path: string, value: string) => {
    setBrand((prev) => {
      const next = structuredClone(prev) as EditableBrand;
      const keys = path.split(".");
      const fieldKey = keys.at(-1);

      if (!fieldKey) {
        return next;
      }

      const current = getRecordAtPath(next, keys.slice(0, -1));
      current[fieldKey] = value;

      if (path === "primaryColor") {
        next.colorPalette = {
          ...(next.colorPalette ?? {}),
          primary: createBrandColorScale(value),
        };
      }

      if (path === "secondaryColor") {
        next.colorPalette = {
          ...(next.colorPalette ?? {}),
          secondary: createBrandColorScale(value),
        };
      }

      return next;
    });
  };

  const updatePaletteField = (
    colorGroup: keyof BrandColorPalette,
    tone: keyof BrandColorScale,
    value: string,
  ) => {
    setBrand((prev) => {
      const next = structuredClone(prev) as EditableBrand;
      const palette = normalizeBrandColorPalette(next);
      const scale = palette[colorGroup] ?? createBrandColorScale();

      next.colorPalette = {
        ...palette,
        [colorGroup]: {
          ...scale,
          [tone]: value,
        },
      };

      return next;
    });
  };

  const updateKeywords = (value: string) => {
    setBrand((prev) => ({
      ...prev,
      keywords: value
        .split(",")
        .map((keyword) => keyword.trim())
        .filter(Boolean),
    }));
  };

  const updateImage = (index: number, value: string) => {
    setBrand((prev) => {
      const next = structuredClone(prev) as EditableBrand;
      next.images = [...(next.images ?? [])];
      next.images[index] = value;
      return next;
    });
  };

  const addImage = () => {
    setBrand((prev) => ({
      ...prev,
      images: [...(prev.images ?? []), ""],
    }));
  };

  const removeImage = (index: number) => {
    setBrand((prev) => ({
      ...prev,
      images: (prev.images ?? []).filter((_, itemIndex) => itemIndex !== index),
    }));
  };

  const updateCampus = (
    index: number,
    field: keyof BrandCampus,
    value: string,
  ) => {
    setBrand((prev) => {
      const next = structuredClone(prev) as EditableBrand;

      if (!Array.isArray(next.campuses)) {
        next.campuses = [];
      }

      if (!next.campuses[index]) {
        next.campuses[index] = {
          name: "",
          location: "",
          description: "",
          image: "",
          videoUrl: "",
        };
      }

      next.campuses[index][field] = value;
      return next;
    });
  };

  const addCampus = () => {
    setBrand((prev) => ({
      ...prev,
      campuses: [
        ...(prev.campuses ?? []),
        { name: "", location: "", description: "", image: "", videoUrl: "" },
      ],
    }));
  };

  const removeCampus = (index: number) => {
    setBrand((prev) => ({
      ...prev,
      campuses: (prev.campuses ?? []).filter(
        (_, itemIndex) => itemIndex !== index,
      ),
    }));
  };

  const updateLegalLink = (
    index: number,
    field: keyof LegalLink,
    value: string,
  ) => {
    setBrand((prev) => {
      const next = structuredClone(prev) as EditableBrand;

      if (!Array.isArray(next.legalLinks)) {
        next.legalLinks = [];
      }

      if (!next.legalLinks[index]) {
        next.legalLinks[index] = { label: "", url: "" };
      }

      next.legalLinks[index][field] = value;
      return next;
    });
  };

  const addLegalLink = () => {
    setBrand((prev) => {
      const next = structuredClone(prev) as EditableBrand;
      next.legalLinks = [...(next.legalLinks ?? []), { label: "", url: "" }];
      return next;
    });
  };

  const removeLegalLink = (index: number) => {
    setBrand((prev) => {
      const next = structuredClone(prev) as EditableBrand;
      next.legalLinks = (next.legalLinks ?? []).filter(
        (_, itemIndex) => itemIndex !== index,
      );
      return next;
    });
  };

  const updateCertification = (
    index: number,
    field: keyof BrandCertification,
    value: string,
  ) => {
    setBrand((prev) => {
      const next = structuredClone(prev) as EditableBrand;

      if (!Array.isArray(next.certifications)) {
        next.certifications = [];
      }

      if (!next.certifications[index]) {
        next.certifications[index] = {
          name: "",
          url: "",
          logos: { light: "", dark: "" },
        };
      }

      next.certifications[index][field] = value;
      return next;
    });
  };

  const updateCertificationLogo = (
    index: number,
    logoMode: "light" | "dark",
    value: string,
  ) => {
    setBrand((prev) => {
      const next = structuredClone(prev) as EditableBrand;

      if (!Array.isArray(next.certifications)) {
        next.certifications = [];
      }

      if (!next.certifications[index]) {
        next.certifications[index] = {
          name: "",
          url: "",
          logos: { light: "", dark: "" },
        };
      }

      next.certifications[index].logos = {
        ...(next.certifications[index].logos ?? {}),
        [logoMode]: value,
      };
      return next;
    });
  };

  const addCertification = () => {
    setBrand((prev) => {
      const next = structuredClone(prev) as EditableBrand;
      next.certifications = [
        ...(next.certifications ?? []),
        { name: "", url: "", logos: { light: "", dark: "" } },
      ];
      return next;
    });
  };

  const removeCertification = (index: number) => {
    setBrand((prev) => {
      const next = structuredClone(prev) as EditableBrand;
      next.certifications = (next.certifications ?? []).filter(
        (_, itemIndex) => itemIndex !== index,
      );
      return next;
    });
  };

  const handleSave = async () => {
    if (saveDisabled) {
      return;
    }

    try {
      setSaving(true);
      setMessage("");

      const endpoint =
        mode === "create" ? "/api/brands" : `/api/brands/${initialBrand.slug}`;
      const method = mode === "create" ? "POST" : "PUT";

      const response = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(enrichBrandColorPalette(brand)),
      });

      const data = (await response.json()) as SaveBrandResponse;

      if (!response.ok) {
        throw new Error(data.error || t("brandEditor.saveError"));
      }

      if (mode === "create") {
        if (data.supabase?.ok) {
          window.alert(t("brandEditor.createSuccess"));
        } else {
          window.alert(
            t("brandEditor.createPartialSuccess", {
              error: data.supabase?.error || t("brandEditor.noErrorDetail"),
            }),
          );
        }

        if (data.redirectTo) {
          router.push(data.redirectTo);
        }
        return;
      }

      setLastSavedSnapshot(currentSnapshot);
      setMessage(t("brandEditor.saveSuccess"));
      router.refresh();
    } catch (error: unknown) {
      setMessage(
        error instanceof Error ? error.message : t("brandEditor.genericError"),
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <form
      id={formId}
      onSubmit={(event) => {
        event.preventDefault();
        void handleSave();
      }}
      className="border border-gray-200 bg-white p-8 dark:border-slate-800 dark:bg-slate-950"
    >
      {stickyActions && showSaveActions ? (
          <div className="-mt-2 mb-8 sticky z-20 overflow-hidden border border-slate-200/80 bg-white/90 p-4 shadow-[0_18px_45px_rgba(15,23,42,0.08)] backdrop-blur-xl before:pointer-events-none before:absolute before:inset-0 before:bg-[linear-gradient(135deg,rgba(255,255,255,0.30),transparent_62%)] before:content-[''] dark:border-white/10 dark:bg-slate-950/88 dark:shadow-[0_20px_50px_rgba(2,6,23,0.28)] dark:before:bg-[linear-gradient(135deg,rgba(255,255,255,0.07),transparent_62%)]">
            <div className="flex flex-wrap items-center justify-between gap-3">
              {backHref ? (
              <Link
                href={backHref}
                className="admin-button-secondary admin-button-icon"
                aria-label={backLabel}
                title={backLabel}
              >
                <ArrowLeft className="h-4 w-4" />
              </Link>
            ) : (
              <div />
            )}

            <div className="flex flex-wrap items-center justify-end gap-3">
              {message ? (
                <p className="text-sm text-gray-600 dark:text-slate-300">
                  {message}
                </p>
              ) : null}

                <button
                  type="submit"
                  disabled={saveDisabled}
                  className="admin-button-primary px-5 disabled:cursor-not-allowed disabled:opacity-60"
                >
                {saving
                  ? mode === "create"
                    ? t("brandEditor.creating")
                    : t("brandEditor.saving")
                  : mode === "create"
                    ? t("brandEditor.createBrand")
                    : t("brandEditor.saveChanges")}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <div className="mb-6">
        <p className="text-gray-600 dark:text-slate-300">
          {mode === "create"
            ? t("brandEditor.createMessage")
            : t("brandEditor.editMessage")}
        </p>
      </div>

      <div className="mb-8 inline-flex rounded-md border border-gray-200 bg-gray-100 p-1 dark:border-slate-800 dark:bg-slate-900">
        <button
          type="button"
          onClick={() => setActiveTab("general")}
          className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
            activeTab === "general"
              ? "bg-white text-gray-950 shadow-sm dark:bg-slate-950 dark:text-slate-50"
              : "text-gray-600 hover:text-gray-950 dark:text-slate-300 dark:hover:text-white"
          }`}
        >
          {t("brandEditor.generalTab")}
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("styles")}
          className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
            activeTab === "styles"
              ? "bg-white text-gray-950 shadow-sm dark:bg-slate-950 dark:text-slate-50"
              : "text-gray-600 hover:text-gray-950 dark:text-slate-300 dark:hover:text-white"
          }`}
        >
          {t("brandEditor.stylesTab")}
        </button>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {activeTab === "general" ? (
          <>
            <div className="space-y-4">
              <Field
                label={t("brandEditor.fields.slug")}
                value={brand.slug}
                onChange={(value) => updateField("slug", value)}
                disabled={mode === "edit"}
              />

              <Field
                label={t("brandEditor.fields.name")}
                value={brand.name}
                onChange={(value) => updateField("name", value)}
              />

              <Field
                label={t("brandEditor.fields.fullName")}
                value={brand.shortName || ""}
                onChange={(value) => updateField("shortName", value)}
              />

              <Field
                label={t("brandEditor.fields.description")}
                value={brand.description || ""}
                onChange={(value) => updateField("description", value)}
              />

              <Field
                label={t("brandEditor.fields.officialWebsite")}
                value={brand.officialWebsite || ""}
                onChange={(value) => updateField("officialWebsite", value)}
              />

              <Field
                label={t("brandEditor.fields.siteName")}
                value={brand.siteName || ""}
                onChange={(value) => updateField("siteName", value)}
              />

              <TextareaField
                label={t("brandEditor.fields.abstract")}
                value={brand.abstract || ""}
                onChange={(value) => updateField("abstract", value)}
              />

              <Field
                label={t("brandEditor.fields.keywords")}
                value={(brand.keywords ?? []).join(", ")}
                onChange={updateKeywords}
              />

              <Field
                label={t("brandEditor.fields.robots")}
                value={brand.robots || ""}
                onChange={(value) => updateField("robots", value)}
              />

              <Field
                label={t("brandEditor.fields.generator")}
                value={brand.generator || ""}
                onChange={(value) => updateField("generator", value)}
              />

              <Field
                label={t("brandEditor.fields.brandImage")}
                value={brand.imageBrand || ""}
                onChange={(value) => updateField("imageBrand", value)}
              />

              <div className="admin-panel-soft space-y-4 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h2 className="text-sm font-semibold text-gray-900 dark:text-slate-50">
                      {t("brandEditor.fields.imageGallery")}
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-slate-400">
                      {t("brandEditor.helper.gallery")}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={addImage}
                    className="admin-button-secondary px-3 py-2 text-xs"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    {t("brandEditor.helper.addImage")}
                  </button>
                </div>

                {(brand.images ?? []).length === 0 ? (
                  <div className="border border-dashed border-gray-300 bg-white p-4 text-sm text-gray-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-400">
                    {t("brandEditor.helper.galleryEmpty")}
                  </div>
                ) : null}

                {(brand.images ?? []).map((image, index) => (
                  <div
                    key={index}
                    className="border border-gray-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-950"
                  >
                    <div className="mb-3 flex items-center justify-between">
                      <p className="text-sm font-semibold text-gray-900 dark:text-slate-50">
                        {t("brandEditor.item.image")} {index + 1}
                      </p>

                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="inline-flex items-center gap-1 text-xs font-medium text-red-600"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        {t("brandEditor.actions.remove")}
                      </button>
                    </div>

                    <Field
                      label="URL"
                      value={image}
                      onChange={(value) => updateImage(index, value)}
                    />
                  </div>
                ))}
              </div>

              <div className="admin-panel-soft space-y-4 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h2 className="text-sm font-semibold text-gray-900 dark:text-slate-50">
                      {t("brandEditor.fields.campuses")}
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-slate-400">
                      {t("brandEditor.helper.campuses")}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={addCampus}
                    className="admin-button-secondary px-3 py-2 text-xs"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    {t("brandEditor.helper.addCampus")}
                  </button>
                </div>

                {(brand.campuses ?? []).length === 0 ? (
                  <div className="border border-dashed border-gray-300 bg-white p-4 text-sm text-gray-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-400">
                    {t("brandEditor.helper.campusesEmpty")}
                  </div>
                ) : null}

                {(brand.campuses ?? []).map((campus, index) => (
                  <div
                    key={index}
                    className="border border-gray-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-950"
                  >
                    <div className="mb-3 flex items-center justify-between">
                      <p className="text-sm font-semibold text-gray-900 dark:text-slate-50">
                        {t("brandEditor.item.campus")} {index + 1}
                      </p>

                      <button
                        type="button"
                        onClick={() => removeCampus(index)}
                        className="inline-flex items-center gap-1 text-xs font-medium text-red-600"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        {t("brandEditor.actions.remove")}
                      </button>
                    </div>

                    <div className="space-y-3">
                      <Field
                        label={t("brandEditor.helper.campusName")}
                        value={campus.name || ""}
                        onChange={(value) => updateCampus(index, "name", value)}
                      />

                      <Field
                        label={t("brandEditor.helper.campusLocation")}
                        value={campus.location || ""}
                        onChange={(value) =>
                          updateCampus(index, "location", value)
                        }
                      />

                      <TextareaField
                        label={t("brandEditor.helper.campusDescription")}
                        value={campus.description || ""}
                        onChange={(value) =>
                          updateCampus(index, "description", value)
                        }
                      />

                      <Field
                        label={t("brandEditor.helper.campusImage")}
                        value={campus.image || ""}
                        onChange={(value) => updateCampus(index, "image", value)}
                      />

                      <Field
                        label={t("brandEditor.helper.campusVideo")}
                        value={campus.videoUrl || ""}
                        onChange={(value) =>
                          updateCampus(index, "videoUrl", value)
                        }
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div className="admin-panel-soft space-y-4 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h2 className="text-sm font-semibold text-gray-900 dark:text-slate-50">
                      {t("brandEditor.fields.legalLinks")}
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-slate-400">
                      {t("brandEditor.helper.legalLinks")}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={addLegalLink}
                    className="admin-button-secondary px-3 py-2 text-xs"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    {t("brandEditor.helper.addLegalLink")}
                  </button>
                </div>

                {(brand.legalLinks ?? []).length === 0 ? (
                  <div className="border border-dashed border-gray-300 bg-white p-4 text-sm text-gray-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-400">
                    {t("brandEditor.helper.legalLinksEmpty")}
                  </div>
                ) : null}

                {(brand.legalLinks ?? []).map((link, index) => (
                  <div
                    key={index}
                    className="border border-gray-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-950"
                  >
                    <div className="mb-3 flex items-center justify-between">
                      <p className="text-sm font-semibold text-gray-900 dark:text-slate-50">
                        {t("brandEditor.item.link")} {index + 1}
                      </p>

                      <button
                        type="button"
                        onClick={() => removeLegalLink(index)}
                        className="inline-flex items-center gap-1 text-xs font-medium text-red-600"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        {t("brandEditor.actions.remove")}
                      </button>
                    </div>

                    <div className="space-y-3">
                      <Field
                        label={t("brandEditor.helper.linkLabel")}
                        value={link.label}
                        onChange={(value) => updateLegalLink(index, "label", value)}
                      />

                      <Field
                        label="URL"
                        value={link.url}
                        onChange={(value) => updateLegalLink(index, "url", value)}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="admin-panel-soft space-y-4 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h2 className="text-sm font-semibold text-gray-900 dark:text-slate-50">
                      {t("brandEditor.fields.certifications")}
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-slate-400">
                      {t("brandEditor.helper.certifications")}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={addCertification}
                    className="admin-button-secondary px-3 py-2 text-xs"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    {t("brandEditor.helper.addCertification")}
                  </button>
                </div>

                {(brand.certifications ?? []).length === 0 ? (
                  <div className="border border-dashed border-gray-300 bg-white p-4 text-sm text-gray-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-400">
                    {t("brandEditor.helper.certificationsEmpty")}
                  </div>
                ) : null}

                {(brand.certifications ?? []).map((certification, index) => (
                  <div
                    key={index}
                    className="border border-gray-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-950"
                  >
                    <div className="mb-3 flex items-center justify-between">
                      <p className="text-sm font-semibold text-gray-900 dark:text-slate-50">
                        {t("brandEditor.item.certification")} {index + 1}
                      </p>

                      <button
                        type="button"
                        onClick={() => removeCertification(index)}
                        className="inline-flex items-center gap-1 text-xs font-medium text-red-600"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        {t("brandEditor.actions.remove")}
                      </button>
                    </div>

                    <div className="space-y-3">
                      <Field
                        label={t("brandEditor.helper.accreditationName")}
                        value={certification.name}
                        onChange={(value) =>
                          updateCertification(index, "name", value)
                        }
                      />

                      <Field
                        label={t("brandEditor.helper.accreditorUrl")}
                        value={certification.url}
                        onChange={(value) =>
                          updateCertification(index, "url", value)
                        }
                      />

                      <Field
                        label="Logo light"
                        value={certification.logos?.light || ""}
                        onChange={(value) =>
                          updateCertificationLogo(index, "light", value)
                        }
                      />

                      <Field
                        label="Logo dark"
                        value={certification.logos?.dark || ""}
                        onChange={(value) =>
                          updateCertificationLogo(index, "dark", value)
                        }
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="space-y-4">
              <div className="admin-panel-soft space-y-4 p-4">
                <h2 className="text-sm font-semibold text-gray-900 dark:text-slate-50">
                  {t("brandEditor.fields.logo")}
                </h2>

                <Field
                  label={t("brandEditor.fields.logo")}
                  value={brand.logo}
                  onChange={(value) => updateField("logo", value)}
                />

                <Field
                  label={t("brandEditor.fields.logoLight")}
                  value={brand.logos?.light || ""}
                  onChange={(value) => updateField("logos.light", value)}
                />

                <Field
                  label={t("brandEditor.fields.logoDark")}
                  value={brand.logos?.dark || ""}
                  onChange={(value) => updateField("logos.dark", value)}
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="admin-panel-soft space-y-4 p-4">
                <h2 className="text-sm font-semibold text-gray-900 dark:text-slate-50">
                  {t("brandEditor.fields.primaryColor")}
                </h2>

                <div className="grid gap-4 sm:grid-cols-2">
                  <ColorField
                    label={t("brandEditor.fields.primaryColor")}
                    value={brand.primaryColor}
                    onChange={(value) => updateField("primaryColor", value)}
                  />

                  <ColorField
                    label={t("brandEditor.fields.secondaryColor")}
                    value={brand.secondaryColor}
                    onChange={(value) => updateField("secondaryColor", value)}
                  />
                </div>

                <PaletteEditor
                  title={t("brandEditor.helper.colorVariantsPrimary")}
                  scale={
                    brand.colorPalette?.primary ??
                    createBrandColorScale(brand.primaryColor)
                  }
                  onChange={(tone, value) =>
                    updatePaletteField("primary", tone, value)
                  }
                />

                <PaletteEditor
                  title={t("brandEditor.helper.colorVariantsSecondary")}
                  scale={
                    brand.colorPalette?.secondary ??
                    createBrandColorScale(brand.secondaryColor)
                  }
                  onChange={(tone, value) =>
                    updatePaletteField("secondary", tone, value)
                  }
                />
              </div>

              <div className="admin-panel-soft space-y-4 p-4">
                <h2 className="text-sm font-semibold text-gray-900 dark:text-slate-50">
                  {t("brandEditor.fields.fontFamily")}
                </h2>

                <Field
                  label={t("brandEditor.fields.fontFamily")}
                  value={brand.typography?.fontFamily || ""}
                  onChange={(value) => updateField("typography.fontFamily", value)}
                />

                <Field
                  label={t("brandEditor.fields.googleFontsUrl")}
                  value={brand.typography?.googleFontHref || ""}
                  onChange={(value) =>
                    updateField("typography.googleFontHref", value)
                  }
                />

                <Field
                  label={t("brandEditor.fields.identityManual")}
                  value={brand.identityManual || ""}
                  onChange={(value) => updateField("identityManual", value)}
                />
              </div>
            </div>
          </>
        )}
      </div>

      {!stickyActions && showSaveActions ? (
        <div className="mt-6 flex items-center gap-3">
          <button
            type="submit"
            disabled={saveDisabled}
            className="admin-button-primary px-5 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving
              ? mode === "create"
                ? t("brandEditor.creating")
                : t("brandEditor.saving")
              : mode === "create"
                ? t("brandEditor.createBrand")
                : t("brandEditor.saveChanges")}
          </button>

          {message ? (
            <p className="text-sm text-gray-600 dark:text-slate-300">
              {message}
            </p>
          ) : null}
        </div>
      ) : null}
    </form>
  );
}

function Field({
  label,
  value,
  onChange,
  disabled = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-semibold text-slate-950 dark:text-slate-300">
        {label}
      </span>
      <input
        value={value}
        disabled={disabled}
        onChange={(event) => onChange(event.target.value)}
        className="admin-input"
      />
    </label>
  );
}

function TextareaField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-semibold text-slate-950 dark:text-slate-300">
        {label}
      </span>
      <textarea
        value={value}
        rows={4}
        onChange={(event) => onChange(event.target.value)}
        className="admin-textarea"
      />
    </label>
  );
}

function ColorField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-semibold text-slate-950 dark:text-slate-300">
        {label}
      </span>
      <div className="flex items-center gap-3">
        <input
          type="color"
          value={isHexColor(value) ? value : "#000000"}
          onChange={(event) => onChange(event.target.value)}
          aria-label={`${label} picker`}
          className="h-12 w-12 shrink-0 cursor-pointer rounded-xl border border-slate-300 bg-transparent p-1 dark:border-slate-700"
        />
        <input
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="admin-input"
        />
      </div>
    </label>
  );
}

function PaletteEditor({
  title,
  scale,
  onChange,
}: {
  title: string;
  scale: BrandColorScale;
  onChange: (tone: keyof BrandColorScale, value: string) => void;
}) {
  const tones: Array<{ key: keyof BrandColorScale; label: string }> = [
    { key: "lightest", label: "Lightest" },
    { key: "light", label: "Light" },
    { key: "dark", label: "Dark" },
    { key: "darkest", label: "Darkest" },
  ];

  return (
    <div className="admin-panel-soft space-y-3 p-4">
      <div>
        <h3 className="text-sm font-semibold text-gray-900 dark:text-slate-50">
          {title}
        </h3>
        <p className="text-xs text-gray-500 dark:text-slate-400">
          Se generan desde el color base, pero puedes ajustar cada tono.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {tones.map((tone) => (
          <ColorField
            key={tone.key}
            label={tone.label}
            value={scale[tone.key]}
            onChange={(value) => onChange(tone.key, value)}
          />
        ))}
      </div>
    </div>
  );
}

function isHexColor(value: string) {
  return /^#[0-9a-fA-F]{6}$/.test(value);
}
