"use client";

import type { CSSProperties } from "react";

type Props = {
  title: string;
  description?: string;
  message: string;
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
  eyebrow?: string;
  minHeightClassName?: string;
};

export default function PreviewLoadingState({
  title,
  description = "",
  message,
  primaryColor = "#3e3989",
  secondaryColor = "#7de3ea",
  accentColor = "#ff0b2e",
  eyebrow = "Preview",
  minHeightClassName = "min-h-[440px]",
}: Props) {
  const glowA = mixWithWhite(primaryColor, 0.74);
  const glowB = mixWithWhite(secondaryColor, 0.76);
  const glowC = mixWithWhite(accentColor, 0.82);
  const spinnerStyle = {
    "--spinner-primary": primaryColor,
    "--spinner-secondary": secondaryColor,
    "--spinner-accent": accentColor,
  } as CSSProperties;

  return (
    <aside
      className={`relative overflow-hidden rounded-[28px] border border-[color-mix(in_srgb,var(--bunji-cyan)_36%,white)] bg-[linear-gradient(145deg,rgba(255,255,255,0.99),rgba(238,250,251,0.95))] p-6 text-slate-950 shadow-[0_24px_56px_rgba(125,227,234,0.14)] ${minHeightClassName}`}
    >
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.22),transparent_55%)]" />
      <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(125,227,234,0.9),transparent)] opacity-80" />

      <div className="absolute inset-0 z-0 overflow-hidden">
        <div
          className="absolute left-1/2 top-1/2 h-[185%] w-[185%] -translate-x-1/2 -translate-y-1/2 rounded-full p-[1.5px]"
          style={{
            background: `conic-gradient(from 0deg, ${secondaryColor}00 0deg, ${secondaryColor}aa 48deg, ${accentColor}cc 98deg, ${primaryColor}cc 160deg, ${primaryColor}00 224deg, ${secondaryColor}cc 286deg, ${accentColor}aa 326deg, ${secondaryColor}00 360deg)`,
            animation: "record-preview-rotating-halo 6s linear infinite",
          }}
        >
          <div className="h-full w-full rounded-[999px] bg-transparent" />
        </div>
        <div
          className="absolute left-1/2 top-1/2 h-[165%] w-[165%] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
          style={{
            background: `conic-gradient(from 0deg, ${secondaryColor}00 0deg, ${secondaryColor}55 64deg, ${glowC} 116deg, ${primaryColor}88 172deg, ${primaryColor}00 236deg, ${secondaryColor}66 300deg, ${glowC} 336deg, ${primaryColor}44 360deg)`,
            animation: "record-preview-rotating-halo 8s linear infinite reverse",
          }}
        />
      </div>

      <div
        className="pointer-events-none absolute inset-[1px] z-10 rounded-[26px]"
        style={{
          background: `linear-gradient(135deg, ${glowA}, ${glowC} 48%, ${glowB})`,
          opacity: 0.34,
        }}
      />
      <div
        className="pointer-events-none absolute -left-16 top-8 h-40 w-40 rounded-full blur-3xl"
        style={{
          background: `radial-gradient(circle, ${glowA} 0%, transparent 72%)`,
          animation: "record-preview-glow-drift-a 9s ease-in-out infinite",
        }}
      />
      <div
        className="pointer-events-none absolute -right-20 bottom-4 h-44 w-44 rounded-full blur-3xl"
        style={{
          background: `radial-gradient(circle, ${glowB} 0%, transparent 72%)`,
          animation: "record-preview-glow-drift-b 11s ease-in-out infinite",
        }}
      />

      <div className="relative z-20 flex h-full min-h-[inherit] flex-col">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--bunji-primary)]">
          {eyebrow}
        </p>
        <h2 className="mt-4 text-2xl font-bold tracking-tight text-slate-950">
          {title}
        </h2>
        {description ? (
          <p className="mt-3 text-sm leading-6 text-slate-600">
            {description}
          </p>
        ) : null}

        <div className="grid flex-1 place-items-center py-10">
          <div className="flex min-h-[260px] w-full flex-col items-center justify-center rounded-[24px] bg-[#f5f7fe] p-6 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.78)] backdrop-blur-xl">
            <div
              className="record-fingerprint-spinner"
              aria-hidden="true"
              style={spinnerStyle}
            >
              {Array.from({ length: 9 }).map((_, index) => (
                <div key={index} className="spinner-ring" />
              ))}
            </div>
            <p className="mx-auto -mt-6 max-w-[280px] text-sm font-semibold leading-6 text-slate-950">
              {message}
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}

function mixWithWhite(hexColor: string, whiteRatio: number) {
  const normalized = normalizeHex(hexColor);

  if (!normalized) {
    return "rgba(248,250,252,0.9)";
  }

  const rgb = normalized.match(/[0-9a-f]{2}/gi)?.map((value) => parseInt(value, 16));

  if (!rgb || rgb.length !== 3) {
    return "rgba(248,250,252,0.9)";
  }

  const mixed = rgb.map((channel) =>
    Math.round(channel * (1 - whiteRatio) + 255 * whiteRatio),
  );

  return `rgb(${mixed[0]}, ${mixed[1]}, ${mixed[2]})`;
}

function normalizeHex(hexColor: string) {
  const value = hexColor.trim().replace("#", "");

  if (/^[0-9a-f]{3}$/i.test(value)) {
    return value
      .split("")
      .map((character) => `${character}${character}`)
      .join("");
  }

  if (/^[0-9a-f]{6}$/i.test(value)) {
    return value;
  }

  return "";
}
