type Props = {
  path: string;
  label: string;
  value?: string;
  className?: string;
  variant?: "default" | "landscape";
};

export const editableImageClass =
  "cursor-pointer outline outline-2 outline-dashed outline-[var(--bunji-primary,#6d5dfc)]/45 outline-offset-4 transition hover:bg-[var(--bunji-primary,#6d5dfc)]/10";

export default function EditableImageSlot({
  path,
  label,
  value = "",
  className = "",
  variant = "default",
}: Props) {
  const layoutClass =
    variant === "landscape"
      ? "aspect-video min-h-0 rounded-2xl p-5"
      : "min-h-[320px] rounded-3xl p-8 lg:min-h-[520px]";

  return (
    <div
      data-live-image-path={path}
      data-live-image-label={label}
      data-live-image-value={value}
      title="Click para agregar o reemplazar esta imagen"
      className={`${className} ${layoutClass} ${editableImageClass} flex cursor-pointer flex-col items-center justify-center gap-3 border border-dashed border-[var(--bunji-primary)]/40 bg-[linear-gradient(135deg,var(--landing-primary-lightest),var(--landing-secondary-lightest))] text-center text-[var(--landing-primary-darkest)] shadow-xl ring-1 ring-slate-200`}
    >
      <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white/80 text-2xl shadow-[0_10px_24px_rgba(15,23,42,0.08)]">
        +
      </span>
      <span className="text-sm font-bold uppercase tracking-[0.18em]">
        Agregar imagen
      </span>
      <span className="max-w-[260px] text-sm leading-6 text-slate-600">
        Pega una URL para cargar o reemplazar la imagen de esta seccion.
      </span>
    </div>
  );
}
