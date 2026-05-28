"use client";

type EdwinSwitchProps = {
  ariaLabel: string;
  checked: boolean;
  className?: string;
  disabled?: boolean;
  onCheckedChange?: (checked: boolean) => void;
};

export default function EdwinSwitch({
  ariaLabel,
  checked,
  className = "",
  disabled = false,
  onCheckedChange,
}: EdwinSwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={ariaLabel}
      disabled={disabled}
      onClick={() => onCheckedChange?.(!checked)}
      className={`relative inline-flex h-7 w-12 shrink-0 items-center rounded-full border transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--bunji-cyan)] disabled:cursor-not-allowed disabled:opacity-50 ${
        checked
          ? "border-[color:color-mix(in_srgb,var(--bunji-primary-dark)_72%,white)] bg-[linear-gradient(135deg,var(--bunji-primary),color-mix(in_srgb,var(--bunji-primary-dark)_84%,var(--bunji-cyan)_16%))]"
          : "border-slate-300 bg-slate-200 dark:border-slate-700 dark:bg-slate-800"
      } ${className}`.trim()}
    >
      <span
        className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-[0_4px_12px_rgba(15,23,42,0.18)] transition ${
          checked ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </button>
  );
}
