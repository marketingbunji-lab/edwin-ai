"use client";

import { useState } from "react";
import EdwinSwitch from "@/components/ui/EdwinSwitch";

export default function EdwinSwitchShowcase() {
  const [lightNotificationsEnabled, setLightNotificationsEnabled] =
    useState(true);
  const [lightAutoSaveEnabled, setLightAutoSaveEnabled] = useState(false);
  const [darkNotificationsEnabled, setDarkNotificationsEnabled] = useState(true);
  const [darkAutoSaveEnabled, setDarkAutoSaveEnabled] = useState(false);

  return (
    <div className="grid gap-5 lg:grid-cols-2">
      <article className="admin-panel space-y-4 p-6">
        <div>
          <p className="admin-eyebrow">Light mode</p>
          <h3 className="mt-3 text-xl font-semibold text-slate-950">
            Configuracion sobre superficies claras
          </h3>
        </div>

        <div className="space-y-3">
          <SwitchRow
            checked={lightNotificationsEnabled}
            description="Recibir avisos del workspace"
            label="Notificaciones"
            onCheckedChange={setLightNotificationsEnabled}
          />
          <SwitchRow
            checked={lightAutoSaveEnabled}
            description="Guardar cambios de forma automatica"
            label="Auto guardado"
            onCheckedChange={setLightAutoSaveEnabled}
          />
          <SwitchRow
            checked
            description="Estado bloqueado para revisiones"
            disabled
            label="Solo lectura"
          />
        </div>
      </article>

      <div className="dark">
        <article className="admin-panel space-y-4 p-6">
          <div>
            <p className="admin-eyebrow">Dark mode</p>
            <h3 className="mt-3 text-xl font-semibold text-white">
              Configuracion sobre superficies densas
            </h3>
          </div>

          <div className="space-y-3">
            <SwitchRow
              checked={darkNotificationsEnabled}
              description="Mantiene la misma logica visual en el shell oscuro"
              label="Notificaciones"
              onCheckedChange={setDarkNotificationsEnabled}
            />
            <SwitchRow
              checked={darkAutoSaveEnabled}
              description="Alterna una preferencia secundaria"
              label="Modo asistido"
              onCheckedChange={setDarkAutoSaveEnabled}
            />
            <SwitchRow
              checked={false}
              description="Patron deshabilitado"
              disabled
              label="Desactivado"
            />
          </div>
        </article>
      </div>
    </div>
  );
}

function SwitchRow({
  checked,
  description,
  disabled = false,
  label,
  onCheckedChange,
}: {
  checked: boolean;
  description: string;
  disabled?: boolean;
  label: string;
  onCheckedChange?: (checked: boolean) => void;
}) {
  return (
    <div className="flex items-start justify-between gap-4 rounded-2xl border border-slate-200/80 bg-white/70 p-4 dark:border-white/10 dark:bg-white/[0.04]">
      <div className="space-y-1">
        <p className="text-sm font-semibold text-slate-950 dark:text-white">
          {label}
        </p>
        <p className="text-sm leading-6 text-slate-600 dark:text-slate-400">
          {description}
        </p>
      </div>
      <EdwinSwitch
        ariaLabel={label}
        checked={checked}
        disabled={disabled}
        onCheckedChange={onCheckedChange}
      />
    </div>
  );
}
