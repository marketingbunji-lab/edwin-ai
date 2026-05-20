"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";
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
}: Props) {
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
        throw new Error(data.error || "No se pudo guardar la marca");
      }

      if (mode === "create") {
        if (data.supabase?.ok) {
          window.alert("Marca creada correctamente en Supabase.");
        } else {
          window.alert(
            `El JSON se creo, pero no se pudo crear la marca en Supabase: ${
              data.supabase?.error || "No se recibio detalle del error."
            }`,
          );
        }

        if (data.redirectTo) {
          router.push(data.redirectTo);
        }
        return;
      }

      setLastSavedSnapshot(currentSnapshot);
      setMessage("Cambios guardados correctamente");
      router.refresh();
    } catch (error: unknown) {
      setMessage(error instanceof Error ? error.message : "Ocurrio un error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="border border-gray-200 bg-white p-8 dark:border-slate-800 dark:bg-slate-950">
      {stickyActions ? (
        <div className="-mt-2 mb-8 sticky top-4 z-20 overflow-hidden rounded-[24px] border border-slate-200/80 bg-white/90 p-4 shadow-[0_18px_45px_rgba(15,23,42,0.08)] backdrop-blur-xl before:pointer-events-none before:absolute before:inset-0 before:bg-[linear-gradient(135deg,rgba(255,255,255,0.30),transparent_62%)] before:content-[''] dark:border-white/10 dark:bg-slate-950/88 dark:shadow-[0_20px_50px_rgba(2,6,23,0.28)] dark:before:bg-[linear-gradient(135deg,rgba(255,255,255,0.07),transparent_62%)]">
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
                type="button"
                onClick={handleSave}
                disabled={saveDisabled}
                className="admin-button-primary px-5 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving
                  ? mode === "create"
                    ? "Creando..."
                    : "Guardando..."
                  : mode === "create"
                    ? "Crear marca"
                    : "Guardar cambios"}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <div className="mb-6">
        <p className="text-gray-600 dark:text-slate-300">
          {mode === "create"
            ? "Configura una marca nueva para empezar a crear landings."
            : "Actualiza la informacion general, logos y links legales de la marca."}
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
          Informacion General
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
          Estilos graficos
        </button>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {activeTab === "general" ? (
          <>
            <div className="space-y-4">
              <Field
                label="Slug"
                value={brand.slug}
                onChange={(value) => updateField("slug", value)}
                disabled={mode === "edit"}
              />

              <Field
                label="Nombre"
                value={brand.name}
                onChange={(value) => updateField("name", value)}
              />

              <Field
                label="Nombre completo"
                value={brand.shortName || ""}
                onChange={(value) => updateField("shortName", value)}
              />

              <Field
                label="Descripcion"
                value={brand.description || ""}
                onChange={(value) => updateField("description", value)}
              />

              <Field
                label="Sitio oficial"
                value={brand.officialWebsite || ""}
                onChange={(value) => updateField("officialWebsite", value)}
              />

              <Field
                label="Site name"
                value={brand.siteName || ""}
                onChange={(value) => updateField("siteName", value)}
              />

              <TextareaField
                label="Abstract"
                value={brand.abstract || ""}
                onChange={(value) => updateField("abstract", value)}
              />

              <Field
                label="Keywords"
                value={(brand.keywords ?? []).join(", ")}
                onChange={updateKeywords}
              />

              <Field
                label="Robots"
                value={brand.robots || ""}
                onChange={(value) => updateField("robots", value)}
              />

              <Field
                label="Generator"
                value={brand.generator || ""}
                onChange={(value) => updateField("generator", value)}
              />

              <Field
                label="Imagen principal de marca"
                value={brand.imageBrand || ""}
                onChange={(value) => updateField("imageBrand", value)}
              />

              <div className="admin-panel-soft space-y-4 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h2 className="text-sm font-semibold text-gray-900 dark:text-slate-50">
                      Galeria de imagenes
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-slate-400">
                      Agrega URLs adicionales de imagen para la marca.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={addImage}
                    className="admin-button-secondary px-3 py-2 text-xs"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    Agregar imagen
                  </button>
                </div>

                {(brand.images ?? []).length === 0 ? (
                  <div className="border border-dashed border-gray-300 bg-white p-4 text-sm text-gray-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-400">
                    Esta marca todavia no tiene imagenes adicionales configuradas.
                  </div>
                ) : null}

                {(brand.images ?? []).map((image, index) => (
                  <div
                    key={index}
                    className="border border-gray-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-950"
                  >
                    <div className="mb-3 flex items-center justify-between">
                      <p className="text-sm font-semibold text-gray-900 dark:text-slate-50">
                        Imagen {index + 1}
                      </p>

                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="inline-flex items-center gap-1 text-xs font-medium text-red-600"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        Eliminar
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
                      Campuses
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-slate-400">
                      Agrega sedes con su descripcion, imagen y video.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={addCampus}
                    className="admin-button-secondary px-3 py-2 text-xs"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    Agregar campus
                  </button>
                </div>

                {(brand.campuses ?? []).length === 0 ? (
                  <div className="border border-dashed border-gray-300 bg-white p-4 text-sm text-gray-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-400">
                    Esta marca todavia no tiene campuses configurados.
                  </div>
                ) : null}

                {(brand.campuses ?? []).map((campus, index) => (
                  <div
                    key={index}
                    className="border border-gray-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-950"
                  >
                    <div className="mb-3 flex items-center justify-between">
                      <p className="text-sm font-semibold text-gray-900 dark:text-slate-50">
                        Campus {index + 1}
                      </p>

                      <button
                        type="button"
                        onClick={() => removeCampus(index)}
                        className="inline-flex items-center gap-1 text-xs font-medium text-red-600"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        Eliminar
                      </button>
                    </div>

                    <div className="space-y-3">
                      <Field
                        label="Nombre del campus"
                        value={campus.name || ""}
                        onChange={(value) => updateCampus(index, "name", value)}
                      />

                      <Field
                        label="Ubicacion"
                        value={campus.location || ""}
                        onChange={(value) =>
                          updateCampus(index, "location", value)
                        }
                      />

                      <TextareaField
                        label="Descripcion del campus"
                        value={campus.description || ""}
                        onChange={(value) =>
                          updateCampus(index, "description", value)
                        }
                      />

                      <Field
                        label="Imagen del campus"
                        value={campus.image || ""}
                        onChange={(value) => updateCampus(index, "image", value)}
                      />

                      <Field
                        label="Link de video"
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
                      Links legales
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-slate-400">
                      Estos links se muestran en el footer de las landings.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={addLegalLink}
                    className="admin-button-secondary px-3 py-2 text-xs"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    Agregar link
                  </button>
                </div>

                {(brand.legalLinks ?? []).length === 0 ? (
                  <div className="border border-dashed border-gray-300 bg-white p-4 text-sm text-gray-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-400">
                    Esta marca todavia no tiene links legales configurados.
                  </div>
                ) : null}

                {(brand.legalLinks ?? []).map((link, index) => (
                  <div
                    key={index}
                    className="border border-gray-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-950"
                  >
                    <div className="mb-3 flex items-center justify-between">
                      <p className="text-sm font-semibold text-gray-900 dark:text-slate-50">
                        Link {index + 1}
                      </p>

                      <button
                        type="button"
                        onClick={() => removeLegalLink(index)}
                        className="inline-flex items-center gap-1 text-xs font-medium text-red-600"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        Eliminar
                      </button>
                    </div>

                    <div className="space-y-3">
                      <Field
                        label="Etiqueta"
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
                      Certificaciones
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-slate-400">
                      Agrega acreditaciones o certificaciones de la institucion.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={addCertification}
                    className="admin-button-secondary px-3 py-2 text-xs"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    Agregar certificacion
                  </button>
                </div>

                {(brand.certifications ?? []).length === 0 ? (
                  <div className="border border-dashed border-gray-300 bg-white p-4 text-sm text-gray-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-400">
                    Esta marca todavia no tiene certificaciones configuradas.
                  </div>
                ) : null}

                {(brand.certifications ?? []).map((certification, index) => (
                  <div
                    key={index}
                    className="border border-gray-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-950"
                  >
                    <div className="mb-3 flex items-center justify-between">
                      <p className="text-sm font-semibold text-gray-900 dark:text-slate-50">
                        Certificacion {index + 1}
                      </p>

                      <button
                        type="button"
                        onClick={() => removeCertification(index)}
                        className="inline-flex items-center gap-1 text-xs font-medium text-red-600"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        Eliminar
                      </button>
                    </div>

                    <div className="space-y-3">
                      <Field
                        label="Nombre de la acreditacion"
                        value={certification.name}
                        onChange={(value) =>
                          updateCertification(index, "name", value)
                        }
                      />

                      <Field
                        label="URL de la entidad acreditadora"
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
                  Logos
                </h2>

                <Field
                  label="Logo principal"
                  value={brand.logo}
                  onChange={(value) => updateField("logo", value)}
                />

                <Field
                  label="Logo light"
                  value={brand.logos?.light || ""}
                  onChange={(value) => updateField("logos.light", value)}
                />

                <Field
                  label="Logo dark"
                  value={brand.logos?.dark || ""}
                  onChange={(value) => updateField("logos.dark", value)}
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="admin-panel-soft space-y-4 p-4">
                <h2 className="text-sm font-semibold text-gray-900 dark:text-slate-50">
                  Colores
                </h2>

                <div className="grid gap-4 sm:grid-cols-2">
                  <ColorField
                    label="Color primario"
                    value={brand.primaryColor}
                    onChange={(value) => updateField("primaryColor", value)}
                  />

                  <ColorField
                    label="Color secundario"
                    value={brand.secondaryColor}
                    onChange={(value) => updateField("secondaryColor", value)}
                  />
                </div>

                <PaletteEditor
                  title="Variantes del color primario"
                  scale={
                    brand.colorPalette?.primary ??
                    createBrandColorScale(brand.primaryColor)
                  }
                  onChange={(tone, value) =>
                    updatePaletteField("primary", tone, value)
                  }
                />

                <PaletteEditor
                  title="Variantes del color secundario"
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
                  Tipografia
                </h2>

                <Field
                  label="Font family"
                  value={brand.typography?.fontFamily || ""}
                  onChange={(value) => updateField("typography.fontFamily", value)}
                />

                <Field
                  label="Google Fonts URL"
                  value={brand.typography?.googleFontHref || ""}
                  onChange={(value) =>
                    updateField("typography.googleFontHref", value)
                  }
                />

                <Field
                  label="Manual de identidad"
                  value={brand.identityManual || ""}
                  onChange={(value) => updateField("identityManual", value)}
                />
              </div>
            </div>
          </>
        )}
      </div>

      {!stickyActions ? (
        <div className="mt-6 flex items-center gap-3">
          <button
            type="button"
            onClick={handleSave}
            disabled={saveDisabled}
            className="admin-button-primary px-5 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving
              ? mode === "create"
                ? "Creando..."
                : "Guardando..."
              : mode === "create"
                ? "Crear marca"
                : "Guardar cambios"}
          </button>

          {message ? (
            <p className="text-sm text-gray-600 dark:text-slate-300">
              {message}
            </p>
          ) : null}
        </div>
      ) : null}
    </div>
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
