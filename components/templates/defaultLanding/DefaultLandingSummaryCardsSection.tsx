import type { LabelValueItem } from "@/lib/data";
import {
  Award,
  Banknote,
  BookOpen,
  CalendarDays,
  Clock,
  GraduationCap,
  Languages,
  MapPin,
} from "lucide-react";
import {
  landingCardClass,
  landingContainerClass,
  landingSectionSoftClass,
} from "./classes";

type Props = {
  items: LabelValueItem[];
  embedded?: boolean;
};

const metricIcons = {
  award: Award,
  banknote: Banknote,
  bookOpen: BookOpen,
  calendar: CalendarDays,
  clock: Clock,
  graduation: GraduationCap,
  language: Languages,
  mapPin: MapPin,
};

function normalizeLabel(label?: string) {
  return label
    ?.trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function getMetricIcon(label?: string) {
  const normalizedLabel = normalizeLabel(label);

  if (!normalizedLabel) return metricIcons.bookOpen;

  if (/duration|duracion|length|time|month|months|hora|horas/.test(normalizedLabel)) {
    return metricIcons.clock;
  }

  if (/date|schedule|jornada|calendar|start/.test(normalizedLabel)) {
    return metricIcons.calendar;
  }

  if (/price|tuition|cost|valor|inversion|aid/.test(normalizedLabel)) {
    return metricIcons.banknote;
  }

  if (/campus|location|ubicacion|sede/.test(normalizedLabel)) {
    return metricIcons.mapPin;
  }

  if (/language|idioma/.test(normalizedLabel)) {
    return metricIcons.language;
  }

  if (/credit|credits|snies|credential|certification|accreditation/.test(normalizedLabel)) {
    return metricIcons.award;
  }

  if (/program|degree|titulo|format|formato/.test(normalizedLabel)) {
    return metricIcons.graduation;
  }

  return metricIcons.bookOpen;
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
      className={`${landingCardClass} min-h-0 border-t-4 border-t-[var(--landing-secondary)] p-0 shadow-[0_10px_30px_rgba(15,23,42,0.08)] ${
        embedded
          ? "border-white/30 bg-white/92 backdrop-blur-xl"
          : "bg-[linear-gradient(180deg,#fff,var(--landing-primary-lightest))]"
      }`}
    >
      <div
        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-[var(--summary-grid-columns)]"
        style={
          {
            "--summary-grid-columns": desktopGridTemplateColumns,
          } as React.CSSProperties
        }
      >
        {validItems.map((item, index) => {
          const Icon = getMetricIcon(item.label);

          return (
            <div
              className="flex gap-4 border-[var(--landing-primary-light)] px-5 py-5 last:border-b-0 md:border-r md:[&:nth-child(2n)]:border-r-0 xl:[&:nth-child(2n)]:border-r xl:[&:nth-child(3n)]:border-r"
              style={{
                borderRightWidth:
                  index === validItems.length - 1 ||
                  (columnCount > 1 && (index + 1) % columnCount === 0)
                    ? 0
                    : undefined,
              }}
              key={`${item.label}-${index}`}
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--landing-secondary-lightest)] text-[var(--landing-secondary-darkest)] shadow-[0_10px_24px_rgba(15,23,42,0.08)]">
                <Icon className="h-5 w-5" />
              </span>
              <div>
                <p className="mb-1.5 text-[11px] font-bold uppercase tracking-[0.08em] text-[var(--landing-primary-dark)]">
                  {item.label}
                </p>
                <h3 className="m-0 text-lg font-bold leading-tight tracking-tight text-[var(--landing-primary-darkest)]">
                  {item.value}
                </h3>
              </div>
            </div>
          );
        })}
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
