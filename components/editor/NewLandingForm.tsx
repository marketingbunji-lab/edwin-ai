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
  const [template, setTemplate] = useState("DefaultLanding");
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
          template,
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
    <div className="rounded-3xl bg-white p-8 shadow-sm dark:border dark:border-slate-800 dark:bg-slate-950">
      <div className="mb-6">
        <p className="text-sm text-gray-500 dark:text-slate-400">{brandName}</p>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-slate-50">Nueva landing</h1>
        <p className="mt-2 text-gray-600 dark:text-slate-300">
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

        <label className="block">
          <span className="mb-1 block text-sm font-medium text-gray-700 dark:text-slate-200">
            Template
          </span>
          <select
            value={template}
            onChange={(event) => setTemplate(event.target.value)}
            className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-black dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
          >
            <option value="DefaultLanding">DefaultLanding</option>
            <option value="UamProgramLanding">UamProgramLanding</option>
          </select>
        </label>
      </div>

      <div className="mt-6 flex items-center gap-3">
        <button
          type="button"
          onClick={handleCreate}
          disabled={saving}
          className="bunji-button-primary rounded-xl px-5 py-3 text-sm font-medium disabled:opacity-60"
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
      <span className="mb-1 block text-sm font-medium text-gray-700 dark:text-slate-200">
        {label}
      </span>
      <input
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-black dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500"
      />
    </label>
  );
}
