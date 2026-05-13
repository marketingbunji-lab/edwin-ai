import type { LabelValueItem } from "@/lib/data";
import {
  landingCardClass,
  landingContainerClass,
  landingSectionSoftClass,
} from "./classes";

type Props = {
  items: LabelValueItem[];
  embedded?: boolean;
};

function normalizeLabel(label?: string) {
  return label
    ?.trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

export default function DefaultLandingSummaryCardsSection({
  items,
  embedded = false,
}: Props) {
  const validItems = items.filter((item) => {
    const label = normalizeLabel(item.label);

    if (!item.label?.trim() || !item.value?.trim()) {
      return false;
    }

    return (
      label !== "modality" &&
      label !== "modalidad" &&
      label !== "campus" &&
      label !== "campuses" &&
      label !== "accreditation" &&
      label !== "acreditacion" &&
      label !== "accreditations"
    );
  });

  if (!validItems.length) {
    return null;
  }

  const columnCount = Math.min(Math.max(validItems.length, 1), 3);
  const desktopGridTemplateColumns = `repeat(${columnCount}, minmax(0, 1fr))`;

  const card = (
    <article
      className={`${landingCardClass} min-h-0 border-t-4 border-t-[var(--landing-secondary)] bg-[linear-gradient(180deg,#fff,var(--landing-primary-lightest))] p-0 shadow-[0_18px_60px_rgba(17,24,39,0.12)]`}
    >
      <div
        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-[var(--summary-grid-columns)]"
        style={
          {
            "--summary-grid-columns": desktopGridTemplateColumns,
          } as React.CSSProperties
        }
      >
        {validItems.map((item, index) => (
          <div
            className="border-[var(--landing-primary-light)] px-5 py-4 last:border-b-0 md:border-r md:[&:nth-child(2n)]:border-r-0 xl:[&:nth-child(2n)]:border-r xl:[&:nth-child(3n)]:border-r"
            style={{
              borderRightWidth:
                index === validItems.length - 1 ||
                (columnCount > 1 && (index + 1) % columnCount === 0)
                  ? 0
                  : undefined,
            }}
            key={`${item.label}-${index}`}
          >
            <p className="mb-1.5 text-[11px] font-black uppercase tracking-[0.08em] text-[var(--landing-primary-dark)]">
              {item.label}
            </p>
            <h3 className="m-0 text-base font-bold leading-[1.35] text-[var(--landing-primary-darkest)]">
              {item.value}
            </h3>
          </div>
        ))}
      </div>
    </article>
  );

  if (embedded) {
    return card;
  }

  return (
    <section className={landingSectionSoftClass}>
      <div className={landingContainerClass}>{card}</div>
    </section>
  );
}
