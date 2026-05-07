"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import type { Brand, BrandCertification, LegalLink } from "@/lib/data";

type EditableBrand = Brand & Record<string, unknown>;
type EditableRecord = Record<string, unknown>;

type Props = {
  mode: "create" | "edit";
  initialBrand: Brand;
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

export default function BrandEditor({ mode, initialBrand }: Props) {
  const router = useRouter();
  const [brand, setBrand] = useState<Brand>(initialBrand);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

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
      return next;
    });
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
    mode: "light" | "dark",
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
        [mode]: value,
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
        body: JSON.stringify(brand),
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
            `El JSON se creó, pero no se pudo crear la marca en Supabase: ${
              data.supabase?.error || "No se recibió detalle del error."
            }`,
          );
        }

        if (data.redirectTo) {
          router.push(data.redirectTo);
        }
        return;
      }

      setMessage("Cambios guardados correctamente");
      router.refresh();
    } catch (error: unknown) {
      setMessage(error instanceof Error ? error.message : "Ocurrió un error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="border border-gray-200 bg-white p-8 dark:border-slate-800 dark:bg-slate-950">
      <div className="mb-6">
        <p className="text-sm text-gray-500 dark:text-slate-400">
          {mode === "create" ? "Nueva marca" : brand.name}
        </p>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-slate-50">
          {mode === "create" ? "Crear marca" : "Editar marca"}
        </h1>
        <p className="mt-2 text-gray-600 dark:text-slate-300">
          {mode === "create"
            ? "Configura una marca nueva para empezar a crear landings."
            : "Actualiza la información general, logos y links legales de la marca."}
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
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
            label="Descripción"
            value={brand.description || ""}
            onChange={(value) => updateField("description", value)}
          />

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
        </div>

        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              label="Color primario"
              value={brand.primaryColor}
              onChange={(value) => updateField("primaryColor", value)}
            />

            <Field
              label="Color secundario"
              value={brand.secondaryColor}
              onChange={(value) => updateField("secondaryColor", value)}
            />
          </div>

          <div className="space-y-4 border border-gray-200 bg-gray-50 p-4 dark:border-slate-800 dark:bg-slate-900">
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
                className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs font-medium text-gray-700 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
              >
                <Plus className="h-3.5 w-3.5" />
                Agregar link
              </button>
            </div>

            {(brand.legalLinks ?? []).length === 0 ? (
              <div className="border border-dashed border-gray-300 bg-white p-4 text-sm text-gray-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-400">
                Esta marca todavía no tiene links legales configurados.
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

          <div className="space-y-4 border border-gray-200 bg-gray-50 p-4 dark:border-slate-800 dark:bg-slate-900">
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
                className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs font-medium text-gray-700 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
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
      </div>

      <div className="mt-6 flex items-center gap-3">
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="rounded-xl bg-[var(--bunji-primary)] px-5 py-3 text-sm font-medium text-white disabled:opacity-60"
        >
          {saving
            ? mode === "create"
              ? "Creando..."
              : "Guardando..."
            : mode === "create"
              ? "Crear marca"
              : "Guardar cambios"}
        </button>

          {message ? <p className="text-sm text-gray-600 dark:text-slate-300">{message}</p> : null}
      </div>
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
      <span className="mb-1 block text-sm font-medium text-gray-700 dark:text-slate-300">
        {label}
      </span>
      <input
        value={value}
        disabled={disabled}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-black disabled:bg-gray-100 disabled:text-gray-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:disabled:bg-slate-800 dark:disabled:text-slate-500"
      />
    </label>
  );
}
