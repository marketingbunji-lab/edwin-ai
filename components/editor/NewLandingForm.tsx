"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type Props = {
  brandSlug: string;
  brandName: string;
};

export default function NewLandingForm({ brandSlug, brandName }: Props) {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [fullTitle, setFullTitle] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const handleCreate = async () => {
    try {
      setSaving(true);
      setMessage("");

      const res = await fetch(`/api/landings/${brandSlug}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          fullTitle,
          template: "DefaultLanding",
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "No se pudo crear la landing");
      }

      router.push(data.redirectTo);
    } catch (error: unknown) {
      setMessage(error instanceof Error ? error.message : "Ocurrió un error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="admin-panel p-8">
      <div className="mb-6">
        <p className="admin-eyebrow">{brandName}</p>
        <h1 className="admin-title">Nueva landing</h1>
        <p className="admin-muted mt-2">
          Crea una nueva landing base para esta marca.
        </p>
      </div>

      <div className="grid gap-4 md:max-w-2xl">
        <Field
          label="Título corto"
          placeholder="Administración de Empresas"
          value={title}
          onChange={setTitle}
        />

        <Field
          label="Título completo"
          placeholder="Pregrado en Administración de Empresas"
          value={fullTitle}
          onChange={setFullTitle}
        />
      </div>

      <div className="mt-6 flex items-center gap-3">
        <button
          type="button"
          onClick={handleCreate}
          disabled={saving}
          className="admin-button-primary px-5"
        >
          {saving ? "Creando..." : "Crear landing"}
        </button>

        {message ? <p className="text-sm text-red-600 dark:text-red-300">{message}</p> : null}
      </div>
    </div>
  );
}

function Field({
  label,
  placeholder,
  value,
  onChange,
}: {
  label: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-semibold text-slate-950 dark:text-slate-200">
        {label}
      </span>
      <input
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className="admin-input"
      />
    </label>
  );
}
