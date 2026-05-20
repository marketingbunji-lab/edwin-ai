"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import {
  Droplets,
  ChevronDown,
  ChevronUp,
  Eye,
  FileDown,
  Laptop,
  MousePointerClick,
  Plus,
  Smartphone,
  Tablet,
  Trash2,
} from "lucide-react";
import type {
  Brand,
  BrandCertification,
  Landing,
  LandingCertificationItem,
  ProgramInfoItem,
} from "@/lib/data";
import { renderLandingTemplate } from "../templates/renderLandingTemplate";

type Props = {
  brand: Brand;
  initialLanding: Landing;
  exportFilename: string;
};

type FilePickerHandle = {
  createWritable: () => Promise<{
    write: (data: Blob) => Promise<void>;
    close: () => Promise<void>;
  }>;
};

type WindowWithSavePicker = Window & {
  showSaveFilePicker?: (options?: {
    suggestedName?: string;
    types?: Array<{
      description: string;
      accept: Record<string, string[]>;
    }>;
  }) => Promise<FilePickerHandle>;
};

type EditableLanding = Landing & Record<string, unknown>;
type EditableRecord = Record<string, unknown>;
type EditableArrayItem = Record<string, string>;
type EditableTextArray = string[];
type EditableProgramInfoField = "key" | "label" | "value";
type EditableCertificationItem = {
  name: string;
  url?: string;
  enabled?: boolean;
  resolutionText?: string;
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

function getArrayAtPath(target: EditableRecord, path: string) {
  const keys = path.split(".");
  const arrayKey = keys.at(-1);

  if (!arrayKey) return [];

  const parent = getRecordAtPath(target, keys.slice(0, -1));

  if (!Array.isArray(parent[arrayKey])) {
    parent[arrayKey] = [];
  }

  return parent[arrayKey] as EditableArrayItem[];
}

function getCertificationKey(certification: BrandCertification) {
  return `${certification.name || ""}|${certification.url || ""}`;
}

function getLandingCertificationItem(
  landing: Landing,
  certification: BrandCertification,
  index: number,
): LandingCertificationItem | null {
  const items = landing.certifications?.items ?? [];
  const certificationKey = getCertificationKey(certification);
  const matchedItem = items.find(
    (item): item is LandingCertificationItem =>
      typeof item !== "string" &&
      `${item.name || item.title || ""}|${item.url || ""}` === certificationKey,
  );

  const indexedItem = items[index];

  return matchedItem ?? (typeof indexedItem !== "string" ? indexedItem : null);
}

function getLandingCertificationResolution(
  landing: Landing,
  certification: BrandCertification,
  index: number,
) {
  return (
    getLandingCertificationItem(landing, certification, index)
      ?.resolutionText ?? ""
  );
}

function getLandingCertificationEnabled(
  landing: Landing,
  certification: BrandCertification,
  index: number,
) {
  return Boolean(
    getLandingCertificationItem(landing, certification, index)?.enabled,
  );
}

function normalizeProgramInfoEditorItem(
  item: string | ProgramInfoItem,
  index: number,
): Required<ProgramInfoItem> {
  if (typeof item === "string") {
    return {
      key: `custom-${index + 1}`,
      label: `Dato ${index + 1}`,
      value: item,
    };
  }

  return {
    key: item.key || `custom-${index + 1}`,
    label: item.label || `Dato ${index + 1}`,
    value: item.value || "",
  };
}

export default function LandingEditor({
  brand,
  initialLanding,
  exportFilename,
}: Props) {
  const [landing, setLanding] = useState<Landing>(initialLanding);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [lastSavedSnapshot, setLastSavedSnapshot] = useState(() =>
    JSON.stringify(initialLanding),
  );
  const [analyzingColor, setAnalyzingColor] = useState(false);
  const [liveEditEnabled, setLiveEditEnabled] = useState(false);
  const [previewWidth, setPreviewWidth] = useState(1200);
  const [previewHeight, setPreviewHeight] = useState(820);
  const previewContentRef = useRef<HTMLDivElement | null>(null);
  const brandCertifications = brand.certifications ?? [];
  const hasBrandCertifications = brandCertifications.length > 0;
  const certificationsEnabled = Boolean(landing.certifications?.enabled);
  const currentSnapshot = JSON.stringify(landing);
  const hasChanges = currentSnapshot !== lastSavedSnapshot;
  const saveDisabled = saving || !hasChanges;

  const updateValueAtPath = (path: string, value: string | boolean) => {
    setLanding((prev) => {
      const next = structuredClone(prev) as EditableLanding;
      const keys = path.split(".");
      const fieldKey = keys.at(-1);

      if (!fieldKey) {
        return next;
      }

      const current = getRecordAtPath(next, keys.slice(0, -1));
      current[fieldKey] = value;
      return next;
    });
  };

  const updateField = (path: string, value: string) => {
    updateValueAtPath(path, value);
  };

  const liveEditConfig = {
    enabled: liveEditEnabled,
    onTextChange: updateField,
  };

  const updateBooleanField = (path: string, value: boolean) => {
    updateValueAtPath(path, value);
  };

  const updateCertificationItem = (
    certification: BrandCertification,
    index: number,
    patch: Partial<EditableCertificationItem>,
  ) => {
    setLanding((prev) => {
      const next = structuredClone(prev) as EditableLanding;

      if (!isRecord(next.certifications)) {
        next.certifications = {};
      }

      const certifications = next.certifications as EditableRecord;

      if (!Array.isArray(certifications.items)) {
        certifications.items = [];
      }

      const items = certifications.items as EditableCertificationItem[];
      const certificationKey = getCertificationKey(certification);
      let itemIndex = items.findIndex(
        (item) => `${item.name || ""}|${item.url || ""}` === certificationKey,
      );

      if (itemIndex === -1) {
        itemIndex = index;
      }

      const currentItem = items[itemIndex] ?? {};
      items[itemIndex] = {
        ...currentItem,
        name: certification.name || `Certificación ${index + 1}`,
        url: certification.url || "",
        enabled: currentItem.enabled ?? false,
        resolutionText: currentItem.resolutionText ?? "",
        ...patch,
      };

      return next;
    });
  };

  const updateCertificationEnabled = (
    certification: BrandCertification,
    index: number,
    enabled: boolean,
  ) => {
    updateCertificationItem(certification, index, { enabled });
  };

  const updateCertificationResolution = (
    certification: BrandCertification,
    index: number,
    value: string,
  ) => {
    updateCertificationItem(certification, index, { resolutionText: value });
  };

  const updateArrayItem = (
    arrayPath: string,
    index: number,
    field: string,
    value: string,
  ) => {
    setLanding((prev) => {
      const next = structuredClone(prev) as EditableLanding;
      const current = getArrayAtPath(next, arrayPath);

      if (!current[index]) current[index] = {};
      current[index][field] = value;

      return next;
    });
  };

  const addArrayItem = (arrayPath: string, newItem: EditableArrayItem) => {
    setLanding((prev) => {
      const next = structuredClone(prev) as EditableLanding;
      const current = getArrayAtPath(next, arrayPath);

      current.push(newItem);
      return next;
    });
  };

  const updateTextArrayItem = (
    arrayPath: string,
    index: number,
    value: string,
  ) => {
    setLanding((prev) => {
      const next = structuredClone(prev) as EditableLanding;
      const current = getArrayAtPath(
        next,
        arrayPath,
      ) as unknown as EditableTextArray;

      current[index] = value;
      return next;
    });
  };

  const addTextArrayItem = (arrayPath: string, value = "") => {
    setLanding((prev) => {
      const next = structuredClone(prev) as EditableLanding;
      const current = getArrayAtPath(
        next,
        arrayPath,
      ) as unknown as EditableTextArray;

      current.push(value);
      return next;
    });
  };

  const addProgramInfoItem = () => {
    setLanding((prev) => ({
      ...prev,
      programInfo: [
        ...(prev.programInfo ?? []),
        {
          key: "custom",
          label: "Dato",
          value: "Nuevo dato",
        },
      ],
    }));
  };

  const updateProgramInfoItem = (
    index: number,
    field: EditableProgramInfoField,
    value: string,
  ) => {
    setLanding((prev) => {
      const next = structuredClone(prev);
      const items = [...(next.programInfo ?? [])];
      const current = normalizeProgramInfoEditorItem(
        items[index] ?? "",
        index,
      );

      items[index] = {
        ...current,
        [field]: value,
      };
      next.programInfo = items;

      return next;
    });
  };

  const removeArrayItem = (arrayPath: string, index: number) => {
    setLanding((prev) => {
      const next = structuredClone(prev) as EditableLanding;
      const current = getArrayAtPath(next, arrayPath);

      current.splice(index, 1);
      return next;
    });
  };

  const saveLanding = async () => {
    if (saveDisabled) {
      return;
    }

    try {
      setSaving(true);
      setMessage("");

      const res = await fetch(
        `/api/landings/${landing.brand}/${landing.slug}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(landing),
        },
      );

      if (!res.ok) {
        throw new Error("No se pudo guardar la landing");
      }

      setLastSavedSnapshot(currentSnapshot);
      setMessage("Cambios guardados correctamente");
    } catch {
      setMessage("Ocurrió un error al guardar");
    } finally {
      setSaving(false);
    }
  };

  const analyzeHeroImageColor = async () => {
    if (!landing.hero?.backgroundImage) {
      setMessage("Agrega primero una URL de imagen de fondo para analizar.");
      return;
    }

    try {
      setAnalyzingColor(true);
      setMessage("");

      const response = await fetch("/api/analyze-image-color", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          imageUrl: landing.hero.backgroundImage,
          fallbackHex: brand.primaryColor,
        }),
      });

      const result = (await response.json()) as {
        error?: string;
        warning?: string;
        hex?: string;
        rgb?: { red: number; green: number; blue: number };
        imageUrl?: string;
        sampleSize?: { width: number; height: number };
      };

      if (!response.ok) {
        throw new Error(result.error || "No se pudo analizar la imagen.");
      }

      if (result.hex) {
        updateField("hero.overlayColor", result.hex);
      }

      console.log("Hero image color analysis", result);
      setMessage(
        result.warning ||
          `Color analizado y aplicado al hero: ${result.hex}`,
      );
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "No se pudo analizar el color de la imagen.";

      if (brand.primaryColor) {
        updateField("hero.overlayColor", brand.primaryColor);
        setMessage(
          `${errorMessage} Se aplico el color principal de la marca como overlay.`,
        );
      } else {
        setMessage(errorMessage);
      }
    } finally {
      setAnalyzingColor(false);
    }
  };

  const downloadBlob = async (blob: Blob, suggestedName: string) => {
    const picker = (window as WindowWithSavePicker).showSaveFilePicker;

    if (picker) {
      try {
        const handle = await picker({
          suggestedName,
          types: [
            {
              description: "HTML",
              accept: {
                "text/html": [".html"],
              },
            },
          ],
        });
        const writable = await handle.createWritable();

        await writable.write(blob);
        await writable.close();
        return;
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }
      }
    }

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = suggestedName;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  const collectInlineStyles = () => {
    const chunks: string[] = [];

    for (const sheet of Array.from(document.styleSheets)) {
      try {
        const rules = Array.from(sheet.cssRules);
        const cssText = rules.map((rule) => rule.cssText).join("\n");

        if (cssText.trim()) {
          chunks.push(cssText);
        }
      } catch {
        // Ignore cross-origin stylesheets that the browser won't let us read.
      }
    }

    return chunks.join("\n\n");
  };

  const absolutizeAssetUrls = (root: HTMLElement) => {
    const attributes = ["src", "href", "poster"] as const;

    for (const selector of ["[src]", "[href]", "[poster]"]) {
      for (const element of Array.from(root.querySelectorAll(selector))) {
        for (const attribute of attributes) {
          const value = element.getAttribute(attribute);

          if (!value || !value.startsWith("/")) {
            continue;
          }

          element.setAttribute(
            attribute,
            new URL(value, window.location.origin).toString(),
          );
        }
      }
    }
  };

  const sanitizeExportedInteractiveState = (root: HTMLElement) => {
    for (const form of Array.from(root.querySelectorAll("form"))) {
      form.removeAttribute("data-verity-bound");

      const submitButton = form.querySelector(
        'button[type="submit"]',
      ) as HTMLButtonElement | null;

      if (submitButton) {
        submitButton.disabled = false;
      }

      for (const statusNode of Array.from(
        form.querySelectorAll("[data-tone]"),
      )) {
        statusNode.textContent = "";
        statusNode.setAttribute("data-tone", "idle");
      }
    }
  };

  const exportPreviewHtml = async () => {
    try {
      const previewRoot = previewContentRef.current;

      if (!previewRoot) {
        throw new Error("No se encontró el preview de la landing para exportar.");
      }

      const clone = previewRoot.cloneNode(true);

      if (!(clone instanceof HTMLDivElement)) {
        throw new Error("No se pudo preparar el HTML de exportación.");
      }

      absolutizeAssetUrls(clone);
      sanitizeExportedInteractiveState(clone);

      const accordionBootstrapScript = `<script>
document.addEventListener("DOMContentLoaded", function () {
  var accordions = Array.prototype.slice.call(
    document.querySelectorAll("[data-landing-accordion]")
  );

  accordions.forEach(function (accordion) {
    var triggers = Array.prototype.slice.call(
      accordion.querySelectorAll("[data-accordion-trigger='true']")
    );
    var panels = Array.prototype.slice.call(
      accordion.querySelectorAll("[data-accordion-panel='true']")
    );

    triggers.forEach(function (trigger, index) {
      trigger.addEventListener("click", function () {
        triggers.forEach(function (currentTrigger, currentIndex) {
          var panel = panels[currentIndex];
          var icon = currentTrigger.querySelector("[data-accordion-icon='true']");
          var isActive = currentIndex === index;

          currentTrigger.setAttribute("aria-expanded", isActive ? "true" : "false");

          if (panel) {
            panel.hidden = !isActive;
          }

          if (icon) {
            icon.classList.toggle("rotate-45", isActive);
          }
        });
      });
    });
  });
});
</script>`;

      const html = `<!DOCTYPE html>
<html lang="${landing.language || "es"}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${landing.fullTitle || landing.title || "Programa"}</title>
  <style>
${collectInlineStyles()}
  </style>
</head>
<body style="margin:0;background:#ffffff;">
${clone.innerHTML}
${accordionBootstrapScript}
</body>
</html>`;

      await downloadBlob(
        new Blob([html], { type: "text/html;charset=utf-8" }),
        exportFilename,
      );
    } catch (error) {
      console.error(error);
      window.alert(
        error instanceof Error
          ? error.message
          : "No se pudo exportar el HTML.",
      );
    }
  };

  return (
    <div className="grid gap-0 border border-gray-200 bg-white dark:border-slate-800 dark:bg-slate-950 xl:grid-cols-[380px_minmax(0,1fr)]">
      <div className="flex h-[calc(100vh-8rem)] flex-col overflow-hidden border-r border-gray-200 bg-white dark:border-slate-800 dark:bg-slate-950 xl:sticky xl:top-[81px]">
        <div className="border-b border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-slate-50">
            Editar landing
          </h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-slate-400">
            Edita solo los contenidos visibles en la landing.
          </p>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto p-4">
          <div className="space-y-3">
            <EditorSection title="Estado" defaultOpen>
              <SelectField
                label="Estado de la landing"
                value={landing.status || "draft"}
                onChange={(value) => updateField("status", value)}
                options={[
                  { value: "draft", label: "Draft" },
                  { value: "published", label: "Published" },
                ]}
              />

              <p className="text-xs leading-5 text-gray-500 dark:text-slate-400">
                El estado se guarda junto con el resto de cambios de la landing.
              </p>
            </EditorSection>

            <EditorSection title="Logo" defaultOpen>
              <div>
                <span className="mb-2 block text-sm font-semibold text-gray-900 dark:text-slate-100">
                  Versión del logo
                </span>
                <div className="inline-flex rounded-md border border-gray-300 bg-gray-100 p-1 dark:border-slate-700 dark:bg-slate-900">
                  {(["light", "dark"] as const).map((mode) => {
                    const isSelected = (landing.logoMode || "dark") === mode;

                    return (
                      <button
                        key={mode}
                        type="button"
                        onClick={() => updateField("logoMode", mode)}
                        className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                          isSelected
                            ? "bg-white text-gray-950 dark:bg-slate-800 dark:text-white"
                            : "text-gray-600 hover:text-gray-950 dark:text-slate-300 dark:hover:text-white"
                        }`}
                      >
                        {mode === "light" ? "Light" : "Dark"}
                      </button>
                    );
                  })}
                </div>
              </div>
            </EditorSection>

            <EditorSection title="Certificaciones">
              <div className="space-y-4">
                <div className="admin-panel-soft flex items-start justify-between gap-4 p-4">
                  <div>
                    <p className="text-sm font-semibold text-gray-900 dark:text-slate-100">
                      Mostrar certificaciones de la marca
                    </p>
                    <p className="mt-1 text-xs leading-5 text-gray-500 dark:text-slate-400">
                      Trae las certificaciones configuradas en la marca y las
                      muestra en esta landing.
                    </p>
                  </div>

                  <SwitchField
                    checked={certificationsEnabled}
                    disabled={!hasBrandCertifications}
                    onChange={(checked) =>
                      updateBooleanField("certifications.enabled", checked)
                    }
                    label="Mostrar certificaciones"
                  />
                </div>

                {hasBrandCertifications ? (
                  <div className="space-y-3">
                    {brandCertifications.map((certification, index) => {
                      const certificationEnabled =
                        getLandingCertificationEnabled(
                          landing,
                          certification,
                          index,
                        );

                      return (
                        <div
                          key={`${certification.name}-${index}`}
                          className="rounded-md border border-gray-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-950"
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <p className="text-sm font-semibold text-gray-900 dark:text-slate-100">
                                {certification.name ||
                                  `Certificación ${index + 1}`}
                              </p>
                              {certification.url ? (
                                <p className="mt-1 break-all text-xs text-gray-500 dark:text-slate-400">
                                  {certification.url}
                                </p>
                              ) : null}
                            </div>

                            {certificationsEnabled ? (
                              <SwitchField
                                checked={certificationEnabled}
                                onChange={(checked) =>
                                  updateCertificationEnabled(
                                    certification,
                                    index,
                                    checked,
                                  )
                                }
                                label={`Mostrar ${
                                  certification.name ||
                                  `certificación ${index + 1}`
                                }`}
                              />
                            ) : null}
                          </div>

                          {certificationsEnabled && certificationEnabled ? (
                            <div className="mt-4">
                              <TextareaField
                                label="Resolución"
                                value={getLandingCertificationResolution(
                                  landing,
                                  certification,
                                  index,
                                )}
                                onChange={(value) =>
                                  updateCertificationResolution(
                                    certification,
                                    index,
                                    value,
                                  )
                                }
                              />
                            </div>
                          ) : null}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="rounded-md border border-dashed border-gray-300 p-4 text-sm text-gray-500 dark:border-slate-700 dark:text-slate-400">
                    Esta marca todavía no tiene certificaciones configuradas.
                    Agrégalas primero en el editor de marca.
                  </div>
                )}

              </div>
            </EditorSection>

            {(landing.hero || landing.title || landing.fullTitle) && (
              <EditorSection title="Hero" defaultOpen>
                <Field
                  label="Título corto"
                  value={landing.title || ""}
                  onChange={(value) => updateField("title", value)}
                />

                <Field
                  label="Título completo"
                  value={landing.fullTitle || ""}
                  onChange={(value) => updateField("fullTitle", value)}
                />

                <Field
                  label="Texto superior"
                  value={landing.hero?.eyebrow || ""}
                  onChange={(value) => updateField("hero.eyebrow", value)}
                />

                <Field
                  label="Texto resaltado"
                  value={landing.hero?.highlight || ""}
                  onChange={(value) => updateField("hero.highlight", value)}
                />

                <Field
                  label="Título principal"
                  value={landing.hero?.title || ""}
                  onChange={(value) => updateField("hero.title", value)}
                />

                <Field
                  label="Descripción"
                  value={landing.hero?.description || ""}
                  onChange={(value) => updateField("hero.description", value)}
                />

                <Field
                  label="Texto de apoyo"
                  value={landing.hero?.supportText || ""}
                  onChange={(value) => updateField("hero.supportText", value)}
                />

                <Field
                  label="Modalidad"
                  value={landing.hero?.modality || ""}
                  onChange={(value) => updateField("hero.modality", value)}
                />

                <SelectField
                  label="Variante del hero"
                  value={landing.hero?.variant || "default"}
                  onChange={(value) => updateField("hero.variant", value)}
                  options={[
                    { value: "default", label: "Default" },
                    { value: "option-b", label: "Opción B con menú de anclas" },
                  ]}
                />

                <SelectField
                  label="Jornada"
                  value={landing.schedule || ""}
                  onChange={(value) => updateField("schedule", value)}
                  options={[
                    { value: "", label: "Seleccionar jornada" },
                    { value: "diurna", label: "Diurna" },
                    { value: "nocturna", label: "Nocturna" },
                    { value: "flexible", label: "Flexible" },
                  ]}
                />

                <Field
                  label="Valor semestre"
                  value={landing.hero?.semesterPrice || ""}
                  onChange={(value) => updateField("hero.semesterPrice", value)}
                />

                <Field
                  label="Precio oficial"
                  value={landing.hero?.price || ""}
                  onChange={(value) => updateField("hero.price", value)}
                />

                <Field
                  label="Precio con descuento"
                  value={landing.hero?.discountedPrice || ""}
                  onChange={(value) => updateField("hero.discountedPrice", value)}
                />

                <Field
                  label="Porcentaje de descuento"
                  value={landing.hero?.discountPercentage || ""}
                  onChange={(value) => updateField("hero.discountPercentage", value)}
                />

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-semibold text-gray-900 dark:text-slate-100">
                      Información general
                    </h4>

                    <button
                      type="button"
                      onClick={addProgramInfoItem}
                      className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-xs font-medium text-gray-700 dark:border-slate-600 dark:bg-slate-950 dark:text-slate-100"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      Agregar dato
                    </button>
                  </div>

                  {(landing.programInfo || []).map((item, index) => {
                    const programInfoItem = normalizeProgramInfoEditorItem(
                      item,
                      index,
                    );

                    return (
                      <div
                        key={index}
                        className="admin-panel-soft p-4"
                      >
                        <div className="mb-3 flex items-center justify-between">
                          <p className="text-sm font-semibold text-gray-900 dark:text-slate-100">
                            {programInfoItem.label || `Dato ${index + 1}`}
                          </p>

                          <button
                            type="button"
                            onClick={() => removeArrayItem("programInfo", index)}
                            className="inline-flex items-center gap-1 text-xs font-medium text-red-600"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            Eliminar
                          </button>
                        </div>

                        <div className="grid gap-3">
                          <Field
                            label="Propiedad"
                            value={programInfoItem.key}
                            onChange={(value) =>
                              updateProgramInfoItem(index, "key", value)
                            }
                          />

                          <Field
                            label="Etiqueta"
                            value={programInfoItem.label}
                            onChange={(value) =>
                              updateProgramInfoItem(index, "label", value)
                            }
                          />

                          <Field
                            label="Valor"
                            value={programInfoItem.value}
                            onChange={(value) =>
                              updateProgramInfoItem(index, "value", value)
                            }
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>

                <Field
                  label="URL imagen de fondo"
                  value={landing.hero?.backgroundImage || ""}
                  onChange={(value) =>
                    updateField("hero.backgroundImage", value)
                  }
                />

                <button
                  type="button"
                  onClick={analyzeHeroImageColor}
                  disabled={analyzingColor || !landing.hero?.backgroundImage}
                  className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-xs font-medium text-gray-700 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-600 dark:bg-slate-950 dark:text-slate-100"
                >
                  <Droplets className="h-3.5 w-3.5" />
                  {analyzingColor ? "Generando overlay..." : "Generar overlay"}
                </button>

                <Field
                  label="Color overlay del hero"
                  value={landing.hero?.overlayColor || ""}
                  onChange={(value) => updateField("hero.overlayColor", value)}
                />

                <Field
                  label="URL imagen persona/modelo"
                  value={landing.hero?.personImage || ""}
                  onChange={(value) => updateField("hero.personImage", value)}
                />
              </EditorSection>
            )}

            {landing.form && (
              <EditorSection title="Formulario">
                <Field
                  label="Script URL"
                  value={landing.form?.scriptUrl || ""}
                  onChange={(value) => updateField("form.scriptUrl", value)}
                />

                <TextareaField
                  label="Código del script del formulario"
                  value={landing.form?.scriptCode || ""}
                  onChange={(value) => updateField("form.scriptCode", value)}
                />

                <Field
                  label="Nombre del programa"
                  value={landing.form?.programName || ""}
                  onChange={(value) => updateField("form.programName", value)}
                />

                <Field
                  label="Campus"
                  value={landing.form?.campus || ""}
                  onChange={(value) => updateField("form.campus", value)}
                />

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-semibold text-gray-900 dark:text-slate-100">
                      Opciones de campus
                    </h4>

                    <button
                      type="button"
                      onClick={() =>
                        addArrayItem("form.campusOptions", {
                          label: "Nuevo campus",
                          campus: "",
                          campaigntype: "",
                        })
                      }
                      className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-xs font-medium text-gray-700 dark:border-slate-600 dark:bg-slate-950 dark:text-slate-100"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      Agregar campus
                    </button>
                  </div>

                  {(landing.form?.campusOptions || []).map((item, index) => (
                    <div
                      key={index}
                      className="admin-panel-soft p-4"
                    >
                      <div className="mb-3 flex items-center justify-between">
                        <p className="text-sm font-semibold text-gray-900 dark:text-slate-100">
                          Campus {index + 1}
                        </p>

                        <button
                          type="button"
                          onClick={() =>
                            removeArrayItem("form.campusOptions", index)
                          }
                          className="inline-flex items-center gap-1 text-xs font-medium text-red-600"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          Eliminar
                        </button>
                      </div>

                      <div className="space-y-3">
                        <Field
                          label="Label visible"
                          value={typeof item === "string" ? "" : item?.label || ""}
                          onChange={(value) =>
                            updateArrayItem(
                              "form.campusOptions",
                              index,
                              "label",
                              value,
                            )
                          }
                        />

                        <Field
                          label="Valor campus"
                          value={typeof item === "string" ? "" : item?.campus || ""}
                          onChange={(value) =>
                            updateArrayItem(
                              "form.campusOptions",
                              index,
                              "campus",
                              value,
                            )
                          }
                        />

                        <Field
                          label="Valor campaigntype"
                          value={
                            typeof item === "string"
                              ? ""
                              : item?.campaigntype || ""
                          }
                          onChange={(value) =>
                            updateArrayItem(
                              "form.campusOptions",
                              index,
                              "campaigntype",
                              value,
                            )
                          }
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <Field
                  label="Nombre input hidden"
                  value={landing.form?.hiddenProgramFieldName || ""}
                  onChange={(value) =>
                    updateField("form.hiddenProgramFieldName", value)
                  }
                />
              </EditorSection>
            )}

            {landing.whyStudy && (
              <EditorSection title="Sección: ¿Por qué estudiar?">
                <Field
                  label="Título de sección"
                  value={landing.whyStudy?.title || ""}
                  onChange={(value) => updateField("whyStudy.title", value)}
                />

                <TextareaField
                  label="Descripción"
                  value={landing.whyStudy?.description || ""}
                  onChange={(value) =>
                    updateField("whyStudy.description", value)
                  }
                />

                <Field
                  label="URL imagen de apoyo"
                  value={landing.whyStudy?.image || ""}
                  onChange={(value) => updateField("whyStudy.image", value)}
                />

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-semibold text-gray-900 dark:text-slate-100">
                      Items de la sección
                    </h4>

                    <button
                      type="button"
                      onClick={() =>
                        addArrayItem("whyStudy.items", {
                          title: "Nuevo título",
                          content: "Nuevo contenido",
                        })
                      }
                      className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-xs font-medium text-gray-700 dark:border-slate-600 dark:bg-slate-950 dark:text-slate-100"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      Agregar item
                    </button>
                  </div>

                  {(landing.whyStudy?.items || []).map(
                    (item, index) => (
                      <div
                        key={index}
                        className="admin-panel-soft p-4"
                      >
                        <div className="mb-3 flex items-center justify-between">
                          <p className="text-sm font-semibold text-gray-900 dark:text-slate-100">
                            Item {index + 1}
                          </p>

                          <button
                            type="button"
                            onClick={() =>
                              removeArrayItem("whyStudy.items", index)
                            }
                            className="inline-flex items-center gap-1 text-xs font-medium text-red-600"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            Eliminar
                          </button>
                        </div>

                        <div className="space-y-3">
                          <Field
                            label="Título"
                            value={typeof item === "string" ? "" : item?.title || ""}
                            onChange={(value) =>
                              updateArrayItem(
                                "whyStudy.items",
                                index,
                                "title",
                                value,
                              )
                            }
                          />

                          <TextareaField
                            label="Contenido"
                            value={
                              typeof item === "string"
                                ? item
                                : item?.content || item?.description || ""
                            }
                            onChange={(value) =>
                              updateArrayItem(
                                "whyStudy.items",
                                index,
                                "content",
                                value,
                              )
                            }
                          />
                        </div>
                      </div>
                    ),
                  )}
                </div>
              </EditorSection>
            )}

            {landing.curriculum && (
              <EditorSection title="Sección: Plan de estudios">
                <Field
                  label="Título de sección"
                  value={landing.curriculum?.title || ""}
                  onChange={(value) => updateField("curriculum.title", value)}
                />

                <TextareaField
                  label="Descripción"
                  value={landing.curriculum?.description || ""}
                  onChange={(value) =>
                    updateField("curriculum.description", value)
                  }
                />

                <Field
                  label="URL botón"
                  value={
                    landing.curriculum?.buttonUrl ||
                    landing.curriculum?.downloadUrl ||
                    ""
                  }
                  onChange={(value) => updateField("curriculum.buttonUrl", value)}
                />

                <Field
                  label="Texto botón"
                  value={landing.curriculum?.buttonTitle || ""}
                  onChange={(value) =>
                    updateField("curriculum.buttonTitle", value)
                  }
                />

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-semibold text-gray-900 dark:text-slate-100">
                      Items del plan
                    </h4>

                    <button
                      type="button"
                      onClick={() =>
                        addArrayItem("curriculum.items", {
                          title: "Nuevo título",
                          content: "Nuevo contenido",
                        })
                      }
                      className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-xs font-medium text-gray-700 dark:border-slate-600 dark:bg-slate-950 dark:text-slate-100"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      Agregar item
                    </button>
                  </div>

                  {(landing.curriculum?.items || []).map((item, index) => (
                    <div
                      key={index}
                      className="admin-panel-soft p-4"
                    >
                      <div className="mb-3 flex items-center justify-between">
                        <p className="text-sm font-semibold text-gray-900 dark:text-slate-100">
                          Item {index + 1}
                        </p>

                        <button
                          type="button"
                          onClick={() =>
                            removeArrayItem("curriculum.items", index)
                          }
                          className="inline-flex items-center gap-1 text-xs font-medium text-red-600"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          Eliminar
                        </button>
                      </div>

                      <div className="space-y-3">
                        <Field
                          label="Título"
                          value={typeof item === "string" ? "" : item?.title || ""}
                          onChange={(value) =>
                            updateArrayItem(
                              "curriculum.items",
                              index,
                              "title",
                              value,
                            )
                          }
                        />

                        <TextareaField
                          label="Contenido"
                          value={
                            typeof item === "string"
                              ? item
                              : item?.content || item?.description || ""
                          }
                          onChange={(value) =>
                            updateArrayItem(
                              "curriculum.items",
                              index,
                              "content",
                              value,
                            )
                          }
                        />

                        <Field
                          label="URL"
                          value={typeof item === "string" ? "" : item?.url || ""}
                          onChange={(value) =>
                            updateArrayItem(
                              "curriculum.items",
                              index,
                              "url",
                              value,
                            )
                          }
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </EditorSection>
            )}

            {landing.graduateProfile && (
              <EditorSection title="Sección: Perfil del egresado">
                <Field
                  label="Título de sección"
                  value={landing.graduateProfile?.title || ""}
                  onChange={(value) =>
                    updateField("graduateProfile.title", value)
                  }
                />

                <Field
                  label="URL imagen de apoyo"
                  value={landing.graduateProfile?.image || ""}
                  onChange={(value) =>
                    updateField("graduateProfile.image", value)
                  }
                />

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-semibold text-gray-900 dark:text-slate-100">
                      Items del perfil
                    </h4>

                    <button
                      type="button"
                      onClick={() =>
                        addArrayItem("graduateProfile.items", {
                          title: "Nuevo título",
                          content: "Nuevo contenido",
                        })
                      }
                      className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-xs font-medium text-gray-700 dark:border-slate-600 dark:bg-slate-950 dark:text-slate-100"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      Agregar item
                    </button>
                  </div>

                  {(landing.graduateProfile?.items || []).map((item, index) => (
                    <div
                      key={index}
                      className="admin-panel-soft p-4"
                    >
                      <div className="mb-3 flex items-center justify-between">
                        <p className="text-sm font-semibold text-gray-900 dark:text-slate-100">
                          Item {index + 1}
                        </p>

                        <button
                          type="button"
                          onClick={() =>
                            removeArrayItem("graduateProfile.items", index)
                          }
                          className="inline-flex items-center gap-1 text-xs font-medium text-red-600"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          Eliminar
                        </button>
                      </div>

                      <div className="space-y-3">
                        <Field
                          label="Título"
                          value={typeof item === "string" ? "" : item?.title || ""}
                          onChange={(value) =>
                            updateArrayItem(
                              "graduateProfile.items",
                              index,
                              "title",
                              value,
                            )
                          }
                        />

                        <TextareaField
                          label="Contenido"
                          value={
                            typeof item === "string"
                              ? item
                              : item?.content || item?.description || ""
                          }
                          onChange={(value) =>
                            updateArrayItem(
                              "graduateProfile.items",
                              index,
                              "content",
                              value,
                            )
                          }
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </EditorSection>
            )}

            {landing.supportSection && (
              <EditorSection title="Sección: Apoyamos tu carrera">
                <Field
                  label="Título de sección"
                  value={landing.supportSection?.title || ""}
                  onChange={(value) =>
                    updateField("supportSection.title", value)
                  }
                />

                <Field
                  label="URL del video"
                  value={landing.supportSection?.videoUrl || ""}
                  onChange={(value) =>
                    updateField("supportSection.videoUrl", value)
                  }
                />

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-semibold text-gray-900 dark:text-slate-100">
                      Cards de apoyo
                    </h4>

                    <button
                      type="button"
                      onClick={() =>
                        addArrayItem("supportSection.items", {
                          title: "Nuevo título",
                          text: "Nuevo contenido",
                          icon: "",
                        })
                      }
                      className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-xs font-medium text-gray-700 dark:border-slate-600 dark:bg-slate-950 dark:text-slate-100"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      Agregar item
                    </button>
                  </div>

                  {(landing.supportSection?.items || []).map(
                    (item, index) => (
                      <div
                        key={index}
                        className="admin-panel-soft p-4"
                      >
                        <div className="mb-3 flex items-center justify-between">
                          <p className="text-sm font-semibold text-gray-900 dark:text-slate-100">
                            Card {index + 1}
                          </p>

                          <button
                            type="button"
                            onClick={() =>
                              removeArrayItem("supportSection.items", index)
                            }
                            className="inline-flex items-center gap-1 text-xs font-medium text-red-600"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            Eliminar
                          </button>
                        </div>

                        <div className="space-y-3">
                          <Field
                            label="Título"
                            value={typeof item === "string" ? "" : item?.title || ""}
                            onChange={(value) =>
                              updateArrayItem(
                                "supportSection.items",
                                index,
                                "title",
                                value,
                              )
                            }
                          />

                          <TextareaField
                            label="Contenido"
                            value={
                              typeof item === "string"
                                ? item
                                : item?.text || item?.description || ""
                            }
                            onChange={(value) =>
                              updateArrayItem(
                                "supportSection.items",
                                index,
                                "text",
                                value,
                              )
                            }
                          />

                          <Field
                            label="URL icono"
                            value={typeof item === "string" ? "" : item?.icon || ""}
                            onChange={(value) =>
                              updateArrayItem(
                                "supportSection.items",
                                index,
                                "icon",
                                value,
                              )
                            }
                          />
                        </div>
                      </div>
                    ),
                  )}
                </div>
              </EditorSection>
            )}

            {landing.benefits && (
              <EditorSection title="Sección: Beneficios">
                <Field
                  label="Título de sección"
                  value={landing.benefits?.title || ""}
                  onChange={(value) => updateField("benefits.title", value)}
                />

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-semibold text-gray-900 dark:text-slate-100">
                      Items de beneficios
                    </h4>

                    <button
                      type="button"
                      onClick={() =>
                        addArrayItem("benefits.items", {
                          title: "Nuevo beneficio",
                          text: "Nuevo contenido",
                          icon: "",
                        })
                      }
                      className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-xs font-medium text-gray-700 dark:border-slate-600 dark:bg-slate-950 dark:text-slate-100"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      Agregar item
                    </button>
                  </div>

                  {(landing.benefits?.items || []).map(
                    (item, index) => (
                      <div
                        key={index}
                        className="admin-panel-soft p-4"
                      >
                        <div className="mb-3 flex items-center justify-between">
                          <p className="text-sm font-semibold text-gray-900 dark:text-slate-100">
                            Beneficio {index + 1}
                          </p>

                          <button
                            type="button"
                            onClick={() =>
                              removeArrayItem("benefits.items", index)
                            }
                            className="inline-flex items-center gap-1 text-xs font-medium text-red-600"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            Eliminar
                          </button>
                        </div>

                        <div className="space-y-3">
                          <Field
                            label="Título"
                            value={typeof item === "string" ? "" : item?.title || ""}
                            onChange={(value) =>
                              updateArrayItem(
                                "benefits.items",
                                index,
                                "title",
                                value,
                              )
                            }
                          />

                          <TextareaField
                            label="Contenido"
                            value={
                              typeof item === "string"
                                ? item
                                : item?.text || item?.description || ""
                            }
                            onChange={(value) =>
                              updateArrayItem(
                                "benefits.items",
                                index,
                                "text",
                                value,
                              )
                            }
                          />

                          <Field
                            label="URL icono"
                            value={typeof item === "string" ? "" : item?.icon || ""}
                            onChange={(value) =>
                              updateArrayItem(
                                "benefits.items",
                                index,
                                "icon",
                                value,
                              )
                            }
                          />
                        </div>
                      </div>
                    ),
                  )}
                </div>
              </EditorSection>
            )}

            {landing.cta && (
              <EditorSection title="CTA final">
                <Field
                  label="Título CTA"
                  value={landing.cta?.title || ""}
                  onChange={(value) => updateField("cta.title", value)}
                />

                <Field
                  label="Texto del botón"
                  value={landing.cta?.button || ""}
                  onChange={(value) => updateField("cta.button", value)}
                />
              </EditorSection>
            )}

            <EditorSection title="Scripts finales">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-slate-100">
                    Scripts al final de la landing
                  </h4>

                  <button
                    type="button"
                    onClick={() =>
                      addTextArrayItem("footerScripts", "<script>\n</script>")
                    }
                      className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-xs font-medium text-gray-700 dark:border-slate-600 dark:bg-slate-950 dark:text-slate-100"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    Agregar script
                  </button>
                </div>

                {(landing.footerScripts || []).map((script: string, index) => (
                  <div
                    key={index}
                  className="admin-panel-soft p-4"
                  >
                    <div className="mb-3 flex items-center justify-between">
                      <p className="text-sm font-semibold text-gray-900 dark:text-slate-100">
                        Script {index + 1}
                      </p>

                      <button
                        type="button"
                        onClick={() => removeArrayItem("footerScripts", index)}
                        className="inline-flex items-center gap-1 text-xs font-medium text-red-600"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        Eliminar
                      </button>
                    </div>

                    <TextareaField
                      label="Código"
                      value={script || ""}
                      onChange={(value) =>
                        updateTextArrayItem("footerScripts", index, value)
                      }
                    />
                  </div>
                ))}
              </div>
            </EditorSection>
          </div>
        </div>

        <div className="flex items-center gap-3 border-t border-gray-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950">
          <button
            onClick={saveLanding}
            disabled={saveDisabled}
            className="bunji-button-primary rounded-md px-4 py-3 text-sm font-medium shadow-[0_10px_30px_rgba(62,57,137,0.26)] transition hover:brightness-110 disabled:opacity-60 disabled:hover:brightness-100"
            style={{
              backgroundColor: "var(--bunji-primary)",
              borderColor: "var(--bunji-primary)",
              color: "#fff",
            }}
          >
            {saving ? "Guardando..." : "Guardar cambios"}
          </button>

          <button
            type="button"
            onClick={exportPreviewHtml}
            className="rounded-md border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
          >
            <span className="inline-flex items-center gap-2">
              <FileDown className="h-4 w-4" />
              Exportar HTML
            </span>
          </button>

          <Link
            href={`/landings/${landing.brand}/${landing.slug}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
          >
            <Eye className="h-4 w-4" />
            Preview
          </Link>

          {message ? <p className="text-sm text-gray-600 dark:text-slate-300">{message}</p> : null}
        </div>
      </div>

      <div className="bg-white dark:bg-slate-950">
        <div className="flex flex-wrap items-end gap-4 border-b border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-white/[0.035]">
          <PreviewControl
            label="Ancho"
            min={360}
            max={1440}
            value={previewWidth}
            onChange={setPreviewWidth}
          />
          <PreviewControl
            label="Alto"
            min={480}
            max={1200}
            value={previewHeight}
            onChange={setPreviewHeight}
          />
          <button
            type="button"
            onClick={() => {
              setPreviewWidth(390);
              setPreviewHeight(844);
            }}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-xs font-medium text-gray-700 dark:border-slate-600 dark:bg-slate-950 dark:text-slate-100"
          >
            <Smartphone className="h-3.5 w-3.5" />
            Mobile
          </button>
          <button
            type="button"
            onClick={() => {
              setPreviewWidth(768);
              setPreviewHeight(900);
            }}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-xs font-medium text-gray-700 dark:border-slate-600 dark:bg-slate-950 dark:text-slate-100"
          >
            <Tablet className="h-3.5 w-3.5" />
            Tablet
          </button>
          <button
            type="button"
            onClick={() => {
              setPreviewWidth(1200);
              setPreviewHeight(820);
            }}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-xs font-medium text-gray-700 dark:border-slate-600 dark:bg-slate-950 dark:text-slate-100"
          >
            <Laptop className="h-3.5 w-3.5" />
            Desktop
          </button>
          <button
            type="button"
            onClick={() => setLiveEditEnabled((current) => !current)}
            className={`inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-xs font-semibold transition ${
              liveEditEnabled
                ? "border-[var(--bunji-primary)] bg-[var(--bunji-primary)] text-white shadow-[0_10px_24px_rgba(62,57,137,0.22)]"
                : "border-gray-300 bg-white text-gray-700 dark:border-slate-600 dark:bg-slate-950 dark:text-slate-100"
            }`}
          >
            <MousePointerClick className="h-3.5 w-3.5" />
            {liveEditEnabled ? "Live edit activo" : "Live edit"}
          </button>
          {liveEditEnabled ? (
            <p className="max-w-sm text-xs leading-5 text-gray-600 dark:text-slate-300">
              Haz click en los textos marcados, edita y sal del campo para
              actualizar el JSON.
            </p>
          ) : null}
        </div>

        <div className="max-h-[calc(100vh-240px)] overflow-auto border-t border-gray-200 bg-gray-100 p-4 dark:border-slate-800 dark:bg-[#020617]">
          <div
            className="mx-auto overflow-auto border border-slate-200 bg-white"
            style={{
              width: previewWidth,
              height: previewHeight,
              maxWidth: "100%",
            }}
          >
            <div ref={previewContentRef}>
              {renderLandingTemplate({
                brand,
                landing,
                liveEdit: liveEditConfig,
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PreviewControl({
  label,
  min,
  max,
  value,
  onChange,
}: {
  label: string;
  min: number;
  max: number;
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <label className="grid gap-1">
      <span className="text-xs font-semibold text-gray-700 dark:text-slate-200">{label}</span>
      <div className="flex items-center gap-2">
        <input
          type="range"
          min={min}
          max={max}
          value={value}
          onChange={(event) => onChange(Number(event.target.value))}
          className="w-28"
        />
        <input
          type="number"
          min={min}
          max={max}
          value={value}
          onChange={(event) => onChange(Number(event.target.value))}
          className="w-20 rounded-lg border border-gray-300 px-2 py-1 text-xs text-gray-900 dark:border-slate-600 dark:bg-slate-950 dark:text-slate-100"
        />
      </div>
    </label>
  );
}

function EditorSection({
  title,
  children,
  defaultOpen = false,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <section className="admin-panel overflow-hidden">
      <button
        type="button"
        onClick={() => setIsOpen((value) => !value)}
        className="flex w-full items-center justify-between gap-3 bg-slate-50 px-4 py-3 text-left transition hover:bg-slate-100 dark:bg-white/[0.035] dark:hover:bg-white/[0.06]"
        aria-expanded={isOpen}
      >
        <span className="text-sm font-semibold uppercase tracking-wide text-slate-950 dark:text-slate-100">
          {title}
        </span>
        <span className="flex h-7 w-7 items-center justify-center rounded-full border border-gray-300 text-sm text-gray-600 dark:border-slate-700 dark:text-slate-300">
          {isOpen ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </span>
      </button>

      {isOpen ? (
        <div className="space-y-4 border-t border-slate-200 p-4 dark:border-white/10">{children}</div>
      ) : null}
    </section>
  );
}

function SwitchField({
  checked,
  disabled = false,
  label,
  onChange,
}: {
  checked: boolean;
  disabled?: boolean;
  label: string;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label className="inline-flex shrink-0 cursor-pointer items-center">
      <span className="sr-only">{label}</span>
      <input
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={(event) => onChange(event.target.checked)}
        className="sr-only"
      />
      <span
        className={`relative h-7 w-12 rounded-full transition ${
          checked
            ? "bg-[var(--bunji-primary)]"
            : "bg-gray-300 dark:bg-slate-700"
        } ${disabled ? "cursor-not-allowed opacity-50" : ""}`}
      >
        <span
          className={`absolute left-1 top-1 h-5 w-5 rounded-full bg-white shadow-sm transition ${
            checked ? "translate-x-5" : ""
          }`}
        />
      </span>
    </label>
  );
}

function Field({
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
      <span className="mb-1 block text-sm font-semibold text-slate-950 dark:text-slate-100">
        {label}
      </span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
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
      <span className="mb-1 block text-sm font-semibold text-slate-950 dark:text-slate-100">
        {label}
      </span>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={4}
        className="admin-textarea"
      />
    </label>
  );
}

function SelectField({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: Array<{
    value: string;
    label: string;
  }>;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-semibold text-slate-950 dark:text-slate-100">
        {label}
      </span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="admin-input"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}
