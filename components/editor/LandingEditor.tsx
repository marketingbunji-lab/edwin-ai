"use client";

import Link from "next/link";
import { type MouseEvent, useEffect, useMemo, useRef, useState } from "react";
import {
  Code2,
  Droplets,
  ChevronDown,
  ChevronUp,
  Eye,
  FileDown,
  ImagePlus,
  Laptop,
  Plus,
  Settings,
  Smartphone,
  Tablet,
  Trash2,
  X,
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
  imageAssets?: LandingImageAsset[];
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
type EditableArrayItem = Record<string, string | string[]>;
type EditableTextArray = string[];
type EditableProgramInfoField = "key" | "label" | "value";
type EditableCertificationItem = {
  name: string;
  url?: string;
  enabled?: boolean;
  resolutionText?: string;
};
type HeroMenuOption = {
  id: string;
  label: string;
};

type VariantControlConfig = {
  id: string;
  label: string;
  selector: string;
  path: string;
  currentValue: string;
  options: Array<{
    label: string;
    value: string;
    title: string;
  }>;
};

type VariantControlPosition = {
  id: string;
  top: number;
  left: number | undefined;
};

type ImageEditTarget = {
  path: string;
  label: string;
};

export type LandingImageAsset = {
  id: string;
  name: string;
  url: string;
  source: "program" | "brand";
  categoryLabel: string;
  notes?: string;
};

type AssetSourceTab = "url" | "program" | "brand";

const HERO_MENU_OPTIONS: HeroMenuOption[] = [
  { id: "landing-overview", label: "Conoce el programa" },
  { id: "landing-why-study", label: "Por qué estudiar" },
  { id: "landing-graduate-profile", label: "Perfil del egresado" },
  { id: "landing-career-opportunities", label: "Oportunidades laborales" },
  { id: "landing-curriculum", label: "Ruta formativa" },
  { id: "landing-hands-on-training", label: "Entrenamiento práctico" },
  { id: "landing-externship", label: "Prácticas" },
  { id: "landing-support", label: "Apoyo al estudiante" },
  { id: "landing-benefits", label: "Beneficios" },
  { id: "landing-admissions", label: "Admisiones" },
  { id: "landing-financial-aid", label: "Ayuda financiera" },
  { id: "landing-testimonials", label: "Testimonios" },
  { id: "landing-faq", label: "Preguntas frecuentes" },
  { id: "landing-campuses", label: "Campus" },
];

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

function isArrayIndex(value: string) {
  return /^\d+$/.test(value);
}

function setValueAtPath(
  target: EditableRecord,
  path: string,
  value: string | boolean,
) {
  const keys = path.split(".");
  const fieldKey = keys.at(-1);

  if (!fieldKey) return;

  let current: unknown = target;

  for (let index = 0; index < keys.length - 1; index += 1) {
    const key = keys[index];
    const nextKey = keys[index + 1];
    const shouldCreateArray = isArrayIndex(nextKey);

    if (Array.isArray(current)) {
      const arrayIndex = Number(key);

      if (!isRecord(current[arrayIndex]) && !Array.isArray(current[arrayIndex])) {
        current[arrayIndex] = shouldCreateArray ? [] : {};
      }

      current = current[arrayIndex];
      continue;
    }

    if (!isRecord(current)) {
      return;
    }

    if (!isRecord(current[key]) && !Array.isArray(current[key])) {
      current[key] = shouldCreateArray ? [] : {};
    }

    current = current[key];
  }

  if (Array.isArray(current)) {
    current[Number(fieldKey)] = value;
    return;
  }

  if (isRecord(current)) {
    current[fieldKey] = value;
  }
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
  imageAssets = [],
}: Props) {
  const [landing, setLanding] = useState<Landing>(initialLanding);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [lastSavedSnapshot, setLastSavedSnapshot] = useState(() =>
    JSON.stringify(initialLanding),
  );
  const [analyzingColor, setAnalyzingColor] = useState(false);
  const liveEditEnabled = true;
  const [previewWidth, setPreviewWidth] = useState(1200);
  const [previewHeight, setPreviewHeight] = useState(720);
  const [variantControlPositions, setVariantControlPositions] = useState<
    VariantControlPosition[]
  >([]);
  const [imageEditTarget, setImageEditTarget] =
    useState<ImageEditTarget | null>(null);
  const [imageUrlDraft, setImageUrlDraft] = useState("");
  const [footerScriptsModalOpen, setFooterScriptsModalOpen] = useState(false);
  const [formSettingsModalOpen, setFormSettingsModalOpen] = useState(false);
  const [formSettingsPosition, setFormSettingsPosition] =
    useState<VariantControlPosition | null>(null);
  const [heroSettingsModalOpen, setHeroSettingsModalOpen] = useState(false);
  const [heroSettingsPosition, setHeroSettingsPosition] =
    useState<VariantControlPosition | null>(null);
  const previewContentRef = useRef<HTMLDivElement | null>(null);
  const brandCertifications = brand.certifications ?? [];
  const hasBrandCertifications = brandCertifications.length > 0;
  const certificationsEnabled = Boolean(landing.certifications?.enabled);
  const currentSnapshot = JSON.stringify(landing);
  const hasChanges = currentSnapshot !== lastSavedSnapshot;
  const saveDisabled = saving || !hasChanges;
  const variantControls = useMemo<VariantControlConfig[]>(
    () => [
      {
        id: "logo",
        label: "Logo",
        selector: "[data-landing-logo-mode-control]",
        path: "logoMode",
        currentValue: landing.logoMode || "dark",
        options: [
          { label: "Light", value: "light", title: "Usar logo light" },
          { label: "Dark", value: "dark", title: "Usar logo dark" },
        ],
      },
      {
        id: "hero",
        label: "Hero",
        selector: "#landing-hero",
        path: "hero.variant",
        currentValue: landing.hero?.variant || "default",
        options: [
          { label: "A", value: "default", title: "Hero A" },
          { label: "B", value: "option-b", title: "Hero B" },
        ],
      },
      ...(landing.financialAid
        ? [
            {
              id: "financial-aid",
              label: "Ayuda financiera",
              selector: "#landing-financial-aid",
              path: "financialAid.variant",
              currentValue: landing.financialAid?.variant || "default",
              options: [
                {
                  label: "A" as const,
                  value: "default",
                  title: "Financial Aid A",
                },
                {
                  label: "B" as const,
                  value: "option-b",
                  title: "Financial Aid B",
                },
              ],
            },
          ]
        : []),
      ...(landing.cta
        ? [
            {
              id: "cta",
              label: "CTA",
              selector: "#landing-cta",
              path: "cta.variant",
              currentValue: landing.cta?.variant || "default",
              options: [
                { label: "A" as const, value: "default", title: "CTA A" },
                { label: "B" as const, value: "minimal", title: "CTA B" },
              ],
            },
          ]
        : []),
    ],
    [landing.cta, landing.financialAid, landing.hero?.variant, landing.logoMode],
  );

  useEffect(() => {
    const updateVariantControlPositions = () => {
      const previewContent = previewContentRef.current;

      if (!previewContent) {
        setVariantControlPositions([]);
        setFormSettingsPosition(null);
        setHeroSettingsPosition(null);
        return;
      }

      const nextPositions = variantControls
        .map((control) => {
          const element = previewContent.querySelector(control.selector);

          if (!(element instanceof HTMLElement)) {
            return null;
          }

          const previewRect = previewContent.getBoundingClientRect();
          const elementRect = element.getBoundingClientRect();
          const left =
            control.id === "logo"
              ? Math.max(
                  16,
                  Math.min(
                    elementRect.left - previewRect.left + elementRect.width + 18,
                    previewContent.clientWidth - 180,
                  ),
                )
              : undefined;

          return {
            id: control.id,
            top: Math.max(elementRect.top - previewRect.top, 16),
            left,
          };
        })
        .filter((position): position is VariantControlPosition =>
          Boolean(position),
        );

      setVariantControlPositions(nextPositions);

      const heroElement = previewContent.querySelector("#landing-hero");

      if (heroElement instanceof HTMLElement) {
        const previewRect = previewContent.getBoundingClientRect();
        const heroRect = heroElement.getBoundingClientRect();

        setHeroSettingsPosition({
          id: "hero-settings",
          top: Math.max(heroRect.top - previewRect.top + 72, 16),
          left: Math.max(
            16,
            Math.min(
              heroRect.right - previewRect.left - 56,
              previewContent.clientWidth - 64,
            ),
          ),
        });
      } else {
        setHeroSettingsPosition(null);
      }

      const formElement = previewContent.querySelector("#default-form");

      if (formElement instanceof HTMLElement) {
        const previewRect = previewContent.getBoundingClientRect();
        const formRect = formElement.getBoundingClientRect();

        setFormSettingsPosition({
          id: "form-settings",
          top: Math.max(formRect.top - previewRect.top + 16, 16),
          left: Math.max(
            16,
            Math.min(
              formRect.right - previewRect.left - 56,
              previewContent.clientWidth - 64,
            ),
          ),
        });
      } else {
        setFormSettingsPosition(null);
      }
    };

    updateVariantControlPositions();

    const resizeObserver =
      typeof ResizeObserver === "undefined"
        ? null
        : new ResizeObserver(updateVariantControlPositions);

    if (previewContentRef.current && resizeObserver) {
      resizeObserver.observe(previewContentRef.current);
    }

    window.addEventListener("resize", updateVariantControlPositions);

    return () => {
      resizeObserver?.disconnect();
      window.removeEventListener("resize", updateVariantControlPositions);
    };
  }, [landing, previewHeight, previewWidth, variantControls]);

  const updateValueAtPath = (path: string, value: string | boolean) => {
    setLanding((prev) => {
      const next = structuredClone(prev) as EditableLanding;

      setValueAtPath(next, path, value);
      return next;
    });
  };

  const updateField = (path: string, value: string) => {
    updateValueAtPath(path, value);
  };

  const openImageEditor = (path: string, label: string, value: string) => {
    setImageEditTarget({ path, label });
    setImageUrlDraft(value);
  };

  const closeImageEditor = () => {
    setImageEditTarget(null);
    setImageUrlDraft("");
  };

  const saveImageUrl = () => {
    if (!imageEditTarget) return;

    updateField(imageEditTarget.path, imageUrlDraft.trim());
    closeImageEditor();
  };

  const handlePreviewImageClick = (
    event: MouseEvent<HTMLDivElement>,
  ) => {
    if (!liveEditEnabled) return;

    const target = event.target as HTMLElement | null;
    const interactiveTarget = target?.closest(
      'a, button, input, textarea, select, [contenteditable="true"]',
    );

    if (interactiveTarget) {
      return;
    }

    const imageTarget = target?.closest<HTMLElement>("[data-live-image-path]");

    if (!imageTarget) {
      return;
    }

    const path = imageTarget.dataset.liveImagePath;

    if (!path) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();

    openImageEditor(
      path,
      imageTarget.dataset.liveImageLabel || "Imagen",
      imageTarget.dataset.liveImageValue || "",
    );
  };

  const createLiveItemForPath = (path: string): EditableArrayItem => {
    if (path === "summaryCards" || path === "programInfo") {
      return {
        label: "Nuevo dato",
        value: "Describe este dato",
      };
    }

    if (path === "faq") {
      return {
        question: "Nueva pregunta",
        answer: "Escribe aqui la respuesta.",
      };
    }

    if (path === "testimonials") {
      return {
        name: "Nombre del estudiante",
        role: "Rol o programa",
        quote: "Escribe aqui el testimonio.",
      };
    }

    return {
      title: "Nuevo item",
      description: "Describe este nuevo punto.",
    };
  };

  const addLiveItem = (path: string) => {
    addArrayItem(path, createLiveItemForPath(path));
  };

  const liveEditConfig = {
    enabled: liveEditEnabled,
    onTextChange: updateField,
    onAddItem: addLiveItem,
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

  const toggleHeroMenuItem = (itemId: string, checked: boolean) => {
    setLanding((prev) => {
      const next = structuredClone(prev) as EditableLanding;

      if (!isRecord(next.hero)) {
        next.hero = {};
      }

      const hero = next.hero as EditableRecord;
      const currentItems = Array.isArray(hero.menuItems)
        ? (hero.menuItems as string[])
        : HERO_MENU_OPTIONS.map((option) => option.id);
      const nextItems = checked
        ? Array.from(new Set([...currentItems, itemId]))
        : currentItems.filter((currentId) => currentId !== itemId);

      hero.menuItems = HERO_MENU_OPTIONS
        .map((option) => option.id)
        .filter((optionId) => nextItems.includes(optionId));

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
    for (const editable of Array.from(
      root.querySelectorAll("[data-live-edit-path]"),
    )) {
      editable.removeAttribute("contenteditable");
      editable.removeAttribute("data-live-edit-path");
      editable.removeAttribute("title");
    }

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
    <div className="max-h-[calc(100vh-8rem)] min-w-0 border border-gray-200 bg-white dark:border-slate-800 dark:bg-slate-950">
      <div className="hidden">
        <div className="border-b border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-slate-50">
            Live editor
          </h2>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto p-4">
          <div className="space-y-3">
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

                <SelectField
                  label="Variante del hero"
                  value={landing.hero?.variant || "default"}
                  onChange={(value) => updateField("hero.variant", value)}
                  options={[
                    { value: "default", label: "Default" },
                    { value: "option-b", label: "Opción B con menú de anclas" },
                  ]}
                />

                {(landing.hero?.variant || "default") === "option-b" ? (
                  <div className="admin-panel-soft p-4">
                    <div className="mb-3">
                      <p className="text-sm font-semibold text-slate-950 dark:text-slate-100">
                        Items del menu del hero
                      </p>
                      <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
                        Selecciona las secciones que quieres mostrar en el menu
                        fijo. Si una seccion no tiene informacion en la data, no
                        se renderiza aunque este seleccionada.
                      </p>
                    </div>

                    <div className="grid gap-2">
                      {HERO_MENU_OPTIONS.map((option) => {
                        const selectedItems = landing.hero?.menuItems;
                        const isChecked = Array.isArray(selectedItems)
                          ? selectedItems.includes(option.id)
                          : true;

                        return (
                          <label
                            key={option.id}
                            className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-800 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                          >
                            <span>{option.label}</span>
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={(event) =>
                                toggleHeroMenuItem(
                                  option.id,
                                  event.target.checked,
                                )
                              }
                              className="h-4 w-4 rounded border-slate-300 text-[var(--bunji-primary)] focus:ring-[var(--bunji-primary)]"
                            />
                          </label>
                        );
                      })}
                    </div>
                  </div>
                ) : null}

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


            {landing.overview && (
              <EditorSection title="Seccion: Conoce el programa">

                <Field
                  label="URL imagen de apoyo"
                  value={landing.overview?.image || ""}
                  onChange={(value) => updateField("overview.image", value)}
                />

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-semibold text-gray-900 dark:text-slate-100">
                      Items del overview
                    </h4>

                    <button
                      type="button"
                      onClick={() =>
                        addArrayItem("overview.items", {
                          title: "Nuevo item",
                          description: "Describe este punto del programa.",
                        })
                      }
                      className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-xs font-medium text-gray-700 dark:border-slate-600 dark:bg-slate-950 dark:text-slate-100"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      Agregar item
                    </button>
                  </div>

                  {(landing.overview?.items || []).map((item, index) => (
                    <div key={index} className="admin-panel-soft p-4">
                      <div className="mb-3 flex items-center justify-between">
                        <p className="text-sm font-semibold text-gray-900 dark:text-slate-100">
                          Item {index + 1}
                        </p>

                        <button
                          type="button"
                          onClick={() => removeArrayItem("overview.items", index)}
                          className="inline-flex items-center gap-1 text-xs font-medium text-red-600"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          Eliminar
                        </button>
                      </div>

                      <PreviewEditableHint />
                    </div>
                  ))}
                </div>
              </EditorSection>
            )}

            {landing.whyStudy && (
              <EditorSection title="Sección: ¿Por qué estudiar?">

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

                        <PreviewEditableHint />
                      </div>
                    ),
                  )}
                </div>
              </EditorSection>
            )}

            {landing.curriculum && (
              <EditorSection title="Sección: Plan de estudios">

                <Field
                  label="URL botón"
                  value={
                    landing.curriculum?.buttonUrl ||
                    landing.curriculum?.downloadUrl ||
                    ""
                  }
                  onChange={(value) => updateField("curriculum.buttonUrl", value)}
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

                      <PreviewEditableHint />
                    </div>
                  ))}
                </div>
              </EditorSection>
            )}

            {landing.supportSection && (
              <EditorSection title="Sección: Apoyamos tu carrera">

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

            {landing.admissions && (
              <EditorSection title="Sección: Admisiones">

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-semibold text-gray-900 dark:text-slate-100">
                      Requisitos
                    </h4>

                    <button
                      type="button"
                      onClick={() =>
                        addArrayItem("admissions.items", {
                          title: "Nuevo requisito",
                          description: "Nuevo contenido",
                          url: "",
                          image: "",
                        })
                      }
                      className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-xs font-medium text-gray-700 dark:border-slate-600 dark:bg-slate-950 dark:text-slate-100"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      Agregar item
                    </button>
                  </div>

                  {(landing.admissions?.items || []).map((item, index) => (
                    <div
                      key={index}
                      className="admin-panel-soft p-4"
                    >
                      <div className="mb-3 flex items-center justify-between">
                        <p className="text-sm font-semibold text-gray-900 dark:text-slate-100">
                          Requisito {index + 1}
                        </p>

                        <button
                          type="button"
                          onClick={() => removeArrayItem("admissions.items", index)}
                          className="inline-flex items-center gap-1 text-xs font-medium text-red-600"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          Eliminar
                        </button>
                      </div>

                      <div className="space-y-3">

                        <Field
                          label="URL"
                          value={typeof item === "string" ? "" : item?.url || ""}
                          onChange={(value) =>
                            updateArrayItem("admissions.items", index, "url", value)
                          }
                        />

                        <Field
                          label="URL imagen"
                          value={typeof item === "string" ? "" : item?.image || ""}
                          onChange={(value) =>
                            updateArrayItem("admissions.items", index, "image", value)
                          }
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </EditorSection>
            )}

            {landing.financialAid && (
              <EditorSection title="Seccion: Ayuda financiera">
                <div className="admin-panel-soft flex items-start justify-between gap-4 p-4">
                  <div>
                    <p className="text-sm font-semibold text-gray-900 dark:text-slate-100">
                      Mostrar ayuda financiera
                    </p>
                    <p className="mt-1 text-xs leading-5 text-gray-500 dark:text-slate-400">
                      Activa o desactiva esta seccion en la landing.
                    </p>
                  </div>

                  <SwitchField
                    label="Mostrar ayuda financiera"
                    checked={Boolean(landing.financialAid?.enabled)}
                    onChange={(checked) =>
                      updateBooleanField("financialAid.enabled", checked)
                    }
                  />
                </div>

                <SelectField
                  label="Version del componente"
                  value={landing.financialAid?.variant || "default"}
                  onChange={(value) => updateField("financialAid.variant", value)}
                  options={[
                    { value: "default", label: "Default - cards" },
                    { value: "option-b", label: "B - lista con bullets" },
                  ]}
                />

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-semibold text-gray-900 dark:text-slate-100">
                      Opciones de ayuda
                    </h4>

                    <button
                      type="button"
                      onClick={() =>
                        addArrayItem("financialAid.items", {
                          title: "Nueva opcion",
                          description: "Nuevo contenido",
                          url: "",
                          image: "",
                          items: [],
                        })
                      }
                      className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-xs font-medium text-gray-700 dark:border-slate-600 dark:bg-slate-950 dark:text-slate-100"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      Agregar opcion
                    </button>
                  </div>

                  {(landing.financialAid?.items || []).map((item, index) => {
                    const bullets =
                      typeof item === "string" ? [] : item?.items ?? [];

                    return (
                      <div key={index} className="admin-panel-soft p-4">
                        <div className="mb-3 flex items-center justify-between">
                          <p className="text-sm font-semibold text-gray-900 dark:text-slate-100">
                            Opcion {index + 1}
                          </p>

                          <button
                            type="button"
                            onClick={() =>
                              removeArrayItem("financialAid.items", index)
                            }
                            className="inline-flex items-center gap-1 text-xs font-medium text-red-600"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            Eliminar
                          </button>
                        </div>

                        <div className="space-y-3">

                          <Field
                            label="URL"
                            value={typeof item === "string" ? "" : item?.url || ""}
                            onChange={(value) =>
                              updateArrayItem(
                                "financialAid.items",
                                index,
                                "url",
                                value,
                              )
                            }
                          />

                          <div className="rounded-xl border border-slate-200 p-3 dark:border-white/10">
                            <div className="mb-3 flex items-center justify-between">
                              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-slate-400">
                                Bullets internos
                              </p>
                              <button
                                type="button"
                                onClick={() =>
                                  addTextArrayItem(
                                    `financialAid.items.${index}.items`,
                                    "Nuevo bullet",
                                  )
                                }
                                className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-xs font-medium text-gray-700 dark:border-slate-600 dark:bg-slate-950 dark:text-slate-100"
                              >
                                <Plus className="h-3.5 w-3.5" />
                                Agregar bullet
                              </button>
                            </div>

                            <div className="space-y-2">
                              {bullets.map((bullet, bulletIndex) => (
                                <div
                                  key={bulletIndex}
                                  className="flex items-center gap-2"
                                >
                                  <input
                                    value={bullet}
                                    onChange={(event) =>
                                      updateTextArrayItem(
                                        `financialAid.items.${index}.items`,
                                        bulletIndex,
                                        event.target.value,
                                      )
                                    }
                                    className="admin-input"
                                  />
                                  <button
                                    type="button"
                                    onClick={() =>
                                      removeArrayItem(
                                        `financialAid.items.${index}.items`,
                                        bulletIndex,
                                      )
                                    }
                                    className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-red-500/40 text-red-500"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </EditorSection>
            )}

            {landing.cta && (
              <EditorSection title="CTA final">
                <SelectField
                  label="Version del componente"
                  value={landing.cta?.variant || "default"}
                  onChange={(value) => updateField("cta.variant", value)}
                  options={[
                    { value: "default", label: "Default - glass" },
                    { value: "minimal", label: "B - minimalista" },
                  ]}
                />

                <Field
                  label="URL imagen de fondo"
                  value={landing.cta?.image || ""}
                  onChange={(value) => updateField("cta.image", value)}
                />
              </EditorSection>
            )}

          </div>
        </div>

      </div>

      <div className="min-w-0 bg-white dark:bg-slate-950">
        <div className="flex flex-wrap items-end gap-4 border-b border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-white/[0.035]">
          <PreviewControl
            label="Ancho"
            min={360}
            max={1440}
            value={previewWidth}
            onChange={setPreviewWidth}
          />
          <ToolbarSelect
            label="Estado"
            value={landing.status || "draft"}
            onChange={(value) => updateField("status", value)}
            options={[
              { value: "draft", label: "Draft" },
              { value: "published", label: "Published" },
            ]}
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
          <div className="ml-auto flex flex-wrap items-center gap-3">
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
          </div>
          {message ? (
            <p className="basis-full text-sm text-gray-600 dark:text-slate-300 lg:basis-auto">
              {message}
            </p>
          ) : null}
        </div>

        <div className="max-h-full overflow-auto border-t border-gray-200 bg-gray-100 p-4 dark:border-slate-800 dark:bg-[#020617]">
          <div
            className="relative max-h-full mx-auto overflow-auto border border-slate-200 bg-white"
            style={{
              width: previewWidth,
              height: previewHeight,
              maxWidth: "100%",
            }}
          >
            <div
              ref={previewContentRef}
              className="relative"
              onClick={handlePreviewImageClick}
            >
              {variantControls.map((control) => {
                const position = variantControlPositions.find(
                  (item) => item.id === control.id,
                );

                if (!position) {
                  return null;
                }

                return (
                  <LandingVariantControl
                    key={control.id}
                    control={control}
                    top={position.top}
                    left={position.left}
                    onChange={(value) => updateField(control.path, value)}
                  />
                );
              })}
              {landing.form && formSettingsPosition ? (
                <button
                  type="button"
                  onClick={() => setFormSettingsModalOpen(true)}
                  className="absolute z-[55] inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/70 bg-slate-950/90 text-white shadow-[0_16px_34px_rgba(15,23,42,0.24)] backdrop-blur-xl transition hover:-translate-y-0.5 hover:bg-[var(--bunji-primary)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--bunji-cyan)]"
                  style={{
                    top: formSettingsPosition.top,
                    left: formSettingsPosition.left,
                  }}
                  aria-label="Configurar formulario"
                  title="Configurar formulario"
                >
                  <Settings className="h-4 w-4" />
                </button>
              ) : null}
              {heroSettingsPosition ? (
                <button
                  type="button"
                  onClick={() => setHeroSettingsModalOpen(true)}
                  className="absolute z-[56] inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/70 bg-slate-950/90 text-white shadow-[0_16px_34px_rgba(15,23,42,0.24)] backdrop-blur-xl transition hover:-translate-y-0.5 hover:bg-[var(--bunji-primary)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--bunji-cyan)]"
                  style={{
                    top: heroSettingsPosition.top,
                    left: heroSettingsPosition.left,
                  }}
                  aria-label="Configurar imagen de fondo del hero"
                  title="Configurar imagen de fondo del hero"
                >
                  <Settings className="h-4 w-4" />
                </button>
              ) : null}
              {renderLandingTemplate({
                brand,
                landing,
                liveEdit: liveEditConfig,
              })}
            </div>
            <button
              type="button"
              onClick={() => setFooterScriptsModalOpen(true)}
              className="absolute bottom-5 right-5 z-[60] inline-flex items-center gap-2 rounded-full border border-white/70 bg-slate-950/90 px-4 py-3 text-xs font-bold uppercase tracking-[0.14em] text-white shadow-[0_18px_44px_rgba(15,23,42,0.26)] backdrop-blur-xl transition hover:-translate-y-0.5 hover:bg-[var(--bunji-primary)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--bunji-cyan)]"
            >
              <Code2 className="h-4 w-4" />
              Scripts finales
              <span className="rounded-full bg-white/15 px-2 py-0.5 text-[10px] tracking-normal">
                {(landing.footerScripts || []).length}
              </span>
            </button>
          </div>
        </div>
      </div>
      {imageEditTarget ? (
        <ImageUrlModal
          target={imageEditTarget}
          value={imageUrlDraft}
          imageAssets={imageAssets}
          onChange={setImageUrlDraft}
          onClose={closeImageEditor}
          onSave={saveImageUrl}
        />
      ) : null}
      {footerScriptsModalOpen ? (
        <FooterScriptsModal
          scripts={landing.footerScripts || []}
          onAdd={() =>
            addTextArrayItem("footerScripts", "<script>\n</script>")
          }
          onRemove={(index) => removeArrayItem("footerScripts", index)}
          onChange={(index, value) =>
            updateTextArrayItem("footerScripts", index, value)
          }
          onClose={() => setFooterScriptsModalOpen(false)}
        />
      ) : null}
      {formSettingsModalOpen && landing.form ? (
        <FormSettingsModal
          landing={landing}
          onAddCampus={() =>
            addArrayItem("form.campusOptions", {
              label: "Nuevo campus",
              campus: "",
              campaigntype: "",
            })
          }
          onChangeField={updateField}
          onChangeBoolean={updateBooleanField}
          onRemoveCampus={(index) =>
            removeArrayItem("form.campusOptions", index)
          }
          onUpdateCampus={(index, field, value) =>
            updateArrayItem("form.campusOptions", index, field, value)
          }
          onClose={() => setFormSettingsModalOpen(false)}
        />
      ) : null}
      {heroSettingsModalOpen ? (
        <HeroBackgroundSettingsModal
          imageUrl={landing.hero?.backgroundImage || ""}
          imageAssets={imageAssets}
          onChangeField={updateField}
          onClose={() => setHeroSettingsModalOpen(false)}
        />
      ) : null}
    </div>
  );
}

function FooterScriptsModal({
  scripts,
  onAdd,
  onRemove,
  onChange,
  onClose,
}: {
  scripts: string[];
  onAdd: () => void;
  onRemove: (index: number) => void;
  onChange: (index: number, value: string) => void;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-[90] grid place-items-center bg-slate-950/55 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="Editar scripts finales"
    >
      <div className="flex max-h-[86vh] w-full max-w-4xl flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl dark:border-white/10 dark:bg-slate-950">
        <div className="flex items-start justify-between gap-4 border-b border-slate-200 p-6 dark:border-white/10">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--bunji-primary)]">
              Scripts finales
            </p>
            <h3 className="mt-2 text-2xl font-semibold text-slate-950 dark:text-slate-50">
              Scripts al final de la landing
            </h3>
            <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
              Agrega o edita scripts que se inyectan al final del HTML exportado
              y de la landing renderizada.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-500 transition hover:bg-slate-100 hover:text-slate-950 dark:border-white/10 dark:hover:bg-white/10 dark:hover:text-white"
            aria-label="Cerrar scripts finales"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="min-h-0 overflow-y-auto p-6">
          <div className="mb-5 flex items-center justify-between gap-4">
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
              {scripts.length
                ? `${scripts.length} script${scripts.length === 1 ? "" : "s"} configurado${scripts.length === 1 ? "" : "s"}`
                : "Todavia no hay scripts configurados."}
            </p>

            <button
              type="button"
              onClick={onAdd}
              className="inline-flex items-center gap-2 rounded-xl bg-[var(--bunji-primary)] px-4 py-3 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(62,57,137,0.24)] transition hover:scale-[1.02]"
            >
              <Plus className="h-4 w-4" />
              Agregar script
            </button>
          </div>

          <div className="space-y-4">
            {scripts.map((script: string, index) => (
              <div key={index} className="admin-panel-soft p-4">
                <div className="mb-3 flex items-center justify-between gap-4">
                  <p className="text-sm font-semibold text-gray-900 dark:text-slate-100">
                    Script {index + 1}
                  </p>

                  <button
                    type="button"
                    onClick={() => onRemove(index)}
                    className="inline-flex items-center gap-1 text-xs font-medium text-red-600"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Eliminar
                  </button>
                </div>

                <TextareaField
                  label="Codigo"
                  value={script || ""}
                  onChange={(value) => onChange(index, value)}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function FormSettingsModal({
  landing,
  onAddCampus,
  onChangeField,
  onChangeBoolean,
  onRemoveCampus,
  onUpdateCampus,
  onClose,
}: {
  landing: Landing;
  onAddCampus: () => void;
  onChangeField: (path: string, value: string) => void;
  onChangeBoolean: (path: string, value: boolean) => void;
  onRemoveCampus: (index: number) => void;
  onUpdateCampus: (index: number, field: string, value: string) => void;
  onClose: () => void;
}) {
  const campusOptions = landing.form?.campusOptions || [];

  return (
    <div
      className="fixed inset-0 z-[90] grid place-items-center bg-slate-950/55 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="Configurar formulario"
    >
      <div className="flex max-h-[86vh] w-full max-w-4xl flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl dark:border-white/10 dark:bg-slate-950">
        <div className="flex items-start justify-between gap-4 border-b border-slate-200 p-6 dark:border-white/10">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--bunji-primary)]">
              Formulario
            </p>
            <h3 className="mt-2 text-2xl font-semibold text-slate-950 dark:text-slate-50">
              Configuracion del formulario
            </h3>
            <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
              Ajusta embeds, datos ocultos y opciones de campus sin salir del
              preview visual.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-500 transition hover:bg-slate-100 hover:text-slate-950 dark:border-white/10 dark:hover:bg-white/10 dark:hover:text-white"
            aria-label="Cerrar formulario"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="min-h-0 overflow-y-auto p-6">
          <div className="space-y-5">
            <div className="admin-panel-soft flex items-start justify-between gap-4 p-4">
              <div>
                <p className="text-sm font-semibold text-slate-950 dark:text-slate-100">
                  Mostrar componente de formulario
                </p>
                <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
                  Renderiza una seccion independiente en dos columnas: texto
                  editorial a la izquierda y formulario a la derecha.
                </p>
              </div>

              <SwitchField
                label="Mostrar componente de formulario"
                checked={Boolean(landing.formSection?.enabled)}
                onChange={(checked) =>
                  onChangeBoolean("formSection.enabled", checked)
                }
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Field
                label="Script URL"
                value={landing.form?.scriptUrl || ""}
                onChange={(value) => onChangeField("form.scriptUrl", value)}
              />

              <Field
                label="Nombre del programa"
                value={landing.form?.programName || ""}
                onChange={(value) => onChangeField("form.programName", value)}
              />

              <Field
                label="Campus"
                value={landing.form?.campus || ""}
                onChange={(value) => onChangeField("form.campus", value)}
              />

              <Field
                label="Nombre input hidden"
                value={landing.form?.hiddenProgramFieldName || ""}
                onChange={(value) =>
                  onChangeField("form.hiddenProgramFieldName", value)
                }
              />
            </div>

            <TextareaField
              label="Codigo del script del formulario"
              value={landing.form?.scriptCode || ""}
              onChange={(value) => onChangeField("form.scriptCode", value)}
            />

            <div className="space-y-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-slate-100">
                    Opciones de campus
                  </h4>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    Estos valores se pasan al formulario embebido cuando aplica.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={onAddCampus}
                  className="inline-flex items-center gap-2 rounded-xl bg-[var(--bunji-primary)] px-4 py-3 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(62,57,137,0.24)] transition hover:scale-[1.02]"
                >
                  <Plus className="h-4 w-4" />
                  Agregar campus
                </button>
              </div>

              {campusOptions.map((item, index) => (
                <div key={index} className="admin-panel-soft p-4">
                  <div className="mb-3 flex items-center justify-between gap-4">
                    <p className="text-sm font-semibold text-gray-900 dark:text-slate-100">
                      Campus {index + 1}
                    </p>

                    <button
                      type="button"
                      onClick={() => onRemoveCampus(index)}
                      className="inline-flex items-center gap-1 text-xs font-medium text-red-600"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      Eliminar
                    </button>
                  </div>

                  <div className="grid gap-3 md:grid-cols-3">
                    <Field
                      label="Label visible"
                      value={typeof item === "string" ? "" : item?.label || ""}
                      onChange={(value) =>
                        onUpdateCampus(index, "label", value)
                      }
                    />

                    <Field
                      label="Valor campus"
                      value={
                        typeof item === "string" ? "" : item?.campus || ""
                      }
                      onChange={(value) =>
                        onUpdateCampus(index, "campus", value)
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
                        onUpdateCampus(index, "campaigntype", value)
                      }
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function HeroBackgroundSettingsModal({
  imageUrl,
  imageAssets,
  onChangeField,
  onClose,
}: {
  imageUrl: string;
  imageAssets: LandingImageAsset[];
  onChangeField: (path: string, value: string) => void;
  onClose: () => void;
}) {
  const [activeTab, setActiveTab] = useState<AssetSourceTab>("url");

  return (
    <div
      className="fixed inset-0 z-[90] grid place-items-center bg-slate-950/55 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="Configurar imagen de fondo del hero"
    >
      <div className="w-full max-w-2xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl dark:border-white/10 dark:bg-slate-950">
        <div className="flex items-start justify-between gap-4 border-b border-slate-200 p-6 dark:border-white/10">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--bunji-primary)]">
              Hero
            </p>
            <h3 className="mt-2 text-2xl font-semibold text-slate-950 dark:text-slate-50">
              Imagen de fondo
            </h3>
            <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
              Agrega o reemplaza la imagen principal del hero. El cambio se
              vera directamente en el preview antes de guardar.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-500 transition hover:bg-slate-100 hover:text-slate-950 dark:border-white/10 dark:hover:bg-white/10 dark:hover:text-white"
            aria-label="Cerrar configuracion del hero"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-5 p-6">
          <ImageAssetTabs
            activeTab={activeTab}
            imageAssets={imageAssets}
            onChangeTab={setActiveTab}
          />

          {activeTab === "url" ? (
            <label className="grid gap-2">
              <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                URL de imagen de fondo
              </span>
              <input
                value={imageUrl}
                onChange={(event) =>
                  onChangeField("hero.backgroundImage", event.target.value)
                }
                placeholder="https://..."
                className="admin-input h-12 rounded-xl"
                autoFocus
              />
            </label>
          ) : (
            <ImageAssetGrid
              assets={imageAssets.filter((asset) => asset.source === activeTab)}
              selectedUrl={imageUrl}
              emptyMessage={
                activeTab === "program"
                  ? "Aun no hay assets de imagen creados para este programa."
                  : "Aun no hay assets de imagen creados para esta universidad."
              }
              onSelect={(asset) =>
                onChangeField("hero.backgroundImage", asset.url)
              }
            />
          )}

          {imageUrl ? (
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 dark:border-white/10 dark:bg-white/[0.03]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={imageUrl}
                alt="Preview del fondo del hero"
                className="max-h-72 w-full object-cover"
              />
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-sm leading-6 text-slate-500 dark:border-white/10 dark:bg-white/[0.03] dark:text-slate-400">
              Todavia no hay una imagen configurada. El hero usara el fondo por
              defecto basado en los colores de la marca.
            </div>
          )}

          <div className="flex flex-wrap justify-end gap-3">
            {imageUrl ? (
              <button
                type="button"
                onClick={() => onChangeField("hero.backgroundImage", "")}
                className="rounded-xl border border-red-200 px-4 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-50 dark:border-red-500/30 dark:text-red-300 dark:hover:bg-red-500/10"
              >
                Quitar imagen
              </button>
            ) : null}

            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center gap-2 rounded-xl bg-[var(--bunji-primary)] px-4 py-3 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(62,57,137,0.25)] transition hover:scale-[1.02]"
            >
              <ImagePlus className="h-4 w-4" />
              Listo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ImageAssetTabs({
  activeTab,
  imageAssets,
  onChangeTab,
}: {
  activeTab: AssetSourceTab;
  imageAssets: LandingImageAsset[];
  onChangeTab: (tab: AssetSourceTab) => void;
}) {
  const programAssetsCount = imageAssets.filter(
    (asset) => asset.source === "program",
  ).length;
  const brandAssetsCount = imageAssets.filter(
    (asset) => asset.source === "brand",
  ).length;
  const tabs: Array<{
    id: AssetSourceTab;
    label: string;
    count?: number;
  }> = [
    { id: "url", label: "URL manual" },
    { id: "program", label: "Assets del programa", count: programAssetsCount },
    { id: "brand", label: "Assets universidad", count: brandAssetsCount },
  ];

  return (
    <div className="flex flex-wrap gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-1.5 dark:border-white/10 dark:bg-white/[0.03]">
      {tabs.map((tab) => {
        const active = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChangeTab(tab.id)}
            className={`inline-flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-bold transition ${
              active
                ? "bg-[var(--bunji-primary)] text-white shadow-[0_10px_24px_rgba(62,57,137,0.24)]"
                : "text-slate-600 hover:bg-white hover:text-slate-950 dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white"
            }`}
          >
            {tab.label}
            {typeof tab.count === "number" ? (
              <span
                className={`rounded-full px-2 py-0.5 text-[10px] ${
                  active
                    ? "bg-white/18 text-white"
                    : "bg-slate-200 text-slate-600 dark:bg-white/10 dark:text-slate-300"
                }`}
              >
                {tab.count}
              </span>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}

function ImageAssetGrid({
  assets,
  selectedUrl,
  emptyMessage,
  onSelect,
}: {
  assets: LandingImageAsset[];
  selectedUrl: string;
  emptyMessage: string;
  onSelect: (asset: LandingImageAsset) => void;
}) {
  if (!assets.length) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-5 text-sm leading-6 text-slate-500 dark:border-white/10 dark:bg-white/[0.03] dark:text-slate-400">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="grid max-h-72 gap-3 overflow-y-auto pr-1 sm:grid-cols-2">
      {assets.map((asset) => {
        const active = selectedUrl.trim() === asset.url.trim();

        return (
          <button
            key={asset.id}
            type="button"
            onClick={() => onSelect(asset)}
            className={`group overflow-hidden rounded-2xl border text-left transition hover:-translate-y-0.5 hover:shadow-lg ${
              active
                ? "border-[var(--bunji-primary)] bg-[var(--bunji-primary)]/8 shadow-[0_12px_30px_rgba(62,57,137,0.18)]"
                : "border-slate-200 bg-white hover:border-[var(--bunji-primary)]/50 dark:border-white/10 dark:bg-white/[0.03]"
            }`}
          >
            <div className="aspect-[16/9] overflow-hidden bg-slate-100 dark:bg-white/[0.04]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={asset.url}
                alt={asset.name}
                className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
              />
            </div>
            <div className="space-y-1 p-3">
              <p className="line-clamp-2 text-sm font-semibold text-slate-950 dark:text-slate-50">
                {asset.name}
              </p>
              <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
                {asset.categoryLabel}
              </p>
            </div>
          </button>
        );
      })}
    </div>
  );
}

function ImageUrlModal({
  target,
  value,
  imageAssets,
  onChange,
  onClose,
  onSave,
}: {
  target: ImageEditTarget;
  value: string;
  imageAssets: LandingImageAsset[];
  onChange: (value: string) => void;
  onClose: () => void;
  onSave: () => void;
}) {
  const [activeTab, setActiveTab] = useState<AssetSourceTab>("url");

  return (
    <div
      className="fixed inset-0 z-[90] grid place-items-center bg-slate-950/50 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label={`Editar ${target.label}`}
    >
      <div className="w-full max-w-2xl rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-white/10 dark:bg-slate-950">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--bunji-primary)]">
              Imagen editable
            </p>
            <h3 className="mt-2 text-2xl font-semibold text-slate-950 dark:text-slate-50">
              {target.label}
            </h3>
            <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
              Agrega una URL de imagen o reemplaza la actual. El cambio se vera
              en el preview antes de guardar la landing.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-500 transition hover:bg-slate-100 hover:text-slate-950 dark:border-white/10 dark:hover:bg-white/10 dark:hover:text-white"
            aria-label="Cerrar modal"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-6 space-y-5">
          <ImageAssetTabs
            activeTab={activeTab}
            imageAssets={imageAssets}
            onChangeTab={setActiveTab}
          />

          {activeTab === "url" ? (
            <label className="grid gap-2">
              <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                URL de la imagen
              </span>
              <input
                value={value}
                onChange={(event) => onChange(event.target.value)}
                placeholder="https://..."
                className="admin-input h-12 rounded-xl"
                autoFocus
              />
            </label>
          ) : (
            <ImageAssetGrid
              assets={imageAssets.filter((asset) => asset.source === activeTab)}
              selectedUrl={value}
              emptyMessage={
                activeTab === "program"
                  ? "Aun no hay assets de imagen creados para este programa."
                  : "Aun no hay assets de imagen creados para esta universidad."
              }
              onSelect={(asset) => onChange(asset.url)}
            />
          )}
        </div>

        {value ? (
          <div className="mt-5 overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 dark:border-white/10 dark:bg-white/[0.03]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={value}
              alt="Preview de imagen"
              className="max-h-64 w-full object-cover"
            />
          </div>
        ) : null}

        <div className="mt-6 flex flex-wrap justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-white/10 dark:text-slate-200 dark:hover:bg-white/10"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={onSave}
            className="inline-flex items-center gap-2 rounded-xl bg-[var(--bunji-primary)] px-4 py-3 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(62,57,137,0.25)] transition hover:scale-[1.02]"
          >
            <ImagePlus className="h-4 w-4" />
            Guardar imagen
          </button>
        </div>
      </div>
    </div>
  );
}

function LandingVariantControl({
  control,
  top,
  left,
  onChange,
}: {
  control: VariantControlConfig;
  top: number;
  left?: number;
  onChange: (value: string) => void;
}) {
  return (
    <div
      className="absolute right-4 z-40 flex items-center gap-2 rounded-full border border-slate-200/80 bg-white/92 px-2 py-2 text-slate-950 shadow-[0_16px_38px_rgba(15,23,42,0.16)] backdrop-blur-xl"
      style={{
        top,
        left,
        right: typeof left === "number" ? "auto" : 16,
      }}
      aria-label={`Cambiar variante de ${control.label}`}
    >
      <span className="hidden px-2 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500 lg:inline">
        {control.label}
      </span>
      <div className="flex rounded-full bg-slate-100 p-1">
        {control.options.map((option) => {
          const active = control.currentValue === option.value;

          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onChange(option.value)}
              title={option.title}
              className={`flex h-8 min-w-8 items-center justify-center rounded-full px-3 text-xs font-black transition ${
                active
                  ? "bg-[var(--bunji-primary)] text-white shadow-[0_10px_22px_rgba(62,57,137,0.28)]"
                  : "text-slate-600 hover:bg-white hover:text-slate-950"
              }`}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function PreviewEditableHint() {
  return (
    <p className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-3 py-2 text-xs leading-5 text-slate-500 dark:border-white/10 dark:bg-white/[0.03] dark:text-slate-400">
      Edita el texto directamente en la previsualizacion.
    </p>
  );
}

function ToolbarSelect({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: Array<{ value: string; label: string }>;
  onChange: (value: string) => void;
}) {
  return (
    <label className="grid gap-1">
      <span className="text-xs font-semibold text-gray-700 dark:text-slate-200">
        {label}
      </span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-8 rounded-lg border border-gray-300 bg-white px-3 text-xs font-medium text-gray-900 outline-none transition focus:border-[var(--bunji-primary)] focus:ring-2 focus:ring-[var(--bunji-primary)]/20 dark:border-slate-600 dark:bg-slate-950 dark:text-slate-100"
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
