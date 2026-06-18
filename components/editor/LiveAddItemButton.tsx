import { Plus } from "lucide-react";
import type { LandingLiveEditConfig } from "./LiveEditableText";

type Props = {
  path: string;
  liveEdit?: LandingLiveEditConfig;
  label?: string;
  className?: string;
};

export default function LiveAddItemButton({
  path,
  liveEdit,
  label = "Agregar item",
  className = "",
}: Props) {
  if (!liveEdit?.enabled || !liveEdit.onAddItem) {
    return null;
  }

  return (
    <button
      type="button"
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        liveEdit.onAddItem?.(path);
      }}
      className={`group inline-flex items-center gap-3 rounded-full border-2 border-dashed border-[var(--landing-primary-light,var(--bunji-primary,#6d5dfc))] bg-white/82 px-4 py-3 text-sm font-bold text-[var(--landing-primary-dark,var(--bunji-primary,#6d5dfc))] shadow-[0_12px_28px_rgba(15,23,42,0.08)] backdrop-blur-xl transition hover:-translate-y-0.5 hover:border-[var(--landing-primary,var(--bunji-primary,#6d5dfc))] hover:bg-[var(--landing-primary-lightest,#eef2ff)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--landing-primary,var(--bunji-primary,#6d5dfc))] ${className}`.trim()}
      aria-label={label}
      title={label}
    >
      <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-current">
        <Plus className="h-4 w-4" />
      </span>
      <span>{label}</span>
    </button>
  );
}
