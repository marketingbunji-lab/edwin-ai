"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

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

type Props = {
  endpoint: string;
  filename: string;
  clientifyEndpoint?: string;
  clientifyFilename?: string;
  payload?: unknown;
  children?: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
};

export default function ExportHtmlButton({
  endpoint,
  filename,
  clientifyEndpoint,
  clientifyFilename,
  payload,
  children = "Exportar",
  icon,
  className = "rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700",
  style,
}: Props) {
  const [exporting, setExporting] = useState(false);
  const [open, setOpen] = useState(false);

  const fallbackDownload = (blob: Blob, selectedFilename: string) => {
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = selectedFilename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  const handleExport = async (selectedEndpoint: string, selectedFilename: string) => {
    try {
      setExporting(true);
      setOpen(false);

      const response = await fetch(selectedEndpoint, {
        method: payload ? "POST" : "GET",
        headers: payload
          ? {
              "Content-Type": "application/json",
            }
          : undefined,
        body: payload ? JSON.stringify(payload) : undefined,
      });

      if (!response.ok) {
        throw new Error("No se pudo exportar el HTML");
      }

      const blob = await response.blob();
      const picker = (window as WindowWithSavePicker).showSaveFilePicker;

      if (picker) {
        try {
          const handle = await picker({
            suggestedName: selectedFilename,
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

          throw error;
        }
      }

      fallbackDownload(blob, selectedFilename);
    } catch (error) {
      console.error(error);
      window.alert("No se pudo exportar el HTML.");
    } finally {
      setExporting(false);
    }
  };

  const options = [
    {
      label: "Exportar HTML",
      endpoint,
      filename,
    },
    ...(clientifyEndpoint && clientifyFilename
      ? [
          {
            label: "Exportar para Clientify",
            endpoint: clientifyEndpoint,
            filename: clientifyFilename,
          },
        ]
      : []),
  ];

  if (options.length === 1) {
    return (
      <button
        type="button"
        onClick={() => handleExport(endpoint, filename)}
        disabled={exporting}
        className={`${className} inline-flex items-center gap-2 disabled:cursor-not-allowed disabled:opacity-60`}
        style={style}
      >
        {icon}
        {exporting ? "Exportando..." : children}
      </button>
    );
  }

  return (
    <div
      className="relative inline-block"
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
          setOpen(false);
        }
      }}
    >
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        disabled={exporting}
        className={`${className} inline-flex items-center gap-2 disabled:cursor-not-allowed disabled:opacity-60`}
        style={style}
        aria-haspopup="menu"
        aria-expanded={open}
      >
        {icon}
        <span>{exporting ? "Exportando..." : children}</span>
        <ChevronDown aria-hidden="true" className="h-4 w-4" />
      </button>

      {open ? (
        <div
          role="menu"
          className="absolute bottom-full right-0 z-20 mb-2 min-w-56 overflow-hidden rounded-xl border border-gray-200 bg-white py-1 shadow-lg dark:border-slate-700 dark:bg-slate-950"
        >
          {options.map((option) => (
            <button
              key={option.label}
              type="button"
              role="menuitem"
              onClick={() => handleExport(option.endpoint, option.filename)}
              className="block w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50 dark:text-slate-100 dark:hover:bg-slate-900"
            >
              {option.label}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
